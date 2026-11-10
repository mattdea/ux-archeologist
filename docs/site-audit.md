# Website audit · 9 Nov 2026

## Morning summary (overnight run, 9 Nov 2026)

**Built:** the small-screen notice (`SmallScreenNotice`, mounted in `SharedLayout.jsx`). Under 600px wide it shows the drafted card over the dark room and above any IntroModal; "Continue anyway" dismisses it for the visit (`sessionStorage`, safe when storage is blocked); widening past 600px hides it. Checked in the browser at 375px and 1280px; `npm test` passes (64 tests, 4 new). Spec open items 1 and 2 are gone and the notice is described under Dialog System.

**Feed audit** (`docs/feed-audit.md`): 119 findings across ~1,386 images, 47 sure and 72 for your call. Headlines:
- Four nude or near-nude posts can reach the home feed (two Kim Kardashian, one Justin Bieber, Cristiano's GQ Body Issue cover).
- 34 @instagram archive photos are also dealt out by `library/` to other accounts, including julia.creates' own post.
- The Warby Parker ad says "Fall frames are here".
- 22 November-2016 photos show in Explore, and all of Glossier's posts are from late May 2016.
- natgeo captions are cut mid-sentence, including the feed lead.

**Website audit** (below): every level can be finished in any order and leads on correctly; tests and build pass. Headlines:
- The timeline's level entries and the HUD's "Back to timeline" can't be reached by keyboard.
- Level 4 downloads ~6 MB of full-size photos before you press Begin.
- One 1.9 MB bundle holds every level.
- Several museum greys fail contrast.
- Levels 1, 2 and 5 don't save their artifact.
- Intro and discovery copy has drifted from the spec in most levels.
- URLs don't route, so `/collection` is unreachable.

**Skipped or interpreted (notes are on the backlog entries):**
- The notice entry describes IntroModal's card as having a 2px accent line and a serif title. The real IntroModal has neither, so the notice reuses its actual styles, per "reuse IntroModal's card".
- "Resizing past 600px just closes it" is taken to mean it hides without counting as a dismissal.
- The audits ran on Vite at 5173, because Netlify Dev on 8888 answers HTTP 500.
- Hint timing wasn't measured on Levels 3 and 5 (both wire it).

**One thing to know:** while testing the notice I cleared the museum's progress (`localStorage`) in the built-in browser pane's copy of the dev site, so I could see a fresh intro. It's only that test browser, not your Chrome or the live site, but it can't be undone there.

## Fixes · 9 Nov 2026

Fixed the same day, one commit each; outcomes are on the top 10 below. Also fixed: Level 0's terminal input is labelled instead of `aria-hidden` (console warning gone); reduced motion drops the timeline and HUD slides; the Mac bezel is fetched on the way to the timeline or Level 1 instead of preloaded for everyone; `yahoo-w-icons.png` is 40 KB (1000px, 256 colours); Level 3's home screen has Text and no Contacts. Left for the copy pass: intro/discovery drift, the discovery button's word, the site name, Level 0's 1971 pipes message, hint wording, "no stylus, no keyboard". Not done: Level 0 type-ahead, Level 2 links in the tab order, the timeline's left-of-centre line, Level 1's 1440×900 placement (all marked low or check). Netlify Dev on 8888 answered 200 on 9 Nov once a fresh `netlify dev` was running, so no config change was made; a stale Vite from 5 Nov was also holding 127.0.0.1:5173 and may have been the cause.

---

Report only: nothing was fixed. Run overnight after the small-screen notice was built, against the Vite dev server on `localhost:5173` (the `.claude/launch.json` server on 8888 is Netlify Dev, and it answered every request with HTTP 500 "Could not proxy request", so the entry's fallback applied). Load weights for code come from `npm run build`; everything else was measured in the browser.

Format: `page · problem · severity · suggested fix`. Widths are viewport CSS px.

## Top 10 fixes

1. Timeline · the six level entries are clickable `div`s with no `tabindex`, role or key handler, so a keyboard user can't start any level from the timeline · **high** · make each entry a `<button>` (or add `role="button"`, `tabIndex=0`, Enter/Space). → **fixed**: entries are `<button>`s with a focus ring.
2. Level 4 · ~6 MB of photos (70 files, largest 393 KB) download the moment the level opens, before "Begin excavation"; the photos are stored up to 1080×1080 for a 375-pt screen · **high** · serve ~750px copies (2× the 375-pt column), lazy-load below the first screen, and defer the feed's images until the intro is dismissed. → **fixed**: photos stored at 750px (127 → 68 MB for the 916 that were larger; `scripts/shrink-feed-photos.sh`), and feed photos load within two screens of view (`useNearScroll`): ~1.1 MB on arrival. Not deferred until Begin, so the boot still fades up on a drawn first post.
3. Every level · "← Back to timeline" in the HUD is a `<span>` with an `onClick`, not focusable · **high** · make it a `<button>` styled as the link. → **fixed**: a `<button>`.
4. Every page · one 1.88 MB JavaScript bundle (647 KB gzipped) holds all six levels, so the title screen downloads every artifact's code · **medium** · lazy-load each level with `React.lazy` / dynamic `import()` (Vite already warns about the chunk size). → **fixed**: each level is a chunk loaded during the fade-out; the main bundle is 209 KB (66 KB gzip). Level 4's chunk is still 1.38 MB (its data), loaded only there.
5. Museum layer · text below WCAG AA contrast (list under each page): timeline years 2.53:1 and titles 3.29:1; About's ✕ and "Curator's Note" 2.32:1; discovery card "Artifact Discovered" 2.32:1 and year 3.54:1; title-screen subtitle 4.22:1 and byline 3.10:1 · **medium** · lift these greys to at least #8a8a8a on #111 and #767676 on white. → **fixed**: #737373 on white, #808080–#8a8a8a on #111; spec tokens updated.
6. Levels 1, 2, 5 · never call `addArtifact()`, so those discoveries aren't saved (Levels 0, 3, 4 do), and the planned collection page would miss them · **medium** · call `addArtifact` in each level's Continue handler, as Level 0 does. → **fixed**.
7. Spec vs build · intro text differs from `design-spec.md` for Levels 0, 1, 2, 3, 5 and discovery text for Levels 0, 1, 2, 3; the discovery button reads "Continue" (spec: "Next excavation"); IntroModal has no visible accent line and a sans title (spec: 2px accent line, serif title) · **medium** · decide which is right in the copy pass, then update the other. → **fixed in the copy pass**, 10 Nov 2026 (`docs/copy-pass.md`): live copy rewritten, spec updated to match; the button stays "Continue" (Matthew's call).
8. Routing · URLs don't route: opening `/level/3` (or any path) shows the title screen, and moving around never changes the address bar, though the spec's Routes table lists `/timeline`, `/level/N`, `/collection`; `/collection` can't be reached at all and is a 4-line placeholder · **medium** · either sync views to the URL (history push + initial read) or drop the table from the spec; decide the collection page (backlog Ideas). → **fixed in the spec**: the routes table is gone; navigation stays state-based. The collection page stays an idea.
9. Timeline · "Reset progress" wipes all progress on one click with no confirmation · **medium** · ask first ("Reset all six levels?") or make it undoable for a few seconds. → **fixed**: "Reset all six levels?" Reset / Cancel.
10. Focus · IntroModal and the discovery card don't move focus to their button, About doesn't move focus into itself (and has no `role="dialog"`), and the HUD's hidden Continue button (opacity 0) stays in the tab order · **medium** · focus the primary button on open, add dialog roles, and `inert`/`tabIndex=-1` the hidden Continue. → **fixed**: IntroModal, DiscoveryCard and About focus their button and are dialogs; About returns focus; the hidden Continue is out of the tab order.

## Checks

- `npm test`: **pass**, 10 files, 64 tests.
- `npm run build`: **pass** (1.89 s), one warning: `index-*.js` is 1,875.61 kB (gzip 646.54 kB) — "Some chunks are larger than 500 kB after minification." `dist/` is 164 MB, 1,393 assets, almost all Level 4 photos (images 161 MB, audio 0.2 MB, fonts 0.35 MB).
- Netlify Dev on 8888 · every request returns HTTP 500 "Could not proxy request" · low (dev only) · check `netlify.toml`'s `[dev]` target port against the Vite port; until then the chat function can't be tested locally.

## Every level can be finished

All six played through from a reset, each with objectives done **out of order** (last one first):

| Level | Objectives any order | Continue | Discovery → next | Revisit skips intro | Hint pill after 10 s idle, hides on completion |
|---|---|---|---|---|---|
| 0 | yes | yes | → Level 1 | yes | appeared at 13 s after Begin (≈3 s boot + 10 s); hid on completion |
| 1 | yes | yes | → Level 2 | yes | 16 s (longer boot); hid |
| 2 | yes | yes | → Level 3 | yes | 16 s; hid |
| 3 | yes | yes | → Level 4 | yes | wired (`useHint` + `HintPill`), timing not measured |
| 4 | yes | yes | → Level 5 | yes | 11 s; hid |
| 5 | yes | yes | → timeline | yes | wired, timing not measured |

Boot replay on revisit: seen for Level 1; the other levels start at `'booting'` on revisit per their code.

## Errors

- Console errors: only `404` for `POST /.netlify/functions/chat` (three, Level 5), expected without Netlify Functions. Level 5 fell back to its scripted replies with no visible error; all three objectives completed.
- Console warnings:
  - Every page · "MonitorBezel@2x.webp was preloaded using link preload but not used within a few seconds" — `src/main.jsx` preloads the 243 KB Mac bezel for every visitor · low · preload it only when the timeline or Level 1 mounts, or accept the warning.
  - Level 0 · "Blocked aria-hidden on an element because its descendant retained focus" — the terminal's hidden `<input>` carries `aria-hidden` while focused · medium · drop `aria-hidden` from the input (give it an `aria-label` like "Terminal input") or use `inert` on what should be hidden.
- No failed image, font or sound requests seen.

## Load weight

JavaScript and CSS are one bundle for every page (production: JS 1.88 MB / 647 KB gzip, CSS 143 KB / 26 KB gzip). On top of that, what each page fetches on first visit (encoded sizes, from Resource Timing):

| Page | Images | Fonts | Audio | Largest files |
|---|---|---|---|---|
| Title | ~52 KB | — | — | (small SVGs) |
| Timeline | — | — | — | — |
| Level 0 | 28 KB | — | — | `badge.svg` 28 KB |
| Level 1 | ~1 KB (+243 KB bezel, preloaded at start) | 61 KB | — | `geneva-9.ttf` 55 KB, `MonitorBezel@2x.webp` 243 KB |
| Level 2 | 322 KB | 8 KB | 193 KB | `yahoo-w-icons.png` 194 KB, `dialup.mp3` 193 KB, `banner-ad.png` 83 KB |
| Level 3 | 163 KB | — | — | `ios-rain-wallpaper.jpg` 148 KB |
| Level 4 | **~5.98 MB** on arrival, more while scrolling | 90 KB | — | `BD4HM9goaEZ.jpg` 393 KB, `BDcFKULgvlW.jpg` 335 KB, `2016-03-27_esposin_o4pcon1.jpg` 271 KB |
| Level 5 | — | — | — | — |

- Level 2 · `yahoo-w-icons.png` is 194 KB for a small strip of icons · low · re-encode (PNG-8 / WebP).

## Accessibility basics (museum layer)

- `prefers-reduced-motion`: the tracker, Continue flourish, hint pill and tooltips honour it; the **timeline entries** still slide up 15px (`entryIn`) and the **HUD corners** still slide 20px (inline `translateY` in `SharedLayout.jsx`) · low · drop the translate under reduced motion (fades are fine).
- No `<img>` without `alt` and no unnamed buttons found in the museum layer.
- Progress dots: real buttons with labels and focus tooltips — good.

## Title screen

- Title · subtitle "Explore how interfaces evolved through the decades." #777 on #111 = 4.22:1 at 14px · medium · lighten to ≥ #808080.
- Title · "A project by Matthew Dea" #626262 on #111 = 3.10:1 at 13px, bottom centre at every width · medium · lighten.
- About modal · ✕ and "Curator's Note" #aaa on white = 2.32:1; "Built with React + Vite." #999 = 2.85:1 · medium · darken to ≥ #767676.
- About modal · no `role="dialog"`/`aria-modal`, focus stays on the page behind when it opens (Escape does close it) · low · add roles and focus the ✕ or the card.
- 1440 / 1280 / 1024 · layout clean, no horizontal scroll.

## Timeline

- Timeline · entries not keyboard-reachable (see top 10, #1) · high.
- Timeline · unvisited years #555 on #111 = 2.53:1 at 13px and titles #666 = 3.29:1 at 16px, at every width · medium · lighten (visited entries are brighter).
- Timeline · "Reset progress" with no confirmation · medium.
- Timeline · the line and entries sit left of centre (line at ~39% of the width at 1440, ~35% at 1024) · low (check) · confirm it's intended; the rest of the museum centres.
- 1440 / 1280 / 1024 · no overlaps or horizontal scroll.

## Levels (all)

- HUD · "← Back to timeline" not focusable (top 10, #3) · high.
- HUD · invisible Continue stays focusable (top 10, #10) · medium.
- IntroModal · "Begin excavation" isn't focused on open · low.
- Discovery card · "Artifact Discovered" #aaa on white = 2.32:1 at 10px; the year #888 = 3.54:1 at 17px · medium.
- Discovery card · its button says "Continue", the same word as the HUD's Continue that opened it · low · "Next excavation" (as the spec has it) or name the next room.
- Layout · at 1024×768 every artifact is centred with 32px above and below (Levels 0–2) or beside the bottom HUD (Levels 3–4), no overlaps, no horizontal scroll.
- Layout · Level 1 at 1440×900: the Mac sits 39px under the top band but 133px above the bottom edge, its bottom edge level with the top of the objectives tracker (bottom-left), so it looks pushed up · low (check) · the spec says gap above = gap below beside the bottom HUD; check `useArtifactFit` for the Mac's case. At 1280×800 it measures 52px above / 32px to the tracker.

## Level 0 · 1971

- Intro text differs from the spec ("This is a VT100 terminal connected to a Unix mainframe…" vs "Before icons, windows, or the web, there was a conversation…"); discovery text differs too · medium · reconcile in the copy pass.
- Keys typed while the terminal is still printing a reply are dropped (typed `mail` 2 s after `man ls` while the page was still printing; nothing appeared) · low (check) · buffer keystrokes during output, as a real terminal's type-ahead did.
- Console warning: aria-hidden on the focused input (see Errors) · medium.
- (Aside, content) the notes file is a 1971 message about pipe behaviour; Unix pipes arrived in Version 3, 1973 (**high**, widely documented) · low · re-date the message or change its subject.

## Level 1 · 1984

- Intro and discovery text differ from the spec · medium.
- Doesn't call `addArtifact` · medium.

## Level 2 · 1995

- Intro and discovery text differ from the spec · medium.
- Doesn't call `addArtifact` · medium.
- The page's links are `<span>`s outside the tab order (artifact layer; not a museum control) · low · fine for authenticity, but a keyboard visitor can't finish the level.

## Level 3 · 2007

- Intro and discovery text differ from the spec · medium.
- Home screen page 1 shows **Messages** and **Contacts** (13 icons; the spec says 12 + 4 in the dock). At the June 2007 launch the SMS app was "Text" and Contacts wasn't on the home screen (backlog guardrail "only the June 2007 launch apps", **high**) · low · rename to Text, drop Contacts.

## Level 4 · 2016

- Load weight (top 10, #2) · high.
- Intro and discovery text match the spec.

## Level 5 · 2023

- Intro text differs from the spec · medium.
- Doesn't call `addArtifact` · medium.
- The curator introduces the site as "UX Archaeologist" ("This is UX Archaeologist, an interactive history…") while the title screen, browser tab and About all say "Interface Artifacts" · low · pick one name (copy pass).
- API unreachable → scripted fallback, no error shown: works.

## Collection

- Not reachable from anywhere (no link, and URLs don't route); renders the unstyled text "Collection — placeholder" · low · decide the page (backlog "Collection page") or remove it from the spec's routes.

## Small-screen notice (375 wide)

- Shows on arrival under 600px over the dark room, covers a level's IntroModal (which appears after "Continue anyway"), stays dismissed after a reload in the same visit, never shows at 1024+ and closes when the window widens past 600px. Button is focused on open. No problems found.
- Note: the card follows IntroModal's real styles (no accent line, sans title); see the backlog entry's note.

## Copy (flag only)

- Name: "Interface Artifacts" (title, tab, About) vs "UX Archaeologist" (spec, Level 5's curator).
- Hints use "Tap" on mouse-driven screens (Levels 3, 4: "Tap a name to open a profile, then tap Follow"; Level 5) and Level 0 uses double spaces for emphasis ("Try typing  ls  to see…") — already listed in the backlog's hints item.
- Level 3 intro: "There's no stylus, no keyboard" — the iPhone had an on-screen keyboard; "no physical keyboard" would be exact.
- Spec "Progress" still says "all 46 tests pass"; there are 64.
