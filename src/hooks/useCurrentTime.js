// src/hooks/useCurrentTime.js
// Returns a live Date that updates every 30 seconds.

import { useState, useEffect } from 'react'

export function useCurrentTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return now
}

// "h:mm AM/PM" — no leading zero, matches original iPhone status bar
export function formatStatusTime(date) {
  let h = date.getHours()
  const m = date.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

// "h:mm" — no AM/PM, matches original iPhone lock screen clock
export function formatLockTime(date) {
  let h = date.getHours() % 12 || 12
  const m = date.getMinutes()
  return `${h}:${String(m).padStart(2, '0')}`
}

// "DayOfWeek, Month DayNumber" — e.g. "Wednesday, March 18"
export function formatLockDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
