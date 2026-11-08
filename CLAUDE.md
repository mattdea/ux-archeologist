# Interface Artifacts

**At the start of every session, read `docs/design-spec.md` in full before making any changes.** It is the single source of truth for all design decisions, architecture, visual tokens, and build conventions. Do not proceed without reading it.

## Quick rules
- If the user sends a correction mid-task, fold it in before carrying on with the rest of the list.
- Visuals first, logic second for new levels.
- Don't modify files you weren't asked to touch.
- Always: `git add -A && git commit -m "msg" && git push`
- The museum layer (shared UI) and artifact layer (era-specific) never cross-contaminate styles.
- `assets/feed/` holds real Instagram photos and account data for Level 4, committed for non-commercial educational use. Only raw downloads stay gitignored (see `.gitignore`); never `git add -f` those. Keep the level working when photos are absent (color-block fallbacks). See `assets/feed/README.md`.

## Working rules
- **Batching:** when a prompt asks for several features, build them one at a time and commit + push after each with a descriptive message, so each can be reverted on its own.
- **Ideation sessions** (prompt starts with "Ideation"): edit no code. Write proposals to `docs/backlog.md` under **Ideas**. Every historical claim gets a source and a confidence level (high / medium / low).
- **Unattended / overnight runs:** build only items under **Approved** in `docs/backlog.md`. If an item is ambiguous, skip it and leave a note on it in the backlog instead of guessing.
- **Museum layer** (HUD, modals, objective tracker, discovery cards): before creating or changing any of it, read the existing implementation and reuse it; never invent new museum-layer patterns unless asked. Reference: `src/levels/Level4.jsx` with `src/shared/museum-ui/` and `src/shared/SharedLayout.jsx` — `screen` + `'discovery'`, replay starts at `'booting'`, keyed objectives → `completedIndices`, `useHint` + docked `HintPill`, canonical Continue wiring, `addArtifact` on discovery, `nextUrl="/timeline"`.

## Level conventions (apply to every level without being asked)

**Screen state machine:** `'intro' → 'booting' → 'playing' → 'discovery'`
- `'intro'`: IntroModal is visible. Artifact renders but is inert (no cursor, no interaction).
- `'booting'`: Modal dismissed. Artifact boot/intro sequence plays. Museum HUD is hidden.
- `'playing'`: Boot complete. Museum HUD slides in (ObjectiveTracker, HUD labels). Player interacts.
- `'discovery'`: All objectives done + Continue clicked. DiscoveryCard appears. Artifact recorded.

> **Note:** Level3 uses `museumScreen` (not `screen`) and calls the last state `'artifact'` instead of `'discovery'`. Level0/Level1 use `screen` and `'discovery'`. Prefer `screen` + `'discovery'` in future levels.

**After completing a level, navigate to the timeline:**
- `DiscoveryCard nextUrl` is always `"/timeline"` — all levels return to the timeline on discovery.
- The timeline is still accessible via the "Back to timeline" link in the HUD.

**Boot sequence:**
- Every level has a boot/intro sequence that plays after "Begin Excavation" is clicked.
- HUD elements (ObjectiveTracker, era label, progress dots) are hidden during boot.
- They appear only after boot completes and the artifact is interactive.
- Level0/Level1 pattern: `startBoot(onComplete)` — expose a function from the artifact hook, call it from a `useEffect` watching `screen === 'booting'`, pass `() => setScreen('playing')` as callback.
- Level3 pattern: inline `setTimeout` chain in `handleBeginExcavation` — 1000ms pause, then 450ms boot animation, then `setScreen('playing')`.
- Use whichever pattern fits the artifact's complexity.

**Boot delay before animation:**
- Add a short pause before the visual boot animation plays so the transition from modal → artifact feels intentional (not instant). 300ms is the current Level3 timing — enough to register without stalling. See Level3's `handleBeginExcavation`.

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
- `padding: 0 24px 24px` — no top padding (the box must equal the visible box so `useArtifactFit` measures the real gap); 24px inset from the viewport edge.
- Never add `min-height` to `.bottomZone` — it forces a blank gap above the tracker.
- The artifact is placed by `useArtifactFit(W, H)` → `{ scale, left, top }` on an absolutely positioned `.wrap`; mark every HUD block (incl. `.bottomZone`) with `data-hud` so the hook avoids it. See design-spec "Artifact Fit".

**Hints (every level):**
- Define `HINTS`, one nudge per objective, next to `OBJECTIVES`. `const hint = useHint(HINTS, { active: screen === 'playing', completedIndices })` and render `<HintPill docked text={hint} />` just before `.bottomZone`. The pill shows after 10s without progress and hides on every completion; never mark it `data-hud`.

**Sound (every level):**
- Import `* as sfx from '../audio/sfx'`. Sounds are synthesised and quiet; trigger them from user actions or timers that follow a click. Keep the artifact's era: a Mac does not pop, a feed does not clack.

**Period pointers:**
- Levels whose hardware had a pointer set it on the artifact root with `cursor: var(--cursor-…)` from `era-cursors.css`; the artifact's own CSS uses `cursor: inherit`, links `var(--cursor-link, pointer)`.

**File structure for a new level:**
- `src/levels/LevelN.jsx` — screen state machine, museum wiring, artifact composition
- `src/levels/LevelN.module.css` — three-zone layout (topSpacer / artifactZone / bottomZone), mirrors existing levels exactly
- `src/components/[artifact]/` — all artifact-layer components and hooks, self-contained
- Levels are not gated. All levels are accessible regardless of completion state.

## Level 1 (1984 Mac) conventions

- `DesktopScene` keeps a general icon model (`ICONS`, `iconPositions`, `selected[]`); add desktop items there, not as one-off state. Windows are `{ id, type, title, pos, z, hidden, src }`; open with `openWindow(type, { from, src })` so the zoom rectangles run, close with `closeWindow(id)`.
- Everything on the Mac must be something Finder 1.0/1.1 did; design-spec "Level 1" lists the menus, DAs and sources. Mark anything reconstructed (alert wording, timings) as such in the spec.
- Desk accessories live in `src/components/da/`; Calculator/Puzzle use `DraggableWindow` variant `rdoc`, the Alarm Clock `plain` with `titleContent`.

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

**Lock button + home button wake behavior:**
- Invisible `<button className={styles.lockBtn}>` in PhoneFrame, positioned over the hardware sleep/wake button.
- Top face of bezel: `top: 8px; left: 110px; width: 220px; height: 45px`.
- Only plays lock sound when `phonePower === 'on'` — guard this in `useCallback` deps.
- Both the lock button and home button call `handleWake()` when `phonePower === 'off'`.

**PhoneFrame dimensions:**
- BEZEL_W=385, BEZEL_H=735
- Screen slot: top=131px, left=33px, width=320px, height=480px
- Home button: 44px circle, top=643px, left=calc(50%-22px)
