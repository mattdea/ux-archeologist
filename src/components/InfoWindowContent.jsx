// src/components/InfoWindowContent.jsx
//
// File ▸ Get Info in Finder 1.0/1.1: a fixed-size window titled
// "Information about <name>", the item's icon and name at the top, then
// Kind / Size / Where / Created / Modified, a Locked check box on its own
// line, and a comment box you can type in. The Locked box is live: a locked
// item can't be thrown away. For a disk it shows the write-protect tab.

import { useState } from 'react'
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
  const [comment, setComment] = useState(item.comment ?? '')
  return (
    <div className={styles.info}>
      <div className={styles.head}>
        <Glyph icon={item.icon} />
        <span className={styles.name}>{item.label}</span>
      </div>
      <dl className={styles.rows}>
        <dt>Kind:</dt><dd>{item.kind}</dd>
        <dt>Size:</dt><dd>{item.size}</dd>
        <dt>Where:</dt><dd>{item.where}</dd>
        <dt>Created:</dt><dd>{item.created}</dd>
        <dt>Modified:</dt><dd>{item.modified}</dd>
      </dl>
      <label className={`${styles.lock} ${lockable ? '' : styles.lockOff}`}>
        <span className={`${styles.box} ${locked ? styles.boxChecked : ''}`} aria-hidden="true" />
        <input type="checkbox" checked={!!locked} disabled={!lockable} onChange={onToggleLock} className={styles.input} />
        Locked
      </label>
      <textarea
        className={styles.comments}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        spellCheck={false}
        aria-label="Comments"
      />
    </div>
  )
}
