// src/components/phone/PhoneFrame.jsx
//
// The iPhone hardware container. Renders the bezel SVG as a decorative
// underlay (z-index 0) with the interactive screen slot (z-index 1)
// positioned precisely over the SVG's screen region.
//
// Props:
//   children    — content rendered inside the 320×480 screen slot
//   onHomePress — called when the invisible home button is clicked

import { useRef } from 'react'
import styles from './PhoneFrame.module.css'
import TouchCursor from './TouchCursor'
import iPhoneSvg from '../../../assets/iphone.svg'

export default function PhoneFrame({ children, onHomePress }) {
  const screenRef = useRef(null)

  return (
    <div className={styles.frame}>

      {/* Bezel image — purely decorative, renders phone chrome below screen content */}
      <img
        src={iPhoneSvg}
        className={styles.bezelImg}
        draggable={false}
        aria-hidden="true"
        alt=""
      />

      {/* Screen slot — where all iPhone UI renders */}
      <div ref={screenRef} className={styles.screen}>
        <TouchCursor containerRef={screenRef} />
        {children}
      </div>

      {/* Invisible tap target over the physical home button */}
      <button
        className={styles.homeBtn}
        onClick={onHomePress}
        aria-label="Home"
      />

    </div>
  )
}
