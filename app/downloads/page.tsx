import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { IconDownload } from '@/components/Icons';
import { downloads } from '@/content/site';

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Reports from the Harvard/MIT trek groups who stayed at Thimphu Tower Hotel.',
  alternates: { canonical: '/downloads/' },
};

export default function DownloadsPage() {
  return (
    <>
      <PageHead title="Downloads" crumbs={[{ href: '/downloads/', label: 'Downloads' }]} lede="Reports from the Harvard/MIT trek groups who made Thimphu Tower their base." />
      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="wrap">
          <ul className="docs">
            {downloads.map((d) => (
              <li key={d.file} className="reveal">
                <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
                  <h2>{d.title}</h2>
                  <p className="muted">{d.text}</p>
                  <p className="label">PDF · {d.size} · Added {d.date}</p>
                </div>
                <a className="btn btn--line" href={d.file} target="_blank" rel="noopener" aria-label={`Open ${d.title}, PDF, ${d.size}`}>
                  <IconDownload /> Open PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
