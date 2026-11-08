// src/components/web/ProgressiveReveal.jsx
//
// Renders a page the way a 1995 browser drew it off the wire: block by block
// from the top as the bytes arrive, the page growing as each block appears.
// Works on any page component without changing it: the blocks are the direct
// children of the page root (or of its only child, for pages with a single
// layout wrapper). `progress` is 0..1; at 1 everything is shown.

import { useLayoutEffect, useRef } from 'react'

export default function ProgressiveReveal({ progress = 1, children }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const host = ref.current
    const root = host?.firstElementChild
    if (!root) return
    let blocks = Array.from(root.children)
    if (blocks.length === 1 && blocks[0].children.length > 1) blocks = Array.from(blocks[0].children)
    const n = blocks.length
    // Round up: the first block shows as soon as any bytes have arrived, so a
    // page that stages its own images (Yahoo) is never left blank.
    const shown = progress >= 1 ? n : Math.ceil(Math.max(0, progress) * n)
    blocks.forEach((el, i) => { el.style.display = i < shown ? '' : 'none' })
    return () => { if (progress >= 1) blocks.forEach(el => { el.style.display = '' }) }
  })

  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>
}
