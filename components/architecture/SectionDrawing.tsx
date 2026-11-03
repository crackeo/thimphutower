// Schematic section: guest floors stacked over the street-level arcade, with the sight line
// from a room window to the Clock Tower. Illustrative only.
import type { CSSProperties, ReactElement } from 'react';

export function SectionDrawing() {
  let i = 0;
  const s = () => ({ pathLength: 1, style: { ['--i' as string]: i++ } as CSSProperties });
  const els: ReactElement[] = [];
  const LEVELS = [470, 400, 330, 260, 190];
  els.push(<path key="g" {...s()} d="M10 470 H590" strokeWidth="2" />);
  els.push(<path key="lw" {...s()} d="M120 470 V120 M130 470 V120" />);
  els.push(<path key="rw" {...s()} d="M410 470 V120 M420 470 V120" />);
  els.push(<path key="roof" {...s()} d="M92 120 L270 98 L448 120 Z" />);
  LEVELS.slice(1).forEach((y) => els.push(<rect key={`sl${y}`} {...s()} x="120" y={y - 6} width="300" height="6" fill="url(#hatch)" />));
  els.push(<rect key="slr" {...s()} x="120" y="120" width="300" height="6" fill="url(#hatch)" />);
  // windows cut in the square-facing wall
  [210, 280, 345, 415].forEach((y, n) => els.push(<path key={`w${n}`} {...s()} d={`M408 ${y} h14 M408 ${y + 40} h14`} strokeWidth="2.2" stroke="var(--paper, #f4ecdd)" />));
  [210, 280, 345, 415].forEach((y, n) => els.push(<rect key={`wf${n}`} {...s()} x="410" y={y} width="10" height="40" strokeWidth="0.8" />));
  // stair core
  LEVELS.slice(0, 4).forEach((y, n) => els.push(<path key={`stc${n}`} {...s()} d={`M140 ${y} l14 -10 l14 0 l14 -10 l14 0 l14 -10 l14 0 l14 -10 l14 0 l14 -10 l14 0 l14 -10 l14 0 l14 -10`} strokeWidth="0.8" />));
  // furniture hints: bed + figure per guest floor
  [400, 330, 260, 190].forEach((y) => els.push(<path key={`bed${y}`} {...s()} d={`M300 ${y - 6} v-16 h70 v16 M300 ${y - 22} v-8`} strokeWidth="0.9" />));
  els.push(<path key="fig" {...s()} d="M395 394 l3 -18 l3 18 M398 376 v-12 M393 370 h10 M398 364 a3 3 0 1 1 0.1 0" strokeWidth="0.9" />);
  // the Clock Tower across the square
  els.push(<path key="ct" {...s()} d="M528 470 V214 H556 V470 M524 214 L542 196 L560 214 M532 470 h20" />);
  els.push(<circle key="clock" {...s()} cx="542" cy="232" r="9" />);
  els.push(<path key="ctb" {...s()} d="M528 260 H556 M528 300 H556 M524 196 H560" strokeWidth="0.8" />);
  // sight line
  els.push(<path key="sight" {...s()} d="M420 300 L536 236" strokeDasharray="5 5" strokeWidth="1" />);
  return (
    <svg viewBox="0 0 600 520" role="img" aria-labelledby="sec-t" fill="none" stroke="currentColor" strokeWidth="1.2">
      <title id="sec-t">Schematic section through the hotel showing guest floors above the street arcade and the view line to the Clock Tower</title>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V6" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      {els}
      <g fill="currentColor" stroke="none" fontFamily="var(--font-body)" fontSize="11" fontWeight="700" letterSpacing="1.2">
        <text x="20" y="300" >GUEST</text>
        <text x="20" y="314">FLOORS</text>
        <path d="M78 194 V398" stroke="currentColor" strokeWidth="1" />
        <text x="20" y="444">STREET</text>
        <text x="20" y="458">ARCADE</text>
        <path d="M78 404 V468" stroke="currentColor" strokeWidth="1" />
        <text x="462" y="262" transform="rotate(-29 462 262)">VIEW LINE</text>
        <text x="542" y="492" textAnchor="middle">CLOCK TOWER</text>
        <text x="270" y="500" textAnchor="middle">SECTION · ILLUSTRATIVE</text>
      </g>
    </svg>
  );
}
