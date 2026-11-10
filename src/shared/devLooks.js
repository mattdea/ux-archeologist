// src/shared/devLooks.js
//
// Looks under consideration, switchable on the dev server only, remembered
// per browser. 'serif-titles': every level title (HUD, dot tooltips,
// timeline, intro card, discovery card) in Instrument Serif, to tie the
// museum to the collection's cards. Applied as a data attribute on <html>;
// the styles live with each component under :global([data-serif-titles]).
const KEY = 'ux-archaeologist:serif-titles'

export function serifTitlesOn() {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

export function setSerifTitles(on) {
  try { on ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY) } catch { /* storage blocked */ }
  document.documentElement.toggleAttribute('data-serif-titles', on)
}

/** Called once at start-up on the dev server */
export function applyDevLooks() {
  document.documentElement.toggleAttribute('data-serif-titles', serifTitlesOn())
}

// 'card-timeline': the timeline as a path of the collection's cards, face
// down until a room is finished and turned over when you come back. While
// on, the discovery card's Continue returns to the timeline so the turn is
// seen. Remembered per browser, dev server only.
const CARD_TIMELINE_KEY = 'ux-archaeologist:card-timeline'
export function cardTimelineOn() {
  if (!import.meta.env.DEV) return false
  try { return localStorage.getItem(CARD_TIMELINE_KEY) === '1' } catch { return false }
}
export function setCardTimeline(on) {
  try { on ? localStorage.setItem(CARD_TIMELINE_KEY, '1') : localStorage.removeItem(CARD_TIMELINE_KEY) } catch { /* storage blocked */ }
}

// Cards already seen face up on the path; a finished room not in this list
// turns over the next time the path is shown
const SEEN_KEY = 'ux-archaeologist:cards-seen'
export function cardsSeen() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY)) ?? [] } catch { return [] }
}
export function markCardsSeen(levels) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...new Set([...cardsSeen(), ...levels])])) } catch { /* storage blocked */ }
}
export function forgetCardsSeen() {
  try { localStorage.removeItem(SEEN_KEY) } catch { /* storage blocked */ }
}
