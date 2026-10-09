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

/** The kind of scene a location is, for wardrobe and makeup */
type Vibe = 'party' | 'owambe' | 'campus' | 'mall' | 'beach' | 'home' | 'night' | 'studio' | 'everyday';

function vibeOf(loc: LocationType | undefined, episode: number): Vibe {
  if (loc === 'event_hall') return 'owambe';
  if ((loc === 'banana_island_mansion' && episode === 1) || loc === 'rooftop_party') return 'party';
  if (loc === 'university_campus') return 'campus';
  if (loc === 'mall') return 'mall';
  if (loc === 'beach_house') return 'beach';
  if (loc === 'banana_island_mansion') return 'home'; // the Content House
  if (loc === 'night_street') return 'night';
  if (loc === 'photoshoot_studio') return 'studio';
  return 'everyday';
}

type LookChange = Partial<HeroineCustomization> & { headwrap?: string };

/**
 * Each girl's wardrobe, hair and makeup per kind of scene. Faces and skin
 * tones never change; everything here is what she'd swap for the occasion.
 */
const SCENE_LOOKS: Record<GirlId, Partial<Record<Vibe, LookChange>>> = {
  zee: {
    owambe: { outfit: 'aso_ebi', lashes: 'dramatic', eyeshadow: 'gold', lipColor: 'classic_red', lipFinish: 'gloss', earrings: 'drops', necklace: 'pendant' },
    party: { outfit: 'party_dress', lashes: 'dramatic', eyeshadow: 'gold', lipColor: 'classic_red', lipFinish: 'gloss', earrings: 'drops', necklace: 'pendant' },
    campus: { outfit: 'corporate', lipColor: 'berry', lipFinish: 'matte', eyeshadow: 'bronze', lashes: 'classic', earrings: 'studs', necklace: 'thin_chain' },
    mall: { outfit: 'corset_top', lipColor: 'soft_pink', lipFinish: 'gloss', eyeshadow: 'rose', lashes: 'volume', earrings: 'hoops', necklace: 'thin_chain' },
    beach: { outfit: 'tube_top', hairstyle: 'genie_ponytail', lipColor: 'coral', lipFinish: 'gloss', eyeshadow: 'none', lashes: 'volume', earrings: 'hoops', necklace: 'none' },
    home: { outfit: 'athleisure', lipColor: 'nude', lipFinish: 'gloss', eyeshadow: 'none', lashes: 'natural', blush: 'soft_peach', earrings: 'studs', necklace: 'none' },
    night: { outfit: 'denim_jacket', lipColor: 'chocolate_brown', lipFinish: 'matte', eyeshadow: 'smoky_black', lashes: 'dramatic', earrings: 'hoops' },
    studio: { outfit: 'corset_top', hairstyle: 'bangs_wig', lipColor: 'gold', lipFinish: 'gloss', eyeshadow: 'gold', lashes: 'dramatic', earrings: 'drops', necklace: 'pendant' },
  },
  tamara: {
    owambe: { outfit: 'aso_ebi', lashes: 'volume', eyeshadow: 'gold', lipColor: 'coral', lipFinish: 'gloss', earrings: 'drops', necklace: 'thin_chain' },
    party: { outfit: 'tube_top', lipColor: 'berry', lipFinish: 'gloss', eyeshadow: 'gold', lashes: 'dramatic', earrings: 'drops', necklace: 'pendant' },
    campus: { outfit: 'adire_shirt', lipColor: 'nude', lipFinish: 'gloss', eyeshadow: 'none', lashes: 'natural', earrings: 'hoops' },
    mall: { outfit: 'crop_top', lipColor: 'coral', lipFinish: 'gloss', eyeshadow: 'bronze', lashes: 'volume', earrings: 'hoops' },
    beach: { outfit: 'halter_top', lipColor: 'coral', lipFinish: 'gloss', eyeshadow: 'none', lashes: 'natural', necklace: 'none' },
    home: { outfit: 'ankara', lipColor: 'nude', lipFinish: 'matte', eyeshadow: 'none', lashes: 'natural', earrings: 'studs' },
    night: { outfit: 'hoodie', lipColor: 'plum', lipFinish: 'matte', eyeshadow: 'smoky_black', lashes: 'classic' },
    studio: { outfit: 'aso_oke', hairstyle: 'water_wave_wig', lipColor: 'gold', lipFinish: 'gloss', eyeshadow: 'gold', lashes: 'dramatic', earrings: 'drops' },
  },
  chi: {
    owambe: { outfit: 'aso_ebi', lashes: 'classic', eyeshadow: 'bronze', lipColor: 'plum', lipFinish: 'matte', earrings: 'studs', necklace: 'pendant' },
    party: { outfit: 'party_dress', hairstyle: 'side_part_wig', lipColor: 'classic_red', lipFinish: 'matte', eyeshadow: 'smoky_black', lashes: 'dramatic', earrings: 'drops', necklace: 'pendant' },
    campus: { outfit: 'corporate' },
    mall: { outfit: 'denim_jacket', lipColor: 'berry', eyeshadow: 'bronze', earrings: 'hoops' },
    beach: { outfit: 'casual', hairstyle: 'genie_ponytail', lipColor: 'nude', lipFinish: 'gloss', eyeshadow: 'none', lashes: 'natural', earrings: 'hoops', necklace: 'none' },
    home: { outfit: 'adire_shirt', lipColor: 'nude', eyeshadow: 'none', lashes: 'natural' },
    night: { outfit: 'athleisure', lipColor: 'berry', eyeshadow: 'smoky_black' },
    studio: { outfit: 'cardigan_set', hairstyle: 'side_part_wig', lipColor: 'chocolate_brown', eyeshadow: 'bronze', lashes: 'classic' },
  },
  bisola: {
    owambe: { outfit: 'aso_ebi', lashes: 'dramatic', eyeshadow: 'gold', lipColor: 'coral', lipFinish: 'gloss', earrings: 'hoops' },
    party: { outfit: 'halter_top', lipColor: 'coral', lipFinish: 'gloss', eyeshadow: 'purple', lashes: 'dramatic', earrings: 'drops', necklace: 'pendant' },
    campus: { outfit: 'baby_tee', hairstyle: 'pixie_wig' },
    mall: { outfit: 'jersey_top', hairstyle: 'bangs_wig', eyeshadow: 'teal' },
    beach: { outfit: 'crop_top', hairstyle: 'water_wave_wig', lipColor: 'coral', eyeshadow: 'none', lashes: 'natural', necklace: 'none' },
    home: { outfit: 'hoodie', lipColor: 'soft_pink', eyeshadow: 'none', lashes: 'natural', earrings: 'studs' },
    night: { outfit: 'hoodie', lipColor: 'plum', eyeshadow: 'purple' },
    studio: { outfit: 'baby_tee', hairstyle: 'genie_ponytail', lipColor: 'berry', eyeshadow: 'purple', lashes: 'dramatic' },
  },
  hauwa: {
    owambe: { outfit: 'aso_ebi', lashes: 'classic', eyeshadow: 'gold', lipColor: 'chocolate_brown', lipFinish: 'gloss', earrings: 'drops', headwrap: '#C9971F' },
    party: { outfit: 'native_lace', lipColor: 'chocolate_brown', lipFinish: 'gloss', eyeshadow: 'gold', lashes: 'classic', earrings: 'drops', headwrap: '#B7791F' },
    campus: { outfit: 'bubu_kaftan' },
    mall: { outfit: 'cardigan_set', headwrap: '#9D174D' },
    beach: { outfit: 'bubu_kaftan', headwrap: '#0E7490' },
    home: { outfit: 'bubu_kaftan', lashes: 'natural', eyeshadow: 'none' },
    night: { outfit: 'native_lace', headwrap: '#1E293B' },
    studio: { outfit: 'aso_oke', lipColor: 'plum', eyeshadow: 'bronze', lashes: 'classic', headwrap: '#6E1423' },
  },
};

/**
 * How a girl looks at this point in the story: her outfit, hair, makeup and
 * jewellery follow the scene, and her hair changes as the season goes on.
 */
export function getNpcLook(id: GirlId, moment: StoryMoment = {}): { look: HeroineCustomization; face: FaceProfile } {
  const episode = moment.episode ?? 1;
  const look: HeroineCustomization = { ...NPC_BASE_LOOKS[id] };
  const face: FaceProfile = { ...NPC_FACES[id] };

  // --- Hair changes over the season ---
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
  if (id === 'hauwa') face.headwrap = episode === 1 ? '#B45309' : episode === 2 ? '#0F766E' : '#6B21A8';

  // --- The scene: outfit, styling, makeup, jewellery ---
  const vibe = vibeOf(moment.location, episode);
  const { headwrap, ...change } = SCENE_LOOKS[id][vibe] ?? {};
  Object.assign(look, change);
  if (headwrap) face.headwrap = headwrap;
  // Zee moves from the emerald gown to a corset for later parties
  if (id === 'zee' && vibe === 'party' && episode >= 2) look.outfit = 'corset_top';

  return { look, face };
}

export const GIRL_IDS: GirlId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];
