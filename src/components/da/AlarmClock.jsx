// src/components/da/AlarmClock.jsx — the Alarm Clock desk accessory: a bar
// showing the time, with a lever at the right. Pull the lever and a panel
// opens beneath with three icons (alarm, clock, calendar); the one chosen
// decides what the middle row shows and lets you set it. The alarm, when it
// goes off, rings the beep and blinks the Apple in the menu bar.
import { useEffect, useState } from 'react'
import styles from './da.module.css'
import * as sfx from '../../audio/sfx'

const pad = (n) => String(n).padStart(2, '0')
const fmtTime = (d) => {
  const h = d.getHours(), h12 = h % 12 || 12
  return `${h12}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${h < 12 ? 'AM' : 'PM'}`
}
const fmtDate = (d) => `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`

export default function AlarmClock() {
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('clock')    // 'alarm' | 'clock' | 'calendar'
  const [alarmOn, setAlarmOn] = useState(false)
  const [alarmAt, setAlarmAt] = useState(() => { const d = new Date(); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() + 1); return d })

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!alarmOn) return
    if (now.getHours() === alarmAt.getHours() && now.getMinutes() === alarmAt.getMinutes() && now.getSeconds() === 0) {
      sfx.beep()
      document.dispatchEvent(new CustomEvent('mac-alarm'))
    }
  }, [now, alarmOn, alarmAt])

  const middle = mode === 'alarm' ? fmtTime(alarmAt).replace(/:\d\d (AM|PM)/, ' $1')
    : mode === 'calendar' ? fmtDate(now)
    : fmtTime(now)

  return (
    <div className={styles.alarm}>
      <div className={styles.alarmBar}>
        <span className={styles.alarmTime}>{fmtTime(now)}</span>
        <button type="button" className={`${styles.lever} ${open ? styles.leverDown : ''}`} onClick={() => setOpen(o => !o)} aria-label="Open controls">
          <span />
        </button>
      </div>
      {open && (
        <>
          <div className={styles.alarmMid}>
            <span>{middle}</span>
            {mode === 'alarm' && (
              <button type="button" className={`${styles.alarmSwitch} ${alarmOn ? styles.alarmSwitchOn : ''}`} onClick={() => setAlarmOn(a => !a)} aria-label="Alarm on/off" />
            )}
          </div>
          <div className={styles.alarmIcons}>
            <button type="button" className={`${styles.alarmIcon} ${mode === 'alarm' ? styles.alarmIconOn : ''}`} onClick={() => setMode('alarm')} aria-label="Alarm">⏰</button>
            <button type="button" className={`${styles.alarmIcon} ${mode === 'clock' ? styles.alarmIconOn : ''}`} onClick={() => setMode('clock')} aria-label="Clock">🕓</button>
            <button type="button" className={`${styles.alarmIcon} ${mode === 'calendar' ? styles.alarmIconOn : ''}`} onClick={() => setMode('calendar')} aria-label="Calendar">📅</button>
          </div>
        </>
      )}
    </div>
  )
}
