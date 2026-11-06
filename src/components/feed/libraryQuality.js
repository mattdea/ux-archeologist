// src/components/feed/libraryQuality.js
// The one quality rule for assets/feed/library: photos under 640px wide are
// too soft for the 375pt-wide screen and are never shown. Everything else is
// an original Instagram blog photo and is used as is.

export const SKIP = new Set([
])
