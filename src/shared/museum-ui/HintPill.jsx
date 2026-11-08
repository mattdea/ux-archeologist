// src/shared/museum-ui/HintPill.jsx
import styles from './HintPill.module.css'

/**
 * Italic nudge in a dark pill.
 *   text     — the hint; when `docked`, null/'' hides it (the last text stays
 *              rendered while it fades out)
 *   visible  — explicit visibility (undocked use)
 *   docked   — fixed at the bottom centre of the viewport, clear of the
 *              objectives (bottom-left), Continue / back link (bottom-right)
 *              and the artifact above
 */
export default function HintPill({ text, visible, docked = false }) {
  const show = docked ? !!text : visible
  return (
    <div
      className={`${styles.pill} ${docked ? styles.docked : ''} ${show ? styles.visible : styles.hidden}`}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  )
}
