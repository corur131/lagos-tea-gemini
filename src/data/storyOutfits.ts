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

const code = (label: string, wear: OutfitId, allowed: OutfitId[] = [wear]): DressCode => ({ label, wear, allowed });

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
