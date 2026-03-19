# UX Archaeologist — Design Specification

## Overview

UX Archaeologist is an interactive museum experience where the player excavates digital artifacts from different eras of computing. Each level recreates a historically authentic interface that the player explores and interacts with, uncovering key UX innovations along the way.

**Stack:** React + Vite SPA, CSS Modules
**Levels:** 6 playable levels (0–5)
**Duration:** 5–8 minutes total, ~60–90 seconds per level
**Audience:** Dual — works as a portfolio case study and a standalone shareable experience

---

## Routes

```
/               → TitleScreen (museum entrance)
/timeline       → Timeline / progression map
/level/0        → Level 0 — 1971 Unix Terminal
/level/1        → Level 1 — 1984 Macintosh Desktop
/level/2        → Level 2 — 1995 Netscape Web
/level/3        → Level 3 — 2007 iPhone
/level/4        → Level 4 — 2015 Social Feed
/level/5        → Level 5 — 2023 AI Interface
/collection     → Full artifact collection / shareable finale
```

Each level guards itself: if `isLevelComplete(N-1)` is false, redirect to `/level/N-1`. The `/collection` page is always accessible.

---

## Experience Architecture

### Progression
Linear: Level 0 → 1 → 2 → 3 → 4 → 5 → Timeline → Collection

### Per-Level Flow
1. **Arrive** — IntroModal overlays the artifact (museum layer). Artifact is inert.
2. **Boot** — Modal dismissed. Artifact boot/intro sequence plays (era-authentic). HUD hidden.
3. **Explore** — Player interacts with the artifact, completes 3 objectives.
4. **Discover** — Continue button appears. Player clicks → DiscoveryCard fades in. Artifact recorded. Player navigates to `/timeline`.

### Screen State Machine (every level)
```
'intro' → 'booting' → 'playing' → 'discovery'
```
- Level 2 has an additional `'loading'` state between 'intro' and 'booting' (simulates dial-up latency).
- Level 3 uses `museumScreen` + `'artifact'` instead of `screen` + `'discovery'` (naming inconsistency — future levels should use `screen` + `'discovery'`).

---

## Two Design Systems

### Museum Layer (consistent across all levels)
The curator's voice. Dark room background (#111), HUD, intro/discovery modals, objective tracker. Era-neutral and visually architectural.

**Rules:**
- Sharp corners (2px border-radius max) on all museum cards
- System sans-serif for body text
- Serif for level titles only
- Monospace for era labels and dates
- No era-specific fonts, ever
- Dark translucent backgrounds: `rgba(0,0,0,0.85)` for tracker
- White backgrounds for modals and discovery cards
- Thin 2px black accent line at top of each modal card
- Fade transitions only (300ms, ease-in-out). No bounces, slides, or era-specific animations.
- The museum is still. The artifact is alive.

### Artifact Layer (unique per level)
The historical object. Everything inside the device container. Era-authentic fonts, colors, behaviors. Never contaminated by museum UI.

**Rules:**
- Each level gets a unique device container matching its era's hardware
- All typography, color, and behavior inside the container is period-authentic
- No museum-layer elements render inside the device container
- The artifact should feel like something a real person could have used

---

## HUD Layout

Sits outside the device container in the dark museum space.

| Position | Element | Notes |
|----------|---------|-------|
| Top left | Era label + level title | Mono year + sans title. Stays visible during play. |
| Top right | Progress dots | One per level. Filled = complete, bright = current, empty = future. |
| Bottom left | ObjectiveTracker | Slides up when `screen === 'playing'`. Hidden during boot. |
| Bottom right | Continue button | Appears when all objectives complete. Wired via `useSetContinue`. |

---

## Shared Components

```
src/shared/museum-ui/
  IntroModal.jsx       props: era, title, description, objectives[], onBegin
  DiscoveryCard.jsx    props: era, artifactName, description, nextUrl="/timeline"
  ObjectiveTracker.jsx props: objectives[], completedIndices[]

src/shared/SharedLayout.jsx
  Contexts: useArtifactReady(), useSetContinue(), useFadeNavigate()

src/hooks/
  useBezelScale.js        scales artifact bezel to fit viewport with top/bottom margins
  useRubberBandScroll.js  iOS-style drag scroll: 0.3× rubber factor, cubic-bezier snap on release

src/state/state.js
  completeLevel(n), isLevelComplete(n), addArtifact({ name, era, description })
  Backed by localStorage.
```

---

## Three-Zone Layout (all levels)

```
Zone 1 — topSpacer    flex: 0 0 auto; height: var(--bottom-zone-height)
Zone 2 — artifactZone flex: 1; centers the scaled bezel
Zone 3 — bottomZone   padding: 16px 24px 24px; visibility: hidden until playing
```

`--bottom-zone-height: 180px` in each level's module.css. Never add `min-height` to `.bottomZone`.

---

## Dialog System

### IntroModal
White card, 2px black accent line, mono era label, serif title, sans body, objectives list, "Begin excavation" button (full-width black).

### ObjectiveTracker
Dark translucent card, "OBJECTIVES" label, checklist (unchecked = light, checked = strikethrough + muted). Slides up via `trackerSlideUp` keyframe when playing state begins.

### DiscoveryCard
White card, 2px black accent line, "ARTIFACT DISCOVERED", large mono year, artifact name, description, "Next excavation" button → `/timeline`.

---

## Container Progression

Hardware presence decreases across the arc: physical terminal → monitor bezel → browser window → handheld device → no device → no device → pure conversation.

| Level | Era | Container |
|-------|-----|-----------|
| 0 | 1971 | Green-screen terminal bezel (780×540px) |
| 1 | 1984 | Beige CRT monitor bezel (780×755px) |
| 2 | 1995 | Browser chrome — no device bezel |
| 3 | 2007 | iPhone silhouette (385×735px bezel, 320×480px screen) |
| 4 | 2015 | Floating app viewport — no bezel |
| 5 | 2023 | Chat window — no device, no chrome |

---

## Level Details

---

### Level 0: 1971 — The Terminal Arrives
**Status: Complete**

**Artifact:** Unix terminal session
**Discovery:** Command-Response Interaction
**Container:** `src/components/terminal/` — TerminalBezel + TerminalScreen; 780×540px
**Route:** `/level/0`

**IntroModal:**
- Era: `1971`
- Title: `The Terminal Arrives`
- Description: "Before icons, windows, or the web, there was a conversation. A researcher sat down at a terminal, typed a command, and waited. The machine replied. This was computing at its most direct — and its most demanding."

**Visual Palette:**
- Black screen, green phosphor text
- Monospace font throughout
- Blinking cursor

**Objectives (sequential):**
1. Read the notes file
2. Check your messages
3. Look up a command in the manual

**Discovery Card:**
- Artifact: `Command-Response Interaction`
- Text: "Before icons and touchscreens, computing required negotiation. You typed a precise request. The machine responded. Every modern interface — every tap, swipe, and voice command — is still a variation on this conversation. You just had it yourself."

---

### Level 1: 1984 — The Desktop Arrives
**Status: Complete**

**Artifact:** Macintosh System 1 desktop
**Discovery:** Direct Manipulation
**Container:** `MonitorBezel.jsx` — beige CRT SVG; 780×755px, 620×415px screen
**Route:** `/level/1`

**IntroModal:**
- Era: `1984`
- Title: `The Desktop Arrives`
- Description: "You're looking at the original Macintosh desktop from 1984. Explore the interface and complete the objectives to discover what made it revolutionary."

**Visual Palette:**
- Pure 1-bit: black and white only inside screen
- Checkered desktop pattern
- Chicago monospace font
- Striped window title bars
- Dashed drag outlines (~10fps, authentic to 8MHz 68000)

**Interactive Elements:**
- Documents folder icon (double-click to open text window)
- Projects folder icon (draggable to Trash)
- Trash icon (drop target, highlights on hover)
- Menu bar: File menu (New Folder, Open, Close, About This System)
- Windows: draggable by title bar with laggy outline, clamped to screen bounds

**Objectives (sequential):**
1. Find the document on this computer
2. Delete the Projects folder
3. Discover what commands are available

**Discovery Card:**
- Artifact: `Direct Manipulation`
- Text: "Before 1984, using a computer meant typing commands into a blank screen. The Macintosh let you point at things, drag them around, and open them with a click. You didn't need to learn the computer's language. It learned yours."

---

### Level 2: 1995 — The Hypertext Web
**Status: Complete**

**Artifact:** Academic homepage viewed in Netscape Navigator
**Discovery:** Hyperlink Navigation
**Container:** `src/components/web/BrowserChrome.jsx` — no device bezel; 700×520px
**Route:** `/level/2`

**IntroModal:**
- Era: `1995`
- Title: `The Hypertext Web`
- Description: "Information wasn't something you searched for. It was something you followed, one link at a time."

**Visual Palette:**
- Gray beveled browser chrome (outset borders, 3D button effect)
- White page content area
- Times New Roman body text, blue underlined links (#0000EE)
- Comic Sans / Courier for banners
- Animated marquee, "Under Construction" badges, visitor counter

**Pages (implemented):**
- `yahoo` — Yahoo! directory homepage
- `yahoo-computers` — Yahoo! Computers and Internet category
- `valley` — Valley Computer Repair & Sales
- `archive` — The Vintage Computer Archive (contains "A Brief History of the Web")

**Interactive Elements:**
- All sidebar/inline links navigate between pages
- Back / Forward buttons in toolbar (functional)
- 500ms load delay simulating dial-up

**Objectives (sequential):**
1. Navigate to a new page
2. Return to a previous page
3. Find "A Brief History of the Web"

**Discovery Card:**
- Artifact: `Hyperlink Navigation`
- Text: "The early web wasn't searched. It was browsed. Every page linked to other pages, and finding what you needed meant following a trail of connections that other people had made."

---

### Level 3: 2007 — Touch Arrives
**Status: Complete**

**Artifact:** Original iPhone interface
**Discovery:** Direct Touch Interaction
**Container:** `src/components/phone/PhoneFrame.jsx` — `assets/iphone.svg` at 385×735px; screen slot 320×480px
**Route:** `/level/3`

**IntroModal:**
- Era: `2007`
- Title: `Touch Arrives`
- Description: "For thirty years, a layer of abstraction stood between people and their computers — a mouse, a cursor, a keyboard. Then the glass became the interface."

**Visual Palette:**
- Skeuomorphic icon gradients, glossy reflections
- Rain-drop lock screen wallpaper (`assets/ios-rain-wallpaper.jpg`)
- Live status bar: AT&T, real clock, 75% battery
- Notes app: lined yellow paper, marker-style header font
- Defined in `src/components/phone/phone-theme.css`

**Interactive Elements:**
- Lock screen: drag-to-unlock slider (plays `assets/phone/unlock.mov`)
- Sleep/wake button (top bezel, 220×45px tap target): locks phone (plays `assets/phone/lock.mp3`)
- Tapping black screen wakes phone; 1s pause + 450ms boot animation
- Home screen: 2 swipeable pages, 12 icons + 4-app dock
- Only Notes app is interactive (other icons are decorative)
- Home button: returns to home screen from any app
- Notes app: list → detail slide transition, rubber-band scroll in detail view

**Phone hardware state machine:**
```
phonePower: 'off' | 'booting' | 'on'
```
Nested inside the museum `'playing'` state.

**Phone screen state machine:**
```
phoneScreen: 'lock' | 'unlocking' | 'home' | 'opening' | 'app' | 'closing'
```

**Notes content (3 notes, all 2007-authentic):**
- "Party playlist - Saturday" — 2007 pop playlist, Ask Mike if he has speakers
- "Book list" — reading list including Harry Potter 7 (July 21!!)
- "Grocery list - 4th of July" — BBQ supplies

**Objectives (3, independent — no sequential gating):**
1. Slide to unlock
2. Explore the Notes app (open any note)
3. Swipe between screens

**Discovery Card:**
- Artifact: `Direct Touch Interaction`
- Text: "For the first time, the interface disappeared. No mouse, no cursor, no abstraction layer. You touched the thing itself. Your finger became the input device, and the screen became the object."

---

### Level 4: 2015 — The Infinite Feed
**Status: Stub (not yet implemented)**

**Artifact:** Social media feed app (Instagram-like)
**Discovery:** Attention Economy Interfaces
**Container:** Floating app viewport, no device bezel (hardware has disappeared)
**Route:** `/level/4`

**IntroModal (planned):**
- Era: `2015`
- Title: `The Infinite Feed`
- Description: "The interface stopped waiting for you. It started optimizing for your attention."

**Visual Palette:**
- Clean flat design, white backgrounds
- Gradient story rings
- Card-based post layout
- Subtle shadows, rounded corners
- Colorful photo placeholders

**Planned Interactive Elements:**
- Scrollable feed (posts never end)
- Story bar at top (visual only)
- Notification toasts appearing OUTSIDE the app frame, into museum space
- Notification badge on frame edge
- Sponsored posts blended into feed
- Target post player must find

**Planned Objectives:**
1. Scroll the feed to find a specific target post
2. Dismiss 3 notification interruptions
3. Spot the sponsored content (or get fooled by it)

**Key Mechanic:** Notifications break into the museum HUD space — the fourth wall. Demonstrates that the interface now has its own agenda.

**Discovery Card (planned):**
- Artifact: `Attention Economy Interface`
- Text: "The interface learned to want your attention. Algorithms decided what you saw. Notifications interrupted what you were doing. The scroll never ended. For the first time, the interface had its own goals — and they weren't yours."

---

### Level 5: 2023 — The Conversational Interface
**Status: Not yet implemented**

**Artifact:** Large language model chat interface
**Discovery:** Language as Interface
**Container:** Minimal chat window — no device, no chrome, no hardware
**Route:** `/level/5`

**IntroModal (planned):**
- Era: `2023`
- Title: `The Conversational Interface`
- Description: "Every interface before this one required you to learn a new language — commands, clicks, swipes, taps. This one claims to already speak yours."

**Visual Palette:**
- Clean white/light gray chat window
- Two bubble columns: user (right, muted blue) and AI (left, white with light border)
- Subtle typing indicator animation
- Minimal chrome — just an input bar and send button
- No era-specific fonts; clean system sans-serif (this IS the era we're in)

**Container:**
- Floating chat window in the museum dark space
- No device frame — the interface is pure software, pure conversation
- Rounded corners (12px), subtle drop shadow

**Planned Interactive Elements:**
- Text input (player types real messages)
- Pre-scripted AI responses that react to keywords/intent
- "Thinking" typing indicator between messages
- At least one moment where the AI confidently states something wrong
- At least one moment where the AI reveals it can't do something (knowledge cutoff, refusal, etc.)
- A "surprising capability" moment — something the player didn't expect the AI to do

**Planned Objectives:**
1. Ask the AI a question and get a response
2. Discover something the AI doesn't know or gets wrong
3. Find something the AI can do that surprises you

**Key Mechanic:** The conversation feels natural — until it doesn't. The player experiences firsthand both the power and the opacity of language model interfaces: you don't know what it knows, how it was trained, or whose values shaped its answers.

**Discovery Card (planned):**
- Artifact: `Language as Interface`
- Text: "You didn't click, tap, or drag. You just talked. The machine talked back. But behind the fluency is a system you can't inspect — trained on text you didn't choose, optimized for goals you can't see. The most natural interface in history is also the least transparent."

---

## Typography Tokens

### Museum Layer
- **Era labels:** Monospace, 11px, #999, letter-spacing 0.1em
- **Level titles:** Serif, 22px, weight 400
- **Body text:** System sans-serif, 13px, #555, line-height 1.7
- **Objective label:** Sans-serif, 10px, uppercase, letter-spacing 0.08em, #999
- **Objective items:** Sans-serif, 13px, #333
- **Buttons:** Sans-serif, 13px, letter-spacing 0.02em

### Artifact Layer — Per Level
| Level | Primary Font | Notes |
|-------|-------------|-------|
| 0 | Monospace (Courier/system) | Green phosphor, everything fixed-width |
| 1 | Chicago / Courier New | 1-bit only, no anti-aliasing |
| 2 | Times New Roman (body), Courier New (URLs), Comic Sans (banners) | |
| 3 | -apple-system / Helvetica Neue | Defined in phone-theme.css |
| 4 | System sans-serif | Clean, flat |
| 5 | System sans-serif | Clean, minimal — this is the present |

---

## Color Tokens

### Museum Layer
| Token | Value |
|-------|-------|
| Background | `#111` |
| Modal background | `#fff` |
| Tracker background | `rgba(0,0,0,0.85)` |
| Accent line | `#333` (2px) |
| Primary text on white | `#111` |
| Secondary text on white | `#555` |
| Muted text on white | `#999` |
| Primary text on dark | `#ccc` |
| Secondary text on dark | `#777` |
| Progress dot — done | `#666` |
| Progress dot — active | `#fff` |
| Progress dot — future | transparent + `#444` border |

---

## Animation Rules

### Museum Layer
- Fade in/out only. 300ms, ease-in-out. No slides, bounces, or springs.
- ObjectiveTracker: `trackerSlideUp` keyframe, 400ms, 200ms delay after playing state.
- DiscoveryCard fades in over artifact on Continue click.

### Artifact Layer
Era-authentic only. Never use museum-layer easing inside the artifact.

**Level 0 — 1971:**
- Monospace text rendered character by character (typing animation)
- Blinking cursor via step-end keyframes

**Level 1 — 1984:**
- ~10fps drag outlines (choppy, authentic to 8MHz 68000)
- Instant window paint (no smooth transitions)

**Level 2 — 1995:**
- No CSS animations inside pages. Blinking text: step-end keyframes.
- Page load: 500ms delay (simulated dial-up)
- Browser Back/Forward: instant page swap

**Level 3 — 2007:**
- Boot: 1s pause → 450ms keyframe animation (clock slides down, slider slides up, wallpaper fades in)
- Unlock choreography: 5-phase, 800ms total (lock exit → black → dock → icons → home)
- App open: `scale(0.02) → scale(1)`, 300ms ease-out
- App close: `scale(1) → scale(0.02)`, 250ms ease-in
- Notes slide transition: translateX, 200ms ease-out
- Rubber-band scroll: linear drag, 0.3× damping past bounds; `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 300ms snap on release
- Sound effects: `audio.volume = 0.5` for all sounds

**Level 4 — 2015:**
- Smooth scroll (planned)
- Notification slide-in from right, into museum space

**Level 5 — 2023:**
- Typing indicator: 3-dot pulse animation
- Message appear: subtle fade-up, 150ms
- Input send: instant clear + message appended
