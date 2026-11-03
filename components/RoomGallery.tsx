'use client';
import { useState } from 'react';
import { Img, imageData } from './Img';

/** Main photo plus thumbnails; the main photo shares a view-transition name with the room card. */
export function RoomGallery({ slug, images }: { slug: string; images: string[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="frame room__hero" style={{ viewTransitionName: `room-${slug}` }}>
        <Img k={images[i]} sizes="(max-width: 960px) 100vw, 60vw" priority />
      </div>
      <div className="room__thumbs" role="group" aria-label="Room photos">
        {images.map((k, n) => (
          <button key={k} type="button" aria-pressed={n === i} aria-label={`Show photo ${n + 1}: ${imageData[k].alt}`} onClick={() => setI(n)}>
            <Img k={k} sizes="20vw" />
          </button>
        ))}
      </div>
    </div>
  );
}
