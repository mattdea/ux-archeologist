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

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      // getBoundingClientRect gives visual (scaled) coordinates.
      // translate() operates in the element's local (unscaled) coordinate space.
      // Multiply by the layout/visual ratio to convert correctly.
      const scaleX = container.offsetWidth  / rect.width
      const scaleY = container.offsetHeight / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top)  * scaleY
      if (posRef.current) {
        posRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const handleMouseEnter = () => {
      if (posRef.current) posRef.current.style.opacity = '1'
    }

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
      {/* Initially invisible — handleMouseEnter shows it */}
      <div ref={posRef} className={styles.pos} style={{ opacity: 0 }}>
        <div ref={circleRef} className={styles.circle} />
        <div ref={rippleRef} className={styles.ripple} />
      </div>
    </div>
  )
}
