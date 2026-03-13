# UX Archaeologist — Interactivity Expansion Design
Date: 2026-03-13

## Overview
Six interactivity improvements to the Mac System 1984 emulator game. All changes stay within the existing React + Vite + CSS Modules stack.

## State Architecture
Replace per-item booleans with unified state in `DesktopScene`:

```js
windows: [{ id, type: 'projects'|'notes'|'trash', pos: {x,y}, zIndex }]
trashContents: []  // e.g. ['notes']
iconPositions: { projects: {x,y}, notes: {x,y}, trash: {x,y} }
selectedIcon: null | 'projects' | 'notes' | 'trash'
nextZ: number  // increment on window focus
```

`windowOpen` and `notesVisible` booleans are removed. `notesVisible` is derived: `!trashContents.includes('notes')`.

## Feature 1 — Projects Window Title
**Problem:** Title text on striped bar is illegible.
**Fix:** In `DraggableWindow` title bar, wrap `<span className={titleText}>` in a white-background patch so horizontal stripes flank the text — matching System 1 "System Disk" reference. The stripes run full-width; the title text sits in a centered white pill that visually breaks the pattern.

## Feature 2 — Notes Document Window
- New window type `'notes'` rendered inside `DraggableWindow` (which becomes a generic shell accepting `children`).
- Content: ~400-word read-only text about the 1984 Mac launch as a UX milestone — Lisa influence, desktop metaphor, WIMP paradigm, Fitts's law in GUI design, etc.
- Scroll: `overflow-y: scroll` with a custom Mac-style scrollbar (up/down arrow buttons + thumb). Laggy scroll achieved by throttling `scrollTop` updates to ~120ms intervals via `setInterval` — gives the choppy 8MHz feel.
- Non-editable: plain `<div>`, not `<textarea>`.

## Feature 3 — Trash Window
- Double-clicking Trash opens `type: 'trash'` window.
- Shows `trashContents`. If `['notes']`, renders a Notes icon inside.
- Notes icon inside trash is draggable back to desktop: uses same dashed outline + stutter, drop outside trash restores icon (removes from `trashContents`, sets `notesVisible` derived state true, sets icon position to drop coordinates).
- Trash desktop icon graphic: two states — empty (lines visible) and full (filled body) based on `trashContents.length > 0`.

## Feature 4 — File Menu Close / Open
- `MenuBar` receives `canOpen: bool` (a selection is active), `canClose: bool` (a window is open), `onOpen()`, `onClose()` callbacks.
- Open and Close items are grayed (`disabled`) when not applicable.
- `onOpen`: DesktopScene opens the selected icon's window (projects/notes/trash).
- `onClose`: DesktopScene removes the topmost window (highest `zIndex`) from `windows` array.

## Feature 5 — Draggable Desktop Icons
- `iconPositions` state initialized from current absolute CSS values.
- Icons rendered with `style={{ position:'absolute', left, top }}` instead of CSS class positions.
- All three icons get `draggable={true}` + drag handlers.
- Drag start: show dashed outline with stutter (reuse existing `startDragOutline`/`stopDragOutline`).
- Drag end: if dropped on Trash → trash the item (Notes only; Projects/Trash can't be trashed); else → update `iconPositions` to drop coordinates.
- Trash still functions as a drop target for the Notes icon.

## Feature 6 — Apple Logo in Menu Bar
- Remove `⌘` span.
- Add inline SVG black apple silhouette (~16×18px), matching System 1 bitmap style.
- No color fill — solid `#000000` shape only.
- Keep `.apple` CSS class for padding/alignment.

## Files Changed
| File | Change |
|------|--------|
| `DesktopScene.jsx` | Unified state, icon drag, trash/notes/projects window dispatch, menu callbacks |
| `DraggableWindow.jsx` | Generic children shell, title bar legibility fix, Notes content, Trash content |
| `DraggableWindow.module.css` | Title text white patch, scrollbar styles, trash/notes body styles |
| `MenuBar.jsx` | Accept canOpen/canClose/onOpen/onClose props, wire to items |
| `MenuBar.module.css` | No change expected |
| `DesktopIcon.jsx` | Trash full/empty visual state |
| `DesktopScene.module.css` | Remove static icon position classes (positions now inline) |

## Out of Scope
- Persistence across page reload
- Multiple Notes files or new file creation
- Animated window open/close transitions
