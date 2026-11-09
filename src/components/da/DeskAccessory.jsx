// src/components/da/DeskAccessory.jsx
//
// The desk accessories of System 1 that open from the Apple menu. Each is a
// small self-contained window body; DraggableWindow supplies the frame.

import Calculator from './Calculator'
import NotePad from './NotePad'
import Puzzle from './Puzzle'
import AlarmClock from './AlarmClock'

export const DA_TITLES = {
  calculator: 'Calculator',
  notepad:    'Note Pad',
  puzzle:     'Puzzle',
  alarm:      'Alarm Clock',
}

export const DA_WIDTH = {
  calculator: 150,
  notepad:    230,
  puzzle:     130,
  alarm:      170,
}

// Window frame per accessory: Inside Macintosh's rDocProc (rounded, black
// title bar) for Calculator, Puzzle and the Alarm Clock; Note Pad used the
// ordinary document frame.
export const DA_VARIANT = {
  calculator: 'traced',
  notepad:    'doc',
  puzzle:     'traced',
  alarm:      'plain',
}

// `instance` changes when the DA is chosen again while open, which remounts
// it (the Puzzle rescrambles). `clock` is the Alarm Clock's shared state.
export default function DeskAccessory({ name, instance = 0, clock }) {
  switch (name) {
    case 'calculator': return <Calculator key={instance} />
    case 'notepad':    return <NotePad />
    case 'puzzle':     return <Puzzle key={instance} />
    case 'alarm':      return <AlarmClock clock={clock} />
    default:           return null
  }
}
