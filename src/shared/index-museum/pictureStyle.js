// src/shared/index-museum/pictureStyle.js
//
// Which pictures the index museum shows for a room, of the sets being
// compared (backlog, "stamp pictures" and "fossil pictures"; 10 Nov 2026):
// 'dots', 'stamps' or 'fossils'. Chosen under Pictures in the dev panel
// (src/shared/dev/DevPanel.jsx) and remembered per browser, on the dev
// server only: the production build always shows the dots.
import { useSyncExternalStore } from 'react'

const KEY = 'ux-archaeologist:index-pictures'
const listeners = new Set()
export const PICTURE_STYLES = ['dots', 'stamps', 'fossils']
const valid = (v) => (PICTURE_STYLES.includes(v) ? v : 'dots')

function read() {
  if (!import.meta.env.DEV) return 'dots'
  try { return valid(localStorage.getItem(KEY)) } catch { return 'dots' }
}

let current = read()

export function pictureStyle() { return current }

export function setPictureStyle(style) {
  if (!import.meta.env.DEV) return
  const next = valid(style)
  try { next !== 'dots' ? localStorage.setItem(KEY, next) : localStorage.removeItem(KEY) } catch { /* this visit only */ }
  if (next === current) return
  current = next
  listeners.forEach(l => l())
}

/** The set after the current one, round to the dots again */
export function nextPictureStyle(style = current) {
  return PICTURE_STYLES[(PICTURE_STYLES.indexOf(style) + 1) % PICTURE_STYLES.length]
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

export function usePictureStyle() {
  return useSyncExternalStore(subscribe, pictureStyle, () => 'dots')
}
