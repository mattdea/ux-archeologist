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
// ({ id, type: 'post', post } | { id, type: 'profile', username }). Every tab
// root and every pushed view stays mounted, so scroll positions survive tab
// switches and going back.
//
// Push and pop follow the iOS 9 navigation controller: the incoming view
// slides over from the right with a shadow on its leading edge, the view
// underneath drifts 30% left and dims slightly, and the blue nav bar holds
// still while its titles cross-fade. Pop is the exact reverse. Timing lives
// in feed-styles.css (NAV_MS must match --nav-dur there).
//
// Activity: while the player is on the home feed, new likes from people they
// follow trickle into the Following tab every few seconds, with a count badge
// on the heart tab until it is opened.

import { useState, useRef, useCallback, useEffect } from 'react'
import useDragScroll from './useDragScroll'
import { resetFollows } from './followStore'
import './feed-styles.css'
import { POSTS, feedPage, FOLLOWING_ACTIVITY, YOU_ACTIVITY, TRICKLE_ACTIVITY } from './feedData'
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
const NAV_MS = 500
const LOAD_MORE_MS = 650       // spinner time before the next page of older posts
const LOAD_MORE_PX = 240       // how close to the bottom before loading
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
  const appRef = useRef(null)
  useDragScroll(appRef)
  useEffect(() => { resetFollows() }, [])

  // Running push/pop: { kind: 'push' | 'pop', tab } while it animates.
  const [nav, setNav] = useState(null)
  const navBusy = useRef(false)
  const viewId = useRef(0)
  const navTimer = useRef(null)
  useEffect(() => () => clearTimeout(navTimer.current), [])

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

  // Older posts load as the player nears the bottom, a page per day back,
  // until every real account has run out; then the spinner goes away.
  const [pages, setPages] = useState([])
  const [exhausted, setExhausted] = useState(false)
  const loadingMore = useRef(false)
  const handleFeedScroll = useCallback(() => {
    const el = feedScrollRef.current
    if (!el || loadingMore.current || exhausted) return
    if (el.scrollTop + el.clientHeight < el.scrollHeight - LOAD_MORE_PX) return
    loadingMore.current = true
    setTimeout(() => {
      setPages(prev => {
        const next = feedPage(prev.length + 1)
        if (!next.length) setExhausted(true)
        return next.length ? [...prev, next] : prev
      })
      loadingMore.current = false
    }, LOAD_MORE_MS)
  }, [exhausted])

  const handleLike = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('likePost')
  }, [onCompleteObjective])

  const handleSponsoredTap = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('tapSponsored')
  }, [onCompleteObjective])

  // ── Navigation ──
  const finishNav = useCallback((after) => {
    clearTimeout(navTimer.current)
    // A few ms past the CSS duration so the last frame has painted.
    navTimer.current = setTimeout(() => {
      if (after) after()
      setNav(null)
      navBusy.current = false
    }, NAV_MS + 30)
  }, [])

  const push = useCallback((view) => {
    if (navBusy.current) return
    navBusy.current = true
    viewId.current += 1
    setStacks(prev => ({ ...prev, [tab]: [...prev[tab], { ...view, id: viewId.current }] }))
    setNav({ kind: 'push', tab })
    finishNav()
  }, [tab, finishNav])

  // Pop keeps the top view mounted while it slides off, then removes it.
  const pop = useCallback(() => {
    if (navBusy.current) return
    navBusy.current = true
    const t = tab
    setNav({ kind: 'pop', tab: t })
    finishNav(() => setStacks(prev => ({ ...prev, [t]: prev[t].slice(0, -1) })))
  }, [tab, finishNav])

  const openPost = useCallback((post) => push({ type: 'post', post }), [push])
  const openProfile = useCallback((username) => push({ type: 'profile', username }), [push])

  const selectTab = useCallback((next) => {
    if (next === 'activity') setUnread(0)
    if (next === tab) {
      // Re-tapping the current tab pops to its root, like the real app:
      // views in between drop out and the top one animates off over the root.
      const st = stacks[next]
      if (!st.length || navBusy.current) return
      if (st.length > 1) setStacks(prev => ({ ...prev, [next]: [prev[next][prev[next].length - 1]] }))
      pop()
      return
    }
    setTab(next)
  }, [tab, stacks, pop])

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
        <div ref={feedScrollRef} className="feedScroll" onScroll={handleFeedScroll}>
          {[...POSTS, ...pages.flat()].map(post => (
            <Post
              key={post.id}
              {...post}
              containerRef={post.isTarget ? targetRef : undefined}
              onLike={handleLike}
              onSponsoredTap={post.isSponsored ? handleSponsoredTap : undefined}
              onOpenProfile={openProfile}
            />
          ))}
          {!exhausted && (
            <div className="loadingArea">
              <div className="spinner" />
            </div>
          )}
        </div>
      </>
    ),
    explore: <ExploreTab onOpenPost={openPost} />,
    activity: <ActivityTab following={following} you={YOU_ACTIVITY} onOpenProfile={openProfile} />,
    profile: <ProfileView onOpenPost={openPost} />,
  }

  const app = (
    <div className={appClass} ref={appRef}>

      <div className="feedScreens">
        {TABS.map(t => {
          const layers = [
            { key: 'root', node: roots[t] },
            ...stacks[t].map(v => ({
              key: 'view-' + v.id,
              node: v.type === 'post'
                ? <PostDetailView post={v.post} onBack={pop} onLike={handleLike} onOpenProfile={openProfile} />
                : <ProfileView username={v.username} onBack={pop} onOpenPost={openPost} />,
            })),
          ]
          const n = layers.length
          const kind = nav && nav.tab === t ? nav.kind : null
          return (
            <div
              key={t}
              className={kind ? 'feedTab feedTabAnimating' : 'feedTab'}
              style={{ display: t === tab ? 'block' : 'none' }}
            >
              {layers.map((layer, i) => {
                let role = i === n - 1 ? '' : 'navHidden'
                if (kind === 'push') role = i === n - 1 ? 'navPushIn' : i === n - 2 ? 'navPushOut' : 'navHidden'
                if (kind === 'pop') role = i === n - 1 ? 'navPopOut' : i === n - 2 ? 'navPopIn' : 'navHidden'
                return (
                  <div key={layer.key} className={'feedScreen ' + role}>
                    {layer.node}
                  </div>
                )
              })}
            </div>
          )
        })}
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
