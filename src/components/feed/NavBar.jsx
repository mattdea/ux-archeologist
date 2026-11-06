// src/components/feed/NavBar.jsx
// Blue header shared by every screen: iOS status bar + 44pt nav bar.
// Props:
//   title    — centered node (string renders as bold white caps)
//   left     — node at the left edge (e.g. back chevron)
//   right    — node at the right edge (inbox tray, gear, add-person)
//   children — replaces the title (used for the Explore search field)

import StatusBar from './StatusBar'

export default function NavBar({ title, left, right, children }) {
  return (
    <div className="feedHeader">
      <StatusBar />
      <header className="feedNavBar">
        {left && <div className="feedNavLeft">{left}</div>}
        {children
          ? children
          : <div className="feedNavTitle">{title}</div>}
        {right && <div className="feedNavRight">{right}</div>}
      </header>
    </div>
  )
}
