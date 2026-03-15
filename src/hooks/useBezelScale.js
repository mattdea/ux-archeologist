// src/hooks/useBezelScale.js
import { useState, useEffect } from 'react'

/**
 * Returns a CSS scale factor (0 < scale ≤ 1.0) so that a box of
 * bezelWidth × bezelHeight fits inside the viewport with the given margins.
 * Recalculates on window resize.
 *
 * @param {number} bezelWidth   Native bezel width in px
 * @param {number} bezelHeight  Native bezel height in px
 * @param {object} [opts]
 * @param {number} [opts.marginX=24]      Min px from left/right viewport edge
 * @param {number} [opts.marginTop=48]    Min px from top (clears HUD era label)
 * @param {number} [opts.marginBottom=48] Min px from bottom (clears artifact counter)
 */
export default function useBezelScale(
  bezelWidth,
  bezelHeight,
  { marginX = 24, marginTop = 48, marginBottom = 48 } = {}
) {
  const calcScale = () => {
    const availW = window.innerWidth  - marginX * 2
    const availH = window.innerHeight - marginTop - marginBottom
    return Math.min(availW / bezelWidth, availH / bezelHeight, 1)
  }

  const [scale, setScale] = useState(calcScale)

  useEffect(() => {
    const onResize = () => setScale(calcScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, []) // margins and bezel dims are stable constants passed from Level1

  return scale
}
