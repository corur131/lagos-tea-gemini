import React from 'react';
import { EndingType, HeroineCustomization, Meters } from '../../types/vn';
import { HeroineSvg } from '../svg/HeroineSvg';
import { RotateCcw, ShieldCheck, Heart, Award, Skull, Sparkles, Music } from 'lucide-react';

interface EndingScreenProps {
  ending: EndingType;
  heroine: HeroineCustomization;
  meters: Meters;
  onRestart: (resetCustomization: boolean) => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  ending,
  heroine,
  meters,
  onRestart,
}) => {
  const getEndingDetails = () => {
    switch (ending) {
      case 'chidi':
        return {
          title: 'ENDING 1: THROUGH THE LENS OF TRUTH',
          subtitle: 'Pure Art & Unfiltered Love • Chidi & ' + heroine.name,
          icon: Heart,
          color: 'from-pink-500 to-rose-600',
          textColor: 'text-rose-400',
          description: `You saw through the glossy facade of the influencer circle and trusted Chidi Nwosu. Together, using his high-res raw photo archives and your sharp instincts, you unmasked the real source behind @TheLagosTea without selling your soul. Chidi takes your portrait by the Lagos Lagoon—not for viral likes, but because you are genuine.`,
          verdict: 'Romantic Honesty Triumph',
        };
      case 'kelvin':
        return {
          title: 'ENDING 2: THE HIGH-ROLLER ALLIANCE',
          subtitle: 'Power, Luxury & Protection • Kelvin & ' + heroine.name,
          icon: ShieldCheck,
          color: 'from-amber-500 to-emerald-600',
          textColor: 'text-emerald-400',
          description: `You matched Kelvin Adebayo-Wright wit for wit. Using his family empire’s legal leverage and insider clout, you turned the tables on the anonymous blackmailer before they could destroy you. Now, you stand as an untouchable force beside Kelvin on the Banana Island penthouse terrace.`,
          verdict: 'Power Couple Triumph',
        };
      case 'dayo':
        return {
          title: 'ENDING 3: THE HITMAKER EMPIRE',
          subtitle: 'Music, Stardom & Intrigue • Dayo & ' + heroine.name,
          icon: Sparkles,
          color: 'from-purple-500 to-indigo-600',
          textColor: 'text-purple-400',
          description: `Dayo Martins gave you the creative keys to his studio and production empire. Together, you turned the drama into an acclaimed viral documentary series that shook the Nigerian entertainment industry. The truth became your greatest art.`,
          verdict: 'Media Mogul Triumph',
        };
      case 'independent':
        return {
          title: 'ENDING 4: THE UNTOUCHABLE QUEEN OF LAGOS TEA',
          subtitle: 'Solo Truth-Teller • ' + heroine.name + ' Ascendant',
          icon: Award,
          color: 'from-amber-400 to-yellow-600',
          textColor: 'text-amber-400',
          description: `You refused to be a pawn in anyone’s romantic or financial game. Armed with undeniable receipts, you went live directly on social media and dismantled the anonymous gossip empire in front of 3 million stunned viewers. You secured your scholarship, your dignity, and your crown on your own terms.`,
          verdict: 'Solo Integrity Triumph',
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
          <HeroineSvg customization={heroine} expression={ending === 'bad' ? 'sad' : 'happy'} />
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
              {ending === 'chidi'
                ? 'Sunset Over The Lagoon'
                : ending === 'bad'
                ? 'The Feed Moves On'
                : 'The Untouchable Queen'}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">
            {ending === 'chidi'
              ? 'Romantic Alté Serenade'
              : ending === 'bad'
              ? 'Somber Minor Ambient'
              : 'Royal Lagos Afrobeats'}
          </span>
        </div>

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
    </div>
  );
};
