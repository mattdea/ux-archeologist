// src/components/da/Puzzle.jsx — Andy Hertzfeld's Puzzle desk accessory:
// fifteen numbered tiles in a 4×4 grid. "If you click on a tile next to the
// empty space, it slides into that space." It rescrambles whenever it is
// closed, or chosen again from the Apple menu while open (the parent remounts
// it); when solved it blinks a few times and beeps.
import { useEffect, useState } from 'react'
import styles from './da.module.css'
import * as sfx from '../../audio/sfx'

const N = 4
const SOLVED = [...Array(15).keys()].map(i => i + 1).concat([0])

function scramble() {
  // Random legal moves from the solved state, so it is always solvable
  let t = SOLVED.slice(), gap = 15
  for (let i = 0; i < 300; i++) {
    const r = Math.floor(gap / N), c = gap % N
    const opts = []
    if (r > 0) opts.push(gap - N); if (r < N - 1) opts.push(gap + N)
    if (c > 0) opts.push(gap - 1); if (c < N - 1) opts.push(gap + 1)
    const k = opts[Math.floor(Math.random() * opts.length)]
    ;[t[gap], t[k]] = [t[k], t[gap]]; gap = k
  }
  return t
}

export default function Puzzle() {
  const [tiles, setTiles] = useState(scramble)
  const [blink, setBlink] = useState(false)
  const gap = tiles.indexOf(0)
  const done = tiles.every((v, i) => v === SOLVED[i])

  const click = (i) => {
    if (done) return
    const gr = Math.floor(gap / N), gc = gap % N, r = Math.floor(i / N), c = i % N
    if (Math.abs(gr - r) + Math.abs(gc - c) !== 1) return   // only a tile beside the space
    const t = tiles.slice()
    t[gap] = t[i]; t[i] = 0
    setTiles(t)
  }

  useEffect(() => {
    if (!done) return
    let n = 0
    const id = setInterval(() => {
      setBlink(b => !b)
      if (++n >= 6) { clearInterval(id); setBlink(false); sfx.beep() }
    }, 120)
    return () => clearInterval(id)
  }, [done])

  return (
    <div className={`${styles.puzzle} ${blink ? styles.puzzleBlink : ''}`}>
      {tiles.map((v, i) => v === 0
        ? <span key={i} className={styles.puzzleGap} />
        : <button key={i} type="button" className={styles.puzzleTile} onClick={() => click(i)}>{v}</button>
      )}
    </div>
  )
}
