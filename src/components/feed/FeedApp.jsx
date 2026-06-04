// src/components/feed/FeedApp.jsx
// 2016 Instagram home feed.
// Props:
//   animated           — true when screen === 'playing'; triggers feed-enter keyframe
//   onCompleteObjective(key) — fires 'findFriend' | 'tapSponsored' | 'likePost'

import { useRef, useCallback, useEffect } from 'react'
import './feed-styles.css'
import StoryTray from './StoryTray'
import Post from './Post'

// ── Top-bar SVG icons ──────────────────────────────────────────────────────

function CameraIcon() {
  return (
    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 18a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  )
}

function DirectIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function HeartOutlineIcon() {
  return (
    <svg width="23" height="21" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

// ── Tab bar icons ──────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 9l12-8 12 8v13a2 2 0 01-2 2H3a2 2 0 01-2-2z" />
      <polyline points="9 23 9 14 17 14 17 23" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function AddSquareIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="24" height="24" rx="3" />
      <line x1="13" y1="7" x2="13" y2="19" />
      <line x1="7" y1="13" x2="19" y2="13" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.84 4.61a5.5 5.5 0 00-7.78 0L14 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L14 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 23v-1a6 6 0 00-6-6H10a6 6 0 00-6 6v1" />
      <circle cx="12" cy="9" r="5" />
    </svg>
  )
}

// ── Post data ──────────────────────────────────────────────────────────────

const POSTS = [
  // 1 — Suggested
  {
    id: 1,
    username: 'travel.scope',
    isSuggested: true,
    imageGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)',
    likes: '4,821',
    caption: 'Somewhere between the mountains and the sea. Every morning like this feels impossible. 🌊',
    commentCount: 43,
    timestamp: '2 HOURS AGO',
    avatarColor: '#0f3460',
    initial: 'T',
  },
  // 2 — Sponsored
  {
    id: 2,
    username: 'airbnb',
    isSponsored: true,
    ctaLabel: 'Learn More',
    location: 'San Francisco, CA',
    imageGradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    likes: '12,440',
    caption: "Don't just travel. Live there. Unique homes in over 191 countries.",
    commentCount: 89,
    timestamp: 'Sponsored',
    avatarColor: '#ff5a5f',
    initial: 'A',
  },
  // 3 — Normal
  {
    id: 3,
    username: 'marcus.h',
    imageGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    likes: '283',
    caption: 'Golden hour in the studio. Some days the light just cooperates. 📷',
    commentCount: 12,
    timestamp: '3 HOURS AGO',
    avatarColor: '#4facfe',
    initial: 'M',
  },
  // 4 — Normal
  {
    id: 4,
    username: 'julia.creates',
    imageGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    likes: '1,204',
    caption: 'new work in the shop 🎨 link in bio',
    commentCount: 28,
    timestamp: '5 HOURS AGO',
    avatarColor: '#a18cd1',
    initial: 'J',
  },
  // 5 — Suggested
  {
    id: 5,
    username: 'foodie.journal',
    isSuggested: true,
    imageGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    likes: '8,103',
    caption: "Ramen at 11pm hits different when it's been raining all day 🍜",
    commentCount: 204,
    timestamp: '6 HOURS AGO',
    avatarColor: '#f5576c',
    initial: 'F',
  },
  // 6 — Normal
  {
    id: 6,
    username: 'alex.wanderer',
    imageGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    likes: '541',
    caption: 'Lisbon. The city that smells like bread and sea salt. Will definitely return.',
    commentCount: 31,
    timestamp: '7 HOURS AGO',
    avatarColor: '#fda085',
    initial: 'A',
  },
  // 7 — Sponsored
  {
    id: 7,
    username: 'warbyparker',
    isSponsored: true,
    ctaLabel: 'Shop Now',
    location: 'Warby Parker',
    imageGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    likes: '7,892',
    caption: 'Fall frames are here. Try 5 pairs at home, free.',
    commentCount: 44,
    timestamp: 'Sponsored',
    avatarColor: '#1a1a2e',
    initial: 'W',
  },
  // 8 — Normal
  {
    id: 8,
    username: 'sarah.moments',
    imageGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    likes: '397',
    caption: 'lazy sunday mornings are underrated ☕',
    commentCount: 18,
    timestamp: '9 HOURS AGO',
    avatarColor: '#ff9a9e',
    initial: 'S',
  },
  // 9 — Normal
  {
    id: 9,
    username: 'mike.film',
    imageGradient: 'linear-gradient(135deg, #2d3561 0%, #c05c7e 100%)',
    likes: '1,088',
    caption: 'shot on 35mm. Every roll is a surprise until you get it developed.',
    commentCount: 67,
    timestamp: '10 HOURS AGO',
    avatarColor: '#c05c7e',
    initial: 'M',
  },
  // 10 — Normal
  {
    id: 10,
    username: 'coffee.culture',
    imageGradient: 'linear-gradient(135deg, #c9d6ff 0%, #e2e2e2 100%)',
    likes: '2,341',
    caption: 'The perfect cup exists and we have proof.',
    commentCount: 89,
    timestamp: '11 HOURS AGO',
    avatarColor: '#795548',
    initial: 'C',
  },
  // 11 — Normal
  {
    id: 11,
    username: 'outdoor.vibes',
    imageGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    likes: '763',
    caption: 'Trail conditions: perfect. Company: also perfect 🌲',
    commentCount: 22,
    timestamp: '12 HOURS AGO',
    avatarColor: '#43e97b',
    initial: 'O',
  },
  // 12 — Normal
  {
    id: 12,
    username: 'studio.light',
    imageGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    likes: '521',
    caption: 'Sometimes simple is everything.',
    commentCount: 14,
    timestamp: '13 HOURS AGO',
    avatarColor: '#607d8b',
    initial: 'S',
  },
  // 13 — Normal
  {
    id: 13,
    username: 'city.frames',
    imageGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    likes: '1,876',
    caption: 'Urban geometry. The city never looks better than at 5am.',
    commentCount: 58,
    timestamp: '13 HOURS AGO',
    avatarColor: '#2c5364',
    initial: 'C',
  },
  // 14 — Normal
  {
    id: 14,
    username: 'bakes.and.more',
    imageGradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    likes: '3,204',
    caption: "Sourdough attempt #47. I think we're getting somewhere. 🍞",
    commentCount: 112,
    timestamp: '13 HOURS AGO',
    avatarColor: '#e17055',
    initial: 'B',
  },
  // 15 — TARGET: daniela.reyes — warm amber, findable deep in feed
  {
    id: 15,
    username: 'daniela.reyes',
    isTarget: true,
    imageGradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 60%, #e6a817 100%)',
    likes: '847',
    caption: 'we bought a house!! 🏡 keys in hand after eight months of paperwork. swipe to see the empty living room i already love. thank you to everyone who talked us off the ledge 😭',
    commentCount: 134,
    timestamp: '14 HOURS AGO',
    avatarColor: '#fdcb6e',
    initial: 'D',
  },
  // 16 — Normal
  {
    id: 16,
    username: 'travel.tales',
    imageGradient: 'linear-gradient(135deg, #fd7043 0%, #ffb74d 100%)',
    likes: '692',
    caption: "Santorini didn't disappoint. Neither did the wine.",
    commentCount: 29,
    timestamp: '15 HOURS AGO',
    avatarColor: '#ff7043',
    initial: 'T',
  },
  // 17 — Normal
  {
    id: 17,
    username: 'morning.run',
    imageGradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    likes: '428',
    caption: '6 miles before sunrise. 🏃 the only good reason to be awake at 5am',
    commentCount: 17,
    timestamp: '16 HOURS AGO',
    avatarColor: '#8ec5fc',
    initial: 'M',
  },
  // 18 — Normal
  {
    id: 18,
    username: 'lens.folk',
    imageGradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    likes: '1,102',
    caption: 'Analog is not dead. It just takes longer. Worth it every time.',
    commentCount: 45,
    timestamp: '17 HOURS AGO',
    avatarColor: '#55efc4',
    initial: 'L',
  },
  // 19 — Normal
  {
    id: 19,
    username: 'home.spaces',
    imageGradient: 'linear-gradient(135deg, #f5f0e8 0%, #d4c5a9 100%)',
    likes: '2,031',
    caption: 'A corner that belongs to no one but books.',
    commentCount: 76,
    timestamp: '18 HOURS AGO',
    avatarColor: '#b8860b',
    initial: 'H',
  },
  // 20 — Normal
  {
    id: 20,
    username: 'pnw.shots',
    imageGradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    likes: '934',
    caption: 'Pacific Northwest summer. All 3 days of it. ☀️',
    commentCount: 38,
    timestamp: '20 HOURS AGO',
    avatarColor: '#71b280',
    initial: 'P',
  },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function FeedApp({ onCompleteObjective, animated }) {
  const feedScrollRef = useRef(null)
  const targetRef = useRef(null)

  // IntersectionObserver: fires 'findFriend' when daniela.reyes is ≥60% visible
  // within the feedScroll container (root must be the scroll container, not viewport)
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

  const handleLike = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('likePost')
  }, [onCompleteObjective])

  const handleSponsoredTap = useCallback(() => {
    if (onCompleteObjective) onCompleteObjective('tapSponsored')
  }, [onCompleteObjective])

  const appClass = ['feedApp', animated ? 'feedAppEntering' : 'feedAppHidden'].join(' ')

  return (
    <div className={appClass}>

      {/* Top bar */}
      <header className="feedTopBar">
        <button className="feedTopBarBtn" aria-label="Camera">
          <CameraIcon />
        </button>
        <span className="feedWordmark">Instagram</span>
        <div className="feedTopBarRight">
          <button className="feedTopBarBtn" aria-label="Activity">
            <HeartOutlineIcon />
          </button>
          <button className="feedTopBarBtn" aria-label="Direct">
            <DirectIcon />
          </button>
        </div>
      </header>

      {/* Scrollable area: stories + posts + spinner */}
      <div ref={feedScrollRef} className="feedScroll">
        <StoryTray />
        {POSTS.map(post => (
          <Post
            key={post.id}
            {...post}
            containerRef={post.isTarget ? targetRef : undefined}
            onLike={handleLike}
            onSponsoredTap={post.isSponsored ? handleSponsoredTap : undefined}
          />
        ))}
        <div className="loadingArea">
          <div className="spinner" />
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav className="feedBottomBar">
        <button className="tabBtn tabBtnActive" aria-label="Home">
          <HomeIcon />
        </button>
        <button className="tabBtn" aria-label="Explore">
          <SearchIcon />
        </button>
        <button className="tabCenterBtn" aria-label="Add post">
          <AddSquareIcon />
        </button>
        <button className="tabBtn" aria-label="Activity">
          <ActivityIcon />
        </button>
        <button className="tabBtn" aria-label="Profile">
          <ProfileIcon />
        </button>
      </nav>

    </div>
  )
}
