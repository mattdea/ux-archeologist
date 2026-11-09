// src/components/macSettings.js
//
// The Control Panel's settings, shared with the parts of the Mac they change.
// Kept for the session (like the Mac's parameter RAM, minus the battery).
//   menuBlinks     how many times a chosen menu item blinks (MenuBar)
//   desktopPattern the desktop's 8×8 pattern, 8 row bytes, high bit left
//                  (DesktopScene); 50% gray to start
//   volume         speaker volume 0–7
//   keyRepeat      key repeat rate 0–4, keyDelay delay until repeat 0–4
//   caretBlink     insertion point blinking 1–3, doubleClick 0–2
import { useSyncExternalStore } from 'react'

export const GRAY = [0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55]

const settings = {
  menuBlinks: 3, desktopPattern: GRAY,
  volume: 3, keyRepeat: 3, keyDelay: 2, caretBlink: 2, doubleClick: 1,
}
const listeners = new Set()

export const getSetting = (key) => settings[key]
export const setSetting = (key, value) => {
  settings[key] = value
  listeners.forEach(l => l())
}

/** A setting as React state that follows changes made anywhere. */
export function useMacSetting(key) {
  const value = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => settings[key],
  )
  return [value, (v) => setSetting(key, v)]
}
