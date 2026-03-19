// src/components/chat/SuggestionChips.jsx
import styles from './SuggestionChips.module.css'

export const CHIPS_BY_TURN = [
  // Turn 0 — initial, before any message
  ['What is this place?', 'Who are you?', 'Tell me about the levels I just played'],
  // Turn 1 — after first AI response
  ['What changed between 1984 and now?', 'How does this conversation compare to the terminal?', 'What comes after this?'],
  // Turn 2+ — after subsequent responses
  ['What was the biggest leap in interface design?', 'Why did touchscreens change everything?', 'Is this the last interface?'],
]

export function getChipsForTurn(turnCount) {
  if (turnCount === 0) return CHIPS_BY_TURN[0]
  if (turnCount === 1) return CHIPS_BY_TURN[1]
  return CHIPS_BY_TURN[2]
}

export default function SuggestionChips({ chips, onChipClick, visible = true }) {
  if (!visible) return null

  return (
    <div className={styles.row}>
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
