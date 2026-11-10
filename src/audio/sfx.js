// src/audio/sfx.js
//
// Era sound effects, synthesised with Web Audio so the repo carries no extra
// files (the dial-up handshake is the one recording played from here).
// Everything is quiet by design: these are the sounds of a room, not a game.
//
// Browsers only let audio start inside a user gesture. The context is
// created and resumed on the first pointerdown/keydown anywhere, and every
// level's sounds follow a click (Begin excavation, a key, a tap), so by the
// time a timer wants to play something the context is already running.
//
//   key()               terminal keyboard clack (slightly different each time)
//   bell()              VT100 bell
//   startupBeep()       1984 Macintosh startup beep (600 Hz square wave)
//   beep()              Macintosh system (alert) beep
//   dialup()            real dial-up recording if assets/web/dialup.* exists; returns stop()
//   pop()               Instagram like
//   send() / receive()  chat: message sent / reply finished

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

function filter(type, freq, q = 1) {
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  return f
}


// ── 1979: VT100 ────────────────────────────────────────────────────

// The VT100 made both sounds with one small speaker in the keyboard, driven
// by pulses from the terminal: a single pulse is the keyclick (SET-UP could
// turn it off), about 200 pulses in a row are the bell (VT100 Technical
// Manual §4.4.3). One pulse per status byte, and a byte takes 160 clock
// periods of 7.945 µs = 1.271 ms, so the bell buzzes near 787 Hz. Derived
// from the manual's timing, not measured.
const VT_SPEAKER_HZ = 787

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

// ── 1984: Macintosh ────────────────────────────────────────────────

/** System beep: a short square-wave tone from the Mac's speaker, played
 *  when an alert appears. */
// The Control Panel's speaker volume, 0–7 (3 to start). At 0 the Mac
// doesn't beep: it flashes the menu bar instead (MenuBar listens for
// 'mac-flash-menubar').
let macVolume = 3
export function setMacVolume(v) { macVolume = v }

export function beep() {
  if (macVolume === 0) {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('mac-flash-menubar'))
    return
  }
  if (!ensure()) return
  tone('square', 880, 0.08 * macVolume / 3, 0.004, 0.17)
}

/** Startup beep: the 128K, 512K and Plus played a plain 600 Hz square-wave
 *  beep at power-on (the chord arrived with the Macintosh II in 1987). It
 *  holds for about 1 s as the boot begins, then fades over the last 200 ms.
 *  The level is reconstructed (beep()'s peak). */
const STARTUP_BEEP_S = 1
export function startupBeep() {
  if (!ensure()) return
  const t = now()
  const o = ctx.createOscillator()
  o.type = 'square'
  o.frequency.value = 600
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.004)
  g.gain.setValueAtTime(0.08, t + STARTUP_BEEP_S - 0.2)
  g.gain.exponentialRampToValueAtTime(0.0001, t + STARTUP_BEEP_S)
  g.connect(master)
  o.connect(g)
  o.start(t); o.stop(t + STARTUP_BEEP_S + 0.05)
}

// ── 1995: dial-up ──────────────────────────────────────────────────
// A real recording only. Drop one in assets/web/ named dialup.(mp3|ogg|wav|m4a)
// and it plays under the first page load of the session; with no file this
// is silent. (A synthesised handshake was tried and sounded wrong.)
const DIALUP = Object.values(import.meta.glob('../../assets/web/dialup.{mp3,ogg,wav,m4a}', {
  eager: true, query: '?url', import: 'default',
}))[0] || null

let dialupAudio = null
export function dialup(volume = 0.25) {
  if (!DIALUP) return () => {}
  try {
    dialupAudio?.pause()
    dialupAudio = new Audio(DIALUP)
    dialupAudio.volume = volume
    dialupAudio.play().catch(() => {})
  } catch { /* no audio */ }
  return () => dialupAudio?.pause()
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
