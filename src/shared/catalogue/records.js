// src/shared/catalogue/records.js
//
// Each room's catalogue record (CatalogueRecord.jsx): the catalogue number
// (IA.<year>.<the room's number on the cards>), the object line, the data
// block, and labels for parts the exhibit actually shows. A part is placed
// at fixed device coordinates ({ y, left, right }: where the dot goes with
// the column on the left or the right) or found in the artifact by a
// selector ({ find }). Facts and their sources: design-spec, "Catalogue
// record", under each level. Dev server only (loaded lazily).
export const RECORDS = {
  0: {
    number: 'IA.1979.01',
    object: ['DEC VT100, 1978'],
    data: [
      'Intel 8080',
      'ANSI X3.64 escape codes',
      '37 × 46 × 36 cm, 13.6 kg',
      'August 1978',
    ],
    // The keyboard (detachable, 83 keys) isn't drawn, so it has no label
    parts: [
      { id: 'screen', lines: ['12-inch screen', '80 × 24, or 132 × 14'], find: '[class*="_screenRecess_"]' },
    ],
  },
  1: {
    number: 'IA.1984.02',
    object: ['Apple Macintosh (128K), 1984'],
    data: [
      'Motorola 68000, 7.8 MHz',
      '128 KB memory',
      '35 × 24 × 28 cm, 7.5 kg',
      '$2,495',
      '24 January 1984',
    ],
    // Parts in the device's own coordinates (780 × 755). The screen hole is
    // 80–700 × 149–564; the floppy slot's interior is 411–607 × 674–686.
    parts: [
      { id: 'screen', lines: ['9-inch screen', '512 × 342, black and white'], y: 330, left: 150, right: 630 },
      { id: 'floppy', lines: ['3.5-inch floppy drive', '400 KB'], y: 680, left: 418, right: 600 },
    ],
  },
  2: {
    number: 'IA.1995.03',
    object: ['Netscape Navigator, 1995'],
    data: [
      '1.0: 15 December 1994',
      '$39, free for education',
      'and non-profit use',
      'Most-used browser, 1995',
    ],
    parts: [
      { id: 'throbber', lines: ['Netscape logo', 'animates while loading'], find: '[class*="_netscapeLogo_"]' },
      { id: 'location', lines: ['Location', 'the page’s address'], find: '[class*="_addressInput_"]' },
    ],
  },
  3: {
    number: 'IA.2007.04',
    object: ['Apple iPhone, 2007'],
    data: [
      'Samsung ARM, 412 MHz',
      '128 MB memory',
      '115 × 61 × 11.6 mm, 135 g',
      '$499 (4 GB), $599 (8 GB)',
      '29 June 2007',
    ],
    parts: [
      { id: 'screen', lines: ['3.5-inch Multi-Touch screen', '320 × 480'], find: '[class*="_screen_"]' },
      { id: 'home', lines: ['Home button', 'the only button on the front'], find: '[class*="_homeBtn_"]' },
    ],
  },
  4: {
    number: 'IA.2016.05',
    object: ['Instagram for iOS, 2016'],
    data: [
      'Launched 6 October 2010',
      '400 million users, Sept 2015',
      'Ranked feed announced',
      '15 March 2016',
    ],
    parts: [
      { id: 'header', lines: ['Blue header', 'white from 11 May 2016'], find: '.feedNavBar' },
      { id: 'like', lines: ['Like', 'tap, or double-tap the photo'], find: 'button[aria-label="Like"], button[aria-label="Unlike"]' },
    ],
  },
  5: {
    number: 'IA.2023.06',
    // the genre, not a product: the exhibit is Claude-inspired but unnamed
    object: ['AI chat assistant, 2023'],
    data: [
      'ChatGPT: 30 November 2022',
      'Claude: 14 March 2023',
    ],
    parts: [
      { id: 'input', lines: ['Message box', 'ask in plain language'], find: 'input[placeholder]' },
      { id: 'reply', lines: ['Reply', 'written by the model'], find: '[class*="_assistantContent_"]' },
    ],
  },
}
