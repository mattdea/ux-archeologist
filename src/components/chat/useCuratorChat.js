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

  // Clean up any running stream/timers
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

    // Thinking placeholder — content=null signals the ThinkingIndicator
    const thinkingId = makeId()
    const thinkingMsg = { id: thinkingId, role: 'assistant', content: null, streaming: true }

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setIsStreaming(true)

    const responseText = getFallbackResponse(text)
    const assistantId = makeId()

    thinkingTimerRef.current = setTimeout(() => {
      // Replace thinking placeholder with the streaming message
      setMessages(prev => prev.map(msg =>
        msg.id === thinkingId
          ? { ...msg, id: assistantId, content: '', streaming: true }
          : msg
      ))

      simulateStream(responseText, assistantId, setMessages, streamIntervalRef, () => {
        setIsStreaming(false)
        setTurnCount(c => c + 1)
      })
    }, THINKING_DELAY_MS)
  }, [isStreaming, cancelStream])

  const regenerateLastResponse = useCallback(() => {
    if (isStreaming) return
    cancelStream()

    // Find the last assistant message
    setMessages(prev => {
      const lastAssistantIdx = [...prev].reverse().findIndex(m => m.role === 'assistant')
      if (lastAssistantIdx === -1) return prev
      const idx = prev.length - 1 - lastAssistantIdx

      // Get the last user message to use for keyword matching
      const lastUserMsg = [...prev].slice(0, idx).reverse().find(m => m.role === 'user')
      const oldContent = prev[idx].content
      const newText = getFallbackResponse(lastUserMsg?.content ?? '', oldContent)
      const newId = makeId()

      const updated = prev.map((msg, i) =>
        i === idx ? { ...msg, id: newId, content: null, streaming: true } : msg
      )

      // Kick off streaming after state settles
      setTimeout(() => {
        setMessages(curr => curr.map(msg =>
          msg.id === newId ? { ...msg, content: '', streaming: true } : msg
        ))
        setIsStreaming(true)
        simulateStream(newText, newId, setMessages, streamIntervalRef, () => {
          setIsStreaming(false)
        })
      }, THINKING_DELAY_MS)

      return updated
    })
  }, [isStreaming, cancelStream])

  return {
    messages,
    sendMessage,
    regenerateLastResponse,
    isStreaming,
    turnCount,
  }
}
