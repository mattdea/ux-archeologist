// src/components/da/KeyCaps.jsx — the Key Caps desk accessory: a map of the
// Macintosh keyboard. Type on the keyboard, or click a key, and the key
// darkens and its character joins the line at the top. Hold Shift or
// Option and the key tops change to show what those keys type.
//
// Traced from docs/reference/mac system 1/macsystem100014.png (body below
// the title bar: dotted backdrop, the line, the keys; the pointer covered r
// and f there, so they are copies of t and g). Key tops, the line and a
// pressed key are live: labels in Chicago, centred, baseline 13 pixels into
// each 18-pixel face; the line's text 4 pixels in, baseline 14 down. The
// Option layer is today's US Mac layout and a pressed key's look (its face
// inverted) is reconstructed: neither is in the screenshot. A held key
// repeats at the Control Panel's delay and rate.
import { useEffect, useRef, useState } from 'react'
import { useWindowFrame } from '../windowFrame'
import { getSetting } from '../macSettings'
import art from '../../../assets/mac/da/keycaps.png'
import styles from './da.module.css'

const mp = (n) => `calc(var(--mac-px) * ${n})`

// Each row: its faces' top, the first face's left, then [code, base, shift, option]
const ROWS = [
  [41, 11, [['Backquote', '`', '~', '`'], ['Digit1', '1', '!', '¡'], ['Digit2', '2', '@', '™'], ['Digit3', '3', '#', '£'],
    ['Digit4', '4', '$', '¢'], ['Digit5', '5', '%', '∞'], ['Digit6', '6', '^', '§'], ['Digit7', '7', '&', '¶'],
    ['Digit8', '8', '*', '•'], ['Digit9', '9', '(', 'ª'], ['Digit0', '0', ')', 'º'], ['Minus', '-', '_', '–'], ['Equal', '=', '+', '≠']]],
  [61, 41, [['KeyQ', 'q', 'Q', 'œ'], ['KeyW', 'w', 'W', '∑'], ['KeyE', 'e', 'E', '´'], ['KeyR', 'r', 'R', '®'],
    ['KeyT', 't', 'T', '†'], ['KeyY', 'y', 'Y', '¥'], ['KeyU', 'u', 'U', '¨'], ['KeyI', 'i', 'I', 'ˆ'],
    ['KeyO', 'o', 'O', 'ø'], ['KeyP', 'p', 'P', 'π'], ['BracketLeft', '[', '{', '“'], ['BracketRight', ']', '}', '‘'], ['Backslash', '\\', '|', '«']]],
  [81, 46, [['KeyA', 'a', 'A', 'å'], ['KeyS', 's', 'S', 'ß'], ['KeyD', 'd', 'D', '∂'], ['KeyF', 'f', 'F', 'ƒ'],
    ['KeyG', 'g', 'G', '©'], ['KeyH', 'h', 'H', '˙'], ['KeyJ', 'j', 'J', '∆'], ['KeyK', 'k', 'K', '˚'],
    ['KeyL', 'l', 'L', '¬'], ['Semicolon', ';', ':', '…'], ['Quote', "'", '"', 'æ']]],
  [101, 56, [['KeyZ', 'z', 'Z', 'Ω'], ['KeyX', 'x', 'X', '≈'], ['KeyC', 'c', 'C', 'ç'], ['KeyV', 'v', 'V', '√'],
    ['KeyB', 'b', 'B', '∫'], ['KeyN', 'n', 'N', '˜'], ['KeyM', 'm', 'M', 'µ'], ['Comma', ',', '<', '≤'],
    ['Period', '.', '>', '≥'], ['Slash', '/', '?', '÷']]],
]
const KEYS = ROWS.flatMap(([y, x0, keys]) => keys.map(([code, ...layers], i) => ({ code, layers, x: x0 + 20 * i, y, w: 18 })))
// In macsystem100014.png the number keys' tops are blank (they still type
// their digit); shifted and optioned they show what they type
const BLANK_TOP = new Set(['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'])
// Keys with blank tops: [code, x, y, w]
const BLANK = [['Backspace', 271, 41, 28], ['Tab', 11, 61, 28], ['CapsLock', 11, 81, 33], ['Enter', 266, 81, 33],
  ['Space', 81, 121, 148], ['NumpadEnter', 231, 121, 28]]
const BY_CODE = Object.fromEntries([...KEYS.map(k => [k.code, k]), ...BLANK.map(([code, x, y, w]) => [code, { code, x, y, w, layers: code === 'Space' ? [' ', ' ', ' '] : null }])])
const MAX = 32   // characters the line holds before it drops the oldest

// A held key repeats as the Control Panel says, in ticks (1/60 s):
// "delay until repeat" 0–4 (0 off) and "key repeat rate" 0–4 (turtle to
// rabbit). The tick counts are reconstructed.
const DELAY_TICKS = [Infinity, 48, 36, 24, 15]
const RATE_TICKS = [24, 12, 6, 4, 2]
const TICK = 1000 / 60

export default function KeyCaps() {
  const { active } = useWindowFrame()
  const [text, setText] = useState('')
  const [shift, setShift] = useState(false)
  const [option, setOption] = useState(false)
  const [down, setDown] = useState(null)   // code of the key shown pressed

  const layer = option ? 2 : shift ? 1 : 0
  const repeatRef = useRef(null)
  const stopRepeat = () => { clearTimeout(repeatRef.current); repeatRef.current = null }
  const type = (key) => {
    if (key.code === 'Backspace') { setText(t => t.slice(0, -1)); return }
    const ch = key.layers?.[layer]
    if (ch) setText(t => (t + ch).slice(-MAX))
  }

  // The keyboard reaches Key Caps only while it's the front window
  useEffect(() => {
    if (!active) return
    const onDown = (e) => {
      if (e.key === 'Shift') setShift(true)
      if (e.key === 'Alt') setOption(true)
      const key = BY_CODE[e.code]
      if (!key || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      if (e.repeat) return                 // the browser's repeat; Key Caps keeps its own
      setDown(key.code)
      type(key)
      stopRepeat()
      const delay = DELAY_TICKS[getSetting('keyDelay')], rate = RATE_TICKS[getSetting('keyRepeat')]
      if (!isFinite(delay)) return
      const again = () => { type(key); repeatRef.current = setTimeout(again, rate * TICK) }
      repeatRef.current = setTimeout(again, delay * TICK)
    }
    const onUp = (e) => {
      if (e.key === 'Shift') setShift(false)
      if (e.key === 'Alt') setOption(false)
      stopRepeat()
      setDown(d => (d === e.code ? null : d))
    }
    const reset = () => { setShift(false); setOption(false); setDown(null); stopRepeat() }
    document.addEventListener('keydown', onDown)
    document.addEventListener('keyup', onUp)
    window.addEventListener('blur', reset)
    return () => {
      document.removeEventListener('keydown', onDown)
      document.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', reset)
    }
  })

  // A clicked key stays down until the button comes up
  useEffect(() => {
    if (!down) return
    const up = () => setDown(null)
    document.addEventListener('mouseup', up)
    return () => document.removeEventListener('mouseup', up)
  }, [down])

  return (
    <div className={styles.keycaps} style={{ backgroundImage: `url(${art})` }}>
      <span className={styles.keycapsLine} style={{ left: mp(44), top: mp(12), width: mp(222) }}>{text}</span>
      {Object.values(BY_CODE).map(key => (
        <button
          key={key.code}
          type="button"
          aria-label={key.layers?.[layer]?.trim() || key.code}
          className={`${styles.keycap} ${down === key.code ? styles.keycapDown : ''}`}
          style={{ left: mp(key.x), top: mp(key.y), width: mp(key.w), height: mp(18) }}
          onMouseDown={(e) => { e.preventDefault(); setDown(key.code); type(key) }}
        >
          {key.layers && key.code !== 'Space' && !(layer === 0 && BLANK_TOP.has(key.code)) && (
            <span style={{ top: mp(1) }}>{key.layers[layer]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
