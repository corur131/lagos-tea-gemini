import { HeroineCustomization, LocationType, Meters, OutfitId } from '../types/vn';
import {
  AdaPhotoKind,
  AdaPost,
  AdaPostTone,
  CommentWar,
  SocialComment,
  SocialEffect,
  SocialPost,
} from '../types/socialFeed';
import { castComment } from './socialRules';

const LOCATION_LABELS: Record<LocationType, string> = {
  ajegunle_apartment: 'my little room in Ajegunle',
  banana_island_mansion: 'the Banana Island mansion',
  rooftop_party: 'a VI rooftop',
  mall: 'The Palms',
  university_campus: 'Lekki Atlantic campus',
  beach_house: 'Ilashe beach house',
  photoshoot_studio: 'the photo studio',
  night_street: 'Lagos at night',
};

const LOCATION_GRADIENTS: Record<LocationType, string> = {
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
};

export interface PhotoOption {
  kind: AdaPhotoKind;
  label: string;
  bgGradient: string;
}

export function getPhotoOptions(heroine: HeroineCustomization, location: LocationType): PhotoOption[] {
  return [
    {
      kind: 'mirror_selfie',
      label: `Mirror selfie in my ${OUTFIT_LABELS[heroine.outfit]} fit`,
      bgGradient: 'from-pink-500 via-purple-700 to-neutral-950',
    },
    {
      kind: 'location',
      label: `A moment at ${LOCATION_LABELS[location]}`,
      bgGradient: LOCATION_GRADIENTS[location],
    },
    {
      kind: 'throwback',
      label: 'Ajegunle throwback, baby photo 💛',
      bgGradient: 'from-amber-700 via-orange-900 to-neutral-950',
    },
  ];
}

export const TONE_INFO: Record<
  AdaPostTone,
  { label: string; description: string; effect: SocialEffect; followerBase: number; captions: string[]; badge: string }
> = {
  humble: {
    label: 'Humble 🙏',
    description: 'Wins respect. Small follower bump.',
    effect: { meterChanges: { reputation: 4, loyalty: 2 } },
    followerBase: 500,
    badge: '🙏 GRATEFUL',
    captions: [
      'Grateful for every room I walk into, even the ones that didn’t want me there 🙏✨',
      'Scholarship girl. Big dreams, small room. Still here 💛📚',
      'Not where I want to be, but so far from where I started 🙏',
    ],
  },
  shady: {
    label: 'Shady 💅',
    description: 'Goes viral. The girls won’t love it.',
    effect: { meterChanges: { popularity: 5, jealousy: 4, loyalty: -3, suspicion: 2 } },
    followerBase: 1800,
    badge: '💅 NO NAMES',
    captions: [
      'Some people’s “tea” is just tap water with a filter 💅🫖',
      'Imagine leaking someone’s address and still being irrelevant 🥱',
      'Smile for the camera, babe. I know you’re watching 👀',
    ],
  },
  flex: {
    label: 'Flex 👑',
    description: 'Big reach. Some people will ask where the money came from.',
    effect: { meterChanges: { popularity: 4, reputation: -2, jealousy: 2 } },
    followerBase: 1100,
    badge: '👑 MAIN CHARACTER',
    captions: [
      'Ajegunle to Banana Island. Same girl, new view 💅🌴',
      'Main character energy. Borrowed or not 👑',
      'They said I didn’t belong. The algorithm disagrees 📈✨',
    ],
  },
};

export function computeReach(tone: AdaPostTone, popularity: number) {
  const followerGain = Math.round(TONE_INFO[tone].followerBase * (0.5 + popularity / 100));
  const likesCount = Math.round(followerGain * 1.6 + popularity * 40);
  return { followerGain, likesCount };
}

const FAN_COMMENTS: Record<AdaPostTone, Array<[string, string]>> = {
  humble: [
    ['@mainland_queen', 'This is so inspiring 😭🙏'],
    ['@yaba_finest', 'Mainland to the world 🌍💛'],
    ['@scholarship_sis', 'From one scholarship girl to another, I see you 💪🏾'],
  ],
  shady: [
    ['@vi_gist', 'THE SHADE 😭😭😭'],
    ['@island_tattle', 'Tea is shaking rn 🫖😂'],
    ['@lekkibabe99', 'She’s not playing with anybody this year 💀'],
  ],
  flex: [
    ['@ajegunle_pride', 'Ajegunle stand up!! 🔥🔥'],
    ['@glowup_gist', 'The glow up is GLOWING 😍'],
    ['@lekkibabe99', 'Island suits you sis 🌴'],
  ],
};

function fanComment(handle: string, text: string, id: string): SocialComment {
  return {
    id,
    authorId: 'gidi_paparazzi',
    authorName: handle.replace('@', ''),
    authorHandle: handle,
    avatarType: 'fan',
    text,
    likes: Math.round(20 + Math.random() * 400),
    timestamp: 'Just now',
  };
}

// Pre-written comments used when Gemini isn't available
export function buildFallbackComments(
  tone: AdaPostTone,
  meters: Meters,
  flags: Record<string, boolean>,
  postId: string
): SocialComment[] {
  const comments: SocialComment[] = [];
  const add = (author: Parameters<typeof castComment>[0], text: string) =>
    comments.push(castComment(author, text, `${postId}_${author}`, Math.round(100 + Math.random() * 2000)));

  if (flags.questioned_tamara_dm) add('tamara', '😐');
  else add('tamara', { humble: 'My girl 🥹💚', shady: 'LMAOOO who hurt you 😭💚', flex: 'THAT’S MY SISTER 💚👑' }[tone]);

  if (meters.romanceChidi >= 35) {
    add('chidi', {
      humble: '📸👏',
      shady: 'Remind me never to get on your bad side 😅',
      flex: 'Better than any shot I took tonight',
    }[tone]);
  }
  if (meters.romanceKelvin >= 35) {
    add('kelvin', { humble: 'Humble looks good on you.', shady: 'Dangerous. I like it 🥃', flex: 'Told you. Main character. 🥃' }[tone]);
  }
  if (tone === 'shady') add('bisola', 'OMG who is this about 😭🍿');
  if (tone === 'flex') {
    add('bisola', 'Ok STYLED 😍');
    add('zee', 'Cute 🙂');
    add('chi', 'Borrowed or bought? 🤔');
  }
  if (tone === 'humble') add('hauwa', 'Your aura is healing 🌿');

  FAN_COMMENTS[tone].forEach(([handle, text], i) => comments.push(fanComment(handle, text, `${postId}_fan${i}`)));
  return comments;
}

export function buildAdaTrollWar(tone: AdaPostTone, postId: string): CommentWar {
  const wars: Record<AdaPostTone, Omit<CommentWar, 'id'>> = {
    humble: {
      troll: { authorId: 'lekki_insider', authorName: 'Lekki Insider', authorHandle: '@lekki_insider', avatarType: 'fan', text: 'Humble?? You were sipping Dom Pérignon last week 😂 Fake humility' },
      options: [
        { id: 'clapback', label: 'Clap back 💅', replyText: 'Sipping is free when you’re invited, babe 🥂', effect: { meterChanges: { popularity: 3 } }, followerDelta: 400, aftermath: [{ authorId: 'gidi_paparazzi', authorName: 'vi_gist', authorHandle: '@vi_gist', avatarType: 'fan', text: 'INVITED 😭😭 the way she said it' }] },
        { id: 'classy', label: 'Stay classy 🙏', replyText: 'Gratitude isn’t fake. Have a great day 🙏', effect: { meterChanges: { reputation: 3 } }, followerDelta: 150, aftermath: [{ authorId: 'gidi_paparazzi', authorName: 'scholarship_sis', authorHandle: '@scholarship_sis', avatarType: 'fan', text: 'Unbothered queen 👑' }] },
        { id: 'ignore', label: 'Ignore 🙈', effect: { meterChanges: { reputation: 1 } }, followerDelta: 0, aftermath: [] },
      ],
    },
    shady: {
      troll: { authorId: 'gidi_paparazzi', authorName: 'vi_gist', authorHandle: '@vi_gist', avatarType: 'fan', text: 'This one is shading the Tea? Girl you’ll be the next leak 💀' },
      options: [
        { id: 'clapback', label: 'Clap back 💅', replyText: 'Let them try. I’ve got nothing left to leak 💅', effect: { meterChanges: { popularity: 4, suspicion: 1 } }, followerDelta: 500, aftermath: [{ authorId: 'gidi_paparazzi', authorName: 'island_tattle', authorHandle: '@island_tattle', avatarType: 'fan', text: 'NOTHING LEFT TO LEAK 😭 iconic' }] },
        { id: 'classy', label: 'Stay classy 🙏', replyText: 'I’m not scared of anonymous pages 🙂', effect: { meterChanges: { reputation: 3 } }, followerDelta: 150, aftermath: [] },
        { id: 'ignore', label: 'Ignore 🙈', effect: { meterChanges: { reputation: 1 } }, followerDelta: 0, aftermath: [] },
      ],
    },
    flex: {
      troll: { authorId: 'gidi_paparazzi', authorName: 'gidi_paparazzi', authorHandle: '@gidi_paparazzi', avatarType: 'fan', text: 'Banana Island on whose money? 👀 Sponsor reveal when?' },
      options: [
        { id: 'clapback', label: 'Clap back 💅', replyText: 'On my own two feet. My sponsor is called hard work 💅', effect: { meterChanges: { popularity: 4 } }, followerDelta: 450, aftermath: [{ authorId: 'gidi_paparazzi', authorName: 'ajegunle_pride', authorHandle: '@ajegunle_pride', avatarType: 'fan', text: 'HARD WORK 🗣️🗣️' }] },
        { id: 'classy', label: 'Stay classy 🙏', replyText: 'Every room I’m in, I earned 🙏', effect: { meterChanges: { reputation: 3 } }, followerDelta: 150, aftermath: [] },
        { id: 'ignore', label: 'Ignore 🙈', effect: { meterChanges: { reputation: 1 } }, followerDelta: 0, aftermath: [] },
      ],
    },
  };
  return { id: `war_${postId}`, ...wars[tone] };
}

export function adaPostToSocialPost(post: AdaPost, heroineName: string, isVerified: boolean): SocialPost {
  return {
    id: post.id,
    authorId: 'heroine',
    authorName: `${heroineName} Obi`,
    authorHandle: '@ada_obi',
    isVerified,
    avatarType: 'heroine',
    unlockEpisode: post.episode,
    unlockSceneIndex: post.sceneIndex,
    timestamp: 'Your post',
    caption: post.caption,
    hashtags: [],
    graphic: {
      type: 'luxe_portrait',
      characterId: 'heroine',
      bgGradient: post.bgGradient,
      badgeLabel: TONE_INFO[post.tone].badge,
      headline: post.photoLabel.toUpperCase(),
      subheadline: `@ada_obi • Episode ${post.episode}`,
    },
    likesCount: post.likesCount,
    commentsCount: post.comments.length,
    sharesCount: Math.round(post.likesCount * 0.05),
    comments: post.comments,
    commentWar: post.commentWar,
    isAdaPost: true,
  };
}
