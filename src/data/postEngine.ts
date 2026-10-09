import { Meters } from '../types/vn';
import { AdaPost, AdaPostTone, SocialEffect, Unlockable } from '../types/socialFeed';
import { isUnlocked } from './socialRules';
import type { PhotoOption, PhotoTag } from './adaPhotos';

/* =========================================================================
   POST ENGINE
   How one of Ada's posts lands. Photo, vibe and caption ALL matter, and the
   same post lands differently depending on where we are in the story.
   ========================================================================= */

export const POSTS_PER_EPISODE = 10;

export const VIBE_ORDER: AdaPostTone[] = ['humble', 'shady', 'flex', 'flirty', 'mysterious'];

interface VibeInfo {
  label: string;
  description: string;
  badge: string;
  followerBase: number;
  effect: SocialEffect;
  /** How well each photo tag suits this vibe (1 = neutral) */
  photoFit: Partial<Record<PhotoTag, number>>;
}

export const VIBES: Record<AdaPostTone, VibeInfo> = {
  humble: {
    label: 'Humble 🙏',
    description: 'Earns respect. Slow, steady growth.',
    badge: '🙏 GRATEFUL',
    followerBase: 500,
    effect: { meterChanges: { reputation: 4, loyalty: 2 } },
    photoFit: { authentic: 1.2, roots: 1.25, hustle: 1.15, glam: 0.95, luxury: 0.8, scandal: 0.8 },
  },
  shady: {
    label: 'Shady 💅',
    description: 'Big reach. The girls won’t love it.',
    badge: '💅 NO NAMES',
    followerBase: 1800,
    effect: { meterChanges: { popularity: 5, jealousy: 4, loyalty: -3, suspicion: 2 } },
    photoFit: { scandal: 1.3, glam: 1.1, mystery: 1.1, roots: 0.85 },
  },
  flex: {
    label: 'Flex 👑',
    description: 'Looks rich. People will ask questions.',
    badge: '👑 MAIN CHARACTER',
    followerBase: 1100,
    effect: { meterChanges: { popularity: 4, reputation: -2, jealousy: 2 } },
    photoFit: { luxury: 1.3, glam: 1.2, hustle: 0.9, roots: 0.8 },
  },
  flirty: {
    label: 'Flirty 💋',
    description: 'Soft-launch energy. Someone will get jealous.',
    badge: '💋 SOFT LAUNCH',
    followerBase: 1300,
    effect: { meterChanges: { popularity: 3, jealousy: 3 } },
    photoFit: { romance: 1.4, glam: 1.15, mystery: 0.9, hustle: 0.9 },
  },
  mysterious: {
    label: 'Mysterious 👀',
    description: 'Hints at what you know. Raises suspicion.',
    badge: '👀 CRYPTIC',
    followerBase: 1000,
    effect: { meterChanges: { popularity: 2, suspicion: 3, reputation: 1 } },
    photoFit: { mystery: 1.35, scandal: 1.25, glam: 0.85, roots: 0.85 },
  },
};

/* ------------------------------ Captions ------------------------------ */

export interface CaptionOption extends Unlockable {
  id: string;
  tone: AdaPostTone;
  text: string;
  /** How hard the caption hooks people (1 = average) */
  hook: number;
  /** Extra consequences of this exact caption */
  effect?: Partial<Meters>;
  /** Evergreen captions are always available */
  evergreen?: boolean;
}

const EVER = { unlockEpisode: 1, unlockSceneIndex: 0, unlockAtSceneStart: true, evergreen: true };

export const CAPTIONS: CaptionOption[] = [
  /* ---------- Humble ---------- */
  { id: 'hu_rooms', tone: 'humble', text: 'Grateful for every room I walk into, even the ones that didn’t want me there 🙏✨', hook: 1.0, ...EVER },
  { id: 'hu_scholar', tone: 'humble', text: 'Scholarship girl. Big dreams, small room. Still here 💛📚', hook: 1.05, ...EVER },
  { id: 'hu_far', tone: 'humble', text: 'Not where I want to be, but so far from where I started 🙏', hook: 0.95, ...EVER },
  { id: 'hu_48h', tone: 'humble', text: 'Forty-eight hours to find ₦1.2M. Still choosing peace 🙏', hook: 1.15, unlockEpisode: 1, unlockSceneIndex: 0, unlockAtSceneStart: true },
  { id: 'hu_not_ashamed', tone: 'humble', text: 'Yes, I’m from Ajegunle. No, I’m not ashamed. Next question 💛', hook: 1.4, effect: { reputation: 3 }, unlockEpisode: 1, unlockSceneIndex: 6, unlockedByFlag: 'reveal_ep1_leak' },
  { id: 'hu_head_up', tone: 'humble', text: 'Walked into class with my head up today. That’s the post 🌴', hook: 1.25, unlockEpisode: 2, unlockSceneIndex: 0, requiredFlag: 'unbothered_walk' },
  { id: 'hu_cleared', tone: 'humble', text: 'Tuition: cleared. Gratitude: overflowing. Work: just starting 📚', hook: 1.2, unlockEpisode: 3, unlockSceneIndex: 0 },

  /* ---------- Shady ---------- */
  { id: 'sh_tapwater', tone: 'shady', text: 'Some people’s “tea” is just tap water with a filter 💅🫖', hook: 1.0, ...EVER },
  { id: 'sh_watching', tone: 'shady', text: 'Smile for the camera, babe. I know you’re watching 👀', hook: 1.05, ...EVER },
  { id: 'sh_billboard', tone: 'shady', text: 'Real style doesn’t need a billboard tag. Some of us were born with taste 💅', hook: 1.2, effect: { jealousy: 3 }, unlockEpisode: 1, unlockSceneIndex: 3, requiredFlag: 'checked_chioma' },
  { id: 'sh_irrelevant', tone: 'shady', text: 'Imagine leaking someone’s address and still being irrelevant 🥱', hook: 1.4, effect: { suspicion: 2 }, unlockEpisode: 1, unlockSceneIndex: 6, unlockedByFlag: 'reveal_ep1_leak' },
  { id: 'sh_two_phones', tone: 'shady', text: 'Funny how the loudest people always carry two phones 📱📱', hook: 1.5, effect: { suspicion: 4 }, unlockEpisode: 2, unlockSceneIndex: 2, requiredAnyFlags: ['chidi_exif_search', 'bisola_contract_pressed', 'investigated_comments'] },
  { id: 'sh_thin_walls', tone: 'shady', text: 'Thin walls in this house. I hear everything, ladies 🫖', hook: 1.45, effect: { loyalty: -3, jealousy: 3 }, unlockEpisode: 3, unlockSceneIndex: 4 },

  /* ---------- Flex ---------- */
  { id: 'fl_view', tone: 'flex', text: 'Same girl, new view 💅🌴', hook: 1.0, ...EVER },
  { id: 'fl_main', tone: 'flex', text: 'Main character energy. No auditions 👑', hook: 1.05, ...EVER },
  { id: 'fl_banana', tone: 'flex', text: 'Ajegunle to Banana Island in one night 💅🌴', hook: 1.2, unlockEpisode: 1, unlockSceneIndex: 3 },
  { id: 'fl_algorithm', tone: 'flex', text: 'They said I didn’t belong. The algorithm disagrees 📈✨', hook: 1.3, unlockEpisode: 1, unlockSceneIndex: 6, unlockedByFlag: 'reveal_ep1_leak' },
  { id: 'fl_leather', tone: 'flex', text: 'Leather seats hit different on Ozumba Mbadiwe 🏎️', hook: 1.35, effect: { romanceKelvin: 2, jealousy: 3 }, unlockEpisode: 2, unlockSceneIndex: 3, requiredFlag: 'drove_with_kelvin' },
  { id: 'fl_contract', tone: 'flex', text: 'Read the contract. Negotiated the contract. Signed the contract 🖊️👑', hook: 1.25, effect: { reputation: 3 }, unlockEpisode: 2, unlockSceneIndex: 6, requiredFlag: 'negotiated_pa_terms' },
  { id: 'fl_content_house', tone: 'flex', text: 'New address. Same hustle. Content House era 🏡✨', hook: 1.3, unlockEpisode: 3, unlockSceneIndex: 0 },

  /* ---------- Flirty ---------- */
  { id: 'fr_soft', tone: 'flirty', text: 'Soft launch? Never heard of her 🙈', hook: 1.1, effect: { jealousy: 2 }, ...EVER },
  { id: 'fr_butterflies', tone: 'flirty', text: 'Butterflies are a scam. Anyway 🦋', hook: 1.0, ...EVER },
  { id: 'fr_shutter', tone: 'flirty', text: 'Some conversations are worth more than a shutter count 💌', hook: 1.3, effect: { romanceChidi: 3 }, unlockEpisode: 1, unlockSceneIndex: 4, requiredAnyFlags: ['flirted_with_chidi', 'bantered_with_chidi', 'confided_chidi_incognito'] },
  { id: 'fr_dangerous', tone: 'flirty', text: 'A dangerous look in my eye, they said 😏', hook: 1.3, effect: { romanceKelvin: 3 }, unlockEpisode: 1, unlockSceneIndex: 5, requiredAnyFlags: ['locked_eyes_kelvin', 'challenged_kelvin'] },
  { id: 'fr_malt', tone: 'flirty', text: 'Cold malt, warm company 🎞️', hook: 1.25, effect: { romanceChidi: 3 }, unlockEpisode: 2, unlockSceneIndex: 2, requiredFlag: 'chidi_trust_deepened' },
  { id: 'fr_golden', tone: 'flirty', text: 'Golden hour, good company 🤍', hook: 1.4, effect: { romanceChidi: 4, jealousy: 3 }, unlockEpisode: 3, unlockSceneIndex: 2, requiredFlag: 'chidi_romantic_moment' },
  { id: 'fr_lock_door', tone: 'flirty', text: 'Whoever told me to lock my door tonight… goodnight to you too 🥃', hook: 1.35, effect: { romanceKelvin: 3, suspicion: 2 }, unlockEpisode: 3, unlockSceneIndex: 3, requiredAnyFlags: ['kelvin_confronted_warning', 'challenged_kelvin_closet'] },

  /* ---------- Mysterious ---------- */
  { id: 'my_timeline', tone: 'mysterious', text: 'Not everything I know is for the timeline 👀', hook: 1.0, ...EVER },
  { id: 'my_notes', tone: 'mysterious', text: 'Watching. Listening. Taking notes 📝', hook: 1.05, ...EVER },
  { id: 'my_time', tone: 'mysterious', text: 'I know what time that photo was taken. Do you? 🕰️', hook: 1.45, effect: { suspicion: 4 }, unlockEpisode: 1, unlockSceneIndex: 6, requiredAnyFlags: ['chidi_archive_alliance', 'investigated_comments'] },
  { id: 'my_mezzanine', tone: 'mysterious', text: 'The view from the mezzanine is very interesting 🏛️', hook: 1.4, effect: { suspicion: 3 }, unlockEpisode: 2, unlockSceneIndex: 2 },
  { id: 'my_brass', tone: 'mysterious', text: 'Brass. Heavy. Very interesting 🔑', hook: 1.3, effect: { suspicion: 2 }, unlockEpisode: 2, unlockSceneIndex: 6 },
  { id: 'my_performing', tone: 'mysterious', text: 'Everyone in this house is performing for someone 🎭', hook: 1.2, unlockEpisode: 3, unlockSceneIndex: 1 },
  { id: 'my_2am', tone: 'mysterious', text: '2:00 AM. Archive room. Say less 🚪', hook: 1.6, effect: { suspicion: 6, popularity: 2 }, unlockEpisode: 3, unlockSceneIndex: 5, requiredAnyFlags: ['inspected_burner_phone', 'photographed_tea_phone'] },
];

export interface StoryProgress {
  episode: number;
  /** Social progress (current scene + 1 once its choice is made) */
  sceneIndex: number;
  flags: Record<string, boolean>;
}

const MAX_CAPTIONS = 4;

/** Captions for a vibe right now: newest story captions first, topped up with evergreen ones. */
export function getCaptionOptions(tone: AdaPostTone, p: StoryProgress): CaptionOption[] {
  const open = CAPTIONS.filter((c) => c.tone === tone && isUnlocked(c, p.episode, p.sceneIndex, p.flags));
  const story = open
    .filter((c) => !c.evergreen && c.unlockEpisode >= p.episode - 1)
    .sort((a, b) => b.unlockEpisode - a.unlockEpisode || (b.unlockSceneIndex ?? 0) - (a.unlockSceneIndex ?? 0));
  const evergreen = open.filter((c) => c.evergreen);
  return [...story, ...evergreen].slice(0, MAX_CAPTIONS);
}

/* --------------------------- Audience mood --------------------------- */

export interface AudienceMood {
  id: string;
  label: string;
  hint: string;
  mult: Record<AdaPostTone, number>;
  tweak: Partial<Record<AdaPostTone, Partial<Meters>>>;
}

/** The audience changes as the story moves; the same post lands differently. */
export function getAudienceMood(p: StoryProgress): AudienceMood {
  const f = p.flags;
  if (p.episode === 1 && !f.reveal_ep1_leak) {
    return {
      id: 'fresh',
      label: 'Nobody knows you yet',
      hint: 'Small audience. Honest posts land best. Shade with no context falls flat.',
      mult: { humble: 1.15, shady: 0.6, flex: 0.9, flirty: 1.0, mysterious: 0.75 },
      tweak: { shady: { reputation: -3 } },
    };
  }
  if (p.episode === 1 || (p.episode === 2 && p.sceneIndex <= 1)) {
    return {
      id: 'leak_fallout',
      label: 'All eyes on the Ajegunle girl',
      hint: 'Everyone saw the leak. Clapbacks and cryptic posts go viral. Flexing looks suspicious.',
      mult: { humble: 1.35, shady: 1.6, flex: 0.65, flirty: 0.85, mysterious: 1.4 },
      tweak: { humble: { reputation: 3 }, shady: { suspicion: 3 }, flex: { reputation: -6 }, flirty: { jealousy: 2 } },
    };
  }
  if (p.episode === 2) {
    const kelvinRumours = !!f.drove_with_kelvin;
    return {
      id: 'investigation',
      label: kelvinRumours ? 'Campus detectives + Porsche rumours' : 'Campus detectives',
      hint: kelvinRumours
        ? 'Everyone is hunting the leaker, and everyone saw you in Kelvin’s car. Flirty posts explode.'
        : 'Everyone is hunting the leaker. Cryptic hints get shared everywhere.',
      mult: { humble: 1.05, shady: 1.2, flex: 0.9, flirty: kelvinRumours ? 1.45 : 1.1, mysterious: 1.5 },
      tweak: { mysterious: { suspicion: 3 }, ...(kelvinRumours ? { flirty: { jealousy: 3, romanceKelvin: 1 } } : {}) },
    };
  }
  if (p.episode === 3) {
    return {
      id: 'content_house',
      label: 'Living with the suspects',
      hint: 'Luxury is expected now. The girls read your shade at breakfast. Cryptic posts spark house paranoia.',
      mult: { humble: 0.9, shady: 1.3, flex: 1.4, flirty: 1.25, mysterious: 1.6 },
      tweak: { humble: { reputation: -1 }, shady: { loyalty: -6, jealousy: 5 }, flex: { jealousy: 3 }, mysterious: { suspicion: 6 } },
    };
  }
  return {
    id: 'steady',
    label: 'Lagos is watching',
    hint: 'Every vibe can work. Fresh content wins.',
    mult: { humble: 1, shady: 1, flex: 1, flirty: 1, mysterious: 1 },
    tweak: {},
  };
}

/* ------------------------------ Scoring ------------------------------ */

const TAG_EFFECTS: Record<PhotoTag, Partial<Meters>> = {
  glam: { popularity: 1 },
  authentic: { reputation: 1 },
  luxury: { jealousy: 1 },
  romance: { jealousy: 2 },
  scandal: { suspicion: 2, popularity: 1 },
  mystery: { suspicion: 1 },
  hustle: { reputation: 1 },
  roots: { loyalty: 2, reputation: 1 },
};

const NPCS = ['zee', 'tamara', 'kelvin', 'chi', 'bisola', 'hauwa', 'chidi', 'dayo', 'lagos_tea'];

export interface PostFactor {
  label: string;
  mult: number;
  note?: string;
}

export interface PostOutcome {
  followerGain: number;
  likesCount: number;
  followersRange: [number, number];
  likesRange: [number, number];
  meterChanges: Partial<Meters>;
  factors: PostFactor[];
  mood: AudienceMood;
}

export interface PostInput {
  tone: AdaPostTone;
  photo: PhotoOption;
  caption: CaptionOption;
  meters: Meters;
  progress: StoryProgress;
  pastPosts: AdaPost[];
  unfollowed?: Record<string, boolean>;
}

const VARIANCE: [number, number] = [0.85, 1.2];
const POST_EFFECT_SCALE = 0.6;
const MAX_METER_CHANGE_PER_POST = 6;

function addMeters(into: Partial<Meters>, add?: Partial<Meters>, scale = 1) {
  if (!add) return;
  (Object.keys(add) as Array<keyof Meters>).forEach((k) => {
    into[k] = (into[k] || 0) + (add[k] || 0) * scale;
  });
}

function photoFit(tone: AdaPostTone, photo: PhotoOption): number {
  const table = VIBES[tone].photoFit;
  const product = photo.tags.reduce((m, t) => m * (table[t] ?? 1), 1);
  return Math.min(1.5, Math.max(0.65, product));
}

function fitNote(mult: number): string {
  if (mult >= 1.2) return 'perfect match';
  if (mult >= 1.0) return 'works';
  return 'clashes with the vibe';
}

/** Expected result of a post (before the small random swing). */
export function estimatePost(input: PostInput): PostOutcome {
  const { tone, photo, caption, meters, progress, pastPosts, unfollowed } = input;
  const vibe = VIBES[tone];
  const mood = getAudienceMood(progress);
  const factors: PostFactor[] = [];

  // Network: following the circle widens reach (existing mechanic)
  const followedCount = NPCS.filter((id) => !unfollowed?.[id]).length;
  const network =
    (0.4 + (followedCount / NPCS.length) * 0.9) *
    (((!unfollowed?.zee ? 1.25 : 0.8) * (!unfollowed?.tamara ? 1.2 : 0.85) * (!unfollowed?.kelvin ? 1.15 : 0.9)) / (1.25 * 1.2 * 1.15));
  factors.push({ label: '👥 Circle', mult: network, note: `${followedCount}/${NPCS.length} followed` });

  const fit = photoFit(tone, photo);
  factors.push({ label: '📸 Photo', mult: fit, note: fitNote(fit) });

  factors.push({ label: '✍️ Caption', mult: caption.hook, note: caption.hook >= 1.3 ? 'strong hook' : caption.hook >= 1.1 ? 'good hook' : 'safe' });

  let moodMult = mood.mult[tone];
  if (tone === 'humble' && meters.reputation >= 60) moodMult *= 1.1;
  if (tone === 'mysterious' && meters.suspicion >= 50) moodMult *= 1.15;
  if (tone === 'shady' && meters.jealousy >= 40) moodMult *= 1.1;
  factors.push({ label: '🌡️ Mood', mult: moodMult, note: mood.label });

  // Freshness: same vibe back-to-back gets tired, so does spamming this episode
  const recent = pastPosts.slice(0, 2).map((p) => p.tone);
  const sameVibeStreak = recent[0] === tone ? (recent[1] === tone ? 2 : 1) : 0;
  const postsThisEpisode = pastPosts.filter((p) => p.episode === progress.episode).length;
  const repeatPhoto = pastPosts.some((p) => p.photoKind === photo.kind && p.episode === progress.episode);
  let fresh = sameVibeStreak === 2 ? 0.55 : sameVibeStreak === 1 ? 0.75 : 1;
  if (postsThisEpisode >= 3) fresh *= Math.pow(0.92, postsThisEpisode - 2);
  if (repeatPhoto) fresh *= 0.6;
  if (fresh < 0.999) {
    const why = [sameVibeStreak ? 'same vibe again' : '', postsThisEpisode >= 3 ? 'posting a lot' : '', repeatPhoto ? 'photo already posted' : '']
      .filter(Boolean)
      .join(', ');
    factors.push({ label: '🔁 Freshness', mult: fresh, note: why });
  }

  const quality = fit * caption.hook * moodMult * fresh;
  const underdog = 0.08 + Math.pow(Math.max(0, meters.popularity) / 100, 1.8) * 0.92;
  const followerGain = Math.max(10, Math.round(vibe.followerBase * underdog * network * quality));
  const likesBase = 15 + followerGain * 0.55 + Math.pow(Math.max(0, meters.popularity), 1.6) * 0.7;
  const likesCount = Math.max(8, Math.round(likesBase * network * Math.sqrt(quality)));

  // Consequences: vibe + story mood + what's in the photo + what the caption says
  const changes: Partial<Meters> = {};
  addMeters(changes, vibe.effect.meterChanges);
  addMeters(changes, mood.tweak[tone]);
  photo.tags.forEach((t) => addMeters(changes, TAG_EFFECTS[t]));
  addMeters(changes, photo.effect);
  addMeters(changes, caption.effect);
  if (fresh < 1 && changes.popularity && changes.popularity > 0) changes.popularity *= fresh;
  // Up to 10 posts an episode: keep each post's push on the story meters modest
  (Object.keys(changes) as Array<keyof Meters>).forEach((k) => {
    const v = Math.round((changes[k] as number) * POST_EFFECT_SCALE);
    changes[k] = Math.max(-MAX_METER_CHANGE_PER_POST, Math.min(MAX_METER_CHANGE_PER_POST, v));
    if (!changes[k]) delete changes[k];
  });

  return {
    followerGain,
    likesCount,
    followersRange: [Math.round(followerGain * VARIANCE[0]), Math.round(followerGain * VARIANCE[1])],
    likesRange: [Math.round(likesCount * VARIANCE[0]), Math.round(likesCount * VARIANCE[1])],
    meterChanges: changes,
    factors,
    mood,
  };
}

function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

/** The real result once posted: the estimate plus a small, repeatable swing. */
export function finalizePost(input: PostInput, postId: string): PostOutcome {
  const est = estimatePost(input);
  const swing = VARIANCE[0] + hash01(postId) * (VARIANCE[1] - VARIANCE[0]);
  return {
    ...est,
    followerGain: Math.max(10, Math.round(est.followerGain * swing)),
    likesCount: Math.max(8, Math.round(est.likesCount * swing)),
  };
}
