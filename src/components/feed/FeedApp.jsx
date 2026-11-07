// src/components/feed/FeedApp.jsx
// Spring 2016 Instagram (iOS, iPhone 6 viewport, pre-May-2016 redesign):
// blue header, dark tab bar, four tabs plus pushed post / profile screens.
// Props:
//   animated           — true when screen === 'playing'; triggers feed-enter keyframe
//   framed             — true inside GhostDevice: lays out at 320 × 568 and is
//                        zoomed to fill the 375 × 667 slot (iPhone 6 Display Zoom)
//   onCompleteObjective(key) — fires 'likeImani' | 'tapSponsored' | 'followNew'
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
import { resetFollows, useFollowsSomeoneNew } from './followStore'
import './feed-styles.css'
import './ad-browser.css'
import { buildFeed, randomSeed, FOLLOWING_ACTIVITY, YOU_ACTIVITY, TRICKLE_ACTIVITY } from './feedData'
import NavBar from './NavBar'
import Post from './Post'
import ExploreTab from './ExploreTab'
import ActivityTab from './ActivityTab'
import ProfileView from './ProfileView'
import PostDetailView from './PostDetailView'
import InAppBrowser, { BROWSER_CHROME } from './InAppBrowser'
import AirbnbLiveThere from './AirbnbLiveThere'
import {
  InboxIcon, TabHomeIcon, TabSearchIcon, TabCameraIcon, TabActivityIcon, TabProfileIcon,
} from './icons'

const TABS = ['home', 'explore', 'activity', 'profile']

// Locally built advertiser pages, by the `page` key on a post's `ad`.
const AD_PAGES = { 'airbnb-live-there': AirbnbLiveThere }
const NAV_MS = 500
const LOAD_MORE_MS = 650       // spinner time before the next page of older posts
const LOAD_MORE_PX = 240       // how close to the bottom before loading
const REFRESH_MS = 900         // spinner time after a pull-to-refresh
const TRICKLE_FIRST_MS = 5000
const TRICKLE_GAP_MS = 7000

export default function FeedApp({ onCompleteObjective, animated, framed = false }) {
  const feedScrollRef = useRef(null)

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

  // 'followNew' fires the first time the player follows someone new
  // (from Explore, a profile or an Activity row).
  const followsNew = useFollowsSomeoneNew()
  useEffect(() => {
    if (followsNew && onCompleteObjective) onCompleteObjective('followNew')
  }, [followsNew, onCompleteObjective])

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

  // The feed is dealt fresh on every load (a new seed) and again on
  // pull-to-refresh, which the drag hook reports as a 'pullrefresh' event on
  // the scroll element once the list is pulled well past its top.
  const [feed, setFeed] = useState(() => buildFeed(randomSeed()))
  const [pages, setPages] = useState([])          // older posts, a page per day back
  const [exhausted, setExhausted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const refreshTimer = useRef(null)
  useEffect(() => {
    const el = feedScrollRef.current
    if (!el) return
    const onPull = () => {
      if (refreshTimer.current) return
      setRefreshing(true)
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null
        setFeed(buildFeed(randomSeed()))
        setPages([])
        setExhausted(false)
        setRefreshing(false)
        el.scrollTop = 0
      }, REFRESH_MS)
    }
    el.addEventListener('pullrefresh', onPull)
    return () => {
      clearTimeout(refreshTimer.current)
      refreshTimer.current = null
      el.removeEventListener('pullrefresh', onPull)
    }
  }, [])

  // The first photo "downloads" when the app boots (pie loader on its square);
  // once it has appeared it stays loaded for the rest of the session.
  const [firstPhotoReady, setFirstPhotoReady] = useState(false)
  const markFirstPhotoReady = useCallback(() => setFirstPhotoReady(true), [])

  // Older posts load as the player nears the bottom until every real account
  // has run out; then the spinner goes away.
  const loadingMore = useRef(false)
  const handleFeedScroll = useCallback(() => {
    const el = feedScrollRef.current
    if (!el || loadingMore.current || exhausted) return
    if (el.scrollTop + el.clientHeight < el.scrollHeight - LOAD_MORE_PX) return
    loadingMore.current = true
    setTimeout(() => {
      setPages(prev => {
        const next = feed.page(prev.length + 1)
        if (!next.length) setExhausted(true)
        return next.length ? [...prev, next] : prev
      })
      loadingMore.current = false
    }, LOAD_MORE_MS)
  }, [exhausted, feed])

  // 'likeImani' fires when the liked post is Imani's news post (the target),
  // from the feed, her profile or a post detail.
  const handleLike = useCallback((post) => {
    if (post?.isTarget && onCompleteObjective) onCompleteObjective('likeImani')
  }, [onCompleteObjective])

  const handleSponsoredTap = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('tapSponsored')
  }, [onCompleteObjective])

  // In-app browser over the whole app. The feed underneath stays mounted
  // and keeps its scroll; the objective counts when the browser opens.
  const [browser, setBrowser] = useState(null)   // { ad, closing }
  const browserTimer = useRef(null)
  useEffect(() => () => clearTimeout(browserTimer.current), [])
  const openAd = useCallback((ad) => {
    if (browser) return
    setBrowser({ ad: { ...ad, Page: AD_PAGES[ad.page] || (() => null) }, closing: false })
    if (onCompleteObjective) onCompleteObjective('tapSponsored')
  }, [browser, onCompleteObjective])
  const closeAd = useCallback(() => {
    setBrowser(b => b && !b.closing ? { ...b, closing: true } : b)
    clearTimeout(browserTimer.current)
    browserTimer.current = setTimeout(() => setBrowser(null), BROWSER_CHROME.slideMs + 20)
  }, [])

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
          {refreshing && (
            <div className="loadingArea">
              <div className="spinner" />
            </div>
          )}
          {[...feed.posts, ...pages.flat()].map((post, i) => (
            <Post
              key={post.id}
              {...post}
              photoLoading={i === 0 && !firstPhotoReady ? { running: !!animated } : null}
              onPhotoLoaded={i === 0 ? markFirstPhotoReady : undefined}
              onLike={() => handleLike(post)}
              onSponsoredTap={post.isSponsored ? handleSponsoredTap : undefined}
              onOpenAd={openAd}
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
                ? <PostDetailView post={v.post} onBack={pop} onLike={() => handleLike(v.post)} onOpenProfile={openProfile} onOpenAd={openAd} />
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

      {browser && <InAppBrowser ad={browser.ad} closing={browser.closing} onClose={closeAd} />}

    </div>
  )

  // The zoom lives on a wrapper so the enter animation keeps its own transform.
  return framed ? <div className="feedZoom">{app}</div> : app
}
