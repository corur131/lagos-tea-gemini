import type { SocialState } from './socialFeed';

export type Department =
  | 'Media & Digital Communications'
  | 'Fashion & Luxury Branding'
  | 'Law & International Governance'
  | 'Business Administration & Finance'
  | 'Computer Science & AI'
  | 'Interior & Architectural Design'
  | 'Film & Performing Arts';

export type SkinToneId =
  | 'caramel'
  | 'rich_honey'
  | 'warm_amber'
  | 'deep_chestnut'
  | 'bronze_mahogany'
  | 'dark_cocoa'
  | 'deep_espresso'
  | 'radiant_ebony';

export interface SkinToneOption {
  id: SkinToneId;
  name: string;
  baseColor: string;
  shadowColor: string;
  highlightColor: string;
  blushColor: string;
}

export type EyeColorId =
  | 'dark_brown'
  | 'black'
  | 'hazel'
  | 'amber'
  | 'green'
  | 'blue'
  | 'grey'
  | 'violet';

export interface EyeColorOption {
  id: EyeColorId;
  name: string;
  irisColor: string;
  glowColor: string;
}

export type HairstyleId =
  | 'knotless_braids'
  | 'box_braids'
  | 'cornrows'
  | 'natural_afro'
  | 'bantu_knots'
  | 'long_straight_wig'
  | 'body_wave_wig'
  | 'bob_wig'
  | 'curly_wig'
  | 'deep_wave_wig';

export type HairColorId =
  | 'jet_black'
  | 'dark_brown'
  | 'burgundy'
  | 'honey_blonde'
  | 'copper'
  | 'platinum'
  | 'rose_pink'
  | 'ombre_blonde';

export interface HairColorOption {
  id: HairColorId;
  name: string;
  primary: string;
  accent: string;
  gradient?: string[];
}

export type LipColorId =
  | 'nude'
  | 'soft_pink'
  | 'coral'
  | 'classic_red'
  | 'berry'
  | 'plum'
  | 'chocolate_brown'
  | 'gold';

export type LipFinishId = 'matte' | 'gloss';

export type EyeshadowColorId =
  | 'none'
  | 'bronze'
  | 'gold'
  | 'rose'
  | 'smoky_black'
  | 'purple'
  | 'teal';

export type LashesId = 'natural' | 'classic' | 'volume' | 'dramatic';

export type BlushColorId = 'none' | 'soft_peach' | 'rose' | 'bold_berry';

export type BrowsId = 'soft' | 'arched' | 'bold';

export type OutfitId =
  | 'casual'
  | 'corporate'
  | 'ankara'
  | 'party_dress'
  | 'hoodie'
  | 'native_lace';

export type EarringsId = 'none' | 'studs' | 'hoops' | 'drops';

export type NecklaceId = 'none' | 'thin_chain' | 'pendant';

export interface HeroineCustomization {
  name: string;
  department: Department;
  skinTone: SkinToneId;
  eyeColor: EyeColorId;
  hairstyle: HairstyleId;
  hairColor: HairColorId;
  lipColor: LipColorId;
  lipFinish: LipFinishId;
  eyeshadow: EyeshadowColorId;
  lashes: LashesId;
  blush: BlushColorId;
  highlighter: boolean;
  brows: BrowsId;
  outfit: OutfitId;
  earrings: EarringsId;
  necklace: NecklaceId;
}

export type CharacterId =
  | 'heroine'
  | 'zee'
  | 'tamara'
  | 'chi'
  | 'bisola'
  | 'hauwa'
  | 'chidi'
  | 'kelvin'
  | 'dayo'
  | 'narrator';

export type Expression =
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'shocked'
  | 'sad'
  | 'jealous'
  | 'flirty'
  | 'scared'
  | 'suspicious';

export type LocationType =
  | 'ajegunle_apartment'
  | 'banana_island_mansion'
  | 'rooftop_party'
  | 'mall'
  | 'university_campus'
  | 'beach_house'
  | 'photoshoot_studio'
  | 'night_street';

export type TimeModifier = 'day' | 'night' | 'blackout_generator';

export type MusicMood =
  | 'campus_lifestyle'
  | 'romance_flirting'
  | 'party_gala'
  | 'gossip_drama'
  | 'suspicion_investigation'
  | 'deceit_hiding'
  | 'argument_confrontation'
  | 'major_reveal'
  | 'danger_threat'
  | 'heartbreak_melancholy'
  | 'victory_confidence'
  | 'viral_tea_leak'
  | 'mystery_climax'
  | 'ending_romance'
  | 'ending_triumph'
  | 'ending_bad';

export interface DialogueLine {
  speaker: CharacterId | string;
  speakerDisplayName?: string;
  expression?: Expression;
  text: string;
  sfx?: 'tap' | 'suspense' | 'suspenseSting' | 'shock' | 'gasp' | 'heartbeat' | 'thunder' | 'chime';
  musicMood?: MusicMood;
  /** Only shown when this story flag has been set by an earlier choice */
  ifFlag?: string;
  /** Hidden when this story flag has been set by an earlier choice */
  ifNotFlag?: string;
  /** Sets this story flag the moment the line appears (e.g. to unlock a post at the exact moment it is revealed) */
  setsFlag?: string;
}

export interface Meters {
  popularity: number;
  loyalty: number;
  suspicion: number;
  jealousy: number;
  reputation: number;
  romanceChidi: number;
  romanceKelvin: number;
  romanceDayo: number;
}

export interface ChoiceOption {
  id: string;
  text: string;
  consequenceText?: string;
  meterChanges?: Partial<Meters>;
  flagToSet?: string;
  conditionFlag?: string;
  musicMood?: MusicMood;
  nextSceneId?: string;
  nextSceneIndex?: number;
  nextEpisode?: number;
  /** Lines that play right after this choice, in the same scene, before the story moves on */
  followUp?: DialogueLine[];
}

export interface SceneData {
  id: string;
  episode: number;
  sceneIndex: number;
  location: LocationType;
  timeModifier: TimeModifier;
  charactersOnStage: CharacterId[];
  activeSpeaker?: CharacterId | string;
  musicMood?: MusicMood;
  lines: DialogueLine[];
  choices: ChoiceOption[];
  twistMoment?: {
    title: string;
    description: string;
    type: 'revelation' | 'danger' | 'clue';
  };
  /** Set on generated follow-up scenes: which scene + choice this follow-up belongs to */
  afterChoice?: { sceneId: string; choiceId: string };
}

export type CulpritId = 'zee' | 'tamara' | 'chi' | 'bisola' | 'hauwa';

export type CulpritMotive =
  | 'blackmail_debt'
  | 'stolen_credit_revenge'
  | 'algorithm_obsession'
  | 'romantic_jealousy'
  | 'undercover_expose';

export interface MysterySecret {
  culprit: CulpritId;
  motive: CulpritMotive;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  episodeAcquired: number;
  tag: 'Photo' | 'Chat' | 'Audio' | 'Personal' | 'Document' | 'Key';
}

export type EndingType = 'chidi' | 'kelvin' | 'dayo' | 'independent' | 'bad';

export interface EpisodeMeta {
  episode: number;
  title: string;
  subtitle: string;
  locationName: string;
  recap: string;
  twistTitle: string;
}

export interface GameState {
  currentEpisode: number;
  currentSceneIndex: number;
  currentSceneId?: string;
  currentLineIndex: number;
  heroine: HeroineCustomization;
  meters: Meters;
  flags: Record<string, boolean>;
  inventory: InventoryItem[];
  historyLog: Array<{ speaker: string; text: string }>;
  mysterySecret: MysterySecret;
  isTyping: boolean;
  isWardrobeOpen: boolean;
  isCluesOpen: boolean;
  isLogOpen: boolean;
  isSocialFeedOpen: boolean;
  soundEnabled: boolean;
  ending: EndingType | null;
  reachedEndOfContent?: boolean;
  social: SocialState;
}
