// src/components/chat/ChatPanel.jsx
import styles from './ChatPanel.module.css'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestionChips from './SuggestionChips'

// Hardcoded example messages — visual placeholder only.
// These will be removed when the chat hook is wired in a later prompt.
const EXAMPLE_MESSAGES = [
  { id: 1, role: 'user', content: 'What is this place?' },
  {
    id: 2,
    role: 'assistant',
    content:
      'This is UX Archaeologist, an interactive history of how people and computers learned to communicate. You\'ve just walked through fifty years of that history.',
  },
]

export default function ChatPanel({ playing = false }) {
  return (
    <div className={styles.panel}>
      <div className={styles.messageArea}>
        <div className={styles.messageList}>
          {EXAMPLE_MESSAGES.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              showActions={msg.role === 'assistant' && i === EXAMPLE_MESSAGES.length - 1}
            />
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        {playing && (
          <>
            <ChatInput autoFocus={playing} />
            <SuggestionChips />
          </>
        )}
      </div>
    </div>
  )
}
