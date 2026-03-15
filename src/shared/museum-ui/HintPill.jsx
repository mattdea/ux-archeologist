// src/shared/museum-ui/HintPill.jsx
import styles from './HintPill.module.css'

export default function HintPill({ text, visible }) {
  return (
    <div className={`${styles.pill} ${visible ? styles.visible : styles.hidden}`}>
      {text}
    </div>
  )
}
