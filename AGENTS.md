# UI & Design System Harness (Geist × PhysicalWorks v5)

When modifying or porting UI/UX, read `DESIGN.md` and `.agents/skills/x2-v5-console-harness/SKILL.md`. Enforce the Top-Status-Only & Left-Hover-Rail (`64px ↔ 240px` damped spring) architecture, `--v5-*` dual-theme tokens, 1px Hairline Bento surfaces, and official Lucide SVG icons (`https://lucide.dev/icons/`). Run `node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs` after UI changes to verify all architectural invariants.

Before and during any design change, run `.agents/skills/design-double-diamond/SKILL.md`: each round renders HTML options (`design_round.mjs render`), asks the user (AskUserQuestion, or a numbered list in chat when that tool is unavailable), and records the answer (`design_round.mjs record`). Run Discover, Define, Develop and Deliver, and repeat Develop and Deliver until the user approves. The gates read the target files from `harness.config.json`; only a human edits it after creation.
