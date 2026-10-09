import { HeroineCustomization, LocationType } from '../../types/vn';

/* =========================================================================
   NPC LOOKS
   The girls are drawn with the same parametric body as Ada, so each one
   gets her own face (shape, eyes, nose, lips) plus a signature detail, and
   a wardrobe that changes with where the story is and which episode it is.
   ========================================================================= */

export type HeadShape = 'oval' | 'round' | 'heart' | 'long' | 'square';
export type FaceMark = 'mole' | 'freckles' | 'dimples';

export interface FaceProfile {
  headShape?: HeadShape;
  /** Horizontal width of the face (1 = Ada) */
  faceWidth?: number;
  /** Eye size and spacing (1 = Ada) */
  eyeScale?: number;
  /** Nose width (1 = Ada) */
  noseWidth?: number;
  /** Lip size (1 = Ada) */
  lipScale?: number;
  /** Brows up (+) or down (-) in px */
  browLift?: number;
  marks?: FaceMark[];
  glasses?: 'cat' | 'round';
  /** Headwrap colour; draws a wrapped turban over the hair */
  headwrap?: string;
}

type GirlId = 'zee' | 'tamara' | 'chi' | 'bisola' | 'hauwa';

export const NPC_FACES: Record<GirlId, FaceProfile> = {
  // Queen bee: sculpted heart face, big glam eyes, full lips, beauty mark
  zee: { headShape: 'heart', faceWidth: 0.98, eyeScale: 1.06, lipScale: 1.1, browLift: -1, marks: ['mole'] },
  // Childhood friend: round, soft, huge doe eyes, dimples
  tamara: { headShape: 'round', faceWidth: 1.05, eyeScale: 1.12, noseWidth: 1.05, marks: ['dimples'] },
  // Legal prodigy: long face, narrow focused eyes, stern brows, cat-eye glasses
  chi: { headShape: 'long', faceWidth: 0.94, eyeScale: 0.9, noseWidth: 0.92, lipScale: 0.9, browLift: -2.5, glasses: 'cat' },
  // Vlogger: round cheeks, wide bright eyes, full smile, freckles
  bisola: { headShape: 'round', faceWidth: 1.07, eyeScale: 1.14, noseWidth: 1.08, lipScale: 1.12, browLift: 1.5, marks: ['freckles'] },
  // Calm observer: long elegant face, slim nose, silk headwrap
  hauwa: { headShape: 'long', faceWidth: 0.96, eyeScale: 0.98, noseWidth: 0.86, lipScale: 0.96, headwrap: '#0F766E' },
};

/** Base looks (Episode 1 defaults) */
export const NPC_BASE_LOOKS: Record<GirlId, HeroineCustomization> = {
  zee: {
    name: 'Zainab "Zee" Bello', department: 'Fashion & Luxury Branding', skinTone: 'rich_honey', eyeColor: 'amber',
    hairstyle: 'body_wave_wig', hairColor: 'jet_black', lipColor: 'classic_red', lipFinish: 'gloss', eyeshadow: 'gold',
    lashes: 'dramatic', blush: 'rose', highlighter: true, brows: 'arched', outfit: 'party_dress', earrings: 'drops', necklace: 'pendant',
  },
  tamara: {
    name: 'Tamara Okonkwo-Reid', department: 'Business Administration & Finance', skinTone: 'caramel', eyeColor: 'hazel',
    hairstyle: 'knotless_braids', hairColor: 'honey_blonde', lipColor: 'coral', lipFinish: 'gloss', eyeshadow: 'bronze',
    lashes: 'volume', blush: 'soft_peach', highlighter: true, brows: 'soft', outfit: 'ankara', earrings: 'hoops', necklace: 'thin_chain',
  },
  chi: {
    name: 'Chioma "Chi" Eze', department: 'Law & International Governance', skinTone: 'deep_chestnut', eyeColor: 'dark_brown',
    hairstyle: 'bob_wig', hairColor: 'jet_black', lipColor: 'plum', lipFinish: 'matte', eyeshadow: 'smoky_black',
    lashes: 'classic', blush: 'bold_berry', highlighter: true, brows: 'bold', outfit: 'corporate', earrings: 'studs', necklace: 'thin_chain',
  },
  bisola: {
    name: 'Bisola Adeyemi', department: 'Media & Digital Communications', skinTone: 'dark_cocoa', eyeColor: 'dark_brown',
    hairstyle: 'curly_wig', hairColor: 'burgundy', lipColor: 'soft_pink', lipFinish: 'gloss', eyeshadow: 'rose',
    lashes: 'volume', blush: 'bold_berry', highlighter: true, brows: 'arched', outfit: 'casual', earrings: 'hoops', necklace: 'thin_chain',
  },
  hauwa: {
    name: 'Hauwa Musa', department: 'Interior & Architectural Design', skinTone: 'radiant_ebony', eyeColor: 'dark_brown',
    hairstyle: 'cornrows', hairColor: 'jet_black', lipColor: 'nude', lipFinish: 'matte', eyeshadow: 'bronze',
    lashes: 'natural', blush: 'none', highlighter: true, brows: 'soft', outfit: 'native_lace', earrings: 'studs', necklace: 'thin_chain',
  },
};

export interface StoryMoment {
  episode?: number;
  location?: LocationType;
}

/**
 * How a girl looks at this point in the story: party dresses at the party, campus fits on campus,
 * home looks in the Content House, and new hair as the season goes on.
 */
export function getNpcLook(id: GirlId, moment: StoryMoment = {}): { look: HeroineCustomization; face: FaceProfile } {
  const episode = moment.episode ?? 1;
  const loc = moment.location;
  const look: HeroineCustomization = { ...NPC_BASE_LOOKS[id] };
  const face: FaceProfile = { ...NPC_FACES[id] };

  // --- Outfits by place ---
  const isParty = (loc === 'banana_island_mansion' && episode === 1) || loc === 'rooftop_party';
  if (isParty) {
    look.outfit = id === 'hauwa' ? 'native_lace' : 'party_dress';
    look.necklace = id === 'chi' ? 'pendant' : look.necklace;
  } else if (loc === 'university_campus') {
    look.outfit = ({ zee: 'corporate', tamara: 'casual', chi: 'corporate', bisola: 'hoodie', hauwa: 'native_lace' } as const)[id];
  } else if (loc === 'mall') {
    look.outfit = ({ zee: 'party_dress', tamara: 'ankara', chi: 'corporate', bisola: 'casual', hauwa: 'native_lace' } as const)[id];
  } else if (loc === 'beach_house') {
    look.outfit = ({ zee: 'party_dress', tamara: 'ankara', chi: 'casual', bisola: 'party_dress', hauwa: 'native_lace' } as const)[id];
  } else if (loc === 'banana_island_mansion' && episode >= 3) {
    // Content House at home
    look.outfit = ({ zee: 'corporate', tamara: 'ankara', chi: 'casual', bisola: 'hoodie', hauwa: 'native_lace' } as const)[id];
  } else if (loc === 'night_street') {
    look.outfit = id === 'hauwa' ? 'native_lace' : 'hoodie';
  }

  // --- Hair and details change over the season ---
  if (id === 'zee') {
    if (episode === 2) look.hairstyle = 'long_straight_wig';
    if (episode >= 3) {
      look.hairstyle = 'deep_wave_wig';
      look.hairColor = 'dark_brown';
    }
  }
  if (id === 'bisola' && episode >= 2) look.hairColor = 'rose_pink'; // "her pink wig" in Episode 3
  if (id === 'tamara' && episode >= 3) look.hairColor = 'ombre_blonde';
  if (id === 'chi' && episode >= 3) look.lipColor = 'berry';
  if (id === 'hauwa') {
    face.headwrap = episode === 1 ? '#B45309' : episode === 2 ? '#0F766E' : '#6B21A8';
  }

  return { look, face };
}

export const GIRL_IDS: GirlId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];
