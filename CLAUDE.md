# CLAUDE.md — PhysicalWorks v5 Design System & Opus 5.5 Harness

## 0. User Preference First (Double Diamond Rounds)

Before and during every design change, run [`.agents/skills/design-double-diamond/SKILL.md`](.agents/skills/design-double-diamond/SKILL.md) (Claude Code also finds it in `.claude/skills/`):
- Each round: render HTML options with `design_round.mjs render`, ask the user with one AskUserQuestion call (every option has a `preview`), record the answer with `design_round.mjs record`.
- Run Discover → Define → Develop → Deliver. If the user rejects a Deliver round or asks for changes, run a new Develop and Deliver round. Do not finish until a Deliver round is approved.
- Approved decisions are CSS assertions; `verify_v5_harness.mjs` fails with `DECISION_NOT_APPLIED` until the target CSS matches them.
- Gates read the target files from `harness.config.json`. Only a human edits that file after it exists.

## 1. Authoritative Design System (`DESIGN.md`)

All frontend, dashboard, and cross-platform porting work MUST strictly follow [`DESIGN.md`](DESIGN.md):

1. **Navigation Architecture (Top = Status Only, Left Rail = All Navigation)**:
   - **Top Header (`.app-header`) & Context Bar (`.context-bar`)**: Strictly reserved for brand identity (`.brand`), live status indicators (for example a `#connectButton` status popover and a `.status-summary` strip; the exact IDs are `header.requiredIds` in `harness.config.json`), and theme toggle (`#themeToggle`). **Never place route links, GNB menus, or page switchers in top bars.**
   - **Left Hover-Reveal Rail (`aside#navigation`)**: All primary route and module navigation MUST reside in the left rail (`64px` collapsed icon rail ↔ `240px` expanded sidebar on hover/focus).
   - **Local View Switchers (`.segmented`)**: In-panel view toggles (`2D`/`3D`, `Editor`/`Executions`) MUST use compact `.segmented` controls inside `.panel-head` or `.toolbar`.
2. **Left Rail 7-Point Physics Contract**:
   - Icon center axis lock: `8px (.nav-scroll) + 15px (.nav-link) + 18px (SVG) + 15px + 8px = 64px`.
   - Zero-overlap lockstep push via `body:has(...)` on `.navigation` (`width`) and `.app-body` (`margin-left`).
   - Asymmetric spring: Open `330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)` (~2% overshoot) vs. Close `100ms` delay + `230ms cubic-bezier(.25, .75, .28, 1)`.
   - Right `12px` transparent pointer buffer (`.navigation::after`).
   - Pre-sized nowrap `.nav-label` & `.nav-footer` stagger (`55ms` delay on open).
   - Active left `3px × 22px` bar (`::before`) & `:active svg { scale: 0.96 }`.
   - `Escape` immediate collapse (`data-hover-dismissed="true"`, `0ms` delay), cleared on `pointerenter`/`focusin`.
3. **Zero-Chroma Surfaces, Lucide Icons & Anti-Slop**:
   - Use only `--v5-*` dual-theme tokens (`#fafafa`/`#ffffff`/`#f2f2f2` light, `#0a0a0a`/`#111111`/`#1a1a1a` dark).
   - Flat `.panel` (`box-shadow: none; border: 1px solid var(--border); border-radius: 12px`) + `gap: 1px; background: var(--border)` Hairline Bento grids.
   - Monochrome inverted `.button.primary` with `transform: none; box-shadow: none` on hover/active.
   - **Lucide Icons (`https://lucide.dev/icons/`)**: Source all UI and `.nav-link` icons from official Lucide geometry (`viewBox="0 0 24 24"`, `18×18px`, `stroke: currentColor`, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`) via `<symbol id="x2-lucide-*">`. Never use emojis or mixed icon sets.
   - Enforce `font-variant-numeric: tabular-nums` across all numeric and table elements.

---

## 2. Active Skills & Verification Pipeline

Load the appropriate skill before starting specialized work:
- **User Preference Rounds (Double Diamond)**: [`.agents/skills/design-double-diamond/SKILL.md`](.agents/skills/design-double-diamond/SKILL.md)
- **Design System & Left Rail Porting/Auditing**: [`.agents/skills/x2-v5-console-harness/SKILL.md`](.agents/skills/x2-v5-console-harness/SKILL.md)
- **Anti-Slop & WCAG 2.2 AA Gate**: [`.agents/skills/impeccable-anti-slop/SKILL.md`](.agents/skills/impeccable-anti-slop/SKILL.md)
- **Apple HIG Ergonomics & Modality**: [`.agents/skills/apple-design-system/SKILL.md`](.agents/skills/apple-design-system/SKILL.md)
- **Canvas, Node Flow & Timeline Replay Architecture**: [`.agents/skills/ui-ux-component-architecture/SKILL.md`](.agents/skills/ui-ux-component-architecture/SKILL.md)

### Mandatory Verification Command (Run After Every UI Change)
```bash
node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs
```
