// src/components/web/pages/YahooDirectory.jsx
// 1996 Yahoo! directory homepage — era-authentic artifact content
import styles from './YahooDirectory.module.css'

const LEFT_CATEGORIES = [
  { label: 'Arts & Humanities',    count: null,    highlight: false, navigateTo: null,              hoverUrl: null },
  { label: 'Business & Economy',  count: null,    highlight: false, navigateTo: null,              hoverUrl: null },
  { label: 'Computers & Internet', count: '248',   highlight: true,  navigateTo: 'yahoo-computers', hoverUrl: 'http://www.yahoo.com/Computers_and_Internet/' },
  { label: 'Education',           count: null,    highlight: false, navigateTo: null,              hoverUrl: null },
  { label: 'Entertainment',       count: '4,310', highlight: false, navigateTo: null,              hoverUrl: null },
]

const RIGHT_CATEGORIES = [
  { label: 'Government',          count: null, highlight: false, navigateTo: null, hoverUrl: null },
  { label: 'Health',              count: null, highlight: false, navigateTo: null, hoverUrl: null },
  { label: 'News & Media',        count: null, highlight: false, navigateTo: null, hoverUrl: null },
  { label: 'Recreation & Sports', count: null, highlight: false, navigateTo: null, hoverUrl: null },
  { label: 'Science',             count: null, highlight: false, navigateTo: null, hoverUrl: null },
]

function CategoryList({ items, onNavigate, onLinkHover }) {
  return (
    <ul className={styles.catList}>
      {items.map(({ label, count, highlight, navigateTo, hoverUrl }) => (
        <li key={label} className={styles.catItem}>
          <span
            className={`${styles.catLink} ${highlight ? styles.catLinkHL : ''} ${navigateTo ? styles.catLinkClickable : ''}`}
            onClick={navigateTo ? () => onNavigate(navigateTo) : undefined}
            onMouseEnter={hoverUrl ? () => onLinkHover(hoverUrl) : undefined}
            onMouseLeave={hoverUrl ? () => onLinkHover(null) : undefined}
          >
            {label}
          </span>
          {count && <span className={styles.catCount}> ({count})</span>}
        </li>
      ))}
    </ul>
  )
}

export default function YahooDirectory({ onNavigate = () => {}, onLinkHover = () => {} }) {
  return (
    <div className={styles.page}>

      {/* ── Logo ──────────────────────────────────────────────── */}
      <div className={styles.logoRow}>
        <h1 className={styles.logo}>Yahoo!</h1>
      </div>

      {/* ── Top nav links ─────────────────────────────────────── */}
      <p className={styles.topNav}>
        <span className={styles.navLink}>What's New</span>
        {' | '}
        <span className={styles.navLink}>What's Cool</span>
        {' | '}
        <span className={styles.navLink}>Today's News</span>
        {' | '}
        <span className={styles.navLink}>More Yahoos!</span>
      </p>

      <hr className={styles.divider} />

      {/* ── Search ────────────────────────────────────────────── */}
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          readOnly
          tabIndex={-1}
          placeholder=""
        />
        <button className={styles.searchBtn} tabIndex={-1}>Search</button>
        <span className={styles.searchOptions}>
          <span className={styles.navLink}>options</span>
        </span>
      </div>

      <hr className={styles.divider} />

      {/* ── Category directory ────────────────────────────────── */}
      <div className={styles.categories}>
        <div className={styles.col}>
          <CategoryList items={LEFT_CATEGORIES} onNavigate={onNavigate} onLinkHover={onLinkHover} />
        </div>
        <div className={styles.col}>
          <CategoryList items={RIGHT_CATEGORIES} onNavigate={onNavigate} onLinkHover={onLinkHover} />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Footer ────────────────────────────────────────────── */}
      <p className={styles.footer}>
        <span className={styles.navLink}>Write Us</span>
        {' - '}
        <span className={styles.navLink}>Add URL</span>
        {' - '}
        <span className={styles.navLink}>Info</span>
        {' - '}
        <span className={styles.navLink}>Company</span>
      </p>
      <p className={styles.copyright}>
        Copyright &copy; 1996 Yahoo! Inc. All Rights Reserved
      </p>

    </div>
  )
}
