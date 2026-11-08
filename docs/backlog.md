# Backlog

## Ideas

_Proposals only. Nothing is ever built from this section. Historical claims carry a source and a confidence level (high / medium / low)._

### Level 4: truncate long captions with "more" (requested 8 Nov 2026, pending history check)

**Request:** long captions in the feed are cut short with a "more" link that expands the full text in place, only if Instagram did this in spring 2016.

**Why it matters:** captions currently render in full. 1,075 of the 3,113 real captions in `assets/feed/archive/*/profile.json` exceed 125 characters, the longest 1,821 (voguemagazine), so a single post can run for screens.

**History, unconfirmed:**
- Today the mobile feed shows about 125 characters or 3 lines, then "… more". Confidence **medium** for today; the sources are third-party guides, not Instagram ([textcaret](https://textcaret.com/content/why-is-my-instagram-caption-cut-off), [solsocialmedia](https://www.solsocialmedia.com/post/instagram-caption-length)).
- That the spring-2016 iOS app (pre-May-2016 redesign) truncated feed captions with "… more": confidence **low**, still unsettled after a second search (8 Nov 2026). Every dated 2015–16 feed image found has a caption of three lines or fewer (≤ ~125 characters), shown in full, so none shows either behaviour. Checked:
  - Instagram's App Store page, Wayback snapshots Jan 2015 – Mar 2016 (v6.4.1 – v7.17.1): "What's New" notes never mention captions; the Mar 2016 screenshots show a one-line caption.
  - Instagram blog, 1 Sep 2015 Direct announcement (feed screenshot, one-line caption) and 15 Mar 2016 ranked-feed announcement (no screenshot).
  - business.instagram.com/advertising, Wayback 28 Feb 2016: sponsored-post mock-ups with captions up to three lines, shown in full.
  - `docs/reference/` screenshots: captions of one to two lines.
  - Web searches: only current-day guides, which disagree on today's cutoff (57–140 characters, or three lines) and give no start date.
- **To settle it:** a 2015–16 screenshot of the iOS feed with a caption longer than about three lines — your own camera-roll screenshots from then, a YouTube app walkthrough from late 2015 / early 2016, or the caption strings in an archived 7.x Android APK. Approve only if it shows truncation; if it shows the full caption, drop this.

**If confirmed:** match the period exactly — the cutoff (lines vs. characters), the ellipsis, the "more" colour and weight, and whether tapping expands in place or opens the post. Touch only `Post.jsx` and `feed-styles.css`.

## Approved

_Matthew moves items here from Ideas. Unattended runs build only from this list; ambiguous items are skipped with a note._

## Done

_Finished items, moved here when built._
