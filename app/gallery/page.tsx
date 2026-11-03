import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PageHead } from '@/components/PageHead';
import { Gallery } from '@/components/Gallery';
import assets from '@/content/assets.json';

export const metadata: Metadata = pageMeta({
  title: 'Hotel photos & Clock Tower Square',
  description: 'Photos of Thimphu Tower Hotel in Thimphu, Bhutan: the rooms, the building, dining, the team and life on Clock Tower Square below.',
  path: '/gallery/',
});

const keys = [...assets.filter((a) => a.file.includes('/gallery/')), ...assets.filter((a) => !a.file.includes('/gallery/'))]
  .filter((a) => a.category)
  .map((a) => a.key);

export default function GalleryPage() {
  return (
    <>
      <PageHead title="Gallery" crumbs={[{ href: '/gallery/', label: 'Gallery' }]} lede="The rooms, the building, the dining room and the square outside, with the team who look after you." />
      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="wrap">
          <Gallery keys={keys} />
        </div>
      </section>
    </>
  );
}
