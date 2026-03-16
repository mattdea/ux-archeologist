// src/components/terminal/useTerminal.js
//
// Owns all terminal state and logic for Level 0 (1971 Unix terminal).
// Returns { phase, history, currentInput, responding, onKeyDown }
// — everything TerminalScreen needs to render and respond to input.

import { useState, useCallback, useRef, useEffect } from 'react'

// ── Command registry ──────────────────────────────────────────────────────────
// Keys are the exact trimmed string the user must type.
// Values are arrays of output lines; '' becomes a blank line in history.

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

  // 'cat mail' is intentionally absent — mail is a program, not a file.
  // Attempting it will hit the "not found" fallback, which is the discovery.

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

// Lines shown before the login prompt on first mount.
const BOOT_LINES = [
  { type: 'output', text: 'UNIX (pdp-11/45)' },
  { type: 'blank',  text: '' },
]

// ── Helper — convert a string array to history entries ───────────────────────
function linesToEntries(lines) {
  return lines.map(text =>
    text === '' ? { type: 'blank', text: '' } : { type: 'output', text }
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export default function useTerminal() {
  const [phase,          setPhase]          = useState('login')
  const [history,        setHistory]        = useState(BOOT_LINES)
  const [currentInput,   setCurrentInput]   = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex,   setHistoryIndex]   = useState(-1)
  const [responding,     setResponding]     = useState(false)

  // Ref mirrors `responding` so event handlers always see the current value
  // without needing it in their dependency arrays.
  const respondingRef = useRef(false)
  const timeoutRef    = useRef(null)

  // Cancel any pending response on unmount.
  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  // ── Scheduled output helper ────────────────────────────────────────────────
  // Pushes `lines` after `delay` ms, then clears the responding flag.
  // Does NOT set phase — callers that need a phase change must do it themselves.
  const scheduleOutput = useCallback((lines, delay) => {
    setResponding(true)
    respondingRef.current = true
    timeoutRef.current = setTimeout(() => {
      setHistory(h => [...h, ...linesToEntries(lines)])
      setResponding(false)
      respondingRef.current = false
    }, delay)
  }, [])

  // ── Keyboard handler (returned to TerminalScreen) ──────────────────────────
  const onKeyDown = useCallback((e) => {
    // Hard block during simulated latency — no buffering, no queuing.
    if (respondingRef.current) { e.preventDefault(); return }

    // ── Ctrl+C — interrupt, show ^C, clear input ───────────────────────────
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setHistory(h => [...h, { type: 'output', text: '^C' }])
      setCurrentInput('')
      return
    }

    // ── Ctrl+L — clear screen ──────────────────────────────────────────────
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setHistory([])
      return
    }

    // ── Enter ──────────────────────────────────────────────────────────────
    if (e.key === 'Enter') {
      e.preventDefault()

      if (phase === 'login') {
        setHistory(h => [...h, { type: 'input', text: 'login: ' + currentInput }])
        setCurrentInput('')
        setPhase('password')
        return
      }

      if (phase === 'password') {
        // Commit masked line; delay welcome + shell transition by 800ms.
        setHistory(h => [...h, { type: 'input', text: 'Password: ****' }])
        setCurrentInput('')
        setResponding(true)
        respondingRef.current = true
        timeoutRef.current = setTimeout(() => {
          setHistory(h => [
            ...h,
            { type: 'blank',  text: '' },
            { type: 'output', text: 'Last login: Tue Nov  2 09:14:51 1971' },
            { type: 'output', text: 'You have mail.' },
            { type: 'blank',  text: '' },
          ])
          setPhase('shell')
          setResponding(false)
          respondingRef.current = false
        }, 800)
        return
      }

      if (phase === 'shell') {
        const cmd = currentInput.trim()

        // Commit the input line regardless.
        setHistory(h => [...h, { type: 'input', text: '$ ' + currentInput }])

        // Record non-empty commands in history for up-arrow cycling.
        if (cmd) setCommandHistory(ch => [...ch, cmd])
        setHistoryIndex(-1)
        setCurrentInput('')

        if (!cmd) return  // empty Enter — just show blank prompt, no delay

        // `clear` is immediate and produces no output.
        if (cmd === 'clear') {
          setHistory([])
          return
        }

        // Everything else goes through the 400ms response latency.
        if (COMMANDS[cmd]) {
          scheduleOutput(COMMANDS[cmd], 400)
        } else {
          scheduleOutput([cmd + ': not found'], 400)
        }
        return
      }
      return
    }

    // ── Backspace ──────────────────────────────────────────────────────────
    if (e.key === 'Backspace') {
      e.preventDefault()
      setCurrentInput(s => s.slice(0, -1))
      return
    }

    // ── Arrow Up — cycle backward through command history ──────────────────
    if (e.key === 'ArrowUp' && phase === 'shell') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIdx = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(newIdx)
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIdx])
      return
    }

    // ── Arrow Down — cycle forward, restore empty at end ──────────────────
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

    // ── Printable characters ───────────────────────────────────────────────
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      setCurrentInput(s => s + e.key)
    }
  }, [phase, currentInput, commandHistory, historyIndex, scheduleOutput])

  return { phase, history, currentInput, responding, onKeyDown }
}
