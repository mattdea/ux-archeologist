// src/components/feed/feedData.js
// Content for the 2016 Instagram feed.
//
// Photos come from three places:
//   - assets/feed/archive (gitignored): the Wayback-archived real accounts
//     (celebrities, brands, publishers) in the home feed, Explore and profiles.
//   - assets/feed/library (gitignored): the blog-library accounts, which also
//     supply the three library-backed friends, the ads and Explore.
//   - assets/feed/imani (committed): Imani Brooks's set, so the buried friend
//     post works on the public build.
// A photo that is missing on this machine falls back to the post's gradient.

import { ACCOUNTS, EXPLORE_ORDER, adPhoto, friendPhotos, isLibraryAccount, libraryAvatar, libraryPhotos, ownedPhotos, sourcePhoto } from './libraryData'
import { ARCHIVE, ARCHIVE_HANDLES, isArchiveAccount, archivePost, archiveProfile, gridTime } from './archiveData'

// Imani's photos are committed (Unsplash License, @aliounepic), so her post
// works on the public site that ships without the gitignored photo folders.
import imaniAvatar from '../../../assets/feed/imani/avatar.jpg'
import imaniPost from '../../../assets/feed/imani/post.jpg'
const IMANI_GRID = import.meta.glob('../../../assets/feed/imani/grid-*.jpg', { eager: true, import: 'default' })

// Her post first, then grid-01 … grid-20 in file order.
const IMANI_PHOTOS = [imaniPost, ...Object.keys(IMANI_GRID).sort().map(k => IMANI_GRID[k])]

/** A friend's photos, lead first: Imani's committed set, else the library set. */
const friendSet = username => username === 'imani.brooks' ? IMANI_PHOTOS : friendPhotos(username)

// Every image in /assets/feed/, keyed by filename ("living-room.jpg" → URL).
const FILES = import.meta.glob('../../../assets/feed/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const IMAGES = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.split('/').pop(), url])
)

/** Resolve a filename from /assets/feed/ to a URL, or null if it isn't there. */
export function feedImage(name) {
  return name && IMAGES[name] ? IMAGES[name] : null
}

// Small deterministic hash so every generated value is stable across renders.
export function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

// ── Real-account posts (assets/feed/library) ─────────────────────────────────

const EXPLORE_TIMES = ['3m', '12m', '28m', '41m', '1h', '2h', '3h', '5h', '6h', '9h', '14h', '1d']

/** A post by a real library account. Deterministic per photo, so the same
    photo shows the same likes and caption in the feed, Explore and profile. */
const EXTRA_CAPTIONS = ['📷', 'this light though', 'new favorite', 'can’t stop looking at this', 'a good day', 'saturday ✨', 'details', 'more soon']

export function libraryPost(account, url, overrides = {}) {
  const meta = ACCOUNTS[account]
  const h = hashString(url)
  const big = /m$|k$/.test(meta.followers)
  return {
    id: 'lib-' + h,
    username: account,
    imageSrc: url,
    avatar: libraryAvatar(account),
    avatarColor: '#dddddd',
    initial: account[0],
    likes: (big ? 4000 + (h % 90000) : 150 + (h % 3800)).toLocaleString('en-US'),
    // The account's own captions on its own photos; plain lines on extras
    caption: libraryPhotos(account).includes(url)
      ? meta.captions[h % meta.captions.length]
      : EXTRA_CAPTIONS[h % EXTRA_CAPTIONS.length],
    commentCount: big ? 60 + (h % 900) : 4 + (h % 80),
    comments: [],
    timestamp: EXPLORE_TIMES[h % EXPLORE_TIMES.length],
    ...overrides,
  }
}

// ── Posts ──────────────────────────────────────────────────────────────────
// `timestamp` is the 2016 short form shown at the right of the post header.
// BASE_POSTS are the player's four invented friends and two ads; the real
// accounts are listed in FEED_ORDER below.

const FRIEND_PHOTO_LEAD = username => friendSet(username)[0] || null

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

// Point each friend's post at the lead photo of their set, and each ad at a
// real photo of that brand from the archive (else its reserved library
// photo). The old post-*.jpg files are no longer used.
BASE_POSTS.forEach(p => {
  const ad = p.isSponsored && ARCHIVE[p.username] ? ARCHIVE[p.username].posts[0].url : null
  const src = FRIEND_PHOTO_LEAD(p.username) || ad || adPhoto(p.username)
  if (src) p.imageSrc = src
})

// ── The home feed ──────────────────────────────────────────────────────────
// 24 slots, hand-ranked the way the 2016 algorithm would have: big accounts
// up top, the player's friends spaced out, an ad early, and the friend's big
// news (imani.brooks) under three celebrities and the second ad. Real
// accounts show their newest archived post with its real caption and likes;
// one that has no photos on this machine is skipped, so the public build
// still gets the friends and the ads. 24 slots, each with the label its post
// shows, written to read like a ranked feed (not sorted); ads carry null.
export const FEED = [
  ['kimkardashian', '2h'], ['marcus.h', '1h'], ['selenagomez', '5h'], ['cristiano', '3h'], ['airbnb', null],
  ['justinbieber', '45m'], ['julia.creates', '8h'], ['natgeo', '2h'], ['kyliejenner', '4h'], ['beyonce', '11h'],
  ['gigihadid', '6h'], ['therock', '1h'], ['warbyparker', null], ['imani.brooks', '14h'], ['leomessi', '9h'],
  ['sarah.moments', '7h'], ['nasa', '3h'], ['kevinhart4real', '12h'], ['instagram', '5h'], ['badgalriri', '16h'],
  ['humansofny', '8h'], ['neymarjr', '1d'], ['theellenshow', '10h'], ['9gag', '19h'],
]
export const FEED_ORDER = FEED.map(([username]) => username)
export const FEED_TIMES = FEED.map(([, time]) => time)

const FEED_COMMENTS = {
  natgeo: [{ username: 'marcus.h', text: 'incredible' }],
  humansofny: [{ username: 'sarah.moments', text: '❤️' }],
  kimkardashian: [{ username: 'mia.c', text: 'iconic' }],
}

export const POSTS = FEED.flatMap(([username, timestamp]) => {
  const base = BASE_POSTS.find(p => p.username === username)
  const post = base || archivePost(username, 0, FEED_COMMENTS[username] ? { comments: FEED_COMMENTS[username] } : {})
  return post ? [{ ...post, timestamp }] : []
})

/** Older posts for the feed's n-th extra page (n ≥ 1): each real account's
    n-th most recent post, in FEED order, labelled gridTime(n) by archivePost
    so a page reads as one older day. Empty once every account has run out,
    which is when the feed's spinner goes away. */
export function feedPage(n) {
  return FEED.flatMap(([username]) => {
    if (BASE_POSTS.some(p => p.username === username)) return []
    const post = archivePost(username, n)
    return post ? [post] : []
  })
}

// ── Who the player follows ──────────────────────────────────────────────────
// Everyone whose posts reach the home feed, except the ads.

export const FOLLOWING = new Set(POSTS.filter(p => !p.isSponsored).map(p => p.username))

export function isFollowing(username) {
  return FOLLOWING.has(username)
}

// ── The player ─────────────────────────────────────────────────────────────

export const ME = {
  username: 'samtaylor',
  name: 'Sam Taylor',
  posts: 0,
  followers: 2,
  following: FOLLOWING.size,
}

// ── Explore ────────────────────────────────────────────────────────────────

// Real spring-2016 hashtags, each shown with a photo from the account that
// featured it on Instagram's blog.
export const TRENDING_TAGS = [
  { tag: '#WHPidentity', account: 'instagram', post: '2016-03-07' },
  { tag: '#hiphopart', account: '8bithiphop' },
  { tag: '#MarchMadness', account: 'theoregonduck' },
  { tag: '#KentuckyDerby', account: 'thehatgirls' },
  { tag: '#MHPsoundandstyle', account: 'music' },
  { tag: '#newSFMOMA', account: 'sfmoma', photo: 1 },
  { tag: '#PFW', account: 'patmcgrathreal' },
  { tag: '#stpatricksday', account: 'tatiana_mc_garry' },
  { tag: '#easter', account: 'wolfordroger' },
  { tag: '#mothersday', account: 'soraceballos' },
]
  .map(t => ({ tag: t.tag, src: sourcePhoto(t.account, t.post) }))

const EXPLORE_USERS = [
  { username: 'sunset.chaser', name: 'Kelsey Moran', color: '#e67e22', bio: 'chasing light. SF ↔ LA' },
  { username: 'kate_w', name: 'Kate Williams', color: '#8e44ad', bio: 'ceramics / coffee / cats' },
  { username: 'thebrooklynkitchen', name: 'The Brooklyn Kitchen', color: '#c0392b', bio: 'Small-batch everything. Williamsburg, NY' },
  { username: 'ryan.ok', name: 'Ryan Okamoto', color: '#16a085', bio: 'still learning' },
  { username: 'jess.outdoors', name: 'Jess Alvarez', color: '#27ae60', bio: 'hike more, worry less 🌲' },
  { username: 'nyc.streets', name: 'NYC Streets', color: '#2c3e50', bio: 'Daily photos from the five boroughs. Tag #nycstreets' },
  { username: 'oliviab', name: 'Olivia Bennett', color: '#d35400', bio: 'art history grad student' },
  { username: 'dan_shoots', name: 'Dan Fischer', color: '#34495e', bio: 'Canon 5D. Available for weddings.' },
  { username: 'maya.travels', name: 'Maya Singh', color: '#f39c12', bio: '27 countries and counting ✈️' },
  { username: 'theo.k', name: 'Theo Kaplan', color: '#7f8c8d', bio: 'design + music. Portland' },
  { username: 'summerdaze', name: 'Lauren P.', color: '#1abc9c', bio: 'beach > everything' },
  { username: 'festivalfeed', name: 'Festival Feed', color: '#9b59b6', bio: 'Every festival, every weekend.' },
]

const EXPLORE_CAPTIONS = [
  'summer is here ☀️ #startofsummer',
  'golden hour never gets old',
  'weekend mode 🙌',
  'throwback to this exact spot #tbt',
  'no filter needed #nofilter',
  'new favorite place',
  'views for days',
  'Sunday funday',
  'take me back 🌴',
  'this light though',
  'home sweet home',
  'finally warm enough for this #vscocam',
  'brb moving here',
  'the best kind of day',
  'friday feeling',
]

/** The n-th explore tile (0-based). Infinite: cycles the library, taking
    each next tile from a different account. */
// Every real account's photos, round-robin so neighbouring tiles come from
// different accounts: archive accounts first, then the blog library.
const EXPLORE_ALL = (() => {
  const queues = [
    ...ARCHIVE_HANDLES.map(h => ARCHIVE[h].posts.map((p, i) => ({ url: p.url, account: h, post: archivePost(h, i) }))),
    EXPLORE_ORDER.map(item => ({ ...item, post: null })),
  ]
  const out = []
  while (queues.some(q => q.length)) queues.forEach(q => { if (q.length) out.push(q.shift()) })
  return out
})()

export function exploreTile(n) {
  // Public builds ship without the photo library: plain tiles instead.
  if (!EXPLORE_ALL.length) {
    const hues = ['#d8d2c8', '#c9d3d8', '#d6cfd9', '#cfd8cc', '#ddd3c6', '#c8ccd6']
    return { id: 'explore-' + n, image: null, gradient: hues[n % hues.length], isVideo: false, post: null }
  }
  const item = EXPLORE_ALL[n % EXPLORE_ALL.length]
  // Library video tiles already carry Instagram's camcorder badge in the image.
  const post = item.post || (isLibraryAccount(item.account)
    ? libraryPost(item.account, item.url)
    : getProfile(item.account).grid.find(t => t.image === item.url)?.post)
  return { id: 'explore-' + n, image: item.url, isVideo: !!(item.post && item.post.isVideo), post }
}

// ── Profiles ───────────────────────────────────────────────────────────────

const FEED_PROFILES = {
  'marcus.h': { name: 'Marcus Hale', bio: 'Photographer. Portraits in natural light.\nBrooklyn, NY', website: 'marcushale.com' },
  'julia.creates': { name: 'Julia Ortega', bio: 'paintings + illustrations\nshop link below 🎨', website: 'juliacreates.etsy.com' },
  'sarah.moments': { name: 'Sarah Lin', bio: 'tea, sketchbooks, and quiet mornings ☕✏️' },
  'imani.brooks': { name: 'Imani Brooks', bio: 'portraits + fashion 📷\nDakar 🇸🇳 ↔ Oakland\nnew work + bookings: link below', website: 'imanibrooks.com' },
  'airbnb': { name: 'Airbnb', bio: 'Belong anywhere.', website: 'airbnb.com' },
  'warbyparker': { name: 'Warby Parker', bio: 'Glasses, sunglasses, and a home try-on.', website: 'warbyparker.com' },
  'nadia_s': { name: 'Nadia Saleh', bio: 'mostly food, sometimes sky' },
  'j.okafor': { name: 'Jordan Okafor', bio: 'Austin. Tacos. Dogs.' },
  'mia.c': { name: 'Mia Chen', bio: 'resident hype woman' },
  'pete.photo': { name: 'Pete Novak', bio: 'gear nerd. ask me about lenses' },
  'cafe.list': { name: 'The Cafe List', bio: 'Every cafe worth the walk.' },
}

function avatarFor(username) {
  if (isArchiveAccount(username)) return { avatar: ARCHIVE[username].avatar, avatarColor: '#dddddd', initial: username[0] }
  if (isLibraryAccount(username)) return { avatar: libraryAvatar(username), avatarColor: '#dddddd', initial: username[0] }
  const fromFeed = POSTS.find(p => p.username === username)
  if (fromFeed) return { avatar: fromFeed.avatar, avatarColor: fromFeed.avatarColor, initial: fromFeed.initial }
  const explore = EXPLORE_USERS.find(u => u.username === username)
  if (explore) return { avatar: null, avatarColor: explore.color, initial: username[0] }
  const hues = ['#4facfe', '#a18cd1', '#fda085', '#ff9a9e', '#c05c7e', '#43e97b', '#2c5364', '#e17055', '#fdcb6e']
  return { avatar: null, avatarColor: hues[hashString(username) % hues.length], initial: username[0] }
}

/** Full profile for any username: name, bio, counts, avatar, and a photo grid. */
export function getProfile(username) {
  const h = hashString(username)

  // Archived real accounts: everything as it was in spring 2016.
  if (isArchiveAccount(username)) return archiveProfile(username)

  // Real accounts: their own photos, in the order they posted them.
  if (isLibraryAccount(username)) {
    const meta = ACCOUNTS[username]
    // Own photos first, then this account's share of same-subject photos.
    // No photo is owned by two accounts, so no two grids repeat an image.
    const photos = ownedPhotos(username)
    return {
      username,
      name: meta.name,
      bio: meta.bio,
      website: meta.website || null,
      posts: photos.length,
      followers: meta.followers,
      following: meta.following,
      ...avatarFor(username),
      grid: photos.map(url => ({ id: 'grid-' + url, image: url, post: libraryPost(username, url) })),
    }
  }

  const known = FEED_PROFILES[username] || ACCOUNTS[username] || EXPLORE_USERS.find(u => u.username === username) || {}
  const feedPosts = POSTS.filter(p => p.username === username)
  const isBrand = feedPosts.some(p => p.isSponsored)

  // Invented accounts: a friend's own set first (lead photo is their feed
  // post), filled out with same-subject photos; an ad shows its one photo.
  const set = isBrand ? feedPosts.map(p => p.imageSrc).filter(Boolean) : friendSet(username)
  const grid = set.map((image, i) => {
    const feedPost = feedPosts.find(p => p.imageSrc === image)
    const ph = hashString(username + i)
    return {
      id: `grid-${username}-${i}`,
      image,
      post: feedPost || {
        id: `profile-post-${username}-${i}`,
        username,
        imageSrc: image,
        likes: (40 + (ph % 1800)).toLocaleString('en-US'),
        caption: EXPLORE_CAPTIONS[ph % EXPLORE_CAPTIONS.length],
        commentCount: 1 + (ph % 40),
        comments: [],
        timestamp: gridTime(i),
        ...avatarFor(username),
      },
    }
  })
  // The count matches the grid: every post shown, none claimed but missing.
  const postCount = isBrand ? 240 + (h % 900) : grid.length

  return {
    username,
    name: known.name || username,
    bio: known.bio || '',
    website: known.website || null,
    posts: postCount,
    followers: isBrand ? (120000 + (h % 900000)).toLocaleString('en-US') : (180 + (h % 4200)).toLocaleString('en-US'),
    following: isBrand ? (20 + (h % 300)) : (140 + (h % 900)),
    ...avatarFor(username),
    grid,
  }
}

// ── Activity ───────────────────────────────────────────────────────────────
// `text` segments: strings render plain, { user } renders a bold blue username.

/** Photos from a real account, newest first: lib('otntty', 0, 1). */
function lib(account, ...idx) {
  const photos = getProfile(account).grid.map(t => t.image)
  return idx.map(i => photos[i]).filter(Boolean)
}

/** First handle with photos on this machine; else the last one, which must be an account with a profile in every build (a kept friend or a library account). */
function pick(...handles) {
  return handles.find(h => isArchiveAccount(h) || isLibraryAccount(h)) || handles[handles.length - 1]
}
const NATURE = pick('natgeo', 'acacia.johnson')
const PETS = pick('itsdougthepug', 'hummingbirdsxoxo')
const SPACE = pick('nasa', 'sfmoma')
const FOOD = pick('thefeedfeed', 'sarah.moments')
const HOME = pick('muradosmann', 'otntty')

/** A friend's own feed photo, as a one-thumbnail list. */
function friend(username) {
  return [FRIEND_PHOTO_LEAD(username)].filter(Boolean)
}

export const FOLLOWING_ACTIVITY = [
  { id: 'f1', actor: 'marcus.h', segments: ['liked ', { user: 'julia.creates' }, "'s photo."], time: '12m', thumbs: friend('julia.creates') },
  { id: 'f2', actor: 'imani.brooks', segments: ['started following ', { user: 'j.okafor' }, ', ', { user: 'mia.c' }, ' and 3 others.'], time: '26m' },
  { id: 'f3', actor: 'j.okafor', segments: ['liked 3 photos.'], time: '41m', thumbs: [...lib(NATURE, 1), ...lib(PETS, 1), ...lib(SPACE, 2)] },
  { id: 'f4', actor: 'nadia_s', segments: ['liked ', { user: PETS }, "'s photo."], time: '55m', thumbs: lib(PETS, 1) },
  { id: 'f5', actor: 'sarah.moments', segments: ['started following ', { user: HOME }, '.'], time: '1h' },
  { id: 'f8', actor: 'julia.creates', segments: ['started following ', { user: SPACE }, '.'], time: '5h' },
  { id: 'f9', actor: 'mia.c', segments: ['liked 4 photos.'], time: '6h', thumbs: [...lib(SPACE, 1, 3), ...lib(HOME, 1), ...lib(NATURE, 3)] },
]

export const YOU_ACTIVITY = [
  { id: 'y1', actor: 'imani.brooks', segments: ['started following you.'], time: '2d', follow: true },
  { id: 'y2', actor: 'j.okafor', segments: ['started following you.'], time: '5d', follow: true },
]

/** New likes that arrive while the player scrolls the feed, in order. */
export const TRICKLE_ACTIVITY = [
  { id: 't1', actor: 'imani.brooks', segments: ['liked ', { user: 'marcus.h' }, "'s photo."], time: '1m', thumbs: friend('marcus.h') },
  { id: 't2', actor: 'julia.creates', segments: ['liked 2 photos.'], time: '1m', thumbs: lib('otntty', 0, 1) },
  { id: 't3', actor: 'nadia_s', segments: ['liked ', { user: FOOD }, "'s photo."], time: '1m', thumbs: lib(FOOD, 1) },
  { id: 't4', actor: 'mia.c', segments: ['liked ', { user: SPACE }, "'s photo."], time: '1m', thumbs: lib(SPACE, 0) },
]
