// Shared project-root and harness.config.json resolution for guard_core_freeze.mjs and verify_v5_harness.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CONFIG_NAME = 'harness.config.json';

export const CONFIG_TEMPLATE = {
  design: 'DESIGN.md',
  html: [],
  css: [],
  js: [],
  header: { requiredIds: ['themeToggle'] },
  icons: { mode: 'sprite', prefix: 'x2-lucide-' },
  decisions: 'design-decisions.json',
  requireApprovedDesign: false,
  waive: [],
  protectedPatterns: [],
  allowPatterns: [],
};

function findUp(start) {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(resolve(dir, CONFIG_NAME))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** Root order: --root <dir>, CLAUDE_PROJECT_DIR, GEMINI_PROJECT_DIR, nearest harness.config.json above cwd, then above this script. */
export function resolveRoot(argv = process.argv.slice(2)) {
  const i = argv.indexOf('--root');
  if (i >= 0 && argv[i + 1]) return resolve(argv[i + 1]);
  for (const key of ['CLAUDE_PROJECT_DIR', 'GEMINI_PROJECT_DIR']) {
    if (process.env[key]) return resolve(process.env[key]);
  }
  return findUp(process.cwd()) || findUp(dirname(fileURLToPath(import.meta.url))) || process.cwd();
}

/** Returns { root, config, configPath, exists }. Throws on invalid JSON so a broken config never passes silently. */
export function loadConfig(root) {
  const configPath = resolve(root, CONFIG_NAME);
  if (!existsSync(configPath)) return { root, configPath, exists: false, config: { ...CONFIG_TEMPLATE } };
  const raw = JSON.parse(readFileSync(configPath, 'utf8'));
  const config = { ...CONFIG_TEMPLATE, ...raw };
  config.header = { ...CONFIG_TEMPLATE.header, ...(raw.header || {}) };
  config.icons = { ...CONFIG_TEMPLATE.icons, ...(raw.icons || {}) };
  for (const key of ['html', 'css', 'js', 'protectedPatterns', 'allowPatterns', 'waive']) {
    if (typeof config[key] === 'string') config[key] = [config[key]];
    if (!Array.isArray(config[key])) config[key] = [];
  }
  return { root, configPath, exists: true, config };
}

/** Reads stdin JSON when stdin is piped (hook mode). Returns null for a TTY, empty input, or non-JSON input. */
export function readHookPayload() {
  if (process.stdin.isTTY) return null;
  try {
    const raw = readFileSync(0, 'utf8').trim();
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
