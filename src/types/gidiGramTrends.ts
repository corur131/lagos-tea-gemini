export type GidiGramTrendCategory =
  | 'trending'
  | 'lagos'
  | 'celebrity'
  | 'influencer'
  | 'campus'
  | 'relationship'
  | 'entertainment'
  | 'drama';

export type TrendIntensity = 'rising' | 'hot' | 'viral';

export interface GidiGramTrend {
  id: string;
  hashtag: string;
  headline: string;
  category: GidiGramTrendCategory;
  activityCount: number;
  description: string;
  intensity: TrendIntensity;
  unlockEpisode: number;
  unlockSceneIndex?: number;
  relatedCharacters?: string[];
  relatedHashtags: string[];
}
