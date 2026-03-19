// src/components/chat/ChatMessage.jsx
import styles from './ChatMessage.module.css'
import ActionIcons from './ActionIcons'

export default function ChatMessage({ role, content, showActions = false }) {
  if (role === 'user') {
    return (
      <div className={`${styles.message} ${styles.user}`}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    )
  }

  return (
    <div className={`${styles.message} ${styles.assistant}`}>
      <div className={styles.assistantContent}>{content}</div>
      {showActions && <ActionIcons />}
    </div>
  )
}
