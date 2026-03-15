// src/components/web/pages/VintageArchive.jsx
// The Vintage Computer Archive — hobbyist collection page, ~1997
import styles from './VintageArchive.module.css'

const MACHINES = [
  {
    name: 'Altair 8800',
    year: '1975',
    description:
      'The kit computer that launched the personal computing revolution. ' +
      'No keyboard, no monitor — you programmed it by flipping switches and reading ' +
      'blinking lights. Bill Gates and Paul Allen wrote their first product for this machine.',
  },
  {
    name: 'Apple II',
    year: '1977',
    description:
      'Apple\'s first mass-market success. The open architecture invited hobbyists to add ' +
      'their own expansion cards, and VisiCalc — the first spreadsheet — made it a serious ' +
      'business machine. Schools bought these by the thousands.',
  },
  {
    name: 'Commodore 64',
    year: '1982',
    description:
      'The best-selling personal computer of all time. 64K of RAM felt enormous in 1982. ' +
      'Its SID sound chip was years ahead of anything else on the market, making it ' +
      'the platform of choice for game developers throughout the decade.',
  },
  {
    name: 'Macintosh 128k',
    year: '1984',
    description:
      'The machine that proved interfaces could be intuitive. The first computer my mom ' +
      'could use without reading a manual.',
  },
]

const READING = [
  { label: 'Computer History Museum',    target: false, url: null },
  { label: 'A Brief History of the Web', target: true,  url: 'http://www.w3.org/History.html' },
  { label: 'The GUI Gallery',            target: false, url: null },
]

export default function VintageArchive({ completeObjective = () => {}, onLinkHover = () => {} }) {
  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h1 className={styles.title}>The Vintage Computer Archive</h1>
        <p className={styles.subtitle}>Documenting the machines that started it all</p>
        <p className={styles.lastUpdated}>Last updated: March 14, 1997</p>
      </div>

      <div className={styles.rule} />

      {/* ── Machine entries ─────────────────────────────────────── */}
      {MACHINES.map(machine => (
        <div key={machine.name} className={styles.entry}>
          <h2 className={styles.machineName}>
            {machine.name}
            <span className={styles.machineYear}> ({machine.year})</span>
          </h2>
          <div className={styles.entryBody}>
            <div className={styles.imgBox}>
              <span className={styles.imgLabel}>{machine.name}</span>
              <span className={styles.imgSubLabel}>[photograph]</span>
            </div>
            <p className={styles.description}>{machine.description}</p>
          </div>
          <div className={styles.entryClear} />
        </div>
      ))}

      <div className={styles.rule} />

      {/* ── Recommended Reading ─────────────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recommended Reading</h3>
        <ul className={styles.readingList}>
          {READING.map(({ label, target, url }) => (
            <li key={label} className={styles.readingItem}>
              <span
                className={`${styles.link} ${target ? styles.linkTarget : ''} ${target ? styles.linkTargetClickable : ''}`}
                onClick={target ? () => completeObjective('findPaper') : undefined}
                onMouseEnter={url ? () => onLinkHover(url) : undefined}
                onMouseLeave={url ? () => onLinkHover(null) : undefined}
              >
                {target && <span className={styles.newBadge}>NEW!</span>}
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.rule} />

      {/* ── Webring ─────────────────────────────────────────────── */}
      <div className={styles.webring}>
        <span className={styles.webringLabel}>Retro Computing Webring:</span>
        {' '}
        <span className={styles.link}>[prev]</span>
        {' '}
        <span className={styles.link}>[random]</span>
        {' '}
        <span className={styles.link}>[next]</span>
      </div>

      <div className={styles.rule} />

      {/* ── Footer ──────────────────────────────────────────────── */}
      <p className={styles.construction}>⚠&nbsp;UNDER CONSTRUCTION&nbsp;⚠</p>
      <p className={styles.guestbook}>
        <span className={styles.link}>✍ Sign our Guestbook!</span>
        {' | '}
        <span className={styles.link}>Read Guestbook</span>
      </p>
      <p className={styles.resolution}>
        Best viewed at 800×600 resolution with Netscape Navigator 3.0
      </p>

    </div>
  )
}
