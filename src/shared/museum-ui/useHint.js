// src/shared/museum-ui/useHint.js
//
// A quiet nudge for a player who has stalled. Given one hint per objective,
// returns the hint for the first unfinished objective once `delay` ms have
// passed with no progress, or null. The clock starts when the level becomes
// active and restarts every time an objective is completed, so a player who
// is moving never sees a hint.

import { useEffect, useState } from 'react'

export const HINT_DELAY_MS = 20000

export default function useHint(hints, { active, completedIndices, delay = HINT_DELAY_MS }) {
  const next = hints.findIndex((_, i) => !completedIndices.includes(i))
  // One key per "waiting period": changes whenever an objective completes
  // (even if the next hint is the same), which invalidates a shown hint and
  // restarts the clock without any state reset.
  const key = active && next !== -1 ? `${next}:${completedIndices.length}` : null
  const [shownKey, setShownKey] = useState(null)

  useEffect(() => {
    if (!key) return
    const t = setTimeout(() => setShownKey(key), delay)
    return () => clearTimeout(t)
  }, [key, delay])

  return key && shownKey === key ? hints[next] : null
}
