// src/components/FolderWindowContent.jsx
//
// The inside of a Finder 1.0 disk or folder window: the information line
// ("N items   NNNK in disk   NNNK available") and the icons in a row.
// Single-click selects, double-click opens; the parent decides what opening
// means (a folder zooms open, a system file can't be opened).

import styles from './DraggableWindow.module.css'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon } from './DesktopIcon'

function Glyph({ icon, selected }) {
  if (icon === 'folder') return <FolderIcon selected={selected} />
  return <NotesIcon selected={selected} />
}

export default function FolderWindowContent({ items, inDisk, available, selectedId, onSelect, onOpen }) {
  const count = items.length
  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count} item{count === 1 ? '' : 's'}</span>
        {inDisk != null && (
          <>
            <span className={styles.fileInfoText}>{inDisk}K in disk</span>
            <span className={styles.fileInfoRight}>{available}K available</span>
          </>
        )}
      </div>
      <div className={styles.trashBody}>
        {items.map(item => {
          const sel = selectedId === item.id
          return (
            <div
              key={item.id}
              className={`${iconStyles.icon} ${sel ? iconStyles.selected : ''}`}
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
              onMouseDown={(e) => { e.stopPropagation(); onSelect?.(item.id) }}
              onDoubleClick={(e) => { e.stopPropagation(); onOpen?.(item, e.currentTarget) }}
            >
              <Glyph icon={item.icon} selected={sel} />
              <span className={`${iconStyles.label} ${sel ? iconStyles.labelSelected : ''}`}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
