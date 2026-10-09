import React from 'react';
import type { OutfitId, SkinToneOption } from '../../../types/vn';
import { Pt, f1, shade } from './artKit';

/* =========================================================================
   OUTFIT ART
   Drawn clothing with folds, seams, real necklines and shading, plus woven
   and printed fabrics (Ankara wax print, cord lace, adire, aso-oke, denim).
   Coordinates match HeroineSvg (viewBox 0 0 320 420). The neck is drawn on
   top of the clothes, so necklines sit at y >= 244.
   ========================================================================= */

// ---------- geometry helpers ----------
const mirrorD = (d: string) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${f1(320 - parseFloat(x))} ${y}`);
/** Both halves of a symmetric shape, given the left half */
const both = (d: string) => `${d} ${mirrorD(d)}`;

/**
 * One closed outline from a left half that starts at the bottom centre (x=160)
 * and ends at the top centre: the right half is the mirror, walked backwards.
 * Absolute M/L/C/Q commands only.
 */
const sym = (half: string) => {
  const toks = half.replace(/,/g, ' ').trim().split(/\s+/);
  type Seg = { c: string; pts: Pt[] };
  const segs: Seg[] = [];
  let i = 0;
  let cmd = '';
  const need: Record<string, number> = { M: 1, L: 1, C: 3, Q: 2 };
  while (i < toks.length) {
    if (/^[A-Za-z]$/.test(toks[i])) cmd = toks[i++];
    if (cmd === 'Z') break;
    const pts: Pt[] = [];
    for (let k = 0; k < need[cmd]; k++) pts.push([parseFloat(toks[i++]), parseFloat(toks[i++])]);
    segs.push({ c: cmd, pts });
  }
  const p = (q: Pt) => `${f1(q[0])} ${f1(q[1])}`;
  const m = (q: Pt): Pt => [320 - q[0], q[1]];
  let d = segs.map((g) => `${g.c} ${g.pts.map(p).join(' ')}`).join(' ');
  for (let k = segs.length - 1; k >= 1; k--) {
    const g = segs[k];
    const prev = segs[k - 1].pts[segs[k - 1].pts.length - 1];
    if (g.c === 'C') d += ` C ${p(m(g.pts[1]))} ${p(m(g.pts[0]))} ${p(m(prev))}`;
    else if (g.c === 'Q') d += ` Q ${p(m(g.pts[0]))} ${p(m(prev))}`;
    else d += ` L ${p(m(prev))}`;
  }
  return d + ' Z';
};

/** Left half of a sleeved top: shoulder from P (where it meets the neckline), neckline `nl` runs from P to the centre line */
const sleevedHalf = (P: Pt, nl: string, centerY: number) =>
  `M 160 420 L 63 420 C 69 372, 77 336, 85 312 C 93 288, ${f1(P[0] - 22)} ${f1(P[1] + 10)}, ${f1(P[0])} ${f1(P[1])} ${nl} L 160 ${f1(centerY)}`;

/** Left half of a sleeveless bodice: arm stays bare from the armpit down */
const bodiceHalf = (top: string, centerY: number) =>
  `M 160 420 L 99 420 C 100 380, 101 346, 104 322 ${top} L 160 ${f1(centerY)}`;

// ---------- drawing primitives ----------
const Fold: React.FC<{ d: string; c: string; w?: number; o?: number }> = ({ d, c, w = 2.4, o = 1 }) => (
  <g fill="none" strokeLinecap="round">
    <path d={d} stroke={shade(c, -0.45)} strokeWidth={w} opacity={0.32 * o} />
    <path d={d} stroke={shade(c, 0.35)} strokeWidth={w * 0.45} opacity={0.38 * o} transform="translate(1.6 0.6)" />
  </g>
);
const Folds: React.FC<{ ds: string[]; c: string; w?: number; o?: number }> = ({ ds, c, w, o }) => (
  <>
    {ds.map((d, i) => (
      <React.Fragment key={i}>
        <Fold d={d} c={c} w={w} o={o} />
        <Fold d={mirrorD(d)} c={c} w={w} o={o} />
      </React.Fragment>
    ))}
  </>
);
const Seam: React.FC<{ d: string; c: string; sym?: boolean; o?: number }> = ({ d, c, sym = true, o = 0.7 }) => (
  <g fill="none" strokeLinecap="round">
    <path d={sym ? both(d) : d} stroke={shade(c, -0.4)} strokeWidth="1.1" opacity={0.35 * o} />
    <path d={sym ? both(d) : d} stroke={shade(c, 0.45)} strokeWidth="0.7" strokeDasharray="1.8 1.6" opacity={o} transform="translate(0.8 0.4)" />
  </g>
);

/** Shared shading defs for one garment */
const ShadeDefs: React.FC<{ id: string }> = ({ id }) => (
  <>
    <linearGradient id={`${id}_side`} gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="260" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0.42" />
      <stop offset="0.2" stopColor="#000" stopOpacity="0.08" />
      <stop offset="0.42" stopColor="#FFF" stopOpacity="0.07" />
      <stop offset="0.7" stopColor="#000" stopOpacity="0.02" />
      <stop offset="1" stopColor="#000" stopOpacity="0.45" />
    </linearGradient>
    <linearGradient id={`${id}_down`} gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="0" y2="420">
      <stop offset="0" stopColor="#FFF" stopOpacity="0.06" />
      <stop offset="1" stopColor="#000" stopOpacity="0.22" />
    </linearGradient>
  </>
);

/**
 * A garment: clip to its outline, lay the fabric, then shading and details.
 * `fabric` is a colour or a url(#pattern). Children are drawn inside the clip.
 */
const Garment: React.FC<{
  id: string;
  d: string;
  fabric: string;
  base: string;
  children?: React.ReactNode;
  over?: React.ReactNode;
  edge?: string;
}> = ({ id, d, fabric, base, children, over, edge }) => (
  <g>
    <defs>
      <clipPath id={`${id}_clip`}>
        <path d={d} />
      </clipPath>
      <ShadeDefs id={id} />
      {/* outline everywhere except the centre seam where the two halves meet */}
      <clipPath id={`${id}_noc`}>
        <rect x="0" y="0" width="159.6" height="420" />
        <rect x="162" y="0" width="160" height="420" />
      </clipPath>
    </defs>
    <path d={d} fill={base} />
    <g clipPath={`url(#${id}_clip)`}>
      {fabric !== base && <rect x="40" y="200" width="240" height="220" fill={fabric} />}
      {children}
      <rect x="40" y="200" width="240" height="220" fill={`url(#${id}_side)`} />
      <rect x="40" y="200" width="240" height="220" fill={`url(#${id}_down)`} />
    </g>
    <path d={d} fill="none" stroke={edge ?? shade(base, -0.5)} strokeWidth="1" opacity="0.55" clipPath={`url(#${id}_noc)`} />
    {over}
  </g>
);

/** Soft arm/torso separation and bust shaping, used under most tops */
const BodyFolds: React.FC<{ c: string; sleeves?: boolean; o?: number }> = ({ c, sleeves = true, o = 1 }) => (
  <>
    {sleeves && <Folds c={c} o={o} w={3.2} ds={['M 103 314 C 101 350, 99 390, 99 420']} />}
    <Folds c={c} o={o * 0.8} ds={['M 118 364 C 128 374, 142 376, 154 368', 'M 110 330 C 118 340, 124 352, 126 364']} />
  </>
);

// ---------- fabrics ----------
const AnkaraPattern: React.FC<{ id: string }> = ({ id }) => {
  const c = { bg: '#E8701A', teal: '#0E7C74', mag: '#B8235A', yel: '#F6C431', ink: '#1A1412', cream: '#FFF3DF' };
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(-8) translate(4 2)">
      <rect width="34" height="34" fill={c.bg} />
      {/* large wax-print medallion */}
      <circle cx="17" cy="17" r="11.5" fill={c.ink} />
      <circle cx="17" cy="17" r="10" fill={c.teal} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <ellipse key={i} cx={17 + Math.cos(a) * 7.2} cy={17 + Math.sin(a) * 7.2} rx="1.9" ry="1.1" transform={`rotate(${(a * 180) / Math.PI} ${f1(17 + Math.cos(a) * 7.2)} ${f1(17 + Math.sin(a) * 7.2)})`} fill={c.cream} />;
      })}
      <circle cx="17" cy="17" r="4.6" fill={c.yel} stroke={c.ink} strokeWidth="1" />
      <circle cx="17" cy="17" r="1.8" fill={c.mag} />
      {/* corner quarter-discs make the secondary motif */}
      {[[0, 0], [34, 0], [0, 34], [34, 34]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5.5" fill={c.mag} stroke={c.ink} strokeWidth="0.9" />
          <circle cx={x} cy={y} r="2.2" fill={c.yel} />
        </g>
      ))}
      {/* leaf shapes and crackle dots between */}
      <path d="M 17 0.5 Q 20 3 17 5.5 Q 14 3 17 0.5 Z M 17 28.5 Q 20 31 17 33.5 Q 14 31 17 28.5 Z M 0.5 17 Q 3 14 5.5 17 Q 3 20 0.5 17 Z M 28.5 17 Q 31 14 33.5 17 Q 31 20 28.5 17 Z" fill={c.ink} />
      {[[8, 3], [26, 3], [3, 8], [31, 26], [8, 31], [26, 31], [3, 26], [31, 8]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill={c.cream} />
      ))}
    </pattern>
  );
};

const LacePattern: React.FC<{ id: string; base: string; cord: string }> = ({ id, base, cord }) => {
  const lining = shade(base, -0.35);
  const flower = (cx: number, cy: number, r: number) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const tip: Pt = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
      const l: Pt = [cx + Math.cos(a - 0.5) * r * 0.75, cy + Math.sin(a - 0.5) * r * 0.75];
      const rr: Pt = [cx + Math.cos(a + 0.5) * r * 0.75, cy + Math.sin(a + 0.5) * r * 0.75];
      d += `M ${f1(cx)} ${f1(cy)} Q ${f1(l[0])} ${f1(l[1])} ${f1(tip[0])} ${f1(tip[1])} Q ${f1(rr[0])} ${f1(rr[1])} ${f1(cx)} ${f1(cy)} `;
    }
    return d;
  };
  const flowers = flower(15, 15, 9) + flower(0, 0, 5) + flower(30, 0, 5) + flower(0, 30, 5) + flower(30, 30, 5);
  const vines = 'M 0 15 C 5 10, 5 20, 7 15 M 30 15 C 25 10, 25 20, 23 15 M 15 0 C 10 5, 20 5, 15 7 M 15 30 C 10 25, 20 25, 15 23';
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="30" height="30">
      <rect width="30" height="30" fill={base} />
      {/* open-work eyelets show the darker lining */}
      {[[7, 7], [23, 7], [7, 23], [23, 23]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" fill={lining} />
          <circle cx={x} cy={y} r="2.6" fill="none" stroke={cord} strokeWidth="0.9" />
        </g>
      ))}
      {/* raised cord: dark under-stroke then the gold cord */}
      <path d={flowers + vines} fill="none" stroke={shade(cord, -0.55)} strokeWidth="2.2" />
      <path d={flowers + vines} fill="none" stroke={cord} strokeWidth="1.25" />
      <path d={flowers} fill="none" stroke={shade(cord, 0.5)} strokeWidth="0.4" transform="translate(-0.3 -0.4)" />
      <circle cx="15" cy="15" r="1.6" fill="#FFF8E6" />
      <circle cx="15" cy="15" r="0.7" fill="#FFFFFF" />
    </pattern>
  );
};

const AdirePattern: React.FC<{ id: string }> = ({ id }) => {
  const indigo = '#1E2F6E';
  const pale = '#C9D6F2';
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(4)">
      <rect width="40" height="40" fill={indigo} />
      {/* resist-dyed rings, slightly uneven like hand-tied cloth */}
      <g fill="none" stroke={pale}>
        <path d="M 20 9 C 27 9, 31 14, 31 20 C 31 27, 26 31, 20 31 C 13 31, 9 26, 9 20 C 9 13, 14 9, 20 9 Z" strokeWidth="1.6" opacity="0.85" />
        <path d="M 20 13.5 C 24.5 13.5, 26.5 16, 26.5 20 C 26.5 24.5, 24 26.5, 20 26.5 C 15.5 26.5, 13.5 24, 13.5 20 C 13.5 15.5, 16 13.5, 20 13.5 Z" strokeWidth="1.2" opacity="0.7" />
        <path d="M 0 0 L 6 6 M 40 0 L 34 6 M 0 40 L 6 34 M 40 40 L 34 34" strokeWidth="1" opacity="0.6" />
      </g>
      <circle cx="20" cy="20" r="2.4" fill={pale} opacity="0.9" />
      {[[3, 20], [37, 20], [20, 3], [20, 37]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill={pale} opacity="0.75" />
      ))}
      {/* faint mottling */}
      <rect width="40" height="40" fill="#0B1640" opacity="0.12" />
    </pattern>
  );
};

const AsoOkePattern: React.FC<{ id: string }> = ({ id }) => {
  const wine = '#6E1423';
  const gold = '#D9A932';
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="22" height="6">
      <rect width="22" height="6" fill={wine} />
      <rect x="2" width="4.5" height="6" fill={gold} />
      <rect x="3.8" width="0.9" height="6" fill="#FFF1C4" opacity="0.85" />
      <rect x="11" width="1.4" height="6" fill="#F3E6D0" opacity="0.8" />
      <rect x="15" width="2.6" height="6" fill={shade(wine, -0.35)} />
      {/* weave: tiny alternating ticks across the warp */}
      <path d="M 0 1.5 H 22 M 0 4.5 H 22" stroke="#000" strokeWidth="0.35" strokeDasharray="1 1" opacity="0.35" />
      <path d="M 1 3 H 22" stroke="#FFF" strokeWidth="0.3" strokeDasharray="0.8 1.2" opacity="0.25" />
    </pattern>
  );
};

const TwillPattern: React.FC<{ id: string; base: string }> = ({ id, base }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-40)">
    <rect width="4" height="4" fill={base} />
    <rect width="4" height="1.3" fill={shade(base, 0.18)} />
    <rect y="2.4" width="4" height="0.5" fill={shade(base, -0.2)} />
  </pattern>
);

const DamaskPattern: React.FC<{ id: string; base: string }> = ({ id, base }) => {
  const motif = shade(base, 0.16);
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="32" height="40">
      <rect width="32" height="40" fill={base} />
      <path
        d="M 16 4 C 22 10, 24 16, 16 20 C 8 16, 10 10, 16 4 Z M 16 20 C 20 26, 26 26, 28 32 C 22 31, 18 28, 16 24 C 14 28, 10 31, 4 32 C 6 26, 12 26, 16 20 Z M 0 20 C 3 23, 3 27, 0 30 M 32 20 C 29 23, 29 27, 32 30"
        fill={motif}
        stroke={shade(base, 0.3)}
        strokeWidth="0.5"
      />
    </pattern>
  );
};

/** Gold embroidery band (scrolls along a path) */
const Embroidery: React.FC<{ d: string; w?: number }> = ({ d, w = 7 }) => (
  <g fill="none" strokeLinecap="round">
    <path d={d} stroke="#5B3A07" strokeWidth={w + 1.6} opacity="0.55" />
    <path d={d} stroke="#C9971F" strokeWidth={w} />
    <path d={d} stroke="#8A5E0A" strokeWidth={w * 0.55} strokeDasharray="2.2 2.2" />
    <path d={d} stroke="#FBE7A1" strokeWidth={w * 0.22} strokeDasharray="0.9 3.5" />
    <path d={d} stroke="#FFF6D5" strokeWidth="0.6" opacity="0.6" transform="translate(0 -1.6)" />
  </g>
);

const Button: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 2.6, c = '#C9A040' }) => (
  <g>
    <circle cx={x} cy={y + 0.6} r={r} fill="#000" opacity="0.3" />
    <circle cx={x} cy={y} r={r} fill={c} />
    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#FFF" opacity="0.6" />
  </g>
);

// ---------- skin details for bare shoulders ----------
const ArmLines: React.FC<{ skin: SkinToneOption }> = ({ skin }) => (
  <g fill="none" stroke={skin.shadowColor} strokeLinecap="round" opacity="0.55">
    <path d={both('M 104 322 C 101 300, 96 290, 92 286')} strokeWidth="1.4" />
    <path d={both('M 104 322 C 102 356, 100 390, 99 420')} strokeWidth="2.2" opacity="0.7" />
  </g>
);

// =====================================================================
// OUTFITS
// =====================================================================
export function OutfitArt({ outfit, id, skin }: { outfit: OutfitId; id: string; skin: SkinToneOption }) {
  switch (outfit) {
    case 'casual': {
      // Oversized campus tee: ribbed crew neck, dropped shoulders, soft drape
      const c = '#22406B';
      const neck = 'C 140 254, 150 260, 160 260';
      const d = sym(sleevedHalf([134, 250], neck, 260));
      return (
        <Garment id={id} d={d} fabric={c} base={c}>
          <BodyFolds c={c} />
          <Folds c={c} ds={['M 86 330 C 94 318, 104 312, 112 306', 'M 120 404 C 130 396, 142 394, 152 398', 'M 70 386 C 78 392, 86 398, 90 412']} />
          {/* dropped-shoulder seams */}
          <Seam c={c} d="M 98 290 C 96 300, 94 312, 92 324" />
          {/* ribbed neckband */}
          <path d={both('M 132 250 C 140 256, 150 262, 160.8 262 L 160.8 268 C 148 268, 136 262, 126 254 Z')} fill={shade(c, -0.12)} />
          <path d={both('M 130 252 C 140 260, 150 264, 160.8 265')} stroke={shade(c, -0.4)} strokeWidth="5" strokeDasharray="0.8 1.6" fill="none" opacity="0.5" />
          <Seam c={c} d="M 126 255 C 136 263, 148 268, 160.8 268.5" />
          {/* hem stitch */}
          <Seam c={c} d="M 66 412 L 160.8 414" o={0.5} />
          {/* screen print, slightly worn */}
          <g opacity="0.92">
            <text x="160" y="338" fill="#F1F5F9" fontSize="17" fontWeight="800" textAnchor="middle" letterSpacing="4" fontFamily="Georgia, serif">
              LAU
            </text>
            <path d="M 132 344 Q 160 350 188 344" stroke="#F1F5F9" strokeWidth="1.6" fill="none" />
            <path d="M 140 326 L 146 334 M 168 330 L 176 324 M 152 336 L 160 332" stroke={c} strokeWidth="0.9" opacity="0.8" />
          </g>
        </Garment>
      );
    }

    case 'corporate': {
      // Tailored blazer with notched lapels over a crisp shirt
      const jacket = '#232C3D';
      const shirt = '#F4F6FA';
      const shirtD = sym('M 160 420 L 128 420 L 132 252 C 140 258, 150 262, 160 264');
      const jacketHalf = 'M 150 420 L 63 420 C 69 372, 77 336, 85 312 C 93 288, 112 262, 132 252 L 136 262 L 128 290 L 140 296 L 154 362 L 150 420';
      return (
        <g>
          <Garment id={`${id}_s`} d={shirtD} fabric={shirt} base={shirt} edge={shade(shirt, -0.3)}>
            <Fold c={shirt} d="M 160.8 300 L 160.8 420" w={1.2} />
            <Button x={160.8} y={318} r={1.7} c="#E5E7EB" />
            <Button x={160.8} y={352} r={1.7} c="#E5E7EB" />
            <Button x={160.8} y={386} r={1.7} c="#E5E7EB" />
            <Folds c={shirt} ds={['M 140 300 C 146 320, 150 340, 152 360']} o={0.7} />
          </Garment>
          {/* shirt collar points */}
          <path d={both('M 134 250 C 142 260, 152 266, 160.8 270 L 150 286 C 144 276, 138 264, 134 250 Z')} fill={shirt} stroke={shade(shirt, -0.3)} strokeWidth="0.8" />
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={jacket} base={jacket}>
            <BodyFolds c={jacket} />
            <Seam c={jacket} d="M 96 290 C 94 302, 92 314, 90 326" />
            {/* princess seam and welt pocket */}
            <Seam c={jacket} d="M 116 300 C 120 340, 124 380, 124 420" o={0.4} />
            <path d={both('M 98 384 L 128 380')} stroke={shade(jacket, -0.5)} strokeWidth="2.2" />
            <path d={both('M 98 385.5 L 128 381.5')} stroke={shade(jacket, 0.3)} strokeWidth="0.6" />
          </Garment>
          {/* lapels with roll-line highlight and notch */}
          <path d={both('M 132 252 L 136 262 L 128 290 L 140 296 L 154 362 L 146 362 C 136 330, 124 306, 118 290 L 124 282 L 120 272 C 124 262, 128 256, 132 252 Z')} fill={shade(jacket, -0.15)} />
          <path d={both('M 132 253 L 120 272 L 124 282 L 118 290')} stroke={shade(jacket, 0.4)} strokeWidth="0.9" fill="none" opacity="0.7" />
          <path d={both('M 140 296 L 154 362')} stroke={shade(jacket, 0.35)} strokeWidth="1.2" fill="none" opacity="0.6" />
          <Button x={160.8} y={378} r={3} />
        </g>
      );
    }

    case 'ankara': {
      // Ankara sweetheart dress: wax print, piped neckline, puff sleeves, princess seams
      const base = '#E8701A';
      const pid = `${id}_ank`;
      const neck = 'C 132 262, 138 274, 148 276 C 154 277, 158 272, 160.8 268';
      const d = sym(sleevedHalf([118, 258], neck, 268));
      const piping = '#0E7C74';
      return (
        <g>
          <defs>
            <AnkaraPattern id={pid} />
          </defs>
          <Garment id={id} d={d} fabric={`url(#${pid})`} base={base}>
            <BodyFolds c={base} o={1.2} />
            <Seam c={base} d="M 128 286 C 126 320, 128 360, 132 420" o={0.6} />
            <Folds c={base} ds={['M 124 404 C 134 396, 146 394, 156 400']} />
          </Garment>
          {/* gathered puff sleeves */}
          {[0, 1].map((m) => (
            <g key={m} transform={m ? 'translate(320 0) scale(-1 1)' : undefined}>
              <path d="M 84 316 C 80 292, 96 268, 120 258 C 118 276, 112 298, 104 322 C 98 324, 90 322, 84 316 Z" fill={`url(#${pid})`} />
              <path d="M 84 316 C 80 292, 96 268, 120 258 C 118 276, 112 298, 104 322 C 98 324, 90 322, 84 316 Z" fill={`url(#${id}_side)`} />
              <path d="M 92 280 C 96 292, 98 304, 96 318 M 102 270 C 106 284, 106 300, 102 320 M 112 262 C 114 276, 112 292, 108 312" stroke="#000" strokeWidth="1.4" opacity="0.28" fill="none" />
              <path d="M 84 316 C 92 322, 98 324, 104 322" stroke={piping} strokeWidth="2.6" fill="none" />
            </g>
          ))}
          <path d={both('M 118 258 ' + neck)} stroke={piping} strokeWidth="2.8" fill="none" />
          <path d={both('M 118 257 ' + neck)} stroke="#FFF" strokeWidth="0.6" fill="none" opacity="0.5" />
        </g>
      );
    }

    case 'party_dress': {
      // Emerald satin slip with cowl drape and spaghetti straps
      const base = '#0B5D45';
      const top = 'C 112 314, 118 302, 124 296 C 134 302, 148 312, 160.8 314';
      const d = sym(bodiceHalf(top, 314));
      return (
        <g>
          <ArmLines skin={skin} />
          <path d={both('M 126 297 C 128 284, 130 266, 132 252')} stroke="#C9CFD6" strokeWidth="1.5" fill="none" />
          <Garment id={id} d={d} fabric={base} base={base}>
            {/* satin sheen: soft light bands that follow the body */}
            <path d={both('M 116 330 C 122 360, 124 392, 124 420')} stroke="#7EE0BC" strokeWidth="9" fill="none" opacity="0.22" />
            <path d={both('M 118 334 C 123 362, 125 392, 125 420')} stroke="#C8F7E4" strokeWidth="2" fill="none" opacity="0.35" />
            {/* cowl swags */}
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <path d={`M ${124 + k * 2} ${f1(304 + k * 12)} Q 160.8 ${f1(332 + k * 18)} ${196 - k * 2} ${f1(304 + k * 12)}`} stroke={shade(base, -0.5)} strokeWidth="3" fill="none" opacity="0.45" />
                <path d={`M ${124 + k * 2} ${f1(301 + k * 12)} Q 160.8 ${f1(329 + k * 18)} ${196 - k * 2} ${f1(301 + k * 12)}`} stroke="#9AF0CF" strokeWidth="1.3" fill="none" opacity="0.5" />
              </g>
            ))}
            <Folds c={base} ds={['M 108 380 C 116 392, 122 404, 126 420']} />
          </Garment>
          <path d={both('M 104 322 ' + top)} stroke="#A7F3D0" strokeWidth="0.8" fill="none" opacity="0.6" />
        </g>
      );
    }

    case 'hoodie': {
      // Heavy cotton hoodie: hood behind the neck, drawstrings, kangaroo pocket, ribbing
      const c = '#A2501A';
      const neck = 'C 138 262, 148 270, 160.8 272';
      const d = sym(sleevedHalf([124, 252], neck, 272));
      return (
        <g>
          {/* hood bunched behind the neck */}
          <path d={both('M 112 262 C 116 236, 136 226, 160.8 226 L 160.8 250 C 146 250, 134 256, 126 268 Z')} fill={shade(c, -0.3)} />
          <path d={both('M 118 258 C 124 240, 140 234, 160.8 234')} stroke={shade(c, -0.55)} strokeWidth="2" fill="none" opacity="0.6" />
          <Garment id={id} d={d} fabric={c} base={c}>
            <BodyFolds c={c} o={1.2} />
            <Folds c={c} ds={['M 84 340 C 92 330, 100 324, 108 320', 'M 72 380 C 80 386, 88 394, 92 408']} w={3} />
            <Seam c={c} d="M 100 288 C 98 300, 96 314, 94 326" />
            {/* kangaroo pocket */}
            <path d={both('M 122 420 L 126 384 C 136 376, 148 374, 160.8 374')} fill={shade(c, 0.05)} />
            <Seam c={c} d="M 124 420 L 128 386 C 138 378, 150 376, 160.8 376" />
            <path d={both('M 126 384 C 130 396, 132 410, 132 420')} stroke={shade(c, -0.55)} strokeWidth="1.6" fill="none" opacity="0.6" />
            {/* rib hem */}
            <rect x="60" y="408" width="200" height="12" fill={shade(c, -0.15)} />
            <path d="M 60 408 H 260" stroke={shade(c, -0.45)} strokeWidth="1" opacity="0.6" />
          </Garment>
          {/* hood lining edge round the neck */}
          <path d={both('M 124 252 ' + neck)} stroke={shade(c, -0.45)} strokeWidth="5" fill="none" />
          <path d={both('M 124 251 ' + neck)} stroke={shade(c, 0.25)} strokeWidth="1" fill="none" opacity="0.6" />
          {/* drawstrings with metal aglets */}
          {[148, 173].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={i ? 270 : 270} r="2" fill={shade(c, -0.6)} stroke="#C0C4CC" strokeWidth="0.8" />
              <path d={`M ${x} 270 C ${x + (i ? 2 : -2)} 290, ${x + (i ? -1 : 1)} 306, ${x + (i ? 1 : -1)} 322`} stroke="#F3E9D6" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d={`M ${x} 270 C ${x + (i ? 2 : -2)} 290, ${x + (i ? -1 : 1)} 306, ${x + (i ? 1 : -1)} 322`} stroke="#B9AA8E" strokeWidth="0.6" strokeDasharray="1.2 1.2" fill="none" />
              <rect x={x + (i ? 1 : -1) - 1.6} y="320" width="3.2" height="7" rx="1" fill="#C7CBD3" stroke="#7A808C" strokeWidth="0.5" />
            </g>
          ))}
        </g>
      );
    }

    case 'native_lace': {
      // Cord lace boat-neck blouse with scalloped edge and beading
      const base = '#6B1FB0';
      const cord = '#E7C35A';
      const pid = `${id}_lace`;
      const neck = 'C 128 264, 146 268, 160.8 268';
      const d = sym(sleevedHalf([108, 262], neck, 268));
      const scallops = (y0: number) => {
        let s = `M 106 ${y0}`;
        for (let x = 106; x + 6.8 <= 161; x += 6.8) s += ` Q ${f1(x + 3.4)} ${y0 + 4.6} ${f1(x + 6.8)} ${y0}`;
        return s;
      };
      return (
        <g>
          <defs>
            <LacePattern id={pid} base={base} cord={cord} />
          </defs>
          <Garment id={id} d={d} fabric={`url(#${pid})`} base={base}>
            <BodyFolds c={base} o={1.3} />
            <Folds c={base} ds={['M 120 404 C 130 396, 142 394, 154 400']} />
          </Garment>
          {/* scalloped cord edge along the boat neck */}
          <g fill="none" strokeLinecap="round">
            <path d={both(scallops(264))} stroke={shade(cord, -0.55)} strokeWidth="2.6" />
            <path d={both(scallops(264))} stroke={cord} strokeWidth="1.5" />
            <path d={both('M 108 262 ' + neck)} stroke={cord} strokeWidth="1.8" />
          </g>
          {/* stones */}
          {[112, 124, 136, 148].map((x) => (
            <g key={x}>
              <circle cx={x + 3.4} cy="270" r="1.3" fill="#FFF8E1" />
              <circle cx={320 - x - 3.4} cy="270" r="1.3" fill="#FFF8E1" />
            </g>
          ))}
        </g>
      );
    }

    case 'bubu_kaftan': {
      // Flowing bubu: tonal damask, wide sleeves, gold-embroidered V neckline
      const base = '#0F6B5E';
      const pid = `${id}_dam`;
      const neck = 'C 138 270, 148 290, 160.8 306';
      const d = sym(`M 160 420 L 50 420 C 58 372, 70 330, 82 302 C 92 280, 112 262, 130 254 ${neck} L 160 306`);
      return (
        <g>
          <defs>
            <DamaskPattern id={pid} base={base} />
          </defs>
          <Garment id={id} d={d} fabric={`url(#${pid})`} base={base}>
            {/* long vertical drape folds of a loose gown */}
            <Folds c={base} w={3} ds={['M 100 300 C 96 340, 90 380, 84 420', 'M 120 320 C 120 356, 118 390, 116 420', 'M 140 330 C 142 364, 142 394, 142 420']} />
            <Folds c={base} w={2} ds={['M 70 360 C 76 372, 80 388, 82 404']} />
          </Garment>
          <Embroidery d={both('M 130 254 ' + neck)} />
          <Embroidery d="M 160.8 306 L 160.8 360" w={5} />
        </g>
      );
    }

    case 'adire_shirt': {
      // Indigo adire shirt: camp collar, button placket, resist-dye print
      const base = '#1E2F6E';
      const pid = `${id}_adr`;
      const neck = 'C 138 262, 148 276, 158 292';
      const d = sym(sleevedHalf([130, 254], neck, 292));
      return (
        <g>
          <defs>
            <AdirePattern id={pid} />
          </defs>
          {/* inside of the collar */}
          <path d="M 134 254 L 186 254 L 160.8 296 Z" fill={skin.baseColor} />
          <Garment id={id} d={d} fabric={`url(#${pid})`} base={base}>
            <BodyFolds c={base} o={1.2} />
            <Seam c={base} d="M 98 290 C 96 302, 94 314, 92 326" />
            {/* chest pocket */}
            <path d="M 114 316 L 140 316 L 140 344 L 127 348 L 114 344 Z" fill="none" stroke="#C9D6F2" strokeWidth="0.8" strokeDasharray="1.6 1.4" opacity="0.8" />
          </Garment>
          {/* camp collar lying open */}
          <path d={both('M 130 254 C 126 262, 124 272, 128 282 L 146 286 C 146 276, 140 266, 134 252 Z')} fill={`url(#${pid})`} stroke="#0B1640" strokeWidth="0.9" />
          {/* placket and coconut buttons */}
          <path d="M 157 292 L 157 420 M 164.6 292 L 164.6 420" stroke="#C9D6F2" strokeWidth="0.7" strokeDasharray="1.6 1.4" opacity="0.8" />
          {[316, 350, 384].map((y) => (
            <Button key={y} x={160.8} y={y} r={2.4} c="#8B6B4A" />
          ))}
        </g>
      );
    }

    case 'aso_oke': {
      // Off-shoulder aso-oke top: hand-woven stripes with metallic gold, folded band
      const base = '#6E1423';
      const pid = `${id}_aso`;
      const top = 'C 96 300, 110 296, 124 296 C 138 296, 150 298, 160.8 298';
      const d = sym(`M 160 420 L 63 420 C 69 372, 77 336, 84 312 ${top} L 160 298`);
      return (
        <g>
          <defs>
            <AsoOkePattern id={pid} />
          </defs>
          <Garment id={id} d={d} fabric={`url(#${pid})`} base={base}>
            <BodyFolds c={base} o={1.3} />
            <Folds c={base} ds={['M 120 404 C 130 396, 142 394, 154 400', 'M 84 352 C 90 344, 98 338, 104 334']} />
          </Garment>
          {/* folded-over band, stripes running across */}
          <path d={both('M 84 312 C 96 300, 110 296, 124 296 C 138 296, 150 298, 160.8 298 L 160.8 318 C 148 318, 136 316, 122 316 C 108 317, 94 322, 82 330 Z')} fill={`url(#${pid})`} transform="rotate(0)" />
          <path d={both('M 84 312 C 96 300, 110 296, 124 296 C 138 296, 150 298, 160.8 298 L 160.8 318 C 148 318, 136 316, 122 316 C 108 317, 94 322, 82 330 Z')} fill="#000" opacity="0.12" />
          <path d={both('M 82 330 C 94 322, 108 317, 122 316 C 136 316, 148 318, 160.8 318')} stroke="#000" strokeWidth="2.4" fill="none" opacity="0.35" />
          <path d={both('M 84 311 ' + top)} stroke="#F3D27A" strokeWidth="1" fill="none" opacity="0.7" />
        </g>
      );
    }

    case 'denim_jacket': {
      // Cropped denim jacket over a white tank: topstitching, rivets, yoke, chest flaps
      const base = '#3E5F93';
      const tee = '#F5F5F4';
      const pid = `${id}_twill`;
      const tank = sym('M 160 420 L 118 420 L 120 270 C 134 282, 148 286, 160 286');
      const jacketHalf = 'M 134 420 L 63 420 C 69 372, 77 336, 85 312 C 93 288, 112 262, 132 252 L 134 262 C 126 278, 124 300, 126 330 L 134 420';
      const stitch = '#D6A447';
      return (
        <g>
          <defs>
            <TwillPattern id={pid} base={base} />
          </defs>
          <Garment id={`${id}_t`} d={tank} fabric={tee} base={tee} edge={shade(tee, -0.3)}>
            <Folds c={tee} ds={['M 132 330 C 140 340, 148 344, 156 344']} o={0.7} />
          </Garment>
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={`url(#${pid})`} base={base}>
            <BodyFolds c={base} />
            {/* yoke and chest flap pockets */}
            <path d={both('M 88 304 C 104 300, 118 300, 128 304')} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" fill="none" />
            <path d={both('M 100 320 L 124 320 L 124 334 L 112 338 L 100 334 Z')} fill={shade(base, -0.08)} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" />
            <path d={both('M 112 348 L 112 400')} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" fill="none" />
            <Seam c={base} d="M 96 290 C 94 302, 92 314, 90 326" />
            {/* faded wear along the folds */}
            <path d={both('M 104 360 C 102 380, 100 400, 99 420')} stroke="#9DB6DC" strokeWidth="6" fill="none" opacity="0.18" />
          </Garment>
          {/* collar and front edge topstitch */}
          <path d={both('M 132 252 C 124 262, 116 272, 114 284 L 126 288 C 126 276, 130 264, 134 258 Z')} fill={shade(base, -0.1)} stroke={stitch} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
          <path d={both('M 132 262 C 125 280, 124 300, 126 330 L 133 420')} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" fill="none" />
          {[[112, 327], [104, 376], [124, 376]].map(([x, y]) => (
            <g key={`${x}_${y}`}>
              <Button x={x} y={y} r={2.2} c="#B87333" />
              <Button x={320 - x} y={y} r={2.2} c="#B87333" />
            </g>
          ))}
        </g>
      );
    }

    case 'corset_top': {
      // Satin corset: sweetheart neckline, curved boning seams, sheen
      const base = '#5A0F24';
      const top = 'C 112 300, 122 292, 134 294 C 146 296, 154 304, 160.8 308';
      const d = sym(bodiceHalf(top, 308));
      const bones = ['M 122 300 C 118 340, 120 380, 124 420', 'M 140 300 C 138 340, 140 380, 142 420'];
      return (
        <g>
          <ArmLines skin={skin} />
          <Garment id={id} d={d} fabric={base} base={base}>
            <path d={both('M 112 320 C 114 350, 116 384, 116 420')} stroke="#E8798F" strokeWidth="8" fill="none" opacity="0.2" />
            <path d={both('M 113 322 C 115 352, 117 386, 117 420')} stroke="#FFC9D4" strokeWidth="1.6" fill="none" opacity="0.35" />
            {bones.map((b) => (
              <g key={b}>
                <path d={both(b)} stroke={shade(base, -0.55)} strokeWidth="2.4" fill="none" opacity="0.6" />
                <path d={both(b)} stroke="#F6A7B8" strokeWidth="0.7" fill="none" opacity="0.6" transform="translate(1.4 0)" />
              </g>
            ))}
            <path d="M 160.8 308 L 160.8 420" stroke={shade(base, -0.5)} strokeWidth="1.6" />
            <path d="M 104 400 C 130 396, 150 396, 160.8 398 C 172 396, 192 396, 216 400" stroke={shade(base, -0.5)} strokeWidth="1.4" fill="none" opacity="0.6" />
          </Garment>
          <path d={both('M 104 322 ' + top)} stroke="#F6A7B8" strokeWidth="1" fill="none" opacity="0.7" />
        </g>
      );
    }

    case 'athleisure': {
      // Half-zip track jacket: stand collar, zip teeth, sleeve stripes
      const c = '#1F2937';
      const accent = '#F5F5F5';
      const neck = 'C 140 258, 150 262, 154 264';
      const d = sym(sleevedHalf([132, 252], neck, 264));
      return (
        <g>
          <path d="M 152 262 L 169.6 262 L 160.8 300 Z" fill="#F472B6" />
          <Garment id={id} d={d} fabric={c} base={c}>
            <BodyFolds c={c} o={1.4} />
            <Folds c={c} ds={['M 84 342 C 92 334, 100 328, 106 324']} />
            {/* sleeve stripes */}
            <path d={both('M 86 310 C 80 340, 74 376, 70 420')} stroke={accent} strokeWidth="2.4" fill="none" />
            <path d={both('M 92 312 C 86 342, 80 378, 76 420')} stroke={accent} strokeWidth="2.4" fill="none" />
            {/* zip tape and teeth */}
            <path d="M 160.8 296 L 160.8 420" stroke={shade(c, -0.4)} strokeWidth="5" />
            <path d="M 160.8 300 L 160.8 420" stroke="#9CA3AF" strokeWidth="2.4" strokeDasharray="1 1.2" />
            <path d={both('M 152 264 L 158 296 L 160.8 296')} stroke={shade(c, -0.5)} strokeWidth="1.2" fill="none" />
          </Garment>
          {/* stand collar */}
          <path d={both('M 132 252 C 136 244, 146 244, 154 250 L 154 264 C 146 262, 138 258, 132 252 Z')} fill={shade(c, 0.08)} stroke={shade(c, -0.5)} strokeWidth="0.8" />
          <rect x="157.8" y="298" width="6" height="11" rx="1.5" fill="#D1D5DB" stroke="#6B7280" strokeWidth="0.6" />
          <circle cx="160.8" cy="306" r="1.2" fill="#6B7280" />
        </g>
      );
    }

    default:
      return null;
  }
}
