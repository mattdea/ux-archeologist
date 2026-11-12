import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// findBy* and waitFor give up after 1s by default. Many Level 1 steps take
// about that long on their own (menu blink, zoom rectangles, drive light), so
// they failed whenever the suite ran in parallel on a busy machine.
configure({ asyncUtilTimeout: 3000 })

// The dev server opens on the Index museum (museumStyle.js); the suite was
// written against Classic, so every file starts there and opts in to the
// Index where it tests it.
import { setMuseumStyle } from '../shared/museumStyle'
setMuseumStyle('classic')
