#!/usr/bin/env node
// scripts/index-levels-shots.mjs
//
// Every level in the index museum, in intro, playing and discovery, light
// and dark, at 1440 × 900 and 375 × 812, in each level layout (backlog,
// "Index museum: the device centred, the list in the corners"; the dev
// setting Index > level layout). Also the Classic museum, for comparing.
// Into docs/museum-index/levels/<layout>-<theme>-<width>-level-<n>-<state>.webp
// (Classic: classic-<width>-level-<n>-<state>.webp), with one sheet per
// level and theme in docs/museum-index/levels/sheets/ when both layouts
// are taken: side above, corners below.
//
//   node scripts/index-levels-shots.mjs                     everything
//   node scripts/index-levels-shots.mjs level-1 corners     only names containing all of these
//   LAYOUTS=side THEMES=light,classic STATES=playing SIZES=1440 node scripts/index-levels-shots.mjs
//
// Needs the dev server (default http://localhost:5199) and Google Chrome.
// Intro shots start with nothing found; playing and discovery are a revisit
// with every room found, so the boot plays and Continue is there.
import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIDE_DEV = "addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '[data-dev-panel] { display: none !important }'; document.head.appendChild(st) })"
const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'museum-index', 'levels')

const ROOMS = ['The Command Line', 'The Desktop', 'The Hyperlink', 'The Touchscreen', 'The Feed', 'The Conversation']
const list = (v, d) => (v ? v.split(',') : d)
const LAYOUTS = list(process.env.LAYOUTS, ['side', 'corners'])
const THEMES = list(process.env.THEMES, ['light', 'dark'])
const STATES = list(process.env.STATES, ['intro', 'playing', 'discovery'])
// SIZES=1440,375 (the defaults) or any WIDTHxHEIGHT, e.g. SIZES=1024x768
const KNOWN = { 1440: { width: 1440, height: 900, scale: 1 }, 375: { width: 375, height: 812, scale: 2 } }
const SIZES = list(process.env.SIZES, ['1440', '375']).map(v => KNOWN[v] ?? (([w, h]) => ({ width: +w, height: +h, scale: 1 }))(v.split('x')))
const only = process.argv.slice(2)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'index-levels-'))
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  const errors = []
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
      if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description?.split('\n')[0] || msg.params.exceptionDetails.text)
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200))
      const w = waiting.get(msg.id); if (!w) return
      waiting.delete(msg.id)
      msg.error ? w.reject(new Error(msg.error.message)) : w.resolve(msg.result)
    }
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId
      const timer = setTimeout(() => { waiting.delete(id); reject(new Error(`${method} timed out`)) }, 30000)
      waiting.set(id, { resolve: (v) => { clearTimeout(timer); resolve(v) }, reject: (e) => { clearTimeout(timer); reject(e) } })
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
    await page('Runtime.enable')

    // a usable control by its text: the index's lines, or Classic's buttons
    // (Classic keeps Continue in the HUD, hidden and out of the tab order, until it can be used)
    const find = (text) => `[...document.querySelectorAll('[data-index-museum] [data-ix-nav], button')].find(e => e.textContent.includes(${JSON.stringify(text)}) && e.tabIndex !== -1 && e.getAttribute('aria-hidden') !== 'true' && e.getClientRects().length)`
    const click = async (text, ms = 15000) => {
      for (let t = 0; t < ms; t += 100) { if (await evaluate(`!!(${find(text)})`)) break; await sleep(100) }
      await evaluate(`(() => { const el = ${find(text)}; if (!el) throw new Error('nothing to click: ' + ${JSON.stringify(text)}); el.click() })()`)
    }

    const sets = [
      ...LAYOUTS.flatMap(layout => THEMES.filter(t => t !== 'classic').map(theme => ({ museum: 'index', layout, theme, name: `${layout}-${theme}` }))),
      ...(THEMES.includes('classic') ? [{ museum: 'classic', name: 'classic' }] : []),
    ]
    for (const size of SIZES) for (const set of sets) for (const [n, room] of ROOMS.entries()) for (const state of STATES) {
      const name = `${set.name}-${size.width}-level-${n}-${state}`
      if (only.length && !only.every(o => name.includes(o))) continue
      await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: size.scale, mobile: size.width < 600 })
      await page('Page.navigate', { url: 'about:blank' })
      const found = state === 'intro' ? [] : [0, 1, 2, 3, 4, 5]
      const { identifier } = await page('Page.addScriptToEvaluateOnNewDocument', { source: `try {
        localStorage.clear()
        localStorage.setItem('ux-archaeologist:museum', '${set.museum}')
        ${set.theme === 'light' ? "localStorage.setItem('ux-archaeologist:index-theme', 'light')" : ''}
        ${set.layout ? `localStorage.setItem('ux-archaeologist:index-level-layout', '${set.layout}')` : ''}
        localStorage.setItem('ux-archaeologist-progress', ${JSON.stringify(JSON.stringify({ completedLevels: found }))})
        sessionStorage.clear()
        sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1')
      } catch {}; ${HIDE_DEV}` })
      await page('Page.navigate', { url: `${BASE}/` })
      await sleep(1200)
      try {
        if (set.museum === 'classic') { await click('Enter the exhibit'); await sleep(1200) }
        await click(room)
        if (state === 'intro') {
          await sleep(300)
          for (let t = 0; t < 15000 && !(await evaluate(`!!(${find('Begin excavation')})`)); t += 100) await sleep(100)
          await sleep(1600)
        } else {
          for (let t = 0; t < 25000 && !(await evaluate(`!!(${find('Continue')})`)); t += 100) await sleep(100)
          await sleep(1200)
          if (state === 'discovery') { await click('Continue'); await sleep(1600) }
        }
        await evaluate('document.activeElement?.blur?.(); 1')
        await sleep(200)
        const { data } = await page('Page.captureScreenshot', { format: 'webp', quality: 80 })
        mkdirSync(OUT, { recursive: true })
        writeFileSync(join(OUT, `${name}.webp`), Buffer.from(data, 'base64'))
        console.log(name)
      } catch (e) {
        console.log(`${name}: FAILED ${e.message.split('\n')[0]}`)
      }
      await page('Page.removeScriptToEvaluateOnNewDocument', { identifier })
    }
    console.log(errors.length ? 'console errors:\n  ' + [...new Set(errors)].join('\n  ') : 'no console errors')
    ws.close()
  } finally {
    chrome.kill()
    try { rmSync(profile, { recursive: true, force: true }) } catch { /* in use */ }
  }
}

await main()

// Sheets: per size, theme and level, the three states side by side, side layout above, corners below
if (LAYOUTS.includes('side') && LAYOUTS.includes('corners')) {
  mkdirSync(join(OUT, 'sheets'), { recursive: true })
  for (const size of SIZES) for (const theme of THEMES.filter(t => t !== 'classic')) for (const n of ROOMS.keys()) {
    const row = (layout) => STATES.map(st => join(OUT, `${layout}-${theme}-${size.width}-level-${n}-${st}.webp`))
    const files = [...row('side'), ...row('corners')]
    if (!files.every(existsSync)) continue
    const h = size.width === 1440 ? 'x450' : 'x600'
    const tmp = join(OUT, 'sheets', '_row')
    execFileSync('magick', [...row('side'), '-resize', h, '+append', `${tmp}-a.png`])
    execFileSync('magick', [...row('corners'), '-resize', h, '+append', `${tmp}-b.png`])
    execFileSync('magick', [`${tmp}-a.png`, `${tmp}-b.png`, '-background', '#888', '-splice', '0x12', '-append', '-quality', '78', join(OUT, 'sheets', `${theme}-${size.width}-level-${n}.webp`)])
    rmSync(`${tmp}-a.png`); rmSync(`${tmp}-b.png`)
  }
}
