// src/components/da/NotePad.jsx — the Note Pad desk accessory: eight pages
// of plain text. The page number sits above a turned-down corner at the
// bottom left; click the corner's lower part to turn forward, its upper
// part to turn back. Pages persist for the session.
import { useState } from 'react'
import styles from './da.module.css'

const PAGES = 8
const STARTER = [
  'Things to try on the Macintosh:\n\n- open the disk\n- drag a file to the Trash\n- look in every menu',
  '', '', '', '', '', '', '',
]

export default function NotePad() {
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('l1_notepad')) || STARTER } catch { return STARTER }
  })
  const setText = (t) => {
    const next = pages.map((p, i) => i === page ? t : p)
    setPages(next)
    try { sessionStorage.setItem('l1_notepad', JSON.stringify(next)) } catch { /* ignore */ }
  }
  const turn = (d) => setPage(p => (p + d + PAGES) % PAGES)

  return (
    <div className={styles.notepad}>
      <textarea
        className={styles.notepadText}
        value={pages[page]}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className={styles.notepadFoot}>
        <span className={styles.notepadNum}>{page + 1}</span>
        {/* Dog-ear: top half turns back, bottom half turns forward */}
        <div className={styles.dogEar} aria-hidden="true">
          <button type="button" className={styles.dogEarBack} onClick={() => turn(-1)} title="Previous page" />
          <button type="button" className={styles.dogEarFwd} onClick={() => turn(1)} title="Next page" />
        </div>
      </div>
    </div>
  )
}
