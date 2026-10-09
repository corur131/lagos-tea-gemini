import { CulpritId, CulpritMotive, MysterySecret } from '../types/vn';
import { PostClue } from '../types/socialFeed';

export const CULPRIT_CANDIDATES: CulpritId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];
export const MOTIVE_CANDIDATES: CulpritMotive[] = [
  'blackmail_debt',
  'stolen_credit_revenge',
  'algorithm_obsession',
  'romantic_jealousy',
  'undercover_expose',
];

/*
 * Season 1 tells one fixed story: the same person is behind @TheLagosTea in
 * every playthrough, so Episodes 4–9 can plant real clues and a real twist.
 * Stored as positions in the lists above so a glance at this file doesn't
 * spoil it for the player.
 */
const SEASON_KEY: [number, number] = [6, 5];

export function generateNewSecret(): MysterySecret {
  return {
    culprit: CULPRIT_CANDIDATES[SEASON_KEY[0] % CULPRIT_CANDIDATES.length],
    motive: MOTIVE_CANDIDATES[SEASON_KEY[1] % MOTIVE_CANDIDATES.length],
  };
}

// Each friend has a personal item the story has already tied to her. Clues show one of these.
const SUSPECT_TELLS: Record<CulpritId, string> = {
  zee: 'a gold phone case with a tiny crown charm dangling from it',
  tamara: 'an emerald-green phone case on a thin gold chain strap',
  chi: 'the brass corner of a leather document folder, embossed with initials too blurred to read',
  bisola: 'a pink rhinestone phone grip catching the light',
  hauwa: 'a jade bead bracelet resting beside a half-finished cup of matcha',
};

// The red herring is a different friend from the culprit, fixed for the whole playthrough
function pickRedHerring(secret: MysterySecret): CulpritId {
  const others = CULPRIT_CANDIDATES.filter((c) => c !== secret.culprit);
  const idx = Math.max(0, MOTIVE_CANDIDATES.indexOf(secret.motive));
  return others[idx % others.length];
}

export function describeClue(clue: PostClue, secret: MysterySecret): string {
  if (clue.kind === 'plain') return clue.text;
  const suspect = clue.kind === 'culprit_tell' ? secret.culprit : pickRedHerring(secret);
  return `${clue.text} ${SUSPECT_TELLS[suspect]}.`;
}
