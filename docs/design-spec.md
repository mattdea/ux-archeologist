# UX Archaeologist — Design Specification

## Overview

UX Archaeologist is an interactive museum experience where the player excavates digital artifacts from different eras of computing. Each level recreates a historically authentic interface that the player explores and interacts with, uncovering key UX innovations along the way.

**Stack:** React + Vite SPA, CSS Modules
**Levels:** 6 playable levels (0–5)
**Duration:** 5–8 minutes total, ~60–90 seconds per level
**Audience:** Dual — works as a portfolio case study and a standalone shareable experience

### Progress (8 Nov 2026)

All six levels are complete and playable; nothing is gated; all 46 tests pass. Prompts now batch several features; each is built and committed separately (see CLAUDE.md "Working rules" and `docs/backlog.md`).

Recent work:
- **Layout (7 Nov):** artifacts are sized by `useArtifactFit` below the top HUD band and around the bottom HUD (up to 1.35×, always horizontally centred, gap above = gap below) instead of fixed 180px bands.
- **Museum layer:** "Enter the exhibit" on the title screen; hints in every level (docked pill, after 10s without progress); era tooltips on the HUD dots; drawn ticks and strike-through on the objectives; a Continue flourish; one continuous timeline line that fades at both ends.
- **Sound in every level** (`src/audio/sfx.js`): VT100 click and bell, Mac 600 Hz startup beep and alert beep, a real dial-up recording under Netscape's first load, Instagram like pop, chat send/receive.
- **Period pointers:** the Mac arrow and wristwatch, the Win95 arrow, hand and arrow-with-hourglass.
- **Level 1 (1984):** the Mac now fades in from the timeline like the other levels (the bezel is `MonitorBezel@2x.webp`, pre-rendered from the SVG, whose blur filters stalled the fade); boot wipes the gray down in ~20 steps; the desktop is Finder 1.1 from the 1984 sources — System Disk, zoom rectangles, menu blinking, marquee selection, Get Info with Locked, Put Back, Close All, Clean Up, Empty Trash, Eject, and the Calculator, Note Pad, Puzzle and Alarm Clock desk accessories (details and sources under Level 1).
- **Level 2 (1995):** pages load like 1995 (contact → transfer counter → block-by-block draw), the original meteor throbber animates in the N box while loading.
- **Level 4 (2016):** objectives *Like Imani's post* / *Learn more about a sponsored post* / *Follow someone new*; the feed reshuffles on every refresh with a seeded order per page; a clockwise pie loader on the first photo; the status bar shows local time.

Open items, roughly in priority order:
1. The objectives list is ~330px wide, which limits how large the Mac can be while centred; a narrower tracker would help every level.
2. The Circular Air font files are committed to the public repo (licence decision pending). So are Apple's Chicago 12 (source unrecorded) and Geneva 9 (`fonts/geneva-9.ttf`, from github.com/jcs/classic-mac-fonts, added 8 Nov 2026 on Matthew's choice), neither with a licence file. New York 12 (`fonts/new-york-12.ttf`, converted from github.com/JohnDDuncanIII/macfonts, added 8 Nov 2026 on Matthew's choice) is in the same position.
3. The snowy-cabin library photo is reserved for the Airbnb ad but no longer used by it.
4. Level 1 details not settled by any source and so reconstructed: zoom-rectangle frame count and timing, menu-blink timing, the locked-item Empty Trash alert wording, Clean Up snap-vs-repack. Booting System 1.1 in an emulator (infinitemac.org) would settle them.
5. Level 1's objective-1 hint ("Double-click the Notes icon") predates the System Disk; it still works, but could mention the disk.

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
Sequential order is suggested but not enforced: Level 0 → 1 → 2 → 3 → 4 → 5 → timeline. All levels are freely accessible at any time. Completing a level navigates directly to the next level (DiscoveryCard nextUrl).

### Per-Level Flow
1. **Arrive** — IntroModal overlays the artifact (museum layer). Artifact is inert.
2. **Boot** — Modal dismissed. Artifact boot/intro sequence plays (era-authentic). HUD hidden.
3. **Explore** — Player interacts with the artifact, completes 3 objectives.
4. **Discover** — Continue button appears. Player clicks → DiscoveryCard fades in. Artifact recorded. Player navigates to the next level (or the timeline after Level 5).

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
  DiscoveryCard.jsx    props: era, artifactName, description, nextUrl = next level ("/level/N+1"); Level 5 → "/timeline"
  ObjectiveTracker.jsx props: objectives[], completedIndices[]

src/shared/SharedLayout.jsx
  Contexts: useArtifactReady(), useSetContinue(), useFadeNavigate()

src/hooks/
  useArtifactFit.js       fits the artifact below the top HUD band and around the bottom HUD: returns { scale, left, top } (cap 1.35×)
  useRubberBandScroll.js  iOS-style drag scroll: 0.3× rubber factor, cubic-bezier snap on release

src/shared/museum-ui/AboutModal.jsx        no props — standalone modal, opened from TitleScreen
src/shared/museum-ui/AboutModal.module.css

src/state/state.js
  completeLevel(n), isLevelComplete(n), addArtifact({ name, era, description })
  Backed by localStorage.
```

---

## Artifact Fit and the Three-Zone Layout (all levels)

The artifact is **sized and placed by `useArtifactFit(nativeW, nativeH)`**, not by the flex layout. Every HUD block carries `data-hud` (the four SharedLayout corners and each level's `.bottomZone`); the hook measures them on mount and on resize. The **top HUD (era label + progress dots) is always a full-width band**: the artifact never sits beside it, it always starts at least 32px below it. The **bottom HUD** (objectives tracker, Continue, back link) is cleared either vertically (artifact above it, 32px away — wide terminal, Mac, Netscape) or horizontally (artifact beside it, 40px away — phone, ghost device), whichever yields the larger artifact, capped at 1.35×. **Gap above always equals gap below:** beside the bottom HUD the artifact is kept as far from the bottom edge as from the top edge; above the bottom HUD it is centred between the band and the tracker. It is always centred horizontally. HUD boxes must be their visible boxes (no top padding on `.bottomZone` or the tracker body), or the measured gap is not the gap the eye sees. The native W/H constants passed to the hook **must equal the frame component's CSS size** (Terminal 780×460, Mac 780×755, Netscape 700×580, iPhone 385×735) or the fit box and the device drift apart. The `.wrap` / `.frameWrap` is `position: absolute` with inline `left/top/width/height` from the hook; the `.scaler` inside applies `scale()`.

```
Zone 1 — topSpacer    flex: 0 0 auto; height: var(--bottom-zone-height) (Level 5: 84px = band bottom 52 + 32, so the chat starts where devices start)
Zone 2 — artifactZone flex: 1 (the artifact no longer flows here; its wrap is absolute)
Zone 3 — bottomZone   padding: 0 24px 24px (no top padding: box = visible box); data-hud; visibility: hidden until playing
```

Level 5's chat panel has no device and still fills the artifact zone. Never add `min-height` to `.bottomZone`. Phone-width screens are not a target: the artifact shrinks to fit, and the small-screen notice (Dialog System) says so.

---

## Dialog System

### IntroModal
White card, 2px black accent line, mono era label, serif title, sans body, objectives list, "Begin excavation" button (full-width black).

### Small-screen notice
`SmallScreenNotice` (mounted once in `SharedLayout.jsx`, after the content, so it sits above everything, a level's IntroModal included). Shown while the viewport is **under 600px** wide (`matchMedia('(max-width: 599.98px)')`; width only, no touch test), on whatever page the visitor lands on. It reuses IntroModal's card styles (`IntroModal.module.css`): mono label `BEST ON A COMPUTER`, title "This exhibit needs a bigger screen", body "Each room recreates a real machine at its real size: a terminal, a Mac, a web browser, two phones. On a screen this small they're hard to use.", full-width black "Continue anyway" button (focused on open). Its only own styles: the opaque museum background (`#111`) instead of the see-through scrim, `z-index: 10000`, and a card at most 380px wide with a 16px side gutter. "Continue anyway" closes it and remembers that for the visit in `sessionStorage` (`ux-archaeologist:small-screen-dismissed`, in try/catch: with storage blocked it still closes, it just isn't remembered). Widening the window to 600px or more hides it without counting as a dismissal (narrow again and it returns). Phones held sideways (wider than 600px but short) don't get it. Copy is a draft for the copy pass.

### HintPill + useHint
Nudge in a dark pill, fixed at the bottom centre of the viewport (clear of the tracker, the Continue/back corner and the artifact above). `useHint(HINTS, { active, completedIndices })` returns the hint for the first unfinished objective after 10s without progress; any completion hides it and restarts the clock. Every level defines `HINTS` alongside `OBJECTIVES`. The pill is not `data-hud`, so it never moves the artifact.

### Progress dots
Each dot is a 17×24 button; hover or focus shows a tooltip under the row with the era and title in the HUD type. Click navigates.

### ObjectiveTracker
Dark translucent card, "OBJECTIVES" label, checklist (unchecked = light, checked = strikethrough + muted). Slides up via `trackerSlideUp` keyframe when playing state begins. Completing an item draws the tick (stroke-dashoffset, ~220ms), then a strike grows across the text from the left as it fades to grey. The HUD Continue button waits ~550ms for the last strike, then rises in with a slight overshoot and a soft halo that blooms off its border. All disabled under `prefers-reduced-motion`.

### DiscoveryCard
White card, 2px black accent line, "ARTIFACT DISCOVERED", large mono year, artifact name, description, "Next excavation" button → `/timeline`.

---

## Sound

`src/audio/sfx.js` synthesises every effect with Web Audio except the recordings named below. Master gain 0.28: sounds of a room, not a game. The context unlocks on the first pointer/key, so timer-driven sounds after "Begin excavation" play. Per era: 1971 VT100 keyclick and bell (one keyboard speaker driven once per status byte, 1.271 ms, so near 787 Hz — derived from the manual's timing, not measured: one pulse = click, ~200 = bell, ~0.25 s) and the power-on bell from the self-test (VT100 Technical Manual §4.2.8), 600 ms into the boot (placement reconstructed: the manual gives the order of the tests, not their timing); 1984 startup beep, a 600 Hz square wave as on the 128K, 512K and Plus (the chord came with the Macintosh II in 1987; source: Wikipedia, "Macintosh startup"), played as the boot begins for about 1 s (Matthew's correction, 8 Nov 2026: 4 ms attack, held, 200 ms fade) — its level is reconstructed (the alert beep's peak, 0.08), no drive sound; 1995 a real dial-up recording (`assets/web/dialup.mp3`, 6.2s, volume 0.25) under the first page load; 2007 unlock/lock recordings (Level 3); 2016 like pop; 2023 send tick, reply-finished tone.

## Period pointers

Level 1's pointer is drawn by `MacCursor` (the real pointer is hidden over the screen): the 1984 arrow, the wristwatch while the drive light is on, or the Mac's I-beam over text, at the pointer's last position sampled about 30 times a second, so it moves in visible steps as on an emulated Mac (infinite mac). It lives on `<body>`, so it stays screen-size. Reconstructed: the 30 Hz step and the I-beam bitmap (Inside Macintosh's iBeamCursor, from memory). During a native drag the browser shows its own pointer. `src/components/era-cursors.css` defines pixel-exact SVG cursors as data URIs: the 1984 Mac arrow (ROM `arrow` data + mask, hotspot 1,1), the Windows 95 arrow (0,0) and the Windows 95 link hand (fingertip 5,0). Level 1 sets the Mac arrow on `.inner` and the wristwatch (`--cursor-mac-watch`, redrawn) while the drive light is on; Level 2 sets the Win95 arrow on `.wrap`, the arrow-with-hourglass (`--cursor-win-busy`) while a page loads, the hand via `--cursor-link` on clickable links and an I-beam on the Location field. Artifact CSS uses `cursor: inherit`. Cursors are screen-space and do not scale with the artifact.

## Container Progression

Hardware presence decreases across the arc: physical terminal → monitor bezel → browser window → handheld device → no device → no device → pure conversation.

| Level | Era | Container |
|-------|-----|-----------|
| 0 | 1971 | Green-screen terminal bezel (780×460px) |
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
**Container:** `src/components/terminal/` — TerminalBezel + TerminalScreen; 780×460px
**Route:** `/level/0`

**IntroModal:**
- Era: `1971`
- Title: `The Command Line`
- Description: "Before icons, windows, or the web, there was a conversation. A researcher sat down at a terminal, typed a command, and waited. The machine replied. This was computing at its most direct — and its most demanding."

**Visual Palette:**
- Black screen, green phosphor text
- Monospace font throughout
- Blinking cursor

**Objectives (any order):**
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
**Container:** `MonitorBezel.jsx` — beige CRT; 780×755px, 620×415px screen. Drawn from `assets/MonitorBezel@2x.webp`, a headless-Chrome render of `MonitorBezel.svg` (the SVG's 13 blur filters rasterised on the level's first visible frame, a ~200ms stall that ate the page fade-in). `SharedLayout` also starts a view's fade-in only once frames are flowing again after the swap. Never put `will-change`, `transform` or `filter` on SharedLayout's `.content`: it becomes a stacking context above the HUD corners and blocks their clicks.
**Route:** `/level/1`

**IntroModal:**
- Era: `1984`
- Title: `The Desktop`
- Description: "You're looking at the original Macintosh desktop from 1984. Explore the interface and complete the objectives to discover what made it revolutionary."

**Visual Palette:**
- Pure 1-bit: black and white only inside screen
- Checkered desktop pattern — drawn by `ScreenTexture`, which cancels the artifact scale so each square is always one CSS pixel on screen and snaps to device pixels (no moiré at any bezel size). Never put the checker directly on a scaled element.
- Chicago monospace font
- Striped window title bars
- Dashed drag outlines (~10fps, authentic to 8MHz 68000). Outlines are drawn inside the desktop in its own coordinates (`desktopDrag.js` `toLocal`), so at any bezel scale they are exactly the window or icon size, keep the grab point under the cursor, and the item drops where its outline was. Never mix `clientX` with desktop positions.

**Interactive Elements (Finder 1.1, as the 1984 manual and May-1984 screenshots describe it):**
- Desktop: icons in the real Finder's places, measured from `macsystem100025.png` in Mac pixels: one column with icons' left edges at x 455, `System Disk` at y 28, `Notes` at 92 (where the disk's "Welcome!" sits), `Projects` at 156, `Trash` at 284 — a 64-pixel grid, which Clean Up uses (`GRID` in `DesktopScene`; the horizontal step of 64 is reconstructed). Icons are 32 Mac pixels. The disk and document icons are 32×32 bitmaps traced pixel by pixel from the System 1 screenshots: the disk from `macsystem100003.png` (black shutter with its slot, label frame, top-right corner cut off), the document from the "Welcome!" file in `macsystem100017.png` (dog-eared page, three dashed lines); Notes and Projects' files use the document icon; the System Folder's files use the little-Macintosh icon traced from `macsystem100032.png` (24 × 31, bottom-aligned in its 32-pixel cell). The folder is traced from the Empty Folder in `macsystem100032.png` (32 × 24, bottom-aligned); the Trash is still the earlier drawing. Icon labels, on the desktop and in windows, are Apple's bitmap **Geneva 9** (`fonts/geneva-9.ttf`, exported from System 6 and converted to TrueType by jcs, [github.com/jcs/classic-mac-fonts](https://github.com/jcs/classic-mac-fonts); no licence file, Apple's font, like the bundled Chicago) sized so each font pixel is one Mac pixel (`--mac-px` = 620/512 CSS px). The label box is 12 Mac pixels tall, directly under the icon, about 2 pixels either side of the text, measured from the "Welcome!" label in `macsystem100017.png`; selected, the label inverts.
- Selection: click, Shift-click, or drag a dotted marquee on the bare desktop; icons select when the button is released (manual p. 40), not as the box grows. The marquee belongs to the desktop: it draws over icons but under every window, and redraws at ~10fps like the drag outlines. A group drags in formation (one outline each).
- Opening: double-click or File ▸ Open. **Zoom rectangles** (`zoomRects.js`): 14 dotted outlines growing from the icon to the window, each covering 30% of what is left, three visible at once, ~¼ s; the same run shrinks back on Close. The 1984 Finder's exact frame count/pattern is undocumented; these follow Apple's later "Finder style" ZoomRecter sample. Desk accessories don't zoom; they appear and "just disappear".
- Disk window: `Empty Folder`, `System Folder`, `Utilities`, where the Finder kept them in `macsystem100031.png` (icon left edges 24, 111, 215 Mac pixels into the content; Finder 1.0 had no New Folder, you duplicated Empty Folder). Documents saved from TeachText join them, the first where the Finder put "Untitled" in `macsystem100035.png` (152, its label running over System Folder's, as there), later ones to the right of Utilities (reconstructed). System Folder holds, in the Finder's order, System, Finder, Imagewriter, Clipboard File, Note Pad File, Scrapbook File, with the info line "6 items   208K in folder   184K available" (the form from `macsystem100032.png`; our numbers). In disk and folder windows icons sit 64 Mac pixels apart, the first 12 pixels in from the content's top left, each label directly under its icon (measured from the same screenshot); opening one of those gives the Finder's alert "could not be opened/printed (the application is busy or missing)". Info line: "N items   NNNK in disk   NNNK available", edge to edge under the title bar and closed by a double rule (1px line, 1px gap, 1px line), as in the System 1 screenshots in `docs/reference/mac system 1/`. Those screenshots are Finder 4.1 (System 2.0, 1985); the level stays Finder 1.1 and copies them only where 1.1 looked the same.
- Menus (`MenuBar`), no separators: **Apple** About the Finder..., Scrapbook, Alarm Clock, Note Pad, Calculator, Key Caps, Control Panel, Puzzle · **File** Open, Duplicate ⌘D, Get Info ⌘I, Put Back, Close, Close All, Print, Eject ⌘E · **Edit** Undo ⌘Z, Cut ⌘X, Copy ⌘C, Paste ⌘V, Clear, Select All ⌘A, Show Clipboard · **View** by Icon ✓, by Name, by Date, by Size, by Kind · **Special** Clean Up, Empty Trash, Erase Disk, Set Startup. Shut Down, Use MiniFinder and New Folder are Finder 4.1 (1985) and are not here. Items with nothing behind them (Duplicate, Print, Erase Disk, Set Startup, Undo/Cut/Copy/Paste/Clear, Show Clipboard) are dimmed: drawn as dotted text, a checker of Mac pixels clipped to the letters, as the Menu Manager cleared every other pixel of a disabled item with the gray pattern (Inside Macintosh I; no reference screenshot shows a dimmed item).
- **Menu bar:** 20 Mac pixels (19 of bar and its 1-pixel line), measured from `macsystem100017.png`; titles and items in Chicago sized so a font pixel is a Mac pixel (the bundled Chicago is drawn on a 16-pixel em, so `--mac-px` × 16); a highlighted title starts a pixel below the top of the bar; menu rows are 16 Mac pixels (Inside Macintosh I, Menu Manager). `--menu-bar-height` and `MENU_BAR` (DraggableWindow, DesktopScene) follow it.
- **Menu blinking:** a chosen item inverts off/on three times by default (the Control Panel's menu-blink setting, `macSettings.js`; 50 ms a phase) while the title stays highlighted, then the menu closes and the command runs (Inside Macintosh I, SetMenuFlash).
- **Get Info:** window titled "Information about <name>", laid out in Mac pixels from `macsystem100022.png` (content 384 × 216; it opens at (45,55), where the Finder put the System Disk's): the name right-aligned ending at 318 beside the 32-pixel icon at (332,10); Kind / Size / Where / Created / Modified in Chicago on 18-pixel rows from 39, labels at 22 and values at 92 ("1432 bytes, accounts for 2K on disk", "System Disk, internal drive", "Wednesday, January 25, 1984 at 9:14 AM"; a date too long for the window runs off its edge, as in the screenshot); the 12-pixel `Locked` check box at (22,136), live (an X corner to corner), dotted when it can't apply (the disk); a comment box 370 × 56 at (7,153). The disk's Size uses the screenshot's form, "221184 bytes used for 10 files" (the count is ours). Not offered for the Trash. Notes starts locked. The screenshot is Finder 4.1's; 1.1's layout is assumed the same.
- **Put Back:** select an item in the Trash window; it flies back (zoom outline) to where its icon was. **Close All** zooms every Finder window shut. **Select All** selects every desktop icon. **Clean Up** snaps icons to the nearest free grid slot (the manual says "neat rows and columns"; snap vs re-pack is undocumented).
- **Eject** (disk selected, or the disk dragged onto the Trash): the drive light pulses and a dimmed ghost of the disk stays on the desktop, as in 1.0; opening it asks "Please insert the disk: System Disk". With no second disk in the exhibit, the disk is "pushed back in" after 3 s.
- **Utilities folder and applications** (`src/components/apps/`). The Infinite Mac System Disk the screenshots come from has a Utilities folder — Disk Copy, Fonts, Font Mover, TeachText, SysVersion (`macsystem100031.png`; icons traced, 64 Mac pixels apart from 18 in, "5 items   96K in folder"). These are later than this Finder (Font Mover 1985, TeachText 1988); they're here because that disk has them and Matthew asked for TeachText (9 Nov 2026). Launching one reads the disk, closes the desk accessories, plays zoom rectangles from the icon to the whole screen, then the Finder's icons and windows go away until the application quits (they come back as they were).
  - *TeachText:* its document window fills the screen inside a 3-pixel margin, frame (3,23)–(508,338), measured from `macsystem100033.png`: text in Apple's bitmap **Geneva 12** (`fonts/geneva-12.ttf`, the same jcs source as Geneva 9) on 16-pixel lines, 4 pixels in; a vertical bar; a blank strip along the bottom ending in the grow box; no mouse wheel. Menus Apple · File · Edit (`MenuBar`'s `menus`/`appleAbout`). File: New, Open... (dimmed), Close, Save, Save As..., Page Setup... and Print... (dimmed), Quit; Edit: Undo (dimmed), Cut, Copy, Paste, Clear, Select All on TeachText's own clipboard. **Save** on an untitled document, or **Save As...**, puts up the dialog traced from `macsystem100034.png` (320 × 120 at (82,92)): "Save this document as:" with the name typed live in Chicago over the traced field (all selected at first), Save (or Return), Cancel (or Escape), Eject (beeps), Drive dimmed; the window behind draws inactive, as in the screenshot. The saved document appears in the disk window and opens in TeachText. Closing the document (close box or File ▸ Close) quits TeachText and returns to the Finder: the real one stayed open on an empty screen with its menus, which read as a frozen Mac or a wiped desktop (Matthew's call, 9 Nov 2026), so New is never needed. Close or Quit with unsaved changes asks "Save changes to “name” before closing/quitting?" Yes / No / Cancel. Reconstructed: the menu items, the About text ("TeachText © 1988 Apple Computer, Inc."), the save-changes wording, saving over a document of the same name without asking.
  - *Notes* is a TeachText document (Get Info: Kind "TeachText document"; in 1984 it would have needed MacWrite): double-clicking it launches TeachText with it, which still completes the first objective. Notes starts locked, so TeachText shows it read-only (Save, Cut, Paste, Clear dimmed); unlock it in Get Info to edit and save it.
  - *Projects* holds **Budget**, **Letter** and **Sketch** (`src/components/projectFiles.js`), TeachText documents by R.H., who wrote Notes: the costed proposal to buy two Macs, the letter to the partners (25 Jan 1984), and the running order for Friday's ten-minute demo. Each ends, after a run of blank lines, with something only a reader who scrolls to the bottom finds (the Sketch's is the team's signatures molded inside the case). They are editable and saved for the session. Facts, with sources and confidence: Mac $2,495 with MacWrite and MacPaint (Apple press release, 24 Jan 1984; high); external 400K drive $495, announced with the Mac, shipped May 1984 (Datapro 11/1984; high); ImageWriter $495 with a Mac, $595 alone (Datapro 11/1984; medium); Multiplan $195 (Creative Computing, May 1984; medium — a museum box shows $325); Lisa 2 $3,495 announced Jan 1984, first Lisa $9,995 (high); the "1984" ad in Super Bowl XVIII on Sunday 22 Jan 1984, Raiders 38, Washington 9 (high); "Never trust a computer you can't lift" at the 24 Jan shareholders' meeting (high); signatures molded inside the case, opened with a long Torx driver (high); MacWrite 1.0 limited to about ten pages on 128K (medium). The take-home "Test Drive a Macintosh" (Nov 1984) is left out: too late for January. The firm, people and totals are invented.
  - *Font Mover:* its one screen traced whole from `macsystem100036.png` (empty menu bar, the two font lists, Help / Copy / Remove / Quit). Quit returns to the Finder, Help beeps; moving fonts isn't wired.
  - *Disk Copy, Fonts, SysVersion:* the Finder's "could not be opened" alert (ours: there are no screenshots of them running).
- **Desk accessories** (`src/components/da/`), opened from the Apple menu; launching an application (TeachText, Font Mover, or opening Notes, which launches TeachText) closes them all. Calculator, Puzzle and Alarm Clock use Inside Macintosh's `rDocProc` frame (`DraggableWindow` variant `rdoc`/`plain`: rounded 16px corners, black title bar, white title); Note Pad uses the striped document frame.
  - *Calculator:* traced pixel by pixel from `macsystem100012.png` / `macsystem100013.png` into `assets/mac/da/calculator.png` (black title bar with the close box ring, dotted body, white display, square keys with heavy shadows, Geneva 9 labels), shown by DraggableWindow's `traced` variant (`daArt.js`). Over it: invisible key buttons; a held key's outer rectangle inverts (frame white, face black, shadow unchanged, as in `macsystem100013.png`); the display shows the live value in Geneva 9, right-aligned on the traced baseline. Steve Jobs's layout — `C E = *` / `7 8 9 /` / `4 5 6 -` / `1 2 3 +`(tall) / `0`(wide) `.`; keyboard works. The pressed close box draws a white starburst on its black interior (reconstructed). Tracing scripts: `scripts/mac-trace/`.
  - *Note Pad:* measured from `macsystem100011.png`: striped document frame, a white page 219×227 Mac pixels, text in Apple's bitmap **New York 12** (`fonts/new-york-12.ttf`, the 15-pixel strike converted from github.com/JohnDDuncanIII/macfonts' FontForge source by `scripts/mac-trace/sfd2ttf.py`; Matthew's choice; no licence file, like Geneva 9) 9 pixels in, first baseline 20 down, lines 16 apart — the screenshot's text wraps line for line the same. The dog-ear, bottom rule and three lines along the bottom are traced (`notepad-foot.png`); the page number is New York, centred. As its first page says, clicking the dog-ear (above the fold) turns forward and the lower left corner (below it) turns back. Eight pages, saved for the session.
  - *Puzzle:* traced from `macsystem100016.png`: the window (dotted frame, black title bar, joined 4×4 grid of 19×19 cells) is `assets/mac/da/puzzle.png` with its cells cleared, and each tile is a sprite cut from the same screenshot (`puzzle-tiles.png`: the dotted blank, then 1–15 in their outlined numerals), drawn in the cell it occupies. Click a tile beside the space to slide it; rescrambles whenever it is closed or chosen again; on solving the tiles blink and it beeps.
  - *Alarm Clock:* traced from `macsystem100006.png`–`100010.png`: the window closed (one row: close box, the time, a flag) and open (`alarm-closed.png` / `alarm-open.png`, swapped as the flag is clicked), with the flag up/down, the alarm switch, the arrow box and the alarm icon's rays as sprites. Icons left to right: clock face, calendar, alarm clock; the chosen one inverts inside a 1-pixel margin. Text is live Chicago with every field on its measured origin: times put the hour right-aligned in a 2-digit slot (`7:45:04 PM`, `12:00:00 AM`), dates the month and day right-aligned (`11/ 8/26`). In alarm mode the switch turns the alarm on (the alarm icon shows its rays), and clicking a field (hour, minutes, seconds, AM/PM) inverts it and brings up the arrows, which step it. When the alarm goes off the Mac beeps once and the Apple in the menu bar blinks until the Alarm Clock is chosen again. Reconstructed: the switch's off position (the on lever flipped) and setting the clock and date (not offered).
  - *Key Caps:* traced from `macsystem100014.png` (striped document frame; the body — dotted backdrop, the line, the 1984 keyboard with solid black Shift and ⌘ keys — is `assets/mac/da/keycaps.png`; the pointer covered r and f, so those are copies of t and g). Key tops are live Chicago, centred, baseline 13 pixels into each 18-pixel face; holding Shift or Option shows those layers. Typing on the keyboard (while Key Caps is the front window) or clicking a key inverts it and adds its character to the line (Chicago, 4 pixels in, baseline 14 down; Delete removes one). The number keys' tops are blank, as in the screenshot (they still type). Reconstructed: the Option layer (today's US Mac layout) and the pressed look. Desk accessories now take keystrokes only while they are the front window (the Calculator did regardless).
  - *Control Panel:* traced from `macsystem100015.png` (striped document frame; the body is `assets/mac/da/controlpanel.png` with the slider's thumb and every chosen setting cleared). **Opening:** the eight boxes don't arrive together — each draws in on its own at a random moment 40–460 ms after the window opens, blank until then (seen on infinite mac; the spread is reconstructed). Live: the speaker volume slider (click or drag; marks 0–7 are 12 pixels apart; it beeps at the new volume), the date and time ticking in Chicago where the screenshot has them, and the choices — menu blinks 0–3, key repeat rate 0–4, delay until repeat 0–4, insertion point blinking 1–3 (chosen cells invert) and double-click speed (the chosen circle fills). Settings are kept for the session in `macSettings.js`; **menu blinks** is wired: MenuBar blinks a chosen item that many times (default 3). **Desktop pattern:** the left box shows the pattern's bits magnified (5 Mac pixels a bit); click or drag to flip them. The right box is a little desktop in that pattern: click its menu bar for the next stock pattern, click its desktop to make it the Mac's desktop pattern (`desktopPattern` in `macSettings.js`, drawn by `ScreenTexture` from 8 row bytes, so it stays crisp at any scale). Reconstructed: the stock patterns (QuickDraw's grays, white, black and a few classic ones, not System 1's own list) and the two clicks. **Wired:** the speaker volume scales the Mac's beep, and at 0 a beep flashes the menu bar instead (`sfx.setMacVolume`, MenuBar's `mac-flash-menubar`); Key Caps repeats a held key at the delay (0 = off) and rate set here (tick counts reconstructed; the Note Pad's text box keeps the browser's repeat). **Not wired:** insertion point blinking, double-click speed and mouse tracking — a web page can't set the caret's blink, the system's double-click time or pointer speed.
  - *Scrapbook:* five pages, each the window's body (384 × 256 Mac pixels) traced whole from `macsystem100026–30.png` — the page in its double frame, the scroll bar with the thumb where that page puts it, "n / 5" and TEXT / PICT: the TEXT about the Scrapbook, a Mac drawing, Quarterly Sales, Café Mac, the robot. The window opens at (75,41), where the screenshots have it. Paging: the arrows turn one page (the arrow fills while held, from the traced arrow), a click beside the thumb turns one page that way, and the thumb drags as a dotted outline that lands on the nearest page; the thumb's left edge is 28 on page 1 and moves 78 a page. It stops at the first and last pages (reconstructed). Cut, Copy and Paste aren't wired. These are the pages of the Infinite Mac disk's Scrapbook File, which the screenshots are of.
  - *About the Finder...:* the 1.1g box, traced pixel for pixel from `macsystem100025.png` (`assets/mac/about-finder.png`, 364×204 Mac pixels at (74,49)): "The Macintosh™ Finder", lined sky, sun, mountains, "Version 1.1g ©1984 Apple Computer", "Bruce Horn and Steve Capps". Click to dismiss.
- Windows: draggable by title bar with laggy outline, clamped to screen bounds.
- **Scroll bars** (`MacScrollBar`, `MacScrollPane`; Inside Macintosh I, Control Manager): 16px bars with hollow arrows in boxes, a 50% gray track (drawn with `ScreenTexture`, so it stays crisp at any scale) and a square white thumb. Contents move only through the bars: no mouse wheel or trackpad (the 1984 mouse had none), and the Note Pad page doesn't scroll either. An arrow scrolls a line and repeats while held; pressing the track scrolls a windowful less a line and repeats until the thumb reaches the pointer; dragging the thumb moves a dotted outline of it while the contents stay still, and they jump once on release (`docs/reference/mac system 1/macsystem100019.png`). With nothing to scroll the track is white and has no thumb. Notes is set in the same bitmap Geneva 9 as the icon labels, lines 12 Mac pixels apart, and scrolls one such line per arrow click (vertical bar only, fixed size). Reconstructed: repeat delay 250ms then every 50ms, and the line sizes.
- **Finder windows** (disk, System Folder, Empty Folder, Projects, Trash) have both bars and a **grow box** (`WindowScrollArea`, sizes in `FINDER_SIZE`). They open at a fixed size; the disk window fits its icons, so its tracks are white (`macsystem100004.png`), and the System Folder's six icons need the horizontal bar. Icons keep their places and never reflow, so a smaller window scrolls. Dragging the grow box moves a dotted outline of the new size at ~10fps while the window stays put; the window takes the size on release, clamped to the screen. In a narrow window the information line closes up and is clipped (`macsystem100019.png`). Line 16px and minimum size 120×80 are reconstructed.
- **Close box** (Window Manager, TrackGoAway): pressing it draws a starburst inside the box (eight short rays round an empty centre, 9×9 pixels), lit only while the pointer stays over the box; the window closes when the button comes up there, and nothing happens if it is released elsewhere. Read pixel by pixel from `docs/reference/mac system 1/macsystem100021.png`; the cursor hides part of the lower half there, completed by symmetry (reconstructed).
- **Document window chrome** (Finder windows, Note Pad, Key Caps, Control Panel, Get Info), measured in Mac pixels from `macsystem100004.png`: the title bar is 17 rows under the frame plus its line, with six 1-pixel stripes on alternate rows from 3 rows down, 1 pixel in from each side; the 11-pixel close box sits 8 in, with a 1-pixel white gap; the title is Chicago at Mac-pixel size on a white gap 7 pixels either side. The information line is Geneva 9 bold drawn as QuickDraw did bold (each glyph again a pixel to the right, a pixel wider), 17 rows, then the double rule. Scroll bars, thumb, arrows and grow box are 16 Mac pixels. The frame's lines stay 1 CSS pixel.
- **Inactive windows:** only the frontmost window is active (one still zooming open counts; one zooming shut doesn't). A document window behind it has a plain white title bar, no stripes and no close box, the title still shown, and blank scroll bars with no arrows, thumb or grow box (Inside Macintosh I, Window Manager). Desk-accessory frames don't change when inactive (their inactive look isn't in the reference screenshots).
- **Moving icons in windows:** in the disk, folder, Utilities, Projects and Trash windows an icon can be dragged to a new place in its window: a dotted outline of its 32-pixel square follows the pointer in ~10fps steps (as on the desktop), and it lands where it's let go (never above or left of the content's corner). Places are kept for the session, after the window closes, as the Finder remembered them. In the Trash, the item drags with the same outline as taking it out; let go inside the Trash window it moves there, outside it comes back to the desktop. Dragging between windows (into a folder, onto the disk) isn't built.
- **Opened icons:** while its window is open (until it starts to close), a disk, folder or document icon, on the desktop or in a window, is drawn as its silhouette filled with QuickDraw's dark gray (`dkGray`, rows $77/$DD: three black, one white, shifted two each row) with no outline; when selected only its label inverts. Read pixel by pixel from the opened System Disk in `docs/reference/mac system 1/macsystem100020.png`. `IconShade` masks a `ScreenTexture pattern="dkgray"` with the icon's own SVG, so the dots stay one on-screen pixel at any bezel scale. Notes and the Trash shade the same way (reconstructed: in 1984 opening a document quit to its application, so there is no period example for Notes).

**Sources for the above:** Apple, *Macintosh* owner's manual (1984) pp. 18–111; *Inside Macintosh* Vol. I (1985) I-54, I-273, I-361; *The Easy Guide to Your Macintosh* (1984, Finder 1.1g screenshots); GUIdebook System 1.1 gallery; folklore.org (Puzzle, Calculator Construction Set, Desk Ornaments); Low End Mac on System 1.0. Reconstructed, not sourced: the locked-item Empty Trash alert wording, zoom-rect frame count, menu-blink tick timing, Clean Up's snap behaviour.

**Hardware details (`MonitorBezel`):**
- Glass reflection (`CrtOverlay`) is part of the hardware: always visible, in every state, above everything on the screen. Screen contents live in an isolated stacking context so no z-index inside can cover it.
- No power light or other front indicator, as on the real 128K/512K. The dark dot right of the slot is the manual-eject pinhole.
- Drive in-use LED: small red light recessed just inside the left end of the floppy slot (original 400K drive). Lit while booting from disk and for ~700ms whenever the Finder opens something (`driveBusy` prop).

**Boot sequence (`BootSequence`):** black → gray pattern wipes down the screen in ~20 steps (as the ROM fills the frame buffer) → Happy Mac → "Welcome to Macintosh." → overlay removed. The Happy Mac (25×32 at (243,145)) and the welcome box (448×126 at (32,64) with its 3-pixel shadow, icon and Chicago line included) are bitmaps traced from `macsystem100023.png` and `macsystem100024.png` (`assets/mac/boot-happy-mac.png`, `boot-welcome.png`), placed in Mac pixels, then the real `DesktopScene` reveals its own menu bar, Projects, Notes, Trash in place (`reveal` 1–4). No blink animation and no stand-in menu bar or icons, so nothing resizes or moves at the hand-off. Callbacks go through a ref so parent re-renders never restart the timeline.

**Empty Trash (Special menu):** enabled when the Trash holds anything. The Finder writes to the disk (drive light, watch cursor) and permanently deletes the contents, silently, as in 1984 (Finder sounds arrived with System 6.0.4+). Notes is a locked document: it stays in the Trash and a 1984-style alert (`MacAlert`: thick double frame, Caution icon, OK with default ring, Return dismisses) explains, sounding the system beep. The alert wording is written in the Mac's voice, not quoted from System 1.

**Objectives (any order):**
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
**Container:** `src/components/web/BrowserChrome.jsx` — no device bezel; 700×580px
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
- Page loads run Netscape's stages (contact → reply → transfer → Document: Done) with a "47% of 23K (at 2.4K/sec)" counter; the old page stays up until bytes arrive, then the new page draws block by block (`useNetscapeLoad`, `ProgressiveReveal`); the N throbber animates meanwhile. The real throbber (Navigator 1.1 onward) was a monolithic N on a planet with meteors raining past; that animation lives in the large N box beside the Location bar: `throbber-still.png` (its first frame) when idle, `throbber-anim.gif` (the original 60×60, 41 frames at 120ms, via erynwells.me / jwz) while a page loads. First load of the session is slower, under a modem handshake.

**Objectives (any order):**
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
- Home: feed of posts (header, square photo, action row, likes, caption, comments). Nearing the bottom loads a page of older posts (one more per real account, labelled a day older each page) until every account runs out; pulling the list ~100pt past its top shows a spinner and re-deals the feed. Every page load deals it fresh too (`buildFeed(seed)`): real accounts and friends swap slots, friends show a random photo from their set, Imani moves within slots 10–18, and only the ads stay put
- Explore (search tab): dark-blue Search field, PRESS PLAY / EXPLORE VIDEOS hero, sideways TRENDING TAGS row, 3-column EXPLORE POSTS grid that keeps loading; starts from a new offset on every load and on pull-to-refresh
- Activity (heart tab): FOLLOWING / YOU toggle, notification rows (avatar, blue usernames, grey time, thumbnails); new likes trickle into Following while the player is in the feed, with a count badge on the tab
- Profile: username title (gear on your own, back chevron on others), avatar, posts / followers / following, Edit Profile or Follow, grid / list / pin / tagged row, 3-column grid; your own profile is the 2016 first-run empty state with a blue arrow toward the camera tab; verified accounts show the blue check by their name
- Post detail (PHOTO / VIDEO): the same post card, pushed over any tab

**Interactive Elements:**
- Tab bar switches tabs; re-tapping the current tab pops to its root
- Tapping a username or avatar opens that profile, as does a commenter's name when that account has a profile (`hasProfile()`); tapping a grid tile opens the post; Back pops. Nav-bar buttons have a 44pt tap target that extends 10pt past the glyph
- Long captions (feed, post detail, profile list): a caption longer than three lines is cut at 48px (3 × 16px) and ends in "… more" at the bottom right of the third line ("…" in `--ig-text`, "more" in `--ig-muted`, on white with a 20px fade to the left); tapping the caption or "more" expands it in place for good, while the username still opens the profile. Measured (`scrollHeight > clientHeight`, re-checked by a `ResizeObserver`), not counted in characters. **Reconstructed:** no 2015–16 screenshot of a caption this long was found, so whether the spring-2016 app truncated is unknown; the three-line cut follows today's app (Matthew's decision, 8 Nov 2026)
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

The home feed is 24 posts in a hand-ranked order (`FEED` in `feedData.js`): 18 recognisable real accounts, four invented friends (marcus.h, julia.creates, sarah.moments and imani.brooks, whose post is the target), and two ads. Every reload or pull-to-refresh reshuffles it (`buildFeed(seed)`): real accounts and friends trade slots, real accounts start on one of their three newest posts, friends show a random photo from their set (a fresh caption when it isn't their lead), Imani lands somewhere in slots 10–18 with her news post, and the two ads and the slot time labels stay put. Imani's photos are Unsplash (free licence) in `assets/feed/friends/imani.brooks/`; the real Instagram photos and account data are committed too (non-commercial, educational use), so the public site shows the same feed. See `assets/feed/README.md`.

**Objectives (3, independent):**
1. Like Imani's post (imani.brooks's "it's OUT 🎉 my first editorial"; slot 14 in the canonical order, a random slot from 10 to 18 after a reload or refresh). Only a like on that post counts: heart button or double-tap, in the feed, on her profile or in post detail.
2. Learn more about a sponsored post — completes when the in-app browser opens. Tapping a sponsored *photo* reveals the March 2016 ad overlay (photo blurred and dimmed, an outlined ↗ circle, the advertiser's name and domain; reference: `docs/reference/ads/`); tapping elsewhere on it dismisses. LEARN MORE, the Sponsored label or the overlay's arrow open the in-app browser (`InAppBrowser.jsx`): slides up over the whole app in 350ms, keeps the status bar, covers the tab bar, leaves the feed mounted at its scroll position, and closes in reverse. Its chrome (light grey bar, X, bold title over grey domain, ellipsis with a Copy Link / Open in Safari / Cancel action sheet, blue progress bar) is a reconstruction — unverified — with every value in `BROWSER_CHROME`. The destination is a locally built page (`AirbnbLiveThere.jsx`, keyed by the post's `ad.page` in `AD_PAGES`), rebuilt from a 2016 screenshot of Airbnb's mobile homepage during the "Live There" campaign (header with hamburger and centred wordmark, LIVE THERE hero on a still photo with no play button, "Where to?" search, dark footer), set in Circular Air; no live site is ever loaded. The ad photo itself carries the campaign's poster type ("Don't Go There." in white, "Live There." in Rausch red, white Bélo top-right) from the post's `ad.poster`.
3. Follow someone new — completes the first time the player follows anyone they didn't follow at the start (from Explore, a profile, a commenter's profile or an Activity row).

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
1. ~200ms pause after "Begin Excavation"
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
- Page load: staged modem load, 1.5–2.5s (first load ~5s), see Level 2
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
