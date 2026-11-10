// src/pages/styleLab/B_Index.jsx
//
// Concept B, "Index": the whole museum is one small monospace list, like a
// table of contents. Years down the left, dotted leaders across, every line
// a link. There are no pages: a "screen" is the same list with one entry
// opened in place. The only rectangles are the artifact and the cards.
import s from './B_Index.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, foundLine, pad } from './content'
import { CurrentCard } from './CurrentCard'

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
  if (onClick) return <button type="button" className={cls} onClick={onClick}>{inner}</button>
  if (!href) return <div className={cls}>{inner}</div>
  return (
    <a className={cls} href={href} aria-current={current ? 'page' : undefined} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  )
}

const Note = ({ children, mark = '' }) => (
  <div className={`${s.row} ${s.sub} ${s.note}`}>
    <span className={s.mark}>{mark}</span>
    <p className={s.noteText}>{children}</p>
  </div>
)

function Standin({ room, className }) {
  return (
    <div className={`${s.standin} ${className}`} style={{ aspectRatio: `${room.frame[0]} / ${room.frame[1]}`, maxWidth: room.frame[0] }}>
      artifact
    </div>
  )
}

function Cards({ art, go, className }) {
  return (
    <div className={`${s.cards} ${className}`}>
      {ROOMS.map(r => <CurrentCard key={r.level} room={r} art={art} zoom={0.62} onOpen={() => go('level', r.level)} />)}
    </div>
  )
}

export default function Index({ screen, level, href, go, art }) {
  const room = screen === 'level' ? ROOMS[level] : null
  const next = room && ROOMS[room.level + 1]

  return (
    <div className={s.page}>
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
        {ROOMS.map(r => {
          const open = room?.level === r.level
          return (
            <div key={r.level}>
              <Row mark={r.year} text={r.title} meta={isFound(r.level) ? r.name : ''} href={href('level', r.level)} current={open} />
              {screen === 'timeline' && r.objectives.map(o => (
                <Row key={o} sub text={`${isFound(r.level) ? '[x]' : '[ ]'} ${o}`} href={href('level', r.level)} />
              ))}
              {open && (
                <>
                  <Note>{r.intro}</Note>
                  <Standin room={r} className={s.inline} />
                  <Row sub text={WORDS.objectives} />
                  {r.objectives.map((o, i) => (
                    <Row key={o} sub text={`${MOCK.done.includes(i) ? '[x]' : '[ ]'} ${o}`} />
                  ))}
                  <Note mark="?"><i>{r.hints[MOCK.hintFor]}</i></Note>
                  <Row sub text={WORDS.begin} meta="→" onClick={() => {}} />
                  <div className={s.gap} />
                  <Row sub mark="*" text={WORDS.discovered} meta={r.year} />
                  <Row sub text={r.name} />
                  <Note>{r.description}</Note>
                  <Row sub text={WORDS.cont} meta={next ? `${next.year} ${next.title}` : WORDS.backPlain} href={next ? href('level', next.level) : href('timeline')} />
                  <div className={s.gap} />
                </>
              )}
            </div>
          )
        })}

        {/* ── Collection, About and the rest ────────────────────── */}
        <div className={s.gap} />
        <Row text={WORDS.collection} meta={foundLine} href={href('collection')} current={screen === 'collection'} mark={screen === 'collection' ? '>' : ''} />
        {screen === 'collection' && (
          <>
            {ROOMS.map(r => (
              <Row key={r.level} sub mark={r.year} text={`No. ${pad(r.level + 1)}  ${isFound(r.level) ? r.name : WORDS.unfound}`} meta={r.title} href={href('level', r.level)} />
            ))}
            <Cards art={art} go={go} className={s.inline} />
          </>
        )}
        <Row text={TITLE.about} meta={ABOUT.label} href={href('title')} />
        {screen === 'title' && (
          <>
            {ABOUT.paragraphs.map(p => <Note key={p}>{p}</Note>)}
            <Note>{ABOUT.designedBy} {ABOUT.name}. {ABOUT.built}</Note>
            {ABOUT.links.map(l => <Row key={l.label} sub text={l.label} meta="↗" href={l.href} external />)}
          </>
        )}
        {(screen === 'timeline' || screen === 'title') && <Row text={WORDS.reset} onClick={() => {}} />}
        {(screen === 'collection' || screen === 'level') && <Row text={WORDS.back} href={href('timeline')} />}
        {screen === 'level' && (
          <>
            <div className={s.gap} />
            <Row text={WORDS.smallScreen} meta={WORDS.smallScreenGo} onClick={() => {}} />
          </>
        )}
      </div>

      {/* The right-hand side: nothing, the artifact, or the cards */}
      <div className={s.plate}>
        {room && <Standin room={room} className={s.wide} />}
        {screen === 'collection' && <Cards art={art} go={go} className={s.wide} />}
      </div>
    </div>
  )
}
