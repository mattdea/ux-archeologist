// src/components/da/Calculator.jsx — the 1984 Calculator desk accessory,
// laid out as Steve Jobs chose it from Chris Espinosa's Calculator
// Construction Set: a white display across the top of a gray body and 18
// keys in four columns — C E = *, 7 8 9 /, 4 5 6 -, 1 2 3 and a tall +,
// a wide 0 and the point. Type on the keyboard or click the keys.
//
// The window is traced pixel by pixel from the System 1 screenshots
// (docs/reference/mac system 1/macsystem100012.png, 100013.png): DA_ART in
// daArt.js.
// Over it go invisible keys, the press (the key's outer rectangle inverted,
// as in macsystem100013.png) and the display's digits in Geneva 9.
import { useEffect, useState } from 'react'
import { useWindowFrame } from '../windowFrame'
import styles from './da.module.css'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const box = ([x, y, w, h]) => ({ left: mp(x), top: mp(y), width: mp(w), height: mp(h) })

// Each key's white face in the traced art, [x, y, w, h] in Mac pixels
const KEYS = [
  ['C', [10, 53, 16, 14]], ['E', [32, 53, 16, 14]], ['=', [54, 53, 16, 14]], ['*', [76, 53, 16, 14]],
  ['7', [10, 75, 16, 14]], ['8', [32, 75, 16, 14]], ['9', [54, 75, 16, 14]], ['/', [76, 75, 16, 14]],
  ['4', [10, 97, 16, 14]], ['5', [32, 97, 16, 14]], ['6', [54, 97, 16, 14]], ['-', [76, 97, 16, 14]],
  ['1', [10, 119, 16, 14]], ['2', [32, 119, 16, 14]], ['3', [54, 119, 16, 14]], ['+', [76, 119, 16, 36]],
  ['0', [10, 141, 38, 14]], ['.', [54, 141, 16, 14]],
]
const LABELS = KEYS.map(k => k[0])
// The display's white face; digits sit right-aligned 4 pixels in, on a
// baseline 14 pixels down (the traced "0")
const DISPLAY = [9, 28, 84, 18]

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [acc, setAcc] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(true)   // next digit starts a new number
  const [pressed, setPressed] = useState(null)

  const apply = (a, b, o) => {
    switch (o) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? NaN : a / b
      default: return b
    }
  }
  const fmt = (n) => {
    if (!isFinite(n)) return 'Error'
    const s = String(+n.toPrecision(12))
    return s.length > 14 ? n.toExponential(6) : s
  }

  // Inverted while the button is held (or 80ms for a typed key)
  useEffect(() => {
    if (!pressed) return
    const up = () => setPressed(null)
    document.addEventListener('mouseup', up)
    return () => document.removeEventListener('mouseup', up)
  }, [pressed])

  const press = (k, typed = false) => {
    if (typed) { setPressed(k); setTimeout(() => setPressed(null), 80) }
    if (k === 'C') { setDisplay('0'); setAcc(null); setOp(null); setFresh(true); return }
    if (k === 'E') { setDisplay('0'); setFresh(true); return }   // clear entry
    if (/[0-9.]/.test(k)) {
      if (fresh) { setDisplay(k === '.' ? '0.' : k); setFresh(false); return }
      if (k === '.' && display.includes('.')) return
      if (display.replace(/[-.]/g, '').length >= 12) return
      setDisplay(display === '0' && k !== '.' ? k : display + k)
      return
    }
    const cur = parseFloat(display)
    if (k === '=') {
      if (op != null && acc != null) { const r = apply(acc, cur, op); setDisplay(fmt(r)); setAcc(null); setOp(null) }
      setFresh(true)
      return
    }
    if (op != null && acc != null && !fresh) {
      const r = apply(acc, cur, op); setDisplay(fmt(r)); setAcc(r)
    } else {
      setAcc(cur)
    }
    setOp(k); setFresh(true)
  }

  // The keyboard reaches the Calculator only while it's the front window
  const { active } = useWindowFrame()
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      const map = { Enter: '=', Escape: 'C', Backspace: 'E', x: '*', X: '*' }
      const k = map[e.key] ?? e.key
      if (LABELS.includes(k)) { e.preventDefault(); press(k, true) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <div className={styles.calc}>
      <div className={styles.calcDisplay} style={box(DISPLAY)}>{display}</div>
      {KEYS.map(([k, [x, y, w, h]]) => (
        <button
          key={k}
          type="button"
          aria-label={k}
          className={`${styles.calcKey} ${pressed === k ? styles.calcKeyDown : ''}`}
          style={box([x - 1, y - 1, w + 2, h + 2])}
          onMouseDown={(e) => { e.preventDefault(); setPressed(k) }}
          onClick={() => press(k)}
        />
      ))}
    </div>
  )
}
