// src/components/feed/FeedApp.jsx
// Spring 2016 Instagram (iOS, iPhone 6 viewport, pre-May-2016 redesign):
// blue header, dark tab bar, four tabs plus pushed post / profile screens.
// Props:
//   animated           — true when screen === 'playing'; triggers feed-enter keyframe
//   framed             — true inside GhostDevice: lays out at 320 × 568 and is
//                        zoomed to fill the 375 × 667 slot (iPhone 6 Display Zoom)
//   onCompleteObjective(key) — fires 'findFriend' | 'tapSponsored' | 'likePost'
//
// Navigation: `tab` picks the root screen; `stacks[tab]` holds pushed views
// ({ type: 'post', post } | { type: 'profile', username }). Every tab root
// stays mounted so scroll positions survive tab switches.
//
// Activity: while the player is on the home feed, new likes from people they
// follow trickle into the Following tab every few seconds, with a count badge
// on the heart tab until it is opened.

import { useState, useRef, useCallback, useEffect } from 'react'
import './feed-styles.css'
import { POSTS, FOLLOWING_ACTIVITY, YOU_ACTIVITY, TRICKLE_ACTIVITY } from './feedData'
import NavBar from './NavBar'
import Post from './Post'
import ExploreTab from './ExploreTab'
import ActivityTab from './ActivityTab'
import ProfileView from './ProfileView'
import PostDetailView from './PostDetailView'
import {
  InboxIcon, TabHomeIcon, TabSearchIcon, TabCameraIcon, TabActivityIcon, TabProfileIcon,
} from './icons'

const TABS = ['home', 'explore', 'activity', 'profile']
const TRICKLE_FIRST_MS = 5000
const TRICKLE_GAP_MS = 7000

export default function FeedApp({ onCompleteObjective, animated, framed = false }) {
  const feedScrollRef = useRef(null)
  const targetRef = useRef(null)

  const [tab, setTab] = useState('home')
  const [stacks, setStacks] = useState({ home: [], explore: [], activity: [], profile: [] })
  const [following, setFollowing] = useState(FOLLOWING_ACTIVITY)
  const [unread, setUnread] = useState(0)
  const trickleIdx = useRef(0)

  // IntersectionObserver: fires 'findFriend' when the friend's post is ≥40%
  // visible inside the feed's own scroll container.
  useEffect(() => {
    const scroll = feedScrollRef.current
    const target = targetRef.current
    if (!scroll || !target || !onCompleteObjective) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onCompleteObjective('findFriend')
            observer.disconnect()
          }
        })
      },
      { root: scroll, threshold: 0.4 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [onCompleteObjective])

  // New likes arrive while the player is in the feed (home tab, nothing pushed).
  const inFeed = animated && tab === 'home' && stacks.home.length === 0
  useEffect(() => {
    if (!inFeed || trickleIdx.current >= TRICKLE_ACTIVITY.length) return
    const delay = trickleIdx.current === 0 ? TRICKLE_FIRST_MS : TRICKLE_GAP_MS
    const t = setTimeout(() => {
      const row = TRICKLE_ACTIVITY[trickleIdx.current]
      trickleIdx.current += 1
      setFollowing(prev => [row, ...prev])
      setUnread(n => n + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [inFeed, following])

  const handleLike = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('likePost')
  }, [onCompleteObjective])

  const handleSponsoredTap = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('tapSponsored')
  }, [onCompleteObjective])

  // ── Navigation ──
  const push = useCallback((view) => {
    setStacks(prev => ({ ...prev, [tab]: [...prev[tab], view] }))
  }, [tab])

  const pop = useCallback(() => {
    setStacks(prev => ({ ...prev, [tab]: prev[tab].slice(0, -1) }))
  }, [tab])

  const openPost = useCallback((post) => push({ type: 'post', post }), [push])
  const openProfile = useCallback((username) => push({ type: 'profile', username }), [push])

  const selectTab = useCallback((next) => {
    if (next === 'activity') setUnread(0)
    if (next === tab) {
      // Re-tapping the current tab pops to its root, like the real app.
      setStacks(prev => ({ ...prev, [next]: [] }))
      return
    }
    setTab(next)
  }, [tab])

  const stack = stacks[tab]
  const top = stack[stack.length - 1]

  const appClass = [
    'feedApp',
    animated ? 'feedAppEntering' : 'feedAppHidden',
    framed ? 'feedAppFramed' : '',
  ].join(' ')

  const roots = {
    home: (
      <>
        <NavBar
          title={<span className="feedWordmark" role="img" aria-label="Instagram" />}
          right={<button className="feedNavBtn" aria-label="Direct inbox"><InboxIcon /></button>}
        />
        <div ref={feedScrollRef} className="feedScroll">
          {POSTS.map(post => (
            <Post
              key={post.id}
              {...post}
              containerRef={post.isTarget ? targetRef : undefined}
              onLike={handleLike}
              onSponsoredTap={post.isSponsored ? handleSponsoredTap : undefined}
              onOpenProfile={openProfile}
            />
          ))}
          <div className="loadingArea">
            <div className="spinner" />
          </div>
        </div>
      </>
    ),
    explore: <ExploreTab onOpenPost={openPost} />,
    activity: <ActivityTab following={following} you={YOU_ACTIVITY} onOpenProfile={openProfile} />,
    profile: <ProfileView onOpenPost={openPost} />,
  }

  const app = (
    <div className={appClass}>

      <div className="feedScreens">
        {TABS.map(t => (
          <div key={t} className="feedScreen" style={{ display: t === tab ? 'flex' : 'none' }}>
            {roots[t]}
          </div>
        ))}

        {top && (
          <div className="feedScreen feedScreenPushed" key={`${tab}-${stack.length}`}>
            {top.type === 'post'
              ? <PostDetailView post={top.post} onBack={pop} onLike={handleLike} onOpenProfile={openProfile} />
              : <ProfileView username={top.username} onBack={pop} onOpenPost={openPost} />}
          </div>
        )}
      </div>

      {/* Dark tab bar: home, search, camera (blue square), activity, profile */}
      <nav className="feedTabBar">
        <button className={tab === 'home' ? 'tabBtn tabBtnActive' : 'tabBtn'} aria-label="Home" onClick={() => selectTab('home')}>
          <TabHomeIcon />
        </button>
        <button className={tab === 'explore' ? 'tabBtn tabBtnActive' : 'tabBtn'} aria-label="Search" onClick={() => selectTab('explore')}>
          <TabSearchIcon />
        </button>
        <button className="tabBtn tabBtnCamera" aria-label="Camera">
          <TabCameraIcon />
        </button>
        <button className={tab === 'activity' ? 'tabBtn tabBtnActive' : 'tabBtn'} aria-label="Activity" onClick={() => selectTab('activity')}>
          <TabActivityIcon />
          {unread > 0 && <span className="tabBadge">{unread}</span>}
        </button>
        <button className={tab === 'profile' ? 'tabBtn tabBtnActive' : 'tabBtn'} aria-label="Profile" onClick={() => selectTab('profile')}>
          <TabProfileIcon />
        </button>
      </nav>

    </div>
  )

  // The zoom lives on a wrapper so the enter animation keeps its own transform.
  return framed ? <div className="feedZoom">{app}</div> : app
}
