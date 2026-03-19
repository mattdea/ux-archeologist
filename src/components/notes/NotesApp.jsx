// src/components/notes/NotesApp.jsx
//
// Manages the Notes app's internal navigation:
//   notesScreen: 'list' | 'detail'
//   selectedNoteId: 0 | 1 | 2 | null
//
// The slide transition is CSS-driven: both screens are always mounted
// and slide in/out via transform. This avoids remount flicker.

import { useState, useCallback } from 'react'
import styles from './NotesApp.module.css'
import NotesListView from './NotesListView'
import NoteDetailView from './NoteDetailView'
import StatusBar from '../phone/StatusBar'

// ── Note content ─────────────────────────────────────────────────────────────
export const NOTES = [
  {
    id: 0,
    title: 'Party playlist - Saturday',
    date: '9:41 AM',
    headerLabel: 'Today',
    headerDate: 'Jul 2  9:41 AM',
    content: [
      'Party playlist - Saturday',
      '',
      'Umbrella - Rihanna',
      'Stronger - Kanye West',
      'Glamorous - Fergie',
      'Makes Me Wonder - Maroon 5',
      "Hey There Delilah - Plain White T's",
      'Rehab - Amy Winehouse',
      "Big Girls Don't Cry - Fergie",
      'Buy U a Drank - T-Pain',
      'The Sweet Escape - Gwen Stefani',
      "Cupid's Chokehold - Gym Class Heroes",
      'What Goes Around - Justin Timberlake',
      '',
      'Ask Mike if he has speakers',
    ],
  },
  {
    id: 1,
    title: 'Book list',
    date: 'Yesterday',
    headerLabel: 'Yesterday',
    headerDate: 'Jul 1  3:22 PM',
    content: [
      'Book list',
      '- The Road (Cormac McCarthy)',
      '- Freakonomics',
      '- A Thousand Splendid Suns',
      '- Harry Potter 7 comes out',
      '  July 21!!',
      '- Return library books by Friday',
    ],
  },
  {
    id: 2,
    title: 'Grocery list - 4th of July',
    date: 'Jun 30, 2007',
    headerLabel: 'Jun 30, 2007',
    headerDate: 'Jun 30  5:15 PM',
    content: [
      'Grocery list - 4th of July',
      '- Hot dogs and buns',
      '- Ground beef for burgers',
      '- Cheddar cheese slices',
      '- Corn on the cob (6)',
      '- Watermelon',
      '- Potato salad from deli',
      '- Chips and salsa',
      '- Lemonade mix',
      '- Ice (2 bags)',
      '- Charcoal',
      '- Paper plates + napkins',
      '- Bug spray',
    ],
  },
]

export default function NotesApp({ onNoteOpen }) {
  const [notesScreen, setNotesScreen] = useState('list')
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  const handleNoteSelect = useCallback((id) => {
    setSelectedNoteId(id)
    setNotesScreen('detail')
    onNoteOpen?.()
  }, [onNoteOpen])

  const handleBack = useCallback(() => {
    setNotesScreen('list')
  }, [])

  const onList = notesScreen === 'list'
  const selectedNote = NOTES.find((n) => n.id === selectedNoteId) ?? NOTES[0]

  return (
    <div className={styles.notesApp}>
      {/* Status bar — fixed above the transition layer, never animates */}
      <StatusBar variant="dark" />

      {/* Transition container — screens slide within this */}
      <div className={styles.transitionContainer}>
        {/* List screen — at x:0 when visible, x:-100% when detail is showing */}
        <div
          className={styles.screen}
          style={{ transform: onList ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <NotesListView notes={NOTES} onNoteSelect={handleNoteSelect} />
        </div>

        {/* Detail screen — at x:100% when hidden, x:0 when visible */}
        <div
          className={styles.screen}
          style={{ transform: onList ? 'translateX(100%)' : 'translateX(0)' }}
        >
          <NoteDetailView note={selectedNote} onBack={handleBack} />
        </div>
      </div>
    </div>
  )
}
