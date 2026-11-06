// src/components/feed/Avatar.jsx
// Circular profile picture: the account's image URL when it has one,
// otherwise a flat colored circle with the account's initial.

export default function Avatar({ photo, color, initial, size = 32, className = '' }) {
  const src = typeof photo === 'string' && photo.includes('/') ? photo : null
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
