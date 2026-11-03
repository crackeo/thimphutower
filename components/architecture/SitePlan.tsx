// Schematic site plan: the hotel on the edge of Clock Tower Square, the tower and its pool,
// and the direction of Changlimithang stadium. Not to scale.
import type { CSSProperties, ReactElement } from 'react';

export function SitePlan() {
  let i = 0;
  const s = () => ({ pathLength: 1, style: { ['--i' as string]: i++ } as CSSProperties });
  const els: ReactElement[] = [];
  // surrounding blocks
  [
    [30, 30, 120, 90],
    [470, 30, 110, 90],
    [30, 290, 150, 100],
    [420, 300, 160, 90],
  ].forEach(([x, y, w, h], n) => els.push(<rect key={`b${n}`} {...s()} x={x} y={y} width={w} height={h} strokeWidth="0.9" />));
  // the hotel footprint
  els.push(<rect key="hotel" {...s()} x="170" y="30" width="270" height="78" strokeWidth="2" fill="url(#site-hatch)" />);
  // square paving edge
  els.push(<rect key="sq" {...s()} x="160" y="128" width="290" height="150" strokeDasharray="2 4" />);
  // reflecting pool and tower
  els.push(<rect key="pool" {...s()} x="196" y="160" width="120" height="70" />);
  els.push(<rect key="tower" {...s()} x="338" y="182" width="26" height="26" strokeWidth="1.8" />);
  els.push(<path key="tx" {...s()} d="M338 182 L364 208 M364 182 L338 208" strokeWidth="0.8" />);
  // sight lines from the facade
  els.push(<path key="v1" {...s()} d="M250 108 L351 182 M360 108 L351 182" strokeDasharray="4 4" strokeWidth="0.9" />);
  // stadium direction
  els.push(<path key="arrow" {...s()} d="M470 236 H560 M548 226 L562 236 L548 246" />);
  els.push(<path key="stadium" {...s()} d="M574 150 A60 90 0 0 1 574 330" strokeWidth="0.9" />);
  // north arrow
  els.push(<path key="north" {...s()} d="M60 210 L72 180 L84 210 L72 202 Z" />);
  return (
    <svg viewBox="0 0 600 420" role="img" aria-labelledby="site-t" fill="none" stroke="currentColor" strokeWidth="1.2">
      <title id="site-t">Schematic site plan: Thimphu Tower Hotel faces Clock Tower Square, with the Clock Tower and its pool in front and Changlimithang stadium beyond</title>
      <defs>
        <pattern id="site-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V7" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </pattern>
      </defs>
      {els}
      <g fill="currentColor" stroke="none" fontFamily="var(--font-body)" fontSize="11" fontWeight="700" letterSpacing="1.2">
        <rect x="216" y="58" width="178" height="22" fill="var(--stamp, #fbf7ef)" />
        <text x="305" y="74" textAnchor="middle">THIMPHU TOWER HOTEL</text>
        <text x="305" y="268" textAnchor="middle">CLOCK TOWER SQUARE</text>
        <text x="256" y="200" textAnchor="middle" fontSize="10">POOL</text>
        <text x="351" y="226" textAnchor="middle" fontSize="10">CLOCK TOWER</text>
        <text x="515" y="226" textAnchor="middle" fontSize="10">STADIUM</text>
        <text x="72" y="228" textAnchor="middle">N</text>
        <text x="300" y="412" textAnchor="middle" fontSize="10">SCHEMATIC · NOT TO SCALE</text>
      </g>
    </svg>
  );
}
