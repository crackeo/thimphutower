'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { roomFeatures } from '@/content/site';
import { RoomPlan } from './RoomPlan';

const RoomScene = dynamic(() => import('./RoomScene'), {
  ssr: false,
  loading: () => <div className="stage night"><p className="stage__loading">Loading the room…</p></div>,
});

/** Loads the 3D room only near the viewport; falls back to the plan drawing
 *  when WebGL is unavailable or the visitor prefers reduced motion. */
export function Room3D({ beds: initialBeds, name, switchable = false }: { beds: 'double' | 'twin'; name: string; switchable?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [beds, setBeds] = useState(initialBeds);
  const [state, setState] = useState<'idle' | '3d' | 'fallback'>('idle');
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const c = document.createElement('canvas');
    const gl = !!(c.getContext('webgl2') || c.getContext('webgl'));
    if (reduced || !gl) return setState('fallback');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState('3d');
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {switchable && state !== 'fallback' && (
        <div className="seg seg--night" role="group" aria-label="Bed layout" style={{ marginBottom: 'var(--s-4)' }}>
          <button type="button" aria-pressed={beds === 'double'} onClick={() => setBeds('double')}>Double bed</button>
          <button type="button" aria-pressed={beds === 'twin'} onClick={() => setBeds('twin')}>Twin beds</button>
        </div>
      )}
      {state === '3d' && <RoomScene beds={beds} features={roomFeatures} />}
      {state === 'fallback' && (
        <figure className="plan" style={{ margin: 0, maxWidth: 620, marginInline: 'auto' }}>
          <RoomPlan name={name} beds={beds} />
          <figcaption>Illustrative layout, not to scale · the 3D room needs WebGL and full motion</figcaption>
        </figure>
      )}
      {state === 'idle' && <div className="stage night"><p className="stage__loading">Loading the room…</p></div>}
    </div>
  );
}
