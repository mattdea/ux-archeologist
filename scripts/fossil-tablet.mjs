#!/usr/bin/env node
// scripts/fossil-tablet.mjs
//
// The carved tablet, the index museum's main picture with the fossils
// (backlog, "the carved tablet"): turns a drawing on a white ground
// (default docs/reference/style-lab/fossil-tablet-script.webp, the clay
// tablet written in the six rooms' signs; the carved tablet it replaced,
// fossil-tablet.webp, stays there as a record) into
// assets/fossils/fossil-tablet.webp, an ink-density mask like the fossils
// (scripts/fossil-pictures.mjs): black with the ink as its alpha, so the
// ground drops away, faint stipple stays faint, and the page fills it with
// its text colour.
//
//   node scripts/fossil-tablet.mjs              the reference drawing
//   node scripts/fossil-tablet.mjs larger.png   a larger version, same subject
//
// Kept at the drawing's own resolution and proportions (nothing upscaled),
// trimmed to the ink plus a small margin so the broken edges stay whole.
// The page fits it with `contain`, so a larger file needs no code changes.
// Needs ImageMagick 7 (`magick`).
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = process.argv[2] || join(ROOT, 'docs', 'reference', 'style-lab', 'fossil-tablet-script.webp')
const OUT = join(ROOT, 'assets', 'fossils', 'fossil-tablet.webp')
const FLOOR = 8        // paper noise, out of 255 (as the fossils)
const SOLID = 0.995    // the share of ink below "solid"
const MARGIN = 0.02    // of the longer side, round the ink

const magick = (args, opts = {}) => execFileSync('magick', args, { maxBuffer: 64 << 20, ...opts })
const [W, H] = magick(['identify', '-format', '%w %h', SRC]).toString().split(' ').map(Number)
const grey = magick([SRC, '-alpha', 'off', '-colorspace', 'gray', '-depth', '8', 'gray:-'])
const density = Float32Array.from(grey, v => Math.max(0, 255 - FLOOR - v))

// the ink's box, ignoring specks
const rowInk = new Array(H).fill(0), colInk = new Array(W).fill(0)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (density[y * W + x] > 60) { rowInk[y]++; colInk[x]++ }
}
const span = (a) => [a.findIndex(n => n > 2), a.length - 1 - [...a].reverse().findIndex(n => n > 2)]
const m = Math.round(Math.max(W, H) * MARGIN)
const [x0, x1] = span(colInk).map((v, i) => (i ? Math.min(W - 1, v + m) : Math.max(0, v - m)))
const [y0, y1] = span(rowInk).map((v, i) => (i ? Math.min(H - 1, v + m) : Math.max(0, v - m)))
const BW = x1 - x0 + 1, BH = y1 - y0 + 1

const inked = [...density].filter(d => d > 0).sort((a, b) => a - b)
const solid = inked[Math.floor(inked.length * SOLID)] || 1

const alpha = Buffer.alloc(BW * BH)
for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
  alpha[y * BW + x] = Math.round(Math.min(1, density[(y + y0) * W + (x + x0)] / solid) * 255)
}
mkdirSync(dirname(OUT), { recursive: true })
magick(['-size', `${BW}x${BH}`, 'xc:black',
  '(', '-size', `${BW}x${BH}`, '-depth', '8', 'gray:-', ')',
  '-alpha', 'off', '-compose', 'CopyOpacity', '-composite',
  '-define', 'webp:lossless=true', OUT], { input: alpha })
console.log(`fossil-tablet.webp  ${BW} × ${BH} (from ${W} × ${H})`)
