'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Elevation } from './Elevation';

const TowerScene = dynamic(() => import('./TowerScene'), {
  ssr: false,
  loading: () => <div className="stage night"><p className="stage__loading">Loading the 3D model…</p></div>,
});

/** Loads the three.js model only near the viewport; falls back to the line elevation
 *  when WebGL is unavailable or the visitor prefers reduced motion. */
export function Tower3D() {
  const ref = useRef<HTMLDivElement>(null);
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
      {state === '3d' && <TowerScene />}
      {state === 'fallback' && (
        <figure className="plan" style={{ margin: 0, maxWidth: 620, marginInline: 'auto' }}>
          <Elevation />
          <figcaption>Illustrative elevation · the 3D model needs WebGL and full motion</figcaption>
        </figure>
      )}
      {state === 'idle' && <div className="stage night"><p className="stage__loading">Loading the 3D model…</p></div>}
    </div>
  );
}
