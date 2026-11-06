// src/components/feed/Post.jsx
// Single feed post, 2016 Instagram iOS layout: header (avatar, blue username,
// grey timestamp or blue "Sponsored"), square photo, action row (outlined
// heart + comment, "•••" or a blue CTA button on the right) over a hairline,
// then likes, caption, "View all N comments" and the latest comments.
// Interactions: double-tap photo (heart burst + like), tap heart (like),
// tap "Sponsored" or the CTA button (tapSponsored objective), tap the
// username or avatar (open profile).
//
// Double-tap like, 2016 iOS timing: the big white heart springs in over
// ~250ms (overshoot then settle), holds, and fades out ~900ms after the tap
// (.heartBurst keyframes in feed-styles.css). The action-row heart fills red
// and does a quick 1 → 1.25 → 1 bounce at the same moment.

import { useState, useRef, useCallback, useEffect } from 'react'
import { feedImage, hasProfile } from './feedData'
import Avatar from './Avatar'
import {
  HeartOutlineIcon, CommentOutlineIcon, MoreDotsIcon, LikesHeartIcon,
  AdBadgeIcon, BurstHeartIcon,
} from './icons'

// Splits caption / comment text so #hashtags and @mentions render in blue.
const LINK_RE = /([#@][\w.]+)/g

function RichText({ text }) {
  return text.split(LINK_RE).map((part, i) =>
    LINK_RE.test(part) && (part[0] === '#' || part[0] === '@')
      ? <span className="postLink" key={i}>{part}</span>
      : <span key={i}>{part}</span>
  )
}

export default function Post({
  username,
  isSponsored,
  isTarget,
  ctaLabel,
  photo,
  imageSrc,
  avatar,
  imageGradient,
  likes,
  caption,
  commentCount,
  comments = [],
  timestamp,
  avatarColor,
  initial,
  containerRef,
  onLike,
  onSponsoredTap,
  onOpenProfile,
}) {
  const [liked, setLiked] = useState(false)
  const [burstKey, setBurstKey] = useState(0)      // > 0 while the big heart shows
  const [bounceKey, setBounceKey] = useState(0)    // > 0 while the small heart bounces
  const lastTapRef = useRef(0)
  const burstTimerRef = useRef(null)
  const bounceTimerRef = useRef(null)

  useEffect(() => () => {
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current)
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current)
  }, [])

  const bounceSmallHeart = useCallback(() => {
    setBounceKey(k => k + 1)
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current)
    bounceTimerRef.current = setTimeout(() => setBounceKey(0), 320)
  }, [])

  const doLike = useCallback(() => {
    if (!liked) {
      setLiked(true)
      bounceSmallHeart()
      if (onLike) onLike()
    }
  }, [liked, onLike, bounceSmallHeart])

  // Double-tap always shows the burst, even on an already-liked photo (as in the app).
  const handleDoubleTap = useCallback(() => {
    doLike()
    setBurstKey(k => k + 1)
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current)
    burstTimerRef.current = setTimeout(() => setBurstKey(0), 950)
  }, [doLike])

  const openProfile = useCallback((e) => {
    e.stopPropagation()
    if (onOpenProfile) onOpenProfile(username)
  }, [onOpenProfile, username])

  // A commenter's name opens their profile when they have one.
  const openCommenter = useCallback((e, name) => {
    e.stopPropagation()
    if (onOpenProfile && hasProfile(name)) onOpenProfile(name)
  }, [onOpenProfile])

  const handleImageClick = useCallback(() => {
    const now = Date.now()
    const elapsed = now - lastTapRef.current
    lastTapRef.current = now
    if (elapsed > 0 && elapsed < 300) handleDoubleTap()
  }, [handleDoubleTap])

  // The heart button toggles; only double-tap is like-only.
  const handleHeartClick = useCallback((e) => {
    e.stopPropagation()
    if (liked) setLiked(false)
    else doLike()
  }, [liked, doLike])

  // Count shown under the photo: the post's count plus the player's own like.
  const baseLikes = parseInt(String(likes).replace(/,/g, ''), 10)
  const likesLabel = Number.isFinite(baseLikes)
    ? (baseLikes + (liked ? 1 : 0)).toLocaleString('en-US')
    : likes

  const photoSrc = imageSrc || feedImage(photo)

  return (
    <article className="postCard" ref={containerRef} data-target={isTarget || undefined}>

      {/* Header */}
      <div className="postHeader">
        <button className="postAvatarBtn" onClick={openProfile} aria-label={`${username}'s profile`}>
          <Avatar photo={avatar} color={avatarColor} initial={initial} size={32} />
        </button>
        <div className="postUsername" onClick={openProfile}>{username}</div>
        {isSponsored
          ? (
            <button className="postSponsored" onClick={onSponsoredTap}>
              <AdBadgeIcon />
              <span>Sponsored</span>
            </button>
          )
          : <div className="postTimestamp">{timestamp}</div>}
      </div>

      {/* Square photo: double-tap target */}
      <div className="postImageWrap" onClick={handleImageClick}>
        {photoSrc
          ? <img className="postImage" src={photoSrc} alt="" draggable={false} />
          : <div className="postImage" style={{ background: imageGradient }} />}
        {burstKey > 0 && (
          <div className="heartBurst" key={burstKey}>
            <BurstHeartIcon />
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="actionRow">
        <button
          className={bounceKey > 0 ? 'actionBtn actionBtnBounce' : 'actionBtn'}
          key={bounceKey}
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={handleHeartClick}
        >
          <HeartOutlineIcon filled={liked} />
        </button>
        <button className="actionBtn" aria-label="Comment">
          <CommentOutlineIcon />
        </button>
        {isSponsored && ctaLabel
          ? (
            <button className="ctaBtn" onClick={onSponsoredTap}>
              {ctaLabel}
            </button>
          )
          : (
            <button className="moreBtn" aria-label="More options">
              <MoreDotsIcon />
            </button>
          )}
      </div>
      <div className="actionDivider" />

      {/* Text block */}
      <div className="postBody">
        <div className="likesLine">
          <LikesHeartIcon />
          <span>{likesLabel} likes</span>
        </div>
        <div className="captionLine">
          <span className="postUser" onClick={openProfile}>{username}</span> <RichText text={caption} />
        </div>
        {commentCount > comments.length && (
          <div className="viewCommentsLine">
            View all {commentCount} comments
          </div>
        )}
        {comments.map((c, i) => (
          <div className="commentLine" key={i}>
            <span
              className={hasProfile(c.username) ? 'postUser' : 'postUser postUserPlain'}
              onClick={e => openCommenter(e, c.username)}
            >{c.username}</span> <RichText text={c.text} />
          </div>
        ))}
      </div>

    </article>
  )
}
