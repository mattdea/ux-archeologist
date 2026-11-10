// src/shared/museum/DiscoveryCard.jsx
// The discovery, in whichever museum is showing (src/shared/museumStyle.js).
// Classic: the card. Index: lines under the room's line in the list.
import Classic from '../museum-ui/DiscoveryCard'
import { useMuseumStyle } from '../museumStyle'
import { usePublish } from '../index-museum/store'

function IndexDiscovery(props) {
  usePublish('discovery', props)
  return null
}

export default function DiscoveryCard(props) {
  return useMuseumStyle() === 'index' ? <IndexDiscovery {...props} /> : <Classic {...props} />
}
