// src/components/notes/NoteDetailView.jsx
//
// iPhone OS 1 individual note view.
// Design source: Figma node 32:2813 (640×960 @ 2×, halved to 320×480 @ 1×)
//
// Props:
//   note   — note object { id, title, headerLabel, headerDate, content[] }
//   onBack — called when "Notes" back button is tapped

import { useRef } from 'react'
import styles from './NoteDetailView.module.css'
import { useRubberBandScroll } from '../../hooks/useRubberBandScroll'

import paperTexture   from '../../../assets/phone/notes-paper.png'
import navTexture     from '../../../assets/phone/notes-navbar.png'
import backBtnNotes from '../../../assets/phone/back-button-notes.png'
import plusIcon     from '../../../assets/phone/notes-icon-plus.png'
import toolbarPrev    from '../../../assets/phone/notes-toolbar-prev.png'
import toolbarShare   from '../../../assets/phone/notes-toolbar-share.png'
import toolbarTrash   from '../../../assets/phone/notes-toolbar-trash.png'
import toolbarNext    from '../../../assets/phone/notes-toolbar-next.png'

export default function NoteDetailView({ note, onBack }) {
  const areaRef    = useRef(null)
  const innerRef   = useRef(null)
  const { onMouseDown } = useRubberBandScroll(areaRef, innerRef)
  // Truncate nav title to fit — CSS ellipsis handles it, but we also
  // keep a short version for semantic correctness.
  const navTitle = note.title.length > 16
    ? note.title.slice(0, 15) + '...'
    : note.title

  const cssVars = {
    '--notes-paper-url': `url('${paperTexture}')`,
    '--notes-navbar-url': `url('${navTexture}')`,
  }

  return (
    <div className={styles.view} style={cssVars}>

      {/* ── Navigation bar ─────────────────────────────────────────────── */}
      <div className={styles.navBar}>
        <div className={styles.navGloss} />

        {/* Left "Notes" back button — tappable */}
        <button className={styles.navBackBtn} onClick={onBack} aria-label="Back to Notes list">
          <img src={backBtnNotes} alt="" />
        </button>

        {/* Centered title (truncated with ellipsis) */}
        <span className={styles.navTitle}>{navTitle}</span>

        {/* Right "+" button — visible, non-functional */}
        <div className={styles.navRightBtn} aria-hidden="true">
          <img src={plusIcon} alt="" className={styles.navPlusImg} />
        </div>

        <div className={styles.navInner} />
      </div>

      {/* ── Paper wrapper ──────────────────────────────────────────────── */}
      <div className={styles.wrapper}>

        {/* Stitching edges */}
        <div className={styles.topEdge} />
        <div className={styles.bottomEdge} />

        {/* Red margin lines (vertical, absolute — stay fixed while content scrolls) */}
        <div className={styles.marginLine1} />
        <div className={styles.marginLine2} />

        {/* Gloss — white fade at top */}
        <div className={styles.gloss} />

        {/* ── Scrollable note content ─────────────────────────────────── */}
        <div className={styles.contentArea} ref={areaRef}>
          <div className={styles.contentInner} ref={innerRef} onMouseDown={onMouseDown}>

            {/* Header: "Today   Jul 2  9:41 AM" */}
            <div className={styles.header}>
              <span className={styles.headerLabel}>{note.headerLabel}</span>
              <span className={styles.headerDate}>{note.headerDate}</span>
            </div>

            {/* Note body — each item in content[] is a line */}
            <div className={styles.noteText}>
              {note.content.join('\n')}
            </div>

          </div>
        </div>

        {/* ── Bottom toolbar ─────────────────────────────────────────── */}
        <div className={styles.toolbar}>
          {/* Prev — disabled (opacity 0.4) */}
          <div className={`${styles.toolbarIcon} ${styles.toolbarIconDisabled}`}>
            <img src={toolbarPrev} alt="Previous note" />
          </div>

          {/* Share */}
          <div className={styles.toolbarIcon}>
            <img src={toolbarShare} alt="Share" />
          </div>

          {/* Trash */}
          <div className={styles.toolbarIcon}>
            <img src={toolbarTrash} alt="Delete" />
          </div>

          {/* Next */}
          <div className={styles.toolbarIcon}>
            <img src={toolbarNext} alt="Next note" />
          </div>
        </div>

      </div>
    </div>
  )
}
