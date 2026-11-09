// src/components/WindowScrollArea.jsx
//
// The scrolling part of a Finder window, below its information line: a
// MacScrollPane with both bars and the grow box, wired to the window frame.
// Fills the rest of the window. Icons keep their places and never reflow
// (the Finder remembered where each one was), so a smaller window scrolls.

import MacScrollPane from './MacScrollPane'
import { useWindowFrame } from './windowFrame'
import styles from './DraggableWindow.module.css'

export default function WindowScrollArea({ children }) {
  const { active, resizable, onGrowMouseDown } = useWindowFrame()
  return (
    <div className={styles.scrollArea}>
      <MacScrollPane active={active} growBox={resizable} onGrowMouseDown={onGrowMouseDown} line={16}>
        {children}
      </MacScrollPane>
    </div>
  )
}
