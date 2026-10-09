import { DmBeat } from '../types/socialFeed';

/* =========================================================================
   EPISODE 4 MESSAGES
   New beats added to existing chats (thread id -> beats).
   ========================================================================= */
export const EP4_DM_BEATS: Record<string, DmBeat[]> = {
  dm_bisola: [
    {
      id: 'bisola_ep4_thanks',
      unlockEpisode: 4,
      unlockSceneIndex: 0,
      requiredAnyFlags: ['comforted_bisola', 'bisola_deal', 'returned_burner_after_copy'],
      messages: [
        { from: 'bisola', text: 'can’t sleep. thank you for not hating me 😭' },
        { from: 'bisola', text: 'the money came at 6:04. ₦300k. I feel sick looking at it' },
      ],
      replies: [
        {
          id: 'b4_keep',
          text: 'Don’t spend it. Screenshot the transfer. We might need it.',
          effect: { meterChanges: { suspicion: 3 } },
          addsClue: { name: 'Bisola’s ₦300k Transfer', description: 'Payment for the burner delivery arrived at 6:04 AM from a fintech wallet named “TL Ventures”.' },
          responses: [{ from: 'bisola', text: 'done. it says the sender is “TL Ventures”. never heard of them' }],
        },
        {
          id: 'b4_rest',
          text: 'Sleep, Bisola. We’ll figure it out tomorrow.',
          effect: { meterChanges: { loyalty: 3 } },
          responses: [{ from: 'bisola', text: 'okay 🥺 goodnight Ada' }],
        },
      ],
    },
    {
      id: 'bisola_ep4_angry',
      unlockEpisode: 4,
      unlockSceneIndex: 0,
      requiredAnyFlags: ['threatened_bisola', 'kept_burner'],
      messages: [
        { from: 'bisola', text: 'I thought you were different' },
        { from: 'bisola', text: 'if that video comes out, it’s on you' },
      ],
      replies: [
        {
          id: 'b4_sorry',
          text: 'I’m trying to stop them for good. Trust me a little longer.',
          effect: { meterChanges: { loyalty: 2 } },
          responses: [{ from: 'bisola', text: 'trust is expensive this week' }],
        },
        { id: 'b4_seen', label: 'Leave on Seen', effect: { meterChanges: { reputation: 1, loyalty: -2 } }, responses: [] },
      ],
    },
  ],
  dm_tea: [
    {
      id: 'tea_ep4_kept',
      unlockEpisode: 4,
      unlockSceneIndex: 2,
      requiredFlag: 'kept_burner',
      messages: [
        { from: 'lagos_tea', text: 'You have something of mine, Cinderella 🫖' },
        { from: 'lagos_tea', text: 'Phones can be replaced. Mothers can’t.' },
      ],
      replies: [
        { id: 't4_dare', text: 'Come and take it.', effect: { meterChanges: { reputation: 3, suspicion: 3 } }, responses: [{ from: 'lagos_tea', text: 'Saturday 🫖' }] },
        { id: 't4_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
    {
      id: 'tea_ep4_nice_try',
      unlockEpisode: 4,
      unlockSceneIndex: 2,
      hiddenIfFlag: 'kept_burner',
      messages: [{ from: 'lagos_tea', text: 'Nice try in my archive, Cinderella. Curiosity looks good on you. So did that borrowed dress 🫖' }],
      replies: [
        { id: 't4_who', text: 'Whose archive is it really?', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'lagos_tea', text: 'Everything in that house belongs to someone else, babe.' }] },
        { id: 't4_seen2', label: 'Leave on Seen', effect: { meterChanges: { reputation: 1 } }, responses: [] },
      ],
    },
  ],
  dm_chidi: [
    {
      id: 'chidi_ep4_print',
      unlockEpisode: 4,
      unlockSceneIndex: 3,
      messages: [
        { from: 'chidi', text: 'Developed one more print after you left.' },
        { from: 'chidi', text: 'You, on the paint bucket, doing the detective face. Keeping this one too 🎞️' },
      ],
      replies: [
        { id: 'c4_soft', text: 'Then I want a copy. For my detective portfolio 😊', effect: { meterChanges: { romanceChidi: 4 } }, responses: [{ from: 'chidi', text: 'Signed and framed. Saturday?' }] },
        { id: 'c4_entrance', text: 'Do you keep a copy of everything you shoot? Even at entrances?', effect: { meterChanges: { suspicion: 4, romanceChidi: -2 } }, responses: [{ from: 'chidi', text: 'Only the ones that matter, Ada. Goodnight.' }] },
      ],
    },
  ],
  dm_kelvin: [
    {
      id: 'kelvin_ep4_logs',
      unlockEpisode: 4,
      unlockSceneIndex: 4,
      requiredFlag: 'asked_kelvin_logs',
      messages: [
        { from: 'kelvin', text: 'Checked the MASTER-2 history.' },
        { from: 'kelvin', text: 'Three weeks of logs are gone. Wiped from inside the admin panel. Not a glitch.' },
        { from: 'kelvin', text: 'Only a handful of people have admin access. Some of them share my surname.' },
      ],
      replies: [
        {
          id: 'k4_who',
          text: 'Send me the list. All of it.',
          effect: { meterChanges: { suspicion: 4, romanceKelvin: 2 } },
          addsClue: { name: 'Wiped Lock Logs', description: 'Kelvin says three weeks of MASTER-2 history were wiped from inside the Wright Estates admin panel. Only a few people have admin access, including members of his family.' },
          responses: [{ from: 'kelvin', text: 'Not over text. Saturday. Wear red.' }],
        },
        { id: 'k4_thanks', text: 'Thank you for checking. That means a lot.', effect: { meterChanges: { romanceKelvin: 4 } }, responses: [{ from: 'kelvin', text: 'Don’t thank me yet.' }] },
      ],
    },
  ],
  dm_group: [
    {
      id: 'group_ep4_meeting',
      unlockEpisode: 4,
      unlockSceneIndex: 5,
      renameTo: 'House Arrest 🔒',
      newAvatarEmoji: '🔒',
      messages: [
        { from: 'system', text: 'Zee renamed the group to “House Arrest 🔒”' },
        { from: 'zee', text: 'Until Saturday is over, nobody leaves this house after 10 PM.' },
        { from: 'chi', text: 'That is unlawful confinement.' },
        { from: 'tamara', text: 'I’ll bring snacks to the confinement 💚' },
        { from: 'bisola', text: 'whose hand was that in the dark 😭😭' },
        { from: 'hauwa', text: 'Someone who didn’t want a phone found 🌿' },
      ],
      replies: [
        { id: 'g4_unite', text: 'Whoever it is, we’ll know by Saturday. Sleep well, ladies 🙂', effect: { meterChanges: { suspicion: 3, popularity: 2 } }, responses: [{ from: 'zee', text: 'Finally, someone on my side.' }] },
        { id: 'g4_joke', text: 'House arrest but make it skincare night? 🧖🏾‍♀️', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'tamara', text: 'YES 💚 my room, 9PM' }, { from: 'chi', text: 'Fine. Only if there’s no garri on my sheets.' }] },
      ],
    },
  ],
  dm_dayo: [
    {
      id: 'dayo_ep4_after_call',
      unlockEpisode: 4,
      unlockSceneIndex: 6,
      messages: [
        { from: 'dayo', text: '🎧 Voice note (0:42)' },
        { from: 'dayo', text: 'That’s the first 40 seconds of the new song. Nobody else has heard it. Don’t screenshot it, Cinderella 😏' },
      ],
      replies: [
        { id: 'd4_love', text: 'I’ve played it 6 times. Is that normal?', effect: { meterChanges: { romanceDayo: 5 } }, responses: [{ from: 'dayo', text: 'Six is a good number. Saturday, you hear the rest.' }] },
        { id: 'd4_name', text: 'Don’t call me Cinderella. Call me Ada.', effect: { meterChanges: { romanceDayo: 3, reputation: 2 } }, responses: [{ from: 'dayo', text: 'Ada. Even better on a hook.' }] },
      ],
    },
  ],
  dm_mum: [
    {
      id: 'mum_ep4_photo',
      unlockEpisode: 4,
      unlockSceneIndex: 10,
      messages: [
        { from: 'mum', text: 'Ada, a man in a car was taking pictures of my shop today. Is it your Lagos people?' },
        { from: 'mum', text: 'I gave him bread. He didn’t pay. Tell your friends I still need my ₦500 😂' },
      ],
      replies: [
        { id: 'm4_safe', text: 'Mama, close early tomorrow and go to Aunty Ngozi’s. Please. I’ll explain.', effect: { meterChanges: { loyalty: 4 } }, responses: [{ from: 'mum', text: 'Ehn? Okay o. I will go. You are scaring me small.' }] },
        { id: 'm4_laugh', text: 'I’ll pay the ₦500 myself, Mama 😂 Love you.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'mum', text: 'Love you more. Eat something!' }] },
      ],
    },
  ],
};
