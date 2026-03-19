// src/components/chat/ChatInput.jsx
import { useRef, useEffect, useState } from 'react'
import styles from './ChatInput.module.css'

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

export default function ChatInput({ autoFocus = false, onSend, disabled = false }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSend = () => {
    const text = value.trim()
    if (!text || disabled) return
    setValue('')
    onSend?.(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.inputBar}>
      <input
        ref={inputRef}
        className={styles.inputField}
        type="text"
        placeholder="Ask me anything..."
        autoComplete="off"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <span className={styles.modelLabel}>Curator v1</span>
      <button
        className={styles.sendBtn}
        type="button"
        title="Send"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
      >
        <SendIcon />
      </button>
    </div>
  )
}
