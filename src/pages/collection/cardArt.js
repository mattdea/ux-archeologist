// src/pages/collection/cardArt.js
// The cards' colours and pictures, shared by the collection's cards and the
// card lab's designs.

// Each room's plate behind its drawn device, from Matthew's palette in room
// order: navy, yellow, sky blue, green, coral, brown
export const PLATES = ['#0d4b88', '#edb30a', '#84b6fd', '#539267', '#e46868', '#9a6b59']

// Text on each plate colour: white on the dark ones, near-black on yellow,
// sky blue and coral (white on those falls under 4.5:1)
export const PLATE_INK = ['#fff', '#1b1606', '#0b1f3a', '#fff', '#1f0b0b', '#fff']

// Matthew's illustrations, one per room, each on its own ground; the plate
// takes that ground's colour so the whole picture shows with no crop
export const ILLUSTRATIONS = Object.fromEntries(
  Object.entries(import.meta.glob('../../../assets/collection/illustration-*.webp', { eager: true, import: 'default' }))
    .map(([file, url]) => [Number(file.match(/illustration-(\d)\.webp$/)[1]), url])
)
export const ILLUSTRATION_GROUND = ['#567b65', '#8a9fb1', '#4b8181', '#798a9b', '#c1806f', '#83685c']

export const pad = (n) => String(n).padStart(2, '0')
