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
/level/4        → Level 4 — 2016 Social Feed
/level/5        → Level 5 — 2023 AI Interface
/collection     → Full artifact collection / shareable finale
```

All levels are freely accessible. Sequential order is suggested but not enforced. The `/collection` page is always accessible.

---

## Experience Architecture

### Progression
Sequential order is suggested but not enforced: Level 0 → 1 → 2 → 3 → 4 → 5 → Collection. All levels are freely accessible at any time. Completing a level navigates directly to the next level (DiscoveryCard nextUrl).

### Per-Level Flow
1. **Arrive** — IntroModal overlays the artifact (museum layer). Artifact is inert.
2. **Boot** — Modal dismissed. Artifact boot/intro sequence plays (era-authentic). HUD hidden.
3. **Explore** — Player interacts with the artifact, completes 3 objectives.
4. **Discover** — Continue button appears. Player clicks → DiscoveryCard fades in. Artifact recorded. Player navigates to the next level (or `/collection` after Level 5).

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
  DiscoveryCard.jsx    props: era, artifactName, description, nextUrl="/timeline" (all levels)
  ObjectiveTracker.jsx props: objectives[], completedIndices[]

src/shared/SharedLayout.jsx
  Contexts: useArtifactReady(), useSetContinue(), useFadeNavigate()

src/hooks/
  useBezelScale.js        scales artifact bezel to fit viewport with top/bottom margins
  useRubberBandScroll.js  iOS-style drag scroll: 0.3× rubber factor, cubic-bezier snap on release

src/shared/museum-ui/AboutModal.jsx        no props — standalone modal, opened from TitleScreen
src/shared/museum-ui/AboutModal.module.css

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
| 4 | 2016 | Ghost iPhone 6: hairline outline + screen glow, 375×667px screen (`GhostDevice`) |
| 5 | 2023 | Full-width chat panel — no device, no chrome, no frame |

---

## Level Details

---

### Level 0: 1971 — The Command Line
**Status: Complete**

**Artifact:** Unix terminal session
**Discovery:** Command & Response
**Container:** `src/components/terminal/` — TerminalBezel + TerminalScreen; 780×540px
**Route:** `/level/0`

**IntroModal:**
- Era: `1971`
- Title: `The Command Line`
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
- Artifact: `Command & Response`
- Text: "Before icons and touchscreens, computing required negotiation. You typed a precise request. The machine responded. Every modern interface — every tap, swipe, and voice command — is still a variation on this conversation. You just had it yourself."

---

### Level 1: 1984 — The Desktop
**Status: Complete**

**Artifact:** Macintosh System 1 desktop
**Discovery:** Direct Manipulation
**Container:** `MonitorBezel.jsx` — beige CRT SVG; 780×755px, 620×415px screen
**Route:** `/level/1`

**IntroModal:**
- Era: `1984`
- Title: `The Desktop`
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

### Level 2: 1995 — The Hyperlink
**Status: Complete**

**Artifact:** Academic homepage viewed in Netscape Navigator
**Discovery:** Hyperlink Navigation
**Container:** `src/components/web/BrowserChrome.jsx` — no device bezel; 700×520px
**Route:** `/level/2`

**IntroModal:**
- Era: `1995`
- Title: `The Hyperlink`
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

### Level 3: 2007 — The Touchscreen
**Status: Complete**

**Artifact:** Original iPhone interface
**Discovery:** Multi-Touch
**Container:** `src/components/phone/PhoneFrame.jsx` — `assets/iphone.svg` at 385×735px; screen slot 320×480px
**Route:** `/level/3`

**IntroModal:**
- Era: `2007`
- Title: `The Touchscreen`
- Description: "For thirty years, a layer of abstraction stood between people and their computers — a mouse, a cursor, a keyboard. Then the glass became the interface."

**Visual Palette:**
- Skeuomorphic icon gradients, glossy reflections
- Rain-drop lock screen wallpaper (`assets/ios-rain-wallpaper.jpg`)
- Live status bar: AT&T, real clock, 75% battery
- Notes app: lined yellow paper, marker-style header font
- Defined in `src/components/phone/phone-theme.css`

**Interactive Elements:**
- Lock screen: drag-to-unlock slider (plays `assets/phone/unlock.mp3`)
- Sleep/wake button (top bezel, 220×45px tap target): locks phone (plays `assets/phone/lock.mp3`); also wakes phone if off
- Home button wakes phone if off
- Tapping black screen wakes phone; 300ms pause + 450ms boot animation
- Home screen: 2 swipeable pages, 12 icons + 4-app dock
- Only Notes app is interactive (other icons are decorative)
- Home button: returns to home screen from any app; also wakes phone if `phonePower === 'off'`
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
- Artifact: `Multi-Touch`
- Text: "For the first time, the interface disappeared. No mouse, no cursor, no abstraction layer. You touched the thing itself. Your finger became the input device, and the screen became the object."

---

### Level 4: 2016 — The Feed
**Status: Complete**

**Artifact:** Instagram for iOS, spring 2016 (blue header, dark tab bar: the UI just before the May 2016 redesign)
**Discovery:** Algorithmic Feed
**Container:** `src/components/feed/GhostDevice.jsx` — hairline iPhone 6 outline and screen glow, 375×667px screen; no solid bezel and no side-button ticks (the hardware is fading out between Level 3 and Level 5)
**Route:** `/level/4`

**IntroModal:**
- Era: `2016`
- Title: `The Feed`
- Description: "The interface stopped waiting for you. It started optimizing for your attention."

**Visual Palette:**
- Header blue `#12558a`; status bar 20pt + nav bar 44pt; white script wordmark
- Dark tab bar `#26272b`, selected tab a slightly lighter tile `#313236`, camera tab in header blue
- Body text Helvetica Neue 13pt; nav titles, FOLLOWING / YOU toggle, section labels and the Explore hero in Proxima Nova (Montserrat fallback, loaded in `index.html`)
- Links, usernames and likes in header blue; `#4090db` for the selected grid icon, Follow button and empty-state arrow
- Laid out at the 4-inch size (320×568pt) and scaled ×1.18125 to fill the iPhone 6 screen, as the iPhone 6 Display Zoom setting did (`.feedZoom`), so type reads at the size of the 320pt reference screenshots
- Overscan, never flush edges: the app is drawn 1.5px past the glass on every side and the screen clips it. The unit sits at fractional pixels, so an app edge exactly on the glass edge leaves a part-covered pixel where lower layers show as a light hairline (this happened at the tab bar). Don't size the app to exactly 375×667
- Reference screenshots: `docs/reference/`

**Screens:**
- Home: feed of posts (header, square photo, action row, likes, caption, comments). Nearing the bottom loads a page of older posts (one more per real account, labelled a day older each page) until every account runs out; pulling the list ~100pt past its top shows a spinner and re-deals the feed. Every page load deals it fresh too (`buildFeed(seed)`): real accounts swap slots and posts, friends, ads and the target stay put
- Explore (search tab): dark-blue Search field, PRESS PLAY / EXPLORE VIDEOS hero, sideways TRENDING TAGS row, 3-column EXPLORE POSTS grid that keeps loading; starts from a new offset on every load and on pull-to-refresh
- Activity (heart tab): FOLLOWING / YOU toggle, notification rows (avatar, blue usernames, grey time, thumbnails); new likes trickle into Following while the player is in the feed, with a count badge on the tab
- Profile: username title (gear on your own, back chevron on others), avatar, posts / followers / following, Edit Profile or Follow, grid / list / pin / tagged row, 3-column grid; your own profile is the 2016 first-run empty state with a blue arrow toward the camera tab; verified accounts show the blue check by their name
- Post detail (PHOTO / VIDEO): the same post card, pushed over any tab

**Interactive Elements:**
- Tab bar switches tabs; re-tapping the current tab pops to its root
- Tapping a username or avatar opens that profile, as does a commenter's name when that account has a profile (`hasProfile()`); tapping a grid tile opens the post; Back pops. Nav-bar buttons have a 44pt tap target that extends 10pt past the glyph
- Sponsored posts: tapping the photo shows the ad overlay; LEARN MORE / Sponsored open the in-app browser (see objective 2)
- Double-tap a photo: big white heart springs in (~250ms), holds, fades by ~900ms; action-row heart fills red and bounces; like count moves by one. The heart button toggles like / unlike
- Follow / Unfollow on a profile or Activity row updates everywhere (`followStore.js`): exact follower counts move by one, abbreviated ones stay put
- Press-and-drag scrolling with iOS fling (0.998/ms deceleration), 0.3× rubber band and snap-back; mouse wheel also works; a drag never counts as a tap; releasing ≥30pt of rubber band past the top fires `pullrefresh` (`useDragScroll.js`)
- Level 3's fingertip TouchCursor replaces the system cursor on the screen

**Data:**
Accounts come from three sources, in order of preference, each falling back to the next:
1. `assets/feed/archive/` — real accounts as archived by the Wayback Machine in spring 2016 (bio, counts, posts with real captions, like counts, dates and photos), recovered by `scripts/recover-instagram-2016.py`; read by `archiveData.js`
2. `assets/feed/library/` — real accounts and photos from Instagram's own blog, Jan–May 2016, each photo owned by exactly one account; read by `libraryData.js`
3. Plain color blocks, when neither folder is present

**Dates:** nothing is filtered by date. Every photo on disk loads, and timestamps are labels by position: the feed's come from the hand-ranked `FEED` list in `feedData.js` (one `[username, timestamp]` pair per slot; ads carry `null`), and profile grids use `gridTime(index)` in `archiveData.js` (3h, 1d, 2d … then weeks), so every surface reads as today regardless of when a capture was made.

The home feed is 24 posts in a hand-ranked order (`FEED` in `feedData.js`): 18 recognisable real accounts, four invented friends (marcus.h, julia.creates, sarah.moments and imani.brooks, whose post is the target), and two ads. Imani's photos are Unsplash (free licence) in `assets/feed/friends/imani.brooks/`; the real Instagram photos and account data are committed too (non-commercial, educational use), so the public site shows the same feed. See `assets/feed/README.md`.

**Objectives (3, independent):**
1. Find Imani's post — she has news (imani.brooks's "it's OUT 🎉 my first editorial", slot 14, under three celebrities and the second ad)
2. Learn more about a sponsored post — completes when the in-app browser opens. Tapping a sponsored *photo* reveals the March 2016 ad overlay (photo blurred and dimmed, an outlined ↗ circle, the advertiser's name and domain; reference: `docs/reference/ads/`); tapping elsewhere on it dismisses. LEARN MORE, the Sponsored label or the overlay's arrow open the in-app browser (`InAppBrowser.jsx`): slides up over the whole app in 350ms, keeps the status bar, covers the tab bar, leaves the feed mounted at its scroll position, and closes in reverse. Its chrome (light grey bar, X, bold title over grey domain, ellipsis with a Copy Link / Open in Safari / Cancel action sheet, blue progress bar) is a reconstruction — unverified — with every value in `BROWSER_CHROME`. The destination is a locally built page (`AirbnbLiveThere.jsx`, keyed by the post's `ad.page` in `AD_PAGES`), a reconstruction of Airbnb's April 2016 "Don't just go there. Live there." mobile page; no live site is ever loaded.
3. Like a post

**Discovery Card:**
- Artifact: `Algorithmic Feed`
- Text: "Earlier feeds showed you everything your friends posted, newest first. By 2016, an algorithm ranked the feed instead, ordering each post by how likely it was to keep you scrolling. Your closest friend's biggest news could sit beneath three strangers and an ad. The order was chosen for you, tuned to hold your attention, by a system whose goals were not your own."

**File Structure:**
```
scripts/recover-instagram-2016.py      # Wayback recovery of 2016 profiles + photos
src/levels/Level4.jsx                  # Screen state machine, museum wiring
src/levels/Level4.module.css           # Three-zone layout
src/components/feed/
  GhostDevice.jsx + .module.css        # Ghost iPhone 6 outline, glow, screen slot, TouchCursor
  FeedApp.jsx                          # Tabs, pushed-screen stack, nav transitions, trickle
  NavBar.jsx, StatusBar.jsx            # Blue header
  Post.jsx                             # Post card, double-tap like, sponsored-photo ad overlay
  InAppBrowser.jsx                     # Slide-up browser over the app (BROWSER_CHROME constants), action sheet
  AirbnbLiveThere.jsx                  # Local reconstruction of the 2016 "Live There" landing page
  ad-browser.css                       # Overlay, browser and landing-page styles
  ExploreTab.jsx, ActivityTab.jsx, ProfileView.jsx, PostDetailView.jsx, PhotoGrid.jsx
  Avatar.jsx, icons.jsx                # Traced 2016 glyphs
  feed-styles.css                      # Artifact styles, tokens, nav transitions
  feedData.js                          # Friends, FEED slots + buildFeed(seed), older pages, profiles, activity
  archiveData.js                       # Wayback archive accounts
  libraryData.js, libraryQuality.js    # Blog library accounts and photo ownership
  followStore.js                       # Shared follow state
  useDragScroll.js                     # Touch-style scrolling
```

---

### Level 5: 2023 — The Conversation
**Status: Complete**

**Artifact:** AI chat interface (Claude-inspired, curator persona)
**Discovery:** Natural Language
**Container:** Full-width chat panel — no device, no chrome, no window frame
**Route:** `/level/5`

**Persona:** The AI is the museum curator — the same voice that has written every IntroModal and DiscoveryCard. Slightly formal, warm, knowledgeable about interface history. It knows it is inside UX Archaeologist. When asked about itself, it is honest and matter-of-fact.

**Response Model:** Groq API (Llama 3.3 70B) via Netlify serverless proxy, with scripted keyword-matching fallback. System prompt constrains responses to 2-3 sentences, interface history topics only. Player never sees an error; fallback fires silently on API failure.

**IntroModal:**
- Era: `2023`
- Title: `The Conversation`
- Description: "In late 2022, OpenAI released ChatGPT and 100 million people started talking to a machine within two months. Every previous interface required learning something new: commands, clicks, gestures, swipes. This one worked because you already knew how to type a sentence."

**Visual Palette:**
- Dark background continuous with museum layer (#1a1a1a)
- Claude-inspired layout: user messages as right-aligned dark pills, AI responses as left-aligned plain text (no bubble)
- Dark rounded input bar (#2a2a2a) with placeholder text
- Non-interactive "Curator v1" model label in input bar (visual dressing)
- Action icons below AI responses: copy, thumbs up, thumbs down, regenerate
- Suggestion chips as outlined pill buttons below responses
- System sans-serif throughout (this IS the current era)

**Container:**
- Full-width panel, no frame, no border, no shadow
- Chat area fills the artifact zone within the three-zone layout
- No sidebar, no logo, no attachment button, no settings

**Interactive Elements:**
- Text input (player types real messages, or clicks suggestion chips)
- AI responses stream in token-by-token (SSE from Groq, or simulated ~30 chars/sec for fallback)
- Suggestion chips appear after each AI response (3 per turn, hardcoded by turn number)
- Regenerate button replaces last AI response with a new API call
- Thumbs up/down triggers a "Thanks for your feedback" toast (1.5s, fades out)
- Copy button copies response to clipboard
- Thinking indicator (3 pulsing dots) shows before first token arrives

**Suggestion Chips by Turn:**
- Initial: "What is this place?" · "Who are you?" · "Tell me about the levels I just played"
- After turn 1: "What changed between 1984 and now?" · "How does this conversation compare to the terminal?" · "What comes after this?"
- After turn 2+: "What was the biggest leap in interface design?" · "Why did touchscreens change everything?" · "Is this the last interface?"

**Boot Sequence:**
1. ~1000ms pause after "Begin Excavation"
2. Input bar slides up from below viewport (300ms ease-out, @keyframes)
3. Placeholder "Ask me anything..." fades in, cursor blinks
4. Suggestion chips fade in staggered (50ms each)
5. Museum HUD slides in per standard pattern

**Objectives (3, independent — no sequential gating):**
1. Start a conversation (send any message)
2. Ask a follow-up question (send a second message after your first)
3. Regenerate a response (click regenerate on any AI response)

**Key Mechanic:** The player is having a conversation with the thing that has been curating their entire experience. The discovery card, written in the same third-person museum voice, arrives after the player just spoke with its author. The dissonance is intentional and unspoken.

**Discovery Card:**
- Artifact: `Natural Language`
- Text: "Every previous interface required you to learn its language: commands, clicks, menus, gestures. This one already speaks yours. But behind the fluency is a system you can't see, trained on text you didn't choose, shaped by decisions you can't inspect. The most natural interface ever built is also the least transparent."

**File Structure:**
```
netlify/functions/chat.js              # Serverless proxy to Groq API
src/levels/Level5.jsx                  # Screen state machine, museum wiring
src/levels/Level5.module.css           # Three-zone layout
src/components/chat/
  ChatPanel.jsx + .module.css          # Main container — messages, input, chips
  ChatMessage.jsx + .module.css        # Single message (user or AI)
  ChatInput.jsx + .module.css          # Input bar with send button
  SuggestionChips.jsx + .module.css    # Chip row
  ActionIcons.jsx + .module.css        # Copy, thumbs, regenerate
  Toast.jsx + .module.css              # Feedback toast
  useCuratorChat.js                    # Hook: messages, streaming, API, fallback
  curatorSystemPrompt.js               # System prompt
  curatorFallbacks.js                  # Scripted fallback responses
```

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
| 4 | Helvetica Neue (body), Proxima Nova (nav titles, labels) | Montserrat stands in for Proxima Nova on machines without it |
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
- Boot: 300ms pause → 450ms keyframe animation (StatusBar + clockBand slide down together as `.topBlock`, slider slides up, wallpaper fades in); StatusBar on lock screen has `showTime={false}` since clock band shows time prominently
- Unlock choreography: 5-phase, 800ms total (lock exit → black → dock → icons → home)
- App open: `scale(0.02) → scale(1)`, 300ms ease-out
- App close: `scale(1) → scale(0.02)`, 250ms ease-in
- Notes slide transition: translateX, 200ms ease-out
- Rubber-band scroll: linear drag, 0.3× damping past bounds; `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 300ms snap on release
- Sound effects: `audio.volume = 0.5` for all sounds

**Level 4 — 2016:**
- Boot: nothing drawn during the intro; 300ms pause → screen fades up in place (450ms) with content already there → ghost outline and glow fade in (800ms) → HUD
- Navigation push/pop like iOS 9: incoming view slides from the right with a leading-edge shadow, the view beneath drifts 30% left and dims 10%, the blue bar holds still while titles cross-fade; pop is the reverse. 500ms, `cubic-bezier(0.32, 0.72, 0, 1)`
- Double-tap heart: spring in with overshoot (~250ms), hold, fade by 900ms; small heart bounce 320ms
- Scrolling: 1:1 drag, fling at 0.998/ms deceleration, 0.3× rubber band, 300ms `cubic-bezier(0.25, 0.46, 0.45, 0.94)` snap
- Activity rows fade in 250ms; tab badge pops in 200ms

**Level 5 — 2023:**
- Boot: 1s pause → input bar slides up from bottom (translateY(100%) → translateY(0), 300ms ease-out, @keyframes)
- Suggestion chips: fade in 200ms, staggered 50ms each
- Thinking indicator: 3-dot pulse, CSS keyframes opacity cycle, staggered per dot
- Message appear: subtle fade-up, 150ms ease-out
- Streaming text: tokens append in real time, no animation per token
- Action icons: fade in 200ms after streaming completes
- Toast: fade in 200ms, hold 1.5s, fade out 300ms
- Input send: instant clear + message appended
