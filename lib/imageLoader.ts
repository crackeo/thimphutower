const WIDTHS = [320, 480, 640, 800, 960, 1280, 1920];

/** Maps next/image requests ("/images/optimized/<key>") to the pre-generated WebP width. */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith('/images/optimized/')) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${src}-${w}.webp`;
}
