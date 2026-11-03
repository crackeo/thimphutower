// Generates responsive WebP files from public/images/original into public/images/optimized
// and writes content/images.generated.json (key -> width/height/alt). Run: npm run images
import sharp from 'sharp';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [320, 480, 640, 800, 960, 1280, 1920];
const assets = JSON.parse(await readFile(path.join(root, 'content/assets.json'), 'utf8'));
const outDir = path.join(root, 'public/images/optimized');
await mkdir(outDir, { recursive: true });

const manifest = {};
for (const a of assets) {
  const input = path.join(root, 'public/images', a.file);
  const meta = await sharp(input).metadata();
  for (const w of WIDTHS) {
    const out = path.join(outDir, `${a.key}-${w}.webp`);
    try { await access(out); continue; } catch {}
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
  }
  manifest[a.key] = { width: meta.width, height: meta.height, alt: a.alt, category: a.category, caption: a.caption };
}
// 1200x630 JPEG share images for each room page (social apps don't all read WebP)
const ogDir = path.join(root, 'public/og');
await mkdir(ogDir, { recursive: true });
const site = await readFile(path.join(root, 'content/site.ts'), 'utf8');
for (const [, slug, key] of site.matchAll(/slug: '([a-z-]+)',[\s\S]*?image: '([a-z-]+)'/g)) {
  const a = assets.find((x) => x.key === key);
  if (!a || !key.startsWith('room-')) continue;
  await sharp(path.join(root, 'public/images', a.file)).rotate().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(ogDir, `${slug}.jpg`));
}

await writeFile(path.join(root, 'content/images.generated.json'), JSON.stringify(manifest, null, 1));
console.log(`optimized ${assets.length} images x ${WIDTHS.length} widths`);
