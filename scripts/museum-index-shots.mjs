#!/usr/bin/env node
// scripts/museum-index-shots.mjs
//
// Screenshots of the index museum (backlog, "the index museum") into
// docs/museum-index/<width>-<name>.webp, at 1440 × 900 and 375 × 812: the
// title, timeline, collection, About, every room's intro, and a room
// playing, with its hint, and at its discovery, in the light theme; then
// some of them again in the default dark theme (names starting "dark-").
//
//   node scripts/museum-index-shots.mjs              all shots
//   node scripts/museum-index-shots.mjs level-1      only names containing "level-1"
//   BASE=http://localhost:5173 node scripts/…        another dev server
//
// Needs the dev server (default http://localhost:5199, the "vite" entry in
// .claude/launch.json) and Google Chrome; drives headless Chrome over the
// DevTools protocol with Node's own WebSocket (Node 22+), as
// scripts/style-lab-shots.mjs does. Navigation is state-based, so each shot
// starts at the title and clicks its way there.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BASE || 'http://localhost:5199'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'museum-index')

const ROOMS = ['The Command Line', 'The Desktop', 'The Hyperlink', 'The Touchscreen', 'The Feed', 'The Conversation']
const SOME = [0, 1, 2, 3]   // rooms found, for most shots

// [name, rooms found, steps]. A step: ['click', text] clicks the list line
// containing text; ['hover', text] puts the pointer on it; ['wait', ms].
const SHOTS = [
  ['title', SOME, []],
  ['about', SOME, [['click', 'About']]],
  ['timeline', SOME, [['click', 'Enter the exhibit'], ['wait', 900]]],
  ['timeline-hover', SOME, [['click', 'Enter the exhibit'], ['wait', 900], ['hover', 'The Hyperlink']], 'wide'],
  ['collection', SOME, [['click', 'Collection'], ['wait', 900]]],
  ...ROOMS.map((room, n) => [`level-${n}-intro`, [], [['click', room], ['wait', 2500]]]),
  ['level-1-playing', [1], [['click', 'The Desktop'], ['wait', 7000]]],
  ['level-1-discovery', [1], [['click', 'The Desktop'], ['wait', 7000], ['click', 'Continue'], ['wait', 600]]],
  ['level-3-playing', [3], [['click', 'The Touchscreen'], ['wait', 3500]]],
  ['level-2-hint', [], [['click', 'The Hyperlink'], ['wait', 2000], ['click', 'Begin excavation'], ['wait', 16000]]],
  // the dark theme, the default (the other shots are taken in light)
  ['dark-title', SOME, []],
  ['dark-collection', SOME, [['click', 'Collection'], ['wait', 900]]],
  ['dark-level-0-intro', [], [['click', 'The Command Line'], ['wait', 2500]]],
  ['dark-level-1-discovery', [1], [['click', 'The Desktop'], ['wait', 7000], ['click', 'Continue'], ['wait', 600]]],
  ['dark-level-4-playing', [], [['click', 'The Feed'], ['wait', 2000], ['click', 'Begin excavation'], ['wait', 3000]]],
  ['dark-level-5-playing', [], [['click', 'The Conversation'], ['wait', 2000], ['click', 'Begin excavation'], ['wait', 3000]]],
]
const SIZES = [
  { width: 1440, height: 900, scale: 1 },
  { width: 375, height: 812, scale: 2 },
]

const only = process.argv.slice(2)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'museum-index-chrome-'))
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

    for (const size of SIZES) {
      for (const [name, found, steps, only1440] of SHOTS) {
        if (only.length && !only.some(o => name.includes(o))) continue
        if (only1440 && size.width < 600) continue
        await page('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: size.scale, mobile: size.width < 600 })
        await page('Page.navigate', { url: 'about:blank' })
        // Index museum on, this shot's progress, no small-screen lines, no dev looks
        await evaluate('1')
        const setup = `try {
          localStorage.clear()
          localStorage.setItem('ux-archaeologist:museum', 'index')
          localStorage.setItem('ux-archaeologist-progress', ${JSON.stringify(JSON.stringify({ completedLevels: found }))})
          ${name.startsWith('dark-') ? '' : "localStorage.setItem('ux-archaeologist:index-theme', 'light')"}
          sessionStorage.setItem('ux-archaeologist:small-screen-dismissed', '1')
        } catch {}`
        const { identifier } = await page('Page.addScriptToEvaluateOnNewDocument', { source: setup })
        await page('Page.navigate', { url: `${BASE}/` })
        for (let i = 0; i < 100; i++) {
          const ready = await evaluate(`!!document.querySelector('[data-index-museum] nav') && document.fonts.ready.then(() => true)`).catch(() => false)
          if (ready) break
          await sleep(100)
        }
        await sleep(600)
        for (const [kind, arg] of steps) {
          if (kind === 'wait') { await sleep(arg); continue }
          for (let i = 0; i < 50 && !(await evaluate(`!!${line(arg)}`)); i++) await sleep(100)
          if (kind === 'click') await evaluate(`${line(arg)}.click()`)
          if (kind === 'hover') {
            const at = await evaluate(`(() => { const r = ${line(arg)}.getBoundingClientRect(); return [r.left + 80, r.top + r.height / 2] })()`)
            await page('Input.dispatchMouseEvent', { type: 'mouseMoved', x: at[0], y: at[1] })
          }
          await sleep(400)
        }
        // Blur whatever has focus, so the shot shows the list at rest
        await evaluate('document.activeElement?.blur?.(); 1')
        await sleep(300)
        const { data } = await page('Page.captureScreenshot', { format: 'webp', quality: 82 })
        const file = join(OUT, `${size.width}-${name}.webp`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, Buffer.from(data, 'base64'))
        console.log(`${size.width}-${name}.webp`)
        await page('Page.removeScriptToEvaluateOnNewDocument', { identifier })
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
