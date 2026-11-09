// src/components/projectFiles.js
//
// The three documents in the Projects folder: R.H. (who wrote Notes) getting
// ready to talk the partners into buying Macintoshes, the week the Mac came
// out. They open in TeachText. Each has something waiting at the bottom for
// whoever scrolls that far.
//
// Facts used, with sources and confidence (see docs/design-spec.md, Level 1):
//   Macintosh $2,495, MacWrite and MacPaint included (Apple press release,
//     24 Jan 1984) — high
//   External 400K drive $495, announced with the Mac, shipped May 1984 —
//     high (Datapro 11/1984; Macintosh External Disk Drive, Wikipedia)
//   ImageWriter $495 bought with a Mac, $595 alone (Datapro 11/1984) — medium
//   Multiplan for Macintosh $195 (Creative Computing, May 1984) — medium
//   Lisa 2 $3,495, announced Jan 1984; the first Lisa was $9,995 in 1983 —
//     high
//   "1984" ad during Super Bowl XVIII, Sunday 22 Jan 1984; Raiders 38,
//     Washington 9 — high
//   At the 24 Jan 1984 shareholders' meeting the Mac spoke: "Never trust a
//     computer you can't lift." — high
//   The Mac team's signatures are molded inside the case; opening it takes a
//     long Torx screwdriver — high
//   MacWrite 1.0 held the whole document in memory, so about ten pages on a
//     128K Mac — medium
//   Friday, 3 February 1984 (calendar) — high
// The firm, the people and the numbers they add up to are invented.

export const PROJECT_FILES = [
  {
    id: 'budget',
    label: 'Budget',
    text: `MACINTOSH PROPOSAL — WHAT IT COSTS
For the partners' meeting, Friday, February 3, 1984

Two Macintosh computers ($2,495 each)          $4,990
   keyboard, mouse, MacWrite and MacPaint included

One Imagewriter printer                          $495
   ($495 if bought with a Macintosh, $595 alone)

Two External Disk Drives ($495 each)             $990
   announced, but the dealer says not before spring

Microsoft Multiplan (spreadsheet)                $195

Diskettes, cables, ribbons (my guess)            $150
                                               ------
TOTAL                                          $6,820

For comparison:
   One Lisa 2, announced the same day              $3,495
   The first Lisa, last year                       $9,995

Savings we'd see:
   - No more retyping a whole page to fix one number.
   - Letters, budgets and drawings from the same machine.
   - Susan says she will learn it if it "has the little face."

Things the partners will ask:
   Q: Does it run Lotus 1-2-3?
   A: No. 1-2-3 is for the IBM. We'd use Multiplan.
   Q: Can it hold the annual report?
   A: Not in one piece. MacWrite keeps the whole document in
      memory, so about ten pages at a time on 128K.
   Q: Why not wait for a cheaper one?
   A: There is always a cheaper one coming.




















Note to self: don't tell them this budget was typed on the
Macintosh I'm asking them to buy. Let them find out.`,
  },
  {
    id: 'letter',
    label: 'Letter',
    text: `January 25, 1984

To:    The Partners
From:  R.H.
Re:    Buying Macintosh computers for the office

Dear partners,

If you watched the Super Bowl on Sunday, you probably saw it,
even if you didn't know what it was: the commercial with the
gray room, the face on the giant screen, and the woman with the
hammer. "On January 24th, Apple Computer will introduce
Macintosh. And you'll see why 1984 won't be like '1984.'"
Most of us were still talking about the Raiders beating
Washington 38 to 9.

Yesterday Apple introduced it, and this morning one arrived at
my desk. I am writing to ask that we buy two.

It is not like the computers you have been shown before. There
are no commands to learn. You move a small box on the desk
called a mouse, and an arrow on the screen moves with it. To
open something you point at it and press the button twice.
Everything is a picture of something you already know: paper,
folders, a trash can.

I'm told that when Mr. Jobs showed it to Apple's shareholders,
he took it out of a bag and it spoke for itself. Its first
words were, "Never trust a computer you can't lift." It weighs
about as much as a typewriter. Ours would not stay in one
office.

The cost is set out in the Budget, in this same folder. I'd
like ten minutes on Friday to show you, rather than tell you.
I promise to bring it upstairs myself.

Sincerely,

R.H.

cc: Susan (accounting)




















P.S. This letter has been rewritten four times this morning.
I did not retype it once.`,
  },
  {
    id: 'sketch',
    label: 'Sketch',
    text: `SKETCH — HOW TO RUN FRIDAY

Not a drawing. Just the order I'll do things in, because I
only get ten minutes and the partners only get one first
impression.

1. Have it already on. Let them see the little Macintosh
   smile while it starts up. Don't explain it.

2. Open Notes. Read them the first line. Close it again
   by clicking the little box in the corner of the window.

3. Hand the mouse to whoever looks most doubtful.
   Probably Walt. Let him drag something into the Trash.
   (Show him the Trash bulges when there is something in it,
   and that nothing is gone until "Empty Trash.")

4. The Apple menu, top left: the Calculator works like a
   real one. The Puzzle is there for the long phone calls.
   The Alarm Clock can be set to remind you about lunch.

5. Do NOT eject the disk in front of them. Ask me later.

6. End on the price. Then stop talking.

Things to remember:
   - Bring the box of disks.
   - Don't let anyone pull the plug "to see what happens."
   - Smile back at it.























You scrolled all the way down. Most people won't.

So here is the thing the dealer told me, which isn't in any
manual: the people who made this machine signed their names on
the inside of the case, molded right into the plastic, where
no customer is ever supposed to look. You'd need an extra-long
screwdriver to get in there, and Apple would rather you didn't.

Every one of these is signed by the people who built it, and
almost nobody will ever know.

I think that's why it feels the way it does.`,
  },
]
