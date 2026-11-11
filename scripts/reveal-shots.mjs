#!/usr/bin/env node
// scripts/reveal-shots.mjs
//
// Frames of the stipple reveal on Level 1 (backlog, "Levels: the device as
// a drawing when you arrive and leave"; experiment), kept as one strip per
// set, frames side by side, in
// docs/reveal/strips/<width>-<museum>-<on|off>-<arrive|revisit|leave>.webp, at
// 1440 × 900 and 375 × 812, in the Index museum light and dark and the
// Classic museum, with the dev setting on and off.
//
//   arrive  a first visit: the intro, then frames from Begin excavation
//           through the dissolve and into the boot
//   leave   a revisit with the level done: the dissolve on load, then
//           frames from Continue as the drawing settles back
//
//   node scripts/reveal-shots.mjs                every set
//   node scripts/reveal-shots.mjs index-light    only names containing that
//
// Also prints the frame rate during the dissolve. Needs the dev server
// (default http://localhost:5199) and Google Chrome.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'reveal')
const SIZES = [{ width: 1440, height: 900, scale: 1 }, { width: 375, height: 812, scale: 2 }]
const MUSEUMS = [
  { name: 'index-light', museum: 'index', theme: 'light' },
  { name: 'index-dark', museum: 'index', theme: 'dark' },
  { name: 'classic', museum: 'classic' },
]
// ms after the click at which to take a frame
const ARRIVE_AT = [0, 200, 400, 600, 900, 2500]
const LEAVE_AT = [0, 250, 450, 650, 1100]
const only = process.argv.slice(2)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const HIDE_DEV = "addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '[data-dev-panel] { display: none !important }'; document.head.appendChild(st) })"

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'reveal-shots-'))
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
    // frames at the given times after `start` runs; returns the frame rate
    const frames = async (base, at, start) => {
      await evaluate(`window.__f = 0; (function f(){ window.__f++; requestAnimationFrame(f) })(); 1`)
      const t0 = Date.now()
      await start()
      for (const [i, ms] of at.entries()) {
        const wait = t0 + ms - Date.now()
        if (wait > 0) await sleep(wait)
        await shot(`${base}-${i}-${String(Date.now() - t0).padStart(4, '0')}ms.webp`)
      }
      return Math.round((await evaluate('window.__f')) / ((Date.now() - t0) / 1000))
    }

    for (const size of SIZES) for (const m of MUSEUMS) for (const on of [true, false]) for (const kind of ['arrive', 'leave']) {
      const base = `${size.width}-${m.name}-${on ? 'on' : 'off'}-${kind}`
      if (only.length && !only.some(o => base.includes(o))) continue
      for (const f of readdirSync(OUT).filter(f => f.startsWith(base + '-'))) rmSync(join(OUT, f))
      await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: size.scale, mobile: size.width < 600 })
      await page('Page.navigate', { url: 'about:blank' })
      const progress = kind === 'leave' ? [0, 1] : [0]
      const { identifier } = await page('Page.addScriptToEvaluateOnNewDocument', { source: `try {
        localStorage.clear()
        localStorage.setItem('ux-archaeologist:museum', '${m.museum}')
        ${m.theme === 'light' ? "localStorage.setItem('ux-archaeologist:index-theme', 'light')" : ''}
        ${on ? "localStorage.setItem('ux-archaeologist:stipple-reveal', '1')" : ''}
        localStorage.setItem('ux-archaeologist-progress', ${JSON.stringify(JSON.stringify({ completedLevels: progress }))})
        sessionStorage.clear()
        sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1')
      } catch {}; ${HIDE_DEV}` })
      await page('Page.navigate', { url: `${BASE}/` })
      await sleep(1200)
      if (m.museum === 'classic') { await click('Enter the exhibit'); await sleep(1200) }
      if (kind === 'arrive') {
        await click('The Desktop')
        await until(`!!document.querySelector('[data-reveal-device]')`)
        await sleep(1800)
        const fps = await frames(base, ARRIVE_AT, () => click('Begin excavation'))
        console.log(`${base}: ${fps} fps`)
      } else {
        // a revisit: the dissolve on load, the boot, then Continue
        const fps = await frames(base.replace('leave', 'revisit'), [300, 700, 1200], () => click('The Desktop'))
        // a Continue that can be used (Classic keeps its button in the HUD,
        // hidden and out of the tab order, until the objectives are done)
        await until(`!![...document.querySelectorAll('button, [data-ix-nav]')].find(e => /^\\s*Continue/.test(e.textContent) && e.tabIndex !== -1 && e.getAttribute('aria-hidden') !== 'true')`, 20000)
        await sleep(500)
        await frames(base, LEAVE_AT, () => click('Continue'))
        console.log(`${base}: ${fps} fps (revisit)`)
      }
      await page('Page.removeScriptToEvaluateOnNewDocument', { identifier })
    }
    ws.close()
  } finally {
    chrome.kill()
    try { rmSync(profile, { recursive: true, force: true }) } catch { /* in use */ }
  }
}

await main()
mkdirSync(join(OUT, 'strips'), { recursive: true })
// a strip per set, frames side by side, for looking at quickly
for (const f of [...new Set(readdirSync(OUT).filter(f => /-\d-\d+ms\.webp$/.test(f)).map(f => f.replace(/-\d-\d+ms\.webp$/, '')))]) {
  const parts = readdirSync(OUT).filter(x => x.startsWith(f + '-') && /-\d-\d+ms\.webp$/.test(x)).sort().map(x => join(OUT, x))
  execFileSync('magick', [...parts, '-resize', 'x450', '+append', '-quality', '80', join(OUT, 'strips', `${f}.webp`)], { stdio: 'ignore' })
  parts.forEach(x => rmSync(x))   // the strips are what's kept
}
