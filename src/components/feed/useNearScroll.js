// src/components/feed/useNearScroll.js
// Lazy photos for the feed. The browser's own loading="lazy" only fires once
// an image is inside the phone's clipped screen, so a fling showed grey
// squares. This watches the image against its own scroll area with about two
// screens of margin above and below, and stays true once it has been near.
import { useEffect, useRef, useState } from 'react'

const MARGIN = '1200px 0px'
const observers = new WeakMap()   // scroll root → { io, callbacks }

function scrollRootOf(el) {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (overflowY === 'auto' || overflowY === 'scroll') return p
  }
  return null
}

function observe(el, onNear) {
  const root = scrollRootOf(el)
  let entry = observers.get(root ?? document)
  if (!entry) {
    const callbacks = new Map()
    const io = new IntersectionObserver((records) => {
      for (const r of records) {
        if (r.isIntersecting) { callbacks.get(r.target)?.(); }
      }
    }, { root, rootMargin: MARGIN })
    entry = { io, callbacks }
    observers.set(root ?? document, entry)
  }
  entry.callbacks.set(el, onNear)
  entry.io.observe(el)
  return () => { entry.io.unobserve(el); entry.callbacks.delete(el) }
}

/** Returns [ref, near]: near turns true once the element is within ~2 screens. */
export default function useNearScroll() {
  const ref = useRef(null)
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    if (near || !ref.current) return
    return observe(ref.current, () => setNear(true))
  }, [near])
  return [ref, near]
}
