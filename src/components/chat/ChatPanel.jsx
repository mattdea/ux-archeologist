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
  const messageAreaRef = useRef(null)
  const toastTimerRef = useRef(null)
  const pinnedRef = useRef(true) // true = auto-scroll; false = user scrolled up

  const [toastVisible, setToastVisible] = useState(false)
  const [toastKey, setToastKey] = useState(0)

  // Unpin on any meaningful scroll up; never re-pin via scroll (only on send)
  const handleScroll = useCallback(() => {
    const el = messageAreaRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distFromBottom > 5) pinnedRef.current = false
  }, [])

  // Auto-scroll only when pinned to bottom
  useEffect(() => {
    if (pinnedRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
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
    pinnedRef.current = true // re-pin on new send so response is visible
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
    <div className={styles.panel}>

      {/*
       * Top spacer: flex:1 when empty (centers bottomBar), collapses to flex:0
       * when messages exist — animates bottomBar downward over 300ms.
       */}
      <div className={`${styles.topSpacer} ${!isEmpty ? styles.topSpacerGone : ''}`} />

      {/*
       * Message area wrapper: invisible + collapsed when empty,
       * expands to fill remaining space as conversation starts.
       * Contains a fixed fade gradient overlay (does not scroll).
       */}
      <div className={`${styles.messageAreaWrapper} ${isEmpty ? styles.messageAreaWrapperHidden : ''}`}>
        <div className={styles.topFade} aria-hidden="true" />
        <div className={styles.messageArea} ref={messageAreaRef} onScroll={handleScroll}>
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
      </div>

      {/* Bottom bar: input + fixed-height chips area */}
      <div className={styles.bottomBar}>
        {playing && (
          <>
            <ChatInput
              autoFocus={playing}
              onSend={handleSend}
              disabled={isStreaming}
            />
            {/*
             * chipsArea has a fixed height so the input bar position is always
             * determined by: panel bottom - chips height - input height.
             * Chips fade in/out inside this space; nothing shifts.
             */}
            <div className={styles.chipsArea}>
              <SuggestionChips
                chips={chips}
                onChipClick={handleSend}
                visible={showChips}
              />
            </div>
          </>
        )}
      </div>

      {/*
       * Bottom spacer: mirrors topSpacer so bottomBar is centered when empty.
       * Collapses simultaneously with topSpacer when messages arrive.
       */}
      <div className={`${styles.bottomSpacer} ${!isEmpty ? styles.bottomSpacerGone : ''}`} />

    </div>
  )
}
