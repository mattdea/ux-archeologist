// src/components/MonitorBezel.jsx
import styles from './MonitorBezel.module.css'
import appleLogo from '../../assets/apple-logo.png'

function AppleLogo() {
  return (
    <img
      src={appleLogo}
      alt=""
      aria-hidden="true"
      className={styles.appleSvg}
      height="22"
    />
  )
}

export default function MonitorBezel({ children, booting = false }) {
  return (
    <div className={styles.monitor}>
      <div className={styles.screenBezel}>
        <div className={styles.screen}>
          {children}
        </div>
      </div>
      <div className={styles.decorRow}>
        <AppleLogo />
        <span className={`${styles.led} ${booting ? styles.ledBooting : ''}`} />
      </div>
    </div>
  )
}
