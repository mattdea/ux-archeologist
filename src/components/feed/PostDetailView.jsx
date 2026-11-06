// src/components/feed/PostDetailView.jsx
// A single post pushed over a tab: back chevron + "PHOTO" title, then the
// same Post card the feed uses.
// Props:
//   post          — post data (feed post or generated explore/profile post)
//   onBack        — () => void
//   onLike        — () => void
//   onOpenProfile — (username) => void

import NavBar from './NavBar'
import Post from './Post'
import { BackChevronIcon } from './icons'

export default function PostDetailView({ post, onBack, onLike, onOpenProfile, onOpenAd }) {
  return (
    <>
      <NavBar
        title={post.isVideo ? 'VIDEO' : 'PHOTO'}
        left={<button className="feedNavBtn" onClick={onBack} aria-label="Back"><BackChevronIcon /></button>}
      />
      <div className="feedScroll">
        <Post {...post} onLike={onLike} onOpenProfile={onOpenProfile} onOpenAd={onOpenAd} />
      </div>
    </>
  )
}
