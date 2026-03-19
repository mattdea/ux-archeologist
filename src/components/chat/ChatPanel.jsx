// src/components/chat/ChatPanel.jsx
import { useRef, useEffect, useState, useCallback } from 'react'
import styles from './ChatPanel.module.css'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestionChips, { getChipsForTurn } from './SuggestionChips'
import useCuratorChat from './useCuratorChat'

export default function ChatPanel({ playing = false, onCompleteObjective }) {
  const { messages, sendMessage, regenerateLastResponse, isStreaming, turnCount } = useCuratorChat()
  const bottomRef = useRef(null)
  const toastTimerRef = useRef(null)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastKey, setToastKey] = useState(0)

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup toast timer on unmount
  useEffect(() => () => clearTimeout(toastTimerRef.current), [])

  const showToast = useCallback(() => {
    clearTimeout(toastTimerRef.current)
    setToastKey(k => k + 1)
    setToastVisible(true)
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2000)
  }, [])

  const handleSend = useCallback((text) => {
    // Objective 1: first message sent
    if (messages.length === 0) {
      onCompleteObjective?.('startConversation')
    }
    sendMessage(text)
  }, [messages.length, sendMessage, onCompleteObjective])

  const handleRegenerate = useCallback(() => {
    onCompleteObjective?.('regenerateResponse')
    regenerateLastResponse()
  }, [regenerateLastResponse, onCompleteObjective])

  const handleRate = useCallback(() => {
    onCompleteObjective?.('rateResponse')
    showToast()
  }, [onCompleteObjective, showToast])

  const isEmpty = messages.length === 0
  const chips = getChipsForTurn(turnCount)
  const showChips = playing && !isStreaming

  // Last assistant message index (action icons + toast only on the last one)
  const lastAssistantIdx = messages.reduce((acc, m, i) => m.role === 'assistant' ? i : acc, -1)

  return (
    <div className={`${styles.panel} ${isEmpty ? styles.panelEmpty : ''}`}>
      <div className={styles.messageArea}>
        <div className={styles.messageList}>
          {messages.map((msg, i) => {
            const isLast = i === lastAssistantIdx
            return (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                streaming={msg.streaming}
                showActions={msg.role === 'assistant' && isLast}
                toastVisible={isLast ? toastVisible : false}
                toastKey={isLast ? toastKey : 0}
                onCopy={() => {}}
                onThumbsUp={handleRate}
                onThumbsDown={handleRate}
                onRegenerate={isLast ? handleRegenerate : undefined}
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
              onSend={handleSend}
              disabled={isStreaming}
            />
            {/* SuggestionChips always rendered — opacity hides when not visible so
                the chips area height never changes and the input bar never shifts */}
            <SuggestionChips
              chips={chips}
              onChipClick={handleSend}
              visible={showChips}
            />
          </>
        )}
      </div>
    </div>
  )
}
