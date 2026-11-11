// src/shared/index-museum/pointer.js
//
// Which pointer the index museum shows (backlog, "Index museum: a flint
// arrowhead as the museum's pointer"; 11 Nov 2026): 'arrowhead' (the
// default) or 'stick', the fossil stick Matthew wants to compare it with.
// Chosen in the dev panel (Museum > pointer) and remembered per browser, on
// the dev server only: production always shows the arrowhead, and the
// stick's styles and drawings are loaded only on the dev server.
//
// Mirrored as data-ix-pointer="arrowhead|stick" on <html>, which the
// styles key on (pointers.css, pointers-stick.css).
import { useSyncExternalStore } from 'react'
import './pointers.css'

const KEY = 'ux-archaeologist:index-pointer'
const listeners = new Set()
export const POINTERS = ['arrowhead', 'stick']
const valid = (v) => (POINTERS.includes(v) ? v : 'arrowhead')

if (import.meta.env.DEV) import('./pointers-stick.css')

function read() {
  if (!import.meta.env.DEV) return 'arrowhead'
  try { return valid(localStorage.getItem(KEY)) } catch { return 'arrowhead' }
}

let current = read()
mirror()

function mirror() {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-ix-pointer', current)
}

export function museumPointer() { return current }

export function setMuseumPointer(pointer) {
  if (!import.meta.env.DEV) return
  const next = valid(pointer)
  try { next !== 'arrowhead' ? localStorage.setItem(KEY, next) : localStorage.removeItem(KEY) } catch { /* this visit only */ }
  if (next === current) return
  current = next
  mirror()
  listeners.forEach(l => l())
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

export function useMuseumPointer() {
  return useSyncExternalStore(subscribe, museumPointer, () => 'arrowhead')
}
