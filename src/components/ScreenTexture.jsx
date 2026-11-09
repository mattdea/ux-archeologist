// src/components/ScreenTexture.jsx
import { useLayoutEffect, useRef } from 'react'
import styles from './ScreenTexture.module.css'

/**
 * A 1984 fill pattern, drawn at a fixed on-screen size: the desktop's 50%
 * gray checkerboard by default, or `pattern="dkgray"`, QuickDraw's dark gray
 * (rows $77/$DD: three black, one white, shifted two each row), which shades
 * an opened icon, or any 8×8 pattern as 8 row bytes (high bit left), as the
 * Control Panel sets for the desktop.
 *
 * The Mac sits inside a `scale()` transform chosen by useArtifactFit. A
 * 1px checker scaled by 0.89× or 1.17× lands on fractional pixels and
 * beats against the display grid (moiré). This layer cancels that scale
 * (scale(1 / s)) so every square is exactly one CSS pixel on screen, and
 * shifts the pattern so its origin falls on a device pixel. The bezel can
 * be any size; the pixels of the screen never change size.
 *
 * Fills its nearest positioned parent. Re-measures on resize, and when the
 * parent changes size (a scroll track in a window being resized).
 */
/** An 8×8 pattern (8 row bytes, high bit left) as a CSS image, 1 px a bit. */
function patternImage(rows) {
  let rects = ''
  rows.forEach((byte, y) => {
    for (let x = 0; x < 8; x++) if (byte & (0x80 >> x)) rects += `<rect x='${x}' y='${y}' width='1' height='1'/>`
  })
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' shape-rendering='crispEdges'><rect width='8' height='8' fill='#fff'/>${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export default function ScreenTexture({ pattern = 'checker' }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host) return
    const frames = []

    const update = () => {
      const w = host.offsetWidth, h = host.offsetHeight
      if (!w || !h) return
      const r = host.getBoundingClientRect()
      const s = r.width / w || 1
      const dpr = window.devicePixelRatio || 1
      // Distance from the host's on-screen edge to the next device pixel.
      const snap = v => Math.ceil(v * dpr - 1e-4) / dpr - v
      el.style.width = `${w * s}px`
      el.style.height = `${h * s}px`
      el.style.transform = `scale(${1 / s})`
      el.style.backgroundPosition = `${snap(r.left)}px ${snap(r.top)}px`
    }
    // The fit is recomputed in the level's own layout effect and again one
    // frame later; measure after both have settled.
    const schedule = () => {
      frames.forEach(cancelAnimationFrame)
      frames.length = 0
      frames.push(requestAnimationFrame(() => {
        update()
        frames.push(requestAnimationFrame(update))
      }))
    }

    update()
    schedule()
    window.addEventListener('resize', schedule)
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    ro?.observe(host)
    return () => {
      frames.forEach(cancelAnimationFrame)
      window.removeEventListener('resize', schedule)
      ro?.disconnect()
    }
  }, [])

  const custom = Array.isArray(pattern) ? patternImage(pattern) : null
  return (
    <div
      ref={ref}
      className={`${styles.texture} ${pattern === 'dkgray' ? styles.dkgray : ''}`}
      style={custom ? { backgroundImage: custom, backgroundSize: '8px 8px', imageRendering: 'pixelated' } : undefined}
      aria-hidden="true"
    />
  )
}
