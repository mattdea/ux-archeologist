// src/components/feed/archiveData.js
// Real Instagram accounts as they were in spring 2016, recovered from the
// Wayback Machine by scripts/recover-instagram-2016.py into
// assets/feed/archive/<handle>/ (committed; raw downloads stay local):
//   profile.json  bio, counts, and posts with real captions, likes, dates
//   <code>.jpg    the post's photo
//   avatar.jpg    profile picture (often not archived; falls back to
//                 assets/feed/archive-avatars/<handle>.jpg)
//
// A build without the folder gets an empty ARCHIVE and the level falls
// back to the blog library, then to plain color blocks.
// No date cutoff: everything in the folder loads.

const MANIFESTS = import.meta.glob('../../../assets/feed/archive/*/profile.json', {
  eager: true,
  import: 'default',
})
const PHOTOS = import.meta.glob('../../../assets/feed/archive/*/*.jpg', {
  eager: true,
  import: 'default',
})
const FALLBACK_AVATARS = import.meta.glob('../../../assets/feed/archive-avatars/*.jpg', {
  eager: true,
  import: 'default',
})

// Dates are not filtered: every archived post with a photo loads, whatever
// its real date. The feed and grids label posts by position (gridTime,
// FEED_TIMES in feedData.js), not by real age, so the level always reads
// as "today" however old the captures are.

// Posts taken out of the level (feed audit, 9 Nov 2026). Their photos are
// deleted; this list keeps them out if the recovery script downloads them
// again. To hide a post from the feed and Explore only, use PROFILE_ONLY in
// feedData.js instead.
export const REMOVED = new Set([
  // nudity
  'BCroouZuSzw', 'BCpQBQROS5l',            // kimkardashian
  'BDcArURAvtC',                           // justinbieber
  // ill children, a minor
  'BC5gGzToh2Z', 'BCz9y_Joh-r',            // therock
  'BDyYjEgxtih',                           // neymarjr
  'BDgMA8cBQek',                           // instagram (@filipbalos.art)
  // broken-looking stills
  'BCyEALRuS6X',                           // kimkardashian, near-black
  'BDbnw7IAvj8',                           // justinbieber, letterbox bars
  'BDi3QxTBQWd', 'BDjxN75hQTF', 'BDRD2YJhQYx', // instagram: video card, black still, black square
  'BDqJtqVjJ5b',                           // 9gag, "can't load" joke
  'BEZUF69PkkB',                           // buzzfeed, near-blank screenshot
  // off-account
  'BCXGWDoJmCu',                           // zendaya, a portrait of Leonardo DiCaprio
  'rK0Jx6n3DM',                            // emmawatson, caption only @-tags
  // too small or soft (under 500px, or 640px video stills); no larger copy
  // on the Wayback Machine or the web
  'BEV_UCDuS3u',                           // kimkardashian, 320×320
  'BEg3-TgvM0t',                           // leomessi, 320×320
  'BCvlvAbPw0N',                           // beyonce, 320×399
  'BCbvuDBiYjP', 'BCLRbnSiYlB',            // kevinhart4real, 480×480
  'BC77u1shMwW',                           // badgalriri, 427×533
  'BCgWuaitrJz',                           // humansofny, 472×315
  'BDgbDB6tjFO',                           // theellenshow, 480×441
  'BAhgjIIn3P1',                           // emmawatson, 480×480
  'BDx3nO0K8tF',                           // thefeedfeed, 400×400
  'BERo0ybhQd3', 'BEMg_axBQaQ', 'BDzMcG3hQSD', 'BDrFGFthQe4',
  'BDeIk6qBQRr', 'BCYFKfOBQUi', 'BCQWw9nhQTw', // instagram, 640×360/426 video stills
  // duplicates
  'added-cr7-05',                          // cristiano, same handstand as BDllkx0hpVE
])

const photoUrl = (handle, file) => PHOTOS[`../../../assets/feed/archive/${handle}/${file}`] || null
const fallbackAvatar = handle => FALLBACK_AVATARS[`../../../assets/feed/archive-avatars/${handle}.jpg`] || null

/** handle → account. Posts newest first, only those whose photo was recovered. */
export const ARCHIVE = Object.fromEntries(
  Object.entries(MANIFESTS).map(([path, m]) => {
    const handle = path.split('/').slice(-2)[0]
    // A post's photo is the archived file, or <code>.jpg saved by hand into
    // the account's folder (for accounts whose photos were never archived).
    const posts = (m.posts || [])
      .filter(p => !REMOVED.has(p.code))
      .map(p => ({ ...p, file: (p.file && photoUrl(handle, p.file)) ? p.file : (photoUrl(handle, `${p.code}.jpg`) ? `${p.code}.jpg` : null) }))
      .filter(p => p.file)
      .map(p => ({
        code: p.code,
        date: p.date,
        caption: p.caption || '',
        likes: p.likes || 0,
        comments: p.comments || 0,
        isVideo: !!p.is_video,
        url: photoUrl(handle, p.file),
      }))
      .sort((a, b) => b.date - a.date)
    return [handle, {
      handle,
      name: m.full_name || handle,
      bio: m.biography || '',
      website: m.external_url ? m.external_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null,
      verified: !!m.is_verified,
      followers: m.followers || 0,
      following: m.following || 0,
      postsCount: m.posts_count || posts.length,
      avatar: (m.profile_pic && photoUrl(handle, m.profile_pic)) || fallbackAvatar(handle),
      capturedAt: m.captured_at,
      posts,
    }]
  }).filter(([, a]) => a.posts.length)
)

export const ARCHIVE_HANDLES = Object.keys(ARCHIVE)

export function isArchiveAccount(handle) {
  return !!ARCHIVE[handle]
}

// Grid labels by position, so any grid reads newest-first: the top row is
// hours and days, then days, then weeks.
const GRID_LADDER = ['3h', '1d', '2d', '4d', '6d', '1w', '1w', '2w', '2w', '3w', '3w', '4w', '5w']

/** 2016 short timestamp for the post at grid index i (0 = newest). */
export function gridTime(i) {
  return GRID_LADDER[i] || `${i - 7}w`
}

const fmt = n => Number(n).toLocaleString('en-US')

/** Profile counts as the 2016 app showed them: full with commas under 10k,
    then 45.3k, then 45.3m. */
export function shortCount(n) {
  n = Number(n)
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '')}m`
  if (n >= 1e4) return `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, '')}k`
  return fmt(n)
}

/** A post by a real account, shaped for the Post component. */
export function archivePost(handle, index = 0, overrides = {}) {
  const a = ARCHIVE[handle]
  const p = a && a.posts[index]
  if (!p) return null
  return {
    id: `archive-${handle}-${p.code}`,
    username: handle,
    verified: a.verified,
    imageSrc: p.url,
    avatar: a.avatar,
    avatarColor: '#dddddd',
    initial: handle[0],
    likes: fmt(p.likes),
    caption: p.caption,
    commentCount: p.comments,
    comments: [],
    timestamp: gridTime(index),
    isVideo: p.isVideo,
    ...overrides,
  }
}

/** Profile data for a real account: counts as archived, grid of its posts. */
export function archiveProfile(handle) {
  const a = ARCHIVE[handle]
  if (!a) return null
  return {
    username: handle,
    name: a.name,
    bio: a.bio,
    website: a.website,
    verified: a.verified,
    posts: shortCount(a.postsCount),
    followers: shortCount(a.followers),
    following: shortCount(a.following),
    avatar: a.avatar,
    avatarColor: '#dddddd',
    initial: handle[0],
    grid: a.posts.map((p, i) => ({
      id: `grid-${handle}-${p.code}`,
      image: p.url,
      isVideo: p.isVideo,
      post: archivePost(handle, i),
    })),
  }
}
