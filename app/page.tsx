import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Img } from '@/components/Img';
import { RoomExplorer } from '@/components/RoomExplorer';
import { SquareMap } from '@/components/SquareMap';
import { Tower3D } from '@/components/architecture/Tower3D';
import { EnquireButton } from '@/components/EnquireButton';
import { IconArrow } from '@/components/Icons';
import { JsonLd, homeDescription, pageMeta, websiteLd } from '@/lib/seo';
import { dining, experiences, hotel, testimonials } from '@/content/site';

export const metadata: Metadata = pageMeta({ description: homeDescription, path: '/' });

export default function Home() {
  return (
    <>
      <JsonLd data={websiteLd} />
      <Hero />

      <section className="section" aria-labelledby="intro-title">
        <div className="wrap statement">
          <dl className="reveal">
            <div><dt>Since</dt><dd>{hotel.since}</dd></div>
            <div><dt>Rooms</dt><dd>{hotel.rooms}</dd></div>
            <div><dt>Check-in</dt><dd>{hotel.checkIn}</dd></div>
            <div><dt>Front desk</dt><dd>24 hours</dd></div>
          </dl>
          <div style={{ display: 'grid', gap: 'var(--s-6)' }}>
            <h2 id="intro-title" className="visually-hidden">About the hotel</h2>
            <p className="big reveal">
              A boutique design hotel with <em>a passion for meaningful comfort and practical luxury</em>, and an authentic
              experience of the Bhutan of today: a balance of traditional and modern.
            </p>
            <p className="reveal">
              <Link className="link" href="/about/">Our story <IconArrow /></Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="rooms-title">
        <div className="wrap">
          <div className="head">
            <h2 id="rooms-title" className="reveal">Rooms with the square in view</h2>
            <p className="lede reveal">
              Every room has its own bathroom, air conditioning, Wi-Fi and buffet breakfast. Choose a room and
              see your stay come together.
            </p>
          </div>
          <RoomExplorer />
        </div>
      </section>

      <section className="section night" aria-labelledby="tower-title">
        <div className="wrap">
          <div className="head">
            <h2 id="tower-title" className="reveal">Explore the tower</h2>
            <p className="lede reveal">
              Turn the building, lift its floors apart and pick any level to see what it holds. A model built from our own
              drawings of the facade.
            </p>
          </div>
          <Tower3D />
        </div>
      </section>

      <section className="section" aria-labelledby="square-title">
        <div className="wrap">
          <div className="head">
            <h2 id="square-title" className="reveal">The square from your window</h2>
            <p className="lede reveal">
              Clock Tower Square is where Thimphu gathers. These are moments photographed from the hotel. Choose one to see it.
            </p>
          </div>
          <SquareMap />
        </div>
      </section>

      <section className="band" aria-labelledby="dining-title">
        <div className="frame">
          <Img k="dining-square-view" sizes="100vw" />
        </div>
        <div className="wrap">
          <div className="band__copy reveal">
            <h2 id="dining-title">{dining.title}</h2>
            <p className="lede">{dining.text}</p>
            <p>Breakfast is served every morning, with tables along the windows above the square.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="exp-title">
        <div className="wrap">
          <div className="head">
            <h2 id="exp-title" className="reveal">Step out into Bhutan</h2>
            <p className="lede reveal">As you wander and discover, take part in some of the vital parts of Bhutan’s culture.</p>
          </div>
          <ul className="cards" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {experiences.map((x) => (
              <li key={x.slug} className="reveal">
                <Link className="card" href={`/experiences/#${x.slug}`}>
                  <div className="frame frame--contain">
                    <Img k={x.image} sizes="(max-width: 960px) 72vw, 24vw" />
                  </div>
                  <h3>{x.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section night" aria-labelledby="words-title">
        <div className="wrap">
          <div className="head head--stack">
            <h2 id="words-title" className="reveal">In our guests’ words</h2>
          </div>
          <div className="quotes">
            {testimonials.map((t) => (
              <figure className="quote reveal" key={t.name}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.context}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gal-title">
        <div className="wrap">
          <div className="head">
            <h2 id="gal-title" className="reveal">Life at Thimphu Tower</h2>
            <p className="reveal">
              <Link className="link" href="/gallery/">See all photographs <IconArrow /></Link>
            </p>
          </div>
          <div className="mosaic">
            {['facade-square', 'room-bay-view', 'staircase', 'team-portrait', 'gift-shop-niches'].map((k) => (
              <div key={k} className="reveal-img">
                <Img k={k} sizes="(max-width: 760px) 50vw, 40vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="cta-title">
        <div className="wrap cta">
          <div style={{ display: 'grid', gap: 'var(--s-5)' }}>
            <h2 id="cta-title" className="reveal">Write to us. We reply in person.</h2>
            <p className="lede reveal">Tell us your dates and who is travelling. The front desk replies with availability and anything you need to plan your stay.</p>
            <div className="actions reveal">
              <EnquireButton>Plan your stay <IconArrow /></EnquireButton>
            </div>
          </div>
          <div className="cta__contact reveal">
            <a href={hotel.phone.href}>{hotel.phone.display}</a>
            <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
            <span className="muted small">{hotel.address.line1}, {hotel.address.city}, {hotel.address.country}</span>
          </div>
        </div>
      </section>
    </>
  );
}
