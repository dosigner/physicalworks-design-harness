# PhysicalWorks v5 Design System & Opus 5.5 Harness (`physicalworks-design-harness`)

**Vercel Geist × PhysicalWorks v5 Zero-Chroma Console Theme**, **Left Hover-Reveal Rail (`64px ↔ 240px` Damped Spring)**, **Lucide SVG Icon System (`https://lucide.dev/icons/`)**, and **Automated Multi-Agent Harness Engineering** for Claude Code (Opus 5.5), Codex, and Antigravity.

---

## 1. Core Architectural Pillars

1. **Top = Status Only, Left Rail = Single Source of Navigation**:
   - **Top Header (`.app-header`) & Context Bar (`.context-bar`)**: Reserved strictly for brand identity (`.brand`), live connection/battery/SSH/camera status (`#connectButton` popover + `.status-summary`), and theme toggle (`#themeToggle`).
   - **Top-to-Left Migration Rule**: Any page/route navigation links or GNB menus in the top header MUST be removed from the top bar and consolidated into the left rail (`aside#navigation > #navItems`).
   - **Local View Switchers (`.segmented`)**: In-panel view toggles (`2D`/`3D`, `Editor`/`Executions`) reside inside `.panel-head` or `.toolbar` as compact `.segmented` controls.
2. **Left Navigation Rail (`64px ↔ 240px`) 7-Point Physics**:
   - **Icon Axis Lock**: `8px (.nav-scroll) + 15px (.nav-link) + 18px (SVG) + 15px + 8px = 64px` (icon center locked at `X = 32px` with zero horizontal shift during expansion).
   - **Zero-Overlap Lockstep**: `body:has(...)` drives `.navigation` (`width`) and `.app-body` (`margin-left`) on the exact same curve.
   - **Asymmetric Spring**: Open `330ms linear(0, .251, .618, .864, .98, 1.016, 1.019, 1.012, 1.005, 1.001, 1)` (~2% overshoot) vs. Close `100ms` delay + `230ms cubic-bezier(.25, .75, .28, 1)`.
   - **Right `12px` Pointer Buffer**: `.navigation::after` prevents edge hover jitter.
   - **Pre-sized Label Stagger**: `.nav-label` (`max-width: calc(var(--nav-expanded-width) - 76px); white-space: nowrap`) fades and translates in after a `55ms` delay.
   - **Active Left `3px` Bar & Press Scale**: `[aria-current="page"]::before` (`3px × 22px`, `var(--v5-interactive)`), `:active svg { scale: 0.96 }`.
   - **`Escape` Immediate Collapse**: Sets `data-hover-dismissed="true"` (`0ms` delay) and resets on `pointerenter` or `focusin`.
3. **Zero-Chroma 3-Tier Surfaces & 1px Hairline Bento**:
   - Light (`#fafafa` / `#ffffff` / `#f2f2f2`) & Dark (`#0a0a0a` / `#111111` / `#1a1a1a`) semantic `--v5-*` tokens.
   - Zero-shadow panels (`.panel { box-shadow: none; border: 1px solid var(--border); border-radius: 12px }`) with `gap: 1px; background: var(--border)` Hairline Bento grids.
   - Inverted monochrome `.button.primary` with `transform: none; box-shadow: none` on hover/active, and mandatory `font-variant-numeric: tabular-nums`.
4. **Official Lucide SVG Icon System (`https://lucide.dev/icons/`)**:
   - All navigation and control icons are sourced from [Lucide Icons](https://lucide.dev/icons/) (`viewBox="0 0 24 24"`, `18×18px`, `stroke: currentColor`, `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`) via inline `<symbol id="x2-lucide-*">` sprites.

---

## 2. Repository Layout

```text
physicalworks-design-harness/
├── DESIGN.md                                      # Normative Design System specification (YAML frontmatter + 8 sections)
├── CLAUDE.md                                      # Claude Code (Opus 5.5) harness instructions
├── AGENTS.md                                      # Codex / Antigravity / Cursor rules
├── .claude/settings.json                          # Auto-runs verify_v5_harness.mjs on PostToolUse & Stop
├── .codex/hooks.json                              # Codex lifecycle verification hooks
├── .gemini/settings.json                          # Gemini / Antigravity completion hooks
├── .impeccable/config.json                        # Impeccable anti-slop detector configuration
├── .agents/skills/
│   ├── x2-v5-console-harness/                     # Core 5-Stage Pipeline skill + verify_v5_harness.mjs
│   ├── impeccable-anti-slop/                      # Anti-slop & WCAG 2.2 AA verification skill
│   ├── apple-design-system/                       # 44px hit targets, focus traps, 4pt grid ergonomics
│   └── ui-ux-component-architecture/              # 2D/3D canvas, node editor, high-frequency polling stability
└── reference/                                     # Drop-in CSS / HTML / JS reference implementation
    ├── console.html                               # 3-Tier Shell + Lucide SVG sprite + Status header + Left Rail
    ├── physicalworks_v5.css                       # Authoritative v5 tokens, 1px Bento, 64px<->240px spring CSS
    ├── console.css                                # Base layout skeleton
    ├── locomotion.css                             # Game keycap WASD/QE pad & X2 brand gradient silhouette
    └── nav-hover-contract.js                      # Escape dismissal, mobile focus trap, 200% zoom offset sync
```

---

## 3. Quickstart: Applying to Any Target Project

### Step 1: Copy the Design Harness into Your Project
```bash
git clone https://github.com/dosigner/physicalworks-design-harness.git /tmp/pw-harness
cp /tmp/pw-harness/DESIGN.md /tmp/pw-harness/CLAUDE.md /tmp/pw-harness/AGENTS.md ./
cp -R /tmp/pw-harness/.agents /tmp/pw-harness/.claude /tmp/pw-harness/.codex /tmp/pw-harness/.gemini /tmp/pw-harness/.impeccable ./
```

### Step 2: Optional Global Ecosystem Skills (`npx skills`)
```bash
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
npx skills add vercel-labs/agent-skills@react-best-practices -g -y
npx skills add anthropics/skills@frontend-design -g -y
```

### Step 3: Run the Automated Harness Verifier
```bash
node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs
```

---

## 4. Opus 5.5 Porting Prompt (One-Shot Prompt for Target Apps)

When porting an existing React, Next.js, Vue, or Vanilla web app to this design system using **Claude Opus 5.5**, paste the following prompt:

```markdown
Read `DESIGN.md`, `CLAUDE.md`, and `.agents/skills/x2-v5-console-harness/SKILL.md` first.
Keep all business logic, API contracts, and state management intact, and port the entire UI to the PhysicalWorks v5 Design System:

1. **Top-Bar Diet & Left-Rail Consolidation**:
   - Keep ONLY Brand (`.brand`), Global Status/Connection trigger (`#connectButton`), and Theme Toggle (`#themeToggle`) in `.app-header`.
   - Move ALL page/route navigation links from the top header into the left `64px ↔ 240px` hover-reveal rail (`aside#navigation > .nav-scroll > nav#navItems`).
   - Convert any secondary page-level tab bars into compact `.segmented` controls inside `.panel-head` or `.toolbar`.
2. **Left Rail 7-Point Physics & Lucide Icons**:
   - Apply the exact `8 + 15 + 18 + 15 + 8 = 64px` icon center lock, `330ms linear(...)` damped spring open, `100ms` close delay + `230ms` close curve, `.navigation::after` `12px` pointer buffer, `.nav-label` pre-sized nowrap stagger (`55ms` delay), `[aria-current="page"]::before` `3px` bar, and `Escape` `data-hover-dismissed` JS contract.
   - Source every `.nav-link` and button icon from official Lucide Icons (`https://lucide.dev/icons/`, `viewBox="0 0 24 24"`, `18×18px`, `stroke-width: 1.5`, `currentColor`).
3. **Zero-Chroma Surfaces & 1px Hairline Bento**:
   - Declare `:root` and `:root[data-theme="dark"]` `--v5-*` tokens at the top of the global stylesheet.
   - Remove all card shadows (`box-shadow: none`), convert nested card grids to `gap: 1px; background: var(--border)` Hairline Bento grids, and apply `font-variant-numeric: tabular-nums` to all numbers/tables.
4. **Verify**:
   - Run `node .agents/skills/x2-v5-console-harness/scripts/verify_v5_harness.mjs` and ensure 0 failures before finishing.
```
