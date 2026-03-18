// src/components/phone/HomeScreen.jsx
//
// iPhone home screen with swipeable icon pages, page dots, and dock.
// Matches Figma node 25:843 at 1× (half of 640×960 2× design).
//
// Props:
//   onAppOpen    — called with (appId) when an icon is tapped
//   onSwipePage  — called with (pageNum) when swipe commits
//   currentPage  — controlled page index (0 or 1)

import { useRef, useEffect, useCallback } from 'react'
import styles from './HomeScreen.module.css'
import StatusBar from './StatusBar'
import AppIcon from './AppIcon'
import wallpaperSrc from '../../../assets/ios-rain-wallpaper.jpg'

// ── Icon data ───────────────────────────────────────────────────────────────
// Each entry: { id, name, iconSrc?, isFolder? }
// iconSrc is optional — omit for placeholder gradient icons.
// Swap in real PNGs later by adding iconSrc to each entry.

const PAGE_0_ICONS = [
  { id: 'messages',  name: 'Messages' },
  { id: 'calendar',  name: 'Calendar' },
  { id: 'photos',    name: 'Photos' },
  { id: 'camera',    name: 'Camera' },
  { id: 'video',     name: 'Video' },
  { id: 'maps',      name: 'Maps' },
  { id: 'weather',   name: 'Weather' },
  { id: 'passbook',  name: 'Passbook' },
  { id: 'notes',     name: 'Notes' },
  { id: 'reminders', name: 'Reminders' },
  { id: 'clock',     name: 'Clock' },
  { id: 'stocks',    name: 'Stocks' },
  { id: 'newsstand', name: 'Newsstand' },
  { id: 'itunes',    name: 'iTunes' },
  { id: 'appstore',  name: 'App Store' },
  { id: 'folder',    name: 'Folder', isFolder: true },
]

const PAGE_1_ICONS = [
  { id: 'youtube',    name: 'YouTube' },
  { id: 'settings',   name: 'Settings' },
  { id: 'calculator', name: 'Calculator' },
  { id: 'compass',    name: 'Compass' },
]

const DOCK_ICONS = [
  { id: 'phone',  name: 'Phone' },
  { id: 'mail',   name: 'Mail' },
  { id: 'safari', name: 'Safari' },
  { id: 'music',  name: 'Music' },
]

const TOTAL_PAGES = 2
const SWIPE_TAP_THRESHOLD = 8   // px — below this, treat as tap not swipe
const SWIPE_COMMIT_RATIO = 0.3  // 30% of viewport width to commit page change

export default function HomeScreen({ onAppOpen, onSwipePage, currentPage }) {
  const viewportRef  = useRef(null)
  const containerRef = useRef(null)

  // Keep callback refs current for closure safety
  const onSwipePageRef = useRef(onSwipePage)
  useEffect(() => { onSwipePageRef.current = onSwipePage }, [onSwipePage])

  const currentPageRef = useRef(currentPage)
  useEffect(() => { currentPageRef.current = currentPage }, [currentPage])

  const onAppOpenRef = useRef(onAppOpen)
  useEffect(() => { onAppOpenRef.current = onAppOpen }, [onAppOpen])

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
      // Only primary button
      if (e.button !== 0) return

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
      startX = e.touches[0].clientX
      isSwiping = false
      delta = 0
      container.style.transition = 'none'
    }

    const onTouchMove = (e) => {
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
    onAppOpenRef.current?.(appId)
  }, [])

  // ── Render icon grid for a page ────────────────────────────────────────
  const renderPage = (icons, pageIndex) => (
    <div key={pageIndex} className={styles.page}>
      <div className={styles.iconGrid}>
        {icons.map((icon) => (
          <AppIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            iconSrc={icon.iconSrc}
            isFolder={icon.isFolder}
            onTap={icon.id === 'notes' ? handleIconTap : undefined}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.homeScreen}>
      {/* Wallpaper — full-bleed behind everything */}
      <img
        src={wallpaperSrc}
        className={styles.wallpaper}
        alt=""
        draggable={false}
        aria-hidden="true"
      />

      {/* Status bar */}
      <StatusBar variant="dark" />

      {/* Swipeable icon grid viewport — swipe listeners attach here */}
      <div ref={viewportRef} className={styles.gridViewport}>
        <div ref={containerRef} className={styles.swipeContainer}>
          {renderPage(PAGE_0_ICONS, 0)}
          {renderPage(PAGE_1_ICONS, 1)}
        </div>
      </div>

      {/* Page indicator dots */}
      <div className={styles.pageDots}>
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === currentPage ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Dock — NOT part of the swipe area */}
      <div className={styles.dock}>
        <div className={styles.dockBg} aria-hidden="true" />
        <div className={styles.dockIcons}>
          {DOCK_ICONS.map((icon) => (
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
