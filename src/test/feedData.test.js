// src/test/feedData.test.js
// The real-account photos are gitignored, so these tests only assert on what
// holds with or without them: the invented friends, the ads, and the ordering.
import { POSTS, FEED_ORDER, FEED_TIMES, getProfile } from '../components/feed/feedData'

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
      if (p.isSponsored) expect(p.timestamp).toBeUndefined()
      else expect(p.timestamp).toMatch(/^\d+[mhdw]$/)
    }
  })
})

describe("Imani's profile", () => {
  it('is exactly her 21 committed photos, post first', () => {
    const profile = getProfile('imani.brooks')
    expect(profile.name).toBe('Imani Brooks')
    expect(profile.grid).toHaveLength(21)
    expect(profile.grid[0].image).toMatch(/imani\/post/)
    expect(profile.grid[1].image).toMatch(/imani\/grid-01/)
    expect(profile.grid[0].post.caption).toMatch(/my first editorial/)
    expect(profile.website).toBe('imanibrooks.com')
  })
})
