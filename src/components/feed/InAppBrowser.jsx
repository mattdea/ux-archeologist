// src/components/feed/InAppBrowser.jsx
// The in-app browser that opens when a sponsored post's "Learn More" (or the
// ad overlay's arrow) is tapped: a full-screen layer over the Instagram app
// that slides up from the bottom, keeps the simulated iOS status bar, hides
// the tab bar, and renders the advertiser's page locally.
//
// The chrome is a *reconstruction* — the exact early-2016 Instagram iOS
// browser bar has not been verified from a reference. Everything that would
// change if a better reference turns up lives in BROWSER_CHROME below.
//
// Props:
//   ad        — { name, domain, url, title, Page } from the post
//   closing   — true while the close animation plays (parent unmounts after)
//   onClose   — () => void

import { useEffect, useState } from 'react'
import StatusBar from './StatusBar'

// ── Reconstructed chrome: adjust here if a period reference is found ────────
export const BROWSER_CHROME = {
  slideMs: 350,                                   // open/close transition
  slideEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // iOS ease-out
  barHeight: 44,                                  // nav bar below the status bar
  barBackground: '#f7f7f7',
  barHairline: '#c8c7cc',                         // UIKit separator grey
  titleSize: 15,                                  // bold page title
  domainSize: 11,                                 // grey domain under it
  iconColor: '#333333',                           // X and ellipsis
  progressColor: '#1b6ac9',                       // loading bar
  progressHeight: 2,
  progressMs: 1100,                               // simulated page load
  pageBackground: '#f7f7f7',
}

const SHEET_ITEMS = ['Copy Link', 'Open in Safari']

export default function InAppBrowser({ ad, closing, onClose }) {
  const [loaded, setLoaded] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [copied, setCopied] = useState(false)
  const { name, domain, url, title, Page } = ad

  // The progress bar runs once as the "page" comes in.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), BROWSER_CHROME.progressMs)
    return () => clearTimeout(t)
  }, [])

  const choose = async (item) => {
    setSheet(false)
    if (item === 'Copy Link') {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch { /* clipboard unavailable */ }
    } else if (item === 'Open in Safari') {
      window.open(url, '_blank', 'noopener')
    }
  }

  const style = {
    '--browser-slide-ms': `${BROWSER_CHROME.slideMs}ms`,
    '--browser-slide-ease': BROWSER_CHROME.slideEase,
    '--browser-bar-h': `${BROWSER_CHROME.barHeight}px`,
    '--browser-bar-bg': BROWSER_CHROME.barBackground,
    '--browser-hairline': BROWSER_CHROME.barHairline,
    '--browser-title-size': `${BROWSER_CHROME.titleSize}px`,
    '--browser-domain-size': `${BROWSER_CHROME.domainSize}px`,
    '--browser-icon': BROWSER_CHROME.iconColor,
    '--browser-progress': BROWSER_CHROME.progressColor,
    '--browser-progress-h': `${BROWSER_CHROME.progressHeight}px`,
    '--browser-progress-ms': `${BROWSER_CHROME.progressMs}ms`,
    '--browser-page-bg': BROWSER_CHROME.pageBackground,
  }

  return (
    <div className={closing ? 'inAppBrowser inAppBrowserClosing' : 'inAppBrowser'} style={style} role="dialog" aria-label={`${name} website`}>
      <div className="browserTop">
        <StatusBar />
        <div className="browserBar">
          <button className="browserBtn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </button>
          <div className="browserTitle">
            <div className="browserTitleText">{title || name}</div>
            <div className="browserDomain">{domain}</div>
          </div>
          <button className="browserBtn" onClick={() => setSheet(true)} aria-label="More options">
            <svg width="20" height="6" viewBox="0 0 20 6" aria-hidden="true">
              <circle cx="3" cy="3" r="2" fill="currentColor" />
              <circle cx="10" cy="3" r="2" fill="currentColor" />
              <circle cx="17" cy="3" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>
        <div className="browserProgressTrack">
          {!loaded && <div className="browserProgress" />}
        </div>
      </div>

      <div className="browserPage">
        {loaded ? <Page /> : <div className="browserBlank" />}
      </div>

      {copied && <div className="browserToast">Link copied</div>}

      {sheet && (
        <div className="actionSheetBackdrop" onClick={() => setSheet(false)}>
          <div className="actionSheet" onClick={e => e.stopPropagation()}>
            <div className="actionSheetGroup">
              {SHEET_ITEMS.map(item => (
                <button key={item} className="actionSheetBtn" onClick={() => choose(item)}>{item}</button>
              ))}
            </div>
            <div className="actionSheetGroup">
              <button className="actionSheetBtn actionSheetCancel" onClick={() => setSheet(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
