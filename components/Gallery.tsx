'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { galleryCategories } from '@/content/site';
import { Img, imageData } from './Img';
import { IconClose, IconNext, IconPrev } from './Icons';

type Cat = (typeof galleryCategories)[number]['id'];

/** Filterable masonry with a full-screen viewer: arrow keys, swipe and a filmstrip. */
export function Gallery({ keys }: { keys: string[] }) {
  const [cat, setCat] = useState<Cat>('all');
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const items = useMemo(() => keys.filter((k) => cat === 'all' || imageData[k].category === cat), [keys, cat]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: keys.length };
    keys.forEach((k) => (c[imageData[k].category!] = (c[imageData[k].category!] ?? 0) + 1));
    return c;
  }, [keys]);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const onClose = () => setIndex(null);
    el.addEventListener('keydown', onKey);
    el.addEventListener('close', onClose);
    return () => {
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('close', onClose);
    };
  }, [step]);

  useEffect(() => {
    strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <div className="map__list" role="group" aria-label="Filter photographs" style={{ marginBottom: 'var(--s-6)' }}>
        {galleryCategories.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
            <span className="count num">{counts[c.id] ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">Showing {items.length} photographs</p>
      <ul className="masonry">
        {items.map((k, i) => (
          <li key={k}>
            <figure style={{ margin: 0 }}>
              <button type="button" onClick={() => open(i)} aria-label={`Open photo: ${imageData[k].alt}`}>
                <Img k={k} sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw" priority={i < 2} />
              </button>
              {imageData[k].caption && <figcaption>{imageData[k].caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="viewer" aria-label="Photo viewer">
        {current && (
          <div className="viewer__inner">
            <div className="viewer__bar">
              <span className="num small">
                {index! + 1} / {items.length}
              </span>
              <button type="button" className="icon-btn" onClick={close} aria-label="Close photo viewer" autoFocus>
                <IconClose />
              </button>
            </div>
            <figure
              onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touch.current === null) return;
                const dx = e.changedTouches[0].clientX - touch.current;
                if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
                touch.current = null;
              }}
            >
              <Img k={current} sizes="100vw" />
            </figure>
            <p className="viewer__caption">{imageData[current].caption ?? imageData[current].alt}</p>
            <div className="viewer__strip" ref={strip} aria-label="All photos">
              {items.map((k, i) => (
                <button key={k} type="button" aria-current={i === index} aria-label={`Photo ${i + 1}`} onClick={() => setIndex(i)}>
                  <Img k={k} sizes="64px" />
                </button>
              ))}
            </div>
            <button type="button" className="icon-btn viewer__nav viewer__nav--prev" onClick={() => step(-1)} aria-label="Previous photo">
              <IconPrev />
            </button>
            <button type="button" className="icon-btn viewer__nav viewer__nav--next" onClick={() => step(1)} aria-label="Next photo">
              <IconNext />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
