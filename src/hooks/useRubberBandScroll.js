// src/hooks/useRubberBandScroll.js
//
// Touch-style drag scrolling with iOS rubber-band overscroll.
//
// Usage:
//   const { onMouseDown } = useRubberBandScroll(containerRef, contentRef)
//   <div ref={containerRef} style={{ overflow: 'hidden' }}>
//     <div ref={contentRef} onMouseDown={onMouseDown}>…</div>
//   </div>
//
// How it works:
//   • scroll position is tracked as `pos` (px from top, clamped to [0, maxScroll])
//   • content is rendered via transform: translateY(-pos) to allow visual overscroll
//   • past boundaries the displacement is damped by 0.3×
//   • on release a spring snap-back transition fires if pos is out of bounds
//   • mouse drag uses window-level listeners so it works when cursor leaves container
//   • touch drag uses passive:false so we can preventDefault to block page scroll
//   • clicks suppressed if total drag distance > 8px

import { useCallback, useEffect, useRef } from 'react'

const RUBBER_FACTOR = 0.3
const SNAP_DURATION = 300 // ms
const SNAP_EASING   = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

export function useRubberBandScroll(containerRef, contentRef) {
  // Mutable state kept in a single ref to avoid stale closures in event handlers.
  const s = useRef({
    pos:         0,    // current scroll position (px, 0 = top)
    dragging:    false,
    startY:      0,    // pointer Y at drag start
    startPos:    0,    // pos at drag start
    didMove:     false,
    snapping:    false,
  })

  // ── Helpers ───────────────────────────────────────────────────────────────

  function maxScroll() {
    const container = containerRef.current
    const content   = contentRef.current
    if (!container || !content) return 0
    return Math.max(0, content.scrollHeight - container.clientHeight)
  }

  function applyPos(pos, withTransition = false) {
    const content = contentRef.current
    if (!content) return
    if (withTransition) {
      content.style.transition = `transform ${SNAP_DURATION}ms ${SNAP_EASING}`
    } else {
      content.style.transition = 'none'
    }
    content.style.transform = `translateY(${-pos}px)`
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  // Apply rubber-band damping past boundaries.
  function rubberPos(rawPos) {
    const max = maxScroll()
    if (rawPos < 0) {
      return rawPos * RUBBER_FACTOR
    }
    if (rawPos > max) {
      return max + (rawPos - max) * RUBBER_FACTOR
    }
    return rawPos
  }

  function snapIfNeeded() {
    const max     = maxScroll()
    const clamped = clamp(s.current.pos, 0, max)
    if (clamped === s.current.pos) return
    s.current.pos      = clamped
    s.current.snapping = true
    applyPos(clamped, true)

    const content = contentRef.current
    if (content) {
      const onEnd = () => {
        s.current.snapping = false
        content.style.transition = 'none'
        content.removeEventListener('transitionend', onEnd)
      }
      content.addEventListener('transitionend', onEnd, { once: true })
    }
  }

  // ── Mouse handlers ────────────────────────────────────────────────────────

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    s.current.dragging  = true
    s.current.startY    = e.clientY
    s.current.startPos  = s.current.pos
    s.current.didMove   = false
    if (contentRef.current) contentRef.current.style.transition = 'none'
  }, [contentRef])

  useEffect(() => {
    function onMouseMove(e) {
      if (!s.current.dragging) return
      const dy = s.current.startY - e.clientY
      if (Math.abs(dy) > 8) s.current.didMove = true
      const rawPos = s.current.startPos + dy
      s.current.pos = rubberPos(rawPos)
      applyPos(s.current.pos)
    }

    function onMouseUp(e) {
      if (!s.current.dragging) return
      s.current.dragging = false

      // Suppress the next click event if we actually scrolled
      if (s.current.didMove) {
        window.addEventListener('click', suppressClick, { capture: true, once: true })
      }

      snapIfNeeded()
    }

    function suppressClick(e) {
      e.stopPropagation()
      e.preventDefault()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [containerRef, contentRef])

  // ── Touch handlers ────────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartY  = 0
    let touchStartPos = 0
    let touchMoved   = false

    function onTouchStart(e) {
      const touch = e.touches[0]
      touchStartY   = touch.clientY
      touchStartPos = s.current.pos
      touchMoved    = false
      if (contentRef.current) contentRef.current.style.transition = 'none'
    }

    function onTouchMove(e) {
      const touch = e.touches[0]
      const dy    = touchStartY - touch.clientY
      if (Math.abs(dy) > 8) touchMoved = true
      const rawPos  = touchStartPos + dy
      s.current.pos = rubberPos(rawPos)
      applyPos(s.current.pos)
      e.preventDefault()
    }

    function onTouchEnd() {
      snapIfNeeded()
    }

    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove',  onTouchMove,  { passive: false })
    container.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove',  onTouchMove)
      container.removeEventListener('touchend',   onTouchEnd)
    }
  }, [containerRef, contentRef])

  // Block wheel scrolling — drag only.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    function onWheel(e) { e.preventDefault() }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [containerRef])

  return { onMouseDown }
}
