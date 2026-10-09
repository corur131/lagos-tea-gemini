import React from 'react';
import type { HairColorId, LocationType } from '../../../types/vn';
import { HAIR_COLORS } from '../palettes';
import { Cubic, Pt, cubicPath, f1, rng, shade, smoothPath } from './artKit';
import { Braid, HairDefs, HairInk, coilMarks, makeInk } from './HairArt';
import { Button, DamaskPattern, Embroidery, Fold, Folds, Garment, RibPattern, Seam, TwillPattern, both, sym } from './OutfitArt';

/* =========================================================================
   MALE ART
   Masculine hair (low cut, fades, 360 waves, high top, twists, dreads,
   sponge curls) and menswear (tees, senator, agbada, jersey, bomber,
   suit...) for Chidi, Kelvin and Dayo. Their faces stay as drawn in
   NpcSvg; only hair, clothes and accessories come from here.
   Coordinates match the male heads in NpcSvg (viewBox 0 0 320 420).
   ========================================================================= */

export type MaleHairId =
  | 'low_cut'
  | 'taper_fade'
  | 'waves'
  | 'high_top'
  | 'twists'
  | 'short_dreads'
  | 'long_dreads'
  | 'curly_fade';

export type MaleOutfitId =
  | 'fitted_tee'
  | 'graphic_tee'
  | 'linen_shirt'
  | 'velvet_jacket'
  | 'senator'
  | 'agbada'
  | 'jersey'
  | 'bomber'
  | 'hoodie'
  | 'suit'
  | 'polo'
  | 'denim_jacket';

export type MaleId = 'chidi' | 'kelvin' | 'dayo';

export interface MaleLook {
  hair: MaleHairId;
  hairColor: HairColorId;
  outfit: MaleOutfitId;
  /** Main garment colour */
  color: string;
  /** Character signature: camera strap, gold chain, studio headphones */
  accessory: 'camera' | 'chain' | 'headphones' | 'none';
}

export interface MaleSkin {
  base: string;
  shadow: string;
  highlight: string;
}

// ---------- scene looks ----------
const BASE: Record<MaleId, MaleLook> = {
  chidi: { hair: 'taper_fade', hairColor: 'jet_black', outfit: 'fitted_tee', color: '#1C1C21', accessory: 'camera' },
  kelvin: { hair: 'twists', hairColor: 'jet_black', outfit: 'linen_shirt', color: '#F3F0EA', accessory: 'chain' },
  dayo: { hair: 'short_dreads', hairColor: 'jet_black', outfit: 'velvet_jacket', color: '#3B0B5C', accessory: 'headphones' },
};

/**
 * What a guy wears at this point in the story. Face and skin never change;
 * hair, clothes and accessories follow the place and the episode.
 */
export function getMaleLook(id: MaleId, moment: { episode?: number; location?: LocationType } = {}): MaleLook {
  const ep = moment.episode ?? 1;
  const loc = moment.location;
  const look: MaleLook = { ...BASE[id] };

  // hair grows and changes over the season
  if (id === 'chidi' && ep >= 2) look.hair = 'waves';
  if (id === 'chidi' && ep >= 3) look.hair = 'curly_fade';
  if (id === 'kelvin' && ep === 2) look.hair = 'high_top';
  if (id === 'kelvin' && ep >= 3) {
    look.hair = 'low_cut';
    look.hairColor = 'honey_blonde';
  }
  if (id === 'dayo' && ep >= 3) {
    look.hair = 'long_dreads';
    look.hairColor = 'copper';
  }

  const isParty = (loc === 'banana_island_mansion' && ep === 1) || loc === 'rooftop_party';
  const pick = <T,>(m: Record<MaleId, T>) => m[id];
  if (loc === 'event_hall') {
    // Owambe: the photographer working in senator, Kelvin in defiant black, Dayo in a gold-trimmed agbada
    Object.assign(look, pick({
      chidi: { outfit: 'senator', color: '#E8E2D4' },
      kelvin: { outfit: 'suit', color: '#0B0B0D' },
      dayo: { outfit: 'agbada', color: '#E9DDB8' },
    }));
  } else if (loc === 'gala_ballroom') {
    // Guild Gala: Chidi working in a dark senator, Kelvin in navy (not black this time), Dayo in a cream agbada
    Object.assign(look, pick({
      chidi: { outfit: 'senator', color: '#1F2433' },
      kelvin: { outfit: 'suit', color: '#1B2A4A' },
      dayo: { outfit: 'agbada', color: '#EFE6CF' },
    }));
  } else if (isParty) {
    Object.assign(look, pick({
      chidi: { outfit: 'senator', color: '#2B3A55' },
      kelvin: { outfit: 'suit', color: '#111114' },
      dayo: { outfit: 'agbada', color: '#E9E3D3' },
    }));
  } else if (loc === 'university_campus') {
    Object.assign(look, pick({
      chidi: { outfit: 'graphic_tee', color: '#2F4F3E' },
      kelvin: { outfit: 'polo', color: '#0E3B5C' },
      dayo: { outfit: 'bomber', color: '#232323' },
    }));
  } else if (loc === 'mall') {
    Object.assign(look, pick({
      chidi: { outfit: 'denim_jacket', color: '#3E5F93' },
      kelvin: { outfit: 'linen_shirt', color: '#D9C7A7' },
      dayo: { outfit: 'jersey', color: '#0F8A4E' },
    }));
  } else if (loc === 'beach_house') {
    Object.assign(look, pick({
      chidi: { outfit: 'fitted_tee', color: '#E8E2D4' },
      kelvin: { outfit: 'linen_shirt', color: '#F3F0EA' },
      dayo: { outfit: 'graphic_tee', color: '#C2410C' },
    }));
  } else if (loc === 'night_street') {
    Object.assign(look, pick({
      chidi: { outfit: 'hoodie', color: '#26262B' },
      kelvin: { outfit: 'bomber', color: '#3F1D0E' },
      dayo: { outfit: 'hoodie', color: '#1E293B' },
    }));
  } else if (loc === 'photoshoot_studio') {
    Object.assign(look, pick({
      chidi: { outfit: 'fitted_tee', color: '#1C1C21' },
      kelvin: { outfit: 'velvet_jacket', color: '#14334A' },
      dayo: { outfit: 'velvet_jacket', color: '#3B0B5C' },
    }));
  } else if (loc === 'banana_island_mansion' && ep >= 3) {
    Object.assign(look, pick({
      chidi: { outfit: 'polo', color: '#7C2D12' },
      kelvin: { outfit: 'senator', color: '#5B1A1A' },
      dayo: { outfit: 'hoodie', color: '#3B0B5C' },
    }));
  }
  return look;
}

// ---------- hair geometry ----------
const HL_BACK = 'C 220 140, 219 128, 214 119 C 200 112, 180 110, 160 110 C 140 110, 120 112, 106 119 C 101 128, 100 140, 100 154';
/** Close-cropped cap hugging the skull */
const CAP_LOW = `M 99 154 C 94 92, 114 63, 160 63 C 206 63, 226 92, 221 154 C 221 156, 220 156, 220 154 ${HL_BACK} C 100 156, 99 156, 99 154 Z`;
/** Fuller cap for curls, twists and dreads */
const CAP_FULL = `M 92 154 C 84 80, 110 46, 160 46 C 210 46, 236 80, 228 154 C 226 158, 222 158, 220 154 ${HL_BACK} C 98 158, 94 158, 92 154 Z`;
const CAP_HIGH = `M 99 154 C 97 110, 100 64, 106 28 C 130 20, 190 20, 214 28 C 220 64, 223 110, 221 154 C 221 156, 220 156, 220 154 ${HL_BACK} C 100 156, 99 156, 99 154 Z`;

/** Stipple pattern for very short hair */
const StubbleDefs: React.FC<{ id: string; ink: HairInk }> = ({ id, ink }) => (
  <defs>
    <pattern id={`${id}_stip`} patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(25)">
      <rect width="3.4" height="3.4" fill={ink.base} />
      <circle cx="0.9" cy="0.9" r="0.55" fill={ink.light} opacity="0.65" />
      <circle cx="2.5" cy="2.4" r="0.6" fill={ink.deep} opacity="0.8" />
    </pattern>
    <linearGradient id={`${id}_fadeG`} gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="150">
      <stop offset="0" stopColor="#FFF" />
      <stop offset="1" stopColor="#000" />
    </linearGradient>
    {/* faded sides, full top and a crisp front line-up */}
    <mask id={`${id}_fade`} maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="420">
      <rect x="0" y="0" width="320" height="96" fill="#FFF" />
      <rect x="0" y="96" width="320" height="80" fill={`url(#${id}_fadeG)`} />
      <rect x="110" y="96" width="100" height="40" fill="#FFF" />
    </mask>
    <clipPath id={`${id}_low`}>
      <path d={CAP_LOW} />
    </clipPath>
  </defs>
);

/** Short faded sides: stubble that fades into the skin, with a shadow of growth */
function FadeSides({ id, ink }: { id: string; ink: HairInk }) {
  return (
    <g>
      <path d={CAP_LOW} fill={ink.deep} opacity="0.16" />
      <g mask={`url(#${id}_fade)`}>
        <path d={CAP_LOW} fill={`url(#${id}_stip)`} />
      </g>
    </g>
  );
}

/** Sharp barber line-up along the forehead and temples */
const LineUp = ({ ink }: { ink: HairInk }) => (
  <path d="M 101 136 L 101 128 L 106 119 C 120 112, 140 110, 160 110 C 180 110, 200 112, 214 119 L 219 128 L 219 136" stroke={shade(ink.deep, -0.3)} strokeWidth="1.3" fill="none" opacity="0.85" />
);

/** Dreadlock: a rope with bumpy segments, highlight and a rounded tip */
function Loc({ curves, w, ink, id, dim = 0 }: { curves: Cubic[]; w: number; ink: HairInk; id: string; dim?: number }) {
  const d = cubicPath(curves);
  return (
    <g fill="none" strokeLinecap="round" opacity={1 - dim * 0.12}>
      <path d={d} stroke={shade(ink.deep, -0.25)} strokeWidth={w} />
      <path d={d} stroke={`url(#${id}_fill)`} strokeWidth={w * 0.72} />
      <path d={d} stroke={ink.deep} strokeWidth={w * 0.62} strokeDasharray={`${f1(w * 0.28)} ${f1(w * 0.5)}`} opacity="0.55" />
      <path d={d} stroke={ink.light} strokeWidth={w * 0.16} opacity="0.75" transform={`translate(${f1(-w * 0.18)} 0)`} />
      {dim > 0 && <path d={d} stroke="#000" strokeWidth={w} opacity={dim * 0.3} />}
    </g>
  );
}

/** Locs fanning from the crown down the sides; `len` sets how far they fall */
function locSet(side: 1 | -1, count: number, len: number, seed: number) {
  const r = rng(seed);
  const out: Cubic[][] = [];
  for (let k = 0; k < count; k++) {
    const u = k / (count - 1);
    const root: Pt = [156 - u * 40, 54 + u * 52];
    const s: Pt = [98 + u * 8 + (r() - 0.5) * 3, 120 + u * 14];
    const b: Pt = [s[0] - 10 - r() * 10 + u * 4, Math.min(s[1] + len, 420) - r() * 16];
    let c: Cubic[] = [
      [root, [root[0] - 24, root[1] - 4], [s[0] + 4, s[1] - 40], s],
      [s, [s[0] - 2, s[1] + len * 0.4], [b[0] + 3, b[1] - len * 0.4], b],
    ];
    if (side === -1) c = c.map((cc) => cc.map((p) => [320 - p[0], p[1]]) as Cubic);
    out.push(c);
  }
  return out;
}

/** Front locs that fall toward the forehead and stop above the brows */
function fringeLocs(seed: number, count: number, w: number) {
  const r = rng(seed);
  const out: Cubic[][] = [];
  for (let k = 0; k < count; k++) {
    const u = (k + 0.5) / count;
    const x = 116 + u * 88;
    const root: Pt = [160 + (x - 160) * 0.55, 52 + Math.abs(x - 160) * 0.2];
    const tip: Pt = [x + (x - 160) * 0.12 + (r() - 0.5) * 4, 112 + r() * 4 - w * 0.2];
    out.push([[root, [root[0] + (x - 160) * 0.2, root[1] + 10], [tip[0], tip[1] - 30], tip]]);
  }
  return out;
}

interface MaleHairProps {
  look: MaleLook;
  id: string;
  skin: MaleSkin;
}

const inkFor = (look: MaleLook, skin: MaleSkin) => makeInk(HAIR_COLORS[look.hairColor] ?? HAIR_COLORS.jet_black, skin.shadow);

/** Hair behind the head (only long locs need it) plus all hair gradients */
export function MaleHairBack({ look, id, skin }: MaleHairProps) {
  const ink = inkFor(look, skin);
  return (
    <g id="male_back_hair">
      <HairDefs id={id} ink={ink} />
      <StubbleDefs id={id} ink={ink} />
      {look.hair === 'long_dreads' &&
        [...locSet(1, 7, 230, 401), ...locSet(-1, 7, 230, 402)].map((c, i) => (
          <Loc key={i} curves={c.map((cc) => cc.map((p) => [p[0] + (p[0] < 160 ? -6 : 6), p[1] + 6]) as Cubic)} w={9} ink={ink} id={id} dim={1} />
        ))}
    </g>
  );
}

export function MaleHairFront({ look, id, skin }: MaleHairProps) {
  const ink = inkFor(look, skin);
  switch (look.hair) {
    case 'low_cut':
      return (
        <g id="hair_low_cut">
          <g clipPath={`url(#${id}_low)`}>
            <path d={CAP_LOW} fill={`url(#${id}_stip)`} />
            <ellipse cx="150" cy="74" rx="40" ry="10" fill={ink.shine} opacity="0.18" />
          </g>
          <LineUp ink={ink} />
        </g>
      );

    case 'taper_fade':
      return (
        <g id="hair_taper_fade">
          <FadeSides id={id} ink={ink} />
          {/* slightly longer textured top */}
          <path d="M 108 116 C 104 80, 124 58, 160 58 C 196 58, 216 80, 212 116 C 196 110, 178 108, 160 108 C 142 108, 124 110, 108 116 Z" fill={`url(#${id}_stip)`} />
          <path d="M 120 76 C 140 64, 180 64, 200 76" stroke={ink.shine} strokeWidth="5" opacity="0.14" fill="none" />
          <LineUp ink={ink} />
        </g>
      );

    case 'waves': {
      const rings: string[] = [];
      const hi: string[] = [];
      for (let k = 0; k < 18; k++) {
        const rad = 26 + k * 7;
        const pts: Pt[] = [];
        const pts2: Pt[] = [];
        for (let i = 0; i <= 40; i++) {
          const th = (i / 40) * Math.PI;
          const wob = 1.4 * Math.sin(th * 14 + k);
          pts.push([160 + Math.cos(th) * (rad + wob), 34 + Math.sin(th) * (rad + wob) * 0.78]);
          pts2.push([160 + Math.cos(th) * (rad + wob - 2), 34 + Math.sin(th) * (rad + wob - 2) * 0.78]);
        }
        rings.push(smoothPath(pts));
        hi.push(smoothPath(pts2));
      }
      return (
        <g id="hair_waves">
          <FadeSides id={id} ink={ink} />
          <g mask={`url(#${id}_fade)`}>
            <g clipPath={`url(#${id}_low)`} fill="none">
              <path d={CAP_LOW} fill={ink.base} />
              <path d={rings.join(' ')} stroke={ink.deep} strokeWidth="3.2" opacity="0.75" />
              <path d={hi.join(' ')} stroke={ink.shine} strokeWidth="1.1" opacity="0.6" />
            </g>
          </g>
          <LineUp ink={ink} />
        </g>
      );
    }

    case 'high_top': {
      const inside = (p: Pt) => p[0] > 100 && p[0] < 220 && p[1] > 24 && p[1] < 112;
      const t = coilMarks(411, 280, inside, [98, 22, 222, 112], [2.2, 3.8]);
      return (
        <g id="hair_high_top">
          <defs>
            <clipPath id={`${id}_high`}>
              <path d={CAP_HIGH} />
            </clipPath>
          </defs>
          <FadeSides id={id} ink={ink} />
          <g mask={`url(#${id}_fade)`}>
            <g clipPath={`url(#${id}_high)`}>
              <path d={CAP_HIGH} fill={`url(#${id}_crown)`} />
              <g fill="none" strokeLinecap="round">
                <path d={t.dark} stroke={ink.deep} strokeWidth="1.3" opacity="0.75" />
                <path d={t.lite} stroke={ink.light} strokeWidth="1" opacity="0.6" />
              </g>
              {/* flat, sculpted top edge */}
              <path d="M 108 30 C 130 23, 190 23, 212 30" stroke={ink.shine} strokeWidth="3" opacity="0.35" fill="none" />
            </g>
          </g>
          <LineUp ink={ink} />
        </g>
      );
    }

    case 'twists': {
      const r = rng(421);
      const twists: Cubic[][] = [];
      for (let row = 0; row < 4; row++) {
        const n = 6 + row;
        for (let k = 0; k < n; k++) {
          const u = (k + 0.5) / n;
          const x = 160 + (u - 0.5) * (70 + row * 26);
          const y = 46 + row * 14;
          const dx = x - 160;
          const tip: Pt = [x + dx * 0.3 + (r() - 0.5) * 3, Math.min(y + 34 + r() * 6, 114)];
          twists.push([[[x, y], [x + dx * 0.1, y - 8], [tip[0] - dx * 0.05, tip[1] - 22], tip]]);
        }
      }
      return (
        <g id="hair_twists">
          <FadeSides id={id} ink={ink} />
          <path d="M 104 120 C 100 76, 122 50, 160 50 C 198 50, 220 76, 216 120 C 196 110, 178 108, 160 108 C 142 108, 124 110, 104 120 Z" fill={ink.deep} />
          {twists.map((c, i) => (
            <Braid key={i} curves={c} w={7} ink={ink} id={id} />
          ))}
          <LineUp ink={ink} />
        </g>
      );
    }

    case 'short_dreads':
    case 'long_dreads': {
      const long = look.hair === 'long_dreads';
      const sides = [...locSet(1, long ? 6 : 5, long ? 200 : 46, 431), ...locSet(-1, long ? 6 : 5, long ? 200 : 46, 432)];
      const front = fringeLocs(433, 7, 9);
      return (
        <g id={`hair_${look.hair}`}>
          <defs>
            <clipPath id={`${id}_full`}>
              <path d={CAP_FULL} />
            </clipPath>
          </defs>
          <path d={CAP_FULL} fill={ink.deep} />
          <g clipPath={`url(#${id}_full)`} stroke={ink.scalp} strokeWidth="0.9" opacity="0.5" fill="none">
            <path d="M 120 70 L 200 70 M 110 92 L 210 92 M 140 50 L 140 110 M 180 50 L 180 110" />
          </g>
          {sides.map((c, i) => (
            <Loc key={`s${i}`} curves={c} w={9.5} ink={ink} id={id} />
          ))}
          {front.map((c, i) => (
            <Loc key={`f${i}`} curves={c} w={9} ink={ink} id={id} />
          ))}
          {long && (
            <g>
              <rect x="78" y="226" width="9" height="5" rx="1.5" fill="#D4A72C" />
              <rect x="232" y="240" width="9" height="5" rx="1.5" fill="#D4A72C" />
            </g>
          )}
        </g>
      );
    }

    case 'curly_fade': {
      const inside = (p: Pt) => Math.hypot((p[0] - 160) / 58, (p[1] - 84) / 42) < 1 && p[1] < 114;
      const t = coilMarks(441, 240, inside, [100, 40, 220, 116], [2.8, 4.6]);
      const silhouette = 'M 104 118 C 96 70, 120 40, 160 40 C 200 40, 224 70, 216 118 C 196 110, 178 108, 160 108 C 142 108, 124 110, 104 118 Z';
      return (
        <g id="hair_curly_fade">
          <defs>
            <clipPath id={`${id}_curl`}>
              <path d={silhouette} />
            </clipPath>
          </defs>
          <FadeSides id={id} ink={ink} />
          <path d={silhouette} fill={`url(#${id}_crown)`} />
          <g clipPath={`url(#${id}_curl)`} fill="none" strokeLinecap="round">
            <path d={t.dark} stroke={ink.deep} strokeWidth="1.8" opacity="0.8" />
            <path d={t.lite} stroke={ink.light} strokeWidth="1.3" opacity="0.7" />
          </g>
          <LineUp ink={ink} />
        </g>
      );
    }

    default:
      return null;
  }
}

// =====================================================================
// MENSWEAR
// =====================================================================
/** Left half of a male top: shoulder from P to the neckline, which runs to the centre line */
const mHalf = (P: Pt, nl: string, cy: number) =>
  `M 160 420 L 47 420 C 51 384, 55 352, 61 332 C 73 300, ${f1(P[0] - 26)} ${f1(P[1] + 12)}, ${f1(P[0])} ${f1(P[1])} ${nl} L 160 ${f1(cy)}`;
/** Short sleeve version: sleeve hem at the upper arm, bare forearm below */
const mTeeHalf = (P: Pt, nl: string, cy: number) =>
  `M 160 420 L 92 420 C 92 396, 92 372, 92 356 L 56 348 C 58 340, 59 336, 61 332 C 73 300, ${f1(P[0] - 26)} ${f1(P[1] + 12)}, ${f1(P[0])} ${f1(P[1])} ${nl} L 160 ${f1(cy)}`;

const ManFolds: React.FC<{ c: string; o?: number }> = ({ c, o = 1 }) => (
  <>
    <Folds c={c} o={o} w={3.4} ds={['M 92 330 C 90 362, 88 392, 88 420']} />
    <Folds c={c} o={o * 0.8} ds={['M 106 318 C 122 328, 138 330, 152 324', 'M 116 384 C 126 392, 140 396, 152 392']} />
  </>
);

/** Skin body, shoulders and neck shared by all three guys */
export function MaleBody({ skinId, skin }: { skinId: string; skin: MaleSkin }) {
  return (
    <g>
      <path
        d="M 47 420 C 51 384, 55 352, 61 332 C 75 296, 112 258, 140 250 L 142 196 L 178 196 L 180 250 C 208 258, 245 296, 259 332 C 265 352, 269 384, 273 420 Z"
        fill={`url(#${skinId})`}
      />
      <path d="M 142 208 C 150 222, 170 222, 178 208 L 178 226 C 168 236, 152 236, 142 226 Z" fill={skin.shadow} opacity="0.5" />
      {/* forearm lines, visible under short sleeves */}
      <path d={both('M 92 356 C 92 380, 91 400, 91 420')} stroke={skin.shadow} strokeWidth="2" fill="none" opacity="0.6" />
    </g>
  );
}

export function MaleOutfit({ look, id }: { look: MaleLook; id: string }) {
  const c = look.color;
  switch (look.outfit) {
    case 'fitted_tee':
    case 'graphic_tee': {
      const neck = 'C 144 260, 152 264, 160 264';
      const d = sym(mTeeHalf([138, 250], neck, 264));
      const ink = shade(c, look.outfit === 'graphic_tee' ? 0.75 : 0.3);
      return (
        <Garment id={id} d={d} fabric={c} base={c}>
          <ManFolds c={c} />
          <Folds c={c} ds={['M 64 336 C 72 330, 80 326, 88 322']} />
          <Seam c={c} d="M 70 316 C 68 326, 64 338, 60 346" />
          <path d={both('M 136 250 C 144 260, 152 266, 160 266 L 160 272 C 148 272, 138 264, 130 254 Z')} fill={shade(c, -0.15)} />
          <Seam c={c} d="M 130 255 C 140 265, 150 271, 160 272" />
          <Seam c={c} d="M 58 347 L 92 355" />
          {look.outfit === 'graphic_tee' && (
            <g>
              {/* sun-over-lagoon print with cracked ink */}
              <circle cx="160" cy="330" r="22" fill="none" stroke={ink} strokeWidth="2.4" />
              <path d="M 140 336 Q 150 330 160 336 Q 170 342 180 336 M 142 344 Q 151 338 160 344 Q 169 350 178 344" stroke={ink} strokeWidth="2" fill="none" />
              <circle cx="160" cy="320" r="8" fill={ink} />
              <text x="160" y="372" fill={ink} fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="4" fontFamily="sans-serif">
                EKO
              </text>
              <path d="M 148 326 L 154 332 M 166 316 L 170 324" stroke={c} strokeWidth="0.8" />
            </g>
          )}
        </Garment>
      );
    }

    case 'polo': {
      const neck = 'C 144 260, 150 266, 156 270';
      const d = sym(mTeeHalf([138, 250], neck, 270));
      return (
        <g>
          <defs>
            <RibPattern id={`${id}_pq`} base={c} w={2} />
          </defs>
          <Garment id={id} d={d} fabric={`url(#${id}_pq)`} base={c}>
            <ManFolds c={c} />
            <path d="M 154 266 L 154 306 L 166 306 L 166 266" fill={shade(c, -0.06)} stroke={shade(c, -0.4)} strokeWidth="0.8" />
            <Button x={160} y={280} r={1.8} c="#F5F5F4" />
            <Button x={160} y={296} r={1.8} c="#F5F5F4" />
            <circle cx="190" cy="300" r="3.5" fill="#F5F5F4" opacity="0.85" />
            <Seam c={c} d="M 58 347 L 92 355" />
          </Garment>
          {/* knit collar */}
          <path d={both('M 138 250 C 132 256, 130 264, 134 272 L 154 274 C 150 266, 144 258, 140 248 Z')} fill={shade(c, 0.05)} stroke={shade(c, -0.45)} strokeWidth="0.9" />
          <path d={both('M 135 270 L 153 272')} stroke="#F5F5F4" strokeWidth="1.2" opacity="0.8" />
        </g>
      );
    }

    case 'linen_shirt': {
      const neck = 'C 144 270, 152 290, 160 304';
      const d = sym(mHalf([138, 250], neck, 304));
      return (
        <g>
          <Garment id={id} d={d} fabric={c} base={c} edge={shade(c, -0.4)}>
            <ManFolds c={c} o={1.3} />
            {/* linen creases */}
            <Folds c={c} o={1.2} ds={['M 70 360 C 76 372, 80 386, 82 400', 'M 120 300 C 126 320, 130 340, 132 356', 'M 64 340 C 74 334, 82 330, 90 328']} />
            <path d="M 157 304 L 157 420 M 164 304 L 164 420" stroke={shade(c, -0.3)} strokeWidth="0.8" />
            {[326, 360, 394].map((y) => (
              <Button key={y} x={160.5} y={y} r={2} c={shade(c, 0.15)} />
            ))}
            {/* rolled sleeve cuff */}
            <path d={both('M 52 372 C 64 368, 78 370, 90 376 L 90 388 C 78 382, 64 380, 51 384 Z')} fill={shade(c, -0.08)} stroke={shade(c, -0.4)} strokeWidth="0.8" />
          </Garment>
          {/* open camp collar */}
          <path d={both('M 138 250 C 128 260, 122 272, 124 284 L 146 288 C 146 276, 142 262, 140 250 Z')} fill={shade(c, 0.04)} stroke={shade(c, -0.4)} strokeWidth="0.9" />
        </g>
      );
    }

    case 'velvet_jacket': {
      const turtle = '#111827';
      const jacketHalf = 'M 146 420 L 47 420 C 51 384, 55 352, 61 332 C 73 300, 110 262, 136 250 L 140 262 L 132 292 L 142 298 L 152 372 L 146 420 Z';
      return (
        <g>
          {/* turtleneck */}
          <path d="M 140 228 C 150 236, 170 236, 180 228 L 182 264 L 138 264 Z" fill={turtle} />
          <path d="M 140 232 C 150 240, 170 240, 180 232 M 140 240 C 150 248, 170 248, 180 240" stroke="#374151" strokeWidth="1" fill="none" />
          <Garment id={`${id}_t`} d={sym('M 160 420 L 130 420 L 136 252 C 146 262, 154 264, 160 264')} fabric={turtle} base={turtle}>
            <Fold c={turtle} d="M 140 300 C 146 330, 150 360, 152 390" />
          </Garment>
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={c} base={c}>
            {/* velvet: deep shadows in the folds and a soft nap sheen */}
            <path d={both('M 72 330 C 76 360, 80 390, 82 420')} stroke={shade(c, 0.45)} strokeWidth="12" fill="none" opacity="0.25" />
            <ManFolds c={c} o={1.3} />
            <path d={both('M 96 386 L 128 382')} stroke={shade(c, -0.6)} strokeWidth="2.2" />
          </Garment>
          <path d={both('M 136 250 L 140 262 L 132 292 L 142 298 L 152 372 L 144 372 C 134 336, 122 310, 118 294 L 124 284 L 120 272 C 124 262, 130 254, 136 250 Z')} fill={shade(c, -0.25)} />
          <path d={both('M 136 251 L 120 272 L 124 284 L 118 294')} stroke={shade(c, 0.5)} strokeWidth="0.9" fill="none" opacity="0.6" />
        </g>
      );
    }

    case 'suit': {
      const shirt = '#F8FAFC';
      const jacketHalf = 'M 148 420 L 47 420 C 51 384, 55 352, 61 332 C 73 300, 110 262, 136 250 L 138 262 L 148 340 L 148 420 Z';
      return (
        <g>
          <Garment id={`${id}_s`} d={sym('M 160 420 L 130 420 L 136 250 C 146 258, 154 262, 160 262')} fabric={shirt} base={shirt} edge={shade(shirt, -0.3)}>
            <path d="M 160 290 L 160 420" stroke={shade(shirt, -0.2)} strokeWidth="1" />
            <Button x={160} y={310} r={1.6} c="#E5E7EB" />
          </Garment>
          <path d={both('M 136 250 C 144 260, 152 266, 160 270 L 150 284 C 144 274, 138 262, 136 250 Z')} fill={shirt} stroke={shade(shirt, -0.3)} strokeWidth="0.8" />
          {/* bow tie */}
          <path d="M 160 272 L 146 264 L 146 282 Z M 160 272 L 174 264 L 174 282 Z" fill="#0A0A0C" />
          <rect x="156" y="268" width="8" height="8" rx="2" fill="#18181B" />
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={c} base={c}>
            <ManFolds c={c} />
            <path d={both('M 96 384 L 128 380')} stroke={shade(c, 0.25)} strokeWidth="1.2" opacity="0.6" />
          </Garment>
          {/* satin shawl lapels */}
          <path d={both('M 136 250 L 138 262 L 148 340 L 142 340 C 130 310, 120 290, 118 276 C 122 264, 128 256, 136 250 Z')} fill="#2A2A30" />
          <path d={both('M 134 254 C 126 262, 121 272, 120 282 C 124 304, 132 324, 140 338')} stroke="#6B6B76" strokeWidth="1.4" fill="none" opacity="0.7" />
          <path d="M 196 304 L 206 300 L 204 296 Z" fill="#E11D48" />
        </g>
      );
    }

    case 'senator': {
      // Native senator kaftan: mandarin collar, side placket with braided trim
      const neck = 'C 146 252, 152 254, 160 254';
      const d = sym(mHalf([138, 248], neck, 254));
      const trim = shade(c, 0.45);
      return (
        <Garment id={id} d={d} fabric={c} base={c}>
          <ManFolds c={c} o={1.1} />
          <Folds c={c} ds={['M 120 330 C 124 360, 126 390, 126 420']} />
          {/* mandarin collar band */}
          <path d={both('M 138 248 C 146 256, 152 258, 160 258 L 160 264 C 150 264, 142 260, 136 254 Z')} fill={shade(c, -0.1)} />
          <path d="M 136 254 C 146 262, 172 262, 184 254" stroke={trim} strokeWidth="1.4" fill="none" />
          {/* off-centre placket */}
          <path d="M 176 258 L 176 340" stroke={trim} strokeWidth="2.4" />
          <path d="M 176 258 L 176 340" stroke={shade(c, -0.4)} strokeWidth="0.8" strokeDasharray="2 2" />
          {[272, 290, 308, 326].map((y) => (
            <Button key={y} x={180} y={y} r={1.8} c={trim} />
          ))}
          <Seam c={c} d="M 58 360 C 66 380, 70 400, 72 420" o={0.4} />
        </Garment>
      );
    }

    case 'agbada': {
      // Flowing agbada over a buba: wide robe, heavy chest embroidery
      const robe = `M 160 420 L 26 420 C 32 380, 42 340, 56 312 C 78 282, 112 262, 136 252 C 146 270, 152 290, 160 304`;
      return (
        <g>
          <defs>
            <DamaskPattern id={`${id}_dm`} base={c} />
          </defs>
          <path d="M 138 250 C 146 260, 174 260, 182 250 L 184 270 L 136 270 Z" fill={shade(c, -0.1)} />
          <Garment id={id} d={sym(robe)} fabric={`url(#${id}_dm)`} base={c}>
            <Folds c={c} w={3.4} o={1.4} ds={['M 80 320 C 72 350, 62 384, 52 420', 'M 100 330 C 96 360, 92 390, 88 420', 'M 122 340 C 120 370, 118 396, 118 420']} />
          </Garment>
          <Embroidery d={both('M 136 252 C 146 270, 152 290, 160 304')} w={6} />
          {/* embroidered pocket panel */}
          <path d="M 120 318 C 140 312, 180 312, 200 318 L 196 372 C 176 380, 144 380, 124 372 Z" fill="none" stroke="#C9971F" strokeWidth="2.4" />
          <path d="M 130 330 C 150 324, 170 324, 190 330 M 134 346 C 152 340, 168 340, 186 346 M 140 362 C 154 358, 166 358, 180 362" stroke="#C9971F" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
          <circle cx="160" cy="344" r="5" fill="none" stroke="#FBE7A1" strokeWidth="1.2" />
        </g>
      );
    }

    case 'jersey': {
      const white = '#F8FAFC';
      const neck = 'C 144 262, 152 274, 160 286';
      const d = sym(mTeeHalf([138, 250], neck, 286));
      return (
        <g>
          <Garment id={id} d={d} fabric={c} base={c}>
            {[0, 1, 2, 3, 4].map((k) => (
              <path key={k} d={both(`M 96 ${300 + k * 24} L 160 ${332 + k * 24}`)} stroke={shade(c, -0.15)} strokeWidth="9" fill="none" opacity="0.6" />
            ))}
            <ManFolds c={c} />
            <path d={both('M 92 330 C 92 360, 92 390, 92 420')} stroke={white} strokeWidth="5" fill="none" />
            <text x="160" y="366" fill={white} fontSize="36" fontWeight="900" textAnchor="middle" fontFamily="Arial Black, sans-serif" stroke={shade(c, -0.5)} strokeWidth="0.8">
              9
            </text>
            <path d={both('M 58 347 L 92 355')} stroke={white} strokeWidth="3" />
          </Garment>
          <path d={both('M 138 250 ' + neck)} stroke={white} strokeWidth="4" fill="none" />
        </g>
      );
    }

    case 'bomber': {
      const tee = '#F5F5F4';
      const jacketHalf = 'M 150 420 L 47 420 C 51 384, 55 352, 61 332 C 73 300, 110 262, 134 252 L 140 268 C 146 300, 148 360, 150 420 Z';
      return (
        <g>
          <Garment id={`${id}_t`} d={sym('M 160 420 L 140 420 L 136 252 C 146 260, 154 262, 160 262')} fabric={tee} base={tee} edge={shade(tee, -0.3)} />
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={c} base={c}>
            {/* satin sheen */}
            <path d={both('M 76 320 C 80 350, 84 380, 86 420')} stroke={shade(c, 0.6)} strokeWidth="10" fill="none" opacity="0.2" />
            <ManFolds c={c} o={1.3} />
            <Seam c={c} d="M 70 318 C 68 330, 64 342, 60 352" />
            <path d={both('M 108 360 L 120 340')} stroke={shade(c, -0.6)} strokeWidth="2" />
            {/* rib hem */}
            <rect x="40" y="408" width="240" height="12" fill={shade(c, -0.2)} />
          </Garment>
          {/* rib collar and zip tape */}
          <path d={both('M 134 250 C 142 246, 150 246, 156 248 L 154 258 C 148 256, 142 256, 138 260 Z')} fill={shade(c, -0.2)} />
          <path d={both('M 140 268 C 146 300, 148 360, 150 420')} stroke="#9CA3AF" strokeWidth="2" strokeDasharray="1 1.2" fill="none" />
          <path d="M 196 290 L 210 290 L 210 296 L 196 296 Z" fill="#F59E0B" opacity="0.85" />
        </g>
      );
    }

    case 'hoodie': {
      const neck = 'C 142 264, 150 270, 160 272';
      const d = sym(mHalf([128, 252], neck, 272));
      return (
        <g>
          <path d={both('M 112 262 C 116 232, 138 222, 160 222 L 160 248 C 146 248, 132 256, 124 268 Z')} fill={shade(c, -0.3)} />
          <Garment id={id} d={d} fabric={c} base={c}>
            <ManFolds c={c} o={1.3} />
            <path d={both('M 120 420 L 124 386 C 136 378, 148 376, 160 376')} fill={shade(c, 0.05)} />
            <Seam c={c} d="M 122 420 L 126 388 C 138 380, 150 378, 160 378" />
            <rect x="40" y="408" width="240" height="12" fill={shade(c, -0.15)} />
          </Garment>
          <path d={both('M 128 252 ' + neck)} stroke={shade(c, -0.45)} strokeWidth="5" fill="none" />
          {[148, 172].map((x, i) => (
            <g key={x}>
              <path d={`M ${x} 272 C ${x + (i ? 2 : -2)} 292, ${x + (i ? -1 : 1)} 308, ${x + (i ? 1 : -1)} 324`} stroke="#E5E7EB" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <rect x={x + (i ? 1 : -1) - 1.6} y="322" width="3.2" height="7" rx="1" fill="#C7CBD3" />
            </g>
          ))}
        </g>
      );
    }

    case 'denim_jacket': {
      const tee = '#16161A';
      const stitch = '#D6A447';
      const jacketHalf = 'M 138 420 L 47 420 C 51 384, 55 352, 61 332 C 73 300, 110 262, 134 252 L 136 262 C 128 280, 126 304, 128 334 L 138 420 Z';
      return (
        <g>
          <defs>
            <TwillPattern id={`${id}_tw`} base={c} />
          </defs>
          <Garment id={`${id}_t`} d={sym('M 160 420 L 126 420 L 134 252 C 144 262, 152 266, 160 266')} fabric={tee} base={tee} />
          <Garment id={id} d={both(jacketHalf + ' Z')} fabric={`url(#${id}_tw)`} base={c}>
            <ManFolds c={c} />
            <path d={both('M 72 304 C 92 300, 112 300, 128 304')} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" fill="none" />
            <path d={both('M 98 320 L 124 320 L 124 336 L 111 340 L 98 336 Z')} fill={shade(c, -0.08)} stroke={stitch} strokeWidth="0.8" strokeDasharray="1.8 1.4" />
          </Garment>
          <path d={both('M 134 252 C 124 262, 116 274, 114 286 L 128 290 C 128 278, 132 266, 136 260 Z')} fill={shade(c, -0.1)} stroke={stitch} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
          {[[111, 328], [104, 376]].map(([x, y]) => (
            <g key={`${x}_${y}`}>
              <Button x={x} y={y} r={2.2} c="#B87333" />
              <Button x={320 - x} y={y} r={2.2} c="#B87333" />
            </g>
          ))}
        </g>
      );
    }

    default:
      return null;
  }
}

/** Signature accessory, drawn over the clothes */
export function MaleAccessory({ look }: { look: MaleLook }) {
  switch (look.accessory) {
    case 'camera':
      return (
        <g>
          <path d="M 84 288 L 244 420" stroke="#111827" strokeWidth="9" strokeLinecap="square" />
          <path d="M 84 288 L 244 420" stroke="#E11D48" strokeWidth="9" strokeDasharray="1 6" opacity="0.8" />
          <path d="M 84 288 L 244 420" stroke="#374151" strokeWidth="1" transform="translate(0 -3.6)" />
          <rect x="135" y="325" width="22" height="7" rx="1.5" fill="#F43F5E" transform="rotate(40, 146, 328)" />
        </g>
      );
    case 'chain':
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M 136 256 Q 160 288 184 256" stroke="#9A6A12" strokeWidth="4.2" />
          <path d="M 136 256 Q 160 288 184 256" stroke="#F2C14E" strokeWidth="3" strokeDasharray="2.4 1.2" />
          <path d="M 136 255 Q 160 287 184 255" stroke="#FFF1B8" strokeWidth="0.8" opacity="0.7" />
        </g>
      );
    case 'headphones':
      return (
        <g>
          <path d="M 108 270 C 112 306, 208 306, 212 270" stroke="#4B5563" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M 108 270 C 112 306, 208 306, 212 270" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" fill="none" transform="translate(0 -3)" />
          <rect x="96" y="248" width="22" height="34" rx="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5" />
          <rect x="202" y="248" width="22" height="34" rx="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5" />
        </g>
      );
    default:
      return null;
  }
}
