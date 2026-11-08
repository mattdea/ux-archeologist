// src/components/da/AboutFinder.jsx — Apple ▸ About the Finder... in Finder
// 1.1g: a plain box, "The Macintosh™ Finder" at the top left, a sun over a
// stylised mountain range (a monochrome Silicon Valley sunset), the version
// and copyright at the bottom left, and the authors at the bottom right.
// Finder 1.0's box was text alone. A click dismisses it.
import styles from './da.module.css'

export default function AboutFinder({ onClose }) {
  return (
    <div className={styles.aboutScrim} onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
      <div className={styles.about} role="dialog" aria-label="About the Finder">
        <p className={styles.aboutTitle}>The Macintosh™ Finder</p>
        <svg className={styles.aboutArt} viewBox="0 0 320 96" aria-hidden="true" shapeRendering="crispEdges">
          {/* sky: horizontal lines, thinning upward */}
          {[6, 14, 21, 27, 32, 36, 39, 41].map(y => <rect key={y} x="0" y={y} width="320" height="1" fill="#000" />)}
          <circle cx="262" cy="30" r="14" fill="#fff" />
          <circle cx="262" cy="30" r="14" fill="none" stroke="#000" strokeWidth="2" />
          {/* far range */}
          <polygon points="0,70 30,44 56,58 92,34 128,56 160,40 196,60 230,46 262,62 294,48 320,60 320,96 0,96" fill="#000" />
          {/* near range, white-edged */}
          <polygon points="0,96 40,66 78,84 120,60 170,86 214,68 258,88 300,72 320,84 320,96" fill="#fff" />
          <polygon points="0,96 40,70 78,88 120,64 170,90 214,72 258,92 300,76 320,88 320,96" fill="#000" />
        </svg>
        <div className={styles.aboutFoot}>
          <span>Version 1.1g   ©1984 Apple Computer</span>
          <span>Bruce Horn and Steve Capps</span>
        </div>
      </div>
    </div>
  )
}
