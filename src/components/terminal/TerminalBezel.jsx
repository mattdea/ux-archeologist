// src/components/terminal/TerminalBezel.jsx
import styles from './TerminalBezel.module.css'

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
        <div className={styles.badge} aria-label="DEC VT100">
          <span className={styles.badgeDigital}>digital</span>
          <div className={styles.badgeTiles}>
            <span className={styles.tile}>V</span>
            <span className={styles.tile}>T</span>
            <span className={styles.tile}>1</span>
            <span className={styles.tile}>0</span>
            <span className={styles.tile}>0</span>
          </div>
        </div>
        <span className={styles.led} aria-hidden="true" />
      </div>

    </div>
  )
}
