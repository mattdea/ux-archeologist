// src/components/feed/AirbnbLiveThere.jsx
// The advertiser's landing page for the feed's Airbnb ad, built locally so
// the in-app browser never loads today's airbnb.com. A *reconstruction* of a
// spring-2016 Airbnb mobile page for the "Don't just go there. Live there."
// campaign (launched April 2016): the original destination URL and page were
// not recovered, so this uses what is documented — the campaign line, Airbnb's
// 2016 identity (the Bélo mark, Rausch red #FF5A5F, Circular-like type set
// here in Helvetica), the flat, bordered mobile-web style of the time — and
// nothing that isn't (no banners, discounts or invented offers).
// Photos: the ad's campaign photo and Airbnb's own archived April 2016 posts.

import { adPhoto } from './libraryData'
import { ARCHIVE } from './archiveData'

const HERO = adPhoto('airbnb')
const HOMES = (ARCHIVE.airbnb?.posts || []).slice(0, 4)

/** Airbnb's Bélo (2014 mark), simplified to one path. */
function Belo({ size = 28, color = '#FF5A5F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill={color}
        d="M16 2.6c-1.9 0-3.4 1-4.4 2.9-.9 1.7-2.6 5.4-4.9 10.6l-1 2.3c-.6 1.4-.9 2.2-.9 3.2 0 3.5 2.7 6.2 6.2 6.2 2.1 0 3.9-1 5-2.7 1.1 1.7 2.9 2.7 5 2.7 3.5 0 6.2-2.7 6.2-6.2 0-1-.3-1.8-.9-3.2l-1-2.3c-2.3-5.2-4-8.9-4.9-10.6-1-1.9-2.5-2.9-4.4-2.9zm0 2.4c1 0 1.7.5 2.3 1.6.8 1.6 2.5 5.3 4.8 10.4l1 2.2c.5 1.1.7 1.7.7 2.4 0 2.2-1.6 3.8-3.8 3.8-1.8 0-3.2-1.1-4.3-3.5 1.5-2.1 2.6-4 2.6-5.9 0-2-1.4-3.4-3.3-3.4s-3.3 1.4-3.3 3.4c0 1.9 1.1 3.8 2.6 5.9-1.1 2.4-2.5 3.5-4.3 3.5-2.2 0-3.8-1.6-3.8-3.8 0-.7.2-1.3.7-2.4l1-2.2c2.3-5.1 4-8.8 4.8-10.4.6-1.1 1.3-1.6 2.3-1.6zm0 10.1c.7 0 1.1.5 1.1 1.2 0 .9-.6 2.1-1.1 3-.5-.9-1.1-2.1-1.1-3 0-.7.4-1.2 1.1-1.2z"
      />
    </svg>
  )
}

export default function AirbnbLiveThere() {
  return (
    <div className="abnbPage">
      <header className="abnbHeader">
        <Belo />
        <span className="abnbWordmark">airbnb</span>
        <button className="abnbLogin" type="button">Log in</button>
      </header>

      <section className="abnbHero">
        {HERO
          ? <img className="abnbHeroImg" src={HERO} alt="" draggable={false} />
          : <div className="abnbHeroImg abnbHeroFallback" />}
        <div className="abnbHeroText">
          <h1>Don’t just go there.<br />Live there.</h1>
        </div>
      </section>

      <section className="abnbIntro">
        <p>
          Even if it’s just for a night, you can live in a home that’s truly
          part of the place: a flat in the neighborhood locals love, a treehouse
          in the woods, a room with a view you’d never find from a hotel.
        </p>
        <button className="abnbCta" type="button">Explore homes</button>
      </section>

      {HOMES.length > 0 && (
        <section className="abnbHomes">
          <h2>Live like a local</h2>
          <div className="abnbGrid">
            {HOMES.map(p => (
              <figure key={p.code} className="abnbCard">
                <img src={p.url} alt="" draggable={false} />
                <figcaption>{p.caption.split(/[.!]/)[0]}.</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <footer className="abnbFooter">
        <span>© 2016 Airbnb, Inc.</span>
        <span>Terms · Privacy</span>
      </footer>
    </div>
  )
}
