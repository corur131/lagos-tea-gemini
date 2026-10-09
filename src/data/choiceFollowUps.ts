import { CharacterId, DialogueLine, Expression, SceneData, ChoiceOption } from '../types/vn';

/* =========================================================================
   CHOICE FOLLOW-THROUGH
   Every choice plays its own short beat right after it is picked, in the
   same location, so the story visibly responds before moving on.
   Choices that already jump to a dedicated branch scene (nextSceneId to a
   scene written for that choice) do not need an entry here.
   ========================================================================= */

const N = (text: string): DialogueLine => ({ speaker: 'narrator', text });
const H = (text: string, expression?: Expression): DialogueLine => ({ speaker: 'heroine', text, expression });
const C = (speaker: CharacterId, expression: Expression, text: string): DialogueLine => ({ speaker, expression, text });

export const CHOICE_FOLLOW_UPS: Record<string, DialogueLine[]> = {
  /* ---------------- EPISODE 1 ---------------- */
  // Scene 0: tuition notice
  ep1_sc0_c1: [
    H('I opened the banking app with my thumb half over the screen, like that could soften the number.'),
    N('Available balance: ₦34,200. Not even three percent of what the school wanted.'),
    H('I screenshotted it anyway. If I was going to fight this, I needed to know exactly how broke I was.', 'sad'),
  ],
  ep1_sc0_c2: [
    H('“Dear Sir, I respectfully request a two-week extension…” I deleted “respectfully” twice, then typed it back.'),
    N('The email swooshed out to bursary@lau.edu.ng at 3:47 PM. Somewhere in that office, it would sit under a pile of other girls’ begging.'),
    H('Pride is expensive. Expulsion is more expensive.', 'neutral'),
  ],
  ep1_sc0_c3: [
    H('I shut the laptop, pressed my palms flat on the plastic table and breathed until my hands stopped shaking.'),
    N('Outside, a danfo conductor shouted “Ajegunle! Mile Two!” and life went on like nothing was ending.'),
    H('Forty-eight hours. People have built whole businesses in less. I’ll find a way.', 'neutral'),
  ],

  // Scene 1: Tamara's invitation
  ep1_sc1_c1: [
    C('tamara', 'shocked', '“One point two million? Ada! Why didn’t you tell me last month?”'),
    H('“Because you would have tried to pay it, and I’m not your charity case.”'),
    C('tamara', 'happy', '“Fine. Then come tonight and let the rich people pay you in contacts. The Dean will be there. Smile at him.”'),
    N('Tamara said it lightly, but she looked at me a beat too long. Now she knew exactly how desperate I was.'),
  ],
  ep1_sc1_c2: [
    C('tamara', 'happy', '“Chew you up? Babe, you survived Mile Two market at 6 AM. Zee’s friends are just Mile Two with better wigs.”'),
    H('I laughed before I could stop myself.'),
    C('tamara', 'flirty', '“Stay close to me. Anyone who tries you will have to come through me first.”'),
  ],
  ep1_sc1_c3: [
    C('tamara', 'flirty', '“Drama? Me? I’m a peaceful oil heiress.”'),
    H('“You started a fight at a christening last year.”'),
    C('tamara', 'happy', '“The DJ played Davido after I specifically said Wizkid. That was justice.” She tossed the invitation on my bed. “Seven o’clock. Wear lashes.”'),
  ],

  // Scene 2: the dress
  ep1_sc2_c1: [
    N('The emerald silk slid over my shoulders like cool water. For a moment, the girl in my cracked mirror looked like someone I didn’t know.'),
    C('tamara', 'happy', '“Ehen! Now you look like a girl who has a driver.”'),
    H('“As long as nobody asks where the driver is.”', 'flirty'),
    N('Tamara snapped a photo of me for her close-friends story. Just one. It would not stay private for long.'),
  ],
  ep1_sc2_c2: [
    H('I pulled out the black shift dress I bought for ₦4,500 at Yaba market and held it up like it came from a runway.'),
    C('tamara', 'shocked', '“Ada… that’s thrifted.”'),
    H('“It’s curated. Avant-garde minimalism. Very Phoebe Philo.”'),
    C('tamara', 'happy', '“You know what? With your face, they’ll believe it. Don’t blink when they ask.”'),
  ],
  ep1_sc2_c3: [
    H('“No. Absolutely not. I’ll look like an imposter.”'),
    C('tamara', 'sad', 'Tamara dropped to her knees on my concrete floor, hands clasped. “Ada, I am begging you in the name of Lagos traffic.”'),
    N('Ten minutes and one dramatic fake-cry later, I was zipped into the emerald gown with my guard still fully up.'),
    C('tamara', 'happy', '“Thank you! Now smile like you’re not plotting my death.”'),
  ],

  // Scene 3: the girls at the party
  ep1_sc3_c1: [
    C('zee', 'happy', '“Finally, someone with manners.” Zee air-kissed both my cheeks without touching them.'),
    C('zee', 'neutral', '“Tamara said you were smart. She didn’t say you were polished. Enjoy the night, Adaeze.”'),
    N('Chioma’s smile tightened. Being liked by Zee in that circle was a gift and a target at the same time.'),
  ],
  ep1_sc3_c2: [
    C('chi', 'shocked', 'Chioma’s glass froze halfway to her lips. Bisola let out a tiny “ehn-ehn” behind her camera.'),
    C('chi', 'suspicious', '“Careful, Ada. In this room, a sharp tongue gets noticed. Not always by the right people.”'),
    C('bisola', 'happy', '“Wait, I didn’t get that on camera! Say it again!”'),
    H('“No repeats. Live content only.”', 'flirty'),
  ],
  ep1_sc3_c3: [
    C('hauwa', 'happy', 'Hauwa made space for me beside her without a word, like she had been expecting me.'),
    C('hauwa', 'neutral', '“Watch them for a minute,” she murmured. “Everyone here is performing for someone. The trick is figuring out who.”'),
    N('From the edge of the circle I noticed things: Bisola filming everything, Chioma texting under the table, Zee checking the staircase twice.'),
  ],

  // Scene 4: meeting Chidi
  ep1_sc4_c1: [
    C('chidi', 'happy', '“Staged? The cake has a lighting plan. The cake.”'),
    C('chidi', 'flirty', '“But you’re the first person tonight who hasn’t checked which side of their face I’m shooting. Most of them. But not you.”'),
    H('I didn’t know what to do with that, so I drank my water like it was champagne.'),
  ],
  ep1_sc4_c2: [
    C('chidi', 'shocked', 'He actually paused. Nobody had asked him that before, I could tell.'),
    C('chidi', 'flirty', '“Nobody. Photographers are ghosts. We see everything and nobody sees us.”'),
    H('“Well, I see you.”', 'flirty'),
    C('chidi', 'happy', 'He looked down at his camera to hide his smile. “That’s dangerous, Ada.”'),
  ],
  ep1_sc4_c3: [
    C('chidi', 'happy', 'He lowered the lens immediately. “Incognito. Copy that.”'),
    C('chidi', 'neutral', '“For the record, you’re not in any of my shots tonight. If anyone has a photo of you, it didn’t come from this camera.”'),
    N('At the time, it sounded like a joke. Later, I would remember that he said it before anything happened.'),
  ],

  // Scene 5: Kelvin arrives
  ep1_sc5_c1: [
    C('kelvin', 'happy', 'Kelvin laughed, a real one, head tipped back. “Touché.”'),
    C('kelvin', 'flirty', '“I grew up in the deep end, Adaeze. I’d rather drown next to someone interesting.”'),
    C('chidi', 'neutral', 'Chidi lifted his camera and pretended to adjust the settings. He wasn’t adjusting anything.'),
  ],
  ep1_sc5_c2: [
    C('kelvin', 'neutral', 'He raised his glass, unbothered. “Noted. Tamara’s friend. Not a pastime.”'),
    C('kelvin', 'flirty', '“I like a challenge. Most people here say yes before I finish the question.”'),
    H('“Then ask better questions.”'),
    N('Behind him, Chidi coughed into his fist. It sounded a lot like a laugh.'),
  ],
  ep1_sc5_c3: [
    N('I took the flute from Kelvin’s hand and held his gaze. Neither of us blinked.'),
    C('kelvin', 'flirty', '“There it is,” he said quietly. “The dangerous look.”'),
    C('chidi', 'sad', 'Chidi turned back to the lagoon and took a photo of nothing in particular.'),
  ],

  // Scene 6: the leak (episode finale)
  ep1_sc6_c1: [
    H('“Who sent my address to that page?” My voice cut through the music. “Somebody in this room knows where I live. Say it to my face.”', 'angry'),
    C('zee', 'angry', '“Lower your voice in my house, Adaeze.”'),
    C('chi', 'suspicious', '“Don’t look at me. I don’t even know where Ajegunle is.”'),
    C('bisola', 'scared', 'Bisola quietly stopped recording. Tamara held my arm tighter. Nobody answered. That was its own answer.'),
  ],
  ep1_sc6_c2: [
    N('I found Kelvin’s eyes across the room and held them. I didn’t cry. I didn’t run.'),
    C('kelvin', 'neutral', 'He crossed the marble floor in four long steps and put himself between me and sixty phone cameras.'),
    C('kelvin', 'angry', '“Show’s over. Anyone who posts her face tonight answers to me.” Phones went down one by one.'),
    C('kelvin', 'flirty', 'At the door he handed his car key to his driver. “Take her home. Wherever she says. No questions.”'),
  ],
  ep1_sc6_c3: [
    H('“Chidi. Your camera. You were shooting the whole night. Did you catch who took that angle?”'),
    C('chidi', 'neutral', 'He was already scrolling. Frame after frame flicked across the little screen: the cake, the pool, the staircase.'),
    C('chidi', 'suspicious', '“There. 11:14 PM. Wide shot of the entrance.” He zoomed in. “Look at the angle of the leaked photo. It’s the same view, but from higher up. Second floor. The mezzanine.”'),
    C('chidi', 'neutral', '“I’ll pull the raw files tonight and go through every frame of that balcony. Come to the studio on Monday. Don’t tell anyone here.”'),
    N('He slipped the memory card into his sock. Across the room, someone on the mezzanine stepped back from the railing.'),
  ],

  /* ---------------- EPISODE 2 ---------------- */
  ep2_sc0_c1: [
    N('I kept my chin up and my steps even, past the palm trees, past the whispers, past the girl who pointed her phone at me.'),
    H('By the time I reached the Faculty of Media, the whispers had changed. “She’s not even shaking.” “Shey she no dey shame?”'),
    N('A first-year girl caught my eye and gave me a tiny nod. Respect, quietly.'),
  ],
  ep2_sc0_c2: [
    N('I sat on the steps and scrolled through 2,000 comments. Most were just noise: laughing emojis, “who is she,” “Ajegunle to the world.”'),
    H('Then one stopped me. @silent_observer_x: “Ask her about the 11:15 dress change upstairs 👀”', 'suspicious'),
    N('The account was two days old, had no posts, and knew a time nobody outside that party could know.'),
  ],

  ep2_sc1_c1: [
    H('“Stop. Both of you. This is exactly what @TheLagosTea wants: us tearing each other apart in public.”'),
    C('tamara', 'sad', 'Tamara exhaled and lowered her finger. “…Fine. But I’m watching her.”'),
    C('chi', 'neutral', 'Chioma smoothed her blazer. “For once, the scholarship girl is right.” It was almost a thank you.'),
  ],
  // ep2_sc1_c2 → dedicated scene (Chioma’s gallery)
  ep2_sc1_cg_c1: [
    H('I handed the phone back. “You didn’t take it, Chioma. Whoever did was on that mezzanine.”'),
    C('chi', 'shocked', 'For a second she looked almost relieved, then she rebuilt her face. “Obviously.”'),
    C('tamara', 'neutral', 'Tamara muttered an apology that sounded like a cough. I was already walking toward the photography studio.'),
  ],
  ep2_sc1_cg_c2: [
    H('“The photo isn’t yours. But that WhatsApp message? ‘If Zee loses the Guild seat, her brand quota is ours.’ You want her ruined.”', 'suspicious'),
    C('chi', 'angry', 'Chioma went very still. “That’s business, Ada. Read it again and you’ll see I never said I’d do anything.”'),
    C('chi', 'suspicious', '“Repeat it to anyone, and I’ll make sure your scholarship committee hears about every rule you broke this week.”'),
    N('She walked off fast. Tamara looked at me with wide eyes. “What message?”'),
  ],

  ep2_sc2_c1: [
    C('chidi', 'happy', 'Chidi went quiet, then smiled at his keyboard instead of me.'),
    C('chidi', 'flirty', '“You make it easy. You’re the only person this week who’s asked me what I think instead of what I saw.”'),
    N('Our hands touched when he passed me the malt. Neither of us moved away immediately.'),
  ],
  ep2_sc2_c2: [
    C('chidi', 'happy', '“Already on it, Detective Ada.” He dragged the file into a program full of grey text.'),
    C('chidi', 'suspicious', '“Whoever uploaded it stripped most of the data. But they missed one thing: the editing app left a device name. ‘iPhone (2)’.”'),
    H('“A second phone.” I thought of every girl in that circle. Any of them could have a second phone.', 'suspicious'),
  ],

  // ep2_sc3_c1 → dedicated scene (Kelvin’s ride)
  ep2_sc3_c2: [
    H('“I fight my own battles, Kelvin. If you know something, tell me here, on the pavement.”'),
    C('kelvin', 'flirty', 'He smirked, slid on his sunglasses, and revved the engine once. “Then I’ll see you at the Palms. You’ll want to hear this before Friday.”'),
    N('The Porsche roared off. Three students had filmed the whole thing. By evening the caption read: “Ada said NO to a Porsche 😭.”'),
  ],
  ep2_sc3_kr_c1: [
    H('“Thanks for the ride and the intel, Kelvin. I’ll remember this.”'),
    C('kelvin', 'flirty', '“I always make sure people remember, Ada.” He held the door open for me like it was a red carpet.'),
    N('A flash went off somewhere near the valet stand. Someone had photographed me stepping out of Kelvin Adebayo-Wright’s car.'),
  ],
  ep2_sc3_kr_c2: [
    H('“Five hundred thousand in cash, the morning of your sister’s party? That sounds like someone in your family’s circle, Kelvin.”', 'suspicious'),
    C('kelvin', 'neutral', 'His hand tightened on the steering wheel for just a second. Then he laughed.'),
    C('kelvin', 'flirty', '“Good. Suspect everyone. Including me. That’s the only way you survive this city.”'),
  ],

  ep2_sc4_c1: [
    H('“What contract, Bisola? Does Zee know?”'),
    C('bisola', 'scared', '“Contract? Which contract? I said contact. My contact. Hair contact. For wigs.” She was sweating through her foundation.'),
    C('hauwa', 'neutral', 'Hauwa put a calm hand on Bisola’s back. “Breathe. Ada isn’t the enemy.” But her eyes stayed on me.'),
  ],
  ep2_sc4_c2: [
    H('“Hauwa, you’re always so calm. It’s like you know things before anyone else says them.”'),
    C('hauwa', 'suspicious', 'For half a second her face changed. Then the soft smile came back like a curtain.'),
    C('hauwa', 'neutral', '“I just listen, Ada. Most people talk too much to hear anything.”'),
    C('bisola', 'shocked', 'Bisola looked from Hauwa to me, confused, and quietly slipped her second phone deeper into her bag.'),
  ],

  ep2_sc5_c1: [
    H('“Truth matters more to me than your money, Kelvin.”'),
    C('chidi', 'happy', 'Chidi didn’t smile in triumph. He just nodded, like I had passed a test he didn’t know he was giving.'),
    C('kelvin', 'neutral', 'Kelvin finished his drink. “Fair. When the truth runs out of road, you know where my car is parked.”'),
    N('He left a ₦50,000 tip on the table and didn’t look back. Chidi exhaled for the first time all night.'),
  ],
  ep2_sc5_c2: [
    H('“Someone paid cash to destroy me, Chidi. Metadata won’t stop money. I need Kelvin’s leverage.”'),
    C('kelvin', 'happy', 'Kelvin slid his card across the table to me. “My private line. Day or night.”'),
    C('chidi', 'sad', 'Chidi packed up his laptop slowly. “I hope his leverage doesn’t come with a price you can’t see yet, Ada.”'),
    N('The rooftop felt colder after he left.'),
  ],

  ep2_sc6_c1: [
    H('“Deal, Zee. But I’ll be watching every move in that house.”'),
    C('zee', 'happy', '“Good. Watch everyone. Report to me.” She smiled like I had agreed to her plan, not mine.'),
    N('The Maybach pulled away. In my palm, the brass key was still warm from her hand.'),
  ],
  ep2_sc6_c2: [
    H('“Only if my contract guarantees I can post what I want. No editing my captions, no deleting my posts.”'),
    C('zee', 'shocked', 'Zee pushed her sunglasses down her nose and actually looked at me.'),
    C('zee', 'happy', '“You drive a hard bargain, Ada. Done. My lawyer will hate you.”'),
    N('For the first time, I had something from Zee Bello in writing.'),
  ],

  /* ---------------- EPISODE 3 ---------------- */
  ep3_sc0_c1: [
    H('“I’ll catch them, Zee. For both of our sakes.”'),
    C('zee', 'happy', 'She squeezed my shoulder. “Partner. I like how that sounds.”'),
    N('On her way out, she glanced at the girls’ rooms down the hall. Like she was already counting suspects.'),
  ],
  ep3_sc0_c2: [
    H('“Just make sure your own hands are clean, Zee.”'),
    C('zee', 'angry', 'The temperature dropped. Zee stepped close enough for me to smell her perfume.'),
    C('zee', 'neutral', '“My hands are manicured, Ada. Clean is for people who can’t afford good nails.” She smiled and walked out.'),
  ],

  ep3_sc1_c1: [
    H('“Start with the problem, not the product. ‘I almost cancelled today’s shoot because of the heat…’ then the drink saves you.”'),
    C('bisola', 'happy', 'Bisola typed it, posted it, and watched the likes climb. She hugged me so hard her ring light wobbled.'),
    C('bisola', 'neutral', '“Thank you, Ada. Seriously. Nobody in this house helps anybody for free.”'),
    C('tamara', 'neutral', 'Tamara raised one eyebrow at me. “You’re too nice. It will cost you.”'),
  ],
  ep3_sc1_c2: [
    N('I approved the caption without changing a word and watched her instead. Chewed nails. Two phones. Rent fear.'),
    H('A girl that scared of losing her apartment might do anything for money. Even sell secrets.', 'suspicious'),
    C('bisola', 'neutral', '“…Ada? You’ve been staring at me for like a full minute.”'),
    H('“Your highlighter is very good today.” She believed me. Mostly.'),
  ],

  ep3_sc2_c1: [
    N('I took Chidi’s hand. His palm was warm and a little rough from camera straps.'),
    H('“You’re risking this gig for me. Thank you.”', 'happy'),
    C('chidi', 'flirty', '“Some things are worth more than a day rate.” He didn’t let go first.'),
    N('Down the deck, Bisola lowered her phone. She had been filming the ocean. Probably.'),
  ],
  ep3_sc2_c2: [
    N('I pocketed the drive before anyone on set could see it.'),
    H('“Who had access to that card? A prepaid card still has to be bought by someone with a face.”', 'suspicious'),
    C('chidi', 'neutral', '“It was bought at a pharmacy in VI. Their CCTV keeps footage for thirty days. We have eleven left.”'),
    C('chidi', 'happy', '“Laser focus. I like it.”'),
  ],

  ep3_sc3_c1: [
    H('“Are you warning me, Kelvin, or threatening me?”'),
    C('kelvin', 'neutral', 'He stepped closer, close enough that I could see the tiredness under the charm. “I’m protecting you. Those are different things in my family.”'),
    C('kelvin', 'flirty', '“Lock your door tonight, Ada.” Then he was gone, leaving only the smell of scotch.'),
  ],
  ep3_sc3_c2: [
    H('“If your family has skeletons, Kelvin, don’t leave the closet unlocked.”'),
    C('kelvin', 'happy', 'He laughed under his breath. “Fearless. My sister didn’t buy you at all, did she?”'),
    C('kelvin', 'neutral', '“The study is unlocked till midnight. I didn’t tell you that.” He walked away, whistling.'),
  ],

  // ep3_sc4_c1 → dedicated scene (tea with Hauwa)
  ep3_sc4_c2: [
    N('I backed away step by step, phone held low. The voice recorder had caught every word.'),
    H('In my room, I played it back twice. “Every empire overreaches before it falls.” Hauwa wasn’t talking about fashion.', 'suspicious'),
    N('A shadow passed under my door. Then nothing. Nobody knocked.'),
  ],
  ep3_sc4_ht_c1: [
    H('“Thank you for the tea, Hauwa. And the warning.”'),
    C('hauwa', 'happy', 'She lifted her cup slightly, like a toast between two people who understood each other.'),
    C('hauwa', 'neutral', '“Sleep lightly, Ada.”'),
  ],
  ep3_sc4_ht_c2: [
    H('“Duplicate keys? Sounds like you already know which doors are being opened.”', 'suspicious'),
    C('hauwa', 'neutral', 'Hauwa rinsed her cup slowly. “A good observer notices every lock, Ada. A careless one gets locked in.”'),
    N('She left the kitchen without another word. The tea in my cup had gone cold.'),
  ],

  ep3_sc5_c1: [
    N('I leaned in close without touching anything. Notification after notification lit the screen.'),
    H('“New DM: ‘Is it true about Zee’s Guild vote?’” “New DM: ‘Post the beach house video 👀’”', 'shocked'),
    N('Under the notifications, one draft post waited, scheduled for 6 AM. I could only see the first word of the caption: “AJEGUNLE…”'),
  ],
  ep3_sc5_c2: [
    N('I lifted my phone, turned off the flash, and took six photos: the drawer, the phone, the charger, the room.'),
    H('Click. The shutter sound. I had forgotten to mute it.', 'scared'),
    N('In the silence of the house, it sounded like a gunshot.'),
  ],

  ep3_sc6_c1: [
    N('I held my breath. The door swung open and a figure stepped in, their face hidden by a hood and the darkness.'),
    N('A gloved hand opened the drawer, took the phone, and paused. As if they could feel someone else in the room.'),
    H('Then the figure left, and the lock clicked from the outside. They had locked me in.', 'scared'),
    N('End of Episode 3.'),
  ],
  ep3_sc6_c2: [
    H('I pulled the curtain open. “Looking for this?”', 'angry'),
    N('The figure froze. Then the whole house went black. NEPA had taken the light, at the worst possible moment.'),
    N('Footsteps ran. Something hit the floor. When the generator kicked in, the room was empty and the drawer was open.'),
    H('The phone was gone. But on the carpet lay a single earring.', 'shocked'),
    N('End of Episode 3.'),
  ],
};

/* =========================================================================
   CALLBACK LINES
   Later scenes remember what you chose earlier. Each line only appears if
   its flag was set. `at` = insert before that original line index.
   ========================================================================= */
interface Callback {
  at: number;
  line: DialogueLine;
}

export const SCENE_CALLBACKS: Record<string, Callback[]> = {
  ep1_sc6: [
    { at: 6, line: { speaker: 'heroine', expression: 'shocked', ifFlag: 'confided_fees', text: 'I had told exactly one person about the ₦1.2 million today. My eyes went to Tamara before I could stop them.' } },
    { at: 6, line: { speaker: 'heroine', ifFlag: 'borrowed_emerald_dress', text: 'Borrowed dress. Only Tamara, her driver and I knew that this dress wasn’t mine.' } },
  ],
  ep2_sc0: [
    { at: 1, line: { speaker: 'heroine', ifFlag: 'kelvin_shield_exit', text: 'Kelvin’s driver had dropped me home at 3 AM and asked no questions, just like his boss promised.' } },
    { at: 3, line: { speaker: 'heroine', ifFlag: 'demanded_leak_answers', text: 'Somebody had posted a video of me shouting at Zee’s party. Fine. I said what I said.' } },
    { at: 4, line: { speaker: 'heroine', ifFlag: 'chidi_archive_alliance', text: 'Chidi had texted at 2 AM: “Went through every frame. Studio, whenever you’re ready.”' } },
  ],
  ep2_sc1: [
    { at: 4, line: { speaker: 'chi', expression: 'angry', ifFlag: 'checked_chioma', text: '“Of course she’ll take your side. She’s been sharpening her tongue on me since Friday.”' } },
  ],
  ep2_sc2: [
    { at: 2, line: { speaker: 'chidi', expression: 'neutral', ifFlag: 'chidi_archive_alliance', text: '“You asked me to check my archives at the party. I didn’t sleep. Here’s what I found.”' } },
    { at: 4, line: { speaker: 'heroine', ifFlag: 'cleared_chioma_camera', text: '“Chioma’s gallery puts her downstairs at the bar at 11:15. She didn’t take it.”' } },
    { at: 6, line: { speaker: 'chidi', expression: 'suspicious', ifFlag: 'cleared_chioma_camera', text: '“Her alibi covers the photo, Ada. Not who sent it to the page.”' } },
    { at: 6, line: { speaker: 'heroine', ifFlag: 'investigated_comments', text: 'I showed him the burner comment about the 11:15 dress change. He went very quiet.' } },
  ],
  ep2_sc3: [
    { at: 2, line: { speaker: 'kelvin', expression: 'flirty', ifFlag: 'challenged_kelvin', text: '“You told me not to stand near the deep end. So I brought a car instead.”' } },
    { at: 2, line: { speaker: 'kelvin', expression: 'happy', ifFlag: 'kept_kelvin_at_bay', text: '“I know, I know. Tamara’s friend, not anyone’s pastime. It’s lunch, Ada, not a proposal.”' } },
  ],
  ep2_sc5: [
    { at: 3, line: { speaker: 'chidi', expression: 'sad', ifFlag: 'drove_with_kelvin', text: '“I saw you get into his Porsche this afternoon, Ada. Half the campus did.”' } },
    { at: 3, line: { speaker: 'kelvin', expression: 'neutral', ifFlag: 'refused_kelvin_ride', text: '“She turned down my car today, Nwosu. She doesn’t need rescuing. She needs leverage.”' } },
  ],
  ep2_sc6: [
    { at: 3, line: { speaker: 'zee', expression: 'happy', ifFlag: 'charmed_zee', text: '“And you were the only girl at my party who said happy birthday like she meant it.”' } },
    { at: 3, line: { speaker: 'zee', expression: 'neutral', ifFlag: 'demanded_leak_answers', text: '“You also shouted at my guests on my birthday. I still haven’t decided if I’m angry or impressed.”' } },
  ],
  ep3_sc0: [
    { at: 3, line: { speaker: 'zee', expression: 'neutral', ifFlag: 'negotiated_pa_terms', text: '“Your editorial independence clause is on page four. My lawyer called you ‘difficult.’ I took it as a compliment.”' } },
  ],
  ep3_sc1: [
    { at: 1, line: { speaker: 'tamara', expression: 'happy', ifFlag: 'peacemaker_ada', text: '“Chioma even said good morning to me today. Whatever you said at the coffee lounge worked.”' } },
    { at: 2, line: { speaker: 'bisola', expression: 'scared', ifFlag: 'bisola_contract_pressed', text: '“And Ada… what you heard at the Palms stays at the Palms, abeg.”' } },
  ],
  ep3_sc2: [
    { at: 2, line: { speaker: 'chidi', expression: 'happy', ifFlag: 'sided_with_chidi', text: '“After what you said on that rooftop… I’ve been working on this all week.”' } },
    { at: 2, line: { speaker: 'chidi', expression: 'neutral', ifFlag: 'sided_with_kelvin', text: '“Honestly, after the rooftop I didn’t think you’d still want my help. I did it anyway.”' } },
    { at: 6, line: { speaker: 'chidi', expression: 'suspicious', ifFlag: 'chidi_exif_search', text: '“And remember ‘iPhone (2)’ from the metadata? The same device name logged into this site.”' } },
  ],
  ep3_sc3: [
    { at: 5, line: { speaker: 'kelvin', expression: 'neutral', ifFlag: 'suspected_kelvin_family', text: '“In my car you said the cash smelled like my family’s circle. I haven’t stopped thinking about that.”' } },
  ],
  ep3_sc4: [
    { at: 5, line: { speaker: 'heroine', ifFlag: 'hauwa_calm_questioned', text: 'At the Palms I told Hauwa she always seemed to know things first. She hadn’t forgotten.' } },
    { at: 5, line: { speaker: 'heroine', ifFlag: 'spotted_chioma_whatsapp', text: 'The Guild seat. The same thing from the agency message on Chioma’s phone.' } },
  ],
  ep3_sc5: [
    { at: 1, line: { speaker: 'heroine', ifFlag: 'retreated_silent_intel', text: 'The pantry recording sat in my phone like a live grenade. Whatever Hauwa and Chioma were planning, it started tonight.' } },
    { at: 2, line: { speaker: 'heroine', ifFlag: 'hauwa_tea_alliance', text: 'Hauwa’s warning echoed in my head: in this house, doors have duplicate keys.' } },
    { at: 2, line: { speaker: 'heroine', ifFlag: 'pressed_hauwa_keys', text: 'Hauwa’s words came back to me: a careless observer gets locked in.' } },
  ],
  ep3_sc6: [
    { at: 1, line: { speaker: 'heroine', expression: 'scared', ifFlag: 'photographed_tea_phone', text: 'Had they heard my camera shutter? Of course they had.' } },
  ],
};

/* =========================================================================
   HELPERS
   ========================================================================= */

export const FOLLOW_UP_SEPARATOR = '__after__';

export function getFollowUpLines(choice: ChoiceOption): DialogueLine[] | undefined {
  const lines = choice.followUp ?? CHOICE_FOLLOW_UPS[choice.id];
  return lines && lines.length > 0 ? lines : undefined;
}

export function followUpSceneId(sceneId: string, choiceId: string): string {
  return `${sceneId}${FOLLOW_UP_SEPARATOR}${choiceId}`;
}

/** Builds the short follow-up scene for a choice: same place, same people, the speakers in front. */
export function buildFollowUpScene(parent: SceneData, choice: ChoiceOption): SceneData | undefined {
  const lines = getFollowUpLines(choice);
  if (!lines) return undefined;

  const speakers = lines
    .map((l) => l.speaker)
    .filter((s): s is CharacterId => s !== 'heroine' && s !== 'narrator' && typeof s === 'string');
  const ordered = Array.from(new Set<CharacterId>([...speakers, ...parent.charactersOnStage.filter((c) => c !== 'heroine')]));

  return {
    id: followUpSceneId(parent.id, choice.id),
    episode: parent.episode,
    sceneIndex: parent.sceneIndex,
    location: parent.location,
    timeModifier: parent.timeModifier,
    charactersOnStage: ['heroine', ...ordered],
    musicMood: choice.musicMood ?? parent.musicMood,
    lines,
    choices: [],
    afterChoice: { sceneId: parent.id, choiceId: choice.id },
  };
}

/** Finds a follow-up scene by its id, e.g. "ep1_sc6__after__ep1_sc6_c3" (used after a reload). */
export function findFollowUpScene(sceneId: string, story: SceneData[]): SceneData | undefined {
  const sep = sceneId.indexOf(FOLLOW_UP_SEPARATOR);
  if (sep < 0) return undefined;
  const parentId = sceneId.slice(0, sep);
  const choiceId = sceneId.slice(sep + FOLLOW_UP_SEPARATOR.length);
  const parent = story.find((s) => s.id === parentId);
  const choice = parent?.choices.find((c) => c.id === choiceId);
  return parent && choice ? buildFollowUpScene(parent, choice) : undefined;
}

/** Inserts flag-gated callback lines and drops lines whose flag conditions are not met. */
export function applyFlagLines(scene: SceneData, flags: Record<string, boolean>): SceneData {
  const callbacks = SCENE_CALLBACKS[scene.id] || [];
  const hasConditional = callbacks.length > 0 || scene.lines.some((l) => l.ifFlag || l.ifNotFlag);
  if (!hasConditional) return scene;

  const merged: DialogueLine[] = [];
  scene.lines.forEach((line, i) => {
    callbacks.filter((c) => c.at === i).forEach((c) => merged.push(c.line));
    merged.push(line);
  });
  callbacks.filter((c) => c.at >= scene.lines.length).forEach((c) => merged.push(c.line));

  const lines = merged.filter(
    (l) => (!l.ifFlag || flags[l.ifFlag]) && (!l.ifNotFlag || !flags[l.ifNotFlag])
  );
  return { ...scene, lines: lines.length > 0 ? lines : scene.lines };
}
