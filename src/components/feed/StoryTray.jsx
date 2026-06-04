// src/components/feed/StoryTray.jsx
// Decorative story circles — 2016 Instagram gradient rings.
// Static/visual only; no click handlers this prompt.

const STORIES = [
  { username: 'j.okafor',    color: '#e17055', initial: 'J' },
  { username: 'mia.c',       color: '#a29bfe', initial: 'M' },
  { username: 'sunrise',     color: '#00b894', initial: 'S' },
  { username: 'cafe.list',   color: '#fdcb6e', initial: 'C' },
  { username: 'nadia_s',     color: '#0984e3', initial: 'N' },
  { username: 'pete.photo',  color: '#6c5ce7', initial: 'P' },
  { username: 'lena.out',    color: '#d63031', initial: 'L' },
]

export default function StoryTray() {
  return (
    <div className="storyTray">

      {/* Your Story — no gradient ring, blue plus badge */}
      <div className="storyItem">
        <div className="yourStoryOuter">
          <div className="yourStoryAvatar">
            {/* Person silhouette */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="11" r="6" stroke="#aaaaaa" strokeWidth="1.5" />
              <path d="M4 27c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="#aaaaaa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="yourStoryPlus">+</div>
        </div>
        <span className="storyUsername">Your Story</span>
      </div>

      {STORIES.map(({ username, color, initial }) => (
        <div className="storyItem" key={username}>
          <div className="storyRingOuter">
            <div className="storyAvatarWrap">
              <div className="storyAvatar" style={{ background: color }}>
                {initial}
              </div>
            </div>
          </div>
          <span className="storyUsername">{username}</span>
        </div>
      ))}

    </div>
  )
}
