// src/pages/styleLab/F_Notebook.jsx
//
// Concept F, "Notebook": the museum as someone's own page. Pale yellow
// paper, Times, small monospace notes, and almost everything a <details>
// toggle in a thin box. A clock runs in the corner, links are highlighter
// strokes, the cards and the artifact are taped in slightly crooked, the
// hint is a sticky note, and the objectives are real checkboxes you can
// tick. (Under reduced motion the star stops turning, the colons stop
// blinking and the clock drops its seconds.)
import { useEffect, useState } from 'react'
import s from './F_Notebook.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine, pad } from './content'
import { CurrentCard } from './CurrentCard'

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const two = (n) => String(n).padStart(2, '0')

function Clock() {
  const [now, setNow] = useState(() => new Date())
  const still = reducedMotion()
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), still ? 15000 : 1000)
    return () => clearInterval(id)
  }, [still])
  return (
    <p className={s.clock}>
      <time dateTime={now.toISOString()} className={s.time}>
        {two(now.getHours())}<i>:</i>{two(now.getMinutes())}{!still && <><i>:</i>{two(now.getSeconds())}</>}
      </time>
      <span className={s.date}>{now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
    </p>
  )
}

// A coloured strip with a label, then whatever is in the box
function Box({ label, tone = 'cyan', children, className = '' }) {
  return (
    <section className={`${s.box} ${className}`}>
      <h2 className={`${s.strip} ${s[tone]}`}>{label}</h2>
      <div className={s.boxBody}>{children}</div>
    </section>
  )
}

function Checks({ items, done = [], name }) {
  return (
    <ul className={s.checks}>
      {items.map((o, i) => (
        <li key={o}>
          <label><input type="checkbox" defaultChecked={done.includes(i)} name={`${name}-${i}`} /> <span>{o}</span></label>
        </li>
      ))}
    </ul>
  )
}

function TitlePage({ href }) {
  return (
    <div className={s.column}>
      <h1 className={s.title}><span className={s.star} aria-hidden="true">✶</span>{TITLE.name}</h1>
      <p className={s.lede}>{TITLE.subtitle}</p>
      <p><a className={s.btn} href={href('timeline')}>{TITLE.enter}</a></p>
      <details className={s.toggle} open>
        <summary>{TITLE.about}</summary>
        <div className={s.toggleBody}>
          <p className={s.note}>{ABOUT.label}</p>
          {ABOUT.paragraphs.map(p => <p key={p}>{p}</p>)}
          <p>{ABOUT.designedBy} <b>{ABOUT.name}</b>. {ABOUT.built}</p>
          <p>{ABOUT.links.map((l, i) => <span key={l.label}>{i > 0 && ' '}<a className={s.hl} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></span>)}</p>
        </div>
      </details>
      <p className={s.note}>{TITLE.by}</p>
    </div>
  )
}

function TimelinePage({ href }) {
  return (
    <div className={s.column}>
      <Box label={WORDS.timelineTitle} tone="cyan">
        {ROOMS.map((r, i) => {
          const found = isFound(r.level)
          return (
            <details key={r.level} className={s.entry} open={i === 0}>
              <summary>
                <span className={s.year}>{r.year}</span>
                <span className={s.entryTitle}>{r.title}</span>
                {found && <span className={s.found}><span aria-hidden="true">✓ </span>{r.name}</span>}
              </summary>
              <div className={s.entryBody}>
                <p>{r.intro}</p>
                <Checks items={r.objectives} done={found ? [0, 1, 2] : []} name={`t${r.level}`} />
                <p><a className={s.btn} href={href('level', r.level)}>{WORDS.begin}</a></p>
              </div>
            </details>
          )
        })}
      </Box>
      <p className={s.links}>
        <a className={s.hl} href={href('collection')}>{collectionLine}</a>
        <a className={s.hl} href={href('title')}>{TITLE.about}</a>
        <button type="button" className={s.hl}>{WORDS.reset}</button>
      </p>
    </div>
  )
}

const TURNS = [-1.4, 1, -0.6, 1.6, -1, 0.8]

function CollectionPage({ href, go, art }) {
  return (
    <div className={`${s.column} ${s.wide}`}>
      <h1 className={`${s.title} ${s.smaller}`}>{WORDS.collection}</h1>
      <p className={s.note}>{foundLine}</p>
      <div className={s.cards}>
        {ROOMS.map((r, i) => {
          const found = isFound(r.level)
          return (
            <details key={r.level} className={s.toggle} open={found}>
              <summary>No. {pad(r.level + 1)} · {found ? r.name : WORDS.unfound}</summary>
              <div className={s.taped} style={{ rotate: `${TURNS[i]}deg` }}>
                <span className={s.tape} aria-hidden="true" />
                <CurrentCard room={r} art={art} width={270} onOpen={() => go('level', r.level)} />
              </div>
            </details>
          )
        })}
      </div>
      <p className={s.links}><a className={s.hl} href={href('timeline')}>{WORDS.back}</a></p>
    </div>
  )
}

function LevelPage({ room, href, go }) {
  const next = ROOMS[room.level + 1]
  return (
    <div className={`${s.column} ${s.full}`}>
      <p className={s.links}>
        <a className={s.hl} href={href('timeline')}>{WORDS.back}</a>
        <span className={s.dots}>
          {ROOMS.map(r => (
            <a key={r.level} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`} aria-current={r.level === room.level ? 'page' : undefined}>
              {isFound(r.level) ? '●' : '○'}
            </a>
          ))}
        </span>
      </p>
      <h1 className={s.roomHead}><span className={s.year}>{room.year}</span> <span className={s.wavy}>{room.title}</span></h1>

      <div className={s.room}>
        <div className={s.notes}>
          <details className={`${s.toggle} ${s.block}`} open>
            <summary>{room.title}</summary>
            <div className={s.toggleBody}>
              <p>{room.intro}</p>
              <p className={s.note}>{WORDS.objectives}</p>
              <ul className={s.plainList}>{room.objectives.map(o => <li key={o}>{o}</li>)}</ul>
              <p><button type="button" className={s.btn}>{WORDS.begin}</button></p>
            </div>
          </details>

          <Box label={WORDS.objectives} tone="green">
            <Checks items={room.objectives} done={MOCK.done} name={`l${room.level}`} />
          </Box>

          <p className={s.sticky} role="status">{room.hints[MOCK.hintFor]}</p>
        </div>

        <div className={s.middle}>
          <div className={s.artifact} style={{ aspectRatio: `${room.frame[0]} / ${room.frame[1]}`, '--w': room.frame[0], '--h': room.frame[1] }}>
            <span className={`${s.tape} ${s.tapeLeft}`} aria-hidden="true" />
            <span className={`${s.tape} ${s.tapeRight}`} aria-hidden="true" />
            artifact
          </div>
          <p className={s.under}><button type="button" className={s.btn}>{WORDS.cont}</button></p>
        </div>

        <div className={s.notes}>
          <Box label={WORDS.discovered} tone="pink">
            <p className={s.bigYear}>{room.year}</p>
            <h3 className={s.name}>{room.name}</h3>
            <p>{room.description}</p>
            <p><button type="button" className={s.btn} onClick={() => (next ? go('level', next.level) : go('timeline'))}>{WORDS.cont}</button></p>
          </Box>
          <div className={`${s.sticky} ${s.yellow}`}>
            <p>{WORDS.smallScreen}</p>
            <p><button type="button" className={s.btn}>{WORDS.smallScreenGo}</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Notebook({ screen, level, href, go, art }) {
  return (
    <div className={s.page}>
      <Clock />
      {screen === 'title' && <TitlePage href={href} />}
      {screen === 'timeline' && <TimelinePage href={href} />}
      {screen === 'collection' && <CollectionPage href={href} go={go} art={art} />}
      {screen === 'level' && <LevelPage room={ROOMS[level]} href={href} go={go} />}
    </div>
  )
}
