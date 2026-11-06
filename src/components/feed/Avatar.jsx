// src/components/feed/Avatar.jsx
// Circular profile picture. Uses the photo from /assets/feed/ when it exists,
// otherwise a flat colored circle with the account's initial.

import { feedImage } from './feedData'

export default function Avatar({ photo, color, initial, size = 32, className = '' }) {
  // `photo` is a filename in /assets/feed/ or an already-resolved image URL
  const src = feedImage(photo) || (typeof photo === 'string' && photo.includes('/') ? photo : null)
  const style = { width: size, height: size }

  if (src) {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className={`feedAvatar ${className}`}
        style={style}
      />
    )
  }

  return (
    <div
      className={`feedAvatar feedAvatarFallback ${className}`}
      style={{ ...style, background: color, fontSize: Math.round(size * 0.42) }}
    >
      {initial}
    </div>
  )
}
