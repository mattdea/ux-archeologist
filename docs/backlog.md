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
| 5. Museum restyle | Round 2: B, and B with E's grid | Approval of round 2 |

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

Phase 1, the style lab, is built (see Done, 10 Nov 2026). Open `/style-lab` on the dev server, or the screenshots in `docs/style-lab/`.

- **Why:** Matthew wants the museum to look more like the personal sites he's been collecting: crude, unfinished, typographic, plain, sometimes silly. Nothing in the game changes until a direction is picked.
- **Scope:** the museum layer only: the title, timeline, collection, About, HUD (back link, era label, Continue), IntroModal, ObjectiveTracker, HintPill, DiscoveryCard and the small-screen notice. The artifacts keep their exact period look. The museum still has to read as the frame, not as another artifact. Watch this next to the 1995 Netscape level especially.
- **Phase 2:** Matthew picks one direction or a mix.
  - **Matthew's read (10 Nov 2026):**
    - **B (index):** his favourite. He likes the monospace list, the grid it sits on, the highlighted (inverted) row, and how simple it is.
    - **E (specimen sheet):** he likes the direction, but each row shows the same room three times: the illustrated picture, the drawn picture and the card, which has the picture on it again. One picture per room.
    - **D (colour field):** he likes it, but it feels derivative. Dropped.
    - **A, C, F:** not picked.
  - **Proposed round 2 (still in the lab, nothing in the game changes):**
    - **B2, B refined:** the same four screens. The collection cards are redrawn in B's terms (monospace, 1px rules, no shadows or rounded corners), because the current cream cards with shadows sit oddly next to the list. B's level frame goes from desktop to phone width with the list above the artifact.
    - **B+E:** B's list stays as the frame and the HUD. Where pictures appear (timeline, collection, discovery), they sit in E's numbered grid with tiny captions, one picture per room in the chosen art set.
    - **Watch:** in B the list is the HUD, so the intro card, objective tracker, hint and discovery card all become rows in it. That's a bigger change to the museum than a reskin: it touches every level's wiring. Round 2 should show it in two levels (one wide artifact, the Mac; one tall, the iPhone) to check `useArtifactFit` still places the artifact well beside or below the list.
    - **Decide on approval:** whether both variants or B2 only.
- **Phase 3 (needs its own approval):**
  - Set up museum tokens on `:root` and restyle one component per commit.
  - Align the collection cards and card lab with the new style.
  - Rewrite the spec's museum section.
  - Delete the lab or keep it.
- **Rules that held for every concept, and should hold for the restyle:** system fonts only (Times, Helvetica/Arial, ui-monospace); no shadows, rounded corners or gradients unless the direction calls for them; WCAG AA contrast, visible focus, everything by keyboard, no motion under reduced motion; copy stays as it is.

---

## Approved

Nothing waiting.

---

## Done

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
