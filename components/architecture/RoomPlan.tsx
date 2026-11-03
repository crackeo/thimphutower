// Illustrative room layout built from the features the hotel lists for every room:
// bedroom with its own bathroom, desk and chair, sofa, large wardrobe.
import type { CSSProperties, ReactElement } from 'react';

export function RoomPlan({ beds = 'double', name }: { beds?: 'double' | 'twin'; name: string }) {
  let i = 0;
  const s = () => ({ pathLength: 1, style: { ['--i' as string]: i++ } as CSSProperties });
  const e: ReactElement[] = [];
  e.push(<rect key="room" {...s()} x="20" y="60" width="360" height="220" strokeWidth="2.4" />);
  // window wall
  e.push(<path key="win" {...s()} d="M80 60 H320 M80 64 H320 M140 58 V66 M200 58 V66 M260 58 V66" strokeWidth="1" />);
  // bathroom
  e.push(<path key="bath" {...s()} d="M250 180 V280 M250 180 H380" strokeWidth="1.8" />);
  e.push(<rect key="shower" {...s()} x="320" y="186" width="54" height="54" strokeWidth="0.9" />);
  e.push(<path key="shx" {...s()} d="M320 186 L374 240 M374 186 L320 240" strokeWidth="0.6" />);
  e.push(<rect key="wc" {...s()} x="262" y="246" width="24" height="28" rx="10" strokeWidth="0.9" />);
  e.push(<rect key="basin" {...s()} x="300" y="254" width="32" height="20" rx="6" strokeWidth="0.9" />);
  e.push(<path key="bdoor" {...s()} d="M250 190 A34 34 0 0 1 216 224" strokeWidth="0.8" />);
  // entry door
  e.push(<path key="door" {...s()} d="M200 280 A40 40 0 0 0 160 240 V280" strokeWidth="0.8" />);
  // beds
  if (beds === 'double') {
    e.push(<rect key="bed" {...s()} x="100" y="100" width="100" height="110" strokeWidth="1.2" />);
    e.push(<path key="pil" {...s()} d="M110 108 h36 v16 h-36 z M154 108 h36 v16 h-36 z M100 140 H200" strokeWidth="0.8" />);
  } else {
    e.push(<rect key="bed1" {...s()} x="84" y="100" width="62" height="110" strokeWidth="1.2" />);
    e.push(<rect key="bed2" {...s()} x="164" y="100" width="62" height="110" strokeWidth="1.2" />);
    e.push(<path key="pil" {...s()} d="M92 108 h46 v16 h-46 z M172 108 h46 v16 h-46 z" strokeWidth="0.8" />);
  }
  // wardrobe, desk, sofa
  e.push(<rect key="ward" {...s()} x="24" y="200" width="22" height="76" strokeWidth="1" />);
  e.push(<path key="wardx" {...s()} d="M24 200 L46 276 M46 200 L24 276" strokeWidth="0.5" />);
  e.push(<rect key="desk" {...s()} x="270" y="76" width="90" height="26" strokeWidth="1" />);
  e.push(<rect key="chair" {...s()} x="302" y="108" width="24" height="22" rx="4" strokeWidth="0.9" />);
  e.push(<rect key="sofa" {...s()} x="24" y="80" width="30" height="80" rx="5" strokeWidth="1" />);
  return (
    <svg viewBox="0 0 400 330" role="img" aria-labelledby={`rp-${name}`} fill="none" stroke="currentColor" strokeWidth="1.2">
      <title id={`rp-${name}`}>{`Illustrative layout of the ${name}: windows along the outer wall, bed, desk, sofa, wardrobe and private bathroom`}</title>
      {e}
      <g fill="currentColor" stroke="none" fontFamily="var(--font-body)" fontSize="10" fontWeight="700" letterSpacing="1.2">
        <text x="200" y="44" textAnchor="middle">WINDOWS</text>
        <text x="315" y="168" textAnchor="middle">DESK</text>
        <text x="39" y="176" textAnchor="middle">SOFA</text>
        <text x="315" y="212" textAnchor="middle">BATH</text>
        <text x="200" y="316" textAnchor="middle">ILLUSTRATIVE LAYOUT · NOT TO SCALE</text>
      </g>
    </svg>
  );
}
