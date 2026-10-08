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
        id: 'mum_ep2',
        unlockEpisode: 2,
        unlockSceneIndex: 3,
        messages: [
          { from: 'mum', text: 'Pastor Matthew asked after you at church today.' },
          { from: 'mum', text: 'I told him my daughter is busy studying. But people are whispering about some high society magazine cover. {name}, don’t let those Lagos Island people turn your head.' },
        ],
        replies: [
          {
            id: 'grounded',
            text: 'I haven’t forgotten where I come from, Mummy. I’m just trying to make you proud.',
            effect: { meterChanges: { loyalty: 3, reputation: 1 } },
            responses: [
              { from: 'mum', text: 'I am already proud of you. Just come home to the mainland for Sunday jollof when you can.' },
            ],
          },
          {
            id: 'opportunities',
            text: 'Mummy, this circle opens doors that hard work alone never could in Lagos.',
            effect: { meterChanges: { popularity: 2, loyalty: -1 }, flagToSet: 'ada_ambitious_to_mum' },
            responses: [
              { from: 'mum', text: 'Doors can open and slam on your fingers, {name}. Be wise.' },
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
      {
        id: 'tam_react_burner_phone',
        unlockEpisode: 3,
        unlockSceneIndex: 6,
        requiredAnyFlags: ['inspected_burner_phone', 'photographed_tea_phone'],
        messages: [
          { from: 'tamara', text: 'Ada... did you find something in the archive room just now? 🤫' },
          { from: 'tamara', text: 'I saw someone slipping out of that hallway looking pale as a ghost.' },
        ],
        replies: [
          {
            id: 'confide_tamara',
            text: 'I found an active burner phone logged into @TheLagosTea.',
            effect: { meterChanges: { loyalty: 5, suspicion: -2 }, flagToSet: 'tamara_knows_burner' },
            responses: [
              { from: 'tamara', text: 'WHAT?! In Zee’s house?! 😱' },
              { from: 'tamara', text: 'Keep that photo safe, Ada. Whoever owns that phone will do anything to keep it quiet.' },
            ],
          },
          {
            id: 'play_dumb',
            text: 'Just grabbing fresh printer toner for Zee’s schedule. Nothing dramatic.',
            effect: { meterChanges: { suspicion: 2, reputation: 1 } },
            responses: [
              { from: 'tamara', text: 'You’re a terrible liar, Adaeze. But okay... stay safe. 💚' },
            ],
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
      {
        id: 'chidi_romance_darkroom',
        unlockEpisode: 3,
        unlockSceneIndex: 4,
        requiredFlag: 'chidi_romantic_moment',
        messages: [
          { from: 'chidi', text: 'Still thinking about earlier on the veranda... when the lights flickered.' },
          { from: 'chidi', text: 'You looked straight into the lens, Ada. No shield, no fake smile. Just you.' },
        ],
        replies: [
          {
            id: 'honest_feeling',
            text: 'I didn’t feel like hiding from you, Chidi.',
            effect: { meterChanges: { romanceChidi: 5, loyalty: 2 }, flagToSet: 'chidi_special_darkroom_date' },
            responses: [
              { from: 'chidi', text: 'That means more to me than any award or headline.' },
              { from: 'chidi', text: 'When this storm blows over... let me take you somewhere real. No influencers allowed. 📸' },
            ],
          },
          {
            id: 'keep_focus',
            text: 'Don’t lose focus, photographer. We still have a mystery to solve.',
            effect: { meterChanges: { romanceChidi: 2, reputation: 2 } },
            responses: [
              { from: 'chidi', text: 'Aye aye, captain. Eyes on the target. Always.' },
            ],
          },
        ],
      },
      {
        id: 'chidi_react_burner',
        unlockEpisode: 3,
        unlockSceneIndex: 6,
        requiredAnyFlags: ['inspected_burner_phone', 'photographed_tea_phone'],
        messages: [
          { from: 'chidi', text: 'Ada! I’m outside the estate gates right now. Did you find anything in the archive room?' },
        ],
        replies: [
          {
            id: 'send_clue',
            text: 'Found a burner phone charging inside. It was logged right into @TheLagosTea.',
            effect: { meterChanges: { romanceChidi: 4, suspicion: -2 }, flagToSet: 'shared_burner_with_chidi' },
            addsClue: {
              name: 'Chidi’s Telephoto Log: Gate Surveillance',
              description: 'Chidi cross-referenced timestamps from outside the Banana Island villa when the burner phone pinged.',
            },
            responses: [
              { from: 'chidi', text: 'God. That proves the connection to the villa 100%.' },
              { from: 'chidi', text: 'I’ve got my long lens trained on the side balconies. Whoever tries to ditch that phone is on camera.' },
            ],
          },
          {
            id: 'wait_morning',
            text: 'Stay back for now. I don’t want security grabbing you.',
            effect: { meterChanges: { romanceChidi: 3, loyalty: 2 } },
            responses: [
              { from: 'chidi', text: 'I’m not leaving you alone in a den of wolves. Call me the minute you’re in your room.' },
            ],
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
      {
        id: 'kelvin_romance_balcony',
        unlockEpisode: 3,
        unlockSceneIndex: 5,
        requiredFlag: 'midnight_balcony_kelvin',
        messages: [
          { from: 'kelvin', text: 'You left your earring on the table outside.' },
          { from: 'kelvin', text: 'Consider it my excuse to see you again before the morning brand shoots begin.' },
        ],
        replies: [
          {
            id: 'keep_it',
            text: 'Keep it safe for me, Kelvin. Don’t let anyone else claim it.',
            effect: { meterChanges: { romanceKelvin: 5, jealousy: 2 }, flagToSet: 'kelvin_private_penthouse_access' },
            responses: [
              { from: 'kelvin', text: 'Nobody touches what’s yours while I’m around. That’s a promise.' },
              { from: 'kelvin', text: 'When this house gets too loud, my penthouse in Victoria Island has a private elevator. The keycard is yours whenever you want it.' },
            ],
          },
          {
            id: 'strictly_business',
            text: 'Give it back tomorrow. I need to keep my focus sharp.',
            effect: { meterChanges: { reputation: 3, romanceKelvin: 1 } },
            responses: [
              { from: 'kelvin', text: 'Unforgiving as ever. I respect that. See you at sunrise.' },
            ],
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
      {
        id: 'zee_ep3_warning',
        unlockEpisode: 3,
        unlockSceneIndex: 6,
        messages: [
          { from: 'zee', text: 'I saw security logs from the archive corridor.' },
          { from: 'zee', text: 'If you’re digging into my past or my family’s foundation, Ada… stop. Some doors in Lagos are locked for your own protection.' },
        ],
        replies: [
          {
            id: 'zee_confront',
            text: 'If you have nothing to hide from @TheLagosTea, why are you so afraid of what’s in that room?',
            effect: { meterChanges: { reputation: 3, loyalty: -2 }, flagToSet: 'defied_zee_archive' },
            responses: [
              { from: 'zee', text: 'I am not afraid of anything. I am warning you because I actually respect your intelligence. Don’t waste it.' },
            ],
          },
          {
            id: 'zee_diplomatic',
            text: 'I’m trying to clear your name as much as mine, Zee.',
            effect: { meterChanges: { loyalty: 3, suspicion: -1 }, flagToSet: 'pledged_loyalty_to_zee' },
            responses: [
              { from: 'zee', text: 'Then prove it tomorrow at the press reveal.' },
            ],
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
        id: 'tea_ep2_cipher',
        unlockEpisode: 2,
        unlockSceneIndex: 6,
        messages: [
          { from: 'lagos_tea', text: 'Midnight bridge rendezvous? How cinematic 🎬🫖' },
          { from: 'lagos_tea', text: 'Ask Zee about the 2023 charity gala ledger. Ask her where the ten million Naira went.' },
        ],
        replies: [
          {
            id: 'tea_receipts_demand',
            text: 'Send receipts or stop sending riddles.',
            effect: { meterChanges: { reputation: 3 } },
            responses: [
              { from: 'lagos_tea', text: 'Receipts drop when the audience is biggest, darling. Stay glued to your screen 🫖' },
            ],
          },
          {
            id: 'tea_clue_trap',
            label: '📸 Trace the ping location',
            effect: { meterChanges: { suspicion: 3 }, flagToSet: 'tea_ip_traced' },
            addsClue: {
              name: 'Tea’s Ping Location: Victoria Island Subnet',
              description: 'The DM timestamp originated from a private high-speed fiber router registered in the Banana Island / VI diplomatic corridor.',
            },
            responses: [
              { from: 'lagos_tea', text: 'Cute attempt at tracking. You’re getting warmer 😉' },
            ],
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

  /* ------------------------------------------------------------------ DAYO */
  {
    id: 'dm_dayo',
    title: 'Dayo Martins 🎧',
    handle: '@dayomartins_sound',
    avatarType: 'dayo',
    profileId: 'dayo',
    beats: [
      {
        id: 'dayo_1',
        unlockEpisode: 1,
        unlockSceneIndex: 6,
        messages: [
          { from: 'dayo', text: 'Peace, {name}. Tamara passed me your handle after the party.' },
          { from: 'dayo', text: 'Saw that chaotic blog post about your address. Lagos high society gets loud when people feel threatened. Hope you got home safe.' },
        ],
        replies: [
          {
            id: 'dayo_safe',
            text: 'Made it back in one piece, Dayo. Thank you for asking. 🙏',
            effect: { meterChanges: { romanceDayo: 4, loyalty: 2 } },
            responses: [
              { from: 'dayo', text: 'Good. The city has too much noise; don’t let the static drown your rhythm.' },
              { from: 'dayo', text: 'If you ever need a quiet corner while the comments cool down, studio monitors don’t care about viral blogs.' },
            ],
          },
          {
            id: 'dayo_tough',
            text: 'It takes a lot more than anonymous keyboard cowards to shake me.',
            effect: { meterChanges: { reputation: 3, romanceDayo: 2 } },
            responses: [
              { from: 'dayo', text: 'I like that. Steady hands make the best records. Stay grounded.' },
            ],
          },
        ],
      },
      {
        id: 'dayo_2_music_post',
        unlockEpisode: 2,
        unlockSceneIndex: 2,
        messages: [
          { from: 'dayo', text: 'Heard you on campus earlier discussing sound design for the media lab.' },
          { from: 'dayo', text: 'Most people in Zee’s orbit only listen to what’s trending on the charts. You actually listen to the bassline.' },
        ],
        replies: [
          {
            id: 'ear_for_truth',
            text: 'When you grow up on the mainland, you learn which beats are real and which ones are manufactured.',
            effect: { meterChanges: { romanceDayo: 4, reputation: 2 }, flagToSet: 'connected_with_dayo_sound' },
            responses: [
              { from: 'dayo', text: 'Exactly that. 🎧 Authentic groove can’t be bought with oil money.' },
              { from: 'dayo', text: 'I’m laying down acoustic stems tomorrow night at the sound studio. If you have time between classes, drop by.' },
            ],
          },
          {
            id: 'busy_grind',
            text: 'Trying to balance classes, bills, and this anonymous leaker leaves little time for playlist curation.',
            effect: { meterChanges: { loyalty: 2, romanceDayo: 1 } },
            responses: [
              { from: 'dayo', text: 'Understood. Protect your peace first. The studio door is open whenever you’re ready.' },
            ],
          },
        ],
      },
      {
        id: 'dayo_3_romance',
        unlockEpisode: 3,
        unlockSceneIndex: 3,
        requiredFlag: 'connected_with_dayo_sound',
        messages: [
          { from: 'dayo', text: 'Sent you a private SoundCloud snippet. Listen with headphones on.' },
          { from: 'dayo', text: 'Built the chord progression around the energy you brought into the studio.' },
        ],
        replies: [
          {
            id: 'dayo_flirt',
            text: 'You wrote a melody for me, Dayo Martins? Careful, people will start rumors. ✨',
            effect: { meterChanges: { romanceDayo: 6, jealousy: 2 }, flagToSet: 'dayo_private_soundtrack' },
            responses: [
              { from: 'dayo', text: 'Let them talk. Great art needs real inspiration, {name}.' },
              { from: 'dayo', text: 'When you’re ready to hear the full mix, come up to the rooftop terrace.' },
            ],
          },
          {
            id: 'dayo_friend',
            text: 'The chords are gorgeous, Dayo. It feels peaceful after all this chaos.',
            effect: { meterChanges: { romanceDayo: 3, loyalty: 3 } },
            responses: [
              { from: 'dayo', text: 'Peace is rare in Lagos. Glad it could bring you some quiet.' },
            ],
          },
        ],
      },
      {
        id: 'dayo_4_story_stealth',
        unlockEpisode: 3,
        unlockSceneIndex: 6,
        requiredAnyFlags: ['held_breath_stealth', 'confronted_intruder'],
        messages: [
          { from: 'dayo', text: 'Heard footsteps rushing down the fire stairs behind the recording wing.' },
          { from: 'dayo', text: 'Whoever ran past left a dropped magnetic keycard near the mixing console. Are you alright?' },
        ],
        replies: [
          {
            id: 'dayo_share_intel',
            text: 'Dayo, keep that keycard! It belongs to the locked archive room upstairs.',
            effect: { meterChanges: { romanceDayo: 4, suspicion: -2 }, flagToSet: 'dayo_holds_keycard_intel' },
            addsClue: {
              name: 'Dayo’s Studio Keycard Log',
              description: 'Dayo recovered a dropped magnetic access pass near the mixing console right after the intruder fled the archive hallway.',
            },
            responses: [
              { from: 'dayo', text: 'Locked in my safe box right now. No one touches it.' },
              { from: 'dayo', text: 'Watch your back, Ada. Whoever dropped this knows their time is running out.' },
            ],
          },
          {
            id: 'dayo_reassure',
            text: 'I’m safe in my room now, Dayo. Thank you for watching out for me.',
            effect: { meterChanges: { romanceDayo: 3, loyalty: 2 } },
            responses: [
              { from: 'dayo', text: 'Always. Sleep with your door locked tonight. 🎧' },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------- CHIOMA */
  {
    id: 'dm_chi',
    title: 'Chioma Eze ⚖️',
    handle: '@chi_corporate_glam',
    avatarType: 'chi',
    profileId: 'chi',
    beats: [
      {
        id: 'chi_1',
        unlockEpisode: 2,
        unlockSceneIndex: 3,
        messages: [
          { from: 'chi', text: 'Ada. A quick professional word regarding this @TheLagosTea situation.' },
          { from: 'chi', text: 'Defamation cases in Nigeria are tedious, but publishing private addresses violates data protection statutes. Keep copies of every timestamp.' },
        ],
        replies: [
          {
            id: 'chi_thanks',
            text: 'Thank you, Chioma. I have screenshots saved in a dedicated drive.',
            effect: { meterChanges: { reputation: 3, loyalty: 2 }, flagToSet: 'chioma_legal_alliance' },
            responses: [
              { from: 'chi', text: 'Smart girl. Evidence is the only currency that doesn’t depreciate.' },
            ],
          },
          {
            id: 'chi_suspect',
            text: 'Are you offering legal advice, or assessing whether I’m going to sue someone in this circle?',
            effect: { meterChanges: { suspicion: 2, reputation: 2 } },
            responses: [
              { from: 'chi', text: 'Both. Prudence is never accidental, Ada. Keep your eyes sharp.' },
            ],
          },
        ],
      },
      {
        id: 'chi_2',
        unlockEpisode: 3,
        unlockSceneIndex: 2,
        messages: [
          { from: 'chi', text: 'Ada, look closely at section 4 of the influencer agreement Zee distributed.' },
          { from: 'chi', text: 'There is a unilateral indemnity clause. If Tea leaks inside info from this mansion, Zee can legally hold the signees financially liable.' },
        ],
        replies: [
          {
            id: 'chi_grateful_legal',
            text: 'Thank you for spotting that, Chioma. Did the other girls sign it?',
            effect: { meterChanges: { loyalty: 2, reputation: 2 }, flagToSet: 'chioma_legal_protection' },
            addsClue: {
              name: 'Section 4 Indemnity Trap',
              description: 'Chioma uncovered a clause in Zee’s house contract designed to scapegoat assistants or newcomers for leaked private data.',
            },
            responses: [
              { from: 'chi', text: 'Bisola signed without reading. Tamara refused. Protect yourself.' },
            ],
          },
          {
            id: 'chi_wary',
            text: 'Why are you telling me this, Chioma? What’s your stake here?',
            effect: { meterChanges: { suspicion: 2 } },
            responses: [
              { from: 'chi', text: 'I believe in clean contracts and fair play. Unfair leverage offends my professional dignity.' },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------- BISOLA */
  {
    id: 'dm_bisola',
    title: 'Bisola Adeyemi 🎥',
    handle: '@bisola_vlogs',
    avatarType: 'bisola',
    profileId: 'bisola',
    beats: [
      {
        id: 'bisola_1',
        unlockEpisode: 2,
        unlockSceneIndex: 4,
        messages: [
          { from: 'bisola', text: 'ADAAAA!! OMG!! 😭🍿 Did you see the comment section on Tea’s latest post?!' },
          { from: 'bisola', text: 'People are debating whether your shoes were thrifted or vintage archival couture! You’re trending on TikTok!!' },
        ],
        replies: [
          {
            id: 'bisola_laugh',
            text: 'Lagos social media can debate anything 😂 As long as they spell my name right!',
            effect: { meterChanges: { popularity: 3, loyalty: 1 } },
            responses: [
              { from: 'bisola', text: 'ICONIC RESPONSE!! Can I quote that on my daily vlog story?? Pleeeease! 📸✨' },
            ],
          },
          {
            id: 'bisola_cautious',
            text: 'I’d rather people focus on the truth than frivolous gossip, Bisola.',
            effect: { meterChanges: { reputation: 2, suspicion: 1 } },
            responses: [
              { from: 'bisola', text: 'Fair enough sis! But hey, viral clout is viral clout 😉' },
            ],
          },
        ],
      },
      {
        id: 'bisola_2',
        unlockEpisode: 3,
        unlockSceneIndex: 3,
        messages: [
          { from: 'bisola', text: 'Girl!! I was doing a TikTok live in the secondary hallway and saw someone slip through the archive door with a charger!!' },
          { from: 'bisola', text: 'I thought Zee said the key was lost?! 😱👀' },
        ],
        replies: [
          {
            id: 'bisola_press_details',
            text: 'Bisola! Who was it?? Did you catch their clothes on camera?',
            effect: { meterChanges: { suspicion: 3, loyalty: 2 }, flagToSet: 'bisola_witnessed_intruder' },
            addsClue: {
              name: 'Bisola’s Live Stream Background Silhouette',
              description: 'Bisola’s TikTok Live caught a brief shadow entering the archive room with a charger while the rest of the house was at the pool.',
            },
            responses: [
              { from: 'bisola', text: 'Too blurry! But they were wearing dark silk, and they moved super fast!' },
            ],
          },
          {
            id: 'bisola_shush',
            text: 'Delete that TikTok live immediately before whoever it was sees it!',
            effect: { meterChanges: { reputation: 2, loyalty: 3 } },
            responses: [
              { from: 'bisola', text: 'Archived to private already! My heart is pounding omg 😭' },
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------- HAUWA */
  {
    id: 'dm_hauwa',
    title: 'Hauwa Musa 🌿',
    handle: '@hauwa_mindbody',
    avatarType: 'hauwa',
    profileId: 'hauwa',
    beats: [
      {
        id: 'hauwa_1',
        unlockEpisode: 2,
        unlockSceneIndex: 2,
        messages: [
          { from: 'hauwa', text: 'Peace to your spirit, Ada 🌿' },
          { from: 'hauwa', text: 'This house creates whirlpools of toxic ego. Don’t internalize their envy. Drink water and remember who you were before the flashbulbs.' },
        ],
        replies: [
          {
            id: 'hauwa_grateful',
            text: 'Thank you Hauwa. It feels like everyone else here is playing a ruthless game.',
            effect: { meterChanges: { loyalty: 3, suspicion: -1 }, flagToSet: 'hauwa_calm_anchor' },
            responses: [
              { from: 'hauwa', text: 'They are playing games because they are terrified of being forgotten. Stay centered. 🕊️' },
            ],
          },
          {
            id: 'hauwa_resilient',
            text: 'I’m focused on the facts, Hauwa. I won’t let anyone push me out.',
            effect: { meterChanges: { reputation: 2 } },
            responses: [
              { from: 'hauwa', text: 'Strength is noble, provided it does not harden into bitterness. Walk gently.' },
            ],
          },
        ],
      },
      {
        id: 'hauwa_2',
        unlockEpisode: 3,
        unlockSceneIndex: 4,
        messages: [
          { from: 'hauwa', text: 'Ada, the energy around dinner was fractured. Someone at that table was vibrating with guilt.' },
          { from: 'hauwa', text: 'I found an incense burner extinguished with spilled candle wax outside the utility hall. Watch where you step tonight.' },
        ],
        replies: [
          {
            id: 'hauwa_ask_who',
            text: 'Who seemed the most nervous to you, Hauwa?',
            effect: { meterChanges: { loyalty: 2, suspicion: 2 }, flagToSet: 'hauwa_aura_consulted' },
            responses: [
              { from: 'hauwa', text: 'The one who laughed the loudest. Guilt always wears an oversized smile.' },
            ],
          },
          {
            id: 'hauwa_peace_reply',
            text: 'I will be careful, Hauwa. Thank you for always sensing what others ignore.',
            effect: { meterChanges: { loyalty: 3, suspicion: -1 } },
            responses: [
              { from: 'hauwa', text: 'Truth has its own light, Ada. It will find its way out.' },
            ],
          },
        ],
      },
    ],
  },
];
