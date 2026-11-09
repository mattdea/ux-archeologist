// src/components/MacAlert.jsx
//
// A 1984 Macintosh alert box: modal, centred on the screen, a thick black
// frame with a white inner rule, the Caution icon (an exclamation mark in a
// triangle) on the left, the message in Chicago, and a single OK button with
// the heavy default-button ring. Return or Enter dismisses it, as on the Mac.
// Alerts sounded the system beep when they appeared; the caller plays it.

import { useEffect, useRef } from 'react'
import styles from './MacAlert.module.css'

function CautionIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 32 32" width="32" height="32" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M16 2 L30 29 L2 29 Z" fill="#fff" stroke="#000" strokeWidth="2" strokeLinejoin="miter" />
      <rect x="14.5" y="10" width="3" height="11" fill="#000" />
      <rect x="14.5" y="23" width="3" height="3" fill="#000" />
    </svg>
  )
}

// `buttons` (optional) replaces the single OK: [{ label, onClick }], the
// first the default (ringed, and what Return chooses).
export default function MacAlert({ message, onOk, buttons }) {
  const choices = buttons ?? [{ label: 'OK', onClick: onOk }]
  const onDefault = choices[0].onClick
  const okRef = useRef(null)

  useEffect(() => {
    okRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Return') { e.preventDefault(); onDefault() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onDefault])

  return (
    // The scrim swallows clicks: nothing else responds while an alert is up
    <div className={styles.scrim} onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
      <div className={styles.alert} role="alertdialog" aria-modal="true" aria-label={message}>
        <CautionIcon />
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          {choices.map((b, i) => (
            <button key={b.label} ref={i === 0 ? okRef : undefined} type="button"
              className={`${styles.ok} ${i === 0 ? '' : styles.plain}`} onClick={b.onClick}>{b.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
