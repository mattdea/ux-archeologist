// src/components/chat/ChatPanel.jsx
import { useRef, useEffect } from 'react'
import styles from './ChatPanel.module.css'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestionChips, { getChipsForTurn } from './SuggestionChips'
import useCuratorChat from './useCuratorChat'

export default function ChatPanel({ playing = false }) {
  const { messages, sendMessage, isStreaming, turnCount } = useCuratorChat()
  const bottomRef = useRef(null)

  // Auto-scroll to bottom whenever messages update or streaming advances
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isEmpty = messages.length === 0
  const chips = getChipsForTurn(turnCount)

  // Show chips: only when not streaming and the panel is playing
  const showChips = playing && !isStreaming

  return (
    <div className={`${styles.panel} ${isEmpty ? styles.panelEmpty : ''}`}>
      <div className={styles.messageArea}>
        <div className={styles.messageList}>
          {messages.map((msg, i) => {
            const isLastAssistant = msg.role === 'assistant' &&
              i === messages.length - 1
            return (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                streaming={msg.streaming}
                showActions={isLastAssistant}
              />
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className={styles.bottomBar}>
        {playing && (
          <>
            <ChatInput
              autoFocus={playing}
              onSend={sendMessage}
              disabled={isStreaming}
            />
            <SuggestionChips
              chips={chips}
              onChipClick={sendMessage}
              visible={showChips}
            />
          </>
        )}
      </div>
    </div>
  )
}
