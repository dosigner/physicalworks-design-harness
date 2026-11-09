#!/usr/bin/env node
/**
 * PhysicalWorks v5 design-harness verifier.
 *
 * Checks the TARGET project's files listed in harness.config.json (html, css, js, design).
 * HTML entries may be .html, .jsx or .tsx shell files. CSS is whitespace-normalised, so formatted
 * and minified stylesheets are checked the same way.
 *
 * Usage:
 *   node verify_v5_harness.mjs [--root <dir>]   manual or CI run, exit 1 on failure
 *   ... --hook                                   Claude Code / Codex / Gemini hook, exit 2 on failure so the agent sees it
 *   ... --plugin                                 Claude Code plugin hook, inert unless the project has harness.config.json
 */
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { CONFIG_NAME, CONFIG_TEMPLATE, loadConfig, readHookPayload, resolveRoot } from './harness_config.mjs';

const argv = process.argv.slice(2);
const hookMode = argv.includes('--hook') || argv.includes('--plugin');
const root = resolveRoot(argv);

const failures = [];
let waived = [];
const check = (ok, code, message) => { if (!ok) failures.push(`[FAIL:${code}] ${message}`); };

/** Lowercases hex, shortens #aabbcc to #abc, drops comments, whitespace, quotes in attribute selectors and leading zeros. */
function normCss(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/#([0-9a-fA-F]{6})\b/g, (m, h) => {
      const l = h.toLowerCase();
      return l[0] === l[1] && l[2] === l[3] && l[4] === l[5] ? `#${l[0]}${l[2]}${l[4]}` : `#${l}`;
    })
    .replace(/#([0-9a-fA-F]{3})\b/g, (m) => m.toLowerCase())
    .replace(/\[([\w-]+)=["']([^"']*)["']\]/g, '[$1=$2]')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>()])\s*/g, '$1')
    .replace(/(^|[^\w.-])0\.(\d)/g, '$1.$2')
    .replace(/;}/g, '}')
    .trim();
}

/** Flat list of { sel, decls } for every innermost block, including blocks nested in @media/@supports. */
function cssBlocks(css) {
  return [...css.matchAll(/([^{}]*)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), decls: m[2].split(';') }));
}

function run() {
  let loaded;
  try {
    loaded = loadConfig(root);
  } catch (err) {
    failures.push(`[FAIL:CONFIG] ${CONFIG_NAME} is not valid JSON: ${err.message}`);
    return;
  }
  const { config, exists } = loaded;
  waived = config.waive;
  if (!exists) {
    if (argv.includes('--plugin')) process.exit(0);
    failures.push(`[FAIL:CONFIG] ${CONFIG_NAME} not found at ${root}. Create it with the target project's shell files, for example:\n${JSON.stringify({ ...CONFIG_TEMPLATE, html: ['src/index.html'], css: ['src/styles/physicalworks_v5.css'], js: ['src/nav-hover-contract.js'] }, null, 2)}`);
    return;
  }
  for (const key of ['html', 'css', 'js']) {
    check(config[key].length > 0, 'CONFIG_TARGET', `${CONFIG_NAME} "${key}" is empty. List the target project's ${key} files; the harness never checks its own reference copy for you.`);
  }
  const read = (rel) => {
    const full = resolve(root, rel);
    if (!existsSync(full)) { failures.push(`[FAIL:IO] ${CONFIG_NAME} lists "${rel}", which does not exist.`); return ''; }
    return readFileSync(full, 'utf8');
  };
  const design = config.design ? read(config.design) : '';
  const html = config.html.map(read).join('\n');
  const rawCss = config.css.map(read).join('\n');
  const js = config.js.map(read).join('\n');
  if (failures.length) return;

  const css = normCss(rawCss);
  const blocks = cssBlocks(css);
  const n = (decl) => normCss(decl);
  /** True when a block whose selector contains every part declares every given declaration. */
  const has = (selParts, ...decls) => {
    const parts = [].concat(selParts).map(n);
    return blocks.some((b) => parts.every((p) => b.sel.includes(p)) && decls.map(n).every((d) => b.decls.includes(d)));
  };
  const anyDecl = (decl) => blocks.some((b) => b.decls.includes(n(decl)));

  // 1. DESIGN.md normative rules
  check(design.includes('navigation_architecture:') && design.includes('Top-to-Left Migration Rule'), 'DESIGN_NAV_RULE', `${config.design} must codify navigation_architecture and the Top-to-Left Migration Rule.`);
  check(design.includes('https://lucide.dev/icons/'), 'DESIGN_LUCIDE', `${config.design} must reference https://lucide.dev/icons/.`);
  check(!design.includes('backgroundColor: "#0f62fe"'), 'DESIGN_NO_LEGACY_CARBON', 'DESIGN.md must not contain legacy Carbon #0f62fe primary button tokens.');

  // 2. Top header = status only (works for HTML and JSX)
  const header = html.match(/<header\b[^>]*\bclass(?:Name)?=["'{][^>]*\bapp-header\b[^>]*>([\s\S]*?)<\/header>/);
  check(Boolean(header), 'HTML_APP_HEADER', 'Shell markup must contain <header class="app-header">.');
  if (header) {
    const inner = header[1];
    const links = [...inner.matchAll(/<(a|Link|NavLink)\b[^>]*>/g)].map((m) => m[0]);
    check(links.length === 1 && /\bbrand\b/.test(links[0]), 'HEADER_NO_NAV_LINKS', `.app-header must contain only the .brand link (found ${links.length} links). Move route links to aside#navigation.`);
    check(!/<nav\b|role=["']tablist["']|breadcrumb/i.test(inner), 'HEADER_NO_NAV_WIDGETS', '.app-header must not contain <nav>, tablists or breadcrumbs.');
    for (const id of config.header.requiredIds) {
      check(new RegExp(`\\bid=["'{]+${id}["'}]`).test(inner), 'HEADER_STATUS_CONTROLS', `.app-header must keep #${id}.`);
    }
  }
  check(/<aside\b[^>]*\bid=["'{]+navigation["'}]/.test(html) && /\bid=["'{]+navItems["'}]/.test(html), 'NAV_LEFT_RAIL', 'Shell must contain aside#navigation with #navItems.');

  // 3. Cascade: the first configured stylesheet loads after every stylesheet not listed in "css"
  const links = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/g)].map((m) => (m[0].match(/href=["']([^"']+)["']/) || [])[1] || '');
  if (links.length && config.css.length) {
    const own = new Set(config.css.map((p) => basename(p)));
    const coreIndex = links.findIndex((h) => basename(h) === basename(config.css[0]));
    const lastForeign = links.reduce((last, h, i) => (own.has(basename(h)) ? last : i), -1);
    check(coreIndex > lastForeign, 'CSS_CASCADE_LAST', `${basename(config.css[0])} must load after all other stylesheets (found: ${links.join(', ')}).`);
  }

  // 4. Dual-theme --v5-* tokens
  for (const token of ['--v5-canvas:#fafafa', '--v5-surface:#fff', '--v5-surface-raised:#f2f2f2', '--v5-border-subtle:#e5e5e5', '--v5-border:#8f8f8f', '--v5-text:#171717', '--v5-focus:#005bc4', '--v5-canvas:#0a0a0a', '--v5-surface-raised:#1a1a1a', '--v5-inset:#111', '--v5-border-subtle:#2e2e2e', '--v5-text:#ededed', '--v5-focus:#68a8ff']) {
    check(anyDecl(token), 'CSS_V5_TOKEN', `Missing token ${token}.`);
  }

  // 5. Left rail 7-point physics contract
  check(anyDecl('--nav-expanded-width:240px') && anyDecl('--nav-width:64px') && anyDecl('--nav-close-delay:100ms'), 'NAV_RAIL_VARS', 'Define --nav-expanded-width:240px, --nav-width:64px and --nav-close-delay:100ms.');
  check(css.includes('linear(0,.251,.618,.864,.98,1.016,1.019,1.012,1.005,1.001,1)'), 'NAV_DAMPED_SPRING', 'Include the sampled damped-spring linear(...) curve.');
  check(has('body:has(', '--nav-motion:330ms var(--nav-spring)'), 'NAV_OPEN_330', 'Open motion must be 330ms var(--nav-spring) inside body:has(...).');
  check(anyDecl('--nav-motion:230ms cubic-bezier(.25,.75,.28,1) var(--nav-close-delay)'), 'NAV_CLOSE_230', 'Close motion must be 230ms cubic-bezier(.25,.75,.28,1) after var(--nav-close-delay).');
  check(has('[data-hover-dismissed]', '--nav-close-delay:0ms'), 'NAV_ESCAPE_0MS', '[data-hover-dismissed] must set --nav-close-delay:0ms.');
  check(has('.navigation', 'width:var(--nav-width)', 'transition:width var(--nav-motion)') && has('.app-body', 'margin-left:var(--nav-width)', 'transition:margin-left var(--nav-motion)'), 'NAV_LOCKSTEP', '.navigation width and .app-body margin-left must share var(--nav-width) and var(--nav-motion).');
  check(has('.navigation::after', 'left:100%', 'width:12px'), 'NAV_HOVER_BUFFER', 'Keep the 12px right pointer buffer (.navigation::after).');
  check(has('.nav-scroll', 'padding:8px', 'overflow-x:hidden') && has('.nav-link', 'padding-inline:15px'), 'NAV_ICON_AXIS_MATH', 'Keep the 8 + 15 + 18 + 15 + 8 = 64px icon axis lock.');
  check(has('.nav-label', 'max-width:calc(var(--nav-expanded-width) - 76px)', 'white-space:nowrap'), 'NAV_PRE_SIZED_LABEL', 'Keep the pre-sized nowrap .nav-label.');
  check(has(['.nav-label', ':hover'], 'transition-delay:55ms'), 'NAV_STAGGER_55', 'Labels must fade in with a 55ms delay on open.');
  check(has('[aria-current=page]::before', 'width:3px'), 'NAV_ACTIVE_BAR', '[aria-current="page"]::before must draw the 3px active bar.');
  check(has(':active svg', 'scale:.96'), 'NAV_PRESS_SCALE', ':active svg must scale to .96.');

  // 6. Escape contract in JS
  check(/hoverDismissed\s*=\s*['"]true['"]|setAttribute\(\s*['"]data-hover-dismissed['"]/.test(js) && /delete\s+[\w$.]+\.dataset\.hoverDismissed|removeAttribute\(\s*['"]data-hover-dismissed['"]/.test(js), 'JS_HOVER_DISMISSED', 'JS must set data-hover-dismissed on Escape and clear it.');
  check(/['"]pointerenter['"]/.test(js) && /['"]focusin['"]/.test(js), 'JS_DISMISS_RESET', 'JS must clear data-hover-dismissed on pointerenter and focusin.');

  // 7. Lucide icons
  if (config.icons.mode === 'sprite') {
    const symbols = [...html.matchAll(/<symbol\b[^>]*>/g)].map((m) => m[0]);
    check(symbols.some((s) => s.includes(`id="${config.icons.prefix}`)), 'LUCIDE_ICON_SYSTEM', `Shell must define a Lucide sprite with <symbol id="${config.icons.prefix}*">.`);
    const bad = symbols.filter((s) => !s.includes(`id="${config.icons.prefix}`) || !s.includes('viewBox="0 0 24 24"'));
    check(bad.length === 0, 'LUCIDE_SYMBOL_SPEC', `Every <symbol> must use id="${config.icons.prefix}*" and viewBox="0 0 24 24" (${bad.length} do not).`);
  } else {
    check(/from\s+['"](lucide-react|lucide-vue-next|lucide-svelte|@lucide\/[\w-]+|lucide)['"]/.test(html + js), 'LUCIDE_PACKAGE', 'icons.mode "package" requires imports from an official Lucide package.');
  }
  check(has('.lucide-icon', 'width:18px', 'height:18px') && has('.lucide-icon', 'stroke-width:1.5'), 'LUCIDE_ICON_SIZING', '.lucide-icon must be 18x18px with stroke-width:1.5.');
  const emoji = (html + js).match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu);
  check(!emoji, 'NO_EMOJI_ICONS', `Emoji must not be used as icons (found ${emoji ? [...new Set(emoji)].join(' ') : ''}).`);

  // 8. Surfaces, anti-slop and accessibility
  check(has('.panel', 'box-shadow:none'), 'PANEL_NO_SHADOW', '.panel must use box-shadow:none.');
  check(blocks.some((b) => b.decls.includes('gap:1px') && b.decls.includes('background:var(--border)')), 'HAIRLINE_BENTO', 'At least one grid must use gap:1px with background:var(--border).');
  check(anyDecl('font-variant-numeric:tabular-nums'), 'A11Y_TABULAR_NUMS', 'Enforce font-variant-numeric:tabular-nums.');
  check(has(['.button.primary', ':hover'], 'transform:none', 'box-shadow:none'), 'ANTI_SLOP_PRIMARY_BUTTON', '.button.primary hover must keep transform:none and box-shadow:none.');
  check(css.includes('@media(prefers-reduced-motion:reduce)'), 'A11Y_REDUCED_MOTION', 'Provide @media (prefers-reduced-motion: reduce).');
  check(blocks.some((b) => b.sel.includes(':focus-visible') && b.decls.some((d) => d.startsWith('outline:2px'))), 'A11Y_FOCUS_RING', ':focus-visible must draw a 2px outline.');
  check(anyDecl('min-height:44px'), 'A11Y_TARGET_44', 'Interactive controls must declare min-height:44px.');

  // 9. Double Diamond: decisions the user approved must be visible in the target CSS.
  const ledgerFile = resolve(root, config.decisions);
  if (!existsSync(ledgerFile)) {
    check(!config.requireApprovedDesign, 'DESIGN_NOT_APPROVED', `${config.decisions} not found. Run the design-double-diamond skill: ask the user each round, show HTML options, record the approved Deliver round.`);
    return;
  }
  let ledger;
  try { ledger = JSON.parse(readFileSync(ledgerFile, 'utf8')); } catch (err) { failures.push(`[FAIL:DECISIONS] ${config.decisions} is not valid JSON: ${err.message}`); return; }
  const approved = (ledger.rounds || []).filter((r) => r.status === 'approved');
  check(!config.requireApprovedDesign || approved.some((r) => r.phase === 'deliver'), 'DESIGN_NOT_APPROVED', `${config.decisions} has no approved Deliver round yet. Continue the design-double-diamond rounds until the user approves the delivered design.`);
  // A later approved round replaces an earlier decision on the same selector and property.
  const latest = new Map();
  for (const r of approved) {
    for (const a of r.assertions || []) latest.set(`${a.selector || ''}|${n(a.decl).split(':')[0]}`, { ...a, round: r.round });
  }
  for (const a of latest.values()) {
    check(a.selector ? has(a.selector, a.decl) : anyDecl(a.decl), 'DECISION_NOT_APPLIED', `Round ${a.round} approved "${a.selector ? a.selector + ' ' : ''}${a.decl}", but the target CSS does not declare it.`);
  }
}

run();

// Codes in harness.config.json "waive" (human-edited only) are reported but do not fail, for example when an approved
// user preference intentionally replaces a v5 contract value.
const waivedFailures = failures.filter((f) => waived.some((code) => f.startsWith(`[FAIL:${code}]`)));
if (waivedFailures.length) console.error('Waived by harness.config.json:\n' + waivedFailures.join('\n'));
failures.splice(0, failures.length, ...failures.filter((f) => !waivedFailures.includes(f)));

if (failures.length === 0) {
  // Hook mode writes to stderr: Codex treats plain stdout on a successful Stop hook as invalid output.
  (hookMode ? console.error : console.log)(`✔ PhysicalWorks v5 Design Harness Verification PASSED (${root}).`);
  process.exit(0);
}
console.error('PhysicalWorks v5 Design Harness Verification FAILED:\n' + failures.join('\n'));
// Exit 2 feeds the failure back to the agent. Stop hooks already continuing get exit 1 to avoid an endless loop.
const payload = hookMode ? readHookPayload() : null;
process.exit(hookMode && !payload?.stop_hook_active ? 2 : 1);
