// src/components/phone/HomeScreen.jsx
//
// iPhone home screen with swipeable icon pages, page dots, and dock.
// Matches Figma node 25:843 at 1× (half of 640×960 2× design).
//
// Props:
//   onAppOpen    — called with (appId) when an icon is tapped
//   onSwipePage  — called with (pageNum) when swipe commits
//   currentPage  — controlled page index (0 or 1)
//   entering     — true during unlock entrance animation (disables interaction)
//   showDock     — during entering, true once dock should fade in (Phase 3)
//   showIcons    — during entering, true once icons should fly in (Phase 4)

import { useRef, useEffect, useCallback } from 'react'
import styles from './HomeScreen.module.css'
import StatusBar from './StatusBar'
import AppIcon from './AppIcon'
import dockSvg from '../../../assets/iphone-dock.svg'

// ── Icon PNG imports ─────────────────────────────────────────────────────────
import iconMessages   from '../../../assets/iphone-icons/Messages.png'
import iconCalendar   from '../../../assets/iphone-icons/Calendar.png'
import iconPhotos     from '../../../assets/iphone-icons/Photos.png'
import iconCamera     from '../../../assets/iphone-icons/Camera.png'
import iconYouTube    from '../../../assets/iphone-icons/YouTube.png'
import iconStocks     from '../../../assets/iphone-icons/Stocks.png'
import iconMaps       from '../../../assets/iphone-icons/Maps.png'
import iconWeather    from '../../../assets/iphone-icons/Weather.png'
import iconClock      from '../../../assets/iphone-icons/Clock.png'
import iconCalculator from '../../../assets/iphone-icons/Calculator.png'
import iconNotes      from '../../../assets/iphone-icons/Notes.png'
import iconSettings   from '../../../assets/iphone-icons/Settings.png'
import iconContacts   from '../../../assets/iphone-icons/Contacts.png'
import iconAppStore   from '../../../assets/iphone-icons/App-Store.png'
import iconITunes     from '../../../assets/iphone-icons/iTunes-Store.png'
import iconPhone      from '../../../assets/iphone-icons/Phone.png'
import iconMail       from '../../../assets/iphone-icons/Mail.png'
import iconSafari     from '../../../assets/iphone-icons/Safari.png'
import iconIPod       from '../../../assets/iphone-icons/Apple-Music.png'

// ── Icon data ───────────────────────────────────────────────────────────────
// Each entry: { id, name, iconSrc }
// Page 0: 4×4 grid with 13 icons — row 4 has only Contacts in col 0.
// CSS grid naturally leaves the 3 trailing cells of row 4 empty.

const PAGE_0_GRID = [
  // Row 1
  { id: 'messages',   name: 'Messages',   iconSrc: iconMessages },
  { id: 'calendar',   name: 'Calendar',   iconSrc: iconCalendar },
  { id: 'photos',     name: 'Photos',     iconSrc: iconPhotos },
  { id: 'camera',     name: 'Camera',     iconSrc: iconCamera },
  // Row 2
  { id: 'youtube',    name: 'YouTube',    iconSrc: iconYouTube },
  { id: 'stocks',     name: 'Stocks',     iconSrc: iconStocks },
  { id: 'maps',       name: 'Maps',       iconSrc: iconMaps },
  { id: 'weather',    name: 'Weather',    iconSrc: iconWeather },
  // Row 3
  { id: 'clock',      name: 'Clock',      iconSrc: iconClock },
  { id: 'calculator', name: 'Calculator', iconSrc: iconCalculator },
  { id: 'notes',      name: 'Notes',      iconSrc: iconNotes },
  { id: 'settings',   name: 'Settings',   iconSrc: iconSettings },
  // Row 4 (partial — only col 0)
  { id: 'contacts',   name: 'Contacts',   iconSrc: iconContacts },
]

// Page 1: 2 icons in top-left, rest of grid empty.
const PAGE_1_GRID = [
  { id: 'appstore', name: 'App Store', iconSrc: iconAppStore },
  { id: 'itunes',   name: 'iTunes',    iconSrc: iconITunes },
]

const DOCK = [
  { id: 'phone',  name: 'Phone',  iconSrc: iconPhone },
  { id: 'mail',   name: 'Mail',   iconSrc: iconMail },
  { id: 'safari', name: 'Safari', iconSrc: iconSafari },
  { id: 'ipod',   name: 'iPod',   iconSrc: iconIPod },
]

const TOTAL_PAGES = 2
const SWIPE_TAP_THRESHOLD = 8   // px — below this, treat as tap not swipe
const SWIPE_COMMIT_RATIO = 0.3  // 30% of viewport width to commit page change

export default function HomeScreen({
  onAppOpen,
  onSwipePage,
  currentPage,
  entering = false,
  exiting = false,
  showDock = true,
  showIcons = true,
}) {
  const viewportRef  = useRef(null)
  const containerRef = useRef(null)

  // Keep callback refs current for closure safety
  const onSwipePageRef = useRef(onSwipePage)
  useEffect(() => { onSwipePageRef.current = onSwipePage }, [onSwipePage])

  const currentPageRef = useRef(currentPage)
  useEffect(() => { currentPageRef.current = currentPage }, [currentPage])

  const onAppOpenRef = useRef(onAppOpen)
  useEffect(() => { onAppOpenRef.current = onAppOpen }, [onAppOpen])

  // Ref to disable interaction during entering OR exiting animation
  const enteringRef = useRef(entering || exiting)
  useEffect(() => { enteringRef.current = entering || exiting }, [entering, exiting])

  // Sync container position when currentPage changes externally
  useEffect(() => {
    const container = containerRef.current
    const viewport  = viewportRef.current
    if (!container || !viewport) return
    container.style.transition = 'transform 300ms ease-out'
    container.style.transform  = `translateX(${-currentPage * viewport.offsetWidth}px)`
  }, [currentPage])

  // ── Scale helper (same as LockScreen/TouchCursor) ──────────────────────
  const getScaleX = useCallback(() => {
    const vp = viewportRef.current
    if (!vp) return 1
    const rect = vp.getBoundingClientRect()
    return rect.width > 0 ? vp.offsetWidth / rect.width : 1
  }, [])

  // ── Mouse swipe ─────────────────────────────────────────────────────────
  useEffect(() => {
    const viewport  = viewportRef.current
    const container = containerRef.current
    if (!viewport || !container) return

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      if (enteringRef.current) return          // disabled during animation

      const startX = e.clientX
      let isSwiping = false
      let delta = 0

      container.style.transition = 'none'
      const pageWidth = viewport.offsetWidth

      const onMouseMove = (ev) => {
        const dx = (ev.clientX - startX) * getScaleX()

        if (!isSwiping && Math.abs(dx) > SWIPE_TAP_THRESHOLD) {
          isSwiping = true
        }

        if (isSwiping) {
          delta = dx
          const baseOffset = -currentPageRef.current * pageWidth
          let offset = baseOffset + delta

          // Rubber-band at edges
          if (offset > 0) offset *= 0.3
          const minOffset = -(TOTAL_PAGES - 1) * pageWidth
          if (offset < minOffset) {
            offset = minOffset + (offset - minOffset) * 0.3
          }

          container.style.transform = `translateX(${offset}px)`
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        if (isSwiping) {
          container.style.transition = 'transform 300ms ease-out'
          const threshold = pageWidth * SWIPE_COMMIT_RATIO
          let newPage = currentPageRef.current

          if (delta < -threshold && newPage < TOTAL_PAGES - 1) {
            newPage = newPage + 1
          } else if (delta > threshold && newPage > 0) {
            newPage = newPage - 1
          }

          container.style.transform = `translateX(${-newPage * pageWidth}px)`
          if (newPage !== currentPageRef.current) {
            onSwipePageRef.current?.(newPage)
          }

          // Eat the following click so icons don't fire
          const eatClick = (ev) => {
            ev.stopPropagation()
            ev.preventDefault()
          }
          viewport.addEventListener('click', eatClick, { capture: true, once: true })
        }
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    viewport.addEventListener('mousedown', onMouseDown)
    return () => viewport.removeEventListener('mousedown', onMouseDown)
  }, [getScaleX])

  // ── Touch swipe (non-passive for preventDefault) ────────────────────────
  useEffect(() => {
    const viewport  = viewportRef.current
    const container = containerRef.current
    if (!viewport || !container) return

    let startX = 0
    let isSwiping = false
    let delta = 0

    const onTouchStart = (e) => {
      if (enteringRef.current) return          // disabled during animation
      startX = e.touches[0].clientX
      isSwiping = false
      delta = 0
      container.style.transition = 'none'
    }

    const onTouchMove = (e) => {
      if (enteringRef.current) return
      const dx = (e.touches[0].clientX - startX) * getScaleX()

      if (!isSwiping && Math.abs(dx) > SWIPE_TAP_THRESHOLD) {
        isSwiping = true
      }

      if (isSwiping) {
        e.preventDefault()
        delta = dx
        const pageWidth = viewport.offsetWidth
        const baseOffset = -currentPageRef.current * pageWidth
        let offset = baseOffset + delta

        // Rubber-band
        if (offset > 0) offset *= 0.3
        const minOffset = -(TOTAL_PAGES - 1) * pageWidth
        if (offset < minOffset) {
          offset = minOffset + (offset - minOffset) * 0.3
        }

        container.style.transform = `translateX(${offset}px)`
      }
    }

    const onTouchEnd = () => {
      if (isSwiping) {
        container.style.transition = 'transform 300ms ease-out'
        const pageWidth = viewport.offsetWidth
        const threshold = pageWidth * SWIPE_COMMIT_RATIO
        let newPage = currentPageRef.current

        if (delta < -threshold && newPage < TOTAL_PAGES - 1) {
          newPage = newPage + 1
        } else if (delta > threshold && newPage > 0) {
          newPage = newPage - 1
        }

        container.style.transform = `translateX(${-newPage * pageWidth}px)`
        if (newPage !== currentPageRef.current) {
          onSwipePageRef.current?.(newPage)
        }
      }
    }

    viewport.addEventListener('touchstart', onTouchStart)
    viewport.addEventListener('touchmove', onTouchMove, { passive: false })
    viewport.addEventListener('touchend', onTouchEnd)

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMove)
      viewport.removeEventListener('touchend', onTouchEnd)
    }
  }, [getScaleX])

  // ── Icon tap handler ───────────────────────────────────────────────────
  const handleIconTap = useCallback((appId) => {
    if (enteringRef.current) return            // disabled during animation
    onAppOpenRef.current?.(appId)
  }, [])

  // ── Compute animation CSS classes ──────────────────────────────────────
  const dockCls = exiting  ? styles.dockExit
                : entering ? (showDock  ? styles.dockEnter : styles.hidden)
                : ''
  const dotsCls = exiting  ? styles.dotsExit
                : entering ? (showIcons ? styles.dotsEnter : styles.hidden)
                : ''

  // ── Per-icon fly-in animation ──────────────────────────────────────────
  // Each icon's delay = Manhattan distance from its quadrant's center-facing
  // corner × 50ms.  Direction = toward the icon's nearest screen corner.
  //
  //   Tier 0 (delay 0ms):    4 center icons  — (1,1),(2,1),(1,2),(2,2)
  //   Tier 1 (delay 50ms):   8 edge icons    — diagonally adjacent to center
  //   Tier 2 (delay 100ms):  4 corner icons  — (0,0),(3,0),(0,3),(3,3)

  const getIconStyle = (idx) => {
    const col = idx % 4
    const row = Math.floor(idx / 4)
    const offsetX = col < 2 ? -30 : 30
    const offsetY = row < 2 ? -30 : 30
    const cornerCol = col < 2 ? 1 : 2
    const cornerRow = row < 2 ? 1 : 2
    const dist = Math.abs(col - cornerCol) + Math.abs(row - cornerRow)

    if (exiting) {
      // Scatter outward — corner icons first (delay 0ms), center icons last (delay 60ms)
      const delay = (2 - dist) * 30
      return {
        opacity: 0,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        transition: `opacity 200ms ease-in ${delay}ms, transform 200ms ease-in ${delay}ms`,
      }
    }

    if (!entering) return undefined  // normal state — no inline animation

    if (!showIcons) {
      // Hidden: offset toward nearest corner, invisible (no transition yet)
      return { opacity: 0, transform: `translate(${offsetX}px, ${offsetY}px)` }
    }

    // Fly in — center icons first (delay 0ms), corner icons last (delay 100ms)
    const delay = dist * 50
    return {
      opacity: 1,
      transform: 'none',
      transition: `opacity 200ms ease-out ${delay}ms, transform 200ms ease-out ${delay}ms`,
    }
  }

  // ── Render icon grid for a page ────────────────────────────────────────
  const renderPage = (icons, pageIndex) => (
    <div key={pageIndex} className={styles.page}>
      <div className={styles.iconGrid}>
        {icons.map((icon, idx) => (
          <div key={icon.id} style={getIconStyle(idx)}>
            <AppIcon
              id={icon.id}
              name={icon.name}
              iconSrc={icon.iconSrc}
              isFolder={icon.isFolder}
              onTap={icon.id === 'notes' ? handleIconTap : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.homeScreen}>
      {/* Status bar */}
      <StatusBar variant="dark" />

      {/* Swipeable icon grid viewport — swipe listeners attach here */}
      <div ref={viewportRef} className={styles.gridViewport}>
        <div ref={containerRef} className={styles.swipeContainer}>
          {renderPage(PAGE_0_GRID, 0)}
          {renderPage(PAGE_1_GRID, 1)}
        </div>
      </div>

      {/* Page indicator dots */}
      <div className={`${styles.pageDots} ${dotsCls}`}>
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === currentPage ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Dock SVG background — positioned at bottom, shadow bleeds upward */}
      <img
        src={dockSvg}
        className={`${styles.dockBg} ${dockCls}`}
        alt=""
        draggable={false}
        aria-hidden="true"
      />

      {/* Dock icons — NOT part of the swipe area.
       * Uses the same 4-column grid as the icon pages for identical spacing. */}
      <div className={`${styles.dock} ${dockCls}`}>
        <div className={styles.dockIcons}>
          {DOCK.map((icon) => (
            <AppIcon
              key={icon.id}
              id={icon.id}
              name={icon.name}
              iconSrc={icon.iconSrc}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
