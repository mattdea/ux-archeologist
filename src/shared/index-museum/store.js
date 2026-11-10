// src/shared/index-museum/store.js
//
// What the open level shows in the index museum's list. In the index
// museum a level's IntroModal, ObjectiveTracker, HintPill and DiscoveryCard
// (src/shared/museum/) draw nothing themselves; they publish their props
// here and the list (IndexMuseum.jsx) draws them as lines. The level's own
// state machine is untouched, so flipping the museum mid-level keeps its
// place.
//
// Also: `peek`, the room under the pointer or holding focus, whose dot
// picture shows beside the list (and whose card and line light together).
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'

let state = { intro: null, tracker: null, hint: null, discovery: null, peek: null }
const listeners = new Set()

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach(l => l())
}
function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

export function useIndexSlots() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export function setPeek(level) { if (state.peek !== level) set({ peek: level }) }
export function clearPeek(level) { if (state.peek === level) set({ peek: null }) }

/** Pointer and focus handlers that make a room the peeked one */
export const peekHandlers = (level) => ({
  onMouseEnter: () => setPeek(level),
  onMouseLeave: () => clearPeek(level),
  onFocus: () => setPeek(level),
  onBlur: () => clearPeek(level),
})

// Values only, so a new callback identity on every render of the level
// doesn't redraw the list; the latest callbacks are read through a ref.
function sameData(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every(k => typeof a[k] === 'function' || JSON.stringify(a[k]) === JSON.stringify(b[k]))
}

/**
 * Publish `value` under `slot` while the calling component is mounted.
 * Function-valued fields are wrapped so they always call the latest one.
 */
export function usePublish(slot, value) {
  const latest = useRef(value)
  latest.current = value
  useLayoutEffect(() => {
    if (value === null || typeof value !== 'object') {
      if (state[slot] !== value) set({ [slot]: value })
      return
    }
    const wrapped = Object.fromEntries(Object.entries(value).map(([k, v]) => [
      k, typeof v === 'function' ? (...args) => latest.current[k](...args) : v,
    ]))
    if (!sameData(state[slot], wrapped)) set({ [slot]: wrapped })
  })
  useLayoutEffect(() => () => set({ [slot]: null }), [slot])
}

/** Tests */
export function _resetIndexSlots() { state = { intro: null, tracker: null, hint: null, discovery: null, peek: null }; listeners.forEach(l => l()) }
