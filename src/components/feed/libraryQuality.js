// src/components/feed/libraryQuality.js
// The one quality rule for assets/feed/library: photos under 640px wide are
// too soft for the 375pt-wide screen and are never shown. The ones that failed
// it were deleted from the folder in Nov 2026, so the list is empty; add a
// filename here to hide a photo without deleting it.

export const SKIP = new Set([
])
