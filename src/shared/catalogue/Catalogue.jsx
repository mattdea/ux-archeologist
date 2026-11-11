// src/shared/catalogue/Catalogue.jsx
//
// The catalogue record for a level (experiment, dev setting Levels >
// catalogue, on by default; backlog "level screen fixes", 11 Nov 2026). Each
// level renders this inside the box its device occupies; it reads the dev
// setting and loads the record lazily on the dev server only, so the
// production build has neither the record nor its facts.
import { lazy, Suspense, useState } from 'react'
import { catalogueRecordOn } from '../devLooks'
import { useDevChange } from '../dev/devEvents'

const CatalogueRecord = import.meta.env.DEV ? lazy(() => import('./CatalogueRecord')) : null

/**
 * @param {number} level   The room (0–5); its record is in records.js
 * @param {'intro'|'booting'|'playing'|'discovery'} screen   The level's screen
 * @param {object} fit     The device's { scale, left, top } in viewport px
 * @param {number} width, height   The device's own size
 * @param {string} [root]     A selector for the element to find parts in (default: the box the record sits in)
 */
export default function Catalogue({ level, screen, fit, width, height, root }) {
  const [on, setOn] = useState(catalogueRecordOn)
  useDevChange(() => setOn(catalogueRecordOn()))
  if (!CatalogueRecord || !on) return null
  return (
    <Suspense fallback={null}>
      <CatalogueRecord
        level={level}
        show={screen === 'intro' || screen === 'discovery' ? 'full' : 'number'}
        fit={fit}
        width={width}
        height={height}
        screen={screen}
        root={root}
      />
    </Suspense>
  )
}
