import { Unlockable } from '../types/socialFeed';
import { isUnlocked } from './socialRules';

/* =========================================================================
   VIRAL MOMENTS
   Story events that blow Ada up online. Each one adds thousands of
   followers the moment it happens (only on the path where it happens).
   ========================================================================= */

export interface ViralMoment extends Unlockable {
  id: string;
  /** Short banner title */
  title: string;
  /** What blew up, in one line */
  headline: string;
  followers: number;
  emoji: string;
}

export const VIRAL_MOMENTS: ViralMoment[] = [
  /* ---------------- Episode 1: the leak ---------------- */
  {
    id: 'viral_leak',
    title: 'You’re going viral',
    headline: '@TheLagosTea’s post about you hit 2.1M views. Everyone is searching “Ajegunle Cinderella”.',
    followers: 3800,
    emoji: '🫖',
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    unlockedByFlag: 'reveal_ep1_leak',
  },
  {
    id: 'viral_confront',
    title: 'The clip is everywhere',
    headline: 'Someone filmed you calling out the whole room. “Say it to my face” is now a sound.',
    followers: 2600,
    emoji: '🎬',
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    requiredFlag: 'demanded_leak_answers',
  },
  {
    id: 'viral_kelvin_shield',
    title: 'Lagos is shipping it',
    headline: 'Photos of Kelvin Adebayo-Wright shielding the “mystery girl” from cameras are all over the island.',
    followers: 3100,
    emoji: '🛡️',
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    requiredFlag: 'kelvin_shield_exit',
  },
  {
    id: 'viral_detective',
    title: 'Detective Ada trends',
    headline: 'A blurry photo of you and the party photographer huddled over his camera starts a theory thread.',
    followers: 1400,
    emoji: '🔍',
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    requiredFlag: 'chidi_archive_alliance',
  },

  /* ---------------- Episode 2 ---------------- */
  {
    id: 'viral_unbothered',
    title: 'Unbothered queen',
    headline: 'A video of you walking into class with your head up gets stitched 40,000 times.',
    followers: 1800,
    emoji: '👑',
    unlockEpisode: 2,
    unlockSceneIndex: 0,
    requiredFlag: 'unbothered_walk',
  },
  {
    id: 'viral_porsche_no',
    title: 'Ada said NO 😭',
    headline: '“Ada said NO to a Porsche” is the most-shared video on campus.',
    followers: 3200,
    emoji: '🚌',
    unlockEpisode: 2,
    unlockSceneIndex: 3,
    requiredFlag: 'refused_kelvin_ride',
  },
  {
    id: 'viral_porsche_yes',
    title: 'Paparazzi got you',
    headline: 'Paparazzi shots of you stepping out of Kelvin’s Porsche at the Palms are on every gossip page.',
    followers: 2500,
    emoji: '📸',
    unlockEpisode: 2,
    unlockSceneIndex: 3,
    requiredFlag: 'drove_with_kelvin',
  },

  /* ---------------- Episode 3 ---------------- */
  {
    id: 'viral_content_house',
    title: 'Zee tagged you',
    headline: 'Zee introduced you to her 4M followers in the Content House reveal.',
    followers: 5000,
    emoji: '🏡',
    unlockEpisode: 3,
    unlockSceneIndex: 0,
    requiredFlag: 'accepted_pa_job',
  },
  {
    id: 'viral_content_house_terms',
    title: 'Zee tagged you',
    headline: 'Zee introduced you to her 4M followers, and the caption mentions you negotiated your own terms.',
    followers: 4200,
    emoji: '🏡',
    unlockEpisode: 3,
    unlockSceneIndex: 0,
    requiredFlag: 'negotiated_pa_terms',
  },
];

export interface ViralProgress {
  episode: number;
  /** Social progress (current scene + 1 once its choice is made) */
  sceneIndex: number;
  flags: Record<string, boolean>;
}

export function getViralMoments(p: ViralProgress): ViralMoment[] {
  return VIRAL_MOMENTS.filter((m) => isUnlocked(m, p.episode, p.sceneIndex, p.flags));
}

export function viralFollowerTotal(p: ViralProgress): number {
  return getViralMoments(p).reduce((sum, m) => sum + m.followers, 0);
}
