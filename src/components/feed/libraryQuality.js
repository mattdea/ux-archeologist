// src/components/feed/libraryQuality.js
// Library photos that are never shown. Add a filename here to hide a photo
// without deleting it. (Photos under 640px wide were deleted from the folder
// in Nov 2026 rather than listed.)

export const SKIP = new Set([
  // November 2016 blog posts (#WHPescape, #WHPfamilyfeast, #WHPthisishome):
  // past the spring-2016 app the level depicts (feed audit, 9 Nov 2026)
  '2016-11-04_instagram_og4ys61.jpg',
  '2016-11-04_instagram_og4ys62.jpg',
  '2016-11-04_instagram_og4ys63.jpg',
  '2016-11-04_instagram_og4ys64.jpg',
  '2016-11-04_instagram_og4ys65.jpg',
  '2016-11-18_instagram_oguxw21.jpg',
  '2016-11-18_instagram_oguxw22.jpg',
  '2016-11-18_instagram_oguxw23.jpg',
  '2016-11-18_instagram_oguxw24.jpg',
  '2016-11-18_instagram_oguxw25.jpg',
  '2016-11-21_instagram_oh0qha1.jpg',
  '2016-11-21_instagram_oh0qha2.jpg',
  '2016-11-25_instagram_oh7w6u1.jpg',
  '2016-11-25_instagram_oh7w6u2.jpg',
  '2016-11-25_instagram_oh7w6u3.jpg',
  '2016-11-25_instagram_oh7w6u4.jpg',
  '2016-11-25_instagram_oh7w6u5.jpg',
  '2016-11-28_instagram_ohdn9y2.jpg',
  '2016-11-28_instagram_ohdn9y3.jpg',
  '2016-11-28_instagram_ohdn9y4.jpg',
  '2016-11-28_instagram_ohdn9y5.jpg',
  '2016-11-28_instagram_ohdn9y6.jpg',
  // Celebrity performers: the library leaves celebrities out (libraryData.js)
  '2016-04-09_p.hil_o5dh5t1.jpg',
  '2016-04-09_p.hil_o5dh5t2.jpg',
  '2016-04-09_p.hil_o5dh5t3.jpg',
  '2016-04-09_p.hil_o5dh5t5.jpg',
])
