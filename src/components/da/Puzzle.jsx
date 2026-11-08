// src/components/da/Puzzle.jsx — the Puzzle desk accessory: a 4×4 sliding
// puzzle with tiles 1–15 and one gap. Click a tile in the gap's row or
// column and it (and the tiles between) slide over. Scrambled on open.
import { useState } from 'react'
import styles from './da.module.css'

const N = 4
const solved = () => [...Array(15).keys()].map(i => i + 1).concat([0])

function scramble() {
  // Random legal moves from the solved state, so it is always solvable
  let t = solved(), gap = 15
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
  const gap = tiles.indexOf(0)
  const click = (i) => {
    const gr = Math.floor(gap / N), gc = gap % N, r = Math.floor(i / N), c = i % N
    if (r !== gr && c !== gc) return
    const t = tiles.slice()
    // Slide every tile between the clicked one and the gap by one
    const step = r === gr ? (c < gc ? 1 : -1) : (r < gr ? N : -N)
    let g = gap
    while (g !== i) { t[g] = t[g - step]; g -= step }
    t[i] = 0
    setTiles(t)
  }
  const done = tiles.every((v, i) => v === solved()[i])
  return (
    <div className={`${styles.puzzle} ${done ? styles.puzzleDone : ''}`}>
      {tiles.map((v, i) => v === 0
        ? <span key={i} className={styles.puzzleGap} />
        : <button key={i} type="button" className={styles.puzzleTile} onClick={() => click(i)}>{v}</button>
      )}
    </div>
  )
}
