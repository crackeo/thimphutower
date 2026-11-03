import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PageHead } from '@/components/PageHead';
import { Img } from '@/components/Img';
import { SquareMap } from '@/components/SquareMap';
import { EnquireButton } from '@/components/EnquireButton';
import { IconArrow } from '@/components/Icons';
import { StampStories } from '@/components/StampStories';
import { experiences, stampStories } from '@/content/site';

export const metadata: Metadata = pageMeta({
  title: 'Things to do near Clock Tower Square',
  description: 'Festivals, Buddha Dordenma, the astrologers of Pangrizampa and personalised stamps: what to see and do in Thimphu, from Clock Tower Square.',
  path: '/experiences/',
});

export default function ExperiencesPage() {
  return (
    <>
      <PageHead
        title="Experiences"
        crumbs={[{ href: '/experiences/', label: 'Experiences' }]}
        lede="As you wander and discover, take part in some of the vital parts of Bhutan’s culture. The front desk will help you plan."
      />
      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="wrap">
          {experiences.filter((x) => x.slug !== 'personalised-stamps').map((x) => (
            <article className="exp" id={x.slug} key={x.slug} aria-labelledby={`x-${x.slug}`} style={{ scrollMarginTop: '100px' }}>
              <div className="exp__media reveal-img">
                <div className="frame frame--contain"><Img k={x.image} sizes="(max-width: 760px) 90vw, 460px" /></div>
              </div>
              <div style={{ display: 'grid', gap: 'var(--s-4)' }} className="reveal">
                <h2 id={`x-${x.slug}`}>{x.title}</h2>
                <p className="lede measure">{x.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section alt" id="personalised-stamps" aria-labelledby="stamps-title" style={{ scrollMarginTop: '60px' }}>
        <div className="wrap">
          <div className="head">
            <h2 id="stamps-title" className="reveal">{stampStories.title}</h2>
            <p className="lede reveal">{stampStories.intro}</p>
          </div>
          <StampStories />
        </div>
      </section>
      <section className="section" aria-labelledby="sq-title">
        <div className="wrap">
          <div className="head">
            <h2 id="sq-title" className="reveal">Or simply look out of the window</h2>
            <p className="lede reveal">The square below is where Thimphu gathers. Choose a moment we photographed from the hotel.</p>
          </div>
          <SquareMap />
          <p style={{ marginTop: 'var(--s-7)' }}>
            <EnquireButton>Plan your stay <IconArrow /></EnquireButton>
          </p>
        </div>
      </section>
    </>
  );
}
