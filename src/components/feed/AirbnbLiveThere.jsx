// src/components/feed/AirbnbLiveThere.jsx
// The advertiser's landing page for the feed's Airbnb ad, built locally so
// the in-app browser never loads today's airbnb.com. A *reconstruction* of a
// spring-2016 Airbnb mobile page for the "Don't just go there. Live there."
// campaign (launched April 2016): the original destination URL and page were
// not recovered, so this uses what is documented — the campaign line, Airbnb's
// 2016 identity (the Bélo wordmark, Rausch red #FF5A5F, Circular Air type), the flat, bordered mobile-web style of the time — and
// nothing that isn't (no banners, discounts or invented offers).
// Photos: the ad's campaign photo and Airbnb's own archived April 2016 posts.

import { adPhoto } from './libraryData'
import wordmark from '../../../assets/feed/ads/airbnb-wordmark.png'
import { ARCHIVE } from './archiveData'

const HERO = adPhoto('airbnb')
const HOMES = (ARCHIVE.airbnb?.posts || []).slice(0, 4)

export default function AirbnbLiveThere() {
  return (
    <div className="abnbPage">
      <header className="abnbHeader">
        <img className="abnbWordmark" src={wordmark} alt="Airbnb" draggable={false} />
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
