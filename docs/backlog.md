# Backlog

## Ideas

_Proposals only. Nothing is ever built from this section. Historical claims carry a source and a confidence level (high / medium / low)._

### Level 4: truncate long captions with "more" (requested 8 Nov 2026, pending history check)

**Request:** long captions in the feed are cut short with a "more" link that expands the full text in place, only if Instagram did this in spring 2016.

**Why it matters:** captions currently render in full. 1,075 of the 3,113 real captions in `assets/feed/archive/*/profile.json` exceed 125 characters, the longest 1,821 (voguemagazine), so a single post can run for screens.

**History, unconfirmed:**
- Today the mobile feed shows about 125 characters or 3 lines, then "… more". Confidence **medium** for today; the sources are third-party guides, not Instagram ([textcaret](https://textcaret.com/content/why-is-my-instagram-caption-cut-off), [solsocialmedia](https://www.solsocialmedia.com/post/instagram-caption-length)).
- That the spring-2016 iOS app (pre-May-2016 redesign) truncated feed captions with "… more": confidence **low**. It rests on recollection only. No dated source was found, and none of the `docs/reference/` screenshots show a long caption either way.
- **To settle it:** find a dated screenshot or video of the iOS feed from late 2015 to spring 2016 showing a long caption (press coverage, YouTube app walkthroughs, Wayback Machine). Approve only if it shows truncation; if it shows full captions, drop this.

**If confirmed:** match the period exactly — the cutoff (lines vs. characters), the ellipsis, the "more" colour and weight, and whether tapping expands in place or opens the post. Touch only `Post.jsx` and `feed-styles.css`.

## Approved

_Matthew moves items here from Ideas. Unattended runs build only from this list; ambiguous items are skipped with a note._

## Done

_Finished items, moved here when built._
