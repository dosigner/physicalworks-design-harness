// Regression tests for the harness gates and installer: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = join(REPO, '.agents/skills/x2-v5-console-harness/scripts');
const env = { ...process.env };
delete env.CLAUDE_PROJECT_DIR;
delete env.GEMINI_PROJECT_DIR;

const run = (script, args = [], { input, cwd = REPO, extraEnv = {} } = {}) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], { input, cwd, env: { ...env, ...extraEnv }, encoding: 'utf8' });

/** A target project that uses the reference shell under app/, with a harness.config.json. */
function makeTarget({ config = {}, mutate = {} } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'pw-harness-'));
  cpSync(join(REPO, 'reference'), join(dir, 'app'), { recursive: true });
  cpSync(join(REPO, 'DESIGN.md'), join(dir, 'DESIGN.md'));
  for (const [file, fn] of Object.entries(mutate)) writeFileSync(join(dir, file), fn(readFileSync(join(dir, file), 'utf8')));
  writeFileSync(join(dir, 'harness.config.json'), JSON.stringify({
    html: ['app/console.html'], css: ['app/physicalworks_v5.css'], js: ['app/nav-hover-contract.js'],
    header: { requiredIds: ['connectButton', 'themeToggle'] }, ...config,
  }));
  return dir;
}

const guard = (dir, payload, extraEnv) => run('guard_core_freeze.mjs', ['--root', dir], { input: JSON.stringify({ cwd: dir, ...payload }), extraEnv }).status;
const edit = (file_path) => ({ tool_name: 'Edit', tool_input: { file_path } });
const bash = (command) => ({ tool_name: 'Bash', tool_input: { command } });

test('guard blocks core, state, dependency and harness files', () => {
  const dir = makeTarget();
  for (const file of ['src/api/client.ts', 'src/app/database/x.js', 'src/auth/session.ts', 'src/stores/cart.ts', 'src/user.service.ts', 'server.py', '.env.local', 'package-lock.json', '.claude/settings.json', '.codex/hooks.json', 'harness.config.json', join(dir, 'src/router/index.js')]) {
    assert.equal(guard(dir, edit(file)), 2, file);
  }
});

test('guard allows presentation files', () => {
  const dir = makeTarget();
  for (const file of ['app/physicalworks_v5.css', 'src/components/Header.tsx', 'app/console.html', 'docs/notes.md']) {
    assert.equal(guard(dir, edit(file)), 0, file);
  }
});

test('guard inspects shell writes, Codex apply_patch and Gemini payloads', () => {
  const dir = makeTarget();
  assert.equal(guard(dir, bash("sed -i '' s/a/b/ src/server/app.js")), 2);
  assert.equal(guard(dir, bash('echo x > src/api/client.ts')), 2);
  assert.equal(guard(dir, bash('rm -rf src/db')), 2);
  assert.equal(guard(dir, bash('git checkout -- src/models/user.ts')), 2);
  assert.equal(guard(dir, bash('cat src/api/client.ts | head -20 > /dev/null')), 0);
  assert.equal(guard(dir, bash('npm test && echo done > out.log')), 0);
  const patch = '*** Begin Patch\n*** Update File: src/api/client.ts\n@@\n-a\n+b\n*** End Patch\n';
  assert.equal(guard(dir, { tool_name: 'apply_patch', tool_input: { command: patch } }), 2);
  assert.equal(guard(dir, { tool_name: 'apply_patch', tool_input: { command: patch.replace('src/api/client.ts', 'app/console.css') } }), 0);
  assert.equal(guard(dir, { tool_name: 'replace', tool_input: { file_path: 'src/api/x.ts' } }), 2);
});

test('guard honours allowPatterns, protectedPatterns and first-time config creation', () => {
  const dir = makeTarget({ config: { allowPatterns: ['^src/api/mocks/'], protectedPatterns: ['^src/hooks/'] } });
  assert.equal(guard(dir, edit('src/api/mocks/user.ts')), 0);
  assert.equal(guard(dir, edit('src/hooks/useCart.ts')), 2);
  const fresh = mkdtempSync(join(tmpdir(), 'pw-harness-fresh-'));
  assert.equal(guard(fresh, { tool_name: 'Write', tool_input: { file_path: join(fresh, 'harness.config.json') } }), 0);
});

test('plugin mode stays inert in projects without harness.config.json', () => {
  const fresh = mkdtempSync(join(tmpdir(), 'pw-harness-plugin-'));
  const r = spawnSync(process.execPath, [join(SCRIPTS, 'guard_core_freeze.mjs'), '--plugin'], { input: JSON.stringify(edit('src/api/x.ts')), env: { ...env, CLAUDE_PROJECT_DIR: fresh }, encoding: 'utf8' });
  assert.equal(r.status, 0);
  const v = spawnSync(process.execPath, [join(SCRIPTS, 'verify_v5_harness.mjs'), '--plugin'], { input: '{}', env: { ...env, CLAUDE_PROJECT_DIR: fresh }, encoding: 'utf8' });
  assert.equal(v.status, 0);
});

test('verify passes on the repository self-check and on a target using the reference shell', () => {
  assert.equal(run('verify_v5_harness.mjs').status, 0);
  assert.equal(run('verify_v5_harness.mjs', ['--root', makeTarget()]).status, 0);
});

test('verify checks the target, not the bundled reference', () => {
  const dir = makeTarget({ mutate: { 'app/console.html': (h) => h.replace('<button id="themeToggle"', '<a href="#map">Map</a><button id="themeToggle"') } });
  const r = run('verify_v5_harness.mjs', ['--root', dir]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /HEADER_NO_NAV_LINKS/);
});

test('verify catches motion-contract drift that the old string checks missed', () => {
  const dir = makeTarget({ mutate: { 'app/physicalworks_v5.css': (c) => c.replace('transition-delay:55ms', 'transition-delay:120ms').replace('--nav-motion:330ms', '--nav-motion:500ms') } });
  const r = run('verify_v5_harness.mjs', ['--root', dir]);
  assert.match(r.stderr, /NAV_STAGGER_55/);
  assert.match(r.stderr, /NAV_OPEN_330/);
});

test('verify accepts formatted (non-minified) CSS', () => {
  const pretty = (c) => c.replace(/;/g, ';\n    ').replace(/\{/g, ' {\n    ').replace(/,(?=\.\d)/g, ', ');
  assert.equal(run('verify_v5_harness.mjs', ['--root', makeTarget({ mutate: { 'app/physicalworks_v5.css': pretty } })]).status, 0);
});

test('verify exit codes: 1 manual, 2 hook, 1 when a Stop hook is already continuing, 1 without config', () => {
  const dir = makeTarget({ mutate: { 'app/physicalworks_v5.css': (c) => c.replace(/min-height:44px/g, 'min-height:40px') } });
  assert.equal(run('verify_v5_harness.mjs', ['--root', dir]).status, 1);
  assert.equal(run('verify_v5_harness.mjs', ['--root', dir, '--hook'], { input: '{}' }).status, 2);
  assert.equal(run('verify_v5_harness.mjs', ['--root', dir, '--hook'], { input: '{"stop_hook_active":true}' }).status, 1);
  const r = run('verify_v5_harness.mjs', ['--root', mkdtempSync(join(tmpdir(), 'pw-harness-none-'))]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /FAIL:CONFIG/);
});

test('installer never overwrites, merges hooks and is idempotent', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pw-harness-install-'));
  mkdirSync(join(dir, '.claude'));
  writeFileSync(join(dir, 'CLAUDE.md'), '# my project rules\n');
  writeFileSync(join(dir, 'DESIGN.md'), '# our own design system\n');
  writeFileSync(join(dir, '.claude/settings.json'), JSON.stringify({ permissions: { allow: ['Bash(npm test)'] }, hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'echo mine' }] }] } }));
  const install = () => spawnSync(process.execPath, [join(REPO, 'install.mjs'), dir, '--html', 'index.html'], { env, encoding: 'utf8' });

  assert.equal(install().status, 0);
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  assert.ok(claude.startsWith('# my project rules'));
  assert.match(claude, /physicalworks-design-harness/);
  assert.equal(readFileSync(join(dir, 'DESIGN.md'), 'utf8'), '# our own design system\n');
  assert.ok(existsSync(join(dir, '.agents/skills/x2-v5-console-harness/DESIGN.md')));
  assert.ok(existsSync(join(dir, '.claude/skills/x2-v5-console-harness/SKILL.md')));
  const settings = JSON.parse(readFileSync(join(dir, '.claude/settings.json'), 'utf8'));
  assert.deepEqual(settings.permissions, { allow: ['Bash(npm test)'] });
  assert.equal(settings.hooks.PreToolUse.length, 2);
  const config = JSON.parse(readFileSync(join(dir, 'harness.config.json'), 'utf8'));
  assert.deepEqual(config.html, ['index.html']);
  assert.equal(config.design, '.agents/skills/x2-v5-console-harness/DESIGN.md');

  const second = install();
  assert.equal(second.status, 0);
  assert.doesNotMatch(second.stdout, /appended|merged/);
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), claude);
});

const DD = join(REPO, '.agents/skills/design-double-diamond/scripts/design_round.mjs');
const dd = (dir, args) => spawnSync(process.execPath, [DD, ...args, '--root', dir], { env, encoding: 'utf8' });
function writeSpec(dir, round, phase, options) {
  mkdirSync(join(dir, 'design-rounds'), { recursive: true });
  const file = `design-rounds/round-${String(round).padStart(2, '0')}-${phase}.spec.json`;
  writeFileSync(join(dir, file), JSON.stringify({ round, phase, title: 't', question: 'q', base: 'app/console.html', options }));
  return file;
}
const OPTIONS = [
  { id: 'A', label: 'Mono', tokens: { '--v5-interactive': '#171717' }, darkTokens: { '--v5-interactive': '#ededed' } },
  { id: 'B', label: 'Brand <b>', tokens: { '--v5-interactive': '#1757a6' } },
];

test('design rounds render HTML previews with AskUserQuestion previews', () => {
  const dir = makeTarget();
  const r = dd(dir, ['render', '--spec', writeSpec(dir, 3, 'develop', OPTIONS)]);
  assert.equal(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout);
  assert.equal(out.options.length, 2);
  assert.match(out.options[0].preview, /--v5-interactive: #171717/);
  const page = readFileSync(join(dir, out.options[1].file), 'utf8');
  assert.match(page, /<style id="dd-option">:root\{--v5-interactive:#1757a6\}/);
  assert.match(page, /href="\.\.\/\.\.\/app\/physicalworks_v5\.css"/);
  assert.doesNotMatch(readFileSync(join(dir, out.index), 'utf8'), /Brand <b>/);
  assert.equal(dd(dir, ['render', '--spec', writeSpec(dir, 4, 'deliver', OPTIONS.slice(0, 1))]).status, 1);
});

test('approved decisions are enforced, later rounds win, approval can be required, codes can be waived', () => {
  const dir = makeTarget({ config: { requireApprovedDesign: true } });
  const verify = () => run('verify_v5_harness.mjs', ['--root', dir]);
  assert.match(verify().stderr, /DESIGN_NOT_APPROVED/);

  assert.equal(dd(dir, ['record', '--spec', writeSpec(dir, 1, 'discover', OPTIONS), '--answer', 'dense data tables', '--status', 'answered']).status, 0);
  assert.match(verify().stderr, /DESIGN_NOT_APPROVED/);

  // The user approves brand blue, which the reference CSS does not declare yet.
  assert.equal(dd(dir, ['record', '--spec', writeSpec(dir, 4, 'deliver', OPTIONS), '--answer', 'B', '--status', 'approved']).status, 0);
  const pending = verify();
  assert.equal(pending.status, 1);
  assert.match(pending.stderr, /DECISION_NOT_APPLIED.*--v5-interactive:#1757a6/);
  assert.doesNotMatch(pending.stderr, /DESIGN_NOT_APPROVED/);

  // A later approved round (A, the reference values) replaces the earlier decision on the same property.
  assert.equal(dd(dir, ['record', '--spec', writeSpec(dir, 6, 'deliver', OPTIONS), '--answer', 'A', '--status', 'approved']).status, 0);
  const css = readFileSync(join(dir, 'app/physicalworks_v5.css'), 'utf8');
  writeFileSync(join(dir, 'app/physicalworks_v5.css'), `${css}\n:root{--v5-interactive:#171717}:root[data-theme="dark"]{--v5-interactive:#ededed}\n`);
  assert.equal(verify().status, 0, verify().stderr);

  assert.equal(dd(dir, ['record', '--spec', writeSpec(dir, 7, 'deliver', OPTIONS), '--answer', 'C', '--status', 'approved']).status, 1);
  const waivedDir = makeTarget({ config: { requireApprovedDesign: true, waive: ['DESIGN_NOT_APPROVED'] } });
  assert.equal(run('verify_v5_harness.mjs', ['--root', waivedDir]).status, 0);
});
