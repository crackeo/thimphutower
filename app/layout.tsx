import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MotionRoot } from '@/components/Motion';
import { EnquiryDrawer } from '@/components/EnquiryDrawer';
import { hotel } from '@/content/site';
import { homeDescription, hotelLd } from '@/lib/seo';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap', weight: ['400', '500'], style: ['normal', 'italic'] });
const sans = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(hotel.siteUrl),
  title: { default: 'Thimphu Tower Hotel · Boutique hotel in central Thimphu, Bhutan', template: '%s · Thimphu Tower Hotel' },
  description: homeDescription,
  applicationName: hotel.name,
  openGraph: { type: 'website', siteName: hotel.name, locale: 'en_GB', url: '/', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Thimphu Tower Hotel on Clock Tower Square' }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }], apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = { themeColor: '#f3efe8', width: 'device-width', initialScale: 1 };

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelLd) }} />
      </body>
    </html>
  );
}
