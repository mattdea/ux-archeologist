# Level 4 feed redesign — design

Date: 6 November 2026. Status: approved in conversation, pending review of this file.

## Why

Level 4 (spring-2016 Instagram) has grown bloated: a 44-post home feed where
most posts come from invented friends or small blog accounts nobody recognises,
and real posts carry honest-but-stale dates (weeks old) because the Wayback
archive has almost nothing from the days before 10 May 2016. The first
objective, "Find your friend's post", fails because a player has no way to tell
which account in the feed counts as a friend.

The level's lesson stays the same: by 2016 an algorithm ranked the feed, and a
close friend's biggest news could sit under three strangers and an ad. The
feed must stay *ranked*, not chronological. The discovery copy and the
"Algorithmic Feed" artifact are unchanged.

## 1. Imani Brooks (replaces Daniela Reyes)

- Rename `daniela.reyes` → `imani.brooks` (display name "Imani Brooks")
  everywhere it appears: the target feed post, `FEED_PROFILES`, comments that
  mention her, the three activity rows (`f2`, `y1`, `t1`), and `FRIEND_SETS`.
- Photos come from one Unsplash account, [@aliounepic](https://unsplash.com/@aliounepic),
  under the Unsplash License (free to use, no attribution required). Because
  they are licensed, they are **committed**, in a new folder
  `assets/feed/imani/`, so the target post works on the public site too. The
  existing `/assets/feed/*.jpg` gitignore rule does not match a subfolder; no
  gitignore change is needed.
  - Avatar: [XQBcBGWvxF4](https://unsplash.com/photos/smiling-young-black-woman-with-striped-shadows-on-her-face-XQBcBGWvxF4),
    cropped square on the face, saved as `assets/feed/imani/avatar.jpg`.
    The old `avatar-daniela-reyes.jpg` is no longer referenced.
  - Target post: [Hp2PFbBdg4w](https://unsplash.com/photos/woman-in-checkered-dress-on-sofa-Hp2PFbBdg4w)
    (woman in a checkered dress on a sofa in a red room), cropped to the
    feed's square, saved as `assets/feed/imani/post.jpg`.
  - Grid: the post plus three more photos from the same account, chosen during
    implementation for a consistent personal-account look (interiors, portraits,
    no other people's faces as the subject where avoidable). Saved as
    `assets/feed/imani/grid-1.jpg` … `grid-3.jpg`. Her grid is exactly these
    four; no topic top-up from library pools (`FRIEND_SETS` entry gets no
    `topic` and no `from`; her photos are listed explicitly).
- The news: she finished her apartment. Caption:
  "first night in the new place 🏡 eight months of saving, three coats of red
  paint, worth every second 😭". Likes "847" and comment count 134 stay.
  Comments: j.okafor "CONGRATS!!! 🎉🎉" (unchanged), mia.c "@imani.brooks
  housewarming when??" (handle updated). Bio: "new place, who dis 🏡\nOakland,
  CA".
- Objective 1 becomes **"Find Imani's post — she has news"**. The Activity
  tab's "imani.brooks started following you" row (`y1`) is the trail. Objectives
  2 and 3 ("Learn more about a sponsored post", "Like a post") are unchanged.

## 2. The home feed: 24 posts, ranked

- **4 invented friends:** imani.brooks (target), marcus.h, julia.creates,
  sarah.moments. The other eight invented friends (alex.wanderer, mike.film,
  outdoor.vibes, studio.light, city.frames, bakes.and.more, travel.tales,
  lens.folk) leave the feed. Their `BASE_POSTS` entries, `FRIEND_SETS` entries
  and avatar files are removed; the `FEED_PROFILES` entries and activity rows
  that mention them are removed or re-pointed at a remaining friend. Comment-only
  names (j.okafor, mia.c, nadia_s) stay as commenters.
- **18 real accounts**, chosen for recognisability and photo count:
  kimkardashian, selenagomez, justinbieber, kyliejenner, beyonce, cristiano,
  leomessi, neymarjr, therock, kevinhart4real, gigihadid, badgalriri,
  theellenshow, natgeo, nasa, instagram, humansofny, 9gag. Each shows its
  newest archived post with the real caption and like count, as today.
  The blog-library accounts (sfmoma, hummingbirdsxoxo, acacia.johnson, otntty,
  theoregonduck) leave the feed; they stay in Explore and remain openable as
  profiles. `FOLLOWED_REAL` is removed.
- **2 ads:** airbnb and warbyparker, unchanged.
- **Order** is an explicit, hand-written `FEED_ORDER` list of usernames in
  `feedData.js`, replacing the round-robin deal. The shape: a celebrity, a
  friend, two celebrities, the first ad, more celebrities with friends spaced
  out, the second ad, then Imani at position 14 directly under three big
  accounts and that ad, then the rest. `POSTS` is built by looking each
  username up (friend post from `BASE_POSTS`, else `archivePost(handle, 0)`).
  An account missing from the archive is skipped, so the feed degrades
  gracefully without the local photos.
- `FOLLOWING` and `ME.following` derive from `POSTS` as they do today, so the
  player's "following" count shrinks with the feed.

## 3. Dates: look recent, stop filtering

- Remove the 10 May 2016 cutoff. In `archiveData.js`, `LEVEL_NOW` no longer
  filters posts (every archived post with a photo loads, including Cristiano's
  20 May posts and Glossier's). In `libraryData.js`, `CUTOFF` is removed too;
  the late-2016 @instagram blog photos join its pool. `LEVEL_NOW` /
  `ARCHIVE_NOW` can be deleted if nothing else reads them.
- **Feed timestamps come from feed position, not real dates.** A fixed
  `FEED_TIMES` list in `feedData.js`, one label per feed slot, written to read
  like a ranked feed: e.g. `2h, 1h, 5h, 3h, 45m, 8h, 2h, 4h, 11h, 6h, 1h, 9h,
  7h, 14h, 3h, 12h, 5h, 16h, 8h, 1d, 10h, 19h, 13h, 22h`. Imani's slot reads
  "14h". Ads have no timestamp, as now.
- **Profile grids label posts by grid position.** A post at grid index *i*
  gets a label from a fixed ladder: `3h, 1d, 2d, 4d, 6d, 1w, 1w, 2w, 2w, 3w,
  3w, 4w, 5w, 6w, …` (after index 12, `(i − 7)w`). `archivePost` takes the
  index it already receives and uses this ladder instead of `relativeTime`.
  The feed post for an account and its first grid tile therefore show
  different labels (feed slot vs. "3h"); that is acceptable — they are
  different surfaces and the real app's feed and grid never showed the same
  post twice anyway.
- Real captions, like counts and comment counts are untouched. `relativeTime`
  and its tests, if any, are removed.
- Explore is untouched.

## 4. Out of scope (noted for later)

- Pull-to-refresh / reload that reorders the feed and refreshes Explore.
- Tappable commenter usernames that open that account's profile (e.g.
  julia.creates on a post).

## Files touched

- `src/components/feed/feedData.js` — BASE_POSTS trimmed to 4 friends + 2
  ads, `FEED_ORDER`, `FEED_TIMES`, Imani's post and profile, activity rows.
- `src/components/feed/archiveData.js` — cutoff removed, grid-position labels.
- `src/components/feed/libraryData.js` — `FRIEND_SETS` trimmed, `CUTOFF`
  removed, Imani's explicit photo list.
- `src/levels/Level4.jsx` — objective text.
- `docs/design-spec.md` — Level 4 section: objective text, feed composition.
- `assets/feed/imani/` — four photos + avatar (committed).
- `assets/feed/avatar-*.jpg` for removed friends — deleted (local, gitignored).
- `assets/feed/README.md` — note the committed Unsplash folder and the
  removed cutoff.

## Verification

In the dev server (port 8888): the feed has 24 posts in `FEED_ORDER` order
with Imani 14th; scrolling to her post fires objective 1; the sponsored tap
and like objectives still fire; opening kimkardashian, cristiano and
imani.brooks profiles shows grids with the position-based labels; the
Activity tab shows the renamed rows; no console errors. Screenshot the feed
top and Imani's post for the record.
