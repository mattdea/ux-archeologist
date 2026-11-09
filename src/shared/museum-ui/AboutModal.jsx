// src/shared/museum-ui/AboutModal.jsx
import { useEffect, useId, useRef } from 'react'
import styles from './AboutModal.module.css'

export default function AboutModal({ onClose }) {
  const titleId = useId()
  const closeRef = useRef(null)

  // Focus the close button on open; give focus back to the opener on close
  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    return () => { if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className={styles.scrim} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className={styles.accentLine} />
        <button ref={closeRef} type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        <div className={styles.body}>
          <span className={styles.curatorLabel}>Curator's Note</span>
          <h1 id={titleId} className={styles.title}>Interface Artifacts</h1>

          <p className={styles.paragraph}>
            Every interface you've ever used was someone's radical idea. The command line, the desktop, the hyperlink, the touchscreen — each felt inevitable in hindsight but was a leap of imagination when it was new.
          </p>
          <p className={styles.paragraph}>
            This exhibit recreates six of those moments as working replicas you can explore the way their original users did.
          </p>
          <p className={styles.paragraph}>
            Type a command. Drag an icon. Follow a link. Swipe a screen. The history of computing is a history of how we learned to talk to machines — and how they learned to talk back.
          </p>

          <hr className={styles.divider} />

          <p className={styles.attribution}>
            Designed by <strong className={styles.name}>Matthew Dea</strong>
          </p>
          <p className={styles.built}>Built with React + Vite.</p>

          <div className={styles.links}>
            <a href="https://www.matthewdea.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>Portfolio</a>
            <a href="https://www.linkedin.com/in/deamatthew/" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  )
}
