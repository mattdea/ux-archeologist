// src/components/feed/libraryData.js
// Real accounts and photos from Instagram's own blog, Jan–May 2016
// (assets/feed/library/, listed in index.csv with archive.org sources).
//
// Filenames are `YYYY-MM-DD_<account>_<id>.jpg`. Only accounts listed in
// ACCOUNTS below are used, and only photos dated on or before 10 May 2016
// (the day before the redesign). Left out on purpose:
//   - anything later than May 2016 (late-2016 @instagram, chocolateforbasil,
//     uglyproduceisbeautiful)
//   - celebrities, so the level doesn't invent captions for famous people
//     (champagnepapi, justsza, virgilabloh, jacobwhitesides, braxtonmiller92,
//     joythebaker's Drake cake)
//   - crisis photojournalism (sergeyponomarev, arthurbondar, theworldwidetribe)
//   - a minor (filipbalos.art)
//
// Names and bios paraphrase each account's blog story. Captions are short,
// generic lines written for the level, not the accounts' real captions.
//
// Some sets are reserved for the invented friends (FRIEND_SETS below) and for
// the ads; those never appear under a real account's name.

import { SKIP } from './libraryQuality'

const FILES = import.meta.glob('../../../assets/feed/library/*.jpg', {
  eager: true,
  import: 'default',
})

const CUTOFF = '2016-05-10'

export const ACCOUNTS = {
  instagram: {
    name: 'Instagram', followers: '84.6m', following: 194,
    bio: 'Discovering — and telling — stories from around the world.',
    captions: ['From this weekend’s hashtag project. Thanks to everyone who took part! 🎉', 'This week on the blog: stories from our community. 📷'],
  },
  music: {
    name: 'Instagram Music', followers: '3.1m', following: 211,
    bio: 'Music on Instagram. Monthly Hashtag Project: #MHPsoundandstyle',
    captions: ['Featured from this month’s #MHPsoundandstyle 🎶'],
  },
  sfmoma: {
    name: 'SFMOMA', followers: '402k', following: 312, website: 'sfmoma.org',
    bio: 'San Francisco Museum of Modern Art. Reopening May 14, 2016.',
    captions: ['Two weeks to go. #newSFMOMA', 'Finishing touches. See you May 14. #newSFMOMA'],
  },
  hummingbirdsxoxo: {
    name: 'Tracy', followers: '61.2k', following: 287,
    bio: 'Backyard bird paparazzo 🐦 Hummingbird photos + videos.',
    captions: ['Morning regular at the feeder 🐦', 'This little one stayed for almost a minute 💚'],
  },
  thejoshuatreehouse: {
    name: 'The Joshua Tree House', followers: '88.9k', following: 402, website: 'thejoshuatreehouse.com',
    bio: 'At home in the high desert. Joshua Tree, CA 🌵',
    captions: ['Desert mornings 🌵', 'Golden hour from the porch.'],
  },
  'acacia.johnson': {
    name: 'Acacia Johnson', followers: '24.7k', following: 618,
    bio: 'Photographer. Polar regions ❄️ Alaska → Antarctica',
    captions: ['Antarctica, through the porthole. ❄️', 'Ice for days.'],
  },
  otntty: {
    name: 'Tetsuya', followers: '33.5k', following: 156,
    bio: 'Workshop. Simple things, made by hand.',
    captions: ['New pieces drying in the workshop.', 'Simple shapes.'],
  },
  lucacappuccinodonofrio: {
    name: 'Luca', followers: '19.8k', following: 344,
    bio: 'Pasta as an art 🍝 Eataly',
    captions: ['Today’s shapes 🍝', 'Made by hand this morning.'],
  },
  theoregonduck: {
    name: 'The Oregon Duck', followers: '71.3k', following: 120,
    bio: 'Official mascot of the University of Oregon 🦆 #GoDucks',
    captions: ['#MarchMadness mode 🏀🦆', 'Sideline views #GoDucks'],
  },
  patmcgrathreal: {
    name: 'Pat McGrath', followers: '892k', following: 1101,
    bio: 'Makeup artist. Backstage everywhere.',
    captions: ['Backstage in Paris 💄 #PFW'],
  },
  savagesband: {
    name: 'Savages', followers: '58.4k', following: 77,
    bio: 'Savages. London. Adore Life out now.',
    captions: ['Rehearsal.'],
  },
  tylersean13: {
    name: 'Tyler Powers', followers: '12.4k', following: 503,
    bio: 'Artist. #hiphopart',
    captions: ['New piece #hiphopart'],
  },
  jadeantoine: {
    name: 'Jade Antoine', followers: '9,812', following: 410,
    bio: 'Illustrations. Shop link below.',
    captions: ['New illustration in the shop ✏️'],
  },
  andyshauf: {
    name: 'Andy Shauf', followers: '14.1k', following: 221,
    bio: 'Musician. Saskatchewan. The Party, May 20.',
    captions: ['Practice space.'],
  },
  tatiana_mc_garry: {
    name: 'Tatiana McGarry', followers: '27.6k', following: 389,
    bio: 'Watercolors 🎨',
    captions: ['Happy St. Patrick’s Day ☘️ #watercolor'],
  },
  sashabarr: {
    name: 'Sasha Barr', followers: '8,206', following: 640,
    bio: 'Art director at Sub Pop Records.',
    captions: ['Cassette day at the office #subpop'],
  },
  hombre_mcsteez: {
    name: 'Hombre McSteez', followers: '186k', following: 301,
    bio: 'Animated doodles. Stop-motion goofiness.',
    captions: ['Tissue trouble 🤧 #stopmotion'],
  },
  asmitaparelkar: {
    name: 'Asmita Parelkar', followers: '21.9k', following: 455,
    bio: 'Photographer. Calm in the chaos. Mumbai',
    captions: ['Quiet corner of the city.'],
  },
  paperfashion: {
    name: 'Katie Rodgers', followers: '402k', following: 711, website: 'paperfashion.net',
    bio: 'Paper Fashion. Paint + fabric.',
    captions: ['Paint meets fabric 🎨'],
  },
  kyson_eye: {
    name: 'Kyson', followers: '18.3k', following: 266,
    bio: 'Electronic producer. Tiny moments.',
    captions: ['tiny moments'],
  },
  mangaday: {
    name: 'mangaday', followers: '45.0k', following: 98,
    bio: 'Sketches of the things I can’t say.',
    captions: ['today’s sketch'],
  },
  mac_daddyy: {
    name: 'Angel Merino', followers: '1.2m', following: 802,
    bio: 'Makeup artist ✨',
    captions: ['Today’s look ✨'],
  },
  esposin: {
    name: 'Nicola', followers: '36.8k', following: 512,
    bio: 'Masks + alter egos.',
    captions: ['Who is it today? 🐰'],
  },
  wolfordroger: {
    name: 'Roger Wolford', followers: '6,941', following: 188,
    bio: 'Carved eggs 🥚',
    captions: ['Happy Easter 🥚 #eggcarving'],
  },
  corasacher: {
    name: 'Cora Sacher', followers: '52.5k', following: 377,
    bio: 'Stuttgart & Heidelberg. Street photography.',
    captions: ['Stuttgart afternoon.'],
  },
  ericunderwood: {
    name: 'Eric Underwood', followers: '67.0k', following: 430,
    bio: 'Dancer. London.',
    captions: ['Rehearsal day.'],
  },
  pondlife_pondlife: {
    name: 'Pond Life', followers: '11.7k', following: 75,
    bio: 'New York City’s waters, under the microscope 🔬',
    captions: ['Found in a Central Park pond 🔬'],
  },
  danoziontifik: {
    name: 'Dano', followers: '41.2k', following: 289,
    bio: 'Ziontifik. Buenos Aires.',
    captions: ['Lines.'],
  },
  '8bithiphop': {
    name: '8-Bit Hip Hop', followers: '23.4k', following: 12,
    bio: 'Rappers in 8-bit. #hiphopart',
    captions: ['Player select 🎮 #hiphopart'],
  },
  mayaraefe: {
    name: 'Mayara', followers: '96.6k', following: 522,
    bio: 'Love everything you are. #MyStory',
    captions: ['#MyStory'],
  },
  mimphx: {
    name: 'Musical Instrument Museum', followers: '9,318', following: 240, website: 'mim.org',
    bio: 'Phoenix, AZ. Instruments from every country in the world.',
    captions: ['From the collection 🎻'],
  },
  phannapast: {
    name: 'Phannapast', followers: '74.9k', following: 360,
    bio: 'Designs + illustrations. Animals playing dress-up.',
    captions: ['Dressed for the weekend 🐦'],
  },
  christian_foto: {
    name: 'Christian', followers: '15.6k', following: 610,
    bio: 'Portraits. Fact and fantasy.',
    captions: ['Portrait series.'],
  },
  chefyash: {
    name: 'Yash', followers: '13.0k', following: 395,
    bio: 'Mumbai’s hidden sanctuaries.',
    captions: ['Found a quiet spot.'],
  },
  'p.hil': {
    name: 'Phil Shaw', followers: '29.4k', following: 701,
    bio: 'Music photographer.',
    captions: ['Last night 🎤'],
  },
  jameslenger: {
    name: 'James Lenger', followers: '8,770', following: 512,
    bio: 'Modern pentathlon 🤺🏊🏃',
    captions: ['Fencing block this morning 🤺'],
  },
  richardahnert: {
    name: 'Richard Ahnert', followers: '22.1k', following: 344,
    bio: 'Artist. Man and the natural world.',
    captions: ['New work.'],
  },
  ssazanovich: {
    name: 'Ksenia', followers: '38.8k', following: 280,
    bio: 'Siberia ❄️',
    captions: ['Snow everywhere ❄️'],
  },
  yuki__fujisawa: {
    name: 'Yuki Fujisawa', followers: '12.9k', following: 233,
    bio: 'Old apparel, made new.',
    captions: ['Reworked.'],
  },
  la_mayte: {
    name: 'Paola', followers: '30.2k', following: 418,
    bio: 'Dreaming of a more inclusive world.',
    captions: ['Today 💛'],
  },
  kuraevaolga: {
    name: 'Olga Kuraeva', followers: '48.5k', following: 307,
    bio: 'Ballet dancer.',
    captions: ['Onstage.'],
  },
  thecuadro: {
    name: 'The Cuadro', followers: '7,445', following: 190,
    bio: 'Collages.',
    captions: ['Guests of honor ✂️'],
  },
  honoluluchris: {
    name: 'Christopher Lee', followers: '19.1k', following: 452,
    bio: 'Music photographer. Backstage.',
    captions: ['Backstage.'],
  },
  liaselina: {
    name: 'Lia Selina', followers: '83.2k', following: 266,
    bio: 'Illustrator. Fairy tales.',
    captions: ['Once upon a time ✨'],
  },
  thehatgirls: {
    name: 'The Hat Girls', followers: '10.4k', following: 301,
    bio: 'Hats for the Kentucky Derby 🐎',
    captions: ['Derby ready 🐎 #KentuckyDerby'],
  },
  soraceballos: {
    name: 'Sora Ceballos-Lopez', followers: '25.0k', following: 344,
    bio: 'Illustrations about motherhood.',
    captions: ['Every day is Mother’s Day.'],
  },
  jhnmclghln: {
    name: 'John McLaughlin', followers: '16.3k', following: 278,
    bio: 'Human, honest, humorous things.',
    captions: ['What a time to be alive.'],
  },
  bali_ayu: {
    name: 'Maki', followers: '11.9k', following: 205,
    bio: 'Vintage tools, brought back to life.',
    captions: ['Restored this week.'],
  },
}

// ── Who owns which photo ─────────────────────────────────────────────────
// Every photo on screen belongs to exactly one account, so no image ever
// appears in two grids. Owners are the accounts in the player's feed: the
// invented friends and the real accounts they follow. Each owner keeps its
// own photos, then same-subject photos from library accounts that don't
// appear in the level are dealt out to fill its grid (fewest-first, up to
// GRID_CAP). Those source accounts never appear as names on screen.

export const GRID_CAP = 24

// Invented friends. `from` = their own set (account name or date_account
// blog-post prefix); `lead` = the photo used for their feed post.
export const FRIEND_SETS = {
  'marcus.h':       { from: ['christian_foto'], topic: 'people' },
  'julia.creates':  { from: ['jadeantoine'], topic: 'art' },
  'alex.wanderer':  { from: ['chefyash'], topic: ['city', 'people'] },
  'sarah.moments':  { from: ['liaselina'], topic: 'art', lead: '2016-05-01_liaselina_o6ifm73.jpg' },
  'mike.film':      { from: ['danoziontifik'], topic: 'music', lead: '2016-03-30_danoziontifik_o4uz4l5.jpg' },
  'outdoor.vibes':  { from: ['ssazanovich'], topic: ['nature', 'sport'], lead: '2016-04-19_ssazanovich_o5w8f63.jpg' },
  'studio.light':   { from: ['bali_ayu'], topic: ['home', 'art'] },
  'city.frames':    { from: ['corasacher'], topic: ['city', 'style'], lead: '2016-03-28_corasacher_o4r60j4.jpg' },
  'lens.folk':      { from: ['asmitaparelkar'], topic: 'style' },
  // #WHPfamilyfeast (Nov 2016) plus two food blog posts
  'bakes.and.more': { from: ['2016-11-18_instagram', '2016-11-21_instagram', 'chocolateforbasil', 'uglyproduceisbeautiful'], topic: 'food' },
  // #WHPthisishome (Nov 2016); the lead is the empty living room
  'daniela.reyes':  { from: ['2016-11-25_instagram', '2016-11-28_instagram'], topic: 'home' },
  // #WHPescape (Nov 2016)
  'travel.tales':   { from: ['2016-11-04_instagram'], topic: ['nature', 'people'] },
}

// Real accounts in the feed and the subject they draw extra photos from.
export const REAL_OWNERS = {
  sfmoma: ['city', 'art'],
  hummingbirdsxoxo: 'nature',
  thejoshuatreehouse: ['home', 'style'],
  'acacia.johnson': 'nature',
  lucacappuccinodonofrio: 'food',
  otntty: ['home', 'art'],
  theoregonduck: ['sport', 'people'],
  instagram: '*',             // lends some of its 49 to pools below; takes whatever is left over
}

// Source accounts (never shown as names) grouped by subject.
const POOLS = {
  art: ['phannapast', 'richardahnert', 'tatiana_mc_garry', 'mangaday', 'jhnmclghln', 'soraceballos',
    'paperfashion', 'hombre_mcsteez', 'tylersean13', 'thecuadro', '8bithiphop', 'esposin'],
  music: ['music', 'savagesband', 'p.hil', 'honoluluchris', 'andyshauf', 'kyson_eye', 'mimphx', 'sashabarr'],
  style: ['patmcgrathreal', 'mac_daddyy', 'yuki__fujisawa', 'thehatgirls', 'mayaraefe'],
  people: ['la_mayte', 'ericunderwood', 'kuraevaolga'],
  city: [],
  nature: ['pondlife_pondlife'],
  home: ['wolfordroger'],
  food: [],
  sport: ['jameslenger'],
}

// @instagram community photos lent to thin subjects (the rest stay its own).
const INSTAGRAM_LENT = {
  nature: [
    '2016-02-08_instagram_o290fp2.jpg',
    '2016-03-09_instagram_o3rsqu2.jpg',
    '2016-03-09_instagram_o3rsqu4.jpg',
    '2016-03-18_instagram_o4975s5.jpg',
    '2016-04-08_instagram_o5c2g01.jpg',
    '2016-04-18_instagram_o5uowo4.jpg',
    '2016-04-29_instagram_o6evyy5.jpg',
    '2016-05-09_instagram_o6xlga3.jpg',
  ],
  city: [
    '2016-02-08_instagram_o290fp3.jpg',
    '2016-03-18_instagram_o4975s2.jpg',
    '2016-03-18_instagram_o4975s3.jpg',
    '2016-03-28_instagram_o4rqxh3.jpg',
    '2016-04-08_instagram_o5c2g02.jpg',
    '2016-04-08_instagram_o5c2g03.jpg',
    '2016-04-08_instagram_o5c2g05.jpg',
    '2016-04-18_instagram_o5uowo5.jpg',
    '2016-04-29_instagram_o6evyy3.jpg',
  ],
  food: [
    '2016-02-08_instagram_o290fp4.jpg',
    '2016-04-08_instagram_o5c2g04.jpg',
  ],
  people: [
    '2016-01-22_instagram_o1dlfz1.jpg',
    '2016-01-22_instagram_o1dlfz2.jpg',
    '2016-03-07_instagram_o3p27s4.jpg',
    '2016-03-07_instagram_o3p27s5.jpg',
    '2016-03-07_instagram_o3p27s6.jpg',
    '2016-03-09_instagram_o3rsqu1.jpg',
    '2016-03-18_instagram_o4975s4.jpg',
    '2016-03-28_instagram_o4rqxh4.jpg',
    '2016-04-29_instagram_o6evyy4.jpg',
    '2016-05-06_instagram_o6rws91.jpg',
    '2016-05-06_instagram_o6rws94.jpg',
    '2016-05-06_instagram_o6rws95.jpg',
    '2016-05-09_instagram_o6xlga5.jpg',
  ],
}

// Single photos reserved for the two ads.
export const AD_PHOTOS = {
  airbnb: '2016-04-19_ssazanovich_o5w8f65.jpg',
}

// ── Photos ────────────────────────────────────────────────────────────────

const NAME_RE = /(\d{4}-\d{2}-\d{2})_(.+)_[a-z0-9]+\.jpg$/
const fileName = path => path.split('/').pop()

const ALL = Object.entries(FILES)
  .map(([path, url]) => {
    const name = fileName(path)
    const m = name.match(NAME_RE)
    return m && !SKIP.has(name) ? { url, name, date: m[1], account: m[2] } : null
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name))

const inSet = (p, entry) => p.account === entry || p.name.startsWith(entry + '_')
const AD_FILES = new Set(Object.values(AD_PHOTOS))
const LENT = new Set(Object.values(INSTAGRAM_LENT).flat())

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0 }
  return h
}

// Build the ownership table once: owner → [{ url, name, own }], own first.
const OWNED = (() => {
  const claimed = new Set(AD_FILES)
  const owned = {}
  const take = (owner, photos, own) => photos.forEach(p => {
    if (claimed.has(p.name)) return
    claimed.add(p.name)
    owned[owner].push({ url: p.url, name: p.name, own })
  })

  // 1. Own photos
  Object.entries(FRIEND_SETS).forEach(([u, set]) => {
    owned[u] = []
    let photos = ALL.filter(p => set.from.some(e => inSet(p, e)))
    const lead = set.lead ? photos.findIndex(p => p.name === set.lead) : 0
    if (lead > 0) photos = [photos[lead], ...photos.filter((_, i) => i !== lead)]
    take(u, photos, true)
  })
  Object.keys(REAL_OWNERS).forEach(u => {
    owned[u] = []
    // Newest blog post first; within a post, the blog's own order
    const photos = ALL
      .filter(p => p.account === u && p.date <= CUTOFF && !LENT.has(p.name))
      .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name))
    take(u, photos, true)
  })

  // 2. Deal each subject's spare photos to its owners, fewest first. An
  //    owner can draw from a second subject, e.g. @sfmoma also takes art.
  const topicOwners = {}
  const addOwner = (u, t) => [].concat(t || []).forEach(x => x !== '*' && (topicOwners[x] ||= []).push(u))
  Object.entries(FRIEND_SETS).forEach(([u, s]) => addOwner(u, s.topic))
  Object.entries(REAL_OWNERS).forEach(([u, t]) => addOwner(u, t))
  Object.entries(topicOwners).forEach(([topic, owners]) => {
    const spare = ALL
      .filter(p => !claimed.has(p.name) &&
        ((POOLS[topic] || []).some(e => inSet(p, e)) || (INSTAGRAM_LENT[topic] || []).includes(p.name)))
      .sort((a, b) => hash(topic + a.name) - hash(topic + b.name))
    spare.forEach(p => {
      const open = owners.filter(o => owned[o].length < GRID_CAP)
      if (!open.length) return
      open.sort((a, b) => owned[a].length - owned[b].length || a.localeCompare(b))
      take(open[0], [p], false)
    })
  })

  // 3. @instagram takes everything still unclaimed, with no cap: its real
  //    grid was a mix of community photos on every subject.
  const pooled = p => Object.values(POOLS).flat().some(e => inSet(p, e)) || LENT.has(p.name)
  ALL.filter(p => !claimed.has(p.name) && pooled(p))
    .sort((a, b) => hash('ig' + a.name) - hash('ig' + b.name))
    .forEach(p => take('instagram', [p], false))   // no cap: nothing goes unused
  return owned
})()

/** Every photo URL an account owns: its own first, then its share of extras. */
export function ownedPhotos(username) {
  return (OWNED[username] || []).map(p => p.url)
}

/** Only the account's own photos (no extras): for feed posts and avatars. */
export function libraryPhotos(account) {
  return (OWNED[account] || []).filter(p => p.own).map(p => p.url)
}

/** A friend's photos, lead first (own set, then extras). */
export function friendPhotos(username) {
  return FRIEND_SETS[username] ? ownedPhotos(username) : []
}

/** URL of an ad's reserved photo. */
export function adPhoto(username) {
  const name = AD_PHOTOS[username]
  const p = name && ALL.find(x => x.name === name)
  return p ? p.url : null
}

/** The account's avatar: the lead photo of its earliest own post. */
export function libraryAvatar(account) {
  const own = (OWNED[account] || []).filter(p => p.own)
  if (!own.length) return null
  return own.slice().sort((a, b) => a.name.localeCompare(b.name))[0].url
}

export function isLibraryAccount(username) {
  return !!(ACCOUNTS[username] && REAL_OWNERS[username] !== undefined && OWNED[username]?.length)
}

/** Who owns a photo URL, or null. */
export function ownerOf(url) {
  for (const [u, list] of Object.entries(OWNED)) if (list.some(p => p.url === url)) return u
  return null
}

/**
 * Explore order: every owned photo, round-robin across owners so
 * neighbouring tiles come from different accounts. [{ url, account }]
 */
export const EXPLORE_ORDER = (() => {
  const queues = Object.keys(OWNED).map(a => OWNED[a].map(p => ({ url: p.url, account: a })))
  const out = []
  while (queues.some(q => q.length)) queues.forEach(q => { if (q.length) out.push(q.shift()) })
  return out
})()

/** A photo from a source account (for hashtag thumbnails), wherever it ended up. */
export function sourcePhoto(account, match) {
  const p = ALL.find(x => x.account === account && (!match || x.name.includes(match)) && !AD_FILES.has(x.name))
  return p ? p.url : null
}
