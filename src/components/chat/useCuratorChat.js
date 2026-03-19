// src/components/chat/useCuratorChat.js

import { useState, useRef, useCallback } from 'react'
import { getFallbackResponse } from './curatorFallbacks'

const CHARS_PER_SECOND = 30
const THINKING_DELAY_MS = 500

let nextId = 1
function makeId() { return nextId++ }

/**
 * Simulates streaming a response into the messages array.
 * Appends characters one by one at ~30 chars/sec via setInterval.
 * Calls onComplete when done.
 */
function simulateStream(fullText, messageId, setMessages, intervalRef, onComplete) {
  let charIndex = 0
  const intervalMs = Math.round(1000 / CHARS_PER_SECOND)

  intervalRef.current = setInterval(() => {
    charIndex++
    const slice = fullText.slice(0, charIndex)

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, content: slice, streaming: charIndex < fullText.length }
        : msg
    ))

    if (charIndex >= fullText.length) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      onComplete()
    }
  }, intervalMs)
}

export default function useCuratorChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const streamIntervalRef = useRef(null)
  const thinkingTimerRef = useRef(null)

  // Cancel any running stream or pending thinking timer
  const cancelStream = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
  }, [])

  const sendMessage = useCallback((text) => {
    if (!text.trim() || isStreaming) return
    cancelStream()

    const userMsg = { id: makeId(), role: 'user', content: text.trim(), streaming: false }
    const assistantId = makeId()
    const thinkingMsg = { id: assistantId, role: 'assistant', content: null, streaming: true }

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setIsStreaming(true)

    const responseText = getFallbackResponse(text)

    thinkingTimerRef.current = setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantId
          ? { ...msg, content: '', streaming: true }
          : msg
      ))
      simulateStream(responseText, assistantId, setMessages, streamIntervalRef, () => {
        setIsStreaming(false)
        setTurnCount(c => c + 1)
      })
    }, THINKING_DELAY_MS)
  }, [isStreaming, cancelStream])

  // Regenerate: computed entirely outside setState to avoid side effects in updaters
  const regenerateLastResponse = useCallback(() => {
    if (isStreaming) return
    cancelStream()

    // Find last assistant message + preceding user message from current state
    const lastAssistantIdx = [...messages].reverse().findIndex(m => m.role === 'assistant')
    if (lastAssistantIdx === -1) return
    const idx = messages.length - 1 - lastAssistantIdx
    const lastUserMsg = [...messages].slice(0, idx).reverse().find(m => m.role === 'user')
    const oldContent = messages[idx].content
    const newText = getFallbackResponse(lastUserMsg?.content ?? '', oldContent)
    const newId = makeId()

    // Reset the message to thinking state
    setMessages(prev => prev.map((msg, i) =>
      i === idx ? { ...msg, id: newId, content: null, streaming: true } : msg
    ))
    setIsStreaming(true)

    // After thinking delay, start streaming
    thinkingTimerRef.current = setTimeout(() => {
      setMessages(curr => curr.map(msg =>
        msg.id === newId ? { ...msg, content: '', streaming: true } : msg
      ))
      simulateStream(newText, newId, setMessages, streamIntervalRef, () => {
        setIsStreaming(false)
      })
    }, THINKING_DELAY_MS)
  }, [isStreaming, cancelStream, messages])

  return {
    messages,
    sendMessage,
    regenerateLastResponse,
    isStreaming,
    turnCount,
  }
}
