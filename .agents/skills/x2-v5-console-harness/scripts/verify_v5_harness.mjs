#!/usr/bin/env node
/**
 * Automated Design System & Architecture Harness Verifier
 * Works in both standalone (DESIGN.md + reference/*) and integrated (src/x2_teleop_dashboard/*) layouts.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../../..');

function pickPath(...candidates) {
  for (const rel of candidates) {
    const full = resolve(ROOT, rel);
    if (existsSync(full)) return full;
  }
  return resolve(ROOT, candidates[0]);
}

const paths = {
  design: pickPath('DESIGN.md', 'src/x2_teleop_dashboard/DESIGN.md'),
  html: pickPath('src/x2_teleop_dashboard/console.html', 'reference/console.html'),
  css: pickPath('src/x2_teleop_dashboard/physicalworks_v5.css', 'reference/physicalworks_v5.css'),
  js: pickPath('src/x2_teleop_dashboard/console.js', 'reference/nav-hover-contract.js'),
};

const failures = [];
function check(condition, code, message) {
  if (!condition) failures.push(`[FAIL:${code}] ${message}`);
}

try {
  const design = readFileSync(paths.design, 'utf8');
  const html = readFileSync(paths.html, 'utf8');
  const css = readFileSync(paths.css, 'utf8');
  const js = readFileSync(paths.js, 'utf8');

  // 1. DESIGN.md Normative Rules
  check(
    design.includes('navigation_architecture:') && design.includes('Top-to-Left Migration Rule'),
    'DESIGN_NAV_RULE',
    'DESIGN.md must codify navigation_architecture and the Top-to-Left Navigation Migration Rule.'
  );
  check(
    !design.includes('backgroundColor: "#0f62fe"'),
    'DESIGN_NO_LEGACY_CARBON',
    'DESIGN.md must not contain legacy Carbon #0f62fe primary button tokens.'
  );

  // 2. Top Header Purity (Only Brand, #connectButton status trigger, #themeToggle, #navToggle)
  const headerMatch = html.match(/<header class="app-header">([\s\S]*?)<\/header>/);
  check(Boolean(headerMatch), 'HTML_APP_HEADER', 'HTML must contain <header class="app-header">.');
  if (headerMatch) {
    const headerInner = headerMatch[1];
    const anchors = [...headerInner.matchAll(/<a\b[^>]*>/g)];
    check(
      anchors.length === 1 && anchors[0][0].includes('class="brand"'),
      'HEADER_NO_NAV_LINKS',
      `Top .app-header must only contain the single .brand anchor (found ${anchors.length} <a> tags). Move all route links to aside#navigation.`
    );
    check(
      headerInner.includes('id="connectButton"') && headerInner.includes('id="themeToggle"'),
      'HEADER_STATUS_CONTROLS',
      'Top .app-header must retain #connectButton (status popover trigger) and #themeToggle.'
    );
  }

  // 3. Stylesheet Cascade Order (physicalworks_v5.css must be loaded last)
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  check(
    stylesheets.at(-1)?.endsWith('physicalworks_v5.css'),
    'CSS_CASCADE_LAST',
    `physicalworks_v5.css must be the final stylesheet (found: ${stylesheets.join(', ')}).`
  );

  // 4. Dual-Theme --v5-* Tokens
  for (const token of [
    '--v5-canvas:#fafafa',
    '--v5-surface:#fff',
    '--v5-surface-raised:#f2f2f2',
    '--v5-border-subtle:#e5e5e5',
    '--v5-border:#8f8f8f',
    '--v5-text:#171717',
    '--v5-focus:#005bc4',
    '--v5-canvas:#0a0a0a',
    '--v5-surface-raised:#1a1a1a',
    '--v5-inset:#111',
    '--v5-border-subtle:#2e2e2e',
    '--v5-text:#ededed',
    '--v5-focus:#68a8ff',
  ]) {
    check(css.includes(token), 'CSS_V5_TOKEN', `physicalworks_v5.css missing required token: ${token}`);
  }

  // 5. Left Navigation Bar 64px <-> 240px Spring Physics & Geometry
  check(
    css.includes('--nav-expanded-width:240px') && css.includes('--nav-width:64px') && css.includes('--nav-close-delay:100ms'),
    'NAV_RAIL_VARS',
    'physicalworks_v5.css must define --nav-expanded-width:240px, --nav-width:64px, and --nav-close-delay:100ms.'
  );
  check(
    css.includes('linear(0,.251,.618,.864,.98,1.016,1.019,1.012,1.005,1.001,1)'),
    'NAV_DAMPED_SPRING',
    'physicalworks_v5.css must include the sampled damped spring linear(...) curve.'
  );
  check(
    css.includes('.navigation::after{content:"";position:absolute;inset-block:0;left:100%;width:12px}'),
    'NAV_HOVER_BUFFER',
    'physicalworks_v5.css must preserve the 12px right pointer buffer (.navigation::after).'
  );
  check(
    css.includes('.nav-scroll{padding:8px;overflow-x:hidden}') && css.includes('.navigation .nav-link{padding-inline:15px}'),
    'NAV_ICON_AXIS_MATH',
    'physicalworks_v5.css must preserve the 8px + 15px + 18px + 15px + 8px = 64px icon center lock.'
  );
  check(
    css.includes('max-width:calc(var(--nav-expanded-width) - 76px)'),
    'NAV_PRE_SIZED_LABEL',
    'physicalworks_v5.css must keep pre-sized nowrap .nav-label max-width to prevent text wrapping during spring expansion.'
  );

  // 6. JS Escape Dismissal Contract (data-hover-dismissed)
  check(
    js.includes('delete navSidebar.dataset.hoverDismissed') &&
      (js.includes("navSidebar.dataset.hoverDismissed='true'") || js.includes("navSidebar.dataset.hoverDismissed = 'true'")),
    'JS_HOVER_DISMISSED',
    'JS must maintain the Escape data-hover-dismissed set/reset interaction contract.'
  );

  // 7. Anti-Slop, Lucide Icon System & Accessibility Guardrails
  check(
    html.includes('class="console-icon-sprite"') && html.includes('<symbol id="x2-lucide-') && design.includes('https://lucide.dev/icons/'),
    'LUCIDE_ICON_SYSTEM',
    'HTML and DESIGN.md must enforce the Lucide (https://lucide.dev/icons/) inline SVG sprite system (#x2-lucide-*, viewBox="0 0 24 24").'
  );
  check(
    css.includes(':where(.lucide-icon),button svg,a svg{width:18px;height:18px}.lucide-icon,button svg,a svg{stroke-width:1.5}'),
    'LUCIDE_ICON_SIZING',
    'physicalworks_v5.css must enforce 18x18px size and stroke-width:1.5 on .lucide-icon, button svg, and a svg.'
  );
  check(
    css.includes('font-variant-numeric:tabular-nums'),
    'A11Y_TABULAR_NUMS',
    'physicalworks_v5.css must enforce font-variant-numeric:tabular-nums.'
  );
  check(
    css.includes('@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}'),
    'A11Y_REDUCED_MOTION',
    'physicalworks_v5.css must disable transitions and animations under prefers-reduced-motion: reduce.'
  );
  check(
    css.includes('.button.primary:not(:disabled):hover{background:var(--v5-interactive-hover);filter:none;transform:none;box-shadow:none}'),
    'ANTI_SLOP_PRIMARY_BUTTON',
    '.button.primary hover must stay monochrome with transform:none and box-shadow:none.'
  );
} catch (err) {
  failures.push(`[FAIL:IO] ${err.message}`);
}

if (failures.length > 0) {
  console.error('PhysicalWorks v5 Design Harness Verification FAILED:\n' + failures.join('\n'));
  process.exit(1);
} else {
  console.log('✔ PhysicalWorks v5 Design Harness Verification PASSED (All architectural, physics & Lucide icon invariants verified).');
}
