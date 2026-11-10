// src/shared/museum/IntroModal.jsx
// The level's intro, in whichever museum is showing (src/shared/museumStyle.js).
// Classic: the card. Index: a few lines under the room's line in the list.
import Classic from '../museum-ui/IntroModal'
import { useMuseumStyle } from '../museumStyle'
import { usePublish } from '../index-museum/store'

function IndexIntro(props) {
  usePublish('intro', props)
  return null
}

export default function IntroModal(props) {
  return useMuseumStyle() === 'index' ? <IndexIntro {...props} /> : <Classic {...props} />
}
