// src/shared/catalogue/CatalogueRecord.jsx
//
// Experiment (dev setting Levels > catalogue, Level 1 only): the museum's
// catalogue record around the device. A museum-layer overlay inside the
// level's .wrap, placed from the same fit as the device, so it moves and
// scales with useArtifactFit. The emulator is not touched.
//
//  full    catalogue number, object line, data block, and labels with
//          leader lines to the screen and the floppy slot (intro, discovery)
//  number  the catalogue number only, small and grey (booting, playing)
//
// Labels go in a column beside the device when one fits without touching
// the viewport edge or any [data-hud] block. Otherwise the leader lines
// and labels are dropped and the object line and data block go under the
// device, if they fit there.
import { useLayoutEffect, useState } from 'react'
import styles from './CatalogueRecord.module.css'

// Record for Level 1. Facts and sources: design-spec, Level 1, "Catalogue record".
export const MAC_RECORD = {
  number: 'IA.1984.02',
  object: ['Apple Macintosh (128K), 1984'],
  data: [
    'Motorola 68000, 7.8 MHz',
    '128 KB memory',
    '35 × 24 × 28 cm, 7.5 kg',
    '$2,495',
    '24 January 1984',
  ],
  // Parts in the device's own coordinates (780 × 755). The screen hole is
  // 80–700 × 149–564; the floppy slot's interior is 411–607 × 674–686.
  parts: [
    { id: 'screen', lines: ['9-inch screen', '512 × 342, black and white'], y: 330, left: 150, right: 630 },
    { id: 'floppy', lines: ['3.5-inch floppy drive', '400 KB'], y: 680, left: 418, right: 600 },
  ],
}

const ROW = 20        // index row
const GAP = 16        // device → column
const MARGIN = 16     // column → viewport edge or HUD
const COL_CH = 28     // widest line in the column, in characters

let charW = null
function measureChar() {
  if (charW) return charW
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = "13px ui-monospace, Menlo, Monaco, 'Courier New', monospace"
    charW = ctx.measureText('0').width || 7.8
  } catch { charW = 7.8 }
  return charW
}

const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

function hudRects() {
  return [...document.querySelectorAll('[data-hud]')]
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0)
    .map((r) => ({ x: r.left - MARGIN, y: r.top - MARGIN, w: r.width + MARGIN * 2, h: r.height + MARGIN * 2 }))
}

// Everything in viewport px; converted to .wrap's box when rendered.
export function placeRecord({ record, width, height, fit, viewport, huds, cw }) {
  const s = fit.scale
  const dev = { x: fit.left, y: fit.top, w: width * s, h: height * s }
  const colW = COL_CH * cw
  const fits = (r) => r.x >= MARGIN && r.y >= 0 && r.x + r.w <= viewport.w - MARGIN && r.y + r.h <= viewport.h - MARGIN / 2 && !huds.some((h) => hit(r, h))
  const number = { x: dev.x, y: dev.y - ROW - 4, w: record.number.length * cw, h: ROW }

  const objectH = record.object.length * ROW
  const dataH = record.data.length * ROW
  for (const side of ['right', 'left']) {
    const x = side === 'right' ? dev.x + dev.w + GAP : dev.x - GAP - colW
    const object = { x, y: dev.y, w: colW, h: objectH }
    const data = { x, y: dev.y + objectH + ROW, w: colW, h: dataH }
    const labels = record.parts.map((p) => {
      const dotX = dev.x + (side === 'right' ? p.right : p.left) * s
      const dotY = dev.y + p.y * s
      return { id: p.id, lines: p.lines, x, y: dotY - ROW / 2, w: colW, h: p.lines.length * ROW, dotX, dotY }
    })
    const blocks = [object, data, ...labels]
    const clear = blocks.every(fits) && blocks.every((a, i) => blocks.every((b, j) => i === j || !hit(a, b)))
    if (clear) return { mode: 'side', side, dev, number, object, data, labels }
  }

  // No room beside it: object line and data under the device, if they fit.
  const under = { x: dev.x, y: dev.y + dev.h + ROW, w: colW, h: objectH + ROW + dataH }
  if (fits(under)) {
    return {
      mode: 'under', dev, number,
      object: { x: under.x, y: under.y, w: colW, h: objectH },
      data: { x: under.x, y: under.y + objectH + ROW, w: colW, h: dataH },
      labels: [],
    }
  }
  return { mode: 'number', dev, number, labels: [] }
}

/**
 * @param {'full'|'number'} show   What the level's screen calls for
 * @param {object} fit             useArtifactFit's { scale, left, top }
 * @param {number} width, height   The device's own size
 * @param {string} screen          Re-measures when the level changes screen
 */
export default function CatalogueRecord({ record = MAC_RECORD, show, fit, width, height, screen }) {
  const [layout, setLayout] = useState(null)

  useLayoutEffect(() => {
    const measure = () => setLayout(placeRecord({
      record, width, height, fit,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      huds: hudRects(),
      cw: measureChar(),
    }))
    measure()
    // The HUD slides in and out with the screen: measure again once it has.
    const t = setTimeout(measure, 600)
    window.addEventListener('resize', measure)
    return () => { clearTimeout(t); window.removeEventListener('resize', measure) }
  }, [record, width, height, fit, screen])

  if (!layout) return null
  const { dev, mode, side } = layout
  const at = (r) => ({ left: r.x - dev.x, top: r.y - dev.y, width: r.w })
  const full = show === 'full'

  return (
    <div className={styles.record} data-catalogue-record={mode} data-show={show} aria-hidden="true">
      <div className={`${styles.number} ${full ? '' : styles.numberSmall}`} style={at(layout.number)} data-catalogue="number">
        {record.number}
      </div>
      {layout.object && (
        <div className={`${styles.full} ${full ? styles.on : ''}`}>
          <div className={`${styles.block} ${side === 'left' ? styles.alignRight : ''}`} style={at(layout.object)} data-catalogue="object">
            {record.object.map((l) => <div key={l}>{l}</div>)}
          </div>
          <div className={`${styles.block} ${styles.secondary} ${side === 'left' ? styles.alignRight : ''}`} style={at(layout.data)} data-catalogue="data">
            {record.data.map((l) => <div key={l}>{l}</div>)}
          </div>
          {layout.labels.map((l) => {
            const lineX1 = side === 'right' ? l.dotX : l.x + l.w + 6
            const lineX2 = side === 'right' ? l.x - 6 : l.dotX
            return (
              <div key={l.id}>
                <div className={`${styles.block} ${side === 'left' ? styles.alignRight : ''}`} style={at(l)} data-catalogue={`label-${l.id}`}>
                  {l.lines.map((t, i) => <div key={t} className={i ? styles.secondary : ''}>{t}</div>)}
                </div>
                <div className={styles.leader} style={{ left: lineX1 - dev.x, top: l.dotY - dev.y, width: lineX2 - lineX1 }} />
                <div className={styles.dot} style={{ left: l.dotX - dev.x, top: l.dotY - dev.y }} data-catalogue-dot={l.id} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
