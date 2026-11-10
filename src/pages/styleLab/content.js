// src/pages/styleLab/content.js
//
// The museum's real text, for the style lab's mocks. The artifacts come from
// src/data/artifacts.js. The rest is copied word for word from where it lives
// today (10 Nov 2026), because the lab doesn't import the museum's
// components: TitleScreen.jsx, Timeline.jsx, Collection.jsx, AboutModal.jsx,
// IntroModal.jsx, ObjectiveTracker.jsx, DiscoveryCard.jsx,
// SmallScreenNotice.jsx, SharedLayout.jsx and each LevelN.jsx (intro
// description, OBJECTIVES, HINTS). If the live copy changes, change it here.
import { ARTIFACTS } from '../../data/artifacts'

const INTROS = [
  "It's 1979, and this is a VT100 terminal, your line to a computer down the hall that the whole lab shares. There are no icons, no menus, no mouse. Just a blinking cursor, and it won't suggest a thing: the machine waits for you to know what to ask.",
  "It's 1984, and this is the Apple Macintosh. Until now, using a computer has meant memorizing commands. Here everything is where you can see it: files, folders, even a trash can, there to point at and pick up. Hardly anyone has held a mouse, so Apple packed a cassette tape in the box to teach you.",
  "It's 1995, and this is Netscape Navigator, the browser most people use to get on the web. The web has no map, and no good way to search it yet. Every link was put there by a person, and following them is the only way around, so where you end up depends on whose pages you happen to find.",
  "It's 2007, and this is the original iPhone. Other phones have plastic keyboards, small screens and sometimes a stylus. This one has no stylus, no keys, nothing to learn first. Just a sheet of glass and your finger.",
  "It's spring 2016, and this is Instagram on an iPhone 6. There's nothing to open and nothing to look for: the photos are already there when you arrive, and there are always more below. This year Instagram begins deciding which ones you see first, guessing at what will keep you looking.",
  "It's 2023, and this is a large language model, the kind of AI behind ChatGPT. Every interface so far has asked you to learn something first: commands, menus, links, gestures. This one has no buttons to learn and nothing to memorize. You write to it the way you'd write to a person, and it writes back.",
]

const OBJECTIVES = [
  ['Read the notes file', 'Read your mail', 'Look up a command in the manual'],
  ['Open the Notes document', 'Delete the Projects folder', 'Look through the menus'],
  ['Navigate to a new page', 'Go back a page', 'Find "A Brief History of the Web"'],
  ['Slide to unlock', 'Open a note', 'Swipe to the second home screen'],
  ["Like Imani's post", 'Learn more about a sponsored post', 'Follow someone new'],
  ['Send a message', 'Ask a follow-up question', 'Regenerate a reply'],
]

const HINTS = [
  ['Type ls and press Return to list your files, then type cat notes.txt to read one', 'Type mail and press Return', "Type man and a command's name, such as man ls"],
  ['Double-click the Notes icon on the desktop', 'Drag the Projects folder onto the Trash', 'Click File in the menu bar at the top of the screen'],
  ['Click any underlined link', 'Click Back in the toolbar', 'On Yahoo!, click Computers and Internet and look for an archive of old computers'],
  ['Drag the arrow all the way to the right', 'Tap Notes on the home screen, then tap a note', 'Drag the home screen to the left'],
  ["Scroll to Imani Brooks's post and double-tap her photo", 'Tap Learn More on a post marked Sponsored', 'Tap a name to open a profile, then tap Follow'],
  ['Click a suggestion, or type a question and press Enter', 'Ask about something in the last reply', 'Click the circular arrow under a reply'],
]

// Each artifact's frame at its native size (design-spec "Artifact Fit";
// Level 4's is the iPhone 6 screen, Level 5 has no device)
const FRAMES = [[780, 460], [780, 755], [700, 580], [385, 735], [375, 667], [760, 520]]

/** The six rooms: the artifact's data plus its intro, objectives and hints. */
export const ROOMS = ARTIFACTS.map((a, i) => ({
  ...a,
  intro: INTROS[i],
  objectives: OBJECTIVES[i],
  hints: HINTS[i],
  frame: FRAMES[i],
}))

export const TITLE = {
  name: 'Interface Artifacts',
  subtitle: 'Six computer interfaces from 1979 to 2023, working as they did.',
  enter: 'Enter the exhibit',
  by: 'A project by Matthew Dea',
  about: 'About',
}

export const ABOUT = {
  label: "Curator's Note",
  title: 'Interface Artifacts',
  paragraphs: [
    "Every interface you've ever used was someone's radical idea. The command line, the desktop, the hyperlink and the touchscreen each feel inevitable now, but each was a leap of imagination when it was new.",
    'This exhibit recreates six of those moments as working replicas you can explore the way their first users did. Type a command. Drag an icon. Follow a link. Swipe a screen. Scroll a feed. Ask a question.',
    'The replicas follow photographs, manuals and recordings from their time. Where no record survives of how something looked or behaved, the details are reconstructed.',
  ],
  designedBy: 'Designed by',
  name: 'Matthew Dea',
  built: 'Built with React + Vite.',
  links: [
    { label: 'Portfolio', href: 'https://www.matthewdea.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deamatthew/' },
  ],
}

export const WORDS = {
  timelineTitle: 'Interface Artifacts',
  reset: 'Reset progress',
  collection: 'Collection',
  back: '← Back to timeline',
  backPlain: 'Back to timeline',
  objectives: 'Objectives',
  begin: 'Begin excavation',
  discovered: 'Artifact Discovered',
  cont: 'Continue',
  unfound: 'Finish this room to add it.',
  smallScreen: 'This experience was designed for larger screens.',
  smallScreenGo: 'Continue anyway',
}

// The mock's fixed state (the lab never reads real progress): four rooms
// finished; in the level frame the first objective is done and the hint is
// the nudge for the second.
export const MOCK = {
  found: [0, 1, 2, 3],
  done: [0],
  hintFor: 1,
}
export const isFound = (level) => MOCK.found.includes(level)
export const foundCount = MOCK.found.length
export const collectionLine = `${WORDS.collection} · ${foundCount} of ${ROOMS.length}`
export const foundLine = `${foundCount} of ${ROOMS.length} found`
export const pad = (n) => String(n).padStart(2, '0')
