import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ display: 'grid', gap: 'var(--s-5)', justifyItems: 'start' }}>
        <h1>This page has moved</h1>
        <p className="lede measure">The address may have changed when our site was rebuilt. Try the rooms, or write to us.</p>
        <div className="actions">
          <Link className="btn" href="/rooms/">See the rooms</Link>
          <Link className="btn btn--line" href="/contact/">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
