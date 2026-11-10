// src/shared/museum/ObjectiveTracker.jsx
// The objectives, in whichever museum is showing (src/shared/museumStyle.js).
// Classic: the dark tracker. Index: [ ] / [x] lines under the room's line.
import Classic from '../museum-ui/ObjectiveTracker'
import { useMuseumStyle } from '../museumStyle'
import { usePublish } from '../index-museum/store'

function IndexTracker({ objectives, completedIndices = [] }) {
  usePublish('tracker', { objectives, completedIndices })
  return null
}

export default function ObjectiveTracker(props) {
  return useMuseumStyle() === 'index' ? <IndexTracker {...props} /> : <Classic {...props} />
}
