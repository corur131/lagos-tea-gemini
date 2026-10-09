import { DialogueLine, Expression, RelationshipDeltas, CharacterId } from '../types/vn';

export interface ChoiceReaction {
  lines: DialogueLine[];
  rel?: RelationshipDeltas;
}

const L = (speaker: CharacterId, expression: Expression, text: string): DialogueLine => ({
  speaker,
  expression,
  text,
});
const N = (text: string): DialogueLine => ({ speaker: 'narrator', text });

// What happens right after each choice, before the story moves on, and how it
// changes how the other characters feel about Ada.
export const CHOICE_REACTIONS: Record<string, ChoiceReaction> = {
  /* ---------------------------- Episode 1 ---------------------------- */
  ep1_sc0_c1: {
    lines: [N('₦34,200. I stared at the number until it stopped looking like money and started looking like a dare.')],
  },
  ep1_sc0_c2: {
    lines: [N('I typed and deleted the first line six times. “Dear Bursar” never sounded so much like begging. I hit send anyway.')],
  },
  ep1_sc0_c3: {
    lines: [N('I closed the laptop gently, like I was putting a sleeping child to bed. Panic could wait. My dignity could not.')],
  },
  ep1_sc1_c1: {
    lines: [
      L('tamara', 'happy', '“Adaeze, I didn’t ask you to pay for anything! Your only job tonight is to show up and be fine.”'),
      L('tamara', 'neutral', '“Fees, shmees. We’ll figure it out. Even God rested on the seventh day.”'),
    ],
    rel: { tamara: 4 },
  },
  ep1_sc1_c2: {
    lines: [
      L('tamara', 'happy', '“Chewed up? Babe, you grew up in Ajegunle. Zee’s crowd are the ones who should be nervous.”'),
      L('tamara', 'flirty', '“Stay near me, and the only thing anyone will chew is the jollof.”'),
    ],
    rel: { tamara: 2 },
  },
  ep1_sc1_c3: {
    lines: [
      L('tamara', 'flirty', '“Me? Drag you into drama? I’m offended. I only drag you into *fabulous* drama.”'),
      L('tamara', 'happy', '“Now go and find something that doesn’t say ‘semester two’ on it.”'),
    ],
    rel: { tamara: 3 },
  },
  ep1_sc2_c1: {
    lines: [
      L('tamara', 'happy', '“YES! I knew it. Zip me up, darling, and don’t you dare breathe near the hem.”'),
      N('The emerald silk slid over my shoulders as if it had been stitched on me in Paris. For one second, I forgot the portal alert.'),
    ],
    rel: { tamara: 4 },
  },
  ep1_sc2_c2: {
    lines: [
      L('tamara', 'shocked', '“Avant-garde minimalism? Ada, that dress has been to more funerals than weddings.”'),
      L('tamara', 'happy', '“…but fine, say it with your whole chest. I respect the confidence.”'),
    ],
    rel: { tamara: 1, zee: -1 },
  },
  ep1_sc2_c3: {
    lines: [
      L('tamara', 'happy', '“Ten minutes ago you said no. Now look at you. Turn around. Let me see the back.”'),
      N('I caught my reflection in the wardrobe mirror and hated how much I liked her.'),
    ],
    rel: { tamara: 3 },
  },
  ep1_sc3_c1: {
    lines: [
      L('zee', 'happy', '“Aww. Tamara, she’s polished. Where did you find her?”'),
      L('zee', 'flirty', '“Come, Adaeze. Photo with the birthday girl, and make sure you’re on my good side.”'),
    ],
    rel: { zee: 5 },
  },
  ep1_sc3_c2: {
    lines: [
      L('chi', 'suspicious', '“Hm. Sharp tongue for someone without a seat at the table.”'),
      L('bisola', 'happy', '“OOOOH. Ada said what she said! I’m posting this. Kidding. Maybe.”'),
    ],
    rel: { chi: -3, bisola: 3, zee: 2 },
  },
  ep1_sc3_c3: {
    lines: [
      L('hauwa', 'happy', '“Stand here with me. Cameras find the loud ones first. The quiet ones see everything.”'),
      L('tamara', 'neutral', '“Fine. Hide with the aunties if you want. But you’re dancing with me later.”'),
    ],
    rel: { hauwa: 5, tamara: 1 },
  },
  ep1_sc4_c1: {
    lines: [
      L('chidi', 'happy', '“Most of them. Half the guests are rehearsing laughs they don’t feel.”'),
      L('chidi', 'flirty', '“You’re the first person tonight who asked a real question. Don’t stop.”'),
    ],
    rel: { chidi: 4 },
  },
  ep1_sc4_c2: {
    lines: [
      L('chidi', 'shocked', '“…Nobody’s asked me that in a long time.”'),
      L('chidi', 'flirty', '“Nobody. Maybe you should.” He lifted the camera, then lowered it, almost shy.'),
    ],
    rel: { chidi: 7 },
  },
  ep1_sc4_c3: {
    lines: [
      L('chidi', 'happy', '“Incognito, understood. Though you’re terrible at it. You glow like a landing light.”'),
      L('chidi', 'neutral', '“I won’t shoot you. Unless you ask.”'),
    ],
    rel: { chidi: 5 },
  },
  ep1_sc5_c1: {
    lines: [
      L('kelvin', 'happy', '“Touché. I like a girl who knows where the edge is and stands on it anyway.”'),
      L('chidi', 'angry', '“Nobody’s falling in tonight. Kelvin, give her space.”'),
    ],
    rel: { kelvin: 6, chidi: -3 },
  },
  ep1_sc5_c2: {
    lines: [
      L('kelvin', 'neutral', '“A weekend pastime? Never. Pastimes are boring. You are not.”'),
      L('kelvin', 'flirty', '“Consider me warned, and officially interested.”'),
    ],
    rel: { kelvin: 4, tamara: 2 },
  },
  ep1_sc5_c3: {
    lines: [
      N('The champagne was cold, the silence louder than the party behind the glass doors.'),
      L('kelvin', 'flirty', '“Most people look away first. You’re going to be trouble.”'),
    ],
    rel: { kelvin: 6, chidi: -4 },
  },
  ep1_sc6_c1: {
    lines: [
      L('zee', 'angry', '“How dare you accuse my guests in my house? On my birthday?”'),
      L('tamara', 'shocked', '“Ada, babe, breathe. Nobody here would…” She trailed off, eyes darting to the others.'),
    ],
    rel: { zee: -6, tamara: 1, chi: -2, hauwa: 1 },
  },
  ep1_sc6_c2: {
    lines: [
      N('Kelvin set his glass down on the tray of a passing waiter and stepped between me and the stares, unhurried.'),
      L('kelvin', 'neutral', '“Eyes on the cake, everybody. Ada’s leaving with me.”'),
    ],
    rel: { kelvin: 6, chidi: -3 },
  },
  ep1_sc6_c3: {
    lines: [
      L('chidi', 'neutral', '“Every frame is time-stamped. If someone shot from upstairs, I’ll know by morning.”'),
      L('chidi', 'angry', '“Whoever did this is going to regret it.”'),
    ],
    rel: { chidi: 7, kelvin: -2 },
  },

  /* ---------------------------- Episode 2 ---------------------------- */
  ep2_sc0_c1: {
    lines: [N('I kept my chin high, my steps even. A few phones lowered. One girl whispered, “She’s not even bothered.” I almost laughed.')],
    rel: { hauwa: 2 },
  },
  ep2_sc0_c2: {
    lines: [N('The comments were a swamp of jokes and rumours, but one burner account kept repeating a detail only someone at the party would know.')],
  },
  ep2_sc1_c1: {
    lines: [
      L('chi', 'neutral', '“…Fine. Ada’s right. I won’t give whoever it is the satisfaction.”'),
      L('tamara', 'sad', '“I’m sorry, Chioma. I’m just scared.”'),
    ],
    rel: { chi: 3, tamara: 3 },
  },
  ep2_sc1_c2: {
    lines: [
      L('chi', 'angry', '“You want my camera roll? On what grounds, Ada? Are you my prosecutor now?”'),
      L('chi', 'suspicious', '“Fine. Look. But I’ll remember this.” She turned her phone toward me, jaw tight, thumb hovering over a folder she didn’t open.'),
      L('tamara', 'shocked', '“Why did she hesitate?”'),
    ],
    rel: { chi: -7, tamara: 1 },
  },
  ep2_sc2_c1: {
    lines: [
      L('chidi', 'happy', '“Hey. Don’t say that like it’s a small thing.” He held my gaze a beat too long.'),
      L('chidi', 'flirty', '“You’d be surprised how little it takes to be decent. You’re just good at it.”'),
    ],
    rel: { chidi: 7 },
  },
  ep2_sc2_c2: {
    lines: [
      L('chidi', 'happy', '“Already on it, Detective Ada.” He dragged the file into a terminal window and hit enter.'),
      L('chidi', 'neutral', '“Give me twenty minutes. Whoever uploaded it stripped the data, but they’re not as clever as they think.”'),
    ],
    rel: { chidi: 4 },
  },
  ep2_sc3_c1: {
    lines: [
      N('The Porsche’s leather smelled of money and mint. Kelvin pulled away from the curb before I finished buckling.'),
      L('kelvin', 'happy', '“Brave. Most people ask three questions first.”'),
    ],
    rel: { kelvin: 6, chidi: -3 },
  },
  ep2_sc3_c2: {
    lines: [
      L('kelvin', 'flirty', '“Your own battles. Of course.” He grinned, unbothered, and killed the engine.'),
      L('kelvin', 'neutral', '“The offer stands, Ada. It always will.”'),
    ],
    rel: { kelvin: 3, chidi: 2 },
  },
  ep2_sc4_c1: {
    lines: [
      L('bisola', 'scared', '“It’s nothing! A brand thing. A sponsor thing. Please don’t tell Zee.”'),
      L('hauwa', 'neutral', '“She’s lying badly. Ada, you should ask her again when nobody’s listening.”'),
    ],
    rel: { bisola: -5, hauwa: 3 },
  },
  ep2_sc4_c2: {
    lines: [
      L('hauwa', 'neutral', '“Calm isn’t the same as knowing, Ada.” Her smile held a second too long.'),
      L('bisola', 'suspicious', '“Honestly, same. She always knows before anyone speaks. It’s creepy.”'),
    ],
    rel: { hauwa: -4, bisola: 2 },
  },
  ep2_sc5_c1: {
    lines: [
      L('chidi', 'happy', '“Thank you.” He said it quietly, like a man who had been braced for a different answer.'),
      L('kelvin', 'angry', '“Truth won’t pay for her tuition, Nwosu. But sure. Have your moment.”'),
    ],
    rel: { chidi: 6, kelvin: -5 },
  },
  ep2_sc5_c2: {
    lines: [
      L('kelvin', 'happy', '“Smart girl. Leverage is a language, and you speak it.”'),
      L('chidi', 'sad', '“…Right. I hope the leverage is worth it.” He looked away first.'),
    ],
    rel: { kelvin: 6, chidi: -6 },
  },
  ep2_sc6_c1: {
    lines: [
      L('zee', 'happy', '“Watch me? Good. I prefer an audience.”'),
      L('zee', 'neutral', '“Pack tonight. The car comes at nine on Monday. Don’t be late, Adaeze.”'),
    ],
    rel: { zee: 4 },
  },
  ep2_sc6_c2: {
    lines: [
      L('zee', 'flirty', '“Editorial independence. From my own PA.” She laughed, genuinely. “Fine. My lawyer will hate this.”'),
      L('zee', 'neutral', '“You drive a hard bargain. I like that. Mostly.”'),
    ],
    rel: { zee: 6, chi: 2 },
  },

  /* ---------------------------- Episode 3 ---------------------------- */
  ep3_sc0_c1: {
    lines: [
      L('zee', 'happy', '“For both of our sakes. I like how that sounds.”'),
      L('zee', 'neutral', '“Start with the girls. Nobody in this house is as innocent as they look.”'),
    ],
    rel: { zee: 5 },
  },
  ep3_sc0_c2: {
    lines: [
      L('zee', 'angry', '“Careful, Adaeze.” Her smile never moved. Her eyes did.'),
      L('zee', 'neutral', '“My hands have never been cleaner. Don’t make me prove it.”'),
    ],
    rel: { zee: -4, chi: 1 },
  },
  ep3_sc1_c1: {
    lines: [
      L('bisola', 'happy', '“OMG, that hook is EVERYTHING. Ada, you’re a genius, I owe you my life.”'),
      L('tamara', 'happy', '“Look at you, saving lives and engagement rates.”'),
    ],
    rel: { bisola: 7, tamara: 2 },
  },
  ep3_sc1_c2: {
    lines: [
      N('Bisola’s thumbnail kept going to her lease reminder. A desperate girl does desperate things, I thought. I filed it away.'),
      L('bisola', 'suspicious', '“Why are you looking at me like that?”'),
    ],
    rel: { bisola: -4 },
  },
  ep3_sc2_c1: {
    lines: [
      N('The waves hid whatever either of us would have said. His hand was warm, ink-stained and steady.'),
      L('chidi', 'flirty', '“You’d do the same for me. That’s why I did it.”'),
    ],
    rel: { chidi: 8 },
  },
  ep3_sc2_c2: {
    lines: [
      L('chidi', 'neutral', '“Straight to business. That’s the Ada I know.” He half-smiled.'),
      L('chidi', 'neutral', '“A prepaid card, a VI address, and someone who knew the house schedule. That’s your list.”'),
    ],
    rel: { chidi: 3 },
  },
  ep3_sc3_c1: {
    lines: [
      L('kelvin', 'neutral', '“Protecting. Always protecting.” He stepped close enough that I could smell the scotch.'),
      L('kelvin', 'flirty', '“Some warnings sound like threats because the truth is scarier.”'),
    ],
    rel: { kelvin: 5 },
  },
  ep3_sc3_c2: {
    lines: [
      L('kelvin', 'happy', '“Ha! Adaeze Obi, telling a Bello to lock his own closet.”'),
      L('kelvin', 'flirty', '“You’re the first person who’s made me want to open it.”'),
    ],
    rel: { kelvin: 6, zee: -2 },
  },
  ep3_sc4_c1: {
    lines: [
      L('hauwa', 'neutral', '“Tea? Of course. Sit.” She poured with the calm of someone who had been waiting.'),
      L('hauwa', 'suspicious', '“You heard more than you should have. I’d rather you ask me than guess.”'),
    ],
    rel: { hauwa: 3, chi: -2 },
  },
  ep3_sc4_c2: {
    lines: [
      N('I slipped back to my room and pressed record on my phone, replaying every word I had caught.'),
      N('Somewhere downstairs, a cup was put down very quietly.'),
    ],
    rel: { hauwa: -2, chi: -1 },
  },
  ep3_sc5_c1: {
    lines: [
      N('I didn’t touch it. Over the glass, a preview: “She’s in the house. Delete the archive photos before Friday.”'),
      N('My own name was not on the message. Which somehow made it worse.'),
    ],
  },
  ep3_sc5_c2: {
    lines: [
      N('The flash filled the dark room for half a second. If anyone was watching the corridor, they would have seen it.'),
      N('The photo came out grainy but clear: the phone, the vanity, the key in the lock.'),
    ],
    rel: { zee: -2 },
  },
  ep3_sc6_c1: {
    lines: [
      N('I held my breath. A shadow slid across the floor, tall and unhurried, stopping just short of the vanity.'),
    ],
  },
  ep3_sc6_c2: {
    lines: [
      L('heroine', 'angry', '“Whoever you are, I have a photo of that phone and a recording of everything you said last night.”'),
      N('The figure froze in the doorway. For the first time, someone in that house was afraid of me.'),
    ],
    rel: { zee: -2, chi: -2 },
  },
};
