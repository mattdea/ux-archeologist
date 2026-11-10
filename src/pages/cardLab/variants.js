// src/pages/cardLab/variants.js
// The card designs laid out side by side on the card lab (dev only,
// /card-lab). One row per entry, all six artifacts in each. To try an
// idea, add an entry:
//   name     shown above the row
//   note     a line about what's different (optional)
//   look     'card' (Collectible), 'museum' or 'hybrid'  — cardLook.js
//   art      'drawn' (DeviceArt.jsx) or 'illustrated' (assets/collection)
//   plates   six plate colours, in room order, for drawn art (optional;
//            the collection's palette otherwise)
//   className  a class from CardLab.module.css for anything else (optional)
//   design   one of the lab's own designs in LabCards.jsx instead of the
//            collection's card: 'poster', 'label', 'type', 'twoSided',
//            'chip', 'split', 'ticket', 'medallion', 'glow' (look is then
//            ignored; art still applies)
//   arrange  how the row lays out: 'row' (default), 'fan', 'deck',
//            'scatter', 'stagger'

export const VARIANTS = [
  { name: 'Collectible · Drawn', look: 'card', art: 'drawn' },
  { name: 'Collectible · Illustrated', look: 'card', art: 'illustrated' },
  { name: 'Museum · Drawn', look: 'museum', art: 'drawn' },
  { name: 'Museum · Illustrated', look: 'museum', art: 'illustrated' },
  { name: 'Hybrid · Drawn', look: 'hybrid', art: 'drawn' },
  { name: 'Hybrid · Illustrated', look: 'hybrid', art: 'illustrated' },
  {
    name: 'Hybrid · Drawn · earlier palette',
    note: 'The muted plates from before your six colours',
    look: 'hybrid',
    art: 'drawn',
    plates: ['#5b7d68', '#7d93a6', '#4f8487', '#89909b', '#c48c78', '#7a6a5d'],
  },

  // ── The lab's own designs, on the palette ──
  { name: 'Poster', note: 'The whole card is the room\'s colour, with a huge year', design: 'poster', art: 'drawn' },
  { name: 'Poster · Illustrated', note: 'The same, on each illustration\'s own ground', design: 'poster', art: 'illustrated' },
  { name: 'Wall label', note: 'A gallery label set on the colour', design: 'label', art: 'drawn' },
  { name: 'Big type', note: 'The name is the picture; the device sits in the corner', design: 'type', art: 'drawn' },
  { name: 'Two-sided', note: 'Picture on the front, the text on the back (the back here is the info side, not face down)', design: 'twoSided', art: 'drawn' },
  { name: 'Paint chip', note: 'A swatch with a code, and the set of six along the foot', design: 'chip', art: 'drawn' },
  { name: 'Split', note: 'A strip of colour with the year on its side; the device overlaps the seam', design: 'split', art: 'drawn' },
  { name: 'Ticket', note: 'An admission ticket, with a perforation and a barcode', design: 'ticket', art: 'drawn' },
  { name: 'Medallion', note: 'The device in a disc of colour', design: 'medallion', art: 'drawn' },
  { name: 'Glow', note: 'Black, the colour as light behind the device', design: 'glow', art: 'drawn' },

  // ── Other ways to lay them out ──
  { name: 'Poster · fanned', note: 'Held as a hand of cards; point at one to lift it', design: 'poster', art: 'drawn', arrange: 'fan' },
  { name: 'Paint chip · deck', note: 'A squared-up deck that spreads out under the pointer', design: 'chip', art: 'drawn', arrange: 'deck' },
  { name: 'Wall label · scattered', note: 'Dropped on a table', design: 'label', art: 'drawn', arrange: 'scatter' },
  { name: 'Hybrid · Drawn · staggered', note: 'The collection\'s card, every other one half a step down', look: 'hybrid', art: 'drawn', arrange: 'stagger' },
]
