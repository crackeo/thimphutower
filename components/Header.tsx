'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/content/site';
import { EnquireButton } from './EnquireButton';
import { IconClose, IconMenu } from './Icons';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const current = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="site-header" data-scrolled={scrolled} data-menu={open}>
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label="Thimphu Tower Hotel, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/glyph-96.webp" alt="" width={109} height={96} />
          <span>
            Thimphu Tower
            <small>Hotel · Clock Tower Square</small>
          </span>
        </Link>
        <nav className="site-nav" id="site-nav" aria-label="Main" data-open={open}>
          <ul className="nav-list">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={current(n.href) ? 'page' : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <EnquireButton className="btn btn--gold nav-cta">Enquire about a stay</EnquireButton>
        </nav>
        <EnquireButton className="btn btn--sm header-cta">Enquire</EnquireButton>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? <IconClose /> : <IconMenu />}
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
