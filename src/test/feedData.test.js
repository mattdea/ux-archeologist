// src/test/feedData.test.js
// The real-account photos are gitignored, so these tests only assert on what
// holds with or without them: the invented friends, the ads, and the ordering.
import { POSTS, FEED, FEED_ORDER, FEED_TIMES, feedPage, buildFeed, hasProfile, FOLLOWING_ACTIVITY, YOU_ACTIVITY, TRICKLE_ACTIVITY, getProfile, exploreTile, PROFILE_ONLY } from '../components/feed/feedData'
import { ARCHIVE } from '../components/feed/archiveData'

describe('buildFeed(seed)', () => {
  const ads = ['airbnb', 'warbyparker']
  const slotOf = (posts, u) => posts.findIndex(p => p.username === u)
  it('seed 0 is the canonical feed', () => {
    expect(buildFeed(0).posts.map(p => p.id)).toEqual(POSTS.map(p => p.id))
  })
  it('a seed is repeatable, keeps ads in their slots and keeps the account set', () => {
    const a = buildFeed(12345).posts
    const b = buildFeed(12345).posts
    expect(a.map(p => p.id)).toEqual(b.map(p => p.id))
    ads.forEach(u => expect(slotOf(a, u)).toBe(slotOf(POSTS, u)))
    expect(new Set(a.map(p => p.username))).toEqual(new Set(POSTS.map(p => p.username)))
  })
  it('moves the friends between refreshes', () => {
    const seen = new Set([1, 2, 3, 4, 5, 6, 7, 8].map(s => slotOf(buildFeed(s).posts, 'marcus.h')))
    expect(seen.size).toBeGreaterThan(2)
  })
  it('keeps Imani buried in slots 10–18 with her news post', () => {
    for (const seed of [7, 77, 777, 7777]) {
      const posts = buildFeed(seed).posts
      const slot = slotOf(posts, 'imani.brooks') + 1
      expect(slot).toBeGreaterThanOrEqual(10)
      expect(slot).toBeLessThanOrEqual(18)
      expect(posts[slot - 1].isTarget).toBe(true)
    }
  })
  it('never repeats a post between the feed and its older pages', () => {
    const f = buildFeed(99)
    const ids = [...f.posts, ...f.page(1), ...f.page(2)].map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('hasProfile', () => {
  it('is true for friends, commenters with a written profile, and false for strangers', () => {
    expect(hasProfile('julia.creates')).toBe(true)
    expect(hasProfile('mia.c')).toBe(true)
    expect(hasProfile('imani.brooks')).toBe(true)
    expect(hasProfile('nobody.here')).toBe(false)
  })
})

describe('older feed pages', () => {
  it('hold only real accounts, labelled as one older day', () => {
    const friendsAndAds = ['imani.brooks', 'marcus.h', 'julia.creates', 'sarah.moments', 'airbnb', 'warbyparker']
    const page = feedPage(1)
    for (const p of page) {
      expect(friendsAndAds).not.toContain(p.username)
      expect(p.timestamp).toBe('1d')
    }
  })
  it('come in a fresh order each time, never echoing the page above', () => {
    for (const seed of [0, 7, 99, 12345]) {
      const f = buildFeed(seed)
      const pages = [f.posts.filter(p => !p.isSponsored && !p.isTarget), f.page(1), f.page(2), f.page(3)]
        .map(list => list.map(p => p.username))
      for (let k = 1; k < pages.length; k++) {
        const prev = pages[k - 1], cur = pages[k]
        if (cur.length < 3) continue
        // Not the order of the page above (among the accounts both show)
        const shared = prev.filter(u => cur.includes(u))
        expect(cur.filter(u => shared.includes(u))).not.toEqual(shared)
        // No repeat across the boundary, and a different closing account
        expect(cur[0]).not.toBe(prev.at(-1))
        expect(cur.at(-1)).not.toBe(prev.at(-1))
      }
      // Same feed pages the same way every time (seeded)
      expect(buildFeed(seed).page(2).map(p => p.id)).toEqual(f.page(2).map(p => p.id))
    }
  })
  it('run out eventually', () => {
    expect(feedPage(500)).toEqual([])
  })
})

describe('home feed', () => {
  it('has one timestamp slot per FEED_ORDER entry', () => {
    expect(FEED_TIMES).toHaveLength(FEED_ORDER.length)
    expect(FEED_ORDER).toHaveLength(24)
  })

  it('keeps FEED_ORDER order, skipping accounts with no photos', () => {
    const usernames = POSTS.map(p => p.username)
    const expected = FEED_ORDER.filter(u => usernames.includes(u))
    expect(usernames).toEqual(expected)
    expect(new Set(usernames).size).toBe(usernames.length)
  })

  it('always carries the four friends and two ads', () => {
    const usernames = POSTS.map(p => p.username)
    for (const u of ['imani.brooks', 'marcus.h', 'julia.creates', 'sarah.moments', 'airbnb', 'warbyparker']) {
      expect(usernames).toContain(u)
    }
  })

  it('buries Imani at slot 14 with a 14h timestamp', () => {
    expect(FEED_ORDER[13]).toBe('imani.brooks')
    const imani = POSTS.find(p => p.username === 'imani.brooks')
    expect(imani.isTarget).toBe(true)
    expect(imani.timestamp).toBe('14h')
    expect(imani.imageSrc).toMatch(/imani\.brooks\/post/)
  })

  it('gives ads no timestamp and everything else one', () => {
    for (const p of POSTS) {
      if (p.isSponsored) expect(p.timestamp).toBeNull()
      else expect(p.timestamp).toMatch(/^\d+[mhdw]$/)
    }
  })

  it('has null exactly at the ad slots', () => {
    FEED.forEach(([username, time]) => {
      const ad = ['airbnb', 'warbyparker'].includes(username)
      expect(time === null).toBe(ad)
    })
  })

  it('names only real archive handles or base posts', () => {
    const REAL = ['kimkardashian', 'selenagomez', 'cristiano', 'justinbieber', 'natgeo', 'kyliejenner', 'beyonce', 'gigihadid', 'therock', 'leomessi', 'nasa', 'kevinhart4real', 'instagram', 'badgalriri', 'humansofny', 'neymarjr', 'theellenshow', '9gag']
    const BASE = ['marcus.h', 'julia.creates', 'sarah.moments', 'imani.brooks', 'airbnb', 'warbyparker']
    for (const u of FEED_ORDER) expect([...REAL, ...BASE]).toContain(u)
  })
})

describe("Imani's profile", () => {
  it('is exactly her 21 committed photos, post first', () => {
    const profile = getProfile('imani.brooks')
    expect(profile.name).toBe('Imani Brooks')
    expect(profile.grid).toHaveLength(21)
    expect(profile.grid[0].image).toMatch(/imani\.brooks\/post/)
    expect(profile.grid[1].image).toMatch(/imani\.brooks\/grid-01/)
    // Grid tiles after her feed post follow the same position ladder as real accounts
    expect(profile.grid.slice(1, 4).map(t => t.post.timestamp)).toEqual(['1d', '2d', '4d'])
    expect(profile.grid[0].post.caption).toMatch(/my first editorial/)
    expect(profile.website).toBe('imanibrooks.com')
  })
})

describe('activity rows', () => {
  it('only name accounts that have a profile with a display name', () => {
    const rows = [...FOLLOWING_ACTIVITY, ...YOU_ACTIVITY, ...TRICKLE_ACTIVITY]
    const names = rows.flatMap(r => [r.actor, ...r.segments.filter(s => typeof s === 'object').map(s => s.user)])
    for (const u of new Set(names)) expect(getProfile(u).name, u).not.toBe(u)
  })
})

describe('the sponsored post', () => {
  it('carries the ad destination its overlay and in-app browser use', () => {
    const ad = POSTS.find(p => p.username === 'airbnb').ad
    expect(ad).toMatchObject({ name: 'Airbnb', domain: 'airbnb.com', page: 'airbnb-live-there' })
    expect(ad.url).toMatch(/^https:\/\/www\.airbnb\.com\//)
  })
})

// Every post the feed can deal for a seed: its slots and all its older pages.
function everyFeedPost(seed) {
  const f = buildFeed(seed)
  const out = [...f.posts]
  for (let n = 1; ; n++) { const pg = f.page(n); if (!pg.length) break; out.push(...pg) }
  return out
}
const codeOf = post => String(post?.id || '').replace(/^archive-[^-]+-/, '')

describe('profile-only posts', () => {
  const onDisk = [...PROFILE_ONLY].filter(code => Object.values(ARCHIVE).some(a => a.posts.some(p => p.code === code)))
  it('stay in their own grid', () => {
    for (const code of onDisk) {
      const handle = Object.keys(ARCHIVE).find(h => ARCHIVE[h].posts.some(p => p.code === code))
      expect(getProfile(handle).grid.some(t => t.id.endsWith('-' + code)), code).toBe(true)
    }
  })
  it('never reach the home feed or its older pages', () => {
    for (const seed of [0, 1, 7, 99, 12345]) {
      const codes = new Set(everyFeedPost(seed).map(p => String(p.id)))
      for (const code of onDisk) expect([...codes].some(id => id.endsWith('-' + code)), code).toBe(false)
    }
  })
  it('never show in Explore', () => {
    const codes = new Set()
    for (let n = 0; n < 4000; n++) codes.add(codeOf(exploreTile(n).post))
    for (const code of onDisk) expect(codes.has(code), code).toBe(false)
  })
  it("open Rihanna's slot on her next post", () => {
    const rih = POSTS.find(p => p.username === 'badgalriri')
    if (rih) expect(rih.id).not.toMatch(/BEbFNVlBM39/)
  })
})

describe('library ownership', () => {
  it('never deals a photo @instagram reposted, a SKIP photo, or a photo to two owners', async () => {
    const { ownedPhotos, REAL_OWNERS, FRIEND_SETS, REPOSTED_BY_INSTAGRAM } = await import('../components/feed/libraryData')
    const { SKIP } = await import('../components/feed/libraryQuality')
    const seen = new Set()
    for (const u of [...Object.keys(FRIEND_SETS), ...Object.keys(REAL_OWNERS)]) {
      for (const url of ownedPhotos(u)) {
        const name = url.split('/').pop()
        expect(REPOSTED_BY_INSTAGRAM[name], name).toBeUndefined()
        expect(SKIP.has(name), name).toBe(false)
        expect(seen.has(name), name).toBe(false)
        seen.add(name)
      }
    }
  })
})
