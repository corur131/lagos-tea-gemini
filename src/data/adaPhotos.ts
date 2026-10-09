import { Expression, HeroineCustomization, LocationType, Meters, OutfitId } from '../types/vn';
import { Unlockable } from '../types/socialFeed';
import { isUnlocked } from './socialRules';

/* =========================================================================
   ADA'S CAMERA ROLL
   Photos she can post. Story photos unlock once the moment has happened
   (and only if the player made the matching choice), so the composer always
   reflects where Ada is in the story. Older moments fade out after an episode.
   ========================================================================= */

/** What a photo is "about". Used to judge how a post lands with the audience. */
export type PhotoTag = 'glam' | 'authentic' | 'luxury' | 'romance' | 'scandal' | 'mystery' | 'hustle' | 'roots';

export interface PhotoOption {
  /** Unique id; stored on the post as photoKind */
  kind: string;
  label: string;
  bgGradient: string;
  tags: PhotoTag[];
  /** Ada's face in the shot */
  expression?: Expression;
  /** Outfit she wears in this shot (defaults to her current outfit) */
  outfit?: OutfitId;
  /** Object shots show this instead of Ada */
  emoji?: string;
  /** Extra consequences of posting this exact photo (e.g. who it makes jealous) */
  effect?: Partial<Meters>;
}

interface StoryPhoto extends Unlockable, PhotoOption {}

export const LOCATION_LABELS: Record<LocationType, string> = {
  ajegunle_apartment: 'my little room in Ajegunle',
  banana_island_mansion: 'the Banana Island mansion',
  rooftop_party: 'a VI rooftop',
  mall: 'The Palms',
  university_campus: 'Lekki Atlantic campus',
  beach_house: 'Ilashe beach house',
  photoshoot_studio: 'the photo studio',
  night_street: 'Lagos at night',
};

export const LOCATION_GRADIENTS: Record<LocationType, string> = {
  ajegunle_apartment: 'from-amber-600 via-orange-800 to-neutral-950',
  banana_island_mansion: 'from-amber-500 via-rose-700 to-neutral-950',
  rooftop_party: 'from-indigo-700 via-fuchsia-800 to-neutral-950',
  mall: 'from-sky-500 via-indigo-700 to-neutral-950',
  university_campus: 'from-emerald-600 via-sky-800 to-neutral-950',
  beach_house: 'from-cyan-400 via-teal-700 to-neutral-950',
  photoshoot_studio: 'from-neutral-300 via-neutral-600 to-neutral-950',
  night_street: 'from-violet-900 via-neutral-900 to-black',
};

const OUTFIT_LABELS: Record<OutfitId, string> = {
  casual: 'campus casual',
  corporate: 'boss-girl corporate',
  ankara: 'Ankara print',
  party_dress: 'party dress',
  hoodie: 'cosy hoodie',
  native_lace: 'native lace',
  bubu_kaftan: 'owambe bubu',
  adire_shirt: 'adire',
  aso_oke: 'aso-oke',
  denim_jacket: 'denim',
  corset_top: 'satin corset',
  athleisure: 'track half-zip',
};

const LOCATION_TAGS: Record<LocationType, PhotoTag[]> = {
  ajegunle_apartment: ['roots', 'authentic'],
  banana_island_mansion: ['luxury', 'glam'],
  rooftop_party: ['glam', 'luxury'],
  mall: ['luxury'],
  university_campus: ['hustle', 'authentic'],
  beach_house: ['glam', 'luxury'],
  photoshoot_studio: ['glam', 'hustle'],
  night_street: ['mystery', 'authentic'],
};

export const STORY_PHOTOS: StoryPhoto[] = [
  /* ---------------- Episode 1 ---------------- */
  { kind: 'ep1_study_grind', label: 'Late-night study grind, laptop glow 📚', bgGradient: 'from-amber-700 via-orange-900 to-neutral-950', tags: ['hustle', 'authentic', 'roots'], expression: 'neutral', outfit: 'hoodie', unlockEpisode: 1, unlockSceneIndex: 0, unlockAtSceneStart: true },
  { kind: 'ep1_throwback', label: 'Ajegunle throwback, baby photo 💛', bgGradient: 'from-amber-700 via-orange-900 to-neutral-950', tags: ['roots', 'authentic'], expression: 'happy', unlockEpisode: 1, unlockSceneIndex: 0, unlockAtSceneStart: true },
  { kind: 'ep1_emerald_mirror', label: 'Mirror pic in the emerald gown 💚', bgGradient: 'from-emerald-500 via-emerald-800 to-neutral-950', tags: ['glam', 'luxury'], expression: 'flirty', outfit: 'party_dress', unlockEpisode: 1, unlockSceneIndex: 2, requiredAnyFlags: ['borrowed_emerald_dress', 'dragged_dress'] },
  { kind: 'ep1_thrift_dress', label: '₦4,500 thrifted dress, styled like Paris 🖤', bgGradient: 'from-neutral-500 via-neutral-800 to-black', tags: ['authentic', 'glam', 'hustle'], expression: 'flirty', outfit: 'party_dress', unlockEpisode: 1, unlockSceneIndex: 2, requiredFlag: 'vintage_style_dress' },
  { kind: 'ep1_party_arrival', label: 'Arriving at Zee’s Banana Island party ✨', bgGradient: 'from-amber-400 via-rose-700 to-neutral-950', tags: ['luxury', 'glam'], expression: 'happy', outfit: 'party_dress', unlockEpisode: 1, unlockSceneIndex: 3 },
  { kind: 'ep1_lagoon_terrace', label: 'Lagoon view from the pool terrace 🌊', bgGradient: 'from-sky-600 via-indigo-800 to-neutral-950', tags: ['luxury', 'glam'], expression: 'neutral', outfit: 'party_dress', unlockEpisode: 1, unlockSceneIndex: 4 },
  { kind: 'ep1_chidi_candid', label: 'The candid Chidi snapped of me 📸', bgGradient: 'from-blue-600 via-cyan-800 to-neutral-950', tags: ['romance', 'authentic'], effect: { romanceChidi: 3 }, expression: 'happy', outfit: 'party_dress', unlockEpisode: 1, unlockSceneIndex: 4, requiredAnyFlags: ['flirted_with_chidi', 'bantered_with_chidi'] },
  { kind: 'ep1_champagne', label: 'Champagne flute against the lagoon lights 🥂', bgGradient: 'from-amber-500 via-pink-700 to-neutral-950', tags: ['luxury', 'romance'], effect: { romanceKelvin: 2 }, emoji: '🥂', unlockEpisode: 1, unlockSceneIndex: 5, requiredAnyFlags: ['locked_eyes_kelvin', 'challenged_kelvin'] },

  /* ---------------- Episode 2 ---------------- */
  { kind: 'ep2_campus_walk', label: 'Head-high walk past the palm trees 🌴', bgGradient: 'from-emerald-600 via-sky-800 to-neutral-950', tags: ['authentic', 'hustle'], expression: 'neutral', outfit: 'casual', unlockEpisode: 2, unlockSceneIndex: 0 },
  { kind: 'ep2_comment_receipts', label: 'Screenshot of the burner account’s comment 🧾', bgGradient: 'from-rose-700 via-neutral-900 to-black', tags: ['scandal', 'mystery'], emoji: '🧾', unlockEpisode: 2, unlockSceneIndex: 0, requiredFlag: 'investigated_comments' },
  { kind: 'ep2_coffee_lounge', label: 'Iced latte at the campus coffee lounge ☕', bgGradient: 'from-amber-800 via-stone-800 to-neutral-950', tags: ['authentic'], expression: 'happy', outfit: 'casual', unlockEpisode: 2, unlockSceneIndex: 1 },
  { kind: 'ep2_studio_malt', label: 'Cold malt at Chidi’s photo studio 🎞️', bgGradient: 'from-neutral-300 via-neutral-600 to-neutral-950', tags: ['romance', 'hustle'], effect: { romanceChidi: 2 }, emoji: '🎞️', unlockEpisode: 2, unlockSceneIndex: 2 },
  { kind: 'ep2_porsche', label: 'Selfie in Kelvin’s Porsche 🏎️', bgGradient: 'from-neutral-800 via-amber-900 to-black', tags: ['luxury', 'romance', 'scandal'], effect: { romanceKelvin: 3, romanceChidi: -2 }, expression: 'flirty', outfit: 'casual', unlockEpisode: 2, unlockSceneIndex: 3, requiredFlag: 'drove_with_kelvin' },
  { kind: 'ep2_shuttle', label: 'Campus shuttle. Still that girl 🚌', bgGradient: 'from-yellow-500 via-emerald-800 to-neutral-950', tags: ['authentic', 'roots'], expression: 'happy', outfit: 'casual', unlockEpisode: 2, unlockSceneIndex: 3, requiredFlag: 'refused_kelvin_ride' },
  { kind: 'ep2_palms', label: 'Window shopping at The Palms 🛍️', bgGradient: 'from-sky-500 via-indigo-700 to-neutral-950', tags: ['luxury', 'glam'], expression: 'happy', unlockEpisode: 2, unlockSceneIndex: 4 },
  { kind: 'ep2_vi_rooftop', label: 'VI skyline from the rooftop lounge 🌃', bgGradient: 'from-indigo-700 via-fuchsia-800 to-neutral-950', tags: ['glam', 'luxury'], expression: 'neutral', outfit: 'party_dress', unlockEpisode: 2, unlockSceneIndex: 5 },
  { kind: 'ep2_brass_key', label: 'A mysterious brass key… 🔑', bgGradient: 'from-yellow-600 via-amber-800 to-black', tags: ['mystery', 'scandal'], emoji: '🔑', unlockEpisode: 2, unlockSceneIndex: 6 },

  /* ---------------- Episode 3 ---------------- */
  { kind: 'ep3_new_suite', label: 'My new suite in the Content House 🏡', bgGradient: 'from-rose-400 via-amber-700 to-neutral-950', tags: ['luxury', 'glam'], expression: 'happy', unlockEpisode: 3, unlockSceneIndex: 0 },
  { kind: 'ep3_ring_lights', label: 'Behind the ring lights with the girls 💡', bgGradient: 'from-pink-400 via-purple-700 to-neutral-950', tags: ['glam', 'hustle'], expression: 'flirty', unlockEpisode: 3, unlockSceneIndex: 1 },
  { kind: 'ep3_beach_shoot', label: 'Ilashe beach shoot, golden hour 🏖️', bgGradient: 'from-cyan-400 via-teal-700 to-neutral-950', tags: ['glam', 'luxury'], expression: 'happy', unlockEpisode: 3, unlockSceneIndex: 2 },
  { kind: 'ep3_cabana_hands', label: 'Two hands on the cabana railing 🤍', bgGradient: 'from-sky-300 via-blue-700 to-neutral-950', tags: ['romance', 'scandal'], effect: { romanceChidi: 4, romanceKelvin: -2 }, emoji: '🤍', unlockEpisode: 3, unlockSceneIndex: 2, requiredFlag: 'chidi_romantic_moment' },
  { kind: 'ep3_villa_study', label: 'Late night in the villa study 🥃', bgGradient: 'from-amber-900 via-stone-900 to-black', tags: ['mystery', 'luxury'], effect: { romanceKelvin: 2 }, emoji: '🥃', unlockEpisode: 3, unlockSceneIndex: 3 },
  { kind: 'ep3_pantry_tea', label: 'Midnight peppermint tea ☕', bgGradient: 'from-emerald-800 via-stone-900 to-black', tags: ['mystery', 'authentic'], emoji: '🍵', unlockEpisode: 3, unlockSceneIndex: 4, requiredFlag: 'stepped_out_hauwa' },
  { kind: 'ep3_archive_door', label: 'Blurry shot of a locked archive room 👀', bgGradient: 'from-neutral-800 via-rose-950 to-black', tags: ['scandal', 'mystery'], emoji: '🚪', unlockEpisode: 3, unlockSceneIndex: 5, requiredFlag: 'photographed_tea_phone' },
];

/** How many past episodes of story photos stay in the camera roll */
const PHOTO_MEMORY_EPISODES = 1;
const MAX_STORY_PHOTOS = 4;

export interface PhotoProgress {
  episode: number;
  /** Social progress (current scene + 1 once its choice is made) */
  sceneIndex: number;
  flags: Record<string, boolean>;
}

/**
 * The photos Ada can post right now: her newest story moments first, then a mirror selfie in her
 * current outfit and a shot at wherever she is in the story.
 */
export function getPhotoOptions(
  heroine: HeroineCustomization,
  location: LocationType,
  progress?: PhotoProgress
): PhotoOption[] {
  const p = progress ?? { episode: 1, sceneIndex: 0, flags: {} };

  const story = STORY_PHOTOS.filter(
    (ph) => ph.unlockEpisode >= p.episode - PHOTO_MEMORY_EPISODES && isUnlocked(ph, p.episode, p.sceneIndex, p.flags)
  )
    .sort(
      (a, b) =>
        b.unlockEpisode - a.unlockEpisode ||
        (b.unlockSceneIndex ?? 0) - (a.unlockSceneIndex ?? 0) ||
        STORY_PHOTOS.indexOf(a) - STORY_PHOTOS.indexOf(b)
    )
    .slice(0, MAX_STORY_PHOTOS)
    .map(({ kind, label, bgGradient, tags, expression, outfit, emoji, effect }) => ({ kind, label, bgGradient, tags, expression, outfit, emoji, effect }));

  const everyday: PhotoOption[] = [
    {
      kind: `here_${location}`,
      label: `Right now at ${LOCATION_LABELS[location]} 📍`,
      bgGradient: LOCATION_GRADIENTS[location],
      tags: LOCATION_TAGS[location],
      expression: 'flirty',
    },
    {
      kind: 'mirror_selfie',
      label: `Mirror selfie in my ${OUTFIT_LABELS[heroine.outfit]} fit`,
      bgGradient: 'from-pink-500 via-purple-700 to-neutral-950',
      tags: ['glam'],
      expression: 'flirty',
    },
  ];

  return [...story, ...everyday];
}
