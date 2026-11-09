#!/usr/bin/env node
/**
 * Core-Freeze hard blocker for Claude Code (PreToolUse), Codex (PreToolUse) and Gemini CLI (BeforeTool).
 *
 * Blocks (exit 2, reason on stderr) any tool call that would write to backend, API, state, router,
 * dependency-lock, secret or harness-control files. Exit 0 allows the call.
 *
 * Usage:
 *   hook mode : tool-call JSON on stdin
 *   CLI mode  : node guard_core_freeze.mjs [--root <dir>] <file> [file...]
 *   --plugin  : installed as a Claude Code plugin; do nothing unless the project has harness.config.json
 */
import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { loadConfig, readHookPayload, resolveRoot, CONFIG_NAME } from './harness_config.mjs';

const DEFAULT_PATTERNS = [
  // Backend, API clients, state and routing (frontend and backend layouts).
  /(^|\/)(server|backend|api|controllers|services|models|stores?|state|redux|router|database|db|migrations|auth|middleware|graphql)\//i,
  /\.(store|service|api|model|slice|reducer|controller|resolver)\.[cm]?[jt]sx?$/i,
  /\.(py|go|rs|cpp|cc|c|h|hpp|java|kt|rb|php|sql|proto)$/i,
  /(^|\/)\.env(\..+)?$/i,
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|Cargo\.lock|poetry\.lock|uv\.lock|go\.sum)$/i,
  // Harness self-protection: an agent must not disable its own gates.
  /(^|\/)\.claude\/settings(\.local)?\.json$/i,
  /(^|\/)\.codex\/(hooks\.json|config\.toml)$/i,
  /(^|\/)\.gemini\/settings\.json$/i,
  /(^|\/)\.(agents|claude)\/skills\/(x2-v5-console-harness|design-double-diamond)\/scripts\//i,
  /(^|\/)hooks\/hooks\.json$/i,
];

const WRITE_COMMANDS = new Set(['rm', 'mv', 'cp', 'truncate', 'touch', 'ln', 'install', 'unlink', 'rmdir', 'chmod', 'shred', 'tee']);
const IN_PLACE_COMMANDS = new Set(['sed', 'gsed', 'perl']);
const GIT_WRITE_SUBCOMMANDS = new Set(['checkout', 'restore', 'rm', 'mv']);

const argv = process.argv.slice(2);
const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--root');
const root = resolveRoot(argv);
const { config, exists: hasConfig } = loadConfig(root);
if (argv.includes('--plugin') && !hasConfig) process.exit(0); // plugin hooks are global: stay inert until a project opts in

const extraPatterns = config.protectedPatterns.map((p) => new RegExp(p, 'i'));
const allowPatterns = config.allowPatterns.map((p) => new RegExp(p, 'i'));

// Relative paths resolve against the tool's cwd (hook payload field), else this process's cwd.
let baseDir = process.cwd();

function toProjectPath(file) {
  const normalized = String(file).replace(/\\/g, '/').replace(/^['"]|['"]$/g, '');
  const abs = isAbsolute(normalized) ? normalized : resolve(baseDir, normalized);
  const rel = relative(root, abs).replace(/\\/g, '/');
  return rel.startsWith('..') ? abs : rel;
}

function blockReason(file) {
  const path = toProjectPath(file);
  // harness.config.json may be created once (first setup) but never edited or removed by an agent afterwards.
  if (/(^|\/)harness\.config\.json$/i.test(path) && existsSync(resolve(root, path))) {
    return `"${path}" is the harness configuration. Only a human edits it after creation.`;
  }
  if (allowPatterns.some((p) => p.test(path))) return null;
  // Also test path + "/" so directory operands without a trailing slash (rm -rf src/db) still match.
  const hit = [...DEFAULT_PATTERNS, ...extraPatterns].find((p) => p.test(path) || p.test(`${path}/`));
  return hit ? `"${path}" matches protected pattern ${hit}.` : null;
}

/** Paths named in an apply_patch envelope (Codex sends the patch body as tool_input.command). */
function patchTargets(text) {
  return [...String(text).matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$|^\*\*\* Move to: (.+)$/gm)].map((m) => (m[1] || m[2]).trim());
}

/**
 * Write targets in a shell command: redirections, tee, in-place sed/perl, rm/mv/cp/..., git checkout/restore.
 * shortcut: interpreter writes (node -e, python -c, git apply) are not detected; add a sandbox or
 * permission rule for those when the threat model needs it.
 */
function shellTargets(command) {
  const cmd = String(command);
  const targets = [];
  for (const m of cmd.matchAll(/(?:^|[^<>&\d])\d?>>?\|?\s*([^\s;&|<>()]+)/g)) {
    if (!/^(\/dev\/(null|stdout|stderr|tty)|&\d)$/.test(m[1])) targets.push(m[1]);
  }
  for (const segment of cmd.split(/\|\||&&|[;|\n]/)) {
    const words = segment.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/^['"]|['"]$/g, ''));
    while (words.length && (/^\w+=/.test(words[0]) || ['sudo', 'command', 'env', 'xargs'].includes(words[0]))) words.shift();
    if (!words.length) continue;
    const name = words[0].split('/').pop();
    const args = words.slice(1).filter((w) => !w.startsWith('-'));
    const flags = words.slice(1).filter((w) => w.startsWith('-'));
    if (WRITE_COMMANDS.has(name)) targets.push(...args);
    else if (IN_PLACE_COMMANDS.has(name) && flags.some((f) => /^-[a-z]*i|^--in-place/.test(f))) targets.push(...args);
    else if (name === 'git' && GIT_WRITE_SUBCOMMANDS.has(args[0])) targets.push(...args.slice(1));
  }
  return targets;
}

function payloadTargets(payload) {
  const input = payload.tool_input || payload.input || {};
  const targets = [input.file_path, input.path, input.notebook_path, input.target_file].filter(Boolean);
  for (const edit of Array.isArray(input.edits) ? input.edits : []) if (edit?.file_path) targets.push(edit.file_path);
  const text = input.command ?? input.patch;
  if (typeof text === 'string') {
    const isPatch = /^\*\*\* Begin Patch/m.test(text) || /apply_patch/i.test(String(payload.tool_name || ''));
    targets.push(...(isPatch ? patchTargets(text) : shellTargets(text)));
  }
  return targets;
}

const payload = positional.length ? null : readHookPayload();
if (payload?.cwd) baseDir = resolve(payload.cwd);
const files = payload ? payloadTargets(payload) : positional;

for (const file of files) {
  const reason = blockReason(file);
  if (reason) {
    console.error(`[CORE-FREEZE BLOCKED] ${reason} The UI harness forbids changing core logic, APIs, state, dependencies or harness gates. Edit presentation files only, or ask a human to extend ${CONFIG_NAME} allowPatterns.`);
    process.exit(2);
  }
}
process.exit(0);
