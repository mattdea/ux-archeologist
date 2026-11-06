# Level 4 feed assets

Everything in this folder except this file and `SOURCES.md` is **gitignored**:
real Instagram photos and account data, kept on this machine only. The public
repository and the Netlify site build without them and show plain color blocks
instead. Never commit them.

## What the level loads, in order of preference

| Folder | What it is | Read by |
| --- | --- | --- |
| `archive/<handle>/` | Real accounts as the Wayback Machine captured them in spring 2016: `profile.json` (bio, counts, posts with real captions, like counts, dates) plus one JPG per post and, when archived, `avatar.jpg` | `src/components/feed/archiveData.js` |
| `library/` | Real accounts and photos from Instagram's own blog, Jan–May 2016 (`index.csv` has the sources). Each photo is owned by exactly one account; some sets are reserved for the invented friends | `libraryData.js`, `libraryQuality.js` |
| `profiles/` | Wayback profile captures of 40 big accounts (counts, bios, post links) and their avatars, pulled by an earlier session. The archive falls back to `profiles/avatars/<handle>.jpg` when a profile picture was not archived | `archiveData.js` (avatars only) |
| `explore/`, `period/`, `*.jpg` | Older crops from the reference screenshots. No longer used | — |

An account in `archive/` wins over the same account in `library/`.

## Recovering more real accounts

```bash
scripts/recover-instagram-2016.py natgeo humansofny nasa
scripts/recover-instagram-2016.py --list handles.txt
```

For each handle the script finds archived captures of `instagram.com/<handle>/`
between 1 March and 10 May 2016 (the day before the redesign), reads the
account and its 24 most recent posts from each capture, unions the posts, and
downloads the photos from the archive at full size. Re-running is safe: files
already on disk are kept.

What to expect:

- The Wayback Machine serves about one request per second and stalls parallel
  connections, so downloads run one at a time. Budget about two minutes per
  account. It also stalls requests with a custom User-Agent, so the script uses
  curl's default.
- Every account comes back with its full data (bio, counts, 36–120 posts with
  real captions and like counts), but the archive kept the **photos** for only
  about one account in four. The first run (Nov 2026, 49 handles) found photos
  for 13: instagram (120), kimkardashian (40), kevinhart4real (27), natgeo (24),
  gigihadid, jlo, badgalriri, leomessi, cristiano, emmawatson, neymarjr, nike,
  victoriassecret. humansofny, nasa, nytimes, the pet accounts and most
  celebrities have data only. The script notices after six misses and moves on.
- Only the 24 most recent posts of each capture are available, so an account's
  grid holds the union of its captures: usually 36–120 posts.
- `archive/recover.log` has the last run's output; `archive/index.json` lists
  what was recovered.

Accounts whose photos the archive never saved (most celebrities, humansofny)
still get a full `profile.json` with real captions and like counts. To give
them photos, save each post's image by hand (the post links are in
`profiles/POST-LINKS.md`) as `archive/<handle>/<code>.jpg`, where `<code>` is
the post's code in `profile.json`. The level picks them up on the next
reload; no wiring needed.

To put a recovered account in the home feed, add its handle to `REAL_FEED` in
`src/components/feed/feedData.js`. Every recovered account already appears in
Explore and can be opened as a profile.

## The level's date

Everything is dated as of 6 pm Pacific on 10 May 2016, the last evening before
the redesign (`LEVEL_NOW` in `archiveData.js`, `CUTOFF` in `libraryData.js`).
Archived posts and library photos after that are ignored, so a recovery run
over a wider date range, or a late-2016 blog photo, cannot leak into the level.

## Invented friends

Twelve invented accounts (marcus.h, julia.creates, daniela.reyes…) carry the
level's objectives. Each posts from a reserved set of library photos matching
its subject (`FRIEND_SETS` in `libraryData.js`), so their feed post and profile
grid look like one person's account. Three of them borrow a whole spring
blog set, so those source accounts no longer appear under their own names:
daniela.reyes posts @thejoshuatreehouse's house (May 2016), bakes.and.more
posts @lucacappuccinodonofrio's pasta (Feb 2016), and travel.tales posts
#WHPonthego (Apr 2016).
