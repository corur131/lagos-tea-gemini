import { CharacterId } from '../types/vn';

/* =========================================================================
   HOW CHOICES CHANGE RELATIONSHIPS
   Keyed by the story flag each choice sets. `trust` is how much that
   character's trust in Ada moves; `memory` is what they remember about it
   (shown in their relationship profile). Romance for Chidi/Kelvin/Dayo is
   moved by the choice's own romance meter changes in storyScript.
   ========================================================================= */

type Cast = Exclude<CharacterId, 'heroine' | 'narrator'>;

/**
 * Trust changes are scaled so relationships grow across all 9 episodes instead of
 * maxing out by Episode 3. Use this everywhere a trust change is applied or shown.
 */
export const TRUST_SCALE = 0.6;
export function scaledTrust(delta?: number): number {
  return delta ? Math.round(delta * TRUST_SCALE) || Math.sign(delta) : 0;
}

export interface RelationshipImpact {
  trust: Partial<Record<Cast, number>>;
  memory?: Partial<Record<Cast, string>>;
}

export const RELATIONSHIP_IMPACTS: Record<string, RelationshipImpact> = {
  /* ---------------- Episode 1 ---------------- */
  // Tamara's invitation
  confided_fees: {
    trust: { tamara: 8 },
    memory: { tamara: 'You trusted her with your ₦1.2M tuition secret before anyone else.' },
  },
  hesitant_invitation: {
    trust: { tamara: 4 },
    memory: { tamara: 'You doubted yourself, and let her hype you up anyway.' },
  },
  bantered_drama: {
    trust: { tamara: 6 },
    memory: { tamara: 'You matched her energy and teased her about the christening fight.' },
  },
  // The dress
  borrowed_emerald_dress: {
    trust: { tamara: 10, zee: 3 },
    memory: { tamara: 'You wore her Paris emerald gown without hesitating.', zee: 'You showed up looking like you belonged.' },
  },
  vintage_style_dress: {
    trust: { tamara: -2, bisola: 6, hauwa: 6, zee: -4 },
    memory: {
      bisola: 'You pulled up to a billionaire party in a ₦4,500 thrifted dress. Iconic.',
      hauwa: 'You chose to be yourself instead of borrowing a costume.',
      zee: 'You wore thrift to her 21st.',
      tamara: 'You turned down her Paris couture.',
    },
  },
  dragged_dress: {
    trust: { tamara: 6 },
    memory: { tamara: 'She had to beg on your floor, but you wore the gown.' },
  },
  // The girls at the party
  charmed_zee: {
    trust: { zee: 12, chi: -4 },
    memory: { zee: 'You were the only girl who wished her happy birthday like you meant it.', chi: 'You won Zee’s approval in front of her.' },
  },
  checked_chioma: {
    trust: { chi: -6, bisola: 4, hauwa: 3, zee: -3 },
    memory: {
      chi: 'You clapped back at her in front of everyone at Zee’s party.',
      bisola: 'You served the best clapback of the night.',
      zee: 'You started a fight at her birthday.',
    },
  },
  stayed_with_hauwa: {
    trust: { hauwa: 10, tamara: 2, zee: -2 },
    memory: { hauwa: 'You stood beside her and watched the room instead of performing for it.' },
  },
  // Meeting Chidi
  bantered_with_chidi: {
    trust: { chidi: 8 },
    memory: { chidi: 'You joked that the cake had a lighting plan, and saw through the party with him.' },
  },
  flirted_with_chidi: {
    trust: { chidi: 6 },
    memory: { chidi: 'You asked who takes photos of the photographer.' },
  },
  confided_chidi_incognito: {
    trust: { chidi: 10 },
    memory: { chidi: 'You asked him to keep you out of his shots, and he promised.' },
  },
  // Kelvin arrives
  challenged_kelvin: {
    trust: { kelvin: 8, chidi: -3 },
    memory: { kelvin: 'You told him not to stand so close to the deep end.' },
  },
  kept_kelvin_at_bay: {
    trust: { kelvin: 4, chidi: 4, tamara: 2 },
    memory: { kelvin: 'You told him you weren’t anyone’s weekend pastime.', chidi: 'You didn’t fall for Kelvin’s charm.' },
  },
  locked_eyes_kelvin: {
    trust: { kelvin: 10, chidi: -6 },
    memory: { kelvin: 'You took his champagne and held his gaze without blinking.', chidi: 'He watched you and Kelvin lock eyes.' },
  },
  // The leak
  demanded_leak_answers: {
    trust: { zee: -10, chi: -4, bisola: -2, tamara: 3 },
    memory: {
      zee: 'You shouted at her guests in her house, on her birthday.',
      chi: 'You accused the whole room, her included.',
      tamara: 'You refused to hide, and she was proud of you.',
    },
  },
  kelvin_shield_exit: {
    trust: { kelvin: 12, zee: -4, chidi: -4 },
    memory: { kelvin: 'You let him shield you from sixty cameras.', zee: 'Her brother took your side at her own party.' },
  },
  chidi_archive_alliance: {
    trust: { chidi: 12, kelvin: -3 },
    memory: { chidi: 'You trusted him and his camera to find the truth.' },
  },

  /* ---------------- Episode 2 ---------------- */
  unbothered_walk: {
    trust: { hauwa: 4, tamara: 2 },
    memory: { hauwa: 'You walked into class after the leak like nothing could touch you.' },
  },
  investigated_comments: {
    trust: { chidi: 3 },
    memory: { chidi: 'You found the burner account’s comment yourself.' },
  },
  peacemaker_ada: {
    trust: { tamara: 4, chi: 8 },
    memory: { chi: 'You stopped Tamara accusing her in public.', tamara: 'You calmed her down before she said something she’d regret.' },
  },
  pressed_chioma: {
    trust: { chi: -8, tamara: 6 },
    memory: { chi: 'You made her unlock her phone in front of students.', tamara: 'You backed her up against Chioma.' },
  },
  cleared_chioma_camera: {
    trust: { chi: 10, tamara: -2 },
    memory: { chi: 'You cleared her name out loud after checking her phone.' },
  },
  spotted_chioma_whatsapp: {
    trust: { chi: -12, tamara: 2 },
    memory: { chi: 'You read her agency message and threw it back at her. She threatened you.' },
  },
  chidi_trust_deepened: {
    trust: { chidi: 10 },
    memory: { chidi: 'You told him he’s the only one who treats you like a human being.' },
  },
  chidi_exif_search: {
    trust: { chidi: 6 },
    memory: { chidi: 'You worked the metadata together. “Detective Ada.”' },
  },
  drove_with_kelvin: {
    trust: { kelvin: 8, chidi: -6 },
    memory: { kelvin: 'You got into his Porsche.', chidi: 'He saw you get into Kelvin’s Porsche.' },
  },
  refused_kelvin_ride: {
    trust: { kelvin: 3, chidi: 4 },
    memory: { kelvin: 'You turned down his Porsche on the pavement. He hasn’t forgotten.', chidi: 'You said no to Kelvin’s car.' },
  },
  accepted_kelvin_favor: {
    trust: { kelvin: 8 },
    memory: { kelvin: 'You thanked him for the ride and the intel.' },
  },
  suspected_kelvin_family: {
    trust: { kelvin: -3 },
    memory: { kelvin: 'You said the cash smelled like his family’s circle.' },
  },
  bisola_contract_pressed: {
    trust: { bisola: -8, hauwa: -2 },
    memory: { bisola: 'You caught her talking about a contract on her second phone.' },
  },
  hauwa_calm_questioned: {
    trust: { hauwa: -6, bisola: 2 },
    memory: { hauwa: 'You told her she always seems to know things first.' },
  },
  sided_with_chidi: {
    trust: { chidi: 12, kelvin: -10 },
    memory: { chidi: 'On the rooftop you chose truth over Kelvin’s money.', kelvin: 'You chose Chidi over him on the rooftop.' },
  },
  sided_with_kelvin: {
    trust: { kelvin: 12, chidi: -12 },
    memory: { kelvin: 'On the rooftop you chose his leverage.', chidi: 'You chose Kelvin over him on the rooftop.' },
  },
  accepted_pa_job: {
    trust: { zee: 10 },
    memory: { zee: 'You took her offer on the bridge at midnight.' },
  },
  negotiated_pa_terms: {
    trust: { zee: 6 },
    memory: { zee: 'You negotiated your own contract. Her lawyer hates you; she respects it.' },
  },

  /* ---------------- Episode 3 ---------------- */
  pact_with_zee: {
    trust: { zee: 10 },
    memory: { zee: 'You promised to catch the leaker “for both of your sakes”.' },
  },
  warned_zee: {
    trust: { zee: -8 },
    memory: { zee: 'You told her to make sure her own hands were clean.' },
  },
  helped_bisola: {
    trust: { bisola: 12, tamara: -3 },
    memory: { bisola: 'You fixed her caption when nobody else would help.', tamara: 'You were “too nice” to Bisola.' },
  },
  noted_bisola_motive: {
    trust: { bisola: -4 },
    memory: { bisola: 'You stared at her for a full minute. She noticed.' },
  },
  chidi_romantic_moment: {
    trust: { chidi: 10 },
    memory: { chidi: 'You held his hand on the cabana deck.' },
  },
  chidi_intel_pocketed: {
    trust: { chidi: 6 },
    memory: { chidi: 'You pocketed his thumb drive and went straight to work.' },
  },
  kelvin_confronted_warning: {
    trust: { kelvin: 6 },
    memory: { kelvin: 'You asked if he was warning you or threatening you.' },
  },
  challenged_kelvin_closet: {
    trust: { kelvin: 8 },
    memory: { kelvin: 'You told him not to leave his family’s closet unlocked.' },
  },
  stepped_out_hauwa: {
    trust: { hauwa: 4 },
    memory: { hauwa: 'You stepped out of hiding and asked her for tea.' },
  },
  hauwa_tea_alliance: {
    trust: { hauwa: 10 },
    memory: { hauwa: 'You thanked her for the tea and the warning.' },
  },
  pressed_hauwa_keys: {
    trust: { hauwa: -8 },
    memory: { hauwa: 'You implied she knows which doors are being opened.' },
  },
};
