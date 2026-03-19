// src/components/chat/ChatMessage.jsx
import styles from './ChatMessage.module.css'
import ActionIcons from './ActionIcons'

function ThinkingIndicator() {
  return (
    <div className={styles.thinking}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  )
}

export default function ChatMessage({ role, content, streaming = false, showActions = false }) {
  if (role === 'user') {
    return (
      <div className={`${styles.message} ${styles.user}`}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    )
  }

  // content === null means still in thinking phase
  const isThinking = content === null

  return (
    <div className={`${styles.message} ${styles.assistant}`}>
      {isThinking
        ? <ThinkingIndicator />
        : <div className={styles.assistantContent}>{content}</div>
      }
      {showActions && !streaming && !isThinking && <ActionIcons />}
    </div>
  )
}
