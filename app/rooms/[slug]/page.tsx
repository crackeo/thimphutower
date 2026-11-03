import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHead } from '@/components/PageHead';
import { Img } from '@/components/Img';
import { TLink } from '@/components/Motion';
import { RoomGallery } from '@/components/RoomGallery';
import { EnquireButton } from '@/components/EnquireButton';
import { RoomPlan } from '@/components/architecture/RoomPlan';
import { IconArrow, IconCheck } from '@/components/Icons';
import { hotel, inRoom, nu, rooms } from '@/content/site';
import { JsonLd, pageMeta, roomOfferLd } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = rooms.find((x) => x.slug === slug);
  if (!r) return {};
  return pageMeta({
    title: `${r.name}, ${nu(r.price)} a night`,
    description: `${r.name} at Thimphu Tower Hotel on Clock Tower Square, Thimphu: ${nu(r.price)} a night. Private balcony, own bathroom, Wi-Fi and buffet breakfast.`,
    path: `/rooms/${r.slug}/`,
    image: `/og/${r.slug}.jpg`,
    imageAlt: `${r.name} at Thimphu Tower Hotel`,
  });
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = rooms.find((x) => x.slug === slug);
  if (!r) notFound();
  const others = rooms.filter((x) => x.slug !== r.slug);
  return (
    <>
      <JsonLd data={roomOfferLd(r)} />
      <PageHead title={r.name} crumbs={[{ href: '/rooms/', label: 'Rooms' }, { href: `/rooms/${r.slug}/`, label: r.name }]} lede={r.description} />
      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="wrap room">
          <RoomGallery slug={r.slug} images={r.gallery} />
          <aside className="room__aside" aria-label="Rate and enquiry">
            <div>
              <p className="label">Per room, per night</p>
              <p className="num" style={{ fontFamily: 'var(--serif)', fontSize: 'var(--t-3xl)', lineHeight: 1 }}>{nu(r.price)}</p>
              <p className="muted small" style={{ marginTop: 'var(--s-2)' }}>Plus 10% BST and 10% service charge</p>
            </div>
            <dl className="summary">
              <div><dt>Category</dt><dd>{r.category}</dd></div>
              <div><dt>Rate</dt><dd>{r.occupancy} occupancy</dd></div>
              <div><dt>Check-in</dt><dd>{hotel.checkIn}</dd></div>
              <div><dt>Check-out</dt><dd>{hotel.checkOut}</dd></div>
            </dl>
            <EnquireButton prefill={{ room: r.slug }}>Enquire about this room <IconArrow /></EnquireButton>
            <p className="muted small">You can also book us through our partner MakeMyTrip.</p>
          </aside>
        </div>
      </section>
      <section className="section alt" aria-labelledby="feat-title">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <h2 id="feat-title" style={{ marginBottom: 'var(--s-5)' }}>What’s in the room</h2>
            <ul className="ticks">{inRoom.map((x) => <li key={x}><IconCheck /> {x}</li>)}</ul>
          </div>
          <figure className="plan reveal" style={{ margin: 0 }}>
            <RoomPlan name={r.name} beds={r.occupancy === 'Double' ? 'twin' : 'double'} />
            <figcaption>Illustrative layout, not to scale</figcaption>
          </figure>
        </div>
      </section>
      <section className="section" aria-labelledby="other-title">
        <div className="wrap">
          <h2 id="other-title" className="reveal" style={{ marginBottom: 'var(--s-7)' }}>Other rooms</h2>
          <ul className="cards" style={{ listStyle: 'none', margin: 0, padding: 0, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {others.map((o) => (
              <li key={o.slug} className="reveal">
                <TLink className="room-card" href={`/rooms/${o.slug}/`}>
                  <div className="frame" style={{ viewTransitionName: `room-${o.slug}` }}>
                    <Img k={o.image} sizes="(max-width: 960px) 72vw, 30vw" />
                  </div>
                  <div className="room-card__meta">
                    <h3>{o.name}</h3>
                    <span className="price num">{nu(o.price)}</span>
                  </div>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
