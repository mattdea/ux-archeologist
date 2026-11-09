// src/components/macSettings.js
//
// The Control Panel's settings, shared with the parts of the Mac they change.
// Kept for the session (like the Mac's parameter RAM, minus the battery).
//   menuBlinks     how many times a chosen menu item blinks (MenuBar)
//   volume         speaker volume 0–7
//   keyRepeat      key repeat rate 0–4, keyDelay delay until repeat 0–4
//   caretBlink     insertion point blinking 1–3, doubleClick 0–2

const settings = { menuBlinks: 3, volume: 3, keyRepeat: 3, keyDelay: 2, caretBlink: 2, doubleClick: 1 }

export const getSetting = (key) => settings[key]
export const setSetting = (key, value) => { settings[key] = value }
