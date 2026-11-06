// src/components/feed/ExploreTab.jsx
// Search tab, spring 2016: full-width dark-blue "Search" field, the
// "PRESS PLAY / Explore Videos" hero, a sideways-scrolling TRENDING TAGS row,
// and the EXPLORE POSTS grid that keeps loading as you scroll.
// Props:
//   onOpenPost — (post) => void

import { useState, useRef, useCallback, useMemo } from 'react'
import NavBar from './NavBar'
import PhotoGrid from './PhotoGrid'
import { TRENDING_TAGS, exploreImage, exploreTile } from './feedData'
import { SearchFieldIcon, PlayCircleIcon, ChevronRightIcon } from './icons'

const PAGE = 15
const INITIAL = 21

// Deterministic star field for the hero: 70 points, drawn once.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = (i * 9301 + 49297) % 233280
  const b = (i * 4973 + 7919) % 233280
  return { x: (a / 233280) * 320, y: (b / 233280) * 130, r: 0.4 + ((i * 7) % 5) * 0.25 }
})

export default function ExploreTab({ onOpenPost }) {
  const [count, setCount] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const scrollRef = useRef(null)

  const tiles = useMemo(() => Array.from({ length: count }, (_, i) => exploreTile(i)), [count])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || loadingRef.current) return
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 240) {
      loadingRef.current = true
      setLoading(true)
      setTimeout(() => {
        setCount(c => c + PAGE)
        setLoading(false)
        loadingRef.current = false
      }, 650)
    }
  }, [])

  return (
    <>
      <NavBar>
        <div className="searchField" role="search">
          <SearchFieldIcon />
          <span>Search</span>
        </div>
      </NavBar>

      <div ref={scrollRef} className="feedScroll" onScroll={handleScroll}>

        {/* Hero banner */}
        <button className="exploreHero" aria-label="Explore videos">
          <svg className="exploreHeroStars" viewBox="0 0 320 130" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={0.5 + (i % 3) * 0.2} />)}
          </svg>
          <div className="exploreHeroText">
            <PlayCircleIcon />
            <div className="exploreHeroTitle">PRESS PLAY</div>
            <div className="exploreHeroSub">EXPLORE VIDEOS</div>
          </div>
        </button>

        {/* Trending tags */}
        <div className="sectionHead">
          <span className="sectionLabel">TRENDING TAGS</span>
          <button className="seeAll">See All <ChevronRightIcon /></button>
        </div>
        <div className="tagRow">
          {TRENDING_TAGS.map(t => (
            <button key={t.tag} className="tagCard">
              <div className="tagThumb">
                <img src={exploreImage(t.image)} alt="" draggable={false} />
              </div>
              <div className="tagLabel">{t.tag}</div>
            </button>
          ))}
        </div>

        {/* Explore posts */}
        <div className="sectionHead sectionHeadGrid">
          <span className="sectionLabel">EXPLORE POSTS</span>
        </div>
        <PhotoGrid tiles={tiles} onOpenPost={onOpenPost} />
        <div className="loadingArea" style={{ visibility: loading ? 'visible' : 'hidden' }}>
          <div className="spinner" />
        </div>
      </div>
    </>
  )
}
