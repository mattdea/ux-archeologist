// src/components/phone/LockScreen.jsx
//
// 100% faithful to Figma node 25:975 (at 1× / 320px screen).
// Structural layout: StatusBar → clockBand → spacer → sliderBand
// Drag logic: imperative refs, document-level listeners, direct DOM transform
// (same pattern as DraggableWindow to avoid re-renders mid-drag).
//
// Props: { onUnlock }

import { useEffect, useRef } from 'react'
import styles from './LockScreen.module.css'
import StatusBar from './StatusBar'
import wallpaperSrc from '../../../assets/ios-rain-wallpaper.jpg'

export default function LockScreen({ onUnlock, exiting = false }) {
  const trackRef = useRef(null)
  const knobRef  = useRef(null)
  const wipeRef  = useRef(null)  // text wipe overlay — covers shimmer text behind knob

  // All drag state in refs — zero re-renders while dragging
  const dragging      = useRef(false)
  const startClientX  = useRef(0)
  const currentDelta  = useRef(0)

  // Keep onUnlock ref current so the touch-handler closure is never stale
  const onUnlockRef = useRef(onUnlock)
  useEffect(() => { onUnlockRef.current = onUnlock }, [onUnlock])

  // ── Coordinate helpers ──────────────────────────────────────────────────────
  // Convert viewport pixels → local element pixels (corrects for CSS scale transform)
  const getScaleX = () => {
    const track = trackRef.current
    if (!track) return 1
    const rect = track.getBoundingClientRect()
    return rect.width > 0 ? track.offsetWidth / rect.width : 1
  }

  // Max distance the knob can travel (local px)
  const getMaxTravel = () => {
    const track = trackRef.current
    const knob  = knobRef.current
    if (!track || !knob) return 200
    return track.offsetWidth - knob.offsetWidth - 8 // 4px inset each side
  }

  // ── Spring-back animation ───────────────────────────────────────────────────
  const springBack = () => {
    const knob = knobRef.current
    const wipe = wipeRef.current
    if (!knob) return
    knob.style.transition = 'transform 0.3s ease'
    knob.style.transform  = 'translateX(0px)'
    if (wipe) {
      wipe.style.transition = 'width 0.3s ease'
      wipe.style.width = '72px'
    }
    currentDelta.current  = 0
    setTimeout(() => {
      if (knobRef.current) knobRef.current.style.transition = ''
      if (wipeRef.current) wipeRef.current.style.transition = ''
    }, 300)
  }

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const handleKnobMouseDown = (e) => {
    e.preventDefault()
    dragging.current     = true
    startClientX.current = e.clientX
    const scaleX    = getScaleX()
    const maxTravel = getMaxTravel()

    const onMove = (e) => {
      if (!dragging.current) return
      const delta = Math.max(0, Math.min(maxTravel, (e.clientX - startClientX.current) * scaleX))
      currentDelta.current = delta
      if (knobRef.current) knobRef.current.style.transform = `translateX(${delta}px)`
      if (wipeRef.current) wipeRef.current.style.width = `${72 + delta}px`
    }

    const onUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
      if (currentDelta.current >= getMaxTravel() * 0.85) {
        onUnlockRef.current?.()
      } else {
        springBack()
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }

  // ── Touch drag (non-passive so we can preventDefault) ──────────────────────
  useEffect(() => {
    const knob = knobRef.current
    if (!knob) return

    const onTouchStart = (e) => {
      e.preventDefault()
      dragging.current     = true
      startClientX.current = e.touches[0].clientX
    }

    const onTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      const delta = Math.max(0, Math.min(
        getMaxTravel(),
        (e.touches[0].clientX - startClientX.current) * getScaleX()
      ))
      currentDelta.current = delta
      if (knobRef.current) knobRef.current.style.transform = `translateX(${delta}px)`
      if (wipeRef.current) wipeRef.current.style.width = `${72 + delta}px`
    }

    const onTouchEnd = () => {
      dragging.current = false
      if (currentDelta.current >= getMaxTravel() * 0.85) {
        onUnlockRef.current?.()
      } else {
        springBack()
      }
    }

    knob.addEventListener('touchstart', onTouchStart, { passive: false })
    knob.addEventListener('touchmove',  onTouchMove,  { passive: false })
    knob.addEventListener('touchend',   onTouchEnd)
    return () => {
      knob.removeEventListener('touchstart', onTouchStart)
      knob.removeEventListener('touchmove',  onTouchMove)
      knob.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return (
    <div className={`${styles.lockScreen} ${exiting ? styles.exiting : ''}`}>

      {/* Full-bleed wallpaper (behind all content, z-index 0) */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgBlack} />
        <img src={wallpaperSrc} className={styles.bgWallpaper} alt="" draggable={false} />
      </div>

      {/* Status bar — always dark on lock screen */}
      <StatusBar variant="dark" />

      {/* ── Clock band ──────────────────────────────────────────────────── */}
      <div className={styles.clockBand}>
        <div className={styles.clockTime}>9:41</div>
        <div className={styles.clockDate}>Sunday, January 30</div>
      </div>

      {/* ── Middle spacer ────────────────────────────────────────────────── */}
      <div className={styles.spacer} />

      {/* ── Slider band ──────────────────────────────────────────────────── */}
      <div className={styles.sliderBand}>
        <div ref={trackRef} className={styles.track}>

          {/* Shimmer text — offset right so the knob doesn't cover it */}
          <span className={styles.shimmerText}>slide to unlock</span>

          {/* Text wipe — matches track background, extends from left to knob's
           *  right edge. Covers shimmer text that the knob has passed over.
           *  Width updated imperatively during drag (same as knob transform). */}
          <div ref={wipeRef} className={styles.textWipe} />

          {/* Draggable knob */}
          <div
            ref={knobRef}
            className={styles.knob}
            onMouseDown={handleKnobMouseDown}
          >
            {/* Figma node 25:984 — gradient arrow with inner shadow, scaled to 1× */}
            <svg width="32" height="23" viewBox="0 0 64 45" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
              <g filter="url(#filter0_i_25_984)">
                <path d="M0 33.5V11.5H34V0L63.5 22.5L34 45V33.5H0Z" fill="url(#paint0_linear_25_984)"/>
              </g>
              <defs>
                <filter id="filter0_i_25_984" x="0" y="0" width="63.5" height="45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="1"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"/>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_25_984"/>
                </filter>
                <linearGradient id="paint0_linear_25_984" x1="31.75" y1="0" x2="31.75" y2="45" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C4C4C4"/>
                  <stop offset="0.491897" stopColor="#A4A4A4"/>
                  <stop offset="0.495077" stopColor="#8C8C8C"/>
                  <stop offset="1" stopColor="#616161"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>
      </div>

    </div>
  )
}
