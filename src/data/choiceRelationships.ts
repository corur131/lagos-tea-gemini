import { CharacterId } from '../types/vn';
import { COMMENT_IMPACTS } from './commentChoices';

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

  /* ---------------- Episode 4 ---------------- */
  took_burner: { trust: { bisola: -6 }, memory: { bisola: 'You snatched the burner phone out of her hand in the archive.' } },
  photographed_instructions: { trust: { bisola: -2 }, memory: { bisola: 'You photographed the blackmail message on her screen.' } },
  followed_bisola: { trust: { bisola: 4 }, memory: { bisola: 'You let her walk out with the phone, then came to find her.' } },
  returned_burner_after_copy: { trust: { bisola: 10 }, memory: { bisola: 'You gave the phone back so she could make the drop and keep her secret.' } },
  kept_burner: { trust: { bisola: -12 }, memory: { bisola: 'You kept the phone, knowing they would come for her.' } },
  bisola_deal: { trust: { bisola: 10 }, memory: { bisola: 'You promised to keep her secret if she brings you every message.' } },
  threatened_bisola: { trust: { bisola: -14, zee: 3 }, memory: { bisola: 'You gave her until breakfast to confess to Zee.' } },
  comforted_bisola: { trust: { bisola: 14, hauwa: 2 }, memory: { bisola: 'You hugged her on the laundry room floor and said nobody should own her.' } },
  admitted_archive: { trust: { zee: 4, chi: 4, tamara: 2 }, memory: { zee: 'You told the whole kitchen you found the Lagos Tea phone in her archive.', chi: 'You told the truth at breakfast, under pressure.' } },
  lied_archive: { trust: { zee: -8 }, memory: { zee: 'You lied about fetching her brand decks. She knows her own calendar.' } },
  exposed_second_key: { trust: { zee: -3, hauwa: 4, chi: 3 }, memory: { hauwa: 'You asked about MASTER-2 when everyone else was staring at you.', zee: 'You turned her accusation back onto her master keys.' } },
  zee_alliance_ep4: { trust: { zee: 12 }, memory: { zee: 'You agreed to catch the blackmailer with her before her mother’s 60th.' } },
  pressed_zee_father: { trust: { zee: -10, kelvin: -4 }, memory: { zee: 'You asked what her father signed in 2019.', kelvin: 'Zee told him you asked about their father.' } },
  screenshotted_zee_dms: { trust: {}, memory: {} },
  chidi_darkroom_moment: { trust: { chidi: 10 }, memory: { chidi: 'You stood close in the red light of his darkroom and told him to keep your photo safe.' } },
  pushed_chidi_entrance: { trust: { chidi: -6 }, memory: { chidi: 'You pushed him about a camera flash at the party entrance.' } },
  showed_chidi_burner: { trust: { chidi: 6 }, memory: { chidi: 'You trusted him with the burner phone.' } },
  kelvin_bridge_flirt: { trust: { kelvin: 10 }, memory: { kelvin: 'You asked if he wanted you to stand out, or stand next to him.' } },
  caught_kelvin_log: { trust: { kelvin: -8 }, memory: { kelvin: 'You caught him knowing about the lock log Zee swore she told nobody about.' } },
  asked_kelvin_logs: { trust: { kelvin: 6 }, memory: { kelvin: 'You asked him to pull the lock logs for MASTER-2.' } },
  defended_bisola_meeting: { trust: { bisola: 10, chi: -4, zee: -3 }, memory: { bisola: 'You defended her at the house meeting when Chioma came for her.', chi: 'You defended Bisola against her at the house meeting.' } },
  pressed_chi_meeting: { trust: { chi: -10, zee: 6 }, memory: { chi: 'You sided with Zee and told her to put her phone down.', zee: 'You backed her at the house meeting.' } },
  grabbed_in_dark: { trust: { hauwa: -2, tamara: -2, zee: -2, chi: -2, bisola: -2 }, memory: { hauwa: 'You reached for the tray in the dark.' } },
  dayo_owambe_date: { trust: { dayo: 10 }, memory: { dayo: 'You promised to find him at the Owambe booth.' } },
  asked_dayo_m: { trust: { dayo: -4 }, memory: { dayo: 'You asked him if he knew anyone called M.' } },
  dayo_truth_call: { trust: { dayo: 12 }, memory: { dayo: 'You fell asleep on the rooftop listening to him talk about his mum’s piano.' } },
  accepted_tamara_money: { trust: { tamara: 10 }, memory: { tamara: 'You let her pay your fees.' } },
  refused_tamara_money: { trust: { tamara: 4, hauwa: 3 }, memory: { tamara: 'You refused her money. Stubborn since primary school.' } },
  asked_tamara_brand: { trust: { tamara: -3 }, memory: { tamara: 'You asked which brand was paying her.' } },
  took_master2: { trust: { hauwa: 10 }, memory: { hauwa: 'You took the MASTER-2 key and promised not to stop looking.' } },
  refused_master2: { trust: { hauwa: 4 }, memory: { hauwa: 'You asked why she was really helping you.' } },
  accused_hauwa_hiding: { trust: { hauwa: -10 }, memory: { hauwa: 'You said watching the planter for three weeks was hiding, not watching.' } },
  signed_lawsuit: { trust: { chi: 14 }, memory: { chi: 'You signed as plaintiff against @TheLagosTea.' } },
  delayed_lawsuit: { trust: { chi: 4 }, memory: { chi: 'You held off signing to keep the page comfortable. She respects it.' } },
  doubted_chi_whisper: { trust: { chi: -12 }, memory: { chi: 'You doubted her when she told you about the whisper on the mezzanine.' } },
  called_mama: { trust: {}, memory: {} },
};

// Ada's Gidigram comments move trust too (see commentChoices.ts)
Object.assign(RELATIONSHIP_IMPACTS, COMMENT_IMPACTS);
