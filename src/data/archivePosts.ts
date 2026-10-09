/* =========================================================================
   OLDER POSTS ON PROFILES
   What each person posted before the story began. Every profile gets its
   own posts and its own comment section, in that person's voice.
   ========================================================================= */

export interface ArchiveComment {
  /** cast id or Gidigram user id (gidiUsers.ts) */
  by: string;
  text: string;
  likes: number;
}

export interface ArchiveSpec {
  headline: string;
  caption: string;
  gradient: string;
  badge: string;
  location: string;
  likes: number;
  comments: number;
  /** Emoji instead of the person, for object shots */
  emoji?: string;
  thread: ArchiveComment[];
}

export const ARCHIVE_POSTS: Record<string, ArchiveSpec[]> = {
  heroine: [
    {
      headline: 'Generator Hours',
      caption: 'Tiger gen humming, chemistry notes everywhere, Mama’s pepper soup on the stove. Exams don’t care about NEPA 📚🔌',
      gradient: 'from-amber-700 via-orange-900 to-neutral-950',
      badge: 'AJEGUNLE',
      location: 'Ajegunle, Lagos',
      likes: 84,
      comments: 11,
      emoji: '📚',
      thread: [
        { by: 'blessing_alabi', text: 'Mama’s pepper soup is the real exam prep 😭', likes: 6 },
        { by: 'amara_dike', text: 'First class loading 🙏', likes: 4 },
        { by: 'chuka_enemuo', text: 'This gen sound is my childhood', likes: 3 },
      ],
    },
    {
      headline: 'Scholarship Letter',
      caption: 'Seventy percent scholarship to Lekki Atlantic. Thirty percent faith. God, do the rest 🙏🏾',
      gradient: 'from-emerald-700 via-teal-900 to-neutral-950',
      badge: 'BLESSED',
      location: 'Lekki Atlantic University',
      likes: 212,
      comments: 37,
      emoji: '✉️',
      thread: [
        { by: 'tamara', text: 'I SCREAMED. My sister is going to Lekki 💚💚', likes: 41 },
        { by: 'grace_okeke', text: 'From our street to Lekki! Congrats Adaeze', likes: 12 },
        { by: 'kene_okoli', text: 'Proud of you. Remember us when you blow 😂', likes: 8 },
      ],
    },
    {
      headline: 'Tutoring Saturday',
      caption: 'Six SS3 students, one whiteboard, zero air conditioning. They all passed the mock 🥹✏️',
      gradient: 'from-sky-700 via-indigo-900 to-neutral-950',
      badge: 'TEACHER ERA',
      location: 'Surulere, Lagos',
      likes: 96,
      comments: 14,
      emoji: '✏️',
      thread: [
        { by: 'yemi_alabi', text: 'Aunty Ada! My son won’t stop talking about you', likes: 9 },
        { by: 'femi_ajayi', text: 'Underpaid and still delivering 👏', likes: 5 },
      ],
    },
    {
      headline: 'Bus Stop Glam',
      caption: 'Danfo to class but make it fashion. ₦300 lipstick, priceless attitude 💄🚌',
      gradient: 'from-yellow-600 via-amber-800 to-neutral-950',
      badge: 'MILE TWO',
      location: 'Mile 2, Lagos',
      likes: 143,
      comments: 22,
      thread: [
        { by: 'favoureze', text: 'The ₦300 lipstick is outperforming my Fenty 😩', likes: 14 },
        { by: 'tamara', text: 'Face card never declines 💚', likes: 30 },
        { by: 'sam_adeyemi', text: 'Danfo conductors stopped to look 😂', likes: 7 },
      ],
    },
  ],

  zee: [
    {
      headline: 'Guild Gala Seat',
      caption: 'They said the Influencer Guild board was a boys’ club. I said save me a chair. 👑 #GuildGala',
      gradient: 'from-yellow-600 via-amber-800 to-stone-950',
      badge: 'POWER MOVES',
      location: 'Eko Hotel, Victoria Island',
      likes: 88200,
      comments: 2100,
      thread: [
        { by: 'chi', text: 'A chair is not a vote, darling.', likes: 940 },
        { by: 'omowunmi_p', text: 'Zee on the board would change every brand budget in Lagos', likes: 410 },
        { by: 'zee', text: '@chi_corporate_glam Not yet 🙂', likes: 1200 },
      ],
    },
    {
      headline: 'Paris, First Row',
      caption: 'Front row in Paris. Back home, they still spell my name wrong on the invites 🙄🇫🇷',
      gradient: 'from-rose-700 via-purple-900 to-neutral-950',
      badge: 'PFW',
      location: 'Paris, France',
      likes: 102000,
      comments: 3300,
      thread: [
        { by: 'tamara', text: 'Next to me. As always 💚', likes: 820 },
        { by: 'miriam_chukwu', text: 'Zee in Paris and Bisola vlogging the outfit change in the toilet 😭', likes: 260 },
        { by: 'bisola', text: '@miriam_chukwu it was a PRIVATE vlog 😭', likes: 310 },
      ],
    },
    {
      headline: 'Brother Day',
      caption: 'He never posts, so I post him. Happy birthday to the most annoying man on Banana Island 🥃',
      gradient: 'from-slate-700 via-zinc-900 to-black',
      badge: 'FAMILY',
      location: 'Banana Island, Lagos',
      likes: 64100,
      comments: 980,
      thread: [
        { by: 'kelvin', text: 'Delete this.', likes: 2200 },
        { by: 'halima_bello', text: 'The Bello-Wright siblings in one post?? Rare', likes: 140 },
        { by: 'tari_briggs', text: 'Kelvin smiling? Photoshop.', likes: 330 },
      ],
    },
    {
      headline: 'Soft Life Sunday',
      caption: 'No calls. No brand decks. Just silk pyjamas and a pool that costs more than your car 🌴',
      gradient: 'from-teal-600 via-emerald-800 to-neutral-950',
      badge: 'SOFT LIFE',
      location: 'Banana Island, Lagos',
      likes: 71500,
      comments: 1600,
      thread: [
        { by: 'kola_fashola', text: '“More than your car” was personal 😭', likes: 510 },
        { by: 'favoureze', text: 'Zee’s captions are a lifestyle threat', likes: 220 },
      ],
    },
  ],

  tamara: [
    {
      headline: 'Compound Kids',
      caption: 'Same compound, same mango tree, same mischief. Some sisters you don’t choose, you climb fences with 💚',
      gradient: 'from-emerald-600 via-green-900 to-neutral-950',
      badge: 'THROWBACK',
      location: 'Ajegunle, Lagos',
      likes: 151000,
      comments: 4200,
      emoji: '🥭',
      thread: [
        { by: 'heroine', text: 'The mango tree remembers everything 😭', likes: 900 },
        { by: 'blessing_alabi', text: 'Tamara never forgot where she came from 🥹', likes: 340 },
        { by: 'demola_shonowo', text: 'Ajegunle to 2.5M followers. No be small thing', likes: 190 },
      ],
    },
    {
      headline: 'Offshore Money',
      caption: 'Daddy’s rig crew sent me this sunrise from the platform. Hard work smells like crude and sea salt 🌅⛽',
      gradient: 'from-orange-600 via-rose-800 to-neutral-950',
      badge: 'DADDY’S GIRL',
      location: 'Bonny Island',
      likes: 98000,
      comments: 1900,
      thread: [
        { by: 'chi', text: 'Lovely. How is the oil price treating everyone? 🙂', likes: 420 },
        { by: 'tamara', text: '@chi_corporate_glam better than your agency quotas 🙂', likes: 1100 },
        { by: 'anita_nwosu', text: 'Chioma and Tamara can never just like a post 😭', likes: 260 },
      ],
    },
    {
      headline: 'Studio Archive',
      caption: 'Pulled my favourite pieces from the Okonkwo-Reid archive. Every gown here has a story. Some have secrets 💚🗝️',
      gradient: 'from-teal-700 via-emerald-900 to-black',
      badge: 'ARCHIVE',
      location: 'Ikoyi, Lagos',
      likes: 120400,
      comments: 2600,
      thread: [
        { by: 'simi_solanke', text: 'The emerald one at the back 😍', likes: 280 },
        { by: 'bisola', text: 'Lend me ONE. Just one 😩', likes: 510 },
        { by: 'tamara', text: '@bisola_vlogs only for my sister 💚', likes: 690 },
      ],
    },
    {
      headline: 'Content Creator Burnout',
      caption: 'Three shoots, two flights, one tiny cry in the car. Then lipstick. Then smile. That’s the job 💄',
      gradient: 'from-pink-600 via-fuchsia-900 to-neutral-950',
      badge: 'REAL TALK',
      location: 'Lekki, Lagos',
      likes: 133000,
      comments: 5100,
      thread: [
        { by: 'hauwa', text: 'Rest is also part of the job 🌿', likes: 700 },
        { by: 'favoureze', text: 'The honesty 🥺', likes: 160 },
      ],
    },
  ],

  chi: [
    {
      headline: 'Moot Court Win',
      caption: 'Best Oralist, Inter-University Moot. Objection overruled, trophy sustained ⚖️🏆',
      gradient: 'from-slate-600 via-blue-900 to-neutral-950',
      badge: 'LAW SCHOOL',
      location: 'Lekki Atlantic University',
      likes: 41200,
      comments: 890,
      thread: [
        { by: 'kene_okoli', text: 'She destroyed the UNILAG team. It was brutal', likes: 210 },
        { by: 'zee', text: 'Congrats. Now win something that matters 🙂', likes: 480 },
        { by: 'chi', text: '@zeebello I intend to.', likes: 650 },
      ],
    },
    {
      headline: 'Agency Signing',
      caption: 'Signed with Apex Talent. Eight brands, one boardroom, zero apologies 💼',
      gradient: 'from-zinc-700 via-neutral-900 to-black',
      badge: 'BOSS',
      location: 'Victoria Island, Lagos',
      likes: 38900,
      comments: 740,
      thread: [
        { by: 'omowunmi_p', text: 'Apex is coming for the whole Guild 📈', likes: 190 },
        { by: 'bisola', text: 'Can Apex sign me too 😩', likes: 230 },
      ],
    },
    {
      headline: 'Daddy’s Robes',
      caption: 'Tried on Daddy’s SAN wig. Too big for now. Not forever ⚖️',
      gradient: 'from-stone-600 via-neutral-800 to-black',
      badge: 'LEGACY',
      location: 'Ikoyi, Lagos',
      likes: 52300,
      comments: 1200,
      emoji: '⚖️',
      thread: [
        { by: 'hauwa', text: 'It will fit. Patience 🌿', likes: 340 },
        { by: 'chinwe_agwu', text: 'Senior Advocate in training', likes: 120 },
      ],
    },
    {
      headline: 'Reading List',
      caption: 'Contracts, Torts and a romance novel I will deny owning 📚',
      gradient: 'from-amber-700 via-stone-900 to-black',
      badge: 'OFF DUTY',
      location: 'Ikoyi, Lagos',
      likes: 29800,
      comments: 650,
      emoji: '📚',
      thread: [
        { by: 'tamara', text: 'Which romance novel, Barrister? 👀', likes: 260 },
        { by: 'chi', text: '@tamara_reid Objection.', likes: 410 },
      ],
    },
  ],

  bisola: [
    {
      headline: '100K Special',
      caption: '100K FAMILY!!! 😭😭 From a cracked iPhone 7 to this!! Giveaway in my stories!! 🎉',
      gradient: 'from-pink-600 via-purple-800 to-neutral-950',
      badge: 'MILESTONE',
      location: 'Lekki Phase 1',
      likes: 87100,
      comments: 9300,
      thread: [
        { by: 'folake_ade', text: 'Been here since the iPhone 7 days!! 🥹', likes: 430 },
        { by: 'zee', text: 'Congrats. Blur faces next time.', likes: 900 },
        { by: 'bisola', text: '@zeebello NEVER 😭', likes: 1100 },
      ],
    },
    {
      headline: 'Lease Signed',
      caption: 'First apartment in Lekki Phase 1!!! Agency paid the lease so I literally cannot stop posting 😅🏠',
      gradient: 'from-fuchsia-600 via-rose-800 to-neutral-950',
      badge: 'NEW HOME',
      location: 'Lekki Phase 1',
      likes: 64000,
      comments: 3100,
      emoji: '🏠',
      thread: [
        { by: 'omowunmi_p', text: '“Cannot stop posting” is in the contract, sis 😂', likes: 320 },
        { by: 'hauwa', text: 'Congratulations. Make it a home, not a set 🌿', likes: 410 },
      ],
    },
    {
      headline: 'Ring Light Fail',
      caption: 'The ring light fell on me mid-live and I KEPT TALKING. Professionalism 😭💡',
      gradient: 'from-yellow-500 via-orange-700 to-neutral-950',
      badge: 'BLOOPER',
      location: 'Lekki Phase 1',
      likes: 92500,
      comments: 6800,
      thread: [
        { by: 'kola_fashola', text: 'Most Nigerian thing ever 😂', likes: 780 },
        { by: 'tamara', text: 'You owe me a new ring light btw 🙄💚', likes: 510 },
      ],
    },
    {
      headline: 'Engagement Report',
      caption: 'Engagement down 3% this week. Is it me or the algorithm?? Comment ANYTHING 😩📉',
      gradient: 'from-slate-600 via-indigo-900 to-neutral-950',
      badge: 'HELP',
      location: 'Lekki Phase 1',
      likes: 44100,
      comments: 12000,
      thread: [
        { by: 'demola_shonowo', text: 'Commenting to help 🙏', likes: 90 },
        { by: 'chi', text: 'It’s the all caps.', likes: 600 },
        { by: 'bisola', text: '@chi_corporate_glam THE CAPS ARE A BRAND', likes: 720 },
      ],
    },
  ],

  hauwa: [
    {
      headline: 'Fajr Light',
      caption: 'The city is loudest at noon and kindest at dawn. Matcha, prayer, silence 🌿',
      gradient: 'from-emerald-700 via-teal-900 to-neutral-950',
      badge: 'STILLNESS',
      location: 'Ikoyi, Lagos',
      likes: 33100,
      comments: 540,
      emoji: '🍵',
      thread: [
        { by: 'zainab_danladi', text: 'Your page is my morning peace 🤍', likes: 120 },
        { by: 'bisola', text: 'How are you awake at dawn 😭', likes: 210 },
      ],
    },
    {
      headline: 'Kano Indigo',
      caption: 'Visited the Kofar Mata dye pits with my grandmother. Five hundred years of patience in one colour 💙',
      gradient: 'from-indigo-700 via-blue-900 to-neutral-950',
      badge: 'HERITAGE',
      location: 'Kano',
      likes: 47800,
      comments: 1300,
      thread: [
        { by: 'chi', text: 'Beautiful, Hauwa.', likes: 290 },
        { by: 'halima_bello', text: 'Kano stand up 💙', likes: 140 },
      ],
    },
    {
      headline: 'Floor Plans',
      caption: 'Redesigning a client’s Ikoyi flat around one rule: every room needs a place to hide 🏛️',
      gradient: 'from-stone-600 via-zinc-800 to-black',
      badge: 'DESIGN',
      location: 'Ikoyi, Lagos',
      likes: 28400,
      comments: 410,
      emoji: '📐',
      thread: [
        { by: 'nnamdi_oraekwe', text: '“A place to hide” is such a Hauwa sentence', likes: 160 },
        { by: 'zee', text: 'Do my villa next.', likes: 380 },
        { by: 'hauwa', text: '@zeebello Your villa has enough hiding places 🙂', likes: 520 },
      ],
    },
    {
      headline: 'Jade',
      caption: 'Grandmother’s jade beads. She said they keep your hands honest 📿',
      gradient: 'from-green-600 via-emerald-900 to-black',
      badge: 'HEIRLOOM',
      location: 'Kano',
      likes: 39700,
      comments: 720,
      emoji: '📿',
      thread: [
        { by: 'favoureze', text: 'I need a bracelet that keeps my hands off my ex’s DMs 😭', likes: 330 },
        { by: 'tamara', text: 'Beautiful 💚', likes: 140 },
      ],
    },
  ],

  chidi: [
    {
      headline: 'Oshodi at 6AM',
      caption: 'Oshodi at 6 AM. Nobody here is performing. Everybody here is surviving 🎞️',
      gradient: 'from-orange-700 via-stone-900 to-black',
      badge: '35MM',
      location: 'Oshodi, Lagos',
      likes: 12300,
      comments: 310,
      thread: [
        { by: 'ngozi_uche', text: 'This should be in a gallery', likes: 90 },
        { by: 'kene_okoli', text: 'The okada guy looking straight into the lens 😳', likes: 45 },
      ],
    },
    {
      headline: 'First Darkroom',
      caption: 'Built a darkroom in my mum’s store room. She thinks I’m doing juju. I’m doing Tri-X 😂',
      gradient: 'from-red-800 via-rose-950 to-black',
      badge: 'DARKROOM',
      location: 'Yaba, Lagos',
      likes: 8900,
      comments: 260,
      emoji: '🎞️',
      thread: [
        { by: 'adaeze_nwosu', text: 'Your mum’s face when she sees red light 😭', likes: 120 },
        { by: 'chidi', text: '@adaeze_nwosu She prayed for me. Twice.', likes: 160 },
      ],
    },
    {
      headline: 'Rent Week',
      caption: 'Shooting three weddings this weekend so my landlord stops calling me “young artist” in that tone 😅',
      gradient: 'from-slate-600 via-neutral-900 to-black',
      badge: 'HUSTLE',
      location: 'Yaba, Lagos',
      likes: 10400,
      comments: 380,
      thread: [
        { by: 'femi_ajayi', text: 'Art doesn’t pay rent until it does 💪', likes: 70 },
        { by: 'kelvin', text: 'I could get you a real job.', likes: 140 },
        { by: 'chidi', text: '@kelvin_wright I have a real job.', likes: 260 },
      ],
    },
    {
      headline: 'Mama’s Hands',
      caption: 'My mother’s hands, shelling egusi. The most honest portrait I’ve ever taken 🤎',
      gradient: 'from-amber-700 via-orange-950 to-black',
      badge: 'FAMILY',
      location: 'Enugu',
      likes: 15600,
      comments: 540,
      emoji: '🤲🏾',
      thread: [
        { by: 'hauwa', text: 'This one stays with you 🤎', likes: 110 },
        { by: 'ngozi_uche', text: 'Crying at 2am because of a photo of egusi', likes: 85 },
      ],
    },
  ],

  kelvin: [
    {
      headline: 'Riva Season',
      caption: 'The lagoon doesn’t do traffic. 🌊',
      gradient: 'from-sky-700 via-blue-900 to-black',
      badge: 'LAGOON',
      location: 'Five Cowrie Creek',
      likes: 57100,
      comments: 1100,
      thread: [
        { by: 'daniel_okafor', text: 'The Riva Aquarama 😩 man is living', likes: 260 },
        { by: 'zee', text: 'Fill the tank next time.', likes: 900 },
      ],
    },
    {
      headline: 'London, Graduation',
      caption: 'LSE. Done. Back to Lagos, where the real lessons are 🎓',
      gradient: 'from-zinc-600 via-slate-900 to-black',
      badge: 'LSE',
      location: 'London',
      likes: 49300,
      comments: 880,
      thread: [
        { by: 'halima_bello', text: 'Wright Estates heir is home 👀', likes: 210 },
        { by: 'tari_briggs', text: 'What lessons? Polo? 😂', likes: 150 },
      ],
    },
    {
      headline: 'Board Meeting',
      caption: 'First board meeting at Wright Estates. Everybody smiled. Nobody meant it 🥃',
      gradient: 'from-stone-700 via-neutral-900 to-black',
      badge: 'BUSINESS',
      location: 'Ikoyi, Lagos',
      likes: 36700,
      comments: 640,
      thread: [
        { by: 'omowunmi_p', text: 'Real estate money is quiet money', likes: 140 },
        { by: 'chi', text: 'Every family business has a basement, Kelvin.', likes: 310 },
        { by: 'kelvin', text: '@chi_corporate_glam Some have two.', likes: 520 },
      ],
    },
    {
      headline: 'Polo Sunday',
      caption: 'Lost the match. Won the after-party 🐎',
      gradient: 'from-emerald-700 via-green-950 to-black',
      badge: 'POLO',
      location: 'Lagos Polo Club',
      likes: 42800,
      comments: 720,
      thread: [
        { by: 'miriam_chukwu', text: 'Kelvin at polo is a whole genre', likes: 190 },
        { by: 'zee', text: 'You fell off the horse.', likes: 1300 },
      ],
    },
  ],

  dayo: [
    {
      headline: 'Session at 3AM',
      caption: 'Some songs only come out after the city sleeps. New beat loading 🎧',
      gradient: 'from-purple-800 via-indigo-950 to-black',
      badge: 'STUDIO',
      location: 'Surulere, Lagos',
      likes: 23100,
      comments: 870,
      thread: [
        { by: 'simi_solanke', text: 'Drop it already Dayo 😩', likes: 120 },
        { by: 'bisola', text: 'Put me in the video 😭', likes: 260 },
      ],
    },
    {
      headline: 'Credits Matter',
      caption: 'If you used my beat, credit the producer. Simple. 🎛️',
      gradient: 'from-zinc-700 via-neutral-900 to-black',
      badge: 'RESPECT',
      location: 'Lagos',
      likes: 31800,
      comments: 1500,
      thread: [
        { by: 'demola_shonowo', text: 'Who stole from Dayo?? Names', likes: 210 },
        { by: 'dayo', text: '@demola_shonowo They know themselves.', likes: 340 },
      ],
    },
    {
      headline: 'Mum’s Piano',
      caption: 'Learned on this piano in church. Three keys don’t work. Still the best instrument I own 🎹',
      gradient: 'from-amber-800 via-stone-900 to-black',
      badge: 'ROOTS',
      location: 'Ibadan',
      likes: 19700,
      comments: 640,
      emoji: '🎹',
      thread: [
        { by: 'grace_okeke', text: 'Church boys always become the best producers', likes: 90 },
        { by: 'hauwa', text: 'Broken keys, honest music 🌿', likes: 110 },
      ],
    },
    {
      headline: 'Afrobeats Week',
      caption: 'Two placements on the Afrobeats chart this week. Mama, we dey studio 🙏🏾',
      gradient: 'from-green-700 via-emerald-950 to-black',
      badge: 'CHARTS',
      location: 'Lagos',
      likes: 38200,
      comments: 1900,
      thread: [
        { by: 'kelvin', text: 'Congrats, man.', likes: 170 },
        { by: 'tamara', text: 'Producer of the year loading 💚', likes: 220 },
      ],
    },
  ],

  lagos_tea: [
    {
      headline: 'Receipts Only',
      caption: 'I don’t do rumours. I do receipts. Welcome to The Lagos Tea 🫖',
      gradient: 'from-rose-700 via-red-900 to-black',
      badge: 'DAY ONE',
      location: 'Somewhere in Lagos',
      likes: 210000,
      comments: 18000,
      emoji: '🫖',
      thread: [
        { by: 'miriam_chukwu', text: 'Here before this page becomes a problem', likes: 2100 },
        { by: 'kene_okoli', text: 'Anonymous gossip pages and the NDPA. Name a more iconic legal case', likes: 900 },
      ],
    },
    {
      headline: 'The Fake Gucci',
      caption: 'A certain Lekki influencer’s “Gucci” bag has a stitch error the size of Third Mainland Bridge 🧵👀',
      gradient: 'from-amber-600 via-orange-900 to-black',
      badge: 'EXPOSED',
      location: 'Lekki, Lagos',
      likes: 340000,
      comments: 41000,
      emoji: '👜',
      thread: [
        { by: 'favoureze', text: 'Everybody knows who this is 😭', likes: 3400 },
        { by: 'bisola', text: 'It’s NOT me for the record!!', likes: 5100 },
        { by: 'folake_ade', text: 'Nobody said it was you Bisola 👀', likes: 4200 },
      ],
    },
    {
      headline: 'Agency Wars',
      caption: 'Two talent agencies, one Guild seat, and a WhatsApp group that should NEVER have been screenshotted 📱🔥',
      gradient: 'from-zinc-700 via-neutral-900 to-black',
      badge: 'RECEIPTS',
      location: 'Victoria Island',
      likes: 280000,
      comments: 26000,
      emoji: '📱',
      thread: [
        { by: 'chi', text: 'This is defamation.', likes: 6100 },
        { by: 'omowunmi_p', text: 'Defamation only if it’s false, Chioma 👀', likes: 4400 },
      ],
    },
    {
      headline: 'Who Is Next',
      caption: 'Every queen has a secret. I collect them. Who’s next? 🫖👑',
      gradient: 'from-purple-800 via-fuchsia-950 to-black',
      badge: 'COMING SOON',
      location: 'Banana Island',
      likes: 390000,
      comments: 52000,
      emoji: '👑',
      thread: [
        { by: 'zee', text: 'Try me.', likes: 9800 },
        { by: 'miriam_chukwu', text: 'Zee replying to Lagos Tea is the plot twist 😳', likes: 3200 },
      ],
    },
  ],
};
