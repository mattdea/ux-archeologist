// src/pages/collection/DeviceArt.jsx
//
// Small flat drawings of each room's device for the collection cards: a
// card's illustration, not a replica. Every drawing shares one 160 × 120
// viewBox so they sit the same way on their plates; the plate colour comes
// from the card (PLATES in Collection.jsx).

const INK = '#2a2620'   // outlines on the light devices

function VT100() {
  return (
    <g>
      {/* monitor */}
      <rect x="20" y="10" width="120" height="78" rx="9" fill="#ece3cf" />
      <rect x="20" y="10" width="120" height="78" rx="9" fill="none" stroke="#c9bea6" />
      <rect x="27" y="17" width="80" height="62" rx="8" fill="#1d1d1b" />
      <rect x="32" y="22" width="70" height="52" rx="5" fill="#0d1610" />
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={37 + (i % 2) * 4} y={29 + i * 7} width={[34, 22, 40, 18, 28][i]} height="2.2" rx="1" fill="#6fe39a" opacity={i === 4 ? 1 : 0.85} />
      ))}
      <rect x="37" y="64" width="4" height="5" fill="#6fe39a" />
      {/* the badge */}
      <rect x="112" y="64" width="22" height="7" rx="1.5" fill="#1d1d1b" />
      <rect x="125" y="66" width="7" height="3" rx="0.6" fill="#d24b3a" />
      {/* keyboard */}
      <path d="M14 96 h132 l-6 16 h-120 z" fill="#ddd2bb" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={24 + i * 8.8} y="100" width="6.6" height="3.4" rx="0.8" fill="#bfb39a" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={28 + i * 8.8} y="105.5" width="6.6" height="3.4" rx="0.8" fill="#bfb39a" />
      ))}
    </g>
  )
}

function Macintosh() {
  return (
    <g>
      {/* mouse and cord */}
      <path d="M112 96 C 124 96, 126 82, 132 82" fill="none" stroke={INK} strokeWidth="1" />
      <rect x="128" y="80" width="12" height="18" rx="4" fill="#efe8d8" stroke={INK} strokeWidth="1" />
      <line x1="129" y1="86" x2="139" y2="86" stroke={INK} strokeWidth="0.8" />
      {/* case */}
      <rect x="44" y="6" width="72" height="96" rx="7" fill="#efe8d8" stroke={INK} strokeWidth="1.2" />
      <rect x="50" y="12" width="60" height="50" rx="5" fill="#ddd4c1" />
      <rect x="55" y="17" width="50" height="38" rx="2.5" fill="#f8f7f2" stroke={INK} strokeWidth="0.8" />
      {/* the desktop: menu bar, grey pattern, icons */}
      <rect x="56" y="18" width="48" height="4" fill="#fff" />
      <line x1="56" y1="22" x2="104" y2="22" stroke={INK} strokeWidth="0.6" />
      <rect x="56" y="22.5" width="48" height="31.5" fill="url(#macGrey)" />
      <rect x="94" y="25" width="6" height="5" fill="#fff" stroke={INK} strokeWidth="0.5" />
      <rect x="94.5" y="33" width="5" height="6" fill="#fff" stroke={INK} strokeWidth="0.5" />
      <rect x="94" y="45" width="6" height="6" fill="#fff" stroke={INK} strokeWidth="0.5" />
      {/* Apple logo and floppy slot */}
      {['#61bb46', '#fdb827', '#f5821f', '#e03a3e', '#963d97', '#009ddc'].map((c, i) => (
        <rect key={c} x="53" y={74 + i * 1.3} width="5" height="1.3" fill={c} />
      ))}
      <rect x="80" y="76" width="24" height="2.4" rx="1" fill={INK} />
      {/* foot */}
      <path d="M48 102 h64 l-3 6 h-58 z" fill="#ddd4c1" stroke={INK} strokeWidth="1" />
    </g>
  )
}

function Netscape() {
  return (
    <g>
      <rect x="16" y="10" width="128" height="98" fill="#c3c3c3" stroke="#1b1b1b" strokeWidth="1" />
      <rect x="18" y="12" width="124" height="9" fill="#00007b" />
      <rect x="21" y="15" width="34" height="3" fill="#fff" opacity="0.9" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x={20 + i * 15} y="24" width="13" height="10" fill="#d9d9d9" stroke="#7b7b7b" strokeWidth="0.6" />
      ))}
      <rect x="20" y="37" width="96" height="6" fill="#fff" stroke="#7b7b7b" strokeWidth="0.6" />
      {/* the N box */}
      <rect x="122" y="24" width="18" height="19" fill="#22337a" stroke="#1b1b1b" strokeWidth="0.6" />
      <circle cx="131" cy="38" r="9" fill="#2e5fb3" opacity="0.7" />
      <text x="131" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#fff">N</text>
      {/* the page */}
      <rect x="20" y="46" width="120" height="58" fill="#fff" stroke="#7b7b7b" strokeWidth="0.6" />
      <text x="80" y="60" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" fontWeight="700" fill="#d0021b" letterSpacing="0.5">YAHOO!</text>
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={28 + (i % 2) * 56} y={69 + Math.floor(i / 2) * 15} width={i % 2 ? 36 : 44} height="2.6" fill="#0000ee" />
          <rect x={28 + (i % 2) * 56} y={72.6 + Math.floor(i / 2) * 15} width={i % 2 ? 36 : 44} height="0.6" fill="#0000ee" />
          <rect x={28 + (i % 2) * 56} y={76 + Math.floor(i / 2) * 15} width={i % 2 ? 30 : 38} height="1.6" fill="#9a9a9a" />
        </g>
      ))}
    </g>
  )
}

function IPhone() {
  return (
    <g>
      <rect x="55" y="3" width="50" height="108" rx="10" fill="#c9ccd1" />
      <rect x="57" y="5" width="46" height="104" rx="8.5" fill="#141414" />
      <rect x="74" y="11" width="12" height="2" rx="1" fill="#3a3a3a" />
      {/* lock screen */}
      <defs>
        <linearGradient id="lockGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f8394" />
          <stop offset="1" stopColor="#c4ced6" />
        </linearGradient>
      </defs>
      <rect x="60" y="18" width="40" height="66" fill="url(#lockGlass)" />
      {[[66, 46], [88, 54], [72, 64], [93, 40], [64, 74], [84, 70]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#fff" opacity="0.55" />
      ))}
      <rect x="60" y="18" width="40" height="18" fill="#000" opacity="0.45" />
      <text x="80" y="31" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="9" fontWeight="300" fill="#fff">12:52</text>
      <rect x="60" y="74" width="40" height="10" fill="#000" opacity="0.45" />
      <rect x="62" y="76.5" width="36" height="5" rx="2.5" fill="#2a2a2a" stroke="#555" strokeWidth="0.4" />
      <rect x="63" y="77.2" width="8" height="3.6" rx="1.8" fill="#e8e8e8" />
      <path d="M65.2 79 h3.2 m-1.2 -1.1 l1.2 1.1 l-1.2 1.1" stroke="#555" strokeWidth="0.6" fill="none" />
      {/* home button */}
      <circle cx="80" cy="96" r="5.5" fill="#141414" stroke="#3d3d3d" strokeWidth="0.9" />
      <rect x="77.8" y="93.8" width="4.4" height="4.4" rx="0.8" fill="none" stroke="#5a5a5a" strokeWidth="0.5" />
    </g>
  )
}

function Instagram() {
  return (
    <g>
      <rect x="54" y="2" width="52" height="110" rx="11" fill="#f3f3f1" stroke="#b9b9b6" strokeWidth="1" />
      <rect x="76" y="7" width="8" height="1.6" rx="0.8" fill="#b9b9b6" />
      <rect x="57" y="13" width="46" height="82" fill="#fff" />
      <rect x="57" y="13" width="46" height="10" fill="#12558a" />
      <rect x="71" y="17" width="18" height="2.6" rx="1.3" fill="#fff" opacity="0.95" />
      <circle cx="61.5" cy="27.5" r="2.5" fill="#d9c3a5" />
      <rect x="66" y="26.5" width="16" height="2" rx="1" fill="#12558a" />
      {/* the photo */}
      <defs>
        <linearGradient id="feedPhoto" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6c26b" />
          <stop offset="0.55" stopColor="#e9785d" />
          <stop offset="1" stopColor="#7b4a8c" />
        </linearGradient>
      </defs>
      <rect x="57" y="32" width="46" height="40" fill="url(#feedPhoto)" />
      <circle cx="91" cy="44" r="4.5" fill="#fff3d6" opacity="0.85" />
      <path d="M57 72 L70 58 L79 66 L87 59 L103 72 Z" fill="#4b2f5c" opacity="0.6" />
      <path d="M62 77.5 c-1.6 -1.7 -3.6 0.2 -2 1.9 l2 2 l2 -2 c1.6 -1.7 -0.4 -3.6 -2 -1.9 z" fill="#ed4956" />
      <rect x="59.5" y="84" width="14" height="1.8" rx="0.9" fill="#12558a" />
      <rect x="59.5" y="88" width="34" height="1.6" rx="0.8" fill="#c7c7c7" />
      <rect x="57" y="91" width="46" height="4" fill="#26272b" />
      <rect x="77" y="91" width="6" height="4" fill="#12558a" />
      <circle cx="80" cy="103" r="5" fill="none" stroke="#b9b9b6" strokeWidth="1" />
    </g>
  )
}

function Chat() {
  return (
    <g>
      <rect x="18" y="12" width="124" height="94" rx="10" fill="#1d1b19" />
      <rect x="86" y="22" width="46" height="11" rx="5.5" fill="#3a3632" />
      <rect x="91" y="26.5" width="32" height="2" rx="1" fill="#e9e3d9" opacity="0.85" />
      {[86, 100, 92, 64].map((w, i) => (
        <rect key={i} x="30" y={44 + i * 7} width={w} height="2.4" rx="1.2" fill="#e9e3d9" opacity={i === 3 ? 0.6 : 0.85} />
      ))}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={30 + i * 8} y="73" width="4" height="4" rx="1" fill="none" stroke="#8a8278" strokeWidth="0.8" />
      ))}
      <rect x="28" y="85" width="104" height="13" rx="6.5" fill="#2b2825" stroke="#4a453f" strokeWidth="0.8" />
      <rect x="35" y="90.5" width="34" height="2" rx="1" fill="#8a8278" />
      <circle cx="124" cy="91.5" r="4" fill="#d1a36f" />
      <path d="M124 93.5 v-3.6 m-1.6 1.6 l1.6 -1.6 l1.6 1.6" stroke="#1d1b19" strokeWidth="0.9" fill="none" />
    </g>
  )
}

const ART = [VT100, Macintosh, Netscape, IPhone, Instagram, Chat]

export default function DeviceArt({ level }) {
  const Art = ART[level]
  return (
    <svg viewBox="0 0 160 120" role="img" aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id="macGrey" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="#fff" />
          <rect width="1" height="1" fill="#8d8d8d" />
          <rect x="1" y="1" width="1" height="1" fill="#8d8d8d" />
        </pattern>
      </defs>
      {Art && <Art />}
    </svg>
  )
}
