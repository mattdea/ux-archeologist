// src/pages/styleLab/CurrentCard.jsx
//
// The collection's cards and pictures as they are today, for the lab's
// collection screens (the cards aren't restyled until phase 3). A room in
// MOCK.found shows its found card, the others lie face down.
import { FoundCard, FaceDownCard } from '../collection/cards'
import DeviceArt from '../collection/DeviceArt'
import { PLATES, ILLUSTRATIONS, ILLUSTRATION_GROUND } from '../collection/cardArt'
import { isFound } from './content'
import lab from './lab.module.css'

/** One current card, `width` px wide (the card's own type doesn't scale; use `zoom` to shrink it whole). */
export function CurrentCard({ room, art, onOpen, width = 300, zoom = 1, faceUp }) {
  const up = faceUp ?? isFound(room.level)
  return (
    <div className={lab.cardWrap} style={{ width, zoom }}>
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
