# Level 4 Feed Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Level 4's bloated 44-post feed with a 24-post ranked feed of recognisable accounts, rename the target friend to Imani Brooks with committed Unsplash photos, drop the 10 May 2016 date cutoff, and label dates by position so everything reads recent.

**Architecture:** All content lives in three data modules under `src/components/feed/`: `archiveData.js` (Wayback-recovered real accounts), `libraryData.js` (Instagram-blog photos and the invented friends' photo sets) and `feedData.js` (the feed, profiles, Explore and Activity). The feed becomes an explicit `FEED_ORDER` list of usernames with a parallel `FEED_TIMES` list; profile grids label tiles by index. Imani's photos are ordinary ES imports from a new committed folder `assets/feed/imani/`.

**Tech Stack:** React 18 + Vite, vitest (`npm test`), ImageMagick `magick` for cropping. Spec: `docs/superpowers/specs/2026-11-06-level4-feed-redesign-design.md`.

**Conventions from CLAUDE.md:** one change per commit, test between each, `git add` the files you touched then commit and push. Everything under `assets/feed/*.jpg` and the `archive/`, `library/`, `profiles/` folders is gitignored and local-only; `assets/feed/imani/` is the one exception and **is committed**. Never `git add -f` the gitignored folders. The dev server is `preview_start {name: "dev"}` on port 8888 (`netlify dev`); another chat may already hold that port, in which case use its http://localhost:8888/ directly.

**Commit trailer:** end every commit message with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## File map

| File | Responsibility | Change |
| --- | --- | --- |
| `assets/feed/imani/{avatar,post,grid-01…grid-20}.jpg` | Imani's committed Unsplash photos | create |
| `src/components/feed/archiveData.js` | real accounts from the archive | remove date cutoff; `gridTime(i)` replaces `relativeTime` |
| `src/components/feed/libraryData.js` | blog photos, friend photo sets | remove `CUTOFF`; `FRIEND_SETS` trimmed to 3 friends |
| `src/components/feed/feedData.js` | feed, profiles, activity | Imani; 6 `BASE_POSTS`; `FEED_ORDER` + `FEED_TIMES`; activity rows |
| `src/levels/Level4.jsx` | objectives text | "Find Imani's post — she has news" |
| `src/test/feedData.test.js` | feed invariants | create |
| `src/test/archiveData.test.js` | `gridTime` ladder | create |
| `docs/design-spec.md`, `assets/feed/README.md` | docs | Level 4 section, README notes |

---

### Task 1: Imani's photos

**Files:**
- Create: `assets/feed/imani/avatar.jpg`, `assets/feed/imani/post.jpg`, `assets/feed/imani/grid-01.jpg` … `assets/feed/imani/grid-20.jpg`

Sources:
- The user saved 22 full-size Unsplash downloads by @aliounepic in
  `assets/feed/profiles/imani brooks/` (note the space in the folder name;
  quote the path). Files are named `alioune-seye-<id>-unsplash.jpg`.
- The post is `alioune-seye-Hp2PFbBdg4w-unsplash.jpg` (3000×2090, woman in a
  checkered dress on a sofa in a red room).
- Leave out `alioune-seye-lZMZO-CCOqA-unsplash.jpg` (a portrait of children).
- The avatar photo (Unsplash id `XQBcBGWvxF4`, a smiling woman with striped
  shadows, 1080×1620) is **not** in that folder. It is in the session
  scratchpad at `/private/tmp/claude-501/-Users-matthewdea--claude-spares-spare-W9PGUo/f845af63-498c-4809-a0f9-8d52541b9e72/scratchpad/unsplash/XQBcBGWvxF4.jpg`.
  If that file is gone, re-download it into a fresh empty directory with
  plain curl (no custom User-Agent):
  `curl -sL -o XQBcBGWvxF4.jpg "https://unsplash.com/photos/XQBcBGWvxF4/download?force=true&w=1080"`.

- [ ] **Step 1: Crop and save into the repo**

Feed photos are square. Grid photos are centre-cropped; the avatar is cropped on the face (upper-middle of the portrait).

```bash
cd /Users/matthewdea/Code/ux-archeologist
mkdir -p assets/feed/imani
SRC="assets/feed/profiles/imani brooks"
AV=/private/tmp/claude-501/-Users-matthewdea--claude-spares-spare-W9PGUo/f845af63-498c-4809-a0f9-8d52541b9e72/scratchpad/unsplash/XQBcBGWvxF4.jpg
magick "$AV" -gravity north -crop 1080x1080+0+180 +repage -resize 320x320 -quality 85 assets/feed/imani/avatar.jpg
magick "$SRC/alioune-seye-Hp2PFbBdg4w-unsplash.jpg" -resize 750x750^ -gravity center -extent 750x750 -quality 85 assets/feed/imani/post.jpg
i=0
for f in "$SRC"/alioune-seye-*-unsplash.jpg; do
  case "$f" in *Hp2PFbBdg4w*|*lZMZO-CCOqA*) continue;; esac
  i=$((i+1))
  magick "$f" -resize 750x750^ -gravity center -extent 750x750 -quality 85 "$(printf 'assets/feed/imani/grid-%02d.jpg' $i)"
done
echo "grid photos: $i"
magick identify assets/feed/imani/*.jpg | awk '{print $1, $3}'
```
Expected: `grid photos: 20`; `avatar.jpg 320x320`; `post.jpg` and `grid-01.jpg` … `grid-20.jpg` all `750x750`; 22 files in total.

- [ ] **Step 2: Check the crops**

```bash
S=/private/tmp/claude-501/-Users-matthewdea--claude-spares-spare-W9PGUo/f845af63-498c-4809-a0f9-8d52541b9e72/scratchpad
magick montage -font /System/Library/Fonts/Supplemental/Arial.ttf -label '%f' assets/feed/imani/*.jpg -tile 6x -geometry 200x200+4+4 -pointsize 14 "$S/imani_crops.jpg"
```
Open `$S/imani_crops.jpg` with the Read tool. The avatar must be centred on the face (adjust the `+0+180` offset if not); the post must keep the woman and the painting above her; no grid photo may have its subject's head cut off. For any tall portrait that does, re-run that one file with `-gravity north` instead of `center` and check again.

- [ ] **Step 3: Confirm they are not gitignored, then commit**

```bash
git check-ignore -v assets/feed/imani/post.jpg; echo "exit $?"
```
Expected: no output and `exit 1` (not ignored). Then:

```bash
git add assets/feed/imani
git commit -m "feat(level4): Imani Brooks's photos from Unsplash (@aliounepic, Unsplash License)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 2: archiveData — no cutoff, position-based grid labels

**Files:**
- Modify: `src/components/feed/archiveData.js`
- Create: `src/test/archiveData.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/test/archiveData.test.js`:

```js
// src/test/archiveData.test.js
import { gridTime } from '../components/feed/archiveData'

describe('gridTime', () => {
  it('labels the first row as hours and days', () => {
    expect([0, 1, 2].map(gridTime)).toEqual(['3h', '1d', '2d'])
  })
  it('walks the ladder through days into weeks', () => {
    expect([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(gridTime))
      .toEqual(['4d', '6d', '1w', '1w', '2w', '2w', '3w', '3w', '4w', '5w'])
  })
  it('keeps counting weeks past the ladder', () => {
    expect(gridTime(13)).toBe('6w')
    expect(gridTime(47)).toBe('40w')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/test/archiveData.test.js`
Expected: FAIL — `gridTime` is not exported (`undefined is not a function`).

- [ ] **Step 3: Implement**

In `src/components/feed/archiveData.js`:

Replace lines 26–30 (the `LEVEL_NOW` comment block and export) with:

```js
// Dates are not filtered: every archived post with a photo loads, whatever
// its real date. The feed and grids label posts by position (gridTime,
// FEED_TIMES in feedData.js), not by real age, so the level always reads
// as "today" however old the captures are.
```

Change the `.filter` in the `ARCHIVE` builder from

```js
      .filter(p => p.file && p.date <= LEVEL_NOW)
```
to
```js
      .filter(p => p.file)
```

Replace the block from `// "Now" for relative timestamps …` through the end of `relativeTime` (lines 76–87) with:

```js
// Grid labels by position, so any grid reads newest-first: the top row is
// hours and days, then days, then weeks.
const GRID_LADDER = ['3h', '1d', '2d', '4d', '6d', '1w', '1w', '2w', '2w', '3w', '3w', '4w', '5w']

/** 2016 short timestamp for the post at grid index i (0 = newest). */
export function gridTime(i) {
  return GRID_LADDER[i] || `${i - 7}w`
}
```

In `archivePost`, change

```js
    timestamp: relativeTime(p.date),
```
to
```js
    timestamp: gridTime(index),
```

Update the file's header comment (lines 2–11) by appending one line: `// No date cutoff: everything in the folder loads.` Leave `date` on each post object; nothing reads it now but the data is real and harmless.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/test/archiveData.test.js`
Expected: 3 passed.

Run: `grep -rn "LEVEL_NOW\|ARCHIVE_NOW\|relativeTime" src`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/feed/archiveData.js src/test/archiveData.test.js
git commit -m "feat(level4): drop the 10 May cutoff; label archive grids by position

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 3: libraryData — no cutoff, three friends

**Files:**
- Modify: `src/components/feed/libraryData.js`

- [ ] **Step 1: Remove the cutoff**

Delete line 30 (`const CUTOFF = '2016-05-10'`). In the `ALL` builder change

```js
    return m && !SKIP.has(name) && m[1] <= CUTOFF ? { url, name, date: m[1], account: m[2] } : null
```
to
```js
    return m && !SKIP.has(name) ? { url, name, date: m[1], account: m[2] } : null
```

In the `REAL_OWNERS` photo filter inside `OWNED` change

```js
      .filter(p => p.account === u && p.date <= CUTOFF && !LENT.has(p.name))
```
to
```js
      .filter(p => p.account === u && !LENT.has(p.name))
```

Rewrite the header comment lines 5–9 so they read:

```js
// Filenames are `YYYY-MM-DD_<account>_<id>.jpg`. Only accounts listed in
// ACCOUNTS below are used. Dates are not filtered; grids and the feed label
// posts by position. Left out on purpose:
//   - celebrities, so the level doesn't invent captions for famous people
```
(i.e. drop the "anything later than that…" bullet; keep the remaining bullets.)

- [ ] **Step 2: Trim FRIEND_SETS**

Replace the whole `FRIEND_SETS` object (lines 277–295) with:

```js
// Invented friends with a photo set from the blog library. `from` = their own
// set; `lead` = the photo used for their feed post. imani.brooks is not here:
// her photos are committed ES imports in feedData.js (IMANI_PHOTOS).
export const FRIEND_SETS = {
  'marcus.h':       { from: ['christian_foto'], topic: 'people' },
  'julia.creates':  { from: ['jadeantoine'], topic: 'art' },
  'sarah.moments':  { from: ['liaselina'], topic: 'art', lead: '2016-05-01_liaselina_o6ifm73.jpg' },
}
```

Update the comment at lines 20–21 to: `// Some sets are reserved for the three invented friends (FRIEND_SETS below) and for the ads; those never appear under a real account's name.`

- [ ] **Step 3: Check nothing broke**

Run: `npx vitest run`
Expected: all existing tests pass (App, DesktopScene, MenuBar, archiveData).

Run: `grep -n "CUTOFF\|thejoshuatreehouse\|lucacappuccinodonofrio" src/components/feed/libraryData.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/feed/libraryData.js
git commit -m "feat(level4): library loads every date; three invented friends keep photo sets

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 4: feedData — Imani, six base posts, FEED_ORDER

**Files:**
- Modify: `src/components/feed/feedData.js`
- Create: `src/test/feedData.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/test/feedData.test.js`:

```js
// src/test/feedData.test.js
// The real-account photos are gitignored, so these tests only assert on what
// holds with or without them: the invented friends, the ads, and the ordering.
import { POSTS, FEED_ORDER, FEED_TIMES, getProfile } from '../components/feed/feedData'

describe('home feed', () => {
  it('has one timestamp slot per FEED_ORDER entry', () => {
    expect(FEED_TIMES).toHaveLength(FEED_ORDER.length)
    expect(FEED_ORDER).toHaveLength(24)
  })

  it('keeps FEED_ORDER order, skipping accounts with no photos', () => {
    const usernames = POSTS.map(p => p.username)
    const expected = FEED_ORDER.filter(u => usernames.includes(u))
    expect(usernames).toEqual(expected)
    expect(new Set(usernames).size).toBe(usernames.length)
  })

  it('always carries the four friends and two ads', () => {
    const usernames = POSTS.map(p => p.username)
    for (const u of ['imani.brooks', 'marcus.h', 'julia.creates', 'sarah.moments', 'airbnb', 'warbyparker']) {
      expect(usernames).toContain(u)
    }
  })

  it('buries Imani at slot 14 with a 14h timestamp', () => {
    expect(FEED_ORDER[13]).toBe('imani.brooks')
    const imani = POSTS.find(p => p.username === 'imani.brooks')
    expect(imani.isTarget).toBe(true)
    expect(imani.timestamp).toBe('14h')
    expect(imani.imageSrc).toMatch(/imani\/post/)
  })

  it('gives ads no timestamp and everything else one', () => {
    for (const p of POSTS) {
      if (p.isSponsored) expect(p.timestamp).toBeUndefined()
      else expect(p.timestamp).toMatch(/^\d+[mhdw]$/)
    }
  })
})

describe("Imani's profile", () => {
  it('is exactly her 21 committed photos, post first', () => {
    const profile = getProfile('imani.brooks')
    expect(profile.name).toBe('Imani Brooks')
    expect(profile.grid).toHaveLength(21)
    expect(profile.grid[0].image).toMatch(/imani\/post/)
    expect(profile.grid[1].image).toMatch(/imani\/grid-01/)
    expect(profile.grid[0].post.caption).toMatch(/my first editorial/)
    expect(profile.website).toBe('imanibrooks.com')
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/test/feedData.test.js`
Expected: FAIL — `FEED_ORDER`/`FEED_TIMES` are not exported.

- [ ] **Step 3: Imani's imports and photo set**

At the top of `src/components/feed/feedData.js`, after the two existing imports (line 9), add:

```js
// Imani's photos are committed (Unsplash License, @aliounepic), so her post
// works on the public site that ships without the gitignored photo folders.
import imaniAvatar from '../../../assets/feed/imani/avatar.jpg'
import imaniPost from '../../../assets/feed/imani/post.jpg'
const IMANI_GRID = import.meta.glob('../../../assets/feed/imani/grid-*.jpg', { eager: true, import: 'default' })

// Her post first, then grid-01 … grid-20 in file order.
const IMANI_PHOTOS = [imaniPost, ...Object.keys(IMANI_GRID).sort().map(k => IMANI_GRID[k])]

/** A friend's photos, lead first: Imani's committed set, else the library set. */
const friendSet = username => username === 'imani.brooks' ? IMANI_PHOTOS : friendPhotos(username)
```

Change line 71 from

```js
const FRIEND_PHOTO_LEAD = username => friendPhotos(username)[0] || null
```
to
```js
const FRIEND_PHOTO_LEAD = username => friendSet(username)[0] || null
```

In `getProfile`, change

```js
  const set = isBrand ? feedPosts.map(p => p.imageSrc).filter(Boolean) : friendPhotos(username)
```
to
```js
  const set = isBrand ? feedPosts.map(p => p.imageSrc).filter(Boolean) : friendSet(username)
```

- [ ] **Step 4: Trim BASE_POSTS to six entries**

Replace the entire `BASE_POSTS` array (from `const BASE_POSTS = [` through its closing `]`, currently lines 73–291) with exactly these six posts. Keep `id`s so nothing else that keys on them changes:

```js
const BASE_POSTS = [
  {
    id: 1,
    username: 'marcus.h',
    photo: 'post-marcus-studio.jpg',
    avatar: 'avatar-marcus-h.jpg',
    imageGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    likes: '283',
    caption: 'Golden hour portraits. Some days the light just cooperates. #naturallight #portrait',
    commentCount: 12,
    comments: [
      { username: 'julia.creates', text: 'that light 😍' },
      { username: 'pete.photo', text: '@marcus.h what lens?' },
    ],
    avatarColor: '#4facfe',
    initial: 'M',
  },
  {
    id: 2,
    username: 'airbnb',
    isSponsored: true,
    ctaLabel: 'LEARN MORE',
    photo: 'post-airbnb-cabin.jpg',
    avatar: 'avatar-airbnb.jpg',
    imageGradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    likes: '12,440',
    caption: "Don't just go there. Live there. Book homes in over 191 countries. #LiveThere",
    commentCount: 89,
    comments: [],
    avatarColor: '#ff5a5f',
    initial: 'A',
  },
  {
    id: 3,
    username: 'julia.creates',
    photo: 'post-julia-ceramics.jpg',
    avatar: 'avatar-julia-creates.jpg',
    imageGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    likes: '1,204',
    caption: 'new work in the shop 🎨 link in bio',
    commentCount: 28,
    comments: [{ username: 'sarah.moments', text: 'need the blue one!!' }],
    avatarColor: '#a18cd1',
    initial: 'J',
  },
  {
    id: 5,
    username: 'sarah.moments',
    photo: 'post-sarah-coffee.jpg',
    avatar: 'avatar-sarah-moments.jpg',
    imageGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    likes: '397',
    caption: 'lazy sunday mornings are underrated ☕',
    commentCount: 18,
    comments: [],
    avatarColor: '#ff9a9e',
    initial: 'S',
  },
  {
    id: 7,
    username: 'warbyparker',
    isSponsored: true,
    ctaLabel: 'SHOP NOW',
    photo: 'post-warbyparker-frames.jpg',
    avatar: 'avatar-warbyparker.jpg',
    imageGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    likes: '7,892',
    caption: 'Fall frames are here. Try 5 pairs at home, free. #WarbyParker',
    commentCount: 44,
    comments: [],
    avatarColor: '#1a1a2e',
    initial: 'W',
  },
  // TARGET: the friend's post, buried under the celebrities and the second ad
  {
    id: 13,
    username: 'imani.brooks',
    isTarget: true,
    avatar: imaniAvatar,
    imageGradient: 'linear-gradient(135deg, #b23a2e 0%, #7a1f1a 100%)',
    likes: '847',
    caption: "it's OUT 🎉 my first editorial, shot in Dakar last spring. eight months of work for twelve pages 😭 link in bio",
    commentCount: 134,
    comments: [
      { username: 'j.okafor', text: 'CONGRATS!!! 🎉🎉' },
      { username: 'mia.c', text: '@imani.brooks framing every page' },
    ],
    avatarColor: '#b23a2e',
    initial: 'I',
  },
]
```

(Timestamps are deliberately absent: `FEED_TIMES` supplies them.) The `BASE_POSTS.forEach` block that sets `imageSrc` stays as is; `FRIEND_PHOTO_LEAD('imani.brooks')` now resolves to `imaniPost`.

- [ ] **Step 5: Replace the feed assembly**

Replace everything from the comment `// Real accounts in the home feed, from the Wayback archive when present:` through the `export const POSTS = …` statement (currently lines 297–344: `REAL_FEED`, `REAL_FEED_COMMENTS`, `FOLLOWED_REAL`, `ARCHIVE_FEED_POSTS`, `LIBRARY_FEED_POSTS`, `REAL_POSTS`, `POSTS`) with:

```js
// ── The home feed ──────────────────────────────────────────────────────────
// 24 slots, hand-ranked the way the 2016 algorithm would have: big accounts
// up top, the player's friends spaced out, an ad early, and the friend's big
// news (imani.brooks) under three celebrities and the second ad. Real
// accounts show their newest archived post with its real caption and likes;
// one that has no photos on this machine is skipped, so the public build
// still gets the friends and the ads.
export const FEED_ORDER = [
  'kimkardashian', 'marcus.h', 'selenagomez', 'cristiano', 'airbnb',
  'justinbieber', 'julia.creates', 'natgeo', 'kyliejenner', 'beyonce',
  'gigihadid', 'therock', 'warbyparker', 'imani.brooks', 'leomessi',
  'sarah.moments', 'nasa', 'kevinhart4real', 'instagram', 'badgalriri',
  'humansofny', 'neymarjr', 'theellenshow', '9gag',
]

// One label per slot, written to read like a ranked feed (not sorted).
// Ads carry no timestamp.
export const FEED_TIMES = [
  '2h', '1h', '5h', '3h', null,
  '45m', '8h', '2h', '4h', '11h',
  '6h', '1h', null, '14h', '9h',
  '7h', '3h', '12h', '5h', '16h',
  '8h', '1d', '10h', '19h',
]

const FEED_COMMENTS = {
  natgeo: [{ username: 'marcus.h', text: 'incredible' }],
  humansofny: [{ username: 'sarah.moments', text: '❤️' }],
  kimkardashian: [{ username: 'mia.c', text: 'iconic' }],
}

export const POSTS = FEED_ORDER.flatMap((username, i) => {
  const base = BASE_POSTS.find(p => p.username === username)
  const post = base || archivePost(username, 0, FEED_COMMENTS[username] ? { comments: FEED_COMMENTS[username] } : {})
  if (!post) return []
  return [post.isSponsored ? post : { ...post, timestamp: FEED_TIMES[i] }]
})
```

Remove `libraryPhotos` and `libraryPost`'s feed use only if nothing else needs them: `libraryPost` is still used by Explore (`exploreTile`) and `getProfile`, and `libraryPhotos` by `libraryPost` — keep both. Remove `ARCHIVE_HANDLES`? No — Explore uses it. Leave the import line alone.

- [ ] **Step 6: Profiles and activity**

In `FEED_PROFILES`, delete the entries for `alex.wanderer`, `mike.film`, `coffee.culture`, `outdoor.vibes`, `studio.light`, `city.frames`, `bakes.and.more`, `daniela.reyes`, `travel.tales`, `morning.run`, `lens.folk`, `home.spaces`, `pnw.shots`, and add:

```js
  'imani.brooks': { name: 'Imani Brooks', bio: 'portraits + fashion 📷\nDakar 🇸🇳 ↔ Oakland\nnew work + bookings: link below', website: 'imanibrooks.com' },
```

Change `mia.c`'s bio from `'housewarming committee chair, apparently'` to `'resident hype woman'` (the housewarming joke no longer lands).

In `FOLLOWING_ACTIVITY`, replace the array with:

```js
export const FOLLOWING_ACTIVITY = [
  { id: 'f1', actor: 'marcus.h', segments: ['liked ', { user: 'julia.creates' }, "'s photo."], time: '12m', thumbs: friend('julia.creates') },
  { id: 'f2', actor: 'imani.brooks', segments: ['started following ', { user: 'j.okafor' }, ', ', { user: 'mia.c' }, ' and 3 others.'], time: '26m' },
  { id: 'f3', actor: 'j.okafor', segments: ['liked 3 photos.'], time: '41m', thumbs: [...lib(NATURE, 1), ...lib(PETS, 1), ...lib(SPACE, 2)] },
  { id: 'f4', actor: 'nadia_s', segments: ['liked ', { user: PETS }, "'s photo."], time: '55m', thumbs: lib(PETS, 1) },
  { id: 'f5', actor: 'sarah.moments', segments: ['started following ', { user: HOME }, '.'], time: '1h' },
  { id: 'f8', actor: 'julia.creates', segments: ['started following ', { user: 'otntty' }, '.'], time: '5h' },
  { id: 'f9', actor: 'mia.c', segments: ['liked 4 photos.'], time: '6h', thumbs: [...lib(SPACE, 1, 3), ...lib(HOME, 1), ...lib(NATURE, 3)] },
]
```

In `YOU_ACTIVITY`, change `actor: 'daniela.reyes'` to `actor: 'imani.brooks'`.

Replace `TRICKLE_ACTIVITY` with:

```js
export const TRICKLE_ACTIVITY = [
  { id: 't1', actor: 'imani.brooks', segments: ['liked ', { user: 'marcus.h' }, "'s photo."], time: '1m', thumbs: friend('marcus.h') },
  { id: 't2', actor: 'julia.creates', segments: ['liked 2 photos.'], time: '1m', thumbs: lib('otntty', 0, 1) },
  { id: 't3', actor: 'nadia_s', segments: ['liked ', { user: FOOD }, "'s photo."], time: '1m', thumbs: lib(FOOD, 1) },
  { id: 't4', actor: 'mia.c', segments: ['liked ', { user: SPACE }, "'s photo."], time: '1m', thumbs: lib(SPACE, 0) },
]
```

The `friend()` helper calls `friendPhoto(username)`, which calls `FRIEND_PHOTO_LEAD` — now `friendSet`-based, so `friend('imani.brooks')` would also work. Update the comment above `BASE_POSTS` (lines 66–69) to: `// BASE_POSTS are the player's four invented friends and two ads; the real accounts are listed in FEED_ORDER below.`

- [ ] **Step 7: Run the tests**

Run: `npx vitest run`
Expected: all pass, including the 6 new feedData tests. If `getProfile('imani.brooks').grid` has length 1 instead of 21, `friendSet` is not being used in `getProfile` (Step 3).

Run: `grep -n "daniela\|REAL_FEED\|FOLLOWED_REAL\|alex.wanderer\|mike.film\|outdoor.vibes\|city.frames\|lens.folk\|bakes.and.more\|travel.tales\|studio.light" src/components/feed/feedData.js`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/components/feed/feedData.js src/test/feedData.test.js
git commit -m "feat(level4): 24-post ranked feed; Imani Brooks replaces Daniela as the buried friend

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 5: Objective text

**Files:**
- Modify: `src/levels/Level4.jsx:22-26`

- [ ] **Step 1: Change the first objective**

```js
const OBJECTIVES = [
  "Find Imani's post — she has news",
  'Learn more about a sponsored post',
  'Like a post',
]
```

- [ ] **Step 2: Test and commit**

Run: `npx vitest run`
Expected: all pass.

```bash
git add src/levels/Level4.jsx
git commit -m "feat(level4): name the friend in the first objective

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 6: Docs and stale local files

**Files:**
- Modify: `docs/design-spec.md:371-376`
- Modify: `assets/feed/README.md:55-77`
- Delete (local, gitignored, no git change): `assets/feed/avatar-daniela-reyes.jpg` and the avatars of the eight removed friends

- [ ] **Step 1: design-spec.md**

Replace the **Content date** paragraph (line 371) with:

```markdown
**Dates:** nothing is filtered by date. Every photo on disk loads, and timestamps are labels by position: the feed uses the fixed `FEED_TIMES` list (one per slot of `FEED_ORDER` in `feedData.js`), and profile grids use `gridTime(index)` in `archiveData.js` (3h, 1d, 2d … then weeks), so every surface reads as today regardless of when a capture was made.
```

Replace line 373 (the "12 invented friends" sentence) with:

```markdown
The home feed is 24 posts in a hand-ranked order (`FEED_ORDER`): 18 recognisable real accounts, four invented friends (marcus.h, julia.creates, sarah.moments and imani.brooks, whose post is the target), and two ads. Imani's photos are Unsplash (free licence) and committed in `assets/feed/imani/`; all other real photos and account data are gitignored and live only on the author's machine. See `assets/feed/README.md`.
```

Replace objective 1 (line 376) with:

```markdown
1. Find Imani's post — she has news (imani.brooks's "it's OUT 🎉 my first editorial", slot 14, under three celebrities and the second ad)
```

- [ ] **Step 2: README.md**

Replace the paragraph starting `To put a recovered account in the home feed` (line 57) with:

```markdown
To put a recovered account in the home feed, add its handle to `FEED_ORDER` in
`src/components/feed/feedData.js` and a matching label to `FEED_TIMES`. Every
recovered account already appears in Explore and can be opened as a profile.
```

Replace the **The level's date** section (lines 62–67) with:

```markdown
## Dates

Nothing is filtered by date any more. Every photo in `archive/` and `library/`
loads, and the level labels posts by position (`FEED_TIMES` in `feedData.js`,
`gridTime` in `archiveData.js`) so grids and the feed always read as today.
```

Replace the **Invented friends** section (lines 69–77) with:

```markdown
## Invented friends

Four invented accounts carry the level's objectives. marcus.h, julia.creates
and sarah.moments post from reserved library sets (`FRIEND_SETS` in
`libraryData.js`). imani.brooks, whose post is the one the player has to
find, is a portrait and fashion photographer whose 21 photos (plus avatar) are
by @aliounepic on Unsplash (Unsplash License): the one committed folder here,
`imani/`. The full-size originals sit in `profiles/imani brooks/` (gitignored).
```

- [ ] **Step 3: Delete stale avatars (local only)**

```bash
cd /Users/matthewdea/Code/ux-archeologist/assets/feed
rm -f avatar-daniela-reyes.jpg avatar-alex-wanderer.jpg avatar-mike-film.jpg avatar-outdoor-vibes.jpg avatar-studio-light.jpg avatar-city-frames.jpg avatar-bakes-and-more.jpg avatar-travel-tales.jpg avatar-lens-folk.jpg
git status --short
```
Expected: only `docs/design-spec.md` and `assets/feed/README.md` modified (the jpgs are gitignored).

- [ ] **Step 4: Commit**

```bash
git add docs/design-spec.md assets/feed/README.md
git commit -m "docs(level4): feed order, Imani, no date cutoff

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push
```

---

### Task 7: Verify in the browser

**Files:** none.

- [ ] **Step 1: Open the level**

`preview_start {name: "dev"}`. If port 8888 is held by another chat's server, `navigate` to http://localhost:8888/ instead (it serves this working tree). Click "Begin excavation", then the "2016" timeline entry, then "Begin excavation" in the intro modal. Confirm the modal lists "Find Imani's post — she has news".

- [ ] **Step 2: Check the data**

`javascript_tool`:
```js
const f = await import('/src/components/feed/feedData.js?t=' + Date.now())
f.POSTS.map((p, i) => `${i + 1} ${p.username}${p.isSponsored ? ' (ad)' : ''} ${p.timestamp || ''}`)
```
Expected: 24 lines in `FEED_ORDER` order (fewer only if an archive account has no photos locally), `14 imani.brooks 14h`.

`read_console_messages {onlyErrors: true}` → expected: nothing new.

- [ ] **Step 3: Play the objectives**

Scroll the feed (`computer` scroll on the phone screen) until Imani's red-room post is ≥40% visible → the tracker's first objective ticks. Tap "LEARN MORE" on the Airbnb ad → second ticks. Double-tap or heart any post → third ticks. The Continue button appears.

- [ ] **Step 4: Check profiles and activity**

Tap `imani.brooks` → profile shows name "Imani Brooks", 21 posts, the bio's three lines and website, grid labels `3h, 1d, 2d, 4d` when the first tiles are opened. Tap `kimkardashian` → grid opens; first tile reads `3h`. Open the Activity tab → "imani.brooks started following you" in the You list; no row names a removed friend.

- [ ] **Step 5: Record proof**

`computer {action: "screenshot"}` at the feed top and at Imani's post. Report what passed and anything that did not.
