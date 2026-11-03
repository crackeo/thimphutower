'use client';
import { useState } from 'react';
import { Img } from './Img';

// Pins mark roughly where on the square each moment happened; positions are illustrative.
const POINTS = [
  { id: 'festival', label: 'Festival day', img: 'festival-from-window', x: 47, y: 63, text: 'Masked dances and crowds on the square, seen through a carved window of the hotel.' },
  { id: 'tarayana', label: 'Tarayana Fair', img: 'tarayana-fair', x: 30, y: 70, text: 'Stalls and visitors at the Tarayana Fair, one of the events held on the square.' },
  { id: 'superstar', label: 'Druk Super Star', img: 'druk-superstar', x: 58, y: 72, text: 'Crowds gathered on the square for Druk Super Star.' },
  { id: 'film', label: 'National Film Awards', img: 'film-awards-square', x: 72, y: 56, text: 'The National Film Awards stage, set up on Clock Tower Square.' },
  { id: 'snow', label: 'First snow', img: 'snow-square', x: 50, y: 36, text: 'The square under its first snow, photographed from the hotel.' },
  { id: 'breakfast', label: 'Breakfast view', img: 'breakfast-view', x: 36, y: 24, text: 'Breakfast by the window with the whole square below.' },
];

export function SquareMap() {
  const [sel, setSel] = useState(POINTS[0].id);
  const p = POINTS.find((x) => x.id === sel)!;
  return (
    <div className="map">
      <div>
        <div className="map__plan reveal">
          <svg viewBox="0 0 1000 640" role="img" aria-label="Schematic plan of Clock Tower Square with the hotel along its north side, the Clock Tower and pool in the middle, and Changlimithang stadium to the east" fill="none" stroke="currentColor" style={{ color: 'var(--ink-3)' }}>
            <defs>
              <pattern id="pave" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M0 22 L22 0" stroke="rgb(29 27 25 / 0.06)" />
              </pattern>
            </defs>
            <rect x="120" y="150" width="680" height="400" fill="url(#pave)" strokeWidth="1.2" strokeDasharray="3 6" />
            <rect x="230" y="40" width="440" height="96" fill="#1d1b19" stroke="none" />
            <text x="450" y="96" textAnchor="middle" fill="#f3efe8" stroke="none" fontSize="18" letterSpacing="4" fontFamily="var(--sans)">THIMPHU TOWER</text>
            <rect x="60" y="40" width="150" height="96" strokeWidth="1" />
            <rect x="690" y="40" width="190" height="96" strokeWidth="1" />
            <rect x="60" y="580" width="260" height="50" strokeWidth="1" />
            <rect x="600" y="580" width="280" height="50" strokeWidth="1" />
            <rect x="280" y="260" width="220" height="140" fill="rgb(140 95 43 / 0.08)" strokeWidth="1.2" />
            <text x="390" y="336" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">POOL</text>
            <rect x="548" y="306" width="36" height="36" fill="#1d1b19" stroke="none" />
            <text x="566" y="372" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">CLOCK TOWER</text>
            <path d="M930 220 A90 150 0 0 1 930 520" strokeWidth="1.2" />
            <text x="900" y="380" textAnchor="end" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">STADIUM →</text>
            <text x="460" y="530" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">CLOCK TOWER SQUARE · SCHEMATIC</text>
          </svg>
          {POINTS.map((pt, i) => (
            <button
              key={pt.id}
              type="button"
              className="pin"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              aria-pressed={sel === pt.id}
              aria-label={pt.label}
              onClick={() => setSel(pt.id)}
            >
              <span>{i + 1}</span>
            </button>
          ))}
        </div>
        <ul className="map__list" style={{ marginTop: 'var(--s-4)' }} aria-label="Moments on the square">
          {POINTS.map((pt, i) => (
            <li key={pt.id}>
              <button type="button" className="chip" aria-pressed={sel === pt.id} onClick={() => setSel(pt.id)}>
                {i + 1}. {pt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="map__card" aria-live="polite">
        <div className="frame" key={p.id} style={{ animation: 'step-in 500ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <Img k={p.img} sizes="(max-width: 900px) 100vw, 34vw" />
        </div>
        <h3>{p.label}</h3>
        <p className="muted">{p.text}</p>
      </div>
    </div>
  );
}
