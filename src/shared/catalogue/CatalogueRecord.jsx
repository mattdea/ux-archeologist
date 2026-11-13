// src/shared/catalogue/CatalogueRecord.jsx
//
// Experiment (dev setting Levels > catalogue, on by default): the museum's
// catalogue record around each level's device (Catalogue.jsx loads it). A
// museum-layer overlay inside the level's .wrap, placed from the same fit as
// the device, so it moves and scales with useArtifactFit. The artifact is
// not touched.
//
//  full    catalogue number, object line, data block, and labels with
//          leader lines to parts of the device (intro, discovery)
//  number  the catalogue number only, small and grey (booting, playing)
//
// Beside the number, a toggle ([−] / [+]) shows or hides the rest in any
// state, when there is room for the rest (not when the number is all that
// fits). Each state starts with its default; once used, the choice holds
// for the rest of the visit to the level (this component stays mounted
// through the level's states and is new on the next visit).
//
// Labels go in a column beside the device when one fits without touching
// the viewport edge or any [data-hud] block. Otherwise the leader lines
// and labels are dropped and the object line and data block go under the
// device, if they fit there.
import { useLayoutEffect, useRef, useState } from 'react'
import styles from './CatalogueRecord.module.css'
import { RECORDS } from './records'
import { placeRecord, locateParts, hudRects, measureChar } from './place'

/**
 * @param {number} level            The room whose record to show (records.js)
 * @param {object} [record]         Or the record itself
 * @param {'full'|'number'} show    What the level's screen calls for
 * @param {object} fit              useArtifactFit's { scale, left, top }
 * @param {number} width, height    The device's own size
 * @param {string} screen           Re-measures when the level changes screen
 * @param {string} [root]           A selector for the element to find parts in (default: the record's parent)
 */
export default function CatalogueRecord({ level, record: given, show, fit, width, height, screen, root }) {
  const record = given ?? RECORDS[level] ?? RECORDS[1]
  const [layout, setLayout] = useState(null)
  const [chosen, setChosen] = useState(null)     // the toggle's choice, for this visit
  const ref = useRef(null)
  const showing = chosen ?? show
  const full = showing === 'full'

  useLayoutEffect(() => {
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      const scope = root ? document.querySelector(root) : ref.current?.parentElement
      const parts = locateParts(record.parts, { scope, fit, width, height })
      setLayout(placeRecord({
        record: { ...record, parts },
        width, height, fit,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        huds: hudRects(),
        cw: measureChar(),
      }))
    }
    // a part that moves (a feed scrolling, a reply arriving) is found again
    const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    measure()
    // The HUD slides in and out with the screen: measure again once it has.
    const t = setTimeout(measure, 600)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', later, true)
    // Text the record keeps off can arrive after the screen changes (the
    // Index discovery band mounts a moment after the level's discovery):
    // measure again as soon as it does.
    const avoid = '[data-record-avoid]'
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver((list) => {
      if (list.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches(avoid) || n.querySelector(avoid))))) later()
    }) : null
    mo?.observe(document.body, { childList: true, subtree: true })
    return () => {
      mo?.disconnect()
      clearTimeout(t); cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', later, true)
    }
  }, [record, width, height, fit, screen, showing, root])

  const { dev, mode, side } = layout ?? {}
  const at = (r) => ({ left: r.x - dev.x, top: r.y - dev.y, width: r.w })
  const label = full ? 'Hide catalogue record' : 'Show catalogue record'

  return (
    <div ref={ref} className={styles.record} data-catalogue-record={mode ?? 'pending'} data-show={showing}>
      {layout && (
        <>
          <div className={`${styles.number} ${full ? '' : styles.numberSmall}`} style={{ ...at(layout.number), width: 'auto' }} data-catalogue="number">
            <span>{record.number}</span>
            {/* only when there is more to show: with no room beside or
                under the device, the number is the whole record */}
            {mode !== 'number' && <button
              type="button"
              className={styles.toggle}
              aria-expanded={full}
              aria-label={label}
              title={label}
              onClick={() => setChosen(full ? 'number' : 'full')}
              data-catalogue="toggle"
            >
              {full ? '[−]' : '[+]'}
            </button>}
          </div>
          {layout.object && (
            <div className={`${styles.full} ${full ? styles.on : ''}`} aria-hidden={!full}>
              <div className={`${styles.block} ${side === 'left' ? styles.alignRight : ''}`} style={at(layout.object)} data-catalogue="object">
                {record.object.map((l) => <div key={l}>{l}</div>)}
              </div>
              <div className={`${styles.block} ${styles.secondary} ${side === 'left' ? styles.alignRight : ''}`} style={at(layout.data)} data-catalogue="data">
                {record.data.map((l) => <div key={l}>{l}</div>)}
              </div>
              {layout.labels.map((l) => (
                <div key={l.id} className={`${styles.block} ${side === 'left' ? styles.alignRight : ''}`} style={at(l)} data-catalogue={`label-${l.id}`}>
                  {l.lines.map((t, i) => <div key={t} className={i ? styles.secondary : ''}>{t}</div>)}
                </div>
              ))}
              {/* Leader lines: straight from the part's dot to its label, or
                  with one bend where the label had to move; an L down and
                  out where another part stands in the way (place.js) */}
              <svg className={styles.leaders} aria-hidden="true">
                {layout.labels.map((l) => {
                  const mid = l.y + 10
                  const edge = side === 'right' ? l.x - 6 : l.x + l.w + 6
                  const bend = side === 'right' ? edge - 12 : edge + 12
                  const pts = l.drop
                    ? [[l.dotX, l.dotY], [l.dotX, mid], [edge, mid]]
                    : Math.abs(mid - l.dotY) < 0.5
                    ? [[l.dotX, l.dotY], [edge, l.dotY]]
                    : [[l.dotX, l.dotY], [bend, l.dotY], [edge, mid]]
                  return <polyline key={l.id} points={pts.map(([px, py]) => `${px - dev.x},${py - dev.y}`).join(' ')} data-catalogue-leader={l.id} />
                })}
              </svg>
              {layout.labels.map((l) => (
                <div key={l.id} className={styles.dot} style={{ left: l.dotX - dev.x, top: l.dotY - dev.y }} data-catalogue-dot={l.id} aria-hidden="true" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
