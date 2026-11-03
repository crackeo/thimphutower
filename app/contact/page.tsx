import type { Metadata } from 'next';
import { PageHead } from '@/components/PageHead';
import { EnquiryForm } from '@/components/EnquiryForm';
import { SitePlan } from '@/components/architecture/SitePlan';
import { IconPin } from '@/components/Icons';
import { hotel } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact & enquiries',
  description: `Enquire about a room at Thimphu Tower Hotel, Clock Tower Square, Thimphu. Call ${hotel.phone.display} or email ${hotel.email}.`,
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <>
      <PageHead title="Get in touch" crumbs={[{ href: '/contact/', label: 'Contact' }]} lede="Fill in the form and we’ll get back to you as soon as possible. Need a quicker answer? Call us." />
      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="wrap contact">
          <div style={{ display: 'grid', gap: 'var(--s-6)' }}>
            <dl>
              <div><dt>Hotel address</dt><dd>{hotel.address.line1}, {hotel.address.city}<br />{hotel.address.country} {hotel.address.postcode}</dd></div>
              <div><dt>Front desk</dt><dd><a href={hotel.phone.href}>{hotel.phone.display}</a></dd></div>
              <div><dt>Mobile</dt><dd><a href={hotel.mobile.href}>{hotel.mobile.display}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${hotel.email}`}>{hotel.email}</a></dd></div>
              <div><dt>Check-in · check-out</dt><dd>{hotel.checkIn} · {hotel.checkOut}</dd></div>
            </dl>
            <figure className="plan" style={{ margin: 0 }}>
              <SitePlan />
            </figure>
            <a className="btn btn--line" href={hotel.mapsSearch} target="_blank" rel="noopener noreferrer" style={{ justifySelf: 'start' }}>
              <IconPin /> Get directions
            </a>
          </div>
          <div id="enquire" style={{ scrollMarginTop: '100px' }}>
            <h2 style={{ marginBottom: 'var(--s-5)' }}>Room enquiry</h2>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
