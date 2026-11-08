// src/components/web/useNetscapeLoad.js
//
// A 1995 page load, the way Netscape 2 on a 28.8k modem did it:
//
//   contact   "Connect: Contacting host www.yahoo.com..."   old page stays up
//   reply     "Connect: Host contacted. Waiting for reply..."
//   transfer  "Transferring data from www.yahoo.com..."     new page starts
//             "47% of 23K (at 2.4K/sec)"                     …and fills in
//   done      "Document: Done"
//
// Progress arrives in uneven bursts. The throbber runs from contact to done.
// `slow` is the first load of the session (the modem is still warming up).

import { useState, useRef, useCallback, useEffect } from 'react'

const rnd = (lo, hi) => lo + Math.random() * (hi - lo)

export default function useNetscapeLoad() {
  // { page, host, kb, stage, pct, rate } | null
  const [load, setLoad] = useState(null)
  const timers = useRef([])
  const onDoneRef = useRef(null)

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => clear, [clear])

  /**
   * @param {string} page   key of the page being fetched
   * @param {object} opts
   * @param {string} opts.host   shown in the status bar
   * @param {number} opts.kb     fake document size, for the percentage line
   * @param {boolean} [opts.slow]  first load: longer handshake, slower bytes
   * @param {() => void} [opts.onDone]
   */
  const start = useCallback((page, { host, kb, slow = false, onDone }) => {
    clear()
    onDoneRef.current = onDone
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    const t = slow ? 1.9 : 1

    setLoad({ page, host, kb, stage: 'contact', pct: 0, rate: 0 })
    at(350 * t, () => setLoad(l => l && { ...l, stage: 'reply' }))
    at(650 * t, () => setLoad(l => l && { ...l, stage: 'transfer', pct: 0 }))

    // Bytes trickle in: a tick every ~110ms, each a random step, so the
    // counter stalls and lurches like a real transfer.
    let pct = 0
    const tick = () => {
      pct = Math.min(100, pct + rnd(slow ? 2 : 4, slow ? 8 : 13))
      const rate = +rnd(1.7, 3.3).toFixed(1)
      if (pct >= 100) {
        setLoad(l => l && { ...l, stage: 'done', pct: 100, rate })
        onDoneRef.current?.()
        return
      }
      setLoad(l => l && { ...l, pct: Math.round(pct), rate })
      at(rnd(80, 150) * (slow ? 1.3 : 1), tick)
    }
    at(800 * t, tick)
  }, [clear])

  const loading = !!load && load.stage !== 'done'

  // Status bar line for the current stage
  const status = (() => {
    if (!load) return 'Document: Done'
    switch (load.stage) {
      case 'contact':  return `Connect: Contacting host ${load.host}...`
      case 'reply':    return 'Connect: Host contacted. Waiting for reply...'
      case 'transfer': return load.pct === 0
        ? `Transferring data from ${load.host}...`
        : `${load.pct}% of ${load.kb}K (at ${load.rate}K/sec)`
      default:         return 'Document: Done'
    }
  })()

  // 0..1 of the new page received; null while the old page should stay up
  const progress = !load ? 1
    : load.stage === 'transfer' ? load.pct / 100
    : load.stage === 'done' ? 1
    : null

  return { load, loading, status, progress, start }
}
