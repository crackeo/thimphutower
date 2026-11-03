import Link from 'next/link';
import { hotel, nav } from '@/content/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/glyph-160.webp" alt="Thimphu Tower Hotel" width={181} height={160} loading="lazy" />
            <p>The hotel on Clock Tower Square, since {hotel.since}.</p>
            <p>{hotel.summary}</p>
          </div>
          <div>
            <h2>Visit</h2>
            <address style={{ fontStyle: 'normal' }}>
              {hotel.address.line1}
              <br />
              {hotel.address.city}, {hotel.address.country} {hotel.address.postcode}
            </address>
            <p style={{ marginTop: 'var(--s-3)' }}>
              <a href={hotel.mapsSearch} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </p>
          </div>
          <div>
            <h2>Reach us</h2>
            <ul>
              <li><a href={hotel.phone.href}>{hotel.phone.display}</a></li>
              <li><a href={hotel.mobile.href}>{hotel.mobile.display}</a></li>
              <li><a href={`mailto:${hotel.email}`}>{hotel.email}</a></li>
              <li><a href={hotel.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href={hotel.tripadvisor} target="_blank" rel="noopener noreferrer">Tripadvisor</a></li>
            </ul>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
              <li><Link href="/downloads/">Downloads</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Thimphu Tower Hotel</span>
          <span>Check-in {hotel.checkIn} · Check-out {hotel.checkOut}</span>
        </div>
      </div>
    </footer>
  );
}
