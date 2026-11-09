#!/usr/bin/env node
/**
 * Double Diamond design rounds: HTML option previews and the decision ledger.
 *
 *   node design_round.mjs render --spec <round-spec.json> [--root <dir>]
 *       Writes design-rounds/round-NN-<phase>/option-<id>.html (light and dark via ?theme=dark) and index.html,
 *       then prints JSON with each option's file and an AskUserQuestion-ready preview string.
 *   node design_round.mjs record --spec <round-spec.json> --answer <option id or free text> --status <answered|approved|rejected> [--notes "..."]
 *       Appends the round to the ledger (harness.config.json "decisions", default design-decisions.json).
 *       An approved option's tokens become CSS assertions that verify_v5_harness.mjs enforces.
 *
 * Round spec: { "round": 3, "phase": "develop", "title": "...", "question": "...", "base": "optional static shell .html",
 *   "options": [{ "id": "A", "label": "...", "description": "...", "tokens": { "--v5-interactive": "#171717" },
 *                 "darkTokens": { ... }, "css": "optional extra rules", "assertions": [{ "selector": ".panel", "decl": "border-radius:12px" }] }] }
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PHASES = ['discover', 'define', 'develop', 'deliver'];
const argv = process.argv.slice(2);
const [command] = argv;
const opt = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const root = resolve(opt('root') || process.env.CLAUDE_PROJECT_DIR || process.cwd());
const fail = (message) => { console.error(`[design_round] ${message}`); process.exit(1); };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad = (n) => String(n).padStart(2, '0');

function loadSpec() {
  const specPath = opt('spec');
  if (!specPath) fail('--spec <round-spec.json> is required.');
  const spec = JSON.parse(readFileSync(resolve(root, specPath), 'utf8'));
  if (!Number.isInteger(spec.round) || spec.round < 1) fail('spec.round must be a positive integer.');
  if (!PHASES.includes(spec.phase)) fail(`spec.phase must be one of ${PHASES.join(', ')}.`);
  if (!Array.isArray(spec.options) || spec.options.length < 2 || spec.options.length > 4) fail('spec.options must hold 2-4 options (AskUserQuestion limit).');
  const ids = new Set();
  for (const o of spec.options) {
    if (!o.id || !o.label) fail('every option needs id and label.');
    if (ids.has(o.id)) fail(`duplicate option id ${o.id}.`);
    ids.add(o.id);
    for (const [k, v] of Object.entries({ ...o.tokens, ...o.darkTokens })) {
      if (!k.startsWith('--') || /[;{}<>]/.test(String(v))) fail(`option ${o.id}: token ${k} must be a custom property with a plain value.`);
    }
  }
  return spec;
}

function baseShell(spec) {
  const candidates = [spec.base, '.agents/skills/x2-v5-console-harness/reference/console.html', '.claude/skills/x2-v5-console-harness/reference/console.html', 'reference/console.html']
    .filter(Boolean).map((p) => resolve(root, p));
  candidates.push(resolve(HERE, '../../x2-v5-console-harness/reference/console.html'), resolve(HERE, '../../../../reference/console.html'));
  const found = candidates.find((p) => existsSync(p));
  if (!found) fail('no static shell found. Set spec.base to an .html file.');
  return found;
}

const declBlock = (tokens) => Object.entries(tokens || {}).map(([k, v]) => `${k}:${v}`).join(';');

function optionPage(shellPath, outDir, spec, o) {
  let html = readFileSync(shellPath, 'utf8');
  const rel = relative(outDir, dirname(shellPath)).replace(/\\/g, '/') || '.';
  // Re-point relative assets (./x.css, x.js) at the shell's directory.
  html = html.replace(/\b(href|src)="(?!https?:|data:|#|\/)(?:\.\/)?([^"]+)"/g, (m, attr, p) => `${attr}="${rel}/${p}"`);
  const style = `<style id="dd-option">:root{${declBlock(o.tokens)}}:root[data-theme="dark"]{${declBlock(o.darkTokens)}}${o.css || ''}</style>`;
  const theme = `<script>document.documentElement.dataset.theme=new URLSearchParams(location.search).get('theme')==='dark'?'dark':'light'</script>`;
  const meta = `<meta name="dd-round" content="${spec.round}-${spec.phase}-${esc(o.id)}">`;
  return html.replace('</head>', `  ${meta}\n  ${style}\n  ${theme}\n</head>`);
}

function previewText(o) {
  const lines = [`${o.id}. ${o.label}`];
  if (o.description) lines.push(o.description);
  for (const [k, v] of Object.entries(o.tokens || {})) lines.push(`${k}: ${v}`);
  for (const [k, v] of Object.entries(o.darkTokens || {})) lines.push(`dark ${k}: ${v}`);
  return lines.join('\n');
}

function render() {
  const spec = loadSpec();
  const shell = baseShell(spec);
  const outDir = resolve(root, 'design-rounds', `round-${pad(spec.round)}-${spec.phase}`);
  mkdirSync(outDir, { recursive: true });
  const options = spec.options.map((o) => {
    const file = join(outDir, `option-${o.id}.html`);
    writeFileSync(file, optionPage(shell, outDir, spec, o));
    return { id: o.id, label: o.label, file: relative(root, file), preview: previewText(o) };
  });
  const cards = spec.options.map((o) => `
    <section class="dd-card">
      <header><h2>${esc(o.id)}. ${esc(o.label)}</h2><p>${esc(o.description)}</p></header>
      <div class="dd-frames">
        <figure><figcaption>Light</figcaption><iframe src="option-${esc(o.id)}.html" title="${esc(o.label)} light" loading="lazy"></iframe></figure>
        <figure><figcaption>Dark</figcaption><iframe src="option-${esc(o.id)}.html?theme=dark" title="${esc(o.label)} dark" loading="lazy"></iframe></figure>
      </div>
      <table><tbody>${Object.entries({ ...o.tokens }).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}${Object.entries({ ...o.darkTokens }).map(([k, v]) => `<tr><th>dark ${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    </section>`).join('');
  const index = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round ${spec.round} ${esc(spec.phase)}: ${esc(spec.title)}</title>
<style>
  body{margin:0;padding:32px;background:#fafafa;color:#171717;font:14px/1.5 system-ui,sans-serif;font-variant-numeric:tabular-nums}
  h1{font-size:20px;font-weight:500;margin:0 0 4px}.dd-question{color:#666;margin:0 0 24px}
  .dd-grid{display:grid;gap:1px;background:#e5e5e5;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden}
  .dd-card{background:#fff;padding:20px 24px;display:grid;gap:12px}.dd-card h2{font-size:16px;font-weight:500;margin:0}.dd-card p{margin:4px 0 0;color:#666}
  .dd-frames{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:12px}
  figure{margin:0}figcaption{font-size:12px;color:#666;margin-bottom:4px}
  iframe{width:100%;height:520px;border:1px solid #e5e5e5;border-radius:8px;background:#fff}
  table{border-collapse:collapse;font-size:12px}th,td{text-align:left;padding:4px 12px 4px 0;font-weight:400}th{color:#666}
</style></head>
<body>
  <h1>Round ${spec.round} / ${esc(spec.phase)}: ${esc(spec.title)}</h1>
  <p class="dd-question">${esc(spec.question)} 정적 서버(예: <code>npx serve .</code>)로 열면 레일 Escape와 테마 스크립트까지 동작합니다.</p>
  <div class="dd-grid">${cards}
  </div>
</body></html>
`;
  writeFileSync(join(outDir, 'index.html'), index);
  console.log(JSON.stringify({ round: spec.round, phase: spec.phase, index: relative(root, join(outDir, 'index.html')), options }, null, 2));
}

function ledgerPath() {
  const configFile = resolve(root, 'harness.config.json');
  const config = existsSync(configFile) ? JSON.parse(readFileSync(configFile, 'utf8')) : {};
  return resolve(root, config.decisions || 'design-decisions.json');
}

function record() {
  const spec = loadSpec();
  const answer = opt('answer');
  const status = opt('status');
  if (!answer) fail('--answer is required (option id or the user\'s free-text answer).');
  if (!['answered', 'approved', 'rejected'].includes(status)) fail('--status must be answered, approved or rejected.');
  const chosen = spec.options.find((o) => o.id === answer);
  if (status === 'approved' && !chosen) fail('approved rounds must name one of the option ids.');
  const assertions = chosen ? [
    ...Object.entries(chosen.tokens || {}).map(([k, v]) => ({ decl: `${k}:${v}` })),
    ...Object.entries(chosen.darkTokens || {}).map(([k, v]) => ({ selector: '[data-theme=dark]', decl: `${k}:${v}` })),
    ...(chosen.assertions || []),
  ] : [];
  const file = ledgerPath();
  const ledger = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { version: 1, rounds: [] };
  ledger.rounds.push({
    round: spec.round, phase: spec.phase, title: spec.title, question: spec.question,
    options: spec.options.map((o) => ({ id: o.id, label: o.label })),
    answer, status, notes: opt('notes') || '',
    html: `design-rounds/round-${pad(spec.round)}-${spec.phase}/index.html`,
    assertions: status === 'approved' ? assertions : [],
    recordedAt: new Date().toISOString(),
  });
  writeFileSync(file, JSON.stringify(ledger, null, 2) + '\n');
  console.log(`[design_round] recorded round ${spec.round} (${spec.phase}, ${status}) in ${relative(root, file)}${status === 'approved' ? ` with ${assertions.length} assertions` : ''}.`);
}

if (command === 'render') render();
else if (command === 'record') record();
else fail('usage: design_round.mjs render|record --spec <round-spec.json> [...]');
