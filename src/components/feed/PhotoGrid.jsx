// src/components/feed/PhotoGrid.jsx
// 3-column square grid used by Explore and profiles. 2015 layout: 1pt white
// gutters, video tiles carry the small camcorder badge at the top right.
// Props:
//   tiles      — [{ id, image, gradient, isVideo, post }]
//   onOpenPost — (post) => void

import { VideoBadgeIcon } from './icons'

export default function PhotoGrid({ tiles, onOpenPost }) {
  return (
    <div className="photoGrid">
      {tiles.map(tile => (
        <button
          key={tile.id}
          className="gridTile"
          style={tile.image ? undefined : { background: tile.gradient }}
          onClick={() => onOpenPost && tile.post && onOpenPost(tile.post)}
          aria-label={`Photo by ${tile.post?.username || 'user'}`}
        >
          {tile.image && <img src={tile.image} alt="" loading="lazy" draggable={false} />}
          {tile.isVideo && <span className="gridVideoBadge"><VideoBadgeIcon /></span>}
        </button>
      ))}
    </div>
  )
}
