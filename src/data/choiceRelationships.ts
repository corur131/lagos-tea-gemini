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

  /* ---------------- Episode 5 ---------------- */
  wore_gold: { trust: { zee: 4 }, memory: { zee: 'You wore her mother’s gold like everyone else.' } },
  wore_red: { trust: { zee: -6, kelvin: 6 }, memory: { zee: 'You wore red to her mother’s gold aso-ebi party.', kelvin: 'You wore red, like he told you.' } },
  gave_key_tamara: { trust: { tamara: 8 }, memory: { tamara: 'You trusted her to hold the brass key at the Owambe.' } },
  sprayed_mama_bello: { trust: { zee: 6, kelvin: 3 }, memory: { zee: 'You sprayed Mama like a true daughter of Ajegunle.' } },
  warned_zee_screen: { trust: { zee: 8 }, memory: { zee: 'You warned her about the teacup on the screen before anyone else saw it.' } },
  kelvin_mama_moment: { trust: { kelvin: 8 }, memory: { kelvin: 'You told him his mother is wonderful.' } },
  danced_with_dayo: { trust: { dayo: 10 }, memory: { dayo: 'You pulled him out of the booth to dance at the Owambe.' } },
  told_dayo_surulere: { trust: { dayo: 8 }, memory: { dayo: 'You told him what you were chasing goes to Surulere at night.' } },
  kept_dayo_waiting: { trust: { dayo: 2 }, memory: { dayo: 'You handed his headphones back. “Later.”' } },
  dayo_slow_song: { trust: { dayo: 8, chidi: -3, kelvin: -3 }, memory: { dayo: 'You stayed in his arms until the song ended.' } },
  went_to_chidi: { trust: { chidi: 8, dayo: -2 }, memory: { chidi: 'You left the dance floor to come and find him.' } },
  told_chidi_carpark: { trust: { chidi: 8 }, memory: { chidi: 'You told him about Level B and asked him to watch your back.' } },
  kept_carpark_secret: { trust: { chidi: -2 }, memory: { chidi: 'You said “just Zee stress”. He didn’t believe you.' } },
  asked_chidi_texts: { trust: { chidi: -6 }, memory: { chidi: 'You asked who kept texting him at the Owambe.' } },
  ran_to_av_booth: { trust: { kelvin: 2, hauwa: 3 }, memory: { hauwa: 'You ran for the AV booth while everyone else stared.' } },
  shielded_zee: { trust: { zee: 15, kelvin: 4 }, memory: { zee: 'You held her arm in front of six hundred people when the screen changed.' } },
  filmed_screen_reactions: { trust: { zee: -8 }, memory: { zee: 'You filmed the hall while her mother’s secret played on the screen.' } },
  took_ilashe_usb: { trust: { kelvin: -4 }, memory: { kelvin: 'You took the flash drive before his family’s lawyers could.' } },
  gave_kelvin_usb: { trust: { kelvin: 8 }, memory: { kelvin: 'You stepped back and let him take the flash drive.' } },
  carpark_alone: { trust: {}, memory: {} },
  dayo_backup: { trust: { dayo: 8 }, memory: { dayo: 'You asked him to watch from the shadows on Level B.' } },
  kelvin_security: { trust: { kelvin: 6 }, memory: { kelvin: 'You asked him to put security on the car park exits.' } },
  grabbed_the_fan: { trust: {}, memory: {} },
  surrendered_key: { trust: { hauwa: -6 }, memory: { hauwa: 'You handed the key to the figure on Level B.' } },
  screamed_carpark: { trust: {}, memory: {} },
  rode_home_dayo: { trust: { dayo: 8 }, memory: { dayo: 'You left the Owambe in his car.' } },
  rode_home_kelvin: { trust: { kelvin: 8 }, memory: { kelvin: 'You left the Owambe with him. He drove himself.' } },
  rode_home_chidi: { trust: { chidi: 6 }, memory: { chidi: 'You left the Owambe in his old Corolla to hear the truth.' } },
  rode_home_tamara: { trust: { tamara: 10 }, memory: { tamara: 'You shared a Bolt home, both of you barefoot and shaking.' } },
  dayo_cheek_kiss: { trust: { dayo: 10 }, memory: { dayo: 'You kissed him on the cheek outside the Content House gate.' } },
  asked_dayo_receipt: { trust: { dayo: 4 }, memory: { dayo: 'You asked him for a photo of the landlord’s receipt.' } },
  kelvin_give_land_back: { trust: { kelvin: 10, zee: 4 }, memory: { kelvin: 'You told him to give the land back fast, not quiet.' } },
  held_kelvin_hand: { trust: { kelvin: 12 }, memory: { kelvin: 'You held his hand on the Falomo bridge and said nothing.' } },
  trusted_chidi_carpark: { trust: { chidi: 10 }, memory: { chidi: 'You believed him about the car park.' } },
  saw_chidi_text: { trust: { chidi: -6 }, memory: { chidi: 'You asked to see the text on his phone.' } },
  promised_tamara_first: { trust: { tamara: 12 }, memory: { tamara: 'You promised she’d be the first person you tell. Always.' } },
  asked_tamara_where: { trust: { tamara: -8 }, memory: { tamara: 'You asked where she was when the screen changed.' } },
  comforted_zee_2am: { trust: { zee: 14 }, memory: { zee: 'You took the bottle away at 2 AM and made her tea.' } },
  told_zee_gloves: { trust: { zee: 6, tamara: -3, chi: -3 }, memory: { zee: 'You told her the woman who delivered the slide wore lace gloves.' } },
  told_zee_ilashe: { trust: { zee: -4, kelvin: 6 }, memory: { zee: 'You told her to stop worrying about the Guild and worry about Ilashe.' } },
  made_the_list: { trust: {}, memory: {} },
  called_chi_3am: { trust: { chi: 10 }, memory: { chi: 'You called her at 3 AM, and she picked up on the second ring.' } },
  drafted_own_story: { trust: {}, memory: {} },

  /* ---------------- Episode 6 ---------------- */
  posted_own_story: { trust: { chi: 6, hauwa: 6, bisola: 4, zee: 2 }, memory: { chi: 'You told your own story before the page could.', hauwa: 'You posted the truth about your debt yourself.' } },
  phone_off_morning: { trust: {}, memory: {} },
  studied_debt_leak: { trust: { hauwa: 4 }, memory: { hauwa: 'You studied the leak instead of the comments.' } },
  left_zee_graciously: { trust: { zee: 10 }, memory: { zee: 'You thanked her and wished her luck as she fired you.' } },
  threatened_zee_dms: { trust: { zee: -18 }, memory: { zee: 'You threatened her with screenshots of her blackmail DMs.' } },
  argued_with_zee: { trust: { zee: -2 }, memory: { zee: 'You told her she was doing the page’s job for it.' } },
  stay_tamara: { trust: { tamara: 12 }, memory: { tamara: 'You moved into her family’s Ikoyi flat after Zee fired you.' } },
  stay_dayo: { trust: { dayo: 12, tamara: -4 }, memory: { dayo: 'You took his sofa bed in Surulere.', tamara: 'You chose the music guy’s sofa over her spare room.' } },
  stay_mama: { trust: { hauwa: 3 }, memory: { hauwa: 'You went home to Ajegunle when everything fell apart.' } },
  asked_tamara_phone: { trust: { tamara: -6 }, memory: { tamara: 'You asked who was on the phone in her corridor.' } },
  milo_with_tamara: { trust: { tamara: 14 }, memory: { tamara: 'You drank Milo and fell asleep on her shoulder, like when you were nine.' } },
  saw_woman_upstairs: { trust: { dayo: 4 }, memory: { dayo: 'You crept to the stairwell to see the woman upstairs.' } },
  dayo_song_night: { trust: { dayo: 14 }, memory: { dayo: 'You fell asleep listening to his song for the third time.' } },
  kept_tl_card: { trust: {}, memory: {} },
  asked_mama_about_tamara: { trust: {}, memory: {} },
  chi_counsel: { trust: { chi: 14 }, memory: { chi: 'You asked her to represent you before the scholarship board.' } },
  self_counsel: { trust: { chi: 6 }, memory: { chi: 'You chose to face the board alone. She prepared you anyway.' } },
  asked_who_entered_room: { trust: { chi: 8 }, memory: { chi: 'You asked her to find out who entered your Ajegunle room.' } },
  found_chidi_contact_sheet: { trust: { chidi: -6 }, memory: { chidi: 'You opened his drawer and found the contact sheet.' } },
  didnt_snoop_chidi: { trust: { chidi: 10 }, memory: { chidi: 'You left his drawer closed.' } },
  asked_chidi_straight: { trust: { chidi: 4 }, memory: { chidi: 'You asked him straight out about the entrance photo.' } },
  left_chidi: { trust: { chidi: -14 }, memory: { chidi: 'You walked out of the darkroom and told him not to call.' } },
  chidi_debt_of_honour: { trust: { chidi: 6 }, memory: { chidi: 'You told him to pay it back by helping you catch her.' } },
  forgave_chidi: { trust: { chidi: 14 }, memory: { chidi: 'You sat on the darkroom floor with him. “Rent. I know about rent.”' } },
  apologised_to_board: { trust: { chi: 6 }, memory: { chi: 'You apologised to the scholarship board with your head up.' } },
  vowed_to_board: { trust: { chi: 4, hauwa: 4 }, memory: { chi: 'You promised the board you would bring proof.' } },
  smiled_on_senate_steps: { trust: { tamara: 8, bisola: 4 }, memory: { tamara: 'You smiled with her for the camera on the Senate steps.' } },
  asked_hauwa_photographer: { trust: { hauwa: 8 }, memory: { hauwa: 'You came down the steps to ask her who paid the photographer.' } },
  chased_steps_photographer: { trust: { hauwa: 3, tamara: -3 }, memory: { tamara: 'You ran off after a photographer and left her holding the roses.' } },
  bisola_double_agent: { trust: { bisola: 12 }, memory: { bisola: 'You made her your double agent. Agent Jollof.' } },
  bisola_said_no: { trust: { bisola: 10 }, memory: { bisola: 'You told her she is worth more than their leash.' } },
  asked_bisola_who_knew: { trust: { bisola: 2 }, memory: { bisola: 'You asked her exactly who knew where you moved.' } },
  refused_kelvin_money: { trust: { kelvin: 6 }, memory: { kelvin: 'You refused to let him clear your debt.' } },
  accepted_kelvin_money: { trust: { kelvin: 10 }, memory: { kelvin: 'You let him help with your debt, just once.' } },
  kept_admin_list: { trust: { kelvin: 6 }, memory: { kelvin: 'You kept the smart-lock admin list and asked him to drive.' } },
  counted_honestly: { trust: { hauwa: 8 }, memory: { hauwa: 'You counted honestly, like her note asked.' } },
  tore_up_list: { trust: { hauwa: -4 }, memory: { hauwa: 'You tore up the list she asked you to make.' } },
  pressed_hauwa_note: { trust: { hauwa: -2 }, memory: { hauwa: 'You asked why she couldn’t just tell you.' } },
  called_dayo_rock_bottom: { trust: { dayo: 12 }, memory: { dayo: 'You called him at 1 AM, at rock bottom. He played the piano down the phone.' } },
  called_kelvin_rock_bottom: { trust: { kelvin: 12 }, memory: { kelvin: 'You called him at 1 AM. He sat on a kerb with you until 3.' } },
  called_chidi_rock_bottom: { trust: { chidi: 12 }, memory: { chidi: 'You called him at 1 AM, even after everything.' } },
  slept_by_mama: { trust: {}, memory: {} },
  called_mama_rock_bottom: { trust: {}, memory: {} },
  said_yes_to_tea: { trust: {}, memory: {} },
  refused_tea_offer: { trust: { chi: 4, hauwa: 4 }, memory: { hauwa: 'You told the page you were coming for it.' } },
  forwarded_offer_to_chi: { trust: { chi: 10 }, memory: { chi: 'You forwarded the page’s job offer to her with one word: “Evidence.”' } },

  /* ---------------- Episode 7 ---------------- */
  partner_chidi: { trust: { chidi: 10 }, memory: { chidi: 'You chose him to follow the money with you.' } },
  partner_kelvin: { trust: { kelvin: 10 }, memory: { kelvin: 'You chose him to follow the money with you.' } },
  partner_dayo: { trust: { dayo: 10 }, memory: { dayo: 'You chose him to follow the money with you.' } },
  partner_hauwa: { trust: { hauwa: 12 }, memory: { hauwa: 'You chose her to follow the money with you.' } },
  photographed_wallet: { trust: {}, memory: {} },
  got_transaction_list: { trust: {}, memory: {} },
  kept_tl_statement: { trust: {}, memory: {} },
  circled_gloves_line: { trust: { chi: -2, tamara: -2 }, memory: {} },
  trusted_chi_cac: { trust: { chi: 14 }, memory: { chi: 'You believed her, and took her to Yaba with you.' } },
  went_yaba_without_chi: { trust: { chi: -6 }, memory: { chi: 'You went to Yaba without her. “No offence.”' } },
  photographed_ronke_book: { trust: {}, memory: {} },
  showed_ronke_photo: { trust: {}, memory: {} },
  got_glow_cream: { trust: {}, memory: {} },
  honest_with_chidi_car: { trust: { chidi: 8 }, memory: { chidi: 'You told him you weren’t sure you could forgive him, but you were glad he was there.' } },
  held_kelvin_car: { trust: { kelvin: 10 }, memory: { kelvin: 'You held his hand on the gearstick during the stake-out.' } },
  dayo_sang_car: { trust: { dayo: 10 }, memory: { dayo: 'You asked him to sing the song he hasn’t released.' } },
  asked_hauwa_patience: { trust: { hauwa: 6 }, memory: { hauwa: 'You asked her where she learned to wait.' } },
  dashboard_case_review: { trust: {}, memory: {} },
  called_mama_stakeout: { trust: {}, memory: {} },
  followed_bolt: { trust: {}, memory: {} },
  opened_locker_214: { trust: {}, memory: {} },
  chidi_bait: { trust: { chidi: 4 }, memory: { chidi: 'You told him he would be the bait.' } },
  hugged_chidi_ep7: { trust: { chidi: 12 }, memory: { chidi: 'You hugged him when you were both too tired for anything else.' } },
  ended_chidi: { trust: { chidi: -15 }, memory: { chidi: 'You told him that after tonight you never want to see him again.' } },
  zee_rejoined: { trust: { zee: 14 }, memory: { zee: 'You asked her back into the fight. Not as your boss. As Zee.' } },
  praised_kelvin_ilashe: { trust: { kelvin: 12 }, memory: { kelvin: 'You called giving Ilashe back the bravest thing you’d seen a rich man do.' } },
  asked_sticky_note: { trust: { zee: 2 }, memory: {} },
  entered_flat: { trust: {}, memory: {} },
  entered_flat_with_chi: { trust: { chi: 6 }, memory: { chi: 'You called her before breaking into the flat.' } },
  photographed_wall: { trust: {}, memory: {} },
  matched_glove: { trust: {}, memory: {} },
  saw_mango_wallpaper: { trust: {}, memory: {} },
  teamed_with_hauwa: { trust: { hauwa: 14 }, memory: { hauwa: 'You chose to work with her after she told you the truth. No more riddles.' } },
  called_out_hauwa: { trust: { hauwa: -8 }, memory: { hauwa: 'You asked how she was any different from them.' } },
  demanded_hauwa_name: { trust: { hauwa: -2 }, memory: { hauwa: 'You demanded a name she wouldn’t give without proof.' } },
  smiled_at_camera: { trust: {}, memory: {} },
  left_flat_untouched: { trust: {}, memory: {} },
  called_house_meeting_ep7: { trust: { bisola: 2, zee: 2 }, memory: {} },

  /* ---------------- Episode 8 ---------------- */
  kept_plan_from_chi: { trust: { chi: 2 }, memory: { chi: 'You asked her to trust you for one week without explaining.' } },
  asked_chi_guild_card: { trust: { chi: -4 }, memory: { chi: 'You asked about the Guild secret on the page’s wall.' } },
  chi_police_petition: { trust: { chi: 8 }, memory: { chi: 'You asked her to draft the police petition, with a blank for the name.' } },
  questioned_hauwa_bait: { trust: { hauwa: 2 }, memory: { hauwa: 'You asked why you should trust her at all. She respected that.' } },
  bait_in_person: { trust: { hauwa: 3 }, memory: {} },
  zee_bait_set: { trust: { zee: 4 }, memory: { zee: 'You told her about a 2021 Ilashe paper with her signature. “Only you.”' } },
  zee_black_phone: { trust: { zee: -8 }, memory: { zee: 'You asked why her hand was on her black phone.' } },
  zee_bait_soft: { trust: { zee: 6 }, memory: { zee: 'You told her you might have read the 2021 paper wrong.' } },
  bisola_final_job_yes: { trust: { bisola: 6 }, memory: { bisola: 'You told her to accept the million-naira job so you would know it first.' } },
  bisola_final_job_no: { trust: { bisola: 12 }, memory: { bisola: 'You told her she was done being anyone’s delivery girl. She threw her phone in the pool.' } },
  noted_bisola_no_question: { trust: {}, memory: {} },
  tamara_bait_set: { trust: { tamara: 8 }, memory: { tamara: 'You told her you were leaving Lagos on Sunday, and let her cry on you.' } },
  asked_tamara_paintings: { trust: { tamara: -8 }, memory: { tamara: 'You asked where the television went.' } },
  tamara_chi_mention: { trust: { tamara: 2 }, memory: { tamara: 'You made her promise not to tell Chioma.' } },
  chi_bait_set: { trust: { chi: 2 }, memory: {} },
  checked_chi_gloves: { trust: { chi: -6 }, memory: { chi: 'You asked to inspect her lace gloves.' } },
  hugged_chi_bait: { trust: { chi: 10 }, memory: { chi: 'You hugged her in her hostel room. She doesn’t do hugs.' } },
  night8_dayo: { trust: { dayo: 8 }, memory: { dayo: 'You came to the studio at 1 AM when he said he couldn’t sleep.' } },
  night8_kelvin: { trust: { kelvin: 8 }, memory: { kelvin: 'You got in the Camry at 1 AM.' } },
  night8_chidi: { trust: { chidi: 8 }, memory: { chidi: 'You came to the darkroom at 1 AM, even after everything.' } },
  dayo_piano_bench: { trust: { dayo: 14 }, memory: { dayo: 'You kissed him on the piano bench. He found the bridge.' } },
  dayo_parcel: { trust: { dayo: 6 }, memory: { dayo: 'You took him on a “detective date” up to the third floor.' } },
  kelvin_bridge_kiss: { trust: { kelvin: 14 }, memory: { kelvin: 'You kissed him on Third Mainland Bridge with the whole lagoon watching.' } },
  kelvin_glow_payers: { trust: { kelvin: 6 }, memory: { kelvin: 'You asked for every name that paid Glow Republic.' } },
  chidi_darkroom_lesson: { trust: { chidi: 14 }, memory: { chidi: 'You asked him to teach you to develop a photo, and kept your hand under his.' } },
  chidi_abeg: { trust: { chidi: 4 }, memory: { chidi: 'You asked him to say “abeg” the way she said it.' } },
  kiosk_kelvin: { trust: { kelvin: 10 }, memory: { kelvin: 'You let his lawyers save your mother’s kiosk.' } },
  kiosk_chidi_women: { trust: { chidi: 10 }, memory: { chidi: 'You took his ₦150,000 for your mother’s kiosk.' } },
  kiosk_court: { trust: { chi: 10 }, memory: { chi: 'You let her fight for the kiosk in court.' } },
  rushed_to_chi: { trust: { chi: -2 }, memory: {} },
  called_hauwa_canary: { trust: { hauwa: 8 }, memory: { hauwa: 'You called her the minute the canary sang.' } },
  screenshotted_bait_post: { trust: {}, memory: {} },
  believed_chi_ep8: { trust: { chi: 16 }, memory: { chi: 'You believed her when the bait came back with her name on it.' } },
  doubted_chi_ep8: { trust: { chi: -16 }, memory: { chi: 'You told her to stay away from the gala.' } },
  united_with_chi: { trust: { chi: 12 }, memory: { chi: 'You showed her the page’s dare and held out your hand.' } },

  /* ---------------- Episode 9 ---------------- */
  final_review: { trust: { hauwa: 6 }, memory: { hauwa: 'You went through every clue out loud before the gala.' } },
  asked_chi_list: { trust: { chi: 6 }, memory: { chi: 'You asked for her list, and carried it all night.' } },
  bisola_bring_drive: { trust: { bisola: 8 }, memory: { bisola: 'You made her Agent Jollof one last time.' } },
  bisola_stay_safe: { trust: { bisola: 12 }, memory: { bisola: 'You told her to be pretty and safe on gala night.' } },
  asked_bisola_monday: { trust: { bisola: 2 }, memory: {} },
  promised_tamara_after: { trust: { tamara: 8 }, memory: { tamara: 'You promised to find her after the gala, whatever happened.' } },
  asked_tamara_ajegunle: { trust: { tamara: -8 }, memory: { tamara: 'You asked if she ever went back to Ajegunle without you.' } },
  held_tamara_silent: { trust: { tamara: 4 }, memory: {} },
  sang_in_car: { trust: { zee: 4, bisola: 4, tamara: 4 }, memory: { bisola: 'You all sang badly in Zee’s car on the way to the gala.' } },
  asked_zee_phone_final: { trust: { zee: 6 }, memory: { zee: 'You finally asked about the black phone, and she showed you.' } },
  asked_hauwa_seven: { trust: { hauwa: 4 }, memory: {} },
  gala_dance_dayo: { trust: { dayo: 8 }, memory: { dayo: 'You danced with him to “Window” at the gala.' } },
  gala_dance_kelvin: { trust: { kelvin: 8 }, memory: { kelvin: 'You danced with him at the gala.' } },
  gala_dance_chidi: { trust: { chidi: 8 }, memory: { chidi: 'You danced with him at the gala. He took his camera off.' } },
  dayo_said_love: { trust: { dayo: 14 }, memory: { dayo: 'You asked him to say it without the joke. He did.' } },
  kelvin_real_question: { trust: { kelvin: 14 }, memory: { kelvin: 'You asked if he would propose for real one day.' } },
  chidi_gala_photo: { trust: { chidi: 12 }, memory: { chidi: 'You let him take one photo of you at the gala. You were laughing.' } },
  forgave_chidi_gala: { trust: { chidi: 14 }, memory: { chidi: 'You forgave him. Not all of it. But enough.' } },
  started_with_truth: { trust: { hauwa: 6, chi: 4 }, memory: { hauwa: 'You said your own name first, on the gala stage.' } },
  accused_zee: { trust: { zee: -20 }, memory: { zee: 'You named her as @TheLagosTea in front of three million people.' } },
  accused_chi: { trust: { chi: -20 }, memory: { chi: 'You named her as @TheLagosTea in front of three million people.' } },
  accused_bisola: { trust: { bisola: -20 }, memory: { bisola: 'You named her as @TheLagosTea in front of three million people.' } },
  accused_hauwa: { trust: { hauwa: -20 }, memory: { hauwa: 'You named her as @TheLagosTea in front of three million people.' } },
  accused_tamara: { trust: { tamara: -20 }, memory: { tamara: 'You said her name on the stage.' } },
  apologised_live: { trust: { chi: 2, zee: 2, bisola: 2, hauwa: 2 }, memory: {} },
  hugged_tamara_end: { trust: { tamara: 10 }, memory: { tamara: 'You held her before they took her. “You just never stopped running.”' } },
  handed_tamara_over: { trust: { chi: 8 }, memory: { chi: 'You asked her to fill in the blank.' } },
  made_her_log_off: { trust: { hauwa: 6 }, memory: { hauwa: 'You made the page log off forever, live.' } },
};

// Ada's Gidigram comments move trust too (see commentChoices.ts)
Object.assign(RELATIONSHIP_IMPACTS, COMMENT_IMPACTS);
