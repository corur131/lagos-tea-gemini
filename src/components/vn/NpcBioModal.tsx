import React from 'react';
import { CharacterId, Meters, HeroineCustomization, Expression } from '../../types/vn';
import {
  RELATIONSHIP_CHARACTERS,
  calculateRelationship,
  CharacterRelationshipInfo,
} from '../../data/relationshipData';
import { NpcSvg } from '../svg/NpcSvg';
import {
  X,
  Sparkles,
  Heart,
  Shield,
  Flame,
  Award,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Instagram,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface NpcBioModalProps {
  characterId: CharacterId;
  expression?: Expression;
  meters: Meters;
  flags: Record<string, boolean>;
  heroine: HeroineCustomization;
  soundEnabled: boolean;
  onClose: () => void;
  onOpenGidigramProfile?: (charId: CharacterId) => void;
}

export const NpcBioModal: React.FC<NpcBioModalProps> = ({
  characterId,
  expression = 'neutral',
  meters,
  flags,
  heroine,
  soundEnabled,
  onClose,
  onOpenGidigramProfile,
}) => {
  const charInfo: CharacterRelationshipInfo =
    RELATIONSHIP_CHARACTERS.find((c) => c.id === characterId) || {
      id: characterId,
      name: characterId.charAt(0).toUpperCase() + characterId.slice(1),
      role: 'High Society Figure',
      followers: '100K',
      tagline: 'Moving through Lagos circles with calculated precision.',
      vibe: 'Polished, strategic, guarded & enigmatic',
      accentColor: 'from-amber-400 to-pink-500',
      hasRomance: false,
      baseTrust: 50,
    };

  const assessment = calculateRelationship(characterId, meters, flags, heroine);

  // Dynamic influence level calculation
  const getInfluenceDetails = (followersStr: string) => {
    let score = 75;
    let rank = 'High Society Influencer';
    if (followersStr.includes('M')) {
      const num = parseFloat(followersStr);
      score = Math.min(99, Math.round(85 + num * 3.5));
      rank = num >= 3 ? 'Tier 1 Mega Influencer • Lagos Elite' : 'A-List High Society Icon';
    } else if (followersStr.includes('K')) {
      const num = parseFloat(followersStr);
      if (num >= 500) {
        score = 88;
        rank = 'Dynasty Power Broker';
      } else if (num >= 300) {
        score = 80;
        rank = 'Lagos Media & Creative Elite';
      } else {
        score = 68;
        rank = 'Cultural Archivist & Insurgent Voice';
      }
    }
    return { score, rank };
  };

  const influence = getInfluenceDetails(charInfo.followers);

  // Vibe check rating and current dynamic mood
  const getVibeStatus = () => {
    if (assessment.trust >= 75) {
      return {
        badge: 'High Chemistry & Open Alliances',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        summary: `Currently views Ada with genuine respect and mutual protection amidst high-society schemes.`,
      };
    }
    if (assessment.trust >= 55) {
      return {
        badge: 'Guarded Intrigue & Mutual Curiosity',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        summary: `Intrigued by Ada’s poise and sharp instincts, but carefully testing where her true loyalties lie.`,
      };
    }
    return {
      badge: 'Calculated Distance & High Alert',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      summary: `Keeping a poker face. Watching every social step to see if Ada is an asset or a liability.`,
    };
  };

  const vibeStatus = getVibeStatus();

  const handleOpenProfile = () => {
    if (soundEnabled) playSound.phoneChime();
    onClose();
    if (onOpenGidigramProfile) {
      onOpenGidigramProfile(characterId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Bio Card */}
      <div className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl sm:rounded-[32px] shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Top Gloss Banner */}
        <div className={`h-2.5 bg-gradient-to-r ${charInfo.accentColor}`} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${charInfo.accentColor} flex items-center justify-center text-neutral-950 shadow-md`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  CHARACTER DOSSIER & VIBE CHECK
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 text-[9px] font-mono font-bold">
                  LIVE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-100 leading-tight">
                {charInfo.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playSound.click();
              onClose();
            }}
            className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-neutral-700/60 transition-all"
            title="Close Dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* 1. Character Hero & Stage Spotlight */}
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-4 rounded-2xl sm:rounded-3xl bg-neutral-900/80 border border-neutral-800/80 shadow-inner">
            {/* SVG Visual Stage */}
            <div className="relative w-36 sm:w-44 h-48 sm:h-52 shrink-0 flex items-end justify-center rounded-2xl bg-neutral-950 border border-neutral-800/80 overflow-hidden shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-t ${charInfo.accentColor} opacity-20`} />
              <div className="relative w-36 sm:w-40 h-44 sm:h-48">
                <NpcSvg
                  characterId={characterId}
                  expression={expression}
                  lookDirection="center"
                />
              </div>
              <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-mono text-neutral-300 border border-white/10 uppercase">
                {expression}
              </div>
            </div>

            {/* Quick Profile Summary */}
            <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                    {charInfo.role}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-pink-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <p className="text-xs italic text-neutral-300 font-serif leading-snug">
                  "{charInfo.tagline}"
                </p>

                <div className="pt-1 text-[11px] text-neutral-400 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Ikoyi • Victoria Island Circles</span>
                </div>
              </div>

              {/* GidiGram Quick Link Button */}
              <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-center sm:justify-start">
                <button
                  onClick={handleOpenProfile}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>View GidiGram Profile</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Influence Level Card */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Current Influence Level</span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-200">
                {influence.score}/100 Clout
              </span>
            </div>

            {/* Influence Progress Bar */}
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${charInfo.accentColor} transition-all duration-700`}
                style={{ width: `${influence.score}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-neutral-400 font-medium">
                {influence.rank}
              </span>
              <span className="font-mono text-neutral-200 font-bold">
                {charInfo.followers} Followers
              </span>
            </div>
          </div>

          {/* 3. Vibe Check Summary */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Vibe Check</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${vibeStatus.color}`}>
                {vibeStatus.badge}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs space-y-1.5">
              <div className="font-semibold text-neutral-200">
                Core Disposition:
              </div>
              <p className="text-neutral-300 italic">
                "{charInfo.vibe}"
              </p>
              <div className="pt-1 text-neutral-400 border-t border-neutral-800/80 leading-relaxed">
                <span className="text-amber-400 font-medium">Current Verdict: </span>
                {vibeStatus.summary}
              </div>
            </div>
          </div>

          {/* 4. Relationship Dynamic & Trust / Romance */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Relationship Dynamic</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Opinion of Ada
              </span>
            </div>

            {/* Trust Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Trust ({assessment.trust}%)
                </span>
                <span className="font-bold text-cyan-300 font-mono text-[11px]">
                  [{assessment.trustTier}]
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, assessment.trust))}%` }}
                />
              </div>
            </div>

            {/* Romance Meter if applicable */}
            {charInfo.hasRomance && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/40" /> Romance ({assessment.romance}%)
                  </span>
                  <span className="font-bold text-pink-300 font-mono text-[11px]">
                    [{assessment.romanceTier || 'Stranger'}]
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, assessment.romance))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Recent Influences on Opinion */}
            <div className="pt-2 border-t border-neutral-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                HOW YOUR CHOICES INFLUENCED THEIR OPINION:
              </span>
              <div className="space-y-1.5">
                {assessment.recentInfluences.map((inf, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/60 text-xs text-neutral-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{inf}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-800/80 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500">
            Lagos Tea Intelligence Dossier
          </span>
          <button
            onClick={() => {
              if (soundEnabled) playSound.click();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
