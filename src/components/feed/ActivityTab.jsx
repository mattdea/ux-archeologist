// src/components/feed/ActivityTab.jsx
// Heart tab: "FOLLOWING / YOU" toggle under an "ACTIVITY" title, then
// notification rows (avatar, text with blue usernames, grey time, post
// thumbnails). The "You" tab has the player's two followers and the 2015
// empty-state copy for posts.
// Props:
//   following     — rows for the Following tab (newest first)
//   you           — rows for the You tab
//   onOpenProfile — (username) => void

import { useState } from 'react'
import NavBar from './NavBar'
import Avatar from './Avatar'
import { getProfile } from './feedData'
import { ActivityEmptyIcon } from './icons'

function Segments({ segments, onOpenProfile }) {
  return segments.map((s, i) =>
    typeof s === 'string'
      ? <span key={i}>{s}</span>
      : <span key={i} className="postUser" onClick={() => onOpenProfile(s.user)}>{s.user}</span>
  )
}

function Row({ row, onOpenProfile }) {
  const [followed, setFollowed] = useState(false)
  const profile = getProfile(row.actor)
  const thumbs = row.thumbs || []
  const single = thumbs.length === 1

  return (
    <div className="activityRow">
      <div className="activityMain">
        <button className="activityAvatarBtn" onClick={() => onOpenProfile(row.actor)} aria-label={row.actor}>
          <Avatar photo={profile.avatar} color={profile.avatarColor} initial={profile.initial} size={38} />
        </button>
        <div className="activityText">
          <span className="postUser" onClick={() => onOpenProfile(row.actor)}>{row.actor}</span>
          {' '}
          <Segments segments={row.segments} onOpenProfile={onOpenProfile} />
          {' '}
          <span className="activityTime">{row.time}</span>
        </div>
        {single && (
          <div className="activityThumb"><img src={thumbs[0]} alt="" draggable={false} /></div>
        )}
        {row.follow && (
          <button
            className={followed ? 'followBtnSmall followBtnSmallOn' : 'followBtnSmall'}
            onClick={() => setFollowed(f => !f)}
          >
            {followed ? 'Following' : '+ Follow'}
          </button>
        )}
      </div>
      {thumbs.length > 1 && (
        <div className="activityThumbRow">
          {thumbs.map((src, i) => (
            <div className="activityThumb" key={i}><img src={src} alt="" draggable={false} /></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ActivityTab({ following, you, onOpenProfile }) {
  const [mode, setMode] = useState('following')
  const rows = mode === 'following' ? following : you

  return (
    <>
      <NavBar title="ACTIVITY" />
      <div className="activityToggle">
        <button
          className={mode === 'following' ? 'activityToggleBtn activityToggleOn' : 'activityToggleBtn'}
          onClick={() => setMode('following')}
        >
          FOLLOWING
        </button>
        <button
          className={mode === 'you' ? 'activityToggleBtn activityToggleOn' : 'activityToggleBtn'}
          onClick={() => setMode('you')}
        >
          YOU
        </button>
      </div>
      <div className="feedScroll">
        {rows.map(row => <Row key={row.id} row={row} onOpenProfile={onOpenProfile} />)}
        {mode === 'you' && (
          <div className="activityEmpty">
            <ActivityEmptyIcon />
            <div className="activityEmptyTitle">Recent Activity on your posts</div>
            <div className="activityEmptyBody">
              When someone comments on or likes one of your photos or videos, you’ll see it here.
            </div>
          </div>
        )}
      </div>
    </>
  )
}
