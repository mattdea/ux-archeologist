// src/components/chat/curatorFallbacks.js

// Ordered fallback pool — each entry has keywords to match against and a response.
// First match wins. Default (no keywords) is the last entry.
export const FALLBACK_POOL = [
  {
    keywords: ['this place', 'what is this', 'place', 'where'],
    response: "This is UX Archaeologist, an interactive history of how people and computers learned to communicate. You've just walked through fifty years of that history.",
  },
  {
    keywords: ['who', 'you', 'are'],
    response: "I'm the voice that's been guiding you through each exhibit. I was designed to help you see the pattern connecting terminals, desktops, browsers, phones, and feeds to this conversation.",
  },
  {
    keywords: ['level', 'played', 'before', 'previous'],
    response: "Each level recreated a real interface from its era. The interactions you performed, typing commands, dragging icons, clicking links, swiping screens, were the actual innovations of their time.",
  },
  {
    keywords: ['how', 'work', 'built', 'made'],
    response: "This experience is a React application. Each level is a self-contained recreation of a historical interface, wrapped in a museum layer that tracks your progress across eras.",
  },
  {
    keywords: ['terminal', '1971', 'unix', 'command'],
    response: "The Unix terminal was the first widely used conversational interface. You typed a precise instruction, the machine responded. Every interface since has been a variation on that same exchange.",
  },
  {
    keywords: ['mac', 'macintosh', '1984', 'desktop', 'icon', 'mouse', 'click'],
    response: "The Macintosh introduced direct manipulation in 1984. Instead of remembering command syntax, you could point at objects and move them. It made computing accessible to people who had never touched a computer.",
  },
  {
    keywords: ['web', 'browser', '1995', 'netscape', 'link', 'hypertext'],
    response: "The web made computing social. Pages linked to other pages, and following those links became a new kind of reading. Netscape Navigator was most people's first window into it.",
  },
  {
    keywords: ['iphone', 'touch', 'phone', '2007', 'swipe', 'gesture'],
    response: "The iPhone removed the last layer of abstraction between person and machine. The cursor disappeared. Your finger became the pointer, and the screen became the object you manipulated directly.",
  },
  {
    keywords: ['changed', 'different', 'between', 'compared', 'versus', 'evolution'],
    response: "The biggest shift was from learned vocabulary to natural language. Every interface before this one required you to learn its specific gestures and commands. This one works because you already know how to ask a question.",
  },
  {
    keywords: ['after', 'next', 'future', 'what comes'],
    response: "That's genuinely unclear. Each previous transition was obvious in hindsight but surprising at the time. The pattern suggests the next interface will feel more natural, not less, but what that looks like is not yet known.",
  },
  {
    keywords: ['biggest', 'leap', 'important', 'significant', 'revolution'],
    response: "The jump from command-line to graphical interfaces in 1984 was probably the largest single leap. It expanded the potential user base from tens of thousands to hundreds of millions within a decade.",
  },
  {
    keywords: ['touchscreen', 'touch screen', 'why', 'changed everything'],
    response: "Touchscreens collapsed the distance between intention and action. A mouse cursor is a proxy for your hand. Touch removed that proxy entirely, which made interfaces feel immediate in a way that had not been possible before.",
  },
  {
    keywords: ['last', 'final', 'end', 'done'],
    response: "This is the last exhibit, but probably not the last interface. The history you just walked through covers about fifty years. It is unlikely the next fifty years produce nothing new.",
  },
  {
    keywords: ['language', 'model', 'ai', 'gpt', 'chatgpt', 'llm'],
    response: "Large language models made text the universal interface. You can ask for code, a translation, a summary, or a plan in the same input field. That generality is what makes this moment different from earlier chat interfaces.",
  },
  {
    // Default — no keywords required
    keywords: [],
    response: "That's an interesting question. I'm best at discussing interface history and the experience you just had. Ask me about any of the levels or how computing interfaces have changed over the decades.",
  },
]

/**
 * Returns a fallback response string for the given user message.
 * Uses keyword matching — first match wins.
 * @param {string} userMessage
 * @param {string|null} excludeResponse - If set, avoid returning this exact response (for regeneration).
 */
export function getFallbackResponse(userMessage, excludeResponse = null) {
  const lower = userMessage.toLowerCase()

  for (const entry of FALLBACK_POOL) {
    // Default entry (empty keywords) always matches
    if (entry.keywords.length === 0) {
      if (entry.response !== excludeResponse) return entry.response
      continue
    }
    if (entry.keywords.some(kw => lower.includes(kw))) {
      if (entry.response !== excludeResponse) return entry.response
    }
  }

  // If we excluded the only match, return the default
  return FALLBACK_POOL[FALLBACK_POOL.length - 1].response
}
