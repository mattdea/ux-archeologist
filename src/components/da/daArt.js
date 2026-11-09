// src/components/da/daArt.js
//
// Desk accessories drawn from traced art: each window is a 1-bit PNG traced
// pixel by pixel from the System 1 screenshots in docs/reference/mac system 1/
// (one pixel per Mac pixel, transparent outside the window), shown by
// DraggableWindow's 'traced' variant. w/h are its size in Mac pixels, titleH
// the title bar's height (the drag area), close the close box's top-left
// (an 11-pixel square) and closeInk the starburst's colour when it's pressed.

import calculator from '../../../assets/mac/da/calculator.png'

export const DA_ART = {
  // macsystem100012.png / macsystem100013.png
  calculator: { src: calculator, w: 106, h: 169, titleH: 20, close: [9, 4], closeInk: '#fff' },
}
