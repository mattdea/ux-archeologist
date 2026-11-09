// src/components/NotesWindowContent.jsx
import MacScrollPane from './MacScrollPane'
import { useWindowFrame } from './windowFrame'
import styles from './NotesWindowContent.module.css'

const NOTES_TEXT = `Jan 25, 1984

Finally got the Macintosh set up on my desk today. Susan from accounting helped me carry the box up from the loading dock — it's heavier than it looks.

Spent about an hour just figuring out how to plug everything in. The manual is pretty clear though. When the little face came up on the screen and smiled at me, I laughed out loud. A computer that smiles at you. What a world.

The mouse is strange. I keep wanting to type commands like I do on the Apple II, but there's nothing to type into. You just... point at things and click. Took me twenty minutes to figure out how to open a folder. Double-click, not single-click. Nobody told me that.

Once I got it, though — I moved a document from one folder to another just by dragging it. My hand moved it. I didn't have to remember a single command. It just made sense.

The screen is small. Everything is black and white. But there's something about the way it works that feels different from every other computer I've used. Like it was made by someone who actually thought about me.

$2,495 is a lot of money. I hope the partners agree it was worth it.

— R.H.`

// One line of Monaco 12 at line-height 1.5: what an arrow click scrolls.
const LINE = 18

// The document scrolls only with its scroll bar (MacScrollPane): no wheel.
export default function NotesWindowContent() {
  const { active } = useWindowFrame()
  return (
    <div className={styles.viewport}>
      <MacScrollPane vertical horizontal={false} growBox={false} line={LINE} fillWidth active={active}>
        <div className={styles.content}>
          <pre className={styles.pre}>{NOTES_TEXT}</pre>
        </div>
      </MacScrollPane>
    </div>
  )
}
