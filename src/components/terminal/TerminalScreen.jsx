// src/components/terminal/TerminalScreen.jsx
import styles from './TerminalScreen.module.css'
import './terminal-styles.css'  // loads VT323 font + global utility classes (termCursor, terminalText)

export default function TerminalScreen({ children }) {
  return (
    <div className={styles.display}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
