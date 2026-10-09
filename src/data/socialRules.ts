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
import { createLightweightComment } from './gidiUsers';

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
  if (item.hiddenIfAnyFlags && item.hiddenIfAnyFlags.some((f) => flags[f])) return false;
  return true;
}

// What the story has "shown so far": a scene's posts, DMs and follower jumps only appear
// once that scene has been played, so the feed never spoils what is about to happen.
export function getRevealedProgress(episode: number, sceneIndex: number) {
  if (sceneIndex > 0) return { episode, sceneIndex: sceneIndex - 1 };
  if (episode > 1) return { episode: episode - 1, sceneIndex: 6 };
  return { episode, sceneIndex: 0 };
}

export function getThreadTitle(
  thread: DmThread,
  episode: number,
  sceneIndex: number,
  flags: Record<string, boolean> = {}
): string {
  let title = thread.title;
  thread.renames?.forEach((r) => {
    const beat = thread.beats.find((b) => b.id === r.afterBeatId);
    if (beat && isUnlocked(beat, episode, sceneIndex, flags)) title = r.title;
  });
  return title;
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

// Viral moments in the story that send thousands of strangers to Ada's page
export function computeViralBonus(
  episode: number,
  sceneIndex: number,
  flags: Record<string, boolean> = {}
): number {
  const reached = (ep: number, sc: number) => hasReached(episode, sceneIndex, ep, sc);
  let bonus = 0;
  // The @TheLagosTea leak: "Ajegunle Cinderella" reaches half a million people
  if (reached(1, 6)) bonus += 4200;
  if (reached(1, 6) && flags.demanded_leak_answers) bonus += 2600; // the confrontation clip spreads
  if (reached(1, 6) && flags.kelvin_shield_exit) bonus += 1900; // Kelvin shielding her exit
  if (reached(1, 6) && flags.chidi_archive_alliance) bonus += 900;
  if (reached(2, 0) && flags.unbothered_walk) bonus += 2400; // the unbothered campus walk
  if (reached(2, 4) && flags.drove_with_kelvin) bonus += 3100; // Porsche photo
  if (reached(2, 4) && flags.refused_kelvin_ride) bonus += 1700; // turned down the Porsche
  if (reached(2, 6) && (flags.accepted_pa_job || flags.negotiated_pa_terms)) bonus += 3800; // joins the Content House
  if (reached(3, 5) && (flags.confronted_intruder || flags.held_breath_stealth)) bonus += 2200;
  return bonus;
}

export function computeFollowers(
  meters: Meters,
  episode: number,
  sceneIndex: number,
  social: SocialState,
  followedCount = 9,
  flags: Record<string, boolean> = {}
) {
  const baseFollowers = calculateAdaFollowers(
    meters.popularity,
    meters.reputation,
    followedCount,
    social.followerBonus
  );
  const infamy = computeViralBonus(episode, sceneIndex, flags);
  return baseFollowers + infamy;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toString();
}

/* ------------------------------ Post display ------------------------------ */

// Applies choice-based variants, narrative memory, and threaded comment unlocking to a post
export function resolvePost(
  post: SocialPost,
  flags: Record<string, boolean>,
  social: SocialState,
  episode: number = 1,
  sceneIndex: number = 0
): SocialPost {
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
    } else if (flags.refused_kelvin_ride && !social.unfollowed?.bisola && !post.comments.some((c) => c.text.includes('shuttle'))) {
      narrativeComments.push({
        id: `mem_bis_${post.id}_refused_kelvin`,
        authorId: 'bisola',
        authorName: 'Bisola Adeyemi',
        authorHandle: '@bisola_vlogs',
        isVerified: true,
        avatarType: 'bisola',
        text: 'The entire campus is talking about Ada turning down Kelvin Adebayo-Wright’s GT3 to catch the campus shuttle 💀 iconic!',
        likes: 360,
        timestamp: '20m ago',
        memoryBadge: 'Recalls: Rejected Ride',
      });
    }

    if (flags.noted_bisola_motive && !social.unfollowed?.bisola && !post.comments.some((c) => c.text.includes('stressed'))) {
      const c1 = createLightweightComment(`org_bis_${post.id}_mot_1`, 'folake_ade', 'Is Bisola okay? She looked really stressed on live yesterday.', {
        likes: 270,
        timestamp: '25m ago',
      });
      const c2 = createLightweightComment(`org_bis_${post.id}_mot_2`, 'victor_osita', 'Heard she’s behind on payments and brand sponsors are stalling.', {
        likes: 310,
        timestamp: '21m ago',
        parentCommentId: c1.id,
        replyToHandle: '@folake_ade',
      });
      const c3 = createLightweightComment(`org_bis_${post.id}_mot_3`, 'demola_shonowo', 'Island life is expensive when sponsorships dry up.', {
        likes: 390,
        timestamp: '17m ago',
        parentCommentId: c2.id,
        replyToHandle: '@victor_osita',
      });
      narrativeComments.push(c1, c2, c3);
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
    } else if (flags.flirted_with_chidi && !social.unfollowed?.chidi && !post.comments.some((c) => c.text.includes('behind the lens'))) {
      const mem = {
        id: `mem_chidi_${post.id}_flirt`,
        authorId: 'chidi',
        authorName: 'Chidi Nwosu',
        authorHandle: '@chidi_captures',
        isVerified: true,
        avatarType: 'chidi',
        text: 'Still thinking about who captures the photographer. You have a sharp eye, Ada 📸✨',
        likes: 320,
        timestamp: '25m ago',
        memoryBadge: 'Recalls: Balcony Flirt',
      };
      const c1 = createLightweightComment(`org_chi_${post.id}_flt_1`, 'miriam_chukwu', 'Nobody is going to talk about the chemistry between Ada and Chidi? 👀', {
        likes: 280,
        timestamp: '22m ago',
        parentCommentId: mem.id,
        replyToHandle: '@chidi_captures',
      });
      const c2 = createLightweightComment(`org_chi_${post.id}_flt_2`, 'david_obi', 'You people see chemistry everywhere.', {
        likes: 190,
        timestamp: '19m ago',
        parentCommentId: c1.id,
        replyToHandle: '@miriam_chukwu',
      });
      const c3 = createLightweightComment(`org_chi_${post.id}_flt_3`, 'adaeze_nwosu', 'Please, even I noticed it 😂', {
        likes: 340,
        timestamp: '16m ago',
        parentCommentId: c2.id,
        replyToHandle: '@david_obi_',
      });
      narrativeComments.push(mem, c1, c2, c3);
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
      const mem = {
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
      };
      const c1 = createLightweightComment(`org_zee_${post.id}_pa_1`, 'folake_ade', 'So Ada is working with Zee now?', {
        likes: 240,
        timestamp: '12m ago',
        parentCommentId: mem.id,
        replyToHandle: '@zeebello',
      });
      const c2 = createLightweightComment(`org_zee_${post.id}_pa_2`, 'kene_okoli', 'Looks like it.', {
        likes: 290,
        timestamp: '10m ago',
        parentCommentId: c1.id,
        replyToHandle: '@folake_ade',
      });
      const c3 = createLightweightComment(`org_zee_${post.id}_pa_3`, 'tari_briggs', 'That office is about to become interesting.', {
        likes: 380,
        timestamp: '8m ago',
        parentCommentId: c2.id,
        replyToHandle: '@kene_okoli_',
      });
      narrativeComments.push(mem, c1, c2, c3);
    } else if (flags.negotiated_pa_terms && !social.unfollowed?.zee && !post.comments.some((c) => c.text.includes('editorial clause'))) {
      const mem = {
        id: `mem_zee_${post.id}_negotiated`,
        authorId: 'zee',
        authorName: 'Zainab Bello',
        authorHandle: '@zeebello',
        isVerified: true,
        avatarType: 'zee',
        text: 'Nobody negotiates an editorial clause with me and wins, but you did. Keep that same energy this week ✨',
        likes: 560,
        timestamp: '20m ago',
        memoryBadge: 'Recalls: Retainer Terms',
      };
      const c1 = createLightweightComment(`org_zee_${post.id}_neg_1`, 'kene_okoli', 'I heard Ada didn’t just accept whatever Zee offered.', {
        likes: 310,
        timestamp: '18m ago',
        parentCommentId: mem.id,
        replyToHandle: '@zeebello',
      });
      const c2 = createLightweightComment(`org_zee_${post.id}_neg_2`, 'daniel_okafor', 'Good for her.', {
        likes: 280,
        timestamp: '15m ago',
        parentCommentId: c1.id,
        replyToHandle: '@kene_okoli_',
      });
      const c3 = createLightweightComment(`org_zee_${post.id}_neg_3`, 'omowunmi_p', 'Working with Zee without boundaries? Never.', {
        likes: 420,
        timestamp: '12m ago',
        parentCommentId: c2.id,
        replyToHandle: '@daniel_okafor',
      });
      narrativeComments.push(mem, c1, c2, c3);
    } else if (flags.pact_with_zee && !social.unfollowed?.zee && !post.comments.some((c) => c.text.includes('loyalty'))) {
      const mem = {
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
      };
      const c1 = createLightweightComment(`org_zee_${post.id}_pct_1`, 'halima_bello', 'Ada and Zee seem very close lately.', {
        likes: 320,
        timestamp: '22m ago',
        parentCommentId: mem.id,
        replyToHandle: '@zeebello',
      });
      const c2 = createLightweightComment(`org_zee_${post.id}_pct_2`, 'miriam_chukwu', 'Close or strategic... in this circle you never know.', {
        likes: 360,
        timestamp: '18m ago',
        parentCommentId: c1.id,
        replyToHandle: '@halima_bello_',
      });
      const c3 = createLightweightComment(`org_zee_${post.id}_pct_3`, 'favoureze', 'Strategic is the only way to survive Banana Island.', {
        likes: 410,
        timestamp: '15m ago',
        parentCommentId: c2.id,
        replyToHandle: '@miriam_chukwu',
      });
      narrativeComments.push(mem, c1, c2, c3);
    } else if (flags.warned_zee && !social.unfollowed?.zee && !post.comments.some((c) => c.text.includes('eyes wide open'))) {
      const mem = {
        id: `mem_zee_${post.id}_warned`,
        authorId: 'zee',
        authorName: 'Zainab Bello',
        authorHandle: '@zeebello',
        isVerified: true,
        avatarType: 'zee',
        text: 'I respect people who look me in the eye and tell me to keep my hands clean. Keep those eyes wide open, Ada 👁️💅',
        likes: 580,
        timestamp: '20m ago',
        memoryBadge: 'Recalls: The Warning',
      };
      const c1 = createLightweightComment(`org_zee_${post.id}_wrn_1`, 'halima_bello', 'Did you see the look Zee gave Ada earlier? There is tension in that house.', {
        likes: 330,
        timestamp: '18m ago',
        parentCommentId: mem.id,
        replyToHandle: '@zeebello',
      });
      const c2 = createLightweightComment(`org_zee_${post.id}_wrn_2`, 'tari_briggs', 'I heard Ada stood her ground and told her to keep her hands clean.', {
        likes: 370,
        timestamp: '15m ago',
        parentCommentId: c1.id,
        replyToHandle: '@halima_bello_',
      });
      const c3 = createLightweightComment(`org_zee_${post.id}_wrn_3`, 'keji_balogun', 'Nobody stands up to Zee without consequences.', {
        likes: 440,
        timestamp: '12m ago',
        parentCommentId: c2.id,
        replyToHandle: '@tari_briggs',
      });
      narrativeComments.push(mem, c1, c2, c3);
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
      const mem = {
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
      };
      const c1 = createLightweightComment(`org_kel_${post.id}_ref_1`, 'daniel_okafor', 'Wait, Ada actually turned down Kelvin’s car? 😭', {
        likes: 210,
        timestamp: '20m ago',
        parentCommentId: mem.id,
        replyToHandle: '@kelvin_wright',
      });
      const c2 = createLightweightComment(`org_kel_${post.id}_ref_2`, 'favoureze', 'Apparently she took the campus shuttle instead.', {
        likes: 260,
        timestamp: '18m ago',
        parentCommentId: c1.id,
        replyToHandle: '@daniel_okafor',
      });
      const c3 = createLightweightComment(`org_kel_${post.id}_ref_3`, 'tari_briggs', 'I respect the commitment 😂', {
        likes: 310,
        timestamp: '15m ago',
        parentCommentId: c2.id,
        replyToHandle: '@favoureze_',
      });
      narrativeComments.push(mem, c1, c2, c3);
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
    } else if (flags.photographed_tea_phone && !post.comments.some((c) => c.text.includes('camera'))) {
      const mem = {
        id: `mem_tea_${post.id}_photo`,
        authorId: 'lagos_tea',
        authorName: 'The Lagos Tea 🫖',
        authorHandle: '@TheLagosTea',
        isVerified: true,
        avatarType: 'lagos_tea',
        text: 'Taking secret photos in the dark service room? Careful what your camera captures 🫖📱',
        likes: 820,
        timestamp: '15m ago',
        memoryBadge: 'Recalls: Archive Recon',
      };
      const c1 = createLightweightComment(`org_tea_${post.id}_pho_1`, 'nnamdi_oraekwe', 'Someone said they saw a flash in the hallway late last night 👀', {
        likes: 340,
        timestamp: '14m ago',
        parentCommentId: mem.id,
        replyToHandle: '@TheLagosTea',
      });
      const c2 = createLightweightComment(`org_tea_${post.id}_pho_2`, 'ngozi_uche', 'In the middle of the night?', {
        likes: 290,
        timestamp: '11m ago',
        parentCommentId: c1.id,
        replyToHandle: '@nnamdi_oraekwe',
      });
      const c3 = createLightweightComment(`org_tea_${post.id}_pho_3`, 'solomon_ekong', 'People are taking receipts. Nobody trusts anyone in that house.', {
        likes: 410,
        timestamp: '8m ago',
        parentCommentId: c2.id,
        replyToHandle: '@ngozi_uche',
      });
      narrativeComments.push(mem, c1, c2, c3);
    }

    if (flags.held_breath_stealth && !post.comments.some((c) => c.text.includes('creeping'))) {
      const c1 = createLightweightComment(`org_tea_${post.id}_stl_1`, 'demola_shonowo', 'Security was moving around the house at 2 AM.', {
        likes: 350,
        timestamp: '14m ago',
      });
      const c2 = createLightweightComment(`org_tea_${post.id}_stl_2`, 'keji_balogun', 'I heard someone was creeping in the service wing in total darkness.', {
        likes: 410,
        timestamp: '11m ago',
        parentCommentId: c1.id,
        replyToHandle: '@demola_shonowo',
      });
      const c3 = createLightweightComment(`org_tea_${post.id}_stl_3`, 'anita_nwosu', 'And nobody made a sound? That takes serious nerve.', {
        likes: 470,
        timestamp: '8m ago',
        parentCommentId: c2.id,
        replyToHandle: '@keji_balogun',
      });
      narrativeComments.push(c1, c2, c3);
    } else if (flags.confronted_intruder && !post.comments.some((c) => c.text.includes('back door'))) {
      const c1 = createLightweightComment(`org_tea_${post.id}_int_1`, 'demola_shonowo', 'Did you hear that noise near the stairs last night?', {
        likes: 380,
        timestamp: '14m ago',
      });
      const c2 = createLightweightComment(`org_tea_${post.id}_int_2`, 'keji_balogun', 'Someone got caught trying to open the back door!', {
        likes: 450,
        timestamp: '11m ago',
        parentCommentId: c1.id,
        replyToHandle: '@demola_shonowo',
      });
      const c3 = createLightweightComment(`org_tea_${post.id}_int_3`, 'tari_briggs', 'Whoever confronted them has serious courage.', {
        likes: 520,
        timestamp: '8m ago',
        parentCommentId: c2.id,
        replyToHandle: '@keji_balogun',
      });
      narrativeComments.push(c1, c2, c3);
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
    comments: (() => {
      const allCandidateComments = [...narrativeComments, ...playerComments, ...post.comments];
      const visibleComments = allCandidateComments.filter((c) => {
        if (c.unlockEpisode !== undefined) {
          if (!hasReached(episode, sceneIndex, c.unlockEpisode, c.unlockSceneIndex ?? 0)) return false;
        }
        if (c.requiredFlag && !flags[c.requiredFlag]) return false;
        if (c.requiredAnyFlags && !c.requiredAnyFlags.some((f) => flags[f])) return false;
        if (c.hiddenIfFlag && flags[c.hiddenIfFlag]) return false;
        if (c.hiddenIfAnyFlags && c.hiddenIfAnyFlags.some((f) => flags[f])) return false;
        return true;
      });
      const visibleIds = new Set(visibleComments.map((c) => c.id));
      return visibleComments.filter((c) => {
        if (!c.parentCommentId) return true;
        return visibleIds.has(c.parentCommentId);
      });
    })(),
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
          ? `${CAST_PROFILES[firstIncoming.from as CharacterId].name.split(' ')[0]} in ${getThreadTitle(thread, episode, sceneIndex, flags)}`
          : getThreadTitle(thread, episode, sceneIndex, flags);
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
