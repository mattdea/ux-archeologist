// src/components/DesktopScene.jsx
//
// The Finder 1.0 desktop. Four icons live on it: the startup disk at the top
// right, the Trash at the bottom right, and two items dragged out of the disk
// window (Projects, Notes). Everything the player can do here is something
// the 1984 Finder did: select with a click or a dotted marquee, drag outlines,
// open with zoom rectangles, Get Info, Clean Up, Empty Trash, Eject, the desk
// accessories under the Apple menu.
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import styles from './DesktopScene.module.css'
import MenuBar from './MenuBar'
import DesktopIcon from './DesktopIcon'
import DraggableWindow from './DraggableWindow'
import ScreenTexture from './ScreenTexture'
import MacAlert from './MacAlert'
import FolderWindowContent from './FolderWindowContent'
import InfoWindowContent from './InfoWindowContent'
import DeskAccessory, { DA_TITLES, DA_WIDTH, DA_VARIANT, DA_POS } from './da/DeskAccessory'
import { DA_ART } from './da/daArt'
import { useMacSetting } from './macSettings'
import AboutFinder from './da/AboutFinder'
import { useAlarmClock } from './da/AlarmClock'
import * as sfx from '../audio/sfx'
import { toLocal, createOutline, moveOutline, removeOutline } from './desktopDrag'
import { zoomRects, localRect } from './zoomRects'

// Boot reveal order: 0 = bare desktop, 1 = menu bar, 2 = disk + Projects,
// 3 = Notes, 4 = Trash (everything). The boot sequence steps this up so the
// real menu bar and icons appear in place; nothing is swapped or moved.
export const REVEAL_ALL = 4
const shown = (on) => (on ? undefined : 'hidden')

// Icon grid for Clean Up: columns step left from the disk's column, rows
// step down from the top. Default positions sit on it. Measured from
// docs/reference/mac system 1/macsystem100025.png in Mac pixels: the
// icons' left edges at x 455, System Disk at y 28, Welcome! at 92, the
// Trash at 284 (a 64-pixel grid). An icon's box is 100 CSS px wide with the
// 32-pixel icon centred, so x is the box's left edge.
const MACPX = 620 / 512
const iconBoxX = (macX) => macX * MACPX - (100 - 32 * MACPX) / 2
const GRID = { x0: iconBoxX(455), y0: 28 * MACPX, dx: 64 * MACPX, dy: 64 * MACPX, cols: 7, rows: 5 }
const DISK_NAME = 'System Disk'

const ICONS = {
  disk:     { label: DISK_NAME, icon: 'disk',   reveal: 2 },
  projects: { label: 'Projects', icon: 'folder', reveal: 2 },
  notes:    { label: 'Notes',    icon: 'notes',  reveal: 3 },
  trash:    { label: 'Trash',    icon: 'trash',  reveal: 4 },
}
// System Disk and the Trash where the real ones are; Notes where the
// disk's "Welcome!" document sits; Projects on the next grid row
const DEFAULT_POS = {
  disk:     { x: GRID.x0, y: GRID.y0 },
  notes:    { x: GRID.x0, y: GRID.y0 + GRID.dy },
  projects: { x: GRID.x0, y: GRID.y0 + 2 * GRID.dy },
  trash:    { x: GRID.x0, y: GRID.y0 + 4 * GRID.dy },
}
const TRASHABLE = ['projects', 'notes']

// What the disk holds. The 1984 System Disk: a System Folder and the Empty
// Folder you renamed to make a new one (Finder 1.0 had no New Folder).
const DISK_ITEMS = [
  { id: 'sysfolder',   label: 'System Folder', icon: 'folder' },
  { id: 'emptyfolder', label: 'Empty Folder',  icon: 'folder' },
]
const SYSFOLDER_ITEMS = [   // in the Finder's order (macsystem100032.png)
  { id: 'system',    label: 'System',         icon: 'system' },
  { id: 'finder',    label: 'Finder',         icon: 'system' },
  { id: 'imagewriter', label: 'Imagewriter',  icon: 'system' },
  { id: 'clipboardfile', label: 'Clipboard File', icon: 'system' },
  { id: 'notepadfile', label: 'Note Pad File', icon: 'system' },
  { id: 'scrapbookfile', label: 'Scrapbook File', icon: 'system' },
]
const DISK_K = { inDisk: 216, available: 184, inSysFolder: 208 }

// Get Info text for each item, in the 1984 manual's formats
// ("Size: 55248 bytes, accounts for 55K on disk"; "Where: Write/Paint,
// internal drive"; "Created: Tuesday, January 24, 1984 at 10:05 AM")
const INFO = {
  disk: { kind: 'disk', size: '221184 bytes used for 10 files', where: 'internal drive',
    created: 'Tuesday, January 24, 1984 at 9:00 AM', modified: 'Wednesday, January 25, 1984 at 4:02 PM', comment: '' },
  projects: { kind: 'folder', size: '5632 bytes, accounts for 6K on disk', where: `${DISK_NAME}, internal drive`,
    created: 'Tuesday, January 24, 1984 at 2:15 PM', modified: 'Wednesday, January 25, 1984 at 11:40 AM', comment: 'Budget, letter and sketch for the partners meeting.' },
  notes: { kind: 'MacWrite document', size: '1432 bytes, accounts for 2K on disk', where: `${DISK_NAME}, internal drive`,
    created: 'Wednesday, January 25, 1984 at 9:14 AM', modified: 'Wednesday, January 25, 1984 at 4:02 PM', comment: 'First day with the Macintosh.' },
}

// Get Info windows: 384 Mac pixels inside the frame, opened where the real
// Finder put the System Disk's (macsystem100022.png)
const INFO_WIDTH = 'calc(var(--mac-px) * 384 + 2px)'
const INFO_POS = { x: 45 * 620 / 512, y: 55 * 620 / 512 }

// The menu bar: 20 Mac pixels (this screen draws 512 Mac pixels across 620)
const MENU_BAR = 20 * 620 / 512

const WINDOW_POS = {
  disk: { x: 40, y: 48 }, sysfolder: { x: 70, y: 70 }, emptyfolder: { x: 90, y: 90 },
  projects: { x: 80, y: 50 }, notes: { x: 60, y: 55 }, trash: { x: 90, y: 60 },
}

// The Finder's own windows open at these sizes and can be grown from the
// corner. The disk window fits its icons, so it opens with nothing to scroll
// (white tracks); the System Folder's six icons need the horizontal bar.
const FINDER_SIZE = {
  disk: { w: 340, h: 150 }, sysfolder: { w: 340, h: 150 }, emptyfolder: { w: 260, h: 130 },
  projects: { w: 340, h: 150 }, trash: { w: 300, h: 150 },
}

export default function DesktopScene({ completeObjective, active, reveal = REVEAL_ALL, onDiskAccess }) {
  // windows: [{ id, type, title, pos, z, hidden, src, item }]
  //   type: 'disk'|'sysfolder'|'emptyfolder'|'projects'|'notes'|'trash'|'info'|'calculator'|'notepad'|'puzzle'|'alarm'|'about'
  //   src: desktop icon id the window zooms from and back to (if any)
  const [windows, setWindows] = useState([])
  const zRef = useRef(20)
  const [trashContents, setTrashContents] = useState([])
  const [deleted, setDeleted] = useState([])          // removed by Empty Trash
  const [iconPositions, setIconPositions] = useState(DEFAULT_POS)
  const [selected, setSelected] = useState([])         // desktop icon ids
  const [trashHighlighted, setTrashHighlighted] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)
  const [locked, setLocked] = useState({ notes: true }) // Notes is a locked document
  const [ejected, setEjected] = useState(false)        // disk out: icon dimmed
  const [marquee, setMarquee] = useState(null)         // {x,y,w,h} desktop px
  const [folderSel, setFolderSel] = useState(null)     // selected item inside a window

  const onDesktop = (id) => id === 'trash' || (id === 'disk') || (!trashContents.includes(id) && !deleted.includes(id))
  const desktopIds = Object.keys(ICONS).filter(onDesktop)

  // Drop selection of icons that left the desktop
  useEffect(() => {
    setSelected(prev => prev.filter(onDesktop))
  }, [trashContents, deleted]) // eslint-disable-line react-hooks/exhaustive-deps

  const desktopRef = useRef(null)
  const iconEls = useRef({})                           // id → element
  const setIconEl = (id) => (el) => { iconEls.current[id] = el }
  const iconRect = (id) => localRect(desktopRef.current, iconEls.current[id])
  const winEl = (id) => desktopRef.current?.querySelector(`[data-win="${id}"]`)

  // ── Windows, with zoom rectangles ──────────────────────────────────
  const pendingZoom = useRef({})                       // id → from rect

  const raise = (id) => {
    const z = zRef.current++
    setWindows(prev => prev.map(w => w.id === id ? { ...w, z } : w))
  }

  // Open (or raise) a window. `from` is the rect the zoom starts at; with
  // none (desk accessories) the window simply appears, as DAs did.
  const openWindow = (type, { id = type, title, from, src, item, pos } = {}) => {
    const existing = windows.find(w => w.id === id)
    if (existing) { raise(id); return }
    onDiskAccess?.()   // the Finder reads the disk to open anything
    if (from) pendingZoom.current[id] = from
    const z = zRef.current++
    setWindows(prev => [...prev, { id, type, title, pos: pos ?? WINDOW_POS[type] ?? { x: 100, y: 70 }, z, hidden: !!from, src, item }])
  }

  // After a hidden window mounts, zoom out to it, then show it
  useLayoutEffect(() => {
    const desktop = desktopRef.current
    for (const w of windows) {
      const from = pendingZoom.current[w.id]
      if (!w.hidden || !from) continue
      delete pendingZoom.current[w.id]
      const to = localRect(desktop, winEl(w.id))
      zoomRects(desktop, from, to).then(() => {
        setWindows(prev => prev.map(x => x.id === w.id ? { ...x, hidden: false } : x))
      })
    }
  }, [windows])

  const closeWindow = (id) => {
    const w = windows.find(x => x.id === id)
    if (!w) return
    const desktop = desktopRef.current
    const fromRect = localRect(desktop, winEl(id))
    const to = w.src ? (iconRect(w.src) || null) : null
    if (!fromRect || !to) {
      setWindows(prev => prev.filter(x => x.id !== id))
      return
    }
    setWindows(prev => prev.map(x => x.id === id ? { ...x, hidden: true, closing: true } : x))
    zoomRects(desktop, fromRect, to).then(() => {
      setWindows(prev => prev.filter(x => x.id !== id))
    })
  }

  const topWindow = () => windows.filter(w => !w.hidden).reduce((a, b) => (!a || b.z > a.z ? b : a), null)
  const closeTopWindow = () => { const t = topWindow(); if (t) closeWindow(t.id) }

  // Open a desktop icon
  const openIcon = (id) => {
    if (id === 'disk') {
      if (ejected) {
        sfx.beep()
        setAlertMsg(`Please insert the disk:\n${DISK_NAME}`)
        return
      }
      openWindow('disk', { title: DISK_NAME, from: iconRect('disk'), src: 'disk' })
    } else if (id === 'projects') {
      openWindow('projects', { title: 'Projects', from: iconRect('projects'), src: 'projects' })
    } else if (id === 'notes') {
      // Opening a document from the Finder closed every desk accessory
      setWindows(prev => prev.filter(w => !DA_TITLES[w.type]))
      openWindow('notes', { title: 'Notes', from: iconRect('notes'), src: 'notes' })
      completeObjective('openFolder')
    } else if (id === 'trash') {
      openWindow('trash', { title: 'Trash', from: iconRect('trash'), src: 'trash' })
    }
  }

  // Open an item inside a window (System Folder, a system file…)
  const openInner = (item, el) => {
    const from = localRect(desktopRef.current, el)
    if (item.icon === 'folder') {
      openWindow(item.id, { title: item.label, from, src: null, pos: WINDOW_POS[item.id] })
    } else {
      // Finder 1.0's wording for a file with no application to open it
      sfx.beep()
      setAlertMsg(`The file “${item.label}” could not be opened/printed (the application is busy or missing).`)
    }
  }

  // ── Selection ──────────────────────────────────────────────────────
  const handleIconMouseDown = (id, e) => {
    e.stopPropagation()
    setFolderSel(null)
    if (e.shiftKey) {
      setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    } else if (!selected.includes(id)) {
      setSelected([id])
    }
  }

  // Marquee: press on the bare desktop, drag a dotted rectangle; icons it
  // touches are selected as it grows.
  const marqueeStart = useRef(null)
  const marqueeMoved = useRef(false)
  const marqueeRect  = useRef(null)
  const handleDesktopMouseDown = (e) => {
    if (e.target !== e.currentTarget && !e.target.closest(`.${styles.bgLayer}`)) return
    if (e.button !== 0) return
    const desktop = desktopRef.current
    const start = toLocal(desktop, e.clientX, e.clientY)
    if (start.y < MENU_BAR) return   // menu bar
    const base = e.shiftKey ? selected : []
    if (!e.shiftKey) { setSelected([]); setFolderSel(null); setTrashSel(null) }
    marqueeStart.current = start
    marqueeMoved.current = false

    const move = (ev) => {
      const p = toLocal(desktop, ev.clientX, ev.clientY)
      const r = {
        x: Math.min(start.x, p.x), y: Math.max(MENU_BAR, Math.min(start.y, p.y)),
        w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y),
      }
      if (r.w < 2 && r.h < 2) return
      marqueeMoved.current = true
      marqueeRect.current = r
    }
    // Redrawn at ~10fps, as the 8 MHz 68000 drew drag outlines
    const tick = setInterval(() => { if (marqueeRect.current) setMarquee(marqueeRect.current) }, 100)
    // "When you release the mouse button, the icons are selected" (1984 manual)
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      clearInterval(tick)
      marqueeStart.current = null
      const r = marqueeRect.current
      marqueeRect.current = null
      setMarquee(null)
      if (!r) return
      const hit = desktopIds.filter(id => {
        const ir = iconRect(id)
        return ir && ir.x < r.x + r.w && ir.x + ir.w > r.x && ir.y < r.y + r.h && ir.y + ir.h > r.y
      })
      setSelected([...new Set([...base, ...hit])])
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  // ── Icon drag (HTML5 DnD, dashed outlines, group moves) ───────────
  const dragOutlines  = useRef([])     // [{ el, dx, dy }] offsets from the primary icon position
  const dragMousePos  = useRef({ x: 0, y: 0 })
  const dragInterval  = useRef(null)
  const dragResult    = useRef(null)   // 'trashed' once a drop handled it
  const dragGroup     = useRef([])     // icon ids moving together
  const trackMouseRef = useRef(null)
  const iconGrab      = useRef({ x: -70, y: -20 })
  const graphicOffset = useRef({ x: 30, y: 0, w: 40, h: 40 })

  // Icon graphic box relative to its icon element, in desktop px
  const measureGraphic = (iconEl) => {
    const desktop = desktopRef.current
    const g = iconEl?.firstElementChild
    if (!desktop || !g) return graphicOffset.current
    const ir = iconEl.getBoundingClientRect(), gr = g.getBoundingClientRect()
    const i = toLocal(desktop, ir.left, ir.top)
    const a = toLocal(desktop, gr.left, gr.top)
    const z = toLocal(desktop, gr.right, gr.bottom)
    return { x: a.x - i.x, y: a.y - i.y, w: z.x - a.x, h: z.y - a.y }
  }

  // Icon position for a pointer (screen px), clamped to the desktop
  const iconPosForPointer = (clientX, clientY) => {
    const desktop = desktopRef.current
    const m = toLocal(desktop, clientX, clientY)
    return {
      x: Math.max(4, Math.min(desktop.offsetWidth - 56, m.x + iconGrab.current.x)),
      y: Math.max(34, Math.min(desktop.offsetHeight - 70, m.y + iconGrab.current.y)),
    }
  }

  // iconEl: the desktop icon being dragged; `group` the ids moving with it.
  // Omitted for items dragged out of the Trash window; those get an
  // icon-sized outline centred on the cursor.
  const startDragOutline = (clientX, clientY, iconEl, group = []) => {
    const desktop = desktopRef.current
    if (!desktop) return
    stopDragOutline()
    const m = toLocal(desktop, clientX, clientY)
    if (iconEl) {
      graphicOffset.current = measureGraphic(iconEl)
      const ir = iconEl.getBoundingClientRect()
      const i = toLocal(desktop, ir.left, ir.top)
      iconGrab.current = { x: i.x - m.x, y: i.y - m.y }
    } else {
      const g = graphicOffset.current = measureGraphic(iconEls.current.trash)
      iconGrab.current = { x: -(g.x + g.w / 2), y: -(g.y + g.h / 2) }
    }
    const g = graphicOffset.current
    const primary = iconEl ? toLocal(desktop, iconEl.getBoundingClientRect().left, iconEl.getBoundingClientRect().top) : null
    const place = (cx, cy) => {
      const p = iconPosForPointer(cx, cy)
      return { x: p.x + g.x, y: p.y + g.y }
    }
    const start = place(clientX, clientY)
    const members = group.length ? group : [null]
    dragOutlines.current = members.map(id => {
      let dx = 0, dy = 0
      if (id && primary) {
        const r = iconRect(id)
        if (r) { dx = r.x - primary.x; dy = r.y - primary.y }
      }
      return { el: createOutline(desktop, { x: start.x + dx, y: start.y + dy, w: g.w, h: g.h }), dx, dy }
    })
    dragMousePos.current = { x: clientX, y: clientY }

    // Stutter: update position at ~10fps (every 100ms) like the 8MHz 68000
    dragInterval.current = setInterval(() => {
      const { x, y } = place(dragMousePos.current.x, dragMousePos.current.y)
      dragOutlines.current.forEach(o => moveOutline(o.el, x + o.dx, y + o.dy))
    }, 100)

    const trackMouse = (e) => { dragMousePos.current = { x: e.clientX, y: e.clientY } }
    trackMouseRef.current = trackMouse
    // dragover fires during HTML5 drag; pointermove is suppressed by the browser
    document.addEventListener('dragover', trackMouse)
  }

  const stopDragOutline = () => {
    if (dragInterval.current) { clearInterval(dragInterval.current); dragInterval.current = null }
    if (trackMouseRef.current) {
      document.removeEventListener('dragover', trackMouseRef.current)
      trackMouseRef.current = null
    }
    dragOutlines.current.forEach(o => removeOutline(o.el))
    dragOutlines.current = []
  }
  useEffect(() => () => stopDragOutline(), [])

  const handleIconDragStart = (id, e) => {
    const group = selected.includes(id) ? selected : [id]
    if (!selected.includes(id)) setSelected([id])
    dragGroup.current = group
    dragResult.current = null
    e.dataTransfer.setData('text/plain', id)
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
    startDragOutline(e.clientX, e.clientY, e.currentTarget, group)
  }

  const handleIconDragEnd = (id, e) => {
    const offsets = dragOutlines.current.map(o => ({ dx: o.dx, dy: o.dy }))
    stopDragOutline()
    if (dragResult.current === 'trashed') return  // positions handled by the drop
    if (!desktopRef.current) return
    // dragend's own coordinates are unreliable; use the last dragover point
    const mouseX = dragMousePos.current?.x ?? e.clientX
    const mouseY = dragMousePos.current?.y ?? e.clientY
    const pos = iconPosForPointer(mouseX, mouseY)
    const group = dragGroup.current.length ? dragGroup.current : [id]
    setIconPositions(prev => {
      const next = { ...prev }
      group.forEach((gid, i) => {
        const o = offsets[i] || { dx: 0, dy: 0 }
        next[gid] = { x: pos.x + o.dx, y: pos.y + o.dy }
      })
      return next
    })
  }

  const handleTrashDragOver = (e) => {
    e.preventDefault()
    if (dragGroup.current.includes('trash')) return  // repositioning the Trash itself
    setTrashHighlighted(true)
  }
  const handleTrashDragLeave = () => setTrashHighlighted(false)

  // Drop on the Trash: documents and folders go in; the disk ejects.
  const trashItems = (ids) => {
    const items = ids.filter(id => TRASHABLE.includes(id))
    if (items.length) {
      setTrashContents(prev => [...new Set([...prev, ...items])])
      if (items.includes('projects')) completeObjective('trashFile')
    }
    if (ids.includes('disk')) ejectDisk(true)
    return items.length > 0 || ids.includes('disk')
  }

  const handleTrashDrop = (e) => {
    e.preventDefault()
    setTrashHighlighted(false)
    const item = e.dataTransfer.getData('text/plain')
    if (item === 'trash' || dragGroup.current.includes('trash')) return  // dragend repositions
    const group = dragGroup.current.length ? dragGroup.current : [item]
    if (trashItems(group)) dragResult.current = 'trashed'
    stopDragOutline()
  }

  // Items dragged back out of the Trash window onto the desktop
  const handleDesktopDrop = (e) => {
    e.preventDefault()
    const item = e.dataTransfer.getData('text/plain')
    const m = item.match(/^(projects|notes)-restore$/)
    if (!m) return
    stopDragOutline()
    const id = m[1]
    setTrashContents(prev => prev.filter(x => x !== id))
    const pos = iconPosForPointer(e.clientX, e.clientY)
    setIconPositions(prev => ({ ...prev, [id]: pos }))
  }

  // ── Touch drag (documents and folders to the Trash) ───────────────
  const touchGhost = useRef(null)
  const touchItem  = useRef(null)
  const overTrash = (x, y) => {
    const r = iconEls.current.trash?.getBoundingClientRect()
    return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }
  const handleTouchStart = (id) => (e) => {
    if (!TRASHABLE.includes(id)) return
    const t = e.touches[0]
    touchItem.current = id
    const ghost = document.createElement('div')
    ghost.style.cssText = `position:fixed;width:40px;height:44px;background:rgba(255,255,255,0.8);border:1px solid #000;pointer-events:none;z-index:9999;left:${t.clientX - 20}px;top:${t.clientY - 22}px`
    document.body.appendChild(ghost)
    touchGhost.current = ghost
  }
  const handleTouchEnd = (e) => {
    const id = touchItem.current
    touchItem.current = null
    touchGhost.current?.remove(); touchGhost.current = null
    if (!id) return
    const t = e.changedTouches[0]
    setTrashHighlighted(false)
    if (overTrash(t.clientX, t.clientY)) trashItems([id])
  }
  useEffect(() => {
    const desktop = desktopRef.current
    if (!desktop) return
    const move = (e) => {
      if (!touchItem.current || !touchGhost.current) return
      e.preventDefault()
      const t = e.touches[0]
      touchGhost.current.style.left = `${t.clientX - 20}px`
      touchGhost.current.style.top = `${t.clientY - 22}px`
      setTrashHighlighted(!!overTrash(t.clientX, t.clientY))
    }
    desktop.addEventListener('touchmove', move, { passive: false })
    return () => desktop.removeEventListener('touchmove', move)
  }, [])

  // ── Menu commands ──────────────────────────────────────────────────
  const handleMenuItemClick = () => completeObjective('useMenu')

  const handleMenuOpen = () => {
    if (!selected.length) return
    selected.forEach(openIcon)
  }

  const handleGetInfo = () => {
    const id = selected[0]
    if (!id) return
    const info = INFO[id]
    if (!info) return
    openWindow('info', {
      id: `info-${id}`, title: `Information about ${ICONS[id].label}`, from: iconRect(id), src: id,
      item: { id, label: ICONS[id].label, icon: ICONS[id].icon, ...info },
      pos: (n => ({ x: INFO_POS.x + 20 * n, y: INFO_POS.y + 20 * n }))(windows.filter(w => w.type === 'info').length),
    })
  }

  // Special ▸ Clean Up: every desktop icon snaps to the nearest free grid
  // slot, as Finder 1.0 tidied icons in place rather than re-sorting them.
  const handleCleanUp = () => {
    const slot = (p) => ({
      c: Math.max(0, Math.min(GRID.cols - 1, Math.round((GRID.x0 - p.x) / GRID.dx))),
      r: Math.max(0, Math.min(GRID.rows - 1, Math.round((p.y - GRID.y0) / GRID.dy))),
    })
    const taken = new Set()
    const next = { ...iconPositions }
    desktopIds.forEach(id => {
      let { c, r } = slot(iconPositions[id])
      // Walk down, then to the next column, until a slot is free
      for (let tries = 0; taken.has(`${c},${r}`) && tries < GRID.cols * GRID.rows; tries++) {
        r++
        if (r >= GRID.rows) { r = 0; c = (c + 1) % GRID.cols }
      }
      taken.add(`${c},${r}`)
      next[id] = { x: GRID.x0 - c * GRID.dx, y: GRID.y0 + r * GRID.dy }
    })
    setIconPositions(next)
  }

  // Special ▸ Empty Trash. The Finder writes to the disk (drive light, watch
  // cursor) and deletes everything in the Trash for good, silently, as in
  // 1984. A locked item stays, and an alert explains why with the system
  // beep. Notes starts locked (File ▸ Get Info shows the box), which keeps
  // the "find the document" objective reachable.
  const handleEmptyTrash = () => {
    if (!trashContents.length) return
    onDiskAccess?.()
    const keep = trashContents.filter(x => locked[x])
    const gone = trashContents.filter(x => !locked[x])
    setDeleted(prev => [...new Set([...prev, ...gone])])
    setTrashContents(keep)
    setWindows(prev => prev.filter(w => !gone.includes(w.type) && !gone.some(g => w.id === `info-${g}`)))
    if (keep.length) {
      setTimeout(() => {
        sfx.beep()
        setAlertMsg(`The Trash could not be emptied completely. “${ICONS[keep[0]].label}” is locked.`)
      }, 700)
    }
  }

  // File ▸ Eject (or dragging the disk to the Trash): the drive pushes the
  // floppy out. Eject leaves a dimmed ghost of the disk on the desktop, as
  // Finder 1.0 did, so you could still work with what it remembered; its
  // windows close. There is no second disk here, so a moment later the
  // player "pushes it back in" and the icon returns.
  const ejectTimer = useRef(null)
  const ejectDisk = () => {
    if (ejected) return
    onDiskAccess?.()
    setEjected(true)
    setWindows(prev => prev.filter(w => !['disk', 'sysfolder', 'emptyfolder'].includes(w.type)))
    setSelected(prev => prev.filter(x => x !== 'disk'))
    clearTimeout(ejectTimer.current)
    ejectTimer.current = setTimeout(() => { onDiskAccess?.(); setEjected(false) }, 3000)
  }
  useEffect(() => () => clearTimeout(ejectTimer.current), [])

  const [about, setAbout] = useState(false)
  const [daInstance, setDaInstance] = useState({})
  const [alarmRinging, setAlarmRinging] = useState(false)
  const onRing = useCallback(() => setAlarmRinging(true), [])
  const clock = useAlarmClock({ onRing })
  const handleDeskAccessory = (name) => {
    if (name === 'about') { setAbout(true); return }
    if (name === 'alarm') setAlarmRinging(false)   // choosing the Alarm Clock stops the blinking Apple
    if (windows.some(w => w.id === name)) setDaInstance(d => ({ ...d, [name]: (d[name] || 0) + 1 }))
    const at = DA_POS[name]
    openWindow(name, { title: DA_TITLES[name], pos: at ? { x: at.x * 620 / 512, y: at.y * 620 / 512 } : { x: 120 + 24 * windows.length, y: 60 + 16 * windows.length } })
  }

  // File ▸ Close All: Finder windows zoom back to their icons; desk
  // accessories "just disappear".
  const closeAll = () => {
    setWindows(prev => prev.filter(w => !DA_TITLES[w.type]))
    windows.filter(w => !DA_TITLES[w.type]).forEach(w => closeWindow(w.id))
  }

  // Edit ▸ Select All: every icon on the desktop (no directory window is
  // the active one here; icons are selected where they live)
  const selectAll = () => setSelected(desktopIds)

  // File ▸ Put Back: the item selected in the Trash window returns home,
  // an outline flying back to where its icon was.
  const [trashSel, setTrashSel] = useState(null)
  const putBack = () => {
    const id = trashSel
    if (!id || !trashContents.includes(id)) return
    const desktop = desktopRef.current
    const el = desktop?.querySelector(`[data-trash-item="${id}"]`)
    const from = localRect(desktop, el)
    const pos = iconPositions[id]
    const to = { x: pos.x, y: pos.y, w: 100, h: 62 }
    setTrashSel(null)
    const finish = () => setTrashContents(prev => prev.filter(x => x !== id))
    if (from) zoomRects(desktop, from, to).then(finish); else finish()
  }

  // ── Render ─────────────────────────────────────────────────────────
  const canOpen = selected.length > 0 && selected.some(id => !windows.some(w => w.id === id))
  const infoSelected = selected.length === 1 && !!INFO[selected[0]]
  const daOf = (w) => DA_TITLES[w.type] ? w.type : null

  // The active window: the frontmost one not zooming shut (one still zooming
  // open already counts). The rest draw inactive.
  // An icon is shaded while its window is open (not once it starts to close)
  const openedIds = windows.filter(w => !w.closing).map(w => w.id)
  const [desktopPattern] = useMacSetting('desktopPattern')   // set in the Control Panel
  const frontId = windows.filter(w => !w.closing).reduce((a, b) => (!a || b.z > a.z ? b : a), null)?.id
  const windowTitle = (w) => w.title ?? ICONS[w.type]?.label ?? ''
  const windowContent = (w) => {
    switch (w.type) {
      case 'disk':
        return <FolderWindowContent items={DISK_ITEMS} inDisk={DISK_K.inDisk} available={DISK_K.available} selectedId={folderSel} onSelect={setFolderSel} onOpen={openInner} openedIds={openedIds} />
      case 'sysfolder':
        return <FolderWindowContent items={SYSFOLDER_ITEMS} inFolder={DISK_K.inSysFolder} available={DISK_K.available} selectedId={folderSel} onSelect={setFolderSel} onOpen={openInner} />
      case 'emptyfolder':
        return <FolderWindowContent items={[]} />
      case 'info':
        return <InfoWindowContent item={w.item} locked={!!locked[w.item.id]} onToggleLock={() => setLocked(l => ({ ...l, [w.item.id]: !l[w.item.id] }))} />
      case 'calculator': case 'notepad': case 'puzzle': case 'alarm': case 'keycaps': case 'controlpanel': case 'scrapbook':
        return <DeskAccessory name={w.type} instance={daInstance[w.type] || 0} clock={clock} />
      default:
        return null   // projects / notes / trash: DraggableWindow's built-ins
    }
  }

  return (
    <div
      ref={desktopRef}
      className={`${styles.desktop} ${!active ? styles.inactive : ''}`}
      onMouseDown={handleDesktopMouseDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDesktopDrop}
    >
      <div className={styles.bgLayer}><ScreenTexture pattern={desktopPattern} /></div>

      <div style={{ visibility: shown(reveal >= 1) }}>
      <MenuBar
        onMenuItemClick={handleMenuItemClick}
        canOpen={canOpen}
        canClose={windows.length > 0}
        onOpen={handleMenuOpen}
        onClose={closeTopWindow}
        canEmptyTrash={trashContents.length > 0}
        onEmptyTrash={handleEmptyTrash}
        canGetInfo={infoSelected}
        onGetInfo={handleGetInfo}
        onCleanUp={handleCleanUp}
        canEject={selected.includes('disk') && !ejected}
        onEject={ejectDisk}
        onDeskAccessory={handleDeskAccessory}
        canPutBack={!!trashSel && trashContents.includes(trashSel)}
        onPutBack={putBack}
        onCloseAll={closeAll}
        onSelectAll={selectAll}
        alarmRinging={alarmRinging}
      />
      </div>

      {desktopIds.map(id => {
        const def = ICONS[id]
        const pos = iconPositions[id]
        return (
          <DesktopIcon
            key={id}
            ref={setIconEl(id)}
            data-icon={id}
            label={def.label}
            icon={def.icon}
            isFull={id === 'trash' && trashContents.length > 0}
            isHighlighted={id === 'trash' && trashHighlighted}
            isSelected={selected.includes(id)}
            isOpened={openedIds.includes(id)}
            className={id === 'disk' && ejected ? styles.ejected : ''}
            style={{ position: 'absolute', left: pos.x, top: pos.y, visibility: shown(reveal >= def.reveal) }}
            draggable={true}
            onMouseDown={(e) => handleIconMouseDown(id, e)}
            onDoubleClick={() => openIcon(id)}
            onDragStart={(e) => handleIconDragStart(id, e)}
            onDragEnd={(e) => handleIconDragEnd(id, e)}
            onDragOver={id === 'trash' ? handleTrashDragOver : undefined}
            onDragLeave={id === 'trash' ? handleTrashDragLeave : undefined}
            onDrop={id === 'trash' ? handleTrashDrop : undefined}
            onTouchStart={handleTouchStart(id)}
            onTouchEnd={handleTouchEnd}
          />
        )
      })}

      {windows.map(win => (
        <DraggableWindow
          active={win.id === frontId}
          key={win.id}
          id={win.id}
          type={win.type}
          title={windowTitle(win)}
          initialPos={win.pos}
          zIndex={win.z}
          hidden={win.hidden}
          width={DA_WIDTH[win.type] ?? (win.type === 'info' ? INFO_WIDTH : undefined)}
          variant={DA_VARIANT[win.type] ?? 'doc'}
          art={win.type === 'alarm' && clock.open ? DA_ART.alarmOpen : DA_ART[win.type]}
          size={FINDER_SIZE[win.type]}
          resizable={!!FINDER_SIZE[win.type]}
          onClose={() => closeWindow(win.id)}
          onFocus={() => raise(win.id)}
          trashContents={win.type === 'trash' ? trashContents : undefined}
          trashSelected={win.type === 'trash' ? trashSel : undefined}
          onTrashSelect={win.type === 'trash' ? setTrashSel : undefined}
          onItemDragStart={win.type === 'trash' ? startDragOutline : undefined}
          onItemDragEnd={win.type === 'trash' ? stopDragOutline : undefined}
        >
          {windowContent(win)}
        </DraggableWindow>
      ))}

      {marquee && (
        <svg className={styles.marquee} aria-hidden="true">
          <rect x={marquee.x + 0.5} y={marquee.y + 0.5} width={Math.max(0, marquee.w - 1)} height={Math.max(0, marquee.h - 1)}
                fill="none" stroke="#000" strokeWidth="1" strokeDasharray="1 1" shapeRendering="crispEdges" />
        </svg>
      )}

      {about && <AboutFinder onClose={() => setAbout(false)} />}
      {alertMsg && <MacAlert message={alertMsg} onOk={() => setAlertMsg(null)} />}
    </div>
  )
}
