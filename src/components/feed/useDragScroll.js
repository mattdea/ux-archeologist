// src/components/feed/useDragScroll.js
//
// Touch-style scrolling for the feed with a mouse: press and drag to scroll,
// release to fling. Works on any `.feedScroll` (vertical) and `.tagRow`
// (horizontal) inside the app; the mouse wheel keeps working as normal.
//
// Feel, matched to iOS 9 UIScrollView and Level 3's useRubberBandScroll:
//   • 1:1 tracking while dragging (corrected for the device's CSS scale)
//   • past an edge the content follows at 0.3×, then snaps back
//     (300ms, cubic-bezier(0.25, 0.46, 0.45, 0.94))
//   • a fling decelerates at 0.998 per ms (UIScrollViewDecelerationRateNormal)
//     and bounces softly if it runs into an edge
//   • a drag of more than 6pt never counts as a tap, so it can't open a post
//     or trigger a double-tap like
//
// Usage: useDragScroll(rootRef) — rootRef is the app's root element.

import { useEffect } from 'react'

const START_SLOP = 6          // pt of movement before a press becomes a drag
const RUBBER = 0.3
const DECEL = 0.998           // per ms
const MIN_SPEED = 0.02        // pt/ms; below this a fling stops
const SNAP = 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const VELOCITY_WINDOW = 80    // ms of pointer history used for fling speed

export default function useDragScroll(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let drag = null                // active press/drag
    let fling = null               // { raf } while a fling runs
    let bounceTimer = null

    // ── Axis helpers: read/write scroll position and overscroll transform ──
    const axisApi = (el, axis) => axis === 'y'
      ? {
          get: () => el.scrollTop,
          set: v => { el.scrollTop = v },
          max: () => el.scrollHeight - el.clientHeight,
          shift: px => { el.style.transform = px ? `translateY(${px}px)` : '' },
        }
      : {
          get: () => el.scrollLeft,
          set: v => { el.scrollLeft = v },
          max: () => el.scrollWidth - el.clientWidth,
          shift: px => { el.style.transform = px ? `translateX(${px}px)` : '' },
        }

    function stopFling() {
      if (fling) cancelAnimationFrame(fling.raf)
      fling = null
    }

    function snapBack(el, api) {
      el.style.transition = SNAP
      api.shift(0)
      clearTimeout(bounceTimer)
      bounceTimer = setTimeout(() => { el.style.transition = '' }, 320)
    }

    // A fling that hits an edge overshoots a little, then snaps back.
    function bounce(el, api, speed, dir) {
      const dist = Math.min(Math.abs(speed) * 22, 48)
      el.style.transition = 'transform 140ms cubic-bezier(0.2, 0.6, 0.35, 1)'
      api.shift(dir * dist)
      clearTimeout(bounceTimer)
      bounceTimer = setTimeout(() => snapBack(el, api), 140)
    }

    function startFling(el, api, v) {
      let last = performance.now()
      const step = (now) => {
        const dt = Math.min(now - last, 32)
        last = now
        const max = api.max()
        const next = api.get() + v * dt
        if (next <= 0 || next >= max) {
          api.set(Math.max(0, Math.min(max, next)))
          // Content keeps travelling the way it was going: down at the top,
          // up at the bottom.
          bounce(el, api, v, next <= 0 ? 1 : -1)
          fling = null
          return
        }
        api.set(next)
        v *= Math.pow(DECEL, dt)
        if (Math.abs(v) < MIN_SPEED) { fling = null; return }
        fling.raf = requestAnimationFrame(step)
      }
      fling = { raf: requestAnimationFrame(step) }
    }

    // ── Pointer handling ──
    function onDown(e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      const v = e.target.closest('.feedScroll')
      const h = e.target.closest('.tagRow')
      if (!v && !h) return
      stopFling()
      const scaleEl = v || h
      const rect = scaleEl.getBoundingClientRect()
      drag = {
        v, h,
        scale: (rect.height / scaleEl.offsetHeight) || 1,
        x0: e.clientX, y0: e.clientY,
        axis: null, el: null, api: null, start: 0, over: 0,
        samples: [],
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    }

    function onMove(e) {
      if (!drag) return
      const dx = (e.clientX - drag.x0) / drag.scale
      const dy = (e.clientY - drag.y0) / drag.scale

      if (!drag.axis) {
        if (Math.hypot(dx, dy) < START_SLOP) return
        if (drag.h && Math.abs(dx) > Math.abs(dy)) drag.axis = 'x'
        else if (drag.v) drag.axis = 'y'
        else { end(); return }
        drag.el = drag.axis === 'x' ? drag.h : drag.v
        drag.api = axisApi(drag.el, drag.axis)
        drag.start = drag.api.get()
        drag.el.style.transition = ''
        clearTimeout(bounceTimer)
        root.classList.add('feedDragging')
      }

      const d = drag.axis === 'x' ? dx : dy
      const max = drag.api.max()
      const target = drag.start - d
      let over = 0
      if (target < 0) { drag.api.set(0); over = -target * RUBBER }
      else if (target > max) { drag.api.set(max); over = (max - target) * RUBBER }
      else drag.api.set(target)
      drag.over = over
      drag.api.shift(over)

      const now = performance.now()
      drag.samples.push({ t: now, p: d })
      while (drag.samples.length > 2 && now - drag.samples[0].t > VELOCITY_WINDOW) drag.samples.shift()
    }

    function onUp() {
      if (!drag) return
      if (drag.axis) {
        // The click that follows a drag must not count as a tap.
        const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault() }
        window.addEventListener('click', swallow, { capture: true, once: true })
        setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)

        const { el, api, samples } = drag
        if (drag.over) {
          snapBack(el, api)
        } else if (samples.length >= 2) {
          const a = samples[0]
          const b = samples[samples.length - 1]
          const dt = b.t - a.t
          // Pointer moving down/right scrolls content back toward the start.
          const v = dt > 0 ? -(b.p - a.p) / dt : 0
          if (Math.abs(v) > MIN_SPEED) startFling(el, api, v)
        }
      }
      end()
    }

    function end() {
      root.classList.remove('feedDragging')
      drag = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }

    // Wheel or trackpad takes over from a running fling.
    const onWheel = () => stopFling()
    const noDrag = (e) => e.preventDefault()

    root.addEventListener('pointerdown', onDown)
    root.addEventListener('wheel', onWheel, { passive: true })
    root.addEventListener('dragstart', noDrag)
    return () => {
      stopFling()
      clearTimeout(bounceTimer)
      end()
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('dragstart', noDrag)
    }
  }, [rootRef])
}
