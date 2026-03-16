// src/components/terminal/TerminalBezel.jsx
import styles from './TerminalBezel.module.css'

export default function TerminalBezel({ children }) {
  return (
    <div className={styles.monitor}>
      <div className={styles.topStripe}>
        <span className={styles.brandLabel}>DEC VT100</span>
      </div>

      <div className={styles.screenArea}>
        <div className={styles.screenBezel}>
          <div className={styles.screen}>
            {children}
          </div>
        </div>
      </div>

      <div className={styles.bottomStrip}>
        <span className={styles.led} aria-hidden="true" />
      </div>
    </div>
  )
}
