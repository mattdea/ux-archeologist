// src/shared/catalogue/place.js
//
// Where the catalogue record's pieces go (CatalogueRecord.jsx): beside the
// device when a column fits, under it when not, else the number alone.
const ROW = 20        // index row
const GAP = 16        // device → column
const MARGIN = 16     // column → viewport edge or HUD
const COL_CH = 28     // widest line in the column, in characters

let charW = null
export function measureChar() {
  if (charW) return charW
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = "13px ui-monospace, Menlo, Monaco, 'Courier New', monospace"
    charW = ctx.measureText('0').width || 7.8
  } catch { charW = 7.8 }
  return charW
}

const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

export function hudRects() {
  return [...document.querySelectorAll('[data-hud]')]
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0)
    .map((r) => ({ x: r.left - MARGIN, y: r.top - MARGIN, w: r.width + MARGIN * 2, h: r.height + MARGIN * 2 }))
}

// A part found in the artifact by a selector ({ find }) becomes a part in
// the device's own coordinates, like the fixed ones ({ y, left, right }):
// the dot sits on the element's left or right edge (whichever faces the
// label column), halfway down, so the leader runs outwards from the part
// and never crosses it. The first matching element whose middle is on the device counts;
// a part not on screen (not drawn yet, scrolled away) has no label.
export function locateParts(parts, { scope, fit, width, height }) {
  const s = fit.scale
  return parts.map((p) => {
    if (!p.find) return p
    const els = scope ? [...scope.querySelectorAll(p.find)] : []
    for (const el of els) {
      // not drawn yet (Level 4's screen before the boot), or hidden
      if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) continue
      const x0 = (r.left - fit.left) / s, x1 = (r.right - fit.left) / s
      const y = ((r.top + r.bottom) / 2 - fit.top) / s
      const cx = (x0 + x1) / 2
      if (cx < 0 || cx > width || y < 0 || y > height) continue
      return { id: p.id, lines: p.lines, y, left: x0, right: x1 }
    }
    return null
  }).filter(Boolean)
}

// Everything in viewport px; converted to .wrap's box when rendered.
export function placeRecord({ record, width, height, fit, viewport, huds, cw }) {
  const s = fit.scale
  const dev = { x: fit.left, y: fit.top, w: width * s, h: height * s }
  const colW = COL_CH * cw
  const fits = (r) => r.x >= MARGIN && r.y >= 0 && r.x + r.w <= viewport.w - MARGIN && r.y + r.h <= viewport.h - MARGIN / 2 && !huds.some((h) => hit(r, h))
  // the number and its toggle: "IA.1984.02 [−]"
  // above the device's top left, or just inside it when a HUD is there
  const numberW = (record.number.length + 4) * cw
  const above = { x: dev.x, y: dev.y - ROW - 4, w: numberW, h: ROW }
  const number = huds.some((h) => hit(above, h)) ? { ...above, y: dev.y + 4 } : above

  const objectH = record.object.length * ROW
  const dataH = record.data.length * ROW
  const blockH = objectH + ROW + dataH
  for (const side of ['right', 'left']) {
    const x = side === 'right' ? dev.x + dev.w + GAP : dev.x - GAP - colW
    // Labels level with their parts, top to bottom; one that would overlap
    // the one above moves down, and its leader takes one bend.
    const labels = []
    record.parts
      .map((p) => ({ id: p.id, lines: p.lines, dotX: dev.x + (side === 'right' ? p.right : p.left) * s, dotY: dev.y + p.y * s }))
      .sort((a, b) => a.dotY - b.dotY)
      .forEach((p) => {
        const prev = labels[labels.length - 1]
        const y = Math.max(p.dotY - ROW / 2, prev ? prev.y + prev.h + ROW / 2 : -Infinity)
        labels.push({ ...p, x, y, w: colW, h: p.lines.length * ROW })
      })
    // The object line and data: next to the labels, ending one row above the
    // first, if they fit there; else at the device's top, else under the
    // last label, else up from the device's foot
    const first = labels[0], last = labels[labels.length - 1]
    const tryAt = [
      ...(first ? [first.y - ROW - blockH] : []),
      dev.y,
      ...(last ? [last.y + last.h + ROW] : []),
      dev.y + dev.h - blockH,
    ]
    for (const y of tryAt) {
      const object = { x, y, w: colW, h: objectH }
      const data = { x, y: y + objectH + ROW, w: colW, h: dataH }
      const blocks = [object, data, ...labels]
      const clear = blocks.every(fits) && blocks.every((a, i) => blocks.every((b, j) => i === j || !hit(a, b)))
      if (clear) return { mode: 'side', side, dev, number, object, data, labels }
    }
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

