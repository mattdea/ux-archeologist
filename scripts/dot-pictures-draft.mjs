#!/usr/bin/env node
// scripts/dot-pictures-draft.mjs
//
// First drafts of the index museum's dot pictures on one grid (backlog,
// "dot pictures drawn on one grid"): samples each of the six old masks
// (assets/dots/dots-N.webp, 400 × 340) at the points of a 36 × 30 grid and
// prints each picture as rows of '#' (ink) and '.' (none), ready to paste
// into src/shared/index-museum/pictures.js and tidy in the editor
// (/dot-editor on the dev server).
//
//   node scripts/dot-pictures-draft.mjs            all six
//   node scripts/dot-pictures-draft.mjs 4          only dots-4
//   THRESHOLD=0.3 node scripts/dot-pictures-draft.mjs
//
// The old masks' own background dots are removed first (an opening with a
// 3px disc wipes out dots smaller than the ink), then each cell's share of
// ink decides it. Needs ImageMagick 7 (`magick`).
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const COLS = 36
const ROWS = 30
const W = 400
const H = 340
const THRESHOLD = Number(process.env.THRESHOLD ?? 0.28)
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'dots')

function ink(level) {
  // 1 byte per pixel, 255 = ink, background dots removed
  return execFileSync('magick', [
    join(DIR, `dots-${level}.webp`), '-background', 'white', '-alpha', 'remove', '-alpha', 'off',
    '-colorspace', 'gray', '-negate', '-morphology', 'Open', 'Disk:3', '-depth', '8', 'gray:-',
  ], { maxBuffer: W * H * 2 })
}

function draft(level) {
  const px = ink(level)
  const rows = []
  for (let r = 0; r < ROWS; r++) {
    let row = ''
    for (let c = 0; c < COLS; c++) {
      const x0 = Math.round((c * W) / COLS), x1 = Math.round(((c + 1) * W) / COLS)
      const y0 = Math.round((r * H) / ROWS), y1 = Math.round(((r + 1) * H) / ROWS)
      let on = 0, n = 0
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { on += px[y * W + x] > 127; n++ }
      row += on / n >= THRESHOLD ? '#' : '.'
    }
    rows.push(row)
  }
  return rows
}

const only = process.argv.slice(2).map(Number)
for (const level of [0, 1, 2, 3, 4, 5]) {
  if (only.length && !only.includes(level)) continue
  console.log(`  ${level}: [\n${draft(level).map(r => `    '${r}',`).join('\n')}\n  ],`)
}
