// src/shared/museumStyle.js
//
// Which museum renders: 'classic' (the museum as it was at the tag
// museum-classic) or 'index' (one monospace list that is the whole museum;
// backlog, "the index museum"). This is the one place that decides. On the
// dev server it is remembered per browser and can be flipped at any time,
// mid-level included: only the presentation changes, so a level keeps its
// place. The production build is always 'classic' until Matthew says
// otherwise.
//
// The choice is mirrored as data-museum="classic|index" on <html>, which
// the index museum's global rules key on.
import { useSyncExternalStore } from 'react'

const KEY = 'ux-archaeologist:museum'
const listeners = new Set()

function read() {
  if (!import.meta.env.DEV) return 'classic'
  try { return localStorage.getItem(KEY) === 'index' ? 'index' : 'classic' } catch { return 'classic' }
}

let current = read()
mirror()

function mirror() {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-museum', current)
}

export function museumStyle() { return current }

export function setMuseumStyle(style) {
  if (!import.meta.env.DEV) return
  const next = style === 'index' ? 'index' : 'classic'
  try { next === 'index' ? localStorage.setItem(KEY, 'index') : localStorage.removeItem(KEY) } catch { /* storage blocked: for this visit only */ }
  if (next === current) return
  current = next
  mirror()
  listeners.forEach(l => l())
  // the artifact's fit depends on the HUD's boxes, which have just changed
  if (typeof window !== 'undefined') requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l) }

/** 'classic' | 'index', re-rendering when it changes */
export function useMuseumStyle() {
  return useSyncExternalStore(subscribe, museumStyle, () => 'classic')
}

/** Re-read storage (tests) */
export function _reloadMuseumStyle() { current = read(); mirror(); listeners.forEach(l => l()) }
