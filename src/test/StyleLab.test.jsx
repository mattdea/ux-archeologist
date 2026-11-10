// src/test/StyleLab.test.jsx
import { render } from '@testing-library/react'
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
      SCREENS.forEach(s => {
        expect(document.querySelector(`a[href="#${c.id}/${s.id}"]`)).not.toBeNull()
      })
    })
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
