// src/components/web/BrowserChrome.jsx
// Internet Explorer 4 / Windows 98 browser chrome
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './BrowserChrome.module.css'

const SCROLL_STEP    = 20   // px per arrow-button tick
const SCROLL_REPEAT  = 60   // ms between repeat ticks while button held

/* ── IE "e" logo icon ─────────────────────────────────────────────── */
function IELogo() {
  return (
    <span className={styles.ieLogo} aria-hidden="true">
      <span className={styles.ieLogoE}>e</span>
    </span>
  )
}

/* ── Title bar window buttons ─────────────────────────────────────── */
function WinButton({ symbol, variant }) {
  return (
    <span className={`${styles.winBtn} ${variant === 'close' ? styles.winBtnClose : ''}`}>
      {symbol}
    </span>
  )
}

/* ── Toolbar button (icon stacked above label) ───────────────────── */
function ToolbarButton({ icon, label, disabled, onClick }) {
  return (
    <span
      className={`${styles.toolbarBtn} ${disabled ? styles.toolbarBtnDisabled : ''}`}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      <span className={styles.toolbarIcon}>{icon}</span>
      <span className={styles.toolbarLabel}>{label}</span>
    </span>
  )
}

/* ── Toolbar separator ────────────────────────────────────────────── */
function ToolbarSep() {
  return <span className={styles.toolbarSep} />
}

/* ── Main component ───────────────────────────────────────────────── */
export default function BrowserChrome({
  children,
  currentUrl   = 'about:blank',
  pageTitle    = 'Microsoft Internet Explorer',
  canGoBack    = false,
  canGoForward = false,
  onBack,
  onForward,
  statusText   = 'Done',
}) {
  // ── Scroll state ────────────────────────────────────────────────
  const viewportRef  = useRef(null)
  const trackRef     = useRef(null)
  const intervalRef  = useRef(null)
  const dragRef      = useRef(null)

  const [scroll, setScroll] = useState({ top: 0, total: 1, visible: 1 })

  // Read current scroll metrics from the DOM
  const readScroll = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    setScroll({
      top:     el.scrollTop,
      total:   el.scrollHeight,
      visible: el.clientHeight,
    })
  }, [])

  // Reset to top and re-measure when URL changes (new page loaded)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTop = 0
    readScroll()
  }, [currentUrl, readScroll])

  // Re-measure after children change (content height may differ)
  useLayoutEffect(() => {
    readScroll()
  }, [children, readScroll])

  // ── Scroll commands ──────────────────────────────────────────────
  const scrollTo = useCallback((newTop) => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTop = Math.max(0, Math.min(newTop, el.scrollHeight - el.clientHeight))
    readScroll()
  }, [readScroll])

  const scrollBy = useCallback((delta) => {
    const el = viewportRef.current
    if (!el) return
    scrollTo(el.scrollTop + delta)
  }, [scrollTo])

  // ── Arrow button: scroll once then repeat while held ────────────
  const startScrollRepeat = useCallback((delta) => {
    scrollBy(delta)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => scrollBy(delta), SCROLL_REPEAT)
  }, [scrollBy])

  const stopScrollRepeat = useCallback(() => {
    clearInterval(intervalRef.current)
  }, [])

  // Clean up interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), [])

  // ── Thumb drag ───────────────────────────────────────────────────
  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      startY:         e.clientY,
      startScrollTop: viewportRef.current?.scrollTop ?? 0,
    }

    const onMove = (ev) => {
      const el    = viewportRef.current
      const track = trackRef.current
      if (!el || !track) return

      const trackH  = track.clientHeight
      const thumbH  = Math.max(16, (el.clientHeight / el.scrollHeight) * trackH)
      const travelH = trackH - thumbH
      if (travelH <= 0) return

      const { startY, startScrollTop } = dragRef.current
      const scrollable  = el.scrollHeight - el.clientHeight
      const scrollDelta = ((ev.clientY - startY) / travelH) * scrollable
      scrollTo(startScrollTop + scrollDelta)
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }, [scrollTo])

  // ── Track click: page up / page down ────────────────────────────
  const handleTrackClick = useCallback((e) => {
    const track = trackRef.current
    const el    = viewportRef.current
    if (!track || !el) return

    const trackH    = track.clientHeight
    const thumbH    = Math.max(16, (el.clientHeight / el.scrollHeight) * trackH)
    const scrollable = el.scrollHeight - el.clientHeight
    const thumbTop  = scrollable > 0
      ? (el.scrollTop / scrollable) * (trackH - thumbH)
      : 0

    const clickY = e.clientY - track.getBoundingClientRect().top
    if (clickY < thumbTop) {
      scrollBy(-el.clientHeight)
    } else if (clickY > thumbTop + thumbH) {
      scrollBy(el.clientHeight)
    }
  }, [scrollBy])

  // ── Derived thumb geometry for rendering ────────────────────────
  const { top, total, visible } = scroll
  const canScroll  = total > visible
  const trackH     = Math.max(0, visible - 32) // track = scrollbar height minus 2×16px buttons
  const thumbH     = canScroll ? Math.max(16, (visible / total) * trackH) : trackH
  const travelH    = trackH - thumbH
  const scrollable = total - visible
  const thumbTop   = canScroll && scrollable > 0 ? (top / scrollable) * travelH : 0

  const titleBarText = pageTitle
    ? `${pageTitle} - Microsoft Internet Explorer`
    : 'Microsoft Internet Explorer'

  return (
    <div className={styles.browser}>

      {/* ── Title bar ───────────────────────────────────────────── */}
      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <IELogo />
          <span className={styles.titleText}>{titleBarText}</span>
        </div>
        <div className={styles.winBtns}>
          <WinButton symbol="─" />
          <WinButton symbol="□" />
          <WinButton symbol="✕" variant="close" />
        </div>
      </div>

      {/* ── Menu bar ────────────────────────────────────────────── */}
      <div className={styles.menuBar}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(item => (
          <span key={item} className={styles.menuItem}>{item}</span>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <ToolbarButton icon="◀" label="Back"    disabled={!canGoBack}    onClick={onBack} />
        <ToolbarButton icon="▶" label="Forward" disabled={!canGoForward} onClick={onForward} />
        <ToolbarSep />
        <ToolbarButton icon="⊗" label="Stop" />
        <ToolbarButton icon="↺" label="Refresh" />
        <ToolbarSep />
        <ToolbarButton icon="⌂" label="Home" />
        <div className={styles.toolbarSpacer} />
        {/* Throbber — the animated IE logo in the top-right of toolbar */}
        <span className={styles.throbber}>
          <IELogo />
        </span>
      </div>

      {/* ── Address bar ─────────────────────────────────────────── */}
      <div className={styles.addressBar}>
        <span className={styles.addressLabel}>Address</span>
        <span className={styles.addressDrop}>▾</span>
        <span className={styles.addressInput}>{currentUrl}</span>
        <span className={styles.goBtn}>Go</span>
      </div>

      {/* ── Content viewport + Win98 custom scrollbar ───────────── */}
      <div className={styles.contentArea}>

        {/* Scrollable page — native scrollbar hidden via CSS */}
        <div
          ref={viewportRef}
          className={styles.contentViewport}
          onScroll={readScroll}
        >
          {children}
        </div>

        {/* Win98 scrollbar */}
        <div className={styles.scrollbar}>

          {/* Up arrow button */}
          <div
            className={styles.scrollBtn}
            onMouseDown={() => startScrollRepeat(-SCROLL_STEP)}
            onMouseUp={stopScrollRepeat}
            onMouseLeave={stopScrollRepeat}
          >▲</div>

          {/* Track + thumb */}
          <div
            ref={trackRef}
            className={styles.scrollTrack}
            onClick={handleTrackClick}
          >
            <div
              className={styles.scrollThumb}
              style={{ top: thumbTop, height: thumbH }}
              onMouseDown={handleThumbMouseDown}
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Down arrow button */}
          <div
            className={styles.scrollBtn}
            onMouseDown={() => startScrollRepeat(SCROLL_STEP)}
            onMouseUp={stopScrollRepeat}
            onMouseLeave={stopScrollRepeat}
          >▼</div>

        </div>
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className={styles.statusBar}>
        <span className={styles.statusText}>{statusText}</span>
        <span className={styles.statusZone}>Internet zone</span>
      </div>

    </div>
  )
}
