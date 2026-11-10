// src/components/FolderWindowContent.jsx
//
// The inside of a Finder 1.0 disk, folder or Trash window: the information
// line ("N items   NNNK in disk   NNNK available", or "in folder") and the
// icons: 32-pixel icons, the first 12 pixels in from the window's top left,
// labels centred under them (measured from
// docs/reference/mac system 1/macsystem100032.png). Each item sits at its
// place in `positions` ({ id: {x, y} }, Mac pixels, the glyph's top left).
//
// Single-click selects, double-click opens; the parent decides what opening
// means. Icons are dragged with the desktop's own drag (HTML5 drag events,
// the dashed outline drawn by DesktopScene), so they can leave the window:
// onto the desktop, into another window, onto a folder, disk or Trash icon.
// The body carries data-container so a drop inside it lands here; folder
// icons carry data-drop-target so a drop on them files the item inside.

import styles from './DraggableWindow.module.css'
import WindowScrollArea from './WindowScrollArea'
import iconStyles from './DesktopIcon.module.css'
import { Glyph, IconShade } from './DesktopIcon'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const TOP = 12, PITCH = 64
const ICON_BOX = 100   // CSS px: DesktopIcon.module.css .icon width, the icon centred in it

export default function FolderWindowContent({
  container, items, left: LEFT = 12, inDisk, inFolder, available, emptyNote,
  selectedId, highlightedId, onSelect, onOpen, openedIds = [], positions = {},
  onItemDragStart, onItemDragEnd, isDropTarget,
}) {
  const count = items.length
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
        {emptyNote && count === 0 && (
          <>
            <span className={styles.fileInfoText}>{emptyNote}</span>
            <span />
          </>
        )}
      </div>
      <WindowScrollArea>
        <div
          data-container={container}
          style={{ position: 'relative', minHeight: '100%', width: mp(Math.max(...places.map(p => p.x + PITCH), LEFT)), height: mp(Math.max(...places.map(p => p.y + 32 + 20), TOP + 52)) }}
        >
          {items.map((item, i) => {
            const sel = selectedId === item.id
            const lit = highlightedId === item.id
            return (
              <div
                key={item.id}
                data-item={item.id}
                data-drop-target={isDropTarget?.(item.id) ? item.id : undefined}
                draggable={true}
                className={`${iconStyles.icon} ${sel ? iconStyles.selected : ''}`}
                style={{ position: 'absolute', left: `calc(${mp(places[i].x)} - ${(ICON_BOX / 2)}px + ${mp(16)})`, top: mp(places[i].y) }}
                onMouseDown={(e) => { e.stopPropagation(); onSelect?.(item.id) }}
                onDoubleClick={(e) => { e.stopPropagation(); onOpen?.(item.id, e.currentTarget) }}
                onDragStart={(e) => onItemDragStart?.(item.id, e)}
                onDragEnd={(e) => onItemDragEnd?.(item.id, e)}
              >
                <IconShade opened={openedIds.includes(item.id)}>
                  <Glyph icon={item.icon} inverted={sel || lit} full={item.full} />
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
