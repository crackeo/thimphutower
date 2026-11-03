// Front elevation of Thimphu Tower as seen from Clock Tower Square: four window bays over four
// guest floors, arched triple lights on the upper two, painted frieze and a street-level arcade.
// Illustrative line drawing traced from photographs; not a construction drawing.
import type { CSSProperties, ReactElement } from 'react';

const BAYS = [145, 248, 352, 455];
const FLOORS = [
  { top: 150, h: 66, arched: true },
  { top: 242, h: 66, arched: true },
  { top: 334, h: 50, arched: false },
  { top: 408, h: 50, arched: false },
];

export function Elevation({ title = 'Front elevation of Thimphu Tower Hotel facing Clock Tower Square', labels = true }: { title?: string; labels?: boolean }) {
  let i = 0;
  const s = (): { pathLength: number; style: CSSProperties } => ({ pathLength: 1, style: { ['--i' as string]: i++ } as CSSProperties });
  const els: ReactElement[] = [];
  const add = (el: ReactElement) => els.push(el);

  // ground and massing
  add(<path key="ground" {...s()} d="M8 680 H592" strokeWidth="2" />);
  add(<rect key="wall" {...s()} x="90" y="112" width="420" height="568" strokeWidth="1.6" />);
  // roof, fascia and rafter ends
  add(<path key="roof" {...s()} d="M64 96 L300 74 L536 96" />);
  add(<rect key="fascia" {...s()} x="58" y="96" width="484" height="14" />);
  for (let x = 66; x <= 530; x += 13) add(<rect key={`raf${x}`} {...s()} x={x} y="110" width="5" height="6" />);
  add(<path key="eaveline" {...s()} d="M90 124 H510" strokeWidth="0.8" />);

  // windows
  FLOORS.forEach((f, fi) =>
    BAYS.forEach((x) => {
      const k = `${fi}-${x}`;
      // rabsel lintel: band, dentils, band
      add(<rect key={`lb${k}`} {...s()} x={x - 48} y={f.top - 24} width="96" height="7" />);
      for (let d = x - 44; d <= x + 38; d += 10) add(<rect key={`dt${k}${d}`} {...s()} x={d} y={f.top - 14} width="6" height="5" strokeWidth="0.9" />);
      add(<rect key={`lt${k}`} {...s()} x={x - 46} y={f.top - 7} width="92" height="5" />);
      add(<rect key={`op${k}`} {...s()} x={x - 42} y={f.top} width="84" height={f.h} />);
      [-28, 0, 28].forEach((dx) => {
        const l = x + dx - 13;
        if (f.arched) {
          add(<path key={`ar${k}${dx}`} {...s()} d={`M${l} ${f.top + f.h - 3} V${f.top + 15} A13 11 0 0 1 ${l + 26} ${f.top + 15} V${f.top + f.h - 3}`} strokeWidth="0.9" />);
        } else {
          add(<path key={`ar${k}${dx}`} {...s()} d={`M${l} ${f.top + f.h - 3} V${f.top + 12} Q${l + 13} ${f.top + 2} ${l + 26} ${f.top + 12} V${f.top + f.h - 3}`} strokeWidth="0.9" />);
        }
      });
      add(<path key={`tr${k}`} {...s()} d={`M${x - 42} ${f.top + f.h * 0.62} H${x + 42}`} strokeWidth="0.7" />);
      add(<rect key={`si${k}`} {...s()} x={x - 47} y={f.top + f.h} width="94" height="5" />);
    }),
  );

  // painted frieze over the arcade
  add(<rect key="frieze" {...s()} x="90" y="486" width="420" height="26" />);
  for (let x = 112; x <= 492; x += 38) {
    add(<circle key={`md${x}`} {...s()} cx={x} cy="499" r="7.5" strokeWidth="1" />);
    add(<circle key={`mi${x}`} {...s()} cx={x} cy="499" r="2.5" strokeWidth="0.8" />);
  }
  // arcade columns with bracket capitals
  const COLS = [96, 200, 300, 400, 504];
  COLS.forEach((x) => {
    add(<path key={`cap${x}`} {...s()} d={`M${x - 14} 512 H${x + 14} L${x + 8} 524 H${x - 8} Z`} />);
    add(<rect key={`col${x}`} {...s()} x={x - 6} y="524" width="12" height="156" />);
    add(<path key={`cb${x}`} {...s()} d={`M${x - 6} 560 H${x + 6} M${x - 6} 640 H${x + 6}`} strokeWidth="0.8" />);
  });
  // shopfronts between columns, stair at the left bay
  [
    [106, 194],
    [206, 294],
    [306, 394],
    [406, 498],
  ].forEach(([a, b], n) => {
    add(<rect key={`sign${n}`} {...s()} x={a + 4} y="532" width={b - a - 8} height="12" strokeWidth="0.9" />);
    if (n === 0) {
      for (let st = 0; st < 7; st++) add(<path key={`st${st}`} {...s()} d={`M${a + 8 + st * 11} ${676 - st * 14} h11 v-14`} strokeWidth="0.9" />);
      add(<path key="rail" {...s()} d={`M${a + 8} 650 L${a + 88} 566`} strokeWidth="0.8" />);
    } else {
      add(<rect key={`gl${n}`} {...s()} x={a + 6} y="556" width={b - a - 12} height="98" strokeWidth="0.9" />);
      add(<path key={`dr${n}`} {...s()} d={`M${(a + b) / 2 - 12} 680 V600 H${(a + b) / 2 + 12} V680`} strokeWidth="0.9" />);
      add(<path key={`mu${n}`} {...s()} d={`M${a + 6 + (b - a - 12) / 3} 556 V598 M${a + 6 + (2 * (b - a - 12)) / 3} 556 V598`} strokeWidth="0.7" />);
    }
  });
  // scale figure
  add(<path key="fig" {...s()} d="M560 680 l4 -22 l4 22 M564 658 v-14 M558 650 h12 M564 644 a3.5 3.5 0 1 1 0.1 0" strokeWidth="1" />);

  return (
    <svg viewBox="0 0 600 720" role="img" aria-labelledby="elev-t" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <title id="elev-t">{title}</title>
      {els}
      {labels && (
        <g fill="currentColor" stroke="none" fontFamily="var(--font-body)" fontSize="11" fontWeight="700" letterSpacing="1.6">
          <text x="300" y="704" textAnchor="middle">ELEVATION · FACING CLOCK TOWER SQUARE</text>
        </g>
      )}
    </svg>
  );
}
