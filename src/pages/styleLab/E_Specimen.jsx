// src/pages/styleLab/E_Specimen.jsx
//
// Concept E, "Specimen sheet": the museum as a catalogue sheet. A strict
// grid of small square cells on white, a picture or a block of text in
// each, a running number and a tiny caption under every one. Nothing is
// bigger than anything else: the title is a caption, a room is a row of
// specimens, the artifact is the one large cell, with a scale bar.
import s from './E_Specimen.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine, pad } from './content'
import { CurrentCard, ArtifactPicture } from './CurrentCard'

const other = (art) => (art === 'illustrated' ? 'drawn' : 'illustrated')

// A cell: its contents in a square (or free height for text), then the
// caption. `n` is the sheet's running number.
function Cell({ n, cap, sub, href, onClick, span, text, children, className = '', external }) {
  const body = (
    <>
      <span className={text ? s.text : s.square}>{children}</span>
      <span className={s.cap}>
        <span className={s.no}>{String(n).padStart(3, '0')}</span>
        <span>{cap}{sub && <span className={s.sub}>{sub}</span>}</span>
      </span>
    </>
  )
  const cls = `${s.cell} ${className}`
  const style = span ? { gridColumn: `span ${span}` } : undefined
  if (href) return <a className={cls} style={style} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a>
  if (onClick) return <button type="button" className={cls} style={style} onClick={onClick}>{body}</button>
  return <div className={cls} style={style}>{body}</div>
}

// A card can't sit inside a link (it is a button itself), so its cell is a
// plain box and the card is what you press
function CardCell({ n, room, art, go, zoom = 0.3 }) {
  return (
    <div className={s.cell}>
      <span className={`${s.square} ${s.cardSquare}`}>
        <CurrentCard room={room} art={art} zoom={zoom} onOpen={() => go('level', room.level)} />
      </span>
      <span className={s.cap}>
        <span className={s.no}>{String(n).padStart(3, '0')}</span>
        <span>No. {pad(room.level + 1)}<span className={s.sub}>{isFound(room.level) ? room.name : WORDS.unfound}</span></span>
      </span>
    </div>
  )
}

function Head({ children }) {
  return <p className={s.head}>{children}</p>
}

function TitlePage({ href, art }) {
  let n = 0
  return (
    <>
      <Head><b>{TITLE.name}</b><span>{TITLE.subtitle}</span><span className={s.right}>{TITLE.by}</span></Head>
      <div className={s.sheet}>
        <Cell n={++n} cap={TITLE.enter} href={href('timeline')}><span className={s.arrow} aria-hidden="true">→</span></Cell>
        {ROOMS.map(r => (
          <Cell key={r.level} n={++n} cap={r.year} sub={r.title} href={href('level', r.level)}>
            <ArtifactPicture room={r} art={art} className={s.fill} />
          </Cell>
        ))}
        <Cell n={++n} cap={collectionLine} href={href('collection')}><span className={s.stack} aria-hidden="true"><i /><i /><i /></span></Cell>
        {ABOUT.paragraphs.map((p, i) => (
          <Cell key={p} n={++n} cap={i === 0 ? TITLE.about : ABOUT.label} span={2} text><span className={s.para}>{p}</span></Cell>
        ))}
        <Cell n={++n} cap={ABOUT.title} span={2} text>
          <span className={s.para}>{ABOUT.designedBy} {ABOUT.name}. {ABOUT.built}</span>
          <span className={s.para}>
            {ABOUT.links.map((l, i) => <span key={l.label}>{i > 0 && ' · '}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></span>)}
          </span>
        </Cell>
      </div>
    </>
  )
}

function TimelinePage({ href, go, art }) {
  let n = 0
  return (
    <>
      <Head>
        <b>{WORDS.timelineTitle}</b>
        <span className={s.right}>
          <a href={href('collection')}>{collectionLine}</a>
          <a href={href('title')}>{TITLE.about}</a>
          <button type="button">{WORDS.reset}</button>
        </span>
      </Head>
      <div className={s.sheet}>
        {ROOMS.map(r => {
          const found = isFound(r.level)
          const to = href('level', r.level)
          return (
            <div key={r.level} className={s.rowOfCells}>
              <Cell n={++n} cap={r.year} sub={r.title} href={to} className={s.rowHead}>
                <span className={s.yearBig}>{r.year}</span>
              </Cell>
              <Cell n={++n} cap={r.title} sub={found ? r.name : ''} href={to}><ArtifactPicture room={r} art={art} className={s.fill} /></Cell>
              <Cell n={++n} cap={r.title} href={to}><ArtifactPicture room={r} art={other(art)} className={s.fill} /></Cell>
              <CardCell n={++n} room={r} art={art} go={go} />
              <Cell n={++n} cap={r.title} span={2} text href={to}><span className={s.para}>{r.intro}</span></Cell>
              <Cell n={++n} cap={WORDS.objectives} span={2} text href={to}>
                {r.objectives.map(o => <span key={o} className={s.line}><span aria-hidden="true">{found ? '●' : '○'}</span> {o}</span>)}
              </Cell>
            </div>
          )
        })}
      </div>
    </>
  )
}

function CollectionPage({ href, go, art }) {
  let n = 0
  return (
    <>
      <Head>
        <b>{WORDS.collection}</b><span>{foundLine}</span>
        <span className={s.right}><a href={href('timeline')}>{WORDS.back}</a></span>
      </Head>
      <div className={`${s.sheet} ${s.six}`}>
        {ROOMS.map(r => <CardCell key={r.level} n={++n} room={r} art={art} go={go} zoom={0.68} />)}
        {[art, other(art)].map(kind => ROOMS.map(r => (
          <Cell key={kind + r.level} n={++n} cap={r.year} sub={r.title} href={href('level', r.level)}>
            <ArtifactPicture room={r} art={kind} className={s.fill} />
          </Cell>
        )))}
      </div>
    </>
  )
}

function LevelPage({ room, href, go, art }) {
  let n = 0
  const next = ROOMS[room.level + 1]
  const [w, h] = room.frame
  return (
    <>
      <Head>
        <a href={href('timeline')}>{WORDS.back}</a>
        <b>{room.year} {room.title}</b>
        <span className={s.dots}>
          {ROOMS.map(r => (
            <a key={r.level} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`} aria-current={r.level === room.level ? 'page' : undefined}>
              {r.level === room.level ? '◉' : isFound(r.level) ? '●' : '○'}
            </a>
          ))}
        </span>
        <span className={s.right}><button type="button">{WORDS.cont}</button></span>
      </Head>
      <div className={`${s.sheet} ${s.level}`}>
        <Cell n={++n} cap={room.year} sub={room.title} text className={s.introCell}>
          <span className={s.para}>{room.intro}</span>
          <span className={s.label}>{WORDS.objectives}</span>
          {room.objectives.map(o => <span key={o} className={s.line}><span aria-hidden="true">○</span> {o}</span>)}
          <button type="button" className={s.go}>{WORDS.begin}</button>
        </Cell>

        <div className={`${s.cell} ${s.artifactCell}`}>
          <span className={s.standin} style={{ aspectRatio: `${w} / ${h}`, '--w': w, '--h': h }}>
            <span className={s.standinBox}>artifact</span>
            {/* a scale bar: one tick every 100 of the artifact's own pixels */}
            <span className={s.scale} aria-hidden="true" style={{ backgroundSize: `${10000 / w}% 100%` }} />
          </span>
          <span className={s.cap}>
            <span className={s.no}>{String(++n).padStart(3, '0')}</span>
            <span>{room.title}<span className={s.sub}>{w} × {h}</span></span>
          </span>
          <span className={s.hint} role="status">{room.hints[MOCK.hintFor]}</span>
        </div>

        <Cell n={++n} cap={WORDS.discovered} sub={room.year} text className={s.discoveryCell}>
          <span className={s.discoveryPic}><ArtifactPicture room={room} art={art} className={s.fill} /></span>
          <span className={s.label}>{room.name}</span>
          <span className={s.para}>{room.description}</span>
          <button type="button" className={s.go} onClick={() => (next ? go('level', next.level) : go('timeline'))}>{WORDS.cont}</button>
        </Cell>

        <Cell n={++n} cap={WORDS.objectives} text className={s.trackerCell}>
          {room.objectives.map((o, i) => {
            const done = MOCK.done.includes(i)
            return <span key={o} className={`${s.line} ${done ? s.done : ''}`}><span aria-hidden="true">{done ? '●' : '○'}</span> {o}</span>
          })}
        </Cell>

        <Cell n={++n} cap={WORDS.smallScreenGo} text className={s.noticeCell} onClick={() => {}}>
          <span className={s.para}>{WORDS.smallScreen}</span>
        </Cell>
      </div>
    </>
  )
}

export default function Specimen({ screen, level, href, go, art }) {
  return (
    <div className={s.page}>
      {screen === 'title' && <TitlePage href={href} art={art} />}
      {screen === 'timeline' && <TimelinePage href={href} go={go} art={art} />}
      {screen === 'collection' && <CollectionPage href={href} go={go} art={art} />}
      {screen === 'level' && <LevelPage room={ROOMS[level]} href={href} go={go} art={art} />}
    </div>
  )
}
