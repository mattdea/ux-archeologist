# Level 4 feed audit (accounts and photos)

Report written 9 Nov 2026 (report only). Fixes applied the same day: each finding now ends in its outcome, **fixed** · **kept** · **profile only** · **needs Matthew**. Several codes were misspelled here (l for I or the reverse); the outcome gives the real code.

Each finding is one line: `file path · problem · suggested fix · sure / check`.
**sure** means the problem is visible or measurable and the fix is clear. **check** means it needs Matthew's judgement: taste, how strict the museum should be, or a fact that wasn't confirmed.
Grid positions (`#n`) count from 0, newest first, the order a profile grid shows them. On a reshuffle the feed can open each real account on any of its three newest posts (`#0`–`#2`). Older pages then go further down each account, so every archived post can reach the home feed.

## Summary

### Findings by kind

Counted as report lines. One line can name several files of the same kind.

| Kind | Findings | sure | check |
| --- | --- | --- | --- |
| Unsuitable for a public portfolio (nudity, profanity, drugs, sensitive minors, partisan) | 29 | 5 | 24 |
| Duplicate photo (same image twice, in one grid or under two accounts) | 20 (covering 34 archive⇄library pairs plus 5 more) | 16 | 4 |
| Photo doesn't fit the account (off-topic, another person) | 10 | 0 | 10 |
| Caption problem (cut off, empty, wrong photo, video caption on a still, generic) | 15 | 3 | 12 |
| Broken- or blank-looking image | 8 | 4 | 4 |
| Too small or soft (mostly under 500 px) | 12 | 6 | 6 |
| Bad crop in the square frame (cut text or subject, letterbox bands) | 12 | 7 | 5 |
| Profile oddity (missing or blank avatar, odd avatar, near-empty grid) | 8 | 3 | 5 |
| Dated past spring 2016 | 5 | 3 | 2 |
| **Total** | **119** | **47** | **72** |

The duplicates come from one cause. @instagram's real 2016 grid (`archive/instagram/`) reposted many of the same blog photos that `library/` hands out to other accounts. The script found 34 exact or near-exact pairs. Some of those photos also sit under invented friends and as commenter avatars.

### The 10 most important fixes

1. **Remove the nude and near-nude posts.** `archive/kimkardashian/BCroouZuSzw.jpg`, `BCpQBQROSS1.jpg`; `archive/justinbieber/BDcArURAvtC.jpg` ("Dat ass doe"); `archive/cristiano/added-cr7-10.jpg` (GQ Body Issue cover). All four can reach the home feed. (sure)
2. **Fix the Warby Parker ad.** It uses `archive/warbyparker/BD6dadaS8s_.jpg` with the caption "Fall frames are here". In a spring 2016 feed that's out of season, and the same photo carries its real Snapchat caption in the profile. Pin a spring product shot (`BDL3YUuy8pA` or `BCyFzVAS8kK`) and recaption it "Spring frames…". (sure)
3. **Take the 34 @instagram/library duplicates out of the friends' and real accounts' grids.** Start with julia.creates' own `library/2016-03-10_jadeantoine_o3twv75.jpg`: @instagram's grid credits it to the real artist (`archive/instagram/BCx0-z2hQeL.jpg`). Next is marcus.h's `christian_foto_o5bk1v5`. The simplest rule is to treat every library file reposted in the archive as owned by @instagram and exclude it from library dealing. (sure)
4. **Hide the 22 November 2016 @instagram library photos** (`library/2016-11-*_instagram_*.jpg`: Thanksgiving tables, #WHPescape, #WHPthisishome). Add them to `SKIP` in `libraryQuality.js`. They show in Explore. (sure)
5. **Replace the four friend and commenter avatars that are photos shown elsewhere.** `friends/avatars/sarah.moments.jpg`, `pete.photo.jpg`, `j.okafor.jpg`, `mia.c.jpg`. Three of them show real, identifiable people. (sure)
6. **Remove the broken-looking stills.** `archive/9gag/BDqJtqVjJ5b.jpg` (grey loading square), `archive/instagram/BDi3QxTBQWd.jpg` ("VIDEO ON Instagram" card), `archive/kimkardashian/BCyEALRuS6X.jpg` (near-black), `archive/justinbieber/BDbnw7lAvj8.jpg` (letterbox bars). (sure)
7. **Finish the cut-off captions.** These are the natgeo captions cut at 80 characters, starting with the feed lead `BDzzJzpIVX5` ("…a mother from"), plus Vogue `BCsunMDP65V` and Selena `BDWlpPeujBe`. Restore the full text from the post links, or end each on "…". (sure)
8. **Give @theellenshow an avatar.** It's in the home feed, slot 23, and shows a bare initial. Do the same for @symmetrybreakfast, and replace the blank pink `archive-avatars/glossier.jpg`. (sure)
9. **Replace the tiny photos that can open the feed.** `archive/kimkardashian/BEV_UCDuS3u.jpg` and `archive/leomessi/BEg3-TgvM0t.jpg` are 320×320, and `archive/neymarjr/BE_erv4RthG.jpg` (480×480) is Neymar's feed lead. (sure)
10. **Decide how strict to be on the "check" list.** That means Rihanna's and Gigi Hadid's implied-nudity magazine shots, profanity in Katy Perry, Kevin Hart and Humans of New York captions, the 4/20 BuzzFeed posts, and the ill children in The Rock's and Neymar's grids. Matthew's call. (check)

## FEED accounts (home feed order)

### kimkardashian (archive, slot 1)
- `archive/kimkardashian/BCroouZuSzw.jpg` · [unsuitable] nude, arms covering ("#liberated") · remove · sure → **fixed** (removed)
- `archive/kimkardashian/BCpQBQROSS1.jpg` · [unsuitable] nude mirror selfie with censor bars ("nothing to wear LOL"), also 480×480 · remove · sure → **fixed** (removed; real code BCpQBQROS5l)
- `archive/kimkardashian/BCyEALRuS6X.jpg` · [broken] video still that is almost all black, 7 KB · remove · sure → **fixed** (removed)
- `archive/kimkardashian/BDCALBCOSy9.jpg` · [crop] 640×360 video still; the square crop shows a wall, a hand and a "La La Anth…" lower third · remove or replace · sure → **fixed** (removed)
- `archive/kimkardashian/BEV_UCDuS3u.jpg` · [small] 320×320, one of the three posts the feed can open on · replace with a larger copy or remove · sure → **needs Matthew** (no larger copy found; removed)
- `archive/kimkardashian/BCitq5zOS8m.jpg` · [unsuitable] caption "Step up in this bitch like…." · recaption or remove · check → **kept**
- `archive/kimkardashian/BCgzo9POS6b.jpg`, `BCbnBOfuS-z.jpg`, `BCYJhaQOSzY.jpg` · [caption] video stills whose captions say "full video on my app" · accept (era-true) or recaption · check → **fixed** ("on my app" trimmed)

### marcus.h (invented friend, library set, slot 2)
- `library/2016-04-08_christian_foto_o5bk1v1.jpg` · [caption] lead photo is men in sombreros seen from behind, in flat light, under "Golden hour portraits. Some days the light just cooperates." · lead on `o5bk1v4` (girl on horse) or recaption · check → **fixed** (leads on o5bk1v4)
- `library/2016-04-08_christian_foto_o5bk1v5.jpg` · [duplicate] same photo as `archive/instagram/BD8ZIPuBQUs.jpg`, which credits Christian Rodriguez · replace in marcus.h's set · sure → **fixed** (@instagram owns it)
- `library/2016-03-28_instagram_o4rqxh4.jpg`, `library/2016-03-07_instagram_o3p27s5.jpg` · [duplicate] same as `archive/instagram/BDhHSQUhQe0.jpg` and `BCrKXu7hQSx.jpg` · stop lending these to the people pool · sure → **fixed** (@instagram owns them)
- `library/2016-04-20_la_mayte_o5yanz2.jpg` · [duplicate] the same photo is `friends/avatars/sarah.moments.jpg` · replace the avatar (see Avatars) · sure → **fixed** (new avatar)
- `src/components/feed/feedData.js` (`EXPLORE_CAPTIONS`) · [caption] non-lead posts get travel and summer lines ("summer is here ☀️ #startofsummer", "brb moving here") that don't fit a portrait photographer, and "summer is here" also jars in spring · give each friend a short caption list of their own · check → **fixed** (FRIEND_CAPTIONS)

### selenagomez (archive, slot 3)
- `archive/selenagomez/BEALzcXOjGc.jpg` · [caption] feed lead's caption is only "74 🙏🏽❤️" (her thanks for 74m followers), cryptic without context · accept or open on `#1` · check → **fixed** (never opens the slot (NO_LEAD))
- `archive/selenagomez/BDuFaGtOjIn.jpg`, `BDrHNrDOjE8.jpg`, `BDmXzZmujIt.jpg`, `BDchTJ8ujLt.jpg`, `BDZazNDOjOA.jpg` · [caption] empty captions (added by hand from POST-LINKS) · fill from the post links if they had text · check → **fixed** (four were empty in the original too; BDrHNrDOjE8 has no capture, needs Matthew)
- `archive/selenagomez/BDWlpPeujBe.jpg` · [caption] caption cut mid-word ("…song I ever wr…") · restore full caption · sure → **fixed** (restored from Wayback)
- `archive/selenagomez/BDURNbTOjDj.jpg` · [unsuitable] woman in underwear at a window (small in frame) · keep or remove · check → **profile only**

### cristiano (archive, slot 4)
- `archive/cristiano/added-cr7-10.jpg` · [unsuitable] GQ "Body Issue" cover with a nude woman wrapped around him; a magazine cover rather than his post · remove · sure → **kept**
- `archive/cristiano/added-cr7-10.jpg` · [date] that GQ cover belongs to the June/July 2016 issue, likely out after the 11 May redesign · remove (as above) · check → **kept**
- `archive/cristiano/added-cr7-05.jpg` · [duplicate] same handstand photo as his real post `BDllkx0hpVE.jpg` · remove `added-cr7-05` · sure → **fixed** (removed)
- `archive/cristiano/added-cr7-09.jpg` (513×640), `added-cr7-11.jpg` (769×513) · [unsuitable] underwear studio shot and CR7 Underwear ad, both soft · keep or swap for other supplied photos · check → **kept**

### airbnb (sponsored, slot 5)
- `ads/airbnb-ad.jpg` · ad photo and poster type fit · nothing found
- `archive/airbnb/` (profile) · nothing found, apart from `BC6Z7VKS5uv.jpg` and `BC1LtfMS5lj.jpg` at 593 px wide (soft, acceptable)

### justinbieber (archive, slot 6)
- `archive/justinbieber/BDcArURAvtC.jpg` · [unsuitable] nude man from behind at a lake, caption "Dat ass doe" · remove · sure → **fixed** (removed)
- `archive/justinbieber/BDbnw7lAvj8.jpg` · [broken] thick black letterbox bars around a thin strip, no caption; reads as a failed load · remove · sure → **fixed** (removed; real code BDbnw7IAvj8)
- `archive/justinbieber/BDRC3n8gvvp.jpg` · [crop] 1080×615; the square crop shows an empty sofa with people cut off at both edges · remove or recrop · sure → **fixed** (removed)

### julia.creates (invented friend, library set, slot 7)
- `library/2016-03-10_jadeantoine_o3twv75.jpg` · [duplicate] julia's "own work" is `archive/instagram/BCx0-z2hQeL.jpg`, whose caption names the real artist @jadeantoine · drop it from her set · sure → **fixed** (@instagram owns it)
- `library/2016-04-06_8bithiphop_o5838z3.jpg` · [off-topic] plain "Compton" cap on black; not a painting or illustration · move to another pool · check → **fixed** (moved to the community pool (@instagram))
- `library/2016-03-27_esposin_o4pcon5.jpg` · [off-topic] rabbit-mask photograph in an illustrator's grid (the series repeats across four accounts, see Library) · move · check → **fixed** (moved to the community pool (@instagram))
- `src/components/feed/feedData.js` (`EXPLORE_CAPTIONS`) · [caption] non-lead posts are captioned "views for days", "no filter needed #nofilter" and the like, under artwork · topic captions per friend · check → **fixed** (FRIEND_CAPTIONS)

### natgeo (archive, slot 8)
- `archive/natgeo/BDzzJzpIVX5.jpg` (feed lead), `BDyufxwIVS0.jpg`, `BDwla7DIVTG.jpg`, `BDwU-vIIVTA.jpg`, `BDvngD6oVXe.jpg`, `BDuNsrnIVSv.jpg`, `BDtuZYooVVi.jpg`, `BDqSm-qoVbJ.jpg` · [caption] captions cut at 80 characters stop mid-sentence with no ellipsis ("…a mother from", "Escape from North Korea video will be") · restore full text from the post links, or end on "…" · sure → **needs Matthew** (BDzzJzpIVX5 restored from Wayback; the other seven not found anywhere, end on …)
- `archive/natgeo/BCh9zT-IVR8.jpg` · [crop] video still letterboxed in white top and bottom; the photo is a thin strip · replace or recrop · sure → **fixed** (removed (a recrop would be under 300px))
- `archive/natgeo/BDy6rLWoVa2.jpg`, `BDwU-vIIVTA.jpg`, `BDqd_bDIVVL.jpg`, `BCYyIddoVSD.jpg` · [crop] black or white band baked into the file's edge · trim the bands · check → **fixed** (bands trimmed; real code BCYylddoVSD)

### kyliejenner (archive, slot 9)
- `archive/kyliejenner/BDzlV_BnGvs.jpg` · [unsuitable] Paper magazine shot, bare shoulders with hands over face (implied topless) · keep or remove · check → **profile only** (real code BDzIV_BnGvs)

### beyonce (archive, slot 10)
- `archive/beyonce/BCvlvAbPw0N.jpg` · [small] 320×399 · replace or remove · sure → **needs Matthew** (no larger copy found; removed)
- `archive/beyonce/BDnt9evPw5L.jpg` · [crop] 800×800 with white bands top and bottom; one of the three posts the feed can open on · trim or start elsewhere · check → **fixed** (bands trimmed)

### gigihadid (archive, slot 11)
- `archive/gigihadid/BBiTEemDCaK.jpg` · [unsuitable] Vogue Paris cover, topless with arms covering ("wearing mostly Chanel N°5") · remove · check → **profile only**
- `archive/gigihadid/BB2fgnNjCU-.jpg`, `BB6Itm_jCQ2.jpg`, `BCO1kMRDCVn.jpg` · [unsuitable] SI swimsuit spread, swimsuit shot (750×500, soft) and briefs editorial · keep or remove · check → **profile only**

### therock (archive, slot 12)
- `archive/therock/BC5gGzToh2Z.jpg`, `BCz9y_Joh-r.jpg` · [unsuitable] hospital visits to seriously ill children and a young man (real charity posts) · keep or remove · check → **fixed** (removed)
- `archive/therock/avatar.jpg` · [profile] circle already baked into a white square, so the round mask shows a ring with white corners · crop to the circle · check → **fixed** (cropped inside the circle)

### warbyparker (sponsored, slot 13)
- `archive/warbyparker/BD6dadaS8s_.jpg` (as used by the ad in `feedData.js`) · [date] ad caption "Fall frames are here. Try 5 pairs at home, free." in a spring 2016 feed · recaption "Spring frames are here…" · sure → **fixed** ("Spring frames are here…")
- `archive/warbyparker/BD6dadaS8s_.jpg` · [duplicate] the ad takes the archive's newest post, so one photo shows two different captions (ad copy in the feed, a Snapchat note in the profile) · point the ad at a product shot such as `BDL3YUuy8pA.jpg` ("Happy first day of spring!") or `BCyFzVAS8kK.jpg` (Spring Collection) · sure → **fixed** (ad runs on BDL3YUuy8pA)

### imani.brooks (invented friend, Unsplash set, slot 14)
- `friends/imani.brooks/grid-03.jpg`, `grid-08.jpg` · [duplicate] same model, wall, window and headpiece (standing and seated) in one grid · drop one or move them apart · check → **fixed** (grid-08 and grid-20 swapped (Matthew))
- everything else on-theme, all 750×750 · nothing else found

### leomessi (archive, slot 15)
- `archive/leomessi/BEg3-TgvM0t.jpg` · [small] 320×320, one of the three posts the feed can open on · replace or remove · sure → **needs Matthew** (no larger copy found; removed)
- `archive/leomessi/BEl5XXRPMxg.jpg` · [caption] feed lead is a video still of Messi talking to camera, captioned as a spoken message to Stephen Curry · accept, or open on `#2` · check → **fixed** (never opens the slot (NO_LEAD))

### sarah.moments (invented friend, library set, slot 16)
- `library/2016-04-07_phannapast_o5a8cd3.jpg` · [duplicate] same as `archive/instagram/BD6flHGBQXr.jpg` · drop from her set · sure → **fixed** (@instagram owns it)
- `library/2016-04-06_8bithiphop_o5838z1.jpg`, `o5838z5.jpg`, `library/2016-04-30_thecuadro_o6gskq1.jpg`, `library/2016-03-27_esposin_o4pcon1.jpg`, `o4pcon3.jpg` · [off-topic] pixel rapper, pixel drum machine, 1980s celebrity collage, rabbit-mask photos under "tea, sketchbooks, and quiet mornings" · move to another pool · check → **fixed** (moved to the community pool (@instagram))
- lead `library/2016-05-01_liaselina_o6ifm73.jpg` matches its caption · nothing else found

### nasa (archive, slot 17)
- nothing found

### kevinhart4real (archive, slot 18)
- `archive/kevinhart4real/BEeKDAVCYtt.jpg` · [off-topic] feed lead is a portrait of Prince (tribute caption), so the slot shows another man under Kevin Hart's name · open on `#1` · check → **fixed** (never opens the slot (NO_LEAD))
- `archive/kevinhart4real/BDL_7eyiYsX.jpg`, `BDN-kJeiYqS.jpg`, `BCLRbnSiYlB.jpg` · [unsuitable] captions with "#FuckDaysOff #ShitiCursedOnaSunday", "Motha Fu&$'s… legs ass", "can't really say shit" · recaption or remove · check → **kept**
- `archive/kevinhart4real/BB-n_LmCYuF.jpg` · [crop] video still with thick white bands top and bottom · remove or recrop · check → **fixed** (removed (a recrop would be ~360px))
- `archive/kevinhart4real/BCbvuDBiYjP.jpg`, `BCLRbnSiYlB.jpg` · [small] 480×480 · replace or accept · check → **needs Matthew** (no larger copies found; removed)

### instagram (archive grid, slot 19; library photos in Explore, see Library)
- `archive/instagram/BDi3QxTBQWd.jpg` · [broken] blurred "VIDEO ON Instagram" play-button card · remove · sure → **fixed** (removed)
- `archive/instagram/BDjxN75hQTF.jpg` · [broken] video still, near-black with one small cloud · remove · check → **fixed** (removed)
- `archive/instagram/BDRD2YJhQYx.jpg` · [broken] black square with a small heart (real Brussels tribute) reads as a missing image in a grid · keep or remove · check → **fixed** (removed)
- `archive/instagram/BD8ZIPuBQUs.jpg`, `BD6flHGBQXr.jpg`, `BD36LbNBQcN.jpg`, `BD9DWSNhQft.jpg`, `BDmbVroBQea.jpg`, `BDmSbrNBQfz.jpg`, `BDmLHeFhQTi.jpg`, `BDhHSQUhQe0.jpg`, `BDg9M1jBQdj.jpg`, `BDgFGwtBQdj.jpg`, `BDd0SkHBQSk.jpg`, `BDdf2PohQVZ.jpg`, `BDHSKiGBQft.jpg`, `BDHApNOBQfh.jpg`, `BDGUZhXBQRa.jpg`, `BDJkMSbBQbX.jpg`, `BCx0-z2hQeL.jpg`, `BCwvFNJhQRW.jpg`, `BCwVWcMBQXL.jpg`, `BCwOWn7BQb9.jpg`, `BCvPrIUhQU7.jpg`, `BCu0idfhQS0.jpg`, `BCrSbSahQQc.jpg`, `BCrKXu7hQSx.jpg`, `BCrDEGdhQYL.jpg`, `BCqwzhNhQYS.jpg` · [duplicate] each is also a `library/` photo shown under another account, a friend or the @instagram Explore set (pairs in Method) · keep these (they are the real @instagram posts) and exclude the library copies · sure → **fixed** (archive copies kept; library copies listed in REPOSTED_BY_INSTAGRAM)
- `archive/instagram/BDgMA8cBQek.jpg` · [unsuitable] features @filipbalos.art, whom `libraryData.js` deliberately leaves out as a minor · remove for consistency · check → **fixed** (removed)
- `archive/instagram/BERo0ybhQd3.jpg`, `BEMg_axBQaQ.jpg`, `BDzMcG3hQSD.jpg`, `BDrFGFthQe4.jpg`, `BDeIk6qBQRr.jpg`, `BCYFKfOBQUi.jpg`, `BCQWw9nhQTw.jpg` · [small] 640×360/426 video stills, soft (the first is one of the feed's three possible openers) · accept or replace · check → **needs Matthew** (no larger copies found; removed)
- `archive/instagram/BERo0ybhQd3.jpg`, `BD1U1rQBQfS.jpg`, `BDzMcG3hQSD.jpg`, `BDrFGFthQe4.jpg`, `BCYwZd6BQde.jpg`, `BCYwK9nhQdD.jpg`, `BCYv5NAhQcu.jpg`, `BCRH0EqBQWO.jpg` · [caption] video posts whose captions are about motion and sound ("cinemagraphs and video loops", "videos with interesting ambient sound"), shown as a still · accept (the level plays no video) or prefer photo posts near the top · check → **fixed** (never open the slot (NO_LEAD); four also removed as too small)

### badgalriri (archive, slot 20)
- `archive/badgalriri/BEbFNVlBM39.jpg` · [unsuitable] feed lead: sheer robe over lingerie · open on `#1` or keep · check → **profile only**
- `archive/badgalriri/BCg1hcdhMwt.jpg`, `BDEJX7AhM50.jpg`, `BDMDjlvhM80.jpg` · [unsuitable] British Vogue open coat with no top; Vogue sequin slip; Billboard tweet with a sheer bra top · keep or remove · check → **kept**
- `archive/badgalriri/BC77u1shMwW.jpg` · [small] 427×533 · replace or accept · check → **needs Matthew** (no larger copy found; removed)

### humansofny (archive, slot 21)
- `archive/humansofny/BCgWuaitrJz.jpg` · [small] 472×315 · replace or remove · sure → **needs Matthew** (no larger copy found; removed)
- `archive/humansofny/BCbc8bHtrPJ.jpg` · [unsuitable] caption "either selfish or autistic… But fuck the notes" · remove · check → **kept**
- `archive/humansofny/BCYPXYJtrAI.jpg` · [unsuitable] caption "weed bombs… Calm the fuck down" · remove · check → **kept**

### neymarjr (archive, slot 22)
- `archive/neymarjr/BE_erv4RthG.jpg` · [small] 480×480, the feed lead · replace or open on `#2` · sure → **needs Matthew** (no larger copy found; the slot opens on #2)
- `archive/neymarjr/BDyYjEgxtih.jpg` · [unsuitable] identifiable sick child in hospital holding a transplant-appeal sign (repost) · remove · check → **fixed** (removed)
- `archive/neymarjr/BDW4A5KRtnJ.jpg` · [crop] square crop shows empty pitch and a ball; Neymar is cut off at the right edge · remove or recrop · sure → **fixed** (recropped onto Neymar)
- `archive/neymarjr/BD6PL7Exto8.jpg` · [unsuitable] "@pokerstars" work repost (gambling ad) · keep or remove · check → **kept**

### theellenshow (archive, slot 23)
- `archive/theellenshow/profile.json` · [profile] no avatar (`profile_pic` is null and there is no `archive-avatars/theellenshow.jpg`), so the feed post shows a plain initial · add `archive-avatars/theellenshow.jpg` · sure → **fixed** (2016 avatar from Wayback)
- `archive/theellenshow/BDgbDB6tjFO.jpg` · [small] 480×441 · accept or replace · check → **needs Matthew** (no larger copy found; removed)

### 9gag (archive, slot 24)
- `archive/9gag/BDqJtqVjJ5b.jpg` · [broken] grey square with a reload arrow (a real April Fools "can't load" joke) looks like a failed image · remove · sure → **fixed** (removed)
- `archive/9gag/BDsTCqdDJ6E.jpg` · [crop] text meme cut at the left by the square crop ("oys be like:", "but I'n…"); one of the feed's three possible openers · remove · sure → **fixed** (removed)
- `archive/9gag/BDsgxhcDJxx.jpg` · [unsuitable] the feed post is an alcohol joke meme · keep or open on `#2` · check → **kept**
- `archive/9gag/` (all 20) · [small] every photo is 576–700 px wide (the archive kept small copies) · accept, or find larger copies · check → **needs Matthew** (no larger copies; kept (Matthew))

## Other accounts (profiles and Explore)

### Archive accounts not in the feed
- **arianagrande, everlane, mileycyrus, nickiminaj, taylorswift**: no post photos, so the level never shows them · nothing to fix
- **tieks**: `archive/tieks/` has 22 photos but no `profile.json`, so it never shows · nothing to fix (note only)
- **danielwellington, itsdougthepug, jiffpom, jlo, muradosmann, nala_cat, natgeotravel, nike, starbucks**: nothing found

### buzzfeed
- `archive/buzzfeed/BEeHRL7vktl.jpg` · [crop] 557×292 Prince quote; the square crop cuts the words ("A strong sp… transcend") · remove · sure → **fixed** (removed)
- `archive/buzzfeed/BEZUF69PkkB.jpg` · [broken] near-blank white Tumblr screenshot with tiny text ("take off all your clothes") · remove · check → **fixed** (removed)
- `archive/buzzfeed/BEb3Y1hPkqG.jpg`, `BEcVpL1Pki6.jpg` · [unsuitable] stoner comic ("happy 4/20 ayyee lmao") and 4:20 tweet ("it's lit") · remove · check → **kept**

### champagnepapi
- `archive/champagnepapi/BDZsT2NDQPD.jpg` · [unsuitable] Playboy-logo packets · keep or remove · check → **kept**
- `archive/champagnepapi/` · [profile] 2 photos against 2,771 claimed posts; the grid looks empty · hide accounts with fewer than ~6 photos from Explore, or accept · check → **fixed** (archive accounts under 6 photos stay out of Explore)

### chanelofficial
- `archive/chanelofficial/BCtQdTjAEhq.jpg` and 10 other posts · [date] caption "#ChanelFallWinter2017 #FrontRowOnly #PFW" reads as 2017 (it is the real March 2016 tag for the FW16/17 show) · accept as authentic, or trim the tag · check → **fixed** (tag trimmed from 15 posts)

### emmawatson
- `archive/emmawatson/BBclpwyn3AD.jpg`, `7BB_xzH3GS.jpg`, `7BB0-TH3F7.jpg` · [crop] @repostapp screenshots: a small photo inside a wide white frame · accept or remove · check → **fixed** (removed; real code BBcIpwyn3AD)
- `archive/emmawatson/BAhgjIIn3P1.jpg` · [small] 480×480 · accept or replace · check → **needs Matthew** (no larger copy found; removed)
- `archive/emmawatson/rK0Jx6n3DM.jpg` · [caption] photo of her bending in a street, captioned only with UN Women @-tags · accept or remove · check → **fixed** (removed)

### glossier
- `archive/glossier/` (all 11 posts, `BFujQhDPyRV` … `BFh_n8aPycd`) · [date] dated 18–22 May 2016, after the 11 May redesign the level depicts (the profile was captured 5 May; these were added from POST-LINKS) · replace with posts from before 11 May, or accept · sure → **kept** (no earlier photos archived; accepted (Matthew))
- `archive/glossier/BFsNtw4PyS_.jpg`, `BFnPERwPybU.jpg` · [caption] captions cut at 80 characters ("win Glossie…") · restore · check → **needs Matthew** (not archived; end on …)
- `archive-avatars/glossier.jpg` · [profile] a blank pale-pink square (std dev 0.003) · replace with the logo · sure → **kept** (Glossier really used this pink square in spring 2016 (Matthew))

### katyperry
- `archive/katyperry/BAbe8AAv-e_.jpg` · [unsuitable] caption "Hasn't had a single fuck to give for 95 years now" · recaption or remove · check → **kept**
- `archive/katyperry/BB-xDOKv-Xy.jpg` · [unsuitable] caption "…get k.o. from the universe n shit" · check → **kept**
- `archive/katyperry/BCs7zlcP-Qd.jpg`, `BCeu6QCP-di.jpg`, `BAqlCrSv-fn.jpg` · [unsuitable] Hillary Clinton campaign posts (real, partisan) · keep or remove · check → **kept**

### kendalljenner
- `archive/kendalljenner/` · [profile] 1 photo against 2,542 claimed posts · as champagnepapi · check → **fixed** (out of Explore)

### khloekardashian
- `archive/khloekardashian/BC6u7ebBRvG.jpg` · [crop] quote card with its text cut at the left edge ("so giving to others") · remove · sure → **fixed** (removed)

### nytimes
- `archive/nytimes/BDy44LXL2wo.jpg` · [unsuitable] caption covers a gang-rape court case (real news) · keep or remove · check → **kept**

### symmetrybreakfast
- `archive/symmetrybreakfast/profile.json` · [profile] no avatar (`profile_pic` null, no `archive-avatars` file) · add `archive-avatars/symmetrybreakfast.jpg` · sure → **needs Matthew** (only a 404 is archived; initial avatar)

### thefeedfeed
- `archive/thefeedfeed/BDx3nO0K8tF.jpg` · [small] 400×400 · replace or remove · sure → **needs Matthew** (no larger copy found; removed)

### victoriassecret
- `archive/victoriassecret/BETergNmIQF.jpg` · [unsuitable] lingerie ad · keep or remove · check → **profile only** (real code BETergNmlQF)
- `archive/victoriassecret/` · [profile] 2 photos against 3,526 claimed posts · as champagnepapi · check → **fixed** (out of Explore)

### voguemagazine
- `archive/voguemagazine/BCsunMDP65V.jpg` · [caption] caption cut mid-sentence ("…says @taylor_hill on the") · restore · sure → **needs Matthew** (not found anywhere; ends on …)

### zendaya
- `archive/zendaya/BCXGWDoJmCu.jpg` · [off-topic] a portrait of Leonardo DiCaprio under her name ("Bout damn time") · keep (caption explains) or remove · check → **fixed** (removed)

## Library accounts (profiles and Explore)

### instagram (library photos, shown in Explore under @instagram)
- `library/2016-11-04_instagram_og4ys6{1-5}.jpg`, `2016-11-18_instagram_oguxw2{1-5}.jpg`, `2016-11-21_instagram_oh0qha{1,2}.jpg`, `2016-11-25_instagram_oh7w6u{1-5}.jpg`, `2016-11-28_instagram_ohdn9y{2-6}.jpg` · [date] 22 photos from November 2016 blog posts (#WHPescape, #WHPfamilyfeast Thanksgiving tables, #WHPthisishome), past spring 2016 and outside the README's Jan–May range · add to `SKIP` in `libraryQuality.js` · sure → **fixed** (in SKIP)
- `library/2016-03-28_instagram_o4rqxh2.jpg`, `o4rqxh3.jpg`, `o4rqxh5.jpg`, `o4rqxh6.jpg`, `library/2016-03-07_instagram_o3p27s1.jpg`, `o3p27s2.jpg`, `o3p27s3.jpg`, `library/2016-04-06_mayaraefe_o58doo2.jpg`, `library/2016-03-19_mac_daddyy_o4b0vw2.jpg`, `library/2016-03-07_patmcgrathreal_o3ou6r5.jpg` · [duplicate] each is also in @instagram's archive grid, so Explore shows the same photo twice under @instagram with two different captions · exclude from library dealing · sure → **fixed** (listed in REPOSTED_BY_INSTAGRAM)
- `library/2016-05-01_honoluluchris_o6i8pn3.jpg`, `o6i8pn5.jpg` · [duplicate] the same photos are the j.okafor and mia.c avatars · replace the avatars · sure → **fixed** (new avatars)
- `library/2016-03-23_p.hil_o5dh5t1.jpg`, `o5dh5t2.jpg`, `o5dh5t3.jpg`, `o5dh5t5.jpg` · [off-topic] celebrity performers (e.g. Post Malone), against `libraryData.js`'s own rule of leaving celebrities out · move to `SKIP` · check → **fixed** (in SKIP)

### sfmoma
- `library/2016-03-27_esposin_o4pcon2.jpg`, `2016-03-18_paperfashion_o49dnh1.jpg`, `2016-03-28_corasacher_o4r60j2.jpg`, `2016-04-08_instagram_o5c2g02.jpg`, `2016-03-18_instagram_o4975s2.jpg` · [duplicate] same as `archive/instagram/BDdf2PohQVZ`, `BDHSKiGBQft`, `BDgFGwtBQdj`, `BD9DWSNhQft`, `BDHApNOBQfh` · exclude · sure → **fixed** (listed in REPOSTED_BY_INSTAGRAM)
- `library/` extras in its grid (`richardahnert_*`, `thecuadro_o6gskq2`, `hombre_mcsteez_o47b7v5`, `corasacher_*`, `instagram_o290fp3` Mumbai Pride march) · [off-topic] the museum's grid is 20 of 24 other people's paintings and street photos · cap extras lower, or keep extras to "art" · check → **kept** (Matthew)

### otntty
- `library/2016-03-27_wolfordroger_o4pd3x3.jpg` · [duplicate] same as `archive/instagram/BDd0SkHBQSk.jpg` · exclude · sure → **fixed** (listed in REPOSTED_BY_INSTAGRAM)
- `library/2016-04-06_8bithiphop_o5838z2.jpg`, `o5838z4.jpg`, `o5838z6.jpg`, `library/2016-05-06_thejoshuatreehouse_o6s3ju{2-5}.jpg` · [off-topic] 8-bit sneakers, a pixel rapper portrait and a Joshua Tree rental (woman in hammock) under a potter's "simple things, made by hand" · move to other pools · check → **fixed** (moved to the community pool (@instagram))

### theoregonduck
- `library/2016-03-18_theoregonduck_o48lze2.jpg`, `2016-03-07_instagram_o3p27s4.jpg`, `o3p27s6.jpg` · [duplicate] same as `archive/instagram/BDGUZhXBQRa`, `BCwOWn7BQb9`, `BCwvFNJhQRW` · exclude the two lent photos (the own photo can stay if the archive copy wins) · sure → **fixed** (all three listed, the own photo too, by the reposts rule)
- extras (`la_mayte_*`, `ericunderwood_*`, `kuraevaolga_*`, `jameslenger_*`, `instagram_o3p27s*`) · [off-topic] a university mascot's grid is mostly strangers' children, ballet dancers, fencers and elderly chess players · trim to sport · check → **fixed** (draws on sport only)
- `library/2016-03-29_ericunderwood_o4tk703.jpg`, `o4tk705.jpg` · [caption] Instagram's camcorder badge is baked into these stills · accept or crop out · check → **fixed** (badge cropped out)

### acacia.johnson
- `library/2016-03-09_acacia.johnson_o3s4a31.jpg` · [duplicate] her avatar and first photo is also `archive/instagram/BCvPrIUhQU7.jpg` · keep (it is hers) but expect it twice in Explore · check → **fixed** (by the reposts rule it belongs to @instagram)
- `library/2016-03-09_instagram_o3rsqu4.jpg` · [duplicate] same as `archive/instagram/BCu0idfhQS0.jpg` · exclude · sure → **fixed** (listed in REPOSTED_BY_INSTAGRAM)
- `library/2016-03-09_acacia.johnson_o3s4a33.jpg` · [broken] grey, blurred reflection that reads as a failed photo · check → **kept** (Matthew)
- `library/2016-05-09_instagram_o6xlga3.jpg`, `2016-03-09_instagram_o3rsqu2.jpg` · [off-topic] beach human tower and jumping friends under a polar photographer · check → **fixed** (now @instagram's own)

### hummingbirdsxoxo
- `library/2016-04-17_hummingbirdsxoxo_o5so7x2.jpg` · [duplicate] another frame of the same feeder scene as `archive/instagram/BCRH0EqBQWO.jpg`, with a camcorder badge baked in · keep (own) or lead with `o5so7x4` · check → **fixed** (leads on o5so7x4)
- `library/2016-04-19_ssazanovich_o5w8f6{1,2,4}.jpg`, `o5w8f63.jpg`, `2016-04-29_instagram_o6evyy5.jpg`, `2016-03-30_pondlife_pondlife_o4ua3u5.jpg` · [off-topic] Siberian winter lifestyle (reindeer, ship in ice, skates), a piano by a lake and a microscope slide under a backyard-bird account · move · check → **fixed** (Siberian set to acacia.johnson, the rest to @instagram)

### Across library accounts
- `library/2016-03-27_esposin_o4pcon{1-5}.jpg` · [duplicate] one rabbit-mask series is dealt to sfmoma, julia.creates, sarah.moments and otntty, and is also `archive/instagram/BDdf2PohQVZ.jpg`, so the motif recurs under five names · keep the series in one place · check → **fixed** (whole series in the community pool (@instagram))
- `src/components/feed/feedData.js` (`libraryPost`) · [caption] library captions and likes are chosen by hashing the built asset URL, so they differ between `npm run dev` and the public build and change when a file is re-encoded · hash the file name instead · check → **fixed** (hashes the file name)

## Avatars

- `friends/avatars/sarah.moments.jpg` · [duplicate] same photo as `library/2016-04-20_la_mayte_o5yanz2.jpg` in marcus.h's grid · replace · sure → **fixed** (Unsplash avatar)
- `friends/avatars/pete.photo.jpg` · [duplicate] same as `archive/instagram/BDmSbrNBQfz.jpg` and `library/2016-03-28_instagram_o4rqxh5.jpg` · replace · sure → **fixed** (Unsplash avatar)
- `friends/avatars/j.okafor.jpg`, `friends/avatars/mia.c.jpg` · [unsuitable] real, identifiable people from @honoluluchris's photos standing in for invented commenters, and the same photos show in Explore · replace with neutral or licensed images · sure → **fixed** (Unsplash avatars)
- `friends/avatars/nadia_s.jpg` · [crop] 150×150 crop shows a hat brim and hair, face cut off below the eyes · recrop or replace · check → **fixed** (Unsplash avatar)
- `friends/avatars/samtaylor.jpg` · [profile] the player's own avatar shows two people · replace with a one-person crop · check → **fixed** (cropped to one person)
- `archive-avatars/selenagomez.jpg` · [unsuitable] black-and-white, bare chest and shoulders (her real avatar of the time) · accept · check → **kept**
- `archive-avatars/glossier.jpg`, missing `theellenshow` and `symmetrybreakfast` avatars · listed under those accounts → **fixed** (see those accounts)
- `archive-avatars/` (16 files: badgalriri, champagnepapi, emmawatson, humansofny, instagram, itsdougthepug, jlo, justinbieber, kendalljenner, khloekardashian, leomessi, muradosmann, nickiminaj, starbucks, taylorswift, therock) · copies of `archive/<handle>/avatar.jpg`, which wins, so they are never shown · nothing to fix (tidy only)
- `archive-avatars/instagram.jpg` / `archive/instagram/avatar.jpg` · the old camera icon is era-correct (pre-11 May 2016) · nothing found
- marcus.h, julia.creates, imani.brooks, airbnb, warbyparker avatars · nothing found

## Method

9 Nov 2026. Report only. No code, data or asset was changed. Scripts and contact sheets live in the session scratchpad, not the repo.

- **What the level shows:** a Node script rebuilt it from the code. It loaded `libraryData.js` with a stubbed `import.meta.glob` to get each library owner's grid in order, own photos first, then dealt extras. It applied `archiveData.js`'s rules to every `profile.json`: posts with a photo file, newest first. This gave 9 library owners, 46 archive accounts with photos, and one unused library file (`2016-04-19_ssazanovich_o5w8f65.jpg`, reserved for the Airbnb ad but superseded by `ads/airbnb-ad.jpg`).
- **File checks on all 1,386 in-scope images** (`archive/`, `archive-avatars/`, `library/`, `friends/`, `ads/`; `raw/` skipped): ImageMagick for width, height, mean and standard deviation; `md5` for exact duplicates; file size. Flags: shorter side under 640 px (150 for avatars), standard deviation under 0.06 (blank), aspect outside 0.79–1.27 (crop risk).
- **Near-duplicates:** each image was reduced to a 16×16 greyscale fingerprint, both of the whole image and of a centre square crop (as the level crops). Fingerprints were normalised and every pair compared, across all accounts, by mean absolute difference. 34 pairs scored ≤ 0.07, all confirmed identical by eye. The next pairs, at 0.18 and above, were checked and are different photos.
- **Captions:** scripted scans for captions cut by the POST-LINKS 80-character limit (natgeo 24, 9gag 20, glossier 11, kyliejenner 9, selenagomez 7, instagram 3, voguemagazine 2), empty captions, posts dated after 10 May 2016, video posts (50 `is_video` stills), and a word list for profanity, drugs and sensitive topics. Library data was checked against `index.csv`; the November 2016 rows were confirmed there.
- **Looking:** 70 labelled contact sheets of 220 px tiles, centre-cropped square as the level shows them. Each tile was labelled with grid position, post code or filename, size, date and the start of its caption. The sheets covered every archive grid, every library owner's grid, Imani's set, ads and friend avatars, and all archive avatars. I viewed every sheet with the Read tool and opened single images only to confirm (Cristiano's GQ cover, the friend avatars, the Glossier avatar, and the near-duplicate pairs).
- **Duplicate pairs** (archive ⇄ library, all exact): instagram `BCwvFNJhQRW`⇄`o3p27s6`, `BDd0SkHBQSk`⇄`wolfordroger_o4pd3x3`, `BDg9M1jBQdj`⇄`o4rqxh6`, `BDHSKiGBQft`⇄`paperfashion_o49dnh1`, `BDmLHeFhQTi`⇄`o4rqxh2`, `BCrKXu7hQSx`⇄`o3p27s5`, `BCqwzhNhQYS`⇄`patmcgrathreal_o3ou6r5`, `BD6flHGBQXr`⇄`phannapast_o5a8cd3`, `BD9DWSNhQft`⇄`o5c2g02`, `BDHApNOBQfh`⇄`o4975s2`, `BDmSbrNBQfz`⇄`o4rqxh5`⇄`pete.photo` avatar, `BCrSbSahQQc`⇄`o3p27s3`, `BD8ZIPuBQUs`⇄`christian_foto_o5bk1v5`, `BDGUZhXBQRa`⇄`theoregonduck_o48lze2`, `BCwVWcMBQXL`⇄`o3p27s2`, `BCu0idfhQS0`⇄`o3rsqu4`, `BCrDEGdhQYL`⇄`o3p27s1`, `BD36LbNBQcN`⇄`mayaraefe_o58doo2`, `BDgFGwtBQdj`⇄`corasacher_o4r60j2`, `BCwOWn7BQb9`⇄`o3p27s4`, `BCx0-z2hQeL`⇄`jadeantoine_o3twv75`, `BDdf2PohQVZ`⇄`esposin_o4pcon2`, `BDJkMSbBQbX`⇄`mac_daddyy_o4b0vw2`, `BDhHSQUhQe0`⇄`o4rqxh4`, `BCvPrIUhQU7`⇄`acacia.johnson_o3s4a31`, `BDmbVroBQea`⇄`o4rqxh3`. Also cristiano `BDllkx0hpVE`⇄`added-cr7-05`, `sarah.moments` avatar⇄`la_mayte_o5yanz2`, `j.okafor`⇄`honoluluchris_o6i8pn3`, `mia.c`⇄`honoluluchris_o6i8pn5`, and archive-avatars `warbyparker`/`champagnepapi` ⇄ their other copies.
- **Not judged as problems:** era-true content such as Snapchat and Periscope plugs, Twitter screenshots and real empty captions. Not checked: likes and follower counts against the real 2016 numbers (they come from the captures), and how the in-app font renders emoji.
