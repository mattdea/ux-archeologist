// src/components/phone/TouchCursor.jsx
//
// Simulated finger touch indicator inside the phone screen.
// Attaches event listeners directly to containerRef to avoid React
// re-renders on every mousemove. DOM refs drive all visual updates.
//
// Props:
//   containerRef — ref to the screen slot div (PhoneFrame's .screen element)

import { useEffect, useRef } from 'react'
import styles from './TouchCursor.module.css'

export default function TouchCursor({ containerRef }) {
  const posRef    = useRef(null)  // positioning wrapper
  const circleRef = useRef(null)  // touch circle
  const rippleRef = useRef(null)  // ripple ring

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Move the indicator to the pointer and show it. Every show goes through
    // here so the indicator is never visible at its unpositioned origin (the
    // screen's top-left corner). Returns false if the point is outside.
    const place = (e) => {
      const rect = container.getBoundingClientRect()
      const inside = rect.width > 0 &&
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      if (!inside || !posRef.current) return false
      // getBoundingClientRect gives visual (scaled) coordinates.
      // translate() operates in the element's local (unscaled) coordinate space.
      // Multiply by the layout/visual ratio to convert correctly.
      const scaleX = container.offsetWidth  / rect.width
      const scaleY = container.offsetHeight / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top)  * scaleY
      posRef.current.style.transform = `translate(${x}px, ${y}px)`
      posRef.current.style.opacity = '1'
      return true
    }

    // Move also shows the indicator: the pointer may already be inside when
    // this mounts.
    const handleMouseMove = (e) => { place(e) }

    // The browser also fires mouseenter when the screen appears under a still
    // pointer (e.g. when the intro modal closes), so position before showing.
    const handleMouseEnter = (e) => { place(e) }

    const handleMouseLeave = () => {
      if (posRef.current) posRef.current.style.opacity = '0'
      // Release pressed state when cursor exits screen
      if (circleRef.current) circleRef.current.classList.remove(styles.circlePressed)
    }

    const handleMouseDown = () => {
      if (circleRef.current) circleRef.current.classList.add(styles.circlePressed)
    }

    const handleMouseUp = () => {
      if (circleRef.current) circleRef.current.classList.remove(styles.circlePressed)
      // Fire ripple — remove + reflow + re-add restarts the CSS animation
      if (rippleRef.current) {
        rippleRef.current.classList.remove(styles.rippleActive)
        void rippleRef.current.offsetWidth // force reflow
        rippleRef.current.classList.add(styles.rippleActive)
      }
    }

    container.addEventListener('mousemove',  handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mousedown',  handleMouseDown)
    container.addEventListener('mouseup',    handleMouseUp)

    return () => {
      container.removeEventListener('mousemove',  handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mousedown',  handleMouseDown)
      container.removeEventListener('mouseup',    handleMouseUp)
    }
  }, [containerRef])

  return (
    <div className={styles.layer}>
      {/* Invisible until place() has put it under the pointer */}
      <div ref={posRef} className={styles.pos} style={{ opacity: 0 }}>
        <div ref={circleRef} className={styles.circle} />
        <div ref={rippleRef} className={styles.ripple} />
      </div>
    </div>
  )
}
