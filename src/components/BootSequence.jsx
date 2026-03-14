// src/components/BootSequence.jsx
import { useEffect, useState } from 'react'
import styles from './BootSequence.module.css'
import DesktopIcon from './DesktopIcon'

// Phases
const P = {
  BLACK:    0,  // solid black
  SCANNING: 1,  // bg reveals top→bottom
  HAPPY:    2,  // Happy Mac icon centered
  WELCOME:  3,  // Welcome to Macintosh dialog
  DISMISS:  4,  // dialog gone, still black-ish
  MENUBAR:  5,  // menu bar flashes in
  ICONS:    6,  // icons flash in one-by-one
  DONE:     7,  // sequence complete
}

// Desktop-relative icon positions (matching DesktopScene initialState)
// Add MENU_BAR_H (30px) to convert to screen coords
const MENU_BAR_H = 30
const ICON_POS = {
  projects: { left: 496, top: 40  + MENU_BAR_H },
  notes:    { left: 496, top: 160 + MENU_BAR_H },
  trash:    { left: 496, top: 300 + MENU_BAR_H },
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

export default function BootSequence({ onComplete }) {
  const [phase, setPhase] = useState(P.BLACK)
  const [icons, setIcons] = useState([])   // which icons have appeared

  useEffect(() => {
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))

    at(300,  () => setPhase(P.SCANNING))
    at(1050, () => setPhase(P.HAPPY))
    at(2400, () => setPhase(P.WELCOME))
    at(4100, () => setPhase(P.DISMISS))
    at(4400, () => setPhase(P.MENUBAR))
    at(4800, () => { setPhase(P.ICONS); setIcons(['projects']) })
    at(5050, () => setIcons(['projects', 'notes']))
    at(5300, () => setIcons(['projects', 'notes', 'trash']))
    at(5750, () => setPhase(P.DONE))
    at(5850, () => onComplete())

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className={styles.boot}>

      {/* Checkered desktop background — revealed top-to-bottom via clip-path */}
      <div className={`${styles.bg} ${phase >= P.SCANNING ? styles.bgReveal : ''}`} />

      {/* Happy Mac — centered standalone; gone once welcome dialog takes over */}
      {phase >= P.HAPPY && phase < P.WELCOME && (
        <div className={styles.happyCenter}>
          <HappyMacSVG />
        </div>
      )}

      {/* Welcome to Macintosh dialog */}
      {phase === P.WELCOME && (
        <div className={styles.welcomeCenter}>
          <div className={styles.welcomeWindow}>
            <span className={styles.welcomeText}>Welcome to Macintosh.</span>
          </div>
        </div>
      )}

      {/* Menu bar */}
      {phase >= P.MENUBAR && (
        <div className={`${styles.fakeMenuBar} ${styles.flashIn}`}>
          <span className={styles.menuApple}>&#63743;</span>
          <span className={styles.menuItem}>File</span>
          <span className={styles.menuItem}>Edit</span>
          <span className={styles.menuItem}>View</span>
          <span className={styles.menuItem}>Special</span>
        </div>
      )}

      {/* Desktop icons — staggered flash-in */}
      {icons.map(name => (
        <DesktopIcon
          key={name}
          label={name.charAt(0).toUpperCase() + name.slice(1)}
          icon={name === 'projects' ? 'folder' : name}
          style={{
            position: 'absolute',
            left: ICON_POS[name].left,
            top:  ICON_POS[name].top,
          }}
          className={styles.flashIn}
        />
      ))}

    </div>
  )
}
