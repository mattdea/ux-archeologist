// src/state/state.js
// localStorage-backed progress tracking. No React dependency.

const KEY = 'ux-archaeologist-progress'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { completedLevels: [] }
  } catch {
    return { completedLevels: [] }
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* quota/private mode */ }
}

/** Mark a level (1–4) as complete. Idempotent. */
export function completeLevel(level) {
  const data = load()
  if (!data.completedLevels.includes(level)) {
    data.completedLevels.push(level)
    save(data)
  }
}

/** Returns true if the given level (1–4) has been completed. */
export function isLevelComplete(level) {
  return load().completedLevels.includes(level)
}

/**
 * Returns the next level number the player should play (1–4).
 * Returns 5 if all four levels are complete.
 */
export function getCurrentLevel() {
  const { completedLevels } = load()
  for (let i = 1; i <= 4; i++) {
    if (!completedLevels.includes(i)) return i
  }
  return 5
}
