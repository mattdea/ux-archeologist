// src/components/BootSequence.jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './BootSequence.module.css'
import ScreenTexture from './ScreenTexture'
import happyMacUrl from '../../assets/mac/boot-happy-mac.png'
import welcomeUrl from '../../assets/mac/boot-welcome.png'

// Traced from docs/reference/mac system 1/macsystem100023.png (Happy Mac, 25×32
// at (243,145)) and macsystem100024.png (the welcome box, 448×126 at (32,64),
// with its 3-pixel shadow), in Mac pixels on the 512×342 screen.
const mp = (n) => `calc(var(--mac-px) * ${n})`

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

      {/* Happy Mac, where the ROM drew it; gone once the welcome box is up */}
      {phase === P.HAPPY && (
        <img src={happyMacUrl} className={styles.art} alt="" draggable="false"
          style={{ left: mp(243), top: mp(145), width: mp(25), height: mp(32) }} />
      )}

      {/* Welcome to Macintosh. */}
      {phase === P.WELCOME && (
        <img src={welcomeUrl} className={styles.art} alt="Welcome to Macintosh." draggable="false"
          style={{ left: mp(32), top: mp(64), width: mp(451), height: mp(129) }} />
      )}

    </div>
  )
}
