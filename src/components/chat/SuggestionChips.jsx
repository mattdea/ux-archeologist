// src/components/chat/SuggestionChips.jsx
import styles from './SuggestionChips.module.css'

export const CHIPS_BY_TURN = [
  // Turn 0 — initial, before any message
  ['What is this place?', 'Who are you?', 'What did the other rooms show?'],
  // Turn 1 — after first AI response
  ['What changed between 1984 and now?', 'How is this like the 1979 terminal?', 'What might come next?'],
  // Turn 2+ — after subsequent responses
  ['Which change mattered most?', 'What did touchscreens change?', 'Is this the last interface?'],
]

export function getChipsForTurn(turnCount) {
  if (turnCount === 0) return CHIPS_BY_TURN[0]
  if (turnCount === 1) return CHIPS_BY_TURN[1]
  return CHIPS_BY_TURN[2]
}

export default function SuggestionChips({ chips, onChipClick, visible = true }) {
  // Always rendered — opacity hides chips so container height never changes.
  return (
    <div className={`${styles.row} ${visible ? '' : styles.rowHidden}`}>
      {chips.map((chip) => (
        <button
          key={chip}
          className={styles.chip}
          type="button"
          onClick={() => onChipClick?.(chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
