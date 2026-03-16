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

**After completing a level, always return to the timeline:**
- `DiscoveryCard nextUrl` is always `"/timeline"` — never `/level/N`.
- The timeline marks the level complete and unlocks the next artifact.

**Boot sequence:**
- Every level has a boot/intro sequence that plays after "Begin Excavation" is clicked.
- HUD elements (ObjectiveTracker, era label, progress dots) are hidden during boot.
- They appear only after boot completes and the artifact is interactive.
- `startBoot(onComplete)` pattern: expose a function from the artifact hook, call it from a `useEffect` that watches `screen === 'booting'`, pass `() => setScreen('playing')` as the callback.

**Replay behavior:**
- If `isLevelComplete(N)` is true on load, skip `'intro'` and start at `'booting'` directly.
- `completedIndices` starts as `[0,1,2]` (all done) on replay.

**Focus:**
- Artifact input (if any) should auto-focus when `phase !== 'booting'` (i.e. on phase transition to the first interactive phase).
- Document-level keydown recapture should also be active for any interactive phase, not just 'shell'.

**Objective gating:**
- Objectives fire sequentially via `tryFireObjective(idx)` — idx N requires idx N-1 in `completedIndices`.
- Use refs (`onObjRef`, `completedRef`) to avoid stale closures in async callbacks.

**File structure for a new level:**
- `src/levels/LevelN.jsx` — screen state machine, museum wiring, artifact composition
- `src/levels/LevelN.module.css` — three-zone layout (topSpacer / artifactZone / bottomZone), mirrors existing levels exactly
- `src/components/[artifact]/` — all artifact-layer components and hooks, self-contained
- Gate the level in `LevelN.jsx`: redirect to `/level/N-1` if `isLevelComplete(N-1)` is false
