// src/shared/museum/HintPill.jsx
// The hint, in whichever museum is showing (src/shared/museumStyle.js).
// Classic: the docked pill under the artifact. Index: a grey line under the
// objectives. Same timing either way (useHint).
import Classic from '../museum-ui/HintPill'
import { useMuseumStyle } from '../museumStyle'
import { usePublish } from '../index-museum/store'

function IndexHint({ text }) {
  usePublish('hint', text || null)
  return null
}

export default function HintPill(props) {
  return useMuseumStyle() === 'index' ? <IndexHint {...props} /> : <Classic {...props} />
}
