// src/pages/styleLab/D_ColourField.jsx
//
// Concept D, "Colour field": every page is one flat, loud colour, edge to
// edge, with black Helvetica set as large as it will go and boxes with hard
// 2px edges. Each era has its own colour: the timeline is six tiles of
// them, and a room turns the whole window its colour. Nothing fades; a link
// under the pointer swaps its colours.
import s from './D_ColourField.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine } from './content'
import { CurrentCard } from './CurrentCard'

// One field per era, in room order, and one each for the other pages. All
// are light enough for black text at well over 4.5:1.
export const ERA = ['#22e06c', '#ffe01a', '#4f95ff', '#ff8a1f', '#ff78bd', '#b79bff']
const FIELD = { title: '#ff4b33', about: '#ffe01a', collection: '#19d3e8', notice: '#ffffff' }

function TitlePage({ href }) {
  return (
    <>
      <section className={`${s.field} ${s.titleField}`} style={{ '--field': FIELD.title }}>
        <h1 className={s.giant}>{TITLE.name.split(' ').map(w => <span key={w}>{w} </span>)}</h1>
        <div className={s.titleFoot}>
          <p className={s.lede}>{TITLE.subtitle}</p>
          <a className={s.slab} href={href('timeline')}>{TITLE.enter} <span aria-hidden="true">→</span></a>
        </div>
        <p className={s.strip}>
          <span>{TITLE.by}</span>
          <span>{TITLE.about} <span aria-hidden="true">↓</span></span>
        </p>
      </section>
      <section className={`${s.field} ${s.aboutField}`} style={{ '--field': FIELD.about }}>
        <h2 className={s.huge}>{ABOUT.label}</h2>
        <div className={s.columns}>
          {ABOUT.paragraphs.map(p => <p key={p}>{p}</p>)}
          <p>{ABOUT.designedBy} <b>{ABOUT.name}</b>. {ABOUT.built}</p>
        </div>
        <p className={s.slabs}>
          {ABOUT.links.map(l => <a key={l.label} className={s.slab} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>)}
        </p>
      </section>
    </>
  )
}

function TimelinePage({ href }) {
  return (
    <div className={s.timeline}>
      <div className={s.tiles}>
        {ROOMS.map((r, i) => (
          <a key={r.level} className={s.tile} style={{ '--field': ERA[i] }} href={href('level', r.level)}>
            <span className={s.tileYear}>{r.year}</span>
            <span className={s.tileArrow} aria-hidden="true">→</span>
            <span className={s.tileTitle}>{r.title}</span>
            <span className={s.tileName}>{isFound(r.level) ? r.name : ' '}</span>
          </a>
        ))}
      </div>
      <p className={`${s.strip} ${s.timelineStrip}`}>
        <span>{WORDS.timelineTitle}</span>
        <span className={s.stripLinks}>
          <a href={href('collection')}>{collectionLine}</a>
          <a href={href('title')}>{TITLE.about}</a>
          <button type="button">{WORDS.reset}</button>
        </span>
      </p>
    </div>
  )
}

function CollectionPage({ href, go, art }) {
  return (
    <section className={`${s.field} ${s.collectionField}`} style={{ '--field': FIELD.collection }}>
      <h1 className={s.giant}>{WORDS.collection}</h1>
      <p className={s.lede}>{foundLine}</p>
      <div className={s.cards}>
        {ROOMS.map(r => <CurrentCard key={r.level} room={r} art={art} width={280} onOpen={() => go('level', r.level)} />)}
      </div>
      <p className={s.slabs}><a className={s.slab} href={href('timeline')}>{WORDS.back}</a></p>
    </section>
  )
}

function LevelPage({ room, href, go }) {
  const next = ROOMS[room.level + 1]
  return (
    <>
      <section className={`${s.field} ${s.levelField}`} style={{ '--field': ERA[room.level] }}>
        <header className={s.hud}>
          <p className={s.hudEra}>
            <span className={s.hudYear}>{room.year}</span>
            <span className={s.hudTitle}>{room.title}</span>
          </p>
          <p className={s.dots}>
            {ROOMS.map(r => (
              <a key={r.level} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`} aria-current={r.level === room.level ? 'page' : undefined}
                className={`${s.dot} ${r.level === room.level ? s.dotNow : isFound(r.level) ? s.dotDone : ''}`} />
            ))}
          </p>
        </header>

        <div className={`${s.box} ${s.white} ${s.intro}`}>
          <p className={s.small}>{room.year}</p>
          <h2 className={s.boxTitle}>{room.title}</h2>
          <p>{room.intro}</p>
          <p className={s.small}>{WORDS.objectives}</p>
          <ul className={s.checks}>{room.objectives.map(o => <li key={o}><span className={s.check} />{o}</li>)}</ul>
          <button type="button" className={s.slab}>{WORDS.begin}</button>
        </div>

        <div className={s.artifact}>
          <div className={s.standin} style={{ aspectRatio: `${room.frame[0]} / ${room.frame[1]}`, '--w': room.frame[0], '--h': room.frame[1] }}>artifact</div>
          <p className={`${s.box} ${s.white} ${s.hint}`} role="status">{room.hints[MOCK.hintFor]}</p>
        </div>

        <div className={`${s.box} ${s.black} ${s.discovery}`}>
          <p className={s.small}>{WORDS.discovered}</p>
          <p className={s.bigYear}>{room.year}</p>
          <h2 className={s.boxTitle}>{room.name}</h2>
          <p>{room.description}</p>
          <button type="button" className={`${s.slab} ${s.slabField}`} onClick={() => (next ? go('level', next.level) : go('timeline'))}>{WORDS.cont}</button>
        </div>

        <div className={`${s.box} ${s.tracker}`}>
          <p className={s.small}>{WORDS.objectives}</p>
          <ul className={s.checks}>
            {room.objectives.map((o, i) => {
              const done = MOCK.done.includes(i)
              return <li key={o} className={done ? s.done : ''}><span className={`${s.check} ${done ? s.checkDone : ''}`} />{o}</li>
            })}
          </ul>
        </div>

        <div className={s.exit}>
          <button type="button" className={`${s.slab} ${s.cont}`}>{WORDS.cont}</button>
          <a className={s.back} href={href('timeline')}>{WORDS.back}</a>
        </div>
      </section>

      <section className={`${s.field} ${s.noticeField}`} style={{ '--field': FIELD.notice }}>
        <h2 className={s.huge}>{WORDS.smallScreen}</h2>
        <p className={s.slabs}><button type="button" className={s.slab}>{WORDS.smallScreenGo}</button></p>
      </section>
    </>
  )
}

export default function ColourField({ screen, level, href, go, art }) {
  return (
    <div className={s.page}>
      {screen === 'title' && <TitlePage href={href} />}
      {screen === 'timeline' && <TimelinePage href={href} />}
      {screen === 'collection' && <CollectionPage href={href} go={go} art={art} />}
      {screen === 'level' && <LevelPage room={ROOMS[level]} href={href} go={go} />}
    </div>
  )
}
