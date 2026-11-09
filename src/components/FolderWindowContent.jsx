// src/components/FolderWindowContent.jsx
//
// The inside of a Finder 1.0 disk or folder window: the information line
// ("N items   NNNK in disk   NNNK available", or "in folder") and the icons
// in a row: 32-pixel icons 64 Mac pixels apart, the first 12 pixels in from
// the window's top left, labels centred under them (measured from
// docs/reference/mac system 1/macsystem100032.png). An item's own `x` (Mac
// pixels from the content's left) places it where the Finder kept it.
// Single-click selects, double-click opens; the parent decides what opening
// means (a folder zooms open, a system file can't be opened).

import styles from './DraggableWindow.module.css'
import WindowScrollArea from './WindowScrollArea'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon, SystemFileIcon, UtilityIcon, IconShade } from './DesktopIcon'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const TOP = 12, PITCH = 64
const UTILITIES = ['diskcopy', 'fonts', 'fontmover', 'teachtext', 'sysversion']
const ICON_BOX = 100   // CSS px: DesktopIcon.module.css .icon width, the icon centred in it

function Glyph({ icon, selected }) {
  if (icon === 'folder') return <FolderIcon selected={selected} />
  if (icon === 'system') return <SystemFileIcon selected={selected} />
  if (UTILITIES.includes(icon)) return <UtilityIcon name={icon} selected={selected} />
  return <NotesIcon selected={selected} />
}

export default function FolderWindowContent({ items, left: LEFT = 12, inDisk, inFolder, available, selectedId, onSelect, onOpen, openedIds = [] }) {
  const count = items.length
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
        <div style={{ position: 'relative', width: mp(Math.max(...items.map((it, i) => (it.x ?? LEFT + PITCH * i) + PITCH), LEFT)), height: mp(TOP + 32 + 20) }}>
          {items.map((item, i) => {
            const sel = selectedId === item.id
            return (
              <div
                key={item.id}
                className={`${iconStyles.icon} ${sel ? iconStyles.selected : ''}`}
                style={{ position: 'absolute', left: `calc(${mp(item.x ?? LEFT + PITCH * i)} - ${(ICON_BOX / 2)}px + ${mp(16)})`, top: mp(TOP) }}
                onMouseDown={(e) => { e.stopPropagation(); onSelect?.(item.id) }}
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
