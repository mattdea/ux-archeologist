// src/components/NotesWindowContent.jsx
import { useRef, useEffect } from 'react'
import styles from './NotesWindowContent.module.css'

const NOTES_TEXT = `Jan 25, 1984

Finally got the Macintosh set up on my desk today. Susan from accounting helped me carry the box up from the loading dock — it's heavier than it looks.

Spent about an hour just figuring out how to plug everything in. The manual is pretty clear though. When the little face came up on the screen and smiled at me, I laughed out loud. A computer that smiles at you. What a world.

The mouse is strange. I keep wanting to type commands like I do on the Apple II, but there's nothing to type into. You just... point at things and click. Took me twenty minutes to figure out how to open a folder. Double-click, not single-click. Nobody told me that.

Once I got it, though — I moved a document from one folder to another just by dragging it. My hand moved it. I didn't have to remember a single command. It just made sense.

The screen is small. Everything is black and white. But there's something about the way it works that feels different from every other computer I've used. Like it was made by someone who actually thought about me.

$2,495 is a lot of money. I hope the partners agree it was worth it.

— R.H.`

const THUMB_HEIGHT = 24
const ARROW_STEP = 36

export default function NotesWindowContent() {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const thumbRef = useRef(null)
  const thumbAreaRef = useRef(null)
  const scrollPos = useRef(0)
  const pending = useRef(0)
  const intervalRef = useRef(null)

  const getMaxScroll = () => {
    const content = contentRef.current
    const viewport = viewportRef.current
    if (!content || !viewport) return 0
    return Math.max(0, content.scrollHeight - viewport.clientHeight)
  }

  const applyScroll = (newPos) => {
    const maxScroll = getMaxScroll()
    scrollPos.current = Math.max(0, Math.min(maxScroll, newPos))
    if (contentRef.current) {
      contentRef.current.style.transform = `translateY(${-scrollPos.current}px)`
    }
    // Update thumb position
    const thumbArea = thumbAreaRef.current
    const thumb = thumbRef.current
    if (thumbArea && thumb && maxScroll > 0) {
      const trackH = thumbArea.clientHeight - THUMB_HEIGHT
      thumb.style.top = `${(scrollPos.current / maxScroll) * trackH}px`
    }
  }

  // Choppy scroll: accumulate wheel delta, apply in 120ms chunks
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()
      pending.current += e.deltaY

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (Math.abs(pending.current) < 0.5) {
            pending.current = 0
            clearInterval(intervalRef.current)
            intervalRef.current = null
            return
          }
          const step = Math.sign(pending.current) * Math.min(Math.abs(pending.current), 36)
          pending.current -= step
          applyScroll(scrollPos.current + step)
        }, 120)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Arrow button handlers
  const handleArrowUp = () => applyScroll(scrollPos.current - ARROW_STEP)
  const handleArrowDown = () => applyScroll(scrollPos.current + ARROW_STEP)

  // Thumb drag
  const thumbDragStart = useRef(null)

  const handleThumbMouseDown = (e) => {
    e.preventDefault()
    const startY = e.clientY
    const startScroll = scrollPos.current

    const handleMove = (ev) => {
      const thumbArea = thumbAreaRef.current
      if (!thumbArea) return
      const trackH = thumbArea.clientHeight - THUMB_HEIGHT
      if (trackH <= 0) return
      const maxScroll = getMaxScroll()
      const deltaY = ev.clientY - startY
      applyScroll(startScroll + (deltaY / trackH) * maxScroll)
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    thumbDragStart.current = { startY, startScroll }
  }

  // Click on thumb track (not thumb) — jump scroll
  const handleTrackClick = (e) => {
    if (e.target !== thumbAreaRef.current) return
    const thumbArea = thumbAreaRef.current
    if (!thumbArea) return
    const rect = thumbArea.getBoundingClientRect()
    const clickRatio = (e.clientY - rect.top) / rect.height
    applyScroll(clickRatio * getMaxScroll())
  }

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={contentRef} className={styles.content}>
        <pre className={styles.pre}>{NOTES_TEXT}</pre>
      </div>
      <div className={styles.scrollbarTrack}>
        <button className={styles.scrollArrow} onMouseDown={handleArrowUp}>▲</button>
        <div
          ref={thumbAreaRef}
          className={styles.scrollThumbArea}
          onMouseDown={handleTrackClick}
        >
          <div
            ref={thumbRef}
            className={styles.scrollThumb}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
        <button className={styles.scrollArrow} onMouseDown={handleArrowDown}>▼</button>
      </div>
    </div>
  )
}
