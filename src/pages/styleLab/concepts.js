// src/pages/styleLab/concepts.js
// The lab's concepts, in the order of the backlog's directions (round 1's
// A–F, then round 2's B2 and G), and the four screens each one draws.
import Document from './A_Document'
import Index from './B_Index'
import Canvas from './C_Canvas'
import ColourField from './D_ColourField'
import Specimen from './E_Specimen'
import Notebook from './F_Notebook'
import Index2 from './B2_Index'
import PunchCardConcept from './G_PunchCard'

export const SCREENS = [
  { id: 'title', label: 'Title' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'collection', label: 'Collection' },
  { id: 'level', label: 'Level frame' },
]

// Round 2's concepts show the level frame twice: around a wide artifact
// (the Mac, room 1) and a tall one (the iPhone, room 3)
const TWO_FRAMES = [
  { level: 1, label: 'Level frame · Mac' },
  { level: 3, label: 'Level frame · iPhone' },
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
  {
    id: 'c',
    letter: 'C',
    name: 'Canvas',
    blurb: 'One large grey plane you drag around. The screens are places on it, and the timeline is a map drawn to a time scale.',
    Component: Canvas,
  },
  {
    id: 'd',
    letter: 'D',
    name: 'Colour field',
    blurb: 'One flat, loud colour per page and per era, black Helvetica as large as it goes, hard-edged boxes. Nothing fades.',
    Component: ColourField,
  },
  {
    id: 'e',
    letter: 'E',
    name: 'Specimen sheet',
    blurb: 'A catalogue sheet: a strict grid of small pictures and blocks of text, each numbered, with tiny captions. Nothing is bigger than anything else.',
    Component: Specimen,
  },
  {
    id: 'f',
    letter: 'F',
    name: 'Notebook',
    blurb: 'Someone’s own page: pale paper, Times, toggles in thin boxes, a running clock, highlighter links, things taped in crooked.',
    Component: Notebook,
  },
  {
    id: 'b2',
    letter: 'B2',
    name: 'Index, refined',
    blurb: 'B again: cards as monospace boxes, the list as the HUD with the artifact fitted beside or below it, and the dot illustrations (on hover, in six little squares, on the cards).',
    Component: Index2,
    frames: TWO_FRAMES,
    dotArt: true,
  },
  {
    id: 'g',
    letter: 'G',
    name: 'Punch card',
    blurb: 'Cream paper and black ink, headings in inked 5 × 7 dot capitals, notes numbered from 0 down dashed rules, teal links, and the artifacts as punched 80-column cards.',
    Component: PunchCardConcept,
    frames: TWO_FRAMES,
    dotArt: true,
  },
]
