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
- Big accounts (natgeo, nasa, humansofny, brands) have many captures and
  archived photos. Many celebrity accounts' photos were never archived; the
  script notices after six misses and moves on with just the account data.
- Only the first 24 posts of each capture are available, so an account's grid
  holds the union of its captures: usually 24–60 posts.
- `archive/recover.log` has the last run's output; `archive/index.json` lists
  what was recovered.

To put a recovered account in the home feed, add its handle to `REAL_FEED` in
`src/components/feed/feedData.js`. Every recovered account already appears in
Explore and can be opened as a profile.

## Invented friends

Twelve invented accounts (marcus.h, julia.creates, daniela.reyes…) carry the
level's objectives. Each posts from a reserved set of library photos matching
its subject (`FRIEND_SETS` in `libraryData.js`), so their feed post and profile
grid look like one person's account.
