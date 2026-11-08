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
import { hasProfile } from './feedData'
import Avatar from './Avatar'
import * as sfx from '../../audio/sfx'
import posterLogo from '../../../assets/feed/ads/airbnb-logo-white.png'
import {
  HeartOutlineIcon, CommentOutlineIcon, MoreDotsIcon, LikesHeartIcon,
  AdBadgeIcon, BurstHeartIcon,
} from './icons'

// Photo loading indicator, as on a slow connection in 2016: a pale gray
// square with a thin ring in the middle that fills clockwise from 12 o'clock
// like a pie chart, in uneven bursts as the download comes in. The photo
// then appears at once. `running` holds the pie at 0 until the screen lights.
function PhotoLoader({ running, onDone }) {
  return (
    <div className="photoLoader" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle className="photoLoaderRing" cx="16" cy="16" r="14.75" />
        <circle
          className="photoLoaderPie"
          cx="16" cy="16" r="6.25"
          transform="rotate(-90 16 16)"
          style={{ animationPlayState: running ? 'running' : 'paused' }}
          onAnimationEnd={e => { if (e.target === e.currentTarget) onDone?.() }}
        />
      </svg>
    </div>
  )
}

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
  ad,
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
  onOpenAd,
  onOpenProfile,
  photoLoading = null,   // { running } while the photo is still "downloading"
  onPhotoLoaded,
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
      sfx.pop()
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

  // Sponsored photos: a tap reveals the ad overlay (March 2016) instead of
  // counting toward a double-tap like; a second tap anywhere but the arrow
  // dismisses it. Learn More and the arrow open the advertiser's page.
  const [adOverlay, setAdOverlay] = useState(false)
  const openAd = useCallback((e) => {
    e.stopPropagation()
    setAdOverlay(false)
    if (onOpenAd && ad) onOpenAd(ad)
  }, [onOpenAd, ad])

  const handleImageClick = useCallback(() => {
    if (isSponsored && ad) { setAdOverlay(v => !v); return }
    const now = Date.now()
    const elapsed = now - lastTapRef.current
    lastTapRef.current = now
    if (elapsed > 0 && elapsed < 300) handleDoubleTap()
  }, [handleDoubleTap, isSponsored, ad])

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

  const photoSrc = imageSrc

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
            <button className="postSponsored" onClick={ad ? openAd : onSponsoredTap}>
              <AdBadgeIcon />
              <span>Sponsored</span>
            </button>
          )
          : <div className="postTimestamp">{timestamp}</div>}
      </div>

      {/* Square photo: double-tap target */}
      <div className="postImageWrap" onClick={handleImageClick}>
        {photoSrc
          ? <img className="postImage" src={photoSrc} alt="" draggable={false}
              style={photoLoading ? { visibility: 'hidden' } : undefined} />
          : <div className="postImage" style={{ background: imageGradient, visibility: photoLoading ? 'hidden' : undefined }} />}
        {photoLoading && <PhotoLoader running={photoLoading.running} onDone={onPhotoLoaded} />}
        {ad?.poster && (
          <div className="adPoster" aria-label={ad.poster.flat().join(' ')}>
            <div className="adPosterInner">
              <img className="adPosterLogo" src={posterLogo} alt="" draggable={false} />
              {ad.poster.map((line, i) => (
                <div key={i} className={i === 0 ? 'adPosterLine' : 'adPosterLine adPosterAccent'}>
                  {line.map(w => <span key={w}>{w}</span>)}
                </div>
              ))}
            </div>
          </div>
        )}
        {burstKey > 0 && (
          <div className="heartBurst" key={burstKey}>
            <BurstHeartIcon />
          </div>
        )}
        {adOverlay && (
          <div className="adOverlay" role="presentation">
            {photoSrc && <img className="adOverlayBlur" src={photoSrc} alt="" aria-hidden="true" draggable={false} />}
            <div className="adOverlayTint" />
            <div className="adOverlayBody">
              <button className="adOverlayCircle" onClick={openAd} aria-label={`Open ${ad.name}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                  <path d="M6 16L16 6M8 6h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
              <div className="adOverlayName">{ad.name}</div>
              <div className="adOverlayDomain">{ad.domain}</div>
            </div>
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
            <button className="ctaBtn" onClick={ad ? openAd : onSponsoredTap}>
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
