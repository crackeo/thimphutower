import Image from 'next/image';
import images from '@/content/images.generated.json';

type Key = keyof typeof images;
export const imageData = images as Record<string, { width: number; height: number; alt: string; category: string | null; caption: string | null }>;

/** next/image over the pre-generated WebP set (see scripts/optimize-images.mjs). */
export function Img({
  k,
  sizes = '100vw',
  priority = false,
  alt,
  className,
}: {
  k: Key | string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
  className?: string;
}) {
  const d = imageData[k];
  if (!d) throw new Error(`Unknown image key: ${k}`);
  return (
    <Image
      src={`/images/optimized/${k}`}
      width={d.width}
      height={d.height}
      alt={alt ?? d.alt}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
