// src/pages/styleLab/concepts.js
// The lab's concepts, in the order of the backlog's directions, and the
// four screens each one draws.
import Document from './A_Document'
import Index from './B_Index'

export const SCREENS = [
  { id: 'title', label: 'Title' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'collection', label: 'Collection' },
  { id: 'level', label: 'Level frame' },
]

export const CONCEPTS = [
  {
    id: 'a',
    letter: 'A',
    name: 'Unstyled document',
    blurb: 'A web page nobody styled: Times, blue and purple links, rules, bullets, bordered tables and the browser’s own buttons.',
    Component: Document,
  },
  {
    id: 'b',
    letter: 'B',
    name: 'Index',
    blurb: 'One small monospace list, like a table of contents: years on the left, dotted leaders, every line a link. A screen is the list with one entry opened.',
    Component: Index,
  },
]
