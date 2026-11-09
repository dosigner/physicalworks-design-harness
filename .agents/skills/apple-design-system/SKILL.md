---
name: apple-design-system
description: >-
  Use this skill when applying Apple Human Interface Guidelines (HIG) and Apple Design System
  principles—including optical typography, 8pt/4pt spatial grids, 44pt ergonomic hit targets,
  semantic surface layering, spring/reduced-motion discipline, and split-view inspector patterns—to
  web or native interfaces.
---

# Apple Design System & Human Interface Guidelines (HIG) Skill

Apply Apple Human Interface Guidelines (HIG) principles to elevate spatial clarity, physical ergonomics, typographic precision, and modality discipline. When working inside an existing project design system (such as Carbon in `DESIGN.md`), blend Apple's **ergonomic and interaction rigor** without violating the project's visual tokens.

## 1. Ergonomics & Direct Manipulation (Fitts's Law)

1. **Hit Targets & Pointer Forgiveness**:
   - Primary touch and pointer controls target **44×44 pt/px** (minimum **28–32px** for dense desktop toolbars with adequate spacing).
   - For small visual anchors (such as node ports, resize handles, or info badges), decouple the **visual glyph size** from the **interactive hit region** using an expanded transparent hit area (`::after` buffer) so low-precision pointers and zoomed-out views remain effortless to operate.
2. **Direct Manipulation with Equal Keyboard Access**:
   - Every gesture (canvas pan/zoom, port drag, scrub) must have a visible, first-class button or keyboard equivalent (`+`/`-`, `Fit`, `Arrow` keys, `Home`/`End`, `노드 관리` dialog).

## 2. Modality, Split Views & Progressive Disclosure

1. **Clear Mode Context**:
   - Segmented view switchers (`Editor` vs. `Executions`, `2D` vs. `3D`) must immediately adapt surrounding toolbars and sidebars to match the active mode. Hide tools that cannot be used in the current mode rather than leaving confusing dead chrome.
2. **Modal & Sheet Discipline**:
   - Modals (`role="dialog"`, `aria-modal="true"`) must trap `Tab` / `Shift+Tab` across all visible interactive children (including `<summary>` disclosures), close cleanly on `Escape` even if focus strayed, and restore focus to the exact trigger element on close.
3. **Scoped Progressive Disclosure**:
   - Use `<details>` / `<summary>` disclosures to keep primary views uncluttered, but:
     - Scope open/closed memory to the specific item instance (`${node.id}:${group}`), not globally across unrelated items.
     - Automatically expand collapsed sections if they contain a validation error or active blocking condition.

## 3. Typography, Rhythm & Motion

1. **Optical Hierarchy & Numeric Stability**:
   - Tight negative tracking (`-0.02em`) on large display titles (`>= 24px`); neutral tracking on body (`14px`); tabular numerals (`tabular-nums`) on all live counters and timelines.
2. **8pt / 4pt Spatial Grid**:
   - Align padding, gaps, and control heights to multiples of `4px` (`4, 8, 12, 16, 20, 24, 32, 48px`).
3. **Motion Restraint**:
   - Honor `@media (prefers-reduced-motion: reduce)` unconditionally by disabling smooth scroll, transitions, and animations.

## References

- Apple HIG ergonomic tokens and cross-framework mapping: [hig-tokens-and-ergonomics.md](./references/hig-tokens-and-ergonomics.md)
