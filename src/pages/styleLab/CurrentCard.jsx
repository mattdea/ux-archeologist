// src/pages/styleLab/CurrentCard.jsx
//
// The collection's cards and pictures as they are today, for the lab's
// collection screens (the cards aren't restyled until phase 3). A room in
// MOCK.found shows its found card, the others lie face down.
import { FoundCard, FaceDownCard } from '../collection/cards'
import DeviceArt from '../collection/DeviceArt'
import { PLATES, ILLUSTRATIONS, ILLUSTRATION_GROUND } from '../collection/cardArt'
import { isFound } from './content'

// Matthew's six dot illustrations (g/dots-N.webp: cropped from
// docs/reference/style-lab/g-dot-illustrations.webp as ink-only masks)
const DOT_ART = Object.fromEntries(
  Object.entries(import.meta.glob('./g/dots-*.webp', { eager: true, import: 'default' }))
    .map(([file, url]) => [Number(file.match(/dots-(\d)\.webp$/)[1]), url])
)
import lab from './lab.module.css'

// data-current-card lets a concept's resets skip the card (`:not([data-current-card] *)`)
/** One current card, `width` px wide (the card's own type doesn't scale; use `zoom` to shrink it whole). */
export function CurrentCard({ room, art, onOpen, width = 300, zoom = 1, faceUp }) {
  const up = faceUp ?? isFound(room.level)
  return (
    <div className={lab.cardWrap} style={{ width, zoom }} data-current-card>
      {up
        ? <FoundCard a={room} art={art} onOpen={onOpen} />
        : <FaceDownCard a={room} onOpen={onOpen} />}
    </div>
  )
}

/** A room's picture alone (the illustration, or the drawn device on its plate), filling its box. */
export function ArtifactPicture({ room, art, className = '' }) {
  const src = art === 'illustrated' ? ILLUSTRATIONS[room.level] : null
  return src ? (
    <span className={`${lab.picture} ${className}`} style={{ background: ILLUSTRATION_GROUND[room.level] }}>
      <img src={src} alt="" draggable="false" />
    </span>
  ) : (
    <span className={`${lab.picture} ${className}`} style={{ background: PLATES[room.level] }}>
      <DeviceArt level={room.level} />
    </span>
  )
}

/**
 * A room's dot illustration, drawn in the text's colour (it is a mask over
 * `currentColor`), so it is black on a white box and white when the box
 * turns black. It keeps its proportions inside whatever box it is given.
 */
export function DotArt({ room, className = '' }) {
  return <span className={`${lab.dotArt} ${className}`} style={{ '--art': `url(${DOT_ART[room.level]})` }} />
}

/** A room's picture in the chosen art: 'dots', 'drawn' or 'illustrated'. */
export function RoomPicture({ room, art, className = '' }) {
  return art === 'dots' && DOT_ART[room.level]
    ? <DotArt room={room} className={className} />
    : <ArtifactPicture room={room} art={art} className={className} />
}
