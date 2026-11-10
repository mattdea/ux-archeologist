// src/test/StyleLab.test.jsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
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
  afterEach(() => { window.location.hash = ''; try { window.localStorage.clear() } catch { /* no storage */ } })

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
    expect(two.map(c => c.id)).toEqual(['b2', 'g'])
    two.forEach(c => expect(c.frames.map(f => f.level)).toEqual([1, 3]))
    renderLab('#b2/level')   // no room named: the first frame, the Mac
    expect(pageText()).toContain(squash(ROOMS[1].intro))
  })

  it('G: dot capitals keep their real text, and the cards are punched', () => {
    renderLab('#g/collection')
    // the heading is drawn in dots (hidden from readers) beside its own text
    const heading = document.querySelector('h1')
    expect(heading.textContent).toBe(WORDS.collection)
    expect(heading.querySelector('svg circle')).not.toBeNull()
    expect(heading.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
    // four rooms found: four cards printed and punched, two blank
    const cards = [...document.querySelectorAll('ol a')]
    expect(cards).toHaveLength(ROOMS.length)
    const punched = cards.filter(c => c.querySelector('svg rect[height="17"]'))
    expect(punched).toHaveLength(MOCK.found.length)
    // 1979: one hole in each of the first four columns, in rows 1, 9, 7, 9
    const holes = [...cards[0].querySelectorAll('svg rect[height="17"]')].slice(0, 4).map(r => Number(r.getAttribute('y')))
    const rowY = (digit) => 44 + (2 + digit) * 25 + 2
    expect(holes).toEqual([1, 9, 7, 9].map(rowY))
  })

  it('G: the art switch offers Dots, and only there', () => {
    renderLab('#g/timeline')
    expect(screen.getByRole('button', { name: 'Dots' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Drawn' }))
    expect(screen.getByRole('button', { name: 'Dots' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Drawn' })).toHaveAttribute('aria-pressed', 'true')
    cleanup()
    renderLab('#b2/timeline')
    expect(screen.queryByRole('button', { name: 'Dots' })).toBeNull()
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
