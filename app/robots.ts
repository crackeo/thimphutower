import type { MetadataRoute } from 'next';
import { hotel } from '@/content/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${hotel.siteUrl}/sitemap.xml` };
}
