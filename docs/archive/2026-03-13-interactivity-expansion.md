# Interactivity Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six interactivity features to the Mac System 1984 emulator — draggable icons, Notes/Trash windows, legible title bar, File menu Close/Open, and Apple logo.

**Architecture:** Unify DesktopScene state into a `windows` array + `trashContents` + `iconPositions`, making `DraggableWindow` a generic shell that accepts `children`. All interactions stay in DesktopScene; MenuBar gains action callbacks.

**Tech Stack:** React 19, Vitest, @testing-library/react, CSS Modules, Vite

---

## Chunk 1: State Refactor + Icon Dragging

### Task 1: Read supporting files

- [ ] **Step 1: Read DesktopIcon.module.css to know icon dimensions**

```bash
cat src/components/DesktopIcon.module.css
```

Expected: see `.icon` width/height values. Icon container is roughly 56px wide × 68px tall (icon graphic + label).

---

### Task 2: Refactor DesktopScene state

**Files:**
- Modify: `src/components/DesktopScene.jsx`
- Modify: `src/test/DesktopScene.test.jsx`

- [ ] **Step 1: Write failing test for unified windows state**

In `src/test/DesktopScene.test.jsx`, add after the existing tests:

```jsx
it('double-clicking Notes icon opens a notes window', async () => {
  const user = userEvent.setup()
  render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
  await user.dblClick(screen.getByText('Notes'))
  expect(screen.getByText(/1984/)).toBeInTheDocument()
})

it('double-clicking Trash opens a trash window', async () => {
  const user = userEvent.setup()
  render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
  await user.dblClick(screen.getByText('Trash'))
  expect(screen.getByText(/0 items/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test 2>&1 | tail -30
```

Expected: both new tests FAIL ("cannot find /1984/" and "cannot find /0 items/").

- [ ] **Step 3: Replace DesktopScene state and open-window logic**

Replace the state declarations at the top of `DesktopScene` (lines 10–13) with:

```jsx
// windows: [{ id: string, type: 'projects'|'notes'|'trash', pos: {x,y}, zIndex: number }]
const [windows, setWindows] = useState([])
const [trashContents, setTrashContents] = useState([])  // [] | ['notes']
const [iconPositions, setIconPositions] = useState({
  projects: { x: 496, y: 40 },
  notes:    { x: 496, y: 160 },
  trash:    { x: 496, y: 300 },
})
const [nextZ, setNextZ] = useState(20)
const [selectedIcon, setSelectedIcon] = useState(null)

// Derived
const notesOnDesktop = !trashContents.includes('notes')

const openWindow = (type, defaultPos) => {
  // Bring existing window of that type to front rather than duplicate
  setWindows(prev => {
    const exists = prev.find(w => w.type === type)
    if (exists) {
      const z = nextZ
      setNextZ(n => n + 1)
      return prev.map(w => w.type === type ? { ...w, zIndex: z } : w)
    }
    const z = nextZ
    setNextZ(n => n + 1)
    return [...prev, { id: type, type, pos: defaultPos, zIndex: z }]
  })
}

const closeTopWindow = () => {
  setWindows(prev => {
    if (!prev.length) return prev
    const top = prev.reduce((a, b) => a.zIndex > b.zIndex ? a : b)
    return prev.filter(w => w.id !== top.id)
  })
}
```

- [ ] **Step 4: Update handleFolderDoubleClick and add handleNotesDoubleClick, handleTrashDoubleClick**

Replace `handleFolderDoubleClick`:

```jsx
const handleFolderDoubleClick = () => {
  openWindow('projects', { x: 80, y: 50 })
  completeObjective('openFolder')
}

const handleNotesDoubleClick = () => {
  openWindow('notes', { x: 60, y: 55 })
}

const handleTrashDoubleClick = () => {
  openWindow('trash', { x: 90, y: 60 })
}
```

- [ ] **Step 5: Update handleTrashDrop to use trashContents**

Replace the body of `handleTrashDrop`:

```jsx
const handleTrashDrop = (e) => {
  e.preventDefault()
  stopDragOutline()
  setTrashHighlighted(false)
  const item = e.dataTransfer.getData('text/plain')
  if (item === 'notes') {
    setTrashContents(['notes'])
    completeObjective('trashFile')
  }
}
```

- [ ] **Step 6: Add desktopRef, handleMenuOpen, handleDesktopDrop, handleRestoreNotes**

Add these before the return (these refs and handlers must be defined before the JSX that references them):

```jsx
const desktopRef = useRef(null)

const handleMenuOpen = () => {
  if (!selectedIcon) return
  if (selectedIcon === 'projects') handleFolderDoubleClick()
  else if (selectedIcon === 'notes' && notesOnDesktop) handleNotesDoubleClick()
  else if (selectedIcon === 'trash') handleTrashDoubleClick()
}

const handleDesktopDrop = (e) => {
  const item = e.dataTransfer.getData('text/plain')
  if (item === 'notes-restore') {
    setTrashContents([])
    const rect = desktopRef.current.getBoundingClientRect()
    const x = Math.max(4, Math.min(rect.width - 56, e.clientX - rect.left - 24))
    const y = Math.max(34, Math.min(rect.height - 70, e.clientY - rect.top - 26))
    setIconPositions(prev => ({ ...prev, notes: { x, y } }))
  }
}

const handleRestoreNotes = () => {
  setTrashContents([])
}
```

- [ ] **Step 7: Update JSX — windows array replaces single windowOpen**

Replace the `{windowOpen && <DraggableWindow ... />}` block and icon conditionals in the return:

```jsx
return (
  <div
    ref={desktopRef}
    className={`${styles.desktop} ${!active ? styles.inactive : ''}`}
    onClick={handleDesktopClick}
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDesktopDrop}
  >
    <MenuBar
      onMenuItemClick={handleMenuItemClick}
      canOpen={selectedIcon !== null}
      canClose={windows.length > 0}
      onOpen={handleMenuOpen}
      onClose={closeTopWindow}
    />

    {notesOnDesktop && (
      <DesktopIcon
        ref={notesRef}
        label="Notes"
        icon="notes"
        style={{ position: 'absolute', left: iconPositions.notes.x, top: iconPositions.notes.y }}
        draggable={true}
        isSelected={selectedIcon === 'notes'}
        onClick={() => setSelectedIcon('notes')}
        onDoubleClick={handleNotesDoubleClick}
        onDragStart={(e) => handleIconDragStart('notes', e)}
        onDragEnd={(e) => handleIconDragEnd('notes', e)}
        onTouchStart={handleNotesTouchStart}
        onTouchEnd={handleNotesTouchEnd}
      />
    )}

    <DesktopIcon
      label="Projects"
      icon="folder"
      style={{ position: 'absolute', left: iconPositions.projects.x, top: iconPositions.projects.y }}
      draggable={true}
      isSelected={selectedIcon === 'projects'}
      onClick={() => setSelectedIcon('projects')}
      onDoubleClick={handleFolderDoubleClick}
      onDragStart={(e) => handleIconDragStart('projects', e)}
      onDragEnd={(e) => handleIconDragEnd('projects', e)}
    />

    <DesktopIcon
      ref={trashRef}
      label="Trash"
      icon="trash"
      isFull={trashContents.length > 0}
      style={{ position: 'absolute', left: iconPositions.trash.x, top: iconPositions.trash.y }}
      isHighlighted={trashHighlighted}
      isSelected={selectedIcon === 'trash'}
      onClick={() => setSelectedIcon('trash')}
      onDoubleClick={handleTrashDoubleClick}
      onDragOver={handleTrashDragOver}
      onDragLeave={handleTrashDragLeave}
      onDrop={handleTrashDrop}
    />

    {windows.map(win => (
      <DraggableWindow
        key={win.id}
        type={win.type}
        title={win.type === 'projects' ? 'Projects' : win.type === 'notes' ? 'Notes' : 'Trash'}
        initialPos={win.pos}
        zIndex={win.zIndex}
        onClose={() => setWindows(prev => prev.filter(w => w.id !== win.id))}
        trashContents={win.type === 'trash' ? trashContents : undefined}
        onRestoreNotes={win.type === 'trash' ? handleRestoreNotes : undefined}
        onFocus={() => {
          const z = nextZ
          setNextZ(n => n + 1)
          setWindows(prev => prev.map(w => w.id === win.id ? { ...w, zIndex: z } : w))
        }}
      />
    ))}

    <ObjectiveTracker objectives={objectives} />
  </div>
)
```

- [ ] **Step 8: Run tests**

```bash
npm run test 2>&1 | tail -40
```

Expected: all previous tests pass, the 2 new tests may still fail (DraggableWindow doesn't render notes content yet — that's Task 4). Note any failures; they will be resolved in Tasks 3–5.

---

### Task 3: Generalize icon drag for free positioning

**Files:**
- Modify: `src/components/DesktopScene.jsx`
- Modify: `src/components/DesktopScene.module.css`
- Modify: `src/components/DesktopIcon.jsx`

- [ ] **Step 1: Add dragResult ref and generalized drag handlers to DesktopScene**

Add after the `dragOutline` refs:

```jsx
const dragResult = useRef(null)   // set to 'trashed' in drop handler
const draggingIcon = useRef(null) // which icon is being dragged
```

Replace `handleNotesDragStart` and `handleNotesDragEnd` with generic handlers:

```jsx
const handleIconDragStart = (iconName, e) => {
  draggingIcon.current = iconName
  dragResult.current = null
  e.dataTransfer.setData('text/plain', iconName)
  const ghost = document.createElement('div')
  ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
  document.body.appendChild(ghost)
  e.dataTransfer.setDragImage(ghost, 0, 0)
  setTimeout(() => document.body.removeChild(ghost), 0)
  startDragOutline(e.clientX, e.clientY)
}

const handleIconDragEnd = (iconName, e) => {
  stopDragOutline()
  if (dragResult.current === 'trashed') return  // position handled by trash drop
  const rect = desktopRef.current?.getBoundingClientRect()
  if (!rect) return
  const x = Math.max(4, Math.min(rect.width - 56, e.clientX - rect.left - 24))
  const y = Math.max(34, Math.min(rect.height - 70, e.clientY - rect.top - 26))
  setIconPositions(prev => ({ ...prev, [iconName]: { x, y } }))
}
```

Update `handleTrashDrop` to set `dragResult`:

```jsx
const handleTrashDrop = (e) => {
  e.preventDefault()
  stopDragOutline()
  setTrashHighlighted(false)
  const item = e.dataTransfer.getData('text/plain')
  if (item === 'notes') {
    dragResult.current = 'trashed'
    setTrashContents(['notes'])
    completeObjective('trashFile')
  }
}
```

- [ ] **Step 2: Remove static icon position classes from DesktopScene.module.css**

In `src/components/DesktopScene.module.css`, delete these rules entirely (the exact content to remove):

```css
/* Icon positions */
.iconProjects {
  position: absolute;
  top: calc(var(--menu-bar-height) + 20px);
  right: 24px;
}

.iconNotes {
  position: absolute;
  top: calc(var(--menu-bar-height) + 120px);
  right: 24px;
}

.iconTrash {
  position: absolute;
  bottom: 24px;
  right: 24px;
}
```

- [ ] **Step 3: Add style prop support to DesktopIcon**

In `src/components/DesktopIcon.jsx`, add `style` to the destructured props and apply it:

```jsx
const {
  label, icon, onClick, onDoubleClick, draggable,
  onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
  onTouchStart, onTouchEnd, isHighlighted, isSelected, isFull,
  className, style,
} = props
```

And on the outer div:

```jsx
<div
  ref={ref}
  className={`${styles.icon} ${isSelected ? styles.selected : ''} ${className || ''}`}
  style={style}
  ...
>
```

Also pass `isFull` to `TrashIcon`:

```jsx
{icon === 'trash' && <TrashIcon highlighted={isHighlighted} full={isFull} />}
```

- [ ] **Step 4: Update dragover handler on stutter outline to use `pointermove` instead of `dragover`**

The stutter outline currently tracks via `dragover` on document. Replace with `pointermove` for more reliable tracking:

In `startDragOutline`:
```jsx
const trackMouse = (e) => {
  dragMousePos.current = { x: e.clientX, y: e.clientY }
}
document.addEventListener('pointermove', trackMouse)
dragOutline.current._trackMouse = trackMouse
```

In `stopDragOutline`:
```jsx
document.removeEventListener('pointermove', dragOutline.current._trackMouse)
```

- [ ] **Step 5: Run tests**

```bash
npm run test 2>&1 | tail -30
```

Expected: existing drag-to-trash test still passes. Icon positioning tests aren't written yet (UI-only behavior). Build should also pass:

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in ...`

- [ ] **Step 6: Commit**

```bash
git add src/components/DesktopScene.jsx src/components/DesktopScene.module.css src/components/DesktopIcon.jsx src/test/DesktopScene.test.jsx
git commit -m "feat: unify DesktopScene state, make all icons freely draggable"
```

---

## Chunk 2: Windows, Menu, Logo

### Task 4: DraggableWindow generic shell + title bar fix

**Files:**
- Modify: `src/components/DraggableWindow.jsx`
- Modify: `src/components/DraggableWindow.module.css`

- [ ] **Step 0: Create stub files for NotesWindowContent and TrashWindowContent**

DraggableWindow will import these components, but they don't exist yet. Create minimal stubs now so the build doesn't break. They will be replaced in Tasks 5 and 6.

Create `src/components/NotesWindowContent.jsx`:

```jsx
// src/components/NotesWindowContent.jsx — stub, replaced in Task 5
export default function NotesWindowContent() {
  return <div style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>Loading…</div>
}
```

Create `src/components/TrashWindowContent.jsx`:

```jsx
// src/components/TrashWindowContent.jsx — stub, replaced in Task 6
export default function TrashWindowContent() {
  return <div style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>Empty</div>
}
```

- [ ] **Step 1: Rewrite DraggableWindow as a generic shell**

Replace the entire contents of `src/components/DraggableWindow.jsx` with:

```jsx
// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'
import ProjectsWindowContent from './ProjectsWindowContent'
import NotesWindowContent from './NotesWindowContent'
import TrashWindowContent from './TrashWindowContent'

export default function DraggableWindow({
  title, type, initialPos, zIndex, onClose, onFocus,
  trashContents, onRestoreNotes,
}) {
  const [pos, setPos] = useState(initialPos ?? { x: 120, y: 60 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const titleBarRef = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos

  const clampPos = (x, y) => ({
    x: Math.max(0, Math.min(window.innerWidth - 280, x)),
    y: Math.max(20, Math.min(window.innerHeight - 120, y)),
  })

  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return
    e.preventDefault()
    onFocus?.()
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    const handleMouseMove = (e) => {
      if (!dragging.current) return
      setPos(clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
    }
    const handleMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTitleTouchStart = (e) => {
    if (e.target.closest('button')) return
    const touch = e.touches[0]
    onFocus?.()
    dragging.current = true
    dragOffset.current = {
      x: touch.clientX - posRef.current.x,
      y: touch.clientY - posRef.current.y,
    }
  }
  const handleTitleTouchEnd = () => { dragging.current = false }

  useEffect(() => {
    const el = titleBarRef.current
    if (!el) return
    const handleTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      setPos(clampPos(touch.clientX - dragOffset.current.x, touch.clientY - dragOffset.current.y))
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  return (
    <div
      className={styles.window}
      style={{ left: pos.x, top: pos.y, zIndex }}
      onMouseDown={onFocus}
    >
      <div
        ref={titleBarRef}
        className={styles.titleBar}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onTouchEnd={handleTitleTouchEnd}
      >
        <button className={styles.closeBtn} onClick={onClose} title="Close">×</button>
        <span className={styles.titleText}>{title}</span>
      </div>

      <div className={type === 'notes' ? styles.scrollBody : styles.body}>
        {type === 'projects' && <ProjectsWindowContent />}
        {type === 'notes'    && <NotesWindowContent />}
        {type === 'trash'    && (
          <TrashWindowContent
            contents={trashContents}
            onRestoreNotes={onRestoreNotes}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Fix title bar legibility in DraggableWindow.module.css**

Change `.titleText` — remove `mix-blend-mode` and add white background block:

```css
.titleText {
  flex: 1;
  text-align: center;
  font-family: var(--font-chicago);
  font-size: 13px;
  color: var(--mac-black);
  background: var(--mac-white);
  padding: 0 8px;
  pointer-events: none;
  white-space: nowrap;
}
```

Add `.scrollBody` for the Notes window:

```css
.scrollBody {
  height: 220px;
  overflow: hidden;
  position: relative;
}
```

- [ ] **Step 3: Create ProjectsWindowContent**

Create `src/components/ProjectsWindowContent.jsx`:

```jsx
// src/components/ProjectsWindowContent.jsx
import styles from './DraggableWindow.module.css'

const FILES = [
  { name: 'Budget.txt', icon: '▤' },
  { name: 'Letter.doc', icon: '▤' },
  { name: 'Sketch.bmp', icon: '▣' },
]

export default function ProjectsWindowContent() {
  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{FILES.length} items</span>
      </div>
      <ul className={styles.fileList}>
        {FILES.map(file => (
          <li key={file.name} className={styles.fileItem}>
            <span className={styles.fileIcon}>{file.icon}</span>
            <span>{file.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test 2>&1 | tail -30
```

Expected: all prior tests pass. Build passes:

```bash
npm run build 2>&1 | tail -5
```

---

### Task 5: Notes document window with laggy scroll

**Files:**
- Create: `src/components/NotesWindowContent.jsx`

- [ ] **Step 1: Create NotesWindowContent with choppy scroll**

Create `src/components/NotesWindowContent.jsx`:

```jsx
// src/components/NotesWindowContent.jsx
import { useRef, useEffect } from 'react'
import styles from './NotesWindowContent.module.css'

const NOTES_TEXT = `The 1984 Macintosh: A Revolution in Human-Computer Interaction

When Apple introduced the Macintosh on January 24, 1984, it did not just launch a computer — it launched a paradigm. The Mac was the first mass-market personal computer to successfully commercialize the graphical user interface (GUI), transforming computing from a technical discipline into a human activity.

The roots of this revolution trace to Xerox PARC in the 1970s, where researchers developed the Alto computer with windows, icons, menus, and a pointing device. Douglas Engelbart's 1968 "Mother of All Demos" had shown the world what was possible. But it was the Macintosh that made these ideas accessible to everyone.

Key UX innovations the Mac introduced to mainstream computing:

• The Desktop Metaphor — Files, folders, and a trash can mapped digital work to familiar physical objects. Users could understand the system without reading a manual.

• Direct Manipulation — Instead of typing commands, users could drag objects, resize windows, and see immediate visual feedback. This was WYSIWYG before the acronym was common.

• Consistent Interface Standards — The Human Interface Guidelines (1984) established that all Mac applications should work the same way. A user who learned one app could use any app.

• The Mouse as Primary Input — The single-button mouse made pointing natural. Fitts's Law was being practiced: large targets at screen edges, a persistent menu bar always in reach.

• The Menu Bar — A persistent location for all commands, shared across every application. Users never had to hunt for functions.

The Mac's success proved that good design was a competitive advantage. Companies like Microsoft, Sun, and later everyone building for iOS and Android followed its model.

This machine ran on a 7.8336 MHz Motorola 68000 processor with 128KB of RAM and a 3.5-inch floppy disk. It cost $2,495 — roughly $7,500 in today's dollars. Despite its limitations, it changed everything.`

export default function NotesWindowContent() {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const scrollPos = useRef(0)
  const pending = useRef(0)
  const intervalRef = useRef(null)

  // Choppy scroll: accumulate wheel delta, apply in 120ms chunks
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()
      pending.current += e.deltaY

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (pending.current === 0) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            return
          }
          const step = Math.sign(pending.current) * Math.min(Math.abs(pending.current), 36)
          pending.current -= step
          const content = contentRef.current
          const viewport = viewportRef.current
          if (!content || !viewport) return
          const maxScroll = content.scrollHeight - viewport.clientHeight
          scrollPos.current = Math.max(0, Math.min(maxScroll, scrollPos.current + step))
          content.style.transform = `translateY(${-scrollPos.current}px)`
        }, 120)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={contentRef} className={styles.content}>
        {NOTES_TEXT.split('\n').map((line, i) => (
          line === '' ? <br key={i} /> : <p key={i}>{line}</p>
        ))}
      </div>
      <div className={styles.scrollbarTrack}>
        <button className={styles.scrollArrow}>▲</button>
        <div className={styles.scrollThumbArea}>
          <div className={styles.scrollThumb} />
        </div>
        <button className={styles.scrollArrow}>▼</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create NotesWindowContent.module.css**

Create `src/components/NotesWindowContent.module.css`:

```css
/* src/components/NotesWindowContent.module.css */
.viewport {
  display: flex;
  height: 220px;
  overflow: hidden;
  position: relative;
}

.content {
  flex: 1;
  padding: 6px 8px;
  font-family: var(--font-chicago);
  font-size: 12px;
  line-height: 1.5;
  color: var(--mac-black);
  will-change: transform;
}

.content p {
  margin-bottom: 0;
}

.scrollbarTrack {
  width: 16px;
  border-left: var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.scrollArrow {
  height: 16px;
  width: 100%;
  background: var(--mac-white);
  border: none;
  border-bottom: var(--border);
  font-size: 9px;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: var(--font-chicago);
}

.scrollArrow:last-child {
  border-bottom: none;
  border-top: var(--border);
}

.scrollThumbArea {
  flex: 1;
  background: var(--mac-white);
  position: relative;
  border-bottom: var(--border);
}

.scrollThumb {
  position: absolute;
  top: 4px;
  left: 2px;
  right: 2px;
  height: 24px;
  background: var(--mac-black);
}
```

- [ ] **Step 3: Run tests — the notes window test should now pass**

```bash
npm run test 2>&1 | tail -30
```

Expected: `double-clicking Notes icon opens a notes window` now passes (screen finds `/1984/`). Build passes:

```bash
npm run build 2>&1 | tail -5
```

---

### Task 6: Trash window with full/empty state + drag-back

**Files:**
- Create: `src/components/TrashWindowContent.jsx`
- Modify: `src/components/DesktopIcon.jsx`
- Modify: `src/components/DesktopIcon.module.css`

- [ ] **Step 1: Write failing test for trash window showing notes**

In `src/test/DesktopScene.test.jsx`, add:

```jsx
it('trash window shows Notes when notes has been trashed', async () => {
  const completeObjective = vi.fn()
  const user = userEvent.setup()
  render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)

  // Drag notes to trash
  const notesLabel = screen.getByText('Notes')
  const notesEl = notesLabel.closest('[draggable="true"]') || notesLabel.closest('div')
  const trashLabel = screen.getByText('Trash')
  const trashEl = trashLabel.closest('div')
  const dt = { setData: vi.fn(), getData: vi.fn(() => 'notes'), setDragImage: vi.fn() }
  fireEvent.dragStart(notesEl, { dataTransfer: dt })
  fireEvent.dragOver(trashEl, { preventDefault: vi.fn(), dataTransfer: dt })
  fireEvent.drop(trashEl, { preventDefault: vi.fn(), dataTransfer: dt })

  // Open trash
  await user.dblClick(screen.getByText('Trash'))
  expect(screen.getByText('1 item')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test 2>&1 | grep -E "FAIL|PASS|trash window"
```

Expected: `trash window shows Notes` FAILS.

- [ ] **Step 3: Create TrashWindowContent**

Create `src/components/TrashWindowContent.jsx`:

```jsx
// src/components/TrashWindowContent.jsx
import styles from './DraggableWindow.module.css'
import notesStyles from './DesktopIcon.module.css'

function NotesIconSmall({ onDragStart, onDragEnd }) {
  return (
    <div
      className={notesStyles.icon}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className={notesStyles.notesWrap}>
        <div className={notesStyles.notesPage}>
          <div className={notesStyles.notesLine} />
          <div className={notesStyles.notesLine} />
          <div className={notesStyles.notesLine} />
        </div>
      </div>
      <span className={notesStyles.label}>Notes</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], onRestoreNotes }) {
  const count = contents.length
  const hasNotes = contents.includes('notes')

  const handleNotesDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'notes-restore')
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleNotesDragEnd = () => {
    // restore is handled by the desktop drop handler
  }

  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`}</span>
      </div>
      <div className={styles.trashBody}>
        {hasNotes && (
          <NotesIconSmall
            onDragStart={handleNotesDragStart}
            onDragEnd={handleNotesDragEnd}
          />
        )}
        {!hasNotes && (
          <span className={styles.emptyMsg}>Trash is empty.</span>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 4: Add trash body styles and emptyMsg to DraggableWindow.module.css**

Append:

```css
.trashBody {
  padding: 8px;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.emptyMsg {
  font-family: var(--font-chicago);
  font-size: 12px;
  color: var(--mac-gray);
}
```

- [ ] **Step 5: Add `full` prop to TrashIcon in DesktopIcon.jsx**

In `DesktopIcon.jsx`, update `TrashIcon`:

```jsx
function TrashIcon({ highlighted, full }) {
  return (
    <div className={`${styles.trashWrap} ${highlighted ? styles.trashHighlighted : ''} ${full ? styles.trashFull : ''}`}>
      <div className={styles.trashLid} />
      <div className={styles.trashBody}>
        <div className={styles.trashLine} />
        <div className={styles.trashLine} />
        <div className={styles.trashLine} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Add .trashFull to DesktopIcon.module.css**

Append to `src/components/DesktopIcon.module.css`:

```css
.trashFull .trashBody {
  background: var(--mac-black);
}
.trashFull .trashLine {
  background: var(--mac-white);
}
```

- [ ] **Step 7: Run tests**

```bash
npm run test 2>&1 | tail -30
```

Expected: `trash window shows Notes when notes has been trashed` now passes. All others pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/DraggableWindow.jsx src/components/DraggableWindow.module.css \
        src/components/ProjectsWindowContent.jsx \
        src/components/NotesWindowContent.jsx src/components/NotesWindowContent.module.css \
        src/components/TrashWindowContent.jsx \
        src/components/DesktopIcon.jsx src/components/DesktopIcon.module.css \
        src/test/DesktopScene.test.jsx
git commit -m "feat: add Notes and Trash windows, generic DraggableWindow shell, title bar fix, trash full state"
```

---

### Task 7: File menu Close / Open

**Files:**
- Modify: `src/components/MenuBar.jsx`
- Modify: `src/test/MenuBar.test.jsx`

- [ ] **Step 1: Write failing test for File > Open and File > Close**

In `src/test/MenuBar.test.jsx`, add:

```jsx
it('File > Open is disabled when canOpen is false', async () => {
  const user = userEvent.setup()
  const onOpen = vi.fn()
  render(<MenuBar onMenuItemClick={() => {}} canOpen={false} onOpen={onOpen} canClose={false} onClose={() => {}} />)
  await user.click(screen.getByText('File'))
  const openBtn = screen.getByText('Open').closest('button')
  expect(openBtn).toHaveClass('dropdownItemDisabled')
})

it('File > Open calls onOpen when canOpen is true', async () => {
  const user = userEvent.setup()
  const onOpen = vi.fn()
  render(<MenuBar onMenuItemClick={() => {}} canOpen={true} onOpen={onOpen} canClose={false} onClose={() => {}} />)
  await user.click(screen.getByText('File'))
  await user.click(screen.getByText('Open'))
  expect(onOpen).toHaveBeenCalledTimes(1)
})

it('File > Close calls onClose when canClose is true', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  render(<MenuBar onMenuItemClick={() => {}} canOpen={false} onOpen={() => {}} canClose={true} onClose={onClose} />)
  await user.click(screen.getByText('File'))
  await user.click(screen.getByText('Close'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test 2>&1 | grep -E "FAIL|Open|Close"
```

Expected: new tests FAIL.

- [ ] **Step 3: Update MenuBar to accept and wire canOpen/canClose/onOpen/onClose**

In `src/components/MenuBar.jsx`, change the function signature and MENUS construction:

```jsx
export default function MenuBar({ onMenuItemClick, canOpen = false, canClose = false, onOpen, onClose }) {
  const [openMenu, setOpenMenu] = useState(null)
  const menuBarRef = useRef(null)

  const MENUS = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New Folder' },
        { label: 'Open',  action: 'open',  disabled: !canOpen },
        { label: 'Close', action: 'close', disabled: !canClose },
        { separator: true },
        { label: 'About This System' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { separator: true },
        { label: 'Cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', shortcut: '⌘V', disabled: true },
        { label: 'Clear', disabled: true },
        { label: 'Select All', shortcut: '⌘A', disabled: true },
        { separator: true },
        { label: 'Show Clipboard', disabled: true },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'by Icon', checked: true },
        { label: 'by Name' },
        { label: 'by Date' },
        { label: 'by Size' },
        { label: 'by Kind' },
      ],
    },
    {
      id: 'special',
      label: 'Special',
      items: [
        { label: 'Clean Up' },
        { separator: true },
        { label: 'Empty Trash' },
        { separator: true },
        { label: 'Erase Disk' },
        { separator: true },
        { label: 'Restart' },
        { label: 'Shut Down' },
      ],
    },
  ]
```

Move the `MENUS` array inside the component function body (after the `useState` declarations). The global `MENUS` constant at the top of the file must be deleted entirely.

Update `handleItemClick`:

```jsx
const handleItemClick = (item) => {
  if (item.disabled) return
  setOpenMenu(null)
  if (item.action === 'open') { onOpen?.(); return }
  if (item.action === 'close') { onClose?.(); return }
  onMenuItemClick()
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test 2>&1 | tail -30
```

Expected: all tests pass including the 3 new ones.

---

### Task 8: Apple logo in menu bar

**Files:**
- Modify: `src/components/MenuBar.jsx`
- Modify: `src/components/MenuBar.module.css`

- [ ] **Step 1: Replace ⌘ span with Apple SVG in MenuBar.jsx**

Replace `<span className={styles.apple}>⌘</span>` with:

```jsx
<span className={styles.apple} aria-hidden="true">
  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixel-art black apple silhouette — System 1 style */}
    <rect x="5" y="0" width="3" height="2" fill="#000"/>
    <rect x="4" y="1" width="2" height="1" fill="#000"/>
    <rect x="2" y="2" width="9" height="1" fill="#000"/>
    <rect x="1" y="3" width="11" height="1" fill="#000"/>
    <rect x="0" y="4" width="13" height="1" fill="#000"/>
    <rect x="0" y="5" width="6" height="1" fill="#000"/>
    <rect x="7" y="5" width="6" height="1" fill="#000"/>
    <rect x="0" y="6" width="6" height="1" fill="#000"/>
    <rect x="7" y="6" width="6" height="1" fill="#000"/>
    <rect x="0" y="7" width="13" height="1" fill="#000"/>
    <rect x="0" y="8" width="13" height="1" fill="#000"/>
    <rect x="0" y="9" width="13" height="1" fill="#000"/>
    <rect x="1" y="10" width="11" height="1" fill="#000"/>
    <rect x="1" y="11" width="5" height="1" fill="#000"/>
    <rect x="7" y="11" width="5" height="1" fill="#000"/>
    <rect x="2" y="12" width="4" height="1" fill="#000"/>
    <rect x="7" y="12" width="4" height="1" fill="#000"/>
    <rect x="3" y="13" width="3" height="1" fill="#000"/>
    <rect x="7" y="13" width="3" height="1" fill="#000"/>
  </svg>
</span>
```

- [ ] **Step 2: Update .apple sizing in MenuBar.module.css**

```css
.apple {
  padding: 0 10px;
  display: flex;
  align-items: center;
  cursor: default;
  height: var(--menu-bar-height);
}
```

- [ ] **Step 3: Run tests and build**

```bash
npm run test 2>&1 | tail -10
npm run build 2>&1 | tail -5
```

Expected: all tests pass, build clean.

- [ ] **Step 4: Commit everything**

```bash
git add src/components/MenuBar.jsx src/components/MenuBar.module.css \
        src/components/DesktopScene.jsx \
        src/test/MenuBar.test.jsx src/test/DesktopScene.test.jsx
git commit -m "feat: File menu Open/Close actions, Apple logo in menu bar"
```

---

## Final Verification

- [ ] **Run full test suite**

```bash
npm run test 2>&1
```

Expected: all tests PASS, zero failures.

- [ ] **Run production build**

```bash
npm run build 2>&1 | tail -8
```

Expected: `✓ built in ...` with no errors.
