# Impeccable Anti-Slop Detector Rules Reference

| Rule ID | What It Catches | How to Fix |
| :--- | :--- | :--- |
| `flat-type-hierarchy` | Headings (`h1`–`h3`) too close in size/weight to body text (`< 1.2x` ratio) | Use distinct semantic tokens (`--text-28`, `--text-20`, `--text-16`, `--text-14`, `--text-12`). |
| `side-tab` | Thick `border-left` or `border-inline-start` used as a cliché card accent | Use full `1px` borders with semantic tags (`.tag.info`, `.tag.warning`), or document intentional operator callouts. |
| `border-accent-on-rounded` | Combining `border-radius` with uneven border widths | Keep panels sharp (`border-radius: 0`) or use uniform `1px` borders on rounded elements. |
| `design-system-font-size` | Arbitrary pixel font sizes outside the type scale (`9px`, `10px`, `15px`) | Snap to the established scale (`12px` / `0.75rem`, `14px` / `0.875rem`, `16px` / `1rem`), using `11px` only where explicitly permitted for dense legends/tags. |
| `overused-font` | Hardcoding generic fallback fonts (`Arial`, `Helvetica`) without the system/project stack | Inherit `--font-sans` or `--font-mono` from `:root`. |
| `broken-image` | `<img>` elements rendered visible without a valid `src` or `onerror` fallback | Keep `<img>` hidden until `onload` + `decode()` succeeds, and provide an explicit retry control on `onerror`. |
| `mystery-disabled` | Disabled primary actions (`button:disabled`) with no visible explanation | Pair disabled actions with an `aria-describedby` hint explaining the exact blocking prerequisite. |
