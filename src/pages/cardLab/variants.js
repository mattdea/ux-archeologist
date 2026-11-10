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
]
