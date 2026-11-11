#!/usr/bin/env node
// scripts/index-pointers.mjs
//
// The index museum's pointers (backlog, "Index museum: a flint arrowhead as
// the museum's pointer"; 11 Nov 2026): two small pixel drawings, drawn by
// hand below at 1x, each written in a light and a dark version at 1x and
// 2x into assets/pointers/.
//
//   arrowhead  the flint arrowhead, the fossil version of the pointer
//              (fossil pictures, level 1): tip top left, the pointer's
//              straight left edge and 45-degree leading edge, a barb each
//              side, and the tang where the pointer's tail is. A ridge of
//              flake scars down the blade. 20px tall at 1x.
//   stick      a fossil stick (Matthew's photo,
//              docs/reference/style-lab/cursor-fossil-stick.png), turned to
//              point up and to the left: the thin end is the tip, tapered
//              to a point over three rows; a slightly crooked shaft 4px
//              across (about 3.4px measured square to it), the bump in the
//              middle, and the forked end at the bottom right: a Y, the
//              knob running on past the shaft and the prong splaying off
//              to the right. About 28px long at 1x. A few grain marks like the cracks in the
//              photo.
//
// In the drawings `#` is ink (the page's text colour) and `o` is a scar
// (the page colour). Each drawing gets a rim of page colour one CSS px
// wide all round (diagonals included), so it shows on both themes and on
// the list's inverted rows. The 2x file is the same drawing at twice the
// size, nearest-neighbour, so it is sharp on 2x screens and identical in
// shape; its rim is 2 device px, the same one CSS px.
//
// The tip is the drawing's top-left pixel; with the rim it lands at (1, 1),
// so the hotspot is `1 1` (CSS px) in both files. Nothing in either drawing
// sits above or left of its tip.
//
// Inks: the index museum's (IndexMuseum.module.css): light #000 on #fff,
// dark #e6e6e6 on #111.
//
//   node scripts/index-pointers.mjs          write the PNGs
//   node scripts/index-pointers.mjs --show   also print each 1x file
//
// Needs ImageMagick 7 (`magick`).
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets/pointers')
const THEMES = {
  light: { ink: [0, 0, 0], paper: [255, 255, 255] },
  dark: { ink: [0xe6, 0xe6, 0xe6], paper: [0x11, 0x11, 0x11] },
}

export const DRAWINGS = {
  arrowhead: [
    '#',
    '##',
    '###',
    '####',
    '#####',
    '##o###',
    '#######',
    '###o####',
    '######o##',
    '####o#####',
    '###########',
    '#####o######',
    '#######o#####',
    '########   ##',
    '###  ####',
    '##    ####',
    '#     ####',
    '       ####',
    '       ####',
    '        ###',
  ],
  stick: [
    '#',
    '##',
    '###',
    ' ###',
    ' ####',
    '  ####',
    '   ####',
    '   ####',
    '    #o##',
    '     ####',
    '     #####',
    '      #####',
    '       ####',
    '       #o##',
    '        ####',
    '         ####',
    '         ####',
    '          ####',
    '           ####',
    '           #o###',
    '           #######',
    '          ##### ###',
    '         ######  ###',
    '         ######   ##',
    '         #####',
    '          ###',
  ],
}

// 0 clear, 1 ink, 2 page colour; `scale` device px per drawn px, with the
// rim of `scale` device px round it
export function render(drawing, scale) {
  const w = Math.max(...drawing.map(r => r.length)) + 2, h = drawing.length + 2
  const W = w * scale, H = h * scale
  const g = Array.from({ length: H }, () => new Array(W).fill(0))
  drawing.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === ' ') return
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      g[(y + 1) * scale + dy][(x + 1) * scale + dx] = c === '#' ? 1 : 2
    }
  }))
  const body = g.map(r => r.map(c => c !== 0))
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== 0) continue
    near: for (let dy = -scale; dy <= scale; dy++) for (let dx = -scale; dx <= scale; dx++) {
      if (body[y + dy]?.[x + dx]) { g[y][x] = 2; break near }
    }
  }
  return g
}

function writePng(grid, { ink, paper }, file) {
  const h = grid.length, w = grid[0].length
  const px = Buffer.alloc(w * h * 4)
  grid.forEach((row, y) => row.forEach((c, x) => {
    const i = (y * w + x) * 4
    const rgb = c === 1 ? ink : paper
    px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = c ? 255 : 0
  }))
  const head = `P7\nWIDTH ${w}\nHEIGHT ${h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n`
  const tmp = join(tmpdir(), `pointer-${process.pid}.pam`)
  writeFileSync(tmp, Buffer.concat([Buffer.from(head), px]))
  execFileSync('magick', [tmp, '-strip', '-define', 'png:compression-level=9', `PNG32:${file}`])
  rmSync(tmp)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(OUT, { recursive: true })
  const show = process.argv.includes('--show')
  for (const [name, drawing] of Object.entries(DRAWINGS)) {
    for (const scale of [1, 2]) {
      const grid = render(drawing, scale)
      if (show && scale === 1) {
        console.log(`${name} ${grid[0].length} x ${grid.length}`)
        console.log(grid.map(r => r.map(c => ' #.'[c]).join('')).join('\n'))
      }
      for (const [theme, inks] of Object.entries(THEMES)) {
        writePng(grid, inks, join(OUT, `${name}-${theme}${scale === 2 ? '@2x' : ''}.png`))
      }
    }
  }
  console.log(`wrote ${OUT}`)
}
