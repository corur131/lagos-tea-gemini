import { GidiGramTrend } from '../types/gidiGramTrends';

export const GIDIGRAM_TRENDS: GidiGramTrend[] = [
  {
    id: 'the-lagos-tea',
    hashtag: '#TheLagosTea',
    headline: 'The anonymous tea page has everyone refreshing their feeds.',
    category: 'trending',
    activityCount: 2400000,
    description:
      'Anonymous gossip account @TheLagosTea has become one of the biggest conversations in Lagos after its latest viral leaks.',
    intensity: 'viral',
    unlockEpisode: 1,
    relatedHashtags: ['#TheLagosTea', '#LagosTeaReceipts'],
  },
  {
    id: 'ajegunle-cinderella',
    hashtag: '#AjegunleCinderella',
    headline: 'From Ajegunle to Banana Island in one night.',
    category: 'drama',
    activityCount: 1850000,
    description:
      'The mysterious new girl at Zee Bello’s birthday has become a talking point after a very public clash between two very different worlds.',
    intensity: 'viral',
    unlockEpisode: 1,
    relatedHashtags: ['#AjegunleCinderella', '#ImposterAlert'],
  },
  {
    id: 'zee-at-21',
    hashtag: '#ZeeAt21',
    headline: 'Zee Bello’s birthday still owns the Lagos timeline.',
    category: 'celebrity',
    activityCount: 1320000,
    description:
      'Zee Bello’s lavish 21st birthday has spilled far beyond Banana Island, with guests, outfits and party footage driving the conversation.',
    intensity: 'hot',
    unlockEpisode: 1,
    relatedCharacters: ['zee'],
    relatedHashtags: ['#ZeeAt21', '#Zee21', '#BananaIslandNights'],
  },
  {
    id: 'banana-island',
    hashtag: '#BananaIsland',
    headline: 'The island is where the gist keeps happening.',
    category: 'lagos',
    activityCount: 980000,
    description:
      'Banana Island remains the backdrop for Lagos high-society sightings, party clips and the latest influencer conversations.',
    intensity: 'hot',
    unlockEpisode: 1,
    relatedHashtags: ['#BananaIsland', '#BananaIslandLuxe', '#BananaIslandScandal'],
  },
  {
    id: 'lagos-high-society',
    hashtag: '#LagosHighSociety',
    headline: 'Everyone wants a seat at the table.',
    category: 'influencer',
    activityCount: 760000,
    description:
      'Influencers, heirs and creators are turning private Lagos moments into public currency, and GidiGram is watching every move.',
    intensity: 'rising',
    unlockEpisode: 1,
    relatedHashtags: ['#LagosHighSociety', '#LagosRoyalty', '#StreetToIsland'],
  },
  {
    id: 'content-house',
    hashtag: '#ContentHouse',
    headline: 'Ring lights, creators and secrets under one roof.',
    category: 'influencer',
    activityCount: 910000,
    description:
      'The Banana Island Content House has become the newest hotspot for creator culture, with behind-the-scenes attention growing by the hour.',
    intensity: 'hot',
    unlockEpisode: 3,
    relatedHashtags: ['#ContentHouse', '#BelloCreatorHouse', '#NewEra'],
  },
  {
    id: 'burner-phone',
    hashtag: '#BurnerPhone',
    headline: 'One anonymous account. One phone nobody can explain.',
    category: 'drama',
    activityCount: 640000,
    description:
      'A mysterious phone connected to the ongoing Lagos Tea story has sent the conversation into full detective mode.',
    intensity: 'rising',
    unlockEpisode: 3,
    relatedHashtags: ['#BurnerPhone', '#DoubleLife', '#WhosNext'],
  },
  {
    id: 'kelvin-and-cinderella',
    hashtag: '#KelvinAndCinderella',
    headline: 'The internet has noticed the chemistry.',
    category: 'relationship',
    activityCount: 520000,
    description:
      'A few very public moments between Kelvin and Ada have fans debating whether there is more going on behind the scenes.',
    intensity: 'rising',
    unlockEpisode: 1,
    relatedCharacters: ['kelvin'],
    relatedHashtags: ['#KelvinAndCinderella'],
  },
];

export function getVisibleGidiGramTrends(
  currentEpisode: number,
  currentSceneIndex: number
): GidiGramTrend[] {
  return GIDIGRAM_TRENDS
    .filter((trend) => {
      if (trend.unlockEpisode < currentEpisode) return true;
      if (trend.unlockEpisode > currentEpisode) return false;
      return trend.unlockSceneIndex === undefined || currentSceneIndex >= trend.unlockSceneIndex;
    })
    .sort((a, b) => b.activityCount - a.activityCount);
}
