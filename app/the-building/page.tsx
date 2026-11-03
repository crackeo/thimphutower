import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PageHead } from '@/components/PageHead';
import { Img } from '@/components/Img';
import { Tower3D } from '@/components/architecture/Tower3D';
import { Elevation } from '@/components/architecture/Elevation';
import { SectionDrawing } from '@/components/architecture/SectionDrawing';
import { SitePlan } from '@/components/architecture/SitePlan';
import { TLink } from '@/components/Motion';
import { IconArrow } from '@/components/Icons';
import { hotel } from '@/content/site';

export const metadata: Metadata = pageMeta({
  title: 'The building: a Bhutanese tower in 3D',
  description: 'A Bhutanese tower on Clock Tower Square, Thimphu: carved timber windows over a painted arcade. Explore the building in 3D and in drawings.',
  path: '/the-building/',
});

export default function BuildingPage() {
  return (
    <>
      <PageHead title="The building" crumbs={[{ href: '/the-building/', label: 'The Building' }]} lede={hotel.intro} />
      <div className="wrap reveal-img">
        <div className="frame page-hero">
          <Img k="facade-front" sizes="100vw" priority />
        </div>
      </div>

      <section className="section night" aria-labelledby="model-title" style={{ marginTop: 'var(--section)' }}>
        <div className="wrap">
          <div className="head">
            <h2 id="model-title" className="reveal">Explore the tower</h2>
            <p className="lede reveal">
              Turn it, look down on the square, lift the floors apart, or choose a level to see what it holds. An illustrative model
              built from our drawings; the depth and side windows are estimated.
            </p>
          </div>
          <Tower3D />
        </div>
      </section>

      <section className="section" aria-labelledby="face-title">
        <div className="wrap split">
          <div className="split__media reveal-img">
            <div className="frame frame--tall"><Img k="facade-low" sizes="(max-width: 900px) 100vw, 56vw" /></div>
            <div className="frame frame--sq inset"><Img k="facade-square" sizes="(max-width: 900px) 40vw, 22vw" /></div>
          </div>
          <div className="split__copy">
            <h2 id="face-title" className="reveal">The face on the square</h2>
            <p className="lede reveal">
              Four bays of carved timber windows, arched on the upper floors, each crowned with a painted lintel. Below them a frieze
              of roundels runs over an arcade of painted columns, where shops open onto the square.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="plates-title">
        <div className="wrap">
          <div className="head">
            <h2 id="plates-title" className="reveal">Built to look out</h2>
            <p className="lede reveal">
              The guest floors sit above the street arcade, so the windows clear the square and look across to the Clock Tower and
              the Changlimithang stadium. Our own drawings, traced from photographs; not construction drawings.
            </p>
          </div>
          <div className="plates">
            <figure className="reveal"><Elevation /><figcaption>Elevation · illustrative</figcaption></figure>
            <div style={{ display: 'grid', gap: 'var(--s-5)', alignContent: 'start' }}>
              <figure className="reveal"><SectionDrawing /><figcaption>Section · illustrative</figcaption></figure>
              <figure className="reveal"><SitePlan /><figcaption>Site · schematic</figcaption></figure>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="inside-title">
        <div className="wrap">
          <div className="head">
            <h2 id="inside-title" className="reveal">Inside</h2>
            <p className="lede reveal">A twin staircase rises from the lobby, and the gift shop is lined with masks, statues and thangkas.</p>
          </div>
          <div className="mosaic">
            {['staircase', 'gift-shop', 'room-bay-view', 'gift-shop-niches', 'dining-long-table'].map((k) => (
              <div key={k} className="reveal-img"><Img k={k} sizes="(max-width: 760px) 50vw, 40vw" /></div>
            ))}
          </div>
          <p style={{ marginTop: 'var(--s-7)' }}>
            <TLink className="btn" href="/rooms/">See the rooms <IconArrow /></TLink>
          </p>
        </div>
      </section>
    </>
  );
}
