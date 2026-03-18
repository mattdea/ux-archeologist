// src/components/phone/StatusBar.jsx
//
// Pixel-faithful recreation of iPhone OS 1 status bar.
// All measurements are 1× (half of the 640px Figma design: node 25:986).
//
// Props:
//   variant — 'dark' (default, rgba(0,0,0,0.6) bg) | 'transparent'

import styles from './StatusBar.module.css'

// ── Signal bars (5 bars, bottom-aligned) ────────────────────────────────────
// Figma 640px positions halved to 320px:
//   bar 1: x=1  y=6    w=3 h=3.5
//   bar 2: x=5  y=4.5  w=3 h=5
//   bar 3: x=9  y=3    w=3 h=6.5
//   bar 4: x=13 y=1.5  w=3 h=8     ← tallest / "full signal"
//   bar 5: x=17 y=8.5  w=3 h=1     ← near-empty
function SignalBars() {
  return (
    <svg
      width="20" height="10"
      viewBox="0 0 20 9.5"
      fill="white"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="1"  y="6"   width="3" height="3.5" rx="0.5" />
      <rect x="5"  y="4.5" width="3" height="5"   rx="0.5" />
      <rect x="9"  y="3"   width="3" height="6.5" rx="0.5" />
      <rect x="13" y="1.5" width="3" height="8"   rx="0.5" />
      <rect x="17" y="8.5" width="3" height="1"   rx="0.5" />
    </svg>
  )
}

// ── WiFi icon — exact Figma paths (node 25:997), rendered at 17×13 (half of 34×26) ──
function WifiIcon() {
  return (
    <svg
      width="17" height="13"
      viewBox="0 0 34 26"
      fill="none"
      aria-hidden="true"
      className={styles.wifiIcon}
    >
      <path d="M17 25.5L12 21L12.3172 20.7145C14.9794 18.3186 19.0206 18.3186 21.6828 20.7145L22 21L17 25.5Z" fill="white"/>
      <path d="M10 18.5L7 15.5C7 15.5 9.5 11 17 11C24.5 11 27 15.5 27 15.5L24 18.5C24 18.5 21.5 15.5 17 15.5C12.5 15.5 10 18.5 10 18.5Z" fill="white"/>
      <path d="M4.5 13.5L1.5 10.5C1.5 10.5 5 3.5 17 3.5C29 3.5 32.5 10.5 32.5 10.5L29.5 13.5C29.5 13.5 26.5 8 17 8C7.5 8 4.5 13.5 4.5 13.5Z" fill="white"/>
    </svg>
  )
}

// ── Battery icon ─────────────────────────────────────────────────────────────
// Figma 640px: container 42×20px, body 38×20px border 2px, nub 6×8px, fill 26×12px (75%)
// At 320px (1×): body 19×10px border 1px, nub 3×4px, fill 13×6px
function BatteryIcon() {
  return (
    <svg
      width="22" height="10"
      viewBox="0 0 22 10"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Body */}
      <rect x="0.5" y="0.5" width="17" height="9" rx="1"
        stroke="white" strokeOpacity="0.85" strokeWidth="1" />
      {/* Charge fill ~75% */}
      <rect x="2" y="2" width="12.75" height="6" rx="0.5" fill="white" />
      {/* Nub (3 sides — open left) */}
      <path d="M19 3.5 h1.5 q0.5 0 0.5 0.5 v2 q0 0.5 -0.5 0.5 h-1.5"
        stroke="white" strokeOpacity="0.85" strokeWidth="1" fill="none" />
    </svg>
  )
}

export default function StatusBar({ variant = 'dark' }) {
  return (
    <div className={`${styles.bar} ${variant === 'transparent' ? styles.barTransparent : ''}`}>

      {/* Left: signal bars, AT&T, wifi */}
      <div className={styles.left}>
        <div className={styles.signalAndCarrier}>
          <SignalBars />
          <span className={styles.carrier}>AT&amp;T</span>
        </div>
        <WifiIcon />
      </div>

      {/* Center: time — absolutely positioned */}
      <span className={styles.timeLabel}>9:41 AM</span>

      {/* Right: percentage + battery */}
      <div className={styles.right}>
        <span className={styles.batteryPct}>75%</span>
        <BatteryIcon />
      </div>

    </div>
  )
}
