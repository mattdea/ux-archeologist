// src/shared/museum-ui/SmallScreenNotice.jsx
//
// Phone-width visitors (viewport under 600px) get a card saying the site is
// made for larger screens, over the dark museum background and above
// everything, including a level's IntroModal (which shows once this is
// dismissed). "Continue anyway" dismisses it for the visit (sessionStorage,
// guarded: if storage is blocked it still closes, just isn't remembered).
// Widening the window to 600px or more simply hides it. Width only, no
// touch test. Reuses IntroModal's card styles; no new museum-layer pattern.
import { useEffect, useRef, useState } from 'react'
import styles from './IntroModal.module.css'
import own from './SmallScreenNotice.module.css'

const QUERY = '(max-width: 599.98px)'
const KEY = 'ux-archaeologist:small-screen-dismissed'

function readDismissed() {
  try { return window.sessionStorage.getItem(KEY) === '1' } catch { return false }
}
function rememberDismissed() {
  try { window.sessionStorage.setItem(KEY, '1') } catch { /* storage blocked: close for now only */ }
}
function isSmall() {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches
}

export default function SmallScreenNotice() {
  const [small, setSmall] = useState(isSmall)
  const [dismissed, setDismissed] = useState(readDismissed)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(QUERY)
    const onChange = () => setSmall(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const open = small && !dismissed
  useEffect(() => { if (open) buttonRef.current?.focus() }, [open])

  if (!open) return null
  return (
    <div className={`${styles.scrim} ${own.scrim}`} role="dialog" aria-modal="true" aria-labelledby="small-screen-title">
      <div className={`${styles.card} ${own.card}`}>
        <div className={styles.accentLine} />
        <div className={styles.body}>
          <h1 id="small-screen-title" className={styles.title}>Made for larger screens</h1>
          <p className={styles.description}>
            Each level shows a device at its original size. On a phone they're shrunk to fit and hard to use.
          </p>
          <button
            ref={buttonRef}
            type="button"
            className={styles.beginBtn}
            onClick={() => { rememberDismissed(); setDismissed(true) }}
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  )
}
