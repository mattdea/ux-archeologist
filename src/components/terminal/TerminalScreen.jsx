// src/components/terminal/TerminalScreen.jsx
import styles from './TerminalScreen.module.css'
import './terminal-styles.css'  // loads VT323 font + global utility classes (termCursor, terminalText)

export default function TerminalScreen({ children }) {
  return (
    <div className={styles.screen}>

      {/* Text content — position: relative, z-index: 2 */}
      <div className={styles.content}>
        {children}
      </div>

      {/* CRT effect overlays — purely decorative, pointer-events: none */}
      <div className={styles.flicker} aria-hidden="true" />
      <div className={styles.noise}   aria-hidden="true" />

    </div>
  )
}
