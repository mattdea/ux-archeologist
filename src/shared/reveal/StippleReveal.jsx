// src/shared/reveal/StippleReveal.jsx
//
// The device as a stipple drawing when you arrive and leave (backlog,
// "Levels: the device as a drawing when you arrive and leave"; experiment,
// 11 Nov 2026, piloted on Level 1 behind the dev panel's Levels > stipple).
// Museum layer: a canvas laid exactly over the device inside the level's
// scaler, so useArtifactFit's scale moves both together; the device itself
// is untouched. It never takes clicks.
//
// The drawing is assets/reveal/level-N.webp (scripts/reveal-drawing.mjs):
// its alpha is the device's silhouette, filled with the page colour so the
// live device doesn't show between the dots; its red marks each dot's
// centre and radius. Dots are drawn in the text colour, like the fossils,
// so it works on light and dark.
//
// `state`:
//   'drawn'    the whole drawing
//   'reveal'   dissolves dot by dot (about 700ms), then calls onDone
//   'clear'    nothing drawn
//   'settle'   the dissolve in reverse (about 900ms): the drawing comes back
// The dots go in a random order biased from top left to bottom right, like
// a brush stroke; each takes the patch of page colour under it with it.
// Under reduced motion it is a 200ms crossfade instead. No sound.
import { useEffect, useRef, useState } from 'react'
import s from './StippleReveal.module.css'

export const REVEAL_MS = 700
export const SETTLE_MS = 900
const FADE_MS = 200
const PATCH = 5          // natural px: the page-colour patches that go with the dots
// The device's own drop shadow reaches past its shape; a soft margin of page
// colour round the silhouette covers it while the device is a drawing, and
// goes patch by patch with the dots, so the shadow comes back with the device
const MARGIN = 110       // natural px, each side
const HALO_GROW = 70
const HALO_BLUR = 14
const HALO_DROP = 28
const DPR_CAP = 2       // device pixels per CSS pixel, at most

const src = (level) => (import.meta.env.DEV ? `/assets/reveal/level-${level}.webp` : null)

// One decoded drawing per level, shared between mounts
const cache = new Map()
function loadDrawing(level, width, height) {
  if (!cache.has(level)) {
    cache.set(level, new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const W = img.naturalWidth, H = img.naturalHeight, k = width / W   // file px → natural px
        const c = document.createElement('canvas'); c.width = W; c.height = H
        const g = c.getContext('2d', { willReadFrequently: true })
        g.drawImage(img, 0, 0)
        const px = g.getImageData(0, 0, W, H).data
        const dots = []
        // the silhouette as a white-on-transparent image, for clipping
        const shape = g.createImageData(W, H)
        for (let i = 0, n = W * H; i < n; i++) {
          const a = px[i * 4 + 3]
          shape.data[i * 4] = shape.data[i * 4 + 1] = shape.data[i * 4 + 2] = 255
          shape.data[i * 4 + 3] = a
          const r = px[i * 4]
          if (r && a) dots.push({ x: (i % W + 0.5) * k, y: (Math.floor(i / W) + 0.5) * k, r: (r / 4) * k })
        }
        g.putImageData(shape, 0, 0)
        // the area covered with page colour: the silhouette, and a soft halo
        // round it where the shadow falls (drawn several times to fill it in)
        const cover = document.createElement('canvas')
        cover.width = Math.round((width + 2 * MARGIN) / k); cover.height = Math.round((height + 2 * MARGIN) / k)
        const cg = cover.getContext('2d')
        // grown by HALO_GROW (the silhouette drawn round a ring), dropped a
        // little like the shadow, then softened
        cg.filter = `blur(${HALO_BLUR / k}px)`
        for (let i = 0; i < 24; i++) {
          const t = (i / 24) * Math.PI * 2
          cg.drawImage(c, (MARGIN + Math.cos(t) * HALO_GROW) / k, (MARGIN + HALO_DROP / 2 + Math.sin(t) * HALO_GROW) / k)
        }
        cg.filter = 'none'
        cg.drawImage(c, MARGIN / k, MARGIN / k)
        // the order things go in: by patch, biased top left → bottom right
        let seed = 7
        const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32 }
        // (patches and dots in the canvas's own coordinates, margin included)
        dots.forEach(d => { d.x += MARGIN; d.y += MARGIN })
        const cw = width + 2 * MARGIN, ch = height + 2 * MARGIN
        const cols = Math.ceil(cw / PATCH), rows = Math.ceil(ch / PATCH)
        const order = new Float32Array(cols * rows)
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          order[y * cols + x] = 0.55 * ((x / cols + y / rows) / 2) + 0.45 * rand()
        }
        const patchOf = (x, y) => Math.min(rows - 1, Math.floor(y / PATCH)) * cols + Math.min(cols - 1, Math.floor(x / PATCH))
        dots.forEach(d => { d.o = order[patchOf(d.x, d.y)] })
        const sorted = Uint32Array.from(order.keys()).sort((a, b) => order[a] - order[b])
        resolve({ cover, dots, order, sorted, cols, rows })
      }
      img.onerror = () => { cache.delete(level); reject(new Error(`no drawing for level ${level}`)) }
      img.src = src(level)
    }))
  }
  return cache.get(level)
}

// The whole drawing, once: page colour over the cover, then the dots
function paintAll(ctx, d, width, height, ink, paper) {
  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(d.cover, 0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = ink
  ctx.beginPath()
  for (const dot of d.dots) {
    ctx.moveTo(dot.x + dot.r, dot.y)
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
  }
  ctx.fill()
}

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export default function StippleReveal({ level, width, height, scale = 1, state, onDone }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(null)
  const doneRef = useRef(onDone)
  useEffect(() => { doneRef.current = onDone })

  // Never hold the level up: if the drawing hasn't dissolved soon after it
  // should have (not loaded, or a stalled frame loop), carry on anyway
  useEffect(() => {
    if (state !== 'reveal') return undefined
    const timer = setTimeout(() => doneRef.current?.(), REVEAL_MS + 1500)
    return () => clearTimeout(timer)
  }, [state])

  useEffect(() => {
    if (!src(level)) return undefined
    let live = true
    loadDrawing(level, width, height).then(d => { if (live) setDrawing(d) }).catch(() => {
      // no drawing yet (the script hasn't been run): don't hold the level up
      if (live && state === 'reveal') doneRef.current?.()
    })
    return () => { live = false }
  }, [level, width, height, state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !drawing) return undefined
    // sharp at the size it's shown: the screen's pixels times the fit's scale
    const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1) * Math.max(1, scale)
    const cw = width + 2 * MARGIN, ch = height + 2 * MARGIN
    const W = Math.round(cw * dpr), H = Math.round(ch * dpr)
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    const cs = getComputedStyle(canvas)
    const ink = cs.color, paper = cs.getPropertyValue('--reveal-paper').trim() || '#111'
    // the finished drawing, kept off screen: patches are cleared from the
    // canvas as they go and copied back from here as they return
    const full = document.createElement('canvas')
    full.width = W; full.height = H
    const fctx = full.getContext('2d')
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintAll(fctx, drawing, cw, ch, ink, paper)
    const showAll = () => { ctx.clearRect(0, 0, W, H); ctx.drawImage(full, 0, 0) }
    canvas.style.transition = 'none'
    canvas.style.opacity = '1'

    if (state === 'drawn') { showAll(); return undefined }
    if (state === 'clear') { ctx.clearRect(0, 0, W, H); return undefined }

    const going = state === 'reveal'
    const step = PATCH * dpr
    const box = (i) => {
      const x = i % drawing.cols, y = Math.floor(i / drawing.cols)
      const x0 = Math.round(x * step), y0 = Math.round(y * step)
      return [x0, y0, Math.round((x + 1) * step) - x0, Math.round((y + 1) * step) - y0]
    }
    let raf = 0
    const t0 = performance.now()

    if (reduced()) {
      // a plain crossfade
      showAll()
      canvas.style.opacity = going ? '1' : '0'
      void canvas.offsetWidth
      canvas.style.transition = `opacity ${FADE_MS}ms linear`
      canvas.style.opacity = going ? '0' : '1'
      const timer = setTimeout(() => {
        canvas.style.transition = 'none'
        canvas.style.opacity = '1'
        if (going) { ctx.clearRect(0, 0, W, H); doneRef.current?.() }
      }, FADE_MS)
      return () => clearTimeout(timer)
    }

    // Revealing starts from the whole drawing and clears patches in order;
    // settling starts from nothing and copies them back in reverse order
    const n = drawing.sorted.length
    let k = 0
    if (going) showAll(); else ctx.clearRect(0, 0, W, H)
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / (going ? REVEAL_MS : SETTLE_MS))
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2   // ease in-out
      const upto = Math.round(e * n)
      for (; k < upto; k++) {
        const i = going ? drawing.sorted[k] : drawing.sorted[n - 1 - k]
        const [x, y, w, h] = box(i)
        if (going) ctx.clearRect(x, y, w, h)
        else ctx.drawImage(full, x, y, w, h, x, y, w, h)
      }
      if (p < 1) raf = requestAnimationFrame(frame)
      else if (going) doneRef.current?.()
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [drawing, state, width, height, scale])

  if (!src(level)) return null
  return (
    <canvas
      ref={canvasRef}
      className={s.reveal}
      style={{ width: width + 2 * MARGIN, height: height + 2 * MARGIN, left: -MARGIN, top: -MARGIN }}
      aria-hidden="true"
      data-reveal-skip
      data-reveal-state={state}
    />
  )
}
