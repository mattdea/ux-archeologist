// src/test/archiveData.test.js
import { gridTime, ARCHIVE, REMOVED } from '../components/feed/archiveData'

describe('gridTime', () => {
  it('labels the first row as hours and days', () => {
    expect([0, 1, 2].map(gridTime)).toEqual(['3h', '1d', '2d'])
  })
  it('walks the ladder through days into weeks', () => {
    expect([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(gridTime))
      .toEqual(['4d', '6d', '1w', '1w', '2w', '2w', '3w', '3w', '4w', '5w'])
  })
  it('keeps counting weeks past the ladder', () => {
    expect(gridTime(13)).toBe('6w')
    expect(gridTime(47)).toBe('40w')
  })
})

describe('removed posts', () => {
  it('appear in no account', () => {
    for (const a of Object.values(ARCHIVE)) for (const p of a.posts) expect(REMOVED.has(p.code), p.code).toBe(false)
  })
})
