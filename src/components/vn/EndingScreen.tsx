import React from 'react';
import { EndingType, HeroineCustomization, Meters } from '../../types/vn';
import { HeroineSvg } from '../svg/HeroineSvg';
import { RotateCcw, ShieldCheck, Heart, Award, Skull, Sparkles, Music, Mail } from 'lucide-react';
import { SECRET_CLUE_THRESHOLD, SECRET_ENDING } from '../../data/secretEnding';

interface EndingScreenProps {
  ending: EndingType;
  heroine: HeroineCustomization;
  meters: Meters;
  /** Clues found this playthrough (unlocks the secret ending after a good ending) */
  cluesFound?: number;
  onRestart: (resetCustomization: boolean) => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  ending,
  heroine,
  meters,
  cluesFound = 0,
  onRestart,
}) => {
  const [showSecret, setShowSecret] = React.useState(false);
  const isBad = ending === 'bad' || ending.endsWith('_bad');
  const secretUnlocked = !isBad && cluesFound >= SECRET_CLUE_THRESHOLD;
  const partner = (n: string) => `${n} & ${heroine.name}`;

  const getEndingDetails = () => {
    switch (ending) {
      /* ------------------------------ Good endings ------------------------------ */
      case 'chidi':
        return {
          title: 'ENDING 1: THROUGH THE LENS',
          subtitle: 'Truth, Unmasked • ' + partner('Chidi'),
          icon: Heart,
          color: 'from-pink-500 to-rose-600',
          textColor: 'text-rose-400',
          description: `You unmasked @TheLagosTea in front of three million people, then walked to a darkroom in Yaba where the red light was already on. Chidi gave you the photo from the gala: you, laughing, brave. He sold one photo of you once. This one, he said, would never be for sale. Months later his first exhibition opened on the mainland. Every picture was of Lagos. The last one was of you.`,
          verdict: 'The Culprit Unmasked • Romance',
        };
      case 'kelvin':
        return {
          title: 'ENDING 2: FAST, NOT QUIET',
          subtitle: 'Truth, Unmasked • ' + partner('Kelvin'),
          icon: ShieldCheck,
          color: 'from-amber-500 to-emerald-600',
          textColor: 'text-emerald-400',
          description: `You unmasked @TheLagosTea live, then went to Ilashe with Kelvin for the festival of the families he gave the land back to. An old fisherman made him dance. Kelvin asked his question again on the sand, with no ring at all. You told him to ask again in a year, when you had both finished growing up. He set a reminder on his phone. A year later, to the minute, he asked.`,
          verdict: 'The Culprit Unmasked • Romance',
        };
      case 'dayo':
        return {
          title: 'ENDING 3: WINDOW',
          subtitle: 'Truth, Unmasked • ' + partner('Dayo'),
          icon: Sparkles,
          color: 'from-purple-500 to-indigo-600',
          textColor: 'text-purple-400',
          description: `You unmasked @TheLagosTea live, then climbed the stairs on Alhaji Masha Road to a studio with a piano missing three keys. “Window” came out a month later, credited: written by Dayo Martins and Adaeze Obi. It went to number one. The bridge is your voice, humming, a little out of tune. He refused to fix it. He said it was the best part.`,
          verdict: 'The Culprit Unmasked • Romance',
        };
      case 'independent':
        return {
          title: 'ENDING 4: THE GIRL FROM THE KIOSK',
          subtitle: 'Truth, Unmasked • ' + heroine.name + ', on her own terms',
          icon: Award,
          color: 'from-amber-400 to-yellow-600',
          textColor: 'text-amber-400',
          description: `You unmasked @TheLagosTea live and went home to Mama’s kiosk, alone and completely whole. Your scholarship was restored. Hauwa offered you a column at Premium Times, and you called it “Box 14”: true stories from people Lagos only gossips about. The first one was about your father. Half of Ajegunle cried reading it. The other half pretended they had dust in their eyes.`,
          verdict: 'The Culprit Unmasked • Solo',
        };
      /* ------------------------------ Bad endings ------------------------------ */
      case 'chidi_bad':
        return {
          title: 'ENDING 5: OUT OF FOCUS',
          subtitle: 'The Page Lives On • ' + partner('Chidi'),
          icon: Heart,
          color: 'from-rose-800 to-neutral-900',
          textColor: 'text-rose-400',
          description: `@TheLagosTea was never unmasked. A week later it posted Chidi’s confession, the ₦150,000, the entrance photo, and his clients left him one by one. You stayed. You learned to develop film in the red light while your phone buzzed face-down on the bench. Every morning at seven, a voice note from Tamara: “Thinking of you babe 💚”. Every morning at seven, the page posted. You never once asked yourself why.`,
          verdict: 'The Page Lives On',
        };
      case 'kelvin_bad':
        return {
          title: 'ENDING 6: THE GILDED CAGE',
          subtitle: 'The Page Lives On • ' + partner('Kelvin'),
          icon: ShieldCheck,
          color: 'from-amber-800 to-neutral-900',
          textColor: 'text-amber-400',
          description: `@TheLagosTea was never unmasked. Kelvin’s lawyers made the noise go away, the way money makes everything in Lagos go away. You moved into his world: drivers, gates, a phone nobody had the number of. The page posted one last thing about you: “Cinderella found her prince after all 🫖”. Tamara commented first, three hearts. You liked it. You didn’t know why your hands were shaking.`,
          verdict: 'The Page Lives On',
        };
      case 'dayo_bad':
        return {
          title: 'ENDING 7: THE SONG NOBODY HEARD',
          subtitle: 'The Page Lives On • ' + partner('Dayo'),
          icon: Music,
          color: 'from-indigo-800 to-neutral-900',
          textColor: 'text-indigo-300',
          description: `@TheLagosTea was never unmasked. “Window” came out, and the page called it “Cinderella’s boyfriend’s flop 🫖”, and Lagos agreed. You lived in the studio for a while, where there was no signal in the booth. Some nights you heard footsteps on the stairs going up to the third floor. Four soft beeps. You never went to look again.`,
          verdict: 'The Page Lives On',
        };
      case 'independent_bad':
        return {
          title: 'ENDING 8: SEVEN A.M.',
          subtitle: 'The Page Lives On • ' + heroine.name + ', alone',
          icon: Skull,
          color: 'from-rose-600 to-neutral-900',
          textColor: 'text-rose-500',
          description: `@TheLagosTea was never unmasked. You went home to Ajegunle and sold bread with Mama under an umbrella on the street. Every morning at 7 AM the page posts, and every morning at 7 AM your phone buzzes with a voice note from your oldest friend. “Thinking of you babe 💚” One day you will notice they arrive in the same minute. One day.`,
          verdict: 'The Page Lives On',
        };
      case 'bad':
      default:
        return {
          title: 'BAD ENDING: CANCELLED & EXPOSED',
          subtitle: 'Consumed by the Gossip Machine',
          icon: Skull,
          color: 'from-rose-600 to-neutral-900',
          textColor: 'text-rose-500',
          description: `Suspicion and jealousy boiled over. Before you could uncover the truth, @TheLagosTea dropped a falsified viral voice note framing you for sabotaging Zee’s luxury campaign. Brands dropped you, comments flooded with venom, and your Ajegunle roots became fodder for internet mockery.`,
          verdict: 'Digital De-Platforming',
        };
    }
  };

  const details = getEndingDetails();
  const Icon = details.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center my-auto">
        <div className={`p-4 rounded-2xl bg-gradient-to-tr ${details.color} text-neutral-950 mb-4 shadow-lg`}>
          <Icon className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1">
          {details.verdict}
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-neutral-100 mb-1">
          {details.title}
        </h2>
        <p className={`text-xs font-semibold ${details.textColor} mb-5`}>
          {details.subtitle}
        </p>

        <div className="w-28 h-36 relative mb-5 drop-shadow-xl">
          <HeroineSvg customization={heroine} expression={isBad ? 'sad' : 'happy'} />
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 text-left">
          {details.description}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-6">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Popularity</span>
            <span className="text-sm font-bold text-amber-400">{meters.popularity}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Loyalty</span>
            <span className="text-sm font-bold text-emerald-400">{meters.loyalty}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Reputation</span>
            <span className="text-sm font-bold text-purple-400">{meters.reputation}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Suspicion</span>
            <span className="text-sm font-bold text-rose-400">{meters.suspicion}%</span>
          </div>
        </div>

        {/* Dynamic Ending Soundtrack Vibe */}
        <div className="w-full mb-6 px-3.5 py-2.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-neutral-200">
              {isBad ? 'The Feed Moves On' : ending === 'independent' ? 'The Untouchable Queen' : 'Sunset Over The Lagoon'}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">
            {isBad ? 'Somber Minor Ambient' : ending === 'independent' ? 'Royal Lagos Afrobeats' : 'Romantic Alté Serenade'}
          </span>
        </div>

        {secretUnlocked && (
          <button
            onClick={() => setShowSecret(true)}
            className="w-full mb-3 py-3 px-4 rounded-xl border border-amber-400/60 bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 animate-pulse"
          >
            <Mail className="w-4 h-4" />
            You found every secret. There is one more…
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => onRestart(false)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again (Keep Look)
          </button>
          <button
            onClick={() => onRestart(true)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs sm:text-sm border border-neutral-700 transition-colors"
          >
            New Game & Look
          </button>
                </div>
      </div>

      {showSecret && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-300/40 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-8 shadow-2xl my-auto">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="p-3 rounded-2xl bg-amber-400 text-neutral-950 mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300/80">{SECRET_ENDING.subtitle}</span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-neutral-100 mt-1">{SECRET_ENDING.title}</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-neutral-200 leading-relaxed font-serif">
              <p className="italic text-amber-200">{SECRET_ENDING.greeting}</p>
              {SECRET_ENDING.message.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="text-right font-semibold text-amber-200 pt-2">{SECRET_ENDING.signature}</p>
            </div>
            <button
              onClick={() => setShowSecret(false)}
              className="mt-6 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
