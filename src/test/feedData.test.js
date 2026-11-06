// src/test/feedData.test.js
// The real-account photos are gitignored, so these tests only assert on what
// holds with or without them: the invented friends, the ads, and the ordering.
import { POSTS, FEED, FEED_ORDER, FEED_TIMES, feedPage, FOLLOWING_ACTIVITY, YOU_ACTIVITY, TRICKLE_ACTIVITY, getProfile } from '../components/feed/feedData'

describe('older feed pages', () => {
  it('hold only real accounts, in FEED order, labelled as one older day', () => {
    const friendsAndAds = ['imani.brooks', 'marcus.h', 'julia.creates', 'sarah.moments', 'airbnb', 'warbyparker']
    const page = feedPage(1)
    const names = page.map(p => p.username)
    expect(names).toEqual(FEED_ORDER.filter(u => names.includes(u)))
    for (const p of page) {
      expect(friendsAndAds).not.toContain(p.username)
      expect(p.timestamp).toBe('1d')
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
    expect(imani.imageSrc).toMatch(/imani\/post/)
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
    expect(profile.grid[0].image).toMatch(/imani\/post/)
    expect(profile.grid[1].image).toMatch(/imani\/grid-01/)
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
