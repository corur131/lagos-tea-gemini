import { CharacterId, Meters, HeroineCustomization } from '../types/vn';
import { RELATIONSHIP_IMPACTS, scaledTrust } from './choiceRelationships';

const GIRLS_IN_CIRCLE: CharacterId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];

export interface CharacterRelationshipInfo {
  id: CharacterId;
  name: string;
  role: string;
  followers: string;
  tagline: string;
  vibe: string;
  accentColor: string;
  hasRomance: boolean;
  baseTrust: number;
  baseRomance?: number;
}

export const RELATIONSHIP_CHARACTERS: CharacterRelationshipInfo[] = [
  {
    id: 'chidi',
    name: 'Chidi Nwosu',
    role: 'Campus Photojournalist',
    followers: '18.4K',
    tagline: 'Capturing what ring lights try to hide',
    vibe: 'Grounded, observant, loyal & fiercely protective',
    accentColor: 'from-blue-500 to-cyan-500',
    hasRomance: true,
    baseTrust: 40,
    baseRomance: 20,
  },
  {
    id: 'kelvin',
    name: 'Kelvin Adebayo-Wright',
    role: 'Shipping Dynasty Heir & Club Owner',
    followers: '520K',
    tagline: 'Lagos moves at the speed of wire transfers',
    vibe: 'Suave, intoxicating, high-stakes & deeply curious about you',
    accentColor: 'from-amber-400 to-rose-500',
    hasRomance: true,
    baseTrust: 30,
    baseRomance: 15,
  },
  {
    id: 'dayo',
    name: 'Dayo Martins',
    role: 'Afrobeats Producer & Label Architect',
    followers: '1.2M',
    tagline: 'Soundtracks for the city that never sleeps',
    vibe: 'Enigmatic, quiet genius, behind-the-scenes power broker',
    accentColor: 'from-violet-500 to-purple-600',
    hasRomance: true,
    baseTrust: 25,
    baseRomance: 0,
  },
  {
    id: 'tamara',
    name: 'Tamara Okonkwo-Reid',
    role: 'Oil Heiress & Childhood Friend',
    followers: '2.5M',
    tagline: 'Champagne for my real friends, real tea for everyone',
    vibe: 'Playful, generous, reckless, genuinely roots for Ada',
    accentColor: 'from-pink-500 to-rose-400',
    hasRomance: false,
    baseTrust: 55,
  },
  {
    id: 'zee',
    name: 'Zainab "Zee" Bello',
    role: 'Queen Bee & Politician\'s Daughter',
    followers: '4.0M',
    tagline: 'Perfection is not an accident; it is a brand strategy',
    vibe: 'Regal, exacting, warm when useful, lethal when crossed',
    accentColor: 'from-yellow-400 to-amber-600',
    hasRomance: false,
    baseTrust: 30,
  },
  {
    id: 'chi',
    name: 'Chioma "Chi" Eze',
    role: 'Corporate Climber & Legal Prodigy',
    followers: '600K',
    tagline: 'Contracts are written in ink, reputations in algorithms',
    vibe: 'Sharp, ambitious, hyper-vigilant, respects intellectual fire',
    accentColor: 'from-indigo-400 to-blue-600',
    hasRomance: false,
    baseTrust: 25,
  },
  {
    id: 'bisola',
    name: 'Bisola Adeyemi',
    role: 'Vlogger & 360-Cam Queen',
    followers: '400K',
    tagline: 'If it wasn\'t captured on 4K, did it even happen?',
    vibe: 'Bubbly, FOMO-fueled, unfiltered commentary, loves good tea',
    accentColor: 'from-fuchsia-400 to-pink-600',
    hasRomance: false,
    baseTrust: 40,
  },
  {
    id: 'hauwa',
    name: 'Hauwa Musa',
    role: 'Wellness Maven & Aesthetic Director',
    followers: '350K',
    tagline: 'Protect your peace; let your aura do the talking',
    vibe: 'Zen, observant, slow to speak, misses nothing in the room',
    accentColor: 'from-emerald-400 to-teal-600',
    hasRomance: false,
    baseTrust: 40,
  },
];

export interface RelationshipAssessment {
  trust: number;
  romance: number;
  trustTier: 'Wary' | 'Cautious' | 'Warm' | 'Confidant' | 'Ride-or-Die';
  romanceTier?: 'Stranger' | 'Spark' | 'Entangled' | 'Electric' | 'Obsession';
  statusSummary: string;
  recentInfluences: string[];
}

export function calculateRelationship(
  charId: CharacterId,
  meters: Meters,
  flags: Record<string, boolean>,
  heroine: HeroineCustomization
): RelationshipAssessment {
  const info = RELATIONSHIP_CHARACTERS.find((c) => c.id === charId);
  let trust = info?.baseTrust ?? 50;
  let romance = 0;
  const influences: string[] = [];

  // 1. Every choice that involved this character (newest first in the profile)
  const impactFlags = Object.keys(RELATIONSHIP_IMPACTS).filter((f) => flags[f]);
  for (const flag of impactFlags) {
    const impact = RELATIONSHIP_IMPACTS[flag];
    const delta = scaledTrust(impact.trust[charId as keyof typeof impact.trust]);
    if (delta) trust += delta;
    const memory = impact.memory?.[charId as keyof NonNullable<typeof impact.memory>];
    if (memory) influences.unshift(memory);
  }

  // 2. Romance for the love interests comes from the romance meters your choices moved
  if (charId === 'chidi') romance = meters.romanceChidi;
  if (charId === 'kelvin') romance = meters.romanceKelvin;
  if (charId === 'dayo') romance = meters.romanceDayo;

  // 3. How the girls feel about Ada's growing profile (jealousy rises with shady/flex posts)
  if (GIRLS_IN_CIRCLE.includes(charId) && meters.jealousy > 20) {
    const envy = Math.round((meters.jealousy - 20) * 0.2);
    if (envy > 0) {
      trust -= envy;
      if (envy >= 3) influences.unshift('She’s quietly jealous of how fast your profile is growing.');
    }
  }
  if (charId === 'tamara' && meters.loyalty > 55) {
    trust += Math.round((meters.loyalty - 55) * 0.2);
  }

  if (influences.length === 0) {
    influences.push(
      info?.hasRomance
        ? 'Nothing between you two yet. Your choices will decide what this becomes.'
        : 'She hasn’t made up her mind about you yet. Your choices will.'
    );
  }

  trust = Math.max(5, Math.min(100, trust));
  romance = Math.max(0, Math.min(100, romance));

  let trustTier: RelationshipAssessment['trustTier'] = 'Cautious';
  if (trust >= 80) trustTier = 'Ride-or-Die';
  else if (trust >= 65) trustTier = 'Confidant';
  else if (trust >= 45) trustTier = 'Warm';
  else if (trust >= 25) trustTier = 'Cautious';
  else trustTier = 'Wary';

  let romanceTier: RelationshipAssessment['romanceTier'] = undefined;
  if (charId === 'chidi' || charId === 'kelvin' || charId === 'dayo') {
    if (romance >= 75) romanceTier = 'Obsession';
    else if (romance >= 50) romanceTier = 'Electric';
    else if (romance >= 30) romanceTier = 'Entangled';
    else if (romance >= 15) romanceTier = 'Spark';
    else romanceTier = 'Stranger';
  }

  // Compose status summary based on tier & opinion
  let statusSummary = '';
  if (charId === 'chidi') {
    if (romance >= 40) statusSummary = 'Chidi is thoroughly captivated by your authenticity and will go out of his way to protect you.';
    else if (romance >= 20) statusSummary = 'There is an undeniable spark between you; he looks for your face in every room.';
    else statusSummary = 'Chidi treats you as a genuine friend who doesn\'t belong in the shallow influencer trap.';
  } else if (charId === 'kelvin') {
    if (romance >= 40) statusSummary = 'Kelvin finds you dangerous and magnetic. He refuses to treat you like his usual weekend flings.';
    else if (romance >= 20) statusSummary = 'He is actively fascinated by your poise and takes every chance to test your limits.';
    else statusSummary = 'Kelvin keeps tabs on you with cool curiosity, waiting to see what moves you make next.';
  } else if (charId === 'dayo') {
    if (romance >= 40) statusSummary = 'Dayo shares his private melodies and studio sanctuary with you; he sees through the Lagos noise directly into your soul.';
    else if (romance >= 20) statusSummary = 'There is an effortless rhythm and playful creative connection brewing whenever you talk.';
    else statusSummary = 'Dayo watches the emerging drama quietly, offering grounded perspective and studio refuge when the city gets too loud.';
  } else if (charId === 'tamara') {
    if (trust >= 75) statusSummary = 'Tamara would take a bullet for you. She is your staunchest defender in Lekki high society.';
    else statusSummary = 'Tamara loves having you around and wants to share her luxurious lifestyle with you.';
  } else if (charId === 'zee') {
    if (trust >= 55) statusSummary = 'Zee considers you a promising asset to the Bello social circle, provided you don\'t outshine her.';
    else statusSummary = 'Zee is keeping you at arm\'s length until she understands what you want from her circle.';
  } else if (charId === 'chi') {
    if (trust >= 50) statusSummary = 'Chioma respects your sharp mind and intellect, treating you as someone not to be underestimated.';
    else statusSummary = 'Chioma watches you like an opposing attorney preparing cross-examination notes.';
  } else if (charId === 'bisola') {
    if (trust >= 60) statusSummary = 'Bisola considers you fun and real, hyping you up both on and off camera.';
    else statusSummary = 'Bisola enjoys having you in the frame, though her FOMO occasionally makes her unpredictable.';
  } else if (charId === 'hauwa') {
    if (trust >= 65) statusSummary = 'Hauwa feels a peaceful kinship with you, offering quiet wisdom when chaos breaks out.';
    else statusSummary = 'Hauwa watches with calm serenity, offering gentle warmth whenever you speak.';
  }

  return {
    trust,
    romance,
    trustTier,
    romanceTier,
    statusSummary,
    recentInfluences: influences.slice(0, 3),
  };
}
