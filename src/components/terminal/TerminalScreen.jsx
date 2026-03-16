// src/components/terminal/TerminalScreen.jsx
//
// Renders terminal output + the active prompt line, captures keyboard input
// via a hidden <input>, and maintains focus so keypresses always reach the hook.

import { useRef, useEffect } from 'react'
import styles from './TerminalScreen.module.css'
import './terminal-styles.css'  // VT323 font + .termCursor global

// ── Helpers ───────────────────────────────────────────────────────────────────

// Build the prompt prefix for each phase.
function promptPrefix(phase) {
  if (phase === 'login')    return 'login: '
  if (phase === 'password') return 'Password: '
  return '$ '
}

// Visible text for the current input: password phase shows nothing (Unix convention).
function visibleInput(phase, currentInput) {
  if (phase === 'password') return ''
  return currentInput
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TerminalScreen({ phase, history, currentInput, responding, onKeyDown }) {
  const inputRef  = useRef(null)
  const scrollRef = useRef(null)

  // ── Focus management ───────────────────────────────────────────────────────

  // Grab focus on first mount.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Re-focus when entering shell phase (after login sequence completes).
  useEffect(() => {
    if (phase === 'shell') inputRef.current?.focus()
  }, [phase])

  // Document-level keydown listener: re-focus if the input has lost focus
  // while in shell phase (e.g. player clicked the ObjectiveTracker).
  useEffect(() => {
    const recapture = () => {
      if (phase === 'shell' && document.activeElement !== inputRef.current) {
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', recapture, true)
    return () => document.removeEventListener('keydown', recapture, true)
  }, [phase])

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={styles.screen}
      onClick={() => inputRef.current?.focus()}
    >

      {/*
        Scroll container. Inline styles used to avoid touching the CSS module:
        - height: 100%  so it fills the CRT glass
        - overflowY: auto  enables scroll when output grows beyond the screen
        - boxSizing: border-box  so the existing padding is counted inside height
      */}
      <div
        className={styles.content}
        ref={scrollRef}
        style={{ height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}
      >

        {/* Committed history lines */}
        {history.map((line, i) => (
          <div key={i}>
            {line.type === 'blank' ? '\u00A0' : line.text}
          </div>
        ))}

        {/* Active prompt line — always below history */}
        <div>
          {promptPrefix(phase)}
          {visibleInput(phase, currentInput)}
          <span className="termCursor">_</span>
        </div>

      </div>

      {/*
        Hidden input — the actual keyboard target.
        readOnly prevents the browser from modifying its value (we handle all
        input in onKeyDown via e.preventDefault). Invisible via inline style
        so we don't need a new CSS rule.
      */}
      <input
        ref={inputRef}
        type="text"
        readOnly
        onKeyDown={onKeyDown}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 1,
          height: 1,
          overflow: 'hidden',
          border: 'none',
          outline: 'none',
          padding: 0,
        }}
      />

      {/* CRT effect overlays — purely decorative */}
      <div className={styles.flicker} aria-hidden="true" />
      <div className={styles.noise}   aria-hidden="true" />

    </div>
  )
}
