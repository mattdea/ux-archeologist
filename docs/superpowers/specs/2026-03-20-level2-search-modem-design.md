# Level 2 — Search Bar + Modem Sound Design

**Date:** 2026-03-20
**Status:** Approved

---

## Context

Level 2 (1995 — The Hyperlink) is complete but the Yahoo search bar is read-only. Adding a functional search bar enriches the sandbox without changing the 3 existing objectives. Dial-up modem sounds deepen era immersion during the boot sequence and page loads.

The level's discovery is "Hyperlink Navigation" — browsing by following links rather than searching. A working search bar is historically interesting precisely because Yahoo's curated directory was early 1995's closest thing to a search engine. Letting the player use it — and hit dead-end 404s and zero-result pages — reinforces the era's constraints rather than undermining them.

---

## Scope

- **No new objectives.** The 3 existing objectives are unchanged.
- **Sandbox enrichment only.** Search and modem sound add texture; they don't gate progression.

---

## Features

### 1. Functional Yahoo Search Bar

The search input in `YahooDirectory.jsx` accepts text and submits on Enter or button click.

**Prop added:** `onSearch(query: string)` passed from `Level2.jsx` → `renderPage` → `YahooDirectory`.

The existing `loadPhase` prop is already passed during the `'loading'` state; `onSearch` is only wired in the `'playing'` switch case (same pattern as `onNavigate`). During the boot load sequence, `onSearch` is `undefined` — `YahooDirectory` must guard against calling it.

### 2. History Entries — Strings → Objects

**Current:** `history = ['yahoo', 'yahoo-computers']`

**New:** `history = [{ page: 'yahoo' }, { page: 'yahoo-computers' }, { page: 'search-results', query: 'computers', results: [...], url: 'http://search.yahoo.com/bin/search?p=computers' }, { page: 'not-found', url: 'http://example.com/' }]`

Storing `results` in the history entry means back/forward navigation restores search results without re-fetching.

**Updated derived values in `Level2.jsx`:**
```js
const currentEntry = history[historyIndex]      // replaces: history[historyIndex] (string)
const currentPage  = currentEntry.page           // replaces: history[historyIndex]

// URL for address bar — handle new page types
const currentUrl = (() => {
  if (currentPage === 'search-results' || currentPage === 'not-found') return currentEntry.url
  return PAGES[currentPage].url
})()

// Title bar — handle new page types
const pageTitle = (() => {
  if (currentPage === 'search-results') return 'Yahoo! Search Results'
  if (currentPage === 'not-found') return 'Not Found'
  return PAGES[currentPage].title
})()
```

`displayUrl` and `displayTitle` are derived from these (unchanged logic — they already guard on `screen === 'intro'`).

**Updated `navigate` function:** Rename to `navigateTo(entry)` where `entry` is a history object `{ page, ...extras }`. The existing `navigate(pageKey: string)` callers pass `{ page: pageKey }`. The `'not-found'` caller passes `{ page: 'not-found', url }`.

```js
const navigateTo = useCallback((entry) => {
  if (entry.page !== 'search-results' && entry.page !== 'not-found') {
    completeObjective('navigate')
  }
  setHistory(prev => [...prev.slice(0, historyIndex + 1), entry])
  setHistoryIndex(prev => prev + 1)
  simulateNavLoad()
}, [historyIndex, completeObjective])
```

All existing callers (`YahooDirectory`, `YahooComputers`, `ValleyComputer`) pass `onNavigate={(key) => navigateTo({ page: key })}` — unchanged behavior.

### 3. `handleSearch` — Async Flow

```js
const handleSearch = useCallback(async (query) => {
  // 1. Start nav-loading + modem sound (same as simulateNavLoad but manually controlled)
  setIsNavLoading(true)
  playSound(modemSrc)

  // 2. Fetch Groq results AND wait 500ms minimum — in parallel
  const searchUrl = `http://search.yahoo.com/bin/search?p=${encodeURIComponent(query)}`
  let results = []
  const delay = new Promise(resolve => setTimeout(resolve, LOAD_DELAY))
  const fetchResults = fetch('/.netlify/functions/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
    .then(res => {
      if (res.ok) return res.json().then(d => d.results ?? [])
      return SEARCH_FALLBACK  // non-ok response (e.g. 500) → fallback
    })
    .catch(() => SEARCH_FALLBACK)  // network error → fallback

  ;[results] = await Promise.all([fetchResults, delay])

  // 3. Clear loading and push history in the same synchronous block
  // (React 18 batches these even in async context)
  setIsNavLoading(false)
  setHistory(prev => [...prev.slice(0, historyIndex + 1), { page: 'search-results', query, results, url: searchUrl }])
  setHistoryIndex(prev => prev + 1)
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [historyIndex])  // historyIndex captured at call time — same stale-closure pattern as navigateTo/goBack
```

> **Note:** `handleSearch` does NOT use `navigateTo` because it manages its own async loading sequence. It also does not call `completeObjective`.

### 4. `renderPage` — New Cases

`renderPage` has access to `currentEntry` (derived above). Pass the extras directly:

```js
case 'search-results':
  return (
    <SearchResultsPage
      query={currentEntry.query}
      results={currentEntry.results}
      onNavigate={(url) => navigateTo({ page: 'not-found', url })}
      onLinkHover={setHoverUrl}
    />
  )
case 'not-found':
  return <NotFoundPage url={currentEntry.url} />
```

The `'loading'` state hardcodes `YahooDirectory` (unchanged) — `currentEntry` is irrelevant there.

**Important:** The initial `history` state must be migrated from a string to an object:
```js
// Before:
const [history, setHistory] = useState(['yahoo'])
// After:
const [history, setHistory] = useState([{ page: 'yahoo' }])
```

### 5. Search Results Page

New component: `src/components/web/pages/SearchResultsPage.jsx` + `.module.css`

**Props:** `{ query, results, onNavigate, onLinkHover }`

**Layout (period-accurate):**
- Yahoo! header with logo
- "You searched for: [query]" + result count
- 3–5 results: title as blue underlined link, green URL, 1–2 sentence description
- Pagination line: `[Previous 20] 1–N [Next 20]` (visual only)

**Zero results:** Shows period-authentic message:
> Yahoo! could not locate any sites matching '[query]' in our directory.
> The Internet is still growing every day. You can submit a new site to our directory at http://add.yahoo.com/fast/add

Clicking any result link calls `onNavigate(result.url)`.

### 6. 404 Not Found Page

New component: `src/components/web/pages/NotFoundPage.jsx` + `.module.css`

**Props:** `{ url }`

**Layout:**
- Centered: large "Not Found" heading
- "The requested URL [url] was not found on this server."
- Horizontal rule + "Netscape Communications Corporation / Netscape Navigator/3.0"

Browser Back button returns to search results (history stack handles this naturally).

### 7. Groq Search API

New Netlify function: `netlify/functions/search.js`

**Non-streaming JSON** (unlike `chat.js` which is SSE). Uses `stream: false` and returns a plain JSON response body.

```js
// netlify/functions/search.js
export default async (req) => {
  const { query } = await req.json()

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      max_tokens: 400,
      temperature: 0.4,
      stream: false,
    }),
  })

  if (!groqRes.ok) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await groqRes.json()
  const text = data.choices[0].message.content.trim()

  let results = []
  try { results = JSON.parse(text) } catch { results = [] }

  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

**System prompt:**
> You are Yahoo!'s web directory search engine in December 1995. Only return results for things that existed on the World Wide Web in 1995 or earlier. If the query is about something that did not exist in 1995 (e.g., iPhone, Instagram, AI chatbots, YouTube, streaming services, any person or band not famous before 1995), return an empty JSON array []. For valid queries, return 3–5 results as a JSON array: [{"title": "...", "url": "...", "description": "..."}]. URLs must be HTTP (no HTTPS), plausible 1995 domains (.com/.edu/.org/.gov). Descriptions are 1–2 sentences in mid-90s webmaster style. Return ONLY valid JSON, no other text.

**Client-side fallback** (`SEARCH_FALLBACK` in `Level2.jsx`): Used when the fetch throws or `res.ok` is false. A static array of 3 generic 1995-era computing results, so the player always sees _something_:

```js
const SEARCH_FALLBACK = [
  { title: 'Yahoo! - Computers and Internet', url: 'http://www.yahoo.com/Computers_and_Internet/', description: 'Browse Yahoo\'s directory of computer and internet resources.' },
  { title: 'The World Wide Web Consortium (W3C)', url: 'http://www.w3.org/', description: 'Standards organization for the World Wide Web, founded by Tim Berners-Lee.' },
  { title: 'NCSA Mosaic Home Page', url: 'http://www.ncsa.uiuc.edu/SDG/Software/Mosaic/', description: 'The original graphical web browser from the National Center for Supercomputing Applications.' },
]
```

### 8. Dial-Up Modem Sound

**Asset:** `assets/modem.mp3` — a short (~3s) public-domain dial-up modem handshake clip.
> **Note:** This asset must be sourced before implementation. A royalty-free clip from freesound.org works. Place at `assets/modem.mp3`.

**Import** in `Level2.jsx`:
```js
import modemSrc from '../../assets/modem.mp3'
```
(two levels up: `src/levels/` → `src/` → project root → `assets/`)

**When to play:**
- Inside `startLoadSequence()` — call `playSound(modemSrc)` at the top of the function, before the first `setTimeout`
- Inside `simulateNavLoad()` — call `playSound(modemSrc)` at the top of the function

**Pattern** (from CLAUDE.md):
```js
function playSound(src) {
  const audio = new Audio(src)
  audio.volume = 0.5
  audio.play().catch(() => {})
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `netlify/functions/search.js` | Groq search proxy (non-streaming JSON) |
| `src/components/web/pages/SearchResultsPage.jsx` | Search results page |
| `src/components/web/pages/SearchResultsPage.module.css` | Period-accurate styles |
| `src/components/web/pages/NotFoundPage.jsx` | Netscape 404 page |
| `src/components/web/pages/NotFoundPage.module.css` | 404 styles |
| `assets/modem.mp3` | Dial-up modem sound (must be sourced externally) |

## Files to Modify

| File | Change |
|------|--------|
| `src/levels/Level2.jsx` | History type change, `handleSearch`, modem sound, `navigateTo`, `renderPage` new cases, `currentUrl`/`pageTitle` derivation |
| `src/components/web/pages/YahooDirectory.jsx` | Accept `onSearch` prop, wire input + button, guard against `undefined` onSearch |

---

## Verification

1. **Boot sound:** click "Begin Excavation" → modem sound plays during the 3s load sequence
2. **Navigation sound:** click any link → modem sound plays during 500ms load
3. **Search (valid, API live):** type "history of the internet" → 500ms load → Search Results page renders with 3–5 results
4. **Search (valid, API unavailable):** disable network or remove API key → same query returns the 3 SEARCH_FALLBACK results
5. **Search (anachronistic):** type "iphone" → No matching sites message appears (Groq returns `[]`)
6. **404 flow:** click any result link → 404 page renders with the attempted URL in the error text
7. **Back from 404:** click browser Back → returns to search results (results not re-fetched)
8. **Back from search results:** click browser Back → returns to Yahoo homepage
9. **Forward:** browser Forward navigates back through the stack correctly
10. **Objectives unchanged:** all 3 original objectives still fire; searching does not complete any objective; existing navigate/goBack/findPaper flows are unaffected
