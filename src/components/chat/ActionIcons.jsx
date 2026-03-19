// src/components/chat/ActionIcons.jsx
import { useState } from 'react'
import styles from './ActionIcons.module.css'

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function ThumbUpIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

function ThumbDownIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  )
}

function RegenerateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.1"/>
    </svg>
  )
}

export default function ActionIcons({ content, visible = false, onCopy, onThumbsUp, onThumbsDown, onRegenerate, disabled = false }) {
  const [copied, setCopied] = useState(false)
  const [rated, setRated] = useState(null) // 'up' | 'down' | null

  const handleCopy = () => {
    if (disabled || copied) return
    navigator.clipboard.writeText(content ?? '').catch(() => {})
    onCopy?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleThumbsUp = () => {
    if (disabled) return
    setRated('up')
    onThumbsUp?.()
  }

  const handleThumbsDown = () => {
    if (disabled) return
    setRated('down')
    onThumbsDown?.()
  }

  const handleRegenerate = () => {
    if (disabled) return
    onRegenerate?.()
  }

  return (
    <div className={`${styles.row} ${visible ? styles.rowVisible : ''}`}>
      <button className={styles.btn} title={copied ? 'Copied' : 'Copy'} type="button" onClick={handleCopy} disabled={disabled}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <button
        className={`${styles.btn} ${rated === 'up' ? styles.btnActive : ''}`}
        title="Good response" type="button"
        onClick={handleThumbsUp}
        disabled={disabled}
      >
        <ThumbUpIcon filled={rated === 'up'} />
      </button>
      <button
        className={`${styles.btn} ${rated === 'down' ? styles.btnActive : ''}`}
        title="Bad response" type="button"
        onClick={handleThumbsDown}
        disabled={disabled}
      >
        <ThumbDownIcon filled={rated === 'down'} />
      </button>
      <button className={styles.btn} title="Regenerate response" type="button" onClick={handleRegenerate} disabled={disabled}>
        <RegenerateIcon />
      </button>
    </div>
  )
}
