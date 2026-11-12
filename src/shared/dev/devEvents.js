// src/shared/dev/devEvents.js
//
// The dev panel (DevPanel.jsx) changes settings that pages read when they
// draw: progress (the progress switch), the Classic timeline's line or cards, the
// collection's card style and art. It announces each change with one window
// event; a page that shows any of them re-reads on it. Dev server only: in
// production nothing sends the event and the hook does nothing.
import { useEffect, useRef } from 'react'

export const DEV_CHANGE = 'ux-archaeologist:dev-change'

export function devChanged() {
  window.dispatchEvent(new Event(DEV_CHANGE))
}

/** Calls `onChange` whenever the dev panel changes something */
export function useDevChange(onChange) {
  const ref = useRef(onChange)
  useEffect(() => { ref.current = onChange })
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    const on = () => ref.current()
    window.addEventListener(DEV_CHANGE, on)
    return () => window.removeEventListener(DEV_CHANGE, on)
  }, [])
}
