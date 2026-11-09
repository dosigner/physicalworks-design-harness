#!/usr/bin/env node
/**
 * Non-destructive installer for copying the harness into a target project.
 *
 *   node install.mjs <target-dir> [--html a.html,b.tsx] [--css v5.css] [--js nav.js] [--dry-run]
 *
 * Never overwrites an existing file. Existing CLAUDE.md / AGENTS.md get a marked block appended once.
 * Hook files (.claude/settings.json, .codex/hooks.json, .gemini/settings.json) are merged: other keys and
 * hooks stay, harness hooks are added only when the same command is not present yet.
 * Claude Code plugin users do not need this script; see README.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url));
const SKILL = '.agents/skills/x2-v5-console-harness';
const MARKER = '<!-- physicalworks-design-harness -->';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const target = args.find((a, i) => !a.startsWith('--') && !['--html', '--css', '--js'].includes(args[i - 1]));
const dryRun = args.includes('--dry-run');
if (!target) {
  console.error('Usage: node install.mjs <target-dir> [--html files] [--css files] [--js files] [--dry-run]');
  process.exit(1);
}
const T = resolve(target);
if (resolve(T) === resolve(SRC)) { console.error('Target is the harness repository itself.'); process.exit(1); }

const report = { copied: [], skipped: [], appended: [], merged: [], errors: [] };
const write = (file, data) => { if (!dryRun) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, data); } };

function copyNoClobber(from, to) {
  const src = join(SRC, from), dst = join(T, to);
  if (statSync(src).isDirectory()) {
    for (const name of readdirSync(src)) copyNoClobber(join(from, name), join(to, name));
    return;
  }
  if (existsSync(dst)) { report.skipped.push(to); return; }
  if (!dryRun) { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); }
  report.copied.push(to);
}

function appendOnce(from, to) {
  const dst = join(T, to), body = readFileSync(join(SRC, from), 'utf8');
  if (!existsSync(dst)) { write(dst, `${MARKER}\n${body.trim()}\n${MARKER}\n`); report.copied.push(to); return; }
  const current = readFileSync(dst, 'utf8');
  if (current.includes(MARKER)) { report.skipped.push(to); return; }
  write(dst, `${current.replace(/\s*$/, '\n')}\n${MARKER}\n${body.trim()}\n${MARKER}\n`);
  report.appended.push(to);
}

function mergeHooks(from, to) {
  const dst = join(T, to);
  const template = JSON.parse(readFileSync(join(SRC, from), 'utf8'));
  let current = {};
  if (existsSync(dst)) {
    try { current = JSON.parse(readFileSync(dst, 'utf8')); }
    catch (err) { report.errors.push(`${to}: invalid JSON, left untouched (${err.message})`); return; }
  }
  current.hooks ??= {};
  let added = 0;
  for (const [event, groups] of Object.entries(template.hooks)) {
    current.hooks[event] ??= [];
    const known = new Set(current.hooks[event].flatMap((g) => (g.hooks || []).map((h) => h.command)));
    for (const group of groups) {
      if (group.hooks.every((h) => known.has(h.command))) continue;
      current.hooks[event].push(group);
      added++;
    }
  }
  if (!added) { report.skipped.push(to); return; }
  write(dst, JSON.stringify(current, null, 2) + '\n');
  report.merged.push(`${to} (+${added} hook groups)`);
}

// 1. Skills (Codex/Gemini read .agents/skills, Claude Code reads .claude/skills), agents, references.
copyNoClobber('.agents/skills', '.agents/skills');
copyNoClobber('.agents/skills', '.claude/skills');
copyNoClobber('.claude/agents', '.claude/agents');
copyNoClobber('reference', `${SKILL}/reference`);
for (const doc of ['META_PROMPT.md', 'QA_PROMPT.md']) copyNoClobber(doc, `${SKILL}/${doc}`);
copyNoClobber('.impeccable/config.json', '.impeccable/config.json');

// 2. DESIGN.md: a target may already have its own design spec, so keep it and install ours beside the skill.
const designPath = existsSync(join(T, 'DESIGN.md')) ? `${SKILL}/DESIGN.md` : 'DESIGN.md';
copyNoClobber('DESIGN.md', designPath);

// 3. Agent entry points and hooks.
appendOnce('CLAUDE.md', 'CLAUDE.md');
appendOnce('AGENTS.md', 'AGENTS.md');
mergeHooks('.claude/settings.json', '.claude/settings.json');
mergeHooks('.codex/hooks.json', '.codex/hooks.json');
mergeHooks('.gemini/settings.json', '.gemini/settings.json');

// 4. harness.config.json: written once; afterwards only a human edits it (the guard blocks agent edits).
const configFile = join(T, 'harness.config.json');
if (existsSync(configFile)) report.skipped.push('harness.config.json');
else {
  const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
  const template = JSON.parse(readFileSync(join(SRC, 'harness.config.json'), 'utf8'));
  const config = { ...template, $comment: 'List the TARGET shell files. verify_v5_harness.mjs fails until html, css and js are set.', design: designPath, html: list(opt('html')), css: list(opt('css')), js: list(opt('js')), header: { requiredIds: ['themeToggle'] }, requireApprovedDesign: true };
  write(configFile, JSON.stringify(config, null, 2) + '\n');
  report.copied.push('harness.config.json');
}

for (const [key, items] of Object.entries(report)) {
  if (!items.length) continue;
  console.log(`${key} (${items.length})`);
  for (const item of key === 'skipped' || key === 'copied' ? items.slice(0, 12) : items) console.log(`  ${item}`);
  if ((key === 'skipped' || key === 'copied') && items.length > 12) console.log(`  ... ${items.length - 12} more`);
}
console.log(`${dryRun ? '[dry-run] ' : ''}Installed into ${relative(process.cwd(), T) || '.'}. Next: fill harness.config.json, then run node ${SKILL}/scripts/verify_v5_harness.mjs`);
process.exit(report.errors.length ? 1 : 0);
