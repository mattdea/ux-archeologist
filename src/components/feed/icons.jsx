// src/components/feed/icons.jsx
// Glyphs for the 2015 Instagram iOS app (pre-May-2016 redesign), drawn as
// inline SVGs from the reference screenshots in docs/reference/.
// Sizes are in points at 1× (the feed lays out at 320 × 568, then is zoomed to 375 wide).

// ─── Navigation bar ──────────────────────────────────────────────────────────

/** Direct inbox tray: white, 24 × 20. Sits at the right of the blue nav bar. */
export function InboxIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 24 20" fill="#ffffff" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4.2 0h15.6L24 11.2V17a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-5.8L4.2 0zm1.3 2L2.4 10.5H8c.4 2.1 2.1 3.5 4 3.5s3.6-1.4 4-3.5h5.6L18.5 2h-13z"
      />
    </svg>
  )
}

// ─── Post header ─────────────────────────────────────────────────────────────

/** AdChoices-style badge shown before "Sponsored": a notched seal, 13 × 13. */
export function AdBadgeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5l2.1 2 2.8-.7.9 2.7 2.7.9-.7 2.8 2 2.1-2 2.1.7 2.8-2.7.9-.9 2.7-2.8-.7-2.1 2-2.1-2-2.8.7-.9-2.7-2.7-.9.7-2.8-2-2.1 2-2.1-.7-2.8 2.7-.9.9-2.7 2.8.7z" />
      <path d="M9.8 8.2v7.6l6.4-3.8z" fill="#ffffff" />
    </svg>
  )
}

// ─── Action row ──────────────────────────────────────────────────────────────

/** Outlined heart, 25 × 22. Filled red when liked. */
export function HeartOutlineIcon({ filled = false }) {
  return (
    <svg
      width="27" height="24" viewBox="0 0 25 22"
      fill={filled ? '#ed4956' : 'none'}
      stroke={filled ? '#ed4956' : 'currentColor'}
      strokeWidth="1.3" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.5 20.6C9 17.7 1.2 12.2 1.2 6.7 1.2 3.6 3.5 1.2 6.6 1.2c2.6 0 4.6 1.6 5.9 3.8 1.3-2.2 3.3-3.8 5.9-3.8 3.1 0 5.4 2.4 5.4 5.5 0 5.5-7.8 11-11.3 13.9z" />
    </svg>
  )
}

/** Outlined comment bubble: a circle with a small tail at the lower right, 23 × 22. */
export function CommentOutlineIcon() {
  return (
    <svg
      width="25" height="24" viewBox="0 0 23 22"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 1.2c5.4 0 9.8 4 9.8 9 0 2.5-1.1 4.7-2.9 6.3l.9 4.2-4.6-2.1c-1 .3-2.1.5-3.2.5-5.4 0-9.8-4-9.8-9s4.4-8.9 9.8-8.9z" />
    </svg>
  )
}

/** "ooo" overflow menu: three 5pt outlined grey rings, as in the 2015 app. */
export function MoreDotsIcon() {
  return (
    <svg width="26" height="6" viewBox="0 0 26 6" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <circle cx="3" cy="3" r="2.4" />
      <circle cx="13" cy="3" r="2.4" />
      <circle cx="23" cy="3" r="2.4" />
    </svg>
  )
}

/** Small filled heart before the likes count, 11 × 10, Instagram blue. */
export function LikesHeartIcon() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="currentColor" aria-hidden="true">
      <path d="M5.5 9.6C4 8.3.2 5.6.2 3 .2 1.4 1.4.2 2.9.2c1.2 0 2.1.7 2.6 1.6C6 .9 6.9.2 8.1.2c1.5 0 2.7 1.2 2.7 2.8 0 2.6-3.8 5.3-5.3 6.6z" />
    </svg>
  )
}

/** Big white heart for the double-tap burst. */
export function BurstHeartIcon() {
  return (
    <svg width="110" height="100" viewBox="0 0 11 10" fill="#ffffff" aria-hidden="true">
      <path d="M5.5 9.6C4 8.3.2 5.6.2 3 .2 1.4 1.4.2 2.9.2c1.2 0 2.1.7 2.6 1.6C6 .9 6.9.2 8.1.2c1.5 0 2.7 1.2 2.7 2.8 0 2.6-3.8 5.3-5.3 6.6z" />
    </svg>
  )
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

/** House: steep roof whose eaves overhang the walls, with an arched doorway
    cut out of the middle. Traced from the 2015 tab bar, 30 × 25.5. */
export function TabHomeIcon() {
  return (
    <svg width="30" height="25.5" viewBox="0 0 80 68" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M39.7 1L79 39.5L75.2 43.6L67.3 35.6V67H47.7V50A8 8 0 0 0 31.7 50V67H12.1V35.6L4.2 43.6L0.4 39.5Z"
      />
    </svg>
  )
}

/** Magnifier with a thick ring and a handle to the lower right, 23 × 23. */
export function TabSearchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="8.6" strokeWidth="2.6" />
      <path d="M17 17l7.2 7.2" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

/** Camera tab: white rounded square with a blue ring lens, 25 × 26. */
export function TabCameraIcon() {
  return (
    <svg width="28" height="29" viewBox="0 0 25 26" aria-hidden="true">
      <rect x="0.5" y="0.5" width="24" height="25" rx="3.5" fill="#ffffff" />
      <circle cx="12.5" cy="13" r="6.4" fill="none" stroke="#12558a" strokeWidth="3.4" />
    </svg>
  )
}

/** Activity: speech bubble with a heart cut out of it, 25 × 24. */
export function TabActivityIcon() {
  return (
    <svg width="27" height="26" viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M11.8 0C5.3 0 0 4.8 0 10.8c0 6 5.3 10.8 11.8 10.8 1 0 2-.1 3-.4L22 24l-1.6-5.3c2-2 3.2-4.9 3.2-7.9C23.6 4.8 18.3 0 11.8 0zm0 16.4c-1.6-1.3-5.9-4.3-5.9-7.2 0-1.7 1.3-3.1 2.9-3.1 1.3 0 2.4.8 3 1.9.6-1.1 1.7-1.9 3-1.9 1.6 0 2.9 1.4 2.9 3.1 0 2.9-4.3 5.9-5.9 7.2z"
      />
    </svg>
  )
}

/** Profile: an egg-shaped head, taller than wide, over domed shoulders with
    a flat base. Traced from the 2015 tab bar, 22 × 24. */
export function TabProfileIcon() {
  return (
    <svg width="22" height="24.2" viewBox="0 0 60 66" fill="currentColor" aria-hidden="true">
      <path d="M30 0C38.6 0 43.6 7.4 43.6 16.2C43.6 26.4 37.2 35 30 35S16.4 26.4 16.4 16.2C16.4 7.4 21.4 0 30 0Z" />
      <path d="M0 66V57.5C0 48.2 13.4 42.3 30 42.3S60 48.2 60 57.5V66Z" />
    </svg>
  )
}

// ─── Explore ─────────────────────────────────────────────────────────────────

/** Small magnifier inside the dark-blue search field, 13 × 13, white. */
export function SearchFieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="5.3" cy="5.3" r="4.3" strokeWidth="1.8" />
      <path d="M8.6 8.6l3.6 3.6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** "Find friends": a person silhouette with a small plus at its upper left, 24 × 20. */
export function AddPersonIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="currentColor" aria-hidden="true">
      <circle cx="14.5" cy="5.2" r="4.6" />
      <path d="M6 20c0-4.6 3.8-7.9 8.5-7.9S23 15.4 23 20z" />
      <path d="M3.4 1.2h1.8v2.6h2.6v1.8H5.2v2.6H3.4V5.6H.8V3.8h2.6z" />
    </svg>
  )
}

/** White outlined play button for the "PRESS PLAY" hero, 34 × 34. */
export function PlayCircleIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="15.5" fill="rgba(255,255,255,0.18)" stroke="#ffffff" strokeWidth="1.6" />
      <path d="M13.2 10.4v13.2L24 17z" fill="#ffffff" />
    </svg>
  )
}

/** Tiny camcorder badge in the corner of video tiles, 17 × 11, white with a shadow. */
export function VideoBadgeIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="#ffffff" aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 1.5px rgba(0,0,0,0.6))' }}>
      <rect x="0" y="0" width="11.5" height="11" rx="2" />
      <path d="M12.5 3.6L17 .8v9.4l-4.5-2.8z" />
    </svg>
  )
}

/** Thin chevron after "See All", 7 × 11, blue. */
export function ChevronRightIcon() {
  return (
    <svg width="7" height="11" viewBox="0 0 7 11" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M1 1l4.5 4.5L1 10" />
    </svg>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────

/** Back chevron in the blue nav bar, 12 × 20, white. */
export function BackChevronIcon() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.5 1.5L2 10l8.5 8.5" />
    </svg>
  )
}

/** Settings gear on the player's own profile, 24 × 24, white. */
export function GearIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
      <path fillRule="evenodd" d="M10.3 0h3.4l.6 3.1c.7.2 1.4.5 2 .9l2.7-1.6 2.4 2.4-1.6 2.7c.4.6.7 1.3.9 2l3.1.6v3.4l-3.1.6c-.2.7-.5 1.4-.9 2l1.6 2.7-2.4 2.4-2.7-1.6c-.6.4-1.3.7-2 .9l-.6 3.1h-3.4l-.6-3.1c-.7-.2-1.4-.5-2-.9l-2.7 1.6-2.4-2.4 1.6-2.7c-.4-.6-.7-1.3-.9-2L0 13.7v-3.4l3.1-.6c.2-.7.5-1.4.9-2L2.4 5l2.4-2.4 2.7 1.6c.6-.4 1.3-.7 2-.9L10.3 0zM12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8z" />
    </svg>
  )
}

// ─── Profile view-mode row ───────────────────────────────────────────────────

/** 3 × 3 grid of small squares, 22 × 22. Blue when selected. */
export function GridModeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      {[0, 8.5, 17].map(y => [0, 8.5, 17].map(x => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" />))}
    </svg>
  )
}

/** Three horizontal lines (list view), 24 × 18, grey. */
export function ListModeIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="24" height="2" />
      <rect x="0" y="8" width="24" height="2" />
      <rect x="0" y="16" width="24" height="2" />
    </svg>
  )
}

/** Outlined location pin with a solid dot, 18 × 24, grey. */
export function PinModeIcon() {
  return (
    <svg width="18" height="24" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M9 22.6S1.4 13.6 1.4 8.6a7.6 7.6 0 0 1 15.2 0c0 5-7.6 14-7.6 14z" />
      <circle cx="9" cy="8.6" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Photos of you: a rounded square with a small folded tab on top and a person inside, 24 × 22, grey. */
export function TaggedModeIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 4.5L10 1.5h4l1.5 3H20a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3z" />
      <circle cx="12" cy="10" r="2.4" fill="currentColor" stroke="none" />
      <path d="M7.5 17.5c0-2.6 2-4.2 4.5-4.2s4.5 1.6 4.5 4.2z" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Blue down arrow in the empty profile, pointing at the camera tab, 14 × 18. */
export function DownArrowIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 1v15M1.5 10.5L7 16l5.5-5.5" />
    </svg>
  )
}

// ─── Activity ────────────────────────────────────────────────────────────────

/** Large grey speech bubble with a cut-out heart for the empty "You" tab, 44 × 42. */
export function ActivityEmptyIcon() {
  return (
    <svg width="44" height="42" viewBox="0 0 25 24" fill="#c7c7c7" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M11.8 0C5.3 0 0 4.8 0 10.8c0 6 5.3 10.8 11.8 10.8 1 0 2-.1 3-.4L22 24l-1.6-5.3c2-2 3.2-4.9 3.2-7.9C23.6 4.8 18.3 0 11.8 0zm0 16.4c-1.6-1.3-5.9-4.3-5.9-7.2 0-1.7 1.3-3.1 2.9-3.1 1.3 0 2.4.8 3 1.9.6-1.1 1.7-1.9 3-1.9 1.6 0 2.9 1.4 2.9 3.1 0 2.9-4.3 5.9-5.9 7.2z"
      />
    </svg>
  )
}
