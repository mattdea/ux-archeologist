// src/components/NotesWindowContent.jsx
import { useRef, useEffect } from 'react'
import styles from './NotesWindowContent.module.css'

const NOTES_TEXT = `The 1984 Macintosh: A Revolution in Human-Computer Interaction

When Apple introduced the Macintosh on January 24, 1984, it did not just launch a computer — it launched a paradigm. The Mac was the first mass-market personal computer to successfully commercialize the graphical user interface (GUI), transforming computing from a technical discipline into a human activity.

The roots of this revolution trace to Xerox PARC in the 1970s, where researchers developed the Alto computer with windows, icons, menus, and a pointing device. Douglas Engelbart's 1968 "Mother of All Demos" had shown the world what was possible. But it was the Macintosh that made these ideas accessible to everyone.

Key UX innovations the Mac introduced to mainstream computing:

• The Desktop Metaphor — Files, folders, and a trash can mapped digital work to familiar physical objects. Users could understand the system without reading a manual.

• Direct Manipulation — Instead of typing commands, users could drag objects, resize windows, and see immediate visual feedback. This was WYSIWYG before the acronym was common.

• Consistent Interface Standards — The Human Interface Guidelines (1984) established that all Mac applications should work the same way. A user who learned one app could use any app.

• The Mouse as Primary Input — The single-button mouse made pointing natural. Fitts's Law was being practiced: large targets at screen edges, a persistent menu bar always in reach.

• The Menu Bar — A persistent location for all commands, shared across every application. Users never had to hunt for functions.

The Mac's success proved that good design was a competitive advantage. Companies like Microsoft, Sun, and later everyone building for iOS and Android followed its model.

This machine ran on a 7.8336 MHz Motorola 68000 processor with 128KB of RAM and a 3.5-inch floppy disk. It cost $2,495 — roughly $7,500 in today's dollars. Despite its limitations, it changed everything.`

export default function NotesWindowContent() {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const scrollPos = useRef(0)
  const pending = useRef(0)
  const intervalRef = useRef(null)

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
          const content = contentRef.current
          const viewport = viewportRef.current
          if (!content || !viewport) return
          const maxScroll = content.scrollHeight - viewport.clientHeight
          scrollPos.current = Math.max(0, Math.min(maxScroll, scrollPos.current + step))
          content.style.transform = `translateY(${-scrollPos.current}px)`
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

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={contentRef} className={styles.content}>
        <pre className={styles.pre}>{NOTES_TEXT}</pre>
      </div>
      <div className={styles.scrollbarTrack}>
        <button className={styles.scrollArrow}>▲</button>
        <div className={styles.scrollThumbArea}>
          <div className={styles.scrollThumb} />
        </div>
        <button className={styles.scrollArrow}>▼</button>
      </div>
    </div>
  )
}
