// src/components/web/BrowserChrome.jsx
// Netscape Navigator 2.01 / Windows 95 browser chrome
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './BrowserChrome.module.css'

import netscapeLogoIcon from '../../../assets/netscapelogo.png'
import backIcon      from '../../assets/web/back.png'
import backGrayIcon  from '../../assets/web/back-gray.png'
import forwardIcon     from '../../assets/web/forward.png'
import forwardGrayIcon from '../../assets/web/forward-gray.png'
import homeIcon      from '../../assets/web/home.png'
import reloadIcon    from '../../assets/web/reload.png'
import openIcon      from '../../assets/web/open.png'
import printIcon     from '../../assets/web/print.png'
import findIcon      from '../../assets/web/find.png'
import stopIcon      from '../../assets/web/stop.png'
import throbberIcon  from '../../assets/web/throbber.png'

const SCROLL_STEP   = 20  // px per arrow-button tick
const SCROLL_REPEAT = 60  // ms between repeat ticks while button held

/* ── Toolbar button (icon stacked above label) ───────────────────── */
function ToolbarButton({ icon, label, disabled, onClick }) {
  return (
    <span
      className={`${styles.toolbarBtn} ${disabled ? styles.toolbarBtnDisabled : ''}`}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      <img src={icon} className={styles.toolbarIcon} alt="" draggable="false" />
      <span className={`${styles.toolbarLabel} ${disabled ? styles.toolbarLabelDisabled : ''}`}>{label}</span>
    </span>
  )
}

/* ── Main component ───────────────────────────────────────────────── */
export default function BrowserChrome({
  children,
  currentUrl   = 'about:blank',
  pageTitle    = '',
  canGoBack    = false,
  canGoForward = false,
  onBack,
  onForward,
  statusText   = 'Done',
}) {
  // ── Scroll state ────────────────────────────────────────────────
  const viewportRef = useRef(null)
  const trackRef    = useRef(null)
  const intervalRef = useRef(null)
  const dragRef     = useRef(null)

  const [scroll, setScroll] = useState({ top: 0, total: 1, visible: 1 })

  const readScroll = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    setScroll({
      top:     el.scrollTop,
      total:   el.scrollHeight,
      visible: el.clientHeight,
    })
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTop = 0
    readScroll()
  }, [currentUrl, readScroll])

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

    const trackH     = track.clientHeight
    const thumbH     = Math.max(16, (el.clientHeight / el.scrollHeight) * trackH)
    const scrollable = el.scrollHeight - el.clientHeight
    const thumbTop   = scrollable > 0
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
  const trackH     = Math.max(0, visible - 32)
  const thumbH     = canScroll ? Math.max(16, (visible / total) * trackH) : trackH
  const travelH    = trackH - thumbH
  const scrollable = total - visible
  const thumbTop   = canScroll && scrollable > 0 ? (top / scrollable) * travelH : 0

  const titleBarText = pageTitle
    ? `Netscape - [${pageTitle}]`
    : 'Netscape - [Version 2.01]'

  return (
    <div className={styles.browser}>

      {/* ── Title bar ───────────────────────────────────────────── */}
      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <span className={styles.titleIcon} aria-hidden="true" />
          <span className={styles.titleText}>{titleBarText}</span>
        </div>
        <div className={styles.winBtns}>
          {/* Minimize */}
          <span className={styles.winBtn}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="minimize-mask" fill="white">
                <path d="M3 8H9V10H3V8Z"/>
              </mask>
              <path d="M3 8V7H2V8H3ZM9 8H10V7H9V8ZM9 10V11H10V10H9ZM3 10H2V11H3V10ZM3 8V9H9V8V7H3V8ZM9 8H8V10H9H10V8H9ZM9 10V9H3V10V11H9V10ZM3 10H4V8H3H2V10H3Z" fill="black" mask="url(#minimize-mask)"/>
            </svg>
          </span>
          {/* Maximize */}
          <span className={styles.winBtn}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="maximize-mask" fill="white">
                <path d="M2 1H11V10H2V1Z"/>
              </mask>
              <path d="M2 1V-1H1V1H2ZM11 1H12V-1H11V1ZM11 10V11H12V10H11ZM2 10H1V11H2V10ZM2 1V3H11V1V-1H2V1ZM11 1H10V10H11H12V1H11ZM11 10V9H2V10V11H11V10ZM2 10H3V1H2H1V10H2Z" fill="black" mask="url(#maximize-mask)"/>
            </svg>
          </span>
          {/* Close */}
          <span className={styles.winBtn}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2H3V3H4V4H5V5H6V6H5V7H4V8H3V9H5V8H6V7H8V8H9V9H11V8H10V7H9V6H8V5H9V4H10V3H11V2H9V3H8V4H6V3H5V2Z" fill="black"/>
            </svg>
          </span>
        </div>
      </div>

      {/* ── Menu bar ────────────────────────────────────────────── */}
      <div className={styles.menuBar}>
        {['File','Edit','View','Go','Bookmarks','Options','Directory','Window','Help'].map(item => (
          <span key={item} className={styles.menuItem}>
            <span style={{textDecoration: 'underline'}}>{item[0]}</span>{item.slice(1)}
          </span>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        {/* Group 1: navigation */}
        <ToolbarButton icon={canGoBack ? backIcon : backGrayIcon}         label="Back"    disabled={!canGoBack}    onClick={onBack} />
        <ToolbarButton icon={canGoForward ? forwardIcon : forwardGrayIcon} label="Forward" disabled={!canGoForward} onClick={onForward} />
        <ToolbarButton icon={homeIcon}   label="Home" />

        {/* Gap between nav group and utility group */}
        <span className={styles.toolbarGap} />

        {/* Group 2: utility (decorative) */}
        <ToolbarButton icon={reloadIcon} label="Reload" />
        <ToolbarButton icon={openIcon}   label="Open" />
        <ToolbarButton icon={printIcon}  label="Print" />
        <ToolbarButton icon={findIcon}   label="Find" />

        {/* Gap between Find and Stop */}
        <span className={styles.toolbarGap} />

        <ToolbarButton icon={stopIcon} label="Stop" disabled={true} />

        <span className={styles.toolbarSpacer} />

        {/* Throbber — Netscape N logo, top-right */}
        <span className={styles.throbber}>
          <img src={throbberIcon} className={styles.throbberImg} alt="" draggable="false" />
        </span>
      </div>

      {/* ── Location bar + Directory row + Netscape logo ───────── */}
      <div className={styles.locationSection}>

        <div className={styles.addressBar}>
          <span className={styles.addressLabel}>Location:</span>
          <span className={styles.addressInput}>
            <span className={styles.addressUrl}>{currentUrl}</span>
            <span className={styles.locationDropBtn}>
              <span className={styles.locationArrow} />
            </span>
          </span>
        </div>

        <div className={styles.directoryBar}>
          {["What's New!", "What's Cool!", 'Handbook', 'Net Search', 'Net Directory', 'Software'].map(label => (
            <span key={label} className={styles.dirBtn}>{label}</span>
          ))}
        </div>

        {/* Netscape logo — spans location bar + directory bar */}
        <img src={netscapeLogoIcon} className={styles.netscapeLogo} alt="" draggable="false" />

      </div>

      {/* ── Content viewport + Win95 custom scrollbar ───────────── */}
      <div className={styles.contentFrame}>
      <div className={styles.contentArea}>

        {/* Scrollable page — native scrollbar hidden via CSS */}
        <div
          ref={viewportRef}
          className={styles.contentViewport}
          onScroll={readScroll}
        >
          {children}
        </div>

        {/* Win95 scrollbar */}
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
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className={styles.statusBar}>
        <span className={styles.statusText}>Document: {statusText}</span>
        <div className={styles.statusIcons}>
          <span className={styles.statusIcon} />
          <span className={styles.statusIcon} />
          <span className={styles.statusIcon} />
        </div>
      </div>

    </div>
  )
}
