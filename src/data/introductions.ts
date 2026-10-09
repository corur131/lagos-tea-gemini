import { CharacterId, SceneData } from '../types/vn';
import { DmThread } from '../types/socialFeed';

const CAST: CharacterId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin', 'dayo'];

export interface IntroductionInput {
  story: SceneData[];
  episode: number;
  sceneIndex: number;
  /** The scene on screen right now (after callbacks/follow-ups are applied) */
  currentScene: SceneData;
  lineIndex: number;
  /** DM threads that already have at least one visible message */
  threadsWithMessages: DmThread[];
}

/**
 * Who Ada has actually met so far: anyone who has spoken in a scene she has reached
 * (in the current scene, only up to the current line), plus anyone whose first DM has arrived.
 */
export function getIntroducedCharacters(input: IntroductionInput): Set<CharacterId> {
  const met = new Set<CharacterId>();
  const add = (id: unknown) => {
    if (typeof id === 'string' && CAST.includes(id as CharacterId)) met.add(id as CharacterId);
  };
  const parentId = input.currentScene.afterChoice?.sceneId;

  for (const scene of input.story) {
    const before =
      scene.episode < input.episode || (scene.episode === input.episode && scene.sceneIndex < input.sceneIndex);
    // While a choice's follow-up plays, its parent scene has been fully seen
    if (before || scene.id === parentId) scene.lines.forEach((l) => add(l.speaker));
  }

  input.currentScene.lines.slice(0, input.lineIndex + 1).forEach((l) => add(l.speaker));
  input.threadsWithMessages.forEach((t) => add(t.profileId));
  return met;
}
