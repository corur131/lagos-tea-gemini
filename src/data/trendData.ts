import { CharacterId } from '../types/vn';

export type TrendCategory =
  | 'High Society'
  | 'Scandal'
  | 'Entertainment'
  | 'Fashion'
  | 'Culture'
  | 'Lifestyle';

export type TrendIntensity = 'viral' | 'spicy' | 'rising' | 'peaked';

export interface GidiGramTrend {
  id: string;
  hashtag: string;
  headline: string;
  category: TrendCategory;
  activityCount: string; // e.g., '142K Posts', '85.4K Talking'
  shortDescription: string;
  intensity?: TrendIntensity;
  relatedCharacters?: Array<CharacterId | 'lagos_tea'>;
  unlockEpisode: number;
  unlockSceneIndex?: number;
  requiredFlag?: string;
  requiredAnyFlags?: string[];
  hiddenIfFlag?: string;
  unlockedByFlag?: string;
  relatedPostIds?: string[];
}

export const GIDIGRAM_TRENDS: GidiGramTrend[] = [
  // Episode 1 Trends
  {
    id: 'trend_zee_21',
    hashtag: '#Zee21',
    headline: 'Zainab Bello Celebrates 21st in Banana Island Extravaganza',
    category: 'High Society',
    activityCount: '240K Posts',
    shortDescription: 'Lagos elite and top creators converge on the Bello waterfront estate for the undisputed party of the year.',
    intensity: 'viral',
    relatedCharacters: ['zee', 'tamara', 'kelvin'],
    unlockEpisode: 1,
    unlockSceneIndex: 0,
    relatedPostIds: ['post_zee_birthday', 'post_tamara_glam'],
  },
  {
    id: 'trend_banana_island_luxe',
    hashtag: '#BananaIslandLuxe',
    headline: 'Waterfront Villas and Private Docks Fill Feeds',
    category: 'Lifestyle',
    activityCount: '185K Posts',
    shortDescription: 'GidiGram feeds overflow with luxury sports cars, yacht arrivals, and private dock parties.',
    intensity: 'rising',
    relatedCharacters: ['zee', 'kelvin'],
    unlockEpisode: 1,
    unlockSceneIndex: 0,
    relatedPostIds: ['post_zee_birthday', 'post_kelvin_luxe'],
  },
  {
    id: 'trend_emerald_season',
    hashtag: '#EmeraldSeason',
    headline: 'Tamara Okonkwo-Reid Debuts Haute Couture Emeralds',
    category: 'Fashion',
    activityCount: '92K Posts',
    shortDescription: 'Paris fashion week pieces and emerald silk gowns become the hottest aesthetic across Victoria Island.',
    intensity: 'rising',
    relatedCharacters: ['tamara'],
    unlockEpisode: 1,
    unlockSceneIndex: 2,
    relatedPostIds: ['post_tamara_glam', 'post_tamara_tags_ada'],
  },
  {
    id: 'trend_tea_leak_cinderella',
    hashtag: '#AjegunleCinderella',
    headline: 'Anonymous Leak Targets Unnamed Party Guest',
    category: 'Scandal',
    activityCount: '310K Posts',
    shortDescription: '@TheLagosTea publishes receipts alleging an imposter with overdue tuition attended the Bello gala.',
    intensity: 'spicy',
    relatedCharacters: ['lagos_tea', 'heroine', 'zee'],
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    unlockedByFlag: 'reveal_ep1_leak',
    relatedPostIds: ['post_lagos_tea_leak_ep1'],
  },
  {
    id: 'trend_the_lagos_tea',
    hashtag: '#TheLagosTea',
    headline: 'Anonymous Gossip Account Drops Devastating Dossier',
    category: 'Scandal',
    activityCount: '520K Posts',
    shortDescription: 'Whistleblowers and anonymous receipts dominate GidiGram notifications as high society panics.',
    intensity: 'viral',
    relatedCharacters: ['lagos_tea'],
    unlockEpisode: 1,
    unlockSceneIndex: 6,
    unlockedByFlag: 'reveal_ep1_leak',
    relatedPostIds: ['post_lagos_tea_leak_ep1', 'post_tea_ep2_metadata'],
  },

  // Episode 2 Trends
  {
    id: 'trend_lagos_tea_receipts',
    hashtag: '#LagosTeaReceipts',
    headline: 'Island Circle Scrambles Over Metadata Verification',
    category: 'Scandal',
    activityCount: '280K Posts',
    shortDescription: 'Influencers hire private security and PR crisis managers following explosive verified leaks.',
    intensity: 'spicy',
    relatedCharacters: ['lagos_tea', 'chi', 'zee'],
    unlockEpisode: 2,
    unlockSceneIndex: 2,
    relatedPostIds: ['post_zee_statement_ep2', 'post_tea_ep2_metadata'],
  },
  {
    id: 'trend_burner_phone',
    hashtag: '#BurnerPhone',
    headline: 'Speculation Mounts Over Insider Source Devices',
    category: 'Scandal',
    activityCount: '195K Posts',
    shortDescription: 'Rumours of disposable burners and compromised private networks ignite paranoia across Lekki Phase 1.',
    intensity: 'rising',
    relatedCharacters: ['lagos_tea'],
    unlockEpisode: 2,
    unlockSceneIndex: 2,
    relatedPostIds: ['post_tea_ep2_metadata'],
  },
  {
    id: 'trend_snakes_in_lekki',
    hashtag: '#SnakesInLekki',
    headline: 'Behind-the-Scenes Feuds Boil Over Among Top Creators',
    category: 'Entertainment',
    activityCount: '115K Posts',
    shortDescription: 'Cryptic stories and deleted BTS clips hint at toxic rivalries inside the influencer inner circle.',
    intensity: 'spicy',
    relatedCharacters: ['bisola', 'chi'],
    unlockEpisode: 2,
    unlockSceneIndex: 4,
    relatedPostIds: ['post_bisola_deleted', 'post_chi_subtweet'],
  },
  {
    id: 'trend_double_life',
    hashtag: '#DoubleLife',
    headline: 'Debate Over Authenticity vs Staged Clout in Lagos',
    category: 'Culture',
    activityCount: '160K Posts',
    shortDescription: 'GidiGram commentators dissect the fine line between curated brand glamour and real-life struggles.',
    intensity: 'rising',
    relatedCharacters: ['chidi', 'heroine'],
    unlockEpisode: 2,
    unlockSceneIndex: 5,
    relatedPostIds: ['post_chidi_film', 'post_chidi_truth'],
  },

  // Episode 3 Trends
  {
    id: 'trend_content_house',
    hashtag: '#ContentHouse',
    headline: 'Zainab Bello Unveils Exclusive Creator Mansion',
    category: 'Entertainment',
    activityCount: '410K Posts',
    shortDescription: 'Top creators move into the Banana Island villa as Zee launches her flagship content incubator.',
    intensity: 'viral',
    relatedCharacters: ['zee', 'tamara', 'bisola', 'hauwa'],
    unlockEpisode: 3,
    unlockSceneIndex: 0,
    relatedPostIds: ['post_zee_content_house', 'post_tamara_tags_ada'],
  },
  {
    id: 'trend_kelvin_cinderella',
    hashtag: '#KelvinAndCinderella',
    headline: 'Paparazzi Spot Kelvin Adebayo-Wright With New Muse',
    category: 'High Society',
    activityCount: '275K Posts',
    shortDescription: 'Lekki nightlife tabloids light up after Kelvin is photographed arriving with an intriguing newcomer.',
    intensity: 'spicy',
    relatedCharacters: ['kelvin', 'heroine'],
    unlockEpisode: 3,
    unlockSceneIndex: 3,
    relatedPostIds: ['post_paparazzi_porsche', 'post_kelvin_wing'],
  },
  {
    id: 'trend_imposter_alert',
    hashtag: '#ImposterAlert',
    headline: 'Tensions Flare as Inside Leaker Evidence Deepens',
    category: 'Scandal',
    activityCount: '340K Posts',
    shortDescription: 'The Content House faces lockdown paranoia as anonymous leaks prove the leaker has house access.',
    intensity: 'spicy',
    relatedCharacters: ['lagos_tea', 'zee'],
    unlockEpisode: 3,
    unlockSceneIndex: 5,
    relatedPostIds: ['post_tea_deleted_ep3', 'post_chidi_truth'],
  },
];
