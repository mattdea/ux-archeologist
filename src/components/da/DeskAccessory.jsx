// src/components/da/DeskAccessory.jsx
//
// The desk accessories of System 1 that open from the Apple menu. Each is a
// small self-contained window body; DraggableWindow supplies the frame.

import Calculator from './Calculator'
import NotePad from './NotePad'
import Puzzle from './Puzzle'
import AlarmClock from './AlarmClock'
import AboutFinder from './AboutFinder'

export const DA_TITLES = {
  calculator: 'Calculator',
  notepad:    'Note Pad',
  puzzle:     'Puzzle',
  alarm:      'Alarm Clock',
  about:      'About the Finder',
}

export const DA_WIDTH = {
  calculator: 150,
  notepad:    230,
  puzzle:     130,
  alarm:      180,
  about:      380,
}

export default function DeskAccessory({ name }) {
  switch (name) {
    case 'calculator': return <Calculator />
    case 'notepad':    return <NotePad />
    case 'puzzle':     return <Puzzle />
    case 'alarm':      return <AlarmClock />
    case 'about':      return <AboutFinder />
    default:           return null
  }
}
