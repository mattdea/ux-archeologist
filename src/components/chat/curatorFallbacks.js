// src/components/chat/curatorFallbacks.js

// Ordered fallback pool — each entry has keywords to match against and a response.
// First match wins, so broad topics (what changed, the biggest change,
// touchscreens) sit above the era entries their questions also mention.
// Default (no keywords) is the last entry.
export const FALLBACK_POOL = [
  {
    keywords: ['this place', 'what is this', 'place', 'where'],
    response: "This is Interface Artifacts, an exhibit of six working replicas of computer interfaces from 1979 to 2023. Each room has three tasks and a note on what that interface changed.",
  },
  {
    keywords: ['who', 'you', 'are'],
    response: "I'm the exhibit's guide, a language model you can ask about anything you've seen here. I can be wrong, so treat what I say as a starting point.",
  },
  {
    keywords: ['level', 'room', 'other', 'played', 'before', 'previous'],
    response: "Each room is a replica of a real interface: a Unix terminal from 1979, the 1984 Macintosh, Netscape in 1995, the 2007 iPhone, Instagram in 2016, and this chat. The tasks use the thing each one introduced, such as dragging an icon or following a link.",
  },
  {
    keywords: ['built', 'react', 'made', 'how does this work', 'how was this'],
    response: "It's a web app built with React. Each room is its own recreation, and the museum around it keeps track of what you've finished.",
  },
  {
    keywords: ['changed', 'different', 'between', 'compared', 'versus', 'evolution'],
    response: "Each interface needed less learning than the one before: commands, then menus and icons, then links, then gestures. This one asks you to write ordinary sentences, though it can misunderstand them or answer wrongly.",
  },
  {
    keywords: ['biggest', 'leap', 'important', 'significant', 'revolution', 'mattered', 'matter most'],
    response: "A common answer is the move from typed commands to windows, icons and a mouse, because it let people use a computer without learning its commands. It took over personal computers between 1984 and the mid-1990s.",
  },
  {
    keywords: ['touchscreen', 'touch screen'],
    response: "With a mouse you move a pointer that stands in for your hand. A touchscreen drops the pointer: you touch the thing you want, and with multi-touch you can use more than one finger.",
  },
  {
    keywords: ['terminal', '1979', 'unix', 'command'],
    response: "At a Unix terminal you typed a command and the computer printed the result. Unix was written at Bell Labs by Ken Thompson and Dennis Ritchie from 1969, and its commands, such as ls and cat, are still in use.",
  },
  {
    keywords: ['mac', 'macintosh', '1984', 'desktop', 'icon', 'mouse', 'click'],
    response: "The Macintosh, in January 1984, let you work by pointing at pictures of files and folders and choosing commands from menus. Xerox and Apple's Lisa had done this first; the Mac sold it at $2,495.",
  },
  {
    keywords: ['web', 'browser', '1995', 'netscape', 'link', 'hypertext'],
    response: "On the 1995 web you moved between pages by following links their authors had chosen. Netscape Navigator was the browser most people used that year.",
  },
  {
    keywords: ['iphone', 'touch', 'phone', '2007', 'swipe', 'gesture'],
    response: "The iPhone, in June 2007, had a screen that sensed several fingers at once, so you dragged and pinched things directly instead of moving a pointer. Its keyboard was on the screen.",
  },
  {
    keywords: ['after', 'next', 'future', 'what comes'],
    response: "Nobody knows. Voice assistants, glasses and agents that act for you are being tried now, and it isn't clear which will last.",
  },
  {
    keywords: ['last', 'final', 'end', 'done'],
    response: "This is the last room, but probably not the last interface. The exhibit covers more than forty years, and each of its interfaces was new within a decade or two of the one before.",
  },
  {
    keywords: ['language', 'model', 'ai', 'gpt', 'chatgpt', 'llm'],
    response: "A language model writes by predicting likely next words, learned from a very large amount of text. The same text box can take a question, a translation or a request for code, which earlier chat programs couldn't.",
  },
  {
    // Default — no keywords required
    keywords: [],
    response: "I can only talk about interface history and this exhibit. Ask me about one of the rooms, or about how an interface you use came about.",
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
