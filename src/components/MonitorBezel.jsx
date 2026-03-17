// src/components/MonitorBezel.jsx
import styles from './MonitorBezel.module.css'
import appleBadge from '../../assets/new-apple-badge.svg'

function AppleBadge() {
  return (
    <div className={styles.appleBadge} aria-hidden="true">
      <img
        src={appleBadge}
        alt=""
        className={styles.appleBadgeImg}
        draggable="false"
      />
    </div>
  )
}

function CrtGlint() {
  return (
    <svg
      className={styles.crtGlint}
      xmlns="http://www.w3.org/2000/svg"
      width="263"
      height="371"
      viewBox="0 0 263 371"
      fill="none"
      aria-hidden="true"
    >
      <g filter="url(#crtGlintBlur)">
        <path d="M20.9331 -16.0205L212.511 -48.1347V288.511L20.9331 320.625V-16.0205Z" fill="white" fillOpacity="0.25"/>
      </g>
      <defs>
        <filter id="crtGlintBlur" x="-29.0669" y="-98.1347" width="291.578" height="468.76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_12_871"/>
        </filter>
      </defs>
    </svg>
  )
}

function CrtBottom() {
  return (
    <svg
      className={styles.crtBottom}
      width="620"
      height="110"
      viewBox="0 0 620 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#crtBottomBlur)">
        <ellipse cx="310" cy="141.168" rx="310" ry="97.6678" fill="#B7B7B7" fillOpacity="0.22"/>
      </g>
      <defs>
        <filter id="crtBottomBlur" x="-43.5" y="0" width="707" height="282.336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="21.75" result="effect1_foregroundBlur_12_873"/>
        </filter>
      </defs>
    </svg>
  )
}

function CrtRight() {
  return (
    <svg
      className={styles.crtRight}
      width="68"
      height="415"
      viewBox="0 0 68 415"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#crtRightBlur)">
        <ellipse cx="137.668" cy="228.125" rx="310" ry="97.6678" transform="rotate(-90 137.668 228.125)" fill="white" fillOpacity="0.29"/>
      </g>
      <defs>
        <filter id="crtRightBlur" x="0" y="-121.875" width="275.335" height="700" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_12_874"/>
        </filter>
      </defs>
    </svg>
  )
}

export default function MonitorBezel({ children, booting = false }) {
  return (
    <div className={styles.monitor}>
      <div className={styles.screenBezel}>
        <div className={styles.screen}>
          {children}
          <CrtGlint />
          <CrtBottom />
          <CrtRight />
        </div>
      </div>
      <div className={styles.decorRow}>
        <AppleBadge />
        <div className={styles.rightDecor}>
          <div className={styles.floppyDrive}>
            <div className={styles.floppySlot} />
            <div className={styles.floppyButton} />
          </div>
          <span className={`${styles.led} ${booting ? styles.ledBooting : ''}`} />
        </div>
      </div>
    </div>
  )
}
