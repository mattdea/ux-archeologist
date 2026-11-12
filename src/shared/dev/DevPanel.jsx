// src/shared/dev/DevPanel.jsx
//
// Every dev control in one place (backlog, "Dev: one dev panel behind a
// corner tab"; 10 Nov 2026), the same in both museums, on the dev server
// only: SharedLayout loads it lazily behind import.meta.env.DEV, so the
// production build has neither the tab nor this code.
//
// The tab: a small monospace `dev`, fixed bottom right, faint until pointed
// at or focused, always there. Click it or press Ctrl+Shift+D to open the
// panel above it; Escape or a click outside closes it and puts focus back
// on the tab. Open or closed is remembered per browser. It floats over the
// page (not data-hud, so it never moves an artifact), above modals, and the
// closed panel takes no clicks except on the tab.
//
// Each control does what its old line or button did and keeps its storage
// key: museumStyle.js, pictureStyle.js, pointer.js, devLooks.js, cardLook.js, state.js.
// Museum > pointer: the index museum's pointer, the flint arrowhead or the fossil stick.
// Museum > level layout: the index museum's corners or side layout in a level.
// Museum > timeline: the index home page's timeline as a list, line, cards or dig.
// Museum > continue: after a discovery, the next room or back to the timeline
// (the card path's old setting, card-timeline, shared with Classic).
// Levels > catalogue: every level's catalogue record (experiment, on by default).
// Progress > progress: none resets every level (and the timeline's seen
// finds); all completes the six without marking them seen, so the
// timeline's reveals still play. In between, neither is pressed and the
// heading says how many are done. No confirm step: it's dev only, and it
// replaces the visitors' Reset progress (Matthew's review, 12 Nov 2026).
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './DevPanel.module.css'
import { useMuseumStyle, setMuseumStyle } from '../museumStyle'
import { usePictureStyle, setPictureStyle, PICTURE_STYLES } from '../index-museum/pictureStyle'
import { useMuseumPointer, setMuseumPointer, POINTERS } from '../index-museum/pointer'
import { serifTitlesOn, setSerifTitles, cardTimelineOn, setCardTimeline, catalogueRecordOn, setCatalogueRecord, indexLevelLayout, setIndexLevelLayout, indexTimeline, setIndexTimeline, forgetCardsSeen } from '../devLooks'
import { readCardLook, saveCardLook, readCardArt, saveCardArt } from '../../pages/collection/cardLook'
import { completeLevel, isLevelComplete, resetAll } from '../../state/state'
import { ARTIFACTS } from '../../data/artifacts'
import { devChanged } from './devEvents'

const OPEN_KEY = 'ux-archaeologist:dev-panel'
const readOpen = () => { try { return localStorage.getItem(OPEN_KEY) === '1' } catch { return false } }
const saveOpen = (on) => { try { on ? localStorage.setItem(OPEN_KEY, '1') : localStorage.removeItem(OPEN_KEY) } catch { /* this visit only */ } }

// One row of choices: a label, then the options, the current one pressed
function Choice({ label, value, options, onChoose }) {
  const id = useId()
  return (
    <div className={s.row} role="group" aria-labelledby={id}>
      <span id={id} className={s.label}>{label}</span>
      <span className={s.options}>
        {options.map(([v, text]) => (
          <button key={v} type="button" className={s.option} aria-pressed={value === v} onClick={() => onChoose(v)}>{text}</button>
        ))}
      </span>
    </div>
  )
}

export default function DevPanel({ navigate }) {
  const [open, setOpenState] = useState(readOpen)
  const museum = useMuseumStyle()
  const pictures = usePictureStyle()
  const pointer = useMuseumPointer()
  const [, redraw] = useState(0)
  const rootRef = useRef(null)
  const tabRef = useRef(null)

  const setOpen = (on) => { setOpenState(on); saveOpen(on) }
  const close = useCallback(() => { setOpenState(false); saveOpen(false); tabRef.current?.focus() }, [])
  const changed = () => { devChanged(); redraw(n => n + 1) }

  // Ctrl+Shift+D anywhere, before a level's own keys see it (Level 0's
  // terminal recaptures every keydown); Escape while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.code === 'KeyD') {
        e.preventDefault(); e.stopPropagation()
        setOpenState(o => { saveOpen(!o); return !o })
        return
      }
      if (e.key === 'Escape' && rootRef.current?.dataset.open === 'true') {
        e.preventDefault(); e.stopPropagation()
        close()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [close])

  // A click outside closes it
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) close() }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open, close])

  const go = (path) => { setOpen(false); navigate(path) }
  const doneCount = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  const progress = doneCount === 0 ? 'none' : doneCount === ARTIFACTS.length ? 'all' : null
  const setProgress = (v) => {
    if (v === 'none') { resetAll(); forgetCardsSeen() }
    else ARTIFACTS.forEach(a => completeLevel(a.level))
    changed()
  }

  // In <body>, outside the room, so no transform or stacking context of the
  // page's can put it under a modal
  return createPortal(
    <div ref={rootRef} className={s.dev} data-dev-panel data-open={open}>
      {open && (
        <div className={s.panel} role="dialog" aria-label="Dev panel">
          <section className={s.group}>
            <h2 className={s.head}>Museum</h2>
            <Choice label="museum" value={museum} options={[['classic', 'Classic'], ['index', 'Index']]} onChoose={setMuseumStyle} />
            {museum === 'index' && (
              <Choice label="pictures" value={pictures} options={PICTURE_STYLES.map(p => [p, p])} onChoose={setPictureStyle} />
            )}
            {museum === 'index' && (
              <Choice label="pointer" value={pointer} options={POINTERS.map(p => [p, p])} onChoose={setMuseumPointer} />
            )}
            {museum === 'index' && (
              <Choice label="level layout" value={indexLevelLayout()} options={[['corners', 'corners'], ['side', 'side']]}
                onChoose={(v) => { setIndexLevelLayout(v); changed() }} />
            )}
            {museum === 'index' && (
              <Choice label="timeline" value={indexTimeline()} options={['list', 'line', 'cards', 'dig'].map(v => [v, v])}
                onChoose={(v) => { setIndexTimeline(v); changed() }} />
            )}
            {museum === 'index' && (
              <Choice label="continue" value={cardTimelineOn() ? 'timeline' : 'next'} options={[['next', 'next room'], ['timeline', 'timeline']]}
                onChoose={(v) => { setCardTimeline(v === 'timeline'); changed() }} />
            )}
          </section>
          <section className={s.group}>
            <h2 className={s.head}>Classic looks</h2>
            <Choice label="titles" value={serifTitlesOn() ? 'serif' : 'sans'} options={[['sans', 'sans'], ['serif', 'serif']]}
              onChoose={(v) => { setSerifTitles(v === 'serif'); changed() }} />
            <Choice label="timeline" value={cardTimelineOn() ? 'cards' : 'line'} options={[['line', 'line'], ['cards', 'cards']]}
              onChoose={(v) => { setCardTimeline(v === 'cards'); changed() }} />
            <Choice label="card style" value={readCardLook()} options={[['card', 'collectible'], ['museum', 'museum'], ['hybrid', 'hybrid']]}
              onChoose={(v) => { saveCardLook(v); changed() }} />
            <Choice label="card art" value={readCardArt()} options={[['drawn', 'drawn'], ['illustrated', 'illustrated']]}
              onChoose={(v) => { saveCardArt(v); changed() }} />
          </section>
          <section className={s.group}>
            <h2 className={s.head}>Levels</h2>
            <Choice label="catalogue" value={catalogueRecordOn() ? 'on' : 'off'} options={[['off', 'off'], ['on', 'on']]}
              onChoose={(v) => { setCatalogueRecord(v === 'on'); changed() }} />
          </section>
          <section className={s.group}>
            <h2 className={s.head}>{progress ? 'Progress' : `Progress · ${doneCount} of ${ARTIFACTS.length}`}</h2>
            <Choice label="progress" value={progress} options={[['none', 'none'], ['all', 'all']]} onChoose={setProgress} />
          </section>
          <section className={s.group}>
            <h2 className={s.head}>Labs</h2>
            <button type="button" className={s.action} onClick={() => go('/card-lab')}>Card lab</button>
            <button type="button" className={s.action} onClick={() => go('/style-lab')}>Style lab</button>
            <button type="button" className={s.action} onClick={() => go('/dot-editor')}>Dot editor</button>
          </section>
        </div>
      )}
      <button ref={tabRef} type="button" className={s.tab} aria-expanded={open} aria-label="Dev panel (Ctrl+Shift+D)"
        onClick={() => setOpen(!open)}>
        dev
      </button>
    </div>,
    document.body,
  )
}
