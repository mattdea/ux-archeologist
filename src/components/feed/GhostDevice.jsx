// src/components/feed/GhostDevice.jsx
// "Glow + ghost device" framing for the Level 4 feed (artifact layer).
//
// A hairline outline of an iPhone 6 around the lit screen: the memory of the
// hardware, between Level 3's full phone and Level 5's no device at all.
// The screen is the only light source — a barely-there bloom around it, and
// the outline lit a touch more near the screen than at the far corners.
//
// Geometry (points, 1×) from the real iPhone 6: body 138.1 × 67.0 mm,
// display 103.96 × 58.46 mm = 667 × 375 pt → 6.414 pt/mm.
//   body    429 × 885   (67.0 mm × 6.414 = 429.7, 138.1 × 6.414 = 885.8)
//   screen  375 × 667 at left 27, top 109 (4.27 mm / 17.07 mm insets)
//
// Props:
//   children — content rendered inside the screen slot
//   lit      — true once the screen has powered on; fades the ghost in
//   touch    — true to swap the system cursor for Level 3's fingertip
//              TouchCursor inside the screen

import { useRef } from 'react'
import styles from './GhostDevice.module.css'
import TouchCursor from '../phone/TouchCursor'

export const BODY_W = 429
export const BODY_H = 885
export const SCREEN_LEFT = 27
export const SCREEN_TOP = 109
export const UNIT_W = BODY_W
export const UNIT_H = BODY_H

const CX = BODY_W / 2          // 214.5
const R_BODY = 56              // body corner radius (≈ 8.7 mm)

export default function GhostDevice({ children, lit = false, touch = false }) {
  const cls = [styles.unit, lit ? styles.unitLit : ''].join(' ')
  const screenRef = useRef(null)

  return (
    <div className={cls}>

      {/* Screen bloom: sits under the screen, bleeds just past its edges */}
      <div className={styles.bloom} aria-hidden="true" />

      {/* Ghost outline */}
      <svg
        className={styles.ghost}
        viewBox={`0 0 ${BODY_W} ${BODY_H}`}
        width={BODY_W}
        height={BODY_H}
        aria-hidden="true"
      >
        <defs>
          {/* Outline is brightest near the screen, dimmer at the far corners */}
          <radialGradient id="ghost-stroke" cx="0.5" cy="0.5" r="0.62">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.13" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.06" />
          </radialGradient>
          {/* Barely-there sheen: glass and metal catching the screen light */}
          <linearGradient id="ghost-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe8f5" stopOpacity="0.035" />
            <stop offset="0.45" stopColor="#dfe8f5" stopOpacity="0.008" />
            <stop offset="1" stopColor="#dfe8f5" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className={styles.ticks}>
          {/* Side buttons: short, slightly brighter ticks on the edges.
              Left: mute switch, volume up, volume down. Right: sleep/wake. */}
          <path d="M0.5 128.5v26" />
          <path d="M0.5 188.5v50" />
          <path d="M0.5 252.5v50" />
          <path d={`M${BODY_W - 0.5} 190.5v64`} />
        </g>

        <g className={styles.lines}>
          {/* Body */}
          <rect x="0.5" y="0.5" width={BODY_W - 1} height={BODY_H - 1} rx={R_BODY} />
          {/* Earpiece slot, camera dot to its left */}
          <rect x="179.5" y="52.5" width="70" height="7" rx="3.5" />
          <circle cx="143.5" cy="55.5" r="6.5" />
          {/* Home button */}
          <circle cx={CX} cy={BODY_H - 60.5} r="32" />
        </g>

        {/* Sheen inside the body, no fill otherwise */}
        <rect
          x="1" y="1" width={BODY_W - 2} height={BODY_H - 2} rx={R_BODY - 0.5}
          fill="url(#ghost-sheen)"
        />
      </svg>

      {/* Screen slot: square corners, exactly where the real display sat */}
      <div ref={screenRef} className={touch ? `${styles.screen} ${styles.screenTouch}` : styles.screen}>
        {children}
        {touch && <TouchCursor containerRef={screenRef} />}
      </div>

    </div>
  )
}
