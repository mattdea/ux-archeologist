# UX Archaeologist - Design Specification

## Overview

UX Archaeologist is an interactive museum experience where the player excavates digital artifacts from different eras of computing. Each level recreates a historically authentic interface that the player explores and interacts with, uncovering key UX innovations along the way.

**Format:** Multi-page static site (HTML/CSS/JS)
**Levels:** 4 playable levels + 1 reflective epilogue
**Duration:** 5-7 minutes total, 60-90 seconds per level
**Audience:** Dual - works as a portfolio case study and a standalone shareable experience

---

## Experience Architecture

### Progression
Linear: Level 1 → Level 2 → Level 3 → Level 4 → Epilogue → Collection

### Per-Level Flow (3 moments per level)
1. **Arrive** - Intro modal overlays the artifact (museum layer)
2. **Explore** - Player interacts with the artifact, completes objectives
3. **Discover** - Discovery card animates in over the artifact, artifact counter increments, "Next excavation" button navigates to next level page

### Routes
- `/` - Title screen (museum entrance)
- `/level/1` - 1984 Mac desktop
- `/level/2` - 1995 Netscape web
- `/level/3` - 2007 iPhone
- `/level/4` - 2015 Social feed
- `/collection` - Finale / full artifact timeline (also accessible after completion as shareable URL)

### State Management
- `localStorage` tracks: current level, completed levels, collected artifacts
- Each level page checks state on load and redirects if prerequisites aren't met
- `/collection` page is always accessible (shows what you've earned so far)
- Reset button in collection view clears state and returns to title

---

## Two Design Systems

### Museum Layer (consistent across all levels)
The curator's voice. Dark room background, HUD, intro/discovery modals, objective tracker, hint pills, and transitions. This layer is era-neutral and visually architectural.

**Rules:**
- Sharp corners (2px border-radius max) on all museum cards
- System sans-serif for body text
- Serif for level titles only
- Monospace for dates and era labels
- No era-specific fonts, ever
- Dark translucent backgrounds for tracker and hints
- White card backgrounds for modals and discovery cards
- Thin 2px black accent line at top of each modal card
- Fade transitions only (no bounces, slides, or era-specific animations)
- The museum is still. The artifact is alive.

### Artifact Layer (unique per level)
The historical object. Everything inside the device container. Era-authentic fonts, colors, behaviors, and interaction patterns. Never contaminated by museum UI.

**Rules:**
- Each level gets a unique "display case" (device container) matching its era's hardware
- All typography, color, and behavior inside the container is period-authentic
- No museum-layer elements render inside the device container
- The artifact should feel like a real object someone could have used

---

## HUD Layout

The HUD sits outside the device container in the dark museum space.

| Position | Element | Behavior |
|----------|---------|----------|
| Top left | Era label + level title | `1984` (mono) + "The desktop arrives" (sans). Stays visible during gameplay. Subtle. |
| Top right | Progress dots | 4 dots for 4 levels. Filled = complete, bright = current, empty = upcoming. No numbers. |
| Bottom left | Artifact counter | "2 of 12 artifacts collected" - running count, grows across levels. |
| Bottom right | Contextual hint | One-line nudge in a dark pill. Fades out once the action is taken. |

---

## Dialog System (4 Types)

All dialogs are museum-layer elements. They share one visual language.

### 1. Level Intro Modal
- White card, sharp corners (2px radius), 2px solid black accent line across top
- Content: mono era label, serif level title, sans body text, divider, objectives list with empty checkboxes, "Begin excavation" button (full-width, black bg, white text)
- Overlays the artifact with a dark scrim behind it
- Identical styling regardless of which artifact is behind it

### 2. Objective Tracker
- Dark translucent card (rgba black, backdrop blur)
- Thin 1.5px accent line across top
- Uppercase "OBJECTIVES" label in small muted text
- Checklist items: unchecked = light text, checked = strikethrough + muted
- "Continue" button (disabled until all complete, then becomes visible)
- **Placement varies by level:**
  - 1984: Bottom-left, overlaying the Mac screen
  - 1995: Bottom-left, overlaying the browser viewport
  - 2007: Below the phone frame, in the dark museum space (phone screen is too small to overlay)
  - 2015: Bottom-left, overlaying the feed

### 3. Discovery Card
- White card, sharp corners, 2px black accent line at top
- Content: "ARTIFACT DISCOVERED" label, large mono year, divider, artifact name (18px, 500 weight), educational description (13px, sans), "Next excavation" button
- Animates in (fade) over the artifact after all objectives complete
- Artifact counter in HUD increments when this card appears

### 4. Contextual Hint Pill
- Dark translucent pill (rounded, ~20px radius)
- One-line italic text in muted color
- Fades in when the player hasn't acted on the current objective for a few seconds
- Fades out immediately when the player performs the relevant action
- Examples: "Double-click to open", "Swipe left to see more", "Scroll down to continue"

---

## Container Progression

The device container tells its own story: computing moved from physical objects to invisible infrastructure.

### Level 1 - 1984: Beige CRT Monitor
- Heavy beige plastic bezel with rounded corners
- Black screen surround
- Rainbow Apple logo (bottom left)
- Green power LED (bottom right)
- 620x415px screen area inside
- Strongest physical presence of any level

### Level 2 - 1995: Browser Window (Netscape)
- No device bezel. The browser chrome IS the container
- Blue title bar with window controls
- Gray beveled toolbar: Back, Forward, Reload, Home buttons
- Location bar with URL
- N throbber icon (top right)
- The shift from physical device to software window

### Level 3 - 2007: Original iPhone
- Black slab silhouette
- Silver speaker grille at top
- Physical home button with square icon at bottom
- 320x480 aspect ratio screen
- 2px dark border, rounded corners (36px)
- The return of a physical device, but sleeker

### Level 4 - 2015: No Device Frame
- Floating app viewport with soft corners (12px radius)
- Against the dark museum background directly
- No bezel, no chrome, no hardware
- Notifications and badges appear OUTSIDE the frame, breaking into the museum space
- The hardware has disappeared entirely

### Epilogue - 2025: Empty Screen
- No container at all
- Just text on the dark background with a blinking cursor
- The progression endpoint: the interface has become invisible

---

## Level Details

### Level 1: 1984 - The Desktop Arrives

**Artifact:** Macintosh System 1 desktop
**Discovery:** Direct Manipulation
**Container:** Beige CRT monitor bezel

**Visual Palette:**
- Pure 1-bit: black and white only inside the screen
- Checkered desktop pattern
- Chicago monospace font for all UI text
- Striped window title bars
- Dashed drag outlines at ~10fps (authentic to 8MHz 68000)

**Interactive Elements:**
- Notes icon (double-click to open scrollable text window)
- Projects folder icon (draggable to Trash)
- Trash icon (drop target, highlights on hover)
- Menu bar: File menu with New Folder / Open / Close / About This System
- Windows: draggable by title bar with laggy outline effect, clamped to screen bounds

**Objectives:**
1. Open the Notes file (double-click) - teaches direct manipulation
2. Drag Projects folder to Trash - teaches desktop metaphor
3. Use the File menu - teaches persistent menu bar

**In-Artifact Content (Notes file):**
Era-authentic journal entry from a first-time Mac user, not a retrospective essay. Example tone: "Jan 25, 1984 - Finally got the Macintosh set up on my desk today. Susan showed me how the mouse works..."

**Discovery Card Text:**
"Instead of typing abstract commands, users could act directly on visible objects: open folders, move files, and choose commands from menus. The Macintosh proved that interfaces could mirror physical intuition. You just did it yourself."

---

### Level 2: 1995 - The Hypertext Web

**Artifact:** Academic homepage viewed in Netscape Navigator
**Discovery:** Hyperlink Navigation
**Container:** Netscape browser chrome (no device bezel)

**Visual Palette:**
- Teal/dark blue sidebar, white main content area
- Times New Roman / serif body text
- Blue underlined links (#0000EE)
- Comic Sans or Courier for banners
- Beveled 3D button chrome (outset borders)
- Animated marquee text
- "Under Construction" badges
- Visitor counter

**Interactive Elements:**
- Sidebar navigation links (clickable, navigate between 2-3 pages)
- Back/Forward buttons in toolbar (functional)
- Inline text links
- Guestbook sign form (non-functional, era flavor)
- Blinking "NEW!" text

**Objectives:**
1. Click a link to navigate to another page
2. Use the Back button to return
3. Find Dr. Sato's research paper (requires navigating across 2 pages)

**In-Artifact Content:**
Dr. Sato's academic homepage about UX history. This IS the period-authentic content - a real-feeling 90s academic site that happens to be about interface history. The "research paper" contains a plausible abstract.

**Discovery Card Text:**
"Instead of searching for information or requesting it from a system, users could follow connections between documents. The web made knowledge spatial: not a destination, but a path you chose to walk."

---

### Level 3: 2007 - Touch Arrives

**Artifact:** Original iPhone interface
**Discovery:** Direct Touch Interaction
**Container:** iPhone silhouette (black slab, home button) — `assets/iphone.svg`, rendered at 385×735px

**Visual Palette:**
- Skeuomorphic icon gradients, glossy reflections
- Rain-drop wallpaper on lock screen (`assets/ios-rain-wallpaper.jpg`)
- Status bar: AT&T carrier, live time, 75% battery
- Notes app: lined yellow paper texture, marker-style header font
- Phone theme vars defined in `src/components/phone/phone-theme.css`

**Interactive Elements (built):**
- Lock screen with drag-to-unlock slider (sound: `assets/phone/unlock.mov`)
- Sleep/wake button on top bezel — locks phone (sound: `assets/phone/lock.mp3`); tapping black screen wakes
- Home screen: 2 pages, 12 icons + 4-app dock. Only Notes is interactive.
- Swipe between home screen pages (page dots indicator)
- Physical home button: returns from Notes to home screen
- Notes app: list → detail slide transition, 3 era-authentic notes (2007 content)
- Rubber-band scroll in note detail view (drag only, no wheel; iOS ease-out snap on release)

**Phone hardware state machine (phonePower):** `'off' | 'booting' | 'on'`
- Off: black screen, tap anywhere to wake
- Booting: LockScreen animates in via keyframes (450ms)
- On: fully interactive

**Objectives (3, independent — no sequential gating):**
1. Slide to unlock
2. Explore the Notes app (open any note)
3. Swipe between screens

**In-Artifact Notes Content:**
- "Party playlist - Saturday" — 2007 pop playlist
- "Book list" — reading list with Harry Potter 7 release note
- "Grocery list - 4th of July" — BBQ supplies

**Discovery Card Text:**
"For the first time, the interface disappeared. No mouse, no cursor, no abstraction layer. You touched the thing itself. Your finger became the input device, and the screen became the object."

---

### Level 4: 2015 - The Infinite Feed

**Artifact:** Social media feed app (Instagram-like)
**Discovery:** Attention Economy Interfaces
**Container:** No device frame (floating viewport)

**Visual Palette:**
- Clean flat design, white backgrounds
- Gradient story rings (Instagram-style)
- Card-based post layout
- Subtle shadows and rounded corners
- Sans-serif typography throughout
- Colorful photo placeholders

**Interactive Elements:**
- Scrollable feed with posts
- Story bar at top (visual only)
- Notification toasts appearing OUTSIDE the app frame
- Notification badge on the frame edge
- Sponsored posts blended into feed
- "Target post" the player needs to find
- Pull-to-refresh (optional)

**Objectives:**
1. Scroll the feed to find a specific target post
2. Dismiss 3 notification interruptions
3. Notice the sponsored content insertion (or get tricked by it)

**Key Mechanic:** Notifications appear outside the app frame, breaking the fourth wall into the museum HUD space. The feed is shuffled so the target post isn't where you'd expect. The player feels the manipulation firsthand.

**In-Artifact Content:**
Generic social content. Posts from accounts like "interface_history" and "retro_computing." The target post could be something like a real-feeling social post: "TIL the first banner ad had a 44% click rate."

**Discovery Card Text:**
"The interface learned to want your attention. Algorithms decided what you saw. Notifications interrupted what you were doing. The scroll never ended. For the first time, the interface had its own goals, and they weren't yours."

---

### Epilogue: 2025 - What Comes Next?

**Not a playable level.** A reflective coda.

The screen is empty except for a blinking cursor and a question:

> "What patterns are you living inside right now that you can't see yet?"

Short supporting text: "Every interface in this exhibit was once invisible. The desktop, the link, the swipe, the feed. They shaped how people thought before anyone noticed they were being shaped."

"View your collection" button transitions to the full collection/timeline view.

**Portfolio Signal:** Shows the player (and potential employers) that you think critically about design futures, not just design history.

---

## Content Strategy

### In-Artifact Content: Option A + C
Primary content inside each artifact should be era-authentic. It should feel like a real person's real content from that time period.

Each level may include one "found document" that's a period-appropriate piece of writing about the technology itself:
- 1984: Journal entry from a new Mac user
- 1995: Academic homepage that happens to be about UX history
- 2007: Mundane personal app content (grocery list, notes)
- 2015: Social posts from design-adjacent accounts

### Educational Content Placement
- **During gameplay:** Minimal. The interactions teach through doing.
- **Discovery cards:** 2-3 sentence synthesis of the key insight. Museum voice.
- **Collection/timeline view:** Deeper historical context, hardware specs, connections to prior innovations. This is where the detailed essay content lives.

---

## Typography Tokens

### Museum Layer
- **Titles:** Serif, 22px, weight 400
- **Era labels:** Monospace, 11px, color #999, letter-spacing 0.1em
- **Body:** System sans-serif, 13px, color #555, line-height 1.7
- **Objective labels:** Sans-serif, 10px, uppercase, letter-spacing 0.08em, color #999
- **Objective items:** Sans-serif, 13px, color #333
- **Hint pills:** Sans-serif, 11px, italic, color #999
- **Buttons:** Sans-serif, 13px, letter-spacing 0.02em

### Artifact Layer
Each level has its own type stack. Never mix.
- 1984: Chicago / Courier New monospace
- 1995: Times New Roman (body), Courier New (code/URLs), Comic Sans (banners)
- 2007: -apple-system / Helvetica Neue
- 2015: System sans-serif (clean, modern)

---

## Color Tokens

### Museum Layer
- Background: #111 (dark room)
- Card backgrounds: #fff (modals), rgba(0,0,0,0.85) (tracker)
- Accent line: #333 (2px, top of modals)
- Primary text on white: #111
- Secondary text on white: #555
- Muted text on white: #999
- Primary text on dark: #ccc
- Secondary text on dark: #777
- Muted text on dark: #444
- Hint pill bg: rgba(0,0,0,0.75)
- HUD text: #555 (labels), #999 (values)
- Progress dots: #444 (border), #666 (filled/done), #fff (active)

### Artifact Layer
Each level defines its own palette. The museum layer never uses artifact colors and vice versa.

---

## Animation Rules

### Museum Layer
- Fade in/out only. Duration: 300ms. Easing: ease-in-out.
- No bounces, slides, or era-specific animations.
- Discovery card fades in over artifact.
- Hint pill fades in after 5 seconds of inactivity, fades out on action.

### Artifact Layer
- Era-authentic animations only.
- 1984: 10fps drag outlines (choppy, authentic to hardware)
- 1995: No CSS animations. Static page. Blinking text via step-end keyframes.
- 2007: Smooth iOS-style transitions:
  - Boot: ~1s pause after Begin Excavation, then 450ms keyframe animation (panels fly in from off-screen)
  - Unlock: 5-phase choreography — lock screen exits (300ms), black pause, dock fades in, icons fly in, done (800ms total)
  - App open/close: scale from center dot (300ms ease-out / 250ms ease-in)
  - Notes slide: translateX transition, 200ms ease-out
  - Rubber-band scroll: linear drag with 0.3× damping past bounds; snap-back via `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 300ms
- 2015: Smooth scroll, notification slide-in from right
