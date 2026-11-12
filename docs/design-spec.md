# Interface Artifacts — Design Specification

## Overview

Interface Artifacts (the repository is still `ux-archeologist`) is an interactive museum experience where the player excavates digital artifacts from different eras of computing. Each level recreates a historically authentic interface that the player explores and interacts with, uncovering key UX innovations along the way.

**Stack:** React + Vite SPA, CSS Modules
**Levels:** 6 playable levels (0–5)
**Duration:** 5–8 minutes total, ~60–90 seconds per level
**Audience:** Dual — works as a portfolio case study and a standalone shareable experience

### Progress (12 Nov 2026)

All six levels are complete and playable; nothing is gated. 227 tests; all pass, though the card lab's layout test (`CardLab.test.jsx`) can time out at 5s when the whole suite runs on a busy machine (it passes on its own). Copy: every card, objective, hint, the About text and Level 5's guide follow the voice guide in `docs/copy-pass.md` (10 Nov 2026; Matthew may revisit, see the backlog). Each level is its own code chunk (`src/views.js`), fetched while the previous view fades out. Prompts now batch several features; each is built and committed separately (see CLAUDE.md "Working rules" and `docs/backlog.md`).

There are two museum layers. Classic is the one this spec describes and the one production shows. The Index, one monospace list that is the whole museum, is the dev server's default (since 12 Nov 2026; Classic is a dev panel switch away) while Matthew decides (see "Index museum"; restore point: the tag `museum-classic`).

Recent work (9–12 Nov):
- **Index museum, one home page (12 Nov):** the Index is the dev server's default; the title and timeline are one page, Enter opening the rooms under itself at `/timeline` (Back closes it); no Collection in the Index (`/collection` lands on the timeline); four timelines to compare behind a dev switch (list, line, cards, dig), each revealing a new find once.
- **Index museum, the discovery (12 Nov):** in a level's corners the discovery goes in a wide band along the bottom, with the device under a fade (the page colour at 92% and a 6px blur) on every level; every discovery text cut to about 50 words. The tray is gone (Matthew's review). The intro has the same fade, with Begin under the intro text in the bottom-left corner.
- **Catalogue record (12 Nov):** the object line and data sit just above the first label instead of at the device's top; a found part's dot sits on its edge facing the labels, so no leader crosses its part; Netscape's Location leader goes under the N rather than through it.
- **Index museum (10–11 Nov):** built from the style lab's B2. Dark by default with a light mode. In a level the list splits into four corners round the centred device, with the full list behind `≡`; the older side layout is behind a dev setting. Three picture sets under comparison (dots, stamps, fossils, with the clay tablet at rest). No device casts a shadow. The pointer is a pixel flint arrowhead, with a fossil stick to compare in the dev panel.
- **Catalogue record (11 Nov, experiment, dev server only, on by default):** a museum label round every level's device: catalogue number, labelled parts and a data block, each fact with two sources (under each level). A `[−]` / `[+]` toggle by the number shows and hides it for the visit.
- **Level 5 (11 Nov):** a light version of the chat in the Index's light mode; the dark chat's greys lifted to pass AA.
- **Museum (10 Nov):** the collection page, the dev panel (`Ctrl+Shift+D`), the style lab, the card lab and the dot editor.
- **Levels (9–10 Nov):** Level 0 moved from 1971 to 1979; Level 1 drags files between folders and the desktop; the copy pass applied; the Level 4 feed audit fixes.
- **Tried and dropped (11 Nov):** the stipple reveal on Level 1, replaced by the catalogue record.

Earlier (to 8 Nov):
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
6. Waiting on Matthew's pick (each a dev panel switch): Classic or Index; in the Index, the level layout (corners or side), the pictures (dots, stamps or fossils), the pointer (arrowhead or stick), the home page's timeline (list, line, cards or dig) and whether Continue returns to it; whether the catalogue record stays; in Classic, the titles, timeline, card style and card art.
7. The pointers haven't been checked with a real mouse (does the tip click exactly on `[ ]`?), in Safari or in Firefox, and there's no screen recording of them in use.
8. In the Index corners at 1440 × 900, the Mac leaves no room for its catalogue record, so Level 1's toggle doesn't show there. A narrower column, or letting the record sit over the bezel, would decide it.
9. In the Index corners the discovery band's text runs over the device's foot on Levels 1–4 at desktop sizes, with the device faded behind it. At 375 the bottom band scrolls at discovery. (Backlog, "the discovery text in a wide band", Status.)
10. Still to come: an entry on the catalogue record's label wording.
11. The four timelines were checked by reading the page (light and dark, 1440 × 900 and 375, 0, 3 and 6 rooms found) but not seen by eye: the reveals' timing and the line's pictures at stamp size want a look.

---

## Navigation

There is no URL routing: the address stays at `/` and `SharedLayout` swaps views in state (`useFadeNavigate`), fading out and in. Call sites pass path-like keys (`/timeline`, `/level/N`, `/collection`, `/`) that `SharedLayout`'s `PATH_TO_VIEW` maps to views; a reload starts at the title screen. The one exception is the Index museum's home page (below): opening its timeline pushes `/timeline`, so the browser's Back closes it, and loading `/timeline` opens it. All levels are freely accessible. The collection page (`/collection`) is reached from the timeline's "Collection · N of 6" link.

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
- System sans-serif for titles too (IntroModal 22px weight 500, DiscoveryCard 24px weight 500, About 22px weight 600); no serif anywhere in the museum layer
- Monospace for era labels and dates
- No era-specific fonts, ever
- Dark translucent backgrounds: `rgba(0,0,0,0.85)` for tracker
- White backgrounds for modals and discovery cards
- No accent line on IntroModal, DiscoveryCard, the small-screen notice or the tracker; About alone keeps a 2px #111 line at the top of its card
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

src/data/artifacts.js
  ARTIFACTS: the six artifacts in timeline order (level, year, title, name, path, description).
  The one source for each level's discovery card and addArtifact call, the timeline's
  entries and the collection page. Copy changes go here.
  Backed by localStorage.
```

---

## Artifact Fit and the Three-Zone Layout (all levels)

The artifact is **sized and placed by `useArtifactFit(nativeW, nativeH)`**, not by the flex layout. Every HUD block carries `data-hud` (the four SharedLayout corners and each level's `.bottomZone`); the hook measures them on mount and on resize. The **top HUD (era label + progress dots) is always a full-width band**: the artifact never sits beside it, it always starts at least 32px below it. The **bottom HUD** (objectives tracker, Continue, back link) is cleared either vertically (artifact above it, 32px away — wide terminal, Mac, Netscape) or horizontally (artifact beside it, 40px away — phone, ghost device), whichever yields the larger artifact, capped at 1.35×. **Gap above always equals gap below:** beside the bottom HUD the artifact is kept as far from the bottom edge as from the top edge; above the bottom HUD it is centred between the band and the tracker. It is always centred horizontally. When the artifact sits above the bottom HUD, at least 64px (`hintSpace`) is kept between them so the hint pill fits under the artifact (14px gap, the pill, about 20px to the tracker). HUD boxes must be their visible boxes (no top padding on `.bottomZone` or the tracker body), or the measured gap is not the gap the eye sees. The native W/H constants passed to the hook **must equal the frame component's CSS size** (Terminal 780×460, Mac 780×755, Netscape 700×580, iPhone 385×735) or the fit box and the device drift apart. The `.wrap` / `.frameWrap` is `position: absolute` with inline `left/top/width/height` from the hook; the `.scaler` inside applies `scale()`.

```
Zone 1 — topSpacer    flex: 0 0 auto; height: var(--bottom-zone-height) (Level 5: 84px = band bottom 52 + 32, so the chat starts where devices start)
Zone 2 — artifactZone flex: 1 (the artifact no longer flows here; its wrap is absolute)
Zone 3 — bottomZone   padding: 0 24px 24px (no top padding: box = visible box); data-hud; visibility: hidden until playing
```

Level 5's chat panel has no device and still fills the artifact zone. Never add `min-height` to `.bottomZone`. Phone-width screens are not a target: the artifact shrinks to fit, and the small-screen notice (Dialog System) says so.

---

## Dialog System

### IntroModal
White card, no accent line, mono era label, sans title (22px, weight 500), sans body, objectives list, "Begin excavation" button (full-width black).

### Small-screen notice
`SmallScreenNotice` (mounted once in `SharedLayout.jsx`, after the content, so it sits above everything, a level's IntroModal included). Shown while the viewport is **under 600px** wide (`matchMedia('(max-width: 599.98px)')`; width only, no touch test), on whatever page the visitor lands on. It reuses IntroModal's card styles (`IntroModal.module.css`), with no mono label: title "This experience was designed for larger screens." and no body, full-width black "Continue anyway" button (focused on open). Its only own styles: the opaque museum background (`#111`) instead of the see-through scrim, `z-index: 10000`, and a card at most 380px wide with a 16px side gutter. "Continue anyway" closes it and remembers that for the visit in `sessionStorage` (`ux-archaeologist:small-screen-dismissed`, in try/catch: with storage blocked it still closes, it just isn't remembered). Widening the window to 600px or more hides it without counting as a dismissal (narrow again and it returns). Phones held sideways (wider than 600px but short) don't get it.

### Collection page
Classic only: the Index has no collection page (its finds show on the timeline, and `/collection` lands there; see "Index museum"). `src/pages/Collection.jsx`: the six artifacts a visitor collects by finishing each room, as a set of collectible cards in timeline order (Matthew's direction, 10 Nov 2026: like a real card you'd collect, but not too real; it breaks from DiscoveryCard on purpose). Reached from the timeline's "Collection · N of 6" link (bottom right, beside About, in its style); its own "← Back to timeline" sits bottom right as in the HUD, and the HUD is hidden (`HUD_HIDDEN_VIEWS`). Level 5's discovery card still goes to the timeline. Top left: "Collection" and "N of 6 found" in the HUD's type, under a faint light from above.
- **Grid:** 300px cards, 3 × 2 from 1024px, 2 columns from 600px, 1 below, rows of equal height. They fade up with the timeline's `entryIn` and 150ms stagger.
- **A found card** (`isLevelComplete(n)`): warm off-white card stock (#f3eee3) with a fine grain and a thin printed frame inside the edge, 14px corners. Top: "No. 01" and the year in mono. Then the room's device, drawn flat in `src/pages/collection/DeviceArt.jsx` (VT100 and keyboard, Macintosh and mouse, Netscape on Yahoo!, the 2007 iPhone's lock screen, an iPhone 6 on the 2016 feed, the chat window), on a plate from Matthew's palette (navy #0d4b88, yellow #edb30a, sky blue #84b6fd, green #539267, coral #e46868, brown #9a6b59, in room order). Then the artifact's name in Instrument Serif (Google Fonts, `index.html`), the room title in small caps, a rule, the description as small print, and a footer "Interface Artifacts · 1 / 6". Text comes from `src/data/artifacts.js`.
- **A card not found:** face down. A dark back with a fine crosshatch and an inner frame, "No. 0N" in the corner, a round seal with the year, the room title in the serif and "Finish this room to add it."
- **Motion:** under the pointer a card lifts 4px, tilts a few degrees towards it and catches a soft light where it is; the device grows slightly. No foil or holographic effects. Under reduced motion the cards don't fade, tilt, lift or shine.
- Every card is a button that opens its room, with a white focus ring. The dev panel's progress switch at none turns them all face down.
- **Under comparison (dev server only):** "card style" in the dev panel (collectible · museum · hybrid) shows the same cards in the museum's own style (white, square corners, system sans, DiscoveryCard's label and year type, no grain, tilt or shine; unfound rooms as plain outlines), remembered per browser. The production build always shows the collectible cards. A third option, **Hybrid** (Matthew, 10 Nov 2026): the museum look's square corners, white card and sans titles with the collectible's lift, the tilt towards the pointer and the soft light that follows it (none under reduced motion). Remove the switch and the losing styles once Matthew decides.
- **Art under comparison (dev server only):** "card art" in the dev panel (drawn · illustrated), for the collection page and card timeline. Drawn is the flat SVG drawings in `DeviceArt.jsx`; Illustrated is Matthew's illustrations (10 Nov 2026), `assets/collection/illustration-0…5.webp` (720px wide, 9–33 KB), shown whole on a plate the colour of each image's own ground. Remembered per browser; production shows Drawn.
- **Also under comparison (dev server only): the timeline as cards.** "timeline" in the dev panel (line · cards) replaces the line of entries with the collection's six cards as a path (`src/pages/CardPath.jsx`): the same 3/2/1-column grid, a thin #333 line joining each card to the next in the gaps, every card face down until its room is finished. A room finished since the path was last shown turns over (a 900ms flip on the card's vertical axis, 700ms after the page appears, 260ms apart when several turn at once); cards already seen stay face up (`ux-archaeologist:cards-seen`, cleared by the dev panel's progress switch at none). With nothing done, "Start here" sits over the first card. The title and "N of 6 found" sit top left, the Collection link is hidden, and the card style and art follow the dev panel. While it's on, the discovery card's Continue returns to the timeline instead of the next room, so the turn is seen. Reduced motion: cards appear already turned. The card components are shared with the collection page (`src/pages/collection/cards.jsx`, `cardLook.js`).
- **Card lab (dev server only, Matthew's workbench, 10 Nov 2026):** `src/pages/CardLab.jsx` at `/card-lab` (or Card lab in the dev panel). One row per design in `src/pages/cardLab/variants.js` (look, art, optional plate colours, optional class from `CardLab.module.css`), all six artifacts side by side, scrolling sideways. Click a card to turn it over (700ms flip); the top bar has Fronts · Backs for all, Size S · M · L (220/260/300px, remembered) and a filter to one artifact. Uses the collection's own card components, so it always shows the current cards. Besides the collection's card in its looks, the lab has its own designs (`src/pages/cardLab/LabCards.jsx` + `.module.css`, picked with `design`): Poster (full colour, huge year), Wall label, Big type, Two-sided (picture front, text back), Paint chip (with the set of six along the foot), Split (colour strip with the year on its side), Ticket, Medallion and Glow, on the palette (`collection/cardArt.js`, which also has `PLATE_INK`: near-black text on yellow, sky blue and coral) or the illustrations' grounds. Rows can be arranged with `arrange`: fan (a hand of cards), deck (spreads under the pointer), scatter (dropped on a table) or stagger. Not in the production build (route and chunk exist only under `import.meta.env.DEV`).
- **Also under comparison (dev server only):** "titles" in the dev panel (sans · serif) sets every level title in the cards' Instrument Serif (HUD title and dot tooltips, timeline entries, the intro card's title, the discovery card's name; `src/shared/devLooks.js`, a `data-serif-titles` attribute on `<html>`), to tie the museum to the collection. The small-screen notice and all body text stay sans. Off in production.

### Dev panel (dev server only)
Every dev control in one place, the same in both museums (backlog, "Dev: one dev panel behind a corner tab"; 10 Nov 2026). `src/shared/dev/DevPanel.jsx` + `.module.css`, loaded lazily by SharedLayout behind `import.meta.env.DEV`, so the production build has no tab, panel or code.
- **Tab:** a small monospace `dev`, fixed in the bottom-right corner (2px in, clear of Classic's About), at 35% opacity until pointed at, focused or open. Always there, last in the tab order.
- **Panel:** opens above the tab; dark monospace dev chrome, the same on every page and theme, never either museum's style. Groups: Museum (museum Classic / Index; then, shown with the Index only: pictures dots / stamps / fossils, pointer arrowhead / stick, level layout corners / side, timeline list / line / cards / dig, continue next room / timeline), Classic looks (titles sans / serif, timeline line / cards, card style, card art), Levels (catalogue off / on, on by default: every level's catalogue record, an experiment; see Level 1), Progress (progress none / all, below), Labs (Card lab, Style lab, Dot editor; each closes the panel and goes there).
- **Opening and closing:** click the tab or press Ctrl+Shift+D (read in the capture phase and consumed, so Level 0's terminal and Level 5's chat box never see it; it overrides Chrome's "bookmark all tabs" on Windows and Linux while the dev server is open). Escape or a pointer down outside closes it and puts focus back on the tab. Open or closed is remembered per browser (`ux-archaeologist:dev-panel`).
- **Floating:** a portal into `<body>`, z-index above every modal and the small-screen notice; not `data-hud`, so it never moves an artifact; the closed panel takes no clicks except on the tab.
- **Keys:** each control keeps its old storage key (`museum`, `index-pictures`, `index-pointer`, `index-level-layout`, `index-timeline`, `serif-titles`, `card-timeline`, `collection-style`, `card-art`, progress). Changes that pages read while drawing (progress, line or cards, card style and art) go out as one window event (`src/shared/dev/devEvents.js`, `useDevChange`); Timeline, Collection, CardPath and the index museum re-read on it.
- **Screenshots:** `scripts/*-shots.mjs` hide `[data-dev-panel]`.
- **Progress** (Matthew's review, 12 Nov 2026: resetting is a tool for Matthew, not for visitors): one switch, `progress: none / all`, in place of the old Complete all button. *none* resets every level (`resetAll`, which also clears what a level kept for the visit) and the timeline's seen finds (`forgetCardsSeen`); *all* completes the six (`completeLevel` each) without marking them seen, so the timelines' reveals still play. It shows the current state: none or all is pressed when that's true; in between neither is, and the group's heading reads `Progress · 2 of 6`. No confirm step. Reset progress, and its confirm lines, are gone from both museums' timelines, so production, with no dev panel, has no reset.
- Dark mode stays where it was; it's for visitors, not dev.

### Style lab (dev server only)
`src/pages/StyleLab.jsx` at `/style-lab` (or Style lab in the dev panel): phase 1 of a museum restyle (backlog, Ideas "Museum restyle"; built 10 Nov 2026). Eight concepts for the museum layer, each a static mock of four screens (title, timeline, collection, one level frame) with the museum's real text and a fixed state. Round 1: A Unstyled document, B Index, C Canvas, D Colour field, E Specimen sheet, F Notebook. Round 2 (Matthew's read of round 1 is in the backlog): B2 Index refined, with cards in the list's own terms, the artifact fitted beside or below the list and, since Matthew's read of round 2, his dot illustrations (shown beside the list when a room is pointed at, in six little squares that open the rooms, and on the cards); and G Punch card (dropped by Matthew, still in the lab), with dot-matrix capitals drawn in SVG, numbered notes, punched 80-column cards and Matthew's dot illustrations (`src/pages/styleLab/g/`) as a third card art. B2 and G show the level frame twice, around the Mac and the iPhone. It opens on an index of all six with live thumbnails; a screen's address is in the hash (`/style-lab#d/level/3`). The lab's files are `src/pages/styleLab/` (a `.jsx` and a `.module.css` per concept; text in `content.js`); it imports the collection's cards and art read-only and no other museum component, and nothing in the museum uses it. Concepts size themselves with container units (the lab's stage is a size container named `lab`), so they draw the same full-size, at phone width and in the thumbnails. Screenshots: `docs/style-lab/`, retaken with `node scripts/style-lab-shots.mjs`. Not in the production build (route and chunk exist only under `import.meta.env.DEV`). **None of this is the museum's design yet:** the rules in this spec still describe the live museum until Matthew picks a direction.

### Index museum (dev server only, behind a switch)
A second museum layer: one monospace list that is the whole museum, built from concept B2 (backlog, Approved, "the index museum"; first version 10 Nov 2026). The Classic museum described in the rest of this spec is unchanged and is still what the production build shows. Restore point: the git tag `museum-classic`.

- **The switch:** `src/shared/museumStyle.js` is the one place that decides: `'classic'` or `'index'`, on the dev server `'index'` unless this browser has chosen Classic (stored as `'classic'` in `ux-archaeologist:museum`; 12 Nov 2026, backlog "one home page"), production always `'classic'` (`resolveMuseumStyle`), mirrored as `data-museum` on `<html>`. Flip it under Museum in the dev panel, in either museum and inside any level. It swaps presentation only:
  - `SharedLayout` renders `IndexMuseum` in place of the Classic HUD corners and the small-screen notice (not on the card lab, style lab or test page); `App` renders no page for the title and timeline, because in Index they are the list (and the collection redirects to the timeline).
  - Levels import `IntroModal`, `ObjectiveTracker`, `HintPill` and `DiscoveryCard` from `src/shared/museum/`. Each draws the Classic component, or publishes its props to `src/shared/index-museum/store.js` for the list to draw. A level's state machine, objectives, hints, sounds and progress are the same in both, so flipping mid-level keeps its place.
- **Files:** `src/shared/index-museum/` (`IndexMuseum.jsx` + `.module.css`, `store.js`, `words.js`: the museum's copy word for word from the Classic components; `DotPicture.jsx`; `band.js`: the device's box for the fade), `src/shared/museum/` (the four switching pieces), `assets/dots/dots-0…5.webp` (Matthew's dot illustrations, ink-only masks, copied from the style lab).
- **Grid and type (tokens on `.ix`):** one monospace stack (`ui-monospace, Menlo, Monaco, 'Courier New'`) at one size, 13px on 20px rows. Columns in `ch`: a line is `[cursor 2ch][mark 6ch][text][leader][right side + arrow]`; a line under another starts `--ix-sub` 2ch further in; running text stops at `--ix-measure` 64ch; the list is `--ix-list` 76ch on the home page, and `--ix-hud` 50ch in a level. Gaps are one row. Page edge 24px (16px at phone width).
- **Ink:** black `#000` on white for what matters now; one grey, `#666` (5.7:1), for what's secondary: leaders, right-hand sides, `[ ]`, the hint, labels, "not found", rooms you're not in.
- **Dark mode** (Matthew, 10 Nov 2026): a "Dark mode" line with `[ ]` / `[x]` (`aria-pressed`) on every view, after About on the home page and after "Back to timeline" in a level's full list. Dark is the default (Matthew, 10 Nov 2026); choosing light is remembered per browser (`ux-archaeologist:index-theme`, `src/shared/index-museum/theme.js`) and mirrored as `data-index-theme` on `<html>`. Dark inks: `#e6e6e6` for what matters now, `#8a8a8a` (5.4:1) for the second ink, on `#111`. The room behind the artifact follows through `--ix-room` (white or `#111`) on `body` and the level page. The artifacts were designed on the Classic museum's dark room, so in dark the Level 4 ghost iPhone's outline shows again and Level 5's chat sits on a dark page.
- **Pointer** (backlog, "a flint arrowhead as the museum's pointer"; 11 Nov 2026): a tiny flint arrowhead, the fossil version of the pointer, 20px tall, everywhere in the museum layer (the page and the room round a device, the list, the corners, the catalogue record), in the text colour with a 1px page-colour rim and flake scars, light or dark with the theme. It stays the same on links and buttons (no hand; the list's hover and inverted rows show what's clickable); text inputs keep the caret. Inside a device it gives way: each level marks the box its device occupies with `data-artifact`, where the system default returns (Levels 0, 3, 4, 5) and Levels 1 and 2 show their period pointers. Classic is unchanged. Drawn by hand at 1x in `scripts/index-pointers.mjs`, which writes `assets/pointers/<name>-<light|dark>[@2x].png` (the 2x the same drawing doubled); styles in `src/shared/index-museum/pointers.css`: the 1x file, then a 1x/2x `image-set`, then `auto`; hotspot `1 1`, the tip. A second pointer to compare, a fossil stick from Matthew's photo (`docs/reference/style-lab/cursor-fossil-stick.png`), about 28px long, tip at the thin end, the fork at the bottom right: dev panel Museum > pointer (`ux-archaeologist:index-pointer`, `pointer.js`, mirrored as `data-ix-pointer`), arrowhead by default; the stick's styles (`pointers-stick.css`) and drawings load on the dev server only. Comparison: `docs/museum-index/pointers/compare-arrowhead-stick.webp`.
- **Picture options (dev server only, under comparison):** "pictures" in the dev panel (dots · stamps · fossils, shown while the Index museum is on) picks the set. Every room picture follows it (the hover preview, the discovery, the collection's cards). Dots are the default and all production shows. *Stamps:* six coloured stamp prints cut from `docs/reference/style-lab/stamp-illustrations.webp` into `assets/stamps/stamp-N.webp`: one 480 × 408 box (the 400 / 340 shape) round each picture's centre, at the reference's own scale, paper and grain kept. The Command Line's is Matthew's own black stamp (a `>_` prompt key, cracked; 10 Nov 2026; source `docs/reference/style-lab/stamp-command-line.webp`, at its own resolution in the same tile), in place of the blue `$` and cursor. Each sits on its own paper in its own colours, never inverts and has no frame; unfound rooms keep the empty dot grid. While no room is pointed at, the space beside the list on the title and timeline shows a resting stamp, an arrowhead (Matthew, 10 Nov 2026; `assets/stamps/stamp-default.webp`, cut to the same tile and scale from `docs/reference/style-lab/stamp-default-arrowhead.webp`), with no year; pointing at a room swaps in its stamp, and pointing away brings the arrowhead back. With the dots that space stays empty until a room is pointed at. *Fossils* (Matthew, 10 Nov 2026): each room's idea as an archaeological find in stipple ink (a broken stone `>` with a stick for the cursor, a flint arrowhead, a statue's pointing hand, a stone slab with a thumb-worn dip, an ammonite, a speech bubble of amber), cut from `docs/reference/style-lab/fossil-pictures.webp` by `scripts/fossil-pictures.mjs` into `assets/fossils/fossil-N.webp`: one scale, each find centred in the same 600 × 510 box (400 / 340), ink-density masks drawn in the text colour like the dots, so black on light, light on dark (the shading reads like scratchboard) and inverted on the black row. While no room is pointed at, the tablet rests beside the list on the title and timeline: the museum's main picture, a pillow-shaped clay tablet with a damaged lower edge, its face written in about 10 rows of small impressed signs like cuneiform, a script made only of the six rooms' signs repeated (`>_`, pointer, hand, rounded rectangle, spiral, speech bubble). From a distance it reads as an ancient tablet; up close the words are interfaces (Matthew, 11 Nov 2026; source `docs/reference/style-lab/fossil-tablet-script-2.webp`, 1100 × 1430, coarser stipple and deeper signs; the earlier clay tablet `fossil-tablet-script.webp` and the carved tablet in three bands `fossil-tablet.webp` stay in the same folder as a record). `scripts/fossil-tablet.mjs` makes it into the mask `assets/fossils/fossil-tablet.webp`: trimmed to the ink, its own proportions, never upscaled, and scaled down to at most 480px tall, about twice the 226px it is drawn at (343 × 480, 109 KB). At the size shown, the signs read as writing rather than as six separate signs, which is intended. It is fitted with `contain` in the room pictures' 400 / 340 box, so it is height-bound, centred and never cropped or stretched, and a larger file swaps in with the script alone. Pointing at a room swaps in its find, and leaving brings the tablet back, with no animation. In dark mode the face goes mid-grey, the signs light, and the dark side a bright rim on the right; the rows still read as rows. Like every resting picture, it isn't shown under 900px wide, where the space beside the list is hidden. A redraw is the same script on a new sheet, no code changes. Remembered per browser (`ux-archaeologist:index-pictures`, `src/shared/index-museum/pictureStyle.js`). The dev server serves stamps and fossils by path, so the production build has neither the switch nor the files. Comparisons: `docs/museum-index/pictures/`.
- **Line states:**
  - *Rest:* black text, grey right side.
  - *Can be chosen:* a dotted grey leader to the right side and an arrow: `→` goes somewhere, `↗` leaves the site, `+` / `−` opens / closes in place. Leaders mean only this. Exception: in a level, the rooms you're not in are bare grey lines (still clickable) so the list stays quiet.
  - *Pointer hover:* the lighter state: `>` in the cursor column, the text underlined, full ink.
  - *Current / keyboard focus:* the inverted line (white on black, `aria-current="page"` for current). Current is the room you're in, or Collection on the collection.
  - *Objectives:* `[ ]` grey box, black text; done: `[x]`, the line grey and struck through. A wrapped objective hangs under its text, not the box.
- **Views:**
  - *The home page* (backlog, "Index museum: one home page, the timeline opening under Enter"; Matthew, 12 Nov 2026): the title and the timeline are one page. `/` shows the name, the subtitle, "Enter the exhibit" with the count on its right (`4 of 6 found`) and `+`, Collection with "N of 6 found", About (`+` opens the Curator's Note in place: paragraphs with a blank line between, the credit, Portfolio ↗ and LinkedIn ↗), Dark mode and "A project by Matthew Dea" in grey. The six rooms are hidden at first.
  - *The timeline, under Enter:* Enter opens the rooms right below itself, typing in line by line with the list's stagger (none under reduced motion), the way About opens; its `+` turns to `−` (`aria-expanded`) and clicking it again closes them. Each room line: year, title, and the artifact's name or a grey "not found". Focus moves to the next room to play. Opening is `SharedLayout`'s `'timeline'` view and closing its `'title'` view, swapped without the page fade (About stays open across it). Opening pushes `/timeline` onto the browser's history, so Back closes it (closing uses Back when the open was a push, else pushes `/`); loading `/timeline` shows the page with it open, and a level's "Back to timeline" lands on it open. Elsewhere the address isn't touched, and Classic never touches it.
  - *Four timelines, under comparison* (dev server only; backlog part 4; Matthew, 12 Nov 2026): the dev panel's Museum > timeline (list · line · cards · dig, `ux-archaeologist:index-timeline`, `indexTimeline()` in `devLooks.js`; production has the list) picks what opens under Enter. Line, cards and dig are `src/shared/index-museum/Timelines.jsx`, drawn in the list's type and inks. With any of the three, the picture beside the list goes and the timeline takes the page's width, up to 150ch (the list's own lines keep 76ch). Every version links each room to its level and draws the rooms in whichever Pictures set is on. Each room is a button (`data-ix-nav`, in time order in the page), labelled "1984, The Desktop, Direct Manipulation" or "…, not yet found"; Tab and ↑ / ↓ reach them like the list's lines, ← / → move along the line and the cards, focus starts on the next room to play.
    - *List:* today's lines, as above.
    - *Line:* a hairline from 1975 to 2025, labelled at its ends, with a tick every five years; each room a point at its own year, so the gaps are to scale. Above each point the room's picture on a short stem, the year below. A room not yet found has an open point and a dotted outline the picture's size; the next room to play has "next" above it. Hovering or focusing a point shows its title and the find's name (or "not yet found") under the year. Pictures are 9% of the line's width, at most 14ch (five years are 10%), so neighbours never touch: about 97px at 1440. Under 600px the line runs top to bottom (800px, 16px a year), the years on its left, the pictures to its right with the title and find always beside them.
    - *Cards:* the six rooms as cards in one row in time order, in the Index's own card (the collection's B2 card, square, 1px ink border): No. and year, the picture, the name and room. A room not yet found is the blank card: No. and year, a `?` on the empty dot grid, no name ("next" on the next one). Hover and focus invert a card. Three columns under 1100px, two under 600. Every row's tops line up whatever the cards' state, found, blank or turning over (Matthew's review, 12 Nov 2026: the card being revealed sat a whole card lower, and its row's other footers dropped with it, because `.card > span { display: block }` outranked the turn's `display: grid`, so its two faces stacked; the rule is now `.card > .turn`). The footer, "Interface Artifacts" and `1 / 6`, stays on one line: where the card is narrower than 27ch, as in the row of six on a desktop, it's just `1 / 6` (a container query on the card).
    - *Dig:* a ruled band per room, 5 rows tall, oldest at the bottom (in the page they stay in time order; `column-reverse` draws them, and ↑ / ↓ follow the drawing), each with a faint stipple of its own grain and the year on its left. A found room shows its title beside its picture, small, at a fixed spot of its own in the band (`SPOTS`), so they look scattered; a room not yet found reads "unexcavated", the next one "unexcavated · next". Opening it scrolls the next room to play into view.
    - *The reveal* (line, cards, dig): a room finished since the timeline was last shown, that is, not in `cardsSeen()` (the Classic card path's list, `ux-archaeologist:cards-seen`; cleared by the dev panel's progress switch at none), shows its find arriving 700ms after the timeline opens (260ms apart when several arrive): it fades into its outline (600ms), the blank card turns over (900ms), or the layer's "unexcavated" fades out and the find fades in. The finds shown are then marked seen, so each is revealed once (the list marks nothing). Under reduced motion they are just there.
    - *Continue after a discovery* still goes to the next level. The dev panel's Museum > continue (next room · timeline) is the card path's old setting (`cardTimelineOn`, `ux-archaeologist:card-timeline`, shared with Classic's timeline line / cards), so the reveal can be watched on the way back.
  - *Beside the list (title, timeline, from 900px):* the pointed-at or focused room's picture, 34ch wide, with no label (the year under it was taken off, Matthew, 10 Nov 2026).
  - *No collection* (12 Nov 2026): the finds show on the timeline itself, so the Index has no Collection line and no collection page. A load of `/collection`, or a navigation to it (the Classic timeline's link, a flip to the Index on the Classic collection page), lands on the home page with the timeline open, at `/timeline`. Classic keeps its collection page.
- **In a level: the corners** (the default level layout; backlog, "Index museum: the device centred, the list in the corners"; Matthew, 11 Nov 2026). The device is centred in the viewport as in Classic, and the list splits into four small blocks round it, each `data-hud="corner"` (`Corners` in `IndexMuseum.jsx`). No boxes or backgrounds, the index's type and inks.
  - **Top left, where you are:** "Interface Artifacts →" (to the title) and the room's line, inverted (`1984  The Desktop`), ending in `≡`. The line is a button: click or Enter opens the whole list as a panel over the page (the side column's list, every room, Back to timeline, Dark mode; not `data-hud`, so the device stays put). The panel is only as tall as what's in it, from the top left, on the page colour (white, or `#111` in dark), with no border, rule or shadow (Matthew's review, 11 Nov 2026). Its first line takes focus; ↑ / ↓ move in it; Escape or a pointer down outside closes it and puts focus back on the room line. 34ch wide.
  - **Top right, getting around:** the six years in one row, the current one inverted, each a link to its room (← / → move along the row). 34ch wide. Dark mode is in the full list only (Matthew's review, 11 Nov 2026).
  - **Bottom left, what to read, one thing at a time:** intro, the intro text and, one row under it, "Begin excavation →" (focused; its words in line with the text's, its cursor column in the corner's padding; Matthew's review, 12 Nov 2026: with Begin in the other corner it wasn't obvious to read, then click); booting, nothing; playing, the objectives (`[ ]` / `[x]`, done ones grey and struck) with the hint (`[?] …`, grey italic, the brackets grey like the objectives' boxes; Matthew's review, 12 Nov 2026) under them when it comes; discovery, the discovery band (below). 42ch from 1400px wide, 32ch under.
  - **The discovery, in a band along the bottom** (backlog, "Index museum: the discovery text in a wide band at the bottom"; Matthew, 12 Nov 2026). At discovery the bottom-left corner's content, "Artifact Discovered" and the year, the artifact's name, the discovery text and the room's picture, goes in a band from the left gutter to the bottom-right corner, less the page's 6ch column gap, bottom-aligned with that corner (`DiscoveryBand` in `IndexMuseum.jsx`). The room's picture (whichever Pictures set is on; production: dots) sits at the band's left, as tall as the text (measured) at the pictures' 400 / 340 shape, with the text beside it, at most 80ch. The band is `position: fixed` inside the bottom-left corner, which keeps its 13-row size, and isn't `data-hud`, so the device is placed exactly as in playing. It fades in (300ms, as before; none under reduced motion). The texts were cut to about 50 words for it (see each level's Discovery Card), about 4 lines at 80ch.
  - **The fade over the device** (Matthew's review, 12 Nov 2026; it replaces the tray, which sat on the page colour over the device's foot and made the device look cut off). In intro and at discovery, on every level, the device sits under a fade (in intro it's inert anyway, so the intro text and Begin are the only things lit; it lifts as Begin starts the boot; revisits start at booting, so they have no intro and no fade): the page colour (`--ix-room`: #fff light, #111 dark) at **92%** (`--ix-fade-strength`) with a **6px** backdrop blur (`--ix-fade-blur`), the same on every level and in both themes (`DeviceFade` in `IndexMuseum.jsx`, `.fade` in its CSS). It covers the device's box and 24px past it on every side (`--ix-fade-bleed`, four times the blur), from `--artifact-*` read live, or Level 5's `data-artifact` zone. The blur only works inside the fade's own box, so a box that stopped at the device (it was 1px over) left the device's edge a hard line; with the margin the edge blurs out into the page, at most one grey level a pixel (measured across the left and bottom edges of every level, light and dark, 1440 × 900 and 1920 × 1080; Matthew's review, 12 Nov 2026). Out past the device the backdrop is the page colour, so the fade's own edge doesn't show. The band stays a band; where its text runs over the device's foot the device behind it is faded. The fade comes in over 400ms (at once under reduced motion) and takes the pointer while it's on, so the device can't be used through it. It's portalled into the level's `data-artifact` box at z-index 2, because the level page is `position: fixed` and so its own stacking context: only inside it can the fade sit over the device and under the catalogue record (z-index 3; Level 5's fixed `.recordBox` has z-index 3 for the same reason), which stays unfaded (checked: a leader dot's centre pixel is the same with the fade and without).
    - **Contrast, measured 12 Nov 2026** in headless Chrome: the band's text hidden, the pixels behind each text line where it overlaps the device read, the worst one taken against the line's ink (the record hidden, so only the device counts). Main ink (#000 light, #e6e6e6 dark) at worst **13.3:1** (Level 1, dark, 1920 × 1080). Grey ink ("Artifact Discovered" and the year: #666 light, #8a8a8a dark) at worst **4.72:1** (Level 2's year over Netscape's grey frame, dark, 1920 × 1080); light's worst is 4.82:1 (Level 3's year over the iPhone's black bezel). Every line passes AA (4.5:1) at 1440 × 900 and 1920 × 1080, light and dark. At 375 × 812 no text runs over a device. At 85% the grey ink failed (3.99–4.23:1), which set the strength. Text over the device per level: at 1440 × 900 Levels 1 (the year), 3 and 4 (five lines each); at 1920 × 1080 Levels 1–4; Levels 0 and 5 never. In intro no text runs over a device at 1440 × 900, 1920 × 1080 or 375 × 812, light or dark (measured the same way, 12 Nov 2026); the intro text and Begin fit inside the bottom-left corner's 13 rows.
  - **Under 900px** the discovery stays in the bottom band (40% of the height, scrolling), the room's picture above the text, 30ch wide, with the device under the same fade. The picture, the text and Continue fill more than the band there, so it scrolls.
  - **Bottom right, what to do next:** empty in intro (Begin is under the intro text); in playing the count (`1 of 3`) and "Continue →" once all are done; in discovery "Continue → 1995 The Hyperlink". 34ch wide, 30px up from the bottom, clear of the dev tab.
  - **The device doesn't move:** each corner box is one size whatever it shows. The bottom two are 13 rows tall with their text set from the bottom; the discovery goes in its band instead (above), so the corner's box, and the device, don't change. `useArtifactFit` (`fitCorners`) centres the device in the viewport and scales it as large as clears every corner, beside it (40px) or above or below it (32px), and the edges (24px), up to 1.35×. With the reading column beside it, the device is smaller than in the side layout: at 1440 × 900 the Mac is about 690px wide (side: 880), at 1280 about 650, at 1024 about 310.
  - **Level 5** (no device): the chat fills the width between the top corners and the bottom ones (`--museum-inset-top` / `--museum-inset-bottom`, set by the corners).
  - **Under 900px:** the room's line with `≡` is a band across the top (`data-hud="top"`); the device sits under it; the reading and the next step stack in a band across the bottom, 40% of the height, that scrolls if it's full (`data-hud="bottom"`). The years and Dark mode are in the full list.
  - **Keyboard:** Tab goes through the corners in reading order (top left, top right, bottom right; bottom left has no controls). ↑ / ↓ move through all the corners' controls, ← / → along the years. Text in the bottom corners swaps without animating beyond the list's own typing-in; nothing moves under reduced motion.
  - **The catalogue record** (experiment, every level) avoids the corners like any `data-hud` block.
  - **Dev setting:** "level layout: corners / side" under Museum in the dev panel, shown with the Index (`ux-archaeologist:index-level-layout`, `devLooks.js`); production has corners. The side layout below stays until Matthew decides. `scripts/index-levels-shots.mjs` takes either layout, every level and state, on request.
- **In a level: the side layout** (the earlier one, behind the dev setting): the list is the HUD. Wide, it is a fixed column down the left marked `data-hud="side"`; `useArtifactFit` puts the artifact beside it, 40px away, centred in the space left and between the top and bottom edges, up to 1.35×. Narrow (under 900px) it is a band across the top (`data-hud="top"`, at most half the height, scrolling), the other rooms folded away, and the artifact below it down to 24px from the bottom. The Classic tracker zones are `display: none` in Index so the fit doesn't measure them. Level 5's full-width chat clears the list through `--museum-inset-left` / `--museum-inset-top` (set by the list; 0 / 84px in Classic). The room's line is inverted and one thing opens under it at a time:
  - *intro:* the intro text, then "Begin excavation →" (focused).
  - *booting:* nothing under the room until the level says the artifact is ready.
  - *playing:* "Objectives" in grey, the three objectives, the hint as a grey italic line marked `[?]` after 10 s without progress (same `useHint` timing), then "Continue →" when all are done.
  - *discovery:* "Artifact Discovered" with the year on the right, the artifact's name, its dot picture, the text, then "Continue → 1995 The Hyperlink" (or "Back to timeline" after Level 5, or with the card timeline on), focused.
- **No shadows behind the devices** (Matthew, 11 Nov 2026): in the Index, no device casts a shadow or glow on the page. Each device's outer shadow reads `--artifact-shadow` with today's shadow as its fallback: Level 0's terminal bezel (`TerminalBezel.module.css`), the Mac bezel's two `drop-shadow`s (`MonitorBezel.module.css`), Netscape's frame (`BrowserChrome.module.css`, its 1px black ring stays) and Level 4's ghost iPhone bloom (`GhostDevice.module.css`). The Index sets it to a clear shadow, `0 0 #0000`, on `<html>` (`IndexMuseum.module.css`). It isn't `none`, so it stays valid inside a shadow list and in `drop-shadow()`. Classic falls back, so it's unchanged (compared by screenshot, 11 Nov 2026). Light and shading on or in a device stay: the LEDs, the CRT's glow and inner shading, the phone's own SVG shading, the feed's in-app shadows. Level 3's iPhone and Level 5 cast none. `useArtifactFit` never left room for shadows, so nothing moves.
- **Keyboard, like a terminal menu:** ↑ / ↓ move through the list's lines, Home / End jump, Enter opens, Escape closes what's open (About). Tab order is the DOM order. The list listens on `window` in the capture phase, so while it has focus its keys don't reach an artifact's document-level listeners (Level 0's terminal pulls focus back on every keydown); typing anything else still goes to the artifact. Shift-Tab from an artifact reaches the list.
- **Moving between views:** the list stays mounted and its lines are keyed, so it redraws in place: lines that stay don't move, new lines type in from the left (a 160ms stepped clip, 14ms apart down the list), lines that go just go. Levels still fade in as in Classic. Under reduced motion nothing animates.
- **Phone width (under 600px):** the small-screen notice is two lines at the top of the list ("This experience was designed for larger screens." / "Continue anyway →", focused), with the same `sessionStorage` key and rules as Classic's. Leaders drop out; a right side that doesn't fit drops under its line with its arrow.
- **Under comparison / open:** in light mode the Level 4 ghost iPhone's outline (drawn for the dark room) vanishes on white (fine in dark, the default). Level 5's chat turns light with the light mode (see Level 5, "Light version"). The list is shipped in the production bundle (about 10 KB and the six dot pictures) although production doesn't show it.

### HintPill + useHint
Nudge in a dark pill, fixed 14px under the artifact, centred and no wider than it (wrapping if longer); `useArtifactFit` publishes the place as `--hint-top` / `--hint-max`. Level 5 has no device, so its pill sits at the bottom centre. `useHint(HINTS, { active, completedIndices })` returns the hint for the first unfinished objective after 10s without progress; any completion hides it and restarts the clock. Every level defines `HINTS` alongside `OBJECTIVES`. The pill is not `data-hud`, so it never moves the artifact.

### Progress dots
Each dot is a 17×24 button; hover or focus shows a tooltip under the row with the era and title in the HUD type. Click navigates.

### ObjectiveTracker
Dark translucent card, "OBJECTIVES" label, checklist (unchecked = light, checked = strikethrough + muted). Slides up via `trackerSlideUp` keyframe when playing state begins. Completing an item draws the tick (stroke-dashoffset, ~220ms), then a strike grows across the text from the left as it fades to grey. The HUD Continue button waits ~550ms for the last strike, then rises in with a slight overshoot and a soft halo that blooms off its border. All disabled under `prefers-reduced-motion`.

### DiscoveryCard
White card, no accent line, "ARTIFACT DISCOVERED", large mono year, artifact name (sans, 24px, weight 500), description, "Continue" button → the next level (Level 5 → the timeline).

---

## Sound

`src/audio/sfx.js` synthesises every effect with Web Audio except the recordings named below. Master gain 0.28: sounds of a room, not a game. The context unlocks on the first pointer/key, so timer-driven sounds after "Begin excavation" play. Per era: 1979 VT100 keyclick and bell (one keyboard speaker driven once per status byte, 1.271 ms, so near 787 Hz — derived from the manual's timing, not measured: one pulse = click, ~200 = bell, ~0.25 s) and the power-on bell from the self-test (VT100 Technical Manual §4.2.8), 600 ms into the boot (placement reconstructed: the manual gives the order of the tests, not their timing); 1984 startup beep, a 600 Hz square wave as on the 128K, 512K and Plus (the chord came with the Macintosh II in 1987; source: Wikipedia, "Macintosh startup"), played as the boot begins for about 1 s (Matthew's correction, 8 Nov 2026: 4 ms attack, held, 200 ms fade) — its level is reconstructed (the alert beep's peak, 0.08), no drive sound; 1995 a real dial-up recording (`assets/web/dialup.mp3`, 6.2s, volume 0.25) under the first page load; 2007 unlock/lock recordings (Level 3); 2016 like pop; 2023 send tick, reply-finished tone.

## Period pointers

Level 1's pointer is drawn by `MacCursor` (the real pointer is hidden over the screen): the 1984 arrow, the wristwatch while the drive light is on, or the Mac's I-beam over text, at the pointer's last position sampled about 30 times a second, so it moves in visible steps as on an emulated Mac (infinite mac). It lives on `<body>`, so it stays screen-size. Reconstructed: the 30 Hz step and the I-beam bitmap (Inside Macintosh's iBeamCursor, from memory). During a native drag the browser shows its own pointer. `src/components/era-cursors.css` defines pixel-exact SVG cursors as data URIs: the 1984 Mac arrow (ROM `arrow` data + mask, hotspot 1,1), the Windows 95 arrow (0,0) and the Windows 95 link hand (fingertip 5,0). Level 1 sets the Mac arrow on `.inner` and the wristwatch (`--cursor-mac-watch`, redrawn) while the drive light is on; Level 2 sets the Win95 arrow on `.wrap`, the arrow-with-hourglass (`--cursor-win-busy`) while a page loads, the hand via `--cursor-link` on clickable links and an I-beam on the Location field. Artifact CSS uses `cursor: inherit`. Cursors are screen-space and do not scale with the artifact.

## Container Progression

Hardware presence decreases across the arc: physical terminal → monitor bezel → browser window → handheld device → no device → no device → pure conversation.

| Level | Era | Container |
|-------|-----|-----------|
| 0 | 1979 | VT100 terminal bezel (780×460px) |
| 1 | 1984 | Beige CRT monitor bezel (780×755px) |
| 2 | 1995 | Browser chrome — no device bezel |
| 3 | 2007 | iPhone silhouette (385×735px bezel, 320×480px screen) |
| 4 | 2016 | Ghost iPhone 6: hairline outline + screen glow, 375×667px screen (`GhostDevice`) |
| 5 | 2023 | Full-width chat panel — no device, no chrome, no frame |

---

## Level Details

---

### Level 0: 1979 — The Command Line
**Status: Complete**

**Year:** 1979, set by the machine (Matthew's call, 9 Nov 2026). The terminal, its bezel, keyclick and bell are the DEC VT100 (August 1978), so the level moved from 1971 to match it rather than swapping the hardware. In 1971 Unix users typed on paper Teletypes (Model 33/37) on a PDP-11/20.

**Artifact:** Unix terminal session: a VT100 on Seventh Edition Unix (V7, released by Bell Labs January 1979) on a PDP-11/70.
**Discovery:** Command & Response
**Container:** `src/components/terminal/` — TerminalBezel + TerminalScreen; 780×460px

**IntroModal:**
- Era: `1979`
- Title: `The Command Line`
- Description: "It's 1979, and this is a VT100 terminal, your line to a computer down the hall that the whole lab shares. There are no icons, no menus, no mouse. Just a blinking cursor, and it won't suggest a thing: the machine waits for you to know what to ask."

**Visual Palette:**
- Black screen, green phosphor text
- Monospace font throughout
- Blinking cursor

**Session content (`useTerminal.js`):** one working week, Tue 16 / Wed 17 Jan 1979. Boot as V7's "Setting up Unix" describes: `Boot`, `: hp(0,0)unix`, `mem = …` (value reconstructed), the single-user `#` and `^D` to go multi-user. V7 login (`login.c`): `login: `, `Password:`, the motd, then `You have mail.`; no "Last login". `mail` (`mail.c`): the postmark `From ken Tue Jan 16 08:51:41 1979`, the message, the `?` prompt; the level returns to the shell (reconstructed shortcut). The notes file is dmr's note on the Seventh Edition manual and release; ken's mail is about Belle winning the 1978 ACM computer chess championship (December 1978). Both messages are reconstructed; sources in the file's comments and `docs/copy-pass.md` §7. The motd and "(log in as kerry)" are the exhibit's.

**Objectives (any order):**
1. Read the notes file
2. Read your mail
3. Look up a command in the manual

**Discovery Card:**
- Artifact: `Command & Response`
- Text: "At a terminal you type a command, the computer prints the result, and you decide what to type next. Nothing on the screen shows what's possible: you learn the commands from the manual and from the people around you. The same short commands, like ls and rm, still work on every Mac." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record** (experiment, dev server only; see Level 1, "Catalogue record", for how it works). Facts checked 11 Nov 2026, each against two sources. `IA.1979.01`, object line `DEC VT100, 1978`; data `Intel 8080` / `ANSI X3.64 escape codes` / `37 × 46 × 36 cm, 13.6 kg` / `August 1978`; one label, on the screen: `12-inch screen` / `80 × 24, or 132 × 14`.
- August 1978 (**high**): DEC's own timeline (Computer History Museum archive; vt100.net/timeline/1978.html); Wikipedia "VT100".
- 12-inch screen; 80 × 24, or 132 columns × 14 lines (24 with the Advanced Video Option) (**high**): DEC *VT100 User Guide*, ch. 1–2 (vt100.net/docs/vt100-ug/); Columbia University Computing History, "VT100".
- Intel 8080 (**high**): Computer History Museum, *Revolution* (computerhistory.org/revolution/input-output/14/349/1697); Wikipedia. Columbia says 8085, probably the later VT102.
- Monitor 36.8 × 45.7 × 36.2 cm, 13.6 kg, rounded to 37 × 46 × 36 (**high**): *VT100 User Guide* (gives metric); Columbia (dimensions), Wikipedia (weight). Columbia's 41 lb is the shipping weight.
- ANSI X3.64 escape codes (**high**): *VT100 User Guide* ("X3.64-1977"); Columbia ("first ANSI X3.64 compliant terminal"). That it *popularised* them is **medium** (a judgement: Wikipedia "ANSI escape code"; DEC's "de facto market standard") and isn't on the record.
- Not on the record: the keyboard (detachable, 83 keys; User Guide, Wikipedia) has no label because the exhibit doesn't draw it; the launch price has only one source. DEC's spec gives the VT100 a P4 (white) phosphor; the exhibit's screen is green (single source, so only noted here).

---

### Level 1: 1984 — The Desktop
**Status: Complete**

**Artifact:** Macintosh System 1 desktop
**Discovery:** Direct Manipulation
**Container:** `MonitorBezel.jsx` — beige CRT; 780×755px, 620×415px screen. Drawn from `assets/MonitorBezel@2x.webp`, a headless-Chrome render of `MonitorBezel.svg` (the SVG's 13 blur filters rasterised on the level's first visible frame, a ~200ms stall that ate the page fade-in). `SharedLayout` also starts a view's fade-in only once frames are flowing again after the swap. Never put `will-change`, `transform` or `filter` on SharedLayout's `.content`: it becomes a stacking context above the HUD corners and blocks their clicks.

**IntroModal:**
- Era: `1984`
- Title: `The Desktop`
- Description: "It's 1984, and this is the Apple Macintosh. Until now, using a computer has meant memorizing commands. Here everything is where you can see it: files, folders, even a trash can, there to point at and pick up. Hardly anyone has held a mouse, so Apple packed a cassette tape in the box to teach you."

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
- **Put Back** "puts the selected documents, applications, or folders back into the folder or disk they came from most recently" (1984 manual p. 107, **high**): a desktop item goes back to the folder it belongs to, a Trash item to wherever it was before (the desktop or a folder); a zoom outline flies to its place in the open window, or to the closed folder's icon. **Close All** zooms every Finder window shut. **Select All** selects every desktop icon. **Clean Up** snaps icons to the nearest free grid slot (the manual says "neat rows and columns"; snap vs re-pack is undocumented).
- **Eject** (disk selected, or the disk dragged onto the Trash): the drive light pulses and a dimmed ghost of the disk stays on the desktop, as in 1.0; opening it asks "Please insert the disk: System Disk". With no second disk in the exhibit, the disk is "pushed back in" after 3 s.
- **Utilities folder and applications** (`src/components/apps/`). The Infinite Mac System Disk the screenshots come from has a Utilities folder — Disk Copy, Fonts, Font Mover, TeachText, SysVersion (`macsystem100031.png`; icons traced, 64 Mac pixels apart from 18 in, "5 items   96K in folder"). These are later than this Finder (Font Mover 1985; TeachText (earliest dated version 1.2, 1988; it replaced Apple's Edit between System 2, 1987, and System 7, 1991; a 1984 document would have opened in MacWrite; sources: [Wikipedia](https://en.wikipedia.org/wiki/TeachText), [Eclectic Light](https://eclecticlight.co/2024/05/25/a-short-history-of-styled-text-on-the-mac-teachtext-to-textedit-rtf/), [Macintosh Repository](https://www.macintoshrepository.org/2274-teachtext))); they're here because that disk has them and Matthew asked for TeachText (9 Nov 2026). Launching one reads the disk, closes the desk accessories, plays zoom rectangles from the icon to the whole screen, then the Finder's icons and windows go away until the application quits (they come back as they were).
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
- **Moving items** (`DesktopScene`'s `place`, one record per item: where it is, `loc`, and the folder it belongs to, `home`). "You can drag an icon onto the desktop, onto a folder, disk, or Trash icon, or into an open folder, disk, or Trash window", and on the same disk that moves it rather than copying (1984 manual p. 105, **high**). Every icon, on the desktop or in a window, uses the same HTML5 drag and the same dotted outline at ~10fps, drawn on the desktop so it can leave its window. While the outline covers a folder, disk or Trash icon that may take it, that icon inverts, and reverts when it leaves or on the drop ("when you cover the folder icon with the document icon, the folder icon is highlighted", p. 38, **high**); an open window gets no highlight. Let go in an open window, the item lands where it was let go; dropped on a closed folder's icon, it takes the first free slot on that window's 64-pixel row (*reconstructed*), where it shows when the folder opens. Out on the desktop an item still belongs to its folder: the desktop is "a handy temporary resting place … the Finder will remember where the documents belong" (p. 104, **high**), so Get Info's Where names that folder and Put Back returns it. Information lines follow every move: "N items" counts what's in the window, "NNK in folder" adds up its contents (sizes per file in `SIZE_K`: the System Folder's 208K and Utilities' 96K are the screenshots' totals, the split between files is *reconstructed*), "NNNK in disk" stays 216K until Empty Trash removes files. Get Info works on a selected desktop icon or the item selected in a window; Where reads "System Disk, internal drive" for the disk's top level and "Projects, System Disk" inside a folder (*reconstructed* wording). **Refused, and the outline snaps back** (all *reconstructed*: Finder 1.1's own refusals are unknown): System and Finder outside the System Folder; the System Folder into any folder (the desktop and the disk's top level are fine); the disk into a folder (onto the Trash it ejects); a folder into itself or a folder inside it; System, Finder and the System Folder into the Trash. Empty Trash keeps a trashed folder that holds a locked document (Notes) and names it in the alert (*reconstructed*). Places last for the session and reset on reload; a revisit starts from the original layout. Opening Notes completes objective 1 wherever it is, trashing Projects completes objective 2 from any window, and the first hint drops "on the desktop" once Notes has left it.
- **Opened icons:** while its window is open (until it starts to close), a disk, folder or document icon, on the desktop or in a window, is drawn as its silhouette filled with QuickDraw's dark gray (`dkGray`, rows $77/$DD: three black, one white, shifted two each row) with no outline; when selected only its label inverts. Read pixel by pixel from the opened System Disk in `docs/reference/mac system 1/macsystem100020.png`. `IconShade` masks a `ScreenTexture pattern="dkgray"` with the icon's own SVG, so the dots stay one on-screen pixel at any bezel scale. Notes and the Trash shade the same way (reconstructed: in 1984 opening a document quit to its application, so there is no period example for Notes).

**Sources for the above:** Apple, *Macintosh* owner's manual (1984) pp. 18–111; *Inside Macintosh* Vol. I (1985) I-54, I-273, I-361; *The Easy Guide to Your Macintosh* (1984, Finder 1.1g screenshots); GUIdebook System 1.1 gallery; folklore.org (Puzzle, Calculator Construction Set, Desk Ornaments); Low End Mac on System 1.0. Reconstructed, not sourced: the locked-item Empty Trash alert wording, zoom-rect frame count, menu-blink tick timing, Clean Up's snap behaviour.

**Hardware details (`MonitorBezel`):**
- Glass reflection (`CrtOverlay`) is part of the hardware: always visible, in every state, above everything on the screen. Screen contents live in an isolated stacking context so no z-index inside can cover it.
- No power light or other front indicator, as on the real 128K/512K. The dark dot right of the slot is the manual-eject pinhole.
- Drive in-use LED: small red light recessed just inside the left end of the floppy slot (original 400K drive). Lit while booting from disk and for ~700ms whenever the Finder opens something (`driveBusy` prop).

**Boot sequence (`BootSequence`):** black → gray pattern wipes down the screen in ~20 steps (as the ROM fills the frame buffer) → Happy Mac → "Welcome to Macintosh." → overlay removed. The Happy Mac (25×32 at (243,145)) and the welcome box (448×126 at (32,64) with its 3-pixel shadow, icon and Chicago line included) are bitmaps traced from `macsystem100023.png` and `macsystem100024.png` (`assets/mac/boot-happy-mac.png`, `boot-welcome.png`), placed in Mac pixels, then the real `DesktopScene` reveals its own menu bar, Projects, Notes, Trash in place (`reveal` 1–4). No blink animation and no stand-in menu bar or icons, so nothing resizes or moves at the hand-off. Callbacks go through a ref so parent re-renders never restart the timeline.

**Empty Trash (Special menu):** enabled when the Trash holds anything. The Finder writes to the disk (drive light, watch cursor) and permanently deletes the contents, silently, as in 1984 (Finder sounds arrived with System 6.0.4+). Notes is a locked document: it stays in the Trash and a 1984-style alert (`MacAlert`: thick double frame, Caution icon, OK with default ring, Return dismisses) explains, sounding the system beep. The alert wording is written in the Mac's voice, not quoted from System 1.

**Objectives (any order):**
1. Open the Notes document
2. Delete the Projects folder
3. Choose a command from a menu

Hints, one each: "Double-click the Notes icon on the desktop" · "Drag the Projects folder onto the Trash" · "Click a menu name at the top of the screen, then click a command in black". Objective 3 was "Look through the menus" until Matthew's review (12 Nov 2026): it didn't say what to do. "Choose" is the Mac's own word for picking a menu command. Any enabled command completes it, File ▸ Open and Close included (they used to return before `onMenuItemClick` in `MenuBar`'s `runAction`, so they didn't count), as do the Apple menu's desk accessories and TeachText's own menus; a grey (dimmed) command does nothing and doesn't count. Classic and the Index use the same objective and hint.

**Discovery Card:**
- Artifact: `Direct Manipulation`
- Text: "On the Macintosh, files, folders and the Trash are pictures you point at and move, and the menus list every command, so there's nothing to memorize. Xerox and Apple's own Lisa had done this first; the Mac, at $2,495, brought it to far more people." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record (experiment, dev server only; 11 Nov 2026).** Behind the dev panel's Levels > catalogue (`ux-archaeologist:catalogue-record`; on by default since Matthew's review of 11 Nov 2026, off is stored as `'0'`; absent from the build). With it off, nothing changes. With it on, the museum's catalogue record sits around the device (backlog, "Levels: the catalogue record around the device", piloted here on the Mac, then rolled out to every level in "Index museum: level screen fixes"). Each level's facts and sources are under that level. It replaces the stipple reveal, which was dropped; that reveal's frames stay in `docs/reveal/`.
- **Museum layer, the artifact untouched:** `src/shared/catalogue/` — `Catalogue.jsx` (what a level renders: reads the setting, loads the rest lazily on the dev server only), `CatalogueRecord.jsx` (drawing and the toggle), `place.js` (placement), `records.js` (each room's record). It sits inside each level's `.wrap` and is placed from the same fit, so it moves and scales with the device. Level 5 has no device: the record treats the chat's 680px column (from the top of the chat to its foot) as the object, in a fixed box over the chat. It takes no clicks except on its toggle.
- **Parts:** a part is at fixed device coordinates (the Mac's screen and slot) or found in the artifact by a selector (every other level: the terminal's screen, Netscape's N and Location field, the iPhone's screen and home button, Instagram's header and the first like button on screen, the chat's message box and the first reply). A found part's dot sits on the element's edge that faces the label column, halfway down, so the leader runs outwards and never crosses the part (`locateParts`; Matthew's review, 12 Nov 2026). Where another labelled part stands between the dot and the column (Netscape's N, 4px right of the Location field and taller than it), the dot goes on the part's bottom edge, 16px short of the other part, and the leader drops to 5px below both and runs straight out, an L, with its label fixed at that height; labels above it move up to make room (`placeRecord`; Matthew, 12 Nov 2026). The Mac's two fixed parts keep their positions until the labels are reworded. A part that isn't drawn (Level 4's screen before the boot, its feed hidden at the discovery in the Index, no reply yet in Level 5), or is scrolled off the device, has no label; it is found again on scroll, resize and each state.
- **The toggle** (Matthew's review, 11 Nov 2026): `IA.1984.02 [−]` beside the number while the labels and data show, `[+]` while they're hidden. A real button (`aria-expanded`, labelled "Show catalogue record" / "Hide catalogue record"), reachable by Tab and Enter, in the grey ink with the list's hover (underline, full ink) and inverted on keyboard focus. It works in every state; each state starts with its default (full in intro and discovery, the number while playing), and once used, the choice holds through every state for the rest of that visit to the level (it is the record's own state, new on the next visit). Showing and hiding fade (400ms; none under reduced motion). Where the record has no room beside or under the device, the number is the whole record and the toggle isn't shown, since there would be nothing to show.
- **What it shows:** the index's monospace, 13px on 20px rows, in two inks: main ink for the main text and the grey ink for lines and secondary text. The inks follow the museum: Index light #000 / #666, Index dark and Classic #e6e6e6 / #8a8a8a. It shows:
  - the catalogue number `IA.1984.02`, above the device's top left
  - the object line `Apple Macintosh (128K), 1984`
  - the data block: `Motorola 68000, 7.8 MHz` / `128 KB memory` / `35 × 24 × 28 cm, 7.5 kg` / `$2,495` / `24 January 1984`
  - two labels with leader lines: `9-inch screen` / `512 × 342, black and white`, and `3.5-inch floppy drive` / `400 KB`
  - The leader lines are 1px, in the grey ink (an SVG polyline), and end in a 5px dot on the part: the screen at (630, 330) and the floppy slot at (600, 680) in bezel px, or (150, 330) and (418, 680) when the column is on the left. Labels sit level with their parts; one that would overlap the label above moves down and its line takes one bend (Netscape's N and Location field are close together).
  - No scale bar and no dimension lines.
- **When:**
  - intro and discovery: the full record
  - booting and playing: the labels, object line and data fade out (400ms) as the boot starts, and only the number stays, at 11px in the grey ink
  - under reduced motion: no fades
- **Placement:** a 28-character column 16px beside the device, right side first. The object line and data go next to the labels, ending one row above the first label (Matthew's review, 12 Nov 2026: on Level 5 they had sat in the top corner of the chat's full-height column, far from the message box). If that doesn't fit, they go at the top of the column, else under the last label, else up from the device's foot. The column is used only if every block fits inside the viewport, 16px clear of every `[data-hud]` block (so never over the HUD or the index list) and clear of each other. The labels never cover the screen. The number sits above the device's top left, or just inside it when a HUD block is there (Level 5 in the Index at narrower widths).
  - With no room beside the device, the leader lines and labels go, and the object line and data go 20px under the device, if they fit there. Otherwise only the number shows.
  - Measured on 11 Nov 2026 (`scripts/catalogue-shots.mjs`):
    - Classic: labels beside the device at 1920, 1440, 1280 and 1024, with both dots on their parts.
    - Index: only the number at every size, 1920 included (about 206px beside the device there; the column needs about 250).
    - Every museum at 375: only the number, because the device already fills the height below the list.
  - The intro and discovery cards are drawn over the record, as over the device.
- **Facts** (Wikipedia "Macintosh 128K", read 11 Nov 2026, all **high**), checked against two other sources:
  - **Apple**, Macintosh 128K technical specifications (support.apple.com/kb/SP186): 68000, 128 KB, 512 × 342, 400 KB floppy, 13.6 × 9.6 × 10.9 in, 16.5 lb, introduced 24 January 1984.
  - **Byte**, February 1984, "At a Glance" (Gregg Williams' review): 68000 at 7.8336 MHz, 9-inch screen, 512 × 342, single-sided 3½-inch 400K Sony drive, $2,495.
  - Byte gives 13.5 × 9.7 × 10.9 in and 19.5 lb. The record keeps Apple's figures; Byte's weight probably includes the keyboard and mouse (**medium**).
  - Metric conversions are rounded: 34.5 × 24.4 × 27.7 cm → 35 × 24 × 28; 7.48 kg → 7.5.
  - The catalogue number is the museum's own (Level 1 is the second object after Level 0).
- **Shots for review:** `docs/catalogue/`, taken by `node scripts/catalogue-shots.mjs`:
  - intro, playing and discovery
  - Index light, Index dark and Classic
  - 1440 and 375, setting on and off
  - The script also prints where each dot lands at 1920, 1440, 1280, 1024 and 375.

---

### Level 2: 1995 — The Hyperlink
**Status: Complete**

**Artifact:** Academic homepage viewed in Netscape Navigator
**Discovery:** Hyperlink Navigation
**Container:** `src/components/web/BrowserChrome.jsx` — no device bezel; 700×580px

**IntroModal:**
- Era: `1995`
- Title: `The Hyperlink`
- Description: "It's 1995, and this is Netscape Navigator, the browser most people use to get on the web. The web has no map, and no good way to search it yet. Every link was put there by a person, and following them is the only way around, so where you end up depends on whose pages you happen to find."

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
2. Go back a page
3. Find "A Brief History of the Web"

**Discovery Card:**
- Artifact: `Hyperlink Navigation`
- Text: "On the early web, every link was put there by the person who wrote the page, and you found things by following them from page to page. Directories such as Yahoo! sorted sites by hand, until search engines such as AltaVista, launched in December 1995, took over." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record** (experiment, dev server only; see Level 1, "Catalogue record", for how it works). Facts checked 11 Nov 2026, each against two sources. The software, not hardware. `IA.1995.03`, object line `Netscape Navigator, 1995`; data `1.0: 15 December 1994` / `$39, free for education` / `and non-profit use` / `Most-used browser, 1995`; labels on the N box (`Netscape logo` / `animates while loading`) and the Location field (`Location` / `the page’s address`).
- 1.0 released 15 December 1994 (**high**): Netscape's press release, posted to www-talk by Marc Andreessen (ksi.cpsc.ucalgary.ca/archives/WWW-TALK/www-talk-1994q4/1135.html); Wikipedia "Netscape Navigator".
- $39 for commercial use, free for education and non-profit use (**high**): the same press release; *Fortune*, 10 July 1995 ("costs $39"); Wikipedia.
- The most-used browser in 1995 (**high** for the claim, no figure: the shares quoted run from about two thirds to over 80%): *Fortune* 1995 (Dataquest); Wikipedia "Browser wars".
- The logo animates while a page transfers (**high**): *Netscape Handbook*, 1994 ("animates when a transfer is in progress"); Wikipedia "Throbber". Netscape called it the status indicator. The Location field shows the page's address (**high**): *Netscape Handbook*; Wikipedia "Address bar".
- Not on the record: 1.1 in April 1995 (**medium**, month only: ibiblio browser timeline; TidBITS, March and May 1995) and the meteor animation arriving with 1.1 (one source).

---

### Level 3: 2007 — The Touchscreen
**Status: Complete**

**Artifact:** Original iPhone interface
**Discovery:** Multi-Touch
**Container:** `src/components/phone/PhoneFrame.jsx` — `assets/iphone.svg` at 385×735px; screen slot 320×480px

**IntroModal:**
- Era: `2007`
- Title: `The Touchscreen`
- Description: "It's 2007, and this is the original iPhone. Other phones have plastic keyboards, small screens and sometimes a stylus. This one has no stylus, no keys, nothing to learn first. Just a sheet of glass and your finger."

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
- Home screen: 2 swipeable pages, the 12 launch apps (the SMS app labelled **Text**, as until iPhone OS 3.0 in 2009; no Contacts icon, which arrived in iPhone OS 1.1.3, January 2008) + 4-app dock
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
2. Open a note
3. Swipe to the second home screen

**Discovery Card:**
- Artifact: `Multi-Touch`
- Text: "The iPhone's screen sensed fingers directly, more than one at a time, so you dragged, flicked and pinched instead of moving a pointer. Lists kept moving after you let go and bounced at the end, as if they had weight. Within a few years almost every phone worked this way." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record** (experiment, dev server only; see Level 1, "Catalogue record", for how it works). Facts checked 11 Nov 2026, each against two sources. `IA.2007.04`, object line `Apple iPhone, 2007`; data `Samsung ARM, 412 MHz` / `128 MB memory` / `115 × 61 × 11.6 mm, 135 g` / `$499 (4 GB), $599 (8 GB)` / `29 June 2007`; labels on the screen (`3.5-inch Multi-Touch screen` / `320 × 480`) and the home button (`Home button` / `the only button on the front`).
- 29 June 2007 (US), $499 (4 GB) and $599 (8 GB) on a two-year contract, 3.5-inch 320 × 480 screen, 115 × 61 × 11.6 mm, 135 g (all **high**): Apple's press releases of 9 January and 28 June 2007 and its July 2007 spec page (web.archive.org/web/20070704225044/http://www.apple.com:80/iphone/specs.html); Wikipedia "iPhone (1st generation)"; EveryMac and TidBITS agree.
- Samsung ARM at 412 MHz, 128 MB memory (**medium**: Apple never published them; from teardowns): Wikipedia; EveryMac.
- Multi-Touch, used with a finger (**high**): Apple's 2007 technology page; TidBITS, January 2007. The only button on the front (**high**): Macworld's review, September 2007; David Pogue on NPR, June 2007.
- Not on the record: pixel density (Apple said 160 dpi in 2007, 163 ppi later).

---

### Level 4: 2016 — The Feed
**Status: Complete**

**Artifact:** Instagram for iOS, spring 2016 (blue header, dark tab bar: the UI just before the May 2016 redesign)
**Discovery:** Algorithmic Feed
**Container:** `src/components/feed/GhostDevice.jsx` — hairline iPhone 6 outline and screen glow, 375×667px screen; no solid bezel and no side-button ticks (the hardware is fading out between Level 3 and Level 5)

**IntroModal:**
- Era: `2016`
- Title: `The Feed`
- Description: "It's spring 2016, and this is Instagram on an iPhone 6. There's nothing to open and nothing to look for: the photos are already there when you arrive, and there are always more below. This year Instagram begins deciding which ones you see first, guessing at what will keep you looking."

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

**What shows where (feed audit, 9 Nov 2026; `docs/feed-audit.md`):**
- *Profile only:* `PROFILE_ONLY` in `feedData.js` lists archived posts that stay in their account's grid but never reach the home feed (slot leads or older pages) or Explore; a slot whose lead is listed opens on the next post. Adding a post is one line.
- *Never a slot lead:* `NO_LEAD` in `feedData.js` lists posts a slot never opens on (cryptic, video-only or off-account leads); they still show in grids and Explore.
- *Removed:* `REMOVED` in `archiveData.js` lists posts taken out of the level (nudity, ill children and a minor, broken-looking or badly cropped stills, photos too small with no larger copy). Their files are deleted; the list keeps them out if the recovery script downloads them again.
- *@instagram's reposts:* a library photo that @instagram reposted in its real 2016 grid belongs to @instagram: `REPOSTED_BY_INSTAGRAM` in `libraryData.js` maps each to the archived post, and the library copy is never dealt to anyone. Off-topic library sets sit in a `community` pool that only @instagram draws from; November 2016 blog photos and celebrity shots are in `SKIP` (`libraryQuality.js`).
- *Explore:* archive accounts with fewer than 6 photos (`EXPLORE_MIN_POSTS`) stay out of Explore; their profiles still open from a name.
- *Library captions and likes* are hashed on the photo's file name, not its built URL, so dev and the public build agree.
- *Friends' other photos* take captions from their own list (`FRIEND_CAPTIONS`); edited real captions carry a `caption_note` in `profile.json`.

**Dates:** nothing is filtered by date. Every photo on disk loads, and timestamps are labels by position: the feed's come from the hand-ranked `FEED` list in `feedData.js` (one `[username, timestamp]` pair per slot; ads carry `null`), and profile grids use `gridTime(index)` in `archiveData.js` (3h, 1d, 2d … then weeks), so every surface reads as today regardless of when a capture was made.

The home feed is 24 posts in a hand-ranked order (`FEED` in `feedData.js`): 18 recognisable real accounts, four invented friends (marcus.h, julia.creates, sarah.moments and imani.brooks, whose post is the target), and two ads. Every reload or pull-to-refresh reshuffles it (`buildFeed(seed)`): real accounts and friends trade slots, real accounts start on one of their three newest posts that may lead (not profile-only, not `NO_LEAD`), friends show a random photo from their set (a fresh caption when it isn't their lead), Imani lands somewhere in slots 10–18 with her news post, and the two ads and the slot time labels stay put. Imani's photos are Unsplash (free licence) in `assets/feed/friends/imani.brooks/`; the real Instagram photos and account data are committed too (non-commercial, educational use), so the public site shows the same feed. See `assets/feed/README.md`.

**Objectives (3, independent):**
1. Like Imani's post (imani.brooks's "it's OUT 🎉 my first editorial"; slot 14 in the canonical order, a random slot from 10 to 18 after a reload or refresh). Only a like on that post counts: heart button or double-tap, in the feed, on her profile or in post detail.
2. Learn more about a sponsored post — completes when the in-app browser opens. Tapping a sponsored *photo* reveals the March 2016 ad overlay (photo blurred and dimmed, an outlined ↗ circle, the advertiser's name and domain; reference: `docs/reference/ads/`); tapping elsewhere on it dismisses. LEARN MORE, the Sponsored label or the overlay's arrow open the in-app browser (`InAppBrowser.jsx`): slides up over the whole app in 350ms, keeps the status bar, covers the tab bar, leaves the feed mounted at its scroll position, and closes in reverse. Its chrome (light grey bar, X, bold title over grey domain, ellipsis with a Copy Link / Open in Safari / Cancel action sheet, blue progress bar) is a reconstruction — unverified — with every value in `BROWSER_CHROME`. The destination is a locally built page (`AirbnbLiveThere.jsx`, keyed by the post's `ad.page` in `AD_PAGES`), rebuilt from a 2016 screenshot of Airbnb's mobile homepage during the "Live There" campaign (header with hamburger and centred wordmark, LIVE THERE hero on a still photo with no play button, "Where to?" search, dark footer), set in Circular Air; no live site is ever loaded. The ad photo itself carries the campaign's poster type ("Don't Go There." in white, "Live There." in Rausch red, white Bélo top-right) from the post's `ad.poster`.
3. Follow someone new — completes the first time the player follows anyone they didn't follow at the start (from Explore, a profile, a commenter's profile or an Activity row).

**Discovery Card:**
- Artifact: `Algorithmic Feed`
- Text: "Until 2016, Instagram showed posts newest first, and it said people were missing about 70% of them. The ranked feed puts first what it predicts you'll like, based on what you've responded to before. You can't see how it decides, and every like tells it what to show you next." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record** (experiment, dev server only; see Level 1, "Catalogue record", for how it works). Facts checked 11 Nov 2026, each against two sources. The software, not hardware. `IA.2016.05`, object line `Instagram for iOS, 2016`; data `Launched 6 October 2010` / `400 million users, Sept 2015` / `Ranked feed announced` / `15 March 2016`; labels on the header (`Blue header` / `white from 11 May 2016`) and the first like button on screen (`Like` / `tap, or double-tap the photo`). The screen isn't drawn in the intro, and the feed is hidden at the discovery in the Index, so the labels show only once the feed is there (the toggle while playing); the object line and data still show.
- Launched 6 October 2010 (**high**): Instagram's product timeline (about.instagram.com/about-us/instagram-product-evolution); Wikipedia "Instagram".
- 400 million monthly users, September 2015 (**high**): 9to5Mac and The Next Web, 22 September 2015.
- Ranked feed announced 15 March 2016 (**high**): Instagram's blog ("See posts you care about first"); Associated Press (phys.org). Announced, not shipped: it rolled out over the following months.
- The blue header, replaced by a white one on 11 May 2016 (**high**): Instagram's blog ("A new look for Instagram"); The Next Web; Gizmodo ("that dated-feeling blue theme").
- Tap the heart or double-tap the photo to like (**high**): PCWorld, 12 April 2016; The Next Web, 2011.

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

**Artifact:** AI chat interface (Claude-inspired, the exhibit's guide)
**Discovery:** Natural Language
**Container:** Full-width chat panel — no device, no chrome, no window frame

**Persona:** The AI is the exhibit's guide in its last room, not its curator or author (Matthew Dea made the exhibit and is the curator; Matthew's call, 9 Nov 2026). Plain, warm and specific; knows it is inside Interface Artifacts; says plainly that it is a language model and when it isn't sure. It never claims to have written the cards.

**Response Model:** Groq API (Llama 3.3 70B) via Netlify serverless proxy, with scripted keyword-matching fallback. System prompt constrains responses to 2-3 sentences, interface history topics only. Player never sees an error; fallback fires silently on API failure.

**IntroModal:**
- Era: `2023`
- Title: `The Conversation`
- Description: "It's 2023, and this is a large language model, the kind of AI behind ChatGPT. Every interface so far has asked you to learn something first: commands, menus, links, gestures. This one has no buttons to learn and nothing to memorize. You write to it the way you'd write to a person, and it writes back."

**Visual Palette:**
- Dark background continuous with museum layer (#1a1a1a)
- Claude-inspired layout: user messages as right-aligned dark pills, AI responses as left-aligned plain text (no bubble)
- Dark rounded input bar (#2a2a2a) with placeholder text
- Non-interactive "Curator v1" model label in input bar (visual dressing)
- Action icons below AI responses: copy, thumbs up, thumbs down, regenerate
- Suggestion chips as outlined pill buttons below responses
- System sans-serif throughout (this IS the current era)

**Light version** (Index museum, light mode; backlog, "Level 5: a light version in light mode", 11 Nov 2026). In the Index's light mode the chat is light; in the Index's dark mode and in Classic it is dark, as above. It is the same design with its colours inverted, as a second set of tokens chosen by hand (not a CSS `invert()`); layout, copy, timing and sounds are unchanged.
- **How:** `Level5` passes `theme` (`'light'` only when the museum is Index and the Index theme is light) to `ChatPanel`, which sets `data-chat-theme` on its root. Every chat colour is a `--chat-…` token on `.panel` in `ChatPanel.module.css`, with the light values under `.panel[data-chat-theme="light"]`; the other chat stylesheets only read the tokens. The museum doesn't restyle the chat. It follows the switches live.
- **Page:** #fff, continuous with the Index's light room, as #111 is with the dark one. There is no accent colour in the chat, so there was none to keep.
- **Pairs and ratios** (WCAG AA: 4.5:1 for text, 3:1 for icons and edges). Hover and pressed values in brackets.

  | Element | Dark | Dark ratio | Light | Light ratio |
  |---|---|---|---|---|
  | Your message text on its bubble | #e8e8e8 on #2a2a2a | 11.7 | #171717 on #ececec | 15.2 |
  | Input text on the input bar | #e8e8e8 on #2a2a2a | 11.7 | #171717 on #ececec | 15.2 |
  | Reply text on the page | #e0e0e0 on #111 | 14.3 | #1f1f1f on #fff | 16.5 |
  | Placeholder | #949494 on #2a2a2a | 4.7 | #666 on #ececec | 4.9 |
  | "Curator v1" label | #949494 on #2a2a2a | 4.7 | #666 on #ececec | 4.9 |
  | Send icon | #808080 (#999) on #2a2a2a | 3.6 (5.0) | #666 (#333) on #ececec | 4.9 (10.7) |
  | Input bar edge on the page | #666 on #111 | 3.3 | #8f8f8f on #fff | 3.2 |
  | Thinking dots | #666 on #111 | 3.3 | #8f8f8f on #fff | 3.2 |
  | Action icons | #737373 (#999, #ccc) on #111 | 4.0 (6.6, 11.8) | #767676 (#333, #1a1a1a) on #fff | 4.5 (12.6, 17.4) |
  | Chip text | #aaa (#ddd) on #111 | 8.1 (13.9) | #555 (#222) on #fff | 7.5 (15.9) |
  | Chip edge | #666 (#888) on #111 | 3.3 (5.3) | #8f8f8f (#666) on #fff | 3.2 (5.7) |
  | Feedback toast | #888 on #111 | 5.3 | #707070 on #fff | 5.0 |

- **Dark greys lifted to AA** (Matthew, 11 Nov 2026), each by the least that passes; everything else in the dark chat is as designed. Before: placeholder #555 (1.9), "Curator v1" #444 (1.5), send icon #555 (1.9), input bar edge #333 (1.5), thinking dots #555 (2.5), action icons #555 (2.5), chip edge #444 (1.9). The chip's hover edge went from #666 to #888 so hover still reads against the new resting edge. The placeholder and the label are now the same grey, as they are in light.

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
- Initial: "What is this place?" · "Who are you?" · "What did the other rooms show?"
- After turn 1: "What changed between 1984 and now?" · "How is this like the 1979 terminal?" · "What might come next?"
- After turn 2+: "Which change mattered most?" · "What did touchscreens change?" · "Is this the last interface?"
- Every chip lands on its own scripted reply when the model is unreachable (`src/test/curatorFallbacks.test.js`).

**Boot Sequence:**
1. ~200ms pause after "Begin Excavation"
2. Input bar slides up from below viewport (300ms ease-out, @keyframes)
3. Placeholder "Ask me anything..." fades in, cursor blinks
4. Suggestion chips fade in staggered (50ms each)
5. Museum HUD slides in per standard pattern

**Objectives (3, independent — no sequential gating):**
1. Send a message (any message)
2. Ask a follow-up question (send a second message after your first)
3. Regenerate a reply (click regenerate on any AI response)

**Key Mechanic:** After five rooms of learning each interface's language, the visitor simply writes. The discovery card that follows notes what that costs: it can be wrong while sounding sure, and it can't show its reasons.

**Discovery Card:**
- Artifact: `Natural Language`
- Text: "Here you didn't learn commands, menus or gestures; you just asked, and it worked out what you wanted. It writes by predicting likely next words, so it can be wrong while sounding sure, and it can't show you why it answered as it did." (shortened 12 Nov 2026 for the Index's discovery band; the dropped facts are listed in `docs/copy-pass.md` §2)

**Catalogue record** (experiment, dev server only; see Level 1, "Catalogue record", for how it works). Facts checked 11 Nov 2026, each against two sources. The genre, not a product: the exhibit is Claude-inspired but unnamed, so the record doesn't claim to be any one product. `IA.2023.06`, object line `AI chat assistant, 2023`; data `ChatGPT: 30 November 2022` / `Claude: 14 March 2023`; labels on the message box (`Message box` / `ask in plain language`; the dot on the rounded input bar's right edge, `[class*="_inputBar_"]`, not the `<input>` inside it) and the first reply (`Reply` / `written by the model`, once there is one). With no device, the record treats the chat's column as the object: the 680px column less the bottom bar's 24px side padding, so its edges are the input bar's (at phone width this keeps the number 24px off the viewport edge).
- ChatGPT released 30 November 2022 (**high**): OpenAI's blog (archived); Wikipedia "ChatGPT".
- Claude released 14 March 2023 (**high**): Anthropic, "Introducing Claude"; TechCrunch, 14 March 2023. API and partner apps only at first; claude.ai opened in July 2023.
- A conversational interface you write to in plain language (**high**): OpenAI ("interacts in a conversational way"); Anthropic ("chat interface").
- Not on the record: about 100 million users by January 2023 (**medium**, one UBS estimate reported by Reuters and The Register); "it can be wrong" on the reply label (one direct source).

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
- **Era labels:** Monospace, 13px, #737373 on white (#999 on dark), letter-spacing 0.1em
- **Level titles:** System sans-serif, 22px (IntroModal) / 24px (DiscoveryCard), weight 500
- **Body text:** System sans-serif, 13px, #555, line-height 1.7
- **Objective label:** Sans-serif, 10px, uppercase, letter-spacing 0.08em, #737373
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
| Primary text on white | `#111` |
| Secondary text on white | `#555` |
| Muted text on white | `#737373` (4.7:1, the lightest grey that passes WCAG AA on white) |
| Primary text on dark | `#ccc` |
| Secondary text on dark | `#8a8a8a` (5.5:1 on #111; `#808080` is the floor, 4.8:1) |
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

**Level 0 — 1979:**
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
