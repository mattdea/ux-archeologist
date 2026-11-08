// src/components/da/Calculator.jsx — the 1984 Calculator desk accessory,
// laid out as Steve Jobs chose it from Chris Espinosa's Calculator
// Construction Set: a white display across the top of a gray body and 18
// keys in four columns — C E = *, 7 8 9 /, 4 5 6 -, 1 2 3 and a tall +,
// a wide 0 and the point. Type on the keyboard or click the keys.
import { useEffect, useState } from 'react'
import styles from './da.module.css'

// [label, gridArea]
const KEYS = [
  ['C', '1 / 1'], ['E', '1 / 2'], ['=', '1 / 3'], ['*', '1 / 4'],
  ['7', '2 / 1'], ['8', '2 / 2'], ['9', '2 / 3'], ['/', '2 / 4'],
  ['4', '3 / 1'], ['5', '3 / 2'], ['6', '3 / 3'], ['-', '3 / 4'],
  ['1', '4 / 1'], ['2', '4 / 2'], ['3', '4 / 3'], ['+', '4 / 4 / span 2'],
  ['0', '5 / 1 / auto / span 2'], ['.', '5 / 3'],
]
const LABELS = KEYS.map(k => k[0])

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

  const press = (k) => {
    setPressed(k); setTimeout(() => setPressed(null), 80)
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

  useEffect(() => {
    const onKey = (e) => {
      const map = { Enter: '=', Escape: 'C', Backspace: 'E', x: '*', X: '*' }
      const k = map[e.key] ?? e.key
      if (LABELS.includes(k)) { e.preventDefault(); press(k) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <div className={styles.calc}>
      <div className={styles.calcDisplay}>{display}</div>
      <div className={styles.calcKeys}>
        {KEYS.map(([k, area]) => (
          <button
            key={k}
            type="button"
            className={`${styles.calcKey} ${pressed === k ? styles.calcKeyDown : ''}`}
            style={{ gridArea: area }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => press(k)}
          >{k}</button>
        ))}
      </div>
    </div>
  )
}
