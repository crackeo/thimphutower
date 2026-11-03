import type { MetadataRoute } from 'next';
import { hotel, rooms } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/rooms/', ...rooms.map((r) => `/rooms/${r.slug}/`), '/the-building/', '/experiences/', '/gallery/', '/about/', '/downloads/', '/contact/'];
  const lastModified = new Date();
  return paths.map((p) => ({
    url: `${hotel.siteUrl}${p}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/rooms/') ? 0.9 : 0.7,
  }));
}
