// src/pages/DotEditor.jsx
//
// Dev-only editor for the index museum's dot pictures (backlog, "dot
// pictures drawn on one grid"), at /dot-editor on the dev server and absent
// from the production build, like the card lab. The six pictures sit side
// by side on the same grid, each above the old mask it replaces; pick one to
// edit it large: click a point to toggle it (drag to paint), then copy its
// rows and paste them into src/shared/index-museum/pictures.js. Edits are
// kept in this browser until you reset them; nothing here writes files.
import { useEffect, useRef, useState } from 'react'
import DotGrid from '../shared/index-museum/DotGrid'
import { PICTURES, COLS, ROWS, isBackground } from '../shared/index-museum/pictures'
import { ARTIFACTS } from '../data/artifacts'
import s from './DotEditor.module.css'

const OLD = Object.fromEntries(
  Object.entries(import.meta.glob('../../assets/dots/dots-*.webp', { eager: true, import: 'default' }))
    .map(([file, url]) => [Number(file.match(/dots-(\d)\.webp$/)[1]), url]),
)
const KEY = 'ux-archaeologist:dot-editor'
const LEVELS = [0, 1, 2, 3, 4, 5]

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
    return Object.fromEntries(LEVELS.map(l => [l, saved[l]?.length === ROWS ? saved[l] : PICTURES[l]]))
  } catch { return { ...PICTURES } }
}

export default function DotEditor() {
  const [pics, setPics] = useState(load)
  const [level, setLevel] = useState(0)
  const [showOld, setShowOld] = useState(true)
  const [copied, setCopied] = useState(false)
  const paint = useRef(null)   // '#' or '.' while dragging

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(pics)) } catch { /* fine: this visit only */ }
  }, [pics])
  useEffect(() => {
    const up = () => { paint.current = null }
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [])

  const set = (c, r, ch) => setPics(p => {
    const rows = [...p[level]]
    if (rows[r][c] === ch) return p
    rows[r] = rows[r].slice(0, c) + ch + rows[r].slice(c + 1)
    return { ...p, [level]: rows }
  })
  const rows = pics[level]
  const text = `  ${level}: [\n${rows.map(r => `    '${r}',`).join('\n')}\n  ],`
  const edited = (l) => pics[l].join() !== PICTURES[l].join()

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch { /* select the text below instead */ }
  }

  return (
    <main className={s.page}>
      <h1 className={s.h1}>Dot pictures (dev)</h1>
      <p className={s.note}>
        {COLS} × {ROWS} points, background on every third. Pick a picture, click or drag on the grid,
        copy its rows into <code>src/shared/index-museum/pictures.js</code>.
      </p>

      <div className={s.row}>
        {LEVELS.map(l => (
          <button key={l} type="button" className={`${s.thumb} ${l === level ? s.on : ''}`} onClick={() => setLevel(l)}
            aria-pressed={l === level}>
            <DotGrid rows={pics[l]} className={s.thumbPic} />
            {showOld && <span className={s.old} style={{ '--art': `url(${OLD[l]})` }} />}
            <span className={s.label}>{ARTIFACTS[l].year} {ARTIFACTS[l].title}{edited(l) ? ' · edited' : ''}</span>
          </button>
        ))}
      </div>
      <label className={s.check}><input type="checkbox" checked={showOld} onChange={e => setShowOld(e.target.checked)} /> Show the old masks under each</label>

      <div className={s.editor}>
        <div className={s.board} style={{ '--cols': COLS }} onPointerLeave={() => { paint.current = null }}>
          {rows.flatMap((row, r) => [...row].map((ch, c) => (
            <button key={`${r}-${c}`} type="button" tabIndex={-1}
              className={`${s.cell} ${ch === '#' ? s.ink : isBackground(c, r) ? s.bg : ''}`}
              aria-label={`row ${r + 1}, column ${c + 1}`}
              onPointerDown={(e) => { e.preventDefault(); paint.current = ch === '#' ? '.' : '#'; set(c, r, paint.current) }}
              onPointerEnter={() => { if (paint.current) set(c, r, paint.current) }} />
          )))}
        </div>
        <div className={s.side}>
          <DotGrid rows={rows} className={s.preview} />
          <DotGrid rows={rows} className={`${s.preview} ${s.inverse}`} />
          <div className={s.actions}>
            <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy rows'}</button>
            <button type="button" onClick={() => setPics(p => ({ ...p, [level]: PICTURES[level] }))} disabled={!edited(level)}>Reset this one</button>
            <button type="button" onClick={() => setPics(p => ({ ...p, [level]: Array(ROWS).fill('.'.repeat(COLS)) }))}>Clear</button>
          </div>
          <textarea className={s.out} readOnly value={text} rows={ROWS + 2} onFocus={e => e.target.select()} />
        </div>
      </div>
    </main>
  )
}
