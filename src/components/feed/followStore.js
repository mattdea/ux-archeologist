// src/components/feed/followStore.js
// Who the player follows, shared by every screen so a Follow tap on a
// profile also shows on Activity rows and in the player's own counts.
// Starts from FOLLOWING (everyone in the home feed except ads); resets each
// time the level mounts.

import { useSyncExternalStore } from 'react'
import { FOLLOWING } from './feedData'

let following = new Set(FOLLOWING)
const listeners = new Set()

function emit() {
  listeners.forEach(l => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetFollows() {
  following = new Set(FOLLOWING)
  emit()
}

export function toggleFollow(username) {
  if (!username) return
  following = new Set(following)
  if (following.has(username)) following.delete(username)
  else following.add(username)
  emit()
}

export function useIsFollowing(username) {
  return useSyncExternalStore(subscribe, () => !!username && following.has(username))
}

export function useFollowingCount() {
  return useSyncExternalStore(subscribe, () => following.size)
}

/**
 * A follower count after the player's own follow changes. Exact counts
 * ("343", "9,812") move by one; abbreviated ones ("402k", "84.6m") stay put,
 * as they did in the app, since one follower doesn't change the rounding.
 */
export function adjustCount(label, delta) {
  const s = String(label)
  if (!delta || !/^[\d,]+$/.test(s)) return s
  return (parseInt(s.replace(/,/g, ''), 10) + delta).toLocaleString('en-US')
}
