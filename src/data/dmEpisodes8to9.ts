import { DmBeat } from '../types/socialFeed';

/* =========================================================================
   EPISODES 8–9 MESSAGES
   New beats added to existing chats (thread id -> beats).
   ========================================================================= */
export const EP8_9_DM_BEATS: Record<string, DmBeat[]> = {
  dm_tamara: [
    {
      id: 'tam_ep8_sunday',
      unlockEpisode: 8,
      unlockSceneIndex: 4,
      messages: [
        { from: 'tamara', text: 'I can’t sleep. I keep thinking about Sunday.' },
        { from: 'tamara', text: 'Don’t go back. Stay with me. I’ll sort everything, I swear on the mango tree 💚' },
      ],
      replies: [
        { id: 't8_stay', text: 'I’ll think about it, T. Sleep.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'tamara', text: 'Okay. Goodnight, my sister 💚' }] },
        { id: 't8_who', text: 'You didn’t tell anyone, right?', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'tamara', text: 'Babe. Who would I tell?? 😭 Not a soul.' }] },
      ],
    },
    {
      id: 'tam_ep9_ready',
      unlockEpisode: 9,
      unlockSceneIndex: 1,
      messages: [{ from: 'tamara', text: 'Hair at 6. Don’t be late, goat head 😘' }],
      replies: [
        { id: 't9_ok', text: 'Coming 💚', effect: { meterChanges: { loyalty: 1 } }, responses: [{ from: 'tamara', text: '💚💚' }] },
        { id: 't9_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
  ],
  dm_chi: [
    {
      id: 'chi_ep8_file',
      unlockEpisode: 8,
      unlockSceneIndex: 5,
      messages: [
        { from: 'chi', text: 'I wrote the recording details down for the petition. Nobody else will see them.' },
        { from: 'chi', text: 'Lock your door. I mean it.' },
      ],
      replies: [
        { id: 'chi8_ok', text: 'Locked. Goodnight, Barrister.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'chi', text: 'Goodnight.' }] },
        { id: 'chi8_where', text: 'Where did you write them?', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'chi', text: 'My notes app. Why?' }] },
      ],
    },
    {
      id: 'chi_ep9_list',
      unlockEpisode: 9,
      unlockSceneIndex: 3,
      hiddenIfFlag: 'doubted_chi_ep8',
      messages: [{ from: 'chi', text: 'Whatever name you say, say it slowly. Juries trust slow.' }],
      replies: [{ id: 'chi9_ok', text: 'Slowly. Got it.', effect: { meterChanges: { reputation: 2 } }, responses: [{ from: 'chi', text: 'And Ada. I’m proud of you. Still don’t tell anyone.' }] }],
    },
  ],
  dm_hauwa: [
    {
      id: 'hauwa_ep8_canary',
      unlockEpisode: 8,
      unlockSceneIndex: 2,
      messages: [
        { from: 'hauwa', text: 'Remember: watch hands. And watch who asks “who else knows”.' },
        { from: 'hauwa', text: 'Also, I know my secret is the folded one. Good. Keep it folded.' },
      ],
      replies: [{ id: 'h8_ok', text: 'Folded. Promise.', effect: { meterChanges: { suspicion: 2 } }, responses: [{ from: 'hauwa', text: 'Good girl. Not the page’s kind of good girl. Mine.' }] }],
    },
    {
      id: 'hauwa_ep9_proof',
      unlockEpisode: 9,
      unlockSceneIndex: 4,
      messages: [{ from: 'hauwa', text: 'Twenty minutes. One more time: a feeling is not proof. Show them a thing.' }],
      replies: [{ id: 'h9_thing', text: 'A thing. Not a feeling.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'hauwa', text: '🌿' }] }],
    },
  ],
  dm_bisola: [
    {
      id: 'bisola_ep8_ring',
      unlockEpisode: 8,
      unlockSceneIndex: 3,
      messages: [
        { from: 'bisola', text: 'I MAY HAVE TOLD SOME PEOPLE ABOUT THE RING' },
        { from: 'bisola', text: 'like 4 people. maybe 40. I’m so sorry 😭😭' },
      ],
      replies: [
        { id: 'b8_fine', text: 'It’s okay. Honestly. It’s more than okay.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'bisola', text: 'why do you sound HAPPY about that??' }] },
        { id: 'b8_bisola', text: 'BISOLA.', effect: { meterChanges: { popularity: 1 } }, responses: [{ from: 'bisola', text: 'I KNOW 😭' }] },
      ],
    },
  ],
  dm_dayo: [
    {
      id: 'dayo_ep9_switch',
      unlockEpisode: 9,
      unlockSceneIndex: 3,
      messages: [{ from: 'dayo', text: 'Found the main power switch for the sound. Just saying. 🎛️' }],
      replies: [{ id: 'd9_lol', text: 'Don’t you dare. Unless I nod.', effect: { meterChanges: { romanceDayo: 2 } }, responses: [{ from: 'dayo', text: 'Watching for the nod.' }] }],
    },
  ],
  dm_kelvin: [
    {
      id: 'kelvin_ep9_lawyers',
      unlockEpisode: 9,
      unlockSceneIndex: 3,
      messages: [{ from: 'kelvin', text: 'Two lawyers, second row. One of them used to be a police inspector. Just in case.' }],
      replies: [{ id: 'k9_ok', text: 'Thank you. Really.', effect: { meterChanges: { romanceKelvin: 2 } }, responses: [{ from: 'kelvin', text: 'Go and be brilliant.' }] }],
    },
  ],
  dm_chidi: [
    {
      id: 'chidi_ep8_print',
      unlockEpisode: 8,
      unlockSceneIndex: 8,
      requiredFlag: 'night8_chidi',
      messages: [{ from: 'chidi', text: 'The print dried. You look like you’re about to say something important.' }],
      replies: [{ id: 'c8_keep', text: 'Keep it for me.', effect: { meterChanges: { romanceChidi: 2 } }, responses: [{ from: 'chidi', text: 'It’s yours. All of them are.' }] }],
    },
  ],
  dm_mum: [
    {
      id: 'mum_ep8_women',
      unlockEpisode: 8,
      unlockSceneIndex: 8,
      messages: [{ from: 'mum', text: 'Iya Basira says if those men come back, she will pour pepper in their eyes. I told her to be a Christian. She said after.' }],
      replies: [{ id: 'm8_lol', text: '😂 Greet her for me, Mummy.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'mum', text: 'She says you should marry the one with lawyers.' }] }],
    },
    {
      id: 'mum_ep9_watching',
      unlockEpisode: 9,
      unlockSceneIndex: 3,
      messages: [
        { from: 'mum', text: 'The whole street is outside the kiosk watching on Blessing’s phone.' },
        { from: 'mum', text: 'Speak slowly. Stand straight. Your father is proud.' },
      ],
      replies: [{ id: 'm9_love', text: 'I love you, Mummy.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'mum', text: 'I know. Now go.' }] }],
    },
  ],
  dm_tea: [
    {
      id: 'tea_ep8_dare',
      unlockEpisode: 8,
      unlockSceneIndex: 10,
      messages: [
        { from: 'lagos_tea', text: 'Cute trap, Cinderella 🫖' },
        { from: 'lagos_tea', text: 'Saturday. 9 PM. Bring your best guess.' },
      ],
      replies: [
        { id: 't8_proof', text: 'I don’t guess. I prove.', effect: { meterChanges: { reputation: 3 } }, responses: [{ from: 'lagos_tea', text: 'We’ll see 🫖' }] },
        { id: 't8_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
  ],
  dm_group: [
    {
      id: 'group_ep8_bait',
      unlockEpisode: 8,
      unlockSceneIndex: 9,
      unlockedByFlag: 'tea_bait_post',
      messages: [
        { from: 'zee', text: 'Who leaked what now??' },
        { from: 'bisola', text: 'Ada is the page a MAN??' },
        { from: 'tamara', text: 'Babe are you okay?? Call me 💚' },
      ],
      replies: [
        { id: 'g8_fine', text: 'I’m fine. Ignore it.', effect: { meterChanges: { reputation: 2 } }, responses: [{ from: 'zee', text: 'Nobody in this house is fine.' }] },
        { id: 'g8_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
  ],
};
