// src/test/StyleLab.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import StyleLab from '../pages/StyleLab'
import { FadeNavCtx } from '../shared/SharedLayout'
import { CONCEPTS, SCREENS } from '../pages/styleLab/concepts'
import { ROOMS, TITLE, WORDS, MOCK, foundLine } from '../pages/styleLab/content'

const renderLab = (hash = '') => {
  window.location.hash = hash
  return render(<FadeNavCtx.Provider value={vi.fn()}><StyleLab /></FadeNavCtx.Provider>)
}
// Concepts break text across elements and lines; compare with spaces removed
const squash = (s) => s.replace(/\s+/g, '')
const pageText = () => squash(document.body.textContent)

describe('Style lab', () => {
  afterEach(() => { window.location.hash = '' })

  it('opens on an index with a link into every screen of every concept', () => {
    renderLab()
    CONCEPTS.forEach(c => {
      SCREENS.filter(s => s.id !== 'level').forEach(s => {
        expect(document.querySelector(`a[href="#${c.id}/${s.id}"]`)).not.toBeNull()
      })
      // one level frame, or round 2's two (around the Mac and the iPhone)
      const frames = c.frames ? c.frames.map(f => `#${c.id}/level/${f.level}`) : [`#${c.id}/level`]
      frames.forEach(href => expect(document.querySelector(`a[href="${href}"]`)).not.toBeNull())
    })
  })

  it('round 2 shows the level frame around the Mac and the iPhone', () => {
    const two = CONCEPTS.filter(c => c.frames)
    expect(two.map(c => c.id)).toEqual(expect.arrayContaining(['b2']))
    two.forEach(c => expect(c.frames.map(f => f.level)).toEqual([1, 3]))
    renderLab('#b2/level')   // no room named: the first frame, the Mac
    expect(pageText()).toContain(squash(ROOMS[1].intro))
  })

  it('B2: Begin excavation leaves the list as it is while playing, Continue shows the discovery', () => {
    renderLab('#b2/level/1')
    const r = ROOMS[1]
    fireEvent.click(screen.getByText(WORDS.begin))
    expect(pageText()).not.toContain(squash(r.intro))
    expect(pageText()).not.toContain(squash(r.description))
    r.objectives.forEach(o => expect(pageText()).toContain(squash(o)))
    expect(pageText()).toContain(squash(r.hints[MOCK.hintFor]))
    fireEvent.click(screen.getByText(WORDS.cont))
    expect(pageText()).toContain(squash(r.description))
    expect(pageText()).not.toContain(squash(r.hints[MOCK.hintFor]))
  })

  describe.each(CONCEPTS.map(c => [`${c.letter}. ${c.name}`, c]))('%s', (_, c) => {
    it('title: the name, the subtitle and the way in', () => {
      renderLab(`#${c.id}/title`)
      expect(pageText()).toContain(squash(TITLE.name))
      expect(pageText()).toContain(squash(TITLE.subtitle))
      expect(pageText()).toContain(squash(TITLE.enter))
    })

    it('timeline: all six rooms', () => {
      renderLab(`#${c.id}/timeline`)
      ROOMS.forEach(r => {
        expect(pageText()).toContain(r.year)
        expect(pageText()).toContain(squash(r.title))
      })
    })

    it('collection: the count and the six current cards', () => {
      renderLab(`#${c.id}/collection`)
      expect(pageText()).toContain(squash(foundLine))
      ROOMS.forEach(r => expect(pageText()).toContain(squash(MOCK.found.includes(r.level) ? r.description : WORDS.unfound)))
    })

    it('level frame: intro card, objectives, hint and discovery card', () => {
      renderLab(`#${c.id}/level/2`)
      const r = ROOMS[2]
      expect(pageText()).toContain(squash(r.intro))
      r.objectives.forEach(o => expect(pageText()).toContain(squash(o)))
      expect(pageText()).toContain(squash(r.hints[MOCK.hintFor]))
      expect(pageText()).toContain(squash(WORDS.begin))
      expect(pageText().toLowerCase()).toContain(squash(WORDS.discovered).toLowerCase())
      expect(pageText()).toContain(squash(r.description))
      expect(pageText()).toContain(squash(WORDS.backPlain))
    })
  })
})
