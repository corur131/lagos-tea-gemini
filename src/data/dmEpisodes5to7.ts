import { DmBeat } from '../types/socialFeed';

/* =========================================================================
   EPISODES 5–7 MESSAGES
   New beats added to existing chats (thread id -> beats).
   ========================================================================= */
export const EP5_7_DM_BEATS: Record<string, DmBeat[]> = {
  dm_mum: [
    {
      id: 'mum_ep5_owambe',
      unlockEpisode: 5,
      unlockSceneIndex: 1,
      messages: [
        { from: 'mum', text: '{name}, Blessing showed me a video. Is that you in gold with Mama Bello’s money on your forehead?? 😂' },
        { from: 'mum', text: 'Dance well. But come home early. Lagos at night is not your friend.' },
      ],
      replies: [
        { id: 'm5_dance', text: 'She said her mother sold akara in Ajegunle, Mummy! 😂', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'mum', text: 'Ehen! Ajegunle is everywhere. Greet her for me 🙏🏾' }] },
        { id: 'm5_early', text: 'I’ll be careful. I promise.', effect: { meterChanges: { reputation: 1 } }, responses: [{ from: 'mum', text: 'Promise God, not me 😌' }] },
      ],
    },
    {
      id: 'mum_ep6_leak',
      unlockEpisode: 6,
      unlockSceneIndex: 0,
      messages: [
        { from: 'mum', text: 'I saw it. Everybody on the street saw it.' },
        { from: 'mum', text: 'Listen to me. I told you to write None. If anybody must carry shame for that box, it is me. Not you.' },
        { from: 'mum', text: 'Hold your head up, {name}. Your father is watching.' },
      ],
      replies: [
        { id: 'm6_cry', text: 'I’m sorry, Mummy. I’m so sorry they brought you into this.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'mum', text: 'Sorry for what? You did not borrow the money. Go and wash your face.' }] },
        { id: 'm6_fight', text: 'I’m going to find who did this. I swear it.', effect: { meterChanges: { suspicion: 3, reputation: 2 } }, responses: [{ from: 'mum', text: 'Find them. But don’t become them on the way.' }] },
      ],
    },
    {
      id: 'mum_ep7_kiosk',
      unlockEpisode: 7,
      unlockSceneIndex: 0,
      hiddenIfFlag: 'said_yes_to_tea',
      messages: [
        { from: 'mum', text: 'The two men came back. They stood in front of the kiosk for one hour and said nothing.' },
        { from: 'mum', text: 'I sold bread to them. They paid. Lagos is a funny place.' },
      ],
      replies: [
        { id: 'm7_close', text: 'Close early tonight, Mummy. Please.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'mum', text: 'I will close at 7. Not because of them. Because my back is paining me 😤' }] },
        { id: 'm7_plate', text: 'Did you see their car? The plate number?', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'mum', text: 'Grey car. Dent at the back. My eyes are not what they used to be.' }] },
      ],
    },
  ],
  dm_tamara: [
    {
      id: 'tam_ep5_after',
      unlockEpisode: 5,
      unlockSceneIndex: 9,
      hiddenIfFlag: 'rode_home_tamara',
      messages: [
        { from: 'tamara', text: 'Are you home?? Text me the SECOND you’re home' },
        { from: 'tamara', text: 'I looked for you everywhere. I nearly died, Ada. Don’t ever do that again.' },
      ],
      replies: [
        { id: 't5_home', text: 'Home. Safe. Sorry I scared you 💚', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'tamara', text: 'Breathing again. Love you, stupid girl 💚' }] },
        { id: 't5_where', text: 'Where were you when the screen changed? I looked for you too.', effect: { meterChanges: { suspicion: 3, loyalty: -1 } }, responses: [{ from: 'tamara', text: 'Toilet!! My gele was falling. Why does everyone keep asking me that 😭' }] },
      ],
    },
    {
      id: 'tam_ep6_room',
      unlockEpisode: 6,
      unlockSceneIndex: 1,
      hiddenIfFlag: 'stay_tamara',
      requiredAnyFlags: ['stay_dayo', 'stay_mama'],
      messages: [
        { from: 'tamara', text: 'The Ikoyi room is still there if you change your mind. Chef makes moi moi on Fridays.' },
        { from: 'tamara', text: 'I just want you safe. That’s all I’ve ever wanted.' },
      ],
      replies: [
        { id: 't6_thanks', text: 'I know. Thank you, T. I just need to be somewhere quiet.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'tamara', text: 'Okay. Quiet. I can do quiet 💚' }] },
        { id: 't6_seen', label: 'Leave on Seen', effect: { meterChanges: { loyalty: -2 } }, responses: [] },
      ],
    },
    {
      id: 'tam_ep7_scared',
      unlockEpisode: 7,
      unlockSceneIndex: 10,
      unlockedByFlag: 'tea_office_post',
      messages: [
        { from: 'tamara', text: 'Ada where are you?? Are you okay??' },
        { from: 'tamara', text: 'Hauwa?? A JOURNALIST?? Living in our house?? I’m scared. Come home please.' },
      ],
      replies: [
        { id: 't7_fine', text: 'I’m fine. I’ll explain tomorrow.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'tamara', text: 'Tomorrow. Promise me 💚' }] },
        { id: 't7_test', text: 'Who else knew I was going to Surulere tonight?', effect: { meterChanges: { suspicion: 4 } }, responses: [{ from: 'tamara', text: 'Surulere?? I didn’t even know you WERE in Surulere. Ada what is going on' }] },
      ],
    },
  ],
  dm_chidi: [
    {
      id: 'chidi_ep5_photos',
      unlockEpisode: 5,
      unlockSceneIndex: 9,
      requiredFlag: 'rode_home_chidi',
      messages: [
        { from: 'chidi', text: 'I’m sorry about tonight. All of it.' },
        { from: 'chidi', text: 'There’s more I need to tell you. I just need a few days to find the words.' },
      ],
      replies: [
        { id: 'c5_wait', text: 'A few days. Not more.', effect: { meterChanges: { suspicion: 2 } }, responses: [{ from: 'chidi', text: 'Not more. I promise.' }] },
        { id: 'c5_now', text: 'Find them now, Chidi.', effect: { meterChanges: { suspicion: 3, romanceChidi: -2 } }, responses: [{ from: 'chidi', text: 'Wednesday. Darkroom. I’ll say everything.' }] },
      ],
    },
    {
      id: 'chidi_ep6_after',
      unlockEpisode: 6,
      unlockSceneIndex: 5,
      requiredFlag: 'left_chidi',
      messages: [
        { from: 'chidi', text: 'I won’t call. You said not to call.' },
        { from: 'chidi', text: 'I’ve put the ₦150,000 aside. Every naira. I’m going to give it to your mum’s loan, if you’ll let me.' },
      ],
      replies: [
        { id: 'c6_no', text: 'I don’t want your money, Chidi.', effect: { meterChanges: { reputation: 2 } }, responses: [{ from: 'chidi', text: 'Okay. I’ll keep it ready anyway.' }] },
        { id: 'c6_seen', label: 'Leave on Seen', effect: { meterChanges: { romanceChidi: -2 } }, responses: [] },
      ],
    },
  ],
  dm_kelvin: [
    {
      id: 'kelvin_ep5_drive',
      unlockEpisode: 5,
      unlockSceneIndex: 9,
      requiredFlag: 'rode_home_kelvin',
      messages: [
        { from: 'kelvin', text: 'Thank you for not saying anything stupid on that bridge. Everyone else would have.' },
      ],
      replies: [
        { id: 'k5_bridge', text: 'You did most of the talking. I just listened.', effect: { meterChanges: { romanceKelvin: 3 } }, responses: [{ from: 'kelvin', text: 'That’s rarer than you think.' }] },
        { id: 'k5_mum', text: 'How is your mum?', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'kelvin', text: 'Asleep. Blood pressure is down. She asked about “the Ajegunle girl”.' }] },
      ],
    },
    {
      id: 'kelvin_ep7_ilashe',
      unlockEpisode: 7,
      unlockSceneIndex: 6,
      messages: [
        { from: 'kelvin', text: 'The old fisherman invited me to his grandson’s naming ceremony. I don’t know what to wear.' },
        { from: 'kelvin', text: 'That’s a joke. Mostly.' },
      ],
      replies: [
        { id: 'k7_black', text: 'Not black. Anything but black 😂', effect: { meterChanges: { romanceKelvin: 3 } }, responses: [{ from: 'kelvin', text: 'You and Zee should start a fashion police.' }] },
        { id: 'k7_proud', text: 'Go. Just go. That’s all that matters.', effect: { meterChanges: { romanceKelvin: 2, reputation: 1 } }, responses: [{ from: 'kelvin', text: 'I’ll go. Will you come?' }] },
      ],
    },
  ],
  dm_dayo: [
    {
      id: 'dayo_ep5_after',
      unlockEpisode: 5,
      unlockSceneIndex: 9,
      hiddenIfFlag: 'rode_home_dayo',
      messages: [
        { from: 'dayo', text: 'Saw you leave. You okay?' },
        { from: 'dayo', text: 'The song’s still yours. Thirty seconds or the full thing, whenever you want it.' },
      ],
      replies: [
        { id: 'd5_full', text: 'The full thing. Soon.', effect: { meterChanges: { romanceDayo: 3 } }, responses: [{ from: 'dayo', text: 'I’ll fix the broken keys. Maybe.' }] },
        { id: 'd5_okay', text: 'I’m okay. Long night.', effect: { meterChanges: { loyalty: 1 } }, responses: [{ from: 'dayo', text: 'Long nights are when I write the good stuff. Sleep well, Ada.' }] },
      ],
    },
    {
      id: 'dayo_ep6_upstairs',
      unlockEpisode: 6,
      unlockSceneIndex: 3,
      requiredFlag: 'stay_dayo',
      messages: [
        { from: 'dayo', text: 'She came again last night. 1:52 AM. Same cap.' },
        { from: 'dayo', text: 'I didn’t wake you. You looked like you hadn’t slept in a week.' },
      ],
      replies: [
        { id: 'd6_wake', text: 'Next time, wake me.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'dayo', text: 'Deal. I’ll throw a pillow at you.' }] },
        { id: 'd6_thanks', text: 'Thank you for letting me sleep.', effect: { meterChanges: { romanceDayo: 3 } }, responses: [{ from: 'dayo', text: 'Anytime. The sofa bed likes you.' }] },
      ],
    },
  ],
  dm_zee: [
    {
      id: 'zee_ep5_hospital',
      unlockEpisode: 5,
      unlockSceneIndex: 10,
      requiredAnyFlags: ['shielded_zee', 'comforted_zee_2am'],
      messages: [
        { from: 'zee', text: 'Mummy is awake. She asked who held my arm. I told her.' },
        { from: 'zee', text: 'Don’t make it a thing.' },
      ],
      replies: [
        { id: 'z5_thing', text: 'It’s not a thing. Tell her I said get well 🤍', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'zee', text: '🤍' }] },
        { id: 'z5_tease', text: 'It’s a little bit of a thing 🙂', effect: { meterChanges: { loyalty: 2, popularity: 1 } }, responses: [{ from: 'zee', text: 'Go to sleep, Ada.' }] },
      ],
    },
    {
      id: 'zee_ep7_rejoin',
      unlockEpisode: 7,
      unlockSceneIndex: 6,
      requiredFlag: 'zee_rejoined',
      messages: [
        { from: 'zee', text: 'I’ve told my lawyers to stop answering the Guild about you. If they ask, you’re my partner. Full stop.' },
      ],
      replies: [
        { id: 'z7_partner', text: 'Partner. I like the sound of that.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'zee', text: 'Don’t get used to it. Actually, do.' }] },
      ],
    },
  ],
  dm_tea: [
    {
      id: 'tea_ep5_drive',
      unlockEpisode: 5,
      unlockSceneIndex: 5,
      messages: [
        { from: 'lagos_tea', text: 'Enjoying the party, Cinderella? 🫖' },
        { from: 'lagos_tea', text: 'Level B is very quiet this time of night.' },
      ],
      replies: [
        { id: 't5_coming', text: 'I’m coming.', effect: { meterChanges: { reputation: 2 } }, responses: [{ from: 'lagos_tea', text: 'I know 🫖' }] },
        { id: 't5_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
    {
      id: 'tea_ep6_welcome',
      unlockEpisode: 6,
      unlockSceneIndex: 10,
      requiredFlag: 'said_yes_to_tea',
      messages: [
        { from: 'lagos_tea', text: 'Welcome to the team 🫖 Bisola has your envelope.' },
        { from: 'lagos_tea', text: 'Don’t try anything clever. I always know.' },
      ],
      replies: [
        { id: 't6_ok', text: 'Understood.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'lagos_tea', text: 'Good girl 🫖' }] },
      ],
    },
    {
      id: 'tea_ep6_refused',
      unlockEpisode: 6,
      unlockSceneIndex: 10,
      requiredFlag: 'refused_tea_offer',
      messages: [
        { from: 'lagos_tea', text: 'Brave words from a girl with no house 🫖' },
        { from: 'lagos_tea', text: 'Monday. Ask your mother to empty the kiosk.' },
      ],
      replies: [
        { id: 't6_dare', text: 'See you Monday.', effect: { meterChanges: { reputation: 3 } }, responses: [] },
      ],
    },
    {
      id: 'tea_ep7_office',
      unlockEpisode: 7,
      unlockSceneIndex: 10,
      unlockedByFlag: 'tea_office_post',
      messages: [
        { from: 'lagos_tea', text: 'You looked tired on camera 🫖' },
        { from: 'lagos_tea', text: 'Next time, knock.' },
      ],
      replies: [
        { id: 't7_next', text: 'Next time, I’ll bring the police.', effect: { meterChanges: { reputation: 3, suspicion: 2 } }, responses: [{ from: 'lagos_tea', text: 'Bring them. Bring proof too 🫖' }] },
        { id: 't7_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 3 } }, responses: [] },
      ],
    },
  ],
  dm_chi: [
    {
      id: 'chi_ep6_hearing',
      unlockEpisode: 6,
      unlockSceneIndex: 5,
      messages: [
        { from: 'chi', text: 'For the record, you did well. Better than well.' },
        { from: 'chi', text: 'Also: do not post anything about the hearing. Not even a vague quote. Especially not a vague quote.' },
      ],
      replies: [
        { id: 'chi6_ok', text: 'Yes, Barrister ⚖️', effect: { meterChanges: { reputation: 2 } }, responses: [{ from: 'chi', text: 'Good. Now eat something.' }] },
        { id: 'chi6_thanks', text: 'Thank you. For all of it.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'chi', text: 'Thank me when we win.' }] },
      ],
    },
    {
      id: 'chi_ep7_cac',
      unlockEpisode: 7,
      unlockSceneIndex: 2,
      requiredFlag: 'went_yaba_without_chi',
      messages: [
        { from: 'chi', text: 'If Mama Ronke says my name, I want to hear it from you first. Not from the page.' },
      ],
      replies: [
        { id: 'chi7_promise', text: 'You’ll hear it from me. Whatever it is.', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'chi', text: 'That’s all I ask.' }] },
      ],
    },
  ],
  dm_bisola: [
    {
      id: 'bisola_ep6_agent',
      unlockEpisode: 6,
      unlockSceneIndex: 7,
      requiredFlag: 'bisola_double_agent',
      messages: [
        { from: 'bisola', text: 'AGENT JOLLOF REPORTING 🕵🏾‍♀️' },
        { from: 'bisola', text: 'they said the envelope will be at the gate by 4pm friday. a Gokada will bring it. I’ll try and get the plate number' },
      ],
      replies: [
        { id: 'b6_plate', text: 'Plate number, face, helmet colour. Everything.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'bisola', text: 'yes boss 🫡' }] },
        { id: 'b6_safe', text: 'Don’t take risks. If it feels wrong, walk away.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'bisola', text: 'you sound like my mum 😭 okay okay' }] },
      ],
    },
    {
      id: 'bisola_ep6_no',
      unlockEpisode: 6,
      unlockSceneIndex: 7,
      requiredFlag: 'bisola_said_no',
      messages: [
        { from: 'bisola', text: 'they haven’t posted the video yet' },
        { from: 'bisola', text: 'every time my phone buzzes I nearly throw it in the lagoon' },
      ],
      replies: [
        { id: 'b6_proud', text: 'Whatever happens, I’m proud of you.', effect: { meterChanges: { loyalty: 3 } }, responses: [{ from: 'bisola', text: '🥹🥹🥹' }] },
      ],
    },
  ],
  dm_hauwa: [
    {
      id: 'hauwa_ep5_key',
      unlockEpisode: 5,
      unlockSceneIndex: 9,
      requiredFlag: 'surrendered_key',
      messages: [
        { from: 'hauwa', text: 'You gave it away.' },
        { from: 'hauwa', text: 'It’s alright. A key only matters if you know which door. Now we know she wanted it badly.' },
      ],
      replies: [
        { id: 'h5_sorry', text: 'I’m sorry. My mother…', effect: { meterChanges: { loyalty: 2 } }, responses: [{ from: 'hauwa', text: 'I know. Mothers first. Always.' }] },
      ],
    },
    {
      id: 'hauwa_ep7_after',
      unlockEpisode: 7,
      unlockSceneIndex: 10,
      unlockedByFlag: 'tea_office_post',
      messages: [
        { from: 'hauwa', text: 'My editor called. The story is dead. They say I’m “compromised”.' },
        { from: 'hauwa', text: 'So now it’s not a story. Now it’s personal.' },
      ],
      replies: [
        { id: 'h7_together', text: 'Then we finish it together.', effect: { meterChanges: { loyalty: 3, suspicion: 2 } }, responses: [{ from: 'hauwa', text: 'Together. No riddles.' }] },
        { id: 'h7_why', text: 'Why didn’t you tell me from the start?', effect: { meterChanges: { suspicion: 2 } }, responses: [{ from: 'hauwa', text: 'Because the first person I told at UNILAG ended up on the page.' }] },
      ],
    },
  ],
  dm_group: [
    {
      id: 'group_ep5_ready',
      unlockEpisode: 5,
      unlockSceneIndex: 0,
      messages: [
        { from: 'zee', text: 'Driver leaves in TEN minutes. I will leave anyone not in the car.' },
        { from: 'bisola', text: 'my gele is not ready 😭😭' },
        { from: 'tamara', text: 'Coming to fix it. Don’t touch ANYTHING' },
        { from: 'chi', text: 'Reminder: no photos of the guest list. Mama Bello’s security asked.' },
        { from: 'hauwa', text: '🌿' },
      ],
      replies: [
        { id: 'g5_ready', text: 'Ready and gold 💛', effect: { meterChanges: { loyalty: 1 } }, responses: [{ from: 'zee', text: 'Finally, someone punctual.' }] },
      ],
    },
    {
      id: 'group_ep6_gone',
      unlockEpisode: 6,
      unlockSceneIndex: 1,
      messages: [
        { from: 'system', text: 'Zee changed the group name to “Content House 2.0”' },
        { from: 'bisola', text: 'Zee why did you change the name 😭' },
        { from: 'tamara', text: 'Because she’s a coward. Ada is still family.' },
        { from: 'chi', text: 'Everyone take a breath before typing.' },
      ],
      renameTo: 'Content House 2.0',
      replies: [
        { id: 'g6_fine', text: 'It’s okay. I’ll be fine. Don’t fight over me.', effect: { meterChanges: { reputation: 2, loyalty: 2 } }, responses: [{ from: 'hauwa', text: 'She will be fine. Watch.' }] },
        { id: 'g6_seen', label: 'Leave on Seen', effect: { meterChanges: { reputation: 1 } }, responses: [] },
      ],
    },
    {
      id: 'group_ep7_hauwa',
      unlockEpisode: 7,
      unlockSceneIndex: 10,
      unlockedByFlag: 'tea_office_post',
      messages: [
        { from: 'zee', text: 'HAUWA??' },
        { from: 'bisola', text: 'I KNEW she was a spy, I KNEW IT' },
        { from: 'chi', text: 'Nobody say anything else in writing.' },
        { from: 'tamara', text: 'Ada where are you?? Are you okay??' },
      ],
      replies: [
        { id: 'g7_meeting', text: 'I’m fine. House meeting tomorrow. Everyone.', effect: { meterChanges: { suspicion: 3 } }, responses: [{ from: 'zee', text: 'Name the time.' }] },
        { id: 'g7_seen', label: 'Leave on Seen', effect: { meterChanges: { suspicion: 2 } }, responses: [] },
      ],
    },
  ],
};
