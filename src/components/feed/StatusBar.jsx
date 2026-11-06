// src/components/feed/StatusBar.jsx
// iOS 7–10 status bar (the flat design iOS 8/9 shipped with), white over
// Instagram's blue nav bar. Glyph geometry and layout come from Black Pixel's
// MIT-licensed StatusBarLayer (github.com/gohypergiant/StatusBarLayer), which
// traces the real iOS assets:
//   signal  34 × 6pt at x 6.5 — five 5.5pt dots on a 7pt pitch
//   wifi    13 × 9.75pt, 4pt after the signal
//   time    12pt, weight 500, centered
//   battery 24.5 × 9.5pt, 5.5pt from the right edge; outline + fill bar

function SignalDots() {
  return (
    <svg width="34" height="6" viewBox="0 0 34 6" fill="currentColor" aria-hidden="true">
      <circle cx="2.75" cy="2.75" r="2.75" />
      <circle cx="9.75" cy="2.75" r="2.75" />
      <circle cx="16.75" cy="2.75" r="2.75" />
      <circle cx="23.75" cy="2.75" r="2.75" />
      <circle cx="30.75" cy="2.75" r="2.75" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="13" height="9.75" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
      <path d="M 8.085 13.63 L 11.995 18 L 15.905 13.63 C 13.752 11.454 10.238 11.454 8.085 13.63 Z M 4.085 9.16 L 6.085 11.39 C 9.376 8.192 14.614 8.192 17.905 11.39 L 19.905 9.16 C 15.479 4.943 8.521 4.943 4.095 9.16 Z M 11.995 0 C 7.576 0.001 3.322 1.681 0.095 4.7 L 2.095 6.93 C 7.659 1.691 16.341 1.691 21.905 6.93 L 23.905 4.7 C 20.676 1.678 16.418 -0.002 11.995 0 Z" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="24.5" height="9.5" viewBox="0 0 49 19" aria-hidden="true">
      <rect x="0.5" y="0.5" width="44" height="18" rx="3" ry="3" fill="none" stroke="currentColor" />
      <rect x="2" y="2" width="41" height="15" rx="1.5" ry="1.5" fill="currentColor" />
      <path d="M46,6v7a3.28,3.28,0,0,0,3-3.5A3.28,3.28,0,0,0,46,6Z" fill="currentColor" />
    </svg>
  )
}

export default function StatusBar() {
  return (
    <div className="iosStatusBar" aria-hidden="true">
      <div className="iosStatusLeft">
        <SignalDots />
        <WifiIcon />
      </div>
      <div className="iosStatusTime">9:41 AM</div>
      <div className="iosStatusRight">
        <BatteryIcon />
      </div>
    </div>
  )
}
