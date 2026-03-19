// src/components/chat/useCuratorChat.js

import { useState, useRef, useCallback } from 'react'
import { getFallbackResponse } from './curatorFallbacks'
import { CURATOR_SYSTEM_PROMPT } from './curatorSystemPrompt'

const CHARS_PER_SECOND = 80
const THINKING_DELAY_MS = 500
const API_TIMEOUT_MS = 5000

let nextId = 1
function makeId() { return nextId++ }

/**
 * Simulates streaming a response into the messages array.
 * Appends characters one by one at ~80 chars/sec via setInterval.
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

/**
 * Reads Groq SSE stream from /.netlify/functions/chat, appending tokens
 * to the message in real time. Resolves when stream ends.
 * Throws on non-200, network error, or abort.
 */
async function streamFromAPI(apiMessages, messageId, setMessages, abortSignal) {
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: apiMessages }),
    signal: abortSignal,
  })

  if (!response.ok) throw new Error(`API ${response.status}`)

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break

      try {
        const parsed = JSON.parse(data)
        const token = parsed.choices?.[0]?.delta?.content
        if (token) {
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: (msg.content ?? '') + token, streaming: true }
              : msg
          ))
        }
      } catch {
        // Ignore malformed SSE chunks
      }
    }
  }
}

export default function useCuratorChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const streamIntervalRef = useRef(null)
  const thinkingTimerRef = useRef(null)
  const abortControllerRef = useRef(null)

  const cancelStream = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  /**
   * Attempt real API streaming; on any failure fall back to simulateStream.
   */
  const doResponse = useCallback((apiMessages, assistantId, fallbackText, onComplete) => {
    const controller = new AbortController()
    abortControllerRef.current = controller
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

    streamFromAPI(apiMessages, assistantId, setMessages, controller.signal)
      .then(() => {
        clearTimeout(timeout)
        // Mark streaming complete on the last message
        setMessages(prev => prev.map(msg =>
          msg.id === assistantId ? { ...msg, streaming: false } : msg
        ))
        onComplete()
      })
      .catch(() => {
        clearTimeout(timeout)
        // Fall back to simulated streaming
        simulateStream(fallbackText, assistantId, setMessages, streamIntervalRef, onComplete)
      })
  }, [])

  const sendMessage = useCallback((text) => {
    if (!text.trim() || isStreaming) return
    cancelStream()

    const userMsg = { id: makeId(), role: 'user', content: text.trim(), streaming: false }
    const assistantId = makeId()
    const thinkingMsg = { id: assistantId, role: 'assistant', content: null, streaming: true }

    // Build API context: system prompt + existing history + new user message
    const apiMessages = [
      { role: 'system', content: CURATOR_SYSTEM_PROMPT },
      ...messages
        .filter(m => m.content !== null)
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text.trim() },
    ]
    const fallbackText = getFallbackResponse(text)

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setIsStreaming(true)

    thinkingTimerRef.current = setTimeout(() => {
      setMessages(curr => curr.map(msg =>
        msg.id === assistantId ? { ...msg, content: '', streaming: true } : msg
      ))
      doResponse(apiMessages, assistantId, fallbackText, () => {
        setIsStreaming(false)
        setTurnCount(c => c + 1)
      })
    }, THINKING_DELAY_MS)
  }, [isStreaming, cancelStream, messages, doResponse])

  const regenerateLastResponse = useCallback(() => {
    if (isStreaming) return
    cancelStream()

    const lastAssistantIdx = [...messages].reverse().findIndex(m => m.role === 'assistant')
    if (lastAssistantIdx === -1) return
    const idx = messages.length - 1 - lastAssistantIdx
    const lastUserMsg = [...messages].slice(0, idx).reverse().find(m => m.role === 'user')
    const oldContent = messages[idx].content
    const fallbackText = getFallbackResponse(lastUserMsg?.content ?? '', oldContent)
    const newId = makeId()

    // Reset message to thinking state (stable position, just ID change for regen)
    setMessages(prev => prev.map((msg, i) =>
      i === idx ? { ...msg, id: newId, content: null, streaming: true } : msg
    ))
    setIsStreaming(true)

    // API context: conversation up to (not including) the last assistant message
    const apiMessages = [
      { role: 'system', content: CURATOR_SYSTEM_PROMPT },
      ...messages
        .slice(0, idx)
        .filter(m => m.content !== null)
        .map(m => ({ role: m.role, content: m.content })),
    ]

    thinkingTimerRef.current = setTimeout(() => {
      setMessages(curr => curr.map(msg =>
        msg.id === newId ? { ...msg, content: '', streaming: true } : msg
      ))
      doResponse(apiMessages, newId, fallbackText, () => {
        setIsStreaming(false)
      })
    }, THINKING_DELAY_MS)
  }, [isStreaming, cancelStream, messages, doResponse])

  return {
    messages,
    sendMessage,
    regenerateLastResponse,
    isStreaming,
    turnCount,
  }
}
