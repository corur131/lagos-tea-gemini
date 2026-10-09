import { SocialComment, SocialPost } from '../types/socialFeed';
import { createLightweightComment } from './gidiUsers';

/* =========================================================================
   MORE POSTS THROUGH THE STORY
   The cast keeps posting as the story moves: these fill the quiet stretches
   in Episodes 2–3 (Hauwa and Dayo finally post) and cover Episode 4.
   Each post's five comment options for Ada live in storyPostComments.ts.
   ========================================================================= */

const WHO: Record<string, { name: string; handle: string; avatar: SocialPost['avatarType']; verified: boolean }> = {
  zee: { name: 'Zainab "Zee" Bello', handle: '@zeebello', avatar: 'zee', verified: true },
  tamara: { name: 'Tamara Okonkwo-Reid', handle: '@tamara_reid', avatar: 'tamara', verified: true },
  chi: { name: 'Chioma Eze', handle: '@chi_corporate_glam', avatar: 'chi', verified: true },
  bisola: { name: 'Bisola Adeyemi', handle: '@bisola_vlogs', avatar: 'bisola', verified: true },
  hauwa: { name: 'Hauwa Musa', handle: '@hauwa_mindbody', avatar: 'hauwa', verified: true },
  chidi: { name: 'Chidi Nwosu', handle: '@chidi_captures', avatar: 'chidi', verified: true },
  kelvin: { name: 'Kelvin Adebayo-Wright', handle: '@kelvin_wright', avatar: 'kelvin', verified: true },
  dayo: { name: 'Dayo Martins', handle: '@dayomartins_sound', avatar: 'dayo', verified: true },
  lagos_tea: { name: 'The Lagos Tea 🫖', handle: '@TheLagosTea', avatar: 'lagos_tea', verified: true },
  gidi_paparazzi: { name: 'Gidi Paparazzi', handle: '@gidi_paparazzi', avatar: 'fan', verified: false },
};

/** A comment by the cast or by a Gidigram user, optionally replying to another */
function cm(postId: string, n: number, by: string, text: string, likes: number, extra: Partial<SocialComment> = {}): SocialComment {
  const id = `${postId}_c${n}`;
  const cast = WHO[by];
  if (cast && by !== 'gidi_paparazzi') {
    return { id, authorId: by, authorName: cast.name, authorHandle: cast.handle, isVerified: cast.verified, avatarType: cast.avatar, text, likes, timestamp: `${10 + n * 7}m ago`, ...extra };
  }
  return createLightweightComment(id, by, text, { likes, timestamp: `${10 + n * 7}m ago`, ...extra });
}
const reply = (postId: string, n: number, parent: number, parentHandle: string) => ({ parentCommentId: `${postId}_c${parent}`, replyToHandle: parentHandle });

type PostSpec = Omit<SocialPost, 'authorName' | 'authorHandle' | 'isVerified' | 'avatarType' | 'sharesCount' | 'commentsCount'> & {
  sharesCount?: number;
  commentsCount?: number;
};
function post(p: PostSpec): SocialPost {
  const w = WHO[p.authorId];
  return {
    authorName: w.name,
    authorHandle: w.handle,
    isVerified: w.verified,
    avatarType: w.avatar,
    sharesCount: Math.round(p.likesCount * 0.05),
    commentsCount: Math.round(p.likesCount * 0.04),
    ...p,
  };
}

export const STORY_POSTS: SocialPost[] = [
  /* ============================ Episode 2 ============================ */
  post({
    id: 'post_tamara_defends_ep2',
    authorId: 'tamara',
    unlockEpisode: 2,
    unlockSceneIndex: 1,
    timestamp: '2h ago',
    locationTag: 'Ikoyi, Lagos',
    caption: 'You can screenshot a debt. You can’t screenshot where a girl is going. Leave my sister alone 💚 @ada_obi',
    hashtags: ['#AdaObi', '#AjegunleToTheWorld'],
    notifyText: 'mentioned you in a post 💚',
    graphic: { type: 'luxe_portrait', characterId: 'tamara', bgGradient: 'from-emerald-600 via-emerald-900 to-neutral-950', badgeLabel: 'SISTERHOOD 💚', headline: 'LEAVE HER ALONE', subheadline: 'Tamara Okonkwo-Reid', tagLocation: 'IKOYI' },
    likesCount: 88400,
    comments: [
      cm('post_tamara_defends_ep2', 1, 'blessing_alabi', 'This is what real friendship looks like 🥹', 2100),
      cm('post_tamara_defends_ep2', 2, 'anita_nwosu', 'Respectfully, how does Tamara know so much about the debt? 👀', 980),
      cm('post_tamara_defends_ep2', 3, 'tamara', 'Because she told me herself, years ago. That’s what sisters do.', 1400, reply('post_tamara_defends_ep2', 3, 2, '@anita_nwosu')),
      cm('post_tamara_defends_ep2', 4, 'bisola', 'Protect Ada at all costs 💖', 760),
    ],
  }),
  post({
    id: 'post_hauwa_silence_ep2',
    authorId: 'hauwa',
    unlockEpisode: 2,
    unlockSceneIndex: 3,
    timestamp: '4h ago',
    locationTag: 'Ikoyi, Lagos',
    caption: 'When everyone is shouting, notice who is quiet. Notice who is typing 🌿',
    hashtags: ['#Stillness', '#WatchTheRoom'],
    graphic: { type: 'wellness_flatlay', emoji: '🍵', bgGradient: 'from-teal-700 via-emerald-900 to-neutral-950', badgeLabel: 'STILLNESS 🌿', headline: 'NOTICE WHO IS TYPING', subheadline: 'Hauwa Musa', tagLocation: 'IKOYI' },
    likesCount: 21200,
    comments: [
      cm('post_hauwa_silence_ep2', 1, 'nnamdi_oraekwe', 'This is either wellness advice or a subtweet. Possibly both 😳', 840),
      cm('post_hauwa_silence_ep2', 2, 'chi', 'Some of us are typing because we’re working, Hauwa.', 610),
      cm('post_hauwa_silence_ep2', 3, 'hauwa', 'I didn’t say your name, Chioma 🌿', 1300, reply('post_hauwa_silence_ep2', 3, 2, '@chi_corporate_glam')),
    ],
  }),
  post({
    id: 'post_dayo_cinderella_ep2',
    authorId: 'dayo',
    unlockEpisode: 2,
    unlockSceneIndex: 5,
    timestamp: '1h ago',
    locationTag: 'Surulere, Lagos',
    caption: 'Made a beat tonight called “Ajegunle Cinderella”. They meant it as an insult. I hear a hit 🎧 #NewMusic',
    hashtags: ['#NewMusic', '#Afrobeats', '#AjegunleCinderella'],
    notifyText: 'posted a beat named after you 🎧',
    soundSnippet: { title: 'Ajegunle Cinderella (demo)', artist: 'Dayo Martins', isTrending: true },
    graphic: { type: 'vlog_thumbnail', characterId: 'dayo', bgGradient: 'from-purple-700 via-indigo-900 to-black', badgeLabel: 'NEW BEAT 🎧', headline: 'AJEGUNLE CINDERELLA', subheadline: 'demo • 2:14', tagLocation: 'SURULERE' },
    likesCount: 39600,
    comments: [
      cm('post_dayo_cinderella_ep2', 1, 'simi_solanke', 'Turning the insult into a song is so Lagos 😭🔥', 1900),
      cm('post_dayo_cinderella_ep2', 2, 'bisola', 'PUT ME IN THE VIDEO 😩', 870),
      cm('post_dayo_cinderella_ep2', 3, 'kelvin', 'Interesting choice of title.', 420),
      cm('post_dayo_cinderella_ep2', 4, 'dayo', 'Interesting week, man.', 390, reply('post_dayo_cinderella_ep2', 4, 3, '@kelvin_wright')),
    ],
  }),
  post({
    id: 'post_chi_statement_ep2',
    authorId: 'chi',
    unlockEpisode: 2,
    unlockSceneIndex: 6,
    timestamp: '30m ago',
    locationTag: 'Victoria Island, Lagos',
    caption: 'For the record: I do not run, fund, or follow any anonymous page. My lawyers are reading every comment. Have a blessed evening 🙂',
    hashtags: ['#ForTheRecord'],
    graphic: { type: 'luxe_portrait', characterId: 'chi', bgGradient: 'from-slate-700 via-slate-900 to-black', badgeLabel: 'STATEMENT ⚖️', headline: 'FOR THE RECORD', subheadline: 'Chioma Eze', tagLocation: 'VICTORIA ISLAND' },
    likesCount: 18300,
    comments: [
      cm('post_chi_statement_ep2', 1, 'omowunmi_p', 'Statements are what guilty people post first 👀', 1200),
      cm('post_chi_statement_ep2', 2, 'chi', 'And what innocent people post when they’re tired, Omowunmi.', 980, reply('post_chi_statement_ep2', 2, 1, '@omowunmi_p')),
      cm('post_chi_statement_ep2', 3, 'kene_okoli', '“My lawyers are reading every comment.” Hi lawyers 👋', 2300),
    ],
  }),

  /* ============================ Episode 3 ============================ */
  post({
    id: 'post_tamara_movein_ep3',
    authorId: 'tamara',
    unlockEpisode: 3,
    unlockSceneIndex: 1,
    timestamp: '3h ago',
    locationTag: 'Content House, Banana Island',
    caption: 'Content House day one. Wardrobe: full. Heart: fuller. My sister down the hall. God did 💚🏡',
    hashtags: ['#ContentHouse', '#GodDid'],
    graphic: { type: 'villa_poolside', characterId: 'tamara', bgGradient: 'from-emerald-500 via-teal-800 to-neutral-950', badgeLabel: 'MOVE-IN DAY 🏡', headline: 'GOD DID', subheadline: 'Tamara Okonkwo-Reid', tagLocation: 'BANANA ISLAND' },
    likesCount: 102300,
    comments: [
      cm('post_tamara_movein_ep3', 1, 'zee', 'Your wardrobe is in two of my rooms, Tamara.', 4400),
      cm('post_tamara_movein_ep3', 2, 'tamara', 'Sharing is caring 💚', 3100, reply('post_tamara_movein_ep3', 2, 1, '@zeebello')),
      cm('post_tamara_movein_ep3', 3, 'favoureze', 'Five girls, one house, one gossip page. This is reality TV 😭', 2600),
    ],
  }),
  post({
    id: 'post_hauwa_doors_ep3',
    authorId: 'hauwa',
    unlockEpisode: 3,
    unlockSceneIndex: 2,
    timestamp: '6h ago',
    locationTag: 'Content House, Banana Island',
    caption: 'New house, new habit: I count the doors every night. Thirty-one. Every house tells you who it trusts by what it locks 🗝️🌿',
    hashtags: ['#Design', '#NewHome'],
    graphic: { type: 'wellness_flatlay', emoji: '🗝️', bgGradient: 'from-stone-600 via-stone-900 to-black', badgeLabel: 'DESIGN NOTES 🏛️', headline: 'THIRTY-ONE DOORS', subheadline: 'Hauwa Musa', tagLocation: 'BANANA ISLAND' },
    likesCount: 16800,
    comments: [
      cm('post_hauwa_doors_ep3', 1, 'nnamdi_oraekwe', 'Why is she counting doors 😳', 1100),
      cm('post_hauwa_doors_ep3', 2, 'zee', 'Thirty-two. You missed the archive.', 1700),
      cm('post_hauwa_doors_ep3', 3, 'hauwa', 'I didn’t miss it 🙂', 1500, reply('post_hauwa_doors_ep3', 3, 2, '@zeebello')),
    ],
  }),
  post({
    id: 'post_kelvin_night_ep3',
    authorId: 'kelvin',
    unlockEpisode: 3,
    unlockSceneIndex: 3,
    timestamp: '5h ago',
    locationTag: 'Ikoyi Link Bridge',
    caption: 'Some nights you drive just to think. 🌙',
    hashtags: [],
    graphic: { type: 'car_flex', characterId: 'kelvin', bgGradient: 'from-indigo-900 via-slate-900 to-black', badgeLabel: 'NIGHT DRIVE 🌙', headline: 'JUST TO THINK', subheadline: 'Kelvin Adebayo-Wright', tagLocation: 'IKOYI LINK BRIDGE' },
    likesCount: 54100,
    comments: [
      cm('post_kelvin_night_ep3', 1, 'miriam_chukwu', 'Thinking about WHO, Kelvin 👀', 3300),
      cm('post_kelvin_night_ep3', 2, 'zee', 'Thinking about returning my car charger.', 2800),
      cm('post_kelvin_night_ep3', 3, 'tari_briggs', 'Six words. He’s growing 😂', 1900),
    ],
  }),
  post({
    id: 'post_dayo_session_ep3',
    authorId: 'dayo',
    unlockEpisode: 3,
    unlockSceneIndex: 5,
    timestamp: '2:40 AM',
    locationTag: 'Surulere, Lagos',
    caption: 'Session at 3AM part 2. The city sleeps, the studio doesn’t. Someone on my phone keeps me awake too 🎛️',
    hashtags: ['#StudioLife'],
    graphic: { type: 'behind_lens', characterId: 'dayo', bgGradient: 'from-fuchsia-800 via-purple-950 to-black', badgeLabel: 'LIVE SESSION 🎛️', headline: '3AM PART 2', subheadline: 'Dayo Martins', tagLocation: 'SURULERE' },
    likesCount: 27700,
    comments: [
      cm('post_dayo_session_ep3', 1, 'simi_solanke', '“Someone on my phone” 👀👀', 2200),
      cm('post_dayo_session_ep3', 2, 'grace_okeke', 'Church boy in love is the best genre', 900),
      cm('post_dayo_session_ep3', 3, 'dayo', 'I meant my manager. Calm down, Lagos.', 1600, reply('post_dayo_session_ep3', 3, 1, '@simi_solanke')),
    ],
  }),

  /* ============================ Episode 4 ============================ */
  post({
    id: 'post_tea_warning_ep4',
    authorId: 'lagos_tea',
    unlockEpisode: 4,
    unlockSceneIndex: 2,
    unlockedByFlag: 'tea_warning_ep4',
    isTeaLeak: true,
    timestamp: 'Just now',
    locationTag: 'Content House • LIVE',
    caption: 'Somebody went shopping in a drawer that isn’t theirs 🫖 Keep your hands to yourself, Cinderella. Next time I post more than a dress.',
    hashtags: ['#TheLagosTea', '#Cinderella'],
    graphic: { type: 'tea_leak_receipt', bgGradient: 'from-neutral-950 via-rose-950 to-black', badgeLabel: 'WARNING 🫖', headline: 'HANDS OFF THE DRAWER', subheadline: 'A message for Cinderella', leakSource: 'CONTENT HOUSE • INTERNAL', leakFooterLeft: 'Time: 8:06 AM', leakFooterRight: 'Posted during breakfast' },
    clue: {
      kind: 'red_herring_tell',
      name: 'Breakfast Post Reflection',
      text: 'You zoomed into the post before the page cropped it. In the dark corner of the photo, reflected in the archive mirror, you can make out',
    },
    likesCount: 61200,
    comments: [
      cm('post_tea_warning_ep4', 1, 'miriam_chukwu', 'Posted at 8:06 AM?? Somebody is posting from the breakfast table 😳', 3800),
      cm('post_tea_warning_ep4', 2, 'kene_okoli', 'Drawer?? What drawer?? I need a map of this house', 2100),
      cm('post_tea_warning_ep4', 3, 'solomon_ekong', 'Cinderella went detective mode and the page is SCARED 👀', 2700),
    ],
  }),
  post({
    id: 'post_bisola_fine_ep4',
    authorId: 'bisola',
    unlockEpisode: 4,
    unlockSceneIndex: 1,
    timestamp: '1h ago',
    locationTag: 'Content House, Banana Island',
    caption: 'GOOD MORNING FAMILY!!! Slept like a baby, everything is FINE, life is BEAUTIFUL ☀️😁 New vlog at 6!!',
    hashtags: ['#GoodMorning', '#Blessed'],
    graphic: { type: 'vlog_thumbnail', characterId: 'bisola', bgGradient: 'from-yellow-400 via-orange-600 to-rose-900', badgeLabel: 'NEW VLOG ☀️', headline: 'EVERYTHING IS FINE', subheadline: 'Bisola Adeyemi', tagLocation: 'BANANA ISLAND' },
    likesCount: 33500,
    comments: [
      cm('post_bisola_fine_ep4', 1, 'folake_ade', 'Sis your eyes say you slept 2 hours 😭', 2400),
      cm('post_bisola_fine_ep4', 2, 'bisola', 'CONCEALER IS A LIE DETECTOR FOR NOTHING 😭', 1300, reply('post_bisola_fine_ep4', 2, 1, '@folake_ade')),
      cm('post_bisola_fine_ep4', 3, 'victor_osita', 'When someone says FINE in caps, they are not fine', 1900),
    ],
  }),
  post({
    id: 'post_paparazzi_okada_ep4',
    authorId: 'gidi_paparazzi',
    unlockEpisode: 4,
    unlockSceneIndex: 1,
    requiredFlag: 'chased_rider',
    timestamp: '40m ago',
    locationTag: 'Admiralty Way, Lekki',
    caption: 'SPOTTED 📸 Content House girl on the back of an OKADA at 6AM, screaming “follow that bike!” down Admiralty Way 😭 Banana Island don change #GidiSpotted',
    hashtags: ['#GidiSpotted', '#OkadaChase'],
    notifyText: 'posted a photo of you 📸',
    graphic: { type: 'car_flex', bgGradient: 'from-amber-600 via-orange-900 to-black', emoji: '🏍️', badgeLabel: 'SPOTTED 📸', headline: 'FOLLOW THAT BIKE!', subheadline: 'Admiralty Way, 6:07 AM', tagLocation: 'LEKKI' },
    likesCount: 71900,
    comments: [
      cm('post_paparazzi_okada_ep4', 1, 'kola_fashola', 'Not Cinderella in a Lagos action movie 😭😭', 5200),
      cm('post_paparazzi_okada_ep4', 2, 'tamara', 'Ada?? Why are you on an okada at 6am?? Call me 💚', 3100),
      cm('post_paparazzi_okada_ep4', 3, 'chidi', 'Helmet next time, please.', 2400),
    ],
  }),
  post({
    id: 'post_zee_owambe_ep4',
    authorId: 'zee',
    unlockEpisode: 4,
    unlockSceneIndex: 2,
    timestamp: '2h ago',
    locationTag: 'Banana Island, Lagos',
    caption: 'Mummy turns 60 on Saturday. Six hundred guests. Gold aso-ebi only. If you’re not wearing gold, you’re wearing the wrong thing 👑✨ #BelloAt60',
    hashtags: ['#BelloAt60', '#Owambe', '#AsoEbi'],
    notifyText: 'tagged you in the aso-ebi list 👑',
    graphic: { type: 'party_glam', characterId: 'zee', bgGradient: 'from-yellow-500 via-amber-700 to-neutral-950', badgeLabel: 'OWAMBE 👑', headline: 'BELLO AT 60', subheadline: 'Saturday • Civic Centre', tagLocation: 'VICTORIA ISLAND' },
    likesCount: 128700,
    comments: [
      cm('post_zee_owambe_ep4', 1, 'halima_bello', 'Mama Bello’s parties are national holidays 😭', 6100),
      cm('post_zee_owambe_ep4', 2, 'kelvin', 'I’m wearing black.', 4400),
      cm('post_zee_owambe_ep4', 3, 'zee', 'You’re wearing GOLD, Kelvin.', 5900, reply('post_zee_owambe_ep4', 3, 2, '@kelvin_wright')),
      cm('post_zee_owambe_ep4', 4, 'dayo', 'See you at the booth 🎧', 2200),
    ],
  }),
  post({
    id: 'post_chidi_redlight_ep4',
    authorId: 'chidi',
    unlockEpisode: 4,
    unlockSceneIndex: 3,
    timestamp: '3h ago',
    locationTag: 'Yaba, Lagos',
    caption: 'Some photos are for Gidigram. Some are just for the darkroom. 🎞️❤️',
    hashtags: ['#FilmPhotography', '#Darkroom'],
    variants: [{ flag: 'chidi_darkroom_moment', caption: 'Some photos are for Gidigram. Some are just for the darkroom. And some people make the darkroom feel bigger 🎞️❤️' }],
    graphic: { type: 'behind_lens', characterId: 'chidi', bgGradient: 'from-red-700 via-red-950 to-black', badgeLabel: 'DARKROOM 🎞️', headline: 'JUST FOR ME', subheadline: 'Chidi Nwosu', tagLocation: 'YABA' },
    likesCount: 24600,
    comments: [
      cm('post_chidi_redlight_ep4', 1, 'adaeze_nwosu', 'Who was in the darkroom, Chidi 👀', 1800),
      cm('post_chidi_redlight_ep4', 2, 'chidi', 'My chemicals. Strictly.', 1200, reply('post_chidi_redlight_ep4', 2, 1, '@adaeze_nwosu')),
      cm('post_chidi_redlight_ep4', 3, 'kelvin', 'Red is a strong colour.', 900),
    ],
  }),
  post({
    id: 'post_kelvin_bridge_ep4',
    authorId: 'kelvin',
    unlockEpisode: 4,
    unlockSceneIndex: 4,
    timestamp: '1h ago',
    locationTag: 'Third Mainland Bridge',
    caption: 'Third Mainland. Cold Chapman. Good company. 🌉',
    hashtags: [],
    graphic: { type: 'car_flex', characterId: 'kelvin', bgGradient: 'from-sky-900 via-indigo-950 to-black', badgeLabel: 'GOOD COMPANY 🌉', headline: 'THIRD MAINLAND', subheadline: 'Kelvin Adebayo-Wright', tagLocation: 'THIRD MAINLAND BRIDGE' },
    likesCount: 66300,
    comments: [
      cm('post_kelvin_bridge_ep4', 1, 'miriam_chukwu', '“Good company” from a man who hates everyone?? WHO 😭', 5100),
      cm('post_kelvin_bridge_ep4', 2, 'zee', 'That’s my Chapman.', 3400),
      cm('post_kelvin_bridge_ep4', 3, 'chidi', 'Drive safe.', 1100),
    ],
  }),
  post({
    id: 'post_dayo_booth_ep4',
    authorId: 'dayo',
    unlockEpisode: 4,
    unlockSceneIndex: 6,
    timestamp: '20m ago',
    locationTag: 'Civic Centre, Victoria Island',
    caption: 'Soundcheck for Saturday. Six hundred people, one booth, and a new song nobody has heard yet 🎧✨',
    hashtags: ['#BelloAt60', '#LiveSet'],
    soundSnippet: { title: 'Untitled (for Saturday)', artist: 'Dayo Martins' },
    graphic: { type: 'party_glam', characterId: 'dayo', bgGradient: 'from-violet-600 via-fuchsia-900 to-black', badgeLabel: 'SOUNDCHECK 🎧', headline: 'SATURDAY', subheadline: 'Civic Centre • Live set', tagLocation: 'VICTORIA ISLAND' },
    likesCount: 41800,
    comments: [
      cm('post_dayo_booth_ep4', 1, 'simi_solanke', 'A new song for WHO, Dayo 👀', 2600),
      cm('post_dayo_booth_ep4', 2, 'tamara', 'Producer of the year loading 💚', 1700),
      cm('post_dayo_booth_ep4', 3, 'bisola', 'Can I vlog the booth?? 😩', 1100),
    ],
  }),
  post({
    id: 'post_tamara_glow_ep4',
    authorId: 'tamara',
    unlockEpisode: 4,
    unlockSceneIndex: 7,
    timestamp: '4h ago',
    locationTag: 'Content House, Banana Island',
    caption: 'Glowing because I finally said yes to the right brand ✨ Skin that doesn’t lie. #ad #GlowRepublic',
    hashtags: ['#ad', '#GlowRepublic', '#SkinCare'],
    graphic: { type: 'luxe_portrait', characterId: 'tamara', bgGradient: 'from-amber-300 via-rose-500 to-neutral-950', badgeLabel: '#AD ✨', headline: 'SKIN THAT DOESN’T LIE', subheadline: 'Tamara x Glow Republic', tagLocation: 'BANANA ISLAND' },
    likesCount: 94200,
    comments: [
      cm('post_tamara_glow_ep4', 1, 'simi_solanke', 'Glow Republic?? Never heard of them but I’m buying 😭', 3300),
      cm('post_tamara_glow_ep4', 2, 'omowunmi_p', 'New brand, big budget. Somebody is spending 👀', 2100),
      cm('post_tamara_glow_ep4', 3, 'zee', 'Pretty.', 1800),
    ],
  }),
  post({
    id: 'post_hauwa_seeds_ep4',
    authorId: 'hauwa',
    unlockEpisode: 4,
    unlockSceneIndex: 8,
    timestamp: '3:12 AM',
    locationTag: 'Content House, Banana Island',
    caption: 'Whatever you bury in soil eventually comes back up. Seeds, keys, secrets. Water them carefully 🌱',
    hashtags: ['#3AMthoughts'],
    graphic: { type: 'wellness_flatlay', emoji: '🌱', bgGradient: 'from-lime-800 via-green-950 to-black', badgeLabel: '3AM THOUGHTS 🌱', headline: 'SEEDS, KEYS, SECRETS', subheadline: 'Hauwa Musa', tagLocation: 'BANANA ISLAND' },
    likesCount: 19900,
    comments: [
      cm('post_hauwa_seeds_ep4', 1, 'nnamdi_oraekwe', 'Hauwa posting at 3AM about buried keys. I’m not sleeping tonight 😳', 2400),
      cm('post_hauwa_seeds_ep4', 2, 'bisola', 'Why KEYS Hauwa 😭', 1500),
      cm('post_hauwa_seeds_ep4', 3, 'hauwa', 'Gardening metaphor, Bisola 🌿', 1300, reply('post_hauwa_seeds_ep4', 3, 2, '@bisola_vlogs')),
    ],
  }),
  post({
    id: 'post_chi_ndpa_ep4',
    authorId: 'chi',
    unlockEpisode: 4,
    unlockSceneIndex: 9,
    timestamp: '45m ago',
    locationTag: 'LAU Law Library',
    caption: 'Nigeria Data Protection Act, 2023. Look it up. Some accounts are about to learn that anonymous is not the same as untouchable ⚖️',
    hashtags: ['#NDPA', '#ForTheRecord'],
    graphic: { type: 'luxe_portrait', characterId: 'chi', bgGradient: 'from-slate-600 via-blue-950 to-black', badgeLabel: 'LEGAL NOTICE ⚖️', headline: 'NOT UNTOUCHABLE', subheadline: 'Chioma Eze', tagLocation: 'LAU LAW LIBRARY' },
    likesCount: 37400,
    comments: [
      cm('post_chi_ndpa_ep4', 1, 'kene_okoli', 'Barrister Chioma is going to WAR 🍿', 3100),
      cm('post_chi_ndpa_ep4', 2, 'lagos_tea', 'Cute PDF, Chioma 🫖', 4800),
      cm('post_chi_ndpa_ep4', 3, 'chi', 'See you in court.', 5200, reply('post_chi_ndpa_ep4', 3, 2, '@TheLagosTea')),
    ],
  }),
  post({
    id: 'post_tea_mama_ep4',
    authorId: 'lagos_tea',
    unlockEpisode: 4,
    unlockSceneIndex: 10,
    unlockedByFlag: 'tea_mama_post',
    isTeaLeak: true,
    timestamp: 'Just now',
    locationTag: 'Ajegunle, Lagos',
    caption: 'Saturday at the Owambe, Banana Island finally meets Cinderella’s mother 🫖👑 Front row seats for everyone.',
    hashtags: ['#TheLagosTea', '#BelloAt60', '#Cinderella'],
    graphic: { type: 'tea_leak_receipt', emoji: '🏪', bgGradient: 'from-sky-800 via-blue-950 to-black', badgeLabel: 'EXCLUSIVE 🫖', headline: 'CINDERELLA’S MOTHER', subheadline: 'Mama Ada Provisions, Ajegunle', leakSource: 'TAKEN THIS AFTERNOON', leakFooterLeft: 'Ajegunle, 3:40 PM', leakFooterRight: 'See you Saturday 👑' },
    likesCount: 143900,
    comments: [
      cm('post_tea_mama_ep4', 1, 'grace_okeke', 'Leave the woman’s MOTHER out of it. This is too far.', 9800),
      cm('post_tea_mama_ep4', 2, 'blessing_alabi', 'That’s Mama Ada!! She sold me bread on credit for 3 years 😭 Leave her alone', 7400),
      cm('post_tea_mama_ep4', 3, 'miriam_chukwu', 'I liked the gossip. I don’t like this.', 6100),
      cm('post_tea_mama_ep4', 4, 'tamara', 'Whoever you are, you just made the biggest mistake of your life.', 8800),
    ],
  }),
];
