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

// ── Invented friends' photo sets ─────────────────────────────────────────
// Each invented friend posts from one photo set whose subject matches theirs,
// so their feed post and profile grid look like one person's account. A set
// is an account name or a blog-post prefix (date_account). Sets are reserved:
// their photos never appear under a real account. `lead` picks the photo
// used for the friend's feed post (default: the set's first photo).

export const FRIEND_SETS = {
  'marcus.h':       { from: ['christian_foto'] },
  'julia.creates':  { from: ['jadeantoine'] },
  'alex.wanderer':  { from: ['chefyash'] },
  'sarah.moments':  { from: ['liaselina'], lead: '2016-05-01_liaselina_o6ifm73.jpg' },
  'mike.film':      { from: ['danoziontifik'], lead: '2016-03-30_danoziontifik_o4uz4l5.jpg' },
  'outdoor.vibes':  { from: ['ssazanovich'], lead: '2016-04-19_ssazanovich_o5w8f63.jpg' },
  'studio.light':   { from: ['bali_ayu'] },
  'city.frames':    { from: ['corasacher'], lead: '2016-03-28_corasacher_o4r60j4.jpg' },
  'lens.folk':      { from: ['asmitaparelkar'] },
  // #WHPfamilyfeast, Nov 2016: food and family meals
  'bakes.and.more': { from: ['2016-11-18_instagram', '2016-11-21_instagram'] },
  // #WHPthisishome, Nov 2016: home life; the lead is the empty living room
  'daniela.reyes':  { from: ['2016-11-25_instagram', '2016-11-28_instagram'] },
  // #WHPescape, Nov 2016: getaways
  'travel.tales':   { from: ['2016-11-04_instagram'] },
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
const isReserved = p => AD_FILES.has(p.name) ||
  Object.values(FRIEND_SETS).some(set => set.from.some(e => inSet(p, e)))

/** A friend's photo URLs, lead photo first. Excludes ad photos. */
export function friendPhotos(username) {
  const set = FRIEND_SETS[username]
  if (!set) return []
  const photos = ALL.filter(p => set.from.some(e => inSet(p, e)) && !AD_FILES.has(p.name))
  const lead = set.lead ? photos.findIndex(p => p.name === set.lead) : 0
  if (lead > 0) photos.unshift(photos.splice(lead, 1)[0])
  return photos.map(p => p.url)
}

/** URL of an ad's reserved photo. */
export function adPhoto(username) {
  const name = AD_PHOTOS[username]
  const p = name && ALL.find(x => x.name === name)
  return p ? p.url : null
}

/** Every photo usable for real accounts: { url, account, date }, oldest
    first. Skips sub-640px photos and anything reserved for friends or ads. */
export const LIBRARY = ALL
  .filter(p => p.date <= CUTOFF && ACCOUNTS[p.account] && !isReserved(p))
  .sort((a, b) => (a.date + a.url).localeCompare(b.date + b.url))

// Per account: newest blog post first, and within a post the blog's own
// order (photo 1 is the lead image).
const BY_ACCOUNT = {}
LIBRARY.forEach(p => { (BY_ACCOUNT[p.account] ||= []).push(p) })
Object.keys(BY_ACCOUNT).forEach(a => {
  BY_ACCOUNT[a] = BY_ACCOUNT[a]
    .sort((x, y) => (y.date.localeCompare(x.date)) || x.url.localeCompare(y.url))
    .map(p => p.url)
})

/** All photo URLs for an account, newest post first. */
export function libraryPhotos(account) {
  return (BY_ACCOUNT[account] || []).slice()
}

/** The account's avatar: the lead photo of its earliest post. */
export function libraryAvatar(account) {
  const lib = LIBRARY.find(p => p.account === account)
  return lib ? lib.url : null
}

export function isLibraryAccount(username) {
  return !!(ACCOUNTS[username] && BY_ACCOUNT[username])
}

/**
 * Explore order: round-robin across accounts, so neighbouring tiles come from
 * different people. [{ url, account }]
 */
export const EXPLORE_ORDER = (() => {
  const queues = Object.keys(BY_ACCOUNT).map(a => BY_ACCOUNT[a].map(url => ({ url, account: a })))
  const out = []
  for (let round = 0; queues.some(q => q.length); round++) {
    queues.forEach(q => { if (q.length) out.push(q.shift()) })
  }
  return out
})()
