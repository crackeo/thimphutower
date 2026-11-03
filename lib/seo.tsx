import type { Metadata } from 'next';
import { facilities, hotel, nu, rooms, type Room } from '@/content/site';

export const homeDescription =
  'A 3-star boutique hotel on Clock Tower Square in central Thimphu, Bhutan, since 2015. 28 rooms with private balconies, many overlooking the square.';

const abs = (path: string) => `${hotel.siteUrl}${path}`;

/**
 * Per-page metadata. Next.js replaces `openGraph` wholesale when a page sets it,
 * so every page goes through here to keep og:url, site name, locale and image together.
 */
export function pageMeta({
  title,
  description,
  path,
  image = '/og.jpg',
  imageAlt = 'Thimphu Tower Hotel on Clock Tower Square, Thimphu',
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const ogTitle = title ? `${title} · ${hotel.name}` : undefined;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: hotel.name,
      locale: 'en_GB',
      url: path,
      ...(ogTitle && { title: ogTitle }),
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: { card: 'summary_large_image', ...(ogTitle && { title: ogTitle }), description, images: [image] },
  };
}

export const hotelId = abs('/#hotel');

const roomLd = (r: Room) => ({
  '@type': 'HotelRoom',
  '@id': abs(`/rooms/${r.slug}/#room`),
  name: r.name,
  description: r.description,
  url: abs(`/rooms/${r.slug}/`),
  image: abs(`/og/${r.slug}.jpg`),
  amenityFeature: ['Private balcony', 'Private bathroom', 'Air conditioning', 'Free Wi-Fi'].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
});

export const roomOfferLd = (r: Room) => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: `${r.name}, ${r.occupancy.toLowerCase()} rate`,
  url: abs(`/rooms/${r.slug}/`),
  price: r.price,
  priceCurrency: 'BTN',
  description: `${nu(r.price)} per room per night, plus 10% BST and 10% service charge.`,
  itemOffered: roomLd(r),
  offeredBy: { '@id': hotelId },
});

export const hotelLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  '@id': hotelId,
  name: hotel.name,
  alternateName: ['Hotel Thimphu Tower', 'Hotel Thimphu Towers'],
  description: hotel.intro,
  url: abs('/'),
  image: [abs('/og.jpg'), ...rooms.map((r) => abs(`/og/${r.slug}.jpg`))],
  logo: abs('/images/logo.png'),
  telephone: '+975-2-335367',
  email: hotel.email,
  starRating: { '@type': 'Rating', ratingValue: String(hotel.stars) },
  numberOfRooms: hotel.rooms,
  priceRange: `${nu(Math.min(...rooms.map((r) => r.price)))}–${nu(Math.max(...rooms.map((r) => r.price)))} per night`,
  currenciesAccepted: 'BTN',
  checkinTime: '14:00',
  checkoutTime: '12:00',
  foundingDate: String(hotel.since),
  address: { '@type': 'PostalAddress', streetAddress: hotel.address.line1, addressLocality: hotel.address.city, postalCode: hotel.address.postcode, addressCountry: 'BT' },
  geo: { '@type': 'GeoCoordinates', latitude: hotel.geo.lat, longitude: hotel.geo.lng },
  hasMap: hotel.mapsSearch,
  amenityFeature: facilities.flatMap((g) => g.items).map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  containsPlace: rooms.map(roomLd),
  sameAs: [hotel.facebook, hotel.tripadvisor],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: hotel.name,
  url: abs('/'),
  inLanguage: 'en-GB',
  publisher: { '@id': hotelId },
};

export const breadcrumbLd = (crumbs: { href: string; label: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ href: '/', label: 'Home' }, ...crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href) })),
});

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
