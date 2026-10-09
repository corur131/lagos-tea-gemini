import React from 'react';
import type { HairColorOption, HairstyleId } from '../../../types/vn';
import {
  Cubic,
  Pt,
  cubicAt,
  cubicPath,
  f1,
  lightness,
  mix,
  plaitLobes,
  rng,
  sampleEvenly,
  shade,
  smoothPath,
} from './artKit';

/* =========================================================================
   HAIR ART
   Drawn 2D hair with real texture: individual plaits for braids, strands
   and zig-zag shine for silky wigs, coils for afro and curls, laid edges.
   Everything is built from the two palette colours (primary + accent), so
   every hair colour in Ada's customizer still works.
   Coordinates match HeroineSvg (viewBox 0 0 320 420).
   ========================================================================= */

export interface HairInk {
  deep: string;
  base: string;
  mid: string;
  light: string;
  shine: string;
  edge: string;
  ombre: boolean;
  scalp: string;
}

export function makeInk(hair: HairColorOption, skinShadow: string): HairInk {
  const base = hair.primary;
  const light = hair.accent;
  const isPale = lightness(base) > 0.6;
  const deep = shade(base, isPale ? -0.38 : -0.55);
  const veryDark = lightness(base) < 0.16;
  return {
    deep,
    base,
    mid: mix(base, light, 0.5),
    light,
    // Black hair gets a cool blue-grey sheen; coloured hair a lifted tint
    shine: veryDark ? mix(light, '#A9B4C8', 0.65) : shade(light, isPale ? 0.55 : 0.42),
    edge: veryDark ? base : shade(base, -0.2),
    ombre: hair.id === 'ombre_blonde',
    scalp: mix(skinShadow, deep, 0.35),
  };
}

// ---------- shared geometry ----------
/** Forehead hairline from left sideburn to right sideburn */
const HAIRLINE: Cubic[] = [
  [[102, 162], [103, 142], [107, 129], [114, 122]],
  [[114, 122], [126, 112], [144, 108], [160, 109]],
  [[160, 109], [176, 108], [194, 112], [206, 122]],
  [[206, 122], [213, 129], [217, 142], [218, 162]],
];
const HAIRLINE_D = cubicPath(HAIRLINE);
/** Skull cap above the hairline (dome, then the hairline walked right to left) */
const CAP = `M 84 156 C 78 70, 112 20, 160 20 C 208 20, 242 70, 236 156 C 230 164, 224 166, 218 162 C 217 142, 213 129, 206 122 C 194 112, 176 108, 160 109 C 144 108, 126 112, 114 122 C 107 129, 103 142, 102 162 C 96 166, 90 164, 84 156 Z`;

/** Snug cap for flat styles (cornrows, bantu knots base) */
const CAP_TIGHT = `M 94 160 C 88 84, 118 40, 160 40 C 202 40, 232 84, 226 160 C 223 164, 220 165, 218 162 C 217 142, 213 129, 206 122 C 194 112, 176 108, 160 109 C 144 108, 126 112, 114 122 C 107 129, 103 142, 102 162 C 100 165, 97 164, 94 160 Z`;

const mirror = (d: string) =>
  d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${f1(320 - parseFloat(x))} ${y}`);
const mirPt = (p: Pt): Pt => [320 - p[0], p[1]];
const mirCubic = (c: Cubic): Cubic => c.map(mirPt) as Cubic;

// ---------- gradients ----------
export const HairDefs: React.FC<{ id: string; ink: HairInk }> = ({ id, ink }) => {
  const fill = ink.ombre
    ? [[0, ink.base], [0.38, ink.base], [0.7, mix(ink.base, ink.light, 0.75)], [1, ink.light]]
    : [[0, ink.base], [1, shade(ink.base, -0.12)]];
  const stops = (fn: (c: string) => string) =>
    fill.map(([o, c]) => <stop key={o as number} offset={o as number} stopColor={fn(c as string)} />);
  return (
    <defs>
      <linearGradient id={`${id}_fill`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="420">
        {stops((c) => c)}
      </linearGradient>
      <linearGradient id={`${id}_lite`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="420">
        {stops((c) => (c === ink.base ? ink.mid : shade(c, 0.22)))}
      </linearGradient>
      <linearGradient id={`${id}_dark`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="420">
        {stops((c) => shade(c, -0.45))}
      </linearGradient>
      <radialGradient id={`${id}_crown`} gradientUnits="userSpaceOnUse" cx="148" cy="46" r="120">
        <stop offset="0" stopColor={ink.mid} />
        <stop offset="0.45" stopColor={ink.base} />
        <stop offset="1" stopColor={ink.deep} />
      </radialGradient>
      {/* Panel shading: darker at both edges, rounder look */}
      <linearGradient id={`${id}_edge`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.45" />
        <stop offset="0.3" stopColor="#000" stopOpacity="0" />
        <stop offset="0.7" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
      <clipPath id={`${id}_cap`}>
        <path d={CAP} />
      </clipPath>
      <clipPath id={`${id}_tcap`}>
        <path d={CAP_TIGHT} />
      </clipPath>
    </defs>
  );
};

// ---------- hairline details ----------
/** Fine hairs breaking the hard edge of the hairline */
function EdgeFuzz({ ink, seed = 7 }: { ink: HairInk; seed?: number }) {
  const r = rng(seed);
  const pts = sampleEvenly(HAIRLINE, 1.7);
  let d = '';
  pts.forEach(({ p, t }) => {
    const n: Pt = [t[1], -t[0]]; // points down into the forehead
    const len = 1.2 + r() * 2.6;
    const lean = (r() - 0.5) * 0.8;
    d += `M ${f1(p[0] - n[0] * 1.2)} ${f1(p[1] - n[1] * 1.2)} l ${f1((n[0] + t[0] * lean) * len)} ${f1((n[1] + t[1] * lean) * len)} `;
  });
  return <path d={d} stroke={ink.edge} strokeWidth="0.6" strokeLinecap="round" opacity="0.7" fill="none" />;
}

/** Laid, swooped baby hairs at both temples plus a few forehead wisps */
function BabyHairs({ ink }: { ink: HairInk }) {
  const left: string[] = [];
  for (let k = 0; k < 4; k++) {
    const o = k * 1.9;
    left.push(
      `M ${f1(115 - o * 0.4)} ${f1(121 + o * 0.9)} C ${f1(119 - o * 0.3)} ${f1(128 + o)}, ${f1(117 - o)} ${f1(137 + o * 0.6)}, ${f1(110 - o * 0.5)} ${f1(139 + o * 0.4)} C ${f1(105 - o * 0.2)} ${f1(140 + o * 0.2)}, ${f1(104)} ${f1(135 + o * 0.5)}, ${f1(108 + o * 0.2)} ${f1(133 + o * 0.6)}`,
    );
  }
  const wisps = [
    'M 140 110 C 142 114, 146 115, 149 113',
    'M 146 109 C 147 113, 151 114, 153 112',
    'M 132 113 C 133 117, 137 118, 139 116',
  ];
  const all = [...left, ...wisps];
  const col = lightness(ink.base) > 0.55 ? ink.deep : ink.edge;
  return (
    <g fill="none" strokeLinecap="round">
      {all.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={col} strokeWidth={i < 4 ? 0.8 : 0.6} opacity={0.85} />
          <path d={mirror(d)} stroke={col} strokeWidth={i < 4 ? 0.8 : 0.6} opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

// ---------- silky strands on the crown ----------
/** Strands fanning from a centre part toward the temples, plus zig-zag shine */
function CenterPartCap({ id, ink, seed = 3 }: { id: string; ink: HairInk; seed?: number }) {
  const r = rng(seed);
  const strands: { c: Cubic; tone: number }[] = [];
  const N = 46;
  for (let k = 0; k <= N; k++) {
    const u = k / N;
    const start: Pt = [158.8, 24 + u * 82];
    const end: Pt = [84 + u * 32 + (r() - 0.5) * 3, 154 - u * 34];
    const c: Cubic = [start, [start[0] - 34 + u * 10, start[1] - 2 + u * 6], [end[0] + 2, end[1] - 58 * (1 - u) - 14], end];
    strands.push({ c, tone: r() });
    strands.push({ c: mirCubic(c), tone: r() });
  }
  return (
    <g clipPath={`url(#${id}_cap)`}>
      <path d={CAP} fill={`url(#${id}_crown)`} />
      {ink.ombre && <path d={CAP} fill={`url(#${id}_fill)`} opacity="0.5" />}
      {strands.map(({ c, tone }, i) => (
        <path
          key={i}
          d={cubicPath([c])}
          fill="none"
          stroke={tone < 0.5 ? ink.deep : ink.light}
          strokeWidth={tone < 0.5 ? 0.9 : 0.55}
          opacity={tone < 0.5 ? 0.4 : 0.32}
        />
      ))}
      <ShineRing strands={strands.map((s) => s.c)} ink={ink} seed={seed + 11} />
      {/* scalp at the part */}
      <path d="M 160 22 L 161.3 60 L 160 104 L 158.7 60 Z" fill={ink.scalp} opacity="0.9" />
    </g>
  );
}

/** Jagged halo of highlight along a ring of the crown */
function ShineRing({ strands, ink, seed, r0 = 0.8, r1 = 0.9 }: { strands: Cubic[]; ink: HairInk; seed: number; r0?: number; r1?: number }) {
  const r = rng(seed);
  let d = '';
  let dSoft = '';
  strands.forEach((c) => {
    const lo = r0 + (r() - 0.5) * 0.08;
    const hi = r1 + (r() - 0.5) * 0.1;
    let run: Pt[] = [];
    const flush = () => {
      if (run.length > 1) {
        const seg = 'M ' + run.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' ';
        if (r() > 0.62) d += seg;
        else dSoft += seg;
      }
      run = [];
    };
    for (let i = 0; i <= 40; i++) {
      const p = cubicAt(c[0], c[1], c[2], c[3], i / 40);
      const rho = Math.hypot((p[0] - 160) / 76, (p[1] - 122) / 100);
      if (rho > lo && rho < hi) run.push(p);
      else flush();
    }
    flush();
  });
  return (
    <g fill="none" strokeLinecap="round">
      <path d={dSoft} stroke={ink.shine} strokeWidth="2.6" opacity="0.2" />
      <path d={d} stroke={ink.shine} strokeWidth="0.9" opacity="0.75" />
    </g>
  );
}


/**
 * Crown with strands flowing from the top of the head down to the hairline
 * (pulled-back / fringe / pixie looks), or from a side part when partX is set.
 */
function FlowCap({ id, ink, seed = 13, partX, tight }: { id: string; ink: HairInk; seed?: number; partX?: number; tight?: boolean }) {
  const r = rng(seed);
  const strands: { c: Cubic; tone: number }[] = [];
  const hl = sampleEvenly(HAIRLINE, 2.4);
  if (partX === undefined) {
    hl.forEach(({ p }, i) => {
      const u = i / (hl.length - 1);
      const start: Pt = [146 + u * 28 + (r() - 0.5) * 4, 22 + (r() - 0.5) * 4];
      const dx = p[0] - 160;
      const c: Cubic = [start, [start[0] + dx * 0.55, 30], [p[0] + dx * 0.25, p[1] - 46], p];
      strands.push({ c, tone: r() });
    });
  } else {
    // side part: the short side falls left, the heavy side sweeps right across the crown
    for (let k = 0; k <= 30; k++) {
      const u = k / 30;
      const start: Pt = [partX - 0.8, 26 + u * 70];
      const end: Pt = [84 + u * 34, 154 - u * 34];
      strands.push({ c: [start, [start[0] - 24, start[1] - 2], [end[0] + 2, end[1] - 50 * (1 - u) - 12], end], tone: r() });
    }
    for (let k = 0; k <= 46; k++) {
      const u = k / 46;
      const start: Pt = [partX + 0.8, 24 + u * 80];
      const end: Pt = [238 - u * 66, 156 - u * 40];
      strands.push({ c: [start, [start[0] + 40, start[1] - 10 + u * 4], [end[0] - 8, end[1] - 70 * (1 - u) - 10], end], tone: r() });
    }
  }
  return (
    <g clipPath={`url(#${id}_${tight ? 'tcap' : 'cap'})`}>
      <path d={tight ? CAP_TIGHT : CAP} fill={`url(#${id}_crown)`} />
      {ink.ombre && <path d={CAP} fill={`url(#${id}_fill)`} opacity="0.5" />}
      {strands.map(({ c, tone }, i) => (
        <path
          key={i}
          d={cubicPath([c])}
          fill="none"
          stroke={tone < 0.5 ? ink.deep : ink.light}
          strokeWidth={tone < 0.5 ? 0.9 : 0.55}
          opacity={tone < 0.5 ? 0.4 : 0.32}
        />
      ))}
      <ShineRing strands={strands.map((s) => s.c)} ink={ink} seed={seed + 5} r0={tight ? 0.62 : 0.8} r1={tight ? 0.72 : 0.9} />
      {partX !== undefined && <path d={`M ${partX} 24 L ${partX + 1.2} 60 L ${partX} 100 L ${partX - 1.2} 60 Z`} fill={ink.scalp} opacity="0.9" />}
    </g>
  );
}

// ---------- falling panels (straight / wavy / bob) ----------
interface PanelSpec {
  L: (y: number) => number;
  R: (y: number) => number;
  y0: number;
  y1: number;
  n: number;
  seed: number;
  amp?: number;
  len?: number;
  /** blunt bob tips curl toward this x direction (+1 right, -1 left) */
  curl?: number;
  tipJitter?: number;
  shineAt?: number[];
}

function Panel({ id, ink, spec, k, dim }: { id: string; ink: HairInk; spec: PanelSpec; k: string; dim?: boolean }) {
  const r = rng(spec.seed);
  const amp = spec.amp ?? 0;
  const len = spec.len ?? 60;
  const n = spec.n;
  const xAt = (u: number, y: number, ph: number) => {
    let x = spec.L(y) + (spec.R(y) - spec.L(y)) * u + amp * Math.sin(((y - spec.y0) / len) * Math.PI * 2 + ph);
    if (spec.curl) {
      const c0 = spec.y1 - 34;
      if (y > c0) x += spec.curl * 16 * ((y - c0) / 34) ** 2;
    }
    return x;
  };
  const tips: number[] = [];
  const phases: number[] = [];
  for (let i = 0; i <= n; i++) {
    const edge = i === 0 || i === n;
    tips.push(spec.y1 - (spec.curl ? r() * 3 : r() * (spec.tipJitter ?? 14) + (edge ? 8 : 0)));
    phases.push((i / n) * 0.55 + (r() - 0.5) * 0.25);
  }
  const line = (u: number, ph: number, yEnd: number, yStart = spec.y0) => {
    const pts: Pt[] = [];
    for (let y = yStart; y < yEnd; y += 4) pts.push([xAt(u, y, ph), y]);
    pts.push([xAt(u, yEnd, ph), yEnd]);
    return pts;
  };
  // outline: left edge down, ragged tips across, right edge up
  const leftE = line(0, phases[0], tips[0]);
  const rightE = line(1, phases[n], tips[n]).reverse();
  const tipPts: Pt[] = [];
  for (let i = 1; i < n; i++) {
    const u = i / n;
    if (!spec.curl) tipPts.push([xAt(u - 0.5 / n, tips[i] - 7, phases[i]), tips[i] - 7]);
    tipPts.push([xAt(u, tips[i], phases[i]), tips[i]]);
  }
  const outline = 'M ' + [...leftE, ...tipPts, ...rightE].map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z';
  const cid = `${id}_p${k}`;

  // strands
  const dark: string[] = [];
  const lite: string[] = [];
  const shine: string[] = [];
  const shineSoft: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const u = (i + r()) / (n * 2);
    const j = Math.min(n, Math.round(u * n));
    const ph = phases[j] + (r() - 0.5) * 0.15;
    const pts = line(u, ph, tips[j]);
    const d = smoothPath(pts.filter((_, q) => q % 2 === 0 || q === pts.length - 1));
    (r() < 0.55 ? dark : lite).push(d);
    // shine: wave crests, or bands for straight hair
    let run: Pt[] = [];
    const crisp = r() < 0.38;
    const flush = () => {
      if (run.length > 1) (crisp ? shine : shineSoft).push('M ' + run.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L '));
      run = [];
    };
    const bandJ = (r() - 0.5) * 16;
    pts.forEach((p) => {
      const y = p[1];
      let on = false;
      if (amp > 0) {
        const th = ((y - spec.y0) / len) * Math.PI * 2 + ph;
        on = Math.cos(th) > 0.62 + (r() - 0.5) * 0.2;
      } else if (spec.shineAt) {
        on = spec.shineAt.some((sy) => Math.abs(y - sy - bandJ) < 10 + r() * 4);
      }
      if (on) run.push(p);
      else flush();
    });
    flush();
  }
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d={outline} fill={`url(#${id}_fill)`} />
      <g clipPath={`url(#${cid})`} fill="none" strokeLinecap="round">
        <path d={dark.join(' ')} stroke={`url(#${id}_dark)`} strokeWidth="1.2" opacity="0.55" />
        <path d={lite.join(' ')} stroke={`url(#${id}_lite)`} strokeWidth="0.7" opacity="0.6" />
        <rect x="0" y="0" width="320" height="420" fill={`url(#${id}_edge)`} />
        <path d={shineSoft.join(' ')} stroke={ink.shine} strokeWidth="2.6" opacity="0.22" />
        <path d={shine.join(' ')} stroke={ink.shine} strokeWidth="0.9" opacity="0.8" />
        {dim && <path d={outline} fill="#000" opacity="0.28" />}
      </g>
    </g>
  );
}

// ---------- braids ----------
export function Braid({
  curves,
  w,
  ink,
  id,
  knotless,
  dim = 0,
}: {
  curves: Cubic[];
  w: number;
  ink: HairInk;
  id: string;
  knotless?: boolean;
  dim?: number;
}) {
  const lobes = plaitLobes(curves, w, { taperStart: knotless ? 0.08 : 0, taperEnd: 0.1 });
  const under = cubicPath(curves);
  const fillRef = `url(#${id}_fill)`;
  return (
    <g opacity={1 - dim * 0.15}>
      <path d={under} stroke={ink.deep} strokeWidth={w * 0.95} strokeLinecap="round" fill="none" />
      {lobes.map((l, i) => (
        <path key={i} d={l.d} fill={fillRef} stroke={shade(ink.deep, -0.2)} strokeWidth="0.55" />
      ))}
      <path d={lobes.map((l) => l.hi).join(' ')} stroke={mix(ink.light, ink.shine, 0.5)} strokeWidth={Math.max(0.6, w * 0.11)} strokeLinecap="round" opacity="0.8" fill="none" />
      {dim > 0 && <path d={under} stroke="#000" strokeWidth={w} strokeLinecap="round" fill="none" opacity={dim * 0.35} />}
    </g>
  );
}

/** One side's set of braids sweeping from a centre part over the head and down */
function braidSet(side: 1 | -1, count: number, wide: boolean, seed: number) {
  const r = rng(seed);
  const out: Cubic[][] = [];
  for (let k = 0; k < count; k++) {
    const u = k / (count - 1);
    const root: Pt = [157 - u * 34, 30 + u * 72];
    const s: Pt = [84 + u * 20 + (r() - 0.5) * 2, 146 + u * 6];
    const b: Pt = [66 + u * 30 + (r() - 0.5) * 6, 392 - r() * 26];
    let c: Cubic[] = [
      [root, [root[0] - 30, root[1] + 2], [s[0] + 4, s[1] - 52 + u * 20], s],
      [s, [s[0] - 3, s[1] + 80], [b[0] + 3, b[1] - 90], b],
    ];
    if (wide) c = c.map((cc) => cc.map((p) => [p[0] - 2, p[1]]) as Cubic);
    if (side === -1) c = c.map(mirCubic);
    out.push(c);
  }
  return out;
}

/** Braids hanging behind the shoulders */
function backBraids(side: 1 | -1, count: number, seed: number, x0 = 62, x1 = 112) {
  const r = rng(seed);
  const out: Cubic[][] = [];
  for (let k = 0; k < count; k++) {
    const u = k / Math.max(1, count - 1);
    const top: Pt = [x1 - u * 18, 96 + u * 30];
    const bot: Pt = [x0 + u * (x1 - x0 - 10) + (r() - 0.5) * 8, 400 - r() * 30];
    let c: Cubic[] = [[top, [top[0] - 10, top[1] + 90], [bot[0] + 2, bot[1] - 120], bot]];
    if (side === -1) c = c.map(mirCubic);
    out.push(c);
  }
  return out;
}

// ---------- coils (afro, curls) ----------
export function coilMarks(seed: number, count: number, inside: (p: Pt) => boolean, box: [number, number, number, number], size: [number, number]) {
  const r = rng(seed);
  const dark: string[] = [];
  const lite: string[] = [];
  let tries = 0;
  while (dark.length + lite.length < count && tries < count * 6) {
    tries++;
    const p: Pt = [box[0] + r() * (box[2] - box[0]), box[1] + r() * (box[3] - box[1])];
    if (!inside(p)) continue;
    const rad = size[0] + r() * (size[1] - size[0]);
    const a0 = r() * Math.PI * 2;
    const sweep = Math.PI * (1.1 + r() * 0.7);
    const pts: Pt[] = [];
    for (let i = 0; i <= 8; i++) {
      const a = a0 + (sweep * i) / 8;
      const rr = rad * (1 - i * 0.05);
      pts.push([p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr * 0.85]);
    }
    const d = smoothPath(pts);
    // light from upper left
    const litChance = 0.22 + 0.5 * Math.max(0, 1 - Math.hypot(p[0] - 128, p[1] - 30) / 110);
    (r() < litChance ? lite : dark).push(d);
  }
  return { dark: dark.join(' '), lite: lite.join(' ') };
}

function Ringlet({ cx, cy, h, R, ink, id, seed }: { cx: number; cy: number; h: number; R: number; ink: HairInk; id: string; seed: number }) {
  const r = rng(seed);
  const turns = Math.max(2, Math.round(h / (R * 2.3)));
  const pts: Pt[] = [];
  const steps = turns * 14;
  const ph = r() * Math.PI * 2;
  for (let i = 0; i <= steps; i++) {
    const th = (i / 14) * Math.PI * 2 + ph;
    const rr = R * (1 - (i / steps) * 0.35);
    pts.push([cx + Math.cos(th) * rr + Math.sin(i * 0.21) * 2, cy + (i / steps) * h + Math.sin(th) * rr * 0.55]);
  }
  const d = smoothPath(pts);
  // highlight on the front-facing half of each loop
  const hi: string[] = [];
  let run: Pt[] = [];
  pts.forEach((p, i) => {
    const th = (i / 14) * Math.PI * 2 + ph;
    if (Math.sin(th) > 0.2 && Math.cos(th) < 0.5) run.push(p);
    else {
      if (run.length > 1) hi.push(smoothPath(run));
      run = [];
    }
  });
  if (run.length > 1) hi.push(smoothPath(run));
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={ink.deep} strokeWidth={R * 0.95} />
      <path d={d} stroke={`url(#${id}_fill)`} strokeWidth={R * 0.6} />
      <path d={hi.join(' ')} stroke={ink.light} strokeWidth={R * 0.2} opacity="0.85" />
      <path d={hi.join(' ')} stroke={ink.shine} strokeWidth={R * 0.08} opacity="0.7" />
    </g>
  );
}

function Knot({ cx, cy, R, ink, id }: { cx: number; cy: number; R: number; ink: HairInk; id: string }) {
  const turns = 2.6;
  const pts: Pt[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const th = f * turns * Math.PI * 2 - Math.PI / 2;
    const rr = R * (1 - f * 0.82);
    pts.push([cx + Math.cos(th) * rr, cy + Math.sin(th) * rr * 0.86 - f * R * 0.35]);
  }
  const d = smoothPath(pts);
  const hi: string[] = [];
  let run: Pt[] = [];
  pts.forEach((p, i) => {
    const th = (i / steps) * turns * Math.PI * 2 - Math.PI / 2;
    if (Math.sin(th) < -0.15 && Math.cos(th) < 0.55) run.push(p);
    else {
      if (run.length > 1) hi.push(smoothPath(run));
      run = [];
    }
  });
  return (
    <g>
      <ellipse cx={cx + 1.5} cy={cy + R * 0.75} rx={R * 0.95} ry={R * 0.32} fill="#000" opacity="0.25" />
      <circle cx={cx} cy={cy} r={R * 0.98} fill={ink.deep} />
      <g fill="none" strokeLinecap="round">
        <path d={d} stroke={shade(ink.deep, -0.25)} strokeWidth={R * 0.46} />
        <path d={d} stroke={`url(#${id}_crown)`} strokeWidth={R * 0.33} />
        <path d={hi.join(' ')} stroke={ink.light} strokeWidth={R * 0.12} opacity="0.85" />
      </g>
    </g>
  );
}

// ---------- shapes ----------
const AFRO_C: Pt = [160, 92];
function afroOutline(seed: number): { d: string; inside: (p: Pt) => boolean } {
  const r = rng(seed);
  const rx = 112, ry = 98;
  const pts: Pt[] = [];
  const N = 46;
  const noise = Array.from({ length: N }, () => r());
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const bump = 1 + 0.035 * Math.sin(a * 9 + 1) + 0.025 * (noise[i] - 0.5) * 2;
    let y = AFRO_C[1] + Math.sin(a) * ry * bump;
    const x = AFRO_C[0] + Math.cos(a) * rx * bump;
    // flatter underside so it sits on the shoulders
    if (y > 170) y = 170 + (y - 170) * 0.55;
    pts.push([x, y]);
  }
  const inside = (p: Pt) => Math.hypot((p[0] - AFRO_C[0]) / (rx - 4), (p[1] - AFRO_C[1]) / (ry - 4)) < 1 && p[1] < 178;
  return { d: smoothPath(pts, true), inside };
}

const OUTSIDE_FACE = `M 0 0 H 320 V 420 H 0 Z ${HAIRLINE_D} C 218 200, 102 200, 102 162 Z`;

// =====================================================================
// PUBLIC: back layer (behind head and body) and front layer (over face)
// =====================================================================
interface HairProps {
  style: HairstyleId;
  ink: HairInk;
  id: string;
}

export function HairBack({ style, ink, id }: HairProps) {
  switch (style) {
    case 'knotless_braids':
    case 'box_braids': {
      const wide = style === 'box_braids';
      const w = wide ? 10 : 6.5;
      const n = wide ? 5 : 9;
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <path d="M 86 100 C 86 24, 234 24, 234 100 C 244 140, 252 220, 252 300 L 68 300 C 68 220, 76 140, 86 100 Z" fill={ink.deep} />
          {[...backBraids(1, n, 21), ...backBraids(-1, n, 22)].map((c, i) => (
            <Braid key={i} curves={c} w={w} ink={ink} id={id} knotless={!wide} dim={1} />
          ))}
        </g>
      );
    }
    case 'cornrows':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          {[...backBraids(1, 2, 31, 76, 112), ...backBraids(-1, 2, 32, 76, 112)].map((c, i) => (
            <Braid key={i} curves={c} w={10} ink={ink} id={id} dim={1} />
          ))}
        </g>
      );
    case 'natural_afro': {
      const { d, inside } = afroOutline(41);
      const t = coilMarks(43, 520, inside, [44, -10, 276, 180], [2.2, 4.2]);
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <defs>
            <clipPath id={`${id}_afro`}>
              <path d={d} />
            </clipPath>
          </defs>
          <path d={d} fill={`url(#${id}_crown)`} />
          <g clipPath={`url(#${id}_afro)`} fill="none" strokeLinecap="round">
            <path d={t.dark} stroke={ink.deep} strokeWidth="1.3" opacity="0.7" />
            <path d={t.lite} stroke={ink.light} strokeWidth="1" opacity="0.65" />
          </g>
          <path d={d} fill="none" stroke={ink.deep} strokeWidth="1.2" opacity="0.5" />
        </g>
      );
    }
    case 'bantu_knots':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
        </g>
      );
    case 'bob_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 86 - (y - 132) * 0.07, R: (y) => 234 + (y - 132) * 0.07, y0: 132, y1: 256, curl: 0.01, n: 16, seed: 51, shineAt: [140] }} />
        </g>
      );
    case 'curly_wig': {
      const r = rng(61);
      const blobs: { x: number; y: number; r: number }[] = [];
      for (let i = 0; i < 70; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const y = 70 + r() * 320;
        const spread = y < 150 ? 74 + (y - 70) * 0.55 : 118 + Math.sin(y / 40) * 6;
        blobs.push({ x: 160 + side * (spread - r() * 46), y, r: 16 + r() * 12 });
      }
      const massD = blobs.map((b) => `M ${f1(b.x - b.r)} ${f1(b.y)} a ${f1(b.r)} ${f1(b.r)} 0 1 0 ${f1(b.r * 2)} 0 a ${f1(b.r)} ${f1(b.r)} 0 1 0 ${f1(-b.r * 2)} 0 Z`).join(' ');
      const tex = coilMarks(63, 420, (p) => blobs.some((b) => Math.hypot(p[0] - b.x, p[1] - b.y) < b.r - 2), [30, 40, 290, 420], [2.6, 4.6]);
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <defs>
            <clipPath id={`${id}_mass`}>
              <path d={massD} />
            </clipPath>
          </defs>
          <path d="M 92 90 C 96 40, 224 40, 228 90 L 238 300 L 82 300 Z" fill={ink.deep} />
          <path d={massD} fill={ink.deep} stroke={shade(ink.deep, -0.3)} strokeWidth="1" />
          <g clipPath={`url(#${id}_mass)`} fill="none" strokeLinecap="round">
            <path d={massD} fill={`url(#${id}_fill)`} opacity="0.55" />
            <path d={tex.dark} stroke={shade(ink.deep, -0.3)} strokeWidth="1.6" opacity="0.8" />
            <path d={tex.lite} stroke={ink.light} strokeWidth="1.2" opacity="0.55" />
          </g>
        </g>
      );
    }
    case 'long_straight_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 86 - (y - 132) * 0.12, R: (y) => 234 + (y - 132) * 0.12, y0: 132, y1: 420, n: 22, seed: 81, shineAt: [160, 300] }} />
        </g>
      );
    case 'body_wave_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 84 - (y - 132) * 0.14, R: (y) => 236 + (y - 132) * 0.14, y0: 132, y1: 420, n: 22, seed: 91, amp: 7, len: 92 }} />
        </g>
      );
    case 'bangs_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 86 - (y - 132) * 0.1, R: (y) => 234 + (y - 132) * 0.1, y0: 132, y1: 420, n: 22, seed: 201, shineAt: [300], tipJitter: 6 }} />
        </g>
      );
    case 'side_part_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 86 - (y - 132) * 0.12, R: (y) => 236 + (y - 132) * 0.16, y0: 132, y1: 410, n: 22, seed: 211, amp: 3, len: 140, shineAt: [280] }} />
        </g>
      );
    case 'water_wave_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 82 - (y - 132) * 0.16, R: (y) => 238 + (y - 132) * 0.16, y0: 132, y1: 420, n: 24, seed: 221, amp: 6, len: 40 }} />
        </g>
      );
    case 'genie_ponytail':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          {/* long sleek tail swinging out behind the right side of the head */}
          <Panel id={id} ink={ink} k="b" spec={{ L: (y) => 146 + (y - 20) * 0.3, R: (y) => 192 + (y - 20) * 0.25, y0: 20, y1: 400, n: 12, seed: 231, amp: 4, len: 110, shineAt: [140, 280] }} />
        </g>
      );
    case 'pixie_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
        </g>
      );
    case 'deep_wave_wig':
      return (
        <g id="back_hair">
          <HairDefs id={id} ink={ink} />
          <Panel id={id} ink={ink} k="b" dim spec={{ L: (y) => 86 - (y - 132) * 0.12, R: (y) => 234 + (y - 132) * 0.12, y0: 132, y1: 420, n: 24, seed: 95, amp: 3.5, len: 24 }} />
        </g>
      );
    default:
      return null;
  }
}

export function HairFront({ style, ink, id }: HairProps) {
  const edges = (
    <>
      <EdgeFuzz ink={ink} />
      <BabyHairs ink={ink} />
    </>
  );
  switch (style) {
    case 'knotless_braids':
    case 'box_braids': {
      const wide = style === 'box_braids';
      const w = wide ? 10.5 : 7;
      const count = wide ? 6 : 10;
      const braids = [...braidSet(1, count, wide, 11), ...braidSet(-1, count, wide, 12)];
      // draw the upper (outer) braids first so hairline braids sit on top
      const order = braids.map((b, i) => ({ b, i, k: i % count })).sort((a, b) => a.k - b.k);
      return (
        <g id={`hair_${style}`}>
          <path d={CAP} fill={ink.deep} />
          <path d="M 160 22 L 161.4 60 L 160 106 L 158.6 60 Z" fill={ink.scalp} />
          {/* section parts between braid roots */}
          <g stroke={ink.scalp} strokeWidth="0.9" opacity="0.45" fill="none" clipPath={`url(#${id}_cap)`}>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const y = 40 + k * 13;
              return <path key={k} d={`M ${f1(158 - k * 3)} ${y} Q ${f1(140 - k * 6)} ${y - 4} ${f1(118 - k * 4)} ${y + 8} M ${f1(162 + k * 3)} ${y} Q ${f1(180 + k * 6)} ${y - 4} ${f1(202 + k * 4)} ${y + 8}`} />;
            })}
          </g>
          {order.map(({ b, i }) => (
            <g key={i}>
              {wide && <rect x={b[0][0][0] - 3} y={b[0][0][1] - 3} width="6" height="6" rx="1.5" fill={ink.deep} />}
              <Braid curves={b} w={w} ink={ink} id={id} knotless={!wide} />
            </g>
          ))}
          {edges}
          {wide ? (
            <g>
              <circle cx="72" cy="318" r="3.6" fill="none" stroke="#E8B53A" strokeWidth="1.8" />
              <circle cx="248" cy="330" r="3.6" fill="none" stroke="#E8B53A" strokeWidth="1.8" />
            </g>
          ) : (
            <g>
              <rect x="80" y="246" width="7" height="5" rx="1.2" fill="#F2C44E" stroke="#A97A16" strokeWidth="0.7" />
              <rect x="234" y="262" width="7" height="5" rx="1.2" fill="#F2C44E" stroke="#A97A16" strokeWidth="0.7" />
            </g>
          )}
        </g>
      );
    }

    case 'cornrows': {
      const starts = sampleEvenly(HAIRLINE, 15).slice(1, -1);
      const rows = starts.map(({ p }) => {
        const dx = p[0] - 160;
        const e: Pt = [160 + dx * 0.3, 36];
        return [[[p[0] + dx * 0.05, p[1] + 4], [p[0] + dx * 0.16, p[1] - 30], [e[0] + dx * 0.8, e[1] + 24], e]] as Cubic[];
      });
      // rows running along the sides of the head, above the ears
      const sides: Cubic[][] = [
        [[[103, 168], [96, 130], [104, 80], [132, 52]]],
        [[[97, 162], [90, 124], [98, 74], [126, 48]]],
      ];
      return (
        <g id="hair_cornrows">
          <path d={CAP_TIGHT} fill={ink.scalp} />
          <g clipPath={`url(#${id}_tcap)`}>
            {[...sides, ...sides.map((c) => c.map(mirCubic))].map((c, i) => (
              <Braid key={`s${i}`} curves={c} w={9} ink={ink} id={id} />
            ))}
            {rows.map((c, i) => (
              <Braid key={i} curves={c} w={9} ink={ink} id={id} knotless />
            ))}
          </g>
          <EdgeFuzz ink={ink} />
          <Braid curves={[[[98, 150], [92, 220], [88, 300], [84, 380]]]} w={10} ink={ink} id={id} />
          <Braid curves={[[[222, 150], [228, 220], [232, 300], [236, 380]]]} w={10} ink={ink} id={id} />
        </g>
      );
    }

    case 'natural_afro': {
      const { d, inside } = afroOutline(41);
      const t = coilMarks(43, 520, inside, [44, -10, 276, 180], [2.2, 4.2]);
      return (
        <g id="hair_natural_afro">
          <defs>
            <clipPath id={`${id}_afroF`}>
              <path d={OUTSIDE_FACE} clipRule="evenodd" fillRule="evenodd" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}_afroF)`}>
            <g clipPath={`url(#${id}_afro)`}>
              <path d={d} fill={`url(#${id}_crown)`} />
              <g fill="none" strokeLinecap="round">
                <path d={t.dark} stroke={ink.deep} strokeWidth="1.3" opacity="0.7" />
                <path d={t.lite} stroke={ink.light} strokeWidth="1" opacity="0.65" />
              </g>
            </g>
          </g>
          <EdgeFuzz ink={ink} seed={9} />
        </g>
      );
    }

    case 'bantu_knots': {
      const knots = [
        { x: 160, y: 40, r: 15 },
        { x: 126, y: 54, r: 14 },
        { x: 194, y: 54, r: 14 },
        { x: 102, y: 92, r: 13 },
        { x: 218, y: 92, r: 13 },
        { x: 140, y: 90, r: 13.5 },
        { x: 180, y: 90, r: 13.5 },
      ];
      return (
        <g id="hair_bantu_knots">
          <path d={CAP_TIGHT} fill={`url(#${id}_crown)`} />
          <g clipPath={`url(#${id}_tcap)`}>
            {/* hair in each section pulled up toward its knot */}
            {knots.map((k, i) =>
              [-1, -0.5, 0, 0.5, 1].map((u) => (
                <path key={`${i}_${u}`} d={`M ${f1(k.x + u * 26)} ${f1(k.y + 40)} Q ${f1(k.x + u * 14)} ${f1(k.y + 16)} ${f1(k.x + u * 4)} ${f1(k.y + 4)}`} stroke={u === 0 || u === 1 ? ink.light : ink.deep} strokeWidth="0.8" opacity="0.5" fill="none" />
              )),
            )}
            {/* triangle parting lines between sections */}
            <path d="M 106 120 L 116 64 L 142 58 L 160 48 L 178 58 L 204 64 L 214 120 M 142 58 L 118 100 M 178 58 L 202 100 M 160 48 L 160 108 M 142 58 L 160 108 M 178 58 L 160 108" stroke={ink.scalp} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          </g>
          <EdgeFuzz ink={ink} />
          {knots.map((k, i) => (
            <Knot key={i} cx={k.x} cy={k.y} R={k.r} ink={ink} id={id} />
          ))}
          <BabyHairs ink={ink} />
        </g>
      );
    }

    case 'long_straight_wig':
      return (
        <g id="hair_long_straight">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 84 - (y - 96) * 0.08, R: (y) => 102 - (y - 96) * 0.02, y0: 118, y1: 420, n: 7, seed: 101, shineAt: [190, 320] }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 218 + (y - 96) * 0.02, R: (y) => 236 + (y - 96) * 0.08, y0: 118, y1: 420, n: 7, seed: 102, shineAt: [190, 320] }} />
          <CenterPartCap id={id} ink={ink} seed={3} />
          {edges}
        </g>
      );

    case 'body_wave_wig':
      return (
        <g id="hair_body_wave">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 80 - (y - 96) * 0.1, R: (y) => 104 - (y - 96) * 0.02, y0: 118, y1: 420, n: 8, seed: 111, amp: 8, len: 92 }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 216 + (y - 96) * 0.02, R: (y) => 240 + (y - 96) * 0.1, y0: 118, y1: 420, n: 8, seed: 112, amp: 8, len: 92 }} />
          <CenterPartCap id={id} ink={ink} seed={5} />
          {edges}
        </g>
      );

    case 'bangs_wig': {
      return (
        <g id="hair_bangs">
          <defs>
            <clipPath id={`${id}_fringe`}>
              <path d={CAP} />
              <rect x="100" y="60" width="120" height="76" />
            </clipPath>
          </defs>
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 82 - (y - 118) * 0.08, R: (y) => 103 - (y - 118) * 0.02, y0: 118, y1: 420, n: 7, seed: 241, shineAt: [300], tipJitter: 6 }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 217 + (y - 118) * 0.02, R: (y) => 238 + (y - 118) * 0.08, y0: 118, y1: 420, n: 7, seed: 242, shineAt: [300], tipJitter: 6 }} />
          <FlowCap id={id} ink={ink} seed={243} />
          {/* blunt fringe sitting just above the brows */}
          <g clipPath={`url(#${id}_fringe)`}>
            <Panel id={id} ink={ink} k="f" spec={{ L: () => 92, R: () => 228, y0: 24, y1: 131, n: 22, seed: 244, tipJitter: 3, shineAt: [78] }} />
          </g>
        </g>
      );
    }

    case 'side_part_wig':
      return (
        <g id="hair_side_part">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 84 - (y - 118) * 0.06, R: (y) => 102 - (y - 118) * 0.01, y0: 118, y1: 400, n: 6, seed: 251, amp: 3, len: 140, shineAt: [250] }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 214 + (y - 118) * 0.04, R: (y) => 242 + (y - 118) * 0.14, y0: 118, y1: 410, n: 10, seed: 252, amp: 3, len: 140, shineAt: [250] }} />
          <FlowCap id={id} ink={ink} seed={253} partX={128} />
          {edges}
          {/* swoop over the right temple */}
          <path d="M 150 104 C 176 106, 202 116, 214 134 C 218 142, 220 152, 219 162 L 230 160 C 230 130, 206 106, 166 98 Z" fill={`url(#${id}_crown)`} />
          <path d="M 156 104 C 180 108, 202 118, 212 136 M 164 102 C 188 108, 208 120, 218 140" stroke={ink.shine} strokeWidth="0.9" opacity="0.55" fill="none" />
        </g>
      );

    case 'water_wave_wig':
      return (
        <g id="hair_water_wave">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 80 - (y - 118) * 0.14, R: (y) => 104 - (y - 118) * 0.02, y0: 118, y1: 420, n: 9, seed: 261, amp: 6, len: 40 }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 216 + (y - 118) * 0.02, R: (y) => 240 + (y - 118) * 0.14, y0: 118, y1: 420, n: 9, seed: 262, amp: 6, len: 40 }} />
          <CenterPartCap id={id} ink={ink} seed={263} />
          {edges}
        </g>
      );

    case 'genie_ponytail':
      return (
        <g id="hair_genie_ponytail">
          <FlowCap id={id} ink={ink} seed={271} />
          {edges}
          {/* the pony's base, wrapped in a gold cuff, sitting high on the crown */}
          <path d="M 138 30 C 136 6, 184 6, 182 30 C 176 36, 144 36, 138 30 Z" fill={`url(#${id}_crown)`} />
          <path d="M 146 14 C 152 8, 166 8, 174 14" stroke={ink.shine} strokeWidth="1.2" fill="none" opacity="0.7" />
          <rect x="146" y="26" width="28" height="7" rx="3" fill="#D4A72C" stroke="#8A6512" strokeWidth="0.8" />
          <path d="M 150 29.5 H 170" stroke="#FFF1B8" strokeWidth="0.8" opacity="0.8" />
        </g>
      );

    case 'pixie_wig': {
      // big soft locks swept across the forehead from a short, tapered crown
      const locks = [
        'M 112 70 C 106 96, 106 116, 112 132 C 116 120, 124 112, 136 108 C 128 100, 122 86, 112 70 Z',
        'M 128 52 C 118 80, 120 104, 134 122 C 140 110, 152 104, 166 104 C 152 94, 138 76, 128 52 Z',
        'M 150 44 C 142 72, 146 96, 164 114 C 172 102, 186 98, 200 100 C 184 88, 162 70, 150 44 Z',
        'M 176 50 C 172 76, 180 100, 200 116 C 204 108, 212 104, 220 106 C 206 92, 190 74, 176 50 Z',
      ];
      return (
        <g id="hair_pixie">
          <FlowCap id={id} ink={ink} seed={282} tight />
          <EdgeFuzz ink={ink} seed={283} />
          {locks.map((d, i) => (
            <g key={i}>
              <path d={d} fill={`url(#${id}_crown)`} stroke={ink.deep} strokeWidth="0.8" />
              <path d={d} fill="none" stroke={ink.shine} strokeWidth="0.8" opacity="0.45" transform="translate(-1.2 -1.5) scale(1)" />
            </g>
          ))}
        </g>
      );
    }

    case 'deep_wave_wig':
      return (
        <g id="hair_deep_wave">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 82 - (y - 96) * 0.08, R: (y) => 103 - (y - 96) * 0.02, y0: 118, y1: 420, n: 9, seed: 121, amp: 3.5, len: 24 }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 217 + (y - 96) * 0.02, R: (y) => 238 + (y - 96) * 0.08, y0: 118, y1: 420, n: 9, seed: 122, amp: 3.5, len: 24 }} />
          <CenterPartCap id={id} ink={ink} seed={7} />
          {edges}
        </g>
      );

    case 'bob_wig':
      return (
        <g id="hair_bob_wig">
          <Panel id={id} ink={ink} k="l" spec={{ L: (y) => 80 - (y - 96) * 0.06, R: (y) => 103 + (y - 96) * 0.02, y0: 118, y1: 252, n: 8, seed: 131, curl: 1, shineAt: [214] }} />
          <Panel id={id} ink={ink} k="r" spec={{ L: (y) => 217 - (y - 96) * 0.02, R: (y) => 240 + (y - 96) * 0.06, y0: 118, y1: 252, n: 8, seed: 132, curl: -1, shineAt: [214] }} />
          <CenterPartCap id={id} ink={ink} seed={9} />
          {edges}
        </g>
      );

    case 'curly_wig': {
      const capInside = (p: Pt) => {
        const rho = Math.hypot((p[0] - 160) / 76, (p[1] - 122) / 100);
        return rho < 1.02;
      };
      const t = coilMarks(141, 240, capInside, [80, 16, 240, 160], [2.4, 4]);
      const front: { x: number; y: number }[] = [];
      const fr = rng(149);
      for (let c = 0; c < 3; c++) for (let row = 0; row < 5; row++) front.push({ x: 76 + c * 12 + (fr() - 0.5) * 6, y: 128 + row * 52 + c * 16 + (fr() - 0.5) * 14 });
      return (
        <g id="hair_curly_wig">
          <g clipPath={`url(#${id}_cap)`}>
            <path d={CAP} fill={`url(#${id}_crown)`} />
            <g fill="none" strokeLinecap="round">
              <path d={t.dark} stroke={ink.deep} strokeWidth="1.5" opacity="0.75" />
              <path d={t.lite} stroke={ink.light} strokeWidth="1.1" opacity="0.7" />
            </g>
          </g>
          {edges}
          {front.map((f, i) => (
            <g key={i}>
              <Ringlet cx={f.x} cy={f.y} h={66} R={8} ink={ink} id={id} seed={150 + i} />
              <Ringlet cx={320 - f.x} cy={f.y + 6} h={66} R={8} ink={ink} id={id} seed={180 + i} />
            </g>
          ))}
        </g>
      );
    }

    default:
      return null;
  }
}
