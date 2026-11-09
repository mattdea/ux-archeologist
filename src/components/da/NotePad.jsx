// src/components/da/NotePad.jsx — the Note Pad desk accessory: eight pages
// of plain text in New York 12. As its own first page says: "Click on the
// dog-ear to turn to the next following page. Click in the lower left
// corner to turn to the next previous page." Pages persist for the session.
//
// Measured from docs/reference/mac system 1/macsystem100011.png (Mac
// pixels, inside the frame, below the title bar): a white page 219 wide and
// 227 tall; text 9 in, first baseline 20 down, lines 16 apart; the
// dog-ear, bottom rule and three lines along the bottom edge are traced
// (notepad-foot.png, the last 31 rows); the page number is centred with its
// baseline 212 down.
import { useState } from 'react'
import footSrc from '../../../assets/mac/da/notepad-foot.png'
import styles from './da.module.css'

const mp = (n) => `calc(var(--mac-px) * ${n})`

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
      <div className={styles.notepadFoot} style={{ backgroundImage: `url(${footSrc})` }} />
      <span className={styles.notepadNum}>{page + 1}</span>
      {/* The dog-ear (above the fold) turns forward; the lower left corner
          (below it) turns back */}
      <div className={styles.dogEar} style={{ top: mp(196), width: mp(24), height: mp(25) }}>
        <button type="button" className={styles.dogEarFwd} onClick={() => turn(1)} title="Next page" />
        <button type="button" className={styles.dogEarBack} onClick={() => turn(-1)} title="Previous page" />
      </div>
    </div>
  )
}
