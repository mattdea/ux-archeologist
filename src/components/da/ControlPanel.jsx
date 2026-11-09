// src/components/da/ControlPanel.jsx — the Control Panel desk accessory.
//
// Traced from docs/reference/mac system 1/macsystem100015.png (body below
// the title bar; the slider's thumb and every chosen setting cleared so they
// can be drawn live). Live over it:
//   speaker volume   drag or click the slider; marks 0–7 are 12 pixels apart
//   date and time    ticking, in Chicago, where the screenshot has them
//   menu blinks      0–3: how many times a chosen menu item blinks (MenuBar)
//   key repeat rate  0–4, delay until repeat 0–4, insertion point blink 1–3,
//   double-click speed (three circles): chosen, they invert or fill
// Settings live in macSettings.js for the session. The mouse tracking and
// desktop pattern controls are shown but don't change anything yet.
import { useEffect, useRef, useState } from 'react'
import art from '../../../assets/mac/da/controlpanel.png'
import thumbSrc from '../../../assets/mac/da/cp-thumb.png'
import dotSrc from '../../../assets/mac/da/cp-dot-on.png'
import { getSetting, setSetting } from '../macSettings'
import { toLocal } from '../desktopDrag'
import * as sfx from '../../audio/sfx'
import styles from './da.module.css'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const pad = (n) => String(n).padStart(2, '0')

// Rows of 12×13 cells, 13 pixels apart: [setting, first value, y, x of each]
const SELECTORS = [
  ['menuBlinks', 0, 14, [246, 259, 272, 285]],
  ['keyRepeat', 0, 50, [161, 174, 187, 200, 213]],
  ['keyDelay', 0, 68, [161, 174, 187, 200, 213]],
  ['caretBlink', 1, 70, [263, 276, 289]],
]
const DOTS = [255, 272, 289]          // double-click circles' left edges (9 across), top 131
const MARK0 = 119                     // the slider's 0 mark; 7 is at 119 - 12 × 7
const MAC_PX = 620 / 512              // CSS px per Mac pixel (--mac-px)

function useSetting(key) {
  const [v, setV] = useState(() => getSetting(key))
  return [v, (n) => { setSetting(key, n); setV(n) }]
}

export default function ControlPanel() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250)
    return () => clearInterval(t)
  }, [])

  const values = {
    menuBlinks: useSetting('menuBlinks'),
    keyRepeat: useSetting('keyRepeat'),
    keyDelay: useSetting('keyDelay'),
    caretBlink: useSetting('caretBlink'),
  }
  const [dbl, setDbl] = useSetting('doubleClick')
  const [volume, setVolume] = useSetting('volume')

  // Volume: the thumb follows the pointer from mark to mark
  const rootRef = useRef(null)
  const volumeAt = (clientX, clientY) => {
    const p = toLocal(rootRef.current, clientX, clientY)   // CSS px
    const y = p.y / MAC_PX                                  // Mac px
    return Math.max(0, Math.min(7, Math.round((MARK0 - y) / 12)))
  }
  const slide = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    let v = volumeAt(e.clientX, e.clientY)
    setVolume(v)
    const move = (ev) => { v = volumeAt(ev.clientX, ev.clientY); setVolume(v) }
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      if (v > 0) sfx.beep()            // the Mac beeps at the new volume
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  const date = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${pad(now.getFullYear() % 100)}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <div ref={rootRef} className={styles.cp} style={{ backgroundImage: `url(${art})` }}>
      {/* Speaker volume */}
      <span className={styles.cpSlider} style={{ left: mp(19), top: mp(25), width: mp(23), height: mp(104) }} onMouseDown={slide} />
      <span className={styles.cpSprite} style={{ left: mp(19), top: mp(MARK0 - 5 - 12 * volume), width: mp(23), height: mp(11), backgroundImage: `url(${thumbSrc})` }} />

      {/* Date and time (Chicago; baseline 25) */}
      <span className={styles.cpText} style={{ left: mp(54), top: mp(13) }}>{date}</span>
      <span className={styles.cpText} style={{ left: mp(136), top: mp(13) }}>{time}</span>

      {SELECTORS.map(([key, first, y, xs]) => {
        const [v, set] = values[key]
        return xs.map((x, i) => (
          <button
            key={`${key}${i}`}
            type="button"
            aria-label={`${key} ${first + i}`}
            className={`${styles.cpCell} ${v === first + i ? styles.cpCellOn : ''}`}
            style={{ left: mp(x), top: mp(y), width: mp(12), height: mp(13) }}
            onClick={() => set(first + i)}
          />
        ))
      })}

      {DOTS.map((x, i) => (
        <button
          key={`dbl${i}`}
          type="button"
          aria-label={`double-click speed ${i + 1}`}
          className={styles.cpCell}
          style={{
            left: mp(x - 1), top: mp(130), width: mp(11), height: mp(11),
            backgroundImage: dbl === i ? `url(${dotSrc})` : undefined,
          }}
          onClick={() => setDbl(i)}
        />
      ))}
    </div>
  )
}
