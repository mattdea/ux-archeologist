// src/shared/index-museum/pictureStyle.js
//
// Which pictures the index museum shows for a room: the dot pictures, or the
// stamp pictures being compared with them (backlog, "stamp pictures, an
// option beside the dot pictures"; 10 Nov 2026). Chosen with the "Stamp
// pictures" line in the list and remembered per browser, on the dev server
// only: the production build always shows the dots.
import { useSyncExternalStore } from 'react'

const KEY = 'ux-archaeologist:index-pictures'
const listeners = new Set()

function read() {
  if (!import.meta.env.DEV) return 'dots'
  try { return localStorage.getItem(KEY) === 'stamps' ? 'stamps' : 'dots' } catch { return 'dots' }
}

let current = read()

export function pictureStyle() { return current }

export function setPictureStyle(style) {
  if (!import.meta.env.DEV) return
  const next = style === 'stamps' ? 'stamps' : 'dots'
  try { next === 'stamps' ? localStorage.setItem(KEY, 'stamps') : localStorage.removeItem(KEY) } catch { /* this visit only */ }
  if (next === current) return
  current = next
  listeners.forEach(l => l())
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

export function usePictureStyle() {
  return useSyncExternalStore(subscribe, pictureStyle, () => 'dots')
}
