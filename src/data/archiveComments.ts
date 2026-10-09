import { CharacterId, Meters } from '../types/vn';
import type { CommentChoice, CommentReply } from './commentChoices';

/* =========================================================================
   ADA'S COMMENTS ON OLDER PROFILE POSTS
   Every older post on a profile has its own five things Ada could say,
   written for that post. A few change once certain story choices have
   happened, so scrolling someone's page in Episode 3 reads differently
   from scrolling it on day one.
   Keys match buildArchivePosts ids: archive_<who>_<index>.
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
  replies: replies.map(([by, t]): CommentReply => ({ by, text: t })),
  ifFlag: cond.if,
  ifNotFlag: cond.ifNot,
});

export const ARCHIVE_COMMENTS: Record<string, CommentChoice[]> = {
  /* ================================ ZEE ================================ */
  archive_zee_0: [
    c('chair', 'Back her 👑', 'Save her TWO chairs. One for the bag 👑', { m: { popularity: 2 }, t: { zee: 4, chi: -2 }, mem: { zee: 'You hyped her Guild Gala post when the whole Island was laughing at the idea.' } }, [['zee', 'Finally, someone with vision 🙂'], ['omowunmi_p', 'The new girl is campaigning already 😂']]),
    c('vote', 'Side with Chi 💼', '@chi_corporate_glam has a point. A seat is not a vote… yet 👀', { m: { popularity: 1, jealousy: 2 }, t: { chi: 4, zee: -4 }, mem: { chi: 'You quoted her "a chair is not a vote" line on Zee’s page.', zee: 'You agreed with Chioma on her own post.' } }, [['chi', 'Thank you. Someone reads.'], ['zee', 'Interesting choice, Ada 🙂']]),
    c('question', 'Ask a real question', 'What would you actually change on the Guild board? Asking as someone who pays for data, not designers 🙂', { m: { reputation: 3 }, t: { zee: 1, hauwa: 2 }, mem: { hauwa: 'You asked Zee a real question instead of hyping or shading.' } }, [['hauwa', 'Good question.'], ['zee', 'Brand budgets for girls who aren’t already rich. Next question.']]),
    c('board_power', 'Connect the dots 🔎', 'Funny how everyone fighting over this seat lives in the same house now 👀', { m: { suspicion: 4 }, t: { zee: -2, chi: -2 } }, [['tari_briggs', 'Content House is a board meeting with ring lights 😭'], ['chi', 'Careful, Ada.']], { if: 'accepted_pa_job' }),
    c('quiet', 'Just like it ❤️', '❤️', { m: { popularity: 1 } }, [['halima_bello', 'A heart. Safe choice 😂']]),
    c('joke', 'Joke 😂', 'Boys’ club? Zee would rearrange the furniture on day one 😂', { m: { popularity: 2 }, t: { zee: 2 } }, [['kola_fashola', 'And charge them for the redesign 😂']], { ifNot: 'accepted_pa_job' }),
  ],
  archive_zee_1: [
    c('paris', 'Hype the look ✨', 'Front row looked like it was arranged around you 🇫🇷✨', { m: { popularity: 2 }, t: { zee: 3 } }, [['zee', 'It was.'], ['simi_solanke', 'Not her agreeing 😭']]),
    c('invites', 'Relate 😅', 'They spell my name wrong on scholarship forms too. We move 😅', { m: { reputation: 2, loyalty: 1 }, t: { zee: 2, tamara: 1 }, mem: { zee: 'You compared Paris invites to scholarship forms, and she didn’t hate it.' } }, [['zee', '“We move.” Okay, Ajegunle. I see you 🙂'], ['grace_okeke', 'Lol the solidarity']]),
    c('bisola_vlog', 'Tease Bisola 😂', '@bisola_vlogs I need the toilet vlog. For research 😂', { m: { popularity: 3 }, t: { bisola: 3, zee: -1 } }, [['bisola', 'IT WAS PRIVATE 😭😭 I’ll send it in DM'], ['zee', 'Don’t you dare.']]),
    c('tamara_seat', 'Notice Tamara 💚', 'Tamara next to you in every front row photo. Ride or die energy 💚', { m: { loyalty: 2 }, t: { tamara: 3, zee: 1 } }, [['tamara', 'Since secondary school 💚'], ['miriam_chukwu', 'Front row friendships hit different']]),
    c('who_shot', 'Ask who took it 🔎', 'Who took this one? The angle is from behind the photographers 👀', { m: { suspicion: 3 }, t: { zee: -1 } }, [['zee', 'My assistant. The one before you 🙂'], ['nnamdi_oraekwe', 'The one before you?? What happened to her 😳']], { if: 'accepted_pa_job' }),
  ],
  archive_zee_2: [
    c('kelvin_bday', 'Wish Kelvin 🎂', 'Happy belated, @kelvin_wright. Smile more, the Island can take it 🥃', { m: { romanceKelvin: 3, popularity: 1 }, t: { kelvin: 3, zee: 1 }, mem: { kelvin: 'You told him to smile more, under his sister’s post.' } }, [['kelvin', 'Noted.'], ['tari_briggs', 'He replied?? Kelvin replied??']]),
    c('delete', 'Back Kelvin 😂', '@kelvin_wright said delete this and she said no. Sibling energy 😂', { m: { popularity: 2 }, t: { kelvin: 2, zee: 1 } }, [['zee', 'He says that about everything.'], ['kelvin', 'And she never listens.']]),
    c('names', 'Ask about the names 🔎', 'Bello and Adebayo-Wright. Same parents, different surnames? Lagos family trees are long 👀', { m: { suspicion: 3 }, t: { kelvin: -2, zee: -2 }, mem: { kelvin: 'You asked publicly why he and Zee have different surnames.' } }, [['halima_bello', 'Long story, and none of us are allowed to tell it 😭'], ['kelvin', 'Ask me in person.']]),
    c('sweet', 'Keep it sweet 🥹', 'Siblings who post each other. Rare on this app 🥹', { m: { reputation: 2 }, t: { zee: 2 } }, [['zee', 'Don’t tell anyone I’m nice.']]),
    c('flirt', 'Flirty 😏', 'Annoying is a strong word. Mysterious, maybe 😏', { m: { romanceKelvin: 4, jealousy: 2 }, t: { kelvin: 2, zee: -2 }, mem: { zee: 'You flirted with her brother on her birthday post for him.' } }, [['zee', 'On MY post? 🙂'], ['miriam_chukwu', 'OHHHH 👀']], { if: 'locked_eyes_kelvin' }),
  ],
  archive_zee_3: [
    c('soft', 'Soft life wishes 🌴', 'Manifesting silk pyjamas from my Ajegunle bed 🌴😂', { m: { popularity: 2 }, t: { zee: 1 } }, [['kola_fashola', 'Ajegunle manifesting is powerful 😂'], ['zee', 'Start with the pyjamas. The pool comes later.']]),
    c('car', 'Clap back 💅', '“More than your car”? I don’t have a car. I win 💅', { m: { popularity: 4, reputation: 1 }, t: { zee: 2 } }, [['favoureze', 'NOT HER WINNING 😭'], ['zee', 'Okay that was good.']]),
    c('nocalls', 'Call her out 🙂', 'No calls but you texted me 14 times that Sunday 🙂', { m: { popularity: 3, jealousy: 2 }, t: { zee: -2 }, mem: { zee: 'You exposed her "no calls" Sunday as a work day.' } }, [['zee', 'Assistants don’t comment on schedules 🙂'], ['tari_briggs', 'The boss-assistant drama begins 🍿']], { if: 'accepted_pa_job' }),
    c('rest', 'Kind 🤍', 'Everyone needs one quiet day. Even queens 🤍', { m: { reputation: 2 }, t: { zee: 2, hauwa: 1 } }, [['hauwa', 'Especially queens.']]),
    c('pool', 'Ask about the pool 🔎', 'Is that the same pool from the party night? The tiles look familiar 👀', { m: { suspicion: 2 } }, [['zee', 'There’s only one pool. It’s mine.']]),
  ],

  /* =============================== TAMARA =============================== */
  archive_tamara_0: [
    c('mango', 'Memory lane 🥭', 'You fell off that mango tree and blamed me for 3 years 😭💚', { m: { loyalty: 3 }, t: { tamara: 4 }, mem: { tamara: 'You brought up the mango tree story on her page.' } }, [['tamara', 'Because you PUSHED ME 😭'], ['blessing_alabi', 'The Ajegunle lore 😂']]),
    c('proud', 'Proud of her 🥹', 'From that compound to 2.5M. I watched every step 💚', { m: { reputation: 2, loyalty: 2 }, t: { tamara: 3 } }, [['tamara', 'And you’re next 💚'], ['demola_shonowo', 'Ajegunle girls dey rise']]),
    c('fences', 'Tease 😂', 'Some sisters you climb fences with. Some sisters leave you on the fence 🙂', { m: { popularity: 2 }, t: { tamara: -1 } }, [['tamara', 'ONE TIME. I went for help 😭']]),
    c('changed', 'Hint at distance 🙂', 'Same compound, same tree. Different ZIP codes now 🙂', { m: { jealousy: 3 }, t: { tamara: -3 }, mem: { tamara: 'You hinted on her childhood post that she’s changed since moving to the Island.' } }, [['tamara', 'Don’t do that, Ada. Not here.'], ['anita_nwosu', 'Ouch. Tension in the friendship? 👀']], { if: 'accepted_pa_job' }),
    c('secret', 'Inside joke 🤫', 'The mango tree knows where we buried the secret box 🤫', { m: { suspicion: 2 }, t: { tamara: 2 } }, [['tamara', 'Some secrets stay buried 💚'], ['nnamdi_oraekwe', 'Secret box?? I need context 😳']]),
  ],
  archive_tamara_1: [
    c('sunrise', 'Hype the photo 🌅', 'This sunrise has more patience than the Lagos sun 🌅', { m: { popularity: 1 }, t: { tamara: 2 } }, [['tamara', 'Daddy’s crew sends one every morning 💚']]),
    c('chi_beef', 'Laugh at the beef 😂', 'Chioma and Tamara turning an oil rig sunrise into court 😭', { m: { popularity: 3 }, t: { chi: 1, tamara: 1 } }, [['anita_nwosu', 'The only thing more stable than crude oil is their beef 😂'], ['chi', 'There is no beef. There is accuracy.']]),
    c('defend', 'Defend Tamara 💚', '@chi_corporate_glam not everything is a deposition, Barrister 🙂', { m: { loyalty: 3, jealousy: 1 }, t: { tamara: 4, chi: -4 }, mem: { tamara: 'You defended her from Chioma’s oil price jab.', chi: 'You called her out on Tamara’s page.' } }, [['tamara', 'THANK YOU 💚'], ['chi', 'Noted, Ada.']]),
    c('question', 'Ask about work 🙂', 'What does your dad actually do on the rig? Asking for an engineering friend', { m: { reputation: 2 }, t: { tamara: 1 } }, [['tamara', 'Logistics. It’s boring, I promise 😂'], ['segun_bakare', 'Logistics on a rig is not boring 👀']]),
    c('money', 'Money talk 🔎', 'Offshore money and an offshore account. Lagos says the second part quietly 👀', { m: { suspicion: 3, popularity: 1 }, t: { tamara: -3 } }, [['tamara', 'Not funny, Ada.'], ['kene_okoli', 'Ada said what we were all thinking 😳']], { if: 'demanded_leak_answers' }),
  ],
  archive_tamara_2: [
    c('emerald', 'The emerald one 💚', 'The emerald one at the back. I know that one personally 💚', { m: { loyalty: 3 }, t: { tamara: 4 }, mem: { tamara: 'You called out the emerald gown on her archive post.' } }, [['tamara', 'It looked better on you 💚'], ['simi_solanke', 'THE emerald dress?? From the party??']], { if: 'borrowed_emerald_dress' }),
    c('thrift', 'Thrift pride ✂️', 'Gorgeous archive. My ₦4,500 thrift dress is still undefeated though ✂️', { m: { popularity: 3, reputation: 1 }, t: { tamara: -1, bisola: 2 } }, [['bisola', 'THRIFT SUPREMACY'], ['tamara', 'Okay, Yaba market queen 🙄💚']], { if: 'vintage_style_dress' }),
    c('secrets', 'Ask about the secrets 🗝️', '“Some have secrets.” Which ones? 👀🗝️', { m: { suspicion: 3 }, t: { tamara: 1 } }, [['tamara', 'A designer never tells 💚🗝️'], ['nnamdi_oraekwe', 'Why does everyone on this app talk in riddles 😭']]),
    c('bisola', 'Back Bisola 😂', '@bisola_vlogs lend her ONE, Tamara. Charity is attractive 😂', { m: { popularity: 2 }, t: { bisola: 2 } }, [['bisola', 'SEE?? The people have spoken 😩'], ['tamara', 'The people can buy their own gowns 💚']]),
    c('heritage', 'Respect the work 🧵', 'Every gown here is somebody’s hands. Respect to the tailors 🧵', { m: { reputation: 3 }, t: { tamara: 2, hauwa: 1 } }, [['tamara', 'Mama Ronke’s hands made half of these 💚']]),
    c('which', 'Pick a favourite 👗', 'The gold one in the middle is calling my name and my overdraft 👗😭', { m: { popularity: 2 }, t: { tamara: 2 } }, [['tamara', 'Your overdraft and I will have a meeting 💚'], ['simi_solanke', 'The gold one is a whole personality']]),
  ],
  archive_tamara_3: [
    c('hug', 'Check on her 🤍', 'Call me after the next one. Not the content version. The real one 🤍', { m: { loyalty: 4 }, t: { tamara: 4 }, mem: { tamara: 'You told her to call you after a hard shoot, not the content version.' } }, [['tamara', 'Always you 🤍'], ['favoureze', 'Friendship goals']]),
    c('honest', 'Praise the honesty', 'More honest posts like this. Less ring light, more truth', { m: { reputation: 2 }, t: { tamara: 2, hauwa: 1 } }, [['hauwa', 'Agreed 🌿']]),
    c('job', 'Joke 😂', 'Cry, lipstick, smile. The influencer national anthem 😂', { m: { popularity: 3 }, t: { tamara: 1 } }, [['kola_fashola', 'Nigerian influencers will put their hand on their chest for this 😂']]),
    c('who', 'Ask who drives 🔎', 'Who was driving while you cried? Asking because someone always sees 👀', { m: { suspicion: 3 }, t: { tamara: -2 } }, [['tamara', 'My driver, Ada. Who else?'], ['ronke_adewale', 'Why does this feel like an interrogation 😳']], { if: 'demanded_leak_answers' }),
    c('quiet', 'Just a heart ❤️', '❤️', { m: { popularity: 1 } }, [['tamara', '💚']]),
  ],

  /* ================================= CHI ================================= */
  archive_chi_0: [
    c('respect', 'Respect 🏆', 'Best Oralist. I believe it. You argued with me for 20 minutes about a door 😂', { m: { popularity: 2 }, t: { chi: 3 }, mem: { chi: 'You joked about arguing with her, and admitted she’s good.' } }, [['chi', 'And I was right about the door.'], ['kene_okoli', 'She’s always right about the door 😂']]),
    c('zee', 'Clap back for her 💅', '@zeebello she won a trophy. Your move 🙂', { m: { popularity: 3, jealousy: 2 }, t: { chi: 4, zee: -3 }, mem: { chi: 'You defended her moot win against Zee.', zee: 'You told her "your move" under Chioma’s trophy.' } }, [['chi', 'Thank you, Ada.'], ['zee', 'Cute 🙂']]),
    c('unilag', 'Hype 🔥', 'UNILAG is still looking for their dignity 🔥⚖️', { m: { popularity: 3 } }, [['kene_okoli', 'They filed a missing persons report 😂']]),
    c('matters', 'Ask what matters ⚖️', 'What would you win next, if you could pick? Real question', { m: { reputation: 2 }, t: { chi: 2 } }, [['chi', 'A seat at the table where the rules are written.']]),
    c('objection', 'Lawyer joke 😂', 'Objection: too much talent. Sustained 😂', { m: { popularity: 2 }, t: { chi: 2 } }, [['chi', 'Overruled. There’s no such thing.']]),
  ],
  archive_chi_1: [
    c('congrats', 'Congrats 💼', 'Eight brands, one boardroom. You make it look like a Tuesday 💼', { m: { reputation: 2 }, t: { chi: 3 } }, [['chi', 'It was a Wednesday.']]),
    c('bisola', 'Tease Bisola 😂', '@bisola_vlogs you’d have to stop using caps lock first 😂', { m: { popularity: 3 }, t: { bisola: -1, chi: 2 } }, [['bisola', 'NEVER 😤'], ['chi', 'She has a point.']]),
    c('guild', 'Guild politics 🔎', 'Apex vs Zee’s people for one Guild seat. Is that why the WhatsApp leak happened? 👀', { m: { suspicion: 4 }, t: { chi: -3 }, mem: { chi: 'You linked her agency to the Guild WhatsApp leak in public.' } }, [['chi', 'I’d be careful with public speculation, Ada.'], ['omowunmi_p', 'She asked what we were all thinking 😳']], { if: 'pressed_chioma' }),
    c('ask', 'Ask for advice 🙏', 'Any advice for a girl who just wants ONE brand deal? 🙏', { m: { reputation: 2, popularity: 1 }, t: { chi: 2 } }, [['chi', 'Know your rate before they tell you yours.'], ['amara_dike', 'Taking notes 📝']]),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['chi', '🙂']]),
  ],
  archive_chi_2: [
    c('fit', 'Encourage ⚖️', 'It will fit. Just not when they expect it ⚖️', { m: { reputation: 2 }, t: { chi: 4 }, mem: { chi: 'You told her Daddy’s wig will fit "just not when they expect it."' } }, [['chi', 'Thank you. Genuinely.'], ['hauwa', 'She’s right.']]),
    c('daddy', 'Ask about her dad', 'Your dad must be so proud. What case was he most known for?', { m: { reputation: 1 }, t: { chi: 1 } }, [['chi', 'The one he lost. He says that’s the one that taught him.']]),
    c('wig_joke', 'Joke 😂', 'The wig is giving lion King. Senior Advocate Simba 😂', { m: { popularity: 3 }, t: { chi: -1 } }, [['chinwe_agwu', 'SAN Simba 😭'], ['chi', 'Respect the robes, please.']]),
    c('pressure', 'Notice the pressure', 'That’s a lot of weight to try on for a photo. You okay? 🤍', { m: { loyalty: 2 }, t: { chi: 3 } }, [['chi', 'Fine. Always fine.'], ['hauwa', 'Always fine is never fine 🌿']], { if: 'cleared_chioma_camera' }),
    c('shade', 'Shade 🙂', 'Daddy’s robes, Daddy’s money, Daddy’s connections 🙂', { m: { popularity: 2, jealousy: 3 }, t: { chi: -5 }, mem: { chi: 'You mocked her father’s robes in public.' } }, [['chi', 'And my own brain, Ada. Don’t forget that part.'], ['tari_briggs', 'OH 😳']]),
  ],
  archive_chi_3: [
    c('novel', 'Expose the novel 😂', 'Is it the one with the lawyer who falls for the opposing counsel? 👀📚', { m: { popularity: 3 }, t: { chi: 2 } }, [['chi', 'Objection. Leading the witness.'], ['tamara', 'SHE DIDN’T DENY IT 💚']]),
    c('reading', 'Book swap 📚', 'Swap you my Chemistry notes for the romance novel. Fair trade 📚', { m: { reputation: 1 }, t: { chi: 2 } }, [['chi', 'That is not a fair trade. You’re getting the better deal.']]),
    c('tamara', 'Back Tamara 💚', '@tamara_reid the title, Chioma. We’re waiting 👀', { m: { popularity: 2 }, t: { tamara: 2, chi: -1 } }, [['tamara', 'SEE 💚']]),
    c('soft', 'Be kind', 'A little romance between contracts is healthy, Barrister 🤍', { m: { reputation: 2 }, t: { chi: 2 } }, [['chi', 'Tell no one.']]),
    c('torts', 'Lawyer question ⚖️', 'Quick one: can an anonymous page be sued if nobody knows who runs it? Asking for a whole house 🫖', { m: { suspicion: 3, reputation: 1 }, t: { chi: 2 } }, [['chi', 'Yes. You sue the account and subpoena the platform. It’s slow, but it works.'], ['kene_okoli', 'Ada is building a case 👀']], { if: 'demanded_leak_answers' }),
  ],

  /* ================================ BISOLA ================================ */
  archive_bisola_0: [
    c('100k', 'Celebrate 🎉', '100K FAMILY!!! Cracked iPhone 7 to this. We love a glow up 🎉', { m: { popularity: 2 }, t: { bisola: 4 }, mem: { bisola: 'You celebrated her 100K post like a real fan.' } }, [['bisola', 'ADA!!! You get it 😭💖'], ['folake_ade', 'OG fans unite']]),
    c('zee', 'Laugh at Zee 😂', '“Blur faces next time” is the most Zee comment ever 😂', { m: { popularity: 3 }, t: { bisola: 2, zee: -1 } }, [['zee', 'It’s called privacy.'], ['bisola', '😭😭']]),
    c('giveaway', 'Ask about the giveaway 🎁', 'Did anyone actually win the giveaway? Asking because nobody ever wins these 👀', { m: { suspicion: 2, popularity: 1 }, t: { bisola: -2 } }, [['bisola', 'YES someone won!! @simi_solanke tell them'], ['simi_solanke', 'I won a ring light. It fell on me 😭']]),
    c('iphone', 'Relate 📱', 'My iPhone 7 is still cracked. I’m loyal 📱😂', { m: { popularity: 2, reputation: 1 }, t: { bisola: 2 } }, [['bisola', 'The crack is character!!']]),
    c('numbers', 'Talk numbers 📈', 'Real question: how did you grow so fast after 90K? Everyone stalls there', { m: { suspicion: 2 }, t: { bisola: -1 } }, [['bisola', 'Consistency and prayer 🙏 and maybe a little drama'], ['omowunmi_p', '“A little drama” 👀']], { if: 'noted_bisola_motive' }),
  ],
  archive_bisola_1: [
    c('home', 'Congrats 🏠', 'Your own place in Lekki! Pepper soup housewarming when? 🏠', { m: { popularity: 1 }, t: { bisola: 3 } }, [['bisola', 'You’re invited first 💖']]),
    c('agency', 'Ask about the agency 🔎', 'Agency paid the lease? So who owns the apartment, technically? 👀', { m: { suspicion: 4 }, t: { bisola: -3 }, mem: { bisola: 'You asked publicly who really owns her apartment.' } }, [['bisola', 'Me!! Well… the contract says something long. It’s fine!!'], ['victor_osita', 'When the agency pays the rent, the agency owns the content 😬']]),
    c('hauwa', 'Agree with Hauwa 🌿', '@hauwa_mindbody “a home, not a set” should be printed on every Lekki door 🌿', { m: { reputation: 2 }, t: { hauwa: 3, bisola: 1 } }, [['hauwa', '🌿'], ['bisola', 'Fine, ONE room without a ring light']]),
    c('posting', 'Joke 😂', '“Cannot stop posting” is a lifestyle, not a problem 😂', { m: { popularity: 2 }, t: { bisola: 2 } }, [['bisola', 'FINALLY someone understands']]),
    c('worried', 'Gently worried 🤍', 'Hope the lease isn’t one of those contracts that owns your life too 🤍', { m: { loyalty: 2 }, t: { bisola: 2 } }, [['bisola', 'It’s… complicated. DM me later?'], ['hauwa', 'Kind of you, Ada.']], { if: 'helped_bisola' }),
  ],
  archive_bisola_2: [
    c('pro', 'Respect 😂', 'Ring light falls, the show goes on. Nigerian broadcasting at its finest 😂', { m: { popularity: 3 }, t: { bisola: 3 } }, [['bisola', 'PROFESSIONAL 😤'], ['kola_fashola', 'NTA could never']]),
    c('tamara', 'Back Tamara 💚', '@tamara_reid wait, it was YOUR ring light? 😭', { m: { popularity: 2 }, t: { tamara: 2 } }, [['tamara', 'Borrowed. Never returned. Sound familiar? 🙄💚'], ['bisola', 'It was a GIFT in my heart']]),
    c('clip', 'Ask for the clip 🎬', 'I need the clip. For my mental health 😭', { m: { popularity: 2 }, t: { bisola: 2 } }, [['bisola', 'Deleted. My dignity requested it.']]),
    c('safe', 'Check on her 🤍', 'Wait, are you okay?? Those things are heavy!', { m: { reputation: 2 }, t: { bisola: 3 } }, [['bisola', 'Only my pride was hurt 😭💖']]),
    c('deleted', 'Notice deletions 🔎', 'You delete a lot of clips, Bisola. Where do they go? 👀', { m: { suspicion: 3 }, t: { bisola: -2 } }, [['bisola', 'To the trash?? Where else 😅'], ['nnamdi_oraekwe', 'The trash of the Content House is a crime scene 😭']], { if: 'investigated_comments' }),
  ],
  archive_bisola_3: [
    c('help', 'Help her numbers 📈', 'Commenting to help the algorithm. You’re welcome 📈', { m: { popularity: 2 }, t: { bisola: 3 } }, [['bisola', 'ADA 😭 my real one'], ['demola_shonowo', 'We’re all working for Bisola now']]),
    c('caps', 'Side with Chi 😂', '@chi_corporate_glam it might be the caps, sis 😂', { m: { popularity: 2 }, t: { chi: 2, bisola: -1 } }, [['bisola', 'ADA WHY 😩'], ['chi', 'Thank you.']]),
    c('worry', 'Worry about her 🤍', 'Don’t let 3% decide your week. You’re more than the graph 🤍', { m: { reputation: 2 }, t: { bisola: 4 }, mem: { bisola: 'You told her she’s more than the engagement graph.' } }, [['bisola', 'I needed that today 🥺'], ['hauwa', '🌿']]),
    c('pressure', 'Ask about pressure 🔎', 'Does the agency punish you when the numbers drop? Asking seriously', { m: { suspicion: 3 }, t: { bisola: 1 } }, [['bisola', 'They “review the partnership”. It’s fine!! 😅'], ['victor_osita', 'That’s not fine 😬']], { if: 'noted_bisola_motive' }),
    c('drama', 'Joke about drama 😂', 'Just leak something. Works for @TheLagosTea 😂', { m: { popularity: 3, jealousy: 2 }, t: { bisola: -2 } }, [['bisola', 'Not funny!!'], ['anita_nwosu', 'Ada said it with her whole chest 😳']]),
  ],

  /* ================================ HAUWA ================================ */
  archive_hauwa_0: [
    c('peace', 'Find peace 🌿', 'This made Lagos feel quiet for one second. Thank you 🌿', { m: { reputation: 2 }, t: { hauwa: 3 } }, [['hauwa', 'Hold onto the second 🌿']]),
    c('bisola', 'Laugh with Bisola 😂', '@bisola_vlogs she’s awake at dawn because she never sleeps. She just watches 😂', { m: { popularity: 2 }, t: { bisola: 1, hauwa: -1 } }, [['bisola', 'CREEPY BUT TRUE'], ['hauwa', 'Someone has to.']]),
    c('matcha', 'Ask about matcha 🍵', 'Matcha before sunrise? Teach me your discipline 🍵', { m: { reputation: 1 }, t: { hauwa: 2 } }, [['hauwa', 'It starts with putting the phone down. That’s the hard part.']]),
    c('watcher', 'Notice something 🔎', 'You’re always up when the house is quiet. Ever see anything you shouldn’t? 👀', { m: { suspicion: 3 }, t: { hauwa: -1 } }, [['hauwa', 'I see everything I should, Ada.'], ['nnamdi_oraekwe', 'That answer gave me chills 😳']], { if: 'accepted_pa_job' }),
    c('quiet', 'Just a heart 🤍', '🤍', { m: { popularity: 1 } }, [['hauwa', '🤍']]),
  ],
  archive_hauwa_1: [
    c('indigo', 'Admire it 💙', 'Five hundred years in one colour. That’s the most patient thing on this app 💙', { m: { reputation: 3 }, t: { hauwa: 3 }, mem: { hauwa: 'You admired the Kano dye pits as patience, not just pretty.' } }, [['hauwa', 'You understood it exactly.'], ['halima_bello', 'Kano stand up 💙']]),
    c('grandma', 'Ask about grandma 👵🏾', 'Your grandmother has the same eyes as you. Does she watch people too? 😊', { m: { reputation: 1 }, t: { hauwa: 2 } }, [['hauwa', 'She taught me. She says watching is a form of prayer.']]),
    c('adire', 'Lagos adire 😂', 'Yaba adire sellers seeing this and adjusting their prices 😂', { m: { popularity: 3 } }, [['kola_fashola', 'Prices up 30% by Monday 😂']]),
    c('chi', 'Notice Chi 🔎', 'Chioma liking every one of your posts. You two are closer than people think 👀', { m: { suspicion: 3 }, t: { chi: -1, hauwa: -1 } }, [['chi', 'We have manners, Ada. Unlike some pages.'], ['hauwa', 'Chioma is family.']], { if: 'retreated_silent_intel' }),
    c('visit', 'Want to go 🧳', 'Adding Kano to my list. Will you show me the pits? 🧳', { m: { loyalty: 2 }, t: { hauwa: 3 } }, [['hauwa', 'If you can wake at dawn, yes.']]),
  ],
  archive_hauwa_2: [
    c('hide', 'Quote her 🏛️', '“Every room needs a place to hide.” Why does that sound like a warning 😳', { m: { suspicion: 3 }, t: { hauwa: 1 } }, [['hauwa', 'It’s design advice. Mostly.'], ['nnamdi_oraekwe', 'MOSTLY 😭']]),
    c('zee', 'Laugh at Zee 😂', '@zeebello she said your villa has enough hiding places 😂 the read', { m: { popularity: 3 }, t: { zee: -1, hauwa: 1 } }, [['zee', 'Everyone’s a comedian today.']]),
    c('design', 'Talk design 📐', 'What do you put in the hiding place? Books? Snacks? A whole personality?', { m: { popularity: 1 }, t: { hauwa: 2 } }, [['hauwa', 'Whatever a person needs to survive the rest of the house.']]),
    c('archive', 'Connect it 🔎', 'Did you design the archive room in Zee’s house too? The one with the old lock? 👀', { m: { suspicion: 5 }, t: { hauwa: -2 }, mem: { hauwa: 'You asked in public whether she designed the archive room.' } }, [['hauwa', 'I consulted on the furniture. Locks are not my department.'], ['tari_briggs', 'Why is Ada asking about locks 😳']], { if: 'inspected_burner_phone' }),
    c('respect', 'Respect 🤍', 'Designing for people, not for photos. Rare 🤍', { m: { reputation: 2 }, t: { hauwa: 3 } }, [['hauwa', 'Thank you, Ada.']]),
  ],
  archive_hauwa_3: [
    c('honest', 'Honest hands 📿', 'Hands that stay honest. I need that kind of jewellery 📿', { m: { reputation: 2 }, t: { hauwa: 3 } }, [['hauwa', 'Your hands are fine. Watch your eyes 🙂']]),
    c('ex', 'Laugh at Favour 😂', '@favoureze the ex DMs bracelet would sell out in Lekki 😂', { m: { popularity: 3 } }, [['favoureze', 'I’ll be the first customer 😭']]),
    c('grandma', 'Ask about grandma 📿', 'What else did your grandmother say about hands?', { m: { reputation: 1 }, t: { hauwa: 2 } }, [['hauwa', 'That busy hands hide busy hearts.']]),
    c('jade_seen', 'I’ve seen these 🔎', 'I’ve seen these beads somewhere recently. Can’t remember where 👀', { m: { suspicion: 3 }, t: { hauwa: -2 } }, [['hauwa', 'I wear them every day, Ada. Everywhere.'], ['nnamdi_oraekwe', 'Plot thickens 😳']], { if: 'photographed_tea_phone' }),
    c('tamara', 'Notice Tamara 💚', 'Tamara likes everything green, beads included 😂', { m: { popularity: 1 }, t: { tamara: 1 } }, [['tamara', 'It’s a lifestyle 💚']]),
  ],

  /* ================================ CHIDI ================================ */
  archive_chidi_0: [
    c('gallery', 'Praise the work 🎞️', 'Nobody here is performing. That’s why it’s the best photo on this app 🎞️', { m: { romanceChidi: 3, reputation: 1 }, t: { chidi: 3 }, mem: { chidi: 'You said his Oshodi photo was the best on Gidigram because nobody is performing.' } }, [['chidi', 'That’s exactly why I took it.'], ['ngozi_uche', 'She gets it']]),
    c('okada', 'Joke 😂', 'The okada man’s eye contact is giving main character 😂', { m: { popularity: 2 }, t: { chidi: 1 } }, [['kene_okoli', 'He knew he was famous 😂'], ['chidi', 'He asked for a print. I gave him two.']]),
    c('6am', 'Ask about the hour 🌅', 'What were you doing in Oshodi at 6AM? 👀', { m: { romanceChidi: 1 }, t: { chidi: 1 } }, [['chidi', 'Waiting for the light. It’s honest at that hour.']]),
    c('flirt', 'Flirty 😏', 'You make survival look like art. Dangerous skill 😏', { m: { romanceChidi: 4, jealousy: 1 }, t: { chidi: 2 } }, [['chidi', 'Says the girl who survives Banana Island 🙂'], ['miriam_chukwu', 'THE CHEMISTRY 😭']], { if: 'flirted_with_chidi' }),
    c('ajegunle', 'Ajegunle next 📸', 'Do Ajegunle at 6AM next. I’ll show you the real light', { m: { romanceChidi: 2, loyalty: 1 }, t: { chidi: 3 } }, [['chidi', 'Deal. Bring the pepper soup.']]),
  ],
  archive_chidi_1: [
    c('juju', 'Laugh 😂', 'Your mum praying over the red light is the most Nigerian thing I’ve read today 😂', { m: { popularity: 3 }, t: { chidi: 2 } }, [['chidi', 'She still sprinkles anointing oil on my enlarger.']]),
    c('film', 'Ask about film 🎞️', 'Why film and not digital? Real question', { m: { romanceChidi: 2 }, t: { chidi: 2 } }, [['chidi', 'Film can’t be edited without leaving a trace. I like things that can’t lie.']]),
    c('trace', 'Remember the trace 🔎', '“Film can’t lie.” Is that why you check photo metadata like a detective? 👀', { m: { suspicion: 2, romanceChidi: 1 }, t: { chidi: 1 } }, [['chidi', 'Old habits. Pixels gossip too.']], { if: 'chidi_exif_search' }),
    c('visit', 'Ask for a tour 😏', 'Can I see the darkroom? Strictly for science 😏', { m: { romanceChidi: 4, jealousy: 1 }, t: { chidi: 2 } }, [['chidi', 'It’s very small and very red. You’ve been warned 🙂'], ['adaeze_nwosu', 'SCIENCE 😭']]),
    c('support', 'Support 🤍', 'Built from a store room. That’s the whole story of Lagos creatives 🤍', { m: { reputation: 2 }, t: { chidi: 2 } }, [['femi_ajayi', 'Store room to gallery. Watch.']]),
  ],
  archive_chidi_2: [
    c('kelvin', 'Back Chidi 💪', '@kelvin_wright he has a real job. He does it better than most people do theirs 🙂', { m: { romanceChidi: 3, romanceKelvin: -2 }, t: { chidi: 4, kelvin: -3 }, mem: { chidi: 'You defended his photography against Kelvin in public.', kelvin: 'You took Chidi’s side against him on Gidigram.' } }, [['chidi', 'Appreciate that.'], ['kelvin', 'Noted, Ada.']]),
    c('rent', 'Relate 😅', 'Landlords saying “young artist” in that tone is a national crisis 😅', { m: { popularity: 2 }, t: { chidi: 2 } }, [['chidi', 'Exactly that tone.']]),
    c('both', 'Peacemaker 🕊️', 'Kelvin offering a job is lowkey sweet, Chidi saying no is lowkey iconic. Everyone wins 🕊️', { m: { reputation: 2 }, t: { chidi: 1, kelvin: 1 } }, [['tari_briggs', 'Diplomat Ada 😂']]),
    c('history', 'Ask about the beef 🔎', 'You two clearly have history. What happened? 👀', { m: { suspicion: 3 }, t: { chidi: -1, kelvin: -1 } }, [['chidi', 'Ask him.'], ['kelvin', 'Ask him.']], { if: 'sided_with_chidi' }),
    c('weddings', 'Book him 💍', 'Three weddings in one weekend? Who’s booking you for the fourth 💍😂', { m: { popularity: 2 }, t: { chidi: 1 } }, [['chidi', 'My mum, eventually. She has a list.']]),
  ],
  archive_chidi_3: [
    c('mama', 'Feel it 🤎', 'This one made me miss my mum’s hands too 🤎', { m: { romanceChidi: 2, loyalty: 2 }, t: { chidi: 4 }, mem: { chidi: 'You told him his mother’s hands photo made you miss your own mum.' } }, [['chidi', 'Tell her I said thank you for raising you.'], ['ngozi_uche', 'I’m crying again']]),
    c('egusi', 'Ask for egusi 😂', 'Is the egusi available or is it only for art? 😂', { m: { popularity: 2 }, t: { chidi: 2 } }, [['chidi', 'Next time I’m in Enugu, I’m bringing you a bowl.']]),
    c('portrait', 'Praise the honesty', 'Honest portraits are rare in a city of filters', { m: { reputation: 2 }, t: { chidi: 2, hauwa: 1 } }, [['hauwa', 'This one stays with you 🤎']]),
    c('flirt', 'Soft flirt 😊', 'A man who photographs his mother like this… noted 😊', { m: { romanceChidi: 4 }, t: { chidi: 2 } }, [['chidi', 'Noted for what, Ada? 🙂'], ['miriam_chukwu', 'I’m SCREAMING']], { if: 'chidi_romantic_moment' }),
    c('quiet', 'Just a heart 🤎', '🤎', { m: { popularity: 1 } }, [['chidi', '🤎']]),
  ],

  /* ================================ KELVIN ================================ */
  archive_kelvin_0: [
    c('boat', 'Flirty 😏', 'The lagoon doesn’t do traffic, and you don’t do captions longer than 5 words 😏', { m: { romanceKelvin: 4, jealousy: 1 }, t: { kelvin: 3 }, mem: { kelvin: 'You teased him about his five-word captions.' } }, [['kelvin', 'Four.'], ['miriam_chukwu', 'He counted 😭']]),
    c('zee', 'Laugh at Zee 😂', '@zeebello “fill the tank” is siblings in three words 😂', { m: { popularity: 2 }, t: { zee: 1, kelvin: 1 } }, [['zee', 'He never fills the tank.']]),
    c('danfo', 'Ajegunle reality 🚌', 'Meanwhile I spent 2 hours on Third Mainland this morning 🚌😭', { m: { popularity: 2, reputation: 1 }, t: { kelvin: 1 } }, [['kelvin', 'Next time, take the boat.'], ['kola_fashola', 'He said take the boat like it’s a bus 😭']]),
    c('ride', 'Remember the ride 🏎️', 'Boats, Porsches… is there anything you don’t drive? 👀', { m: { romanceKelvin: 3 }, t: { kelvin: 2 } }, [['kelvin', 'My own decisions, apparently.']], { if: 'drove_with_kelvin' }),
    c('dig', 'Ask whose boat 🔎', 'Is the boat yours or Wright Estates’? Asking because receipts are the theme this week 👀', { m: { suspicion: 3 }, t: { kelvin: -2 } }, [['kelvin', 'Everything I own is owned by something else, Ada.']], { if: 'suspected_kelvin_family' }),
    c('ride_offer', 'Ask for a ride 🌊', 'Is there space on the boat for someone who has never seen the lagoon from the water? 🌊', { m: { romanceKelvin: 3 }, t: { kelvin: 2 } }, [['kelvin', 'There’s always space. Say when.'], ['miriam_chukwu', 'She shot her shot on a boat post 😭']], { ifNot: 'drove_with_kelvin' }),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['kelvin', '🌊']]),
  ],
  archive_kelvin_1: [
    c('congrats', 'Congrats 🎓', 'LSE and back home. Lagos missed you (allegedly) 🎓', { m: { romanceKelvin: 2 }, t: { kelvin: 2 } }, [['kelvin', 'Allegedly is right.']]),
    c('polo', 'Laugh 😂', '@tari_briggs “Polo?” took him out 😂', { m: { popularity: 3 }, t: { kelvin: -1 } }, [['tari_briggs', 'Somebody had to say it 😂']]),
    c('lessons', 'Ask about lessons 🤔', 'What’s the first real lesson Lagos taught you?', { m: { romanceKelvin: 2, reputation: 1 }, t: { kelvin: 3 } }, [['kelvin', 'That everyone smiling at you wants something. Except, so far, you.']]),
    c('heir', 'Heir talk 🔎', 'Wright Estates heir is home. Who’s nervous? 👀', { m: { suspicion: 2 }, t: { kelvin: -1 } }, [['halima_bello', 'Everyone with an unpaid service charge 😭']]),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['kelvin', '🥃']]),
  ],
  archive_kelvin_2: [
    c('basement', 'Ask about the basement 🔎', 'Some have two basements? What’s in the second one, Kelvin? 👀', { m: { suspicion: 4 }, t: { kelvin: -2, chi: 1 }, mem: { kelvin: 'You asked publicly what’s in his family’s "second basement".' } }, [['kelvin', 'Wine. Mostly.'], ['chi', 'Mostly.']]),
    c('smile', 'Read it 😅', '“Everybody smiled. Nobody meant it.” Banana Island in six words 😅', { m: { popularity: 2 }, t: { kelvin: 2 } }, [['kelvin', 'Seven. But yes.']]),
    c('support', 'Encourage 🤝', 'First of many. Hope you get to be yourself in that room someday 🤝', { m: { romanceKelvin: 3 }, t: { kelvin: 3 } }, [['kelvin', 'That’s a kind thing to say to a man in a suit.']]),
    c('warning', 'Remember his warning 🔎', 'You warned me about this world. Now I see why 👀', { m: { suspicion: 2, romanceKelvin: 1 }, t: { kelvin: 1 } }, [['kelvin', 'I warned you because I like you, Ada. Remember that.']], { if: 'kelvin_confronted_warning' }),
    c('chi', 'Laugh at Chi 😂', 'Chioma and Kelvin having a whole chess match in the comments 😂', { m: { popularity: 2 } }, [['omowunmi_p', 'Billionaire chess 😭']]),
  ],
  archive_kelvin_3: [
    c('fell', 'Tease 😂', 'You fell off the HORSE?? Zee, video please 😂', { m: { popularity: 3, romanceKelvin: 1 }, t: { kelvin: 1, zee: 2 } }, [['zee', 'Sending it to your DMs 🙂'], ['kelvin', 'Zee. No.']]),
    c('afterparty', 'Flirty 😏', 'Losing the match and winning the after-party sounds like a skill 😏', { m: { romanceKelvin: 4, jealousy: 1 }, t: { kelvin: 2 } }, [['kelvin', 'You should see me win something that matters.']]),
    c('real', 'Real life 🙂', 'Polo Sunday. My Sunday was 3 hours of tutoring and one meat pie 🙂', { m: { reputation: 2 }, t: { kelvin: 1 } }, [['kelvin', 'Your Sunday sounds more honest than mine.']]),
    c('horse', 'Horse joke 🐎', 'The horse is the real winner here 🐎', { m: { popularity: 2 } }, [['miriam_chukwu', 'The horse said no more 😭']]),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['kelvin', '🙂']]),
  ],

  /* ================================= DAYO ================================= */
  archive_dayo_0: [
    c('drop', 'Demand the drop 🎧', 'Drop it. My generator is already humming in rhythm 🎧', { m: { romanceDayo: 3 }, t: { dayo: 3 }, mem: { dayo: 'You told him your generator was humming in rhythm with his beat.' } }, [['dayo', 'Generator percussion. Now THAT’S an idea 🎛️'], ['simi_solanke', 'He’s going to sample a tiger gen 😭']]),
    c('3am', 'Night owl 🌙', 'Some essays only come out at 3AM too. Solidarity 🌙', { m: { romanceDayo: 2, reputation: 1 }, t: { dayo: 2 } }, [['dayo', '3AM club. No sleep, only work.']]),
    c('bisola', 'Laugh at Bisola 😂', '@bisola_vlogs shooting her shot in a beat preview 😂', { m: { popularity: 2 }, t: { bisola: 1 } }, [['bisola', 'A girl can dream 😩']]),
    c('flirt', 'Flirty 😏', 'What does the beat sound like? Describe it. I have a good imagination 😏', { m: { romanceDayo: 4, jealousy: 1 }, t: { dayo: 2 } }, [['dayo', 'Like someone who doesn’t belong in the room, walking in anyway.'], ['miriam_chukwu', 'WHO IS HE TALKING ABOUT 👀']]),
    c('who', 'Ask who it’s for 🔎', 'Who’s the beat for? Afrobeats artist or someone special? 👀', { m: { suspicion: 1, romanceDayo: 1 }, t: { dayo: 1 } }, [['dayo', 'Undecided. Depends who earns it.']]),
  ],
  archive_dayo_1: [
    c('credit', 'Back him 🎛️', 'Credit the producer. If they can steal the beat they can type a name 🎛️', { m: { reputation: 3 }, t: { dayo: 4 }, mem: { dayo: 'You backed him publicly on producer credits.' } }, [['dayo', 'Exactly that. Thank you.'], ['demola_shonowo', 'Ada knows 💯']]),
    c('names', 'Ask for names 🔎', 'They know themselves… but do we know them? 👀 Names, Dayo', { m: { suspicion: 3, popularity: 1 }, t: { dayo: -1 } }, [['dayo', 'Some names cost more to say than to keep.'], ['nnamdi_oraekwe', 'That’s a lot of mystery for one beat 😳']]),
    c('credit_story', 'Relate ✍️', 'Somebody once submitted my essay with their name on it. I know the feeling ✍️', { m: { romanceDayo: 2, reputation: 1 }, t: { dayo: 3 } }, [['dayo', 'Then you know. It doesn’t leave you.']]),
    c('stolen', 'Connect it 🔎', 'Stolen credit is a motive, you know. People do crazy things for credit 👀', { m: { suspicion: 4 }, t: { dayo: -2 } }, [['dayo', 'Careful. I’m a producer, not a suspect 🙂'], ['tari_briggs', 'Ada sees motives everywhere now 😭']], { if: 'demanded_leak_answers' }),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['dayo', '🎛️']]),
  ],
  archive_dayo_2: [
    c('piano', 'Feel it 🎹', 'Three broken keys and the best instrument you own. That’s the kind of thing I trust 🎹', { m: { romanceDayo: 3, loyalty: 1 }, t: { dayo: 4 }, mem: { dayo: 'You said you trust broken things that still work, under his mum’s piano.' } }, [['dayo', 'Same. Broken but still working is the most honest thing.'], ['grace_okeke', '🥹']]),
    c('church', 'Church boy 😂', 'Church boys always become producers and then never come to church 😂', { m: { popularity: 3 }, t: { dayo: 1 } }, [['dayo', 'I go! Sometimes. Easter 😂']]),
    c('mum', 'Ask about his mum 🤍', 'Does your mum still play?', { m: { romanceDayo: 2 }, t: { dayo: 2 } }, [['dayo', 'Every Sunday. She says I play like I’m in a hurry.']]),
    c('hauwa', 'Notice Hauwa 🌿', 'Hauwa replying “honest music” to you is the softest thing on here 🌿', { m: { popularity: 1 }, t: { hauwa: 1 } }, [['hauwa', 'It was true.']]),
    c('play', 'Ask him to play 🎶', 'Play something on it for me one day?', { m: { romanceDayo: 4 }, t: { dayo: 2 } }, [['dayo', 'If you come to Ibadan, I’ll play you the broken keys 🙂']]),
  ],
  archive_dayo_3: [
    c('congrats', 'Congrats 🙏🏾', 'Two placements!! Mama, we dey studio indeed 🙏🏾', { m: { romanceDayo: 2 }, t: { dayo: 3 } }, [['dayo', 'Mama is already telling the whole church.']]),
    c('kelvin', 'Notice Kelvin 🔎', 'Kelvin saying congrats in two words. You two must know each other well 👀', { m: { suspicion: 2 }, t: { kelvin: -1, dayo: -1 } }, [['kelvin', 'We were in school together.'], ['dayo', 'Something like that.']]),
    c('tamara', 'Agree with Tamara 💚', 'Producer of the year loading. Tamara said it first, I’m saying it louder 💚', { m: { popularity: 1 }, t: { tamara: 1, dayo: 2 } }, [['tamara', 'Team Dayo 💚']]),
    c('flirt', 'Flirty 😏', 'Two placements and still answering DMs at 3AM? Humble 😏', { m: { romanceDayo: 4, jealousy: 2 }, t: { dayo: 2 } }, [['dayo', 'Only certain DMs 🙂'], ['miriam_chukwu', 'CERTAIN DMS 👀']]),
    c('heart', 'Like ❤️', '❤️', { m: { popularity: 1 } }, [['dayo', '🙏🏾']]),
  ],

  /* ============================== LAGOS TEA ============================== */
  archive_lagos_tea_0: [
    c('receipts', 'Challenge it 💅', 'Receipts without context are just paper 💅', { m: { popularity: 3, reputation: 1 }, t: {} }, [['lagos_tea', 'Context is for people with something to hide 🫖'], ['kene_okoli', 'Ada vs Lagos Tea on a 2-year-old post 😳']]),
    c('ndpa', 'Legal 🤓', '@kene_okoli The NDPA is about to have its most iconic case 🤓', { m: { reputation: 2 } }, [['kene_okoli', 'I will be in the gallery with popcorn']]),
    c('who', 'Ask who 🔎', 'Who started this page? Somebody remembers the first follower 👀', { m: { suspicion: 4 } }, [['lagos_tea', 'My first follower was curiosity. My second was you 🫖'], ['miriam_chukwu', 'IT REPLIED 😭']]),
    c('ignore', 'Ignore it 🙂', 'Scrolling past. Healing is free 🙂', { m: { reputation: 3 } }, [['ronke_adewale', 'The maturity 🙏']]),
    c('warn', 'Warn them ⚠️', 'One day the person behind this page will be in the receipts. Mark the date ⚠️', { m: { popularity: 3, suspicion: 2 } }, [['lagos_tea', 'Dated. Screenshotted. Thanks, Ada 🫖'], ['solomon_ekong', 'Ada just declared war 😳']], { if: 'demanded_leak_answers' }),
  ],
  archive_lagos_tea_1: [
    c('bisola', 'Defend Bisola 💖', 'Leave Bisola’s bag alone. She bought it with her own ring light money 💖', { m: { loyalty: 2, popularity: 1 }, t: { bisola: 3 } }, [['bisola', 'IT’S NOT EVEN MY BAG 😭 but thank you'], ['folake_ade', 'Ada defending her blindly 😂']]),
    c('stitch', 'Joke 😂', 'A stitch error the size of Third Mainland is still faster than Third Mainland 😂', { m: { popularity: 4 } }, [['kola_fashola', 'Ada’s Gidigram comedy is undefeated 😂']]),
    c('who', 'Ask who 🔎', 'Who sent you a close-up of a bag lining? That’s someone in the room 👀', { m: { suspicion: 4 } }, [['lagos_tea', 'Everyone is in the room, Ada. That’s the point 🫖'], ['nnamdi_oraekwe', 'She’s thinking like a detective now']]),
    c('fake', 'Small girl energy 👜', 'Fake or real, the girl carrying it is still paying her rent. Respect 👜', { m: { reputation: 3 } }, [['ronke_adewale', 'Facts']]),
    c('heart', 'Stay out 🙂', 'Not my business. Not my bag 🙂', { m: { reputation: 1 } }, [['favoureze', 'Neutral queen']]),
  ],
  archive_lagos_tea_2: [
    c('whatsapp', 'Ask about the leak 🔎', 'Whoever screenshotted that WhatsApp group was IN the group. Simple maths 👀', { m: { suspicion: 5 } }, [['lagos_tea', 'Good maths. Wrong answer 🫖'], ['chi', 'Thank you, Ada.']]),
    c('chi', 'Back Chi ⚖️', '@chi_corporate_glam it IS defamation if it’s edited. Was it edited? 👀', { m: { reputation: 2 }, t: { chi: 3 } }, [['chi', 'Every word was cropped from a longer message.'], ['omowunmi_p', 'Cropped is not edited, sis 👀']]),
    c('agencies', 'Laugh 😂', 'Two agencies fighting over one seat like Lagos landlords 😂', { m: { popularity: 3 } }, [['kola_fashola', 'And the tenant is suffering 😂']]),
    c('who_benefits', 'Who benefits? 🔎', 'Ask who gained when this leaked. That’s usually the answer 👀', { m: { suspicion: 4 } }, [['lagos_tea', 'Everyone gains when the truth comes out 🫖'], ['tari_briggs', 'That is not a denial 😳']], { if: 'pressed_chioma' }),
    c('ignore', 'Don’t feed it 🙂', 'Not feeding the kettle today 🙂', { m: { reputation: 2 } }, [['ronke_adewale', '🙏']]),
  ],
  archive_lagos_tea_3: [
    c('try', 'Try me 💅', 'Every queen has a secret. Some of us just have overdue fees 💅', { m: { popularity: 4, reputation: 2 } }, [['lagos_tea', 'We already know about the fees, Ada 🫖'], ['miriam_chukwu', 'THE PAGE KNOWS 😭']]),
    c('zee', 'Laugh at Zee 😂', '@zeebello replying “try me” to an anonymous page is peak Island 😂', { m: { popularity: 2 }, t: { zee: -1 } }, [['zee', 'I don’t hide.']]),
    c('collect', 'Ask about collecting 🔎', '“I collect them.” Where do you keep the collection? On a phone? In a drawer? 👀', { m: { suspicion: 5 } }, [['lagos_tea', 'Somewhere you’ll never find it 🫖'], ['nnamdi_oraekwe', 'Why did Ada say drawer 😳']], { if: 'inspected_burner_phone' }),
    c('next', 'Predict 👀', 'Who’s next? My guess: whoever is reading this 👀', { m: { popularity: 2, suspicion: 2 } }, [['solomon_ekong', 'Everyone just looked behind them 😭']]),
    c('heal', 'Pray for them 🙏', 'Praying for whoever runs this page. Loneliness is loud 🙏', { m: { reputation: 3 } }, [['lagos_tea', 'Pray for yourself, Ada 🫖']]),
  ],
};
