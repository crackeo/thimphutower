'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { hotel, nu, rooms } from '@/content/site';
import { openEnquiry } from '@/lib/openEnquiry';
import { Img } from './Img';
import { IconArrow } from './Icons';

// Real photographs of, or taken from, the hotel on Clock Tower Square.
const SCENES = [
  { id: 'festival', label: 'Festival', img: 'festival-from-window', caption: 'Festival day on Clock Tower Square, seen through one of our windows.' },
  { id: 'morning', label: 'Morning', img: 'breakfast-view', caption: 'Breakfast by the window, above the square.' },
  { id: 'dusk', label: 'Dusk', img: 'facade-dusk', caption: 'Thimphu Tower at dusk, on the edge of the square.' },
  { id: 'snow', label: 'Snow', img: 'snow-square', caption: 'First snow on Clock Tower Square, from the hotel.' },
];
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function Hero() {
  const [scene, setScene] = useState(0);
  const [today, setToday] = useState<string>();
  const [arrive, setArrive] = useState('');
  const sentinel = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState(false);

  useEffect(() => setToday(iso(new Date())), []);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const pastHero = el.getBoundingClientRect().top < 0;
      // hide near the closing call to action and footer, where enquiry is already on screen
      const atEnd = [...document.querySelectorAll('#cta-title, .site-footer')].some((n) => n.getBoundingClientRect().top < vh);
      setPill(pastHero && !atEnd);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    openEnquiry({
      arrive: String(f.get('arrive') || ''),
      depart: String(f.get('depart') || ''),
      room: String(f.get('room') || ''),
      adults: String(f.get('adults') || '2'),
    });
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <h1 id="hero-title" className="reveal">
            The hotel on <em>Clock Tower Square</em>
          </h1>
          <p className="lede measure reveal">
            Right in the centre of Thimphu, next to the Thimphu Clock Tower: {hotel.rooms} rooms overlooking the square and the Changlimithang stadium. A boutique design
            hotel, welcoming travellers since {hotel.since}.
          </p>
          <form className="ebar reveal" action="/contact/#enquire" method="get" onSubmit={submit} aria-label="Start an enquiry">
            <div className="field">
              <label htmlFor="q-arrive">Arrive</label>
              <input id="q-arrive" name="arrive" type="date" min={today} value={arrive} onChange={(e) => setArrive(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="q-depart">Depart</label>
              <input id="q-depart" name="depart" type="date" min={arrive || today} />
            </div>
            <div className="field">
              <label htmlFor="q-room">Room</label>
              <select id="q-room" name="room" defaultValue="">
                <option value="">Any room</option>
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name.replace(' Room', '')} · {nu(r.price)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-adults">Guests</label>
              <select id="q-adults" name="adults" defaultValue="2">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <button className="btn btn--gold" type="submit">
              Enquire <IconArrow />
            </button>
          </form>
          <ul className="hero__facts reveal" aria-label="At a glance">
            <li>3-star boutique hotel</li>
            <li>Rooms from {nu(rooms[0].price)}</li>
            <li>Staff on hand 24 hours</li>
          </ul>
        </div>
        <div className="hero__media">
          {SCENES.map((s, i) => (
            <div key={s.id} className={`hero__slide${i === scene ? ' is-active' : ''}`} aria-hidden={i !== scene}>
              <Img k={s.img} sizes="(max-width: 960px) 100vw, 56vw" priority={i === 0} />
            </div>
          ))}
          <div className="hero__controls">
            <p className="hero__caption" aria-live="polite">{SCENES[scene].caption}</p>
            <div className="seg seg--night" role="group" aria-label="Choose a view of the square">
              {SCENES.map((s, i) => (
                <button key={s.id} type="button" aria-pressed={i === scene} onClick={() => setScene(i)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div ref={sentinel} aria-hidden="true" />
      <div className="pill" data-show={pill} aria-hidden={!pill}>
        <p>
          Plan your stay <span>· rooms from {nu(rooms[0].price)}</span>
        </p>
        <button type="button" className="btn btn--gold btn--sm" tabIndex={pill ? 0 : -1} onClick={() => openEnquiry()}>
          Enquire
        </button>
      </div>
    </>
  );
}
