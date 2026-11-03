import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { Img } from '@/components/Img';
import { about, hotel } from '@/content/site';

export const metadata: Metadata = {
  title: 'About us',
  description: 'A vibrant 3-star boutique design hotel in the heart of Thimphu since 2015: our vision, mission and team.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <>
      <PageHead title="About us" crumbs={[{ href: '/about/', label: 'About' }]} lede={hotel.intro} />
      <div className="wrap reveal-img">
        <div className="frame page-hero"><Img k="team-portrait" sizes="100vw" priority /></div>
      </div>
      <section className="section" aria-labelledby="vision-title">
        <div className="wrap statement">
          <h2 id="vision-title" className="reveal" style={{ fontSize: 'var(--t-xl)' }}>Our vision</h2>
          <p className="big reveal">{about.vision}</p>
        </div>
      </section>
      <section className="section alt" aria-labelledby="mission-title">
        <div className="wrap">
          <div className="head head--stack"><h2 id="mission-title" className="reveal">Our mission</h2></div>
          <div className="pillars">
            {about.mission.map((m) => (
              <div key={m.title} className="reveal">
                <h3>{m.title}</h3>
                <p className="muted">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="community-title">
        <div className="wrap split split--flip">
          <div className="split__media reveal-img">
            <div className="frame frame--wide"><Img k="team-lobby" sizes="(max-width: 900px) 100vw, 56vw" /></div>
            <div className="frame frame--sq inset"><Img k="go-green-baskets" sizes="(max-width: 900px) 40vw, 22vw" /></div>
          </div>
          <div className="split__copy">
            <h2 id="community-title" className="reveal">People and place</h2>
            {about.community.map((c) => <p key={c} className="lede reveal">{c}</p>)}
          </div>
        </div>
      </section>
    </>
  );
}
