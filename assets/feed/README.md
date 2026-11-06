# Level 4 feed assets

The real Instagram photos and account data here are **committed**, so the
public site shows the same feed as this machine. They are used non-commercially
for education (see the repository's note on fair use). Only raw downloads and
unused crops stay gitignored: `profiles/<account>/` dumps from SodaFox,
`profiles/imani brooks/` (full-size Unsplash originals), `explore/`, `period/`,
`post-*.jpg` and `archive/*/profile.json.bak`. The level still falls back to
plain color blocks when a photo is missing.

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

To put a recovered account in the home feed, add a `[handle, timestamp]` pair
to `FEED` in `src/components/feed/feedData.js`. Every recovered account
already appears in Explore and can be opened as a profile.

## Dates

Nothing is filtered by date any more. Every photo in `archive/` and `library/`
loads, and the level labels posts by position (`FEED` in `feedData.js`,
`gridTime` in `archiveData.js`) so grids and the feed always read as today.

## Invented friends

Four invented accounts carry the level's objectives. marcus.h, julia.creates
and sarah.moments post from reserved library sets (`FRIEND_SETS` in
`libraryData.js`). imani.brooks, whose post is the one the player has to
find, is a portrait and fashion photographer whose 21 photos (plus avatar)
are by @aliounepic on Unsplash (Unsplash License), in `imani/`. The full-size
originals sit in `profiles/imani brooks/` (gitignored).
