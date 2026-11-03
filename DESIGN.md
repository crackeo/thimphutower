# Design: Thimphu Tower, "Quiet luxury, cinematic"

Photography leads. The interface is warm stone and charcoal with a lot of air, and logo gold is reserved for the main action. Interaction carries the product truth: the view of the square, the rooms and rates, and the building itself. Chosen by the hotel's representative on 2026-11-01; it replaces the earlier "stamp issue" direction.

## Tokens (`app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | #f3efe8 | warm stone page ground |
| `--bg-2` | #eae4da | alternate sections |
| `--surface` | #fbf9f5 | fields, plans, cards |
| `--ink` | #1d1b19 | text, dark buttons, selected states |
| `--ink-2` / `--ink-3` | #4a4540 / #6b645c | secondary and tertiary text (AA on stone) |
| `--ochre` | #8c5f2b | the facade's tone: focus ring, italic emphasis, ticks |
| `--gold` | #e1ba3b | logo gold: primary call to action only |
| `--night` | #141312 | 3D stage, quotes, footer, mobile menu |

- **Type:** Cormorant Garamond (400/500, italic for emphasis) for headings; Jost for text and UI. Labels are Jost 500, uppercase, tracked 0.12–0.16em.
- **Scale:** fluid, from `--t-xs` up to `--t-hero` (6rem max).
- **Shape:** pill buttons and segmented controls, 12–18px radii on fields and panels, and square-cornered photographs.

## Motion

- Every easing is `cubic-bezier(0.16, 1, 0.3, 1)`, written literally: the CSS inliner drops `transition` shorthands that contain `var()`.
- Scroll reveals:
  - Text fades up 24px.
  - Images open with a clip-path inset while the photo settles from 1.12× scale.
  - Content stays visible without JavaScript: the `.js` class gates the hidden state.
- Hero scenes crossfade over 1.1s, with a slow 9s settle.
- The drawer slides in and each step slides in; view transitions morph room photos between the rooms list and the room page.
- `prefers-reduced-motion` turns all of it off. The 3D model then falls back to the static elevation drawing.

## Signature components

| Component | File |
|---|---|
| Hero scenes (Festival, Morning, Dusk, Snow) + enquiry bar + floating "Plan your stay" pill | `components/Hero.tsx` |
| 5-step enquiry drawer, loaded on first use | `components/EnquiryDrawer*.tsx` |
| Room explorer: category/rate toggles, nights stepper, live total with BST and service charge, clickable rate card | `components/RoomExplorer.tsx` |
| 3D tower stage: views, lift floors, line/solid, click-to-select parts with a detail panel | `components/architecture/TowerScene.tsx` |
| Interactive plan of Clock Tower Square, with pins tied to the hotel's own photos | `components/SquareMap.tsx` |
| Gallery: filter chips, full-screen viewer, swipe, filmstrip | `components/Gallery.tsx` |

## Rules

- No eyebrow labels above headings and no section numbers. Gold appears only on the primary action and the selected map pin.
- One primary action per view. Every enquiry entry point opens the same drawer, and every one falls back to `/contact/` without JavaScript.
- Drawings and plans are always labelled illustrative or schematic.
