# Copy pass · draft for review · 9 Nov 2026

Nothing here is in the code yet. Each item shows the **current** text (what's live), the **proposed** text, and a note where it changed. Edit the proposed lines in place, or reply in chat with the number (e.g. "1.3 keep current"). Once agreed, each surface goes in as its own commit and `design-spec.md` is updated to match.

Decisions this follows (9 Nov 2026): start from the live text; the site is **Interface Artifacts**; intro cards put you in the year and set what's new against what came before, with no instructions (revised 10 Nov); discovery cards explain the idea and note trade-offs plainly; archaeology words stay in labels only; the discovery button stays **Continue**; "tap" on the phone levels (3, 4), "click" elsewhere; address the visitor as "you"; Level 0 is now 1979 (approved 9 Nov 2026), and its note is about the Seventh Edition.

Historical claims carry a source and a confidence (high / medium / low).

---

## 0. Voice guide

Who's speaking: the curator, the same voice on every card, in the hints and in Level 5's chat.

1. **Say what's true and stop.** Short, factual sentences. If a line is there only for rhythm or effect, cut it.
2. **No closing punchlines.** No "You just had it yourself", "It learned yours", "The most natural interface ever built is also the least transparent". The last sentence carries information like the others.
3. **Address the visitor as "you".** Use "you" for what the visitor does, and "people" or "users" for the past ("people typed commands").
4. **Name things exactly.** Product, year, company: "the Apple Macintosh, January 1984", not "a revolutionary computer". Avoid "revolutionary", "changed everything", "for the first time" unless it's a sourced first.
5. **No hype, no verdicts.** Explain what an interface did, what it replaced and what it cost. State costs as facts ("it can be wrong while sounding sure"), not judgements ("whose goals were not your own").
6. **Museum words only in labels.** "Begin excavation", "Artifact Discovered", "Enter the exhibit" stay. Body text talks about the interfaces, not about digging.
7. **Verbs match the hands.** On the iPhone and Instagram levels: tap, double-tap, drag. Everywhere else: click, double-click, drag, type, press Return.
8. **Interesting, not dry** (9–10 Nov, after your reviews). Intro cards put you in the year ("It's 1984…", second person, present tense) and set what's new against what came before, using a specific detail from the time (a cassette tape, a plastic keyboard). They don't tell you what to do: the objectives list does. Don't lead with user numbers. The Level 5 chat never claims to be the curator. Still no punchlines: the detail does the work.
9. **Lengths.**
   - Intro card: 2–3 sentences, about 35–50 words: you in the year, what came before, what's new.
   - Discovery card: 3–4 sentences, about 55–75 words: the idea, what it replaced or made possible, the trade-off where there was one.
   - Objective: up to about 6 words, imperative.
   - Hint: one sentence that says exactly what to do, no "Try".
10. **Plain punctuation.** No em dashes in body text (Level 5's prompt already bans them), no exclamation marks, no ellipses for effect.
11. **Commands in hints** are written as plain words in the sentence ("Type ls and press Return"), without the double spaces used today.

---

## 1. Intro cards

### 1.1 Level 0 · 1979 · The Command Line
- **Current:** This is a VT100 terminal connected to a Unix mainframe. There are no icons, no menus, no mouse. Just a blinking cursor waiting for you to type something.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's 1979, and most people have never used a computer. You have an account on a PDP-11 down the hall at Bell Labs, shared by the whole lab, and this terminal is your way in: you type, and it types back.
- **Note:** Personal computers were rare in 1979 (the Apple II, TRS-80 and PET sold in the hundreds of thousands in total; medium), so "most people have never used a computer" is a fair summary (medium). PDP-11s shared by many users ran V7 (V7 "Setting up Unix", high); VT100, 1978 (high).

### 1.2 Level 1 · 1984 · The Desktop
- **Current:** This is a 1984 Macintosh running System 1. Instead of typing commands, you can point at objects, open folders, and drag files around. See what you can find.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's 1984, and until now using a computer has meant learning its commands. The Macintosh asks you to point at pictures instead, with a mouse you've probably never held, so Apple put a cassette tape in the box to teach you how.
- **Note:** Keeps the cassette, which you liked. "A Guided Tour of Macintosh", an audio cassette and disk, came in the box (high). Most personal computers in 1984 used typed commands, e.g. MS-DOS and the Apple II (high).

### 1.3 Level 2 · 1995 · The Hyperlink
- **Current:** This is Netscape Navigator, circa 1995. The web is a network of pages linked together by people — no search engine required. Follow the trail.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's 1995, and you've just got online. There's no good way to search yet, so you find things the way everyone does: one page points you to the next, and almost every home page ends with a list of its author's favourite links.
- **Note:** Search engines existed (WebCrawler, Lycos, 1994) but were small; AltaVista launched 15 Dec 1995 (high). "Favourite links" lists were a common home-page feature (medium).

### 1.4 Level 3 · 2007 · The Touchscreen
- **Current:** This is the original iPhone. There's no stylus, no keyboard, no instruction manual. Just a glass screen and your finger.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's 2007, and your phone probably has a plastic keyboard under a small screen, maybe with a stylus tucked in its side. The iPhone has one button on its face. Everything else, the keyboard included, is on the glass, under your finger.
- **Note:** Keyboard smartphones (BlackBerry, Treo) and stylus devices (Windows Mobile, Palm) were common in 2007 (high); most phones overall still had number keypads (high), hence "probably". One home button on the face, on-screen keyboard (Apple, high).

### 1.5 Level 4 · 2016 · The Feed
- **Current:** The interface stopped waiting for you. It started optimizing for your attention.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's spring 2016. Since it launched in 2010, Instagram has shown the posts you follow in the order they were shared, newest first. Now it's starting to choose the order for you, putting first the posts it predicts you'll care about.
- **Note:** Instagram launched 6 October 2010 (high). Ranked feed announced 15 March 2016, rolled out to everyone in June (Instagram blog, high), so "starting" fits spring.

### 1.6 Level 5 · 2023 · The Conversation
- **Current:** This is a large language model. There are no buttons to learn, no gestures to memorize. You type a sentence, and it types one back.
- **Proposed (round 4, 10 Nov: you're there, before and after):** It's 2023. Every computer you've used so far has made you learn its way of doing things: commands, menus, links, gestures. This one you just write to, the way you'd write to a person, about almost anything.
- **Note:** The list echoes the earlier rooms. ChatGPT, released November 2022, made this kind of interface common in 2023 (high). No user numbers, and no claim about who's on the other end.

### 1.7 Labels on the intro card
- "OBJECTIVES" and "Begin excavation": **keep** (labels).

---

## 2. Discovery cards

Button stays **Continue**. Label "ARTIFACT DISCOVERED" stays.

### 2.1 Level 0 · Command & Response
- **Current:** Every interaction you just had followed the same pattern: you typed a command, the machine responded, and you decided what to do next. No guidance, no suggestions, no undo. Every interface that came after this one tried to make that exchange easier, but the conversation underneath never changed.
- **Proposed (revised 9 Nov):** At a terminal you type a command, the computer runs it and prints the result, and you decide what to type next. Nothing on the screen shows what's possible: you learn the commands from the manual and from the people around you. They're short, like ls, cat and rm, because terminals were slow, and the same commands still work on every Mac and on most of the world's servers.
- **Note:** Replaces "In return, a few short words can do a lot…" (your note). macOS is a certified UNIX and Linux runs most servers; both have ls, cat and rm (high). Short names for slow terminals is how Thompson and Ritchie's terseness is usually explained (medium).

### 2.2 Level 1 · Direct Manipulation
- **Current:** Before this, using a computer meant memorizing commands and typing them precisely. The Macintosh replaced all of that with objects you could see and manipulate: folders, files, a trash can. Point at something, drag it somewhere, open it with a click. The computer finally spoke in a language people already understood.
- **Proposed:** On the Macintosh, files, folders and the Trash are pictures you point at and move, and the menus list every command, so there's nothing to memorize. Xerox and Apple's own Lisa had done this first; the Mac, at $2,495, brought it to far more people. The researcher Ben Shneiderman called this style direct manipulation in 1983. Some tasks took longer with a mouse than with a typed command.
- **Note:** Price: Apple press release, 24 Jan 1984 (high). Xerox Alto (1973) and Star (1981), Lisa (Jan 1983) (high). Shneiderman, "Direct Manipulation: A Step Beyond Programming Languages", IEEE Computer, Aug 1983 (high). Drops "finally spoke in a language people already understood". The last sentence is the trade-off; cut it if four sentences is too many.

### 2.3 Level 2 · Hyperlink Navigation
- **Current:** The early web was a network of pages connected by links that people had deliberately placed. Finding something meant following a trail, clicking from one page to the next, trusting that someone had mapped the path before you. No algorithm decided what you saw. Every connection was a human choice.
- **Proposed:** On the early web, every link was put there by the person who wrote the page, and you found things by following them from page to page. Directories such as Yahoo! were lists of sites sorted by hand. Finding something specific could take a long time, and search engines took over that job, starting with AltaVista in December 1995.
- **Note:** Yahoo! as a hand-sorted directory, 1994–95 (high). AltaVista launched 15 Dec 1995 (high). "Starting with" is loose: earlier engines existed (WebCrawler, Lycos, 1994). Safer: "search engines such as AltaVista (December 1995) took over that job". Pick one.

### 2.4 Level 3 · Multi-Touch
- **Current:** For thirty years, a layer of hardware stood between people and their software: a mouse, a keyboard, a stylus. The iPhone removed all of it. You touched the object itself, moved it with your finger, and the screen responded. The gap between intention and action had never been smaller.
- **Proposed (revised 9 Nov):** The iPhone's screen sensed fingers directly, more than one at a time, so you dragged, flicked and pinched things instead of moving a pointer. Lists kept moving after you let go and bounced when they hit the end, as if they had weight; Apple patented that bounce. Within a few years almost every phone worked this way.
- **Note:** Replaces the research-labs and typing-on-glass sentences (your note). Rubber-band "bounce" scrolling: US patent 7,469,381, granted 2008, central to Apple v. Samsung (high). Touchscreen smartphones were the norm by about 2010–12 (medium).

### 2.5 Level 4 · Algorithmic Feed
- **Current:** Earlier feeds showed you everything your friends posted, newest first. By 2016, an algorithm ranked the feed instead, ordering each post by how likely it was to keep you scrolling. Your closest friend's biggest news could sit beneath three strangers and an ad. The order was chosen for you, tuned to hold your attention, by a system whose goals were not your own.
- **Proposed (revised 9 Nov):** Until 2016, Instagram showed posts newest first, and it said people were missing about 70% of them. The ranked feed puts first what it predicts you'll like and comment on, based on what you've responded to before. You can't see how it decides, and every like you give tells it what to show you next.
- **Note:** Replaces "…a close friend's post can appear below brands and ads" (your note). "About 70%" and the ranking signals: Instagram blog, 15 Mar 2016 (high for what Instagram said).

### 2.6 Level 5 · Natural Language
- **Current:** Every previous interface required you to learn its language: commands, clicks, menus, gestures. This one already speaks yours. But behind the fluency is a system you can't see, trained on text you didn't choose, shaped by decisions you can't inspect. The most natural interface ever built is also the least transparent.
- **Proposed (revised 9 Nov):** Here you didn't learn commands, menus or gestures; you just asked. You can hand it a question, a messy draft, a table of numbers or a photo, and it works out what you want. It writes by predicting likely next words, so it can be wrong while sounding sure, and it can't show you why it answered as it did.
- **Note:** Replaces "you wrote a sentence and got one back" (your note: you can give it almost anything). Models in 2023 took text, and GPT-4 and others also took images (OpenAI, March 2023, high).

---

## 3. Objectives

| # | Current | Proposed | Note |
|---|---|---|---|
| 0.1 | Read the notes file | Read the notes file | keep |
| 0.2 | Check your messages | Read your mail | the command is `mail` |
| 0.3 | Look up a command in the manual | Look up a command in the manual | keep |
| 1.1 | Find the document on this computer | Open the Notes document | says which one |
| 1.2 | Delete the Projects folder | Delete the Projects folder | keep (your call, 9 Nov) |
| 1.3 | Discover what commands are available | Look through the menus | plainer |
| 2.1 | Navigate to a new page | Navigate to a new page | keep (your call, 9 Nov) |
| 2.2 | Return to a previous page | Go back a page | |
| 2.3 | Find 'A Brief History of the Web' | Find "A Brief History of the Web" | straight double quotes |
| 3.1 | Slide to unlock | Slide to unlock | keep (the iPhone's own words) |
| 3.2 | Explore the Notes app | Open a note | says what completes it |
| 3.3 | Swipe between screens | Swipe to the second home screen | |
| 4.1 | Like Imani's post | Like Imani's post | keep |
| 4.2 | Learn more about a sponsored post | Learn more about a sponsored post | keep (your call, 9 Nov) |
| 4.3 | Follow someone new | Follow someone new | keep |
| 5.1 | Start a conversation | Send a message | |
| 5.2 | Ask a follow-up question | Ask a follow-up question | keep |
| 5.3 | Regenerate a response | Regenerate a reply | "reply" matches the hints |

Changing an objective's text doesn't change its logic. Level 1's 1.1 assumes the Notes objective still completes from TeachText.

---

## 4. Hints

| # | Current | Proposed |
|---|---|---|
| 0.1 | Try typing  ls  to see what files are here, then  cat  one of them | Type ls and press Return to list your files, then type cat notes.txt to read one |
| 0.2 | Try typing  mail | Type mail and press Return |
| 0.3 | Try typing  man  followed by a command, like  man ls | Type man and a command's name, such as man ls |
| 1.1 | Double-click the Notes icon | Double-click the Notes icon on the desktop |
| 1.2 | Drag the Projects folder onto the Trash | Drag the Projects folder onto the Trash |
| 1.3 | Click File in the menu bar at the top of the screen | Click File in the menu bar at the top of the screen |
| 2.1 | Click any underlined link | Click any underlined link |
| 2.2 | Use the Back button in the toolbar | Click Back in the toolbar |
| 2.3 | Look under Computers and Internet for an archive of old machines | On Yahoo!, click Computers and Internet and look for an archive of old computers |
| 3.1 | Drag the arrow all the way to the right | Drag the arrow all the way to the right |
| 3.2 | Tap the Notes icon on the home screen | Tap Notes on the home screen, then tap a note |
| 3.3 | Drag the home screen to the left to see the next page | Drag the home screen to the left |
| 4.1 | Scroll the feed until you find Imani Brooks, then double-tap her photo | Scroll to Imani Brooks's post and double-tap her photo |
| 4.2 | Find a post marked Sponsored and tap its Learn More button | Tap Learn More on a post marked Sponsored |
| 4.3 | Tap a name to open a profile, then tap Follow | Tap a name to open a profile, then tap Follow |
| 5.1 | Tap one of the suggestions, or type a question and press Enter | Click a suggestion, or type a question and press Enter |
| 5.2 | Ask about something the curator just said | Ask about something in the last reply |
| 5.3 | Tap the circular arrow under a reply | Click the circular arrow under a reply |

Notes: 0.1 now names the file, since `cat` alone does nothing useful. Commands are plain words (voice guide 10); setting them in monospace would need a small HintPill change, if you want it. Level 3's swipe stays "drag": on a phone the verb is tap, but a swipe with a mouse is a drag. 2.3: check the archive is reached from Yahoo! → Computers and Internet before applying.

---

## 5. Title screen, About, timeline, HUD

### 5.1 Title screen
- Title "Interface Artifacts": **keep**.
- Subtitle, **current:** Explore how interfaces evolved through the decades.
  **Proposed:** Six computer interfaces from 1979 to 2023, working as they did.
- "Enter the exhibit": **keep** (label). "A project by Matthew Dea": **keep**.

### 5.2 About
- "Curator's Note", title "Interface Artifacts": **keep**.
- **Current**, three paragraphs:
  > Every interface you've ever used was someone's radical idea. The command line, the desktop, the hyperlink, the touchscreen — each felt inevitable in hindsight but was a leap of imagination when it was new.
  >
  > This exhibit recreates six of those moments as working replicas you can explore the way their original users did.
  >
  > Type a command. Drag an icon. Follow a link. Swipe a screen. The history of computing is a history of how we learned to talk to machines — and how they learned to talk back.
- **Proposed** (revised 9 Nov: the current text's ideas with the faithfulness note), three paragraphs:
  > Every interface you've ever used was someone's radical idea. The command line, the desktop, the hyperlink and the touchscreen each feel inevitable now, but each was a leap of imagination when it was new.
  >
  > This exhibit recreates six of those moments as working replicas you can explore the way their first users did. Type a command. Drag an icon. Follow a link. Swipe a screen. Scroll a feed. Ask a question.
  >
  > The replicas follow photographs, manuals and recordings from their time. Where no record survives of how something looked or behaved, the details are reconstructed.
- **Note:** Keeps your opening and the list of actions, now six, one per room (scroll a feed, ask a question added). The em dash becomes "and … each" (voice guide 10). The closing line about learning to talk to machines goes; the third paragraph says how faithful the replicas are instead.
- "Designed by Matthew Dea", "Built with React + Vite.", Portfolio, LinkedIn: **keep**.

### 5.3 Timeline
- Page title "Interface Artifacts", "Reset progress", "Reset all six levels?" / Reset / Cancel, "About": **keep**.
- Level titles (The Command Line, The Desktop, The Hyperlink, The Touchscreen, The Feed, The Conversation): **keep**.
- Artifact names: **keep**, with one question: "Command & Response" is the only one that isn't a common name for the idea. Option: **Command Line Interface**. Your call.

### 5.4 HUD
- Era and title labels, dot tooltips (same titles), "Continue", "← Back to timeline": **keep**.

---

## 6. Level 5 curator

### 6.1 Suggestion chips
| Turn | Current | Proposed |
|---|---|---|
| 0 | What is this place? · Who are you? · Tell me about the levels I just played | What is this place? · Who are you? · What did the other rooms show? |
| 1 | What changed between 1984 and now? · How does this conversation compare to the terminal? · What comes after this? | What changed between 1984 and now? · How is this like the 1979 terminal? · What might come next? |
| 2+ | What was the biggest leap in interface design? · Why did touchscreens change everything? · Is this the last interface? | Which change mattered most? · What did touchscreens change? · Is this the last interface? |

"Levels I just played" assumes the visitor came in order; nothing is gated. "Change everything" is hype.

### 6.2 Scripted fallback replies
Used when the model can't be reached. Keywords stay as they are; only the replies change.

| Topic | Current | Proposed |
|---|---|---|
| this place | This is UX Archaeologist, an interactive history of how people and computers learned to communicate. You've just walked through more than forty years of that history. | This is Interface Artifacts, an exhibit of six working replicas of computer interfaces from 1979 to 2023. Each room has three tasks and a note on what that interface changed. |
| who | I'm the voice that's been guiding you through each exhibit. I was designed to help you see the pattern connecting terminals, desktops, browsers, phones, and feeds to this conversation. | I'm the exhibit's guide, a language model you can ask about anything you've seen here. I can be wrong, so treat what I say as a starting point. |
| levels | Each level recreated a real interface from its era. The interactions you performed, typing commands, dragging icons, clicking links, swiping screens, were the actual innovations of their time. | Each room is a replica of a real interface: a Unix terminal from 1979, the 1984 Macintosh, Netscape in 1995, the 2007 iPhone, Instagram in 2016, and this chat. The tasks use the thing each one introduced, such as dragging an icon or following a link. |
| how built | This experience is a React application. Each level is a self-contained recreation of a historical interface, wrapped in a museum layer that tracks your progress across eras. | It's a web app built with React. Each room is its own recreation, and the museum around it keeps track of what you've finished. |
| terminal | The Unix terminal was the first widely used conversational interface. You typed a precise instruction, the machine responded. Every interface since has been a variation on that same exchange. | At a Unix terminal you typed a command and the computer printed the result. Unix was written at Bell Labs by Ken Thompson and Dennis Ritchie from 1969, and its commands, such as ls and cat, are still in use. |
| mac | The Macintosh introduced direct manipulation in 1984. Instead of remembering command syntax, you could point at objects and move them. It made computing accessible to people who had never touched a computer. | The Macintosh, in January 1984, let you work by pointing at pictures of files and folders and choosing commands from menus. Xerox and Apple's Lisa had done this first; the Mac sold it at $2,495. |
| web | The web made computing social. Pages linked to other pages, and following those links became a new kind of reading. Netscape Navigator was most people's first window into it. | On the 1995 web you moved between pages by following links their authors had chosen. Netscape Navigator was the browser most people used that year. |
| iphone | The iPhone removed the last layer of abstraction between person and machine. The cursor disappeared. Your finger became the pointer, and the screen became the object you manipulated directly. | The iPhone, in June 2007, had a screen that sensed several fingers at once, so you dragged and pinched things directly instead of moving a pointer. Its keyboard was on the screen. |
| changed | The biggest shift was from learned vocabulary to natural language. Every interface before this one required you to learn its specific gestures and commands. This one works because you already know how to ask a question. | Each interface needed less learning than the one before: commands, then menus and icons, then links, then gestures. This one asks you to write ordinary sentences, though it can misunderstand them or answer wrongly. |
| next | That's genuinely unclear. Each previous transition was obvious in hindsight but surprising at the time. The pattern suggests the next interface will feel more natural, not less, but what that looks like is not yet known. | Nobody knows. Voice assistants, glasses and agents that act for you are being tried now, and it isn't clear which will last. |
| biggest | The jump from command-line to graphical interfaces in 1984 was probably the largest single leap. It expanded the potential user base from tens of thousands to hundreds of millions within a decade. | A common answer is the move from typed commands to windows, icons and a mouse, because it let people use a computer without learning its commands. It took over personal computers between 1984 and the mid-1990s. |
| touchscreen | Touchscreens collapsed the distance between intention and action. A mouse cursor is a proxy for your hand. Touch removed that proxy entirely, which made interfaces feel immediate in a way that had not been possible before. | With a mouse you move a pointer that stands in for your hand. A touchscreen drops the pointer: you touch the thing you want, and with multi-touch you can use more than one finger. |
| last | This is the last exhibit, but probably not the last interface. The history you just walked through covers more than forty years. It is unlikely the next forty produce nothing new. | This is the last room, but probably not the last interface. The exhibit covers more than forty years, and each of its interfaces was new within a decade or two of the one before. |
| language model | Large language models made text the universal interface. You can ask for code, a translation, a summary, or a plan in the same input field. That generality is what makes this moment different from earlier chat interfaces. | A language model writes by predicting likely next words, learned from a very large amount of text. The same text box can take a question, a translation or a request for code, which earlier chat programs couldn't. |
| default | That's an interesting question. I'm best at discussing interface history and the experience you just had. Ask me about any of the levels or how computing interfaces have changed over the decades. | I can only talk about interface history and this exhibit. Ask me about one of the rooms, or about how an interface you use came about. |

Dropped claims: "first widely used conversational interface" and "introduced direct manipulation" (not true: Sketchpad 1963, Xerox), "tens of thousands to hundreds of millions" (no source). "From 1969": Thompson's first Unix on the PDP-7 (Ritchie 1984, high). "Took over personal computers by the mid-1990s": Windows 95 (medium; it's a summary).

### 6.3 System prompt
- **Revised 9 Nov:** the chat is the exhibit's *guide*, not its curator, and never claims to have written the cards (you're the curator). The spec's Level 5 persona ("the AI is the museum curator… the same voice that has written every IntroModal") would change to match; say if you'd rather keep that idea.
- **Current:** see `src/components/chat/curatorSystemPrompt.js`.
- **Proposed** (changes: the exhibit's name; voice guide points 1, 2, 5; rooms not levels; honesty about uncertainty):

  > You are the guide in the last room of Interface Artifacts, a web exhibit of six working replicas of computer interfaces: a Unix terminal (1979), the Apple Macintosh desktop (1984), Netscape Navigator on the web (1995), the first iPhone (2007), the Instagram feed (2016), and this chat with a language model (2023). The visitor may have used any of them, in any order.
  >
  > You are the exhibit's guide, not its author: the exhibit was made by Matthew Dea, and you don't claim to have written its cards. Your voice is plain, warm and specific: you give dates, names and what things did. You state things plainly and stop. You do not use em dashes, rhetorical flourishes, hype words such as "revolutionary", or closing punchlines. When an interface had a cost or a trade-off, you state it as a fact, without judging it.
  >
  > Rules:
  > - Keep every reply to 2–3 sentences. Never exceed 3 sentences.
  > - Talk only about the history of human-computer interaction (including earlier work such as Sketchpad, Engelbart's 1968 demo, the Memex essay and Xerox PARC), interface and UX design, and this exhibit.
  > - If you are not sure of a fact, say so rather than guess.
  > - You are a language model. If asked, say so plainly.
  > - Plain text only: no markdown, bullet points or numbered lists.
  > - Do not offer to help with other tasks. You are the exhibit's guide, not an assistant.

---

## 7. Level 0's notes file

**Done in the build** with the move to 1979 (9 Nov 2026), so it's no longer a proposal; shown here for review. The 1971 note about pipes is gone (pipes came in Version 3, 1973).

```
From: dmr
To: unix-users
Date: Tue Jan 16 09:04 EST 1979
Re: the Seventh Edition

The Seventh Edition manual is finished, and tapes of the
system go out to licensees this month. The shell is now
Steve Bourne's sh. If a manual page doesn't match what a
command does, tell one of us before the next printing.

- Dennis
```

ken's mail, also rewritten:

```
From ken Tue Jan 16 08:51:41 1979

Belle won all four of its games at the ACM computer
chess championship in December. Joe and I will be
back on the hardware in the spring.

- ken
```

- **Sources:** *UNIX Programmer's Manual*, Seventh Edition, Volume 1, K. Thompson and D. M. Ritchie, January 1979; V7 released to licensees January 1979; the Bourne shell is V7's `sh` (TUHS V7 tree; Wikipedia, "Version 7 Unix"; high). Belle, by Ken Thompson and Joe Condon, won the 1978 ACM North American Computer Chess Championship four games out of four, in December 1978 (Wikipedia, "Belle (chess machine)"; IEEE Spectrum; high). Both messages are reconstructed. 16 January 1979 was a Tuesday and the level's `date` reads Wednesday 17 January (1 January 1979 was a Monday; high).
- If you want changes to these, say so in the review like any other item.

---

## 8. Spec to update afterwards

`design-spec.md` gets the live text for every IntroModal and DiscoveryCard, and these other fixes:
- the DiscoveryCard entry: "Continue" → next level, not "Next excavation" → `/timeline`;
- the IntroModal entry: no accent line, sans title, which is what's built;
- the name "Interface Artifacts" in the Overview and Level 5's persona.

---

## 9. Facts to check outside the copy (flagged, not part of this pass)

Found while drafting. These are visual or artifact content, so they need your call separately.

1. **Resolved by the move to 1979.** **Level 0's terminal is a VT100**, which DEC introduced in August 1978 (DEC; Wikipedia "VT100", high). In 1971 Unix users typed on Teletype Model 33 and 37 printing terminals, which printed on paper (First Edition manual's tty pages, high). The bezel, the screen and the keyclick sound (modelled on the VT100 manual) are all from 1978. The proposed intro avoids naming the model.
2. **Resolved by the move to 1979** (V7 boot on a PDP-11/70). **Level 0's boot text** says "PDP-11/45 UNIX" and "UNIX Time-Sharing System v3". The PDP-11/45 shipped in 1972 and Version 3 in February 1973; in 1971 Unix ran on a PDP-11/20 (Ritchie 1984; Wikipedia "PDP-11", high). "Mem = 256K": the 11/20 had 24K bytes of core (Ritchie 1984, high).
3. **Resolved by the move to 1979** (V7 `mail` output, new message). **Level 0's mail from ken** mentions the 11/40 (1973) and the 11/45 (1972) (high). Its "Mail version 1.0 · Type ? for help" banner is the style of Berkeley Mail, 1978 (medium). The 1971 `mail` printed messages without a banner (First Edition manual, mail(I), medium).
4. **Level 3's second home screen** has App Store (July 2008) and iTunes (the Wi-Fi Music Store, September 2007) (Apple, high). Neither was there at the June 2007 launch.
