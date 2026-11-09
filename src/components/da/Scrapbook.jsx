// src/components/da/Scrapbook.jsx — the Scrapbook desk accessory.
//
// Five pages, each traced whole from docs/reference/mac system 1/
// macsystem100026–30.png (the window's body below the title bar, 384 × 256
// Mac pixels): the page in its double frame, the scroll bar with the thumb
// where that page puts it, and the "n / 5" and TEXT / PICT line. The pages
// are what this System Disk's Scrapbook File held: the TEXT that explains
// the Scrapbook, then pictures. Paging, as the Scrapbook did it:
//   arrows            the page before or after (the arrow fills while held)
//   track             a click beside the thumb turns one page that way
//   thumb dragged     a dotted outline follows; on release, the page nearest
// Cut, Copy and Paste aren't wired: the Edit menu stays dimmed.
import { useEffect, useRef, useState } from 'react'
import page1 from '../../../assets/mac/da/scrapbook-1.png'
import page2 from '../../../assets/mac/da/scrapbook-2.png'
import page3 from '../../../assets/mac/da/scrapbook-3.png'
import page4 from '../../../assets/mac/da/scrapbook-4.png'
import page5 from '../../../assets/mac/da/scrapbook-5.png'
import leftOn from '../../../assets/mac/da/scrapbook-left-on.png'
import rightOn from '../../../assets/mac/da/scrapbook-right-on.png'
import { toLocal } from '../desktopDrag'
import styles from './da.module.css'

const PAGES = [page1, page2, page3, page4, page5]
const mp = (n) => `calc(var(--mac-px) * ${n})`
const MAC_PX = 620 / 512

// The scroll bar, in Mac pixels in the body: arrow boxes 12–27 and 356–371,
// rows 208–223; the 16-pixel thumb's left edge is 28 on page 1 and moves 78
// a page (340 on page 5)
const BAR_TOP = 208, BAR_H = 16
const THUMB0 = 28, STEP = 78
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export default function Scrapbook() {
  const [page, setPage] = useState(0)
  const [held, setHeld] = useState(null)      // 'left' | 'right' while an arrow is down
  const [ghost, setGhost] = useState(null)    // thumb outline's left edge while dragging
  const rootRef = useRef(null)
  // Load every page now, so turning one never shows a blank body
  useEffect(() => { PAGES.forEach(src => { new Image().src = src }) }, [])

  const go = (to) => setPage(p => clamp(typeof to === 'function' ? to(p) : to, 0, PAGES.length - 1))
  const macX = (e) => toLocal(rootRef.current, e.clientX, e.clientY).x / MAC_PX

  const arrow = (dir) => (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    setHeld(dir)
    go(p => p + (dir === 'left' ? -1 : 1))
    const up = () => { setHeld(null); document.removeEventListener('mouseup', up) }
    document.addEventListener('mouseup', up)
  }

  const track = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const x = macX(e), thumb = THUMB0 + STEP * page
    if (x >= thumb && x < thumb + 16) {
      // the thumb: drag its outline along the track
      const grab = x - thumb
      const at = (ev) => clamp(macX(ev) - grab, THUMB0, THUMB0 + STEP * (PAGES.length - 1))
      setGhost(thumb)
      const move = (ev) => setGhost(at(ev))
      const up = (ev) => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        setGhost(null)
        go(Math.round((at(ev) - THUMB0) / STEP))
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
      return
    }
    go(p => p + (x < thumb ? -1 : 1))
  }

  return (
    <div ref={rootRef} className={styles.scrapbook} style={{ backgroundImage: `url(${PAGES[page]})` }}
      data-page={page + 1}>
      <span className={styles.cpCell} aria-label="Previous page" role="button"
        style={{ left: mp(12), top: mp(BAR_TOP), width: mp(16), height: mp(BAR_H) }} onMouseDown={arrow('left')}>
        {held === 'left' && <img src={leftOn} alt="" className={styles.sbArrow} />}
      </span>
      <span className={styles.cpCell} aria-label="Next page" role="button"
        style={{ left: mp(356), top: mp(BAR_TOP), width: mp(16), height: mp(BAR_H) }} onMouseDown={arrow('right')}>
        {held === 'right' && <img src={rightOn} alt="" className={styles.sbArrow} />}
      </span>
      <span className={styles.cpCell} data-track=""
        style={{ left: mp(28), top: mp(BAR_TOP), width: mp(328), height: mp(BAR_H) }} onMouseDown={track} />
      {ghost != null && (
        <span className={styles.sbGhost} style={{ left: mp(ghost), top: mp(BAR_TOP), width: mp(16), height: mp(BAR_H) }} />
      )}
    </div>
  )
}
