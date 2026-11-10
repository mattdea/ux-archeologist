// src/pages/styleLab/G_PunchCard.jsx
//
// Concept G, "Punch card" (round 2), after docs/reference/style-lab/
// g-punch-card-doc.webp and g-dot-illustrations.webp. Warm cream paper and
// black ink; one teal, for links only, underlined word by word; dashed
// rules like a card's perforation.
//
// Three voices of type: headings and small captions in 5 × 7 dot-matrix
// capitals (drawn as SVG dots from g/glyphs.js, each dot a little off in
// size and place so it looks inked; the real text sits beside the drawing
// for screen readers and search); body text in Helvetica; numbers in
// monospace. Text runs in narrow columns of notes numbered from 0.
//
// The collection's cards are 80-column punch cards: what a card says is
// printed along its top edge in dots, one character a column, and punched
// in the column under it, so the year is four holes in the digit rows.
// The picture is the room's dot illustration (g/dots-N.webp, cropped from
// Matthew's sheet as ink-only masks, so they take the ink's colour).
import { Fragment, useId } from 'react'
import s from './G_PunchCard.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine, pad } from './content'
import { ArtifactPicture } from './CurrentCard'
import { dotsOf, holesOf, inkFor, CARD_ROWS } from './g/glyphs'

const DOT_ART = Object.fromEntries(
  Object.entries(import.meta.glob('./g/dots-*.webp', { eager: true, import: 'default' }))
    .map(([file, url]) => [Number(file.match(/dots-(\d)\.webp$/)[1]), url])
)

const r2 = (n) => Math.round(n * 100) / 100

// ── Dot-matrix lettering ─────────────────────────────────────────────
// One word as an SVG, seven dots tall and as tall as the text's font-size.
function DotWord({ word, seed }) {
  const ink = inkFor(seed + word)
  const chars = [...word]
  const w = chars.length * 6 - 1
  return (
    <svg className={s.word} viewBox={`-0.3 -0.3 ${w + 0.6} 7.6`} style={{ width: `${(w + 0.6) / 7.6}em` }}>
      {chars.map((ch, i) => dotsOf(ch).map(([x, y]) => (
        <circle
          key={`${i}-${x}-${y}`}
          cx={r2(i * 6 + x + 0.5 + (ink() - 0.5) * 0.14)}
          cy={r2(y + 0.5 + (ink() - 0.5) * 0.14)}
          r={r2(0.47 + (ink() - 0.4) * 0.16)}
        />
      )))}
    </svg>
  )
}

/** Text in dot capitals. The words wrap like words; the real text is kept for readers that can't see dots. */
function Dots({ children, className = '', as: Tag = 'span' }) {
  const text = String(children)
  return (
    <Tag className={`${s.dots} ${className}`}>
      <span className={s.real}>{text}</span>
      <span className={s.words} aria-hidden="true">
        {text.split(/\s+/).filter(Boolean).map((w, i) => <DotWord key={i} word={w} seed={`${text}${i}`} />)}
      </span>
    </Tag>
  )
}

/** A link's words, each underlined on its own. */
const Words = ({ children }) => String(children).split(' ').map((w, i) => (
  <Fragment key={i}>{i > 0 && ' '}<span className={s.w}>{w}</span></Fragment>
))

/** A column of notes numbered from `from`, down a dashed rule. */
function Notes({ items, from = 0, className = '' }) {
  return (
    <ol className={`${s.notes} ${className}`} start={from}>
      {items.map((item, i) => (
        <li key={i} className={s.noteItem}>
          <span className={s.num} aria-hidden="true">{from + i}</span>
          <div className={s.noteBody}>{item}</div>
        </li>
      ))}
    </ol>
  )
}

// ── Pictures ─────────────────────────────────────────────────────────
// The room's picture: its dot illustration in the ink's colour, or one of
// the collection's two art sets
function Picture({ room, art, className = '' }) {
  if (art !== 'dots' || !DOT_ART[room.level]) return <ArtifactPicture room={room} art={art} className={`${s.pictureBox} ${className}`} />
  return <span className={`${s.pictureBox} ${s.dotArt} ${className}`} style={{ '--art': `url(${DOT_ART[room.level]})` }} />
}

// ── The punch card ───────────────────────────────────────────────────
// 80 columns at a pitch of 10, twelve rows at a pitch of 25, a print line
// above them. `text` is printed along the top, a character a column, and
// punched under each character; `picture` sits over the middle columns.
const CARD = { w: 826, h: 364, left: 13, top: 44, col: 10, row: 25 }
const WINDOW = { x: 330, y: 50, w: 340, h: 290 }

function PunchCard({ text = '', picture, label, className = '' }) {
  const ink = inkFor(`card${text}`)
  const chars = [...text.toUpperCase()].slice(0, 80)
  const id = `g${useId().replace(/[^a-z0-9]/gi, '')}`
  return (
    <span className={`${s.card} ${className}`}>
      <span className={s.cardFace}>
        {label && <span className={s.real}>{label}</span>}
        <svg className={s.cardSvg} viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
          {/* the printed field: each row its own figure, 80 times */}
          <g className={s.field}>
            {CARD_ROWS.slice(2).map((d, i) => (
              <text key={d} x={CARD.left} y={CARD.top + (i + 2) * CARD.row + 16} textLength={80 * CARD.col - 3} lengthAdjust="spacing">{d.repeat(80)}</text>
            ))}
          </g>
          {picture && <rect className={s.cardGround} x={WINDOW.x - 6} y={WINDOW.y - 4} width={WINDOW.w + 12} height={WINDOW.h + 8} />}
          {/* the print line and the holes under it */}
          <g className={s.print}>
            {chars.map((ch, c) => dotsOf(ch).map(([x, y]) => (
              <circle key={`${c}-${x}-${y}`} cx={r2(CARD.left + c * CARD.col + 1.6 + x * 1.55 + (ink() - 0.5) * 0.3)} cy={r2(14 + y * 1.55 + (ink() - 0.5) * 0.3)} r={r2(0.72 + (ink() - 0.4) * 0.2)} />
            )))}
          </g>
          <g className={s.holes} clipPath={picture ? `url(#${id})` : undefined}>
            {chars.map((ch, c) => holesOf(ch).map(row => (
              <rect key={`${c}-${row}`} x={CARD.left + c * CARD.col + 1.5} y={CARD.top + row * CARD.row + 2} width="6" height="17" />
            )))}
          </g>
          {picture && (
            <clipPath id={id}>
              <rect x="0" y="0" width={WINDOW.x - 6} height={CARD.h} />
            </clipPath>
          )}
        </svg>
        {picture && (
          <span className={s.cardWindow} style={{ left: `${WINDOW.x / CARD.w * 100}%`, top: `${WINDOW.y / CARD.h * 100}%`, width: `${WINDOW.w / CARD.w * 100}%`, height: `${WINDOW.h / CARD.h * 100}%` }}>
            {picture}
          </span>
        )}
      </span>
    </span>
  )
}

// The year alone, punched: four columns of the digit rows
function YearPunch({ year }) {
  return (
    <svg className={s.yearPunch} viewBox="0 0 44 104" aria-hidden="true">
      <g className={s.field}>
        {CARD_ROWS.slice(2).map((d, i) => <text key={d} x="2" y={i * 10 + 9} textLength="39" lengthAdjust="spacing">{d.repeat(4)}</text>)}
      </g>
      <g className={s.holes}>
        {[...year].map((d, c) => <rect key={c} x={2 + c * 10.4} y={Number(d) * 10 + 1} width="6.4" height="8.6" />)}
      </g>
    </svg>
  )
}

/** A card of text, in a punch card's shape: a print line in dots, the year punched in the corner. */
function TextCard({ print, year, children, className = '' }) {
  return (
    <div className={`${s.card} ${s.textCard} ${className}`}>
      <div className={s.cardFace}>
        <header className={s.printLine}>
          <Dots as="h2" className={s.cardPrint}>{print}</Dots>
          {year && <YearPunch year={year} />}
        </header>
        {children}
      </div>
    </div>
  )
}

// ── Screens ──────────────────────────────────────────────────────────
function TitlePage({ href }) {
  const years = ROOMS.map(r => r.year).join(' ')
  return (
    <div className={s.title}>
      <header className={s.masthead}>
        <Dots as="h1" className={s.huge}>{TITLE.name}</Dots>
        <p className={s.lede}>{TITLE.subtitle}</p>
        <p><a className={s.link} href={href('timeline')}><Words>{TITLE.enter}</Words></a></p>
      </header>

      <div className={s.titleCard}>
        <PunchCard text={`${TITLE.name} ${years}`} className={s.upright} />
        <Dots as="p" className={s.caption}>{TITLE.by}</Dots>
      </div>

      <section className={s.column}>
        <Dots as="h2" className={s.caption}>{ABOUT.label}</Dots>
        <Notes items={ABOUT.paragraphs.map(p => <p key={p}>{p}</p>)} />
      </section>

      <section className={s.column}>
        <Dots as="h2" className={s.caption}>{TITLE.about}</Dots>
        <Notes items={[
          <p key="by">{ABOUT.designedBy} <b>{ABOUT.name}</b>. {ABOUT.built}</p>,
          ...ABOUT.links.map(l => <p key={l.label}><a className={s.link} href={l.href} target="_blank" rel="noopener noreferrer"><Words>{l.label}</Words></a></p>),
        ]} />
      </section>
    </div>
  )
}

function TimelinePage({ href, art }) {
  const label = (r) => (
    <span key={r.level} className={s.axisLabel}>
      <span className={s.num}>{r.level}</span>
      <Dots className={s.caption}>{r.title}</Dots>
    </span>
  )
  return (
    <div className={s.timeline}>
      <header className={s.masthead}>
        <Dots as="h1" className={s.big}>{WORDS.timelineTitle}</Dots>
      </header>

      <div className={s.key}>
        <div className={s.axis} aria-hidden="true">{ROOMS.slice(0, 3).map(label)}</div>
        <div className={s.table}>
          {ROOMS.map(r => (
            <a key={r.level} className={s.cell} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`}>
              <Picture room={r} art={art} />
              <span className={s.cellYear}>
                <span className={`${s.ring} ${isFound(r.level) ? s.punched : ''}`} />
                {r.year}
              </span>
            </a>
          ))}
        </div>
        <div className={s.axis} aria-hidden="true">{ROOMS.slice(3).map(label)}</div>
        <Dots as="p" className={`${s.caption} ${s.keyCaption}`}>{foundLine}</Dots>
      </div>

      <section className={s.column}>
        <Notes items={ROOMS.map(r => (
          <p key={r.level}>
            <a className={s.link} href={href('level', r.level)}><Words>{r.title}</Words></a>
            {isFound(r.level) && <><br />{r.name}</>}
          </p>
        ))} />
        <p className={s.links}>
          <a className={s.link} href={href('collection')}><Words>{collectionLine}</Words></a>
          <a className={s.link} href={href('title')}><Words>{TITLE.about}</Words></a>
          <button type="button" className={s.link}><Words>{WORDS.reset}</Words></button>
        </p>
      </section>
    </div>
  )
}

function CollectionPage({ href, art }) {
  return (
    <div className={s.collection}>
      <header className={s.masthead}>
        <Dots as="h1" className={s.big}>{WORDS.collection}</Dots>
        <p className={s.mono}>{foundLine}</p>
      </header>
      <ol className={s.records} start={0}>
        {ROOMS.map(r => {
          const found = isFound(r.level)
          return (
            <li key={r.level} className={s.record}>
              <a className={s.cardLink} href={href('level', r.level)}>
                {found
                  ? <PunchCard text={`${r.year} ${r.name}`} picture={<Picture room={r} art={art} />} label={`No. ${pad(r.level + 1)}, ${r.year}, ${r.name}`} />
                  : <PunchCard label={`No. ${pad(r.level + 1)}, ${r.year}, ${r.title}`} />}
              </a>
              <div className={s.recordNote}>
                <span className={s.num} aria-hidden="true">{r.level}</span>
                <div className={s.noteBody}>
                  {found ? (
                    <>
                      <p><b>{r.name}</b><br />{r.title}, {r.year}</p>
                      <p>{r.description}</p>
                    </>
                  ) : (
                    <>
                      <p><b>{r.title}</b>, {r.year}</p>
                      <p>{WORDS.unfound}</p>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      <p><a className={s.link} href={href('timeline')}><Words>{WORDS.back}</Words></a></p>
    </div>
  )
}

function LevelPage({ room, href, go, art }) {
  const next = ROOMS[room.level + 1]
  const [w, h] = room.frame
  return (
    <div className={s.level}>
      <div className={s.left}>
        <p className={s.era}>
          <Dots className={s.eraYear}>{room.year}</Dots>
          <Dots className={s.eraTitle}>{room.title}</Dots>
        </p>
        <TextCard print={room.title} year={room.year} className={s.intro}>
          <p>{room.intro}</p>
          <Dots as="h3" className={s.caption}>{WORDS.objectives}</Dots>
          <Notes items={room.objectives.map(o => <p key={o}>{o}</p>)} />
          <p><button type="button" className={s.link}><Words>{WORDS.begin}</Words></button></p>
        </TextCard>
        <section className={s.tracker}>
          <Dots as="h2" className={s.caption}>{WORDS.objectives}</Dots>
          <Notes items={room.objectives.map((o, i) => {
            const done = MOCK.done.includes(i)
            return <p key={o} className={`${s.objective} ${done ? s.done : ''}`}><span className={`${s.ring} ${done ? s.punched : ''}`} aria-hidden="true" /><span>{o}</span></p>
          })} />
        </section>
      </div>

      <div className={s.middle}>
        <div className={s.standin} style={{ aspectRatio: `${w} / ${h}`, '--w': w, '--h': h }}>artifact {w} × {h}</div>
        <Dots as="p" className={`${s.caption} ${s.hint}`}>{room.hints[MOCK.hintFor]}</Dots>
      </div>

      <div className={s.right}>
        <p className={s.rooms}>
          {ROOMS.map(r => (
            <a key={r.level} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`} aria-current={r.level === room.level ? 'page' : undefined}
              className={`${s.ring} ${isFound(r.level) ? s.punched : ''} ${r.level === room.level ? s.now : ''}`} />
          ))}
        </p>
        <TextCard print={WORDS.discovered} year={room.year} className={s.discovery}>
          <Picture room={room} art={art} className={s.discoveryPicture} />
          <p className={s.year}>{room.year}</p>
          <Dots as="h3" className={s.name}>{room.name}</Dots>
          <p>{room.description}</p>
          <p><button type="button" className={s.link} onClick={() => (next ? go('level', next.level) : go('timeline'))}><Words>{WORDS.cont}</Words></button></p>
        </TextCard>
        <TextCard print={WORDS.smallScreen} className={s.notice}>
          <p><button type="button" className={s.link}><Words>{WORDS.smallScreenGo}</Words></button></p>
        </TextCard>
        <p className={s.exit}>
          <button type="button" className={s.link}><Words>{WORDS.cont}</Words></button>
          <a className={s.link} href={href('timeline')}><Words>{WORDS.back}</Words></a>
        </p>
      </div>
    </div>
  )
}

export default function PunchCardConcept({ screen, level, href, go, art }) {
  return (
    <div className={s.page}>
      {screen === 'title' && <TitlePage href={href} />}
      {screen === 'timeline' && <TimelinePage href={href} art={art} />}
      {screen === 'collection' && <CollectionPage href={href} art={art} />}
      {screen === 'level' && <LevelPage room={ROOMS[level]} href={href} go={go} art={art} />}
    </div>
  )
}
