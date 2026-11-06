# Level 4 feed photo sources

Every image here is a real photo posted on Instagram in the blue-header era (2015 to 2016),
either cropped from period screenshots or pulled from Instagram's own archived blog. Not my photos; used for a non-commercial portfolio piece.
Source screenshots live in `docs/reference/`.

| File | Source | Original account / context |
| --- | --- | --- |
| `avatar-studio-light.jpg` | `docs/reference/instagram4.png`, grid row 1 col 3 | @tophersaranghelo profile, c. 2015 |
| `avatar-nadia-s.jpg` | `instagram4.png`, row 1 col 2 | @tophersaranghelo |
| `avatar-city-frames.jpg` | `instagram4.png`, row 2 col 2 | @tophersaranghelo |
| `avatar-bakes-and-more.jpg` | `instagram4.png`, row 2 col 3 | @tophersaranghelo |
| `avatar-outdoor-vibes.jpg` | `instagram4.png`, row 3 col 2 | @tophersaranghelo |
| `avatar-marcus-h.jpg` | `docs/reference/instagram5.png`, profile picture | @kgonzalezrice profile, c. 2015 |
| `avatar-julia-creates.jpg` | `instagram5.png`, row 1 col 1 | @kgonzalezrice |
| `avatar-mike-film.jpg` | `instagram5.png`, row 2 col 1 | @kgonzalezrice |
| `avatar-home-spaces.jpg` | `instagram5.png`, row 2 col 2 | @kgonzalezrice |
| `avatar-lens-folk.jpg` | `instagram5.png`, row 2 col 3 | @kgonzalezrice |
| `period/post-tieks-dog.jpg` (528px) | `docs/reference/instagram1.jpeg` | @tieks sponsored post, Instagram ad launch marketing, 2015 |
| `period/post-golden-gate.jpg` (250×141) | `docs/reference/instagram2.jpeg` | @ashleyyuki, Instagram landscape/portrait format announcement, Aug 2015 |
| `period/post-palm-trees.jpg` (250×289) | `instagram2.jpeg` | @johnbarnett, same announcement |

`period/` is not loaded by the feed (feedData.js only reads `assets/feed/*.jpg`). These are
candidates that don't match an existing slot; wiring one in means changing a `photo` filename
in feedData.js.

## From Instagram's blog (blog.instagram.com), via the Wayback Machine

Instagram's official blog featured community photos (1080 × 1080) in each post. These were
pulled from Wayback Machine captures of the blog. Post photos are resized to 750 × 750 and
avatars to 150 × 150. Three had Instagram's video icon in the corner, which was cropped off.
Most are from Jan–May 2016; a few food/home shots come from late-2016 Weekend Hashtag
Project posts (the photos themselves show no UI).

| File | Blog post | Archived image |
| --- | --- | --- |
| `post-marcus-studio.jpg` | Instagram blog (blog.instagram.com), April 20, 2016: “Transforming Old Apparel Into Something New with @yuki__fujisawa” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/8f1f27875a16a816d768c687b42bce57/tumblr_o5xrva05NN1r1thfzo3_1280.jpg` |
| `post-airbnb-cabin.jpg` | Instagram blog (blog.instagram.com), April 19, 2016: “Exploring Siberia’s Snowy Beauty with @ssazanovich” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/d177be9e13dc83af2f53ae576be8c0ee/tumblr_o5w8f6PBgd1r1thfzo5_1280.jpg` |
| `post-julia-ceramics.jpg` | Instagram blog (blog.instagram.com), April 10, 2016: “Inside @otntty’s Workshop: Finding Something Special in Simplicity” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/23ccb673c8f8ca2a8b9fa74dcf08c6d3/tumblr_o5fqscLWwF1r1thfzo2_1280.jpg` |
| `post-alex-lisbon.jpg` | Instagram blog (blog.instagram.com), March 28, 2016: “Roaming the Streets of Stuttgart and Heidelberg with @corasacher” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/96806b5814cd3b1f80e6a23600f83bb8/tumblr_o4r60jndNp1r1thfzo4_1280.jpg` |
| `post-sarah-coffee.jpg` | Instagram blog (blog.instagram.com), May 1, 2016: “Capturing Fairy-Tale Magic with Illustrator @liaselina” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/5bc00538bc0c3ac7784e8b5d5ab2f6f0/tumblr_o6ifm7oH6C1r1thfzo3_r1_1280.jpg` |
| `post-mike-35mm.jpg` | Instagram blog (blog.instagram.com), March 28, 2016: “Roaming the Streets of Stuttgart and Heidelberg with @corasacher” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/fd0241811b4eb84ed7f9c65d208a2272/tumblr_o4r60jndNp1r1thfzo5_1280.jpg` |
| `post-coffee-pour.jpg` | Instagram blog (blog.instagram.com), April 8, 2016: “Weekend Hashtag Project: #WHPlightandshadow” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/9e754473982dd0e49f7ac91168fb3da9/tumblr_o5c2g0hK3T1r1thfzo4_1280.jpg` |
| `post-outdoor-trail.jpg` | Instagram blog (blog.instagram.com), November 4, 2016: “Weekend Hashtag Project: #WHPescape” | `https://web.archive.org/web/2016id_/http://68.media.tumblr.com/8f8d4e6d1b4981551433f7d957484595/tumblr_og4ys66LOw1r1thfzo5_1280.jpg` |
| `post-studio-minimal.jpg` | Instagram blog (blog.instagram.com), April 9, 2016: “Exploring Mumbai’s Hidden Sanctuaries with @chefyash” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/9840a019ffbc38a8c7a7841667ff6a8e/tumblr_o5df2p5Vzn1r1thfzo1_r1_1280.jpg` |
| `post-city-geometry.jpg` | Instagram blog (blog.instagram.com), April 28, 2016: “A More Open Approach for the @sfmoma Expansion, Designed by @snohetta” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/77298f28fb1b99382e6c7199a1bbff8f/tumblr_o6d41cUodX1r1thfzo2_1280.jpg` |
| `post-bakes-sourdough.jpg` | Instagram blog (blog.instagram.com), November 21, 2016: “Weekend Hashtag Project: #WHPfamilyfeast” | `https://web.archive.org/web/2016id_/http://68.media.tumblr.com/cebd8ce6160427d30f53b6ebcf718a01/tumblr_oh0qhab4aX1r1thfzo3_1280.jpg` |
| `post-daniela-house.jpg` | Instagram blog (blog.instagram.com), November 25, 2016: “Weekend Hashtag Project: #WHPthisishome” | `https://web.archive.org/web/2016id_/http://68.media.tumblr.com/861e7f2137c97d05a1412ab10a5a76d6/tumblr_oh7w6uzn441r1thfzo1_1280.jpg` |
| `post-travel-santorini.jpg` | Instagram blog (blog.instagram.com), April 9, 2016: “The Week on Instagram | 230 News Stylist : “I quit my career in fashion to volun” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/2879d872604770d55f733679650ce86f/tumblr_o5dirqb4GN1r1thfzo1_1280.jpg` |
| `post-morning-run.jpg` | Instagram blog (blog.instagram.com), November 25, 2016: “Weekend Hashtag Project: #WHPthisishome” | `https://web.archive.org/web/2016id_/http://68.media.tumblr.com/be318a83cdccbbb19a2caf45db30f6af/tumblr_oh7w6uzn441r1thfzo4_1280.jpg` |
| `post-lens-analog.jpg` | Instagram blog (blog.instagram.com), May 1, 2016: “Backstage with Music Photographer Christopher Lee” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/2ddd63f4d210c68f175e2982b2b5e90c/tumblr_o6i8pnobbB1r1thfzo4_1280.jpg` |
| `post-home-books.jpg` | Instagram blog (blog.instagram.com), March 28, 2016: “Roaming the Streets of Stuttgart and Heidelberg with @corasacher” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/fecb59a587a3d8b3a1c2c5489c14caa0/tumblr_o4r60jndNp1r1thfzo1_1280.jpg` |
| `post-pnw-forest.jpg` | Instagram blog (blog.instagram.com), April 29, 2016: “Weekend Hashtag Project: #WHPdaydream” | `https://web.archive.org/web/2016id_/http://66.media.tumblr.com/917c70bfa1e93c048f8a3b645ba07957/tumblr_o6evyy5jCR1r1thfzo5_1280.jpg` |
| `avatar-daniela-reyes.jpg` | Instagram blog (blog.instagram.com), April 6, 2016: “Learning to Love Everything You Are with Body-Positivity Activist @mayaraefe “# ” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/b6576994712baa47a2e05c0a61090220/tumblr_o58dooP5eA1r1thfzo3_1280.jpg` |
| `avatar-j-okafor.jpg` | Instagram blog (blog.instagram.com), May 1, 2016: “Backstage with Music Photographer Christopher Lee” | `https://web.archive.org/web/2016id_/http://66.media.tumblr.com/bb77197fd2e74c963531735f03e8b15a/tumblr_o6i8pnobbB1r1thfzo3_1280.jpg` |
| `avatar-mia-c.jpg` | Instagram blog (blog.instagram.com), May 1, 2016: “Backstage with Music Photographer Christopher Lee” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/01a1ec50d4eab5c6b0c86b128ad34941/tumblr_o6i8pnobbB1r1thfzo5_1280.jpg` |
| `avatar-sunrise.jpg` | Instagram blog (blog.instagram.com), April 9, 2016: “Exploring Mumbai’s Hidden Sanctuaries with @chefyash” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/7eb335e13aa960656535d15525a7df70/tumblr_o5df2p5Vzn1r1thfzo2_r1_1280.jpg` |
| `avatar-cafe-list.jpg` | Instagram blog (blog.instagram.com), February 8, 2016: “Weekend Hashtag Project: #WHPvibrant” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/4ff0c5c2bd15289de355cc6df89d723f/tumblr_o290fpjuqW1r1thfzo4_1280.jpg` |
| `avatar-pete-photo.jpg` | Instagram blog (blog.instagram.com), March 28, 2016: “Weekend Hashtag Project: #WHPexpressions” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/127df240bc313c05eedcfe0209ecc4b5/tumblr_o4rqxhvBbA1r1thfzo5_1280.jpg` |
| `avatar-lena-out.jpg` | Instagram blog (blog.instagram.com), April 19, 2016: “Exploring Siberia’s Snowy Beauty with @ssazanovich” | `https://web.archive.org/web/2016id_/http://36.media.tumblr.com/ee4aa3e5bcb192b1bb61a0e5119c845d/tumblr_o5w8f6PBgd1r1thfzo2_1280.jpg` |
| `avatar-alex-wanderer.jpg` | Instagram blog (blog.instagram.com), April 18, 2016: “Weekend Hashtag Project: #WHPonthego” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/f36115d35675ea4567d18df349b30f66/tumblr_o5uowoqKFP1r1thfzo2_1280.jpg` |
| `avatar-sarah-moments.jpg` | Instagram blog (blog.instagram.com), April 20, 2016: “Dreaming of a More Inclusive World with @la_mayte” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/20652e431c86ac7a4257ee3f58eaac4b/tumblr_o5yanzOM511r1thfzo2_1280.jpg` |
| `avatar-coffee-culture.jpg` | Instagram blog (blog.instagram.com), April 10, 2016: “Inside @otntty’s Workshop: Finding Something Special in Simplicity” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/43bca31db2f553e5dc1df9031dfc3625/tumblr_o5fqscLWwF1r1thfzo1_1280.jpg` |
| `avatar-travel-tales.jpg` | Instagram blog (blog.instagram.com), April 19, 2016: “Exploring Siberia’s Snowy Beauty with @ssazanovich” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/17a2a686726ed5d69c9146e41e24b352/tumblr_o5w8f6PBgd1r1thfzo3_1280.jpg` |
| `avatar-morning-run.jpg` | Instagram blog (blog.instagram.com), January 22, 2016: “Weekend Hashtag Project: #WHPsplitsecond” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/82089b25e705e26152772488cd8420cc/tumblr_o1dlfzRw9W1r1thfzo2_1280.jpg` |
| `avatar-pnw-shots.jpg` | Instagram blog (blog.instagram.com), March 19, 2016: “Capturing the ‘Tiny Moments’ of Life with Electronic Producer Kyson” | `https://web.archive.org/web/2016id_/http://40.media.tumblr.com/839b1c988d70d3645c90fe2b090fc0b5/tumblr_o4aj2sXMLK1r1thfzo1_1280.jpg` |
| `avatar-travel-scope.jpg` | Instagram blog (blog.instagram.com), April 18, 2016: “Weekend Hashtag Project: #WHPonthego” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/ce406149125ed919db4fc3e73e261993/tumblr_o5uowoqKFP1r1thfzo5_1280.jpg` |
| `avatar-foodie-journal.jpg` | Instagram blog (blog.instagram.com), February 9, 2016: “Elevating Pasta to an Art with @lucacappuccinodonofrio” | `https://web.archive.org/web/2016id_/http://41.media.tumblr.com/5afccd4f0bf60b2143acec1a0d66786e/tumblr_o2awp8ECjy1r1thfzo5_1280.jpg` |

Still empty (fall back to color blocks): `post-warbyparker-frames.jpg`, and the logo avatars
`avatar-airbnb.jpg`, `avatar-warbyparker.jpg`, `avatar-natgeo.jpg`, `avatar-humansofny.jpg`.

## `library/` — real accounts from Instagram's blog, Jan–May 2016

348 photos from posts on Instagram's official blog, with archive.org sources in
`library/index.csv`. Loaded by `src/components/feed/libraryData.js`, which uses
only the accounts listed in its `ACCOUNTS` table and only photos dated on or
before 10 May 2016 (the day before the redesign). Excluded: later posts,
celebrities, crisis photojournalism, and a minor (reasons in libraryData.js).
Names and bios paraphrase each blog story; captions are written for the level.

Used in: 8 posts woven into the home feed, the Explore grid and trending tags,
real-account profiles, and activity thumbnails.

**Nov 2026 update.** The level no longer loads `explore/` or the top-level
`post-*.jpg` files (those were copies of library photos). Every photo comes
from `library/`, with one rule: nothing under 640px wide
(`src/components/feed/libraryQuality.js`). Invented friends each post from one
reserved photo set that matches their subject (`FRIEND_SETS` in
`libraryData.js`); reserved photos never appear under a real account.

## `archive/` — Wayback Machine captures of real profiles, spring 2016

Recovered by `scripts/recover-instagram-2016.py`: for each account, every
archived capture of its profile page between 1 March and 10 May 2016, with the
24 posts each capture showed (real captions, like and comment counts, dates)
and the archived photo files. `archive/<handle>/profile.json` records the
captures used and a `source` link to the archived page. Avatars not archived
fall back to `profiles/avatars/`. Gitignored; local only.
