import { CharacterId, Expression, Meters, OutfitId } from './vn';

export type SocialAuthorId = CharacterId | 'lagos_tea' | 'lekki_insider' | 'gidi_paparazzi';

export type SocialAvatarType = CharacterId | 'lagos_tea' | 'fan';

// Something a feed action does to the story: meter changes and/or a story flag
export interface SocialEffect {
  meterChanges?: Partial<Meters>;
  flagToSet?: string;
}

// Shared unlock rules for posts, stories, DMs and notifications
export interface Unlockable {
  unlockEpisode: number;
  unlockSceneIndex?: number;
  requiredFlag?: string;
  requiredAnyFlags?: string[];
  hiddenIfFlag?: string;
  hiddenIfAnyFlags?: string[];
  /** Show as soon as the scene starts (used for Ada's own posts). Default: only after the scene's choice is made. */
  unlockAtSceneStart?: boolean;
  /** Unlocks the instant this flag is set (by a dialogue line's setsFlag), even mid-scene */
  unlockedByFlag?: string;
}

export interface SocialComment {
  id: string;
  authorId: SocialAuthorId | string;
  authorName: string;
  authorHandle: string;
  isVerified?: boolean;
  avatarType: SocialAvatarType | string;
  avatarColor?: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  memoryBadge?: string;
  parentCommentId?: string;
  replyToHandle?: string;
  unlockEpisode?: number;
  unlockSceneIndex?: number;
  requiredFlag?: string;
  requiredAnyFlags?: string[];
  hiddenIfFlag?: string;
  hiddenIfAnyFlags?: string[];
}

export interface SoundTrack {
  title: string;
  artist: string;
  isTrending?: boolean;
}

export type PostGraphicType =
  | 'luxe_portrait'
  | 'tea_leak_receipt'
  | 'party_glam'
  | 'car_flex'
  | 'behind_lens'
  | 'vlog_thumbnail'
  | 'wellness_flatlay'
  | 'villa_poolside';

export interface PostGraphic {
  type: PostGraphicType;
  characterId?: CharacterId;
  bgGradient: string;
  badgeLabel?: string;
  headline?: string;
  subheadline?: string;
  accentColor?: string;
  tagLocation?: string;
  // Tea-leak receipt card details
  leakSource?: string;
  leakFooterLeft?: string;
  leakFooterRight?: string;
  /** Object shot: big emoji instead of a character */
  emoji?: string;
  /** Overrides for how Ada looks in her own photo */
  heroineOutfit?: OutfitId;
  heroineExpression?: Expression;
}

// Text that changes depending on the player's story choices (first matching flag wins)
export interface PostVariant {
  flag: string;
  caption?: string;
  headline?: string;
  subheadline?: string;
  leakFooterRight?: string;
}

export type ClueKind = 'plain' | 'red_herring_tell' | 'culprit_tell';

export interface PostClue {
  kind: ClueKind;
  name: string;
  // For 'plain' clues this is the full description; for tell clues it is the lead-in sentence
  text: string;
}

export interface CommentWarOption {
  id: string;
  label: string;
  replyText?: string; // undefined = Ada ignores the troll
  effect?: SocialEffect;
  followerDelta?: number;
  aftermath: Array<Omit<SocialComment, 'id' | 'likes' | 'timestamp'>>;
}

export interface CommentWar {
  id: string;
  troll: Omit<SocialComment, 'id' | 'likes' | 'timestamp'>;
  options: CommentWarOption[];
}

export interface SocialPost extends Unlockable {
  id: string;
  authorId: SocialAuthorId;
  authorName: string;
  authorHandle: string;
  isVerified: boolean;
  avatarType: SocialAvatarType;
  timestamp: string;
  locationTag?: string;
  caption: string;
  hashtags: string[];
  soundSnippet?: SoundTrack;
  graphic: PostGraphic;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLikedByPlayer?: boolean;
  isSavedByPlayer?: boolean;
  comments: SocialComment[];
  isTeaLeak?: boolean;
  variants?: PostVariant[];
  likeEffect?: SocialEffect;
  notifyText?: string; // shows up in Notifications when the post unlocks
  clue?: PostClue; // revealed when the player screenshots the post
  deleteAfterSeconds?: number; // the post vanishes this long after the player first sees it
  commentWar?: CommentWar;
  isAdaPost?: boolean;
  isArchive?: boolean;
}

export interface StorySlide {
  id: string;
  timestamp: string;
  bgGradient: string;
  caption: string;
  characterExpression?: Expression;
  stickerText?: string;
  pollQuestion?: string;
  pollOptionA?: string;
  pollOptionB?: string;
  pollVotesA?: number;
  pollVotesB?: number;
  pollEffectA?: SocialEffect;
  pollEffectB?: SocialEffect;
  userVoted?: 'A' | 'B';
}

export interface SocialStory extends Unlockable {
  id: string;
  authorId: CharacterId | 'lagos_tea';
  authorName: string;
  authorHandle: string;
  avatarType: CharacterId | 'lagos_tea';
  hasUnseen: boolean;
  slides: StorySlide[];
}

export type FeedFilterTab = 'for_you' | 'trending' | 'tea_leaks' | 'cast' | 'profile' | 'dms';

export type PhoneView = 'home' | 'notifications' | 'compose' | 'dms' | 'profile';

/* ---------------------------------- DMs ---------------------------------- */

export interface DmMessage {
  from: 'ada' | 'system' | SocialAuthorId | 'mum';
  text: string;
}

export interface DmReplyOption {
  id: string;
  text?: string; // undefined = Ada leaves it on "Seen"
  label?: string; // button label when it differs from the sent text
  effect?: SocialEffect;
  addsClue?: { name: string; description: string };
  responses: DmMessage[];
}

export interface DmBeat extends Unlockable {
  id: string;
  messages: DmMessage[];
  replies?: DmReplyOption[];
  /** Renames the chat once this beat unlocks (e.g. a group rename) */
  renameTo?: string;
  /** New chat icon once this beat unlocks */
  newAvatarEmoji?: string;
  /** New member list / subtitle once this beat unlocks */
  newHandle?: string;
}

export interface DmThread {
  id: string;
  title: string;
  handle: string;
  avatarType?: SocialAvatarType;
  avatarEmoji?: string;
  isGroup?: boolean;
  profileId?: CharacterId | 'lagos_tea';
  beats: DmBeat[];
}

/* ------------------------------ Notifications ----------------------------- */

export type NotificationKind =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'tag'
  | 'dm'
  | 'leak'
  | 'milestone';

export type NotificationTarget =
  | { type: 'post'; id: string }
  | { type: 'dm'; id: string }
  | { type: 'profile'; id: CharacterId | 'lagos_tea' };

export interface SocialNotification {
  id: string;
  kind: NotificationKind;
  avatarType: SocialAvatarType;
  avatarEmoji?: string;
  text: string;
  episode: number;
  sceneIndex: number;
  order?: number;
  target?: NotificationTarget;
}

/* ------------------------------ Ada's posts ------------------------------ */

export type AdaPostTone = 'humble' | 'shady' | 'flex' | 'flirty' | 'mysterious';
/** Id of the photo from Ada's camera roll (see adaPhotos.ts) */
export type AdaPhotoKind = string;

export interface AdaPost {
  id: string;
  episode: number;
  sceneIndex: number;
  photoKind: AdaPhotoKind;
  photoLabel: string;
  bgGradient: string;
  /** Object shots: emoji shown instead of Ada */
  photoEmoji?: string;
  /** Outfit Ada wears in the shot */
  photoOutfit?: OutfitId;
  photoExpression?: Expression;
  tone: AdaPostTone;
  caption: string;
  captionId?: string;
  likesCount: number;
  followerGain: number;
  comments: SocialComment[];
  commentWar?: CommentWar;
}

/* --------------------------- Saved social state --------------------------- */

export interface SocialState {
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  likedComments: Record<string, boolean>;
  playerComments: Record<string, SocialComment[]>;
  unfollowed: Record<string, boolean>;
  pollVotes: Record<string, 'A' | 'B'>;
  seenStories: Record<string, boolean>;
  adaStorySlides: StorySlide[];
  adaPosts: AdaPost[];
  dmReplies: Record<string, string>; // beatId -> reply option id
  seenDmBeats: Record<string, boolean>;
  seenNotifications: Record<string, boolean>;
  banneredNotifications: Record<string, boolean>;
  dynamicNotifications: SocialNotification[];
  screenshots: Record<string, boolean>;
  deletedPostStatus: Record<string, 'captured' | 'missed'>;
  deletedPostSeenAt: Record<string, number>;
  commentWarPicks: Record<string, string>;
  appliedEffects: Record<string, boolean>;
  followerBonus: number;
  milestones: Record<string, boolean>;
}
