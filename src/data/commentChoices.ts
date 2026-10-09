import { CharacterId, Meters } from '../types/vn';
import { SocialComment, SocialPost } from '../types/socialFeed';
import { GIDI_LIGHTWEIGHT_USERS, createLightweightComment } from './gidiUsers';
import { ARCHIVE_POSTS } from './archivePosts';
import { ARCHIVE_COMMENTS } from './archiveComments';
import { STORY_POST_COMMENTS } from './storyPostComments';

/* =========================================================================
   ADA'S COMMENTS ON GIDIGRAM
   Every post gives Ada about five things she could comment, written for
   that post and for where the story is when it appears. Her pick is saved
   once per post, moves her meters and people's trust (shown in their
   relationship profile), and pulls replies from Gidigram users and, when
   it makes sense, the cast.
   ========================================================================= */

type Cast = Exclude<CharacterId, 'heroine' | 'narrator'>;

/** A reply under Ada's comment. `by` is a cast id, 'lagos_tea', or a Gidigram user id from gidiUsers.ts */
export interface CommentReply {
  by: Cast | 'lagos_tea' | string;
  text: string;
  likes?: number;
}

export interface CommentChoice {
  id: string;
  /** Short chip label: the tone of the comment */
  label: string;
  /** What Ada actually posts */
  text: string;
  meters?: Partial<Meters>;
  /** Trust change per character (scaled like story choices) */
  trust?: Partial<Record<Cast, number>>;
  /** What that character remembers about it (relationship profile) */
  memory?: Partial<Record<Cast, string>>;
  replies: CommentReply[];
  /** Only offered when the player made this story choice */
  ifFlag?: string;
  /** Not offered when the player made this story choice */
  ifNotFlag?: string;
}

export const commentFlag = (postId: string, choiceId: string) => `cmt_${postId}__${choiceId}`;

/* ------------------------------ cast lookup ------------------------------ */
const CAST: Record<string, { name: string; handle: string; avatarType: string }> = {
  zee: { name: 'Zainab "Zee" Bello', handle: '@zeebello', avatarType: 'zee' },
  tamara: { name: 'Tamara Okonkwo-Reid', handle: '@tamara_reid', avatarType: 'tamara' },
  chi: { name: 'Chioma Eze', handle: '@chi_corporate_glam', avatarType: 'chi' },
  bisola: { name: 'Bisola Adeyemi', handle: '@bisola_vlogs', avatarType: 'bisola' },
  hauwa: { name: 'Hauwa Musa', handle: '@hauwa_mindbody', avatarType: 'hauwa' },
  chidi: { name: 'Chidi Nwosu', handle: '@chidi_captures', avatarType: 'chidi' },
  kelvin: { name: 'Kelvin Adebayo-Wright', handle: '@kelvin_wright', avatarType: 'kelvin' },
  dayo: { name: 'Dayo Martins', handle: '@dayomartins_sound', avatarType: 'dayo' },
  lagos_tea: { name: 'The Lagos Tea 🫖', handle: '@TheLagosTea', avatarType: 'lagos_tea' },
  heroine: { name: 'Ada Obi', handle: '@ada_obi', avatarType: 'heroine' },
};

export const isCastAuthor = (id: string) => id in CAST;

/** A comment by a cast member or a Gidigram user */
export function makeComment(by: string, text: string, id: string, extra: Partial<SocialComment> = {}): SocialComment {
  const cast = CAST[by];
  if (cast) {
    return {
      id,
      authorId: by,
      authorName: cast.name,
      authorHandle: cast.handle,
      isVerified: by !== 'heroine',
      avatarType: cast.avatarType,
      text,
      likes: 40,
      timestamp: 'Just now',
      ...extra,
    };
  }
  return createLightweightComment(id, by in GIDI_LIGHTWEIGHT_USERS ? by : 'favoureze', text, { timestamp: 'Just now', ...extra });
}

/** Ada's comment and the replies it gets, as a thread */
export function buildAdaThread(postId: string, choice: CommentChoice, adaName: string): SocialComment[] {
  const adaId = `ada_cmt_${postId}`;
  const ada: SocialComment = {
    id: adaId,
    authorId: 'heroine',
    authorName: `${adaName} Obi`,
    authorHandle: '@ada_obi',
    isVerified: false,
    avatarType: 'heroine',
    text: choice.text,
    likes: 24 + choice.replies.length * 37,
    isLiked: true,
    timestamp: 'Just now',
  };
  const replies = choice.replies.map((r, i) =>
    makeComment(r.by, r.text, `${adaId}_r${i}`, {
      parentCommentId: adaId,
      replyToHandle: '@ada_obi',
      likes: r.likes ?? 8 + ((i * 29) % 90),
    })
  );
  return [ada, ...replies];
}

/* =========================================================================
   COMMENT CHOICES PER POST
   ========================================================================= */
export const COMMENT_CHOICES: Record<string, CommentChoice[]> = {
  /* ---------------------------- Episode 1 ---------------------------- */
  post_zee_birthday: [
    {
      id: 'royal',
      label: 'Wish her well 🎂',
      text: 'Happy 21st, Zee! May this year be as loud as your entrance 👑',
      meters: { popularity: 1, loyalty: 1 },
      trust: { zee: 4 },
      memory: { zee: 'You wished her a happy 21st on Gidigram before you even met her.' },
      replies: [
        { by: 'zeebello_fan', text: 'Who is this? 👀' },
        { by: 'miriam_chukwu', text: 'Sweet. Is she even on the list? 😂' },
      ],
    },
    {
      id: 'guestlist',
      label: 'Joke about the list 😂',
      text: 'The guest list has more security than CBN 😭 Happy birthday sha!',
      meters: { popularity: 3 },
      trust: { zee: -1, bisola: 2 },
      replies: [
        { by: 'bisola', text: 'CBN COULD NEVER 😭😭' },
        { by: 'kene_okoli', text: 'Not wrong. They checked my aunty’s ID twice.' },
        { by: 'favoureze', text: 'The way I laughed 😂' },
      ],
    },
    {
      id: 'tamara_plus_one',
      label: 'Tease Tamara 💚',
      text: 'Somebody’s plus-one is about to outshine the birthday cake 😌💚 @tamara_reid',
      meters: { popularity: 2, jealousy: 2 },
      trust: { tamara: 4, zee: -3 },
      memory: { tamara: 'You hyped her up as her mystery plus-one on Zee’s birthday post.', zee: 'You turned her birthday post into Tamara’s moment.' },
      replies: [
        { by: 'tamara', text: 'SHHH you’re supposed to be a surprise 😭💚' },
        { by: 'anita_nwosu', text: 'So the mystery plus-one has an account 👀' },
        { by: 'zee', text: '🙂' },
      ],
    },
    {
      id: 'scroll',
      label: 'Just like it ❤️',
      text: '❤️',
      meters: { reputation: 1 },
      replies: [{ by: 'segun_bakare', text: 'A woman of few words 😂' }],
    },
    {
      id: 'shade',
      label: 'Throw shade 💀',
      text: 'Velvet guest list for a party everyone will livestream anyway 💀',
      meters: { popularity: 4, jealousy: 3, reputation: -2 },
      trust: { zee: -6, bisola: 1 },
      memory: { zee: 'You mocked her birthday guest list in public before you even arrived.' },
      replies: [
        { by: 'zee', text: 'And yet here you are. Commenting. 🙂' },
        { by: 'miriam_chukwu', text: 'OHHHH 😭 who is this brave girl' },
        { by: 'tari_briggs', text: 'Zee will remember this one.' },
      ],
    },
  ],

  post_tamara_glam: [
    {
      id: 'sister',
      label: 'Hype her 💚',
      text: 'Tamara you’re doing too much and I love it 😭💚 Real sister energy.',
      meters: { loyalty: 2 },
      trust: { tamara: 5 },
      memory: { tamara: 'You called her your sister on her emerald post.' },
      replies: [
        { by: 'tamara', text: 'Too much is my love language 💚😘' },
        { by: 'blessing_alabi', text: 'Ajegunle to Lekki friendship is real o' },
      ],
    },
    {
      id: 'traffic',
      label: 'Joke about traffic 🚗',
      text: 'Lekki traffic tried to humble you and lost 😂 the G-Wagon was not playing',
      meters: { popularity: 2 },
      trust: { tamara: 3 },
      replies: [
        { by: 'tamara', text: 'The G-Wagon has trauma from Admiralty Way 😭' },
        { by: 'chuka_enemuo', text: 'Lekki traffic humbles everyone except oil money 😂' },
      ],
    },
    {
      id: 'nervous',
      label: 'Admit nerves 😬',
      text: 'Lowkey nervous. Don’t let me trip in this dress tonight 😭',
      meters: { reputation: 1, loyalty: 1 },
      trust: { tamara: 4, hauwa: 1 },
      memory: { tamara: 'You told her you were nervous, and trusted her to catch you.' },
      replies: [
        { by: 'tamara', text: 'If you trip I’m falling with you. Matching bruises 💚' },
        { by: 'hauwa', text: 'Walk slowly. Rooms make space for people who don’t rush 🌿' },
      ],
    },
    {
      id: 'label',
      label: 'Ask about the dress 👗',
      text: 'Who styled the styler? Asking for the girl wearing it 👀',
      meters: { popularity: 1 },
      trust: { tamara: 2 },
      replies: [
        { by: 'simi_solanke', text: 'It’s archival Okonkwo-Reid silk. You’re wearing history 😩' },
        { by: 'favoureze', text: 'So it’s YOU in the emerald?!' },
      ],
    },
    {
      id: 'distance',
      label: 'Keep it low-key 🤐',
      text: 'Please don’t tag me tonight. I just want to blend in 🙏',
      meters: { reputation: 2, popularity: -1 },
      trust: { tamara: -2 },
      memory: { tamara: 'You asked her not to tag you, like you were ashamed to be seen with her crowd.' },
      replies: [
        { by: 'tamara', text: 'Blend in?? In emerald?? Babe 😭' },
        { by: 'miriam_chukwu', text: 'A mystery girl who wants to stay a mystery. Interesting 👀' },
      ],
    },
  ],

  post_bisola_vlog: [
    {
      id: 'hype',
      label: 'Hype the vlog 🎥',
      text: 'Front row seat to the drama and the cameras ready?? I’m watching the full vlog 🍿',
      meters: { popularity: 2 },
      trust: { bisola: 4 },
      memory: { bisola: 'You promised to watch her full vlog.' },
      replies: [
        { by: 'bisola', text: 'A REAL ONE 😭💖 vlog drops at midnight' },
        { by: 'folake_ade', text: 'Bisola’s vlogs are better than Netflix this month' },
      ],
    },
    {
      id: 'blur',
      label: 'Ask for privacy 🙏',
      text: 'Love you, but please blur people who didn’t ask to be on camera 🙏',
      meters: { reputation: 3 },
      trust: { bisola: -2, chi: 3, hauwa: 2 },
      memory: { bisola: 'You told her to blur faces, in front of her followers.', chi: 'You backed her NDA point on Bisola’s vlog.' },
      replies: [
        { by: 'chi', text: 'Thank you. Finally someone with sense.' },
        { by: 'bisola', text: 'Blurring is not content 😩 but fine. FINE.' },
        { by: 'folake_ade', text: 'She’s right though. Bisola never blurs.' },
      ],
    },
    {
      id: 'auntie',
      label: 'Ask the tea 👀',
      text: 'Who borrowed jewelry from their auntie?? Don’t leave us hanging 😭',
      meters: { popularity: 3, suspicion: 2 },
      trust: { bisola: 3 },
      replies: [
        { by: 'bisola', text: 'My lawyer (Chioma) says I can’t say 🤐😂' },
        { by: 'chi', text: 'I am NOT your lawyer.' },
        { by: 'anita_nwosu', text: 'The auntie jewelry gist is for the vlog. Patience!' },
      ],
    },
    {
      id: 'uninvited',
      label: 'Defend the uninvited 🫂',
      text: 'Whoever got uninvited this morning, your seat at my table is still open 🫂',
      meters: { reputation: 2, loyalty: 1 },
      trust: { hauwa: 2, bisola: 1 },
      replies: [
        { by: 'blessing_alabi', text: 'This is the kindest comment on this app today' },
        { by: 'hauwa', text: '🌿' },
      ],
    },
    {
      id: 'skip',
      label: 'Roll eyes 🙄',
      text: 'Some of us just want to eat small chops in peace 🙄',
      meters: { popularity: 1, jealousy: 1 },
      trust: { bisola: -3 },
      memory: { bisola: 'You rolled your eyes at her vlog before the party.' },
      replies: [
        { by: 'bisola', text: 'Small chops are ALSO content babe 🙄' },
        { by: 'kola_fashola', text: 'She said what she said 😂' },
      ],
    },
  ],

  post_chidi_film: [
    {
      id: 'real',
      label: 'Talk honest photos 📸',
      text: 'Honest portraits at a party built on flash? Bold mission. Good luck finding one 😌',
      meters: { reputation: 1 },
      trust: { chidi: 4 },
      memory: { chidi: 'You understood what he meant about honest portraits.' },
      replies: [
        { by: 'chidi', text: 'Found one already, I think. Ask me later 😌' },
        { by: 'ngozi_uche', text: 'The way he replied 👀' },
      ],
    },
    {
      id: 'flirt',
      label: 'Flirt 😏',
      text: 'And who takes portraits of the photographer? 😏',
      meters: { romanceChidi: 4 },
      trust: { chidi: 3 },
      replies: [
        { by: 'chidi', text: 'Nobody. Applications are open 😅' },
        { by: 'adaeze_nwosu', text: 'CHIDI IS BLUSHING THROUGH THE SCREEN' },
        { by: 'kelvin', text: '🙄' },
      ],
    },
    {
      id: 'film',
      label: 'Nerd out 🎞️',
      text: '35mm in Banana Island lighting? Pushing Tri-X or praying? 😂',
      meters: { popularity: 1 },
      trust: { chidi: 3 },
      replies: [
        { by: 'chidi', text: 'Both. Mostly praying 😂' },
        { by: 'ngozi_uche', text: 'Finally someone who knows film on this app 🙌' },
      ],
    },
    {
      id: 'camera_shy',
      label: 'Ask to stay off camera 🙈',
      text: 'If you see a girl in green trying to hide, please let her hide 🙈',
      meters: { reputation: 2 },
      trust: { chidi: 4 },
      memory: { chidi: 'You asked him, half joking, to keep you out of his shots.' },
      replies: [
        { by: 'chidi', text: 'No promises. Real people are the whole point.' },
        { by: 'miriam_chukwu', text: 'Girl in green?? 👀👀' },
      ],
    },
    {
      id: 'kelvin_side',
      label: 'Side with Kelvin 🥃',
      text: 'Kelvin has a point. Some angles cost more than a camera 👀',
      meters: { romanceKelvin: 2, romanceChidi: -2 },
      trust: { chidi: -3, kelvin: 3 },
      memory: { chidi: 'You took Kelvin’s side under his post.', kelvin: 'You agreed with him on Chidi’s post.' },
      replies: [
        { by: 'kelvin', text: 'Smart girl.' },
        { by: 'chidi', text: 'Noted.' },
      ],
    },
  ],

  post_kelvin_luxe: [
    {
      id: 'genuine',
      label: 'Call him out 😏',
      text: '“Who is genuine and who is playing a part” says the man who arrived by speedboat 😂',
      meters: { popularity: 3, romanceKelvin: 3 },
      trust: { kelvin: 4 },
      memory: { kelvin: 'You roasted his speedboat entrance and he liked it.' },
      replies: [
        { by: 'kelvin', text: 'The boat is genuine. I’m the one playing a part 😏' },
        { by: 'tari_briggs', text: 'Kelvin replying to comments?? Who is this?' },
      ],
    },
    {
      id: 'view',
      label: 'Compliment the view 🌅',
      text: 'The lagoon is doing all the work in this photo 😌',
      meters: { romanceKelvin: 2 },
      trust: { kelvin: 2 },
      replies: [
        { by: 'kelvin', text: 'The lagoon and I are a team.' },
        { by: 'daniel_okafor', text: 'The Riva is doing some work too' },
      ],
    },
    {
      id: 'ladder',
      label: 'Push back 🪜',
      text: 'Some of us are climbing a ladder because we weren’t born at the top of it 🙂',
      meters: { reputation: 4, romanceKelvin: 2 },
      trust: { kelvin: 3, hauwa: 2 },
      memory: { kelvin: 'You pushed back on his “people climbing the ladder” caption.' },
      replies: [
        { by: 'kelvin', text: 'Fair. Climb faster then. I’ll be at the top 🥃' },
        { by: 'blessing_alabi', text: 'SHE SAID IT 👏👏' },
        { by: 'hauwa', text: 'Well said.' },
      ],
    },
    {
      id: 'zee_jab',
      label: 'Side with Zee 👑',
      text: 'Don’t interrogate your sister’s guests o 😂 let us enjoy',
      meters: { popularity: 1 },
      trust: { zee: 3, kelvin: -1 },
      replies: [
        { by: 'zee', text: 'Finally. Someone with manners.' },
        { by: 'kelvin', text: 'Two against one. Unfair.' },
      ],
    },
    {
      id: 'ignore',
      label: 'Just like it ❤️',
      text: '🌊',
      meters: { romanceKelvin: 1 },
      replies: [{ by: 'chinedu_ubah', text: 'The wave emoji is doing a lot 😂' }],
    },
  ],

  post_lagos_tea_leak_ep1: [
    {
      id: 'clapback',
      label: 'Clap back 💅',
      text: 'Keep my name out of your teacup. At least my fees are going to a degree 💅',
      meters: { popularity: 5, reputation: 1, suspicion: 2 },
      trust: { tamara: 2, bisola: 2 },
      replies: [
        { by: 'lagos_tea', text: 'Aww, Cinderella speaks 🫖💋' },
        { by: 'amara_dike', text: 'ADA FOR PRESIDENT' },
        { by: 'bisola', text: 'SHE SAID WHAT SHE SAID 😭🔥' },
      ],
    },
    {
      id: 'dignity',
      label: 'Stay dignified 🙏',
      text: 'I work three jobs and I’m not ashamed of one of them. Have a good night.',
      meters: { reputation: 6, loyalty: 2 },
      trust: { hauwa: 4, chidi: 3, tamara: 2 },
      memory: { hauwa: 'You answered the leak with dignity instead of anger.', chidi: 'You didn’t hide from the leak. He noticed.' },
      replies: [
        { by: 'hauwa', text: 'This is how it’s done 🌿' },
        { by: 'chidi', text: '👏' },
        { by: 'kene_okoli', text: 'Respect. Hard work is not a scandal.' },
      ],
    },
    {
      id: 'bursary',
      label: 'Ask about the records 🧾',
      text: 'How did you get my bursary records? That’s not gossip, that’s a data breach.',
      meters: { suspicion: 5, reputation: 2 },
      trust: { chi: 2, chidi: 2 },
      replies: [
        { by: 'kene_okoli', text: 'She’s right. NDPA violation. Somebody inside the bursary talked.' },
        { by: 'lagos_tea', text: 'A little birdie with access 🐦🗂️' },
        { by: 'chi', text: 'Screenshot everything, Ada.' },
      ],
    },
    {
      id: 'insider',
      label: 'Call out the insider 👀',
      text: 'That photo was taken from INSIDE the party. Whoever you are, you were close enough to touch.',
      meters: { suspicion: 6, popularity: 2 },
      trust: { zee: -2, tamara: 1 },
      replies: [
        { by: 'miriam_chukwu', text: 'OMO. The call is coming from inside the mansion 😳' },
        { by: 'zee', text: 'Nobody at MY party would do this.' },
        { by: 'lagos_tea', text: 'Close enough to taste the cake 🎂😘' },
      ],
    },
    {
      id: 'silence',
      label: 'Say nothing 🤐',
      text: '…',
      meters: { reputation: 1, popularity: -2 },
      replies: [
        { by: 'lekki_insider_user', text: 'Silence means guilty 🤭' },
        { by: 'blessing_alabi', text: 'Leave her alone abeg. Who does this to a student?' },
      ],
    },
  ],

  post_tamara_tags_ada: [
    {
      id: 'thanks',
      label: 'Thank her 💚',
      text: 'You dressed me AND hyped me? I owe you my whole life 😭💚',
      meters: { loyalty: 3 },
      trust: { tamara: 5 },
      memory: { tamara: 'You thanked her in public for the emerald gown.' },
      replies: [
        { by: 'tamara', text: 'You owe me one dance at your wedding 💚' },
        { by: 'blessing_alabi', text: 'This friendship is goals' },
      ],
    },
    {
      id: 'chi_reply',
      label: 'Answer Chioma ⚖️',
      text: '@chi_corporate_glam It’s a gift from my sister. Next question 💚',
      meters: { popularity: 3, jealousy: 2 },
      trust: { tamara: 4, chi: -4 },
      memory: { chi: 'You shut her down under Tamara’s post.', tamara: 'You backed her up against Chioma.' },
      replies: [
        { by: 'chi', text: 'Noted, “sister”.' },
        { by: 'anita_nwosu', text: 'The tension in this comment section 😭' },
        { by: 'tamara', text: '💚💚💚' },
      ],
    },
    {
      id: 'hauwa',
      label: 'Thank Hauwa 🌿',
      text: '@hauwa_mindbody thank you 🌿 green is growing on me',
      meters: { reputation: 1 },
      trust: { hauwa: 4 },
      memory: { hauwa: 'You answered her kind comment under Tamara’s post.' },
      replies: [{ by: 'hauwa', text: 'Growth looks good on you.' }],
    },
    {
      id: 'humble',
      label: 'Stay humble 🙏',
      text: 'It’s the dress doing everything. I’m just the hanger 😂',
      meters: { reputation: 2 },
      trust: { tamara: 1, bisola: 1 },
      replies: [
        { by: 'bisola', text: 'The hanger is EATING 😭' },
        { by: 'tamara', text: 'Stop it. You ate.' },
      ],
    },
    {
      id: 'cocky',
      label: 'Own it 💅',
      text: 'Emerald season is MY season now. Sorry ladies 💅',
      meters: { popularity: 4, jealousy: 4 },
      trust: { tamara: 2, zee: -3, chi: -2 },
      memory: { zee: 'You declared it “your season” at her birthday.' },
      replies: [
        { by: 'miriam_chukwu', text: 'She’s not playing 👀' },
        { by: 'zee', text: 'It’s my birthday, darling.' },
      ],
    },
  ],

  post_bisola_thrift: [
    {
      id: 'bold',
      label: 'Bold, obviously 🖤',
      text: 'Bold. Thrift is just couture with a past 🖤',
      meters: { popularity: 4, reputation: 2 },
      trust: { bisola: 2, hauwa: 3 },
      memory: { hauwa: 'You owned your thrift dress with pride.' },
      replies: [
        { by: 'bisola', text: 'COUTURE WITH A PAST?? Putting that in the vlog 😭' },
        { by: 'hauwa', text: 'Beautifully put.' },
      ],
    },
    {
      id: 'price',
      label: 'Drop the price 💸',
      text: '₦4,500 at Yaba market and it still got more comments than some Gucci 😂',
      meters: { popularity: 5 },
      trust: { bisola: 3 },
      replies: [
        { by: 'bisola', text: '₦4,500?!?! I’m crying 😭😭' },
        { by: 'sam_adeyemi', text: 'Yaba market stays winning' },
        { by: 'zee', text: 'It shows.' },
      ],
    },
    {
      id: 'question',
      label: 'Question the poll 🙄',
      text: '“Bold or broke” is a wild poll for a vlogger with a sponsored lease 🙂',
      meters: { popularity: 3, jealousy: 3 },
      trust: { bisola: -5 },
      memory: { bisola: 'You threw her sponsored apartment back at her in public.' },
      replies: [
        { by: 'bisola', text: 'Ouch. OK. Fair. 😐' },
        { by: 'folake_ade', text: 'The way she knew about the lease 😳' },
      ],
    },
    {
      id: 'laugh',
      label: 'Laugh it off 😂',
      text: 'Broke AND bold. Both can be true 😂',
      meters: { popularity: 3, reputation: 1 },
      trust: { bisola: 2 },
      replies: [
        { by: 'chuka_enemuo', text: 'Most honest girl on this app' },
        { by: 'bisola', text: 'The self-awareness 😭💖' },
      ],
    },
    {
      id: 'tamara',
      label: 'Thank Tamara 💚',
      text: '@tamara_reid thank you for backing me even when I said no to your gown 💚',
      meters: { loyalty: 3 },
      trust: { tamara: 5 },
      memory: { tamara: 'You thanked her for defending your thrift dress.' },
      replies: [{ by: 'tamara', text: 'Always. Even when you’re stubborn 💚' }],
    },
  ],

  post_chi_subtweet: [
    {
      id: 'own_it',
      label: 'Own the clapback 😌',
      text: 'Confidence also doesn’t need to subtweet 😌',
      meters: { popularity: 4, jealousy: 3 },
      trust: { chi: -5, bisola: 2 },
      memory: { chi: 'You answered her subtweet in her own comments.' },
      replies: [
        { by: 'bisola', text: 'I need a lie down 😭🍿' },
        { by: 'chi', text: 'Who said it was about you?' },
        { by: 'anita_nwosu', text: 'Round two!!' },
      ],
    },
    {
      id: 'peace',
      label: 'Make peace 🤝',
      text: 'I came on too strong earlier. Truce? 🤝',
      meters: { reputation: 3, loyalty: 2 },
      trust: { chi: 5, hauwa: 2 },
      memory: { chi: 'You offered her a truce in public after the party clapback.' },
      replies: [
        { by: 'chi', text: '…Truce. For now.' },
        { by: 'hauwa', text: 'Grown.' },
      ],
    },
    {
      id: 'borrow',
      label: 'Joke about borrowing 😂',
      text: 'Borrowing is how scholarship kids survive. Sharing is caring 😂',
      meters: { popularity: 3, reputation: 2 },
      trust: { chi: -1, tamara: 2 },
      replies: [
        { by: 'kene_okoli', text: 'The humour is undefeated' },
        { by: 'chi', text: 'Cute.' },
      ],
    },
    {
      id: 'ask',
      label: 'Ask who it’s about 👀',
      text: 'Who hurt you, Barrister? 👀',
      meters: { popularity: 2 },
      trust: { chi: -2 },
      replies: [
        { by: 'chi', text: 'Billable hours, Ada. Billable hours.' },
        { by: 'bisola', text: '😭😭' },
      ],
    },
    {
      id: 'ignore',
      label: 'Leave it 🤐',
      text: '🙂',
      meters: { reputation: 2 },
      trust: { chi: 1 },
      replies: [{ by: 'amara_dike', text: 'The smile emoji is a full sentence' }],
    },
  ],

  /* ---------------------------- Episode 2 ---------------------------- */
  post_zee_statement_ep2: [
    {
      id: 'support',
      label: 'Back Zee 👑',
      text: 'Thank you for taking it seriously, Zee. What happened to me wasn’t gossip.',
      meters: { loyalty: 2, reputation: 2 },
      trust: { zee: 5 },
      memory: { zee: 'You backed her legal statement in public after the leak.' },
      replies: [
        { by: 'zee', text: 'My house, my rules. Nobody humiliates my guests.' },
        { by: 'david_obi', text: 'Zee and Ada on the same side?? Plot twist' },
      ],
    },
    {
      id: 'inside',
      label: 'Agree with Kelvin 🕵️',
      text: 'Kelvin is right. Lawyers won’t help if the leak came from inside your circle.',
      meters: { suspicion: 4 },
      trust: { kelvin: 3, zee: -3 },
      memory: { zee: 'You suggested in public that the leak came from her circle.' },
      replies: [
        { by: 'kelvin', text: 'At least someone listens.' },
        { by: 'zee', text: 'Careful, Ada.' },
        { by: 'nnamdi_oraekwe', text: 'The plot is thickening' },
      ],
    },
    {
      id: 'ip',
      label: 'Question the IP notice 🧐',
      text: 'An IP notice? The photo isn’t yours, Zee. It’s mine.',
      meters: { reputation: 3, popularity: 2 },
      trust: { zee: -2, chi: 3 },
      replies: [
        { by: 'chi', text: 'Technically correct. The best kind of correct.' },
        { by: 'zee', text: 'My party. My IP. Don’t overthink it.' },
      ],
    },
    {
      id: 'thank_legal',
      label: 'Ask for help 🤝',
      text: 'If your lawyers find who pulled my bursary file, I want to know first.',
      meters: { suspicion: 3, loyalty: 1 },
      trust: { zee: 2 },
      replies: [
        { by: 'zee', text: 'DM me.' },
        { by: 'david_obi', text: 'The bursary angle is the real scandal tbh' },
      ],
    },
    {
      id: 'eye_roll',
      label: 'Roll eyes 🙄',
      text: '“Real queens don’t engage” says the 400-word statement 🙄',
      meters: { popularity: 5, jealousy: 3, reputation: -2 },
      trust: { zee: -6, bisola: 1 },
      memory: { zee: 'You mocked her official statement in public.' },
      replies: [
        { by: 'miriam_chukwu', text: 'NOT THE WORD COUNT 😭' },
        { by: 'zee', text: 'I’ll remember this one, Ajegunle.' },
      ],
    },
  ],

  post_tea_ep2_metadata: [
    {
      id: 'two_phones',
      label: 'Call the bluff 💅',
      text: 'Half of Lagos has two phones. One for MTN, one for Glo. Try harder 💅',
      meters: { popularity: 5, suspicion: 1 },
      trust: { bisola: 3, chi: 2 },
      replies: [
        { by: 'lagos_tea', text: 'Glo? In this economy? 🫖😂' },
        { by: 'demola_shonowo', text: 'She’s right, my uncle has three' },
        { by: 'bisola', text: 'THANK YOU 😭' },
      ],
    },
    {
      id: 'exif',
      label: 'Talk metadata 🧾',
      text: 'Deleting EXIF doesn’t delete the lens. That shot came from a real camera, not a phone.',
      meters: { suspicion: 6, reputation: 2 },
      trust: { chidi: 3 },
      memory: { chidi: 'You used his metadata point against Lagos Tea in public.' },
      replies: [
        { by: 'nnamdi_oraekwe', text: 'Wait… so who at the party had a real camera? 👀' },
        { by: 'chidi', text: 'Careful what you post, Ada.' },
        { by: 'lagos_tea', text: 'Smart girl. Not smart enough 🫖' },
      ],
    },
    {
      id: 'bisola',
      label: 'Defend Bisola 🫂',
      text: 'Leave Bisola out of this. Two phones isn’t a crime.',
      meters: { loyalty: 3 },
      trust: { bisola: 6 },
      memory: { bisola: 'You defended her in public when Lagos Tea hinted about the two phones.' },
      replies: [
        { by: 'bisola', text: 'I could cry. Thank you 😭💖' },
        { by: 'folake_ade', text: 'Ada is a real one fr' },
      ],
    },
    {
      id: 'chi',
      label: 'Point at Chioma 👉',
      text: 'Funny. I know someone with a corporate phone AND a personal one 👀',
      meters: { suspicion: 4, jealousy: 3 },
      trust: { chi: -6 },
      memory: { chi: 'You hinted in public that she was the one with two phones.' },
      replies: [
        { by: 'chi', text: 'Say my name with your chest, Ada.' },
        { by: 'demola_shonowo', text: 'Ohhhhh 😳' },
      ],
    },
    {
      id: 'ignore',
      label: 'Don’t feed it 🤐',
      text: 'Not feeding this page any more engagement. Bye 👋',
      meters: { reputation: 3, popularity: -1 },
      trust: { hauwa: 3 },
      replies: [
        { by: 'hauwa', text: 'The only winning move 🌿' },
        { by: 'lagos_tea', text: 'You just did, babe 🫖' },
      ],
    },
  ],

  post_paparazzi_porsche: [
    {
      id: 'lunch',
      label: 'It was just lunch 🍽️',
      text: 'It was lunch. I ate jollof. Calm down, Lagos 😂',
      meters: { popularity: 4 },
      trust: { kelvin: 2 },
      ifFlag: 'drove_with_kelvin',
      replies: [
        { by: 'kelvin', text: 'She also ate my fries.' },
        { by: 'miriam_chukwu', text: 'HE’S REPLYING?! 😭' },
      ],
    },
    {
      id: 'walked',
      label: 'Set it straight 🚶‍♀️',
      text: 'I literally walked away from that car. Check the next frame 🚶‍♀️',
      meters: { reputation: 4 },
      trust: { kelvin: -1, chidi: 2 },
      ifFlag: 'refused_kelvin_ride',
      replies: [
        { by: 'halima_bello', text: 'She really said no to a Porsche 😳' },
        { by: 'kelvin', text: 'She did. Painfully.' },
      ],
    },
    {
      id: 'upgrade',
      label: 'Lean in 😏',
      text: 'Upgrade. Obviously 😏🏎️',
      meters: { popularity: 6, jealousy: 5, romanceKelvin: 3, romanceChidi: -3 },
      trust: { kelvin: 4, zee: -4, chidi: -3 },
      memory: { kelvin: 'You called the Porsche photo an “upgrade”.', zee: 'You flaunted her brother on Gidigram.', chidi: 'You leaned into the Porsche rumours.' },
      replies: [
        { by: 'kelvin', text: '😏' },
        { by: 'zee', text: 'Kelvin. Call me. Again.' },
        { by: 'chidi', text: '…' },
      ],
    },
    {
      id: 'setup',
      label: 'Call it a setup 🎯',
      text: 'Funny how the paparazzi knew exactly which gate to wait at 🤔',
      meters: { suspicion: 5 },
      trust: { kelvin: -2 },
      replies: [
        { by: 'tari_briggs', text: 'Somebody tipped them off. 100%.' },
        { by: 'kelvin', text: 'Not me. I hate paparazzi.' },
      ],
    },
    {
      id: 'zee',
      label: 'Reassure Zee 🙏',
      text: '@zeebello nothing to worry about, I promise.',
      meters: { loyalty: 2 },
      trust: { zee: 4 },
      memory: { zee: 'You reassured her in public about the Porsche photo.' },
      replies: [{ by: 'zee', text: 'We’ll talk.' }],
    },
  ],

  post_kelvin_wing: [
    {
      id: 'thanks',
      label: 'Thank him 🥃',
      text: 'Under your wing, but on my own feet 🙂',
      meters: { romanceKelvin: 4, reputation: 2 },
      trust: { kelvin: 4 },
      memory: { kelvin: 'You told him you’d stand under his wing on your own feet.' },
      replies: [
        { by: 'kelvin', text: 'Best kind of company.' },
        { by: 'uche_madu', text: 'Kelvin is IN LOVE in public?? 😳' },
      ],
    },
    {
      id: 'tease',
      label: 'Tease him 😏',
      text: 'Since when does Kelvin write captions? Who stole your phone? 😂',
      meters: { romanceKelvin: 3, popularity: 2 },
      trust: { kelvin: 3, zee: 1 },
      replies: [
        { by: 'zee', text: 'Thank you!! That’s what I said 🙄' },
        { by: 'kelvin', text: 'I contain multitudes.' },
      ],
    },
    {
      id: 'careful',
      label: 'Keep distance 🤚',
      text: 'Appreciate it, but I don’t need protection. I need answers.',
      meters: { reputation: 4, romanceKelvin: -1 },
      trust: { kelvin: 1, chidi: 2 },
      replies: [
        { by: 'kelvin', text: 'Then you’ll need both.' },
        { by: 'anita_nwosu', text: 'Ouch. Respectfully.' },
      ],
    },
    {
      id: 'view',
      label: 'Compliment VI 🌃',
      text: 'VI does look different from up there. Thank you for tonight ✨',
      meters: { romanceKelvin: 5, jealousy: 2 },
      trust: { kelvin: 4, chidi: -2 },
      replies: [
        { by: 'kelvin', text: 'Anytime.' },
        { by: 'tari_briggs', text: '“Tonight” 👀👀' },
      ],
    },
    {
      id: 'skip',
      label: 'Just like it ❤️',
      text: '🥃',
      meters: { romanceKelvin: 1 },
      replies: [{ by: 'halima_bello', text: 'The emoji language between these two 😭' }],
    },
  ],

  post_chidi_truth: [
    {
      id: 'patient',
      label: 'Agree 🎞️',
      text: 'I can wait for the truth. I just want to see it develop with you.',
      meters: { romanceChidi: 4, loyalty: 2 },
      trust: { chidi: 5 },
      memory: { chidi: 'You told him you’d wait for the truth to develop with him.' },
      replies: [
        { by: 'chidi', text: 'Darkroom’s open tomorrow.' },
        { by: 'ngozi_uche', text: 'This is the softest comment section on Gidigram' },
      ],
    },
    {
      id: 'poet',
      label: 'Tease the poet 😂',
      text: 'Okay Wole Soyinka 😂',
      meters: { romanceChidi: 2, popularity: 2 },
      trust: { chidi: 2, tamara: 1 },
      replies: [
        { by: 'tamara', text: 'THANK YOU 😭' },
        { by: 'chidi', text: 'Every photographer is a failed poet. Leave me.' },
      ],
    },
    {
      id: 'roll',
      label: 'Ask about the film 👀',
      text: 'What’s on that roll, Chidi? 👀',
      meters: { suspicion: 4 },
      trust: { chidi: 1 },
      replies: [
        { by: 'nnamdi_oraekwe', text: 'Asking the real question' },
        { by: 'chidi', text: 'Mostly cake and bad lighting. Mostly.' },
      ],
    },
    {
      id: 'thanks',
      label: 'Thank him 🙏',
      text: 'Thank you for standing with me tonight. It mattered.',
      meters: { romanceChidi: 3, reputation: 1 },
      trust: { chidi: 4 },
      replies: [{ by: 'chidi', text: 'Always.' }],
    },
    {
      id: 'cool',
      label: 'Play it cool 😎',
      text: '📸',
      meters: { romanceChidi: 1 },
      replies: [{ by: 'adaeze_nwosu', text: 'Ada stop playing with this man’s heart 😭' }],
    },
  ],

  /* ---------------------------- Episode 3 ---------------------------- */
  post_zee_content_house: [
    {
      id: 'excited',
      label: 'Hype the house 🏡',
      text: 'Creative associate reporting for duty 🫡 Let’s make it iconic.',
      meters: { popularity: 4, loyalty: 1 },
      trust: { zee: 4 },
      memory: { zee: 'You hyped the Content House launch in public.' },
      replies: [
        { by: 'zee', text: 'That’s my girl.' },
        { by: 'omowunmi_p', text: 'The ROI on this partnership 📈' },
      ],
    },
    {
      id: 'name',
      label: 'Question the name 🫖',
      text: 'Naming it the “Lagos Tea Content House” after everything? Bold choice, Zee 🫖',
      meters: { suspicion: 5, popularity: 2 },
      trust: { zee: -3, chi: 2 },
      memory: { zee: 'You questioned the house’s name in public.' },
      replies: [
        { by: 'chi', text: 'Thank you. I said the same thing.' },
        { by: 'zee', text: 'We take the name back. That’s the point.' },
        { by: 'amara_dike', text: 'The irony is not lost on anyone' },
      ],
    },
    {
      id: 'roommates',
      label: 'Shout out the girls 💖',
      text: 'New roommates, new chaos. Ring lights, be ready 💖',
      meters: { loyalty: 3 },
      trust: { tamara: 3, bisola: 3, hauwa: 1 },
      replies: [
        { by: 'bisola', text: 'Ring lights are ALWAYS ready 😩💡' },
        { by: 'tamara', text: 'Roomie!!! 💚' },
      ],
    },
    {
      id: 'belly',
      label: 'Hint at the hunt 🕵️',
      text: 'Some people move in for the ring lights. Some move in for answers 👀',
      meters: { suspicion: 6, reputation: 1 },
      trust: { zee: -1, hauwa: 2 },
      replies: [
        { by: 'amara_dike', text: 'I KNEW IT. Belly of the beast!!' },
        { by: 'hauwa', text: 'Answers usually move in with you.' },
        { by: 'lagos_tea', text: '👀🫖' },
      ],
    },
    {
      id: 'grateful',
      label: 'Be grateful 🙏',
      text: 'Zero tuition balance and a job. Thank you, Zee. Truly.',
      meters: { reputation: 2, loyalty: 2 },
      trust: { zee: 5 },
      memory: { zee: 'You thanked her publicly for clearing your tuition.' },
      replies: [
        { by: 'zee', text: 'Earn it 😉' },
        { by: 'anita_nwosu', text: 'Zee cleared her tuition?? That’s huge.' },
      ],
    },
  ],

  post_bisola_shoutout: [
    {
      id: 'proud',
      label: 'Cheer her 🎉',
      text: 'Your engagement is going UP and it’s all you. I just fixed the commas 😭',
      meters: { loyalty: 2 },
      trust: { bisola: 5 },
      memory: { bisola: 'You gave her all the credit for her campaign.' },
      replies: [{ by: 'bisola', text: 'Modest AND talented. Unfair 😭💖' }],
    },
    {
      id: 'invoice',
      label: 'Send the invoice 💸',
      text: 'Invoice is in your DMs 😌💸',
      meters: { popularity: 3 },
      trust: { bisola: 2 },
      replies: [
        { by: 'bisola', text: 'Will pay in Ring Light Exposure™ 😂' },
        { by: 'omowunmi_p', text: 'Get your money, Ada!' },
      ],
    },
    {
      id: 'all_caps',
      label: 'Tease the caps 😂',
      text: 'I took away the ALL CAPS and the engagement went up. Science.',
      meters: { popularity: 2 },
      trust: { bisola: 1 },
      replies: [{ by: 'bisola', text: 'MY CAPS ARE A BRAND 😭' }],
    },
    {
      id: 'pressure',
      label: 'Check on her 💛',
      text: 'Proud of you. Also, sleep. Engagement can wait 💛',
      meters: { reputation: 2 },
      trust: { bisola: 4, hauwa: 1 },
      replies: [
        { by: 'bisola', text: 'Sleep?? In this economy?? …okay maybe 🥺' },
        { by: 'hauwa', text: 'Listen to her.' },
      ],
    },
    {
      id: 'zee',
      label: 'Tag Zee 👀',
      text: 'Zee did hire me first though 😌 @zeebello',
      meters: { popularity: 2, jealousy: 2 },
      trust: { zee: 2, bisola: -1 },
      replies: [
        { by: 'zee', text: 'Keep it that way.' },
        { by: 'bisola', text: 'Traitor 😂' },
      ],
    },
  ],

  post_chidi_goldenhour: [
    {
      id: 'soft',
      label: 'Go soft 🌅',
      text: 'No captions needed. I remember the moment 🌅',
      meters: { romanceChidi: 5 },
      trust: { chidi: 5 },
      memory: { chidi: 'You told him you remembered the moment at Ilashe.' },
      replies: [
        { by: 'chidi', text: 'Me too.' },
        { by: 'ngozi_uche', text: 'THE SOFT LAUNCH 😭😭' },
      ],
    },
    {
      id: 'kelvin',
      label: 'Answer Kelvin 👀',
      text: '@kelvin_wright interesting photographer too 😌',
      meters: { romanceChidi: 3, romanceKelvin: -2, jealousy: 3 },
      trust: { chidi: 3, kelvin: -3 },
      memory: { kelvin: 'You answered his jab in Chidi’s comments.' },
      replies: [
        { by: 'kelvin', text: 'Cute.' },
        { by: 'adaeze_nwosu', text: 'The love triangle is in the COMMENTS now' },
      ],
    },
    {
      id: 'shy',
      label: 'Play shy 🙈',
      text: 'You didn’t tell me you posted this 🙈',
      meters: { romanceChidi: 3 },
      trust: { chidi: 3 },
      replies: [{ by: 'chidi', text: 'You didn’t ask 😅' }],
    },
    {
      id: 'delete',
      label: 'Ask him to delete 🗑️',
      text: 'Please take this down. People are already talking.',
      meters: { reputation: 3, romanceChidi: -3 },
      trust: { chidi: -2 },
      memory: { chidi: 'You asked him to take down the golden hour photo.' },
      replies: [{ by: 'chidi', text: 'Okay. Give me an hour.' }],
    },
    {
      id: 'joke',
      label: 'Joke 😂',
      text: 'Finally a photo where I’m not running from Lagos Tea 😂',
      meters: { popularity: 3, romanceChidi: 2 },
      trust: { chidi: 2 },
      replies: [
        { by: 'chidi', text: 'For one hour, nobody was chasing you. That’s the photo.' },
        { by: 'lagos_tea', text: 'Not chasing. Watching 🫖' },
      ],
    },
  ],

  post_tea_deleted_ep3: [
    {
      id: 'walls',
      label: 'Turn it around 🧱',
      text: 'If the walls are thin, so are you. You live here 🙂',
      meters: { suspicion: 6, popularity: 3 },
      trust: {},
      replies: [
        { by: 'lagos_tea', text: '…' },
        { by: 'miriam_chukwu', text: 'WAIT. Lagos Tea lives in the Content House?! 😳' },
      ],
    },
    {
      id: 'warn',
      label: 'Warn the girls 🚨',
      text: 'Girls, maybe we keep our pantry meetings in the pantry 🚨',
      meters: { loyalty: 2, suspicion: 2 },
      trust: { chi: 2, hauwa: 2 },
      replies: [
        { by: 'chi', text: 'Noted.' },
        { by: 'hauwa', text: 'Some of us only drink tea in the pantry 🌿' },
      ],
    },
    {
      id: 'screenshot',
      label: 'Say you saved it 📸',
      text: 'Deleting it doesn’t matter. Screenshots are forever 📸',
      meters: { suspicion: 5, reputation: 2 },
      replies: [
        { by: 'lagos_tea', text: 'So are consequences, babe 🫖' },
        { by: 'nnamdi_oraekwe', text: 'Ada is playing chess' },
      ],
    },
    {
      id: 'mock',
      label: 'Mock the page 😂',
      text: 'Posting from the pantry at 1 AM is not the flex you think it is 😂',
      meters: { popularity: 4 },
      replies: [
        { by: 'kola_fashola', text: 'The way she dragged them 😭' },
        { by: 'lagos_tea', text: 'Says the girl awake at 1 AM 🫖' },
      ],
    },
    {
      id: 'silent',
      label: 'Say nothing 🤐',
      text: '👀',
      meters: { reputation: 1 },
      replies: [{ by: 'amara_dike', text: 'The eyes emoji from Ada of all people 😳' }],
    },
  ],
};

/* =========================================================================
   OLD POSTS ON PROFILES
   Commenting on someone's older posts is a vibe of its own: hype, a joke,
   flirting, or digging through their past.
   ========================================================================= */
const ARCHIVE_CHOICES: Record<string, (headline: string) => CommentChoice[]> = {};

const genericArchive = (who: Cast | 'lagos_tea', name: string): ((headline: string) => CommentChoice[]) => (headline) => [
  {
    id: 'throwback',
    label: 'Throwback love ❤️',
    text: `Scrolling back to “${headline.toLowerCase()}” and it still hits ❤️`,
    meters: { popularity: 1 },
    trust: who === 'lagos_tea' ? {} : { [who]: 2 },
    replies: [
      { by: who === 'lagos_tea' ? 'lagos_tea' : who, text: who === 'lagos_tea' ? 'Deep scrolling my page? Flattered 🫖' : 'Deep scroll?? 👀' },
      { by: 'ronke_adewale', text: 'She’s on the 2-weeks-ago posts. Somebody is curious 👀' },
    ],
  },
  {
    id: 'joke',
    label: 'Joke 😂',
    text: `${name} posting like Lagos traffic doesn’t exist 😂`,
    meters: { popularity: 2 },
    trust: who === 'lagos_tea' ? {} : { [who]: 1 },
    replies: [{ by: 'kola_fashola', text: 'Lagos traffic fears them 😂' }],
  },
  {
    id: 'dig',
    label: 'Dig into it 🔎',
    text: 'Who took this photo? The angle is interesting 🔎',
    meters: { suspicion: 2 },
    trust: who === 'lagos_tea' ? {} : { [who]: -1 },
    replies: [
      { by: 'nnamdi_oraekwe', text: 'Ada investigating old posts now 😳' },
      { by: who === 'lagos_tea' ? 'lagos_tea' : who, text: 'Why the sudden interest? 🙂' },
    ],
  },
  {
    id: 'hype',
    label: 'Hype it 🔥',
    text: 'The way this aged so well 🔥',
    meters: { popularity: 1, loyalty: 1 },
    trust: who === 'lagos_tea' ? {} : { [who]: 2 },
    replies: [{ by: 'blessing_alabi', text: 'Agreed!!' }],
  },
  {
    id: 'shade',
    label: 'Light shade 🙂',
    text: 'Bold of you to keep this one up 🙂',
    meters: { popularity: 2, jealousy: 2 },
    trust: who === 'lagos_tea' ? {} : { [who]: -3 },
    replies: [
      { by: who === 'lagos_tea' ? 'lagos_tea' : who, text: 'And yet you’re here 🙂' },
      { by: 'miriam_chukwu', text: 'Shade on an old post is a new level 😭' },
    ],
  },
];

(['zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin', 'dayo', 'lagos_tea'] as const).forEach((who) => {
  ARCHIVE_CHOICES[who] = genericArchive(who, CAST[who].name.split(' ')[0].replace(/"/g, ''));
});

/** Every comment written for a post, before filtering by story choices */
export function allCommentChoices(post: SocialPost): CommentChoice[] {
  if (post.isAdaPost) return [];
  const list = COMMENT_CHOICES[post.id];
  if (list) return list;
  if (post.isArchive) {
    if (ARCHIVE_COMMENTS[post.id]) return ARCHIVE_COMMENTS[post.id];
    const make = ARCHIVE_CHOICES[post.authorId];
    return make ? make(post.graphic.headline || 'this') : [];
  }
  return [];
}

/** The comment options Ada sees on a post, filtered by the choices she has made */
export function getCommentChoices(post: SocialPost, flags: Record<string, boolean>): CommentChoice[] {
  const list = allCommentChoices(post);
  return list.filter((c) => (!c.ifFlag || flags[c.ifFlag]) && (!c.ifNotFlag || !flags[c.ifNotFlag])).slice(0, 5);
}

// Comments for the newer story posts
Object.assign(COMMENT_CHOICES, STORY_POST_COMMENTS);

/** Relationship impacts of every authored comment, for the relationship profile */
export const COMMENT_IMPACTS: Record<string, { trust: Partial<Record<Cast, number>>; memory?: Partial<Record<Cast, string>> }> = {};
Object.entries(COMMENT_CHOICES).forEach(([postId, choices]) =>
  choices.forEach((c) => {
    if (c.trust && Object.keys(c.trust).length) COMMENT_IMPACTS[commentFlag(postId, c.id)] = { trust: c.trust, memory: c.memory };
  })
);

// Older profile posts with their own written comments
Object.entries(ARCHIVE_COMMENTS).forEach(([postId, choices]) =>
  choices.forEach((c) => {
    if (c.trust && Object.keys(c.trust).length) COMMENT_IMPACTS[commentFlag(postId, c.id)] = { trust: c.trust, memory: c.memory };
  })
);

// Any older post without written comments falls back to the general set
Object.entries(ARCHIVE_POSTS).forEach(([who, specs]) => {
  const make = ARCHIVE_CHOICES[who];
  if (!make) return;
  specs.forEach((spec, idx) =>
    make(spec.headline).forEach((c) => {
      if (c.trust && Object.keys(c.trust).length) COMMENT_IMPACTS[commentFlag(`archive_${who}_${idx}`, c.id)] = { trust: c.trust, memory: c.memory };
    })
  );
});

const AVATARS = ['heroine', 'zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin', 'dayo', 'lagos_tea'];

/** The older posts on someone's profile, with their own comment sections */
export function buildArchivePosts(charId: string, name: string, handle: string): SocialPost[] {
  const specs = ARCHIVE_POSTS[charId] || [];
  return specs.map((t, idx) => {
    const id = `archive_${charId}_${idx}`;
    return {
      id,
      authorId: charId as SocialPost['authorId'],
      authorName: name,
      authorHandle: handle,
      isVerified: charId !== 'heroine',
      avatarType: (AVATARS.includes(charId) ? charId : 'fan') as SocialPost['avatarType'],
      unlockEpisode: 1,
      timestamp: `${idx + 2}w ago`,
      locationTag: t.location,
      caption: t.caption,
      hashtags: [],
      graphic: {
        type: 'luxe_portrait',
        characterId: t.emoji ? undefined : (charId as CharacterId),
        emoji: t.emoji,
        bgGradient: t.gradient,
        badgeLabel: t.badge,
        headline: t.headline.toUpperCase(),
        subheadline: name,
        accentColor: '#f43f5e',
        tagLocation: t.location.toUpperCase(),
      },
      likesCount: t.likes,
      commentsCount: t.comments,
      sharesCount: Math.round(t.likes * 0.06),
      isLikedByPlayer: false,
      isArchive: true,
      comments: t.thread.map((c, i) => makeComment(c.by, c.text, `${id}_c${i}`, { likes: c.likes, timestamp: `${idx + 2}w` })),
    };
  });
}
