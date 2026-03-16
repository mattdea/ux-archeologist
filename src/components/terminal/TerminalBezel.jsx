// src/components/terminal/TerminalBezel.jsx
import styles from './TerminalBezel.module.css'
import badgeSrc from '../../../assets/badge.svg'

export default function TerminalBezel({ children }) {
  return (
    <div className={styles.monitor}>

      {/* Dark surround — covers left ~74%, extends full height to top edge */}
      <div className={styles.darkSurround}>
        <div className={styles.screenRecess}>
          <div className={styles.screen}>
            {children}
          </div>
        </div>
      </div>

      {/* Right panel — cream bezel plastic, badge + LED */}
      <div className={styles.rightPanel}>
        <img
          src={badgeSrc}
          alt="digital VT100"
          className={styles.badge}
          width="126"
          height="28"
          draggable="false"
        />
        <span className={styles.led} aria-hidden="true" />
      </div>

    </div>
  )
}
