// src/components/BootSequence.jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './BootSequence.module.css'
import ScreenTexture from './ScreenTexture'
import bootupIconUrl from '../../assets/mac-bootup-icon.png'

// Phases of the overlay. Once the desktop is up the overlay is gone and the
// real DesktopScene underneath draws its own menu bar and icons (via
// onReveal), so nothing is swapped, resized or moved at the hand-off.
const P = {
  BLACK:    0,  // solid black
  SCANNING: 1,  // gray desktop pattern reveals top→bottom
  HAPPY:    2,  // Happy Mac icon centered
  WELCOME:  3,  // Welcome to Macintosh dialog
  DESKTOP:  4,  // overlay removed; DesktopScene shows through
}

function HappyMacSVG({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 33"
      className={`${styles.happyMacSvg} ${className || ''}`}
    >
      {/* White fill background */}
      <rect x="0" y="0" width="25" height="33" fill="white" />
      {/* Black pixel art — provided by user */}
      <rect x="2" y="0" width="21" height="1"/>
      <rect x="1" y="1" width="1" height="1"/>
      <rect x="23" y="1" width="1" height="1"/>
      <rect x="0" y="2" width="1" height="26"/>
      <rect x="24" y="2" width="1" height="26"/>
      <rect x="4" y="3" width="17" height="1"/>
      <rect x="3" y="4" width="1" height="14"/>
      <rect x="21" y="4" width="1" height="14"/>
      <rect x="8" y="7" width="1" height="2"/>
      <rect x="12" y="7" width="1" height="5"/>
      <rect x="15" y="7" width="1" height="2"/>
      <rect x="11" y="12" width="2" height="1"/>
      <rect x="9" y="14" width="1" height="1"/>
      <rect x="14" y="14" width="1" height="1"/>
      <rect x="10" y="15" width="4" height="1"/>
      <rect x="4" y="18" width="17" height="1"/>
      <rect x="15" y="23" width="6" height="1"/>
      <rect x="3" y="24" width="2" height="1"/>
      <rect x="1" y="28" width="23" height="1"/>
      <rect x="1" y="29" width="1" height="3"/>
      <rect x="23" y="29" width="1" height="3"/>
      <rect x="1" y="32" width="23" height="1"/>
    </svg>
  )
}

/**
 * @param {() => void}        onComplete   Boot finished; desktop is interactive.
 * @param {(n: number) => void} [onReveal] Desktop reveal step: 1 menu bar,
 *   2 Projects, 3 Notes, 4 Trash. Same order the Finder drew them in.
 * @param {(busy: boolean) => void} [onDriveBusy] Floppy in-use LED.
 */
export default function BootSequence({ onComplete, onReveal, onDriveBusy }) {
  const [phase, setPhase] = useState(P.BLACK)

  // Callbacks via ref: the parent re-renders during boot (resize, reveal
  // steps), and new function identities must not restart the timeline.
  const cb = useRef({ onComplete, onReveal, onDriveBusy })
  useLayoutEffect(() => { cb.current = { onComplete, onReveal, onDriveBusy } })

  useEffect(() => {
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))
    const reveal = n => cb.current.onReveal?.(n)
    const drive = on => cb.current.onDriveBusy?.(on)

    at(300,  () => setPhase(P.SCANNING))
    at(1050, () => { setPhase(P.HAPPY); drive(true) })   // reading the System disk
    at(2400, () => setPhase(P.WELCOME))
    at(4100, () => setPhase(P.DESKTOP))                  // Finder takes over
    at(4400, () => reveal(1))                            // menu bar
    at(4800, () => reveal(2))                            // Projects
    at(5050, () => reveal(3))                            // Notes
    at(5300, () => reveal(4))                            // Trash
    at(5450, () => drive(false))
    at(5600, () => cb.current.onComplete())

    return () => { timers.forEach(clearTimeout); drive(false) }
  }, [])

  if (phase >= P.DESKTOP) return null

  return (
    <div className={styles.boot}>

      {/* Gray desktop pattern — revealed top-to-bottom via clip-path */}
      <div className={`${styles.bg} ${phase >= P.SCANNING ? styles.bgReveal : ''}`}>
        <ScreenTexture />
      </div>

      {/* Happy Mac — centered standalone; gone once welcome dialog takes over */}
      {phase === P.HAPPY && (
        <div className={styles.happyCenter}>
          <HappyMacSVG />
        </div>
      )}

      {/* Welcome to Macintosh dialog */}
      {phase === P.WELCOME && (
        <div className={styles.welcomeCenter}>
          <div className={styles.welcomeWindow}>
            <img src={bootupIconUrl} className={styles.welcomeIcon} alt="" draggable="false" />
            <span className={styles.welcomeText}>Welcome to Macintosh.</span>
          </div>
        </div>
      )}

    </div>
  )
}
