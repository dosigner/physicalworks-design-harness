# Apple HIG Tokens, Ergonomics & Spatial Parity Reference

## 1. Pointer & Touch Ergonomics (Fitts's Law)

- **Standard Interactive Controls**: Minimum `44x44px` on touch surfaces; `28x28px` to `36x36px` on dense desktop toolbars.
- **Zoomed Canvas Connectors (Ports / Handles)**:
  - Visual indicator may remain compact (`10x10px` to `14x14px` at 100% zoom) to preserve node density.
  - Effective pointer capture area must never fall below `20x20px` in screen coordinates, even when the canvas is zoomed out (`0.05`–`0.25`).
  - Combine CSS hit expansion (`.flow-port::after`) with screen-space magnetic target resolution on `pointerup` so drag-and-drop wiring never fails due to sub-pixel port geometry.

---

## 2. 2D / 3D Telemetry & Trajectory Parity

When presenting spatial robot trajectories across 2D (`<canvas>`) and 3D (`THREE.WebGLRenderer`) views:

| Trajectory Segment Kind | Semantic Meaning | 2D Representation | 3D Representation |
|---|---|---|---|
| `normal` (`primary`) | Verified continuous trajectory | Solid stroke (`colors.primary`) | Solid `THREE.LineSegments` (`THREE.LineBasicMaterial`) |
| `candidate` | Unaligned / secondary comparison path | Dashed stroke (`[5, 4]`, `colors.candidate`) | Solid/distinct `THREE.LineSegments` (`colors.candidate`) |
| `gap` | Discontinuity / missing telemetry jump (`>0.35m`) | Dashed warning stroke (`[4, 4]`, `colors.gap`) | Dashed `THREE.LineSegments` (`THREE.LineDashedMaterial` + `computeLineDistances()`) |

### Terminal Sample Preservation Under Decimation
When downsampling high-frequency trajectories (`>50,000` segments) for frame-rate stability:
- Always preserve the first (`index === 0`) and final (`index === nonemptySegments.length - 1`) segments so the rendered path connects accurately to the current/terminal pose marker.

---

## 3. High-Frequency Scrubbing & Replay Responsiveness

- **60fps / 80ms Scrubbing Budget**: Scrubbing a timeline or playing back telemetry must not re-allocate O(N) invariant frame structures on every tick when `upperBound(frames, atMs)` resolves to the same frame index.
- **Bounded Memoization**: Cache the last derived frame state (`lastFrameDerivation`) per session index in a bounded 1-slot cursor on the `WeakMap`-backed session index rather than an unbounded `Map` keyed by floating-point `atMs`.
