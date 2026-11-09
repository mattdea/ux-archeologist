// src/components/da/daArt.js
//
// Desk accessories drawn from traced art: each window is a 1-bit PNG traced
// pixel by pixel from the System 1 screenshots in docs/reference/mac system 1/
// (one pixel per Mac pixel, transparent outside the window), shown by
// DraggableWindow's 'traced' variant. w/h are its size in Mac pixels, titleH
// the title bar's height (the drag area), close the close box's top-left
// (an 11-pixel square) and closeInk the starburst's colour when it's pressed.

import calculator from '../../../assets/mac/da/calculator.png'
import puzzle from '../../../assets/mac/da/puzzle.png'
import alarmClosed from '../../../assets/mac/da/alarm-closed.png'
import alarmOpen from '../../../assets/mac/da/alarm-open.png'

export const DA_ART = {
  // macsystem100012.png / macsystem100013.png
  calculator: { src: calculator, w: 106, h: 169, titleH: 20, close: [9, 4], closeInk: '#fff' },
  // macsystem100016.png, its 16 cells cleared (the tiles are sprites)
  puzzle: { src: puzzle, w: 91, h: 110, titleH: 20, close: [9, 4], closeInk: '#fff' },
  // macsystem100006.png closed and 100008.png open, text and flag cleared
  // (the clock face icon from 100007.png, unselected); the top row drags
  alarm: { src: alarmClosed, w: 133, h: 22, titleH: 20, close: [10, 5] },
  alarmOpen: { src: alarmOpen, w: 133, h: 75, titleH: 20, close: [10, 5] },
}
