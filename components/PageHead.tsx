import Link from 'next/link';
import type { ReactNode } from 'react';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export function PageHead({ title, lede, crumbs = [], aside }: { title: ReactNode; lede?: ReactNode; crumbs?: { href: string; label: string }[]; aside?: ReactNode }) {
  return (
    <header className="page-head">
      {crumbs.length > 0 && <JsonLd data={breadcrumbLd(crumbs)} />}
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><Link href="/">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.href}><Link href={c.href}>{c.label}</Link></li>
            ))}
          </ol>
        </nav>
        <div className="page-head__grid">
          <h1 className="reveal">{title}</h1>
          {(lede || aside) && (
            <div className="reveal" style={{ display: 'grid', gap: 'var(--s-5)' }}>
              {lede && <p className="lede">{lede}</p>}
              {aside}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
