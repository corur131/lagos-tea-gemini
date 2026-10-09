import { OutfitId, SceneData } from '../types/vn';

/* =========================================================================
   WHAT ADA WEARS IN THE STORY
   Some scenes need a particular look: the gown Tamara brings for Zee's
   party, pyjamas at 2 AM, gym clothes for the 6 AM stake-out, gold aso-ebi
   for the Owambe. In those scenes Ada is dressed for the moment; her own
   saved outfit is never overwritten and comes back when the scene ends.
   A "dress code" accepts any outfit from its list, so if what she already
   wears fits, she keeps it.
   ========================================================================= */

export interface DressCode {
  /** Shown on screen: "Dressed for the scene: …" */
  label: string;
  /** Outfits that already count for this scene */
  allowed: OutfitId[];
  /** What she changes into when her own outfit doesn't fit */
  wear: OutfitId;
}

const PARTY: OutfitId[] = ['party_dress', 'corset_top', 'tube_top', 'thrift_dress', 'native_lace', 'halter_top', 'aso_oke', 'bubu_kaftan'];
const WORK: OutfitId[] = ['corporate', 'adire_shirt', 'cardigan_set', 'denim_jacket'];

const NIGHT_OUT: OutfitId[] = ['hoodie', 'athleisure', 'denim_jacket', 'casual', 'jersey_top'];

const code = (label: string, wear: OutfitId, allowed: OutfitId[] = [wear]): DressCode => ({ label, wear, allowed });

/** Mama Bello's 60th: gold aso-ebi, or the red look Kelvin suggested */
function owambeLook(flags: Record<string, boolean>): DressCode {
  if (flags.wore_red) return code('Owambe night, in red', 'corset_top');
  return code('Owambe night, gold aso-ebi', 'aso_ebi');
}

/** The gown Ada chose (or was dragged into) for Zee's 21st */
function partyDressFromChoice(flags: Record<string, boolean>): DressCode | undefined {
  if (flags.vintage_style_dress) return code('Your ₦4,500 thrift dress', 'thrift_dress');
  if (flags.borrowed_emerald_dress || flags.dragged_dress) return code('Tamara’s emerald gown', 'party_dress');
  return undefined;
}

const SCENE_CODES: Record<string, (flags: Record<string, boolean>) => DressCode | undefined> = {
  /* Episode 1: the dress is chosen at home, then worn all night at the party */
  ep1_sc2: partyDressFromChoice,
  ep1_sc3: partyDressFromChoice,
  ep1_sc4: partyDressFromChoice,
  ep1_sc5: partyDressFromChoice,
  ep1_sc6: partyDressFromChoice,
  /* Episode 2: rooftop lounge in VI */
  ep2_sc5: () => code('Rooftop lounge, evening wear', 'party_dress', PARTY),
  /* Episode 3: first days as Zee’s assistant, including the beach campaign shoot */
  ep3_sc1: () => code('Zee’s assistant, work look', 'corporate', WORK),
  ep3_sc2: () => code('Campaign shoot, work look', 'corporate', WORK),
  /* Episode 4 */
  ep4_sc0: () => code('2 AM: pyjamas', 'silk_pajamas'),
  ep4_sc0b: () => code('2 AM: pyjamas', 'silk_pajamas'),
  ep4_sc1: () => code('6 AM stake-out, gym clothes', 'athleisure', ['athleisure', 'hoodie']),
  ep4_sc1_chase: () => code('6 AM stake-out, gym clothes', 'athleisure', ['athleisure', 'hoodie']),
  ep4_sc6: () => code('Midnight on the rooftop: pyjamas', 'silk_pajamas'),
  ep4_sc7: () => code('Late night in Tamara’s room: pyjamas', 'silk_pajamas'),
  ep4_sc8: () => code('3 AM: pyjamas', 'silk_pajamas'),
  ep4_sc10: () => code('Trying on the aso-ebi', 'aso_ebi'),
  /* Episode 5: Mama Bello's 60th, from the hall to the rides home */
  ep5_sc1: owambeLook,
  ep5_sc2: owambeLook,
  ep5_sc2b: owambeLook,
  ep5_sc3: owambeLook,
  ep5_sc4: owambeLook,
  ep5_sc4b: owambeLook,
  ep5_sc5: owambeLook,
  ep5_sc6: owambeLook,
  ep5_sc7: owambeLook,
  ep5_sc8_dayo: owambeLook,
  ep5_sc8_kelvin: owambeLook,
  ep5_sc8_chidi: owambeLook,
  ep5_sc8_tamara: owambeLook,
  ep5_sc9: () => code('2 AM: pyjamas', 'silk_pajamas'),
  ep5_sc10: () => code('3 AM: pyjamas', 'silk_pajamas'),
  /* Episode 6 */
  ep6_sc0: () => code('Monday, 7 AM: pyjamas', 'silk_pajamas'),
  ep6_sc5: () => code('Scholarship hearing, formal', 'corporate', WORK),
  ep6_sc5b: () => code('Scholarship hearing, formal', 'corporate', WORK),
  /* Episode 7 */
  ep7_sc1: (f) => (f.partner_kelvin ? code('Something boring, for the bankers', 'corporate', WORK) : undefined),
  ep7_sc1b: (f) => (f.partner_kelvin ? code('Something boring, for the bankers', 'corporate', WORK) : undefined),
  ep7_sc3b: () => code('Night stake-out', 'hoodie', NIGHT_OUT),
  ep7_sc4: () => code('Night stake-out', 'hoodie', NIGHT_OUT),
  ep7_sc7: () => code('Dark clothes for the third floor', 'hoodie', NIGHT_OUT),
  ep7_sc8: () => code('Dark clothes for the third floor', 'hoodie', NIGHT_OUT),
  ep7_sc9: () => code('Dark clothes for the third floor', 'hoodie', NIGHT_OUT),
  ep7_sc10: () => code('Dark clothes for the third floor', 'hoodie', NIGHT_OUT),
  /* Episode 8 */
  ep8_sc4: () => code('Late night at Tamara’s: pyjamas', 'silk_pajamas', ['silk_pajamas', 'hoodie', 'casual', 'athleisure']),
  ep8_sc9: () => code('11 PM: pyjamas', 'silk_pajamas'),
  /* Episode 9: the Guild Gala */
  ep9_sc2: () => code('Getting ready for the gala', 'party_dress', PARTY),
  ep9_sc2b: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc3: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc4: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc4_dayo: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc4_kelvin: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc4_chidi: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc5: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc6: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc7_proof: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc7_wrong: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc8_proof: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc8_fail: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc8_wrong: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc9_good: () => code('Gala night', 'party_dress', PARTY),
  ep9_sc9_bad: () => code('Gala night', 'party_dress', PARTY),
};

/** The dress code for a scene (choice follow-ups share their scene's code) */
export function getDressCode(scene: SceneData, flags: Record<string, boolean>): DressCode | undefined {
  const id = scene.afterChoice?.sceneId ?? scene.id;
  return SCENE_CODES[id]?.(flags);
}

/** What Ada is actually wearing in this scene */
export function sceneOutfit(chosen: OutfitId, dress: DressCode | undefined): OutfitId {
  if (!dress) return chosen;
  return dress.allowed.includes(chosen) ? chosen : dress.wear;
}
