import { CharacterId, Meters } from '../types/vn';
import type { CommentChoice } from './commentChoices';

/* =========================================================================
   ADA'S COMMENTS ON THE NEWER STORY POSTS (storyPosts.ts)
   Five options per post, written for that post and that moment in the
   story. Some swap depending on what Ada chose in the episode.
   ========================================================================= */

type Cast = Exclude<CharacterId, 'heroine' | 'narrator'>;

const c = (
  id: string,
  label: string,
  text: string,
  fx: { m?: Partial<Meters>; t?: Partial<Record<Cast, number>>; mem?: Partial<Record<Cast, string>> },
  replies: Array<[string, string]>,
  cond: { if?: string; ifNot?: string } = {}
): CommentChoice => ({
  id,
  label,
  text,
  meters: fx.m,
  trust: fx.t,
  memory: fx.mem,
  replies: replies.map(([by, text]) => ({ by, text })),
  ifFlag: cond.if,
  ifNotFlag: cond.ifNot,
});

export const STORY_POST_COMMENTS: Record<string, CommentChoice[]> = {
  /* ---------------------------- Episode 2 ---------------------------- */
  post_tamara_defends_ep2: [
    c('thanks', 'Thank her 💚', 'You’ve been fighting for me since the mango tree. Thank you, sis 💚', { m: { loyalty: 4 }, t: { tamara: 6 }, mem: { tamara: 'You thanked her publicly for defending you after the leak.' } }, [['tamara', 'Always. ALWAYS 💚'], ['blessing_alabi', 'Crying in Ajegunle 🥹']]),
    c('strong', 'Stand on your own 💪', 'Thank you, Tamara. But I can fight my own battles. Watch me 💪', { m: { reputation: 5, popularity: 2 }, t: { tamara: 1 } }, [['tamara', 'That’s my girl 💚'], ['kola_fashola', 'Main character energy']]),
    c('anita', 'Answer Anita 🙂', '@anita_nwosu I told Tamara about my fees when we were 15. Some secrets are safe with real friends 🙂', { m: { reputation: 3 }, t: { tamara: 3 } }, [['anita_nwosu', 'Fair. Sorry 🙏'], ['tamara', '💚']]),
    c('who_knew', 'Wonder who else knew 🔎', 'Funny thing is, only a few people ever knew the exact amount. I’m counting them 🔎', { m: { suspicion: 6 }, t: { tamara: -2 } }, [['tamara', 'Count me as the one who never told 💚'], ['nnamdi_oraekwe', 'She’s making a list 😳']]),
    c('quiet', 'Just a heart 💚', '💚', { m: { popularity: 1 } }, [['tamara', '💚💚💚']]),
  ],
  post_hauwa_silence_ep2: [
    c('noticed', 'Agree 🌿', 'The loudest person in the room is rarely the most dangerous one 🌿', { m: { reputation: 3 }, t: { hauwa: 4 } }, [['hauwa', 'You learn fast.']]),
    c('who', 'Ask who 🔎', 'Who did you notice typing, Hauwa? 👀', { m: { suspicion: 5 }, t: { hauwa: 1 } }, [['hauwa', 'Everyone. That’s the problem.'], ['nnamdi_oraekwe', 'THE ANSWER 😭']]),
    c('chi', 'Tease Chi 😂', '@chi_corporate_glam nobody said your name, Barrister. You came here by yourself 😂', { m: { popularity: 4, jealousy: 2 }, t: { chi: -4, hauwa: 1 }, mem: { chi: 'You laughed at her on Hauwa’s post.' } }, [['chi', 'Noted.'], ['kene_okoli', 'ADA 😭']]),
    c('defend_chi', 'Defend Chi ⚖️', 'Working late isn’t a crime. Let’s not turn every typist into a suspect ⚖️', { m: { reputation: 3 }, t: { chi: 4 } }, [['chi', 'Thank you, Ada.']]),
    c('quiet', 'Stay quiet 🤐', '🤐', { m: { reputation: 1 } }, [['hauwa', 'Exactly 🌿']]),
  ],
  post_dayo_cinderella_ep2: [
    c('hit', 'Own it 🎧', 'They called me Cinderella. You made it a hit. I’m keeping the title 👑🎧', { m: { romanceDayo: 6, popularity: 4 }, t: { dayo: 5 }, mem: { dayo: 'You claimed his “Ajegunle Cinderella” beat as your anthem.' } }, [['dayo', 'Then the song is yours. Officially.'], ['simi_solanke', 'THE COLLAB 😭']]),
    c('credit', 'Ask for credit 😏', 'If it charts, I want a writing credit. My pain, my royalties 😏', { m: { romanceDayo: 4, popularity: 3 }, t: { dayo: 3 } }, [['dayo', 'Credit the muse. Noted 🙂']]),
    c('not_funny', 'Not funny 😐', 'My debt isn’t a song. Please take it down.', { m: { reputation: 3, romanceDayo: -4 }, t: { dayo: -4 }, mem: { dayo: 'You asked him to take down the Cinderella beat.' } }, [['dayo', 'You’re right. I’ll change the title. Sorry, Ada.'], ['grace_okeke', 'Respect to both of them for that']]),
    c('kelvin', 'Ask about Kelvin 🔎', 'Why did Kelvin call the title “interesting”? You two have history? 👀', { m: { suspicion: 4 }, t: { kelvin: -1, dayo: -1 } }, [['kelvin', 'We do.'], ['dayo', 'Long story.']]),
    c('vibe', 'Vibe 🔥', 'The bass on this is illegal 🔥', { m: { romanceDayo: 2 } }, [['dayo', 'Wait till you hear it loud.']]),
  ],
  post_chi_statement_ep2: [
    c('believe', 'Believe her ⚖️', 'For what it’s worth, I believe you, Chioma.', { m: { reputation: 3 }, t: { chi: 6 }, mem: { chi: 'You publicly said you believed her statement.' } }, [['chi', 'That’s worth more than you think.'], ['omowunmi_p', 'Ada said it with her chest']]),
    c('lawyers', 'Wave at lawyers 👋', 'Hi Chioma’s lawyers 👋 I’m the girl whose address leaked. Call me 🙂', { m: { popularity: 4, reputation: 2 }, t: { chi: 2 } }, [['chi', 'They will.'], ['kene_okoli', 'THE CROSSOVER 😭']]),
    c('doubt', 'Doubt it 🙂', 'Statements are easy. Phones on the table are harder 🙂', { m: { suspicion: 5, jealousy: 2 }, t: { chi: -5 }, mem: { chi: 'You mocked her statement in public.' } }, [['chi', 'Name the table and I’ll be there.']]),
    c('cleared', 'Remember the camera 📸', 'I checked her camera roll myself. It was clean. Leave her alone 📸', { m: { reputation: 4 }, t: { chi: 6 } }, [['chi', 'Thank you.'], ['omowunmi_p', 'Wait, Ada checked her phone?? 😳']], { if: 'cleared_chioma_camera' }),
    c('blessed', 'Blessed evening 🙏', 'Have a blessed evening too 🙏', { m: { reputation: 1 } }, [['chi', '🙂']]),
  ],

  post_bisola_deleted: [
    c('who', 'Ask who 🐍', 'Names, Bisola. Before you delete this 🐍', { m: { suspicion: 6, popularity: 2 }, t: { bisola: -1 } }, [['bisola', 'I CAN’T 😭'], ['nnamdi_oraekwe', 'She’s going to delete it 😳']]),
    c('support', 'Support her 🤍', 'Whatever happened, call me. Not the comments 🤍', { m: { loyalty: 5 }, t: { bisola: 5 }, mem: { bisola: 'You told her to call you instead of posting about snakes.' } }, [['bisola', 'Calling you 🥺']]),
    c('careful', 'Warn her ⚠️', 'Delete this before it becomes a Lagos Tea post of its own ⚠️', { m: { reputation: 3 }, t: { bisola: 3 } }, [['bisola', 'You’re right. Deleting 😭']]),
    c('snake', 'Joke 😂', 'Lekki snakes now wear lace fronts 😂', { m: { popularity: 4 }, t: { bisola: 1 } }, [['kola_fashola', 'And Fenty highlighter 😂']]),
    c('screenshot', 'Screenshot it 📸', '📸 saved', { m: { suspicion: 5 }, t: { bisola: -3 } }, [['bisola', 'ADA WHY 😭'], ['solomon_ekong', 'Ada collects receipts now 👀']]),
  ],

  /* ---------------------------- Episode 3 ---------------------------- */
  post_tamara_movein_ep3: [
    c('neighbours', 'Neighbour vibes 🏡', 'From one compound to one hallway. Ajegunle girls don’t separate 🏡💚', { m: { loyalty: 4 }, t: { tamara: 4 } }, [['tamara', 'NEVER 💚'], ['demola_shonowo', 'Ajegunle on Banana Island 😭']]),
    c('zee', 'Laugh at the wardrobe 😂', '@zeebello two rooms?? She brought the Okonkwo-Reid archive 😂', { m: { popularity: 3 }, t: { zee: 2, tamara: 1 } }, [['zee', 'And a third room by Friday.']]),
    c('reality', 'Reality TV 📺', 'Five girls, one house, one gossip page. Somebody is getting voted off 📺', { m: { popularity: 3, suspicion: 3 } }, [['favoureze', 'Ada said VOTED OFF 😭'], ['tamara', 'Not us 💚']]),
    c('assistant', 'Assistant energy 💼', 'Day one as Zee’s assistant. Pray for me 🙏😂', { m: { popularity: 2 }, t: { zee: 2 } }, [['zee', 'Pray harder.']], { if: 'accepted_pa_job' }),
    c('heart', 'Heart 💚', '💚', { m: { popularity: 1 } }, [['tamara', '💚']]),
  ],
  post_hauwa_doors_ep3: [
    c('count', 'Count with her 🗝️', 'Thirty-two. I counted too. The archive is the only one I can’t open 👀', { m: { suspicion: 4 }, t: { hauwa: 3 } }, [['hauwa', 'Yet.'], ['nnamdi_oraekwe', 'YET?? 😳']], { ifNot: 'accepted_pa_job' }),
    c('key', 'Mention the key 🗝️', 'Zee gave me a key today. Now I’m counting doors too 🗝️', { m: { suspicion: 5, popularity: 2 }, t: { zee: -2, hauwa: 2 } }, [['zee', 'Don’t post about keys, Ada.'], ['hauwa', 'Count carefully.']], { if: 'accepted_pa_job' }),
    c('trust', 'Reflect 🌿', '“Every house tells you who it trusts by what it locks.” Writing that on my wall 🌿', { m: { reputation: 3 }, t: { hauwa: 4 } }, [['hauwa', 'Write it small. Walls have ears.']]),
    c('creepy', 'Joke 😂', 'Hauwa counting doors at night is the scariest content on Gidigram 😭', { m: { popularity: 4 }, t: { hauwa: -1 } }, [['bisola', 'SAME 😭'], ['hauwa', 'Someone has to.']]),
    c('design', 'Design question 🏛️', 'What does a house that trusts nobody look like?', { m: { reputation: 2 }, t: { hauwa: 2 } }, [['hauwa', 'This one.']]),
  ],
  post_kelvin_night_ep3: [
    c('think', 'Ask what about 🌙', 'Thinking about what? 🌙', { m: { romanceKelvin: 4 }, t: { kelvin: 3 } }, [['kelvin', 'Ask me in person.'], ['miriam_chukwu', 'HE SAID IN PERSON 😭']]),
    c('ride', 'Remember the ride 🏎️', 'The view was better from the passenger seat 😏', { m: { romanceKelvin: 6, jealousy: 3 }, t: { kelvin: 4, chidi: -2 }, mem: { kelvin: 'You flirted on his night-drive post about the passenger seat.' } }, [['kelvin', 'The seat’s still free.'], ['chidi', '🙂']], { if: 'drove_with_kelvin' }),
    c('shuttle', 'Shuttle joke 🚌', 'Some of us think on the campus shuttle 🚌😂', { m: { popularity: 3 }, t: { kelvin: 1 } }, [['kelvin', 'You made that very clear.']], { if: 'refused_kelvin_ride' }),
    c('warning', 'Remember his warning 🔎', 'You think a lot for someone who keeps warning people. What do you know, Kelvin? 👀', { m: { suspicion: 5 }, t: { kelvin: -2 } }, [['kelvin', 'Enough to drive at night.']]),
    c('safe', 'Drive safe 🙏', 'Drive safe 🙏', { m: { romanceKelvin: 1 } }, [['kelvin', 'Always.']]),
  ],
  post_dayo_session_ep3: [
    c('awake', 'Admit it 😏', 'Funny, someone on my phone keeps me awake too 😏', { m: { romanceDayo: 7, jealousy: 3 }, t: { dayo: 5 }, mem: { dayo: 'You admitted on his post that someone keeps you awake too.' } }, [['dayo', 'Must be a good someone.'], ['simi_solanke', 'THEY ARE TALKING TO EACH OTHER 😭']]),
    c('manager', 'Tease 😂', '“My manager.” Okay Dayo 😂', { m: { romanceDayo: 3, popularity: 2 }, t: { dayo: 2 } }, [['dayo', 'My manager is very pretty, okay?']]),
    c('sleep', 'Tell him to sleep 😴', 'Producer of the year needs to sleep too 😴', { m: { romanceDayo: 2 }, t: { dayo: 2 } }, [['dayo', 'Sleep is for people with finished songs.']]),
    c('surulere', 'Ask about the studio 🔎', 'Is the studio near the Stadium? I keep hearing Surulere everywhere lately 👀', { m: { suspicion: 3 }, t: { dayo: 1 } }, [['dayo', 'Two streets from it. Come see it one day.']]),
    c('heart', 'Like 🎛️', '🎛️❤️', { m: { romanceDayo: 1 } }, [['dayo', '🎧']]),
  ],

  /* ---------------------------- Episode 4 ---------------------------- */
  post_tea_warning_ep4: [
    c('not_scared', 'Not scared 💅', 'My hands go wherever the truth is. Next time, post your face 💅', { m: { popularity: 6, reputation: 3, suspicion: 3 } }, [['lagos_tea', 'Brave girl. We’ll see 🫖'], ['solomon_ekong', 'ADA VS THE PAGE 😳']]),
    c('breakfast', 'Expose the timing ⏰', 'Posted at 8:06 AM. I know exactly who was at that table 🙂', { m: { suspicion: 8 }, t: { zee: -1, tamara: -1, chi: -1, bisola: -1, hauwa: -1 } }, [['miriam_chukwu', 'SHE KNOWS 😭'], ['lagos_tea', 'Do you? 🫖']]),
    c('drawer', 'Play dumb 🙃', 'What drawer? I only know the fridge 🙃', { m: { popularity: 4, reputation: 1 } }, [['kola_fashola', 'The fridge 😂'], ['lagos_tea', 'Cute 🫖']]),
    c('bisola', 'Protect Bisola 🤍', 'Whatever you think happened last night, leave the other girls out of it.', { m: { loyalty: 4 }, t: { bisola: 4 } }, [['bisola', '🥺'], ['lagos_tea', 'Protective. Interesting 🫖']], { if: 'comforted_bisola' }),
    c('ignore', 'Ignore it 🙂', 'Scrolling past 🙂', { m: { reputation: 2 } }, [['ronke_adewale', 'The calm is scary 😭']]),
  ],
  post_bisola_fine_ep4: [
    c('support', 'Back her up 🤍', 'She IS fine. And if she’s not, she has people. Right, @bisola_vlogs? 🤍', { m: { loyalty: 5 }, t: { bisola: 6 }, mem: { bisola: 'You backed up her “everything is fine” post the morning after the archive.' } }, [['bisola', 'RIGHT 🥺💖'], ['folake_ade', 'Ada knows something 👀']]),
    c('eyes', 'Agree with Folake 😂', '@folake_ade the concealer is working overtime 😂', { m: { popularity: 4 }, t: { bisola: -2 } }, [['bisola', 'ADA 😭 betrayal']]),
    c('nudge', 'Nudge her 🙂', 'Slept like a baby? I saw you at 2 AM, sis 🙂', { m: { suspicion: 5, popularity: 3 }, t: { bisola: -8 }, mem: { bisola: 'You hinted publicly that you saw her awake at 2 AM.' } }, [['bisola', 'DELETE THIS 😭😭'], ['victor_osita', 'WHAT HAPPENED AT 2AM 😳']]),
    c('deal', 'Code word 🤝', 'Can’t wait for the vlog. Remember what we talked about ☀️', { m: { loyalty: 4, suspicion: 2 }, t: { bisola: 3 } }, [['bisola', 'I remember 🤝']], { if: 'bisola_deal' }),
    c('vlog', 'Hype the vlog 🎥', 'Setting my alarm for 6 🎥', { m: { popularity: 1 }, t: { bisola: 2 } }, [['bisola', 'MY REAL ONE 😭']]),
  ],
  post_paparazzi_okada_ep4: [
    c('own', 'Own it 🏍️', 'Yes it was me. Banana Island has drivers, Ajegunle has okadas. Both get you there 🏍️', { m: { popularity: 7, reputation: 3 } }, [['kola_fashola', 'ICON 😭'], ['tamara', 'Call me NOW 💚']]),
    c('chidi', 'Answer Chidi 😊', '@chidi_captures next time I’ll bring a helmet AND a photographer 😊', { m: { romanceChidi: 5 }, t: { chidi: 4 } }, [['chidi', 'Deal. Both safety-approved.']]),
    c('deny', 'Deny 🙃', 'Not me. My evil twin from Mile 2 🙃', { m: { popularity: 4 } }, [['miriam_chukwu', 'The evil twin excuse in 2026 😭']]),
    c('tamara', 'Reassure Tamara 💚', '@tamara_reid I’m fine. Long story. Tonight 💚', { m: { loyalty: 3 }, t: { tamara: 3 } }, [['tamara', 'Bring the long story and garri 💚']]),
    c('cryptic', 'Be cryptic 🔎', 'Some deliveries are worth chasing 🔎', { m: { suspicion: 6, popularity: 2 } }, [['lagos_tea', '🫖'], ['nnamdi_oraekwe', 'The page reacted with a TEACUP 😳']]),
  ],
  post_zee_owambe_ep4: [
    c('gold', 'Gold ready 👑', 'Gold gele is ready. Mama Bello deserves the whole of Lagos in her colours 👑', { m: { popularity: 3 }, t: { zee: 4 } }, [['zee', 'Correct answer.'], ['halima_bello', 'Ada understood the assignment']]),
    c('kelvin_red', 'Red, though 😏', '@kelvin_wright gold is mandatory but I heard red is… allowed? 😏', { m: { romanceKelvin: 5, jealousy: 3 }, t: { kelvin: 4, zee: -3 }, mem: { zee: 'You hinted on her mother’s Owambe post that you might wear red.' } }, [['kelvin', 'Allowed.'], ['zee', 'NOT allowed.']], { if: 'kelvin_bridge_flirt' }),
    c('ally', 'Show support 🤝', 'Saturday will be perfect. I’ll make sure of it 🤝', { m: { loyalty: 4 }, t: { zee: 6 } }, [['zee', 'I’m holding you to that.']], { if: 'zee_alliance_ep4' }),
    c('dayo', 'Answer Dayo 🎧', '@dayomartins_sound see you at the booth 🎧', { m: { romanceDayo: 5 }, t: { dayo: 3 } }, [['dayo', 'I’ll be the one with the headphones 🙂'], ['simi_solanke', 'WAIT. ADA AND DAYO?? 😭']]),
    c('worried', 'Hint at danger 🔎', 'Six hundred guests, every camera in Lagos. Hope everyone’s guarding their secrets 🔎', { m: { suspicion: 5 }, t: { zee: -4 } }, [['zee', 'Ada. Delete this.'], ['lagos_tea', '🫖']]),
    c('happy', 'Happy birthday 🎂', 'Happy 60th in advance to Mama Bello! 🎂', { m: { reputation: 2 }, t: { zee: 2, kelvin: 1 } }, [['zee', 'She’ll love that.']]),
  ],
  post_chidi_redlight_ep4: [
    c('bigger', 'Soft 😊', 'The darkroom felt bigger to me too 🎞️❤️', { m: { romanceChidi: 8, jealousy: 3 }, t: { chidi: 6, kelvin: -2 }, mem: { chidi: 'You admitted publicly that the darkroom felt bigger to you too.' } }, [['chidi', 'It’ll feel even bigger next time.'], ['adaeze_nwosu', 'I KNEW IT 😭']], { if: 'chidi_darkroom_moment' }),
    c('chemicals', 'Tease 😂', '“My chemicals. Strictly.” Sure, Chidi 😂', { m: { romanceChidi: 4, popularity: 2 }, t: { chidi: 2 } }, [['chidi', 'Very strict chemicals 🙂']]),
    c('entrance', 'Bring up the flash 🔎', 'Nice photo. You always know where the light is. Even at party entrances 👀', { m: { suspicion: 6, romanceChidi: -3 }, t: { chidi: -4 }, mem: { chidi: 'You brought up the party entrance flash again, in public.' } }, [['chidi', 'Ada.'], ['nnamdi_oraekwe', 'What entrance?? 😳']]),
    c('kelvin', 'Answer Kelvin 😏', '@kelvin_wright red is a strong colour. Strong enough to wear on Saturday? 😏', { m: { romanceKelvin: 4, romanceChidi: -2, jealousy: 5 }, t: { kelvin: 3, chidi: -3 } }, [['kelvin', 'We’ll see.'], ['chidi', '🙂']]),
    c('art', 'Praise the work 🎞️', 'Film photography is the only honest medium left 🎞️', { m: { reputation: 2 }, t: { chidi: 3 } }, [['chidi', 'That’s why I love it.']]),
  ],
  post_kelvin_bridge_ep4: [
    c('company', 'Claim it 😏', 'The company appreciates the Chapman 😏', { m: { romanceKelvin: 8, jealousy: 4 }, t: { kelvin: 6, chidi: -3 }, mem: { kelvin: 'You claimed his “good company” caption in public.' } }, [['kelvin', 'The company should text back faster.'], ['miriam_chukwu', 'IT’S ADA 😭😭']]),
    c('zee', 'Laugh at Zee 😂', '@zeebello I drank your Chapman. Sorry not sorry 😂', { m: { popularity: 4 }, t: { zee: 1, kelvin: 2 } }, [['zee', 'You owe me a Chapman and an explanation.']]),
    c('logs', 'Mention the logs 🔎', 'Good company asks good questions. Still waiting on those logs 🙂', { m: { suspicion: 5 }, t: { kelvin: -2 } }, [['kelvin', 'Patience.']], { if: 'asked_kelvin_logs' }),
    c('caught', 'Needle him 🙂', 'Great drive. Better memory than your sister, apparently 🙂', { m: { suspicion: 6 }, t: { kelvin: -4, zee: -2 } }, [['kelvin', 'Not here, Ada.'], ['tari_briggs', 'What did Zee forget?? 😳']], { if: 'caught_kelvin_log' }),
    c('chidi', 'Answer Chidi 🙂', '@chidi_captures he did. Don’t worry 🙂', { m: { romanceChidi: 2 }, t: { chidi: 1 } }, [['chidi', 'Good.']]),
    c('heart', 'Like 🌉', '🌉', { m: { romanceKelvin: 1 } }, [['kelvin', '🙂']]),
  ],
  post_dayo_booth_ep4: [
    c('for_me', 'Ask who it’s for 😏', 'A new song nobody has heard yet. For who, Dayo? 😏', { m: { romanceDayo: 7, jealousy: 2 }, t: { dayo: 5 } }, [['dayo', 'Come to the booth and find out.'], ['simi_solanke', 'THE TENSION 😭']]),
    c('promise', 'Keep the promise 🎧', 'Booth. Saturday. I’m holding you to the song 🎧', { m: { romanceDayo: 6 }, t: { dayo: 5 } }, [['dayo', 'I’m holding you to showing up.']], { if: 'dayo_owambe_date' }),
    c('m', 'Mention M 🔎', 'Who mixes your live sets? M-something? 👀', { m: { suspicion: 6, romanceDayo: -2 }, t: { dayo: -3 } }, [['dayo', 'I mix my own sets, Ada. Why do you keep asking about M?']], { if: 'asked_dayo_m' }),
    c('bisola', 'Back Bisola 😂', '@bisola_vlogs vlog the booth and tag me 😂', { m: { popularity: 3 }, t: { bisola: 2 } }, [['bisola', 'YES 😩💖']]),
    c('hype', 'Hype 🔥', 'Civic Centre is not ready 🔥', { m: { romanceDayo: 2, popularity: 1 } }, [['dayo', 'Neither am I.']]),
    c('voice', 'Remember the call 🌙', 'Still thinking about the broken piano keys 🎹', { m: { romanceDayo: 6 }, t: { dayo: 4 } }, [['dayo', 'They’re in the new song. You’ll hear them.']], { if: 'dayo_truth_call' }),
  ],
  post_tamara_glow_ep4: [
    c('glow', 'Hype her ✨', 'Skin that doesn’t lie on a girl who doesn’t either ✨💚', { m: { loyalty: 4 }, t: { tamara: 5 } }, [['tamara', '🥹💚 my sister']]),
    c('thanks', 'Grateful 🙏', 'This deal is why my fees are cleared. Thank you forever, Tamara 🙏', { m: { loyalty: 5, reputation: -2 }, t: { tamara: 6 } }, [['tamara', 'Don’t tell the whole internet 😭💚'], ['omowunmi_p', 'Wait, Tamara paid her fees?? 👀']], { if: 'accepted_tamara_money' }),
    c('brand', 'Ask about the brand 🔎', 'Glow Republic! Where can I buy it? I can’t find their website anywhere 👀', { m: { suspicion: 6 }, t: { tamara: -3 } }, [['tamara', 'They’re launching soon. Exclusive list 💚'], ['omowunmi_p', 'A brand with no website and a big budget 👀']]),
    c('omowunmi', 'Shut down Omowunmi 🙄', '@omowunmi_p some people are just good at their job 🙄', { m: { loyalty: 3, popularity: 2 }, t: { tamara: 3 } }, [['omowunmi_p', 'I’m just saying 🤷🏾‍♀️']]),
    c('heart', 'Heart 💚', '💚', { m: { popularity: 1 } }, [['tamara', '💚']]),
  ],
  post_hauwa_seeds_ep4: [
    c('key', 'Hint at the key 🗝️', 'Some keys are worth watering 🗝️🌱', { m: { suspicion: 5 }, t: { hauwa: 4 } }, [['hauwa', 'Keep it somewhere dry.'], ['nnamdi_oraekwe', 'WHAT KEY 😭']], { if: 'took_master2' }),
    c('soil', 'Push back 🌱', 'Watering secrets for three weeks is a choice too, Hauwa 🌱', { m: { suspicion: 6 }, t: { hauwa: -4 } }, [['hauwa', 'So is digging them up at 2 AM.']], { if: 'accused_hauwa_hiding' }),
    c('sleep', 'Go to sleep 😭', 'Hauwa it’s 3AM. Put the soil down 😭', { m: { popularity: 4 }, t: { hauwa: 1 } }, [['hauwa', 'Says the girl awake to read this 🌿']]),
    c('bisola', 'Back Bisola 😂', '@bisola_vlogs it’s a gardening metaphor. Allegedly 😂', { m: { popularity: 3 }, t: { bisola: 1 } }, [['bisola', 'I don’t trust gardens anymore 😭']]),
    c('wise', 'Thoughtful 🌿', 'Things that grow back up usually wanted to be found 🌿', { m: { reputation: 3 }, t: { hauwa: 3 } }, [['hauwa', 'Exactly.']]),
    c('why', 'Ask her why 🤔', 'You still haven’t told me why you’re helping 🌱', { m: { suspicion: 4 }, t: { hauwa: 2 } }, [['hauwa', 'Because you asked. Keep asking.']], { if: 'refused_master2' }),
  ],
  post_chi_ndpa_ep4: [
    c('plaintiff', 'Stand with her ⚖️', 'Plaintiff reporting for duty ⚖️', { m: { reputation: 6, popularity: 5 }, t: { chi: 6 } }, [['chi', 'See you in court, partner.'], ['kene_okoli', 'ADA IS THE PLAINTIFF?? 🍿🍿']], { if: 'signed_lawsuit' }),
    c('page', 'Clap back at the page 💅', '@TheLagosTea it’s not a PDF, it’s a countdown 💅', { m: { popularity: 6, suspicion: 3 } }, [['lagos_tea', 'Tick tock to you too 🫖'], ['chi', 'Well said.']]),
    c('law', 'Ask a legal question 🤓', 'Does the NDPA cover photos of someone’s family taken without consent?', { m: { reputation: 4 }, t: { chi: 4 } }, [['chi', 'Yes. Section 25. DM me.']]),
    c('doubt', 'Doubt her 🙂', 'Very brave. Also very convenient, considering where you were standing that night 🙂', { m: { suspicion: 6 }, t: { chi: -6 } }, [['chi', 'I told you that in confidence, Ada.'], ['omowunmi_p', 'Where was she standing?? 😳']], { if: 'doubted_chi_whisper' }),
    c('popcorn', 'Popcorn 🍿', '🍿', { m: { popularity: 2 } }, [['kene_okoli', 'Pass me some 🍿']]),
    c('soon', 'Coming soon ⏳', 'Some of us are waiting for the right moment to sign ⏳', { m: { suspicion: 3, reputation: 2 }, t: { chi: 3 } }, [['chi', 'Don’t wait too long.']], { if: 'delayed_lawsuit' }),
  ],
  post_tea_mama_ep4: [
    c('mother', 'Protect Mama 🔥', 'You can come for me. You do NOT get to come for my mother.', { m: { reputation: 8, popularity: 6 }, t: { tamara: 3, chidi: 3, hauwa: 3, dayo: 3 } }, [['grace_okeke', 'We’re with you, Ada 🤍'], ['blessing_alabi', 'All of Ajegunle is with you']]),
    c('proud', 'Proud of her 🏪', 'Yes, that’s my mother. She built that kiosk with her hands. I’m prouder of it than anything on this island 🏪', { m: { reputation: 10, popularity: 4 } }, [['blessing_alabi', 'MAMA ADA 😭🙌🏾'], ['zee', 'Respect.']]),
    c('saturday', 'See you Saturday 🫖', 'See you Saturday. Come alone 🫖', { m: { suspicion: 8, popularity: 4 } }, [['lagos_tea', '🫖'], ['miriam_chukwu', 'CHILLS 😳']]),
    c('report', 'Report it 🚫', 'Reported. Everyone who cares about decency, report this too 🚫', { m: { reputation: 6, loyalty: 3 } }, [['ronke_adewale', 'Done ✅'], ['kene_okoli', 'Reported. This is criminal.']]),
    c('silent', 'Say nothing 🤐', '…', { m: { reputation: 2 } }, [['tamara', 'I’m here. Whenever you’re ready 💚']]),
  ],

  /* ---------------------------- Episode 5 ---------------------------- */
  post_bisola_asoebi_ep5: [
    c('gold', 'Hype the gold ✨', 'Six queens, one gele artist down. Worth it ✨👑', { m: { popularity: 4 }, t: { bisola: 5, zee: 2 } }, [['bisola', 'QUEEN ADA HAS SPOKEN 👑'], ['simi_solanke', 'The squad is serving']]),
    c('tamara_gele', 'Credit Tamara 💅', 'Tamara tied my gele and I look like royalty. Since primary school she’s been doing this 💚', { m: { loyalty: 3 }, t: { tamara: 6 }, mem: { tamara: 'You credited her gele work on Bisola’s vlog.' } }, [['tamara', 'A FASHIONABLE broken fan, back then 😂💚']]),
    c('gloves', 'Notice the gloves 🧤', 'Not me noticing the lace gloves too 👀🧤 Very royal wedding.', { m: { suspicion: 5 }, t: { chi: -2, tamara: -2 } }, [['chi', 'Court habit. I explained this.'], ['tamara', 'MANICURE PROTECTION, Ada 😭']]),
    c('nervous', 'Nervous joke 😅', 'If I fall in this gele tonight, please edit it out 😅', { m: { popularity: 3 } }, [['bisola', 'I will NOT. Content is content 😂'], ['kene_okoli', 'We’re watching for the fall now 😭']]),
    c('heart', 'Just a heart 💛', '💛', { m: { popularity: 1 } }, [['bisola', '💛💛💛']]),
  ],
  post_dayo_booth_ep5: [
    c('me', 'It was me 🎧', 'Somebody in gold says the thirty seconds were perfect 🎧', { m: { romanceDayo: 6, popularity: 4, jealousy: 3 }, t: { dayo: 6 }, mem: { dayo: 'You told everyone you were the somebody in gold.' } }, [['dayo', 'Somebody in gold has good taste.'], ['keji_balogun', 'THE CONFIRMATION 😭😭']]),
    c('three_d', 'Three dimensions 😏', 'He exists in three dimensions, everyone. I checked 😏', { m: { romanceDayo: 4, popularity: 3 }, t: { dayo: 4 } }, [['dayo', 'Disappointed?'], ['femi_ajayi', 'NOT THE INSPECTION 😭']]),
    c('play_it', 'Play it now 🔥', 'Drop it already. Six hundred people are waiting 🔥', { m: { romanceDayo: 2, popularity: 2 } }, [['dayo', 'Patience 🙂']]),
    c('careful', 'Keep it low-key 🤐', 'Low-key is a thing, Dayo 🤐', { m: { reputation: 2, romanceDayo: -2 } }, [['dayo', 'Noted. Deleting nothing.']]),
    c('chidi', 'Shout out Chidi 📸', 'Best producer and best photographer in one hall tonight 📸🎧 @chidi_captures', { m: { loyalty: 2, jealousy: 2 }, t: { chidi: 4, dayo: -1 } }, [['chidi', 'Appreciated.'], ['dayo', 'Fair.']]),
  ],
  post_tea_owambe_ep5: [
    c('ilashe', 'Remember Ilashe 🛶', 'The families matter more than the party. But this was done to hurt, not to help.', { m: { reputation: 8 }, t: { kelvin: 6, zee: 2 }, mem: { kelvin: 'You said the Ilashe families matter more than the party.' } }, [['chinedu_ubah', 'Balanced and correct'], ['kelvin', 'Thank you.']]),
    c('mama_bello', 'Defend Mama Bello 🙏🏾', 'She blessed me tonight in front of six hundred people. Whatever was signed, she didn’t deserve this on her birthday 🙏🏾', { m: { loyalty: 6 }, t: { zee: 8 }, mem: { zee: 'You defended her mother under the Owambe leak.' } }, [['zee', '🤍'], ['grace_okeke', 'Ajegunle girl with manners']]),
    c('who_slide', 'Who delivered it? 🔎', 'Someone walked a flash drive into that AV booth in gold aso-ebi and lace gloves. The AV boy remembers 🔎', { m: { suspicion: 8, popularity: 3 } }, [['miriam_chukwu', 'LACE GLOVES 😳'], ['lagos_tea', '🫖']], { if: 'ran_to_av_booth' }),
    c('coward', 'Call it cowardly 🔥', 'Hiding behind a screen at an old woman’s birthday. Brave 🔥', { m: { reputation: 4, popularity: 4 } }, [['lagos_tea', 'Says the girl hiding behind a gele 🫖'], ['kene_okoli', 'THE PAGE REPLIED 😳']]),
    c('silent', 'Stay out of it 🤐', '…', { m: { reputation: 1 } }, [['zee', 'Thank you for not adding to it.']]),
  ],
  post_paparazzi_barefoot_ep5: [
    c('shoes', 'Shoes were hurting 👠', 'Heels and car parks don’t mix. That’s the whole story 👠', { m: { reputation: 3, popularity: 3 } }, [['kola_fashola', 'Not the whole story but okay 😭']]),
    c('takedown', 'Ask them to delete 🚫', 'Please take this down. I’m fine. I just want to go home.', { m: { reputation: 4 }, t: { chidi: 2 } }, [['gidi_paparazzi', 'Respect, deleting in 24h 🙏'], ['grace_okeke', 'Leave her alone 🤍']]),
    c('chidi', 'Thank Chidi 📸', '@chidi_captures thank you for asking them to take it down.', { m: { romanceChidi: 4 }, t: { chidi: 6 } }, [['chidi', 'Always.']]),
    c('levelb', 'Tease Level B 😏', 'What happened on Level B stays on Level B 😏', { m: { popularity: 5, suspicion: 2 } }, [['prisca_nwa', 'THE AURA 😭'], ['lagos_tea', 'Does it? 🫖']]),
    c('ignore', 'Ignore it 🤐', '🤐', { m: { reputation: 1 } }, [['kene_okoli', 'The silence is LOUD']]),
  ],
  post_tea_teaser_ep5: [
    c('come', 'Come and post it 🔥', 'Post it. I’m not hiding from where I come from 🔥', { m: { reputation: 8, popularity: 6 }, t: { hauwa: 3, chi: 2 } }, [['grace_okeke', 'That’s how you do it 👏🏾'], ['lagos_tea', 'Monday 🫖']]),
    c('legal', 'Mention lawyers ⚖️', 'Publishing a minor’s scholarship form without consent. My lawyer has screenshots ⚖️', { m: { reputation: 6, suspicion: 3 }, t: { chi: 6 }, mem: { chi: 'You called her your lawyer under the page’s teaser.' } }, [['chi', 'She does.'], ['miriam_chukwu', 'LAWYERED UP 😳']], { if: 'called_chi_3am' }),
    c('how', 'Ask how 🔎', 'That form never left my mother’s house. So how do you have it? 🔎', { m: { suspicion: 8 } }, [['miriam_chukwu', 'EXACTLY my question'], ['lagos_tea', 'I have my ways 🫖']]),
    c('mama', 'Leave Mama out 🙏🏾', 'Do what you want to me. Leave my mother out of it 🙏🏾', { m: { loyalty: 4, reputation: 4 }, t: { tamara: 3, dayo: 3 } }, [['blessing_alabi', 'We’re with you'], ['tamara', '💚']]),
    c('sleep', 'Go to sleep 😴', 'Some of us have class in the morning. Go to sleep 😴', { m: { popularity: 4 } }, [['kene_okoli', 'NOT THE BEDTIME 😭'], ['tolu_adebayo', 'She’s too calm, I’m scared']]),
  ],

  /* ---------------------------- Episode 6 ---------------------------- */
  post_tea_debt_ep6: [
    c('truth', 'Tell the truth 📝', 'My father died. My mother borrowed to bury him. I was 17 and I lied on one box. Now you know everything. I’m still here.', { m: { reputation: 10, popularity: 6 }, t: { chi: 4, hauwa: 4, bisola: 3 } }, [['grace_okeke', 'We see you 🤍'], ['blessing_alabi', 'Ajegunle is proud of you']]),
    c('stain', 'Point at the stain ☕', 'That coffee stain is mine. That’s my personal copy, from my mother’s house. Somebody went into her house to get this ☕', { m: { suspicion: 10, reputation: 4 } }, [['miriam_chukwu', 'TOLD YOU 😳'], ['lagos_tea', '🫖']], { if: 'studied_debt_leak' }),
    c('loanshark', 'Name the loan shark 🦈', '20% a month. Look that up. Then ask who the real criminal is 🦈', { m: { reputation: 6, popularity: 4 } }, [['chinedu_ubah', 'Say it louder'], ['demola_shonowo', '…okay that’s fair actually']]),
    c('demola', 'Answer Demola 🙂', '@demola_shonowo rules are rules. I hope you never have to choose between a funeral and a future 🙂', { m: { popularity: 5, reputation: 3 } }, [['demola_shonowo', 'I didn’t think about it like that. Sorry.'], ['kene_okoli', 'Respectfully cooked 😭']]),
    c('silent', 'Say nothing 🤐', '…', { m: { reputation: 2 } }, [['tamara', 'I’m here 💚'], ['dayo', 'Sofa bed’s still free.']]),
  ],
  post_zee_restructure_ep6: [
    c('grace', 'Wish her well 🤍', 'Thank you for the job, Zee. Good luck with the vote 🤍', { m: { reputation: 8 }, t: { zee: 8 }, mem: { zee: 'You wished her well publicly the day she fired you.' } }, [['zee', '🤍'], ['grace_okeke', 'Classy. Very classy.']]),
    c('personal', 'It felt personal 😐', '“Never personal.” Felt pretty personal from the driveway 😐', { m: { popularity: 6, reputation: -2 }, t: { zee: -6 }, mem: { zee: 'You mocked her restructuring post.' } }, [['kene_okoli', 'THE DRIVEWAY 😭'], ['zee', 'Ada.']]),
    c('light', 'Light back ✨', 'Light to you too ✨ I’ll be fine. People like me always are.', { m: { reputation: 5 }, t: { zee: 3 } }, [['zee', 'I know.']]),
    c('vote', 'Mention the Guild 🗳️', 'Hope the Guild appreciates how hard you’re working to look spotless 🗳️', { m: { suspicion: 4, popularity: 3 }, t: { zee: -4, chi: 2 } }, [['chi', '👀'], ['zee', 'Noted.']]),
    c('skip', 'Scroll past 🤐', '🤐', { m: { reputation: 1 } }, [['bisola', '🤍']]),
  ],
  post_tamara_sleepover_ep6: [
    c('sister', 'Sister forever 💚', 'Since the mango tree. Thank you for the room, the Milo and the rubbish films 💚', { m: { loyalty: 6 }, t: { tamara: 8 }, mem: { tamara: 'You thanked her publicly for taking you in.' } }, [['tamara', 'Forever 💚'], ['simi_solanke', 'I’m crying at a sleepover post 😭']]),
    c('chef', 'Ask about the chef 👨🏾‍🍳', 'Where is this famous chef you promised me? 😂👨🏾‍🍳', { m: { popularity: 3, suspicion: 2 }, t: { tamara: -1 } }, [['tamara', 'On leave!! Don’t expose me 😭']]),
    c('nnamdi', 'Defend the décor 🖼️', '@nnamdi_oraekwe minimalism is very in. Ask anyone 🖼️', { m: { loyalty: 3 }, t: { tamara: 4 } }, [['tamara', 'THANK you 💅']]),
    c('envelopes', 'Hint at the notices 📮', 'Lagos is hard on everyone. Even Ikoyi. Hold on 📮', { m: { suspicion: 5 }, t: { tamara: -4 }, mem: { tamara: 'You hinted at her family’s money troubles in public.' } }, [['tamara', 'What does that mean, Ada?']], { if: 'asked_tamara_phone' }),
    c('heart', 'Just a heart 💚', '💚', { m: { popularity: 1 } }, [['tamara', '💚💚']]),
  ],
  post_dayo_wifi_ep6: [
    c('sheets', 'Thank him for the sheets 🛏️', 'The sheets still have the shop creases. Nobody has ever bought me sheets before 🛏️', { m: { romanceDayo: 8 }, t: { dayo: 8 }, mem: { dayo: 'You thanked him in public for the new sheets.' } }, [['dayo', 'First of many.'], ['keji_balogun', 'I’M SCREAMING 😭😭']]),
    c('password', 'Tease the password 😏', 'Your Wi-Fi password is very well chosen 😏', { m: { romanceDayo: 6, popularity: 3 }, t: { dayo: 5 } }, [['dayo', 'It was a big upgrade.'], ['femi_ajayi', 'WHAT IS THE PASSWORD 😭']]),
    c('song', 'Ask for the song 🎹', 'Finished? Then I’m hearing it tonight 🎹', { m: { romanceDayo: 4 }, t: { dayo: 4 } }, [['dayo', 'Front row seat.']]),
    c('upstairs', 'Mention upstairs 👀', 'Tell your upstairs neighbour to stop beeping at 1 AM 👀', { m: { suspicion: 6 }, t: { dayo: 1 } }, [['dayo', 'Delete this.'], ['nnamdi_oraekwe', 'Upstairs neighbour?? 😳']], { if: 'saw_woman_upstairs' }),
    c('heart', 'Just a heart 🎧', '🎧', { m: { romanceDayo: 1 } }, [['dayo', '🎹']]),
  ],
  post_chi_due_process_ep6: [
    c('thanks', 'Thank her ⚖️', 'Thank you for standing next to me today, Barrister ⚖️', { m: { loyalty: 4, reputation: 4 }, t: { chi: 8 }, mem: { chi: 'You thanked her publicly after the scholarship hearing.' } }, [['chi', 'You did the hard part.'], ['omowunmi_p', 'Confirmed: Chioma is her lawyer 😳']], { if: 'chi_counsel' }),
    c('prepped', 'Credit the prep 📚', 'Two days of practice questions with the scariest lawyer in Lagos. Worth every minute 📚', { m: { reputation: 4 }, t: { chi: 6 } }, [['chi', 'Scariest is a compliment. I’ll take it.']], { ifNot: 'chi_counsel' }),
    c('heard', 'Agree 🙏🏾', 'Being heard before you’re judged. That’s all anyone wants 🙏🏾', { m: { reputation: 4 } }, [['grace_okeke', 'Amen']]),
    c('daniel', 'Answer Daniel 🙂', '@daniel_okafor she’s my friend first. Lawyer second 🙂', { m: { loyalty: 3, popularity: 2 }, t: { chi: 4 } }, [['chi', 'Third: the one who makes the coffee.']]),
    c('quiet', 'Stay quiet 🤐', '🤐', { m: { reputation: 1 } }, [['chi', 'Smart.']]),
  ],
  post_hauwa_count_ep6: [
    c('counting', 'I’m counting 🔢', 'Counting. It’s a very small number 🔢', { m: { suspicion: 6 }, t: { hauwa: 6 }, mem: { hauwa: 'You told her you were counting, under her post.' } }, [['hauwa', 'Keep going.']]),
    c('just_say', 'Just say it 😩', 'Hauwa, with respect, sometimes you can just SAY the thing 😩', { m: { popularity: 4 }, t: { hauwa: -2 } }, [['hauwa', 'Not this time.'], ['nnamdi_oraekwe', 'ADA SPEAKS FOR ALL OF US 😭']]),
    c('hurts', 'It hurts 🌿', 'It hurts more than I thought it would 🌿', { m: { reputation: 3 }, t: { hauwa: 4 } }, [['hauwa', 'That’s how you know it’s honest.']]),
    c('envelope', 'Thank her for the envelope ✉️', 'Thank you for the transport money. And the note. Mostly the note ✉️', { m: { loyalty: 3 }, t: { hauwa: 5 } }, [['hauwa', 'Read it twice.']]),
    c('ifeoma', 'Answer Ifeoma 😂', '@ifeoma_anyanwu sheep, ma. To fall asleep 😂', { m: { popularity: 4 } }, [['ifeoma_anyanwu', 'LMAOOO 😭'], ['hauwa', '🌿']]),
  ],

  /* ---------------------------- Episode 7 ---------------------------- */
  post_chidi_kite_ep7: [
    c('kite', 'Hold on 🪁', 'It only flies because someone is holding on 🪁', { m: { romanceChidi: 6 }, t: { chidi: 8 }, mem: { chidi: 'You quoted his kite line back to him in public.' } }, [['chidi', 'You remembered.']], { ifNot: 'ended_chidi' }),
    c('caption', 'Read the caption 😶', 'Some photos you wish you never took. Yes. I know which ones 😶', { m: { suspicion: 4, reputation: 2 }, t: { chidi: -3 } }, [['chidi', 'I deserve that.'], ['prisca_nwa', 'WAIT WHAT 😳']]),
    c('beautiful', 'Say it’s beautiful 📸', 'This is the Lagos I grew up in. Beautiful 📸', { m: { loyalty: 3 }, t: { chidi: 4 } }, [['chidi', 'Thank you.'], ['grace_okeke', 'Agreed 🙏🏾']]),
    c('done', 'Leave it on seen 🙂', '🙂', { m: { reputation: 2 }, t: { chidi: -2 } }, [['prisca_nwa', 'The smiley is SO cold 😭']], { if: 'ended_chidi' }),
    c('prisca', 'Answer Prisca 🤐', '@prisca_nwa some captions are just captions 🤐', { m: { loyalty: 2 }, t: { chidi: 3 } }, [['prisca_nwa', 'Sure, Jan 👀']]),
  ],
  post_kelvin_ilashe_ep7: [
    c('brave', 'Call it brave 🛶', 'The bravest thing I’ve seen a rich man do. And the old fisherman agrees 🛶', { m: { romanceKelvin: 8, reputation: 4 }, t: { kelvin: 8 }, mem: { kelvin: 'You called the Ilashe return brave, in public.' } }, [['kelvin', 'You made me do it fast.'], ['chinedu_ubah', 'Power couple behaviour??']]),
    c('names', 'Ask for the names 📝', 'Now publish the names of every family. Let them tell the story themselves 📝', { m: { reputation: 6 }, t: { kelvin: 4, hauwa: 4 } }, [['kelvin', 'With their permission, yes.']]),
    c('halima', 'Answer Halima 🙂', '@halima_bello I was there. The canoes were real. So were the tears 🙂', { m: { reputation: 4, popularity: 3 }, t: { kelvin: 4, zee: 2 } }, [['halima_bello', 'Okay. Respect to them then.']]),
    c('zee', 'Hype Zee too 🤍', 'And @zeebello stood in the sun with no ring light for two hours. Growth 🤍', { m: { loyalty: 4 }, t: { zee: 6 } }, [['zee', 'Don’t tell people I can exist without a ring light.']]),
    c('heart', 'Just a heart 🤍', '🤍', { m: { romanceKelvin: 1 } }, [['kelvin', '🤍']]),
  ],
  post_tea_office_ep7: [
    c('stand_by', 'Stand by Hauwa 🤍', 'She was trying to stop you. That’s the only thing this post proves 🤍', { m: { loyalty: 6, reputation: 6 }, t: { hauwa: 12 }, mem: { hauwa: 'You stood by her publicly the night the page exposed her.' } }, [['hauwa', 'Thank you, Ada.'], ['grace_okeke', 'Facts 🤍']]),
    c('camera', 'Point at the camera 📹', 'Who puts a hidden camera in their own office? Someone very scared of being caught 📹', { m: { suspicion: 8, popularity: 4 } }, [['miriam_chukwu', 'EXACTLY'], ['lagos_tea', '🫖']]),
    c('coming', 'We’re coming 🔥', 'You moved your office? Fine. We’ll find the next one too 🔥', { m: { reputation: 6, popularity: 6 } }, [['lagos_tea', 'Good luck, Cinderella 🫖'], ['kene_okoli', 'CHILLS 😭']]),
    c('betrayed', 'Feel betrayed 💔', 'Two years writing about all of us. I don’t know what to feel 💔', { m: { reputation: 2 }, t: { hauwa: -6 }, mem: { hauwa: 'You said publicly you felt betrayed by her.' } }, [['hauwa', 'I understand.'], ['bisola', 'SAME 💔']], { if: 'called_out_hauwa' }),
    c('silent', 'Say nothing 🤐', '…', { m: { reputation: 2, suspicion: 2 } }, [['chi', 'Correct. Nothing in writing.']]),
  ],
};
