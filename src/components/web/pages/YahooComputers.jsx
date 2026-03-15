// src/components/web/pages/YahooComputers.jsx
// Yahoo! — Computers and Internet subcategory page, ~1996
import styles from './YahooComputers.module.css'

const SUBCATEGORIES = [
  'Artificial Intelligence',
  'Companies@',
  'Hardware',
  'Internet',
  'Operating Systems',
  'Programming Languages',
  'Software',
  'World Wide Web',
]

const LISTED_SITES = [
  {
    name:       'Valley Computer Repair & Sales',
    url:        'http://www.valleycomputer.com/',
    desc:       'Bay Area PC repair, sales, and used equipment. 386/486/Pentium systems from $50.',
    navigateTo: 'valley',
  },
  {
    name:       'The Vintage Computer Archive',
    url:        'http://www.geocities.com/SiliconValley/4527/',
    desc:       'Hobbyist archive documenting personal computers from 1975–1990. Altair, Apple II, C64, and more.',
    navigateTo: 'archive',
  },
]

export default function YahooComputers({ onNavigate = () => {}, onLinkHover = () => {} }) {
  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ────────────────────────────────────────────── */}
      <p className={styles.breadcrumb}>
        <span className={styles.breadLink}>Yahoo!</span>
        {' > '}
        <strong>Computers and Internet</strong>
      </p>

      {/* ── Search ────────────────────────────────────────────────── */}
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          readOnly
          tabIndex={-1}
          placeholder=""
        />
        <button className={styles.searchBtn} tabIndex={-1}>Search</button>
        <span className={styles.searchScope}>in Computers and Internet</span>
      </div>

      <hr className={styles.divider} />

      {/* ── Subcategories ─────────────────────────────────────────── */}
      <h3 className={styles.sectionHead}>Categories</h3>
      <ul className={styles.subList}>
        {SUBCATEGORIES.map(s => (
          <li key={s} className={styles.subItem}>
            <span className={styles.subLink}>{s}</span>
          </li>
        ))}
      </ul>

      <hr className={styles.divider} />

      {/* ── Listed sites ──────────────────────────────────────────── */}
      <h3 className={styles.sectionHead}>Sites ({LISTED_SITES.length})</h3>
      <ul className={styles.siteList}>
        {LISTED_SITES.map(site => (
          <li key={site.name} className={styles.siteItem}>
            <span
              className={styles.siteLink}
              onClick={() => onNavigate(site.navigateTo)}
              onMouseEnter={() => onLinkHover(site.url)}
              onMouseLeave={() => onLinkHover(null)}
            >
              {site.name}
            </span>
            {' — '}
            <span className={styles.siteDesc}>{site.desc}</span>
          </li>
        ))}
      </ul>

    </div>
  )
}
