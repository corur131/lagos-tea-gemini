import { CharacterId, Meters } from '../types/vn';
import {
  SocialAuthorId,
  SocialAvatarType,
  SocialComment,
  SocialEffect,
  SocialNotification,
  SocialPost,
  SocialState,
  Unlockable,
  DmThread,
} from '../types/socialFeed';

export const DEFAULT_SOCIAL_STATE: SocialState = {
  likedPosts: {},
  savedPosts: {},
  likedComments: {},
  playerComments: {},
  unfollowed: {
    zee: true,
    kelvin: true,
    chi: true,
    dayo: true,
  },
  pollVotes: {},
  seenStories: {},
  adaStorySlides: [],
  adaPosts: [],
  dmReplies: {},
  seenDmBeats: {},
  seenNotifications: {},
  banneredNotifications: {},
  dynamicNotifications: [],
  screenshots: {},
  deletedPostStatus: {},
  deletedPostSeenAt: {},
  commentWarPicks: {},
  appliedEffects: {},
  followerBonus: 0,
  milestones: {},
};

// Older saves have no social state, or are missing newer keys
export function normalizeSocial(saved: Partial<SocialState> | undefined): SocialState {
  return { ...DEFAULT_SOCIAL_STATE, ...(saved || {}) };
}

/* ------------------------------- Cast info ------------------------------- */

export const CAST_PROFILES: Record<
  CharacterId | 'lagos_tea',
  { name: string; handle: string; avatarType: SocialAvatarType }
> = {
  heroine: { name: 'Ada Obi', handle: '@ada_obi', avatarType: 'heroine' },
  zee: { name: 'Zainab "Zee" Bello', handle: '@zeebello', avatarType: 'zee' },
  tamara: { name: 'Tamara Okonkwo-Reid', handle: '@tamara_reid', avatarType: 'tamara' },
  chi: { name: 'Chioma Eze', handle: '@chi_corporate_glam', avatarType: 'chi' },
  bisola: { name: 'Bisola Adeyemi', handle: '@bisola_vlogs', avatarType: 'bisola' },
  hauwa: { name: 'Hauwa Musa', handle: '@hauwa_mindbody', avatarType: 'hauwa' },
  chidi: { name: 'Chidi Nwosu', handle: '@chidi_captures', avatarType: 'chidi' },
  kelvin: { name: 'Kelvin Adebayo-Wright', handle: '@kelvin_wright', avatarType: 'kelvin' },
  dayo: { name: 'Dayo Martins', handle: '@dayomartins_sound', avatarType: 'dayo' },
  narrator: { name: '', handle: '', avatarType: 'fan' },
  lagos_tea: { name: 'The Lagos Tea 🫖', handle: '@TheLagosTea', avatarType: 'lagos_tea' },
};

const GIRLS: SocialAuthorId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];
const ROMANCE_METER: Partial<Record<SocialAuthorId, keyof Meters>> = {
  chidi: 'romanceChidi',
  kelvin: 'romanceKelvin',
  dayo: 'romanceDayo',
};

export function castComment(
  authorId: CharacterId | 'lagos_tea',
  text: string,
  id: string,
  likes = 1
): SocialComment {
  const p = CAST_PROFILES[authorId];
  return {
    id,
    authorId,
    authorName: p.name,
    authorHandle: p.handle,
    isVerified: authorId !== 'heroine',
    avatarType: p.avatarType,
    text,
    likes,
    timestamp: 'Just now',
  };
}

/* ------------------------------ Progression ------------------------------ */

export function hasReached(episode: number, sceneIndex: number, targetEpisode: number, targetScene = 0) {
  return episode > targetEpisode || (episode === targetEpisode && sceneIndex >= targetScene);
}

export function isUnlocked(
  item: Unlockable,
  episode: number,
  sceneIndex: number,
  flags: Record<string, boolean> = {}
) {
  if (!hasReached(episode, sceneIndex, item.unlockEpisode, item.unlockSceneIndex ?? 0)) return false;
  if (item.requiredFlag && !flags[item.requiredFlag]) return false;
  if (item.requiredAnyFlags && !item.requiredAnyFlags.some((f) => flags[f])) return false;
  if (item.hiddenIfFlag && flags[item.hiddenIfFlag]) return false;
  return true;
}

/* -------------------------------- Effects -------------------------------- */

export function applyMeterChanges(meters: Meters, changes?: Partial<Meters>): Meters {
  if (!changes) return meters;
  const next = { ...meters };
  (Object.keys(changes) as Array<keyof Meters>).forEach((key) => {
    next[key] = Math.min(100, Math.max(0, next[key] + (changes[key] || 0)));
  });
  return next;
}

const METER_LABELS: Record<keyof Meters, string> = {
  popularity: '🔥 Popularity',
  loyalty: '🤝 Loyalty',
  suspicion: '🕵️ Suspicion',
  jealousy: '😤 Jealousy',
  reputation: '👑 Reputation',
  romanceChidi: '📸 Chidi',
  romanceKelvin: '💘 Kelvin',
  romanceDayo: '🎧 Dayo',
};

// "💘 Kelvin +4 · 😤 Jealousy +2"
export function describeEffect(effect?: SocialEffect): string | null {
  if (!effect?.meterChanges) return null;
  const parts = (Object.entries(effect.meterChanges) as Array<[keyof Meters, number]>)
    .filter(([, v]) => v)
    .map(([k, v]) => `${METER_LABELS[k]} ${v > 0 ? '+' : ''}${v}`);
  return parts.length ? parts.join(' · ') : null;
}

export function getLikeEffect(post: SocialPost): SocialEffect | undefined {
  if (post.likeEffect) return post.likeEffect;
  if (post.isArchive || post.isAdaPost) return undefined;
  if (post.authorId === 'lagos_tea') return { meterChanges: { reputation: -3, suspicion: 2 } };
  const romance = ROMANCE_METER[post.authorId];
  if (romance) {
    return {
      meterChanges:
        post.authorId === 'kelvin' ? { [romance]: 3, jealousy: 2 } : { [romance]: 3 },
    };
  }
  if (post.authorId === 'zee') return { meterChanges: { loyalty: 2, popularity: 1 } };
  if (GIRLS.includes(post.authorId)) return { meterChanges: { loyalty: 2 } };
  return { meterChanges: { popularity: 1 } };
}

export function getStoryReactionEffect(authorId: SocialAuthorId): SocialEffect | undefined {
  if (authorId === 'lagos_tea') return { meterChanges: { reputation: -1, suspicion: 1 } };
  const romance = ROMANCE_METER[authorId];
  if (romance) return { meterChanges: { [romance]: 2 } };
  if (GIRLS.includes(authorId)) return { meterChanges: { loyalty: 1 } };
  return undefined;
}

export function getFollowToggleEffect(
  authorId: CharacterId | 'lagos_tea',
  nowFollowing: boolean
): SocialEffect {
  const romance = ROMANCE_METER[authorId];
  if (!nowFollowing) {
    // Unfollowing Lagos high society influencers lowers Ada's circle clout and Popularity
    if (authorId === 'zee') {
      return { meterChanges: { popularity: -5, loyalty: -5 }, flagToSet: 'unfollowed_zee' };
    }
    if (authorId === 'tamara') {
      return { meterChanges: { popularity: -4, loyalty: -5 }, flagToSet: 'unfollowed_tamara' };
    }
    if (authorId === 'kelvin') {
      return { meterChanges: { popularity: -4, romanceKelvin: -6 }, flagToSet: 'unfollowed_kelvin' };
    }
    if (authorId === 'chi') {
      return { meterChanges: { popularity: -3, loyalty: -3 }, flagToSet: 'unfollowed_chi' };
    }
    if (authorId === 'bisola') {
      return { meterChanges: { popularity: -3, loyalty: -2 }, flagToSet: 'unfollowed_bisola' };
    }
    if (authorId === 'hauwa') {
      return { meterChanges: { popularity: -2, loyalty: -2 }, flagToSet: 'unfollowed_hauwa' };
    }
    if (authorId === 'chidi') {
      return { meterChanges: { popularity: -2, romanceChidi: -6 }, flagToSet: 'unfollowed_chidi' };
    }
    if (authorId === 'dayo') {
      return { meterChanges: { popularity: -3, romanceDayo: -5 }, flagToSet: 'unfollowed_dayo' };
    }
    if (authorId === 'lagos_tea') {
      return { meterChanges: { popularity: -2, reputation: 3 }, flagToSet: 'unfollowed_lagos_tea' };
    }
    if (romance) return { meterChanges: { popularity: -3, [romance]: -6 }, flagToSet: `unfollowed_${authorId}` };
    return { meterChanges: { popularity: -3, loyalty: -4 }, flagToSet: `unfollowed_${authorId}` };
  }

  // Following high society icons connects Ada to their algorithm reach and boosts Popularity
  if (authorId === 'zee') {
    return { meterChanges: { popularity: 5, loyalty: 2 }, flagToSet: 'followed_zee' };
  }
  if (authorId === 'tamara') {
    return { meterChanges: { popularity: 4, loyalty: 3 }, flagToSet: 'followed_tamara' };
  }
  if (authorId === 'kelvin') {
    return { meterChanges: { popularity: 4, romanceKelvin: 4, jealousy: 2 }, flagToSet: 'followed_kelvin' };
  }
  if (authorId === 'chi') {
    return { meterChanges: { popularity: 3, loyalty: 2 }, flagToSet: 'followed_chi' };
  }
  if (authorId === 'bisola') {
    return { meterChanges: { popularity: 3, loyalty: 1 }, flagToSet: 'followed_bisola' };
  }
  if (authorId === 'hauwa') {
    return { meterChanges: { popularity: 2, loyalty: 2 }, flagToSet: 'followed_hauwa' };
  }
  if (authorId === 'chidi') {
    return { meterChanges: { popularity: 2, romanceChidi: 3 }, flagToSet: 'followed_chidi' };
  }
  if (authorId === 'dayo') {
    return { meterChanges: { popularity: 3, romanceDayo: 3 }, flagToSet: 'followed_dayo' };
  }
  if (authorId === 'lagos_tea') {
    return { meterChanges: { popularity: 3, reputation: -2, suspicion: 2 }, flagToSet: 'followed_lagos_tea' };
  }
  if (romance) return { meterChanges: { popularity: 3, [romance]: 2 }, flagToSet: `refollowed_${authorId}` };
  return { meterChanges: { popularity: 2, loyalty: 1 }, flagToSet: `refollowed_${authorId}` };
}

/* ----------------------------- Quick replies ----------------------------- */

export type ReplyTone = 'supportive' | 'shady' | 'flirty' | 'friendly' | 'clapback' | 'classy' | 'investigate';

export interface QuickReply {
  tone: ReplyTone;
  label: string;
  text: string;
  effect: SocialEffect;
}

const SUPPORTIVE_TEXT: Record<string, string> = {
  zee: 'Serving royalty as always 👑',
  tamara: 'My sister is THAT girl 💚',
  chi: 'Boss energy, I see you 💼',
  bisola: 'Content queen 😍🎥',
  hauwa: 'Your peace is contagious 🌿',
};
const SHADY_TEXT: Record<string, string> = {
  zee: 'Cute. Was it sponsored? 🙂',
  tamara: 'Lowkey giving "trying too hard" 😬',
  chi: 'Did your lawyer approve this caption? 😂',
  bisola: 'Ring light doing the heavy lifting 💀',
  hauwa: 'Namaste… far away from me 🧘‍♀️😂',
};
const FLIRTY_TEXT: Record<string, string> = {
  chidi: 'Nice shot, photographer 📸😏',
  kelvin: 'Show-off 😏🥃',
  dayo: 'This one goes hard 🎧😏',
};

export function getQuickReplies(post: SocialPost): QuickReply[] {
  if (post.isAdaPost) return [];
  const author = post.authorId;
  if (author === 'lagos_tea') {
    return [
      {
        tone: 'clapback',
        label: 'Clap back 💅',
        text: 'Keep my name out of your teacup 💅🫖',
        effect: { meterChanges: { popularity: 4, reputation: 1, suspicion: 2 } },
      },
      {
        tone: 'classy',
        label: 'Stay classy 🙏',
        text: 'Praying for whoever runs this page. Healing is free 🙏',
        effect: { meterChanges: { reputation: 4 } },
      },
      {
        tone: 'investigate',
        label: 'Dig 🕵️',
        text: 'Who sent you this photo? 👀 Asking for a friend.',
        effect: { meterChanges: { suspicion: 4 } },
      },
    ];
  }
  const romance = ROMANCE_METER[author];
  if (romance) {
    return [
      {
        tone: 'flirty',
        label: 'Flirt 😏',
        text: FLIRTY_TEXT[author],
        effect: { meterChanges: { [romance]: 4, jealousy: 1 } },
      },
      {
        tone: 'friendly',
        label: 'Friendly 🔥',
        text: 'Looking good! 🔥',
        effect: { meterChanges: { [romance]: 1, popularity: 1 } },
      },
    ];
  }
  if (GIRLS.includes(author)) {
    return [
      {
        tone: 'supportive',
        label: 'Hype her 💖',
        text: SUPPORTIVE_TEXT[author],
        effect: { meterChanges: { loyalty: 3, popularity: 1 } },
      },
      {
        tone: 'shady',
        label: 'Throw shade 👀',
        text: SHADY_TEXT[author],
        effect: { meterChanges: { popularity: 3, jealousy: 3, loyalty: -4 } },
      },
    ];
  }
  return [
    {
      tone: 'classy',
      label: 'Stay classy 🙏',
      text: 'Wishing everyone peace today 🙏',
      effect: { meterChanges: { reputation: 2 } },
    },
  ];
}

export const FREE_TEXT_COMMENT_EFFECT: SocialEffect = { meterChanges: { popularity: 1 } };

const SHADY_COMEBACK: Record<string, string> = {
  zee: '🙂',
  tamara: 'Wow. Ok. 😐',
  chi: 'Noted.',
  bisola: 'WHY ARE YOU LIKE THIS 😭',
  hauwa: 'Breathe, Ada 🌿',
};
const FLIRTY_COMEBACK: Record<string, string> = {
  chidi: 'Took you long enough to notice 😅📸',
  kelvin: 'Says the one stealing the spotlight 😏',
  dayo: 'Wait till you hear the next one 🎧',
};

// How the post's author responds to Ada's quick reply: an optional reply comment plus a notification
export function getAuthorReaction(
  post: SocialPost,
  tone: ReplyTone
): { reply?: string; notification: string } | null {
  const author = post.authorId;
  if (author === 'lagos_tea') {
    if (tone === 'clapback') return { reply: 'Aww, she speaks 🫖💋', notification: 'replied to your comment' };
    if (tone === 'investigate') {
      return { reply: 'A little birdie with a very good camera 🐦📸', notification: 'replied to your comment' };
    }
    return { notification: 'liked your comment 🫖' };
  }
  if (tone === 'shady' && SHADY_COMEBACK[author]) {
    return { reply: SHADY_COMEBACK[author], notification: 'replied to your comment' };
  }
  if (tone === 'flirty' && FLIRTY_COMEBACK[author]) {
    return { reply: FLIRTY_COMEBACK[author], notification: 'replied to your comment' };
  }
  if (author in CAST_PROFILES) return { notification: 'liked your comment ❤️' };
  return null;
}

/* -------------------------------- Followers ------------------------------- */

export const FOLLOWER_MILESTONES = [1000, 5000, 10000, 50000];
export const VERIFIED_FOLLOWERS = 50000;

// Grinding from the bottom: Ada starts with only ~280-360 followers
// and grinds her way to 1,000, 5,000, 10,000, and 50,000+!
export function calculateAdaFollowers(
  popularity: number,
  reputation: number,
  followedNpcCount: number,
  bonus = 0
): number {
  const base = 180;
  // Non-linear growth: slow grind at start, viral inflection as popularity rises above 40%
  const popGrowth = Math.pow(Math.max(0, popularity) / 10, 2.25) * 14;
  const repBonus = (reputation || 0) * 3;
  const circleBonus = (followedNpcCount || 0) * 16;
  return Math.max(100, Math.round(base + popGrowth + repBonus + circleBonus + bonus));
}

export function computeFollowers(
  meters: Meters,
  episode: number,
  sceneIndex: number,
  social: SocialState,
  followedCount = 9
) {
  const baseFollowers = calculateAdaFollowers(
    meters.popularity,
    meters.reputation,
    followedCount,
    social.followerBonus
  );
  // The midnight leak brings a sudden surge of curious onlookers
  const infamy = (episode > 1 || sceneIndex >= 6) ? 220 : 0;
  return baseFollowers + infamy;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toString();
}

/* ------------------------------ Post display ------------------------------ */

// Applies choice-based variants and narrative memory to a post
export function resolvePost(post: SocialPost, flags: Record<string, boolean>, social: SocialState): SocialPost {
  const variant = post.variants?.find((v) => flags[v.flag]);
  const liked = !!social.likedPosts[post.id];
  const playerComments = social.playerComments[post.id] || [];

  // Narrative memory comments on NPC posts reflecting the player's choices
  const narrativeComments: SocialComment[] = [];

  // 1. Bisola's posts: comments regarding outfit, party entrance, or Porsche ride
  if (post.authorId === 'bisola') {
    if (flags.borrowed_emerald_dress && !social.unfollowed?.tamara && !post.comments.some((c) => c.text.includes('emerald silk'))) {
      narrativeComments.push({
        id: `mem_bis_${post.id}_emerald`,
        authorId: 'tamara',
        authorName: 'Tamara Reid',
        authorHandle: '@tamara_reid',
        isVerified: true,
        avatarType: 'tamara',
        text: 'Tamara here! My girl @ada_obi owned that emerald silk entrance at the party 💚',
        likes: 184,
        timestamp: '1h ago',
        memoryBadge: 'Recalls: Emerald Dress',
      });
    } else if (flags.vintage_style_dress && !social.unfollowed?.bisola && !post.comments.some((c) => c.text.includes('thrifted'))) {
      narrativeComments.push({
        id: `mem_bis_${post.id}_thrift`,
        authorId: 'bisola',
        authorName: 'Bisola Adeyemi',
        authorHandle: '@bisola_vlogs',
        isVerified: true,
        avatarType: 'bisola',
        text: 'Still shouting out Ada for showing up in vintage thrift! Kept it 100% real 🔥',
        likes: 210,
        timestamp: '45m ago',
        memoryBadge: 'Recalls: Thrift Look',
      });
    }

    if (flags.drove_with_kelvin && !social.unfollowed?.bisola && !post.comments.some((c) => c.text.includes('GT3'))) {
      narrativeComments.push({
        id: `mem_bis_${post.id}_kelvin_car`,
        authorId: 'bisola',
        authorName: 'Bisola Adeyemi',
        authorHandle: '@bisola_vlogs',
        isVerified: true,
        avatarType: 'bisola',
        text: 'Wait did anyone else catch Kelvin picking up Ada outside the faculty in his Porsche? 👀🍿',
        likes: 340,
        timestamp: '20m ago',
        memoryBadge: 'Recalls: Porsche Ride',
      });
    }
  }

  // 2. Chidi's posts: reflections on candid balcony moments & investigative alliance
  if (post.authorId === 'chidi') {
    if (flags.chidi_romantic_moment && !social.unfollowed?.chidi && !post.comments.some((c) => c.text.includes('balcony'))) {
      narrativeComments.push({
        id: `mem_chidi_${post.id}_moment`,
        authorId: 'chidi',
        authorName: 'Chidi Nwosu',
        authorHandle: '@chidi_captures',
        isVerified: true,
        avatarType: 'chidi',
        text: 'Grateful for real conversations by the balcony railing late at night. Rare energy in this city ✨',
        likes: 290,
        timestamp: '30m ago',
        memoryBadge: 'Recalls: Balcony Confession',
      });
    } else if (flags.sided_with_chidi && !social.unfollowed?.chidi && !post.comments.some((c) => c.text.includes('alliance'))) {
      narrativeComments.push({
        id: `mem_chidi_${post.id}_alliance`,
        authorId: 'chidi',
        authorName: 'Chidi Nwosu',
        authorHandle: '@chidi_captures',
        isVerified: true,
        avatarType: 'chidi',
        text: 'Trusting photographer instinct over Island money. We uncover the truth together 🔍📸',
        likes: 310,
        timestamp: '15m ago',
        memoryBadge: 'Recalls: Trusted Chidi',
      });
    }
  }

  // 3. Zee's posts: comments regarding assistant role, pact, or party impression
  if (post.authorId === 'zee') {
    if (flags.accepted_pa_job && !social.unfollowed?.zee && !post.comments.some((c) => c.text.includes('assistant'))) {
      narrativeComments.push({
        id: `mem_zee_${post.id}_pa`,
        authorId: 'zee',
        authorName: 'Zainab Bello',
        authorHandle: '@zeebello',
        isVerified: true,
        avatarType: 'zee',
        text: 'Welcoming @ada_obi to the brand communications desk. Let us see if Ajegunle grit matches Island excellence 💅',
        likes: 620,
        timestamp: '15m ago',
        memoryBadge: 'Recalls: Assistant Role',
      });
    } else if (flags.pact_with_zee && !social.unfollowed?.zee && !post.comments.some((c) => c.text.includes('loyalty'))) {
      narrativeComments.push({
        id: `mem_zee_${post.id}_pact`,
        authorId: 'zee',
        authorName: 'Zainab Bello',
        authorHandle: '@zeebello',
        isVerified: true,
        avatarType: 'zee',
        text: 'Loyalty in this circle pays dividends. Some know how to keep their word 👑',
        likes: 540,
        timestamp: '25m ago',
        memoryBadge: 'Recalls: Private Pact',
      });
    }
  }

  // 4. Kelvin's posts: remarks on the Porsche GT3 ride or refused ride
  if (post.authorId === 'kelvin') {
    if (flags.drove_with_kelvin && !social.unfollowed?.kelvin && !post.comments.some((c) => c.text.includes('coastal'))) {
      narrativeComments.push({
        id: `mem_kelvin_${post.id}_ride`,
        authorId: 'kelvin',
        authorName: 'Kelvin Adebayo-Wright',
        authorHandle: '@kelvin_wright',
        isVerified: true,
        avatarType: 'kelvin',
        text: 'That run down the coastal expressway was unmatched. Better conversation than the entire gala 🥃',
        likes: 420,
        timestamp: '18m ago',
        memoryBadge: 'Recalls: Porsche Ride',
      });
    } else if (flags.refused_kelvin_ride && !social.unfollowed?.kelvin && !post.comments.some((c) => c.text.includes('shuttle'))) {
      narrativeComments.push({
        id: `mem_kelvin_${post.id}_bus`,
        authorId: 'kelvin',
        authorName: 'Kelvin Adebayo-Wright',
        authorHandle: '@kelvin_wright',
        isVerified: true,
        avatarType: 'kelvin',
        text: 'First person to turn down the passenger seat of my GT3 for a campus shuttle. Still bruised my ego, Ada 😏',
        likes: 380,
        timestamp: '22m ago',
        memoryBadge: 'Recalls: Rejected Ride',
      });
    }
  }

  // 5. Tamara's posts: reminiscing about getting ready or the scholarship struggle
  if (post.authorId === 'tamara') {
    if (flags.borrowed_emerald_dress && !social.unfollowed?.tamara && !post.comments.some((c) => c.text.includes('fitting'))) {
      narrativeComments.push({
        id: `mem_tamara_${post.id}_fit`,
        authorId: 'tamara',
        authorName: 'Tamara Reid',
        authorHandle: '@tamara_reid',
        isVerified: true,
        avatarType: 'tamara',
        text: 'Throwback to our fitting session! Seeing @ada_obi shut down Banana Island was unforgettable 💚',
        likes: 310,
        timestamp: '40m ago',
        memoryBadge: 'Recalls: Emerald Dress',
      });
    }
  }

  // 6. Lagos Tea leak posts: reacting to public confrontations or archive snooping
  if (post.authorId === 'lagos_tea') {
    if (flags.demanded_leak_answers && !post.comments.some((c) => c.text.includes('kettle'))) {
      narrativeComments.push({
        id: `mem_tea_${post.id}_demand`,
        authorId: 'lagos_tea',
        authorName: 'The Lagos Tea 🫖',
        authorHandle: '@TheLagosTea',
        isVerified: true,
        avatarType: 'lagos_tea',
        text: 'Making public demands at the party won’t silence the receipts, darling Ada 🫖👀',
        likes: 890,
        timestamp: '10m ago',
        memoryBadge: 'Recalls: Public Demand',
      });
    }
  }

  return {
    ...post,
    caption: variant?.caption ?? post.caption,
    graphic: {
      ...post.graphic,
      headline: variant?.headline ?? post.graphic.headline,
      subheadline: variant?.subheadline ?? post.graphic.subheadline,
      leakFooterRight: variant?.leakFooterRight ?? post.graphic.leakFooterRight,
    },
    isLikedByPlayer: liked,
    isSavedByPlayer: !!social.savedPosts[post.id],
    likesCount: post.likesCount + (liked ? 1 : 0),
    commentsCount: post.commentsCount + playerComments.length + narrativeComments.length,
    comments: [...narrativeComments, ...playerComments, ...post.comments],
  };
}

/* ------------------------------ Notifications ----------------------------- */

export interface StaticNotification extends Unlockable {
  id: string;
  kind: SocialNotification['kind'];
  actor: CharacterId | 'lagos_tea';
  text: string;
  target?: SocialNotification['target'];
}

export function buildNotifications(
  posts: SocialPost[],
  threads: DmThread[],
  staticNotifications: StaticNotification[],
  episode: number,
  sceneIndex: number,
  flags: Record<string, boolean>,
  social: SocialState
): SocialNotification[] {
  const list: SocialNotification[] = [];

  posts.forEach((post) => {
    if (!isUnlocked(post, episode, sceneIndex, flags)) return;
    if (!post.notifyText && !post.isTeaLeak) return;
    list.push({
      id: `post:${post.id}`,
      kind: post.isTeaLeak ? 'leak' : 'tag',
      avatarType: post.avatarType,
      text: `${post.authorHandle} ${post.notifyText || 'dropped a new leak 🫖'}`,
      episode: post.unlockEpisode,
      sceneIndex: post.unlockSceneIndex ?? 0,
      target: { type: 'post', id: post.id },
    });
  });

  threads.forEach((thread) => {
    thread.beats.forEach((beat) => {
      if (!isUnlocked(beat, episode, sceneIndex, flags)) return;
      const firstIncoming = beat.messages.find((m) => m.from !== 'ada' && m.from !== 'system');
      if (!firstIncoming) return;
      const sender =
        thread.isGroup && firstIncoming.from in CAST_PROFILES
          ? `${CAST_PROFILES[firstIncoming.from as CharacterId].name.split(' ')[0]} in ${thread.title}`
          : thread.title;
      list.push({
        id: `dm:${beat.id}`,
        kind: 'dm',
        avatarType: thread.avatarType || 'fan',
        avatarEmoji: thread.avatarEmoji,
        text: `💬 ${sender}: ${firstIncoming.text}`,
        episode: beat.unlockEpisode,
        sceneIndex: beat.unlockSceneIndex ?? 0,
        target: { type: 'dm', id: thread.id },
      });
    });
  });

  staticNotifications.forEach((n) => {
    if (!isUnlocked(n, episode, sceneIndex, flags)) return;
    list.push({
      id: `static:${n.id}`,
      kind: n.kind,
      avatarType: CAST_PROFILES[n.actor].avatarType,
      text: `${CAST_PROFILES[n.actor].handle} ${n.text}`,
      episode: n.unlockEpisode,
      sceneIndex: n.unlockSceneIndex ?? 0,
      target: n.target,
    });
  });

  list.push(...social.dynamicNotifications);

  return list.sort(
    (a, b) => b.episode - a.episode || b.sceneIndex - a.sceneIndex || (b.order ?? 0) - (a.order ?? 0)
  );
}
