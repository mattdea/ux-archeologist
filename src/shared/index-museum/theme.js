// src/shared/index-museum/theme.js
//
// The index museum's light or dark theme, chosen with the "Dark mode" line
// in the list and remembered per browser. Light is the default. Mirrored as
// data-index-theme="light|dark" on <html>, which IndexMuseum.module.css keys
// its colour tokens on (and the room behind the artifact, via --ix-room).
// Dark suits the artifacts, which were designed on the classic museum's
// dark room.
import { useSyncExternalStore } from 'react'

const KEY = 'ux-archaeologist:index-theme'
const listeners = new Set()

function read() {
  try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}

let current = read()
mirror()

function mirror() {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-index-theme', current)
}

export function indexTheme() { return current }

export function setIndexTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  try { next === 'dark' ? localStorage.setItem(KEY, 'dark') : localStorage.removeItem(KEY) } catch { /* storage blocked: for this visit only */ }
  if (next === current) return
  current = next
  mirror()
  listeners.forEach(l => l())
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

export function useIndexTheme() {
  return useSyncExternalStore(subscribe, indexTheme, () => 'light')
}
