#!/usr/bin/env node
/**
 * PreToolUse / PostToolUse Core-Freeze Hard Blocker (guard_core_freeze.mjs)
 *
 * Purpose:
 *   Physically prevents the AI agent (Opus 5.5 / Codex / Antigravity) from modifying,
 *   adding, or deleting backend logic, API endpoints, state stores, or core business files
 *   during a UI/Design System porting task.
 *
 * Behavior in Claude Code PreToolUse Hook:
 *   - Reads tool call JSON from stdin (if piped by Claude Code hook).
 *   - If target file matches a protected core/backend pattern, exits with code 2 (Hard Block).
 */

import { readFileSync } from 'node:fs';

const FORBIDDEN_PATH_PATTERNS = [
  /(^|\/)(server|backend|api|controllers|services|models|store| database|migrations| auth|middleware)\//i,
  /\.(py|go|rs|cpp|cc|c|h|hpp|java|kt|rb|php|sql|proto|launch\.py)$/i,
  /(^|\/)\.env(\..+)?$/i,
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|Cargo\.lock|poetry\.lock)$/i,
];

function checkFilePath(filePath) {
  if (!filePath) return null;
  const normalized = String(filePath).replace(/\\/g, '/');
  for (const pattern of FORBIDDEN_PATH_PATTERNS) {
    if (pattern.test(normalized)) {
      return `[CORE-FREEZE BLOCKED] File "${normalized}" matches protected core/backend pattern ${pattern}. UI harness strictly forbids modifying core logic, APIs, or backend files.`;
    }
  }
  return null;
}

// 1. Check CLI arguments if invoked directly: node guard_core_freeze.mjs <file1> <file2>
const cliFiles = process.argv.slice(2);
for (const file of cliFiles) {
  const err = checkFilePath(file);
  if (err) {
    console.error(err);
    process.exit(2);
  }
}

// 2. Check stdin payload if invoked as a Claude Code / Codex PreToolUse hook
if (!process.stdin.isTTY) {
  try {
    const raw = readFileSync(0, 'utf8').trim();
    if (raw) {
      const payload = JSON.parse(raw);
      const toolInput = payload.tool_input || payload.input || {};
      const candidatePath =
        toolInput.file_path ||
        toolInput.path ||
        toolInput.Path ||
        toolInput.target_file ||
        '';
      const err = checkFilePath(candidatePath);
      if (err) {
        console.error(err);
        process.exit(2); // Exit code 2 physically blocks the tool call in Claude Code
      }
    }
  } catch {
    // Ignore non-JSON stdin
  }
}

process.exit(0);
