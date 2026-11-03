import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PageHead } from '@/components/PageHead';
import { Img } from '@/components/Img';
import { TLink } from '@/components/Motion';
import { RoomExplorer } from '@/components/RoomExplorer';
import { IconCheck } from '@/components/Icons';
import { facilities, inRoom, nu, rooms, roomServices } from '@/content/site';

export const metadata: Metadata = pageMeta({
  title: 'Rooms & rates in central Thimphu',
  description: 'Deluxe and Premium rooms on Clock Tower Square, Thimphu, from Nu 4,500 a night. Private bathroom, Wi-Fi and buffet breakfast in every room.',
  path: '/rooms/',
});

export default function RoomsPage() {
  return (
    <>
      <PageHead
        title="Rooms & rates"
        crumbs={[{ href: '/rooms/', label: 'Rooms' }]}
        lede="Two categories, each priced for one guest or two. Every room has its own bathroom and buffet breakfast."
      />
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ul className="room-cards" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rooms.map((r) => (
              <li key={r.slug} className="reveal">
                <TLink className="room-card" href={`/rooms/${r.slug}/`}>
                  <div className="frame" style={{ viewTransitionName: `room-${r.slug}` }}>
                    <Img k={r.image} sizes="(max-width: 760px) 100vw, 50vw" />
                  </div>
                  <div className="room-card__meta">
                    <h2 style={{ fontSize: 'var(--t-xl)' }}>{r.name}</h2>
                    <span className="price num">{nu(r.price)}<span className="muted small"> / night</span></span>
                  </div>
                  <p className="muted small">{r.category} category · {r.occupancy.toLowerCase()} rate</p>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section alt" aria-labelledby="plan-title">
        <div className="wrap">
          <div className="head">
            <h2 id="plan-title" className="reveal">Plan and price your stay</h2>
            <p className="lede reveal">Compare the four rates and see an estimated total for your nights, including taxes.</p>
          </div>
          <RoomExplorer />
        </div>
      </section>
      <section className="section" aria-labelledby="inroom-title">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <h2 id="inroom-title" style={{ marginBottom: 'var(--s-5)' }}>In every room</h2>
            <ul className="ticks">{inRoom.map((x) => <li key={x}><IconCheck /> {x}</li>)}</ul>
          </div>
          <div className="reveal">
            <h2 style={{ marginBottom: 'var(--s-5)' }}>Around the hotel</h2>
            <ul className="ticks" style={{ gridTemplateColumns: '1fr' }}>{roomServices.map((x) => <li key={x}><IconCheck /> {x}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section alt" aria-labelledby="fac-title">
        <div className="wrap">
          <div className="head">
            <h2 id="fac-title" className="reveal">Hotel facilities</h2>
            <p className="lede reveal">Our friendly staff and clean rooms are at your disposal 24 hours a day.</p>
          </div>
          <div className="facilities">
            {facilities.map((g) => (
              <div key={g.group} className="reveal">
                <h3>{g.group}</h3>
                <ul className="ticks">{g.items.map((it) => <li key={it}><IconCheck /> {it}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
