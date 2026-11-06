// src/components/feed/archiveData.js
// Real Instagram accounts as they were in spring 2016, recovered from the
// Wayback Machine by scripts/recover-instagram-2016.py into
// assets/feed/archive/<handle>/ (gitignored, local only):
//   profile.json  bio, counts, and posts with real captions, likes, dates
//   <code>.jpg    the post's photo
//   avatar.jpg    profile picture (often not archived; falls back to
//                 assets/feed/profiles/avatars/<handle>.jpg)
//
// Builds without the folder (the public site) get an empty ARCHIVE and the
// level falls back to the blog library, then to plain color blocks.

const MANIFESTS = import.meta.glob('../../../assets/feed/archive/*/profile.json', {
  eager: true,
  import: 'default',
})
const PHOTOS = import.meta.glob('../../../assets/feed/archive/*/*.jpg', {
  eager: true,
  import: 'default',
})
const FALLBACK_AVATARS = import.meta.glob('../../../assets/feed/profiles/avatars/*.jpg', {
  eager: true,
  import: 'default',
})

const photoUrl = (handle, file) => PHOTOS[`../../../assets/feed/archive/${handle}/${file}`] || null
const fallbackAvatar = handle => FALLBACK_AVATARS[`../../../assets/feed/profiles/avatars/${handle}.jpg`] || null

/** handle → account. Posts newest first, only those whose photo was recovered. */
export const ARCHIVE = Object.fromEntries(
  Object.entries(MANIFESTS).map(([path, m]) => {
    const handle = path.split('/').slice(-2)[0]
    // A post's photo is the archived file, or <code>.jpg saved by hand into
    // the account's folder (for accounts whose photos were never archived).
    const posts = (m.posts || [])
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

// "Now" for relative timestamps: just after the newest archived post, so the
// feed reads as that day in May 2016.
const NEWEST = Math.max(0, ...ARCHIVE_HANDLES.flatMap(h => ARCHIVE[h].posts.map(p => p.date)))
export const ARCHIVE_NOW = NEWEST + 2 * 3600

/** 2016 short relative time: 3m, 5h, 2d, 3w. */
export function relativeTime(dateSec, now = ARCHIVE_NOW) {
  const s = Math.max(60, now - dateSec)
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d`
  return `${Math.floor(s / (7 * 86400))}w`
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
    timestamp: relativeTime(p.date),
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
