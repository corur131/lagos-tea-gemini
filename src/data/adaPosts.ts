import { HeroineCustomization, LocationType, Meters, OutfitId, CharacterId } from '../types/vn';
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

export function computeReach(
  tone: AdaPostTone,
  popularity: number,
  unfollowed?: Record<string, boolean>
) {
  // Underdog scaling: At low popularity (12%), Ada starts small (~25-45 followers gained per post, ~18-35 likes)
  // As she grinds her way up and expands her network, reach scales exponentially to thousands!
  const basePotential = TONE_INFO[tone].followerBase;
  const underdogFactor = 0.08 + Math.pow(Math.max(0, popularity) / 100, 1.8) * 0.92;
  const baseFollowerGain = Math.round(basePotential * underdogFactor);

  // High society influence calculation:
  // Each followed NPC expands Ada's explore-feed footprint and recommendation algorithm
  const allNpcs: Array<CharacterId | 'lagos_tea'> = [
    'zee',
    'tamara',
    'kelvin',
    'chi',
    'bisola',
    'hauwa',
    'chidi',
    'dayo',
    'lagos_tea',
  ];
  const followedCount = allNpcs.filter((id) => !unfollowed?.[id]).length;
  
  // Influencer network multiplier:
  const networkMultiplier = 0.4 + (followedCount / allNpcs.length) * 0.9;
  const zeeBoost = !unfollowed?.zee ? 1.25 : 0.8;
  const tamaraBoost = !unfollowed?.tamara ? 1.2 : 0.85;
  const kelvinBoost = !unfollowed?.kelvin ? 1.15 : 0.9;
  const totalMultiplier = networkMultiplier * ((zeeBoost * tamaraBoost * kelvinBoost) / (1.25 * 1.2 * 1.15));

  const followerGain = Math.max(15, Math.round(baseFollowerGain * totalMultiplier));
  // Likes start authentic to an aspiring unknown creator:
  // At 12% Popularity: ~24-35 likes! Real humble beginnings!
  // At 50% Popularity: ~320 likes!
  // At 90% Popularity: ~2,400 likes!
  const baseLikes = 15 + followerGain * 0.5 + Math.pow(popularity, 1.6) * 0.7;
  const likesCount = Math.max(12, Math.round(baseLikes * totalMultiplier));

  return { followerGain, likesCount, networkMultiplier: totalMultiplier, followedCount };
}

const FAN_COMMENTS: Record<AdaPostTone, Array<[string, string]>> = {
  humble: [
    ['@mainland_queen', 'This is so inspiring 😭🙏'],
    ['@yaba_finest', 'Mainland to the world 🌍💛'],
    ['@scholarship_sis', 'From one scholarship girl to another, I see you 💪🏾'],
    ['@lagos_hustle', 'Real recognize real! Pure grace 🙏✨'],
  ],
  shady: [
    ['@vi_gist', 'THE SHADE 😭😭😭'],
    ['@island_tattle', 'Tea is shaking rn 🫖😂'],
    ['@lekkibabe99', 'She’s not playing with anybody this year 💀'],
    ['@gidi_pulse', 'Direct hit! Tag the culprit already 😂🍿'],
  ],
  flex: [
    ['@ajegunle_pride', 'Ajegunle stand up!! 🔥🔥'],
    ['@glowup_gist', 'The glow up is GLOWING 😍'],
    ['@lekkibabe99', 'Island suits you sis 🌴'],
    ['@style_gidi', 'Frame this look immediately! 👑🔥'],
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
    likes: Math.round(10 + Math.random() * 250),
    timestamp: 'Just now',
  };
}

// Pre-written comments influenced by narrative choices made in past scenes
export function buildFallbackComments(
  tone: AdaPostTone,
  meters: Meters,
  flags: Record<string, boolean> = {},
  postId: string,
  unfollowed?: Record<string, boolean>,
  lastChoiceText?: string
): SocialComment[] {
  const comments: SocialComment[] = [];
  const add = (
    author: Parameters<typeof castComment>[0],
    text: string,
    memoryBadge?: string
  ) => {
    const comment = castComment(author, text, `${postId}_${author}_${Date.now()}`, Math.round(30 + Math.random() * 400));
    if (memoryBadge) comment.memoryBadge = memoryBadge;
    comments.push(comment);
  };

  // 1. SPECIFIC MEMORIES OF NARRATIVE CHOICES:
  
  // Choice Memory A: The Dress at Zee's 21st Party
  if (flags.borrowed_emerald_dress && !unfollowed?.tamara) {
    add('tamara', 'Still obsessed with that emerald silk look we pulled from my closet 💚 You made that dress legendary, sister!', 'Recalls: Emerald Dress');
  } else if (flags.vintage_style_dress && !unfollowed?.bisola) {
    add('bisola', 'I will never forget you pulling up to a Banana Island billionaire party in thrifted black! Iconic nerve 💀🍿', 'Recalls: Thrift Look');
  } else if (flags.dragged_dress && !unfollowed?.tamara) {
    add('tamara', 'Remember that dress scramble in the taxi? So glad we made it in time 💛', 'Recalls: Entrance Panic');
  }

  // Choice Memory B: Ride with Kelvin in his Porsche
  if (flags.drove_with_kelvin && !unfollowed?.kelvin) {
    add('kelvin', 'Still thinking about our drive along the coastal expressway. You talk more sense than anyone on the Island 🥃', 'Recalls: Porsche Ride');
  } else if (flags.refused_kelvin_ride && !unfollowed?.kelvin) {
    add('kelvin', 'The only girl in Lekki to choose the student bus over my Porsche. Still hurts my pride a little, Ada 😏', 'Recalls: Rejected Ride');
  } else if (flags.refused_kelvin_ride && !unfollowed?.chidi) {
    add('chidi', 'Respect for taking the campus bus over the sports car. Real ones stay true to where they came from 📸✨', 'Recalls: Humble Transit');
  }

  // Choice Memory C: Balcony Romance / Intimacy with Chidi
  if (flags.chidi_romantic_moment && !unfollowed?.chidi) {
    add('chidi', 'That quiet moment by the balcony railing late at night... my camera didn’t lie. You’re different from the rest 📸💛', 'Recalls: Balcony Confession');
  } else if (flags.flirted_with_chidi && !unfollowed?.chidi) {
    add('chidi', 'You know how to get behind the lens and in front of it 😉 Looking good, Ada.', 'Recalls: Balcony Flirt');
  } else if (flags.chidi_archive_alliance && !unfollowed?.chidi) {
    add('chidi', 'We’re going to get to the truth behind that mezzanine shot. Nobody messes with you on my watch 🔍', 'Recalls: Mezzanine Lead');
  }

  // Choice Memory D: Working for Queen Bee Zee
  if (flags.accepted_pa_job && !unfollowed?.zee) {
    add('zee', 'My new communications assistant is posting content instead of updating my press schedule? Focus, darling 💅', 'Recalls: Assistant Role');
  } else if (flags.negotiated_pa_terms && !unfollowed?.zee) {
    add('zee', 'Nobody negotiates a retainer with me and wins, but you did. Keep that same energy this week ✨', 'Recalls: Retainer Terms');
  } else if (flags.pact_with_zee && !unfollowed?.zee) {
    add('zee', 'Our little agreement remains intact, Ada. Loyalty in this circle pays dividends 👑', 'Recalls: Private Pact');
  } else if (flags.warned_zee && !unfollowed?.zee) {
    add('zee', 'Your heads-up about the leak was sharp. I value people who keep their eyes open 🙂', 'Recalls: The Warning');
  }

  // Choice Memory E: Campus Walk After the Leak
  if (flags.unbothered_walk && !unfollowed?.hauwa) {
    add('hauwa', 'The peace you held walking into class after that cruel leak... pure spiritual strength 🌿🕊️', 'Recalls: Head Held High');
  } else if (flags.demanded_leak_answers && !unfollowed?.chi) {
    add('chi', 'Demanding accountability in front of the board was bold. Make sure your evidence is airtight ⚖️', 'Recalls: Public Demand');
  } else if (flags.demanded_leak_answers && !unfollowed?.lagos_tea) {
    add('lagos_tea', 'Demanding answers won’t silence the tea kettle, darling Ada 🫖👀', 'Recalls: Tea Confrontation');
  }

  // Choice Memory F: Siding with Chidi vs Kelvin
  if (flags.sided_with_chidi && !unfollowed?.chidi) {
    add('chidi', 'Glad you trusted my photographer’s instinct over island money. We’re close 📸', 'Recalls: Trusted Chidi');
  } else if (flags.sided_with_kelvin && !unfollowed?.kelvin) {
    add('kelvin', 'Trusting my family was the right move. We protect people in our circle 🥃', 'Recalls: Sided with Kelvin');
  }

  // Choice Memory G: Confronting Chioma or Bisola
  if (flags.pressed_chioma && !unfollowed?.chi) {
    add('chi', 'You cross-examined me like a prosecutor outside the library. Sharp tongue, Ada.', 'Recalls: Library Questioning');
  } else if (flags.helped_bisola && !unfollowed?.bisola) {
    add('bisola', 'Thank you again for reviewing my brand pitch the other day 💕 You’re one of the only real ones!', 'Recalls: Helped With Pitch');
  } else if (flags.noted_bisola_motive && !unfollowed?.bisola) {
    add('bisola', 'I saw you watching me at the studio… we all have bills to pay, Ada 😔', 'Recalls: Observed Distress');
  }

  // Choice Memory H: Burner phone clue & intruder finale
  if (flags.photographed_tea_phone && !unfollowed?.lagos_tea) {
    add('lagos_tea', 'Taking secret photos in the dark archive room? Careful what you capture 🫖📱', 'Recalls: Archive Recon');
  } else if (flags.held_breath_stealth && !unfollowed?.lagos_tea) {
    add('lagos_tea', 'Holding your breath behind the curtains won’t hide you forever, Cinderella 🫖🤫', 'Recalls: Stealth Vigil');
  } else if (flags.confronted_intruder && !unfollowed?.lagos_tea) {
    add('lagos_tea', 'Stepping into the dark to face shadows? Brave girl. Or foolish girl 🫖⚡', 'Recalls: Midnight Confrontation');
  }

  // 2. TONE-BASED AND RELATIONSHIP COMMENTS:
  if (!comments.some((c) => c.authorId === 'tamara') && !unfollowed?.tamara) {
    if (flags.questioned_tamara_dm) add('tamara', '😐');
    else add('tamara', { humble: 'My girl 🥹💚', shady: 'LMAOOO who hurt you 😭💚', flex: 'THAT’S MY SISTER 💚👑' }[tone]);
  }

  if (!comments.some((c) => c.authorId === 'chidi') && !unfollowed?.chidi && meters.romanceChidi >= 25) {
    add('chidi', {
      humble: '📸👏',
      shady: 'Remind me never to get on your bad side 😅',
      flex: 'Better than any shot I took tonight 🔥',
    }[tone]);
  }

  if (!comments.some((c) => c.authorId === 'kelvin') && !unfollowed?.kelvin && meters.romanceKelvin >= 25) {
    add('kelvin', {
      humble: 'Humble looks good on you.',
      shady: 'Dangerous. I like it 🥃',
      flex: 'Told you. Main character. 🥃',
    }[tone]);
  }

  if (!comments.some((c) => c.authorId === 'bisola') && !unfollowed?.bisola) {
    if (tone === 'shady') add('bisola', 'OMG who is this about 😭🍿');
    else if (tone === 'flex') add('bisola', 'Ok STYLED 😍');
    else add('bisola', 'Love this for you boo 💕');
  }

  if (!comments.some((c) => c.authorId === 'zee')) {
    if (!unfollowed?.zee) {
      if (tone === 'flex') add('zee', 'Cute 🙂');
      else if (meters.loyalty >= 45) add('zee', 'Keep that focus ✨');
    } else {
      add('zee', 'Unfollowing me won’t make you relevant, darling 🙂');
    }
  }

  if (!comments.some((c) => c.authorId === 'chi') && !unfollowed?.chi) {
    if (tone === 'flex') add('chi', 'Borrowed or bought? 🤔');
    else add('chi', 'Networking suits you.');
  }

  if (!comments.some((c) => c.authorId === 'hauwa') && !unfollowed?.hauwa) {
    if (tone === 'humble') add('hauwa', 'Your aura is healing 🌿');
    else add('hauwa', 'Stay grounded in this city 🕊️');
  }

  if (!comments.some((c) => c.authorId === 'dayo') && !unfollowed?.dayo && meters.romanceDayo >= 20) {
    add('dayo', 'Soundtrack to your glow-up coming soon 🎧');
  }

  if (!comments.some((c) => c.authorId === 'lagos_tea') && !unfollowed?.lagos_tea && meters.suspicion >= 30) {
    add('lagos_tea', 'Pretty pictures don’t delete your receipts, Ada dear 🫖👀');
  }

  // 3. UNDERDOG FAN & COMMUNITY COMMENTS:
  // When Popularity is low (underdog start), comments are authentic Ajegunle/Mainland supporters!
  const mainlandFans: Array<[string, string]> = [
    ['@ajegunle_pride', 'Ajegunle stand up! Make us proud sis 💪🏾💛'],
    ['@mainland_queen', 'Watching you rise from our neighborhood gives me hope 😭🙏'],
    ['@lau_scholar_24', 'Ada representing the scholarship squad! We see you 📚✨'],
    ['@yaba_finest', 'Mainland to the Island! The hustle is real 🌍🔥'],
  ];

  const islandFans: Array<[string, string]> = [
    ['@vi_gist', 'Wait who is this new girl in Tamara’s circle? 👀'],
    ['@island_tattle', 'Her aesthetic is actually refreshing amongst the fake millionaires ☕'],
    ['@style_gidi', 'Okay she has natural style, I won’t lie 🔥'],
    ['@lekkibabe99', 'Island suits you sis 🌴✨'],
  ];

  const fanPool = meters.popularity < 35 ? mainlandFans : [...mainlandFans, ...islandFans];
  const fanCountToShow = Math.max(1, Math.min(fanPool.length, Math.ceil((meters.popularity / 100) * fanPool.length) + 1));

  fanPool.slice(0, fanCountToShow).forEach(([handle, text], i) => {
    comments.push(fanComment(handle, text, `${postId}_fan${i}`));
  });

  return comments;
}

// Adjusts existing Ada posts as story scenes advance in the visual novel
export function getUpdatedAdaPostForScene(
  post: AdaPost,
  currentEpisode: number,
  currentSceneIndex: number,
  popularity: number,
  unfollowed?: Record<string, boolean>,
  flags?: Record<string, boolean>
): AdaPost {
  const episodesPassed = currentEpisode - post.episode;
  const scenesPassed = episodesPassed * 7 + (currentSceneIndex - post.sceneIndex);

  if (scenesPassed <= 0) return post;

  const allNpcs: Array<CharacterId | 'lagos_tea'> = [
    'zee',
    'tamara',
    'kelvin',
    'chi',
    'bisola',
    'hauwa',
    'chidi',
    'dayo',
  ];
  const followedCount = allNpcs.filter((id) => !unfollowed?.[id]).length;
  // If player followed everyone, post enjoys viral algorithmic ripple across future scenes!
  const circleClout = 0.35 + (followedCount / allNpcs.length) * 1.15;

  // Realistic growth based on underdog status:
  const viralLikeGrowth = Math.round(scenesPassed * (8 + popularity * 6) * circleClout);
  const updatedLikes = post.likesCount + viralLikeGrowth;

  const newComments = [...post.comments];

  // Dynamically add narrative memories of player choices made across scenes
  if (flags) {
    if (
      flags.borrowed_emerald_dress &&
      !unfollowed?.tamara &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Emerald Dress')
    ) {
      const c = castComment(
        'tamara',
        'Still obsessed with that emerald silk look we pulled from my closet 💚 You owned that party!',
        `${post.id}_mem_emerald_${post.episode}`,
        240
      );
      c.memoryBadge = 'Recalls: Emerald Dress';
      newComments.unshift(c);
    } else if (
      flags.vintage_style_dress &&
      !unfollowed?.bisola &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Thrift Look')
    ) {
      const c = castComment(
        'bisola',
        'Still shouting out Ada pulling up to the Island in thrifted black! Pure nerve 💀🔥',
        `${post.id}_mem_thrift_${post.episode}`,
        210
      );
      c.memoryBadge = 'Recalls: Thrift Look';
      newComments.unshift(c);
    }

    if (
      flags.drove_with_kelvin &&
      !unfollowed?.kelvin &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Porsche Ride')
    ) {
      const c = castComment(
        'kelvin',
        'Still thinking about our drive along the coastal expressway in the GT3. You’re different from the rest 🥃',
        `${post.id}_mem_kelvin_${post.episode}`,
        320
      );
      c.memoryBadge = 'Recalls: Porsche Ride';
      newComments.unshift(c);
    } else if (
      flags.refused_kelvin_ride &&
      !unfollowed?.kelvin &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Rejected Ride')
    ) {
      const c = castComment(
        'kelvin',
        'The only girl on campus to choose the student bus over my Porsche. Still hurts my pride a little, Ada 😏',
        `${post.id}_mem_kelvin_bus_${post.episode}`,
        290
      );
      c.memoryBadge = 'Recalls: Rejected Ride';
      newComments.unshift(c);
    }

    if (
      flags.chidi_romantic_moment &&
      !unfollowed?.chidi &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Balcony Confession')
    ) {
      const c = castComment(
        'chidi',
        'That quiet moment by the balcony railing late at night... my camera didn’t lie. You’re rare 📸💛',
        `${post.id}_mem_chidi_balcony_${post.episode}`,
        350
      );
      c.memoryBadge = 'Recalls: Balcony Confession';
      newComments.unshift(c);
    } else if (
      flags.sided_with_chidi &&
      !unfollowed?.chidi &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Trusted Chidi')
    ) {
      const c = castComment(
        'chidi',
        'Glad you trusted my photographer’s instinct over island money. We’re close 📸🔍',
        `${post.id}_mem_chidi_side_${post.episode}`,
        280
      );
      c.memoryBadge = 'Recalls: Trusted Chidi';
      newComments.unshift(c);
    }

    if (
      flags.accepted_pa_job &&
      !unfollowed?.zee &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Assistant Role')
    ) {
      const c = castComment(
        'zee',
        'My new communications assistant is posting content instead of updating my press schedule? Focus, darling 💅',
        `${post.id}_mem_zee_pa_${post.episode}`,
        490
      );
      c.memoryBadge = 'Recalls: Assistant Role';
      newComments.unshift(c);
    } else if (
      flags.negotiated_pa_terms &&
      !unfollowed?.zee &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Retainer Terms')
    ) {
      const c = castComment(
        'zee',
        'Nobody negotiates a retainer with me and wins, but you did. Keep that same energy this week ✨',
        `${post.id}_mem_zee_neg_${post.episode}`,
        480
      );
      c.memoryBadge = 'Recalls: Retainer Terms';
      newComments.unshift(c);
    } else if (
      flags.pact_with_zee &&
      !unfollowed?.zee &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Private Pact')
    ) {
      const c = castComment(
        'zee',
        'Our little agreement remains intact, Ada. Loyalty in this circle pays dividends 👑',
        `${post.id}_mem_zee_pact_${post.episode}`,
        410
      );
      c.memoryBadge = 'Recalls: Private Pact';
      newComments.unshift(c);
    } else if (
      flags.warned_zee &&
      !unfollowed?.zee &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: The Warning')
    ) {
      const c = castComment(
        'zee',
        'Your heads-up about the leak was sharp. I value people who keep their eyes open 🙂',
        `${post.id}_mem_zee_warn_${post.episode}`,
        430
      );
      c.memoryBadge = 'Recalls: The Warning';
      newComments.unshift(c);
    }

    if (
      flags.unbothered_walk &&
      !unfollowed?.hauwa &&
      !newComments.some((c) => c.memoryBadge === 'Recalls: Head Held High')
    ) {
      const c = castComment(
        'hauwa',
        'The peace you held walking into class after that cruel leak... pure spiritual strength 🌿🕊️',
        `${post.id}_mem_hauwa_walk_${post.episode}`,
        230
      );
      c.memoryBadge = 'Recalls: Head Held High';
      newComments.unshift(c);
    }
  }

  return {
    ...post,
    likesCount: updatedLikes,
    comments: newComments,
  };
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
