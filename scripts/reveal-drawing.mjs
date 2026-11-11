#!/usr/bin/env node
// scripts/reveal-drawing.mjs
//
// The stipple drawing a level's device is shown as when you arrive and leave
// (backlog, "Levels: the device as a drawing when you arrive and leave";
// experiment, 11 Nov 2026; drawn by src/shared/reveal/StippleReveal.jsx).
// Captures the device in its intro state at its natural size, twice over
// for detail, on a transparent ground, turns it into round dots (dense in
// the darks, sparse in the lights, with its edges drawn), and writes
// assets/reveal/level-N.webp, served on the dev server only.
//
//   node scripts/reveal-drawing.mjs           Level 1 (the pilot)
//   node scripts/reveal-drawing.mjs 1         the same
//
// Regenerate whenever the device changes. Needs the dev server (default
// http://localhost:5199), Google Chrome and ImageMagick 7 (`magick`).
//
// The file, 2x the device's natural size, lossless:
//   alpha  the device's silhouette (filled with the page colour, so the live
//          device never shows through the gaps between dots)
//   red    a dot's radius in quarter pixels of the 2x image, at its centre
//          pixel; 0 everywhere else
// Green and blue are 0. The page reads the dots back from the pixels.
import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const LEVEL = Number(process.argv[2] ?? 1)
const ROOM = ['The Command Line', 'The Desktop', 'The Hyperlink', 'The Touchscreen', 'The Feed', 'The Conversation'][LEVEL]
const OUT = join(ROOT, 'assets', 'reveal', `level-${LEVEL}.webp`)
const DPR = 2

// The stipple, in the device's natural pixels
const STEP = 3          // one cell of the dot grid
const SMALL = 0.8       // dot radius in the lights
const LARGE = 1.2       // and in the darks
const EDGE = 6          // how strongly edges draw

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const magick = (args, opts = {}) => execFileSync('magick', args, { maxBuffer: 256 << 20, ...opts })

// A small seeded random, so the same capture gives the same drawing
let seed = 1984
const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32 }

async function capture() {
  const profile = mkdtempSync(join(tmpdir(), 'reveal-chrome-'))
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let err = ''
      chrome.stderr.on('data', (d) => { err += d; const m = err.match(/DevTools listening on (ws:\/\/\S+)/); if (m) resolve(m[1]) })
      chrome.on('exit', () => reject(new Error('Chrome exited: ' + err)))
      setTimeout(() => reject(new Error('Chrome did not start')), 15000)
    })
    const ws = new WebSocket(wsUrl)
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
    let nextId = 0
    const waiting = new Map()
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      const w = waiting.get(msg.id); if (!w) return
      waiting.delete(msg.id)
      msg.error ? w.reject(new Error(msg.error.message)) : w.resolve(msg.result)
    }
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId
      waiting.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params, sessionId }))
    })
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
    const page = (method, params) => send(method, params, sessionId)
    const evaluate = async (expression) => {
      const r = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
      return r.result.value
    }
    await page('Page.enable')
    await page('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1200, deviceScaleFactor: DPR, mobile: false })
    // the index museum (its list is easy to click), nothing done, so the
    // level opens on its intro; the reveal off, so the device is the device
    await page('Page.addScriptToEvaluateOnNewDocument', { source: `try {
      localStorage.clear()
      localStorage.setItem('ux-archaeologist:museum', 'index')
      sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1')
    } catch {}` })
    await page('Page.navigate', { url: `${BASE}/` })
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`!!document.querySelector('[data-index-museum] [data-ix-nav]')`).catch(() => false)) break
      await sleep(100)
    }
    await evaluate(`[...document.querySelectorAll('[data-index-museum] [data-ix-nav]')].find(e => e.textContent.includes(${JSON.stringify(ROOM)})).click()`)
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`!!document.querySelector('[data-reveal-device]')`).catch(() => false)) break
      await sleep(100)
    }
    await sleep(1500)
    // only the device, at its natural size, on nothing
    const rect = await evaluate(`(() => {
      const dev = document.querySelector('[data-reveal-device]')
      const st = document.createElement('style')
      st.textContent = 'html, body { background: transparent !important } body * { visibility: hidden !important; animation: none !important; transition: none !important }'
      document.head.appendChild(st)
      for (let el = dev; el; el = el.parentElement) el.style.setProperty('transform', 'none', 'important')
      dev.style.setProperty('visibility', 'visible', 'important')
      dev.querySelectorAll('*').forEach(e => e.style.setProperty('visibility', 'visible', 'important'))
      dev.querySelectorAll('[data-reveal-skip]').forEach(e => e.style.setProperty('visibility', 'hidden', 'important'))
      const r = dev.getBoundingClientRect()
      return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }
    })()`)
    await page('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })
    await sleep(300)
    // the whole viewport at 2x, cut to the device (a clipped capture lays
    // the page out again and moves the device)
    const shot = await page('Page.captureScreenshot', { format: 'png' })
    ws.close()
    return { png: Buffer.from(shot.data, 'base64'), rect }
  } finally {
    chrome.kill()
    try { rmSync(profile, { recursive: true, force: true }) } catch { /* in use */ }
  }
}

const { png, rect } = await capture()
const W = Math.round(rect.width * DPR), H = Math.round(rect.height * DPR)
const crop = `${W}x${H}+${Math.round(rect.x * DPR)}+${Math.round(rect.y * DPR)}`
const rgba = magick(['png:-', '-crop', crop, '+repage', '-depth', '8', 'rgba:-'], { input: png })

// tone: 0 = paper (light), 1 = ink (dark), from luminance; inside = the silhouette
const L = new Float32Array(W * H), inside = new Uint8Array(W * H)
for (let i = 0; i < W * H; i++) {
  const a = rgba[i * 4 + 3] / 255
  inside[i] = a > 0.5 ? 1 : 0
  L[i] = (0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2]) / 255
}
const at = (x, y) => L[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))]
const inAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : inside[y * W + x])
const tone = (x, y) => {
  // edges: the luminance gradient over 2 natural px, and the silhouette's rim
  const r = DPR * 2
  const gx = at(x + r, y) - at(x - r, y), gy = at(x, y + r) - at(x, y - r)
  const rim = inAt(x + r, y) && inAt(x - r, y) && inAt(x, y + r) && inAt(x, y - r) ? 0 : 1
  const edge = Math.min(1, Math.hypot(gx, gy) * EDGE)
  return Math.max(Math.min(1, Math.pow(1 - at(x, y), 1.7) * 1.15), edge, rim)
}

const out = Buffer.alloc(W * H * 4)
for (let i = 0; i < W * H; i++) out[i * 4 + 3] = inside[i] ? 255 : 0
let dots = 0
const put = (px, py, rNat) => {
  const x = Math.round(px * DPR), y = Math.round(py * DPR)
  if (!inAt(x, y)) return
  out[(y * W + x) * 4] = Math.min(255, Math.round(rNat * DPR * 4))
  dots++
}
const NW = rect.width, NH = rect.height
for (let cy = 0; cy < NH; cy += STEP) for (let cx = 0; cx < NW; cx += STEP) {
  const px = cx + rand() * STEP, py = cy + rand() * STEP
  const x = Math.round(px * DPR), y = Math.round(py * DPR)
  if (!inAt(x, y)) continue
  const t = tone(x, y)
  if (rand() < t * 0.92) put(px, py, t > 0.62 ? LARGE : SMALL)
  // the darkest darks get a second dot
  if (t > 0.85 && rand() < (t - 0.85) * 5) put(cx + rand() * STEP, cy + rand() * STEP, SMALL)
}

mkdirSync(dirname(OUT), { recursive: true })
magick(['-size', `${W}x${H}`, '-depth', '8', 'rgba:-', '-define', 'webp:lossless=true', '-define', 'webp:exact=true', OUT], { input: out })
console.log(`level-${LEVEL}.webp  ${W} × ${H} (natural ${NW} × ${NH}), ${dots} dots`)
