// src/components/da/AboutFinder.jsx — Apple ▸ About the Finder... in Finder
// 1.1g: "The Macintosh™ Finder" over a black sky with a sun setting behind
// mountains, the version and copyright at the bottom left and the authors at
// the bottom right. Traced pixel by pixel from docs/reference/mac system 1/
// macsystem100025.png (assets/mac/about-finder.png) and drawn where it
// appears there, 364 × 204 Mac pixels at (74, 49). A click dismisses it.
import art from '../../../assets/mac/about-finder.png'
import styles from './da.module.css'

const mp = (n) => `calc(var(--mac-px) * ${n})`

export default function AboutFinder({ onClose }) {
  return (
    <div className={styles.aboutScrim} onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
      <img
        src={art}
        alt="The Macintosh Finder. Version 1.1g, ©1984 Apple Computer. Bruce Horn and Steve Capps."
        className={styles.about}
        style={{ left: mp(74), top: mp(49), width: mp(364), height: mp(204) }}
        draggable="false"
      />
    </div>
  )
}
