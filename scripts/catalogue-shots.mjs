#!/usr/bin/env node
// scripts/catalogue-shots.mjs
//
// Level 1's catalogue record (backlog, "Levels: the catalogue record around
// the device"; experiment): intro, playing and discovery, in the Index
// museum light and dark and the Classic museum, at 1440 × 900 and 375 × 812,
// with the dev setting on and off, in docs/catalogue/. At those sizes and at
// 1920, 1280 and 1024 wide it also checks that each leader dot lands on its
// part (the screen hole, the floppy slot) and prints the record's mode.
//
//   node scripts/catalogue-shots.mjs                every set
//   node scripts/catalogue-shots.mjs index-light    only names containing that
//
// Needs the dev server (default http://localhost:5199) and Google Chrome.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'catalogue')
const SIZES = [{ width: 1440, height: 900, scale: 1 }, { width: 375, height: 812, scale: 2 }]
// further sizes, checked but not kept
const CHECK = [{ width: 1920, height: 1080, scale: 1 }, { width: 1280, height: 800, scale: 1 }, { width: 1024, height: 768, scale: 1 }]
const MUSEUMS = [
  { name: 'index-light', museum: 'index', theme: 'light' },
  { name: 'index-dark', museum: 'index', theme: 'dark' },
  { name: 'classic', museum: 'classic' },
]
const only = process.argv.slice(2)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const HIDE_DEV = "addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '[data-dev-panel] { display: none !important }'; document.head.appendChild(st) })"

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'catalogue-shots-'))
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
    mkdirSync(OUT, { recursive: true })

    const shot = async (file) => {
      const { data } = await page('Page.captureScreenshot', { format: 'webp', quality: 85 })
      writeFileSync(join(OUT, file), Buffer.from(data, 'base64'))
    }
    // click a line of the index list, or a button of the classic museum, by its text
    const click = (text) => evaluate(`(() => {
      const t = ${JSON.stringify(text)}
      const el = [...document.querySelectorAll('[data-index-museum] [data-ix-nav]')].find(e => e.textContent.includes(t))
        || [...document.querySelectorAll('button')].find(e => e.textContent.includes(t))
      if (!el) throw new Error('nothing to click: ' + t)
      el.click()
    })()`)
    const until = async (expr, ms = 15000) => {
      for (let t = 0; t < ms; t += 100) { if (await evaluate(expr).catch(() => false)) return; await sleep(100) }
      const seen = await evaluate(`[...document.querySelectorAll('button, [data-ix-nav]')].map(e => e.textContent.trim().slice(0, 30)).join(' | ')`).catch(() => '?')
      throw new Error('timed out waiting for ' + expr + '\n  on the page: ' + seen)
    }

    // where the record went, and whether each dot is on its part
    const check = () => evaluate(`(() => {
      const rec = document.querySelector('[data-catalogue-record]')
      if (!rec) return 'no record'
      const w = rec.parentElement.getBoundingClientRect(), s = w.width / 780
      const parts = { screen: [80, 149, 700, 564], floppy: [411, 674, 607, 686] }
      const dots = [...rec.querySelectorAll('[data-catalogue-dot]')].map(d => {
        const r = d.getBoundingClientRect(), x = (r.left + r.width / 2 - w.left) / s, y = (r.top + r.height / 2 - w.top) / s
        const [x0, y0, x1, y1] = parts[d.dataset.catalogueDot]
        return d.dataset.catalogueDot + (x >= x0 && x <= x1 && y >= y0 && y <= y1 ? ' on' : ' OFF') + ' (' + Math.round(x) + ',' + Math.round(y) + ')'
      })
      return rec.dataset.catalogueRecord + (dots.length ? ': ' + dots.join(', ') : '')
    })()`)
    const errors = []
    await page('Runtime.enable')
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text)
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map(a => a.value ?? a.description).join(' '))
    })

    for (const size of [...SIZES, ...CHECK]) for (const m of MUSEUMS) for (const on of [true, false]) {
      const keep = SIZES.includes(size)
      if (!keep && !on) continue
      const base = `${size.width}-${m.name}-${on ? 'on' : 'off'}`
      if (only.length && !only.some(o => base.includes(o))) continue
      await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: keep ? size.scale : 1, mobile: size.width < 600 })
      for (const visit of ['first', 'revisit']) {
        await page('Page.navigate', { url: 'about:blank' })
        const progress = visit === 'revisit' ? [0, 1] : [0]
        const { identifier } = await page('Page.addScriptToEvaluateOnNewDocument', { source: `try {
          localStorage.clear()
          localStorage.setItem('ux-archaeologist:museum', '${m.museum}')
          ${m.theme === 'light' ? "localStorage.setItem('ux-archaeologist:index-theme', 'light')" : ''}
          ${on ? "localStorage.setItem('ux-archaeologist:catalogue-record', '1')" : ''}
          localStorage.setItem('ux-archaeologist-progress', ${JSON.stringify(JSON.stringify({ completedLevels: progress }))})
          sessionStorage.clear()
          sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1')
        } catch {}; ${HIDE_DEV}` })
        await page('Page.navigate', { url: `${BASE}/` })
        await sleep(1200)
        if (m.museum === 'classic') { await click('Enter the exhibit'); await sleep(1200) }
        await click('The Desktop')
        if (visit === 'first') {
          await until(`!![...document.querySelectorAll('button, [data-ix-nav]')].find(e => /Begin excavation/i.test(e.textContent))`)
          await sleep(1500)
          if (keep) await shot(`${base}-intro.webp`)
          if (on) console.log(`${base} intro: ${await check()}`)
        } else {
          // a usable Continue (Classic keeps it in the HUD, hidden, until the objectives are done)
          await until(`!![...document.querySelectorAll('button, [data-ix-nav]')].find(e => /^\\s*Continue/.test(e.textContent) && e.tabIndex !== -1 && e.getAttribute('aria-hidden') !== 'true')`, 20000)
          await sleep(1200)
          if (keep) await shot(`${base}-playing.webp`)
          if (on) console.log(`${base} playing: ${await check()}`)
          await click('Continue')
          await sleep(1500)
          if (keep) await shot(`${base}-discovery.webp`)
          if (on) console.log(`${base} discovery: ${await check()}`)
        }
        await page('Page.removeScriptToEvaluateOnNewDocument', { identifier })
      }
    }
    console.log(errors.length ? 'console errors:\n  ' + [...new Set(errors)].join('\n  ') : 'no console errors')
    ws.close()
  } finally {
    chrome.kill()
    try { rmSync(profile, { recursive: true, force: true }) } catch { /* in use */ }
  }
}

await main()
