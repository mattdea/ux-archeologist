#!/usr/bin/env node
// scripts/stamp-masks.mjs
//
// Masks of the six stamp pictures for the card lab's stamp cards (backlog,
// "Card lab: stamp cards in a grid"): assets/stamps/stamp-N.webp in,
// assets/stamps/mask-N.webp out, black with the stamp's ink density as its
// alpha. The near-white paper drops away and the grain stays: a faint speck
// of ink prints faint. The cards fill the mask with their own ink colour.
//
//   node scripts/stamp-masks.mjs
//
// Density is how far a pixel's darkest channel sits below the paper (so a
// yellow ink counts as much as a blue one), less a small floor for the
// paper's own noise, scaled so each stamp's solid ink (its 99.5th
// percentile) is fully opaque. Same size as the stamp (480 × 408), so every
// mask keeps the stamps' one scale. Needs ImageMagick 7 (`magick`).
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'stamps')
const FLOOR = 6        // paper noise, out of 255
const SOLID = 0.995    // the share of ink pixels below "solid"

for (const level of [0, 1, 2, 3, 4, 5]) {
  const src = join(DIR, `stamp-${level}.webp`)
  const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', src]).toString().split(' ').map(Number)
  const rgb = execFileSync('magick', [src, '-alpha', 'off', '-depth', '8', 'rgb:-'], { maxBuffer: w * h * 4 })

  // the paper: the brightest common value of the darkest channel
  const darkest = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) darkest[i] = Math.min(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2])
  const hist = new Array(256).fill(0)
  darkest.forEach(v => hist[v]++)
  let paper = 255
  for (let v = 255, seen = 0; v >= 0; v--) { seen += hist[v]; if (seen > w * h * 0.25) { paper = v; break } }

  const density = Float32Array.from(darkest, v => Math.max(0, paper - FLOOR - v))
  const inked = [...density].filter(d => d > 0).sort((a, b) => a - b)
  const solid = inked[Math.floor(inked.length * SOLID)] || 1
  const alpha = Buffer.from(Uint8Array.from(density, d => Math.round(Math.min(1, d / solid) * 255)))

  const out = join(DIR, `mask-${level}.webp`)
  execFileSync('magick', [
    '-size', `${w}x${h}`, 'xc:black',
    '(', '-size', `${w}x${h}`, '-depth', '8', 'gray:-', ')',
    '-alpha', 'off', '-compose', 'CopyOpacity', '-composite',
    '-define', 'webp:lossless=true', out,
  ], { input: alpha })
  console.log(`mask-${level}.webp  paper ${paper}, solid at ${Math.round(solid)}`)
}
