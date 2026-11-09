// src/components/InfoWindowContent.jsx
//
// File ▸ Get Info: a fixed-size window titled "Information about <name>".
// Laid out in Mac pixels from docs/reference/mac system 1/macsystem100022.png
// (the System Disk's info window; content 384 × 216): the name right-aligned
// beside the icon at the top right, Kind / Size / Where / Created / Modified in
// Chicago on 18-pixel rows (labels at 22, values at 92), a Locked check box,
// and a comment box you can type in. The Locked box is live: a locked item
// can't be thrown away. A disk can't be locked here, so its box is dimmed.

import { useState } from 'react'
import styles from './InfoWindowContent.module.css'
import { FolderIcon, NotesIcon, TrashIcon, DiskIcon } from './DesktopIcon'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const ROWS = ['Kind', 'Size', 'Where', 'Created', 'Modified']
const FIELD = { Kind: 'kind', Size: 'size', Where: 'where', Created: 'created', Modified: 'modified' }

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
      <span className={styles.name} style={{ right: mp(384 - 318), top: mp(17) }}>{item.label}</span>
      <span className={styles.icon} style={{ left: mp(332), top: mp(10) }}><Glyph icon={item.icon} /></span>

      <dl className={styles.rows}>
        {ROWS.map((label, i) => (
          <div key={label} style={{ top: mp(39 + 18 * i) }}>
            <dt style={{ left: mp(22) }}>{label}:</dt>
            <dd style={{ left: mp(92) }}>{item[FIELD[label]]}</dd>
          </div>
        ))}
      </dl>

      <label className={`${styles.lock} ${lockable ? '' : styles.lockOff}`} style={{ left: mp(22), top: mp(133) }}>
        <span className={`${styles.box} ${locked ? styles.boxChecked : ''}`} aria-hidden="true" />
        <input type="checkbox" checked={!!locked} disabled={!lockable} onChange={onToggleLock} className={styles.input} />
        <span className={styles.lockText}>Locked</span>
      </label>

      <textarea
        className={styles.comments}
        style={{ left: mp(7), top: mp(153), width: mp(370), height: mp(56) }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        spellCheck={false}
        aria-label="Comments"
      />
    </div>
  )
}
