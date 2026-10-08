import { DmThread } from '../types/socialFeed';

/*
  DM conversations. Each beat unlocks at a point in the story (and optionally only after certain
  choices). When a beat has replies, the player picks one; later beats in that thread wait until
  they answer. "{name}" is replaced with the heroine's name.

  Messages from @TheLagosTea must stay culprit-neutral: the culprit is picked at random per playthrough.
*/
export const DM_THREADS: DmThread[] = [
  /* ------------------------------------------------------------------ MUMMY */
  {
    id: 'dm_mum',
    title: 'Mummy 💛',
    handle: 'Mobile',
    avatarEmoji: '👩🏾',
    beats: [
      {
        id: 'mum_1',
        unlockEpisode: 1,
        unlockSceneIndex: 0,
        messages: [
          { from: 'mum', text: '{name}, did you eat this morning? I kept rice for you inside the cooler 🍚' },
          { from: 'mum', text: 'And don’t forget to pray over that school fees matter.' },
        ],
        replies: [
          {
            id: 'fine',
            text: 'I ate, Mummy. Don’t worry 🙏',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'mum', text: 'Hmm. You and this your “don’t worry”. I will still worry.' }],
          },
          {
            id: 'truth',
            text: 'Mummy, the school says I have 48 hours to pay 😔',
            effect: { meterChanges: { loyalty: 3, reputation: -1 }, flagToSet: 'told_mum_fees' },
            responses: [
              { from: 'mum', text: 'Ehen? 48 hours??' },
              { from: 'mum', text: 'Ok. I will talk to Mama Chinedu about the ajo money. Don’t cry, you hear? God is not asleep.' },
            ],
          },
        ],
      },
      {
        id: 'mum_2',
        unlockEpisode: 1,
        unlockSceneIndex: 3,
        messages: [{ from: 'mum', text: 'Tamara’s driver came to carry you?? Where are you going this night?' }],
        replies: [
          {
            id: 'party',
            text: 'Just a birthday party on the Island, Mummy 🎉',
            effect: { meterChanges: { loyalty: 1 } },
            responses: [
              { from: 'mum', text: 'Island party. Hmm.' },
              { from: 'mum', text: 'Don’t drink anything you didn’t see them open. And come back before 12.' },
            ],
          },
          {
            id: 'later',
            text: 'I’ll explain tomorrow 😅',
            effect: { meterChanges: { popularity: 1 } },
            responses: [{ from: 'mum', text: 'Explain tomorrow abi? Ok o. I am waiting with my slipper 😒' }],
          },
        ],
      },
      {
        id: 'mum_3',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'mum', text: '{name}!!! What is this thing Mama Chinedu is showing me on her phone??' },
          { from: 'mum', text: 'They put our ADDRESS?? People are standing outside the gate taking pictures 😭' },
        ],
        replies: [
          {
            id: 'sorry',
            text: 'Mummy I’m so sorry. I’m coming home now.',
            effect: { meterChanges: { loyalty: 4 }, flagToSet: 'comforted_mum' },
            responses: [
              { from: 'mum', text: 'Don’t apologise for what wicked people did.' },
              { from: 'mum', text: 'I have locked the gate. Come home safe.' },
            ],
          },
          {
            id: 'handle',
            text: 'Don’t open the gate for anybody. I’ll handle it.',
            effect: { meterChanges: { reputation: 3 }, flagToSet: 'protective_ada' },
            responses: [
              { from: 'mum', text: 'Handle it how? You are 19!' },
              { from: 'mum', text: '…Ok. I trust you. But call me before you sleep.' },
            ],
          },
        ],
      },
      {
        id: 'mum_4',
        unlockEpisode: 3,
        unlockSceneIndex: 0,
        messages: [
          { from: 'mum', text: 'The bursar office called me. They said your fees have been PAID IN FULL??' },
          { from: 'mum', text: 'Who paid it, {name}?' },
        ],
        replies: [
          {
            id: 'job',
            text: 'I got a job as a personal assistant 💼',
            effect: { meterChanges: { popularity: 1 } },
            responses: [
              { from: 'mum', text: 'PA? To who?' },
              { from: 'mum', text: 'Zainab Bello?? The senator’s daughter?? Chai. Please keep your eyes open.' },
            ],
          },
          {
            id: 'friend',
            text: 'A friend’s family helped. I’ll pay it back, Mummy.',
            effect: { meterChanges: { loyalty: 2, reputation: 1 } },
            responses: [
              { from: 'mum', text: 'Nothing is free in Lagos, my daughter.' },
              { from: 'mum', text: 'Be careful with these Island people.' },
            ],
          },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- TAMARA */
  {
    id: 'dm_tamara',
    title: 'Tamara 💚',
    handle: '@tamara_reid',
    avatarType: 'tamara',
    profileId: 'tamara',
    beats: [
      {
        id: 'tam_1',
        unlockEpisode: 1,
        unlockSceneIndex: 1,
        messages: [
          { from: 'tamara', text: 'OMW TO YOUR STREET 🚗💨 tell the area boys not to touch my tyres 😂' },
          { from: 'tamara', text: 'And before you say no to tonight: NO is not an option 💚' },
        ],
        replies: [
          {
            id: 'nothing_to_wear',
            text: 'Tamara I don’t have anything to wear 😩',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'tamara', text: 'Leave that one for me. I have a SURPRISE 👗✨' }],
          },
          {
            id: 'leaving_early',
            text: 'Fine. But I’m leaving by 11.',
            effect: { meterChanges: { popularity: 1 } },
            responses: [{ from: 'tamara', text: '11?? Cinderella leaves at MIDNIGHT babe, it’s literally the rules 😂' }],
          },
        ],
      },
      {
        id: 'tam_2_emerald',
        unlockEpisode: 1,
        unlockSceneIndex: 3,
        requiredAnyFlags: ['borrowed_emerald_dress', 'dragged_dress'],
        messages: [{ from: 'tamara', text: 'Ok but YOU in that emerald?? I’m actually going to cry 😭💚 Zee is SHOOK' }],
        replies: [
          {
            id: 'thanks',
            text: 'Thank you for this, Tam. Really.',
            effect: { meterChanges: { loyalty: 3 } },
            responses: [{ from: 'tamara', text: 'Stop it before my lashes fall off 🥹 Sisters for life.' }],
          },
          {
            id: 'fraud',
            text: 'Everyone’s staring. I feel like a fraud.',
            effect: { meterChanges: { loyalty: 1, reputation: -1 } },
            responses: [{ from: 'tamara', text: 'Fraud ke? You’re the realest person in that house. Head up, chin up, Ajegunle up 💅' }],
          },
        ],
      },
      {
        id: 'tam_2_thrift',
        unlockEpisode: 1,
        unlockSceneIndex: 3,
        requiredFlag: 'vintage_style_dress',
        messages: [{ from: 'tamara', text: 'The thrift fit??? BOLD. ICONIC. Chi is literally choking on her champagne 😂' }],
        replies: [
          {
            id: 'plan',
            text: 'That was the plan 😌',
            effect: { meterChanges: { popularity: 2 } },
            responses: [{ from: 'tamara', text: 'Minimalism queen. I stan.' }],
          },
          {
            id: 'broke',
            text: 'Be honest, do I look broke?',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [
              { from: 'tamara', text: 'You look like someone who doesn’t need anyone’s approval.' },
              { from: 'tamara', text: 'Which is the most expensive look in that room 💚' },
            ],
          },
        ],
      },
      {
        id: 'tam_3',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'tamara', text: 'babe I’m SO sorry' },
          { from: 'tamara', text: 'I swear I didn’t know anyone was taking pictures upstairs' },
          { from: 'tamara', text: 'where are you?? let me come and get you' },
        ],
        replies: [
          {
            id: 'air',
            text: 'I’m fine. I need air. Don’t follow me.',
            effect: { meterChanges: { reputation: 2 } },
            responses: [{ from: 'tamara', text: 'Ok. Text me when you get home. Please.' }],
          },
          {
            id: 'accuse',
            text: 'Did YOU tell anyone about my fees, Tamara?',
            effect: { meterChanges: { suspicion: 3, loyalty: -3 }, flagToSet: 'questioned_tamara_dm' },
            responses: [
              { from: 'tamara', text: '…wow.' },
              { from: 'tamara', text: 'I’m going to pretend you didn’t ask me that because you’re upset.' },
            ],
          },
        ],
      },
      {
        id: 'tam_4',
        unlockEpisode: 2,
        unlockSceneIndex: 1,
        messages: [
          { from: 'tamara', text: 'Chioma is LYING. She was the one asking everyone about your dress' },
          { from: 'tamara', text: 'I’m not crazy right??' },
        ],
        replies: [
          {
            id: 'calm',
            text: 'Don’t fight her in public. That’s what Tea wants.',
            effect: { meterChanges: { loyalty: 2, reputation: 1 } },
            responses: [{ from: 'tamara', text: 'Ugh. You’re right. I hate when you’re right 😤💚' }],
          },
          {
            id: 'receipts',
            text: 'Get receipts first. Then we deal.',
            effect: { meterChanges: { suspicion: 2 } },
            responses: [{ from: 'tamara', text: 'Receipts. Ok Detective Ada 🕵️‍♀️💚' }],
          },
        ],
      },
      {
        id: 'tam_5',
        unlockEpisode: 3,
        unlockSceneIndex: 1,
        messages: [
          { from: 'tamara', text: 'ROOMIEEEEES 🏡💚💚💚' },
          { from: 'tamara', text: 'I put a welcome basket in your room. Don’t let Zee work you to death' },
        ],
        replies: [
          {
            id: 'wine',
            text: 'You’re the best. Wine night later?',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'tamara', text: 'OBVIOUSLY 🍷' }],
          },
          {
            id: 'weird',
            text: 'Tam… doesn’t it feel weird? Living with whoever leaked?',
            effect: { meterChanges: { suspicion: 2 } },
            responses: [{ from: 'tamara', text: 'Every day. I sleep with my door locked now 🔒' }],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ CHIDI */
  {
    id: 'dm_chidi',
    title: 'Chidi 📸',
    handle: '@chidi_captures',
    avatarType: 'chidi',
    profileId: 'chidi',
    beats: [
      {
        id: 'chidi_1',
        unlockEpisode: 1,
        unlockSceneIndex: 5,
        messages: [
          { from: 'chidi', text: 'Hey, it’s Chidi. The photographer. Tamara gave me your handle, hope that’s ok 📸' },
          { from: 'chidi', text: 'I took one candid of you on the terrace. You’re the only person in it who isn’t posing.' },
        ],
        replies: [
          {
            id: 'send',
            text: 'Send it 😊',
            effect: { meterChanges: { romanceChidi: 3 } },
            responses: [
              { from: 'chidi', text: '[📷 Photo: you on the terrace, mid-laugh, lagoon lights behind you]' },
              { from: 'chidi', text: 'Told you. Real people photograph better.' },
            ],
          },
          {
            id: 'consent',
            text: 'You took a picture of me without asking?',
            effect: { meterChanges: { romanceChidi: 1, reputation: 1 } },
            responses: [
              { from: 'chidi', text: 'Fair. Deleting it now.' },
              { from: 'chidi', text: '…Ok I’m keeping it for my portfolio only. It’s a really good photo, {name}.' },
            ],
          },
          {
            id: 'smooth',
            text: 'Smooth line, photographer 😏',
            effect: { meterChanges: { romanceChidi: 4 }, flagToSet: 'flirted_chidi_dm' },
            responses: [{ from: 'chidi', text: 'Not a line. I don’t do lines. Just facts and f-stops 😅' }],
          },
        ],
      },
      {
        id: 'chidi_2',
        unlockEpisode: 2,
        unlockSceneIndex: 0,
        messages: [
          { from: 'chidi', text: 'You ok? Saw the post. Don’t read the comments.' },
          { from: 'chidi', text: 'I’m going through every RAW file from Friday. If someone was on that mezzanine, my camera saw them.' },
        ],
        replies: [
          {
            id: 'thanks',
            text: 'Thank you, Chidi. Truly.',
            effect: { meterChanges: { romanceChidi: 3, loyalty: 1 } },
            responses: [{ from: 'chidi', text: 'Don’t thank me yet. Thank me when we catch them.' }],
          },
          {
            id: 'call',
            text: 'Call me the second you find something.',
            effect: { meterChanges: { suspicion: 2 }, flagToSet: 'chidi_dm_investigate' },
            responses: [{ from: 'chidi', text: 'Deal. Studio, after your 12pm class?' }],
          },
        ],
      },
      {
        id: 'chidi_3_kelvin',
        unlockEpisode: 2,
        unlockSceneIndex: 6,
        requiredFlag: 'sided_with_kelvin',
        messages: [
          { from: 'chidi', text: 'I get it. He has money and lawyers. I just have a camera.' },
          { from: 'chidi', text: 'But I’m still going to find who did this. Not for him. For you.' },
        ],
        replies: [
          {
            id: 'not_money',
            text: 'It’s not about money, Chidi.',
            effect: { meterChanges: { romanceChidi: 4 } },
            responses: [{ from: 'chidi', text: 'Then show me. Studio’s open tomorrow.' }],
          },
          {
            id: 'advantage',
            text: 'I need every advantage I can get.',
            effect: { meterChanges: { romanceChidi: -1, reputation: 1 } },
            responses: [{ from: 'chidi', text: 'Understood. Just be careful whose wing you stand under.' }],
          },
        ],
      },
      {
        id: 'chidi_3_chidi',
        unlockEpisode: 2,
        unlockSceneIndex: 6,
        requiredFlag: 'sided_with_chidi',
        messages: [
          { from: 'chidi', text: 'Thank you for tonight. For choosing the truth.' },
          { from: 'chidi', text: 'Kelvin looked like he wanted to throw me off the roof 😂' },
        ],
        replies: [
          {
            id: 'survive',
            text: 'He’ll survive 😏',
            effect: { meterChanges: { romanceChidi: 3 } },
            responses: [{ from: 'chidi', text: 'Barely. Did you see his face? I should’ve taken a photo 📸😂' }],
          },
          {
            id: 'regret',
            text: 'Don’t make me regret it.',
            effect: { meterChanges: { romanceChidi: 1, reputation: 1 } },
            responses: [{ from: 'chidi', text: 'I won’t. Promise.' }],
          },
        ],
      },
      {
        id: 'chidi_4',
        unlockEpisode: 3,
        unlockSceneIndex: 3,
        messages: [
          { from: 'chidi', text: 'How’s life in the glass house?' },
          { from: 'chidi', text: 'Seriously though. Lock your door at night. People who leak secrets don’t like people who find them.' },
        ],
        replies: [
          {
            id: 'worried',
            text: 'Worried about me, Nwosu? 😏',
            effect: { meterChanges: { romanceChidi: 4 } },
            responses: [{ from: 'chidi', text: '…maybe. Yes. Obviously yes.' }],
          },
          {
            id: 'handle',
            text: 'I can handle myself.',
            effect: { meterChanges: { reputation: 2 } },
            responses: [{ from: 'chidi', text: 'I know. That’s what worries me 😅' }],
          },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- KELVIN */
  {
    id: 'dm_kelvin',
    title: 'Kelvin 🥃',
    handle: '@kelvin_wright',
    avatarType: 'kelvin',
    profileId: 'kelvin',
    beats: [
      {
        id: 'kelvin_1',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'kelvin', text: 'Still standing?' },
          { from: 'kelvin', text: 'Most people would’ve run out crying. You didn’t. Interesting. 🥃' },
        ],
        replies: [
          {
            id: 'dont_run',
            text: 'I don’t run, Kelvin.',
            effect: { meterChanges: { romanceKelvin: 4 } },
            responses: [{ from: 'kelvin', text: 'Noted. I like people who don’t run.' }],
          },
          {
            id: 'zee',
            text: 'Did your sister do this?',
            effect: { meterChanges: { suspicion: 3 }, flagToSet: 'asked_kelvin_about_zee' },
            responses: [{ from: 'kelvin', text: 'Zee is many things. Careless isn’t one of them. Goodnight, Adaeze.' }],
          },
          {
            id: 'seen',
            label: 'Leave him on Seen 🙈',
            effect: { meterChanges: { romanceKelvin: -1, reputation: 1 } },
            responses: [{ from: 'kelvin', text: 'Leaving me on read. Bold. 😏' }],
          },
        ],
      },
      {
        id: 'kelvin_2',
        unlockEpisode: 2,
        unlockSceneIndex: 1,
        messages: [{ from: 'kelvin', text: 'Lunch? I know a place where nobody photographs anybody.' }],
        replies: [
          {
            id: 'class',
            text: 'I have class.',
            effect: { meterChanges: { romanceKelvin: 1, reputation: 1 } },
            responses: [{ from: 'kelvin', text: 'Class. Right. I’ll be outside the Faculty of Media at 2.' }],
          },
          {
            id: 'dinner',
            text: 'Make it dinner 😏',
            effect: { meterChanges: { romanceKelvin: 4, jealousy: 2 } },
            responses: [{ from: 'kelvin', text: 'Dinner it is. Wear something dangerous.' }],
          },
        ],
      },
      {
        id: 'kelvin_3',
        unlockEpisode: 2,
        unlockSceneIndex: 6,
        messages: [
          { from: 'kelvin', text: 'My sister’s going to make you an offer tonight.' },
          { from: 'kelvin', text: 'Before you answer, make sure you’re the one setting the terms.' },
        ],
        replies: [
          {
            id: 'why',
            text: 'Why are you warning me?',
            effect: { meterChanges: { suspicion: 2, romanceKelvin: 2 } },
            responses: [{ from: 'kelvin', text: 'Because in my family nothing comes without a price. Not even kindness.' }],
          },
          {
            id: 'own_deals',
            text: 'I can negotiate my own deals, Kelvin.',
            effect: { meterChanges: { reputation: 3 } },
            responses: [{ from: 'kelvin', text: 'I know. That’s what makes you dangerous 🥃' }],
          },
        ],
      },
      {
        id: 'kelvin_4',
        unlockEpisode: 3,
        unlockSceneIndex: 4,
        messages: [
          { from: 'kelvin', text: 'Can’t sleep either?' },
          { from: 'kelvin', text: 'Your light’s on. I’m on the balcony. The view’s better with company.' },
        ],
        replies: [
          {
            id: 'coming',
            text: 'Coming down 🌙',
            effect: { meterChanges: { romanceKelvin: 5, jealousy: 3 }, flagToSet: 'midnight_balcony_kelvin' },
            responses: [{ from: 'kelvin', text: 'I’ll pour you something.' }],
          },
          {
            id: 'goodnight',
            text: 'Goodnight, Kelvin.',
            effect: { meterChanges: { reputation: 2 } },
            responses: [{ from: 'kelvin', text: 'Goodnight, Adaeze. Lock your door.' }],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- GIRLS CHAT */
  {
    id: 'dm_group',
    title: 'The Girls 💅',
    handle: 'Zee, Tamara, Chi, Bisola, Hauwa',
    avatarEmoji: '💅',
    isGroup: true,
    beats: [
      {
        id: 'group_1',
        unlockEpisode: 1,
        unlockSceneIndex: 3,
        messages: [
          { from: 'system', text: 'Tamara added you to the group' },
          { from: 'zee', text: 'Tamara who is this? 🙂' },
          { from: 'tamara', text: 'ADA. My sister. Be nice.' },
          { from: 'bisola', text: 'Hiiii Ada!! Welcome 😍📸' },
          { from: 'chi', text: 'Is she on the guest portal? Security is strict tonight.' },
          { from: 'hauwa', text: 'Welcome, Ada 🌿' },
        ],
        replies: [
          {
            id: 'thanks_zee',
            text: 'Thanks for having me, Zee 🎉',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'zee', text: 'Mm. Don’t touch the champagne tower 😘' }],
          },
          {
            id: 'on_list',
            text: 'I’m on the list, Chioma. Check again 😌',
            effect: { meterChanges: { reputation: 2, jealousy: 1 } },
            responses: [
              { from: 'chi', text: 'Hm. Noted.' },
              { from: 'bisola', text: 'OOOOOH 😂🍿' },
            ],
          },
        ],
      },
      {
        id: 'group_2',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'bisola', text: 'GUYS. GUYS. CHECK TEA’S PAGE' },
          { from: 'zee', text: 'Who took photos upstairs. I’m asking ONCE.' },
          { from: 'chi', text: 'Not me. I was with the caterers.' },
          { from: 'bisola', text: 'Not me!! My phone was charging!!' },
          { from: 'hauwa', text: 'Everyone breathe.' },
          { from: 'tamara', text: 'Whoever did this, I WILL find you.' },
        ],
        replies: [
          {
            id: 'in_this_chat',
            text: 'Whoever did this is in this chat.',
            effect: { meterChanges: { suspicion: 3, loyalty: -2 }, flagToSet: 'accused_group' },
            responses: [
              { from: 'zee', text: 'Careful, Ada.' },
              { from: 'hauwa', text: '…she’s not wrong though.' },
            ],
          },
          {
            id: 'leaving',
            text: 'I’m leaving the party. Don’t text me.',
            effect: { meterChanges: { reputation: 1 } },
            responses: [{ from: 'tamara', text: 'Ada wait 😭' }],
          },
        ],
      },
      {
        id: 'group_3',
        unlockEpisode: 2,
        unlockSceneIndex: 5,
        messages: [
          { from: 'zee', text: 'New rule: nobody posts this group without my approval. Nobody.' },
          { from: 'bisola', text: 'Even my vlog?? 😭' },
          { from: 'zee', text: 'ESPECIALLY your vlog.' },
          { from: 'chi', text: 'Fine by me. Some of us have NDAs.' },
        ],
        replies: [
          {
            id: 'agree',
            text: 'Agreed. Lock it down.',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'zee', text: 'Finally, someone sensible.' }],
          },
          {
            id: 'challenge',
            text: 'Controlling the narrative won’t catch the leaker, Zee.',
            effect: { meterChanges: { reputation: 2 }, flagToSet: 'challenged_zee_group' },
            responses: [
              { from: 'zee', text: 'And what will, Miss Ajegunle?' },
              { from: 'hauwa', text: 'Patience.' },
            ],
          },
        ],
      },
      {
        id: 'group_4',
        unlockEpisode: 3,
        unlockSceneIndex: 0,
        messages: [
          { from: 'system', text: 'Zee renamed the group “Content House 🏡”' },
          { from: 'zee', text: 'House rules. 1. Ring lights off at 2am. 2. No guests upstairs. 3. The archive room is OFF LIMITS.' },
          { from: 'bisola', text: 'What’s even in the archive room 👀' },
          { from: 'zee', text: 'Nothing that concerns you.' },
        ],
        replies: [
          {
            id: 'boss',
            text: 'Got it, boss 💼',
            effect: { meterChanges: { loyalty: 1, popularity: 1 } },
            responses: [{ from: 'zee', text: 'See? She learns fast.' }],
          },
          {
            id: 'why_locked',
            text: 'Why is the archive room locked, Zee?',
            effect: { meterChanges: { suspicion: 3 } },
            responses: [{ from: 'zee', text: 'Because I said so. 🙂' }],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------- ZEE */
  {
    id: 'dm_zee',
    title: 'Zee 👑',
    handle: '@zeebello',
    avatarType: 'zee',
    profileId: 'zee',
    beats: [
      {
        id: 'zee_1',
        unlockEpisode: 2,
        unlockSceneIndex: 6,
        messages: [
          { from: 'zee', text: 'Lekki-Ikoyi link bridge. Midnight.' },
          { from: 'zee', text: 'Come alone. Don’t tell Tamara.' },
        ],
        replies: [
          {
            id: 'there',
            text: 'I’ll be there.',
            effect: { meterChanges: { loyalty: 1, suspicion: 1 } },
            responses: [{ from: 'zee', text: 'Good girl. Wear something presentable.' }],
          },
          {
            id: 'why_secret',
            text: 'Why can’t Tamara know?',
            effect: { meterChanges: { suspicion: 3 } },
            responses: [{ from: 'zee', text: 'Because some offers are only made once. 🙂' }],
          },
        ],
      },
      {
        id: 'zee_2',
        unlockEpisode: 3,
        unlockSceneIndex: 2,
        messages: [
          { from: 'zee', text: 'Where are the sponsor decks? Call sheet starts in 20 mins.' },
          { from: 'zee', text: 'Also: who has been in my office? My desk drawer was open.' },
        ],
        replies: [
          {
            id: 'on_it',
            text: 'Decks are in your inbox. And I haven’t been in your office.',
            effect: { meterChanges: { loyalty: 2 } },
            responses: [{ from: 'zee', text: 'Hm. Then someone else has been.' }],
          },
          {
            id: 'deflect',
            text: 'Maybe check who else has keys to your office?',
            effect: { meterChanges: { suspicion: 2, reputation: 1 } },
            responses: [{ from: 'zee', text: '…Only two people have keys to my office. And one of them is me.' }],
          },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------- @TheLagosTea */
  {
    id: 'dm_tea',
    title: 'The Lagos Tea 🫖',
    handle: '@TheLagosTea',
    avatarType: 'lagos_tea',
    profileId: 'lagos_tea',
    beats: [
      {
        id: 'tea_1',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'lagos_tea', text: 'Hi Cinderella 🫖' },
          { from: 'lagos_tea', text: 'Did you enjoy your debut? 168K likes in twenty minutes. You’re welcome.' },
        ],
        replies: [
          {
            id: 'who',
            text: 'Who are you?',
            effect: { meterChanges: { suspicion: 3 } },
            responses: [{ from: 'lagos_tea', text: 'Someone who sees everything, darling. 👀' }],
          },
          {
            id: 'take_down',
            text: 'Take it down. Now.',
            effect: { meterChanges: { reputation: 2 } },
            responses: [{ from: 'lagos_tea', text: 'Aww. No. 🫖 But keep that energy, it’s cute.' }],
          },
          {
            id: 'screenshot',
            label: '📸 Screenshot the chat',
            effect: { meterChanges: { suspicion: 2 }, flagToSet: 'screenshotted_tea_dm' },
            addsClue: {
              name: 'Screenshot: First DM from @TheLagosTea',
              description:
                'The account messaged you within minutes of the leak and already knew the exact like count. Whoever runs it was watching the post go viral in real time, probably from inside the party.',
            },
            responses: [{ from: 'lagos_tea', text: 'Screenshots won’t save you, babe. 🫖' }],
          },
        ],
      },
      {
        id: 'tea_2',
        unlockEpisode: 2,
        unlockSceneIndex: 4,
        messages: [
          { from: 'lagos_tea', text: 'Busy girl. Darkrooms, sports cars, mall gossip… 👀' },
          { from: 'lagos_tea', text: 'Careful who you trust. Half your new friends have two phones.' },
        ],
        replies: [
          {
            id: 'threat',
            text: 'Are you threatening me?',
            effect: { meterChanges: { suspicion: 2 } },
            responses: [{ from: 'lagos_tea', text: 'Threatening? No. Advising 🫖' }],
          },
          {
            id: 'find_you',
            text: 'I’m going to find you.',
            effect: { meterChanges: { reputation: 2 }, flagToSet: 'vowed_to_find_tea' },
            responses: [{ from: 'lagos_tea', text: 'Hot. Good luck 💋' }],
          },
        ],
      },
      {
        id: 'tea_3',
        unlockEpisode: 3,
        unlockSceneIndex: 5,
        messages: [
          { from: 'lagos_tea', text: 'You shouldn’t be in that room, {name}.' },
          { from: 'lagos_tea', text: 'Put it back exactly how you found it 🫖' },
        ],
        replies: [
          {
            id: 'silent',
            label: 'Don’t reply. Get out.',
            effect: { meterChanges: { suspicion: 2 } },
            responses: [],
          },
          {
            id: 'how',
            text: 'How do you know where I am?',
            effect: { meterChanges: { suspicion: 4 }, flagToSet: 'tea_knows_location' },
            responses: [{ from: 'lagos_tea', text: 'I always know where you are. 🫖' }],
          },
        ],
      },
    ],
  },
];
