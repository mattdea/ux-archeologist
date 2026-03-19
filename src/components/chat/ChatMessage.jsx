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

export default function ChatMessage({
  role,
  content,
  streaming = false,
  showActions = false,
  toastVisible = false,
  toastKey = 0,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onRegenerate,
}) {
  if (role === 'user') {
    return (
      <div className={`${styles.message} ${styles.user}`}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    )
  }

  const isThinking = content === null
  const actionsVisible = !streaming && !isThinking

  return (
    <div className={`${styles.message} ${styles.assistant}`}>
      {isThinking
        ? <ThinkingIndicator />
        : <div className={styles.assistantContent}>{content}</div>
      }
      {/*
       * actionsBlock: always rendered when showActions=true so space is
       * reserved from the moment this message mounts. Action icons and
       * toast fade in/out without any layout shift.
       */}
      {showActions && (
        <div className={styles.actionsBlock}>
          <ActionIcons
            content={content}
            visible={actionsVisible}
            onCopy={onCopy}
            onThumbsUp={onThumbsUp}
            onThumbsDown={onThumbsDown}
            onRegenerate={onRegenerate}
            disabled={streaming || isThinking}
          />
          {/* Toast area: fixed height, always in flow — toast fades in/out inline */}
          <div className={styles.toastArea}>
            <span
              key={toastKey}
              className={`${styles.toastText} ${toastVisible ? styles.toastTextVisible : ''}`}
            >
              Thanks for your feedback
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
