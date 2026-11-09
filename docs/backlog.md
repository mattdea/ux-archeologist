# Backlog

## Ideas

_Proposals only. Nothing is ever built from this section. Historical claims carry a source and a confidence level (high / medium / low). The design spec's museum-layer rules (fades only, "the museum is still", and so on) don't limit ideas here; when an idea that breaks one is approved, the spec is updated to match._

_Items from Matthew's list of 8 Nov 2026 are in no particular order or priority. Each records the request, what exists today and anything that must be decided before it can move to Approved._

### Museum: small-screen notice

**Request:** tell phone-width visitors the exhibit is best on a computer.

**Today:** already open item 2 in the design spec's Progress list; phone widths are not a target and the artifact just shrinks to fit.

**To decide:** the breakpoint (width only, or width and touch), whether the notice blocks entry or can be dismissed ("Continue anyway"), and where it shows (title screen only, or every route). It is museum layer: white card with the 2px accent line, like IntroModal.

### Museum: carry the year from the timeline into the level

**Request:** the timeline's year label and the HUD's top-left era label share a typeface. As the level fades in, the year slides from its timeline position to the corner (a shared-element move), tying the two screens together more than the plain crossfade does.

**To decide:** the reverse move on "Back to timeline"; what happens on routes that don't come from the timeline (progress dots, Next excavation, a direct URL) — probably plain fade; behaviour under `prefers-reduced-motion` (plain fade). Touches `Timeline.jsx` and `SharedLayout.jsx` (fade navigation).

### Museum: a "start here" cue on the timeline

**Request:** an indication on the timeline, such as a pulsing arrow at the first level saying "Start here", or "Explore other levels" once some are done.

**To decide:** the copy for each state (nothing done → "Start here" at 1971; some done → point at the first unfinished level?; all done → nothing, or a link to the collection); whether it disappears after the first click.

### Museum: copy pass across the app

**Request:** work on the copy throughout.

**Surfaces:** title screen ("Enter the exhibit"), About modal, timeline, six IntroModals, six DiscoveryCards, HUD dot tooltips, objective wording, hints (own item below), Level 5 suggestion chips and fallbacks. Current IntroModal and DiscoveryCard text is in the design spec under each level.

**Noticed:** IntroModal descriptions differ in voice and length — Level 1's is instructional ("Explore the interface and complete the objectives…") while the others are evocative one-liners; Level 4's DiscoveryCard is about twice the length of the rest. The spec's DiscoveryCard entry still says the button goes to `/timeline`; it now goes to the next level.

**To decide:** one surface at a time, or all at once; whether to write a short voice guide for the curator first (Level 5's persona already describes it: "slightly formal, warm, knowledgeable").

### Museum: build the collection page

**Request:** add a collection page?

**Today:** the `/collection` route exists and the spec calls it the "full artifact collection / shareable finale", but `src/pages/Collection.jsx` is a four-line placeholder and nothing links to it. `addArtifact({ name, era, description })` already records each discovery in localStorage.

**To decide:** what it shows (the six discovered artifacts as cards; locked ones as outlines?), how it's reached (after Level 5's discovery instead of `/timeline`, a HUD link, the timeline), and whether "shareable" means anything beyond a nice page (an image, a link). Changing Level 5's `nextUrl` reverses the 8 Nov decision that it goes to `/timeline`.

### Museum + artifacts: more motion and transitions

**Request:** add more motion and transitions.

**Today:** the museum layer mostly fades (300ms); the tracker slides up and the Continue button rises with a slight overshoot. The spec lists each level's artifact motion under Animation Rules.

**To decide:** which specific moments. Candidates: the year move above; the timeline's entry; modals opening and closing; IntroModal → boot hand-off; the discovery card's arrival. Each would be its own item.

### Level 1: Mac UI updates and more features

**Request:** make UI updates to the Mac and add more features.

**Source of truth:** `docs/reference/mac system 1/` — 18 screenshots Matthew took of System 1 running on infinitemac.org (8 Nov 2026). Where they disagree with the current build, the 1984 manual or anything else in the spec, the screenshots win. Start by comparing each one against the matching state of Level 1 and listing every difference (layout, pixel details, wording, menus, windows, behaviour); that list is the UI-update work. They may also settle the details the spec marks as reconstructed (zoom-rect frames, menu-blink timing, Empty Trash alert wording, Clean Up); update the spec where they do.

**Candidates already in the period:** the dimmed Apple-menu items — Scrapbook, Key Caps, Control Panel — are real Finder 1.1 desk accessories (spec, Level 1); Show Clipboard. Everything must be something Finder 1.0/1.1 did (CLAUDE.md, Level 1 conventions); check the screenshots' About box for which System/Finder version they show, since the level depicts Finder 1.1.

**To decide:** after the difference list, which fixes and which features first.

### Level 2: more Netscape pages, or a search with fake results

**Request:** make more pages clickable, or add a search feature that pulls up "fake" pages in a list of results.

**Note:** the level's thesis is "The early web wasn't searched. It was browsed" (DiscoveryCard). A working search box would argue against it — unless search is shown as period-accurate and thin (a directory search over a few listings), which could make the point instead.

**History, to verify before building:**
- Navigator had **Net Search** and **Net Directory** buttons; in Feb 1995 Net Directory listed Yahoo. Confidence **medium**: [W3C www-vlib list, Feb 1995](https://lists.w3.org/Archives/Public/www-vlib/1995Feb/0003.html); [savetz.com, "Secrets of the Search Button"](https://www.savetz.com/articles/warssearch.html) (later era).
- The Net Search page later carried Lycos / Yahoo / Excite / Infoseek tabs, and Infoseek became Netscape's default engine in Dec 1995. Confidence **medium** for the deal ([USC search-engine lecture](https://bytes.usc.edu/cs572/f24-srch/lectures/SEBasics/SearchEngineBasics.pdf)), **low** for what the page looked like in 1995 — no 1995 screenshot found.
- Yahoo's 1995 homepage had a search box over its own directory. Confidence **medium**, not yet sourced.

**To decide:** more pages vs search (or both); which links lead somewhere; whether search results stay inside the four-site world or invent new sites.

### Level 2: higher-fidelity Netscape chrome

**Request:** improve the Netscape UI for fidelity and accuracy.

**To decide first:** which Navigator version and platform the level depicts. The throbber is Navigator 1.1 onward and the cursors are Windows 95 (Win95 shipped Aug 1995). Gather dated reference screenshots of that version into `docs/reference/` (as Level 4 did) and list the differences before changing anything.

### Level 3: more iPhone apps and features

**Request:** add more iPhone apps and build out features; today only Notes opens.

**History:** the June 2007 iPhone shipped with Text, Calendar, Photos, Camera, YouTube, Stocks, Maps, Weather, Clock, Calculator, Notes, Settings, and Phone / Mail / Safari / iPod in the dock; there was no App Store until July 2008. Confidence **high** (widely documented; add a source, e.g. Apple's 9 Jan 2007 press release, when this is approved). So: only those apps, no third-party ones.

**To decide:** which apps first (Calculator, Clock, Weather and Photos are self-contained; Maps, Safari and YouTube need fake content), and whether any becomes an objective.

### Level 4: more Instagram screens and features

**Request:** build out more Instagram screens and features.

**Era guardrail:** the feed is spring 2016, before the May 2016 redesign. Stories (Aug 2016) and the white redesign are out of era. Confidence **high** that Stories launched in August 2016 (add Instagram's announcement as the source). Direct (revamped Sept 2015, Instagram blog announcement of 1 Sep 2015) is in era.

**To decide:** which screens. Candidates: the comments view, Direct inbox, the camera tab, a hashtag page from Explore's TRENDING TAGS, Edit Profile. Each needs dated reference screenshots in `docs/reference/` first, as the existing screens had.

### Hints: rework the feature and audit the copy

**Request:** work on the hints feature and audit the current hints.

**Current hints** (one per objective, shown after 10s without progress):
- L0: "Try typing  ls  to see what files are here, then  cat  one of them" · "Try typing  mail" · "Try typing  man  followed by a command, like  man ls"
- L1: "Double-click the Notes icon" · "Drag the Projects folder onto the Trash" · "Click File in the menu bar at the top of the screen"
- L2: "Click any underlined link" · "Use the Back button in the toolbar" · "Look under Computers and Internet for an archive of old machines"
- L3: "Drag the arrow all the way to the right" · "Tap the Notes icon on the home screen" · "Drag the home screen to the left to see the next page"
- L4: "Scroll the feed until you find Imani Brooks, then double-tap her photo" · "Find a post marked Sponsored and tap its Learn More button" · "Tap a name to open a profile, then tap Follow"
- L5: "Tap one of the suggestions, or type a question and press Enter" · "Ask about something the curator just said" · "Tap the circular arrow under a reply"

**Noticed:** `useHint` only ever hints the *first* unfinished objective, though every level completes in any order. L1's first hint predates the System Disk (spec open item 7). L3 and L5 say "Tap" on a mouse-driven screen; L4 says "Tap" too (fine — it's a phone). L0 uses double spaces around commands as emphasis. Mixed address: some name the control, some describe the goal.

**To decide:** feature changes (escalating hints — a nudge first, then the exact step; a way to ask for a hint; which objective it picks), and a house style for hint copy.

### Level 4: audit the Instagram accounts and photos

**Request:** go through the accounts and make sure they make sense and there are no weird photos.

**Scope:** the 18 real accounts in `FEED`, their full grids from `assets/feed/archive/` and `assets/feed/library/`, the four friends, the ads and Explore's grid. Check: photos that are broken, off-topic, duplicated across accounts, or unsuitable; captions that don't match their photo; bios and counts that read oddly. Recent commits already pruned and reordered marcus.h's and cristiano's grids.

**Output:** a list per account of what to remove or reorder, for Matthew to approve before anything changes.

## Approved

_Matthew moves items here from Ideas. Unattended runs build only from this list; ambiguous items are skipped with a note._

### Level 4: truncate long captions after 3 lines (approved 8 Nov 2026)

**Build:** a caption longer than three lines is cut at three lines and ends in "… more"; tapping it expands the full caption in place.

**Why:** captions render in full today. 1,075 of the 3,113 real captions in `assets/feed/archive/*/profile.json` exceed 125 characters, the longest 1,821 (voguemagazine), so one post can run for screens.

**History:** unsettled. Matthew searched at length and found no 2015–16 screenshot of a caption longer than three lines, so whether the spring-2016 app truncated is unknown (confidence **low**). Today's app cuts at about 3 lines / 125 characters (confidence **medium**, third-party guides: [textcaret](https://textcaret.com/content/why-is-my-instagram-caption-cut-off), [solsocialmedia](https://www.solsocialmedia.com/post/instagram-caption-length)). Matthew's decision: truncate after 3 lines anyway. Mark it **reconstructed** in the design spec, with the "more" styling.

**How (touch only `Post.jsx` and `feed-styles.css`):**
- `.captionLine` gets a clamp class while not expanded: `max-height: 48px` (3 × the 16px line height) and `overflow: hidden`, `position: relative`. Don't use `-webkit-line-clamp`: its own ellipsis would sit under the "more".
- Measure with a ref: the caption is clamped when `scrollHeight > clientHeight`. Re-check with a `ResizeObserver`, because a post that first lays out hidden measures 0.
- When clamped, overlay `… more` at the bottom right of the third line: white background with a ~20px fade to the left so no glyph is cut visibly; "…" in `--ig-text`, "more" in `--ig-muted` (the "View all N comments" grey), 13px.
- Tapping "more" or the caption text expands it (drop the clamp class); the username keeps opening the profile (it already stops propagation). Expanded stays expanded for that post.
- Drags must not expand: `useDragScroll` already never turns a drag into a tap, so a plain `onClick` is enough.
- Same behaviour in the feed, post detail and profile list views (they all render `Post`).
- Spec: add the behaviour to Level 4's Interactive Elements, marked reconstructed.


## Done

_Finished items, moved here when built._

### Level 1: the 1984 startup beep (approved and built 8 Nov 2026)

**Build:** replace Level 1's startup chime with the beep the original Mac made, not the later chord.

**Source (Matthew's pick):** Wikipedia, [Macintosh startup](https://en.wikipedia.org/wiki/Macintosh_startup): the first three Macintosh models (128K, 512K, Plus) used "a simple square-wave 'beep' generated at 600 Hz", programmed in software by Andy Hertzfeld. Confidence **medium-high**; [Music Thing](https://musicthing.blogspot.com/2005/05/tiny-music-makers-pt-4-mac-startup.html) and [Mactrast](https://www.mactrast.com/?p=57261) agree it was a beep, and Mactrast says Charlie Kellner reworked its waveform. The chord came later, with the Macintosh II in 1987 (confidence **high**).

**How:**
- In `src/audio/sfx.js`, add `startupBeep()`: a 600 Hz square wave through the existing `tone()` helper, with the same envelope as `beep()` (the system beep, 880 Hz, stays as it is).
- In `src/levels/Level1.jsx`, call `sfx.startupBeep()` where `sfx.chime()` is called today (as `screen` becomes `'booting'`, replays too).
- Remove `chime()` and `assets/mac-chime.mp3` if nothing else uses them.
- Update the design spec: the Sound section and Progress line ("Mac chime (0.22)") say a 600 Hz startup beep; mark its length and volume as reconstructed (no source gives them).

**Not settled, so don't guess past it:** the beep's exact length. Use `beep()`'s envelope unless a recording of a real 128K/512K boot turns up.

**Built:** `sfx.startupBeep()` (600 Hz square) plays as Level 1 boots; `chime()` and `assets/mac-chime.mp3` removed; the spec's Sound section and Progress line updated. First built with `beep()`'s ~175 ms envelope; Matthew then set the length to about 1 s (held, 200 ms fade). Level still reconstructed.
