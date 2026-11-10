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
 * Returns the next level number the player should play (0–5).
 * Returns 6 if all six levels are complete.
 */
export function getCurrentLevel() {
  const { completedLevels } = load()
  for (let i = 0; i <= 5; i++) {
    if (!completedLevels.includes(i)) return i
  }
  return 6
}

/** Add a collected artifact. Idempotent by artifact name. */
export function addArtifact(artifact) {
  const data = load()
  if (!data.artifacts) data.artifacts = []
  if (!data.artifacts.some(a => a.name === artifact.name)) {
    data.artifacts.push(artifact)
    save(data)
  }
}

/** Returns all collected artifacts. */
export function getArtifacts() {
  const data = load()
  return data.artifacts ?? []
}

// What a level keeps for the visit while it's unfinished (Level 1: the
// objectives done so far and the Note Pad's pages). Reset clears it too, or
// a reset level would come back with its old ticks.
const SESSION_KEYS = ['l1_completed', 'l1_notepad']

/** Wipe all progress, including what levels keep for the visit. */
export function resetAll() {
  try { localStorage.removeItem(KEY) } catch { /* quota/private mode */ }
  try { SESSION_KEYS.forEach(k => sessionStorage.removeItem(k)) } catch { /* storage blocked */ }
}
