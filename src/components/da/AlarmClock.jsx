// src/components/da/AlarmClock.jsx — Donn Denman's Alarm Clock. Closed, it
// is one line: the time ticking in Chicago and a flag at the right. Click
// the flag and a panel opens beneath with three icons — clock face,
// calendar, alarm clock — and the row above them shows what the chosen icon
// stands for: the time, the date, or the alarm time with its on/off switch.
// In alarm mode, click a field (hour, minutes, seconds, AM/PM) to select it
// and the up/down arrows set it. When the alarm goes off the Mac beeps once
// and the Apple in the menu bar blinks until the Alarm Clock is chosen again.
//
// Traced from docs/reference/mac system 1/macsystem100006–100010.png: the
// window closed and open (DA_ART.alarm / alarmOpen), with the flag, the
// alarm switch, the arrow box and the alarm icon's rays as sprites. The
// text is live Chicago, each field at the origin measured in the
// screenshots (Mac pixels): times put the hour right-aligned in a 2-digit
// slot at x 28, then ":mm:ss AM"; dates the month right-aligned at x 38,
// then "/ d/yy" with the day right-aligned too. The switch's off position
// isn't in the screenshots: it is the on lever flipped (reconstructed).
import { useEffect, useState } from 'react'
import flagUp from '../../../assets/mac/da/alarm-flag-up.png'
import flagDown from '../../../assets/mac/da/alarm-flag-down.png'
import switchOn from '../../../assets/mac/da/alarm-switch-on.png'
import switchOff from '../../../assets/mac/da/alarm-switch-off.png'
import arrows from '../../../assets/mac/da/alarm-arrows.png'
import iconOn from '../../../assets/mac/da/alarm-icon-on.png'
import styles from './da.module.css'
import * as sfx from '../../audio/sfx'

const mp = (n) => `calc(var(--mac-px) * ${n})`
const pad = (n) => String(n).padStart(2, '0')

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
    if (now.getHours() === alarmAt.getHours() && now.getMinutes() === alarmAt.getMinutes() && now.getSeconds() === alarmAt.getSeconds()) {
      sfx.beep()
      onRing?.()
    }
  }, [now, alarmOn, alarmAt, onRing])
  // Step one field of the alarm time; the others stay put
  const bumpAlarm = (field, dir) => setAlarmAt(d => {
    const n = new Date(d)
    if (field === 'h') n.setHours((n.getHours() + dir + 24) % 24)
    if (field === 'm') n.setMinutes((n.getMinutes() + dir + 60) % 60)
    if (field === 's') n.setSeconds((n.getSeconds() + dir + 60) % 60)
    if (field === 'ap') n.setHours((n.getHours() + 12) % 24)
    return n
  })
  return { now, open, setOpen, mode, setMode, alarmOn, setAlarmOn, alarmAt, bumpAlarm }
}

// Field origins and widths in Mac pixels (Chicago: digits 8, colon 4, space 3)
const TIME_FIELDS = [['h', 28, 16, true], [':', 44, 4], ['m', 48, 16], [':', 64, 4], ['s', 68, 16], ['ap', 87, 20]]
const DATE_FIELDS = [['mo', 38, 16, true], ['/', 54, 7], ['d', 61, 16, true], ['/', 77, 7], ['y', 84, 16]]

function timeParts(d) {
  const h = d.getHours()
  return { h: String(h % 12 || 12), m: pad(d.getMinutes()), s: pad(d.getSeconds()), ap: h < 12 ? 'AM' : 'PM', ':': ':' }
}
function dateParts(d) {
  return { mo: String(d.getMonth() + 1), d: String(d.getDate()), y: pad(d.getFullYear() % 100), '/': '/' }
}

// One row of fields on a baseline; `selected` field is inverted (2 pixels
// round its text, from the baseline up 11 and down 1, as in 100010)
function Fields({ fields, parts, baseline, selected, onSelect }) {
  return fields.map(([key, x, w, right]) => {
    const settable = !!onSelect && key !== ':' && key !== '/'
    return (
      <span
        key={`${key}${x}`}
        className={`${styles.alarmField} ${selected === key ? styles.alarmFieldOn : ''} ${settable ? styles.alarmFieldHit : ''}`}
        style={{ left: mp(x - 1), top: mp(baseline - 11), width: mp(w), height: mp(13) }}
        onMouseDown={settable ? (e) => { e.stopPropagation(); onSelect(key) } : undefined}
      >
        {/* The text's origin is 1 pixel in from the highlight; right-aligned
            fields end 1 pixel past it */}
        <span style={right ? { top: mp(-1), right: mp(-1) } : { top: mp(-1), left: mp(1) }}>{parts[key]}</span>
      </span>
    )
  })
}

const CELLS = { clock: 1, calendar: 44, alarm: 87 }   // icon cells' left edges; each 42 wide

export default function AlarmClock({ clock }) {
  const [field, setField] = useState(null)   // the alarm field being set
  const { open, mode } = clock

  return (
    <div className={styles.alarm}>
      {/* Top row: the time, and the flag that opens the panel */}
      <Fields fields={TIME_FIELDS} parts={timeParts(clock.now)} baseline={15} />
      <button
        type="button"
        className={styles.alarmFlag}
        style={{ left: mp(110), top: mp(2), width: mp(18), height: mp(17), backgroundImage: `url(${open ? flagDown : flagUp})` }}
        onClick={() => { clock.setOpen(o => !o); setField(null) }}
        aria-label={open ? 'Close the clock panel' : 'Open the clock panel'}
      />

      {open && (
        <>
          {/* Middle row */}
          {mode === 'clock' && <Fields fields={TIME_FIELDS} parts={timeParts(clock.now)} baseline={35} />}
          {mode === 'calendar' && <Fields fields={DATE_FIELDS} parts={dateParts(clock.now)} baseline={35} />}
          {mode === 'alarm' && (
            <>
              <button
                type="button"
                className={styles.alarmSprite}
                style={{ left: mp(10), top: mp(23), width: mp(8), height: mp(13), backgroundImage: `url(${clock.alarmOn ? switchOn : switchOff})` }}
                onClick={() => clock.setAlarmOn(a => !a)}
                aria-label={clock.alarmOn ? 'Alarm on' : 'Alarm off'}
              />
              <Fields fields={TIME_FIELDS} parts={timeParts(clock.alarmAt)} baseline={35} selected={field} onSelect={setField} />
              {field && (
                <span className={styles.alarmArrows} style={{ left: mp(115), top: mp(21), width: mp(11), height: mp(18), backgroundImage: `url(${arrows})` }}>
                  <button type="button" onClick={() => clock.bumpAlarm(field, 1)} aria-label="Later" />
                  <button type="button" onClick={() => clock.bumpAlarm(field, -1)} aria-label="Earlier" />
                </span>
              )}
            </>
          )}

          {/* Icons: the alarm clock shows its rays while the alarm is on;
              the chosen one inverts inside a 1-pixel margin */}
          {clock.alarmOn && (
            <span className={styles.alarmSprite} style={{ left: mp(88), top: mp(42), width: mp(40), height: mp(28), backgroundImage: `url(${iconOn})` }} />
          )}
          {Object.entries(CELLS).map(([m, x]) => (
            <button
              key={m}
              type="button"
              className={`${styles.alarmCell} ${mode === m ? styles.alarmCellOn : ''}`}
              style={{ left: mp(x + 1), top: mp(42), width: mp(40), height: mp(28) }}
              onClick={() => { clock.setMode(m); setField(null) }}
              aria-label={m}
            />
          ))}
        </>
      )}
    </div>
  )
}
