// src/pages/styleLab/B2_Index.jsx
//
// Concept B2, "Index, refined" (round 2): concept B's one small monospace
// list, with two things changed.
//
// 1. The collection's cards are redrawn in the list's own terms: monospace,
//    1px rules, square corners, no shadow, and they turn black under the
//    pointer like a row does. (B showed the current cream cards.)
// 2. The level frame is laid out the way the game would have to be: the list
//    is the HUD, in a narrow column, and the artifact is fitted into what is
//    left, beside the list on a wide window and below it on a narrow one,
//    never larger than 1.35× (the rule useArtifactFit follows today). The
//    intro card, objectives, hint and discovery card are rows of the list.
//    "Begin excavation" and "Continue" work, so the list can be seen at the
//    length it has while playing; the room's own row puts everything back.
import { useEffect, useState } from 'react'
import s from './B2_Index.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, foundLine, pad } from './content'
import { ArtifactPicture } from './CurrentCard'

// One line of the list: [mark or year] text ......... meta
function Row({ mark = '', text, meta, href, onClick, current, sub, external }) {
  const inner = (
    <>
      <span className={s.mark}>{mark}</span>
      <span className={s.text}>{text}</span>
      <span className={s.lead} aria-hidden="true" />
      <span className={s.meta}>{meta}</span>
    </>
  )
  const cls = `${s.row} ${sub ? s.sub : ''} ${current ? s.current : ''}`
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick} aria-current={current ? 'page' : undefined} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  if (onClick) return <button type="button" className={cls} onClick={onClick}>{inner}</button>
  return <div className={cls}>{inner}</div>
}

const Note = ({ children, mark = '' }) => (
  <div className={`${s.row} ${s.sub} ${s.note}`}>
    <span className={s.mark}>{mark}</span>
    <p className={s.noteText}>{children}</p>
  </div>
)

// A collection card in the list's terms. Found: number and year, the
// picture, the name, the room, the description. Not found: the same frame
// with an empty picture box.
function Card({ room, art, href }) {
  const found = isFound(room.level)
  return (
    <a className={`${s.card} ${found ? '' : s.blank}`} href={href}>
      <span className={s.cardHead}><span>No. {pad(room.level + 1)}</span><span>{room.year}</span></span>
      <span className={s.cardPicture}>{found && <ArtifactPicture room={room} art={art} className={s.fill} />}</span>
      <span className={s.cardBody}>
        {found ? (
          <>
            <span className={s.cardName}>{room.name}</span>
            <span>{room.title}</span>
            <span className={s.cardRule} aria-hidden="true" />
            <span>{room.description}</span>
          </>
        ) : (
          <>
            <span className={s.cardName}>{room.title}</span>
            <span>{WORDS.unfound}</span>
          </>
        )}
      </span>
      <span className={s.cardFoot}><span>{TITLE.name}</span><span>{room.level + 1} / {ROOMS.length}</span></span>
    </a>
  )
}

function Level({ room, href }) {
  // 'all' is the mock's usual state, every piece at once; the other two are
  // the list as it would be while playing and after Continue
  const [phase, setPhase] = useState('all')
  useEffect(() => { setPhase('all') }, [room.level])
  const next = ROOMS[room.level + 1]
  const [w, h] = room.frame

  return (
    <div className={`${s.page} ${s.levelPage}`}>
      <div className={s.list}>
        <Row text={TITLE.name} href={href('title')} />
        <div className={s.gap} />
        {ROOMS.map(r => {
          const open = r.level === room.level
          return (
            <div key={r.level}>
              <Row mark={r.year} text={r.title} meta={isFound(r.level) ? r.name : ''} href={href('level', r.level)} current={open} onClick={open ? () => setPhase('all') : undefined} />
              {open && (
                <>
                  {phase === 'all' && (
                    <>
                      <Note>{r.intro}</Note>
                      <Row sub text={WORDS.begin} meta="→" onClick={() => setPhase('playing')} />
                      <div className={s.gap} />
                    </>
                  )}
                  <Row sub text={WORDS.objectives} />
                  {r.objectives.map((o, i) => (
                    <Row key={o} sub text={`${phase === 'discovery' || MOCK.done.includes(i) ? '[x]' : '[ ]'} ${o}`} />
                  ))}
                  {phase !== 'discovery' && <Note mark="?"><i>{r.hints[MOCK.hintFor]}</i></Note>}
                  {phase !== 'discovery' && <Row sub text={WORDS.cont} meta="→" onClick={() => setPhase('discovery')} />}
                  {phase !== 'playing' && (
                    <>
                      <div className={s.gap} />
                      <Row sub mark="*" text={WORDS.discovered} meta={r.year} />
                      <Row sub text={r.name} />
                      <Note>{r.description}</Note>
                      <Row sub text={WORDS.cont} meta={next ? `${next.year} ${next.title}` : WORDS.backPlain} href={next ? href('level', next.level) : href('timeline')} />
                    </>
                  )}
                  <div className={s.gap} />
                </>
              )}
            </div>
          )
        })}
        <div className={s.gap} />
        <Row text={WORDS.back} href={href('timeline')} />
        <Row text={WORDS.smallScreen} meta={WORDS.smallScreenGo} onClick={() => {}} />
      </div>

      <div className={s.fitArea}>
        <div className={s.standin} style={{ aspectRatio: `${w} / ${h}`, '--w': w, '--h': h }}>
          artifact {w} × {h}
        </div>
      </div>
    </div>
  )
}

export default function Index2({ screen, level, href, art }) {
  if (screen === 'level') return <Level room={ROOMS[level]} href={href} />

  return (
    <div className={`${s.page} ${screen === 'collection' ? s.collectionPage : ''}`}>
      <div className={s.list}>
        {/* ── The title ─────────────────────────────────────────── */}
        <Row text={TITLE.name} href={href('title')} current={screen === 'title'} mark={screen === 'title' ? '>' : ''} />
        {screen === 'title' && (
          <>
            <Note>{TITLE.subtitle}</Note>
            <Row sub text={TITLE.enter} meta="→" href={href('timeline')} />
            <Note>{TITLE.by}</Note>
          </>
        )}

        {/* ── The six rooms ─────────────────────────────────────── */}
        <div className={s.gap} />
        {ROOMS.map(r => (
          <div key={r.level}>
            <Row mark={r.year} text={r.title} meta={isFound(r.level) ? r.name : ''} href={href('level', r.level)} />
            {screen === 'timeline' && r.objectives.map(o => (
              <Row key={o} sub text={`${isFound(r.level) ? '[x]' : '[ ]'} ${o}`} href={href('level', r.level)} />
            ))}
          </div>
        ))}

        {/* ── Collection, About and the rest ────────────────────── */}
        <div className={s.gap} />
        <Row text={WORDS.collection} meta={foundLine} href={href('collection')} current={screen === 'collection'} mark={screen === 'collection' ? '>' : ''} />
        {screen === 'collection' && ROOMS.map(r => (
          <Row key={r.level} sub mark={r.year} text={`No. ${pad(r.level + 1)}  ${isFound(r.level) ? r.name : WORDS.unfound}`} meta={r.title} href={href('level', r.level)} />
        ))}
        <Row text={TITLE.about} meta={ABOUT.label} href={href('title')} />
        {screen === 'title' && (
          <>
            {ABOUT.paragraphs.map(p => <Note key={p}>{p}</Note>)}
            <Note>{ABOUT.designedBy} {ABOUT.name}. {ABOUT.built}</Note>
            {ABOUT.links.map(l => <Row key={l.label} sub text={l.label} meta="↗" href={l.href} external />)}
          </>
        )}
        {screen !== 'collection' && <Row text={WORDS.reset} onClick={() => {}} />}
        {screen === 'collection' && <Row text={WORDS.back} href={href('timeline')} />}
      </div>

      {screen === 'collection' && (
        <div className={s.cards}>
          {ROOMS.map(r => <Card key={r.level} room={r} art={art} href={href('level', r.level)} />)}
        </div>
      )}
    </div>
  )
}
