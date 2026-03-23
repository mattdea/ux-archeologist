# Interface Artifacts

**At the start of every session, read `docs/design-spec.md` in full before making any changes.** It is the single source of truth for all design decisions, architecture, visual tokens, and build conventions. Do not proceed without reading it.

## Quick rules
- One change per prompt. Test between each.
- Visuals first, logic second for new levels.
- Don't modify files you weren't asked to touch.
- Always: `git add -A && git commit -m "msg" && git push`
- The museum layer (shared UI) and artifact layer (era-specific) never cross-contaminate styles.

## Level conventions (apply to every level without being asked)

**Screen state machine:** `'intro' → 'booting' → 'playing' → 'discovery'`
- `'intro'`: IntroModal is visible. Artifact renders but is inert (no cursor, no interaction).
- `'booting'`: Modal dismissed. Artifact boot/intro sequence plays. Museum HUD is hidden.
- `'playing'`: Boot complete. Museum HUD slides in (ObjectiveTracker, HUD labels). Player interacts.
- `'discovery'`: All objectives done + Continue clicked. DiscoveryCard appears. Artifact recorded.

> **Note:** Level3 uses `museumScreen` (not `screen`) and calls the last state `'artifact'` instead of `'discovery'`. Level0/Level1 use `screen` and `'discovery'`. Prefer `screen` + `'discovery'` in future levels.

**After completing a level, navigate to the next level:**
- `DiscoveryCard nextUrl` is `/level/N+1` (e.g. Level 0 → `/level/1`). The final level (Level 5) uses `/collection`.
- The timeline is still accessible via the "Back to timeline" link in the HUD.

**Boot sequence:**
- Every level has a boot/intro sequence that plays after "Begin Excavation" is clicked.
- HUD elements (ObjectiveTracker, era label, progress dots) are hidden during boot.
- They appear only after boot completes and the artifact is interactive.
- Level0/Level1 pattern: `startBoot(onComplete)` — expose a function from the artifact hook, call it from a `useEffect` watching `screen === 'booting'`, pass `() => setScreen('playing')` as callback.
- Level3 pattern: inline `setTimeout` chain in `handleBeginExcavation` — 1000ms pause, then 450ms boot animation, then `setScreen('playing')`.
- Use whichever pattern fits the artifact's complexity.

**Boot delay before animation:**
- Add ~1000ms pause before the visual boot animation plays so the transition from modal → artifact feels intentional (not instant). See Level3's `handleBeginExcavation`.

**Replay behavior:**
- If `isLevelComplete(N)` is true on load, skip `'intro'` and start at `'booting'` directly.
- `completedIndices` starts as `[0,1,2]` (all done) on replay.

**Focus:**
- Artifact input (if any) should auto-focus when `phase !== 'booting'` (i.e. on phase transition to the first interactive phase).
- Document-level keydown recapture should also be active for any interactive phase, not just 'shell'.

**Objective gating:**
- Sequential (Level0/Level1): `tryFireObjective(idx)` — idx N requires idx N-1 in `completedIndices`. Use refs (`onObjRef`, `completedRef`) to avoid stale closures in async callbacks.
- Independent (Level3): each objective fires immediately on the triggering action, no gating. Use `completeObjective(key)` with a keyed object: `{ slideToUnlock: false, exploreNotes: false, swipePage: false }`. Convert to `completedIndices` array via `.reduce()`.
- Choose the pattern that matches the level's interaction model.

**Continue button wiring (canonical):**
```js
useEffect(() => {
  if (screen === 'playing' && allComplete) {
    setContinue(() => () => { completeLevel(N); setScreen('discovery') })
  } else {
    setContinue(null)
  }
}, [screen, allComplete, setContinue])
```

**Sound effects:**
```js
function playSound(src) {
  const audio = new Audio(src)
  audio.volume = 0.5
  audio.play().catch(() => {})
}
```
- Define `playSound` above all imports (Vite handles this, but prefer moving it below imports in new code).
- Import audio assets as ES modules: `import soundSrc from '../../assets/...'`
- Guard sound calls with state checks to avoid stale closure bugs — always include the relevant state in `useCallback`'s dependency array.

**CSS boot animations:**
- Use `@keyframes` (not CSS transitions) for boot animations so components can mount directly in the 'entering' phase and still animate from the off-screen `from` position.
- CSS transitions require the element to already be at the start position — they fail on fresh mount.

**bottomZone layout:**
- `padding: 16px 24px 24px` — matches Level0, gives correct inset from viewport edge.
- Never add `min-height` to `.bottomZone` — it forces a blank gap above the tracker.
- The top spacer (`height: var(--bottom-zone-height)`) mirrors bottomZone height to keep the artifact centered.

**File structure for a new level:**
- `src/levels/LevelN.jsx` — screen state machine, museum wiring, artifact composition
- `src/levels/LevelN.module.css` — three-zone layout (topSpacer / artifactZone / bottomZone), mirrors existing levels exactly
- `src/components/[artifact]/` — all artifact-layer components and hooks, self-contained
- Levels are not gated. All levels are accessible regardless of completion state.

## Phone-layer pattern (Level3 / future phone levels)

Level3 has a secondary `phonePower` state machine nested inside the museum state machine:

```
phonePower: 'off' | 'booting' | 'on'
```

- `'off'`: Black screen div rendered inside PhoneFrame screen slot. Tappable to wake.
- `'booting'`: LockScreen mounts fresh with `bootPhase='entering'` — keyframe animations play.
- `'on'`: Fully interactive phone.

**Pointer events split:**
- `phonePointerEvents = museumScreen === 'playing' ? 'auto' : 'none'` — on the wrap div, allows wake-tap on black screen during playing state.
- `cursorEnabled = museumScreen === 'playing'` — TouchCursor shows whenever playing, regardless of phonePower.

**Lock button:**
- Invisible `<button className={styles.lockBtn}>` in PhoneFrame, positioned over the hardware sleep/wake button.
- Top face of bezel: `top: 8px; left: 110px; width: 220px; height: 45px`.
- Only plays lock sound when `phonePower === 'on'` — guard this in `useCallback` deps.

**PhoneFrame dimensions:**
- BEZEL_W=385, BEZEL_H=735
- Screen slot: top=131px, left=33px, width=320px, height=480px
- Home button: 44px circle, top=643px, left=calc(50%-22px)
