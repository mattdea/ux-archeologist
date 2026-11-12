// src/audio/sound.js
//
// The museum's sound switch: on or off, remembered per browser, on by
// default (backlog, "Fixes: leaving during a boot, a sound switch…",
// item 2). Every sound goes through src/audio/sfx.js, which reads this
// before playing and stops whatever is playing when it is turned off.
// The Index shows it as the "Sound" line under Dark mode; Classic as
// "Sound on" / "Sound off" beside Back to timeline and on its timeline.
import { useSyncExternalStore } from 'react'

const KEY = 'ux-archaeologist:sound'
const listeners = new Set()

function read() {
  try { return localStorage.getItem(KEY) !== 'off' } catch { return true }
}

let current = read()

export function soundOn() { return current }

export function setSoundOn(on) {
  const next = !!on
  try { next ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, 'off') } catch { /* storage blocked: for this visit only */ }
  if (next === current) return
  current = next
  listeners.forEach(l => l(current))
}

/** Calls `l(on)` whenever the switch changes; returns the unsubscribe. */
export function onSoundChange(l) { listeners.add(l); return () => listeners.delete(l) }

export function useSoundOn() {
  return useSyncExternalStore(onSoundChange, soundOn, () => true)
}
