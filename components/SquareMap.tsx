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
          <svg viewBox="0 0 1000 640" role="img" aria-label="Schematic plan of Clock Tower Square with the hotel along its north side looking over the square, the Clock Tower and pool in the middle, and Changlimithang stadium to the east" fill="none" stroke="currentColor" style={{ color: 'var(--ink-3)' }}>
            <defs>
              <pattern id="pave" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#ece5d8" />
                <path d="M0 0 H18 M0 0 V18" stroke="rgb(29 27 25 / 0.07)" />
              </pattern>
              <pattern id="roof" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="10" fill="#ddd3c2" />
                <path d="M0 0 V10" stroke="rgb(29 27 25 / 0.08)" strokeWidth="3" />
              </pattern>
              <linearGradient id="view" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e1ba3b" stopOpacity="0.32" />
                <stop offset="1" stopColor="#e1ba3b" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="water" cx="0.5" cy="0.45" r="0.7">
                <stop offset="0" stopColor="#a9c1c6" />
                <stop offset="1" stopColor="#7f9ea6" />
              </radialGradient>
              <filter id="lift" x="-10%" y="-10%" width="120%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1d1b19" floodOpacity="0.18" />
              </filter>
            </defs>
            <rect width="1000" height="640" fill="#e4ddcf" stroke="none" />
            {/* streets */}
            <rect x="0" y="138" width="1000" height="12" fill="#d3cabb" stroke="none" />
            <rect x="0" y="556" width="1000" height="20" fill="#d3cabb" stroke="none" />
            {/* the square */}
            <rect x="120" y="150" width="680" height="400" fill="url(#pave)" stroke="rgb(29 27 25 / 0.25)" strokeWidth="1.2" />
            {/* the view from the hotel's windows */}
            <path d="M260 136 L120 550 L800 550 L640 136 Z" fill="url(#view)" stroke="none" />
            {/* neighbouring buildings */}
            <g filter="url(#lift)" stroke="rgb(29 27 25 / 0.25)" strokeWidth="1">
              <rect x="60" y="40" width="150" height="96" fill="url(#roof)" />
              <rect x="690" y="40" width="190" height="96" fill="url(#roof)" />
              <rect x="60" y="580" width="260" height="50" fill="url(#roof)" />
              <rect x="600" y="580" width="280" height="50" fill="url(#roof)" />
              <rect x="230" y="40" width="440" height="96" fill="#1d1b19" stroke="none" />
            </g>
            <path d="M236 128 H664" stroke="#e1ba3b" strokeWidth="3" />
            <text x="450" y="94" textAnchor="middle" fill="#f3efe8" stroke="none" fontSize="18" letterSpacing="4" fontFamily="var(--sans)">THIMPHU TOWER</text>
            {/* trees along the square */}
            <g fill="#8d9a78" stroke="#6f7c5c" strokeWidth="1">
              {[160, 230, 690, 760].map((x) => <circle key={`t${x}`} cx={x} cy="190" r="16" />)}
              {[160, 760].map((x) => <circle key={`b${x}`} cx={x} cy="510" r="16" />)}
            </g>
            {/* pool */}
            <rect x="280" y="260" width="220" height="140" rx="6" fill="url(#water)" stroke="#5f7c84" strokeWidth="1.5" />
            <path d="M300 300 q20 -8 40 0 t40 0 M360 340 q20 -8 40 0 t40 0" stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.5" />
            <text x="390" y="378" textAnchor="middle" fill="#f3efe8" stroke="none" fontSize="13" letterSpacing="3" fontFamily="var(--sans)">POOL</text>
            {/* the Clock Tower, in plan, with its shadow */}
            <rect x="556" y="314" width="40" height="40" fill="rgb(29 27 25 / 0.18)" stroke="none" />
            <rect x="546" y="304" width="40" height="40" fill="#cfab73" stroke="#5a3424" strokeWidth="2" />
            <rect x="554" y="312" width="24" height="24" fill="#9c3a2a" stroke="#5a3424" strokeWidth="1.5" />
            <circle cx="566" cy="324" r="5" fill="#e1ba3b" stroke="none" />
            <text x="566" y="374" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">CLOCK TOWER</text>
            {/* stadium */}
            <path d="M930 200 A100 170 0 0 1 930 540 Z" fill="#a7b48e" stroke="#6f7c5c" strokeWidth="1.2" />
            <path d="M930 236 A72 134 0 0 1 930 504" stroke="rgb(255 255 255 / 0.6)" strokeWidth="1.5" />
            <text x="900" y="380" textAnchor="end" fill="currentColor" stroke="none" fontSize="14" letterSpacing="3" fontFamily="var(--sans)">STADIUM →</text>
            <text x="460" y="530" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13" letterSpacing="3" fontFamily="var(--sans)">CLOCK TOWER SQUARE · SCHEMATIC</text>
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
