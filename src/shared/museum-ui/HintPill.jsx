// src/shared/museum-ui/HintPill.jsx
import styles from './HintPill.module.css'

/**
 * Italic nudge in a dark pill.
 *   text     — the hint; when `docked`, null/'' hides it (the last text stays
 *              rendered while it fades out)
 *   visible  — explicit visibility (undocked use)
 *   docked   — fixed just under the artifact, centred (useArtifactFit sets
 *              --hint-top / --hint-max and keeps room for it above the
 *              objectives); at the bottom centre when there is no artifact
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
