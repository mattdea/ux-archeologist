// src/shared/index-museum/words.js
//
// The museum's own words for the index museum, copied word for word from
// the classic museum's components (TitleScreen, Timeline, Collection,
// AboutModal, IntroModal, DiscoveryCard, SmallScreenNotice, SharedLayout),
// which stay untouched. The rooms' text comes from src/data/artifacts.js;
// each level's intro, objectives and hint come from the level itself.
// If the classic copy changes, change it here too.

export const TITLE = {
  name: 'Interface Artifacts',
  subtitle: 'Six computer interfaces from 1979 to 2023, working as they did.',
  enter: 'Enter the exhibit',
  by: 'A project by Matthew Dea',
}

export const ABOUT = {
  label: "Curator's Note",
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
  about: 'About',
  collection: 'Collection',
  found: (n, of) => `${n} of ${of} found`,
  allRooms: 'All rooms',
  back: '← Back to timeline',
  backPlain: 'Back to timeline',
  objectives: 'Objectives',
  begin: 'Begin excavation',
  discovered: 'Artifact Discovered',
  cont: 'Continue',
  unfound: 'Finish this room to add it.',
  notFound: 'not found',
  notYetFound: 'not yet found',
  next: 'next',
  unexcavated: 'unexcavated',
  smallScreen: 'This experience was designed for larger screens.',
  smallScreenGo: 'Continue anyway',
  dark: 'Dark mode',
}

export const pad = (n) => String(n).padStart(2, '0')
