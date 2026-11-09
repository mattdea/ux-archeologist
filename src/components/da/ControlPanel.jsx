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
//   desktop pattern  the left box shows the pattern's pixels magnified ("fat
//                    bits", 5 Mac pixels a bit): click or drag to flip them.
//                    The right box is a little desktop in that pattern: click
//                    its menu bar for the next of the stock patterns, click
//                    the desktop to make it the Mac's desktop pattern
// Settings live in macSettings.js for the session. Mouse tracking is shown
// but not wired. Reconstructed: the stock patterns (QuickDraw's own and a
// few classic ones, not System 1's list) and the menu-bar / desktop clicks,
// as the 1984 manual describes them from memory.
import { useEffect, useRef, useState } from 'react'
import art from '../../../assets/mac/da/controlpanel.png'
import thumbSrc from '../../../assets/mac/da/cp-thumb.png'
import dotSrc from '../../../assets/mac/da/cp-dot-on.png'
import { useMacSetting, GRAY } from '../macSettings'
import ScreenTexture from '../ScreenTexture'
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

const useSetting = useMacSetting

// Fat bits at (107, 101), 8 × 8 bits of 5 Mac pixels (a 4-pixel square and a
// gap); the sample desktop's menu bar is (158, 101) 46 × 5, its desktop
// (158, 107) 46 × 34
const FAT = [107, 101]
const STOCK = [
  GRAY,
  [0x88, 0x22, 0x88, 0x22, 0x88, 0x22, 0x88, 0x22],   // light gray
  [0x77, 0xDD, 0x77, 0xDD, 0x77, 0xDD, 0x77, 0xDD],   // dark gray
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // white
  [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],   // black
  [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80],   // diagonal
  [0xFF, 0x80, 0x80, 0x80, 0xFF, 0x08, 0x08, 0x08],   // bricks
  [0x88, 0x88, 0x88, 0xFF, 0x88, 0x88, 0x88, 0xFF],   // grid
  [0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81],   // crosses
  [0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA],   // stripes
]
const same = (a, b) => a.every((v, i) => v === b[i])

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
  const [desktop, setDesktop] = useSetting('desktopPattern')
  const [pattern, setPattern] = useState(desktop)   // being edited; the desktop changes on a click

  // Fat bits: the first bit pressed decides whether a drag sets or clears
  const bitAt = (clientX, clientY) => {
    const p = toLocal(rootRef.current, clientX, clientY)
    const x = Math.floor((p.x / MAC_PX - FAT[0]) / 5), y = Math.floor((p.y / MAC_PX - FAT[1]) / 5)
    return x >= 0 && x < 8 && y >= 0 && y < 8 ? [x, y] : null
  }
  const paint = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const first = bitAt(e.clientX, e.clientY)
    if (!first) return
    let rows = pattern.slice()
    const on = !(rows[first[1]] & (0x80 >> first[0]))
    const set = ([x, y]) => {
      const mask = 0x80 >> x
      const next = on ? rows[y] | mask : rows[y] & ~mask
      if (next === rows[y]) return
      rows = rows.slice(); rows[y] = next; setPattern(rows)
    }
    set(first)
    const move = (ev) => { const b = bitAt(ev.clientX, ev.clientY); if (b) set(b) }
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }
  const nextStock = () => {
    const i = STOCK.findIndex(p => same(p, pattern))
    setPattern(STOCK[(i + 1) % STOCK.length])
  }

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

      {/* Desktop pattern: fat bits, and a sample desktop */}
      <span className={styles.cpFat} style={{ left: mp(FAT[0]), top: mp(FAT[1]), width: mp(40), height: mp(40) }} onMouseDown={paint}>
        {pattern.flatMap((byte, y) => [...Array(8)].map((_, x) => (byte & (0x80 >> x))
          ? <i key={`${x}-${y}`} style={{ left: mp(5 * x), top: mp(5 * y), width: mp(4), height: mp(4) }} />
          : null))}
      </span>
      <button type="button" aria-label="Next pattern" className={styles.cpCell}
        style={{ left: mp(158), top: mp(101), width: mp(46), height: mp(5) }} onClick={nextStock} />
      <button type="button" aria-label="Use this pattern for the desktop" className={styles.cpSample}
        style={{ left: mp(158), top: mp(107), width: mp(46), height: mp(34) }}
        onClick={() => setDesktop(pattern)} data-current={same(pattern, desktop) || undefined}>
        <ScreenTexture pattern={pattern} />
      </button>

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
