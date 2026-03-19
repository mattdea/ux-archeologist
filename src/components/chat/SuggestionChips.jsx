// src/components/chat/SuggestionChips.jsx
import styles from './SuggestionChips.module.css'

const INITIAL_CHIPS = [
  'What is this place?',
  'Who are you?',
  'Tell me about the levels I just played',
]

export default function SuggestionChips({ chips = INITIAL_CHIPS }) {
  return (
    <div className={styles.row}>
      {chips.map((chip) => (
        <button key={chip} className={styles.chip} type="button">
          {chip}
        </button>
      ))}
    </div>
  )
}
