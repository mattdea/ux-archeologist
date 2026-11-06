# Level 4 feed photo sources

Every image here is a real photo from Instagram's 2015 to spring 2016 era (blue-header UI),
cropped from period screenshots. Not my photos; used for a non-commercial portfolio piece.
Source screenshots live in `docs/reference/`.

| File | Source | Original account / context |
| --- | --- | --- |
| `avatar-studio-light.jpg` | `docs/reference/instagram4.png`, grid row 1 col 3 | @tophersaranghelo profile, c. 2015 |
| `avatar-nadia-s.jpg` | `instagram4.png`, row 1 col 2 | @tophersaranghelo |
| `avatar-city-frames.jpg` | `instagram4.png`, row 2 col 2 | @tophersaranghelo |
| `avatar-bakes-and-more.jpg` | `instagram4.png`, row 2 col 3 | @tophersaranghelo |
| `avatar-outdoor-vibes.jpg` | `instagram4.png`, row 3 col 2 | @tophersaranghelo |
| `avatar-marcus-h.jpg` | `docs/reference/instagram5.png`, profile picture | @kgonzalezrice profile, c. 2015 |
| `avatar-julia-creates.jpg` | `instagram5.png`, row 1 col 1 | @kgonzalezrice |
| `avatar-mike-film.jpg` | `instagram5.png`, row 2 col 1 | @kgonzalezrice |
| `avatar-home-spaces.jpg` | `instagram5.png`, row 2 col 2 | @kgonzalezrice |
| `avatar-lens-folk.jpg` | `instagram5.png`, row 2 col 3 | @kgonzalezrice |
| `period/post-tieks-dog.jpg` (528px) | `docs/reference/instagram1.jpeg` | @tieks sponsored post, Instagram ad launch marketing, 2015 |
| `period/post-golden-gate.jpg` (250×141) | `docs/reference/instagram2.jpeg` | @ashleyyuki, Instagram landscape/portrait format announcement, Aug 2015 |
| `period/post-palm-trees.jpg` (250×289) | `instagram2.jpeg` | @johnbarnett, same announcement |

`period/` is not loaded by the feed (feedData.js only reads `assets/feed/*.jpg`). These are
candidates that don't match an existing slot; wiring one in means changing a `photo` filename
in feedData.js.

## `explore/` — grid tiles for the Explore tab, profiles, and activity thumbnails

47 square tiles cropped from the grids in the reference screenshots (loaded by
`EXPLORE_IMAGES` in feedData.js, sorted by filename). Numbers below are the tile's
position in the source screenshot.

| Files | Source | Context |
| --- | --- | --- |
| `explore-01` – `06` | `instagram3.png`, right screen (TRENDING PLACES) | Firefly Festival / Santa Cruz Boardwalk tiles, 2015 |
| `explore-07` – `15` | `instagram3.png`, middle screen (#startofsummer) | Top Posts row + Most Recent grid, 2015 |
| `explore-16` – `24` | `instagram4.png`, rows 1–3 | @tophersaranghelo profile grid, c. 2015 |
| `explore-25` – `30` | `instagram5.png`, rows 1–2 | @kgonzalezrice profile grid, c. 2015 |
| `explore-31` – `39` | `instagram6.jpeg`, left ("old") screen | Photos tab grid, June 2015 |
| `explore-40` – `42` | `instagram6.jpeg`, right ("new") screen | Explore Posts grid, June 2015 |
| `explore-43` – `44` | `instagram6.jpeg`, right screen | #nationalpink, #olympicday trending thumbnails |
| `explore-45` – `47` | `instagram7.jpg` | Explore Posts grid, 2015 |
