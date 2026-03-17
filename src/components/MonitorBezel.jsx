// src/components/MonitorBezel.jsx
import styles from './MonitorBezel.module.css'
import monitorSvg from '../../assets/MonitorBezel.svg'

function CrtOverlay() {
  return (
    <svg
      className={styles.crtOverlay}
      width="620"
      height="415"
      viewBox="0 0 620 415"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_14_1707)">
        <g filter="url(#filter0_f_14_1707)">
          <path d="M20.9331 -16.0204L212.511 -48.1347V288.511L20.9331 320.625V-16.0204Z" fill="white" fillOpacity="0.32"/>
        </g>
        <g filter="url(#filter1_f_14_1707)">
          <ellipse cx="310" cy="446.168" rx="310" ry="97.6678" fill="#B7B7B7" fillOpacity="0.28"/>
        </g>
        <g filter="url(#filter2_f_14_1707)">
          <ellipse cx="690.375" cy="228.125" rx="310" ry="97.6678" transform="rotate(-90 690.375 228.125)" fill="white" fillOpacity="0.37"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_f_14_1707" x="-29.0669" y="-98.1346" width="291.578" height="468.76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_14_1707"/>
        </filter>
        <filter id="filter1_f_14_1707" x="-43.5" y="305" width="707" height="282.336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="21.75" result="effect1_foregroundBlur_14_1707"/>
        </filter>
        <filter id="filter2_f_14_1707" x="552.707" y="-121.875" width="275.335" height="700" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_14_1707"/>
        </filter>
        <clipPath id="clip0_14_1707">
          <rect width="620" height="415" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default function MonitorBezel({ children }) {
  return (
    <div className={styles.monitor}>

      {/* Full device SVG — purely decorative */}
      <img
        src={monitorSvg}
        className={styles.bezelImg}
        draggable="false"
        aria-hidden="true"
        alt=""
      />

      {/* Interactive screen — overlaid on the SVG screen hole */}
      <div className={styles.screen}>
        {children}
        <CrtOverlay />
      </div>

    </div>
  )
}
