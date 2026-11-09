// src/components/apps/FontMover.jsx
//
// Font Mover, from the Infinite Mac System Disk's Utilities folder: its one
// screen, traced whole from docs/reference/mac system 1/macsystem100036.png
// (assets/mac/apps/fontmover.png, 512 × 342 with its empty menu bar). Only
// Quit works, back to the Finder; Help beeps, and moving fonts between the
// System file and the Fonts file isn't wired (Copy and Remove are dimmed
// until a font is chosen, as in the screenshot).
import art from '../../../assets/mac/apps/fontmover.png'
import { Btn } from './TeachText'
import * as sfx from '../../audio/sfx'
import styles from './apps.module.css'

export default function FontMover({ onQuit }) {
  return (
    <div className={styles.fontMover} style={{ backgroundImage: `url(${art})` }}
      onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Font Mover">
      <Btn x={212} y={91} w={88} label="Help" onPress={() => sfx.beep()} />
      <Btn x={212} y={187} w={88} label="Quit" onPress={onQuit} />
    </div>
  )
}
