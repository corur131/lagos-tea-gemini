/* =========================================================================
   ART KIT
   Small drawing helpers shared by the hair and clothing art: colour mixing,
   a seeded random generator (so every render of a look is identical), and
   curve sampling used to lay braids, strands and folds along a path.
   ========================================================================= */

export type Pt = [number, number];

// ---------- colour ----------
const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

/** Blend colour a toward colour b by t (0..1) */
export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};
/** Darken (amt < 0) or lighten (amt > 0) a colour */
export const shade = (hex: string, amt: number) => (amt < 0 ? mix(hex, '#000000', -amt) : mix(hex, '#FFFFFF', amt));

/** Perceived lightness 0..1 */
export const lightness = (hex: string) => {
  const [r, g, b] = toRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// ---------- deterministic randomness ----------
export const rng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
};

// ---------- curves ----------
export const cubicAt = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

export type Cubic = [Pt, Pt, Pt, Pt];

/** Points spaced evenly (by arc length) along a chain of cubic segments, with unit tangents */
export function sampleEvenly(curves: Cubic[], step: number): { p: Pt; t: Pt; s: number }[] {
  const dense: Pt[] = [];
  curves.forEach((c, ci) => {
    for (let i = ci === 0 ? 0 : 1; i <= 60; i++) dense.push(cubicAt(c[0], c[1], c[2], c[3], i / 60));
  });
  const lens = [0];
  for (let i = 1; i < dense.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  }
  const total = lens[lens.length - 1];
  const out: { p: Pt; t: Pt; s: number }[] = [];
  let j = 1;
  for (let d = 0; d <= total; d += step) {
    while (j < lens.length - 1 && lens[j] < d) j++;
    const a = dense[j - 1], b = dense[j];
    const seg = lens[j] - lens[j - 1] || 1;
    const f = (d - lens[j - 1]) / seg;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const dl = Math.hypot(dx, dy) || 1;
    out.push({ p: [a[0] + dx * f, a[1] + dy * f], t: [dx / dl, dy / dl], s: d / total });
  }
  return out;
}

/** "M x y C ..." for a cubic chain */
export const cubicPath = (curves: Cubic[]) =>
  curves
    .map((c, i) => `${i === 0 ? `M ${f1(c[0][0])} ${f1(c[0][1])} ` : ''}C ${f1(c[1][0])} ${f1(c[1][1])}, ${f1(c[2][0])} ${f1(c[2][1])}, ${f1(c[3][0])} ${f1(c[3][1])}`)
    .join(' ');

export const f1 = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through points (Catmull-Rom converted to cubics) */
export function smoothPath(pts: Pt[], closed = false): string {
  if (pts.length < 2) return '';
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${f1(P[1][0])} ${f1(P[1][1])}`;
  for (let i = 1; i < P.length - 2; i++) {
    const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f1(c1[0])} ${f1(c1[1])}, ${f1(c2[0])} ${f1(c2[1])}, ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + ' Z' : d;
}

/**
 * A three-strand plait seen from the front: a column of interlocking slanted
 * almond "lobes" that alternate left and right along the curve.
 * Returns the lobe outlines plus a highlight stroke for each lobe.
 */
export function plaitLobes(curves: Cubic[], width: number, opts: { taperStart?: number; taperEnd?: number } = {}) {
  const step = width * 0.62;
  const pts = sampleEvenly(curves, step);
  const lobes: { d: string; hi: string; w: number }[] = [];
  pts.forEach(({ p, t, s }, i) => {
    let w = width;
    if (opts.taperStart && s < opts.taperStart) w *= 0.55 + 0.45 * (s / opts.taperStart);
    if (opts.taperEnd && s > 1 - opts.taperEnd) w *= 0.35 + 0.65 * ((1 - s) / opts.taperEnd);
    const side = i % 2 === 0 ? 1 : -1;
    const n: Pt = [-t[1], t[0]];
    // lobe leans across the braid, alternating direction
    const ang = side * 0.75;
    const dir: Pt = [t[0] * Math.cos(ang) - t[1] * Math.sin(ang), t[0] * Math.sin(ang) + t[1] * Math.cos(ang)];
    const c: Pt = [p[0] + n[0] * side * w * 0.2, p[1] + n[1] * side * w * 0.2];
    const L = w * 0.62; // half-length
    const W = w * 0.3; // half-width
    const a: Pt = [c[0] - dir[0] * L, c[1] - dir[1] * L];
    const b: Pt = [c[0] + dir[0] * L, c[1] + dir[1] * L];
    const pn: Pt = [-dir[1], dir[0]];
    const d = `M ${f1(a[0])} ${f1(a[1])} Q ${f1(c[0] + pn[0] * W * 2)} ${f1(c[1] + pn[1] * W * 2)} ${f1(b[0])} ${f1(b[1])} Q ${f1(c[0] - pn[0] * W * 2)} ${f1(c[1] - pn[1] * W * 2)} ${f1(a[0])} ${f1(a[1])} Z`;
    // highlight runs along the top-facing ridge of the lobe
    const h0: Pt = [c[0] - dir[0] * L * 0.55 + pn[0] * W * 0.45, c[1] - dir[1] * L * 0.55 + pn[1] * W * 0.45];
    const h1: Pt = [c[0] + dir[0] * L * 0.45 + pn[0] * W * 0.45, c[1] + dir[1] * L * 0.45 + pn[1] * W * 0.45];
    const hi = `M ${f1(h0[0])} ${f1(h0[1])} L ${f1(h1[0])} ${f1(h1[1])}`;
    lobes.push({ d, hi, w });
  });
  return lobes;
}

/** Interpolate between two cubic guides; u = 0 gives a, 1 gives b */
export const lerpCubic = (a: Cubic, b: Cubic, u: number): Cubic =>
  a.map((p, i) => [p[0] + (b[i][0] - p[0]) * u, p[1] + (b[i][1] - p[1]) * u]) as Cubic;

export const jitterCubic = (c: Cubic, r: () => number, amt: number): Cubic =>
  c.map((p, i) => (i === 0 ? p : [p[0] + (r() - 0.5) * amt, p[1] + (r() - 0.5) * amt * 0.6])) as Cubic;
