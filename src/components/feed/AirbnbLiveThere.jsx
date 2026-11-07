// src/components/feed/AirbnbLiveThere.jsx
// The advertiser's landing page for the feed's Airbnb ad, built locally so
// the in-app browser never loads today's airbnb.com. Rebuilt from a 2016
// screenshot of Airbnb's mobile homepage during the "Live There" campaign:
// white header (hamburger, centred Bélo wordmark), a full-bleed hero with
// LIVE THERE and the campaign subhead, a "Where to?" search field, then the
// dark footer. The hero was a video in 2016; here it's a still campaign-style
// photo (assets/feed/ads/airbnb-hero.jpg), deliberately with no play button.

import wordmark from '../../../assets/feed/ads/airbnb-wordmark.png'
import HERO from '../../../assets/feed/ads/airbnb-hero.jpg'

const LINKS = ['About', 'Careers', 'Press', 'Blog', 'Terms & Privacy']
const SOCIAL = ['f', 'g+', 't', 'in', 'p', '▶', 'ig']

export default function AirbnbLiveThere() {
  return (
    <div className="abnbPage">
      <header className="abnbHeader">
        <button className="abnbMenu" type="button" aria-label="Menu" />
        <img className="abnbWordmark" src={wordmark} alt="Airbnb" draggable={false} />
      </header>

      <section className="abnbHero">
        <img className="abnbHeroImg" src={HERO} alt="" draggable={false} />
        <div className="abnbHeroText">
          <h1>LIVE THERE</h1>
          <p>Book homes from local hosts in 191+ countries and experience a place like you live there.</p>
        </div>
        <div className="abnbSearch">
          <div className="abnbSearchField">Where to?</div>
          <button className="abnbSearchBtn" type="button" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path d="M12.5 12.5L18 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </section>

      <footer className="abnbFooter">
        <div className="abnbSelect">English</div>
        <div className="abnbSelect">USD</div>
        <div className="abnbLinks">{LINKS.map(l => <span key={l}>{l}</span>)}</div>
        <div className="abnbSocial" aria-hidden="true">{SOCIAL.map(s => <span key={s}>{s}</span>)}</div>
        <div className="abnbCopyright">© Airbnb, Inc.</div>
      </footer>
    </div>
  )
}
