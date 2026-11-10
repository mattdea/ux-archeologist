// src/pages/styleLab/A_Document.jsx
//
// Concept A, "Unstyled document": the museum as a web page nobody styled.
// Times, blue and purple underlined links, <hr>, bulleted lists, bordered
// tables, the browser's own buttons, checkboxes and fieldsets. The CSS
// module mostly hands everything back to the browser (all: revert).
import { useRef } from 'react'
import s from './A_Document.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine } from './content'
import { CurrentCard, ArtifactPicture } from './CurrentCard'

function About({ anchor }) {
  return (
    <>
      <h2 ref={anchor}>{ABOUT.label}</h2>
      {ABOUT.paragraphs.map(p => <p key={p}>{p}</p>)}
      <p>
        {ABOUT.designedBy} <b>{ABOUT.name}</b><br />
        {ABOUT.built}
      </p>
      <ul>
        {ABOUT.links.map(l => <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></li>)}
      </ul>
    </>
  )
}

function TitlePage({ href, art }) {
  const about = useRef(null)
  return (
    <>
      <h1>{TITLE.name}</h1>
      <p>{TITLE.subtitle}</p>
      <p>
        {ROOMS.map(r => (
          <a key={r.level} href={href('level', r.level)} className={s.thumb} aria-label={`${r.year} ${r.title}`}>
            <ArtifactPicture room={r} art={art} className={s.keep} />
          </a>
        ))}
      </p>
      <p>
        <a href={href('timeline')}>{TITLE.enter}</a>
        {' | '}
        <a href={href('title')} onClick={(e) => { e.preventDefault(); about.current?.scrollIntoView() }}>{TITLE.about}</a>
      </p>
      <hr />
      <About anchor={about} />
      <hr />
      <address>{TITLE.by}</address>
    </>
  )
}

function TimelinePage({ href }) {
  return (
    <>
      <h1>{WORDS.timelineTitle}</h1>
      <ul>
        {ROOMS.map(r => (
          <li key={r.level}>
            {r.year} <a href={href('level', r.level)}>{r.title}</a> →
            {isFound(r.level) && <ul><li>{r.name}</li></ul>}
          </li>
        ))}
      </ul>
      <hr />
      <p>
        <a href={href('collection')}>{collectionLine}</a>
        {' | '}
        <a href={href('title')}>{TITLE.about}</a>
        {' | '}
        <a href={href('timeline')}>{WORDS.reset}</a>
      </p>
    </>
  )
}

function CollectionPage({ href, go, art }) {
  const rows = [ROOMS.slice(0, 3), ROOMS.slice(3)]
  return (
    <>
      <h1>{WORDS.collection}</h1>
      <p>{foundLine}</p>
      <table className={s.cards}>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map(r => (
                <td key={r.level}>
                  <div className={s.keep}><CurrentCard room={r} art={art} width={250} onOpen={() => go('level', r.level)} /></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p><a href={href('timeline')}>{WORDS.back}</a></p>
    </>
  )
}

function LevelPage({ room, href, go }) {
  const next = ROOMS[room.level + 1]
  return (
    <>
      <p>
        <a href={href('timeline')}>{WORDS.back}</a>
        {' | '}
        {ROOMS.map((r, i) => (
          <span key={r.level}>
            {i > 0 && ' '}
            {r.level === room.level ? <b>{r.year}</b> : <a href={href('level', r.level)}>{r.year}</a>}
          </span>
        ))}
      </p>
      <h1>{room.year} {room.title}</h1>
      <hr />
      <table className={s.frame}>
        <tbody>
          <tr>
            <td className={s.side}>
              <h2>{room.title}</h2>
              <p>{room.intro}</p>
              <p><b>{WORDS.objectives}</b></p>
              <ul>{room.objectives.map(o => <li key={o}>{o}</li>)}</ul>
              <p><button type="button">{WORDS.begin}</button></p>
            </td>
            <td className={s.artifactCell}>
              <div className={s.standin} style={{ aspectRatio: `${room.frame[0]} / ${room.frame[1]}`, maxWidth: room.frame[0] }}>
                artifact
              </div>
            </td>
            <td className={s.side}>
              <fieldset>
                <legend>{WORDS.discovered}</legend>
                <h1>{room.year}</h1>
                <hr />
                <h2>{room.name}</h2>
                <p>{room.description}</p>
                <p><button type="button" onClick={() => (next ? go('level', next.level) : go('timeline'))}>{WORDS.cont}</button></p>
              </fieldset>
            </td>
          </tr>
        </tbody>
      </table>
      <fieldset>
        <legend>{WORDS.objectives}</legend>
        {room.objectives.map((o, i) => {
          const done = MOCK.done.includes(i)
          return (
            <div key={o}>
              <label>
                <input type="checkbox" defaultChecked={done} /> {done ? <s>{o}</s> : o}
              </label>
            </div>
          )
        })}
      </fieldset>
      <blockquote><i>{room.hints[MOCK.hintFor]}</i></blockquote>
      <p align="right"><button type="button">{WORDS.cont}</button></p>
      <hr />
      <table>
        <tbody>
          <tr>
            <td>
              <p><b>{WORDS.smallScreen}</b></p>
              <p><button type="button">{WORDS.smallScreenGo}</button></p>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default function Document({ screen, level, href, go, art }) {
  return (
    <div className={s.doc}>
      {screen === 'title' && <TitlePage href={href} art={art} />}
      {screen === 'timeline' && <TimelinePage href={href} />}
      {screen === 'collection' && <CollectionPage href={href} go={go} art={art} />}
      {screen === 'level' && <LevelPage room={ROOMS[level]} href={href} go={go} />}
    </div>
  )
}
