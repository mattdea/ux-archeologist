// src/components/da/AboutFinder.jsx — Apple ▸ About the Finder... in 1984:
// a picture of mountains with the Finder's version and the names of the
// people who wrote it.
import styles from './da.module.css'

export default function AboutFinder() {
  return (
    <div className={styles.about}>
      <svg className={styles.aboutArt} viewBox="0 0 120 56" aria-hidden="true" shapeRendering="crispEdges">
        <polygon points="0,56 22,18 36,34 54,6 74,30 86,20 102,40 120,12 120,56" fill="#000" />
        <polygon points="54,6 48,16 60,16" fill="#fff" />
        <polygon points="120,12 114,22 120,24" fill="#fff" />
        <rect x="0" y="48" width="120" height="8" fill="#000" />
      </svg>
      <div className={styles.aboutText}>
        <p className={styles.aboutTitle}>The Macintosh Finder</p>
        <p>Version 1.1g</p>
        <p>Bruce Horn and Steve Capps</p>
        <p className={styles.aboutSmall}>© 1983, 1984 Apple Computer, Inc.</p>
      </div>
    </div>
  )
}
