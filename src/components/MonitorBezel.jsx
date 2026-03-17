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
      <g clipPath="url(#clip0_14_6688)">
        <g filter="url(#filter0_f_14_6688)">
          <path d="M20.9331 -16.0206L212.511 -48.1348V288.511L20.9331 320.625V-16.0206Z" fill="white" fillOpacity="0.45"/>
        </g>
        <g filter="url(#filter1_f_14_6688)">
          <ellipse cx="310" cy="446.168" rx="310" ry="97.6678" fill="#FEFEFE" fillOpacity="0.22"/>
        </g>
        <g filter="url(#filter2_f_14_6688)">
          <ellipse cx="665.375" cy="228.125" rx="310" ry="97.6678" transform="rotate(-90 665.375 228.125)" fill="white" fillOpacity="0.36"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_f_14_6688" x="0.933105" y="-68.1348" width="231.578" height="408.76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_14_6688"/>
        </filter>
        <filter id="filter1_f_14_6688" x="-11.4" y="337.1" width="642.8" height="218.136" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="5.7" result="effect1_foregroundBlur_14_6688"/>
        </filter>
        <filter id="filter2_f_14_6688" x="555.907" y="-93.675" width="218.935" height="643.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="5.9" result="effect1_foregroundBlur_14_6688"/>
        </filter>
        <clipPath id="clip0_14_6688">
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
