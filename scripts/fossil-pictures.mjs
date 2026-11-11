#!/usr/bin/env node
// scripts/fossil-pictures.mjs
//
// The index museum's fossil pictures (backlog, "fossil pictures, a third
// picture option"): cuts the six finds out of a sheet of three across and
// two down (default docs/reference/style-lab/fossil-pictures.webp) and
// writes assets/fossils/fossil-N.webp, each an ink-density mask: black with
// the ink as its alpha, so the white paper drops away, faint stipple stays
// faint, and the page fills it with its text colour.
//
//   node scripts/fossil-pictures.mjs                 the reference sheet
//   node scripts/fossil-pictures.mjs redraw.png      a new sheet, same layout
//
// One scale for all six: each find is taken from its own cell (so no
// neighbour leaks in), centred on its ink, and placed in the same
// 600 × 510 box (the museum's 400 / 340 shape, tall enough for the hand at
// the sheet's own resolution; nothing is upscaled). The code only reads
// fossil-N.webp, so a redraw needs this script and no code changes.
// Needs ImageMagick 7 (`magick`).
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SHEET = process.argv[2] || join(ROOT, 'docs', 'reference', 'style-lab', 'fossil-pictures.webp')
const OUT = join(ROOT, 'assets', 'fossils')
const BOX_W = 600
const BOX_H = 510
const FLOOR = 8        // paper noise, out of 255
const SOLID = 0.995    // the share of ink below "solid"

const magick = (args, opts = {}) => execFileSync('magick', args, { maxBuffer: 64 << 20, ...opts })
const [W, H] = magick(['identify', '-format', '%w %h', SHEET]).toString().split(' ').map(Number)
const CW = Math.floor(W / 3)
const CH = Math.floor(H / 2)
mkdirSync(OUT, { recursive: true })

for (const level of [0, 1, 2, 3, 4, 5]) {
  const cx = (level % 3) * CW
  const cy = Math.floor(level / 3) * CH
  // the cell, as grey (0 = ink)
  const grey = magick([SHEET, '-crop', `${CW}x${CH}+${cx}+${cy}`, '+repage', '-alpha', 'off',
    '-colorspace', 'gray', '-depth', '8', 'gray:-'])
  const density = Float32Array.from(grey, v => Math.max(0, 255 - FLOOR - v))

  // the find's ink box, ignoring specks: rows and columns with enough ink
  const rowInk = new Array(CH).fill(0), colInk = new Array(CW).fill(0)
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (density[y * CW + x] > 60) { rowInk[y]++; colInk[x]++ }
  }
  const span = (a) => [a.findIndex(n => n > 2), a.length - 1 - [...a].reverse().findIndex(n => n > 2)]
  const [x0, x1] = span(colInk), [y0, y1] = span(rowInk)
  const mx = Math.round((x0 + x1) / 2), my = Math.round((y0 + y1) / 2)

  const inked = [...density].filter(d => d > 0).sort((a, b) => a - b)
  const solid = inked[Math.floor(inked.length * SOLID)] || 1

  // alpha in the box, the find's centre at the box's centre
  const alpha = Buffer.alloc(BOX_W * BOX_H)
  for (let y = 0; y < BOX_H; y++) for (let x = 0; x < BOX_W; x++) {
    const sx = x - BOX_W / 2 + mx, sy = y - BOX_H / 2 + my
    if (sx < 0 || sy < 0 || sx >= CW || sy >= CH) continue
    alpha[y * BOX_W + x] = Math.round(Math.min(1, density[sy * CW + sx] / solid) * 255)
  }
  const out = join(OUT, `fossil-${level}.webp`)
  magick(['-size', `${BOX_W}x${BOX_H}`, 'xc:black',
    '(', '-size', `${BOX_W}x${BOX_H}`, '-depth', '8', 'gray:-', ')',
    '-alpha', 'off', '-compose', 'CopyOpacity', '-composite',
    '-define', 'webp:lossless=true', out], { input: alpha })
  console.log(`fossil-${level}.webp  find ${x1 - x0 + 1} × ${y1 - y0 + 1}${x1 - x0 + 1 > BOX_W || y1 - y0 + 1 > BOX_H ? '  (larger than the box: cut)' : ''}`)
}
