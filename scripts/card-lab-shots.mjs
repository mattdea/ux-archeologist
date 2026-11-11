#!/usr/bin/env node
// scripts/card-lab-shots.mjs
//
// Screenshots of one card lab row (dev server, /card-lab) into
// docs/reference/style-lab/card-lab-<slug>-<width>-<front|back>.webp, at
// 1440 × 1000 and 375 × 812, fronts and backs: the row's heading and its
// cards, nothing else.
//
//   node scripts/card-lab-shots.mjs "Stamp cards"
//   BASE=http://localhost:5173 node scripts/card-lab-shots.mjs "Stamp cards"
//
// Needs the dev server (default http://localhost:5199) and Google Chrome;
// the same DevTools plumbing as scripts/museum-index-shots.mjs.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// The dev panel's corner tab (src/shared/dev/DevPanel.jsx) stays out of every shot
const HIDE_DEV = "addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '[data-dev-panel] { display: none !important }'; document.head.appendChild(st) })"

const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'reference', 'style-lab')
const NAME = process.argv[2] || 'Stamp cards'
const SLUG = NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const SIZES = [
  { width: 1440, height: 1000, scale: 1 },
  { width: 375, height: 812, scale: 2 },
]
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'card-lab-chrome-'))
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
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId
      const timer = setTimeout(() => { waiting.delete(id); reject(new Error(`${method} timed out`)) }, 30000)
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
    const line = (text) => `[...document.querySelectorAll('[data-index-museum] [data-ix-nav]')].find(e => e.textContent.includes(${JSON.stringify(text)}))`

    // no small-screen notice at phone width, no dev tab
    await page('Page.addScriptToEvaluateOnNewDocument', { source: "try { sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1') } catch {}; " + HIDE_DEV })
    for (const size of SIZES) {
      for (const side of ['front', 'back']) {
        await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: size.scale, mobile: size.width < 600 })
        await page('Page.navigate', { url: `${BASE}/card-lab` })
        for (let i = 0; i < 100; i++) {
          const ready = await evaluate(`!![...document.querySelectorAll('h2')].find(h => h.textContent.includes(${JSON.stringify(NAME)})) && document.fonts.ready.then(() => true)`).catch(() => false)
          if (ready) break
          await sleep(100)
        }
        await sleep(800)
        if (side === 'back') { await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent === 'Backs').click()`); await sleep(1000) }
        // The lab scrolls inside its page, so make the window tall enough for
        // the whole row, bring the row under the bar and clip to it
        const sec = `[...document.querySelectorAll('h2')].find(h => h.textContent.includes(${JSON.stringify(NAME)})).closest('section')`
        const tall = await evaluate(`${sec}.offsetHeight`)
        await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: Math.max(size.height, tall + 400), deviceScaleFactor: size.scale, mobile: size.width < 600 })
        await sleep(400)
        await evaluate(`(() => { const s = ${sec}; const p = s.closest('[class*="page"]'); const bar = document.querySelector('[class*="_bar_"]')?.offsetHeight ?? 60; p.scrollTop += s.getBoundingClientRect().top - bar - 10 })()`)
        await sleep(500)
        const box = await evaluate(`(() => { const r = ${sec}.getBoundingClientRect(); return { x: 0, y: r.top, width: innerWidth, height: r.height } })()`)
        const { data } = await page('Page.captureScreenshot', { format: 'webp', quality: 85, clip: { ...box, scale: 1 } })
        const file = join(OUT, `card-lab-${SLUG}-${size.width}-${side}.webp`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, Buffer.from(data, 'base64'))
        console.log(file.split('/docs/')[1])
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
