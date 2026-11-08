// src/audio/sfx.js
//
// Era sound effects, synthesised with Web Audio so the repo carries no extra
// files (the one recording, the Macintosh chime, already lives in assets/).
// Everything is quiet by design: these are the sounds of a room, not a game.
//
// Browsers only let audio start inside a user gesture. The context is
// created and resumed on the first pointerdown/keydown anywhere, and every
// level's sounds follow a click (Begin excavation, a key, a tap), so by the
// time a timer wants to play something the context is already running.
//
//   key()               terminal keyboard clack (slightly different each time)
//   bell()              VT100 bell
//   crtOn()             CRT power-on thump + warming hiss
//   chime(src)          play a recording (Macintosh startup chime)
//   floppy()            400K drive seeking; returns stop()
//   modem()             28.8k handshake: dial, answer tone, warble, hiss; returns stop()
//   pop()               Instagram like
//   send() / receive()  chat: message sent / reply finished

import macChimeSrc from '../../assets/mac-chime.mp3'

let ctx = null
let master = null

function ensure() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) {
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.28
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

if (typeof document !== 'undefined') {
  const unlock = () => ensure()
  document.addEventListener('pointerdown', unlock, { capture: true, passive: true })
  document.addEventListener('keydown', unlock, { capture: true, passive: true })
}

// ── building blocks ────────────────────────────────────────────────

const now = () => ctx.currentTime

/** Gain envelope: attack to `peak`, then exponential decay to silence. */
function env(peak, attack, decay, at = now()) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(peak, at + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay)
  g.connect(master)
  return g
}

function tone(type, freq, peak, attack, decay, at = now(), dest) {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, at)
  const g = env(peak, attack, decay, at)
  if (dest) { g.disconnect(); g.connect(dest) }
  o.connect(g)
  o.start(at)
  o.stop(at + attack + decay + 0.05)
  return o
}

let noiseBuf = null
function noise() {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const s = ctx.createBufferSource()
  s.buffer = noiseBuf
  s.loop = true
  return s
}

function filter(type, freq, q = 1) {
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  return f
}

const jitter = (v, pct) => v * (1 + (Math.random() * 2 - 1) * pct)

// ── 1971: VT100 ────────────────────────────────────────────────────

// The VT100 made both sounds with one small speaker in the keyboard, driven
// by pulses from the terminal: a single pulse is the keyclick (SET-UP could
// turn it off), about 200 pulses in a row are the bell. The speaker's RC
// circuit rings near 780 Hz, so both have that colour.
const VT_SPEAKER_HZ = 780

export function key() {
  if (!ensure()) return
  const t = now()
  // One pulse through the ringing speaker: a dry electronic tick.
  const o = ctx.createOscillator()
  o.type = 'square'
  o.frequency.value = VT_SPEAKER_HZ
  const ring = filter('bandpass', VT_SPEAKER_HZ, 6)
  o.connect(ring).connect(env(0.5, 0.0008, 0.012, t))
  o.start(t); o.stop(t + 0.03)
}

export function bell() {
  if (!ensure()) return
  // ~200 pulses at the speaker's frequency ≈ a quarter-second beep.
  const t = now()
  const o = ctx.createOscillator()
  o.type = 'square'
  o.frequency.value = VT_SPEAKER_HZ
  const ring = filter('bandpass', VT_SPEAKER_HZ, 3)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.004)
  g.gain.setValueAtTime(0.16, t + 0.24)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.27)
  g.connect(master)
  o.connect(ring).connect(g)
  o.start(t); o.stop(t + 0.3)
}

export function crtOn() {
  if (!ensure()) return
  const t = now()
  tone('sine', 55, 0.5, 0.01, 0.35, t)                   // degauss thump
  const n = noise()
  const hp = filter('highpass', 4000)
  n.connect(hp).connect(env(0.05, 0.3, 0.9, t))          // tube warming hiss
  n.start(t); n.stop(t + 1.4)
}

// ── 1984: Macintosh ────────────────────────────────────────────────

export function chime(src = macChimeSrc, volume = 0.22) {
  try {
    const a = new Audio(src)
    a.volume = volume
    a.play().catch(() => {})
  } catch { /* no audio */ }
}

/** 400K floppy reading: the Sony mechanism's motor whir with the head
 *  stepping underneath it — a soft, slightly uneven purr, not a crackle. */
export function floppy() {
  if (!ensure()) return () => {}
  const t = now()
  const bus = ctx.createGain()
  bus.gain.setValueAtTime(0.0001, t)
  bus.gain.exponentialRampToValueAtTime(0.6, t + 0.12)
  bus.connect(master)

  // Motor: a low hum with its harmonics, lightly wobbling
  const hum = ctx.createOscillator()
  hum.type = 'sawtooth'
  hum.frequency.value = 98
  const wob = ctx.createOscillator()
  wob.frequency.value = 6.5
  const wobG = ctx.createGain(); wobG.gain.value = 3
  wob.connect(wobG).connect(hum.frequency)
  const humG = ctx.createGain(); humG.gain.value = 0.09
  hum.connect(filter('lowpass', 420)).connect(humG).connect(bus)
  hum.start(t); wob.start(t)

  // Airflow: band-limited hiss under the hum
  const air = noise()
  const airG = ctx.createGain(); airG.gain.value = 0.035
  air.connect(filter('bandpass', 1400, 0.8)).connect(airG).connect(bus)
  air.start(t)

  // Head steps: soft, low thuds in short runs, like the drive seeking a track
  let alive = true
  let timer = null
  const step = () => {
    if (!alive) return
    const at = now()
    tone('sine', jitter(140, 0.2), 0.12, 0.003, 0.05, at, bus)
    timer = setTimeout(step, Math.random() < 0.3 ? jitter(260, 0.4) : jitter(70, 0.3))
  }
  timer = setTimeout(step, 120)

  return () => {
    alive = false
    clearTimeout(timer)
    const at = now()
    bus.gain.cancelScheduledValues(at)
    bus.gain.setValueAtTime(bus.gain.value, at)
    bus.gain.exponentialRampToValueAtTime(0.0001, at + 0.18)
    hum.stop(at + 0.2); wob.stop(at + 0.2); air.stop(at + 0.2)
  }
}

// ── 1995: 28.8k modem ──────────────────────────────────────────────

export function modem() {
  if (!ensure()) return () => {}
  const t0 = now()
  const bus = ctx.createGain()
  bus.gain.value = 0.55
  bus.connect(master)
  const at = (dt) => t0 + dt

  // Dial: DTMF pairs
  const dtmf = [[697, 1209], [770, 1336], [852, 1477], [697, 1336], [941, 1336], [770, 1209], [852, 1336]]
  dtmf.forEach(([a, b], i) => {
    const s = at(0.15 + i * 0.11)
    tone('sine', a, 0.12, 0.005, 0.07, s, bus)
    tone('sine', b, 0.12, 0.005, 0.07, s, bus)
  })
  // Answer tone (2100 Hz), then the V.34 warble, then the training hiss
  tone('sine', 2100, 0.1, 0.02, 0.55, at(1.2), bus)
  const w = ctx.createOscillator()
  w.type = 'square'
  w.frequency.setValueAtTime(1200, at(1.85))
  w.frequency.setValueAtTime(2400, at(1.95))
  w.frequency.setValueAtTime(1200, at(2.05))
  w.frequency.setValueAtTime(2400, at(2.15))
  const wg = ctx.createGain()
  wg.gain.setValueAtTime(0.0001, at(1.85))
  wg.gain.exponentialRampToValueAtTime(0.07, at(1.87))
  wg.gain.exponentialRampToValueAtTime(0.0001, at(2.3))
  w.connect(wg).connect(bus)
  w.start(at(1.85)); w.stop(at(2.35))

  const n = noise()
  const bp = filter('bandpass', 1200, 0.7)
  bp.frequency.setValueAtTime(900, at(2.3))
  bp.frequency.exponentialRampToValueAtTime(3200, at(3.4))
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.0001, at(2.3))
  ng.gain.exponentialRampToValueAtTime(0.16, at(2.5))
  ng.gain.setValueAtTime(0.16, at(3.3))
  ng.gain.exponentialRampToValueAtTime(0.0001, at(3.7))
  n.connect(bp).connect(ng).connect(bus)
  n.start(at(2.3)); n.stop(at(3.8))

  return () => {
    const s = now()
    bus.gain.cancelScheduledValues(s)
    bus.gain.setValueAtTime(bus.gain.value, s)
    bus.gain.exponentialRampToValueAtTime(0.0001, s + 0.1)
  }
}

// ── 2016: Instagram ────────────────────────────────────────────────

export function pop() {
  if (!ensure()) return
  const t = now()
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(520, t)
  o.frequency.exponentialRampToValueAtTime(980, t + 0.05)
  o.connect(env(0.22, 0.004, 0.09, t))
  o.start(t); o.stop(t + 0.15)
}

// ── 2023: chat ─────────────────────────────────────────────────────

export function send() {
  if (!ensure()) return
  tone('sine', 1760, 0.06, 0.003, 0.05)
}

export function receive() {
  if (!ensure()) return
  const t = now()
  tone('sine', 660, 0.07, 0.01, 0.16, t)
  tone('sine', 880, 0.07, 0.01, 0.2, t + 0.09)
}
