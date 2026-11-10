#!/usr/bin/env node
// scripts/style-lab-shots.mjs
//
// Full-page screenshots of the style lab (docs/backlog.md, museum restyle
// phase 1): every concept's screens at 1440 and 375 wide, plus the index,
// into docs/style-lab/<concept>/<width>-<screen>.webp.
//
//   node scripts/style-lab-shots.mjs                  all concepts
//   node scripts/style-lab-shots.mjs a c              only concepts a and c
//   BASE=http://localhost:5173 node scripts/…         another dev server
//
// Needs the dev server running (default http://localhost:5199, the "vite"
// entry in .claude/launch.json) and Google Chrome. No dependencies: it
// drives headless Chrome over the DevTools protocol with Node's own
// WebSocket (Node 22+).
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'style-lab')

// id → folder name. Keep in step with src/pages/styleLab/concepts.js.
const CONCEPTS = {
  a: 'a-unstyled-document',
  b: 'b-index',
  c: 'c-canvas',
  d: 'd-colour-field',
  e: 'e-specimen-sheet',
  f: 'f-notebook',
  b2: 'b2-index-refined',
  g: 'g-punch-card',
}
// [hash after the concept's id, file name]. Round 2's concepts show the
// level frame twice: around the Mac (room 1) and the iPhone (room 3).
const SCREENS = [['title', 'title'], ['timeline', 'timeline'], ['collection', 'collection'], ['level', 'level']]
const SCREENS_TWO_FRAMES = [...SCREENS.slice(0, 3), ['level/1', 'level-mac'], ['level/3', 'level-iphone']]
const TWO_FRAMES = ['b2', 'g']
// Extra shots with the pointer over something: [hash, file name, selector]
const HOVERS = {
  b2: [
    ['timeline', 'timeline-hover', '[data-lab-scroll] a[href="#b2/level/1"]:not([aria-label])'],
    ['collection', 'collection-hover', '[data-lab-scroll] a[href="#b2/level/2"]:not([aria-label])'],
  ],
}
const SIZES = [
  { width: 1440, height: 900, scale: 1 },
  { width: 375, height: 812, scale: 2 },
]
const MAX_HEIGHT = 12000

const only = process.argv.slice(2)
const ids = only.length ? only.filter(id => id === 'index' || CONCEPTS[id]) : ['index', ...Object.keys(CONCEPTS)]
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'style-lab-chrome-'))
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let err = ''
      chrome.stderr.on('data', (d) => {
        err += d
        const m = err.match(/DevTools listening on (ws:\/\/\S+)/)
        if (m) resolve(m[1])
      })
      chrome.on('exit', () => reject(new Error('Chrome exited: ' + err)))
      setTimeout(() => reject(new Error('Chrome did not start: ' + err)), 15000)
    })

    const ws = new WebSocket(wsUrl)
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
    let nextId = 0
    const waiting = new Map()
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      const w = waiting.get(msg.id)
      if (!w) return
      waiting.delete(msg.id)
      msg.error ? w.reject(new Error(msg.error.message)) : w.resolve(msg.result)
    }
    // Every command gets 20s; a navigation caught by a dev-server reload can
    // otherwise wait for ever
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId
      const timer = setTimeout(() => { waiting.delete(id); reject(new Error(`${method} timed out`)) }, 20000)
      waiting.set(id, {
        resolve: (v) => { clearTimeout(timer); resolve(v) },
        reject: (e) => { clearTimeout(timer); reject(e) },
      })
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
    // The museum's own small-screen notice would cover the lab at 375
    await page('Page.addScriptToEvaluateOnNewDocument', {
      source: "try { sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1') } catch {}",
    })

    const shoot = async (hash, size, file, hover) => {
      for (let attempt = 1; ; attempt++) {
        try { return await shootOnce(hash, size, file, hover) } catch (err) {
          if (attempt === 3) throw err
          console.log(`  retrying ${hash || 'index'} at ${size.width} (${err.message})`)
        }
      }
    }
    const shootOnce = async (hash, size, file, hover) => {
      await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: size.scale, mobile: size.width < 600 })
      await page('Page.navigate', { url: 'about:blank' })
      await page('Page.navigate', { url: `${BASE}/style-lab${hash}` })
      // Wait for the lab's chunk, fonts and pictures
      for (let i = 0; i < 100; i++) {
        const ready = await evaluate(`(async () => {
          if (!document.querySelector('[data-lab-scroll], [data-lab-index]')) return false
          await document.fonts.ready
          return [...document.images].every(img => img.complete)
        })()`).catch(() => false)
        if (ready) break
        await sleep(100)
      }
      await sleep(900)
      if (hover) {
        // Put the pointer on the middle of the thing
        const at = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(hover)}).getBoundingClientRect(); return [r.left + Math.min(r.width / 2, 120), r.top + r.height / 2] })()`)
        await page('Input.dispatchMouseEvent', { type: 'mouseMoved', x: at[0], y: at[1] })
        await sleep(200)
      }
      // Freeze the stage at this size and let the page run on below it
      const total = await evaluate(`(() => {
        const scroll = document.querySelector('[data-lab-scroll]')
        if (!scroll) { const i = document.querySelector('[data-lab-index]'); return i ? i.scrollHeight : ${size.height} }
        const stage = scroll.parentElement
        const bar = document.querySelector('[data-lab-bar]')
        document.documentElement.style.setProperty('--cap-h', stage.getBoundingClientRect().height + 'px')
        document.documentElement.classList.add('labCapture')
        return Math.ceil(bar.getBoundingClientRect().height + Math.max(stage.getBoundingClientRect().height, scroll.scrollHeight))
      })()`)
      const height = Math.min(Math.max(total, size.height), MAX_HEIGHT)
      // WebP stops at 16383 pixels a side: a very long page at 2× is taken at 1×
      const scale = height * size.scale > 16000 ? 1 : size.scale
      if (height !== size.height || scale !== size.scale) {
        await page('Emulation.setDeviceMetricsOverride', { width: size.width, height, deviceScaleFactor: scale, mobile: size.width < 600 })
        await sleep(300)
      }
      const { data } = await page('Page.captureScreenshot', { format: 'webp', quality: 82 })
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, Buffer.from(data, 'base64'))
      console.log(`${file.replace(OUT + '/', '')}  ${size.width} × ${height}`)
    }

    for (const id of ids) {
      for (const size of SIZES) {
        if (id === 'index') {
          await shoot('', size, join(OUT, `index-${size.width}.webp`))
          continue
        }
        for (const [hash, name] of TWO_FRAMES.includes(id) ? SCREENS_TWO_FRAMES : SCREENS) {
          await shoot(`#${id}/${hash}`, size, join(OUT, CONCEPTS[id], `${size.width}-${name}.webp`))
        }
        // hovering needs a pointer: wide shots only
        if (size.width >= 600) {
          for (const [hash, name, selector] of HOVERS[id] ?? []) {
            await shoot(`#${id}/${hash}`, size, join(OUT, CONCEPTS[id], `${size.width}-${name}.webp`), selector)
          }
        }
      }
    }
    ws.close()
  } finally {
    chrome.kill()
    await sleep(200)
    rmSync(profile, { recursive: true, force: true })
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
