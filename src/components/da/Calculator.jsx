// src/components/da/Calculator.jsx — the 1984 Calculator desk accessory.
// A display across the top and a 4×5 keypad: C E = *, 7 8 9 /, 4 5 6 -,
// 1 2 3 +, 0 . =. Type on the keyboard or click the keys.
import { useEffect, useState } from 'react'
import styles from './da.module.css'

const KEYS = [
  'C', 'E', '=', '*',
  '7', '8', '9', '/',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '=', null,
]

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
    if (k == null) return
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
    // operator
    if (op != null && acc != null && !fresh) {
      const r = apply(acc, cur, op); setDisplay(fmt(r)); setAcc(r)
    } else {
      setAcc(cur)
    }
    setOp(k); setFresh(true)
  }

  useEffect(() => {
    const onKey = (e) => {
      const map = { Enter: '=', Escape: 'C', Backspace: 'E', 'x': '*', 'X': '*' }
      const k = map[e.key] ?? e.key
      if (KEYS.includes(k)) { e.preventDefault(); press(k) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <div className={styles.calc}>
      <div className={styles.calcDisplay}>{display}</div>
      <div className={styles.calcKeys}>
        {KEYS.map((k, i) => k == null
          ? <span key={i} />
          : <button key={i} type="button" className={`${styles.calcKey} ${pressed === k ? styles.calcKeyDown : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => press(k)}>{k}</button>
        )}
      </div>
    </div>
  )
}
