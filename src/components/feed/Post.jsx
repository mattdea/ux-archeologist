// src/components/feed/Post.jsx
// Single feed post card — 2016 Instagram flat design.
// Interactions: double-tap image (heart burst), tap heart icon (like),
// tap sponsored CTA or "Sponsored" label (tapSponsored objective).

import { useState, useRef, useCallback, useEffect } from 'react'

// ── Inline SVG icons ───────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function HeartFilledIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="#ed4956" stroke="#ed4956" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="23" height="22" viewBox="0 0 23 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-5 4V3a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21l-8-6-8 6V3a2 2 0 012-2h12a2 2 0 012 2z" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 2l4 5-4 5" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Post({
  username,
  location,
  isSuggested,
  isSponsored,
  isTarget,
  ctaLabel,
  imageGradient,
  likes,
  caption,
  commentCount,
  timestamp,
  avatarColor,
  initial,
  containerRef,
  onLike,
  onSponsoredTap,
}) {
  const [liked, setLiked] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const lastTapRef = useRef(0)
  const burstTimerRef = useRef(null)

  useEffect(() => () => {
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current)
  }, [])

  // Single like action — called from both double-tap and heart icon tap
  const doLike = useCallback(() => {
    if (!liked) {
      setLiked(true)
      if (onLike) onLike()
    }
  }, [liked, onLike])

  // Double-tap on image → heart burst + like
  const handleDoubleTap = useCallback(() => {
    doLike()
    setShowBurst(true)
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current)
    burstTimerRef.current = setTimeout(() => setShowBurst(false), 800)
  }, [doLike])

  const handleImageClick = useCallback(() => {
    const now = Date.now()
    const elapsed = now - lastTapRef.current
    lastTapRef.current = now
    if (elapsed > 0 && elapsed < 300) {
      handleDoubleTap()
    }
  }, [handleDoubleTap])

  // Heart icon tap → like (no burst)
  const handleHeartClick = useCallback((e) => {
    e.stopPropagation()
    doLike()
  }, [doLike])

  const cardClass = ['postCard', isTarget ? 'postCardTarget' : ''].filter(Boolean).join(' ')

  return (
    <article className={cardClass} ref={containerRef}>

      {/* Suggested For You badge */}
      {isSuggested && (
        <div className="suggestedBadge">Suggested For You</div>
      )}

      {/* Header row */}
      <div className="postHeader">
        <div className="postAvatar" style={{ background: avatarColor }}>
          {initial || username.charAt(0)}
        </div>
        <div className="postHeaderInfo">
          <div className="postUsername">{username}</div>
          {location && <div className="postLocation">{location}</div>}
        </div>
        <button className="postMenuBtn" aria-label="More options">···</button>
      </div>

      {/* Square image — double-tap target */}
      <div className="postImageWrap" onClick={handleImageClick}>
        <div className="postImage" style={{ background: imageGradient }} />
        {showBurst && (
          <div className="heartBurst">
            <svg
              width="90"
              height="84"
              viewBox="0 0 24 22"
              fill="white"
              stroke="white"
              strokeWidth="0.3"
              style={{ filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.35))' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
        )}
      </div>

      {/* Sponsored CTA bar — tapping completes tapSponsored objective */}
      {isSponsored && ctaLabel && (
        <div
          className="sponsoredCtaBar"
          onClick={onSponsoredTap}
          style={{ cursor: 'pointer' }}
        >
          <span className="sponsoredCtaText">{username} · Paid partnership</span>
          <button className="sponsoredCtaBtn">
            {ctaLabel}
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Action row */}
      <div className="actionRow">
        <div className="actionLeft">
          <button
            className="actionBtn"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={handleHeartClick}
          >
            {liked ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
          <button className="actionBtn" aria-label="Comment">
            <CommentIcon />
          </button>
          <button className="actionBtn" aria-label="Share">
            <ShareIcon />
          </button>
        </div>
        <button className="actionBtn" aria-label="Save">
          <BookmarkIcon />
        </button>
      </div>

      {/* Body text */}
      <div className="postBody">
        <div className="likesLine">{likes} likes</div>
        <div className="captionLine">
          <span className="captionUser">{username}</span>{' '}
          {caption}
        </div>
        {commentCount > 0 && (
          <div className="viewCommentsLine">
            View all {commentCount} comments
          </div>
        )}
        {/* "Sponsored" label — tapping also completes tapSponsored objective */}
        <div
          className="timestampLine"
          onClick={isSponsored ? onSponsoredTap : undefined}
          style={isSponsored ? { cursor: 'pointer' } : undefined}
        >
          {isSponsored ? 'Sponsored' : timestamp}
        </div>
      </div>

    </article>
  )
}
