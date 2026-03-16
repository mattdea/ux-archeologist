# UX Archaeologist — Level 1 Design Spec

**Date:** 2026-03-11
**Scope:** First playable level — "1984: The Desktop Arrives"

---

## Context

An interactive portfolio artifact about the history of interface design. The player explores an early Macintosh-inspired GUI scene to discover the concept of "direct manipulation." This is a polished micro-game: no backend, no database, no game engine. Local state only.

---

## Architecture

**React + Vite, plain CSS Modules, flat state in App.jsx.**

State shape:
```js
const [screen, setScreen] = useState('intro')          // 'intro' | 'playing' | 'artifact' | 'complete'
const [objectives, setObjectives] = useState({
  openFolder: false,
  trashFile: false,
  useMenu: false,
})
```

All 3 objectives true → `useEffect` fires 600ms delayed transition to `'artifact'`.

---

## Screen Flow

```
intro → playing → artifact → complete → (reset to intro)
```

---

## Components

| Component | File | Purpose |
|---|---|---|
| IntroModal | `src/components/IntroModal.jsx` | Overlay card before play begins |
| DesktopScene | `src/components/DesktopScene.jsx` | Main game canvas, owns local window/notes/trash state |
| MenuBar | `src/components/MenuBar.jsx` | Top bar with File dropdown |
| DesktopIcon | `src/components/DesktopIcon.jsx` | Reusable icon (folder/notes/trash), forwardRef |
| DraggableWindow | `src/components/DraggableWindow.jsx` | Projects window, mouse+touch drag by title bar |
| ObjectiveTracker | `src/components/ObjectiveTracker.jsx` | Small fixed panel showing 3 objectives |
| ArtifactModal | `src/components/ArtifactModal.jsx` | Overlay card when all objectives complete |
| CompletionScreen | `src/components/CompletionScreen.jsx` | Full-screen end state |

---

## Critical Implementation Notes

### Drag-to-Trash (mouse + touch)

**Mouse:** HTML5 Drag and Drop API on Notes icon (`draggable`, `onDragStart`) + Trash as drop target (`onDragOver`, `onDrop`).

**Touch:** Track finger via `onTouchMove`, hit-test against `trashRef.current.getBoundingClientRect()` on `onTouchEnd`. Visual ghost element created imperatively.

**Critical:** `touchmove` must call `e.preventDefault()` to suppress scroll. React registers touch handlers as passive by default — must attach `{ passive: false }` listener imperatively via `useEffect` on the Notes icon's DOM node.

### forwardRef on DesktopIcon

`DesktopScene` passes `ref={trashRef}` to the Trash `DesktopIcon` for hit-testing. Requires `forwardRef`.

### Window dragging

`DraggableWindow` uses `useRef` for drag state (avoids re-renders mid-drag), attaches `mousemove`/`mouseup` to `document` on drag start, removes on drag end. Touch variant uses `onTouchMove`/`onTouchEnd` on the title bar directly.

### Icon styling

CSS-only pixel-art icons — no image assets. Folder = tab + body divs. Notes = paper + lines divs. Trash = lid + body + vertical lines divs.

---

## Visual System (`src/styles/theme.css`)

```css
--mac-white: #ffffff
--mac-black: #000000
--mac-gray: #888888
--mac-light-gray: #dddddd
--mac-bg: #555555      /* desktop background */
--font-chicago: 'Chicago', 'Monaco', monospace
--font-geneva: 'Geneva', 'Helvetica', sans-serif
--border: 1px solid #000000
--window-shadow: 3px 3px 0px rgba(0,0,0,0.5)
--menu-bar-height: 20px
```

---

## File Structure

```
src/
  styles/theme.css
  main.jsx
  App.jsx + App.module.css
  components/
    IntroModal.jsx + .module.css
    DesktopScene.jsx + .module.css
    MenuBar.jsx + .module.css
    DesktopIcon.jsx + .module.css
    DraggableWindow.jsx + .module.css
    ObjectiveTracker.jsx + .module.css
    ArtifactModal.jsx + .module.css
    CompletionScreen.jsx + .module.css
```

---

## Dependencies

- react + react-dom ^18
- vite ^5 + @vitejs/plugin-react

No other dependencies.

---

## Verification

1. `npm run dev` → Intro modal visible over blurred desktop
2. "Begin Excavation" → desktop interactive
3. Double-click Projects → window opens, objective 1 checked
4. Drag Notes to Trash → Notes disappears, objective 2 checked
5. Click File menu → dropdown → click any item → objective 3 checked
6. All 3 done → ArtifactModal after 600ms
7. Continue → CompletionScreen
8. Return to Archive → resets to intro
