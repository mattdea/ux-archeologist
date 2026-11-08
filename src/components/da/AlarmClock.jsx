// src/components/da/AlarmClock.jsx — Donn Denman's Alarm Clock. Closed, it
// is one line: the time ticking in Chicago and a flag at the right. Click
// the flag down and a panel opens beneath with three icons — alarm clock,
// clock face, calendar — and the row above them shows what the chosen icon
// stands for: the alarm time with its on/off switch, the time, or the date.
// When the alarm goes off the Mac beeps once and the Apple in the menu bar
// blinks until the Alarm Clock is chosen again.
//
// The clock row lives in the window's title bar (DraggableWindow's 'plain'
// variant), so this component renders in two parts: `AlarmClockTitle` for
// that row and `AlarmClock` for the panel. They share state through props.
import { useEffect, useState } from 'react'
import styles from './da.module.css'
import * as sfx from '../../audio/sfx'

const pad = (n) => String(n).padStart(2, '0')
const fmtTime = (d, secs = true) => {
  const h = d.getHours(), h12 = h % 12 || 12
  return `${h12}:${pad(d.getMinutes())}${secs ? ':' + pad(d.getSeconds()) : ''} ${h < 12 ? 'AM' : 'PM'}`
}
const fmtDate = (d) => `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`

export function useAlarmClock({ onRing }) {
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('clock')
  const [alarmOn, setAlarmOn] = useState(false)
  const [alarmAt, setAlarmAt] = useState(() => {
    const d = new Date(); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() + 1); return d
  })
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (!alarmOn) return
    if (now.getHours() === alarmAt.getHours() && now.getMinutes() === alarmAt.getMinutes() && now.getSeconds() === 0) {
      sfx.beep()
      onRing?.()
    }
  }, [now, alarmOn, alarmAt, onRing])
  const bumpAlarm = (mins) => setAlarmAt(d => new Date(d.getTime() + mins * 60000))
  return { now, open, setOpen, mode, setMode, alarmOn, setAlarmOn, alarmAt, bumpAlarm }
}

function Flag({ down }) {
  // A little flag on a pole, up when the panel is closed, down when open
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="2" height="16" fill="#000" />
      {down
        ? <path d="M4 9h8l-3 3 3 3H4z" fill="#000" />
        : <path d="M4 1h8l-3 3 3 3H4z" fill="#000" />}
    </svg>
  )
}

export function AlarmClockTitle({ clock }) {
  return (
    <>
      <span className={styles.alarmTime}>{fmtTime(clock.now)}</span>
      <button type="button" className={styles.flag} onClick={() => clock.setOpen(o => !o)} aria-label={clock.open ? 'Close the clock panel' : 'Open the clock panel'}>
        <Flag down={clock.open} />
      </button>
    </>
  )
}

const ICONS = {
  alarm: (
    <svg width="22" height="20" viewBox="0 0 22 20" shapeRendering="crispEdges" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="7" width="2" height="5" fill="currentColor" /><rect x="10" y="11" width="4" height="2" fill="currentColor" />
      <rect x="2" y="2" width="5" height="3" fill="currentColor" /><rect x="15" y="2" width="5" height="3" fill="currentColor" />
      <rect x="4" y="16" width="3" height="3" fill="currentColor" /><rect x="15" y="16" width="3" height="3" fill="currentColor" />
    </svg>
  ),
  clock: (
    <svg width="22" height="20" viewBox="0 0 22 20" shapeRendering="crispEdges" aria-hidden="true">
      <circle cx="11" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="5" width="2" height="6" fill="currentColor" /><rect x="10" y="10" width="5" height="2" fill="currentColor" />
    </svg>
  ),
  calendar: (
    <svg width="22" height="20" viewBox="0 0 22 20" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="3" width="18" height="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="3" width="18" height="4" fill="currentColor" />
      <rect x="5" y="9" width="3" height="3" fill="currentColor" /><rect x="10" y="9" width="3" height="3" fill="currentColor" /><rect x="15" y="9" width="3" height="3" fill="currentColor" />
      <rect x="5" y="13" width="3" height="3" fill="currentColor" /><rect x="10" y="13" width="3" height="3" fill="currentColor" />
    </svg>
  ),
}

export default function AlarmClock({ clock }) {
  if (!clock.open) return null
  const { mode } = clock
  return (
    <div className={styles.alarm}>
      <div className={styles.alarmMid}>
        {mode === 'alarm' && (
          <button type="button" className={`${styles.alarmSwitch} ${clock.alarmOn ? styles.alarmSwitchOn : ''}`} onClick={() => clock.setAlarmOn(a => !a)} aria-label={clock.alarmOn ? 'Alarm on' : 'Alarm off'} />
        )}
        <span className={styles.alarmMidText}>
          {mode === 'alarm' ? fmtTime(clock.alarmAt, false) : mode === 'calendar' ? fmtDate(clock.now) : fmtTime(clock.now)}
        </span>
        {mode === 'alarm' && (
          <span className={styles.alarmArrows}>
            <button type="button" onClick={() => clock.bumpAlarm(1)} aria-label="Later">▲</button>
            <button type="button" onClick={() => clock.bumpAlarm(-1)} aria-label="Earlier">▼</button>
          </span>
        )}
      </div>
      <div className={styles.alarmIcons}>
        {['alarm', 'clock', 'calendar'].map(m => (
          <button key={m} type="button" className={`${styles.alarmIcon} ${mode === m ? styles.alarmIconOn : ''}`} onClick={() => clock.setMode(m)} aria-label={m}>
            {ICONS[m]}
          </button>
        ))}
      </div>
    </div>
  )
}
