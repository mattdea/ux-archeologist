// src/components/apps/TeachText.jsx
//
// TeachText (Apple, 1988): the little text editor the Infinite Mac System
// Disk carries in its Utilities folder (macsystem100031/33–35.png). It is
// newer than this 1984 Finder; it's here because that disk has it, and it
// gives Notes something to open in.
//
//   TeachTextContent  the document window's inside, measured from
//                     macsystem100033.png: text in Geneva 12 on 16-pixel
//                     lines, 4 pixels in from the left; a vertical scroll
//                     bar; along the bottom a blank strip (no horizontal
//                     bar) ending in the grow box. Scrolls only with the bar
//                     or by typing past the edge (no mouse wheel).
//   SaveDialog        "Save this document as:", traced from
//                     macsystem100034.png (assets/mac/apps/teachtext-save.png,
//                     320 × 120 at (82,92)) with the name typed live over it.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MacScrollBar from '../MacScrollBar'
import { useWindowFrame } from '../windowFrame'
import saveArt from '../../../assets/mac/apps/teachtext-save.png'
import * as sfx from '../../audio/sfx'
import styles from './apps.module.css'

const MAC_PX = 620 / 512
const LINE = 16 * MAC_PX
const INSET = 16 * MAC_PX - 1          // the bar and the bottom strip, 1px over the frame
const mp = (n) => `calc(var(--mac-px) * ${n})`

export function TeachTextContent({ text, onChange, readOnly = false, editorRef }) {
  const { active, resizable, onGrowMouseDown } = useWindowFrame()
  const fallback = useRef(null)
  const ta = editorRef ?? fallback
  const [bar, setBar] = useState({ value: 0, max: 0, page: 0 })

  // The bar follows the text's own scrolling (typing past the bottom
  // scrolls it, as TextEdit did)
  const sync = () => {
    const t = ta.current
    if (!t) return
    const next = { value: t.scrollTop, max: Math.max(0, t.scrollHeight - t.clientHeight), page: Math.max(LINE, t.clientHeight - LINE) }
    setBar(b => (b.value === next.value && b.max === next.max && b.page === next.page) ? b : next)
  }
  useLayoutEffect(sync)   // eslint-disable-line react-hooks/set-state-in-effect -- measuring the textarea after each render
  const scrollTo = (v) => {
    const t = ta.current
    if (t) t.scrollTop = v
    sync()
  }

  // No mouse wheel: the 1984 mouse had none. Measure again when the window
  // is resized and once Geneva 12 has loaded (it changes the text's height).
  const syncRef = useRef(sync)
  useLayoutEffect(() => { syncRef.current = sync })
  useEffect(() => {
    const t = ta.current
    if (!t) return
    const stop = (e) => e.preventDefault()
    t.addEventListener('wheel', stop, { passive: false })
    const again = () => syncRef.current()
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(again)
    ro?.observe(t)
    document.fonts?.ready?.then(again)
    return () => { t.removeEventListener('wheel', stop); ro?.disconnect() }
  }, [ta])

  return (
    <div className={styles.tt}>
      <textarea
        ref={ta}
        className={styles.ttText}
        style={{ right: INSET, bottom: INSET }}
        value={text}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={sync}
        onSelect={sync}
        readOnly={readOnly}
        spellCheck={false}
        aria-label="Document"
      />
      <MacScrollBar
        orientation="vertical" active={active} line={LINE}
        value={bar.value} max={bar.max} page={bar.page}
        onChange={scrollTo}
        style={{ top: -1, right: -1, bottom: INSET - 1 }}
      />
      <div className={styles.ttStrip} style={{ height: INSET + 1 }} />
      <div className={styles.ttGrow} onMouseDown={active && resizable ? onGrowMouseDown : undefined} data-growbox="">
        {active && (
          <svg viewBox="0 0 14 14" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden="true">
            <rect x="2.5" y="2.5" width="6" height="6" fill="#fff" stroke="#000" />
            <rect x="4.5" y="4.5" width="8" height="8" fill="#fff" stroke="#000" />
          </svg>
        )}
      </div>
    </div>
  )
}

// A push button over the traced dialog: the face inverts while pressed
export function Btn({ x, y, w = 70, h = 18, label, onPress, disabled }) {
  const [down, setDown] = useState(false)
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={styles.btn}
      style={{ left: mp(x), top: mp(y), width: mp(w), height: mp(h) }}
      onMouseDown={(e) => {
        if (disabled || e.button !== 0) return
        e.preventDefault()
        e.stopPropagation()
        const el = e.currentTarget
        setDown(true)
        const up = (ev) => {
          document.removeEventListener('mouseup', up)
          setDown(false)
          if (el.contains(ev.target)) onPress()
        }
        document.addEventListener('mouseup', up)
      }}
    >
      {down && <span className={styles.btnDown} />}
    </button>
  )
}

export function SaveDialog({ initial = 'Untitled', onSave, onCancel }) {
  const [name, setName] = useState(initial)
  const input = useRef(null)
  useEffect(() => { input.current?.focus(); input.current?.select() }, [])
  const save = () => { if (name.trim()) onSave(name.trim()); else sfx.beep() }
  return (
    // Modal: nothing behind it answers
    <div className={styles.scrim} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.saveDialog} role="dialog" aria-label="Save this document as:"
        style={{ left: mp(82), top: mp(92), width: mp(320), height: mp(120), backgroundImage: `url(${saveArt})` }}>
        <input
          ref={input}
          className={styles.saveName}
          style={{ left: mp(22), top: mp(41), width: mp(168), height: mp(16) }}
          value={name}
          maxLength={31}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); save() }
            if (e.key === 'Escape') { e.preventDefault(); onCancel() }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          spellCheck={false}
          aria-label="Document name"
        />
        <Btn x={20} y={82} label="Save" onPress={save} />
        <Btn x={122} y={82} label="Cancel" onPress={onCancel} />
        <Btn x={225} y={51} label="Eject" onPress={() => sfx.beep()} />
        <Btn x={225} y={82} label="Drive" disabled />
      </div>
    </div>
  )
}
