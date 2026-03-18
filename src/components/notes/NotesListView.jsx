// src/components/notes/NotesListView.jsx
//
// iPhone OS 1 Notes list view.
// Design source: Figma node 32:2589 (640×960 @ 2×, halved to 320×480 @ 1×)
//
// Props:
//   notes        — array of note objects from NotesApp
//   onNoteSelect — called with note.id when a row is tapped

import { useRef } from 'react'
import StatusBar from '../phone/StatusBar'
import styles from './NotesListView.module.css'
import { useRubberBandScroll } from '../../hooks/useRubberBandScroll'

import paperTexture from '../../../assets/phone/notes-paper.png'
import navTexture   from '../../../assets/phone/notes-navbar.png'
import backBtnAccounts from '../../../assets/phone/back-button-accounts.png'
import plusIcon         from '../../../assets/phone/notes-icon-plus.png'
import drillIn      from '../../../assets/phone/notes-drill-in.png'

// Number of empty ruled rows to fill the visible paper below the 3 notes.
// Available height: 416px, note rows: 3×44=132px, padding: 20px → 264px / 44 ≈ 6 rows
const EMPTY_ROW_COUNT = 6

export default function NotesListView({ notes, onNoteSelect }) {
  const listRef    = useRef(null)
  const contentRef = useRef(null)
  const { onMouseDown } = useRubberBandScroll(listRef, contentRef)

  // CSS custom properties carry the image URLs so the module CSS can use them.
  const cssVars = {
    '--notes-paper-url': `url('${paperTexture}')`,
    '--notes-navbar-url': `url('${navTexture}')`,
  }

  return (
    <div className={styles.view} style={cssVars}>

      {/* Status bar — 20px, white text on translucent bg */}
      <StatusBar variant="dark" />

      {/* ── Navigation bar ─────────────────────────────────────────────── */}
      <div className={styles.navBar}>
        <div className={styles.navGloss} />

        {/* Left "Accounts" button — decorative, non-tappable */}
        <img src={backBtnAccounts} alt="" className={styles.navBackBtn} aria-hidden="true" />

        {/* Centered title */}
        <span className={styles.navTitle}>Notes ({notes.length})</span>

        {/* Right "+" button — visible, non-functional */}
        <div className={styles.navRightBtn} aria-hidden="true">
          <img src={plusIcon} alt="" className={styles.navPlusImg} />
        </div>

        <div className={styles.navInner} />
      </div>

      {/* ── Paper wrapper ──────────────────────────────────────────────── */}
      <div className={styles.wrapper}>

        {/* Stitching edge at top */}
        <div className={styles.topEdge} />

        {/* Stitching edge at bottom */}
        <div className={styles.bottomEdge} />

        {/* Gloss — white fade at top, over rows */}
        <div className={styles.gloss} />

        {/* Scrollable list */}
        <div className={styles.list} ref={listRef}>
          <div className={styles.listContent} ref={contentRef} onMouseDown={onMouseDown}>

            {/* Note rows — each is tappable */}
            {notes.map((note) => (
              <div
                key={note.id}
                className={styles.row}
                onClick={() => onNoteSelect(note.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNoteSelect(note.id)}
              >
                <div className={styles.rowLeading}>
                  <span className={styles.rowTitle}>{note.title}</span>
                </div>
                <div className={styles.rowTrailing}>
                  <span className={styles.rowDate}>{note.date}</span>
                  <img src={drillIn} alt="" className={styles.drillIn} />
                </div>
              </div>
            ))}

            {/* Empty ruled rows to fill the remaining paper */}
            {Array.from({ length: EMPTY_ROW_COUNT }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptyRow} />
            ))}

          </div>
        </div>

      </div>
    </div>
  )
}
