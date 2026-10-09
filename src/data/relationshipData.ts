import { CharacterId, Meters, HeroineCustomization, RelationshipDeltas } from '../types/vn';

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
    baseTrust: 65,
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
    baseTrust: 45,
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
    baseTrust: 30,
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
    baseTrust: 75,
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
    baseTrust: 40,
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
    baseTrust: 35,
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
    baseTrust: 50,
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
    baseTrust: 55,
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
  heroine: HeroineCustomization,
  choiceBonus: RelationshipDeltas = {}
): RelationshipAssessment {
  let trust = 50;
  let romance = 0;
  const influences: string[] = [];

  switch (charId) {
    case 'chidi': {
      romance = Math.min(100, Math.max(0, meters.romanceChidi));
      trust = 60 + Math.round((meters.loyalty - 50) * 0.3) - Math.round((meters.jealousy - 10) * 0.15);

      if (flags.flirted_with_chidi) {
        trust += 8;
        influences.push('You engaged his honest curiosity by the pool, looking past the party façade.');
      } else if (flags.bantered_with_chidi) {
        trust += 6;
        influences.push('You bantered with him about ring lights and fake glamour, proving you have sharp eyes.');
      } else if (flags.confided_chidi_incognito) {
        trust += 10;
        influences.push('You asked him to keep your presence low-key, and he respected your privacy.');
      }

      if (flags.chidi_archive_alliance) {
        trust += 12;
        influences.push('You turned to his camera archives to find who took the leak photo, forging an alliance.');
      }

      if (meters.romanceKelvin > 25) {
        trust -= 8;
        influences.push('He noticed Kelvin Adebayo-Wright lingering around you and keeps a cautious eye open.');
      }

      if (influences.length === 0) {
        influences.push('Chidi sees you as an intriguing breath of fresh air amidst shallow influencer noise.');
      }
      break;
    }

    case 'kelvin': {
      romance = Math.min(100, Math.max(0, meters.romanceKelvin));
      trust = 45 + Math.round((meters.popularity - 35) * 0.25) + Math.round((meters.reputation - 40) * 0.2);

      if (flags.challenged_kelvin) {
        trust += 10;
        influences.push('You challenged him right by the deep end, showing you won\'t be dazzled by his family wealth.');
      } else if (flags.locked_eyes_kelvin) {
        trust += 8;
        influences.push('You held his gaze over crystal champagne flutes with unwavering confidence.');
      } else if (flags.kept_kelvin_at_bay) {
        trust += 5;
        influences.push('You set clear boundaries as Tamara’s friend, making him view you as a rare puzzle.');
      }

      if (flags.borrowed_emerald_dress) {
        influences.push('Your couture emerald dress caught his eye across the foyer the moment you entered.');
      }

      if (flags.vintage_style_dress) {
        influences.push('He appreciated your understated confidence when you owned your minimalist look.');
      }

      if (influences.length === 0) {
        influences.push('Kelvin is intrigued by your refusal to perform for the crowd like everyone else.');
      }
      break;
    }

    case 'dayo': {
      romance = Math.min(100, Math.max(0, meters.romanceDayo));
      trust = 35 + Math.round((meters.reputation - 40) * 0.25) - Math.round((meters.suspicion - 15) * 0.2);

      if (flags.held_breath_stealth) {
        influences.push('The silent tension of the Banana Island studio kept his radar tuned to your presence.');
      } else if (flags.confronted_intruder) {
        influences.push('Word reached industry circles that someone in the Bello circle took a fearless stand.');
      }

      if (influences.length === 0) {
        influences.push('Dayo is watching the unfolding @TheLagosTea drama from the mixing board in the background.');
      }
      break;
    }

    case 'tamara': {
      trust = 65 + Math.round((meters.loyalty - 50) * 0.35) - Math.round((meters.suspicion - 15) * 0.1);

      if (flags.borrowed_emerald_dress) {
        trust += 12;
        influences.push('You trusted her fashion instincts and let her dress you in her Paris couture emerald gown.');
      } else if (flags.dragged_dress) {
        trust += 10;
        influences.push('She loved cajoling you into dressing up and feels proud to introduce her Ajegunle sister.');
      } else if (flags.vintage_style_dress) {
        trust += 6;
        influences.push('She respected your bold authenticity even when teasing your minimalist wardrobe.');
      }

      if (flags.stayed_with_hauwa) {
        influences.push('You stayed close to the inner circle instead of chasing clout with stranger influencers.');
      }

      if (flags.comforted_tamara) {
        trust += 10;
        influences.push('When accusations flew after the leak, you stood by her while others pointed fingers.');
      }

      if (influences.length === 0) {
        influences.push('Tamara loves you like a sister and wants you to shine in her glittering world.');
      }
      break;
    }

    case 'zee': {
      trust = 35 + Math.round((meters.popularity - 35) * 0.3) + Math.round((meters.reputation - 40) * 0.25) - Math.round((meters.jealousy - 10) * 0.2);

      if (flags.charmed_zee) {
        trust += 14;
        influences.push('You paid her effortless compliments at her 21st, proving you know proper social etiquette.');
      }

      if (flags.borrowed_emerald_dress) {
        trust += 6;
        influences.push('Your glamorous arrival fit right into her high-aesthetic visual requirements.');
      }

      if (flags.vintage_style_dress) {
        trust -= 4;
        influences.push('She wondered why you didn\'t wear high-luxury glam to her Banana Island milestone.');
      }

      if (flags.checked_chioma) {
        influences.push('She secretly loved you putting Chioma in her place during party arrivals.');
      }

      if (meters.jealousy > 20) {
        trust -= 8;
        influences.push('Her team flagged how much attention you drew from Kelvin and party photographers.');
      }

      if (influences.length === 0) {
        influences.push('Zee evaluates everyone by how much value and sparkle they bring to her brand.');
      }
      break;
    }

    case 'chi': {
      trust = 35 + Math.round((meters.reputation - 40) * 0.3) - Math.round((meters.jealousy - 10) * 0.2) - Math.round((meters.suspicion - 15) * 0.15);

      if (flags.checked_chioma) {
        trust += 8;
        influences.push('You returned her sharp question with effortless wit; she respects adversaries with spine.');
      }

      if (flags.vintage_style_dress) {
        influences.push('She scrutinized your thrifted outfit for designer tags and calculated your background.');
      }

      if (flags.borrowed_emerald_dress) {
        influences.push('She immediately recognized Tamara’s gown and noted your close relationship.');
      }

      if (meters.reputation > 50) {
        trust += 6;
        influences.push('Your strong academic reputation at Lekki Atlantic makes it harder for her to dismiss you.');
      }

      if (influences.length === 0) {
        influences.push('Chi views everyone in Zee’s orbit as either leverage, competition, or a liability.');
      }
      break;
    }

    case 'bisola': {
      trust = 45 + Math.round((meters.popularity - 35) * 0.35) - Math.round((meters.suspicion - 15) * 0.1);

      if (flags.borrowed_emerald_dress) {
        trust += 10;
        influences.push('She featured your emerald gown across her Snapchat stories with glowing praise.');
      }

      if (flags.stayed_with_hauwa) {
        trust += 4;
        influences.push('She noticed you being chill and not aggressively mugging for her vlog camera.');
      }

      if (flags.charmed_zee) {
        influences.push('She admired how easily you glided through the Bello family greeting circle.');
      }

      if (influences.length === 0) {
        influences.push('Bisola loves your energy and hopes you\'ll be in more of her viral content.');
      }
      break;
    }

    case 'hauwa': {
      trust = 50 + Math.round((meters.loyalty - 50) * 0.3) - Math.round((meters.jealousy - 10) * 0.25);

      if (flags.stayed_with_hauwa) {
        trust += 12;
        influences.push('You stepped away from the flashy camera flashlights to share a peaceful moment with her.');
      }

      if (flags.vintage_style_dress) {
        trust += 8;
        influences.push('She admired your refusal to chase superficial luxury just to blend into Banana Island.');
      }

      if (flags.checked_chioma) {
        trust += 5;
        influences.push('She quietly smiled when you defended your dignity against Chioma’s questions.');
      }

      if (meters.suspicion > 25) {
        influences.push('Her perceptive nature picked up on the growing tension and distrust between the girls.');
      }

      if (influences.length === 0) {
        influences.push('Hauwa maintains calm neutrality, observing your choices with gentle eyes.');
      }
      break;
    }
  }

  // Direct effect of the player's choices on this character
  const choiceShift = choiceBonus[charId] || 0;
  if (choiceShift >= 6) {
    influences.unshift('Your recent choices have clearly won them over.');
  } else if (choiceShift <= -6) {
    influences.unshift('Your recent choices have hurt how they see you.');
  }
  trust += choiceShift;

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
