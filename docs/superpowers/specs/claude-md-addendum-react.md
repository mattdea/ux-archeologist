# UX Archaeologist - Claude Code Conventions (React/Vite)

> Merge this into the existing CLAUDE.md or keep it as a referenced file.
> See docs/design-spec.md for the full design specification.

## Project Overview
UX Archaeologist is a multi-route React SPA built with Vite. 4 playable levels + 1 epilogue. Each level recreates a historical computing interface. The app uses React Router for navigation between levels.

## Architecture

### Tech Stack
- Vite + React
- React Router (client-side routing)
- No state management library (useState/useContext only)
- No CSS framework (plain CSS or CSS modules per component)
- Vitest + Testing Library for tests

### File Structure
```
src/
  App.jsx                        # Router setup only, no game logic
  shared/
    SharedLayout.jsx             # Dark bg, HUD, <Outlet />
    museum-ui/
      IntroModal.jsx             # Level intro overlay
      ObjectiveTracker.jsx       # Persistent objective checklist
      DiscoveryCard.jsx          # Post-completion artifact card
      HintPill.jsx               # Contextual hint pill
      museum-ui.css              # All museum layer styles
    state.js                     # localStorage helpers
    layout.css                   # Dark background, HUD styles
  levels/
    Level1.jsx                   # 1984 Mac (orchestrates screen state)
    Level2.jsx                   # 1995 Netscape web
    Level3.jsx                   # 2007 iPhone
    Level4.jsx                   # 2015 Social feed
  components/                    # Level-specific components
    mac/                         # Level 1 components
      DesktopScene.jsx
      MonitorBezel.jsx
      BootSequence.jsx
      mac-styles.css
    web/                         # Level 2 components
      BrowserChrome.jsx
      WebPage.jsx
      web-styles.css
    phone/                       # Level 3 components
      PhoneFrame.jsx
      HomeScreen.jsx
      LockScreen.jsx
      phone-styles.css
    feed/                        # Level 4 components
      FeedApp.jsx
      Post.jsx
      NotificationToast.jsx
      feed-styles.css
  pages/
    TitleScreen.jsx              # Museum entrance
    Epilogue.jsx                 # Reflective coda
    Collection.jsx               # Final timeline view
docs/
  design-spec.md                 # Full design specification
```

### Routing
```jsx
<Routes>
  <Route element={<SharedLayout />}>
    <Route path="/" element={<TitleScreen />} />
    <Route path="/level/1" element={<Level1 />} />
    <Route path="/level/2" element={<Level2 />} />
    <Route path="/level/3" element={<Level3 />} />
    <Route path="/level/4" element={<Level4 />} />
    <Route path="/epilogue" element={<Epilogue />} />
    <Route path="/collection" element={<Collection />} />
  </Route>
</Routes>
```

### Separation of Concerns

**SharedLayout** owns:
- Dark room background (#111)
- HUD bar (era label, progress dots, artifact counter, hint area)
- Renders `<Outlet />` for level content

**Each Level component** owns:
- Its device container/bezel
- All era-specific interactions and styling
- Its own screen state machine (intro → playing → complete)
- Communicates with museum UI via props/callbacks

**Museum UI components** own:
- Their own styling (museum layer visual language)
- Accept data via props, emit events via callbacks
- Never import or reference era-specific styles

**Level-specific components** own:
- Era-authentic visuals and behavior
- Never import museum-ui.css or shared layout styles

### State API (`src/shared/state.js`)
```javascript
export function getCurrentLevel()           // returns 1-4
export function completeLevel(n)            // marks done, advances
export function isLevelComplete(n)          // returns boolean
export function getCollectedArtifacts()     // returns [{name, era, description}]
export function addArtifact(artifact)       // adds to collection
export function getArtifactCount()          // returns {collected, total}
export function resetAll()                  // clears everything
```

Uses localStorage under a namespaced key: `ux-archaeologist-state`.

### Level ↔ Museum Communication Pattern
```jsx
// Inside Level1.jsx
const [completedObjectives, setCompleted] = useState([]);

function handleObjectiveComplete(index) {
  setCompleted(prev => [...prev, index]);
}

function handleAllComplete() {
  addArtifact({
    name: 'Direct Manipulation',
    era: '1984',
    description: '...'
  });
  completeLevel(1);
  // Show discovery card
}

return (
  <>
    <MonitorBezel>
      <DesktopScene onObjectiveComplete={handleObjectiveComplete} />
    </MonitorBezel>
    <ObjectiveTracker
      objectives={['Open the Notes file', 'Drag Projects to Trash', 'Use the File menu']}
      completedIndices={completedObjectives}
      onContinue={handleAllComplete}
    />
    <HintPill text={currentHint} visible={showHint} />
  </>
);
```

Levels should NOT directly manipulate museum UI DOM. Use React props and state.

## Build Rules

### One structural change per prompt
Never combine refactoring with new features. Verify each change works before proceeding.

### Visuals first, logic second
For each new level:
1. Build the static visual container and content (no interactions)
2. Review and approve the visuals
3. Add interaction handlers and objective logic in a separate prompt

### Don't change what you weren't asked to change
When modifying a specific file or feature, do not refactor, rename, or restructure other files unless explicitly asked.

### Testing checklist (verify after every change)
- [ ] `npm run dev` starts without errors
- [ ] Title screen loads at `/`
- [ ] Level 1 loads at `/level/1` with intro modal
- [ ] "Begin Excavation" dismisses modal and reveals artifact
- [ ] All three Level 1 objectives can be completed
- [ ] Discovery card appears with correct content
- [ ] "Next excavation" navigates to `/level/2`
- [ ] HUD dots reflect correct progress
- [ ] Artifact counter shows correct count
- [ ] State persists across page refresh
- [ ] Browser back/forward buttons work correctly

### Commit after every working state
Git commit after each prompt that produces working output. If a later change breaks things, revert.

## Visual Guardrails

### Museum Layer (src/shared/)
- Sharp corners (2px border-radius max) on museum cards
- White (#fff) backgrounds for modals
- Dark translucent (rgba(0,0,0,0.85)) for tracker
- 2px solid #333 accent line at top of modals
- System sans-serif body, serif titles, monospace dates
- Fade transitions only (300ms ease-in-out)
- No era-specific fonts, colors, or animations

### Artifact Layer (src/components/{era}/)
- Era-authentic visual language only
- Never import museum-ui.css
- Never use museum layer color tokens or typography
- Each era defines its own CSS in its own directory

### The Sharp/Round Rule
- Museum elements: sharp corners (2px max). Architectural feel.
- Artifact elements: corners match the era (rounded bezels, soft buttons, etc.)
- This visual grammar helps the player distinguish curator from artifact subconsciously.
