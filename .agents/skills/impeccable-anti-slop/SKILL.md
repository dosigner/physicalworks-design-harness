---
name: impeccable-anti-slop
description: >-
  Use this skill when designing, auditing, refactoring, or polishing frontend UI/UX, CSS, and HTML
  to enforce high-craft design taste, prevent AI slop patterns (gradient clichés, nested cards,
  decorative side-tabs, flat typography, unverified states), and verify WCAG 2.2 accessibility
  and project DESIGN.md compliance.
---

# Impeccable Taste & Anti-Slop UI Skill

Apply this skill whenever creating or modifying frontend styles, layouts, or interactive states. Its goal is to eliminate generic AI-generated UI tells ("AI slop") and enforce intentional, high-signal interface craft.

## 1. Core Principles (Taste over Boilerplate)

1. **Respect the Incumbent Design System First**:
   - Before adding any token, border-radius, shadow, or font size, read the project's `DESIGN.md` (e.g., `src/x2_teleop_dashboard/DESIGN.md`) and `.impeccable/config.json`.
   - In **Operate / Technical Console** modes (such as Carbon White/g10), prioritize state clarity, provenance, validity, and tabular numeric precision over decorative chrome.
2. **Zero Decorative Slop**:
   - **No Purple/Blue SaaS Gradients**: Never introduce arbitrary linear/radial gradients on buttons, headers, or cards unless encoding a continuous data scale (e.g., Viridis/Cividis/time colorbar).
   - **No Card-in-Card Nesting**: Avoid putting bordered/shadowed cards inside other bordered cards. Use flat surface tokens (`--surface`, `--background`) and `1px solid var(--border)` dividers.
   - **No Decorative Side-Tabs (`side-tab`)**: Do not add thick colored `border-left` stripes to rounded cards for decoration. Reserve left-border indicators strictly for active navigation items (`aria-current="page"`), selected rows, or semantic operator notifications where documented.
   - **No Border-Accent on Rounded (`border-accent-on-rounded`)**: Never combine thick directional borders with `border-radius > 0`.

## 2. Typography & Information Hierarchy

- **Prevent `flat-type-hierarchy`**: Maintain clear scale separation between page titles (`1.75rem`), section headers (`1.25rem`), subheadings (`1rem` / `600`), body copy (`0.875rem`), and metadata/captions (`0.75rem`).
- **Tabular Numbers**: Always apply `font-variant-numeric: tabular-nums` (or `.number`) to timestamps, latencies, coordinates, counters, and metrics so digits never jitter during live polling or replay scrubbing.
- **Line Width & Wrapping**: Constrain prose paragraphs to `60ch–78ch` while allowing dense data tables and paths to use `overflow-wrap: anywhere` or intentional horizontal container scroll (`.table-scroll`).

## 3. Accessibility & Layout Resilience Checklist

1. **WCAG 2.2 AA Contrast (SC 1.4.3)**:
   - Normal text (`< 18pt` or `< 14pt bold`): minimum **4.5:1** contrast against its actual rendered background.
   - Large text (`>= 18pt` or `>= 14pt bold`) and active UI boundaries: minimum **3.0:1**.
   - Never rely on color alone to convey status; pair status colors with explicit text labels or dashed/solid geometry.
2. **200% Text Zoom & 320px Reflow (SC 1.4.4 / SC 1.4.10)**:
   - Avoid fixed pixel heights (`height: 48px`) on headers or toolbars that contain text; use `min-height` or `rem`-based sizing (`--app-header-height: 3rem`) so 200% root font scaling (`html { font-size: 32px }`) does not clip text.
   - Verify zero document-level horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) at `320px`, `390px`, `768px`, and `1440px`.
3. **Truthful Provenance & State**:
   - Never fabricate default `0` values for missing/blank inputs (`Number('') === 0` trap).
   - Separate **server receipt**, **browser decode**, and **physical hardware verification** in status copy.

## References

- Detailed anti-slop detector rules and remediation patterns: [detector-rules.md](./references/detector-rules.md)
