// scripts/capture-collection-thumbs.mjs
//
// Captures the collection page's thumbnails: each room in its playing
// state, cropped to the device (Level 5: the chat column), no museum UI.
// Drives headless Chrome over the DevTools protocol (Node's built-in
// WebSocket, no dependencies), then converts with cwebp to 480px wide.
//
//   node scripts/capture-collection-thumbs.mjs [baseUrl] [levels…]
//   node scripts/capture-collection-thumbs.mjs http://localhost:8888 0 3
//
// Needs the dev server running, Google Chrome, and cwebp (brew install webp).

import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync, statSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:8888'
const LEVELS = process.argv.length > 3 ? process.argv.slice(3).map(Number) : [0, 1, 2, 3, 4, 5]
const OUT = new URL('../assets/collection/', import.meta.url).pathname
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9333
const YEARS = ['1979', '1984', '1995', '2007', '2016', '2023']
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// What each room does after "Begin excavation", run in the page; returns
// the rect to crop (CSS px)
const PLAY = String.raw`async (n) => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))
  const click = (t) => [...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith(t))?.click()
  const key = (k) => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))
  const type = async (s) => { for (const c of s) { key(c); await sleep(30) } key('Enter') }
  for (let i = 0; i < 40 && !document.querySelector('button'); i++) await sleep(250)
  await sleep(500)
  click('Enter the exhibit'); await sleep(1800)
  click(${JSON.stringify(YEARS)}[n]); await sleep(2500)
  click('Begin excavation')
  if (n === 0) {                       // log in: the motd and "You have mail."
    await sleep(6000)
    document.querySelector('input[aria-label="Terminal input"]')?.focus()
    await type('kerry'); await sleep(200); await type('x'); await sleep(3000)
  } else if (n === 1) await sleep(10000)   // boot to the desktop
  else if (n === 2) await sleep(12000)     // the first page loads over dial-up
  else if (n === 3) await sleep(2500)      // lock screen
  else if (n === 4) await sleep(4500)      // the feed
  else if (n === 5) {                      // ask the first suggestion
    await sleep(2500)
    click('What is this place?'); await sleep(9000)
  }
  // let the museum HUD finish sliding in, then crop to the artifact only
  await sleep(800)
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } }
  if (n === 5) {
    const parts = ['messageList', 'bottomBar'].map(c => document.querySelector('[class*="' + c + '"]')).filter(Boolean).map(box)
    const x = Math.min(...parts.map(p => p.x)), y = Math.min(...parts.map(p => p.y))
    const r = Math.max(...parts.map(p => p.x + p.w)), b = Math.max(...parts.map(p => p.y + p.h))
    return { x, y, w: r - x, h: b - y }
  }
  const wrap = [...document.querySelectorAll('[class*="artifactZone"] [style]')].find(e => e.style.left && e.style.top)
  return box(wrap)
}`

async function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  let id = 0
  const pending = new Map()
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data)
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  }
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id
    pending.set(i, (msg) => (msg.error ? rej(new Error(`${method}: ${msg.error.message}`)) : res(msg.result)))
    ws.send(JSON.stringify({ id: i, method, params }))
  })
  return { send, close: () => ws.close() }
}

const profile = mkdtempSync(join(tmpdir(), 'thumbs-'))
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', 'about:blank',
], { stdio: 'ignore' })

try {
  let version
  for (let i = 0; i < 50 && !version; i++) {
    await sleep(200)
    version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(r => r.json()).catch(() => null)
  }
  if (!version) throw new Error('Chrome did not start')
  mkdirSync(OUT, { recursive: true })

  for (const n of LEVELS) {
    const target = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json())
    const page = await cdp(target.webSocketDebuggerUrl)
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false })
    await page.send('Page.enable')
    await page.send('Page.navigate', { url: BASE })
    await sleep(1500)
    const { result, exceptionDetails } = await page.send('Runtime.evaluate', { expression: `(${PLAY})(${n})`, awaitPromise: true, returnByValue: true })
    const r = result.value
    if (!r || !(r.w > 0 && r.h > 0)) throw new Error(`level ${n}: no artifact to crop (${exceptionDetails?.exception?.description ?? JSON.stringify(r)})`)
    const shot = await page.send('Page.captureScreenshot', { format: 'png', clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } })
    const png = join(profile, `level${n}.png`)
    writeFileSync(png, Buffer.from(shot.data, 'base64'))
    const webp = join(OUT, `level${n}.webp`)
    execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', '480', '0', png, '-o', webp])
    console.log(`level${n}.webp  ${Math.round(r.w)}x${Math.round(r.h)} css px  ${Math.round(statSync(webp).size / 1024)} KB`)
    page.close()
    await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`).catch(() => {})
  }
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  chrome.kill()
  await new Promise(r => (chrome.exitCode !== null ? r() : chrome.once('exit', r)))
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
}
