// src/components/terminal/useTerminal.js
//
// Owns all terminal state and logic for Level 0 (1979: a VT100 on Seventh
// Edition Unix at Bell Labs). The year follows the VT100 (Aug 1978).
//
// Every date in the level falls in one week: Tue 16 / Wed 17 Jan 1979
// (1 Jan 1979 was a Monday). Sources: V7 "Setting up Unix" (boot), and V7
// login.c / mail.c on TUHS (prompts, "You have mail.", the From line).
// Returns { phase, history, currentInput, responding, streamingLine, onKeyDown }
//
// Phase progression: 'booting' → 'login' → 'password' → 'shell'

import { useState, useCallback, useRef, useEffect } from 'react'
import * as sfx from '../../audio/sfx'

// ── Command registry ──────────────────────────────────────────────────────────
const COMMANDS = {
  ls: [
    'notes.txt    mail    readme',
  ],

  'cat notes.txt': [
    // Seventh Edition manual, title page dated January 1979 (Thompson and
    // Ritchie); V7 released to licensees Jan 1979; Bourne's sh is V7's
    // shell (all high: TUHS V7 tree, Wikipedia "Version 7 Unix"). The
    // note itself is reconstructed.
    'From: dmr',
    'To: unix-users',
    'Date: Tue Jan 16 09:04 EST 1979',
    'Re: the Seventh Edition',
    '',
    'The Seventh Edition manual is finished, and tapes of the',
    'system go out to licensees this month. The shell is now',
    "Steve Bourne's sh. If a manual page doesn't match what a",
    'command does, tell one of us before the next printing.',
    '',
    '- Dennis',
  ],

  'cat readme': [
    'UNIX Time-Sharing System',
    'Bell Telephone Laboratories',
    '',
    'This system is for authorized users only.',
    "Type 'ls' to list files in your directory.",
    "Type 'man [command]' for documentation.",
    "Type 'mail' to read messages.",
  ],

  // 'cat mail' intentionally absent — mail is a program, not a file.
  // Attempting it reveals the distinction (the discovery).

  // V7 mail: no banner; each message starts with its postmark ("From ken"
  // and the ctime date, mail.c) and is followed by a "?" prompt for d, s, q
  // and so on. The level prints the message and returns to the shell, as
  // if the reader pressed Return (reconstructed shortcut).
  // Belle (Thompson and Condon) won the 1978 ACM North American Computer
  // Chess Championship, 4 games of 4, in December 1978 (Wikipedia "Belle
  // (chess machine)"; IEEE Spectrum; high). The message is reconstructed.
  mail: [
    'From ken Tue Jan 16 08:51:41 1979',
    '',
    'Belle won all four of its games at the ACM computer',
    'chess championship in December. Joe and I will be',
    'back on the hardware in the spring.',
    '',
    '- ken',
    '',
    '?',
  ],

  'man ls': [
    "LS(1)                    UNIX Programmer's Manual                   LS(1)",
    '',
    'NAME',
    '     ls — list contents of directory',
    '',
    'SYNOPSIS',
    '     ls [ −ltuacdrfs ] [ file ]',
    '',
    'DESCRIPTION',
    '     For each directory argument, ls lists the contents.',
    '     For each file argument, the name is printed.',
    '     With no arguments, the current directory is listed.',
    '',
    'SEE ALSO',
    '     l(1), lc(1)',
  ],

  pwd:    ['/usr/bell/kerry'],
  whoami: ['kerry'],
  date:   ['Wed Jan 17 14:22:08 EST 1979'],
  help:   ['help: command not found', 'Hint: try  ls,  cat,  man,  mail'],
}

// ── Boot sequence ─────────────────────────────────────────────────────────────
// V7 on a PDP-11/70 ("Setting up Unix", Seventh Edition): the bootstrap
// prints "Boot" and a ":" prompt, the operator names the kernel, and the
// kernel prints the memory left for user programs. The single-user "#" and
// the ^D that takes the system multi-user are as the guide describes; the
// mem value is reconstructed. V7 getty prints only "login: ", so the
// "(log in as kerry)" line is the exhibit's hint, not the machine's.
const BOOT_GROUP_1 = [
  'Boot',
  ': hp(0,0)unix',
  'mem = 1035264',
  '',
]

const BOOT_GROUP_2 = [
  '# ^D',
  '',
  '(log in as kerry)',
]

// ── Welcome message shown after successful login ───────────────────────────────
// V7 login prints /etc/motd, then "You have mail." when the mailbox isn't
// empty; it has no "Last login" line (login.c). The motd text is the
// exhibit's: a lab's message of the day for new users.
const WELCOME_LINES = [
  '',
  'Seventh Edition UNIX, Bell Laboratories, Murray Hill.',
  '',
  'Your home directory contains:',
  '  notes.txt  mail  readme',
  '',
  'Useful commands:',
  '  ls',
  '    -> list files',
  '  cat [file]',
  '    -> read a file',
  '  mail',
  '    -> read messages',
  '  man [cmd]',
  '    -> look up a manual page',
  '',
  'You have mail.',
]

// ms between each character during streaming — ~500 chars/sec, feels like fast baud
const CHAR_DELAY = 2

// ── Hook ──────────────────────────────────────────────────────────────────────
export default function useTerminal({ onObjectiveComplete, completedIndices, replay = false } = {}) {
  // Normal: start in 'booting' — keypresses blocked until boot sequence completes.
  // Replay: start in 'shell' with welcome message pre-populated in history.
  const [phase,          setPhase]          = useState(() => replay ? 'shell' : 'booting')
  const [history,        setHistory]        = useState(() =>
    replay ? WELCOME_LINES.map(text => text === '' ? { type: 'blank', text: '' } : { type: 'output', text }) : []
  )
  const [currentInput,   setCurrentInput]   = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex,   setHistoryIndex]   = useState(-1)
  const [responding,     setResponding]     = useState(false)
  // The character being streamed on the current output line (null when idle).
  const [streamingLine,  setStreamingLine]  = useState(null)

  const respondingRef    = useRef(false)  // matches initial responding state
  const timeoutRef       = useRef(null)
  // Refs so objective logic always reads the latest values without stale closures.
  const onObjRef         = useRef(onObjectiveComplete)
  const completedRef     = useRef(completedIndices ?? [])

  useEffect(() => { onObjRef.current = onObjectiveComplete }, [onObjectiveComplete])
  useEffect(() => { completedRef.current = completedIndices ?? [] }, [completedIndices])

  // Fire objective[idx] if it hasn't fired yet. No ordering requirement —
  // all three objectives can be completed in any order.
  function tryFireObjective(idx) {
    const cb   = onObjRef.current
    const done = completedRef.current
    if (!cb || done.includes(idx)) return
    cb(idx)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  // ── Streaming engine ──────────────────────────────────────────────────────
  //
  // Recursively advances through `lines`, typing each character with CHAR_DELAY.
  // Blank lines commit instantly (no character loop).
  // When all lines are done, calls optional `onDone` callback then clears flags.
  //
  // All values used here are either stable (useState setters) or passed as
  // explicit arguments, so stale-closure issues don't apply.
  function beginStreaming(lines, lineIdx, charIdx, onDone) {
    if (lineIdx >= lines.length) {
      setStreamingLine(null)
      setResponding(false)
      respondingRef.current = false
      if (onDone) onDone()
      return
    }

    const line = lines[lineIdx]

    // Blank line or current line fully typed — commit to history, move on.
    if (line === '' || charIdx >= line.length) {
      const entry = line === ''
        ? { type: 'blank',  text: '' }
        : { type: 'output', text: line }
      setHistory(h => [...h, entry])
      setStreamingLine(null)
      // 0 ms between lines — yield to event loop but don't add perceptible pause.
      timeoutRef.current = setTimeout(
        () => beginStreaming(lines, lineIdx + 1, 0, onDone), 0
      )
      return
    }

    // Type the next character.
    setStreamingLine(line.slice(0, charIdx + 1))
    timeoutRef.current = setTimeout(
      () => beginStreaming(lines, lineIdx, charIdx + 1, onDone), CHAR_DELAY
    )
  }

  // Waits `delay` ms then streams `lines` character by character.
  // `onDone` fires after the last character is committed to history.
  function startStream(lines, delay, onDone) {
    setResponding(true)
    respondingRef.current = true
    timeoutRef.current = setTimeout(
      () => beginStreaming(lines, 0, 0, onDone), delay
    )
  }

  // ── Boot sequence (triggered on demand by Level0) ────────────────────────
  // Called by Level0.jsx when the player dismisses the IntroModal.
  // Group 1: hardware diagnostics. Group 2: OS banner + login hint.
  // A 1200ms pause between groups mimics kernel load time.
  function startBoot(onComplete) {
    startStream(BOOT_GROUP_1, 1000, () => {
      startStream(BOOT_GROUP_2, 1200, () => {
        setPhase('login')
        if (onComplete) onComplete()
      })
    })
  }

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const onKeyDown = useCallback((e) => {
    if (respondingRef.current) { e.preventDefault(); return }
    // Every key the terminal accepts clacks; modifiers and navigation don't.
    if (e.key === 'Enter' || e.key === 'Backspace' || (e.key.length === 1 && !e.metaKey && !e.altKey)) sfx.key()

    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setHistory(h => [...h, { type: 'output', text: '^C' }])
      setCurrentInput('')
      return
    }

    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setHistory([])
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()

      if (phase === 'login') {
        setHistory(h => [...h, { type: 'input', text: 'login: ' + currentInput }])
        setCurrentInput('')
        setPhase('password')
        return
      }

      if (phase === 'password') {
        setHistory(h => [...h, { type: 'input', text: 'Password: ****' }])
        setCurrentInput('')
        // Stream the expanded welcome; transition to shell when done.
        startStream(WELCOME_LINES, 800, () => setPhase('shell'))
        return
      }

      if (phase === 'shell') {
        const cmd = currentInput.trim()
        setHistory(h => [...h, { type: 'input', text: '$ ' + currentInput }])
        if (cmd) setCommandHistory(ch => [...ch, cmd])
        setHistoryIndex(-1)
        setCurrentInput('')

        if (!cmd) return

        if (cmd === 'clear') {
          setHistory([])
          return
        }

        const output = COMMANDS[cmd] ?? [cmd + ': not found']
        if (!COMMANDS[cmd]) setTimeout(sfx.bell, 400)   // the bell rings as the error prints

        // Determine which objective (if any) this command should complete.
        let onDone = null
        if (cmd === 'cat notes.txt')      onDone = () => tryFireObjective(0)
        else if (cmd === 'mail')           onDone = () => tryFireObjective(1)
        else if (cmd.startsWith('man '))   onDone = () => tryFireObjective(2)

        startStream(output, 400, onDone)
        return
      }
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      setCurrentInput(s => s.slice(0, -1))
      return
    }

    if (e.key === 'ArrowUp' && phase === 'shell') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIdx = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(newIdx)
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIdx])
      return
    }

    if (e.key === 'ArrowDown' && phase === 'shell') {
      e.preventDefault()
      const newIdx = historyIndex - 1
      if (newIdx < 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      } else {
        setHistoryIndex(newIdx)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIdx])
      }
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      setCurrentInput(s => s + e.key)
    }
  }, [phase, currentInput, commandHistory, historyIndex])

  return { phase, history, currentInput, responding, streamingLine, onKeyDown, startBoot }
}
