// src/components/terminal/useTerminal.js
//
// Owns all terminal state and logic for Level 0 (1971 Unix terminal).
// Returns { phase, history, currentInput, responding, streamingLine, onKeyDown }
//
// Phase progression: 'booting' → 'login' → 'password' → 'shell'

import { useState, useCallback, useRef, useEffect } from 'react'

// ── Command registry ──────────────────────────────────────────────────────────
const COMMANDS = {
  ls: [
    'notes.txt    mail    readme',
  ],

  'cat notes.txt': [
    'From: dmr',
    'To: unix-users',
    'Date: Tue Nov 2 09:04 EST 1971',
    'Re: pipe behavior on empty input',
    '',
    'Ken and I have been looking at the pipe issue you flagged last week.',
    'It blocks on empty read rather than returning EOF. Not immediately',
    'obvious why — likely the read() call in the kernel.',
    '',
    'Workaround for now: redirect from /dev/null if your source may be empty.',
    '',
    "Will have a patch in next week's distribution.",
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

  mail: [
    'Mail version 1.0',
    'Type ? for help.',
    '"/usr/mail/kerry": 1 message 1 unread',
    '>N  1 ken             Tue Nov  2 08:51  Re: scheduler',
    '',
    'Message 1:',
    'From ken Tue Nov  2 08:51:41 1971',
    '',
    'Looked at the scheduler issue you flagged. Not a bug — working as designed.',
    'The priority decay is intentional. See the commentary in sched.c around line 340.',
    '',
    'Running low on core on the 11/40 again. Compiling anything non-trivial takes',
    'the machine down for everyone else. Need to get the 11/45 approved before winter.',
    '',
    '- ken',
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
  date:   ['Wed Nov  3 14:22:08 EST 1971'],
  help:   ['help: command not found', 'Hint: try  ls,  cat,  man,  mail'],
}

// ── Boot sequence ─────────────────────────────────────────────────────────────
// Two groups separated by a pause simulate hardware POST then OS load.
const BOOT_GROUP_1 = [
  'PDP-11/45 UNIX',
  'Mem = 256K',
  'Boot: /unix',
  '',
]

const BOOT_GROUP_2 = [
  'UNIX Time-Sharing System v3',
  'Bell Telephone Laboratories',
  '',
  '(login as kerry)',
]

// ── Welcome message shown after successful login ───────────────────────────────
const WELCOME_LINES = [
  '',
  'Last login: Tue Nov  2 09:14:51 1971',
  'You have mail.',
  '',
  'Welcome to the UNIX system.',
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
]

// ms between each character during streaming — ~500 chars/sec, feels like fast baud
const CHAR_DELAY = 2

// ── Hook ──────────────────────────────────────────────────────────────────────
export default function useTerminal({ onObjectiveComplete, completedIndices } = {}) {
  // Start in 'booting' — keypresses are blocked and no prompt is shown
  // until the boot sequence finishes and phase transitions to 'login'.
  const [phase,          setPhase]          = useState('booting')
  const [history,        setHistory]        = useState([])
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
