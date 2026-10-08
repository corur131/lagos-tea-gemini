import { SceneData, EpisodeMeta } from '../types/vn';

export const EPISODE_METAS: EpisodeMeta[] = [
  {
    episode: 1,
    title: 'The Invitation',
    subtitle: 'Ajegunle to Banana Island • The First Spill',
    locationName: 'Banana Island Mansion',
    recap: 'Welcome to Lagos Tea. Scholarship student Ada Obi navigates high society and the very first viral leak from the mysterious @TheLagosTea.',
    twistTitle: 'The Ajegunle Leak',
  },
  {
    episode: 2,
    title: 'Who Posted It?',
    subtitle: 'Group Chat Fallout • The First Triangle',
    locationName: 'Lekki University & Mall',
    recap: 'Previously on Lagos Tea... An anonymous gossip account @TheLagosTea leaked Ada’s home address and borrowed dress. Now the girls accuse each other, while photographer Chidi and heir Kelvin take opposing sides.',
    twistTitle: 'The Deleted Metadata',
  },
  {
    episode: 3,
    title: 'Content House',
    subtitle: 'Ring Lights, Secret Rooms & An Unknown Phone',
    locationName: 'Banana Island Influencer Villa',
    recap: 'Previously on Lagos Tea... In the wake of the viral drama, Zee Bello hired Ada as her personal assistant inside the elite Banana Island Content House. But living behind the ring lights reveals secrets darker than any comment section.',
    twistTitle: 'The Locked Drawer',
  },
];

/* =========================================================================
   SEASON 1, EPISODE 1: "THE INVITATION"
   Handcrafted, culprit-neutral 7 scenes. 5-7 lines per scene.
   ========================================================================= */
export const EPISODE_1_SCENES: SceneData[] = [
  /* Scene 0: Overdue Tuition Notice */
  {
    id: 'ep1_sc0',
    episode: 1,
    sceneIndex: 0,
    location: 'ajegunle_apartment',
    timeModifier: 'day',
    charactersOnStage: ['heroine'],
    lines: [
      {
        speaker: 'narrator',
        text: 'The afternoon sun baked through the rusted burglar-proof bars of my small room in Ajegunle, reflecting off my laptop screen.',
      },
      {
        speaker: 'heroine',
        text: 'I hit refresh on the Lekki Atlantic University portal for the fifth time, praying for an accounting error.',
      },
      {
        speaker: 'narrator',
        text: 'The crimson alert flashed mercilessly: “Outstanding Tuition Balance: ₦1,250,000. Late payment deadline: 48 hours.”',
      },
      {
        speaker: 'heroine',
        text: 'My scholarship only covered seventy percent. If I couldn’t balance the rest, I’d be barred from writing first-semester exams.',
      },
      {
        speaker: 'heroine',
        text: 'Two weekend tutoring gigs and freelance copy editing barely covered food and fuel for the small tiger generator.',
      },
      {
        speaker: 'narrator',
        text: 'A woman with pride in Ajegunle learns early never to show panic, but the clock was ticking down with brutal precision.',
      },
    ],
    choices: [
      {
        id: 'ep1_sc0_c1',
        text: 'Check my emergency bank balance one more time.',
        consequenceText: 'Facing reality: exactly ₦34,200 remains.',
        meterChanges: { loyalty: 5, reputation: -2 },
        flagToSet: 'checked_savings',
      },
      {
        id: 'ep1_sc0_c2',
        text: 'Draft an urgent, dignified email to the university bursar.',
        consequenceText: 'Pleading for time: you swallow your pride.',
        meterChanges: { reputation: -5, suspicion: 5 },
        flagToSet: 'emailed_bursar',
      },
      {
        id: 'ep1_sc0_c3',
        text: 'Close the laptop, take a breath, and refuse to break.',
        consequenceText: 'Unshakable poise: you steady your nerve.',
        meterChanges: { reputation: 10, loyalty: 5 },
        flagToSet: 'kept_calm',
      },
    ],
  },

  /* Scene 1: Tamara Arrives */
  {
    id: 'ep1_sc1',
    episode: 1,
    sceneIndex: 1,
    location: 'ajegunle_apartment',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'tamara'],
    lines: [
      {
        speaker: 'narrator',
        text: 'The unmistakable rumble of a matte black Mercedes G-Wagon echoed down the narrow street, followed by expensive heels on concrete stairs.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'happy',
        text: '“Adaeze babe! Why are you staring at that cracked screen like you’re doing community service? Oya, pack your things!”',
        sfx: 'chime',
      },
      {
        speaker: 'heroine',
        text: 'Tamara burst into the room smelling of Baccarat Rouge and pure oil money, waving a thick golden card embossed with gold foil.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'flirty',
        text: '“Zee Bello is turning twenty-one tonight. Banana Island mansion, private yacht dock, five hundred VIPs. You are my official plus-one.”',
      },
      {
        speaker: 'heroine',
        text: 'We grew up in the same compound before her father struck offshore crude. She never forgot me, even when her follower count hit 2.5 million.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'happy',
        text: '“Every brand exec in West Africa will be there. Even that stingy Dean from Lekki Atlantic. You need to network, my girl!”',
      },
    ],
    choices: [
      {
        id: 'ep1_sc1_c1',
        text: '“Tamara, I’m ₦1.2 million short on tuition; I can’t play billionaire today.”',
        consequenceText: 'Tamara scoffs playfully at your worry.',
        meterChanges: { loyalty: 10, reputation: 5 },
        flagToSet: 'confided_fees',
      },
      {
        id: 'ep1_sc1_c2',
        text: '“A Banana Island party? Zee’s crowd will chew me up and spit me out.”',
        consequenceText: 'Tamara laughs and grabs your hands.',
        meterChanges: { popularity: -5, suspicion: -5 },
        flagToSet: 'hesitant_invitation',
      },
      {
        id: 'ep1_sc1_c3',
        text: '“Tell me you’re not dragging me into Zee’s influencer drama again.”',
        consequenceText: 'Tamara winks: “A little drama never killed anyone!”',
        meterChanges: { popularity: 10, loyalty: 5 },
        flagToSet: 'bantered_drama',
      },
    ],
  },

  /* Scene 2: The Wardrobe Dilemma (Borrow, Pretend, or Skip) */
  {
    id: 'ep1_sc2',
    episode: 1,
    sceneIndex: 2,
    location: 'ajegunle_apartment',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'tamara'],
    lines: [
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'shocked',
        text: 'Tamara threw open my three-door wardrobe and gasped in theatrical horror at my neat rows of plain jeans and varsity tees.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'neutral',
        text: '“Ada, no. You cannot step into Zee’s Banana Island mansion looking like a serious scholar who studies on Friday nights.”',
      },
      {
        speaker: 'heroine',
        text: '“Because I *am* a serious scholar, Tamara. I don’t have a stylist on retainer.”',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'flirty',
        text: 'She signaled her driver, who carried up a zipped velvet garment bag and laid out a breathtaking emerald couture cocktail dress.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'happy',
        text: '“Fresh from Paris Fashion Week. Worn zero times. It has your name written all over it, Adaeze. What do you say?”',
      },
      {
        speaker: 'heroine',
        text: 'I stared at the shimmering fabric. Wearing it meant looking like royalty—or risking looking like an imposter if someone asked.',
      },
    ],
    choices: [
      {
        id: 'ep1_sc2_c1',
        text: 'Borrow Tamara’s emerald designer couture gown without hesitation.',
        consequenceText: 'High glamour: You look like a million dollars, but risks gossip.',
        meterChanges: { popularity: 15, reputation: 10, jealousy: 10 },
        flagToSet: 'borrowed_emerald_dress',
      },
      {
        id: 'ep1_sc2_c2',
        text: 'Pretend my vintage thrifted black shift dress is intentional avant-garde minimalism.',
        consequenceText: 'Effortless cool: Bold authenticity earns respect.',
        meterChanges: { reputation: 15, popularity: 5, loyalty: 5 },
        flagToSet: 'vintage_style_dress',
      },
      {
        id: 'ep1_sc2_c3',
        text: 'Refuse firmly until Tamara literally pleads and drags you into the dress.',
        consequenceText: 'Reluctant glam: Tamara is thrilled, but your guard stays high.',
        meterChanges: { loyalty: 15, popularity: 5 },
        flagToSet: 'dragged_dress',
      },
    ],
  },

  /* Scene 3: Arrival at Banana Island Mansion */
  {
    id: 'ep1_sc3',
    episode: 1,
    sceneIndex: 3,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'zee', 'tamara', 'chi', 'bisola', 'hauwa'],
    lines: [
      {
        speaker: 'narrator',
        text: 'The gates of the Bello estate parted like the entrance to a modern palace. Crystal chandeliers cast golden light across five-carat marble.',
        sfx: 'chime',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'happy',
        text: '“Tamara darling! And look who you dragged out of the library stacks! Welcome to my birthday, Adaeze.”',
      },
      {
        speaker: 'heroine',
        text: 'Zee Bello radiated four million followers of polished perfection, her diamond-dusted frontal lace wig cascading past her shoulders.',
      },
      {
        speaker: 'chi',
        speakerDisplayName: 'Chioma “Chi” Eze',
        expression: 'suspicious',
        text: 'Chioma eyed my outfit with razor precision from behind her champagne flute. “Interesting silhouette, Ada. Is that... bespoke?”',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'happy',
        text: '“Guys, smile! I’m filming the 360 glam-cam for Snapchat! Say ‘Lagos is sweet’!” Bisola waved her pink rhinestone camera stick.',
      },
      {
        speaker: 'hauwa',
        speakerDisplayName: 'Hauwa Musa',
        expression: 'neutral',
        text: 'Hauwa offered a tranquil smile over her matcha mocktail. “Ignore them, Ada. You look stunning. Try the smoked salmon blinis.”',
      },
      {
        speaker: 'heroine',
        text: 'Every girl in this circle smiled like a sister, but the air felt charged with unspoken rivalries and brand contracts.',
      },
    ],
    choices: [
      {
        id: 'ep1_sc3_c1',
        text: '“Happy 21st, Zee. Nobody throws a celebration quite like you.”',
        consequenceText: 'Flawless social grace: Zee smiles with regal approval.',
        meterChanges: { popularity: 15, loyalty: 5 },
        flagToSet: 'charmed_zee',
      },
      {
        id: 'ep1_sc3_c2',
        text: '“Chioma, real style doesn’t need a billboard tag to speak for itself.”',
        consequenceText: 'A razor-sharp clapback: Chioma’s eyes narrow in respect.',
        meterChanges: { reputation: 15, jealousy: 10, suspicion: 5 },
        flagToSet: 'checked_chioma',
      },
      {
        id: 'ep1_sc3_c3',
        text: 'Step closer to Hauwa and Tamara, keeping your distance from the cameras.',
        consequenceText: 'Quiet observation: You study their expressions unnoticed.',
        meterChanges: { loyalty: 10, suspicion: -5 },
        flagToSet: 'stayed_with_hauwa',
      },
    ],
  },

  /* Scene 4: Meeting Chidi Nwosu by the Pool */
  {
    id: 'ep1_sc4',
    episode: 1,
    sceneIndex: 4,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'chidi'],
    lines: [
      {
        speaker: 'narrator',
        text: 'I slipped out toward the glass terrace overlooking the infinity pool, where the cool breeze off the lagoon washed away the heavy perfume.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'flirty',
        text: '“Careful, you’re stepping into the framing of a very expensive master shot.”',
        sfx: 'tap',
      },
      {
        speaker: 'heroine',
        text: 'A guy in a fitted black shirt with a professional Sony FX3 slung across his chest leaned against the marble railing, grinning warmly.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'happy',
        text: '“Chidi Nwosu. Campus photojournalist, hired tonight to make billionaires look twenty percent more angelic than they actually are.”',
      },
      {
        speaker: 'heroine',
        text: 'His eyes were intelligent and completely unimpressed by the private jets parked across the lagoon. It was the first honest breath all evening.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'neutral',
        text: '“You don’t look like you belong on their PR payroll. You’re watching the exits like you expect someone to steal the silverware.”',
      },
      {
        speaker: 'heroine',
        text: 'I couldn’t help but smile. “Maybe I’m just trying to make sure nobody steals my dignity.”',
      },
    ],
    choices: [
      {
        id: 'ep1_sc4_c1',
        text: '“Is everyone at these parties as staged as their ring lights, photographer?”',
        consequenceText: 'Chidi chuckles softly: “Most of them. But not you.”',
        meterChanges: { romanceChidi: 20, popularity: -2 },
        flagToSet: 'bantered_with_chidi',
      },
      {
        id: 'ep1_sc4_c2',
        text: '“You spend your life taking portraits of influencers. Who captures you?”',
        consequenceText: 'A spark of real intrigue lights up Chidi’s warm brown eyes.',
        meterChanges: { romanceChidi: 25, reputation: 5 },
        flagToSet: 'flirted_with_chidi',
      },
      {
        id: 'ep1_sc4_c3',
        text: '“Don’t point that 50mm lens at me; I’m strictly incognito tonight.”',
        consequenceText: 'Chidi lowers the lens and smiles: “Your secret is safe with me.”',
        meterChanges: { romanceChidi: 15, loyalty: 5 },
        flagToSet: 'confided_chidi_incognito',
      },
    ],
  },

  /* Scene 5: Kelvin Watches & Steps In */
  {
    id: 'ep1_sc5',
    episode: 1,
    sceneIndex: 5,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'kelvin'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Before I could answer Chidi, the glass door slid open and a taller silhouette stepped into the pool terrace, holding two crystal flutes.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'flirty',
        text: '“Nwosu, shouldn’t you be photographing Zee cutting her seven-tier imported cake inside?”',
      },
      {
        speaker: 'heroine',
        text: 'Kelvin Adebayo-Wright: Zee’s older brother, heir to a shipping conglomerate, wearing an open-collared silk shirt and a diamond ear stud.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'happy',
        text: 'He handed me one of the flutes with an effortless, predatory charm. “I’ve been watching you since you walked past the foyer, Adaeze.”',
      },
      {
        speaker: 'heroine',
        text: '“Have you? I didn’t think shipping heirs noticed scholarship students from Ajegunle.”',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'flirty',
        text: '“I notice anyone who doesn’t look like they’re performing for an algorithm. You have a dangerous look in your eye, Ada. I like dangerous.”',
      },
      {
        speaker: 'heroine',
        text: 'The contrast between Chidi’s honest gaze and Kelvin’s wealthy magnetism hung in the air like a live wire.',
      },
    ],
    choices: [
      {
        id: 'ep1_sc5_c1',
        text: '“If I’m dangerous, Kelvin, perhaps you shouldn’t stand so close to the deep end.”',
        consequenceText: 'Kelvin breaks into a genuine, thrilled laugh: “Touché.”',
        meterChanges: { romanceKelvin: 25, popularity: 10 },
        flagToSet: 'challenged_kelvin',
      },
      {
        id: 'ep1_sc5_c2',
        text: '“I’m here as Tamara’s friend, not to become someone’s weekend pastime.”',
        consequenceText: 'Kelvin raises his glass in cool respect: “I like a challenge.”',
        meterChanges: { romanceKelvin: 15, reputation: 10 },
        flagToSet: 'kept_kelvin_at_bay',
      },
      {
        id: 'ep1_sc5_c3',
        text: 'Accept the champagne gracefully and meet his gaze without blinking.',
        consequenceText: 'A silent, electric understanding passes between you.',
        meterChanges: { romanceKelvin: 20, jealousy: 15 },
        flagToSet: 'locked_eyes_kelvin',
      },
    ],
  },

  /* Scene 6: The Cliffhanger Leak from @TheLagosTea */
  {
    id: 'ep1_sc6',
    episode: 1,
    sceneIndex: 6,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Suddenly, a chorus of sharp notification alerts rang simultaneously across sixty smartphones in the living room.',
        sfx: 'shock',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'shocked',
        text: '“OMG! @TheLagosTea just posted! Guys, look at your feeds right now!” Bisola’s voice cracked in genuine panic.',
      },
      {
        speaker: 'narrator',
        text: 'Phones turned illuminated faces pale. Tamara whipped out hers, gasped, and instinctively grabbed my arm.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'shocked',
        text: '“Ada... no. How did they get this? Who could have taken this angle?!”',
      },
      {
        speaker: 'heroine',
        text: 'On the screen, a high-definition photograph of me by the party entrance was pinned at the top of the anonymous page with 500,000 followers.',
      },
      {
        speaker: 'narrator',
        text: 'The caption burned into my eyes: “Who invited Ajegunle Cinderella? Flaunting in a borrowed dress while owing ₦1.2M at 14 Awolowo Road, Ajegunle. Who leaked her address to us? XOXO, Lagos Tea ☕️”',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'angry',
        text: 'Zee’s smile vanished completely. Chi stared coldly; Hauwa frowned; Chidi stepped forward; Kelvin’s jaw hardened.',
      },
    ],
    choices: [
      {
        id: 'ep1_sc6_c1',
        text: 'Demand to know right now who in this room leaked my private address.',
        consequenceText: 'Fierce confrontation: You refuse to hide, making enemies and allies.',
        meterChanges: { suspicion: 20, popularity: -5, reputation: 10 },
        flagToSet: 'demanded_leak_answers',
      },
      {
        id: 'ep1_sc6_c2',
        text: 'Lock eyes with Kelvin and maintain icy, unbroken dignity amidst the whispers.',
        consequenceText: 'Aristocratic poise: Kelvin steps in to shield your exit.',
        meterChanges: { romanceKelvin: 15, reputation: 15, jealousy: 10 },
        flagToSet: 'kelvin_shield_exit',
      },
      {
        id: 'ep1_sc6_c3',
        text: 'Turn directly to Chidi and ask if his camera archives caught who took that angle.',
        consequenceText: 'Investigative alliance: Chidi nods firmly and clutches his camera.',
        meterChanges: { romanceChidi: 20, loyalty: 15, suspicion: 10 },
        flagToSet: 'chidi_archive_alliance',
      },
    ],
    twistMoment: {
      title: 'The Viral Leak Drops',
      description: 'Anonymous account @TheLagosTea exposed Ada’s unpaid tuition and exact home address to 500,000 followers. Someone inside the squad is leaking receipts.',
      type: 'revelation',
    },
  },
];

/* =========================================================================
   SEASON 1, EPISODE 2 FALLBACK: "WHO POSTED IT?"
   ========================================================================= */
export const EPISODE_2_SCENES: SceneData[] = [
  {
    id: 'ep2_sc0',
    episode: 2,
    sceneIndex: 0,
    location: 'university_campus',
    timeModifier: 'day',
    charactersOnStage: ['heroine'],
    lines: [
      {
        speaker: 'narrator',
        text: 'By Monday morning at Lekki Atlantic University, every screen in the lecture pavilions was re-posting the @TheLagosTea screenshot.',
      },
      {
        speaker: 'heroine',
        text: 'People I’d never spoken to whispered as I walked past the manicured palm trees toward the Faculty of Media.',
      },
      {
        speaker: 'narrator',
        text: '“Is that the Ajegunle girl?” “I heard she gate-crashed Zee’s party.” “The dress was borrowed from Tamara!”',
      },
      {
        speaker: 'heroine',
        text: 'My phone was blowing up with anonymous Instagram DMs and troll comments, but I kept my back straight.',
      },
      {
        speaker: 'narrator',
        text: 'Whoever ran @TheLagosTea wanted to humiliate me into disappearing. They picked the wrong scholarship student.',
      },
    ],
    choices: [
      {
        id: 'ep2_sc0_c1',
        text: 'Keep walking with head held high, ignoring the stares.',
        consequenceText: 'Pure resilience: Stares turn into silent admiration.',
        meterChanges: { reputation: 10, popularity: 5 },
        flagToSet: 'unbothered_walk',
      },
      {
        id: 'ep2_sc0_c2',
        text: 'Check the comment section to see what receipts were dropped.',
        consequenceText: 'Intel gathering: You discover a burner account commenting specific details.',
        meterChanges: { suspicion: 15, popularity: -5 },
        flagToSet: 'investigated_comments',
      },
    ],
  },
  {
    id: 'ep2_sc1',
    episode: 2,
    sceneIndex: 1,
    location: 'university_campus',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'tamara', 'chi'],
    lines: [
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'angry',
        text: '“Chioma, don’t play innocent with me! You were the only one asking about Ada’s dress labels on the terrace!”',
      },
      {
        speaker: 'chi',
        speakerDisplayName: 'Chioma “Chi” Eze',
        expression: 'angry',
        text: '“Excuse me, Tamara? I am the daughter of a Senior Advocate of Nigeria. I don’t run cheap gossip blogs!”',
      },
      {
        speaker: 'heroine',
        text: 'I found Tamara and Chioma in an explosive confrontation right outside the campus coffee lounge.',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'shocked',
        text: '“Ada! Tell her! Someone in our group is leaking dirt for clout, and Chioma has been trying to take Zee’s brand deals all year!”',
      },
      {
        speaker: 'chi',
        speakerDisplayName: 'Chioma “Chi” Eze',
        expression: 'suspicious',
        text: '“Or maybe it was Bisola vlogging everything, or Hauwa keeping quiet! Why point fingers at me?”',
      },
      {
        speaker: 'heroine',
        text: 'The cracks in the sisterhood were widening, and each girl was armed with her own defense.',
      },
    ],
    choices: [
      {
        id: 'ep2_sc1_c1',
        text: '“Calm down, both of you. Turning on each other is exactly what @TheLagosTea wants.”',
        consequenceText: 'De-escalation: Both girls pause, realizing you are right.',
        meterChanges: { loyalty: 15, reputation: 10 },
        flagToSet: 'peacemaker_ada',
      },
      {
        id: 'ep2_sc1_c2',
        text: '“Chioma, if you have nothing to hide, show me your gallery timestamps from Friday night.”',
        consequenceText: 'Direct pressure: Chioma blinks in defensive shock.',
        meterChanges: { suspicion: 20, jealousy: 10 },
        flagToSet: 'pressed_chioma',
      },
    ],
  },
  {
    id: 'ep2_sc2',
    episode: 2,
    sceneIndex: 2,
    location: 'photoshoot_studio',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'chidi'],
    lines: [
      {
        speaker: 'narrator',
        text: 'An hour later, I slipped into the campus photography studio. The smell of hot lights and seamless paper rolls was comforting.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'happy',
        text: '“I knew you’d come. Sit down, Ada. Drink this malt.” Chidi handed me a cold drink and turned his MacBook monitor toward me.',
      },
      {
        speaker: 'heroine',
        text: '“Did you find something in your raw camera files, Chidi?”',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'neutral',
        text: '“The photo posted by @TheLagosTea wasn’t taken from a phone. It has 4K depth-of-field. It was cropped from a wide shot taken from the second-floor mezzanine.”',
      },
      {
        speaker: 'heroine',
        text: 'My heart skipped a beat. “Who was on the second-floor mezzanine before the cake was cut?”',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'suspicious',
        text: '“All five girls went up there for Zee’s outfit change. Zee, Tamara, Chi, Bisola, and Hauwa. Any one of them could have snapped it or sent it to the page.”',
      },
    ],
    choices: [
      {
        id: 'ep2_sc2_c1',
        text: '“Chidi, thank you. You’re the only person around here who treats me like a human being.”',
        consequenceText: 'Chidi looks at you with deep, genuine warmth.',
        meterChanges: { romanceChidi: 25, loyalty: 10 },
        flagToSet: 'chidi_trust_deepened',
      },
      {
        id: 'ep2_sc2_c2',
        text: '“Can you extract the EXIF metadata from the file they uploaded?”',
        consequenceText: 'Chidi grins: “Already working on it, Detective Ada.”',
        meterChanges: { suspicion: 15, reputation: 10 },
        flagToSet: 'chidi_exif_search',
      },
    ],
  },
  {
    id: 'ep2_sc3',
    episode: 2,
    sceneIndex: 3,
    location: 'mall',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'kelvin'],
    lines: [
      {
        speaker: 'narrator',
        text: 'As I left the studio, a sleek black Porsche pulled up to the curb. The tinted passenger window slid down to reveal Kelvin.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'happy',
        text: '“Get in, Ada. Let’s get lunch at the Palms before the paparazzi figure out you’re the most famous student in Lagos.”',
      },
      {
        speaker: 'heroine',
        text: '“Kelvin, I have classes, and getting photographed in your car will make the rumors ten times worse.”',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'flirty',
        text: '“Let them talk. People only throw stones at ripe mangoes, Ada. Plus, I have information on who paid the bursar for your tuition ledger leak.”',
      },
      {
        speaker: 'heroine',
        text: 'I froze on the pavement. “What did you say?”',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'neutral',
        text: '“Get in the car, and I’ll tell you everything.”',
      },
    ],
    choices: [
      {
        id: 'ep2_sc3_c1',
        text: 'Get into Kelvin’s car to hear what he knows about the tuition leak.',
        consequenceText: 'Stepping into the lion’s den: Kelvin is impressed by your boldness.',
        meterChanges: { romanceKelvin: 25, popularity: 15, jealousy: 15 },
        flagToSet: 'drove_with_kelvin',
      },
      {
        id: 'ep2_sc3_c2',
        text: 'Refuse firmly and tell him you investigate your own battles.',
        consequenceText: 'Fierce independence: Kelvin smirks, intrigued even more.',
        meterChanges: { reputation: 20, romanceKelvin: 15 },
        flagToSet: 'refused_kelvin_ride',
      },
    ],
  },
  {
    id: 'ep2_sc4',
    episode: 2,
    sceneIndex: 4,
    location: 'mall',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'bisola', 'hauwa'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Inside the Palms atrium, Bisola was pacing nervously near a boutique, whispering frantically into her AirPods while Hauwa watched quietly.',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'scared',
        text: '“...I swear on my mother’s life, I didn’t leak the contract! If Zee drops me from the fashion week trip, I’m ruined!”',
      },
      {
        speaker: 'hauwa',
        speakerDisplayName: 'Hauwa Musa',
        expression: 'neutral',
        text: '“Bisola, lower your voice. Ada is standing right behind you.”',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'shocked',
        text: 'Bisola spun around, tucking her second phone into her designer handbag in obvious haste.',
      },
      {
        speaker: 'heroine',
        text: '“Second phone, Bisola? I thought you only used the pink iPhone 15 Pro for content.”',
      },
      {
        speaker: 'hauwa',
        speakerDisplayName: 'Hauwa Musa',
        expression: 'neutral',
        text: 'Hauwa took a sip of her water. “Everyone in this city carries a burner phone, Ada. Some for side hustles. Some for secrets.”',
      },
    ],
    choices: [
      {
        id: 'ep2_sc4_c1',
        text: '“What contract were you talking about, Bisola? Does Zee know?”',
        consequenceText: 'Bisola stammers and changes the subject in panic.',
        meterChanges: { suspicion: 15, loyalty: -5 },
        flagToSet: 'bisola_contract_pressed',
      },
      {
        id: 'ep2_sc4_c2',
        text: '“Hauwa, you’re always so calm. You seem to know before anyone else speaks.”',
        consequenceText: 'Hauwa’s serene gaze flickers for half a second.',
        meterChanges: { suspicion: 15, reputation: 10 },
        flagToSet: 'hauwa_calm_questioned',
      },
    ],
  },
  {
    id: 'ep2_sc5',
    episode: 2,
    sceneIndex: 5,
    location: 'rooftop_party',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'chidi', 'kelvin'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Evening fell over the rooftop lounge in Victoria Island. A summit between Chidi, Kelvin, and myself was inevitable.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'neutral',
        text: '“Nwosu, you’re out of your depth here. Someone paid five hundred thousand Naira cash to an admin clerk to pull Ada’s bursar records.”',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'angry',
        text: '“And your solution, Kelvin, is to buy her silence with dinner? She needs real proof, not your family’s charity.”',
      },
      {
        speaker: 'heroine',
        text: 'The two men squared off against the glowing neon skyline of Lagos, both looking at me for the verdict.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'flirty',
        text: '“I offer protection and resources, Ada. No one touches anyone under my wing.”',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'happy',
        text: '“And I offer the unvarnished truth. The raw metadata doesn’t lie.”',
      },
    ],
    choices: [
      {
        id: 'ep2_sc5_c1',
        text: 'Side with Chidi: “Truth matters more to me than your money, Kelvin.”',
        consequenceText: 'Chidi stands taller; Kelvin watches you with fierce respect.',
        meterChanges: { romanceChidi: 25, romanceKelvin: -5, loyalty: 15 },
        flagToSet: 'sided_with_chidi',
      },
      {
        id: 'ep2_sc5_c2',
        text: 'Side with Kelvin: “If someone paid cash to destroy me, I need Kelvin’s leverage.”',
        consequenceText: 'Kelvin smiles victoriously; Chidi’s jaw tightens.',
        meterChanges: { romanceKelvin: 25, romanceChidi: -5, popularity: 15 },
        flagToSet: 'sided_with_kelvin',
      },
    ],
  },
  {
    id: 'ep2_sc6',
    episode: 2,
    sceneIndex: 6,
    location: 'night_street',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'zee'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Midnight on the Lekki-Ikoyi link bridge. Zee’s white Maybach pulled up to the quiet sidewalk where I stood waiting.',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'neutral',
        text: 'Zee rolled down the window, wearing dark designer sunglasses even in the dead of night.',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'flirty',
        text: '“You held your nerve all weekend, Adaeze. Most girls from Ajegunle would have deactivated their accounts and cried in their rooms.”',
      },
      {
        speaker: 'heroine',
        text: '“I don’t run from cowards behind burner accounts, Zee.”',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'happy',
        text: '“Good. Because starting Monday, I am moving into the new Banana Island Content Villa. And I want you to be my live-in Personal Assistant.”',
      },
      {
        speaker: 'heroine',
        text: 'My breath caught. “Your personal assistant? In the influencer house?”',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'neutral',
        text: '“I pay your full remaining tuition fees, give you a private ensuite bedroom, and put you at the center of everything. Do we have a deal?”',
      },
      {
        speaker: 'narrator',
        text: 'Zee reached through the open window and pressed a heavy brass key into my palm.',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'flirty',
        text: '“That’s for my private office desk at the villa. Keep it on you at all times—you’ll need it to access my sponsor files and manage deliveries.”',
      },
    ],
    choices: [
      {
        id: 'ep2_sc6_c1',
        text: '“Deal, Zee. But don’t think for a second I won’t be watching every move in that house.”',
        consequenceText: 'You enter the belly of the beast to uncover the culprit.',
        meterChanges: { popularity: 20, suspicion: 15, reputation: 15 },
        flagToSet: 'accepted_pa_job',
      },
      {
        id: 'ep2_sc6_c2',
        text: '“Only if my contract guarantees my editorial independence.”',
        consequenceText: 'Zee smirks: “You drive a hard bargain, Ada. Done.”',
        meterChanges: { reputation: 25, popularity: 10, loyalty: 10 },
        flagToSet: 'negotiated_pa_terms',
      },
    ],
    twistMoment: {
      title: 'The Offer You Can’t Refuse',
      description: 'Zee Bello offers to pay Ada’s entire tuition in exchange for becoming her live-in assistant inside the Banana Island Content House. Moving in means living with the prime suspects.',
      type: 'clue',
    },
  },
];

/* =========================================================================
   SEASON 1, EPISODE 3 FALLBACK: "CONTENT HOUSE"
   ========================================================================= */
export const EPISODE_3_SCENES: SceneData[] = [
  {
    id: 'ep3_sc0',
    episode: 3,
    sceneIndex: 0,
    location: 'banana_island_mansion',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'zee'],
    lines: [
      {
        speaker: 'narrator',
        text: 'The Banana Island Content Villa was an architectural marvel of glass, neon ring lights, and unending sponsored merchandise.',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'happy',
        text: '“Here is your room, Ada. Master suite annex. High-speed fiber internet, private bathroom, and your official influencer house pass. And keep that brass desk key handy for sorting my sponsor files and brand deliveries.”',
      },
      {
        speaker: 'heroine',
        text: 'The tuition confirmation receipt was already cleared in my email inbox: zero balance. But nothing in Lagos is ever truly free.',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'neutral',
        text: '“Your job is simple: manage my calendar, vet my brand sponsors, and keep the girls in line when filming starts at noon.”',
      },
      {
        speaker: 'heroine',
        text: '“And @TheLagosTea? What happens if they post again?”',
      },
      {
        speaker: 'zee',
        speakerDisplayName: 'Zainab “Zee” Bello',
        expression: 'angry',
        text: '“Whoever is running that page is inside this house, Ada. Help me catch them, and I will make you a partner in my agency.”',
      },
    ],
    choices: [
      {
        id: 'ep3_sc0_c1',
        text: '“I’ll catch them, Zee. For both of our sakes.”',
        consequenceText: 'A high-stakes pact forged in the inner sanctum.',
        meterChanges: { loyalty: 15, popularity: 10 },
        flagToSet: 'pact_with_zee',
      },
      {
        id: 'ep3_sc0_c2',
        text: '“Just make sure your own hands are clean, Zee.”',
        consequenceText: 'Zee’s eyes flare with cold fire, but she smiles.',
        meterChanges: { reputation: 15, suspicion: 15 },
        flagToSet: 'warned_zee',
      },
    ],
  },
  {
    id: 'ep3_sc1',
    episode: 3,
    sceneIndex: 1,
    location: 'photoshoot_studio',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'tamara', 'bisola'],
    lines: [
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'happy',
        text: '“Ada! I can’t believe Zee actually hired you! We’re roommates in the content house!” Tamara squeezed me in a joyful embrace.',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'flirty',
        text: 'Bisola was adjusting her pink wig in front of the cyclorama ring light. “Ada babe, can you approve my caption for the beverage brand?”',
      },
      {
        speaker: 'heroine',
        text: 'I glanced over Bisola’s draft. Behind the sunny influencer tone was an anxious girl desperate not to lose her followers.',
      },
      {
        speaker: 'bisola',
        speakerDisplayName: 'Bisola Adeyemi',
        expression: 'scared',
        text: '“If my engagement drops below ten percent, my agency cancels my apartment lease in Lekki Phase 1. You don’t know the pressure, Ada.”',
      },
      {
        speaker: 'tamara',
        speakerDisplayName: 'Tamara Okonkwo-Reid',
        expression: 'neutral',
        text: '“We all have pressure, Bisola. But some of us don’t sell our friends out for views.”',
      },
    ],
    choices: [
      {
        id: 'ep3_sc1_c1',
        text: 'Help Bisola polish her caption with brilliant hooks.',
        consequenceText: 'Bisola hugs you in gratitude, opening up.',
        meterChanges: { loyalty: 15, popularity: 10 },
        flagToSet: 'helped_bisola',
      },
      {
        id: 'ep3_sc1_c2',
        text: 'Observe Bisola’s nervous ticks and note her financial vulnerability.',
        consequenceText: 'A potential motive for gossip blackmail noted.',
        meterChanges: { suspicion: 15, reputation: 10 },
        flagToSet: 'noted_bisola_motive',
      },
    ],
  },
  {
    id: 'ep3_sc2',
    episode: 3,
    sceneIndex: 2,
    location: 'beach_house',
    timeModifier: 'day',
    charactersOnStage: ['heroine', 'chidi'],
    lines: [
      {
        speaker: 'narrator',
        text: 'The crew moved to the Ilashe beach house for an afternoon luxury campaign shoot. Chidi was snapping rapid-fire portraits on the cabana deck.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'happy',
        text: '“Look who’s running the entire production. You wear authority well, Ada.”',
      },
      {
        speaker: 'heroine',
        text: 'I walked over to the wooden railing, the turquoise Atlantic waves crashing below.',
      },
      {
        speaker: 'heroine',
        text: '“It’s a golden cage, Chidi. Zee treats everyone like chess pieces.”',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'flirty',
        text: '“Then make sure you’re the queen, not the pawn.” He reached into his pocket and handed me a miniature thumb drive.',
      },
      {
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'neutral',
        text: '“I pulled the server logs and hosting records for @TheLagosTea’s backup website. The account was paid with a prepaid card registered in Victoria Island.”',
      },
    ],
    choices: [
      {
        id: 'ep3_sc2_c1',
        text: 'Take Chidi’s hand and thank him for risking his gig to help you.',
        consequenceText: 'An intimate, tender moment by the ocean waves.',
        meterChanges: { romanceChidi: 25, loyalty: 15 },
        flagToSet: 'chidi_romantic_moment',
      },
      {
        id: 'ep3_sc2_c2',
        text: 'Pocket the thumb drive instantly and ask who had access to that card.',
        consequenceText: 'Sharp detective work: Chidi admires your laser focus.',
        meterChanges: { suspicion: 20, reputation: 10 },
        flagToSet: 'chidi_intel_pocketed',
      },
    ],
  },
  {
    id: 'ep3_sc3',
    episode: 3,
    sceneIndex: 3,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'kelvin'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Back at the mansion after dark, the rest of the girls went out to a club, leaving the villa unusually quiet.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'happy',
        text: '“I knew you wouldn’t go to the club with them,” Kelvin’s voice murmured from the shadowy corridor.',
      },
      {
        speaker: 'heroine',
        text: 'He stood with a glass of scotch, leaning against the doorframe of the private study.',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'flirty',
        text: '“My sister thinks she bought you, Ada. But I see how you look at this house. You’re hunting, aren’t you?”',
      },
      {
        speaker: 'heroine',
        text: '“Maybe I just want to know who tried to humiliate me.”',
      },
      {
        speaker: 'kelvin',
        speakerDisplayName: 'Kelvin Adebayo-Wright',
        expression: 'neutral',
        text: '“Be careful where you dig, Adaeze. Some family closets have skeletons that don’t like being disturbed.”',
      },
    ],
    choices: [
      {
        id: 'ep3_sc3_c1',
        text: '“Are you warning me, Kelvin, or threatening me?”',
        consequenceText: 'Kelvin steps closer, his gaze intense: “I’m protecting you.”',
        meterChanges: { romanceKelvin: 25, suspicion: 10 },
        flagToSet: 'kelvin_confronted_warning',
      },
      {
        id: 'ep3_sc3_c2',
        text: '“If your family has skeletons, Kelvin, don’t leave the closet unlocked.”',
        consequenceText: 'Kelvin smirks appreciatively at your fearlessness.',
        meterChanges: { reputation: 20, romanceKelvin: 20 },
        flagToSet: 'challenged_kelvin_closet',
      },
    ],
  },
  {
    id: 'ep3_sc4',
    episode: 3,
    sceneIndex: 4,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine', 'chi', 'hauwa'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Late at night, I heard hushed voices coming from the pantry. Chioma and Hauwa were whispering in the dim light.',
      },
      {
        speaker: 'chi',
        speakerDisplayName: 'Chioma “Chi” Eze',
        expression: 'angry',
        text: '“...She cannot have the luxury campaign, Hauwa! If Zee signs that contract, she gets voting rights on the Lagos Influencer Guild board—she’ll control every major brand endorsement on the Island!”',
      },
      {
        speaker: 'hauwa',
        speakerDisplayName: 'Hauwa Musa',
        expression: 'neutral',
        text: '“Patience, Chi. Every empire overreaches before it falls. Watch your steps; the new girl has sharp eyes.”',
      },
      {
        speaker: 'heroine',
        text: 'The Influencer Board: the elite council that controlled brand allocations across West Africa. If Zee gained voting rights, Chioma’s agency leverage was finished.',
      },
      {
        speaker: 'heroine',
        text: 'I ducked behind the curved marble partition, holding my breath as Chioma stormed past toward her room.',
      },
      {
        speaker: 'narrator',
        text: 'Hauwa lingered by the espresso machine, looking directly in my direction as if she knew I was listening all along.',
      },
    ],
    choices: [
      {
        id: 'ep3_sc4_c1',
        text: 'Step out and casually ask Hauwa for a cup of tea.',
        consequenceText: 'Psychological sparring: Hauwa pours you tea with a slow smile.',
        meterChanges: { reputation: 15, suspicion: 10 },
        flagToSet: 'stepped_out_hauwa',
      },
      {
        id: 'ep3_sc4_c2',
        text: 'Retreat quietly back to your room with this critical new clue.',
        consequenceText: 'Undetected reconnaissance: You record the exchange.',
        meterChanges: { loyalty: 10, suspicion: 15 },
        flagToSet: 'retreated_silent_intel',
      },
    ],
  },
  {
    id: 'ep3_sc5',
    episode: 3,
    sceneIndex: 5,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine'],
    lines: [
      {
        speaker: 'narrator',
        text: 'At 2:00 AM, the mansion fell into absolute silence. Guided by Chidi’s thumb drive notes, I tiptoed toward the locked second-floor archive room.',
      },
      {
        speaker: 'heroine',
        text: 'The heavy brass key Zee gave me for her office desk turned in the old wooden lock with a faint click.',
        sfx: 'tap',
      },
      {
        speaker: 'narrator',
        text: 'Inside, surrounded by stacked shipping boxes and unopened influencer gifts, sat a private vanity table with a locked drawer.',
      },
      {
        speaker: 'heroine',
        text: 'I carefully pulled open the drawer. Inside lay an unbranded black smartphone, plugged into a portable battery pack.',
      },
      {
        speaker: 'narrator',
        text: 'Suddenly, the screen illuminated in the dark room with a buzzing vibration.',
        sfx: 'shock',
      },
      {
        speaker: 'heroine',
        text: 'The lock screen banner read: “Instagram: 142 new DMs to @TheLagosTea.”',
      },
    ],
    choices: [
      {
        id: 'ep3_sc5_c1',
        text: 'Inspect the phone screen carefully without touching it to see recent notifications.',
        consequenceText: 'Careful forensics: You note the lock screen preview message.',
        meterChanges: { suspicion: 25, reputation: 15 },
        flagToSet: 'inspected_burner_phone',
      },
      {
        id: 'ep3_sc5_c2',
        text: 'Photograph the phone and the room with your camera as indisputable proof.',
        consequenceText: 'Ironclad evidence: You save the photograph to your dossier.',
        meterChanges: { reputation: 25, loyalty: 15 },
        flagToSet: 'photographed_tea_phone',
      },
    ],
    twistMoment: {
      title: 'The Burner Phone Uncovered',
      description: 'Ada discovers the active burner phone logged into @TheLagosTea inside a locked room in the Banana Island mansion. Whoever is behind @TheLagosTea has access to the house.',
      type: 'revelation',
    },
  },
  {
    id: 'ep3_sc6',
    episode: 3,
    sceneIndex: 6,
    location: 'banana_island_mansion',
    timeModifier: 'night',
    charactersOnStage: ['heroine'],
    lines: [
      {
        speaker: 'narrator',
        text: 'Before I could read the next notification, the sound of soft footsteps halted right outside the archive door.',
      },
      {
        speaker: 'heroine',
        text: 'My blood ran cold. The brass doorknob began to turn slowly from the outside.',
        sfx: 'suspenseSting',
      },
      {
        speaker: 'narrator',
        text: 'Someone had noticed the light under the crack of the door. The shadow paused on the threshold.',
      },
      {
        speaker: 'heroine',
        text: 'I pressed myself against the heavy velvet curtain behind the vanity, heart pounding against my ribs.',
      },
      {
        speaker: 'narrator',
        text: 'The door creaked open into the dark room. Whoever it was, they were here to collect the phone.',
      },
      {
        speaker: 'heroine',
        text: 'End of Episode 3. The trap has snapped shut.',
      },
    ],
    choices: [
      {
        id: 'ep3_sc6_c1',
        text: 'Stay completely motionless behind the curtain and watch who steps in.',
        consequenceText: 'Heart-stopping stealth: The shadow enters.',
        meterChanges: { suspicion: 20, reputation: 10 },
        flagToSet: 'held_breath_stealth',
      },
      {
        id: 'ep3_sc6_c2',
        text: 'Step out boldly and confront whoever is holding the spare key.',
        consequenceText: 'Fierce confrontation: You refuse to be hunted.',
        meterChanges: { reputation: 25, popularity: 15 },
        flagToSet: 'confronted_intruder',
      },
    ],
  },
];

export const CANONICAL_STORY: SceneData[] = [
  ...EPISODE_1_SCENES,
  ...EPISODE_2_SCENES,
  ...EPISODE_3_SCENES,
];
