// src/components/feed/feedData.js
// Content for the 2015 Instagram feed.
//
// Photos: drop files into /assets/feed/ and reference them by filename in
// `photo` / `avatar`. Missing files fall back to the gradient / color below,
// so the feed renders either way.

import { ACCOUNTS, EXPLORE_ORDER, adPhoto, friendPhotos, isLibraryAccount, libraryAvatar, libraryPhotos, ownedPhotos, sourcePhoto } from './libraryData'

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
// `timestamp` is the 2015 short form shown at the right of the post header.
// BASE_POSTS are the player's (invented) friends and two ads; real accounts
// they follow are woven in below as POSTS.

const FRIEND_PHOTO_LEAD = username => friendPhotos(username)[0] || null

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
    timestamp: '2h',
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
    timestamp: '3h',
    avatarColor: '#a18cd1',
    initial: 'J',
  },
  {
    id: 4,
    username: 'alex.wanderer',
    photo: 'post-alex-lisbon.jpg',
    avatar: 'avatar-alex-wanderer.jpg',
    imageGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    likes: '541',
    caption: 'Mumbai at first light. Already planning the next trip back. #travel #vscocam',
    commentCount: 31,
    comments: [{ username: 'mia.c', text: '@alex.wanderer take me next time' }],
    timestamp: '5h',
    avatarColor: '#fda085',
    initial: 'A',
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
    timestamp: '6h',
    avatarColor: '#ff9a9e',
    initial: 'S',
  },
  {
    id: 6,
    username: 'mike.film',
    photo: 'post-mike-35mm.jpg',
    avatar: 'avatar-mike-film.jpg',
    imageGradient: 'linear-gradient(135deg, #2d3561 0%, #c05c7e 100%)',
    likes: '1,088',
    caption: 'shot on 35mm. Every roll is a surprise until you get it developed.',
    commentCount: 67,
    comments: [
      { username: 'lens.folk', text: 'Portra?' },
      { username: 'mike.film', text: '@lens.folk Portra 400 🙌' },
    ],
    timestamp: '7h',
    avatarColor: '#c05c7e',
    initial: 'M',
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
  {
    id: 9,
    username: 'outdoor.vibes',
    photo: 'post-outdoor-trail.jpg',
    avatar: 'avatar-outdoor-vibes.jpg',
    imageGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    likes: '763',
    caption: 'Fresh snow and nobody around for miles ❄️ #optoutside',
    commentCount: 22,
    comments: [],
    timestamp: '10h',
    avatarColor: '#43e97b',
    initial: 'O',
  },
  {
    id: 10,
    username: 'studio.light',
    photo: 'post-studio-minimal.jpg',
    avatar: 'avatar-studio-light.jpg',
    imageGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    likes: '521',
    caption: 'Everything in its place.',
    commentCount: 14,
    comments: [],
    timestamp: '11h',
    avatarColor: '#607d8b',
    initial: 'S',
  },
  {
    id: 11,
    username: 'city.frames',
    photo: 'post-city-geometry.jpg',
    avatar: 'avatar-city-frames.jpg',
    imageGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    likes: '1,876',
    caption: 'Urban geometry. The city never looks better than at 5am.',
    commentCount: 58,
    comments: [{ username: 'marcus.h', text: '🔥🔥' }],
    timestamp: '12h',
    avatarColor: '#2c5364',
    initial: 'C',
  },
  {
    id: 12,
    username: 'bakes.and.more',
    photo: 'post-bakes-sourdough.jpg',
    avatar: 'avatar-bakes-and-more.jpg',
    imageGradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    likes: '3,204',
    caption: "Pastry attempt #47. I think we're getting somewhere. 🥐",
    commentCount: 112,
    comments: [
      { username: 'cafe.list', text: 'recipe pls' },
      { username: 'nadia_s', text: 'ok this one actually looks good' },
    ],
    timestamp: '13h',
    avatarColor: '#e17055',
    initial: 'B',
  },
  // TARGET: the friend's post, buried deep in the feed
  {
    id: 13,
    username: 'daniela.reyes',
    isTarget: true,
    photo: 'post-daniela-house.jpg',
    avatar: 'avatar-daniela-reyes.jpg',
    imageGradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 60%, #e6a817 100%)',
    likes: '847',
    caption: 'we bought a house!! 🏡 keys in hand after eight months of paperwork. the empty living room i already love. thank you to everyone who talked us off the ledge 😭',
    commentCount: 134,
    comments: [
      { username: 'j.okafor', text: 'CONGRATS!!! 🎉🎉' },
      { username: 'mia.c', text: '@daniela.reyes housewarming when??' },
    ],
    timestamp: '14h',
    avatarColor: '#fdcb6e',
    initial: 'D',
  },
  {
    id: 14,
    username: 'travel.tales',
    photo: 'post-travel-santorini.jpg',
    avatar: 'avatar-travel-tales.jpg',
    imageGradient: 'linear-gradient(135deg, #fd7043 0%, #ffb74d 100%)',
    likes: '692',
    caption: "Weekend escape. Did not want to come back. ✈️",
    commentCount: 29,
    comments: [],
    timestamp: '15h',
    avatarColor: '#ff7043',
    initial: 'T',
  },
  {
    id: 16,
    username: 'lens.folk',
    photo: 'post-lens-analog.jpg',
    avatar: 'avatar-lens-folk.jpg',
    imageGradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    likes: '1,102',
    caption: 'Analog is not dead. It just takes longer. Worth it every time.',
    commentCount: 45,
    comments: [{ username: 'mike.film', text: '🙏' }],
    timestamp: '17h',
    avatarColor: '#55efc4',
    initial: 'L',
  },

]

// Point each friend's post at the lead photo of their set, and each ad at its
// reserved photo. The old post-*.jpg files are no longer used.
BASE_POSTS.forEach(p => {
  const src = FRIEND_PHOTO_LEAD(p.username) || adPhoto(p.username)
  if (src) p.imageSrc = src
})

// Real accounts the player follows, placed after the friend post with `after`.
// `photo` indexes the account's photos, newest first.
const FOLLOWED_REAL = [
  { after: 1, account: 'sfmoma', photo: 0, timestamp: '2h',
    comments: [{ username: 'julia.creates', text: 'can’t wait 😍' }] },
  { after: 3, account: 'hummingbirdsxoxo', photo: 0, timestamp: '4h' },
  { after: 5, account: 'thejoshuatreehouse', photo: 0, timestamp: '6h',
    comments: [{ username: 'alex.wanderer', text: 'adding this to the list' }] },
  { after: 9, account: 'acacia.johnson', photo: 0, timestamp: '9h' },
  { after: 10, account: 'instagram', photo: 0, timestamp: '11h' },
  { after: 12, account: 'lucacappuccinodonofrio', photo: 0, timestamp: '13h',
    comments: [{ username: 'bakes.and.more', text: 'teach me 🙏' }] },
  { after: 14, account: 'otntty', photo: 0, timestamp: '15h' },
  { after: 16, account: 'theoregonduck', photo: 0, timestamp: '17h' },
]

export const POSTS = BASE_POSTS.flatMap(post => {
  const real = FOLLOWED_REAL
    .filter(r => r.after === post.id && isLibraryAccount(r.account))
    .map(r => {
      const url = libraryPhotos(r.account)[r.photo]
      return libraryPost(r.account, url, {
        timestamp: r.timestamp,
        ...(r.comments ? { comments: r.comments } : {}),
      })
    })
  return [post, ...real]
})

// ── Who the player follows ──────────────────────────────────────────────────
// Everyone whose posts reach the home feed, except the ads.

export const FOLLOWING = new Set(POSTS.filter(p => !p.isSponsored).map(p => p.username))

export function isFollowing(username) {
  return FOLLOWING.has(username)
}

/** A friend's feed photo, by username (for activity thumbnails). */
function friendPhoto(username) {
  return FRIEND_PHOTO_LEAD(username)
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
export function exploreTile(n) {
  // Public builds ship without the photo library: plain tiles instead.
  if (!EXPLORE_ORDER.length) {
    const hues = ['#d8d2c8', '#c9d3d8', '#d6cfd9', '#cfd8cc', '#ddd3c6', '#c8ccd6']
    return { id: 'explore-' + n, image: null, gradient: hues[n % hues.length], isVideo: false, post: null }
  }
  const item = EXPLORE_ORDER[n % EXPLORE_ORDER.length]
  // Video tiles already carry Instagram's camcorder badge in the image.
  const post = isLibraryAccount(item.account)
    ? libraryPost(item.account, item.url)
    : getProfile(item.account).grid.find(t => t.image === item.url)?.post
  return { id: 'explore-' + n, image: item.url, isVideo: false, post }
}

// ── Profiles ───────────────────────────────────────────────────────────────

const FEED_PROFILES = {
  'marcus.h': { name: 'Marcus Hale', bio: 'Photographer. Portraits in natural light.\nBrooklyn, NY', website: 'marcushale.com' },
  'julia.creates': { name: 'Julia Ortega', bio: 'paintings + illustrations\nshop link below 🎨', website: 'juliacreates.etsy.com' },
  'alex.wanderer': { name: 'Alex Wanderer', bio: 'slow travel. currently: Mumbai.' },
  'sarah.moments': { name: 'Sarah Lin', bio: 'tea, sketchbooks, and quiet mornings ☕✏️' },
  'mike.film': { name: 'Mike Ferraro', bio: '35mm only. Portra forever.\nChicago' },
  'coffee.culture': { name: 'Coffee Culture', bio: 'The best cups in every city.\nTag us #coffeeculture', website: 'coffeeculture.co' },
  'outdoor.vibes': { name: 'Outdoor Vibes', bio: 'Outside in every season ❄️ #optoutside' },
  'studio.light': { name: 'Studio Light', bio: 'Still life. Old tools and found objects.' },
  'city.frames': { name: 'City Frames', bio: 'Urban geometry at 5am. Stuttgart.' },
  'bakes.and.more': { name: 'Priya Bakes', bio: 'Cooking for the people I love.\nRecipes on the blog', website: 'bakesandmore.blog' },
  'daniela.reyes': { name: 'Daniela Reyes', bio: 'new homeowner 🏡 (!!!)\nAustin, TX' },
  'travel.tales': { name: 'Travel Tales', bio: 'Weekend escapes.' },
  'morning.run': { name: 'Morning Run', bio: '6 miles before sunrise. Every day.' },
  'lens.folk': { name: 'Lens Folk', bio: 'Analog is not dead. Mumbai.' },
  'home.spaces': { name: 'Home Spaces', bio: 'Corners worth sitting in.' },
  'pnw.shots': { name: 'PNW Shots', bio: 'Pacific Northwest, all 3 sunny days of it.' },
  'airbnb': { name: 'Airbnb', bio: 'Belong anywhere.', website: 'airbnb.com' },
  'warbyparker': { name: 'Warby Parker', bio: 'Glasses, sunglasses, and a home try-on.', website: 'warbyparker.com' },
  'nadia_s': { name: 'Nadia Saleh', bio: 'mostly food, sometimes sky' },
  'j.okafor': { name: 'Jordan Okafor', bio: 'Austin. Tacos. Dogs.' },
  'mia.c': { name: 'Mia Chen', bio: 'housewarming committee chair, apparently' },
  'pete.photo': { name: 'Pete Novak', bio: 'gear nerd. ask me about lenses' },
  'cafe.list': { name: 'The Cafe List', bio: 'Every cafe worth the walk.' },
}

function avatarFor(username) {
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

  const known = FEED_PROFILES[username] || EXPLORE_USERS.find(u => u.username === username) || {}
  const feedPosts = POSTS.filter(p => p.username === username)
  const isBrand = feedPosts.some(p => p.isSponsored)

  // Invented accounts: a friend's own set first (lead photo is their feed
  // post), filled out with same-subject photos; an ad shows its one photo.
  const set = isBrand ? feedPosts.map(p => p.imageSrc).filter(Boolean) : friendPhotos(username)
  const own = set
  const grid = own.map((image, i) => {
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
        timestamp: `${1 + (i % 6)}${i < 3 ? 'd' : 'w'}`,
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
  const photos = ownedPhotos(account)
  return idx.map(i => photos[i]).filter(Boolean)
}

/** A friend's own feed photo, as a one-thumbnail list. */
function friend(username) {
  return [friendPhoto(username)].filter(Boolean)
}

export const FOLLOWING_ACTIVITY = [
  { id: 'f1', actor: 'marcus.h', segments: ['liked ', { user: 'julia.creates' }, "'s photo."], time: '12m', thumbs: friend('julia.creates') },
  { id: 'f2', actor: 'daniela.reyes', segments: ['started following ', { user: 'j.okafor' }, ', ', { user: 'mia.c' }, ' and 3 others.'], time: '26m' },
  { id: 'f3', actor: 'mike.film', segments: ['liked 3 photos.'], time: '41m', thumbs: [...lib('julia.creates', 1), ...lib('lens.folk', 1), ...lib('sfmoma', 2)] },
  { id: 'f4', actor: 'nadia_s', segments: ['liked ', { user: 'hummingbirdsxoxo' }, "'s video."], time: '55m', thumbs: lib('hummingbirdsxoxo', 1) },
  { id: 'f5', actor: 'sarah.moments', segments: ['started following ', { user: 'thejoshuatreehouse' }, '.'], time: '1h' },
  { id: 'f6', actor: 'alex.wanderer', segments: ['liked 2 photos.'], time: '2h', thumbs: [...friendPhotos('city.frames').slice(1, 2), ...friendPhotos('outdoor.vibes').slice(1, 2)] },
  { id: 'f7', actor: 'outdoor.vibes', segments: ['liked ', { user: 'acacia.johnson' }, "'s photo."], time: '3h', thumbs: lib('acacia.johnson', 1) },
  { id: 'f8', actor: 'julia.creates', segments: ['started following ', { user: 'otntty' }, '.'], time: '5h' },
  { id: 'f9', actor: 'city.frames', segments: ['liked 4 photos.'], time: '6h', thumbs: [...lib('sfmoma', 1, 3), ...lib('otntty', 1), ...lib('acacia.johnson', 2)] },
]

export const YOU_ACTIVITY = [
  { id: 'y1', actor: 'daniela.reyes', segments: ['started following you.'], time: '2d', follow: true },
  { id: 'y2', actor: 'j.okafor', segments: ['started following you.'], time: '5d', follow: true },
]

/** New likes that arrive while the player scrolls the feed, in order. */
export const TRICKLE_ACTIVITY = [
  { id: 't1', actor: 'daniela.reyes', segments: ['liked ', { user: 'marcus.h' }, "'s photo."], time: '1m', thumbs: friend('marcus.h') },
  { id: 't2', actor: 'julia.creates', segments: ['liked 2 photos.'], time: '1m', thumbs: lib('otntty', 0, 1) },
  { id: 't3', actor: 'nadia_s', segments: ['liked ', { user: 'lucacappuccinodonofrio' }, "'s photo."], time: '1m', thumbs: lib('lucacappuccinodonofrio', 1) },
  { id: 't4', actor: 'mike.film', segments: ['liked ', { user: 'sfmoma' }, "'s photo."], time: '1m', thumbs: lib('sfmoma', 0) },
  { id: 't5', actor: 'outdoor.vibes', segments: ['liked 3 photos.'], time: '1m', thumbs: lib('thejoshuatreehouse', 0, 1, 2) },
]
