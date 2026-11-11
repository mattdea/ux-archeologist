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
// key: museumStyle.js, pictureStyle.js, devLooks.js, cardLook.js, state.js.
// Levels > stipple: Level 1's stipple reveal (experiment), read when the
// level opens.
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './DevPanel.module.css'
import { useMuseumStyle, setMuseumStyle } from '../museumStyle'
import { usePictureStyle, setPictureStyle, PICTURE_STYLES } from '../index-museum/pictureStyle'
import { serifTitlesOn, setSerifTitles, cardTimelineOn, setCardTimeline, stippleRevealOn, setStippleReveal } from '../devLooks'
import { readCardLook, saveCardLook, readCardArt, saveCardArt } from '../../pages/collection/cardLook'
import { completeLevel } from '../../state/state'
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
  const [, redraw] = useState(0)
  const [done, setDone] = useState(false)
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
  const completeAll = () => {
    ARTIFACTS.forEach(a => completeLevel(a.level))
    changed()
    setDone(true); setTimeout(() => setDone(false), 1200)
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
            <Choice label="stipple" value={stippleRevealOn() ? 'on' : 'off'} options={[['off', 'off'], ['on', 'on']]}
              onChoose={(v) => { setStippleReveal(v === 'on'); changed() }} />
          </section>
          <section className={s.group}>
            <h2 className={s.head}>Progress</h2>
            <button type="button" className={s.action} onClick={completeAll}>{done ? 'Completed all six' : 'Complete all'}</button>
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
