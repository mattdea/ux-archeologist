# Backlog

**How this works**
- **Ideas:** proposals only, never built from. Museum-layer spec rules don't limit them; an approved idea updates the spec.
- **Approved:** Matthew moves items here. Unattended runs build only these, and skip anything ambiguous with a note.
- **Done:** built, with sources and what's reconstructed.
- Every historical claim has a source and a confidence level (high / medium / low).

## Ideas

| Group | Item | Needs before approval |
|---|---|---|
| 1. Visitor's journey | "Start here" cue on the timeline | Copy per state |
| | Year carries from timeline into level | Edge cases |
| 2. Curator's voice | Copy pass: revisit later | Only if Matthew wants another round |
| | Hints: feature + copy | Feature decisions, house style |
| 3. Fidelity | Mac UI, round 5 (optional) | Whether to fake caret blink / double-click |
| | Netscape chrome | Version + references |
| 4. Depth | Netscape pages or search | Pages vs search |
| | iPhone apps | Which apps |
| | Instagram screens | Which screens + references |
| 5. Museum restyle | Phases 2 and 3 after round 2 | Matthew's pick from round 2 |

---

### 1. The visitor's journey

Museum layer, from arriving to finishing. All touch the title screen, timeline and `SharedLayout.jsx`, so design them as one route. "More motion" lives here as specific moments rather than an item of its own.

#### "Start here" cue on the timeline
E.g. a pulsing arrow at 1979 saying "Start here".
- **Decide:** copy per state (nothing done · some done: point at the first unfinished? · all done: nothing, or link to the collection) · does it go away after the first click.

#### Year carries from the timeline into the level
The timeline's year label and the HUD's era label share a typeface; as the level fades in, the year slides to the top-left corner.
- **Decide:** reverse move on "Back to timeline" · routes that don't start at the timeline (dots, Next excavation, direct URL): plain fade? · reduced motion: plain fade.
- **Touches:** `Timeline.jsx`, `SharedLayout.jsx`.

#### Motion moments to consider
Year move (above) · timeline entry · modals opening and closing · IntroModal → boot hand-off · discovery card arrival. Today the museum mostly fades (300ms); the tracker slides up and Continue rises with an overshoot.

---

### 2. The curator's voice

Writing work. The voice guide is in `docs/copy-pass.md`; the copy pass went live on 10 Nov 2026.

#### Copy pass: revisit later
- **Matthew may want to revisit the copy** (10 Nov 2026). The copy pass went in on 10 Nov as "good for now"; the intro cards took six rounds and are the most likely to change again.
- **Where it stands:** `docs/copy-pass.md` has the voice guide, every surface's old and new text with sources, and the notes from each round of review (what Matthew liked and didn't). Start there.
- **What he's said about the intro cards so far:** keep the live text's mood ("no icons, no menus, no mouse. Just a blinking cursor"), name the device ("a VT100 terminal"), put the visitor in the year, add one period detail and a line of reflection; no instructions, no user counts. Too literal and too dry were both rejected.

#### Hints: feature and copy
- **Current hints:**
  - L0: "Try typing  ls  to see what files are here, then  cat  one of them" · "Try typing  mail" · "Try typing  man  followed by a command, like  man ls"
  - L1: "Double-click the Notes icon" · "Drag the Projects folder onto the Trash" · "Click File in the menu bar at the top of the screen"
  - L2: "Click any underlined link" · "Use the Back button in the toolbar" · "Look under Computers and Internet for an archive of old machines"
  - L3: "Drag the arrow all the way to the right" · "Tap the Notes icon on the home screen" · "Drag the home screen to the left to see the next page"
  - L4: "Scroll the feed until you find Imani Brooks, then double-tap her photo" · "Find a post marked Sponsored and tap its Learn More button" · "Tap a name to open a profile, then tap Follow"
  - L5: "Tap one of the suggestions, or type a question and press Enter" · "Ask about something the curator just said" · "Tap the circular arrow under a reply"
- **Noticed:** hints always point at the *first* unfinished objective, though every level allows any order · L1's first hint predates the System Disk (spec open item 7) · L3 and L5 say "Tap" on mouse-driven screens · L0 uses double spaces as emphasis · some name the control, some the goal.
- **Decide:** escalating hints (nudge, then exact step)? · a way to ask for one? · which objective it picks · house style.

---

### 3. Fidelity: make what exists more accurate

Same method each time: collect period references, list every difference, fix.

#### Mac UI, round 5
Rounds 1–4 are in Done.
- **Source of truth:** `docs/reference/mac system 1/` (Matthew's infinitemac.org screenshots). They win over the build, the manual and the spec, except: the screenshots show **Finder 4.1 ©1985**, so the level stays Finder 1.1 and copies them only where 1.1 looked the same (keep the 1.1g About box and 1.1 menus). Matthew's decision.
- **Left:**
  - *Scrapbook*: dropped on 9 Nov 2026, then built the same night once Matthew added screenshots of its five pages (`macsystem100026–30.png`).
  - *Control Panel:* insertion point blinking, double-click speed and mouse tracking stay unwired (a web page can't set the caret blink, the system double-click time or pointer speed). A custom caret or our own double-click timing could fake the first two, if wanted.
  - *About the Finder* keeps the Finder 1.1g box by design.
  - *TeachText / Font Mover* (built 9 Nov 2026, see spec "Utilities folder and applications"): TeachText's Open... dialog, Font Mover's font moving, and Disk Copy / SysVersion have no screenshots yet. Send them to build those.
- **Rule:** everything must be something Finder 1.0/1.1 did.

#### Netscape chrome
- **Decide first:** which Navigator version and platform. Throbber = Navigator 1.1+; cursors = Windows 95 (shipped Aug 1995).
- **Then:** dated reference screenshots into `docs/reference/`, a difference list, fixes.

---

### 4. Depth: more to do inside each artifact

Each needs a short list picked before approval, and one shared question: does a new app or page bring its own objective, or is it just there to explore?

#### Netscape: more pages, or a search
- **Watch:** the level's point is "The early web wasn't searched. It was browsed." A thin, period-accurate directory search could make that point; a modern search box would undercut it.
- **History (verify before building):**
  - Navigator had Net Search and Net Directory buttons; in Feb 1995 Net Directory listed Yahoo. **Medium** · [W3C www-vlib, Feb 1995](https://lists.w3.org/Archives/Public/www-vlib/1995Feb/0003.html) · [savetz.com](https://www.savetz.com/articles/warssearch.html) (later era).
  - Infoseek became Netscape's default engine in Dec 1995. **Medium** · [USC lecture](https://bytes.usc.edu/cs572/f24-srch/lectures/SEBasics/SearchEngineBasics.pdf). What the 1995 Net Search page looked like: **low**, no screenshot found.
  - Yahoo's 1995 homepage had a search box over its own directory. **Medium**, unsourced.
- **Decide:** pages, search, or both · which links go somewhere · do results stay in the four-site world.

#### iPhone: more apps
Today only Notes opens.
- **Guardrail:** only the June 2007 launch apps (Text, Calendar, Photos, Camera, YouTube, Stocks, Maps, Weather, Clock, Calculator, Notes, Settings; Phone, Mail, Safari, iPod in the dock). No App Store until July 2008. **High**, widely documented (cite Apple's 9 Jan 2007 press release on approval).
- **Decide:** which first. Calculator, Clock, Weather, Photos are self-contained; Maps, Safari, YouTube need fake content.

#### Instagram: more screens
- **Guardrail:** spring 2016, before the May redesign. Stories (Aug 2016) is out. **High** (cite Instagram's announcement on approval). Direct (revamped Sept 2015, per Instagram's blog post of 1 Sep 2015) is in.
- **Candidates:** comments view · Direct inbox · camera tab · hashtag page from TRENDING TAGS · Edit Profile.
- **Needs:** dated reference screenshots for each, as the existing screens had.

---

### 5. Museum restyle: phases 2 and 3

Phase 1, the style lab, is built in two rounds (see Done, 10 Nov 2026). Open `/style-lab` on the dev server, or the screenshots in `docs/style-lab/`.

- **Why:** Matthew wants the museum to look more like the personal sites he's been collecting: crude, unfinished, typographic, plain, sometimes silly. Nothing in the game changes until a direction is picked.
- **Scope:** the museum layer only: the title, timeline, collection, About, HUD (back link, era label, Continue), IntroModal, ObjectiveTracker, HintPill, DiscoveryCard and the small-screen notice. The artifacts keep their exact period look. The museum still has to read as the frame, not as another artifact. Watch this next to the 1995 Netscape level especially.
- **Phase 2:** Matthew picks one direction or a mix.
  - **Matthew's read (10 Nov 2026):**
    - **B (index):** his favourite. He likes the monospace list, the grid it sits on, the highlighted (inverted) row, and how simple it is.
    - **E (specimen sheet):** he likes the direction, but each row shows the same room three times: the illustrated picture, the drawn picture and the card, which has the picture on it again. One picture per room.
    - **D (colour field):** he likes it, but it feels derivative. Dropped.
    - **A, C, F:** not picked.
  - **Round 2 built 10 Nov 2026:** B2 (B refined) and G (punch card), see Done. B+E was not picked. Open `/style-lab#b2/title` and `/style-lab#g/title`, or `docs/style-lab/b2-index-refined/` and `g-punch-card/`.
  - **Matthew's read of round 2 (10 Nov 2026):**
    - **G (punch card):** he doesn't like the direction. Dropped. He does like its dot illustrations.
    - **B2:** takes the dot illustrations. His examples: pointing at a level shows its small illustration on the right; little squares with the illustration in them open the levels; the collection cards change to match. Built the same day, see Done. B2 is the direction in hand.
    - G is still in the lab, and the six illustration files are in its folder (`src/pages/styleLab/g/`). Deleting G would mean moving them first.
    - **B2 iteration (10 Nov 2026):** the row of six squares was removed (see Done). Then Matthew chose the B / B2 direction for the real museum: see Approved, "the index museum". B2 stays in the lab as reference and changes no further.
- **Phase 3 (needs its own approval):**
  - Set up museum tokens on `:root` and restyle one component per commit.
  - Align the collection cards and card lab with the new style.
  - Rewrite the spec's museum section.
  - Delete the lab or keep it.
- **Rules that held for every concept, and should hold for the restyle:** system fonts only (Times, Helvetica/Arial, ui-monospace); no shadows, rounded corners or gradients unless the direction calls for them; WCAG AA contrast, visible focus, everything by keyboard, no motion under reduced motion; copy stays as it is.

- **Linking the devices to the drawing style (Matthew, 11 Nov 2026).** Ideas not in the "device as a drawing" experiment, kept for later (design ideas, no historical claims):
  - Brushing the drawing away by hand, with the pointer as a brush. Tactile, but a chore by the third level; it would need a skip.
  - A drawn world around a real device: a stippled ground or dig pit under the device, with a stipple shadow. The device itself is untouched, so the layers stay apart.
  - Boots drawn dot by dot, like a print, before colour floods in. This fights each level's own boot sequence.
  - Dust on the bezel that clears a third at a time as objectives complete. It's clever, but it distracts from the device.
  - A drawn case around a live screen: the hardware as a stipple drawing in the fossil style (one hand-made drawing per device, traced from a screenshot), with the live emulator in colour in the screen opening. Only the screen opening has to line up exactly.
  - The whole museum as a dig: each room at a different depth in a drawn cross-section of earth (1979 deepest), and moving between rooms scrolls through the strata.
  - No hardware at all: the bare interface, large, with the list as its only frame.

---


## Approved

### Museum: the index museum, built for real behind a switch · approved 10 Nov 2026
Matthew is going with the B / B2 direction: one monospace list that is the whole museum. B2 was a concept in the lab, not a finished design. This pass turns it into a complete museum that runs the real game, and keeps the current museum ("Classic") one switch away, because Matthew is still concepting. Run it as a live chat with Matthew. Build a first full version, show him, then take his changes one at a time, committing and pushing each.

- **Keeping Classic:**
  - **Restore point:** before any code changes, tag the current commit `museum-classic` and push the tag.
  - **Both museums live in the code.** A switch decides which one renders: Classic or Index. It's dev-only and remembered per browser, like the looks in `src/shared/devLooks.js`, and it shows next to the other dev switches. Production stays Classic until Matthew says otherwise.
  - **Classic isn't touched.** The Index museum is new components beside the existing ones in `src/shared/museum-ui/`, `SharedLayout`, `Timeline`, `Collection` and the title. Classic's files, styles and copy don't change.
  - **The switch swaps presentation only.** Each level's screen state machine, objectives, hints, `useArtifactFit`, progress and sounds are shared, so flipping it mid-game keeps your place. One place in the code decides which museum renders; levels don't each check it.
  - **Fit around the HUD:** the list is the HUD, so mark it `data-hud` so `useArtifactFit` places the artifact beside it (wide) or below it (narrow). Check every level's artifact, not just the Mac and iPhone.
- **Start from:** B2 in the lab as it stands (`src/pages/styleLab/B2_Index.jsx`, screenshots in `docs/style-lab/b2-index-refined/`), plus Matthew's notes under Ideas, "Museum restyle". He likes:
  - the monospace list and the grid it sits on
  - the inverted highlighted row
  - the dot illustrations, shown beside the list when you point at a room
  - how simple it is
  The row of squares is gone, and stays gone.
- **What "fully designed" means here.** The concept skipped these, and the first version should settle each one:
  - **Grid and type:** one monospace stack, sized in `ch` and line-height rows, so every column, leader and indent lands on the grid. At most two sizes. Write the grid down as tokens.
  - **Every state of a line:** rest, hover, keyboard focus, current room, done `[x]`, not done `[ ]`, links that leave the site. The inverted row stays the main highlight.
  - **Keyboard like a terminal menu:** arrow keys move the highlight, Enter opens, Escape closes what's open. Tab order still works for screen readers.
  - **Every museum surface:** title, timeline, collection, About, the reset confirmation, the small-screen notice, and each of the six levels through every screen state:
    - intro: the room's line opens with its intro text and Begin
    - booting: what the list does while the artifact boots
    - playing: objectives, the hint line after 10 s, Continue
    - discovery: the artifact's text and the dot picture, then on to the next room
  - **Moving between views:** what replaces the current fade, for example the list redrawing in place. Nothing moves under reduced motion.
  - **Phone width:** the list above the artifact. It still has to fit the small-screen notice's rules.
  - **The museum still reads as the frame,** next to every artifact. Watch Level 0, a monospace terminal, where the list and the artifact could blur. Show Matthew how it looks there.
  - **Copy stays as it is,** and the voice rules hold.
- **Readability (Matthew, 10 Nov 2026):** he loves the look, but the concept is hard to read and navigate. Part of that is the lab showing every piece of the HUD at once, which the game never does: one room's intro, objectives, hint, Continue, discovery and the small-screen notice all open together. The rest won't fix itself, so the first version should solve it:
  - **Hierarchy with one size.** Every line is the same size and weight, so room names, body text, objectives and links look alike. Use a second ink (a grey that passes AA) for secondary text: the leaders, the artifact names on the right, `[ ]` and the hint. That leaves black for what matters now. Keep the inverted row for one meaning.
  - **What's clickable.** "Enter the exhibit", "Collection" and "Reset progress" look like plain text, and so do the room pairs with leaders. Give every link one consistent mark, for example a trailing `→` or `↗`, an underline, or the `>` in the marker column on hover. Use leaders for one meaning only.
  - **Hover and current are different things.** The inverted row is both "the room you're in" and "under the pointer". Pick one: inverted means current or keyboard focus, and pointer hover gets something lighter.
  - **One thing open at a time,** matching the screen states:
    - intro: the room's intro and Begin
    - playing: objectives, the hint when it comes, then Continue, with the intro folded away behind its line
    - discovery: the artifact's text and the next room
  - **Quieter while playing.** The other five rooms don't need full lines during play. Grey them or fold them to one line, so the eye goes from the current room to the artifact.
  - **The artifact first.** In the concept the list takes about 40% of the width and the artifact sits low and small. In play the list should be narrow (a measure that fits the objectives, about 40ch) and the artifact as large as `useArtifactFit` allows, centred in the space left.
  - **Paragraphs need a blank line between them** (About, intros), and long body text keeps a readable measure of about 60ch.
  - **Rooms not found yet** end abruptly (2016 and 2023 have no right-hand side). Give them a quiet right side in grey, for example `[ ]` or `not found`, so the rows don't look broken.
- **Not in this pass:** a dark version, sharing, new copy, changes to the artifacts.
- **Spec:** add an "Index museum" section to `docs/design-spec.md` covering its grid, states, keyboard and how the switch works. Leave the Classic sections as they are.
- **Checks:**
  - Tests cover the switch: both museums render every view, and switching keeps progress.
  - Run `npm run build`.
  - Check in the browser: all six levels in both museums at 1440 and 375 wide, keyboard only through one full level, and no console errors.
  - Take screenshots of the Index museum into `docs/museum-index/`.
- **When the chat ends:** move this to Done with what changed and what Matthew decided along the way. Note anything still open under Ideas, "Museum restyle".
- **Supersedes** the B2 iteration entry above. The lab stays as reference, and nothing further changes in B2.
- **Status (10 Nov 2026):** first full version built and shown to Matthew; taking his changes next. `museum-classic` tagged at f2d13c0. What it does is in the spec, "Index museum"; screenshots in `docs/museum-index/`. Raised with Matthew: the Level 4 ghost iPhone's outline and glow vanish on white; Level 5's chat is a dark block on the white page. Matthew's first change: a Dark mode line, remembered per browser, in which both look as designed; then dark made the default. Not yet checked: keyboard only through a whole level (arrow keys, Tab and Escape were checked in Level 0 and on the title, timeline and collection), Safari, Firefox, a screen reader.

### Museum: dot pictures drawn on one grid · approved 10 Nov 2026
The six dot illustrations (`assets/dots/dots-N.webp`, 400 × 340 masks traced from ChatGPT images) don't look printed. Matthew: the background grid sits in a different place in each picture, and the dots look random. What's wrong with them:
- The background grid's spacing and starting point change from picture to picture: about 40px from 20px in (dots-0), from 15px in (dots-1), about 46px (dots-4). Side by side they don't line up.
- The ink dots sit on a finer spacing of their own, not on the background grid.
- Dot sizes vary, dots overlap (the lower bubble in dots-5), and lines run at any angle (the tilted photos in dots-4). A dot-matrix print can do none of that.

Rebuild them as data on one grid, the way the 5 × 7 capitals in `src/pages/styleLab/g/glyphs.js` work:
- **One grid for every picture:** the same fine grid, about 36 × 30 points. A small background dot sits on every third point (12 × 10, about today's density). Ink dots sit only on grid points. Every picture starts from the same corner, so the background grids line up across the list, the hover preview, the discovery and the cards. If 36 × 30 doesn't suit the box, change the box's proportions to match the grid, not the other way round.
- **Two dot sizes:** ink at about 80% of the spacing, so neighbours nearly touch like a stamp, and background at about 25%. A background dot under an ink dot isn't drawn.
- **Grid rules:**
  - Lines are horizontal or vertical.
  - Diagonals are stair-steps, like the slash in the capitals.
  - Nothing is rotated: the tilted photos become frames offset by whole cells.
  - Keep each picture's subject as it is now: what Matthew chose stays, only the drawing changes.
- **Pictures as text:** each picture is rows of `#` and `.` in one file (for example `src/shared/index-museum/pictures.js`). They're drawn as SVG circles in `currentColor`, so they stay sharp at any size and still invert on the black row and in dark mode. No image files.
- **Making and fixing them:**
  - A script samples the six current masks at the grid points to make a first draft of each picture's rows.
  - A dev-only editor page, absent from the production build like `/card-lab`, shows the grid: click a cell to toggle it, pick a picture, and copy out its rows. Use it to tidy the drafts, and Matthew can draw new ones with it.
  - Show Matthew the six side by side before replacing anything.
- **Where it changes:** `DotPicture` in the index museum draws from the new rows; the props it takes stay the same. The style lab keeps its old masks as a record, and Classic isn't touched. Remove `assets/dots/` only once nothing imports it.
- **Not in this pass:** ink spread (a fixed, slight size change per dot so it looks stamped). Leave it off: the point is regularity. Note it under Ideas if it's worth trying later.
- **Spec:** add the grid, the dot sizes and the editor to the "Index museum" section.
- **Checks:**
  - A test that every picture has the right number of rows and columns.
  - Run `npm run build` and confirm the editor isn't in it.
  - Check in the browser in light and dark, on the list, the preview and the discovery, at 1440 and 375.
  - Retake the screenshots in `docs/museum-index/` that show pictures.
- **Status (10 Nov 2026):** drafts drawn and shown to Matthew, nothing replaced yet. The rows are in `src/shared/index-museum/pictures.js`, drawn by `DotGrid.jsx`; the editor is at `/dot-editor` (dev only); the draft script is `scripts/dot-pictures-draft.mjs`. Its straight samples aliased against the old masks' finer spacing, so each picture was redrawn by hand on the grid with the same subject. Comparison: `docs/museum-index/dot-pictures-drafts.png` (new above, old below).

### Museum: stamp pictures, an option beside the dot pictures · approved 10 Nov 2026
Matthew wants to try a second set of pictures in the index museum: six coloured stamp-print illustrations (ChatGPT, 10 Nov 2026), saved as `docs/reference/style-lab/stamp-illustrations.webp` (1536 × 1024, three across, two down, cream paper). They have the same subjects in the same order as the dot pictures, one ink colour each:

| Level | Picture | Ink |
|---|---|---|
| 0 | `$` and a block cursor | blue |
| 1 | a document with a pointer | yellow |
| 2 | "Hyperlink" underlined, with the hand pointer | light blue |
| 3 | a finger tapping a circle | green |
| 4 | a stack of photos | red |
| 5 | two speech bubbles | brown |

This is an option to compare, not a replacement. The dot pictures entry above goes on as approved.

- **The switch:** a "Stamp pictures" line in the list, built like the Dark mode line (`[ ]` / `[x]`, remembered per browser), shown on the dev server only. Off means the dot pictures. Every place that shows a room's picture follows it: the hover preview beside the list (`peekPicture`), the discovery (`discoveryPicture`) and the collection's cards.
- **Cutting them out:**
  - Crop each picture from the reference into its own file, `assets/stamps/stamp-N.webp`, at twice the largest size it's shown.
  - Keep the paper and its grain. Don't cut the ink out onto a transparent background: the grain at the edges is the point, and it would break up.
  - Crop all six at one scale, the same box around each picture's centre, so the ink and grain are the same size in every one. The `$` will look smaller than the photos, as it does in the reference. If the box's proportions don't match the current 400 / 340, change the picture box for this option.
- **On the page:**
  - Each picture sits on its own piece of paper, in its own colours, in light and dark. The paper tile is the picture's edge; no frame or border is added.
  - The pictures don't invert. On an inverted (current or focus) line, the tile stays as it is.
  - Rooms not found yet: the collection keeps its empty placeholder as it is now. Don't show a stamp before the room is found.
- **Not in this pass:** recolouring the stamps to match the museum's ink, new pictures, or changes to the dot pictures.
- **Show Matthew:** both options side by side, in light and dark, on the timeline (hover preview), a discovery and the collection.
- **Checks:**
  - Tests: the switch is absent from the production build, and each option renders all six pictures.
  - Run `npm run build`.
  - Check in the browser at 1440 and 375.
  - Add screenshots of the stamp option to `docs/museum-index/`.
- **Spec:** one paragraph in the "Index museum" section saying the option exists and how to switch it.
- **Status (10 Nov 2026):** built and shown to Matthew. His call: keep both for now, the switch stays and dots stay the default. Then: an arrowhead stamp (his image) rests beside the list while no room is pointed at, stamps only. Then: the Command Line's blue `$` stamp replaced by his black `>_` key (`docs/reference/style-lab/stamp-command-line.webp`); its card lab mask regenerated, screenshots retaken. Stamps in `assets/stamps/` (480 × 408, the reference's own resolution: twice the largest showing, about 600px, would only upscale it); the reference's paper is near-white (254), not cream. Side by side, dots left and stamps right, in light and dark: `docs/museum-index/pictures/compare-<light|dark>-<timeline-hover|level-4-discovery|collection>.webp`; stamp shots at 1440 and 375 in `docs/museum-index/*-pictures-stamps-*`. The dot side still shows the old masks, because the grid redraw (entry above) isn't wired in yet. Checked: 165 tests (each option draws all six; no line or switching outside the dev server), `npm run build` (no line, no stamp files).



### Museum: fossil pictures, a third picture option · approved 10 Nov 2026
Matthew wants a third set of pictures for the index museum, beside the dots and the stamps. Each room's interface idea becomes an archaeological find, drawn as a stipple ink illustration. The set is `docs/reference/style-lab/fossil-pictures.webp` (ChatGPT, 10 Nov 2026; 1446 × 1088, three across and two down):

| Level | Room | Find |
|---|---|---|
| 0 | Command line | a broken stone chevron `>` with a stick lying beside it as the cursor `_` |
| 1 | Desktop | the mouse pointer as a knapped flint arrowhead |
| 2 | Hyperlink | the pointing hand of a statue, broken off at the wrist |
| 3 | Touchscreen | a phone-shaped slab of stone with a dip worn in it by a thumb |
| 4 | Feed | an ammonite, the scroll that never ends |
| 5 | Conversation | a lump of amber shaped like a speech bubble, its tail a resin drip |

Why this set, from the chat with Matthew:
- **The object's shape carries the idea.** Nothing is drawn on or inside it.
- **Black ink on white,** so they belong to the museum's list, not to the devices. The device is the exhibit, in colour; the fossil is the curator's drawing of what's left. They aren't meant to match the devices.
- **The theme fits the copy,** which already says "Begin excavation".

Matthew may still send a coarser redraw (bigger dots, less surface texture, a more amber-like amber). Build so the six files can be swapped without code changes.

- **The switch:**
  - Replace the "Stamp pictures" line with one "Pictures" line, still dev-only and remembered per browser. Its right side names the current set: `dots`, `stamps` or `fossils`. Clicking (or Enter) moves to the next one.
  - Extend `pictureStyle.js` to the three values. The default stays `dots`, and production always shows the dots.
  - Every place that shows a room's picture follows it, as with the stamps: the preview beside the list, the discovery and the collection.
- **Cutting them out:**
  - Crop each find from the reference into `assets/fossils/fossil-N.webp`, served on the dev server only, like the stamps.
  - Use one scale for all six, each centred in the same 400 / 340 box, so the dots are the same size in every picture. The finds differ in size as they do in the reference.
  - Keep the reference's resolution; don't upscale it.
- **Ink, not paper:**
  - Make each fossil a mask from its ink density, filled with the text colour (`currentColor`), like the dots.
  - The white paper drops away and the faint stipple stays faint.
  - So they're black on the light page, light on the dark page (dark is the default), and they invert on the black row.
  - In dark mode the shading reads reversed, like chalk or a scratchboard. Show Matthew dark mode and light mode side by side. If dark reads as a photo negative, the fallback is the stamps' approach: each picture on its own white tile.
- **Beside the list while no room is pointed at:** the arrowhead (level 1) rests there, as the arrowhead stamp does for the stamps.
- **Rooms not found yet:** the collection keeps its empty placeholder; no fossil before the room is found.
- **Not in this pass:** redrawing the pictures, recolouring them, or using them in the card lab.
- **Show Matthew** all three options side by side, in light and dark, on the timeline preview, a discovery and the collection.
- **Checks:**
  - Tests: the line cycles through all three and is absent from the production build; each option renders all six; the production build carries no fossil files.
  - Run `npm run build`.
  - Check in the browser at 1440 and 375.
  - Take screenshots of the fossil option into `docs/museum-index/`.
- **Spec:** extend the "Index museum" paragraph on picture options to the three sets.
- **Status (10 Nov 2026):** built and shown to Matthew; waiting on his read of dark mode. Fossils in `assets/fossils/` (600 × 510 masks, the sheet's own resolution: the box is set by the tallest find, the hand at 478px, so the others sit smaller, as in the sheet). Each find is cut from its own cell, so no neighbour leaks into the wider box. Dark reads as scratchboard; the hand and the arrowhead come closest to a photo negative. Three-way comparisons (dots, stamps, fossils) in light and dark: `docs/museum-index/pictures/compare-<light|dark>-<surface>.webp`; fossils light beside dark: `pictures/fossils-light-dark-<collection|discovery>.webp`; fossil shots at 1440 and 375 in `docs/museum-index/*-pictures-fossils-*`. Checked: 168 tests (the line cycles and is absent outside dev; each set draws all six; the arrowhead rests with stamps and fossils), `npm run build` (no line, no fossil or stamp files).


### Museum: the carved tablet, the museum's main picture · approved 10 Nov 2026
Matthew's picture for the whole museum: a broken stone tablet in three bands, with the six rooms' signs carved into it in the fossil set's stipple, oldest first. The bands hold `>_` and the pointer, the hand and the phone-shaped slab, then the ammonite and the speech bubble. The signs are cut in, not drawn on, with no outlines. Saved as `docs/reference/style-lab/fossil-tablet.webp` (ChatGPT, 10 Nov 2026; 538 × 654, white ground).

It is the picture that stands for the whole experience, shown when no room is in view. It belongs to the fossil pictures (entry above), so it shows when the Pictures setting is `fossils`, and becomes the default for everyone if the fossils become the default.

- **Where it shows:** beside the list while no room is pointed at, on the title and the timeline. It replaces the arrowhead that rests there in the fossil option. The dots and stamps options keep what they have now.
- **The file:**
  - A mask from its ink density, filled with the text colour, like the fossils: the white ground drops away and faint stipple stays faint.
  - Save it as `assets/fossils/fossil-tablet.webp`, served on the dev server only, like the other fossil files.
  - Keep its own proportions (it is taller than wide). Fit it in the space the room pictures use, as large as fits and centred, without stretching. Don't crop the broken edges.
  - At 538px wide it may be soft where it's shown largest. Don't upscale it; tell Matthew if it looks soft, and he'll get a larger version from ChatGPT. Build it so a larger file can be swapped in without code changes.
- **Dark mode:** the tablet's dark side becomes a large light mass. Show Matthew light and dark side by side, as with the fossils.
- **Moving between it and a room's picture:** when you point at a room, its fossil replaces the tablet, and when you leave the list, the tablet comes back, as the arrowhead does now. No new animation; nothing moves under reduced motion.
- **Not in this pass:** using it as the share image (`og:image`) or a favicon, putting it in the card lab or the collection, and redrawing it.
- **Checks:**
  - Tests: the fossil option shows the tablet with no room pointed at; the other options don't; the production build carries no tablet file.
  - Run `npm run build`.
  - Check in the browser on the title and the timeline, light and dark, at 1440 and 375.
  - Retake the fossil screenshots in `docs/museum-index/` that show the resting picture.
- **Spec:** add it to the Index museum's paragraph on picture options.
- **Status (10 Nov 2026):** built and shown to Matthew. The mask is `assets/fossils/fossil-tablet.webp` (528 × 650: the drawing nearly fills its ground, so trimming took only 10 × 4px), made by `scripts/fossil-tablet.mjs`, which takes a larger drawing as its argument. It shows about 240px tall in the 400 / 340 box, about 480 device pixels on a 2× screen, below the file's 650, so it isn't upscaled and doesn't look soft. Being taller than the box is wide, it is height-bound and fills about two thirds of the width. Light beside dark: `docs/museum-index/pictures/fossils-light-dark-<title|timeline>.webp`; shots at 1440 and 375 in `docs/museum-index/*-pictures-fossils-*-<title|timeline>.webp`. At 375 nothing rests there, as for the stamps' arrowhead, because the space beside the list is hidden under 900px. The shot script now also lists title and timeline shots for dots and stamps; those are taken on the next full run. Checked: 175 tests (the tablet rests with fossils and swaps with a room's find; the arrowhead stays with stamps; nothing with dots or outside the dev server), `npm run build` (no tablet file or path).
- **Change (Matthew, 10 Nov 2026): a new tablet replaces this one.** He prefers a clay tablet written like cuneiform, `docs/reference/style-lab/fossil-tablet-script.webp` (ChatGPT; 490 × 624, white ground). It is pillow-shaped with rounded edges and a damaged lower edge. Its whole face is covered in about 11 rows of small signs pressed into the clay, and the script uses only the six rooms' signs, repeated: `>_`, pointer, hand, rounded rectangle, spiral, speech bubble. From a distance it reads as an ancient tablet; up close the words are interfaces. Keep the old tablet in `docs/reference/` as a record.
  - Run `scripts/fossil-tablet.mjs` on the new drawing to remake `assets/fossils/fossil-tablet.webp`. Nothing else changes: the same place, mask, fit and behaviour.
  - The signs are small. At the size it's shown, they read as writing rather than as six separate signs, and that's intended. Check that the rows still read as rows and don't turn to grey, in light and dark.
  - It's 490px wide, so check that it isn't upscaled where it shows largest, and tell Matthew if it looks soft.
  - Retake the screenshots that show the resting picture, and show Matthew the new tablet beside the old one, in light and dark.
- **Status of the change (10 Nov 2026):** built and shown to Matthew. `scripts/fossil-tablet.mjs` now takes the clay tablet by default and remade `assets/fossils/fossil-tablet.webp` (434 × 577); nothing else changed. The old tablet stays in `docs/reference/style-lab/fossil-tablet.webp`. It shows about 240px tall, about 480 device pixels on a 2× screen, below the file's 577, so it isn't upscaled and doesn't look soft. The rows read as rows in light and in dark, even at 1×; in dark the face is mid-grey with light signs. Old beside new, light above dark: `docs/museum-index/pictures/tablet-old-new-light-dark.webp`; light beside dark: `pictures/fossils-light-dark-<title|timeline>.webp`; the title and timeline fossil shots at 1440 and 375 retaken. Checked: 175 tests, `npm run build` (no tablet file or path).
- **Second change (Matthew, 11 Nov 2026): a redraw of the clay tablet replaces it.** The new drawing is `docs/reference/style-lab/fossil-tablet-script-2.webp` (ChatGPT; 1100 × 1430, white ground with wide margins). It's the same idea, a clay tablet written in the six signs, in about 10 rows. It differs from the last one: coarser stipple, deeper impressed signs, a darker side, and a larger file.
  - Make it the default drawing for `scripts/fossil-tablet.mjs` and remake `assets/fossils/fossil-tablet.webp`. Trim the wide white margins, as the script does. Nothing else changes.
  - It's large enough not to be soft. Keep the mask no larger than about twice the size it's shown, so the file stays small.
  - Keep the previous drawing in `docs/reference/` as a record.
  - Check the rows in light and dark, retake the screenshots that show the resting picture, and show Matthew the new tablet beside the last one.
- **Status of the second change (11 Nov 2026):** built and shown to Matthew. `scripts/fossil-tablet.mjs` defaults to `fossil-tablet-script-2.webp`, trims the margins to the ink (763 × 1067 of 1100 × 1430) and now scales a drawing down to at most 480px tall (`MAX_H`). The picture box draws the tablet 226px tall (34ch at 13px, the 400 / 340 shape), so that is about twice the size shown. The mask is 343 × 480, 109 KB (the last one was 179 KB at 434 × 577). The previous drawings stay in `docs/reference/style-lab/`. The rows read as rows in light and dark, the signs bolder than before. In dark the darker side shows as a bright rim on the right. Last beside new, light above dark: `docs/museum-index/pictures/tablet-last-new-light-dark.webp`; light beside dark and the title and timeline fossil shots at 1440 and 375 retaken. Checked: 175 tests, `npm run build` (no tablet file or path).

### Card lab: stamp cards in a grid · approved 10 Nov 2026
Matthew wants a card design in the card lab (`/card-lab`) based on a ChatGPT mockup, saved as `docs/reference/style-lab/stamp-cards.webp`. Each card is a sheet of the room's colour, with its picture printed in black at the top and the text set below. Use the stamp pictures already in `assets/stamps/` (from the entry above), not the mockup's drawings, and lay the cards out in a straight grid with no rotation.

- **A new design in `LabCards.jsx`, `'stamp'`,** added to `variants.js` as "Stamp cards", with a note.
- **Card colour:** the stamp's own ink colour, one per room. Sample them from the reference cards:

  | Level | Colour |
  |---|---|
  | 0 | blue (about `#2f6fc4`) |
  | 1 | yellow (about `#f7c22b`) |
  | 2 | light blue (about `#86b8f5`) |
  | 3 | green (about `#5fa36c`) |
  | 4 | coral (about `#f2706a`) |
  | 5 | brown (about `#b07c62`) |

  Flat colour, with no gradient, shadow or border.
- **The picture:** each stamp printed in near-black ink on the card, as in the mockup.
  - The near-white paper drops away and the grain stays: make the stamp a mask from its ink density, so faint grain prints faint, and fill it with the ink colour.
  - A script generates the masks from `assets/stamps/stamp-N.webp`; don't redraw them by hand.
  - Every picture is the same width on every card, centred in the top part of the card.
- **The text,** from `src/data/artifacts.js`, as in the mockup, all in near-black:
  - `name` in a bold sans
  - `title, year` in italic
  - `description` in a regular sans at a readable size
  - `NO. 01 OF 6` at the foot in a monospace, numbered from 01
  - Left-aligned, with even margins on all sides.
  - Text must pass AA on every colour, checked per card. The yellow and light blue should be fine; check the blue and the brown.
- **The back** (the lab turns cards over): the colour alone, with `NO. 01 OF 6` in the same place.
- **The grid:** a new `arrange: 'grid'`. Three across and two down, every card the same size, upright, with even gaps, on the lab's dark ground. Two across when there isn't room for three, and one across at phone width. No tilt, drift or overlap.
- **Not in this pass:** the collection page or the index museum (this is the card lab only), and new pictures or copy.
- **Checks:**
  - Run `npm run build`; the lab isn't in it.
  - Check in the browser at 1440 and 375, front and back.
  - Take a screenshot of the row into `docs/reference/style-lab/` or the lab's usual place, and show Matthew next to the mockup.
- **Status (10 Nov 2026):** built and shown to Matthew next to the mockup (`docs/reference/style-lab/stamp-cards-row-vs-mockup.webp`; the row alone, fronts and backs at 1440 and 375, in `card-lab-stamp-cards-*`, taken by `scripts/card-lab-shots.mjs`). Masks by `scripts/stamp-masks.mjs` into `assets/stamps/mask-N.webp`, each stamp's solid ink fully opaque and its grain in proportion. Text is `#161616`. Contrast per card: blue failed at 3.6:1 (`#2f6fc4`), so it is lifted to `#4a85d6` (4.8:1); brown 5.1:1, green 6.0:1, coral 6.3:1, light blue 8.8:1, yellow 11:1. The pictures are all the same width (84% of the card) at the stamps' one scale, so the `$` reads small, as in the stamp reference. Checked: 166 tests (a contrast test per card colour), `npm run build` (the lab and the masks aren't in it), the browser at 1440 and 375, fronts and backs.
- **Matthew's change (10 Nov 2026):** the full description was too long, so each card now has a two-line summary of the room's main interaction (`STAMP_SUMMARY` in `LabCards.jsx`, lab only; two lines at S, M and L). The collection keeps the full text.

### Dev: one dev panel behind a corner tab · approved 10 Nov 2026
The dev controls take up too much room and are spread across three places. In the Index they fill a third of the list and look like real lines. Today they are:
- **Classic timeline** (`src/pages/Timeline.jsx`): Complete all, Serif titles, Timeline line/cards, Museum: Classic, Card lab, Style lab.
- **Classic collection** (`src/pages/Collection.jsx`): Card style and Art.
- **Index list** (`IndexMuseum.jsx`): Museum: Index, Complete all, Style lab, Pictures.

Move them all into one panel, the same in both museums, on the dev server only.

- **The tab:**
  - A small `dev` in monospace, fixed in the bottom-right corner, faint until pointed at or focused.
  - Not a round floating button: that is an app pattern and would look wrong next to the Index list.
  - Always there, not hidden until you hover near it, so it isn't forgotten.
- **The panel:** opens above the tab, in plain monospace, styled as dev chrome rather than as either museum. Its groups:
  - **Museum:** Classic or Index
  - **Pictures:** dots, stamps or fossils (Index only)
  - **Classic looks:** serif titles, timeline as line or cards, card style, card art
  - **Progress:** Complete all
  - **Labs:** Card lab, Style lab, Dot editor
  - Each control works the same as today and keeps its current storage key, so nobody's choices are lost.
- **Opening and closing:**
  - Click the tab, or press Ctrl+Shift+D. Check that the shortcut doesn't clash with the Level 0 terminal (it uses Ctrl+C and Ctrl+L), Level 5's chat box or the browser.
  - Escape or a click outside closes it, and focus goes back to the tab.
  - Remembered open or closed per browser.
- **It floats over the page.** It isn't `data-hud`, so it never moves the artifact. It sits above everything, including modals, and doesn't block clicks while closed except on the tab itself.
- **What stays where it is:** Dark mode and Reset progress, which visitors use. Remove only the dev lines from the Index list and the dev buttons from the Classic timeline and collection; nothing else in Classic changes.
- **Screenshots:** the screenshot scripts (`scripts/*-shots.mjs`) hide the tab and panel so they never appear. Retake any that showed the old dev lines.
- **Production:** the tab, the panel and their code are absent from the build.
- **Checks:**
  - Tests: every control in the panel does what its old line or button did; the panel is absent from the production build; Escape closes it.
  - Run `npm run build`.
  - Check in the browser in both museums, on the title, timeline, collection and inside a level, at 1440 and 375.
  - Check keyboard only: Tab reaches it, Enter opens it, Escape closes it.
- **Spec:** a short "Dev panel" note in `docs/design-spec.md`, and update the Index museum section where it mentions the dev lines.
- **Status (10 Nov 2026):** built. `src/shared/dev/DevPanel.jsx`, lazy-loaded by SharedLayout on the dev server only, portalled into `<body>`; what it does is in the spec, "Dev panel". The card switches were also on the card timeline (`CardPath.jsx`), so they went from there too; the card lab keeps its own controls (Show, Size), which are the lab's, not dev lines. Changes pages read while drawing go out as one window event (`src/shared/dev/devEvents.js`). Clashes: Level 0's terminal and Level 5's chat never see Ctrl+Shift+D (read in the capture phase and consumed); on Windows and Linux it overrides Chrome's "bookmark all tabs" while the dev server is open; Mac Chrome uses Cmd+Shift+D, untouched. The tab sits 2px in from the corner because 8px in it covered the bottom of Classic's About. Checked: 175 tests (each control against its old key and effect, Ctrl+Shift+D, Escape with focus back on the tab, click outside, remembered open, absent from the production App), `npm run build` (no panel strings in any chunk), the browser in both museums on the title, timeline, collection, Level 0 and Level 1 at 1440 and 375 (on top of the small-screen notice; no sideways scroll at 375), keyboard (Tab reaches it, Enter opens, Escape closes). Index museum shots retaken without the dev lines.


### Levels: the catalogue record around the device · experiment, approved 11 Nov 2026
Another way to link the devices to the museum's ink, after the stipple reveal was dropped (entry in Done). The device stays exactly as it is, and the museum annotates it the way catalogues record objects: a catalogue number, labels with thin lines pointing at parts, and the object's data, in the index's own monospace and inks. Try it on Level 1 behind a dev setting first.

- **First, remove the stipple reveal:**
  - delete `src/shared/reveal/`, `scripts/reveal-drawing.mjs`, `scripts/reveal-shots.mjs` and `assets/reveal/`
  - remove its setting from `devLooks.js` and the dev panel, and its note in the spec
  - keep the frames in `docs/reveal/`
- **Pilot on Level 1 (the Mac)** only. Matthew decides about the other five after seeing it.
- **Dev setting:** "Catalogue record", on or off, in the dev panel under Levels. It's remembered per browser, off by default and absent from production. With it off, nothing changes.
- **The emulator isn't touched.** The record is a museum-layer overlay positioned in the device's own coordinates (Level 1's W × H) inside `.wrap`, so it scales and moves with `useArtifactFit`.
- **What the record shows,** in the index's monospace: black for the main text, the second grey ink for lines and secondary text, at the index's sizes:
  - **Catalogue number,** at the device's top left: `IA.1984.02` (Interface Artifacts, year, the room's number as on the cards).
  - **Object line:** `Apple Macintosh (128K), 1984`.
  - **Labels with thin leader lines to parts the emulator actually shows:**
    - the screen: `9-inch screen, 512 × 342, black and white`
    - the floppy slot: `3.5-inch floppy drive, 400 KB`
    - Two or three labels at most. Lines are straight or have one bend, 1px, in the grey ink, ending in a small dot on the part.
  - **A short data block:**
    - `Motorola 68000, 7.8 MHz`
    - `128 KB memory`
    - `35 × 24 × 28 cm, 7.5 kg`
    - `$2,495`
    - `24 January 1984`
- **No scale bar and no dimension lines.** The emulator isn't drawn to the Mac's real proportions (the real front is taller than wide), so lines measuring it would be wrong. The size is given as text in the data block.
- **When it shows:**
  - **intro:** the full record.
  - **booting:** the labels and data fade out as the boot starts.
  - **playing:** only the catalogue number stays, small and grey.
  - **discovery:** the full record comes back.
  - Under reduced motion it appears and disappears without fading.
- **Placement:**
  - Labels sit in the space beside the device. They never cover the device's screen, the list or the HUD, and they don't move the device.
  - Where there's no room (phone width, narrow windows), drop the leader lines and labels. Keep the catalogue number, and put the object line and data block under the device in intro and discovery.
- **Facts:** each one goes in the spec with its source and confidence. From Wikipedia, "Macintosh 128K", read 11 Nov 2026, all high: released 24 January 1984, $2,495, Motorola 68000 at 7.8336 MHz, 128 KB, 9-inch monochrome 512 × 342, 3.5-inch single-sided 400 KB floppy, 13.6 × 9.6 × 10.9 in (35 × 24 × 28 cm), 16.5 lb (7.5 kg). Check them against a second source (Apple's own material or a period review) before they ship, and don't add facts without a source.
- **Copy** stays plain and matter-of-fact, as labels, not sentences.
- **Not in this pass:** the other five levels, and a drawn case around a live screen or a dig cross-section (both under Ideas).
- **Show Matthew:** intro, playing and discovery, in light and dark, at 1440 and 375, with the setting on and off.
- **Checks:**
  - Tests: off changes nothing; on shows the full record in intro and discovery and only the number in playing; the setting is absent from production; the reveal files are gone.
  - Run `npm run build`.
  - Check in the browser: the labels' dots land on the screen and the floppy slot at several window sizes, with no console errors.
- **Spec:** a short note under Level 1, marked as an experiment, with the facts and their sources.
- **Status (11 Nov 2026):** built and shown to Matthew. The stipple reveal is removed (its frames stay in `docs/reveal/`). The record is `src/shared/catalogue/CatalogueRecord.jsx`, behind Levels > catalogue. Details and sources are in the spec under Level 1.
  - **Facts:** checked against Apple's spec page (SP186) and Byte's February 1984 "At a Glance". They agree, except that Byte gives 19.5 lb and 13.5 × 9.7 × 10.9 in. The record keeps Apple's figures.
  - **Placement:**
    - In Classic, the labels sit beside the device at 1920, 1440, 1280 and 1024, with the dots on the screen and the slot.
    - In the Index at every size, and in both museums at 375, there is no room beside or under the device, so only the number shows. The Index at 1920 is about 40px short.
    - To show more in the Index, the column could be narrower (break the object line and the screen label onto two lines), or the record could be allowed over the bezel below the screen. Matthew's call.
  - **Shots:** `docs/catalogue/` (plus `sheets/`), taken by `scripts/catalogue-shots.mjs`.
  - **Checked:** 184 tests, `npm run build` (no record in the bundle), no console errors.


### Index museum: no shadows behind the devices · approved 11 Nov 2026
Matthew: the drop shadows behind the devices look bad in both light and dark. In the Index museum, no device has a shadow or glow around it. Classic keeps its shadows: it was designed on a dark room, and its files don't change.

- **Where they come from:** each device's own CSS, for example the Mac bezel's two `drop-shadow`s (`src/components/MonitorBezel.module.css`). Find them all: Level 0's terminal bezel (`TerminalBezel.module.css`, `TerminalScreen.module.css`), `MonitorBezel`, `BrowserChrome`, `PhoneFrame`, Level 4's ghost iPhone glow and anything in Level 5. Check each level's `.module.css` too.
- **How, without the museum reaching into the artifacts:** each device's outer shadow moves into one CSS variable on the device (for example `--artifact-shadow`), with today's value as its fallback, so Classic looks exactly as now. The Index sets it to `none` on its level screens. The museum doesn't override artifact selectors.
- **What stays:** lights and shading on or inside the device: the floppy drive's LED, the screen's own glow, the phone's status-bar text shadows, the feed's in-app shadows. Only the shadow or glow the device casts onto the page goes.
- **Fit:** if `useArtifactFit` or a level's wrap leaves room for the shadow, remove that room in the Index so devices don't sit off-centre.
- **Checks:** every level in the Index, light and dark, at 1440 and 375, with no shadow around the device; Classic unchanged (compare screenshots); `npm run build`; retake the Index screenshots that show devices.
- **Status (11 Nov 2026):** built.
  - **What changed:** four devices cast a shadow on the page: the terminal, the Mac, Netscape and the Level 4 ghost glow. Each now reads `--artifact-shadow`, and the Index sets it to a clear shadow. Level 3 and Level 5 had none. The fit never left room for shadows, so nothing moves.
  - **Checked:**
    - every level playing in the Index, light and dark, at 1440 and 375 (`scripts/index-levels-shots.mjs`, `docs/museum-index/levels/side-*-playing.webp`)
    - Classic before and after at 1440: only screen flicker differs
    - 184 tests and `npm run build`
    - the Index level screenshots in `docs/museum-index/` retaken

### Index museum: the device centred, the list in the corners · approved 11 Nov 2026
Matthew: inside a level, the list on the left with the device on the right doesn't look good. The device should be centred, as in Classic, and the list should get out of its way. Inside a level, the list splits into four small corner blocks around a centred device. The title, timeline and collection keep the list as it is.

```
Interface Artifacts                    1979 1984 1995 2007 2016 2023
1984  The Desktop  ≡                                     Dark mode [ ]

                       ┌──────────────┐
                       │  the device, │
                       │   centred    │
                       └──────────────┘

[x] Open the Finder                                   Continue  →
[ ] Use a desk accessory                                      1 of 3
```

- **The four corners:**
  - **Top left, where you are:** `Interface Artifacts` (to the title) and the room's line, inverted, as in the list. `≡` (or Enter on the line) opens the full list as a panel over the page; Escape closes it.
  - **Top right, getting around:** the six years in one row, the current one inverted, each a link to its room. Below them, Dark mode. "Back to timeline" goes here too, or the full list carries it.
  - **Bottom left, what to read:** it changes with the screen state, one thing at a time.
    - intro: the room's intro text, about 40ch wide
    - playing: the objectives, `[ ]` and `[x]`, with the hint line under them when it comes
    - discovery: the discovery text
  - **Bottom right, what to do next:** Begin excavation in intro, Continue in playing (once everything's done) and discovery, with the objectives count (`1 of 3`) while playing. Keep clear of the dev tab in the very corner (dev only).
- **The device:**
  - It's centred in the viewport, horizontally and vertically, in every state, so it doesn't move when the state changes.
  - It's scaled so it clears all four corners. Mark each corner block `data-hud` so `useArtifactFit` avoids them while keeping the device centred.
  - Nothing overlaps the device.
- **Type:** the index's monospace and its two inks, at its sizes. Corners are aligned to the page's margins on the same grid. No boxes or backgrounds behind corner blocks.
- **The catalogue record** (experiment, entry above): its labels sit between the device and the corners and must not collide with them. If there's no room, it falls back as that entry says.
- **Phone width:** top left and top right merge into one line at the top (the room and `≡`), the device sits under it, and the bottom-left and bottom-right blocks stack under the device.
- **Keyboard:** Tab goes through the corners in reading order: top left, top right, bottom left, bottom right. The arrow keys still move between rooms on the years row. Escape closes the full list.
- **Moving between states:** text in the bottom corners swaps without moving the device. Nothing moves under reduced motion.
- **Dev setting:** "Level layout: corners / side" in the dev panel under the Index, corners by default, so Matthew can compare with today's side layout. Remove the side layout once he's decided.
- **Not in this pass:** changing the title, timeline or collection views; Classic; new copy.
- **Show Matthew:** all six levels in intro, playing and discovery, light and dark, at 1440 and 375, beside the side layout.
- **Checks:**
  - Tests: each corner shows the right thing in each state; the full list opens and closes; the device is centred and clears the corners at several sizes.
  - Run `npm run build`.
  - Check in the browser: keyboard only through one level, and no console errors.
- **Spec:** update the Index museum section's level layout.
- **Status (11 Nov 2026):** built, corners by default, side behind the dev setting. Details in the spec, "Index museum".
  - **Placement:**
    - Each corner box keeps one size, so the device doesn't move between states. `useArtifactFit` centres the device and clears the corners.
    - Because the reading column sits beside the device, devices are smaller than in the side layout. The Mac is about 690px wide at 1440 × 900 (side layout: 880), and about 310px at 1024 × 768.
    - Level 0's wide terminal shrinks the most.
  - **What's in each corner:**
    - The discovery in the corner has no dot picture (the backlog asked for the text). Level 4 still hides the feed at discovery, as in the side layout.
    - "Back to timeline" is in the full list, not the top right.
  - **Checked:** 193 tests; `npm run build`; keyboard only through Level 1 in headless Chrome (Tab order, the list opening and closing, the years row, Begin by Enter), with no console errors.


### Index museum: a flint arrowhead as the museum's pointer · approved 11 Nov 2026
Matthew wants a fun cursor for the museum. In the Index museum the pointer is a tiny flint arrowhead, the fossil version of the pointer (fossil pictures, level 1). Inside a device, the device's own period pointer takes over as now: fossil outside the glass, live inside. No per-era pointers on the list (considered and turned down).

- **The drawing:**
  - A small hand-made pixel drawing at cursor size, not the stipple fossil scaled down: stipple doesn't survive at 32px.
  - It has the arrowhead's outline, which is the pointer's: tip at the top left, two straight edges, and the short tang where the pointer's tail is. It's about as tall as a system arrow (about 20px at 1×).
  - Two inks: the text colour for the body, with a few page-colour pixels for flake scars and a 1px page-colour edge, so it shows on both themes. Make a light and a dark version and switch them with the theme.
  - Provide a 2× version for sharp screens where browsers support it, falling back to the 1× file and then `auto`.
  - Hotspot exactly at the tip.
- **Where it applies:**
  - Everywhere in the Index museum layer: title, timeline, collection, About, and the corners and list inside a level.
  - It doesn't change on links. The list's own hover and inverted row show what's clickable, so no hand cursor.
  - Text inputs, if any, keep the text caret.
- **Where it doesn't:**
  - Inside the artifact. Levels with a period pointer (`--cursor-mac-arrow`, `--cursor-win-arrow` on the artifact root) keep it.
  - Levels without one (Level 0's terminal, the phones with their touch indicator, Level 5) get the system default inside the artifact, not the arrowhead, so the fossil never looks like part of the exhibit.
  - Classic keeps its cursors.
- **Files:** museum-layer CSS in `src/shared/index-museum/`, not `era-cursors.css` (that's the artifacts').
- **Checks:**
  - In the browser, light and dark: the tip clicks exactly where it points (try small targets like `[ ]`), and it switches to the period pointer on Level 1's and Level 2's screens.
  - Levels 0, 3, 4 and 5 show the system default inside the device.
  - Run `npm run build`.
  - Screenshots can't show cursors, so show Matthew a short screen recording or a zoomed capture of the cursor files.
- **A second cursor to compare (Matthew, 11 Nov 2026): a fossil stick.** Build both, switchable in the dev panel ("Museum pointer: arrowhead / stick", remembered per browser, arrowhead by default). Matthew picks one later.
  - **The reference:** `docs/reference/style-lab/cursor-fossil-stick.png`, Matthew's photo of a fossilised branch, possibly a bone. The idea: before computers a pointer was a stick, so this is the oldest pointer there is.
  - **The drawing:** the same rules as the arrowhead, a small two-ink pixel drawing that switches with the theme.
    - Turn it to point up and to the left like every cursor: the thin end is the tip, and the knobbly, forked end sits at the bottom right.
    - Taper the last few pixels to a point, because the real end is rounded and the click must be precise. The hotspot is exactly at the tip.
    - Keep only the silhouette: the slightly crooked shaft, the bump in the middle and the fork at the end. Make the shaft 3–4px wide so it doesn't vanish, about 28px long at 1×, with a 2× version.
  - **Where it applies:** everything above applies to it too.
  - **Checks:** the switch flips between them on every Index view. Show Matthew both cursors zoomed side by side on light and dark, plus a short recording of each in use.
- **Spec:** a line in the Index museum section.


### Index museum: level screen fixes from Matthew's review · approved 11 Nov 2026
Five changes to the level screens in the Index museum's corner layout (entry above), from Matthew's review on 11 Nov 2026. Build and commit them one at a time, in this order.

**1. Dark mode only in the menu.** Remove the Dark mode line from the top-right corner. It's already in the full list (the `≡` menu). The top right keeps the years row.

**2. A smaller menu, with no border.** The full list that `≡` opens is a panel the full height of the window, with a vertical rule down its right edge.
- It should be only as tall as its contents: the title line, the six rooms, Back to timeline and Dark mode, with the usual margins.
- Its background is the page colour (white in light mode, the dark page in dark mode), with no border, rule or shadow.
- It still sits over the page, opens from `≡` and closes with Escape or a click outside.

**3. The room's fossil appears with the discovery.** When a level is completed and the discovery text appears (bottom left), that room's fossil (level 1's arrowhead and so on) appears beside the text.
- It's drawn as in the fossil pictures option: the mask in the text colour, the same file as the room's fossil.
- Size: about as tall as the discovery text block, so it reads as the find beside its label.
- It appears with the text, without moving the device. With reduced motion it appears without a fade.
- At phone width it sits above the discovery text.
- It shows whichever Pictures option is set: dots, stamps or fossils. If that option has no picture for the room, show nothing.

**4. A catalogue record for every level.** Roll the Level 1 record (`src/shared/catalogue/CatalogueRecord.jsx`) out to all six levels, with the same layout, states and fallbacks. Keep the dev setting, now on by default; Matthew will say when to drop it. Each level records what's on its screen: the hardware where there's a device, the software where there isn't. Every fact needs two sources before it ships, and goes in the spec with its sources and confidence. Below are candidate facts, not final; check each one and drop any you can't source:
- **Level 0:** DEC VT100.
  - Introduced August 1978 (high).
  - 80 or 132 columns × 24 lines (high).
  - It popularised the ANSI escape codes terminals still use (medium).
  - Labels: the screen, the keyboard. Catalogue number `IA.1979.01`.
- **Level 2:** Netscape Navigator, the software.
  - 1.0 released 15 December 1994 (high).
  - Free for education and non-profit use, paid for others (medium; check the price before quoting one).
  - The most-used browser in 1995 (medium).
  - Labels: the N throbber, the Location field. `IA.1995.03`.
- **Level 3:** the original iPhone.
  - Released 29 June 2007 in the US (high).
  - $499 (4 GB) and $599 (8 GB) (high).
  - 3.5-inch screen, 320 × 480 (high).
  - Labels: the screen, the home button. `IA.2007.04`.
- **Level 4:** Instagram for iOS, the software.
  - Launched 6 October 2010 (high).
  - Ranked feed announced 15 March 2016 (high).
  - The blue header lasted until the 11 May 2016 redesign (high).
  - Labels: the header, a like button. `IA.2016.05`.
- **Level 5:** the genre, not a product. The object line is "AI chat assistant, 2023". The exhibit is Claude-inspired but unnamed, so the record doesn't claim it is any one product.
  - The data block gives real examples: ChatGPT released 30 November 2022 (high), Claude released 14 March 2023 (high).
  - Labels: the message box, a reply. `IA.2023.06`.
- **Number format:** the catalogue numbers follow Level 1's `IA.1984.02`: year, then the room's number as on the cards.

**5. A toggle to show and hide the record.** Next to the catalogue number at the device's top left, add a toggle: `IA.1984.02 [−]` when the labels and data are showing, `[+]` when they're hidden.
- It works whenever the device is on screen: intro, booting, playing and discovery.
- Each state still starts with its default: the full record in intro and discovery, the number only while playing.
- Once you use the toggle, your choice holds for the rest of that visit to the level, through every state. It isn't remembered across levels or visits.
- The number itself always stays.
- It's a real button with `aria-expanded` and a label ("Show catalogue record" / "Hide catalogue record"), reachable by Tab and Enter. It uses the index's monospace, grey ink and hover, like the list's `+` lines.
- Showing and hiding fade as the states do. With reduced motion there's no fade.
- At phone width it shows and hides the record's block under the device.
- Tests: the toggle shows and hides in every state, overrides the state default for the visit, and resets on the next visit.

**Checks for all five:**
- Every level in intro, playing and discovery, light and dark, at 1440 and 375.
- The labels' dots land on their parts at several sizes.
- Tests: the dark line isn't in the top right; the menu fits its contents; the fossil shows only in discovery; every level has its record.
- Run `npm run build`.
- Retake the Index screenshots.

**Status (11 Nov 2026, overnight run):** all five built, in one commit (Matthew's prompt asked for one commit per backlog item). Details in the spec ("Index museum" and each level's "Catalogue record").
- **1. Dark mode** is gone from the top right; it's in the `≡` list only.
- **2. The menu** is only as tall as its contents (260px at 1440 × 900), on the page colour, no border, rule or shadow.
- **3. The room's picture with the discovery:** placed by `placeFind` (`src/shared/index-museum/find.js`), never over the device (`useArtifactFit` now publishes the device's box as `--artifact-*`). At 1440 × 900 the Mac leaves no room beside the text, so the picture sits above the text in the left column, as tall as the text; on wider windows it goes beside. **For Matthew:** if "beside" must hold everywhere, the corner would need to be wider (and every device smaller).
- **4. A record for every level:** facts checked against two sources each; sources and confidence are in the spec under each level. Changes from the candidates:
  - Level 0 has one label (the screen): the exhibit draws no keyboard. "Popularised ANSI codes" is medium and left off; the record says `ANSI X3.64 escape codes` (high). The launch price had one source and is dropped. DEC's spec gives the VT100 a white (P4) phosphor, not green (one source, noted in the spec only).
  - Level 2: `$39, free for education and non-profit use`, `Most-used browser, 1995` (no share figure: sources disagree). 1.1's date and the meteor throbber are left off (medium, single source).
  - Level 3: the processor and memory are medium (Apple never published them).
  - Level 4: "Ranked feed **announced**" (it rolled out over months). Its screen isn't drawn in the intro and its feed is hidden at the Index discovery, so its labels only show once the feed is there.
  - Level 5: the record treats the chat's 680px column as the object.
  - New: labels stack when two parts are close (Netscape), and a moved label's line takes one bend; a part is found in the artifact by a selector and dropped when it isn't drawn.
  - The setting is on by default (dev only; production still has no record).
- **5. The toggle** works in every state and holds for the visit. Where the record has no room beside or under the device, the number is the whole record and the toggle is hidden, since there's nothing to show. **For Matthew:** in the Index corners at 1440 × 900 this is the case for the Mac (Level 1), so its toggle doesn't appear there; the open question from the catalogue entry (a narrower column, or allowing the record over the bezel) still decides that.
- **Checked:** 21 test files, `npm run build` (no record or facts in the bundle), the browser at 1440 × 900 in both museums (every level's record mode and dots), the discovery picture at 1440 and 375, the menu's size. Screenshots not retaken (Matthew: only when asked).

### Level 5: a light version in light mode · approved 11 Nov 2026
In the Index museum, Level 5's chat is dark in both light and dark mode. In light mode it should be light. Matthew's call (changed 11 Nov 2026): invert the current colours, not a recreation of a 2023 app's light theme.

- **The look:** the same design with its colours inverted: light page and panels, dark text, the borders and greys flipped to match.
  - Make it a set of light tokens chosen by hand from the inverted values, not a CSS `invert()` filter, which would also flip images and the accent.
  - Keep the accent colour as it is, unless it fails contrast on the light page; if it does, darken it just enough.
  - It must stay readable: every text colour passes AA (4.5:1 for body text, 3:1 for large text and UI edges) on its background. List the pairs and ratios in the spec.
- **How:** the level passes the museum's theme into the artifact (a prop or a data attribute on the artifact root), and the artifact has its own light and dark tokens. The museum doesn't restyle the artifact's selectors.
  - Index light mode shows the light version.
  - Index dark mode and Classic show the dark version as now.
- **Everything else stays:** layout, copy, timing and sounds. Check the contrast of every text colour in light (AA).
- **Checks:** Level 5 in all its states, light and dark, at 1440 and 375, with Classic unchanged. Run `npm run build`. Retake its screenshots.
- **Spec:** a note under Level 5.
- **Status (11 Nov 2026):** built overnight, not yet shown to Matthew. Every chat colour is now a `--chat-…` token on the chat panel, with a light set chosen by hand from the inverted values; `Level5` passes `theme` to `ChatPanel` (`data-chat-theme`), light only in the Index's light mode. The page is #fff, continuous with the light room. The chat has no accent colour, so there was none to keep. Pairs and ratios are in the spec under Level 5, "Light version"; every light text colour is 4.5:1 or more, and icons and edges 3:1 or more. Checked: 202 tests (a new one: dark in Classic, even with the Index theme set to light; light in Index light; dark in Index dark; live), `npm run build`, the browser in intro, playing (a sent message, a reply, action icons, chips) and discovery at 1440, and playing at 375, in Index light and dark and in Classic. Screenshots not retaken (not asked for in the prompt). Found on the way and committed separately: at 375 the catalogue number sat at the viewport edge, so Level 5 now measures the record from the input bar's edges (24px in).
  - **Dark greys (Matthew, 11 Nov 2026): lift the ones that fail AA.** Done: placeholder and "Curator v1" #949494 (4.7:1), send icon #808080 (3.6:1), input bar edge, thinking dots and chip edge #666 (3.3:1), action icons #737373 (4.0:1); chip hover edge #888. Before and after in the spec under Level 5, "Light version". Classic and the Index's dark mode both show it.

---

## Done

### Levels: the device as a drawing when you arrive and leave · experiment, dropped 11 Nov 2026
Matthew feels the emulators need a link to the fossils' stipple drawing style. The idea: the device is a stipple drawing when you arrive and when you leave, and it's real and in colour only while you're using it. Begin excavation uncovers it, and Continue files it back into the archive as a drawing. Try it on one level behind a dev setting before deciding.

- **Pilot on Level 1 (the Mac)** only. Matthew decides about the other five after seeing it.
- **Dev setting:** "Stipple reveal", on or off, in the dev panel (`src/shared/dev/DevPanel.jsx`), remembered per browser, off by default and absent from production. With it off, nothing changes.
- **The emulator isn't touched.** The drawing is a museum-layer image laid exactly over the device inside the level's `.wrap`, scaled by the same `useArtifactFit` numbers. The device's own components, styles, boot and sounds stay as they are.
- **Arriving:**
  - **intro:** the device is covered by its drawing.
  - **Begin excavation:** the drawing dissolves to reveal the device in colour, then the device's own boot plays as now.
  - The dissolve replaces the 300ms pause before the boot. It takes about 700ms, and the boot starts when it finishes.
  - **Revisits** (which start at `booting`): the drawing shows on load and dissolves straight away, then the boot plays. Arriving always starts from the drawing.
- **Leaving:** on Continue, colour drains away and the drawing settles back over the device while the discovery appears (about 900ms). It stays a drawing for the rest of the discovery.
- **The dissolve:**
  - Dot by dot, not a fade or a wipe. The dots disappear in a random order, biased to sweep from the top left to the bottom right like a brush stroke. Under them is the live device.
  - Leaving runs the same in reverse.
  - Under reduced motion: a plain crossfade of about 200ms.
  - No sound.
- **Making the drawing:**
  - A script captures the device in its intro state at its natural size (Level 1's W × H) with a transparent background, and turns it into stipple. It uses round dots of one or two sizes, dense in the darks and sparse in the lights, coarse like the fossils, not a halftone grid. Regenerate it whenever the device changes. The output goes to `assets/reveal/level-1.webp`, dev only.
  - It's drawn like the fossils:
    - The dots are a mask filled with the text colour.
    - Underneath, a solid silhouette of the device fills the page colour, so the live device doesn't show through the gaps.
    - Outside the device's own shape stays transparent.
    - It works in light and dark.
  - Check it lines up with the device to the pixel at several window sizes, including phone width.
- **Interaction:** the drawing doesn't take clicks. In intro the device is inert anyway, and in discovery the device stays inert as now.
- **Not in this pass:**
  - the other five levels
  - brushing it away by hand
  - a drawn ground or dig pit around the device
  - dust that clears as objectives complete
  - boots drawn dot by dot
  The last four are recorded under Ideas, "Museum restyle".
- **Show Matthew:** a recording or a short sequence of screenshots of arrive and leave, in light and dark, at 1440 and 375, with the setting on and off.
- **Checks:**
  - Tests: off changes nothing; on shows the drawing in intro and discovery and not in playing; revisits start from the drawing; the setting and files are absent from production.
  - Run `npm run build`.
  - Check in the browser: no console errors, and the boot and objectives work as before.
- **Spec:** a short note under Level 1 and the dev panel section, marked as an experiment.
- **Status (11 Nov 2026):** built and shown to Matthew. What it does is in the spec, Level 1, "Stipple reveal". Files: `src/shared/reveal/StippleReveal.jsx` + `.module.css`, `scripts/reveal-drawing.mjs` (the drawing, `assets/reveal/level-1.webp`, about 50,000 dots), `scripts/reveal-shots.mjs` (frames), and the setting in `devLooks.js` and the dev panel under Levels. Decided while building: the Mac's photographic drop shadow showed as a grey halo round the drawing, so a soft page-colour margin covers it while it's a drawing and dissolves with the dots. Level 1 had no 300ms pause to replace; the dissolve simply comes before the boot. A fallback ends the dissolve 1.5s late if the drawing hasn't loaded, so the boot is never held up. In dark the drawing is a negative (light dots on #111, so the screen reads bright), as with the fossils. The canvas is drawn once and patches are cleared or copied back per frame: about 60fps in headless Chrome. The in-app browser pane ran at 2 to 5fps with or without it. Lined up with the Mac to the pixel at 1440, 1024 and 375. Review: `docs/reveal/level-1-arrive-leave-<light|dark|375>.webp` and a strip per set in `docs/reveal/strips/` (1440 and 375; Index light and dark and Classic; on and off; arrive, revisit, leave). Checked: 181 tests (off changes nothing; on: drawn in intro, dissolving before the boot, clear while playing, settling at the discovery; revisits start from the drawing; absent outside dev), `npm run build` (no reveal code, strings or files).
- **Dropped (Matthew, 11 Nov 2026):** it felt unrefined. The drawing is a screenshot turned into dots by a script, so the Mac reads as even static, not as a drawing like the fossils, and the dissolve reads as interference. Replaced by "Levels: the catalogue record" (Approved), which removes this code. The frames stay in `docs/reveal/` as a record.

### Museum: style lab, B2 iteration with Matthew · 10 Nov 2026
From Approved. One change was made before the index museum entry superseded it.
- **The row of six squares is gone** from every B2 screen (title, timeline, collection, both level frames), along with its links, hover states and "you are here" marking. A blank line sits where it was.
- **Kept:** the hover and focus preview beside the list, and the dot illustrations on the collection cards; a card and its line still light together.
- **In a level frame** the room's own line is black and its intro and objectives open under it, so it marks the room you're in without the squares. Nothing was added.
- **Checked:** 149 tests (the squares test is now "no squares; in a room only its line is marked"); `npm run build`; the Mac frame, the timeline with the pointer on a line and the collection in the browser, no console errors. Screenshots in `docs/style-lab/b2-index-refined/` retaken.
- **Superseded** by "the index museum, built for real behind a switch". The lab stays as reference.

### Museum: style lab, B2 takes the dot illustrations · 10 Nov 2026
Asked for in chat after Matthew's read of round 2 (under Ideas, "Museum restyle"), not from Approved. Changed in B2 itself, not as a new concept; three commits, one per feature.
- **Pointing at a room shows its picture.** On the title and timeline, the space right of the list is empty until a room's line (or one of its objectives) is under the pointer or has keyboard focus. Then that room's dot illustration appears there, 34 characters wide, with its year under it, and goes when the pointer leaves. It is hidden under 900px wide, where there is no room beside the list.
- **Six little squares open the rooms.** A row of 1px boxes under the title line, each with a room's illustration and its year below, on every B2 screen. They are links to the rooms. They turn black with white dots under the pointer, as a row does. In a level frame they stand in for the HUD's progress dots: the room you are in is the black one. Six across on a wide window (10 characters each, 7 beside the cards and the artifact), three to a line at phone width.
- **A square, its room's line and its card light together,** and any of them brings up the larger picture where there is one.
- **Collection cards** carry the dot illustration in the picture box, black on white, and white on black when the card is lit. A room not found shows the illustration's dot grid with nothing drawn on it (it was a hatched box).
- **Art switch:** B2 now has Drawn · Illustrated · Dots, Dots by default; the other two swap the pictures in the squares, the preview and the cards. The illustrations are the same six ink masks G uses, now shared in the lab (`DotArt`, `RoomPicture` in `styleLab/CurrentCard.jsx`).
- **Screenshots:** `docs/style-lab/b2-index-refined/` retaken, with two new ones taken with the pointer on a line: `1440-timeline-hover.webp` and `1440-collection-hover.webp` (the script can now hover before a shot).
- **Checked:** 149 tests (3 new: the picture appears on hover and on focus and goes on leaving; the six squares link to the rooms, carry the year, bring up the picture and mark the current room; found cards carry `dots-N`, unfound ones none, and Illustrated swaps them). `npm run build`: nothing from the lab in `dist/` beyond the existing view key. Looked over: the two hover screenshots, both level frames at 1440, the title at 375. Not checked by hand: keyboard focus (covered by the test), a screen reader, Safari or Firefox.
- **Not done:** the preview doesn't show in a level frame or on the collection, where the artifact and the cards have that space. G was left as it is.
- **No museum component, style or copy changed.**

### Museum: style lab round 2, B2 and G · 10 Nov 2026
- **Built:** two more concepts in the dev-only `/style-lab`, after A–F on the index. Same shared text and fixed state. Each shows the title, timeline, collection and the level frame twice, around the Mac (780 × 755) and the iPhone (385 × 735). The lab bar has a tab for each frame.
  - **B2, Index refined** (`B2_Index.jsx`, `.module.css`): B's list unchanged on the title and timeline.
    - *Cards:* redrawn as monospace boxes with 1px rules and square corners: number and year, the picture, the name in capitals, the room, a dotted rule, the description, a foot line. An unfound room is the same box with a hatched picture space and "Finish this room to add it." A card turns black under the pointer, as a row does.
    - *Level frame:* the list is a 58-character column and is the whole HUD (title, six rooms, back link, small-screen line; Collection and About are left off, as in today's HUD). The open room's rows are the intro, Begin excavation, the objectives, the hint, Continue and the discovery. The artifact is fitted into what is left, up to 1.35×: beside the list from 900px wide, below it when narrower. At 1440 × 900 the Mac comes out at about 845 × 818 (1.08×) and the iPhone at 428 × 818 (1.11×). At 375 wide the Mac is 343 × 332 and the iPhone 343 × 655, under the list.
    - *Begin excavation and Continue work*, so the list can be seen at its playing length (objectives, hint, Continue) and after Continue (objectives ticked, the discovery rows). The room's own row puts everything back.
  - **G, Punch card** (`G_PunchCard.jsx`, `.module.css`, `g/glyphs.js`, `g/dots-0…5.webp`):
    - *Paper and ink:* cream `#f6f1e3`, ink `#141414`, cards `#e9e3d0`. Teal `#09657a` for links only, each word underlined on its own (darker than the reference's teal, which fails AA on cream; this one is 5.9:1 on the page and 5.2:1 on a card). Grey captions `#676255` (4.7:1 on a card). Dashed 1px rules.
    - *Dot capitals:* headings and captions are drawn as SVG dots from a 5 × 7 table (A–Z, 0–9 and the punctuation the copy uses), one SVG a word so they wrap. Each dot is moved and resized a little by a seeded random source, so the "ink" is the same on every render. The real text sits beside the drawing, visually hidden, and the drawing is `aria-hidden`. Captions are 13px, grey and slanted.
    - *Notes:* numbered from 0 down a dashed rule: the About paragraphs (0–2), the rooms on the timeline (0–5), the objectives (0–2), the collection's records (0–5).
    - *Title:* the name in dot capitals across the page under a dashed rule, the subtitle and "Enter the exhibit", then a card stood on end beside the notes, as in the reference. The card is printed and punched with the name and the six years.
    - *Timeline:* a 3 × 2 table with 2px rules. Each cell has the room's dot illustration and its year, with a ring that is filled when the room is found. Room numbers and titles run along the top and bottom as axis labels. A cell under the pointer or with focus turns its dots and year teal. The notes column has the titles as links and the artifact names.
    - *Collection:* each artifact is an 80-column card with the corner cut: twelve rows, the digit rows printed faintly, a print line along the top. A found card is printed and punched with the year and the artifact's name, and the picture sits over the middle columns. An unfound room is a blank card. The description is a numbered note beside the card.
    - *Level frame:* the era in dot capitals top left; the intro, discovery and small-screen cards are cut-corner cards with a dot-capital print line and the year punched in a four-column strip; the objectives are notes 0–2 with a ring that fills; the hint is a grey dot caption under the artifact; Continue and the back link are teal. The Mac comes out at about 656 × 635 (0.84×) between the two side columns, the iPhone at 363 × 693 (0.94×).
    - *Art:* the lab bar offers Drawn · Illustrated · Dots in G (Dots by default) and the first two elsewhere. The six dot illustrations are cropped from `g-dot-illustrations.webp` (400 × 340 each) and turned into ink-only masks with ImageMagick, so they sit on the page's own cream and take the ink's colour. Their faint dot grid comes with them.
- **Lab changes:** the index lays its concepts out in as many columns as fit (eight at 1440). `scripts/style-lab-shots.mjs` shoots both level frames for B2 and G, retries a failed shot, and takes a page too long for WebP at 2× (the index at 375) at 1×.
- **Screenshots:** `docs/style-lab/b2-index-refined/` and `g-punch-card/`: title, timeline, collection, level-mac and level-iphone at 1440 and 375 (20 files), and the two index pictures retaken. The folder is now 7.5 MB.
- **Checked:** 146 tests (12 new: both level frames on the index and from a bare `#b2/level`; B2's Begin and Continue; G's headings keep their text beside the dots; G's first card is punched 1-9-7-9 in its first four columns and two cards are blank; Dots is offered in G only; the shared four-screen text checks now run for B2 and G). `npm run build`: no chunk, route, text or picture from the lab in `dist/`, only the existing `styleLab` view key. In the browser: a timeline cell's dots and year turn `#09657a` under the pointer; Drawn and Illustrated swap the pictures in G's timeline and cards; no console errors. Thirteen of the twenty new screenshots were looked over (every screen of G at 1440, B2's collection and both level frames at 1440, five at 375). Not checked: keyboard focus on G's cells by hand (the rule is shared with hover), a screen reader, Safari or Firefox.
- **No museum component, style or copy changed.** Nothing outside `src/pages/StyleLab.jsx`, `src/pages/styleLab/`, the lab's test, script and screenshots was touched.
- **Interpretations:**
  - *Cards are punched in full.* The entry asked for the name printed along the top and the year punched in the digit rows. The 029 printed a character above the column it punched, so each found card carries "1979 COMMAND & RESPONSE" printed and punched column by column: the year is four single holes in the digit rows, and the letters are a zone hole and a digit hole each. The picture sits right of centre so it clears those columns.
  - *The description is beside the card,* not on it, as a numbered note. The entry didn't place it.
  - *The lettering is a generic 5 × 7 face,* not traced from the 029's code plate. Doto, the fallback font, was not loaded or checked: the SVG dots needed no font, and nothing was added to `index.html`.
  - *Rings are round* (a 50% radius), which the level frame's "open ring" asks for. Dot lettering, rings and the dot jitter are G's departures from the lab rules.
  - *Order:* B2 and G come after F on the index and in the bar, as round 2, not beside B.
- **History used (decoration only, none in copy):**
  - The card code: a figure is one hole in its own row; A–I are a 12 punch and 1–9, J–R an 11 punch and 1–9, S–Z a 0 punch and 2–9. **High** · [Wikipedia, Punched card](https://en.wikipedia.org/wiki/Punched_card). "&" as a 12 punch and "-" as an 11 punch: **medium**, same article. Written from memory this session and not looked up again.
  - 80 columns, twelve rows, a cut corner: **high**, as in the entry.
- **On the entry's watches:**
  - *B2 touches every level's wiring.* The mock supports that reading: the tracker, hint and both cards are rows, and the artifact's place depends on the list's width. With the list at 58 characters the Mac is larger than today, which also answers spec open item 1 (the 330px tracker limiting the Mac). Under about 1290px wide the Mac drops below 1× beside the list.
  - *G next to Level 0* can't be judged here: the lab's artifact is a grey box. It needs a real level behind it.
  - *Small dot lettering:* the 13px captions are readable but slow. The cards' print line is one character a column, about 6px wide on a 560px card: authentic, and not readable at a glance, which is why the name is also in the note.
- **Noticed:** with every piece shown at once, G's level frame is taller than a 900px window (the discovery and small-screen cards stack on the right). In the game they'd never be up together.
- **Next:** Matthew's pick between B2 and G, or a mix. Phase 3 is under Ideas, "Museum restyle".

### Museum: style lab (restyle phase 1) · 10 Nov 2026
- **Built:** a dev-only page at `/style-lab` ("Style lab (dev)" on the timeline). It opens on an index of six concepts side by side, each with live thumbnails of its four screens (title, timeline, collection, level frame) linking into it. Inside a concept, a bar along the top switches screen, concept and card art (Drawn · Illustrated); every screen has its own address (`/style-lab#d/level/3`). The mocks use the museum's real text (`src/data/artifacts.js`, and the rest copied word for word into `src/pages/styleLab/content.js`) with a fixed state: four rooms found, the first objective done, the hint for the second.
  - **A. Unstyled document:** everything handed back to the browser (`all: revert`): Times, blue and purple links, `<hr>`, bulleted lists, bordered tables, the browser's own buttons, checkboxes and fieldsets.
  - **B. Index:** one 12px monospace list with years on the left and dotted leaders. There are no pages; a screen is the list with one entry opened in place, and the list is the HUD.
  - **C. Canvas:** one 4000 × 2700 grey plane. The screens are places on it and going to one slides the plane. The timeline is a map at 48px to the year, the rooms drawn in their artifacts' proportions. Drag, scroll or arrow keys; Tab brings the focused thing into view; a minimap and coordinates in the corner.
  - **D. Colour field:** one flat colour per page and per era (six new saturated ones, not the card palette, because black text fails on navy and brown), black Helvetica bold up to a fifth of the window wide, 2px hard edges, no transitions.
  - **E. Specimen sheet:** white, an eight-column grid of numbered cells with 10px captions; the timeline is a matrix (a row per room: both pictures, the card, the intro, the objectives); the artifact is the one large cell, with a scale bar.
  - **F. Notebook:** pale yellow paper, Times, `<details>` toggles in thin boxes, pastel header strips, a running clock, highlighter links, cards and the artifact taped in a degree or two off square, sticky notes, real checkboxes.
- **Files:** `src/pages/StyleLab.jsx`, `src/pages/styleLab/` (one `.jsx` and one `.module.css` per concept, `content.js`, `concepts.js`, `CurrentCard.jsx`, `lab.module.css`), `src/test/StyleLab.test.jsx`, `scripts/style-lab-shots.mjs`, `docs/style-lab/`. To delete the lab, remove those and the three dev-only hooks below.
- **Screenshots:** `docs/style-lab/<concept>/<1440|375>-<screen>.webp`, full page, plus `index-1440.webp` and `index-375.webp` (50 files). Retake with `node scripts/style-lab-shots.mjs` while the dev server runs on 5199 (the `vite` entry in `.claude/launch.json`).
- **Checked:** 134 tests (25 new: the index links into every screen, and each concept's four screens carry the real text). `npm run build`: no style-lab chunk, route or text in `dist/`; the only trace is the view key `styleLab` in SharedLayout's hidden-HUD list, beside `cardLab`. Every screen was screenshotted at 1440 and 375 and about thirty of the fifty pictures were looked over, at least one of each concept at each width. In the browser: C's drag, wheel, arrow keys and focus-follow; Tab reaching F's toggles and checkboxes with a visible focus ring; no console errors. Not checked: a screen reader, real touch dragging on C, and Safari or Firefox (Chrome only).
- **Real files touched (dev-only hooks, as the entry asked):** `src/views.js` (the chunk), `src/shared/SharedLayout.jsx` (path, hidden HUD, opening at `/style-lab`), `src/pages/Timeline.jsx` (the link). No museum component, style or copy changed.
- **Interpretations:**
  - "With the current cards" and "doesn't import the real museum components" pull apart. The collection screens import the collection's own card components and art (`src/pages/collection/`), read-only, as the card lab does, so they always show the current cards. Nothing else from the museum is imported.
  - The level frame shows every piece at once (HUD, intro card, tracker, hint, discovery card, small-screen notice) around the grey box, though the game never shows them together. About is on each title screen.
  - Words the lab adds, none of them museum copy: "artifact" on the grey box, running numbers and frame sizes (E), coordinates (C), the clock and date (F).
  - Screenshots are committed (5 MB of WebP) rather than left outside the repo, so they open from the file pane and on GitHub.
- **Also added:** a `vite` entry in `.claude/launch.json` (plain Vite on 5199), because port 8888 was held by another chat's dev server.
- **Noticed:**
  - C at phone width shows only a corner of the plane. That is the concept, but it is the least usable of the six on a phone.
  - A beside the 1995 Netscape level is the risk the entry flagged: the frame and the artifact would both be Times with blue links.
  - The cards' own focus ring is white (made for the dark museum); the lab overrides it. A light museum would need that changed in `Collection.module.css`.
- **Next:** phases 2 and 3 are under Ideas, "Museum restyle".

### Museum: collection page · 10 Nov 2026
- **Built:** `src/data/artifacts.js` is the one source for the six artifacts (levels' discovery cards and addArtifact, the timeline's entries, the collection), no wording changed. `src/pages/Collection.jsx`: title and "N of 6 found", six cards in a 3/2/1-column grid, found cards in DiscoveryCard's styles with a room thumbnail, unfinished rooms as outlines with "Finish this room to add it.", every card a button into its room, the timeline's staggered fade (none under reduced motion). Timeline link "Collection · N of 6" beside About; the page's own "Back to timeline"; no HUD there.
- **Redesigned the same day** (Matthew disliked the screenshot thumbnails): the cards are now collectible cards with flat vector drawings of each device on an era plate, a serif name and the description as small print; unfound rooms lie face down. The screenshots and their capture script are gone (in git history, commit e161061).
- **Checked:** 101 tests (5 new: 0, 3 and 6 rooms done, cards and back link, the timeline link and Reset); build. In the browser at 1440, 1024, 700 and 375: 3, 3, 2 and 1 columns with no sideways scroll; 3 rooms done and 6 done; Tab reaches a card with its focus ring and Enter opens the room; the back link; Reset empties it (0 of 6). The pane's own progress was saved and put back afterwards.
- **Noticed:** on the 375 check the small-screen notice was dismissed for that visit in the pane.

### Level 1: drag files between folders and the desktop · 10 Nov 2026
- **Research** (1984 *Macintosh* manual, vintageapple.org PDF): dragging "onto the desktop, onto a folder, disk, or Trash icon, or into an open folder, disk, or Trash window", moving on the same disk (p. 105, high); the folder icon "is highlighted" under a dragged icon and not after the drop (p. 38, high); the desktop as "a handy temporary resting place … the Finder will remember where the documents belong" (p. 104, high); Put Back "puts the selected documents, applications, or folders back into the folder or disk they came from most recently" (p. 107, high). So Put Back for desktop items is built, not left out. No Finder 1.x screenshot of a highlighted folder was found; infinitemac.org wasn't run.
- **Built:** one record of where every item is (`place`: `loc` and `home`) drives the desktop, every folder window and the Trash. All icons share one HTML5 drag and outline; window icons can now leave their window. Drop-target highlight on folder, disk and Trash icons; moves into open windows (where let go) or closed folders (first free slot); out to the desktop; Put Back for desktop and Trash items; information lines and Get Info's Where follow; refusals snap back (System/Finder, System Folder, disk, folder into itself). Notes opens and completes objective 1 from any window; Projects trashed from any window completes objective 2; the first hint drops "on the desktop" once Notes moves.
- **Reconstructed** (in the spec): first-free-slot placement, per-file sizes, the Where wording inside a folder, every refusal, Empty Trash keeping a folder that holds locked Notes.
- **Checked:** 93 tests (6 new: a move, opening Notes from a folder, System refusing to leave, a folder into itself, Put Back, Get Info's Where). In the browser (drags dispatched from the page, since the browser tool's mouse drag doesn't start an HTML5 drag): Notes into Projects (4 items, 8K), Projects into Empty Folder, TeachText out to the desktop and back with Put Back (Utilities 4 → 5 items, 72K → 96K), System refusing, a folder refusing to go inside itself, Projects trashed from Empty Folder completing objective 2, Put Back from the Trash, Empty Trash keeping Projects because Notes inside is locked, and the inverted highlight on a closed folder. Not checked with a real hand-held mouse drag.
- **Fixed after (same day, Matthew's yes):** the console showed `MacScrollBar` errors (`toLocal` on a null track) when a scroll-bar press outlived its bar, e.g. a window closing mid-drag. The bar now ends every press when it unmounts; three tests cover the thumb, track and arrows.

### Copy pass applied · 10 Nov 2026
- Live in the app, one commit per surface: intro cards, discovery cards, objectives and hints, title subtitle and About, Level 5's chips, fallbacks and system prompt. Text and sources: `docs/copy-pass.md`; spec synced.
- Level 5's chat is now the exhibit's guide, not its curator (Matthew is the curator); the spec's persona and key mechanic changed to match.
- Found while applying: three chips got the wrong offline reply (e.g. "show" matched "how"). The fallback keywords are reordered and `src/test/curatorFallbacks.test.js` checks every chip (87 tests pass).
- Not changed: the chat's "Curator v1" model label in the input bar (artifact dressing), and the repository name `ux-archeologist`.
- Matthew may revisit the copy; see "Copy pass: revisit later" under Ideas.

### Level 0: moved from 1971 to 1979 · 9 Nov 2026
- Year label 1979 in the HUD, intro, discovery card and timeline (entries are evenly spaced, so nothing moved); `sfx.js` comment.
- `useTerminal.js`: V7 boot on a PDP-11/70 (`Boot`, `: hp(0,0)unix`, `mem = …`, `#`, `^D`) from V7 "Setting up Unix"; V7 login (motd, then "You have mail.", no Last login) and V7 `mail` (postmark, `?` prompt, no Berkeley banner) from `login.c` / `mail.c` on TUHS. The mem value, the motd, the mail shortcut back to the shell and both messages' wording are reconstructed and marked.
- Dates: one week, Tue 16 / Wed 17 Jan 1979 (1 Jan 1979 was a Monday).
- ken's mail: Belle won the 1978 ACM computer chess championship, 4/4, December 1978 ([Wikipedia](https://en.wikipedia.org/wiki/Belle_(chess_machine)), [IEEE Spectrum](https://spectrum.ieee.org/in-1983-this-bell-labs-computer-was-the-first-machine-to-become-a-chess-master); high). dmr's note: the Seventh Edition manual (January 1979), tapes to licensees, Bourne's sh (TUHS V7 tree; high).
- Curator: 1979 in the prompt and the fallback keyword; "fifty years" → "more than forty years" in two live fallbacks.
- `docs/copy-pass.md` shows 1979 throughout (§7 now shows the built note and mail; §9 items 1–3 resolved). Spec: era, container table, sound line, a Year note and the session content.
- Checked: tests (77) and build pass; in the browser the timeline, intro, boot, login, `date`, `mail`, the note, `man ls` and the discovery card show 1979, and all three objectives complete. `grep 1971` now hits only records: this backlog, `site-audit.md` (a dated report), and notes in `copy-pass.md` and the spec explaining the move.
- Follow-up, same day (Matthew's yes): `ls` one name per line; the password line shows nothing typed (`getpass`); `pwd` is `/usr/kerry` (V7's passwd puts dmr at `/usr/dmr`); `whoami` is gone (BSD; the shell says "whoami: not found"), and "help: not found" as V7's sh says it; `man ls` is V7's whole ls(1), filled to the screen's 57 columns. The screen now keeps runs of spaces (`pre-wrap`), and output streams at 9600 baud (960 characters a second; it was about 250 because of browser timer clamping), so the man page prints in about 5 s.

### Spec: museum cards and TeachText matched to the build · 9 Nov 2026
- Checked in the CSS and the browser: IntroModal, DiscoveryCard, the small-screen notice and the tracker have a 0px accent line and sans titles; About's card is the only one with a real 2px #111 line. The spec now says that (Museum Layer rules, Dialog System, Typography, Color Tokens: the Accent line row is gone). DiscoveryCard: "Continue" → the next level.
- TeachText disclosure added to Level 1's Utilities line with the three sources.
- **Dead CSS for a later cleanup** (not removed here): the 0px `.accentLine` rules and their empty `<div>`s in `IntroModal` (also used by `SmallScreenNotice`), `DiscoveryCard` and `ObjectiveTracker`.

### Decision: Level 1 keeps TeachText · 9 Nov 2026
- Kept, disclosed only in the spec (Matthew's call). TeachText's earliest dated version is 1.2 (1988) · [Macintosh Repository](https://www.macintoshrepository.org/2274-teachtext). It replaced Edit between System 2 (1987) and System 7 (1991) · [Wikipedia](https://en.wikipedia.org/wiki/TeachText). **Medium**, as no source gives a first-ship date. A 1984 document would have opened in MacWrite, **high** · [Eclectic Light](https://eclecticlight.co/2024/05/25/a-short-history-of-styled-text-on-the-mac-teachtext-to-textedit-rtf/).
- Options turned down: swapping in MacWrite 1.0 (a big build that needs references first); swapping in Edit (its dates and look are unconfirmed); removing the apps (it breaks objective 1).

### Level 4: feed audit fixes · 9 Nov 2026
- Built in six commits (profile-only list, removals, duplicates and library rules, captions, avatars and small photos, crops and profiles). Every finding in `docs/feed-audit.md` now ends in its outcome. Spec Level 4 "What shows where" describes the new rules.
- **Counts** (121 marked lines): **82 fixed** · **23 kept** · **6 profile only** (8 posts) · **10 needs Matthew** (only larger copies of small photos, which are removed meanwhile).
- Removed 45 archive photos (listed in `REMOVED`, `archiveData.js`): 16 unsuitable or broken, 18 too small with no larger copy, 10 bad crops, 1 duplicate. 26 library photos now belong to @instagram (`REPOSTED_BY_INSTAGRAM`), 26 more are in `SKIP`.
- **Matthew's calls this session:** acacia.johnson's iceberg reflection kept; SFMOMA's extras left as they are; Imani's two near-identical portraits moved apart, not dropped; 9gag's small photos kept; Glossier's pink-square avatar kept (it was their real 2016 avatar) and its 11 late-May posts accepted. Afterwards: the ten captions not found in full were given short written endings (each `caption_note` says so), Neymar's 480px lead removed, Selena's empty caption and Symmetry Breakfast's initial avatar left as they are.
- **Interpretations:** the audit misspelled six codes (l/I: Kylie `BDzIV_BnGvs`, Victoria's Secret `BETergNmlQF`, Kim `BCpQBQROS5l`, Bieber `BDbnw7IAvj8`, natgeo `BCYylddoVSD`, Emma Watson `BBcIpwyn3AD`), fixed by the real code. Where "remove or recrop" would leave a photo under ~360px, it was removed. The reposts rule also takes acacia.johnson's and the Oregon Duck's own reposted photos (the audit had said keep), as the rule overrides the audit. "Open on #1/#2" became `NO_LEAD`.
- **Checked:** `npm test` (74 pass; `DesktopScene` Calculator test is flaky and fails some runs, unrelated), `npm run build`. In the browser (Vite on 5179, as 8888 was taken): the feed loads; 60 seeds give 60 different orders; Rihanna's slot opens on `BEYsYojhMyD`, `BDOqIgkhM_D` or `BDOpiTFhM9x`, never `BEbFNVlBM39`; no profile-only or removed post in any feed, its older pages or 4,000 Explore tiles; all 8 profile-only posts are in their grids.
- **Needs from Matthew** (optional; the level is complete without them): larger copies of the 18 photos removed as too small (kim `BEV_UCDuS3u`, messi `BEg3-TgvM0t`, beyonce `BCvlvAbPw0N`, kevinhart4real `BCbvuDBiYjP` `BCLRbnSiYlB`, badgalriri `BC77u1shMwW`, humansofny `BCgWuaitrJz`, theellenshow `BDgbDB6tjFO`, emmawatson `BAhgjIIn3P1`, thefeedfeed `BDx3nO0K8tF`, neymarjr `BE_erv4RthG`, instagram `BERo0ybhQd3` `BEMg_axBQaQ` `BDzMcG3hQSD` `BDrFGFthQe4` `BDeIk6qBQRr` `BCYFKfOBQUi` `BCQWw9nhQTw`). Save one as `archive/<handle>/<code>.jpg` and drop its code from `REMOVED`. Looked in: Wayback CDX for every post page; the archived pages carry only the same small size.

### Website audit · 9 Nov 2026 (overnight run)
- Report: `docs/site-audit.md`, morning summary at the top. Fixes applied 9 Nov 2026 (outcomes in the report); copy items left for the copy pass.
- Originally: nothing fixed. Run on Vite at 5173: Netlify Dev on 8888 answered HTTP 500 "Could not proxy request".
- All six levels finish in any order, Continue and the discovery card lead on (Level 5 → timeline), revisits skip the intro, hints show after 10 s idle (measured on Levels 0, 1, 2, 4). `npm test` and `npm run build` pass; the build warns of a 1.88 MB chunk.
- Top issues: timeline entries and "Back to timeline" aren't keyboard-reachable; Level 4 loads ~6 MB on arrival; one bundle for every level; museum greys under AA contrast; Levels 1, 2, 5 don't call `addArtifact`; intro/discovery copy drifted from the spec; URLs don't route and `/collection` is unreachable; "Reset progress" has no confirmation.
- Awaiting approval: the report's top 10 fixes.

### Level 4: Instagram accounts and photos audit · 9 Nov 2026 (overnight run)
- Report: `docs/feed-audit.md`. No code, data or assets changed. ~1,386 images checked by script (sizes, hashes, near-duplicates) and by eye on labelled contact sheets kept in the scratchpad, not the repo.
- Found 119 findings, 47 marked sure and 72 for Matthew's call: 29 unsuitable for a public portfolio (four nude posts that can reach the home feed), 20 duplicate lines (34 @instagram archive photos that `library/` also hands to other accounts and friends), 15 caption problems (natgeo captions cut at 80 characters, including the feed lead), 12 too small, 12 bad crops, 10 off-account, 8 broken-looking, 8 profile oddities, 5 dated past spring 2016 (22 November-2016 @instagram library photos in Explore; all 11 Glossier posts are 18–22 May 2016).
- Awaiting approval: the report's top 10 fixes.

### Museum: small-screen notice · 9 Nov 2026 (overnight run)
- Built `SmallScreenNotice` (`src/shared/museum-ui/`), mounted once in `SharedLayout.jsx` above everything: under 600px wide it shows the drafted copy; "Continue anyway" dismisses it for the visit (`sessionStorage`, try/catch); widening past 600px hides it. Tests in `src/test/SmallScreenNotice.test.jsx`. Verified in the browser at 375px (shows, covers a level's IntroModal, which appears once dismissed, and stays dismissed after a reload) and 1280px (never shows; widening while open closes it). Spec: open items 1 and 2 and the "notice is planned" line removed; described under Dialog System.
- **Note for Matthew (ambiguity, 9 Nov 2026):** the entry describes IntroModal's card as having a 2px black accent line and a serif title, but IntroModal today has neither (its accent line is 0px tall and its title is the system sans). I followed "reuse IntroModal's card, no new museum-layer patterns" and reused its actual styles, so the notice matches the intro cards. If you want the accent line and serif title, that's a change to IntroModal (and the spec's Museum Layer rules already say both), so every card would follow.
- **Interpretation:** "Resizing past 600px while it's open just closes it" is read as hiding it without recording a dismissal, so narrowing again brings it back.

### Level 1: Mac UI, round 4 · 9 Nov 2026
- Control Panel desktop pattern editor: fat bits (click or drag), a sample desktop, stock patterns from its menu bar, and a click on the sample sets the Mac's desktop pattern. Reconstructed: the stock list and the two clicks.
- Document window chrome measured in Mac pixels from `macsystem100004.png`: title bar, stripes, close box, Chicago title, Geneva 9 bold information line (QuickDraw's one-pixel smear), 16-pixel scroll bars and grow box. **High**.
- Control Panel volume scales the beep, and at 0 a beep flashes the menu bar; Key Caps repeats a held key at the Control Panel's delay and rate (tick counts reconstructed).

### Level 1: Mac UI, round 3 · 8 Nov 2026
- Desk accessories traced pixel by pixel from the screenshots (`scripts/mac-trace/`, `assets/mac/da/`), with live parts on top. **High**.
  - *Calculator* (100012/13): traced window, the held key inverts as in 100013, live Geneva 9 display.
  - *Puzzle* (100016): traced window and 15 tile sprites with their outlined numerals.
  - *Note Pad* (100011): in Apple's bitmap **New York 12**, converted from JohnDDuncanIII/macfonts' FontForge source by a new stdlib script (`sfd2ttf.py`; Matthew's choice; no licence file); the screenshot's text wraps line for line the same. The dog-ear now turns forward and the lower-left corner back, as its own text says.
  - *Alarm Clock* (100006–10): closed and open windows, flag, switch, arrows, rays; live Chicago fields on measured origins; icons reordered clock, calendar, alarm.
  - *Key Caps* (100014) and *Control Panel* (100015) are new and enabled in the Apple menu; menu blinks is wired to the menus.
- Desk accessories take keystrokes only while they are the front window.
- **Reconstructed:** the rdoc close box's pressed look, the alarm switch off position, Key Caps' Option layer and pressed look.

### Level 1: Mac UI, round 2 · 8 Nov 2026
- System Disk and document icons traced pixel by pixel from the screenshots: the 1984 disk from `macsystem100003.png` (the Finder 4.1 disk in `macsystem100017.png` differs), the document from the "Welcome!" file. **High**.
- Icon labels in Apple's bitmap Geneva 9 (`fonts/geneva-9.ttf`, jcs's TrueType conversion of the System 6 bitmap, [jcs/classic-mac-fonts](https://github.com/jcs/classic-mac-fonts), no licence file; Matthew's choice), one font pixel per Mac pixel, in the label box measured from the screenshots. **High**.
- The Notes window's text is in the same Geneva 9 (was Monaco 12), at Matthew's request.
- Menu bar 20 Mac pixels tall (was 30px, about 25), measured from the screenshots, at Matthew's request; Chicago in the bar and menus sized to one font pixel per Mac pixel, menu rows 16 Mac pixels. **High**.
- Dimmed menu items drawn as dotted text (the Menu Manager's gray pattern). Source: Inside Macintosh Vol. I, Menu Manager; no screenshot shows one. **Medium**.
- The Apple menu title already inverted while open; the round-1 note that it didn't came from a misleading cropped screenshot.

### Level 1: Mac UI, round 1 · 8 Nov 2026
- Information line inside the window, ending in a double rule.
- Period scroll bars on every Finder window (`MacScrollBar`, `MacScrollPane`): arrows repeat, track pages, thumb drags as an outline and contents jump on release. No wheel or trackpad scrolling anywhere. Source: Inside Macintosh Vol. I, Control Manager. **High**.
- Working grow box (outline resize); icons don't reflow, so small windows scroll.
- Inactive windows: no stripes, no close box, blank scroll bars.
- Opened icons shaded with QuickDraw dkGray, read from the screenshots. **High**.
- Close box draws the pressed starburst and closes on release.
- **Reconstructed:** repeat timing, line sizes, minimum window size, Notes shading.

### Level 0: power-on bell · 8 Nov 2026
- The VT100's self-test rings the bell during its keyboard check, before the cursor appears. [VT100 Technical Manual §4.2.8](https://vt100.net/docs/vt100-tm/chapter4.html). **High**.
- The bell is ~200 speaker pulses in a row, about **0.25 s** (same manual, §4.4.3). **High**.
- Pitch **787 Hz**, derived from the 1.271 ms keyboard byte time, not measured. **Medium**. An emulator developer got 785 Hz the same way ([terminal-simulator #15](https://github.com/larsbrinkhoff/terminal-simulator/issues/15)).
- Built: `VT_SPEAKER_HZ` = 787 (bell and keyclick); `sfx.bell()` 600 ms into the boot. The CRT thump and hiss were later removed at Matthew's request, so the bell is the only boot sound.
- **Reconstructed:** the 600 ms placement. **Open:** measuring pitch and length from Matthew's video could adjust both.

### Level 4: captions truncated after 3 lines · 8 Nov 2026
- Captions over three lines end in "… more"; tapping expands in place. Same in feed, post detail and profile list.
- Why: 1,075 of 3,113 real captions exceed 125 characters (longest 1,821).
- History: whether spring 2016 truncated is unknown (**low**; Matthew searched at length). Today's app cuts at ~3 lines / 125 chars (**medium**, [textcaret](https://textcaret.com/content/why-is-my-instagram-caption-cut-off), [solsocialmedia](https://www.solsocialmedia.com/post/instagram-caption-length)). Built anyway on Matthew's call.
- **Reconstructed:** the behaviour and the "more" styling (marked in the spec).

### Level 1: 600 Hz startup beep · 8 Nov 2026
- The 128K, 512K and Plus played "a simple square-wave 'beep' generated at 600 Hz". [Wikipedia, Macintosh startup](https://en.wikipedia.org/wiki/Macintosh_startup). **Medium-high**; [Music Thing](https://musicthing.blogspot.com/2005/05/tiny-music-makers-pt-4-mac-startup.html) and [Mactrast](https://www.mactrast.com/?p=57261) agree. The chord came with the Mac II in 1987. **High**.
- Built: `sfx.startupBeep()` as Level 1 boots; the old chime and `mac-chime.mp3` removed. Length set by Matthew to ~1 s (held, 200 ms fade).
- **Reconstructed:** length and volume.
