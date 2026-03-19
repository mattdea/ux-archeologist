// src/components/chat/ChatInput.jsx
import { useRef, useEffect } from 'react'
import styles from './ChatInput.module.css'

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

export default function ChatInput({ autoFocus = false }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={styles.inputBar}>
      <input
        ref={inputRef}
        className={styles.inputField}
        type="text"
        placeholder="Ask me anything..."
        autoComplete="off"
      />
      <span className={styles.modelLabel}>Curator v1</span>
      <button className={styles.sendBtn} type="button" title="Send">
        <SendIcon />
      </button>
    </div>
  )
}
