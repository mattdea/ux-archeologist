// src/components/web/pages/YahooDirectory.jsx
// 1996 Yahoo! directory homepage — era-authentic artifact content
import yahooHeader from '../../../assets/yahoo-w-icons.png'
import bannerAd    from '../../../assets/banner-ad.png'
import styles from './YahooDirectory.module.css'

// ── Categories (left column) ────────────────────────────────────────
const CATEGORIES_LEFT = [
  {
    label: 'Arts and Humanities',
    subs: 'Photography, Architecture, Literature...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Business and Economy',
    subs: 'Companies, Finance, Employment...',
    highlight: false, xtra: true, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Computers and Internet',
    subs: 'Internet, WWW, Software, Multimedia...',
    highlight: true, xtra: false,
    navigateTo: 'yahoo-computers',
    hoverUrl: 'http://www.yahoo.com/Computers_and_Internet/',
  },
  {
    label: 'Education',
    subs: 'Universities, K-12, College Entrance...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Entertainment',
    subs: 'Cool Links, Movies, Music, Television...',
    highlight: false, xtra: true, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Government',
    subs: 'Law, Military, Politics, Agencies...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Health',
    subs: 'Medicine, Drugs, Diseases, Fitness...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
]

// ── Categories (right column) ───────────────────────────────────────
const CATEGORIES_RIGHT = [
  {
    label: 'News and Media',
    subs: 'Current Events, Magazines, TV, Newspapers...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Recreation and Sports',
    subs: 'Sports, Games, Travel, Autos, Outdoors...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Reference',
    subs: 'Libraries, Dictionaries, Phone Numbers...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Regional',
    subs: 'Countries, Regions, U.S. States...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Science',
    subs: 'CS, Biology, Astronomy, Engineering...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Social Science',
    subs: 'Anthropology, Economics, Psychology...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
  {
    label: 'Society and Culture',
    subs: 'People, Environment, Religion, Diversity...',
    highlight: false, xtra: false, navigateTo: null, hoverUrl: null,
  },
]

// ── Category list component ─────────────────────────────────────────
function CategoryList({ items, onNavigate, onLinkHover }) {
  return (
    <ul className={styles.catList}>
      {items.map(({ label, subs, highlight, xtra, navigateTo, hoverUrl }) => (
        <li key={label} className={styles.catItem}>
          <span
            className={`${styles.catLink} ${highlight ? styles.catLinkHL : ''} ${navigateTo ? styles.catLinkClickable : ''}`}
            onClick={navigateTo ? () => onNavigate(navigateTo) : undefined}
            onMouseEnter={hoverUrl ? () => onLinkHover(hoverUrl) : undefined}
            onMouseLeave={hoverUrl ? () => onLinkHover(null) : undefined}
          >
            {label}
          </span>
          {xtra && <span className={styles.xtra}> [Xtra!]</span>}
          <br />
          <span className={styles.catSubs}>{subs}</span>
        </li>
      ))}
    </ul>
  )
}

// ── Main component ──────────────────────────────────────────────────
export default function YahooDirectory({ onNavigate = () => {}, onLinkHover = () => {} }) {
  return (
    <div className={styles.page}>

      {/* ── Header (logo + icon links combined image) ─────────── */}
      <div className={styles.logoRow}>
        <img src={yahooHeader} alt="Yahoo!" className={styles.logoImg} />
      </div>

      {/* ── Banner ad — 3-column layout matching real site ───────── */}
      <div className={styles.bannerRow}>
        <div className={styles.bannerSide}>
          <span className={styles.bannerSideLink}>Find a Job</span>
        </div>
        <img src={bannerAd} alt="Advertisement" className={styles.bannerImg} />
        <div className={styles.bannerSide}>
          <span className={styles.navLink}>NBA</span>
          {' - '}
          <span className={styles.navLink}>NHL</span>
          <br />
          Finals
        </div>
      </div>

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

      {/* ── Utility nav row ───────────────────────────────────── */}
      <p className={styles.utilNav}>
        {[
          'Yellow Pages', 'People Search', 'Maps',
          'Classifieds', 'News', 'Stock Quotes', 'Sports Scores',
        ].map((item, i, arr) => (
          <span key={item}>
            <span className={styles.navLink}>{item}</span>
            {i < arr.length - 1 && <span className={styles.utilSep}> - </span>}
          </span>
        ))}
      </p>

      <hr className={styles.divider} />

      {/* ── Category directory ────────────────────────────────── */}
      <div className={styles.categories}>
        <div className={styles.col}>
          <CategoryList items={CATEGORIES_LEFT}  onNavigate={onNavigate} onLinkHover={onLinkHover} />
        </div>
        <div className={styles.col}>
          <CategoryList items={CATEGORIES_RIGHT} onNavigate={onNavigate} onLinkHover={onLinkHover} />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Yahoo services row ────────────────────────────────── */}
      <p className={styles.footerLinks}>
        {[
          'My Yahoo!', 'Yahooligans! for Kids', 'Yahoo! Internet Life',
          'Weekly Picks', "Today's Web Events", 'Chat',
          'Weather Forecasts', 'Random Yahoo! Link', 'Yahoo! Shop',
        ].map((item, i, arr) => (
          <span key={item}>
            <span className={styles.navLink}>{item}</span>
            {i < arr.length - 1 && ' - '}
          </span>
        ))}
      </p>

      {/* ── National Yahoos ───────────────────────────────────── */}
      <p className={styles.footerRow}>
        <strong className={styles.footerLabel}>National Yahoos: </strong>
        {['Canada', 'France', 'Germany', 'Japan', 'U.K. & Ireland'].map((c, i, arr) => (
          <span key={c}>
            <span className={styles.navLink}>{c}</span>
            {i < arr.length - 1 && ' - '}
          </span>
        ))}
      </p>

      {/* ── Yahoo! Metros ─────────────────────────────────────── */}
      <p className={styles.footerRow}>
        <strong className={styles.footerLabel}>Yahoo! Metros: </strong>
        {['Atlanta', 'Austin', 'Boston', 'Chicago', 'Los Angeles', 'New York', 'S.F. Bay', 'Seattle'].map((c, i, arr) => (
          <span key={c}>
            <span className={styles.navLink}>{c}</span>
            {i < arr.length - 1 && ' - '}
          </span>
        ))}
      </p>

      <hr className={styles.divider} />

      {/* ── Bottom links ──────────────────────────────────────── */}
      <p className={styles.bottomLinks}>
        {[
          'How to Include Your Site', 'Company Information',
          'Contributors', 'Yahoo! to Go',
        ].map((item, i, arr) => (
          <span key={item}>
            <span className={styles.navLink}>{item}</span>
            {i < arr.length - 1 && ' - '}
          </span>
        ))}
      </p>
      <p className={styles.copyright}>
        Copyright &copy; 1996 Yahoo! Inc. All Rights Reserved
      </p>

    </div>
  )
}
