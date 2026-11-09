// src/components/FolderWindowContent.jsx
//
// The inside of a Finder 1.0 disk or folder window: the information line
// ("N items   NNNK in disk   NNNK available", or "in folder") and the icons
// in a row: 32-pixel icons 64 Mac pixels apart, the first 12 pixels in from
// the window's top left, labels centred under them (measured from
// docs/reference/mac system 1/macsystem100032.png). An item's own `x` (Mac
// pixels from the content's left) places it where the Finder kept it.
// Single-click selects, double-click opens; the parent decides what opening
// means (a folder zooms open, a system file can't be opened). Dragging an
// icon moves it inside the window: a dotted outline of the icon follows the
// pointer in ~10fps steps (as on the desktop) and the icon lands where it is
// let go; `positions` ({ id: {x, y} }, Mac pixels) and `onMove` keep the
// places in the parent, so they last after the window closes.

import { useRef } from 'react'
import styles from './DraggableWindow.module.css'
import { toLocal, createOutline, moveOutline, removeOutline } from './desktopDrag'
import WindowScrollArea from './WindowScrollArea'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon, SystemFileIcon, UtilityIcon, IconShade } from './DesktopIcon'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const TOP = 12, PITCH = 64
const UTILITIES = ['diskcopy', 'fonts', 'fontmover', 'teachtext', 'sysversion']
const ICON_BOX = 100   // CSS px: DesktopIcon.module.css .icon width, the icon centred in it
const MAC_PX = 620 / 512
const SLOP = 3         // CSS px the pointer moves before a press becomes a drag

// Press on an icon: select it now; once the pointer moves, drag an outline of
// the icon's 32-pixel square; on release, call onDrop with the move in Mac px
function dragIcon(e, container, at, onDrop) {
  if (e.button !== 0 || !container) return
  const start = toLocal(container, e.clientX, e.clientY)
  let last = start, outline = null, timer = null
  const place = () => moveOutline(outline, at.x * MAC_PX + (last.x - start.x), at.y * MAC_PX + (last.y - start.y))
  const move = (ev) => {
    last = toLocal(container, ev.clientX, ev.clientY)
    if (!outline && Math.hypot(last.x - start.x, last.y - start.y) > SLOP) {
      outline = createOutline(container, { x: at.x * MAC_PX, y: at.y * MAC_PX, w: 32 * MAC_PX, h: 32 * MAC_PX })
      timer = setInterval(place, 100)
      place()
    }
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
    if (!outline) return
    clearInterval(timer)
    removeOutline(outline)
    onDrop({ x: Math.max(0, Math.round(at.x + (last.x - start.x) / MAC_PX)), y: Math.max(0, Math.round(at.y + (last.y - start.y) / MAC_PX)) })
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

function Glyph({ icon, selected }) {
  if (icon === 'folder') return <FolderIcon selected={selected} />
  if (icon === 'system') return <SystemFileIcon selected={selected} />
  if (UTILITIES.includes(icon)) return <UtilityIcon name={icon} selected={selected} />
  return <NotesIcon selected={selected} />
}

export default function FolderWindowContent({ items, left: LEFT = 12, inDisk, inFolder, available, selectedId, onSelect, onOpen, openedIds = [], positions = {}, onMove }) {
  const count = items.length
  const bodyRef = useRef(null)
  const at = (item, i) => positions[item.id] ?? { x: item.x ?? LEFT + PITCH * i, y: TOP }
  const places = items.map(at)
  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count} item{count === 1 ? '' : 's'}</span>
        {(inDisk ?? inFolder) != null && (
          <>
            <span className={styles.fileInfoText}>{inDisk != null ? `${inDisk}K in disk` : `${inFolder}K in folder`}</span>
            <span className={styles.fileInfoRight}>{available}K available</span>
          </>
        )}
      </div>
      <WindowScrollArea>
        <div ref={bodyRef} style={{ position: 'relative', width: mp(Math.max(...places.map(p => p.x + PITCH), LEFT)), height: mp(Math.max(...places.map(p => p.y + 32 + 20), TOP + 52)) }}>
          {items.map((item, i) => {
            const sel = selectedId === item.id
            return (
              <div
                key={item.id}
                className={`${iconStyles.icon} ${sel ? iconStyles.selected : ''}`}
                style={{ position: 'absolute', left: `calc(${mp(places[i].x)} - ${(ICON_BOX / 2)}px + ${mp(16)})`, top: mp(places[i].y) }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  onSelect?.(item.id)
                  if (onMove) dragIcon(e, bodyRef.current, places[i], (p) => onMove(item.id, p))
                }}
                onDoubleClick={(e) => { e.stopPropagation(); onOpen?.(item, e.currentTarget) }}
              >
                <IconShade opened={openedIds.includes(item.id)}>
                  <Glyph icon={item.icon} selected={sel} />
                </IconShade>
                <span className={`${iconStyles.label} ${sel ? iconStyles.labelSelected : ''}`}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </WindowScrollArea>
    </>
  )
}
