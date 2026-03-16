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
 * Returns the next level number the player should play (0–4).
 * Returns 5 if all five levels are complete.
 */
export function getCurrentLevel() {
  const { completedLevels } = load()
  for (let i = 0; i <= 4; i++) {
    if (!completedLevels.includes(i)) return i
  }
  return 5
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

/** Wipe all progress. Useful for development / testing. */
export function resetAll() {
  try { localStorage.removeItem(KEY) } catch { /* quota/private mode */ }
}
