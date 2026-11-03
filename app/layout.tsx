import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MotionRoot } from '@/components/Motion';
import { EnquiryDrawer } from '@/components/EnquiryDrawer';
import { hotel, rooms } from '@/content/site';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap', weight: ['400', '500'], style: ['normal', 'italic'] });
const sans = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(hotel.siteUrl),
  title: { default: 'Thimphu Tower Hotel · Boutique hotel on Clock Tower Square, Thimphu', template: '%s · Thimphu Tower Hotel' },
  description: `${hotel.summary} A 3-star boutique design hotel in the heart of Thimphu, Bhutan, since ${hotel.since}.`,
  openGraph: { type: 'website', siteName: hotel.name, locale: 'en_GB', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Thimphu Tower Hotel on Clock Tower Square' }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }], apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = { themeColor: '#f3efe8', width: 'device-width', initialScale: 1 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: hotel.name,
  description: hotel.intro,
  url: hotel.siteUrl,
  image: `${hotel.siteUrl}/og.jpg`,
  logo: `${hotel.siteUrl}/images/logo.png`,
  telephone: '+975-2-335367',
  email: hotel.email,
  starRating: { '@type': 'Rating', ratingValue: String(hotel.stars) },
  numberOfRooms: hotel.rooms,
  priceRange: `Nu ${Math.min(...rooms.map((r) => r.price)).toLocaleString('en-IN')}–${Math.max(...rooms.map((r) => r.price)).toLocaleString('en-IN')}`,
  currenciesAccepted: 'BTN',
  checkinTime: '14:00',
  checkoutTime: '12:00',
  foundingDate: String(hotel.since),
  address: { '@type': 'PostalAddress', streetAddress: hotel.address.line1, addressLocality: hotel.address.city, postalCode: hotel.address.postcode, addressCountry: 'BT' },
  sameAs: [hotel.facebook, hotel.tripadvisor],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <EnquiryDrawer />
        <MotionRoot />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
