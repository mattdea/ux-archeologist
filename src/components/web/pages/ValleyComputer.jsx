// src/components/web/pages/ValleyComputer.jsx
// Valley Computer Repair & Sales — small business GeoCities-era site, ~1996
import styles from './ValleyComputer.module.css'

const SERVICES = [
  { name: 'PC Tune-Up',          price: '$49' },
  { name: 'Virus Removal',       price: '$69' },
  { name: 'Memory Upgrade',      price: '$89' },
  { name: 'Hard Drive Install',  price: '$99' },
]

const NAV_ITEMS = ['Home', 'Services', 'Used Equipment', 'Contact Us']

export default function ValleyComputer() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ── Left sidebar ────────────────────────────────────── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>MENU</div>
          {NAV_ITEMS.map(item => (
            <span key={item} className={styles.sidebarLink}>{item}</span>
          ))}
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarContact}>
            <div className={styles.sidebarContactLine}>(408)</div>
            <div className={styles.sidebarContactLine}>555-0147</div>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div className={styles.main}>

          {/* Header */}
          <h1 className={styles.heading}>Valley Computer Repair &amp; Sales</h1>
          <p className={styles.subtitle}>Serving the Bay Area Since 1993</p>
          <hr className={styles.rule} />

          {/* Blinking specials banner */}
          <p className={styles.banner}>
            ★&nbsp;<span className={styles.blink}>SPECIALS THIS WEEK!</span>&nbsp;★
          </p>

          {/* Prices table */}
          <table className={styles.priceTable}>
            <thead>
              <tr>
                <th className={styles.priceThService}>Service</th>
                <th className={styles.priceThPrice}>Price</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map(s => (
                <tr key={s.name}>
                  <td className={styles.priceTd}>{s.name}</td>
                  <td className={`${styles.priceTd} ${styles.priceTdPrice}`}>{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className={styles.rule} />

          {/* Used Equipment section */}
          <h2 className={styles.sectionHead}>Used Equipment</h2>
          <p className={styles.body}>
            We carry a wide selection of pre-owned computers, monitors, and peripherals.
            All machines are tested and cleaned before sale. We specialize in
            386, 486, and early Pentium systems. Prices start at $50.
          </p>
          <p className={styles.body}>
            We also stock vintage machines for hobbyists and collectors — ask at the counter!
          </p>
          <p className={styles.body}>
            <span className={styles.link}>
              Check out The Vintage Computer Archive for collector info!
            </span>
          </p>

          <hr className={styles.rule} />

          {/* Contact */}
          <h2 className={styles.sectionHead}>Find Us</h2>
          <p className={styles.body}>
            <strong>Valley Computer Repair &amp; Sales</strong><br />
            1247 El Camino Real, Suite B<br />
            Sunnyvale, CA 94086<br />
            <br />
            Phone: <strong>(408) 555-0147</strong><br />
            Hours: Mon–Sat 9am–6pm<br />
            <br />
            Email:{' '}
            <span className={styles.link}>info@valleycomputer.net</span>
          </p>

          <hr className={styles.rule} />

          {/* Footer / counter */}
          <div className={styles.footer}>
            <span className={styles.counter}>Visitors:&nbsp;002,341</span>
            <span className={styles.geocities}>
              &nbsp;|&nbsp;★ Powered by&nbsp;
              <span className={styles.link}>GeoCities</span>
              &nbsp;★
            </span>
          </div>

        </div>{/* /main */}
      </div>{/* /layout */}
    </div>
  )
}
