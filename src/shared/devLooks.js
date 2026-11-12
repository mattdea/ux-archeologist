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

// 'catalogue-record' (experiment, backlog "Levels: the catalogue record
// around the device" and "level screen fixes"; 11 Nov 2026): each level's
// device annotated the way a catalogue records an object
// (src/shared/catalogue/). On by default; turning it off is remembered per
// browser ('0'). Dev server only: production has no record.
const CATALOGUE_KEY = 'ux-archaeologist:catalogue-record'
export function catalogueRecordOn() {
  if (!import.meta.env.DEV) return false
  try { return localStorage.getItem(CATALOGUE_KEY) !== '0' } catch { return true }
}
export function setCatalogueRecord(on) {
  if (!import.meta.env.DEV) return
  try { on ? localStorage.removeItem(CATALOGUE_KEY) : localStorage.setItem(CATALOGUE_KEY, '0') } catch { /* storage blocked */ }
}

// 'index-level-layout' (backlog, "Index museum: the device centred, the list
// in the corners"; 11 Nov 2026): inside a level, the index museum's list as
// four corner blocks round a centred device ('corners', the default) or the
// earlier column down the left ('side'), kept so Matthew can compare.
// Remembered per browser; the switch is the dev server's only.
const LEVEL_LAYOUT_KEY = 'ux-archaeologist:index-level-layout'
export function indexLevelLayout() {
  if (!import.meta.env.DEV) return 'corners'
  try { return localStorage.getItem(LEVEL_LAYOUT_KEY) === 'side' ? 'side' : 'corners' } catch { return 'corners' }
}
export function setIndexLevelLayout(layout) {
  if (!import.meta.env.DEV) return
  try { layout === 'side' ? localStorage.setItem(LEVEL_LAYOUT_KEY, 'side') : localStorage.removeItem(LEVEL_LAYOUT_KEY) } catch { /* storage blocked */ }
}

// 'index-timeline' (backlog, "Index museum: one home page, the timeline
// opening under Enter", part 4; 12 Nov 2026): the home page's timeline as
// today's list ('list', the default), a to-scale line, cards in a row, or
// a dig with the oldest room at the bottom (Timelines.jsx). Remembered per
// browser; the switch is the dev server's only.
const INDEX_TIMELINE_KEY = 'ux-archaeologist:index-timeline'
const INDEX_TIMELINES = ['list', 'line', 'cards', 'dig']
export function indexTimeline() {
  if (!import.meta.env.DEV) return 'list'
  try {
    const v = localStorage.getItem(INDEX_TIMELINE_KEY)
    return INDEX_TIMELINES.includes(v) ? v : 'list'
  } catch { return 'list' }
}
export function setIndexTimeline(kind) {
  if (!import.meta.env.DEV) return
  try { kind === 'list' || !INDEX_TIMELINES.includes(kind) ? localStorage.removeItem(INDEX_TIMELINE_KEY) : localStorage.setItem(INDEX_TIMELINE_KEY, kind) } catch { /* storage blocked */ }
}
