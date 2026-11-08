// src/components/InfoWindowContent.jsx
//
// File ▸ Get Info in Finder 1.0: a small window headed by the item's icon
// and name, a Locked check box at the top right, the Kind / Size / Where /
// Created / Modified lines, and a box for comments. The Locked box is live:
// a locked item can't be emptied from the Trash.

import styles from './InfoWindowContent.module.css'
import { FolderIcon, NotesIcon, TrashIcon, DiskIcon } from './DesktopIcon'

function Glyph({ icon }) {
  if (icon === 'folder') return <FolderIcon />
  if (icon === 'trash')  return <TrashIcon />
  if (icon === 'disk')   return <DiskIcon />
  return <NotesIcon />
}

export default function InfoWindowContent({ item, locked, onToggleLock }) {
  const lockable = item.icon === 'notes' || item.icon === 'folder'
  return (
    <div className={styles.info}>
      <div className={styles.head}>
        <Glyph icon={item.icon} />
        <span className={styles.name}>{item.label}</span>
        <label className={`${styles.lock} ${lockable ? '' : styles.lockOff}`}>
          <span className={`${styles.box} ${locked ? styles.boxChecked : ''}`} aria-hidden="true" />
          <input type="checkbox" checked={!!locked} disabled={!lockable} onChange={onToggleLock} className={styles.input} />
          Locked
        </label>
      </div>
      <dl className={styles.rows}>
        <dt>Kind:</dt><dd>{item.kind}</dd>
        <dt>Size:</dt><dd>{item.size}</dd>
        <dt>Where:</dt><dd>{item.where}</dd>
        <dt>Created:</dt><dd>{item.created}</dd>
        <dt>Modified:</dt><dd>{item.modified}</dd>
      </dl>
      <div className={styles.comments}>{item.comment}</div>
    </div>
  )
}
