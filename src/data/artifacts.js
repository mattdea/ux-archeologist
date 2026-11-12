// src/data/artifacts.js
//
// The six artifacts, in timeline order: one source for the level's
// discovery card, the timeline and the collection page. The collection
// reads its text from here (not the copies addArtifact saved), so copy
// changes show up everywhere.

export const ARTIFACTS = [
  {
    level: 0,
    year: '1979',
    title: 'The Command Line',
    name: 'Command & Response',
    path: '/level/0',
    description:
      "At a terminal you type a command, the computer prints the result, and you decide what to type next. Nothing on the screen shows what's possible: you learn the commands from the manual and from the people around you. The same short commands, like ls and rm, still work on every Mac.",
  },
  {
    level: 1,
    year: '1984',
    title: 'The Desktop',
    name: 'Direct Manipulation',
    path: '/level/1',
    description:
      "On the Macintosh, files, folders and the Trash are pictures you point at and move, and the menus list every command, so there's nothing to memorize. Xerox and Apple's own Lisa had done this first; the Mac, at $2,495, brought it to far more people.",
  },
  {
    level: 2,
    year: '1995',
    title: 'The Hyperlink',
    name: 'Hyperlink Navigation',
    path: '/level/2',
    description:
      "On the early web, every link was put there by the person who wrote the page, and you found things by following them from page to page. Directories such as Yahoo! sorted sites by hand, until search engines such as AltaVista, launched in December 1995, took over.",
  },
  {
    level: 3,
    year: '2007',
    title: 'The Touchscreen',
    name: 'Multi-Touch',
    path: '/level/3',
    description:
      "The iPhone's screen sensed fingers directly, more than one at a time, so you dragged, flicked and pinched instead of moving a pointer. Lists kept moving after you let go and bounced at the end, as if they had weight. Within a few years almost every phone worked this way.",
  },
  {
    level: 4,
    year: '2016',
    title: 'The Feed',
    name: 'Algorithmic Feed',
    path: '/level/4',
    description:
      "Until 2016, Instagram showed posts newest first, and it said people were missing about 70% of them. The ranked feed puts first what it predicts you'll like, based on what you've responded to before. You can't see how it decides, and every like tells it what to show you next.",
  },
  {
    level: 5,
    year: '2023',
    title: 'The Conversation',
    name: 'Natural Language',
    path: '/level/5',
    description:
      "Here you didn't learn commands, menus or gestures; you just asked, and it worked out what you wanted. It writes by predicting likely next words, so it can be wrong while sounding sure, and it can't show you why it answered as it did.",
  },
]

/** The artifact for a level number (0–5). */
export const artifactFor = (level) => ARTIFACTS[level]
