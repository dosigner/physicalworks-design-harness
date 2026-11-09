---
name: ui-ux-component-architecture
description: >-
  Use this skill when architecting or debugging interactive GUI components such as node/workflow
  editors (n8n, React Flow), spatial 2D/3D canvases (Three.js, Canvas 2D), high-frequency timeline
  replay scrubbers (Foxglove, Perfetto), modals, tabs, and asynchronous state machines.
---

# UI/UX & GUI Component Architecture Skill

Use this skill to design, audit, and implement complex interactive GUI components with strict state isolation, keyboard/focus integrity, and zero-jank rendering performance.

## 1. Mode-Gated Workbenches (Editor vs. Executions / Inspection)

When a component shares a canvas between **Authoring (`Editor`)** and **Observability (`Executions` / `Replay`)**:
1. **Strict Mode Separation**:
   - Switching to `Executions` / `Inspection` mode must automatically close authoring drawers/palettes (`closePalette()`) and hide or disable structural mutation triggers (`Add Node`, `Search Nodes`, inline `+` next-node buttons, port connection dragging).
   - Never leave floating authoring palettes open over an execution inspection view.
2. **State Isolation Per Node vs. Per View**:
   - Key inspector accordion/disclosure states by composite key (`${node.id}:${sectionName}`) rather than global section name so independent nodes do not leak UI state into one another.

## 2. Node Canvas & Spatial Viewport Ergonomics

1. **Zoom-Invariant Hit Targets**:
   - When a canvas scales via `transform: scale(var(--zoom))`, interactive handles/ports inside the scaled plane shrink proportionally on screen.
   - Maintain a minimum **24×24 CSS px** (ideally **28–44px**) effective screen hit area at low zoom (`5%–50%`) using inverse-scale hit buffers (`calc(28px / var(--flow-zoom, 1))` clamped to avoid neighbor overlap) alongside a fixed-size toolbar manager (`노드 관리`).
2. **2D / 3D Visual Parity**:
   - Semantic trajectory states (`normal`, `candidate`, `gap`) must use consistent visual encodings across 2D Canvas and 3D WebGL.
   - In Three.js, dashed `gap` segments require `THREE.LineDashedMaterial` **plus** an explicit `line.computeLineDistances()` call whenever geometry is built or updated.
3. **Boundary-Preserving Decimation**:
   - When downsampling large point clouds or multi-segment trajectories by stride, always pin both the **first (`0`)** and **last (`length - 1`)** items (and axis extrema) so start/end markers never drift.

## 3. High-Frequency Replay & Polling Performance

1. **Two-Tier Timeline Memoization**:
   - Separate **frame-index-dependent derivations** (FSM state, pose segments, cumulative path length at `frame.at_ms`) from **continuous playhead-time derivations** (`atMs` TTL expiration, event cursor).
   - Cache the last derived frame result in a single-slot cursor (`lastFrameIndex === index`) to avoid O(N) array slicing and GC churn on 80ms replay ticks while keeping memory bounded (`O(1)` extra heap).
2. **DOM Stability & Focus Preservation**:
   - Never `replaceChildren()` on a container holding `document.activeElement` during polling or scrubbing unless the structural identity changed; restore focus by stable `data-*` or `aria-label` key.
   - Guard `aria-live` regions with string-equality checks so screen readers are not spammed on unchanged poll ticks.

## References

- Detailed GUI component patterns (WAI-ARIA roving tabindex, modal focus traps, async request ownership): [component-patterns.md](./references/component-patterns.md)
