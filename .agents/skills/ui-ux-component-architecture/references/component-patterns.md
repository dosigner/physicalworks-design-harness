# UI Component State & Interaction Patterns

## 1. Per-Instance UI State Keying

When rendering an inspector, sidebar, or detail panel that switches between multiple selected entities (e.g., Flow canvas nodes, camera feeds, trajectory runs), **never store UI state by section name alone**.

### Anti-Pattern (Shared Cross-Instance State)
```js
const groupOpen = new Map();
// Bug: Toggling 'thinking' on Node A also mutates 'thinking' on Node B
group.open = groupOpen.get(sectionName) ?? defaultOpen;
group.addEventListener('toggle', () => groupOpen.set(sectionName, group.open));
```

### Canonical Pattern (Composite Instance Key)
```js
const groupOpen = new Map();
const groupKey = `${entity.id}:${sectionName}`;
group.open = groupOpen.get(groupKey) ?? defaultOpen;
group.addEventListener('toggle', () => groupOpen.set(groupKey, group.open));
```

---

## 2. Mode & Sub-View Exclusivity (`Editor` vs `Executions`)

When a component hosts mutually exclusive sub-views (such as a canvas `Editor` mode vs. an `Executions` log inspection mode):

1. **Close Transient Floating Panels on Transition**: Switching into a read-only/inspection sub-view (`Executions`) must immediately close authoring-only popovers/palettes (`closePalette()`).
2. **Reflect Sub-View on the Root Container**: Expose `element.dataset.view = showExecutions ? 'executions' : 'editor'` so CSS and tests can deterministically inspect the active sub-view.
3. **Gate Authoring Affordances**: Hide or disable node-creation triggers (`addButton`, `searchButton`, `.flow-next-button`) while `Executions` is open, and restore them cleanly when returning to `Editor`.

---

## 3. Async Mutation & Poll State Machine

Every asynchronous device or preset control must separate:
- `verified`: Has at least one fresh health/status snapshot succeeded?
- `pollError`: Did the latest status poll fail or time out?
- `mutationBusy`: Is a command POST currently in flight or awaiting ledger reconciliation?

**Actionability Invariant**:
```js
const canStart = snapshot.verified && !pollError && !mutationBusy && !snapshot.active;
const canStop  = snapshot.verified && !pollError && !mutationBusy && snapshot.active;
```

---

## 4. Zoom-Resilient Canvas Hit Targets

When a 2D node canvas scales down via `transform: scale(var(--flow-zoom))`, child ports (`.flow-port`) shrink visually and geometrically.
- Keep `--flow-zoom` synchronized on the scaled scene element (`scene.style.setProperty('--flow-zoom', String(zoom))`).
- Provide an expanded transparent hit pseudo-element (`::after`) and/or a screen-space proximity snap radius during pointer-up (`beginPortDrag`) so ports remain connectable even at 5%–20% zoom.
