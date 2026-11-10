// src/test/curatorFallbacks.test.js
// Every suggestion chip must land on its own scripted reply when the model
// can't be reached (the fallbacks pick the first keyword match).
import { getFallbackResponse } from '../components/chat/curatorFallbacks'
import { CHIPS_BY_TURN } from '../components/chat/SuggestionChips'

const EXPECTED = {
  'What is this place?': 'This is Interface Artifacts',
  'Who are you?': "I'm the exhibit's guide",
  'What did the other rooms show?': 'Each room is a replica',
  'What changed between 1984 and now?': 'Each interface needed less learning',
  'How is this like the 1979 terminal?': 'At a Unix terminal',
  'What might come next?': 'Nobody knows',
  'Which change mattered most?': 'A common answer is the move',
  'What did touchscreens change?': 'With a mouse you move a pointer',
  'Is this the last interface?': 'This is the last room',
}

describe('curator fallbacks', () => {
  it('has an expected reply for every chip', () => {
    expect(CHIPS_BY_TURN.flat().sort()).toEqual(Object.keys(EXPECTED).sort())
  })

  it.each(Object.entries(EXPECTED))('"%s" gets its own reply', (chip, start) => {
    expect(getFallbackResponse(chip).startsWith(start)).toBe(true)
  })
})
