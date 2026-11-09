---
name: x2-v5-console-harness
description: >-
  Use this skill whenever designing, porting, refactoring, or auditing UI/UX for the X2 Console or
  any target web platform using the Geist × PhysicalWorks v5 Design System. Enforces the Top-Status-Only
  & Left-Hover-Rail (64px ↔ 240px damped spring) navigation architecture, 1px Hairline Bento surfaces,
  and runs the automated verification harness.
---

# X2 Console v5 Design & Harness Engineering Skill

This skill defines the **end-to-end execution pipeline** and **automated verification harness** for building, refactoring, or porting interfaces to the **Geist × PhysicalWorks v5 Design System** (`src/x2_teleop_dashboard/DESIGN.md`).

---

## 1. Mandatory 5-Stage Execution Pipeline (Opus 5.5 / Agent Workflow)

Whenever a UI creation, redesign, or porting task is requested, execute these 5 stages in strict order:

### Stage 1: Spec Lock & Context Initialization
1. Read [`src/x2_teleop_dashboard/DESIGN.md`](../../../src/x2_teleop_dashboard/DESIGN.md) first. Treat its YAML frontmatter and Sections 1–8 as normative law.
2. Run the Impeccable context loader once per session if available:
   ```bash
   ~/.gemini/skills/impeccable/scripts/impeccable context --target src/x2_teleop_dashboard/console.html
   ```
3. If operating on port `8908`, read `src/x2_teleop_dashboard/RESTART_COORDINATION.md` before touching any running server process.

### Stage 2: Top-to-Left Navigation Migration (Structural Diet)
1. **Audit Top Bars (`.app-header`, `.context-bar`, `<header>`)**:
   - Keep **ONLY**:
     - Brand lockup (`.brand`: `26×26px` `.pw-v5-mark` + `17px` `.pw-v5-wordmark`)
     - Global telemetry/connection status trigger (`#connectButton` + `popover="auto"` `#connectionPanel`)
     - Read-only status summary strip (`.status-summary` in `.context-bar`)
     - Theme toggle (`#themeToggle`) and mobile drawer button (`#navToggle`, `<=699px` only)
   - **Remove & Migrate**: Any top-level route links, GNB menus, breadcrumb bars, or workspace switchers in the top area MUST be moved into `aside#navigation > .nav-scroll > nav#navItems` as `.nav-link` items (`18×18px` Lucide SVG + `<span class="nav-label">`).
2. **Source Icons Exclusively from Lucide (`https://lucide.dev/icons/`)**:
   - Every navigation item (`.nav-link`), toolbar button, and status indicator MUST use official [Lucide Icons (`https://lucide.dev/icons/`)](https://lucide.dev/icons/) geometry (`viewBox="0 0 24 24"`, `width: 18px; height: 18px`, `stroke: currentColor`, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`).
   - Register symbols in `svg.console-icon-sprite` as `<symbol id="x2-lucide-<name>" viewBox="0 0 24 24">` and reference via `<use href="#x2-lucide-<name>"/>`. Never use emojis or mixed icon packs.
3. **Convert Sub-Tabs to Local `.segmented` Controls**:
   - Replace full-width secondary tab bars with compact `.segmented` controls (`background: var(--v5-inset); padding: 3px; border-radius: 6px`) inside the relevant `.panel-head` or `.toolbar`.

### Stage 3: Token, Surface & Spring Physics Implementation
1. **Single Token Source of Truth (`--v5-*`)**:
   - Light: `--v5-canvas: #fafafa`, `--v5-surface: #ffffff`, `--v5-surface-raised: #f2f2f2`, `--v5-border-subtle: #e5e5e5`, `--v5-border: #8f8f8f`, `--v5-text: #171717`, `--v5-text-secondary: #666666`, `--v5-focus: #005bc4`.
   - Dark (`:root[data-theme="dark"]`): `--v5-canvas: #0a0a0a`, `--v5-surface: #0a0a0a`, `--v5-inset: #111111`, `--v5-surface-raised: #1a1a1a`, `--v5-border-subtle: #2e2e2e`, `--v5-border: #666666`, `--v5-text: #ededed`, `--v5-text-secondary: #a1a1a1`, `--v5-focus: #68a8ff`.
2. **Left Navigation Rail (`64px ↔ 240px`) 7-Point Contract**:
   - **Icon Axis Lock**: `8px` (`.nav-scroll` padding) + `15px` (`.nav-link` inline padding) + `18px` (SVG) + `15px` + `8px` = `64px`.
   - **Lockstep Push**: `body:has(.navigation:not([data-hover-dismissed]):hover, .navigation:not([data-hover-dismissed]) :focus-visible)` transitions `.navigation` (`width`) and `.app-body` (`margin-left`) simultaneously.
   - **Asymmetric Spring**: Open `330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)` (~2% overshoot) vs. Close `230ms cubic-bezier(.25, .75, .28, 1)` after `100ms` `--nav-close-delay`.
   - **Right Pointer Buffer**: `.navigation::after { left: 100%; width: 12px; }`.
   - **Pre-sized Label Stagger**: `.nav-label` (`max-width: calc(var(--nav-expanded-width) - 76px); white-space: nowrap`) and `.nav-footer` fade/translate in after `55ms` delay.
   - **Active Bar & Press Tension**: `[aria-current="page"]::before` (`3px × 22px`, `var(--v5-interactive)`), `:active svg { scale: .96 }`.
   - **`Escape` Dismissal**: Sets `data-hover-dismissed="true"` (`--nav-close-delay: 0ms`), cleared on `pointerenter` / `focusin`.
3. **1px Hairline Bento & Zero-Jitter Controls**:
   - Panels use `border: 1px solid var(--border); border-radius: 12px; box-shadow: none`. Inner grids use `gap: 1px; background: var(--border)`.
   - Primary buttons invert monochrome (`--v5-interactive` / `--v5-on-interactive`) with `transform: none; box-shadow: none` on hover/active.
   - Force `font-variant-numeric: tabular-nums` on all numeric/table elements.

### Stage 4: Automated Static & Unit Verification Gate
Run the deterministic harness verifier after every CSS/HTML/JS edit:
```bash
node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs
```
And run the locomotion/design unit test suite:
```bash
node --test src/x2_teleop_dashboard/tests/locomotion_game_design.test.mjs
```

### Stage 5: Visual & Accessibility Matrix Gate
Verify in headless Playwright across:
- **Themes**: `light` and `dark` (`html[data-theme="dark"]`)
- **Viewports**: `1440×900` (240px hover rail), `900×800` (200px hover rail), `390×844` (mobile drawer + focus trap), `320×640` at `200%` root font size (`html { font-size: 32px }`, zero horizontal overflow).
