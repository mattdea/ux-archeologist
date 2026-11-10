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
