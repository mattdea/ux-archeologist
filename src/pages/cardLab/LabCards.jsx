// src/pages/cardLab/LabCards.jsx
//
// Card designs that exist only in the card lab (dev), each with a front
// (the card found) and a back (the card not found yet, or for 'twoSided'
// the card's info side). A variant in variants.js picks one with
// `design`. The colour is the room's plate (Matthew's palette), or the
// illustration's own ground when `art: 'illustrated'`.
import s from './LabCards.module.css'
import DeviceArt from '../collection/DeviceArt'
import { PLATES, PLATE_INK, ILLUSTRATIONS, ILLUSTRATION_GROUND, pad } from '../collection/cardArt'
import { ARTIFACTS } from '../../data/artifacts'

const cx = (...c) => c.filter(Boolean).join(' ')
const NOTE = 'Finish this room to add it.'

// The six palette squares along a card's foot, this room's one raised
function SetStrip({ level, colours }) {
  return (
    <span className={s.setStrip} aria-hidden="true">
      {colours.map((c, i) => <span key={i} className={i === level ? s.setOn : ''} style={{ background: c }} />)}
    </span>
  )
}

const DESIGNS = {
  // The whole card is the room's colour: a huge year, the device, the name
  poster: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.posterYear}>{a.year}</span>
        <span className={s.posterPic}>{pic}</span>
        <span className={s.posterName}>{a.name}</span>
        <span className={s.posterRoom}>{a.title} · No. {no}</span>
      </>
    ),
    back: ({ a }) => (
      <>
        <span className={cx(s.posterYear, s.outline)}>{a.year}</span>
        <span className={s.grow} />
        <span className={s.posterName}>{a.title}</span>
        <span className={s.posterRoom}>{NOTE}</span>
      </>
    ),
  },

  // A gallery wall label set on the room's colour
  label: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.labelPic}>{pic}</span>
        <span className={s.grow} />
        <span className={s.labelName}>{a.name}</span>
        <span className={s.labelMeta}>{a.title}, {a.year}</span>
        <span className={s.labelDesc}>{a.description}</span>
        <span className={s.labelFoot}>No. {no} of {ARTIFACTS.length}</span>
      </>
    ),
    back: ({ a, no }) => (
      <>
        <span className={s.labelFoot}>No. {no} of {ARTIFACTS.length}</span>
        <span className={s.grow} />
        <span className={s.labelName}>{a.title}</span>
        <span className={s.labelMeta}>{NOTE}</span>
      </>
    ),
  },

  // The name as the picture, the device small in a corner
  type: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.typeTop}><span>{a.year}</span><span>No. {no}</span></span>
        <span className={s.typeName}>{a.name}</span>
        <span className={s.grow} />
        <span className={s.typePic}>{pic}</span>
      </>
    ),
    back: ({ a, no }) => (
      <>
        <span className={s.typeTop}><span>{a.year}</span><span>No. {no}</span></span>
        <span className={cx(s.typeName, s.ghost)}>{a.title}</span>
        <span className={s.grow} />
        <span className={s.typeNote}>{NOTE}</span>
      </>
    ),
  },

  // Picture on the front, everything else on the back
  twoSided: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.typeTop}><span>No. {no}</span><span>{a.year}</span></span>
        <span className={s.twoPic}>{pic}</span>
        <span className={s.twoName}>{a.name}</span>
      </>
    ),
    back: ({ a, no, colours }) => (
      <>
        <span className={s.infoBar}><span>No. {no}</span><span>{a.year}</span></span>
        <span className={s.infoName}>{a.name}</span>
        <span className={s.infoRoom}>{a.title}</span>
        <span className={s.infoDesc}>{a.description}</span>
        <span className={s.grow} />
        <SetStrip level={a.level} colours={colours} />
      </>
    ),
  },

  // A paint chip: the colour as a swatch, a code under it, the set below
  chip: {
    front: ({ a, pic, no, colours }) => (
      <>
        <span className={s.chipBlock}>{pic}</span>
        <span className={s.chipCode}>IA {a.year}–{no}</span>
        <span className={s.chipName}>{a.name}</span>
        <span className={s.chipRoom}>{a.title}</span>
        <span className={s.grow} />
        <SetStrip level={a.level} colours={colours} />
      </>
    ),
    back: ({ a, no, colours }) => (
      <>
        <span className={cx(s.chipBlock, s.chipEmpty)} />
        <span className={s.chipCode}>IA {a.year}–{no}</span>
        <span className={s.chipRoom}>{NOTE}</span>
        <span className={s.grow} />
        <SetStrip level={-1} colours={colours} />
      </>
    ),
  },

  // A strip of colour down the left with the year on its side
  split: {
    front: ({ a, pic }) => (
      <>
        <span className={s.splitStrip}><span>{a.year}</span></span>
        <span className={s.splitBody}>
          <span className={s.splitPic}>{pic}</span>
          <span className={s.splitName}>{a.name}</span>
          <span className={s.splitRoom}>{a.title}</span>
          <span className={s.splitDesc}>{a.description}</span>
        </span>
      </>
    ),
    back: ({ a }) => (
      <>
        <span className={s.splitStrip}><span>{a.year}</span></span>
        <span className={cx(s.splitBody, s.splitBodyBack)}>
          <span className={s.grow} />
          <span className={s.splitName}>{a.title}</span>
          <span className={s.splitRoom}>{NOTE}</span>
        </span>
      </>
    ),
  },

  // An admission ticket, torn along the perforation
  ticket: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.ticketTop}>
          <span className={s.ticketHead}><span>Admit one</span><span>Room {no}</span></span>
          <span className={s.ticketPic}>{pic}</span>
        </span>
        <span className={s.perf} />
        <span className={s.ticketBody}>
          <span className={s.ticketName}>{a.name}</span>
          <span className={s.ticketRoom}>{a.title} · {a.year}</span>
          <span className={s.ticketDesc}>{a.description}</span>
          <span className={s.grow} />
          <span className={s.barcode} />
        </span>
      </>
    ),
    back: ({ a, no }) => (
      <>
        <span className={cx(s.ticketTop, s.ticketTopBack)}>
          <span className={s.ticketHead}><span>Admit one</span><span>Room {no}</span></span>
          <span className={s.grow} />
        </span>
        <span className={s.perf} />
        <span className={s.ticketBody}>
          <span className={s.ticketName}>{a.title}</span>
          <span className={s.ticketRoom}>{NOTE}</span>
        </span>
      </>
    ),
  },

  // A medal: the device in a disc of the room's colour
  medallion: {
    front: ({ a, pic }) => (
      <>
        <span className={s.medDisc}>{pic}</span>
        <span className={s.medYear}>{a.year}</span>
        <span className={s.medName}>{a.name}</span>
        <span className={s.medDesc}>{a.description}</span>
      </>
    ),
    back: ({ a, no }) => (
      <>
        <span className={cx(s.medDisc, s.medEmpty)}><span>{no}</span></span>
        <span className={s.medYear}>{a.year}</span>
        <span className={s.medName}>{a.title}</span>
        <span className={s.medDesc}>{NOTE}</span>
      </>
    ),
  },

  // Black, the room's colour as a glow behind the device and an edge
  glow: {
    front: ({ a, pic, no }) => (
      <>
        <span className={s.typeTop}><span>No. {no}</span><span>{a.year}</span></span>
        <span className={s.glowPic}>{pic}</span>
        <span className={s.glowName}>{a.name}</span>
        <span className={s.glowRoom}>{a.title}</span>
        <span className={s.glowDesc}>{a.description}</span>
      </>
    ),
    back: ({ a, no }) => (
      <>
        <span className={s.typeTop}><span>No. {no}</span><span>{a.year}</span></span>
        <span className={s.grow} />
        <span className={cx(s.posterYear, s.outline, s.glowYear)}>{a.year}</span>
        <span className={s.glowRoom}>{NOTE}</span>
      </>
    ),
  },
}

export function LabFace({ a, v, side }) {
  const design = DESIGNS[v.design]
  const ill = v.art === 'illustrated' && ILLUSTRATIONS[a.level]
  const colours = v.plates || PLATES
  const bg = ill ? ILLUSTRATION_GROUND[a.level] : colours[a.level]
  const ink = ill || v.plates ? '#fff' : PLATE_INK[a.level]
  const pic = ill ? <img src={ILLUSTRATIONS[a.level]} alt="" /> : <DeviceArt level={a.level} />
  const ctx = { a, pic, no: pad(a.level + 1), colours: ill ? ILLUSTRATION_GROUND : colours }
  return (
    <div className={cx(s.card, s[v.design], side === 'back' && s.back, ill && s.ill)} style={{ '--bg': bg, '--ink': ink }}>
      {(side === 'back' ? design.back : design.front)(ctx)}
    </div>
  )
}
