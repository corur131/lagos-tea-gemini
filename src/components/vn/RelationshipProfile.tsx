import React, { useState } from 'react';
import { CharacterId, Meters, HeroineCustomization } from '../../types/vn';
import {
  RELATIONSHIP_CHARACTERS,
  calculateRelationship,
  CharacterRelationshipInfo,
} from '../../data/relationshipData';
import { SocialAvatar } from '../social/SocialAvatar';
import { NpcSvg } from '../svg/NpcSvg';
import {
  Heart,
  Shield,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Flame,
  UserCheck,
  Info,
  Clock,
  Compass,
} from 'lucide-react';

interface RelationshipProfileProps {
  meters: Meters;
  flags: Record<string, boolean>;
  heroine: HeroineCustomization;
  onBackToClues?: () => void;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const RelationshipProfile: React.FC<RelationshipProfileProps> = ({
  meters,
  flags,
  heroine,
  onBackToClues,
  onClose,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('chidi');
  const [filterMode, setFilterMode] = useState<'all' | 'romance' | 'squad'>('all');

  const selectedChar = RELATIONSHIP_CHARACTERS.find((c) => c.id === selectedCharId) || RELATIONSHIP_CHARACTERS[0];
  const assessment = calculateRelationship(selectedChar.id, meters, flags, heroine);

  const filteredList = RELATIONSHIP_CHARACTERS.filter((c) => {
    if (filterMode === 'romance') return c.hasRomance;
    if (filterMode === 'squad') return !c.hasRomance;
    return true;
  });

  const getTrustBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Ride-or-Die':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Confidant':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Warm':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Cautious':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getRomanceBadgeColor = (tier?: string) => {
    switch (tier) {
      case 'Obsession':
        return 'bg-rose-600/30 text-rose-300 border-rose-500/50';
      case 'Electric':
        return 'bg-pink-500/30 text-pink-300 border-pink-500/50';
      case 'Entangled':
        return 'bg-purple-500/30 text-purple-300 border-purple-500/50';
      case 'Spark':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 select-none">
      {/* Top Bar inside Clue Board Modal */}
      <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          {onBackToClues && (
            <button
              onClick={onBackToClues}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Return to Clues"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Clues</span>
            </button>
          )}
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
              Relationship Profiles
            </h3>
            <p className="text-[11px] text-neutral-400">
              Live Trust & Romance standings shaped by Ada’s choices
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setFilterMode('romance')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              filterMode === 'romance'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Romance</span>
          </button>
          <button
            onClick={() => setFilterMode('squad')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              filterMode === 'squad'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Shield className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Squad</span>
          </button>
        </div>
      </div>

      {/* Main Body: Two-column layout (List + Detailed Dossier) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left / Top Character Roster */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-900/50 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 p-2 md:p-3 gap-2">
          {filteredList.map((char) => {
            const charAssessment = calculateRelationship(char.id, meters, flags, heroine);
            const isSelected = char.id === selectedChar.id;

            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all shrink-0 md:shrink border w-full ${
                  isSelected
                    ? 'bg-neutral-800/90 border-neutral-600 shadow-md ring-1 ring-white/10'
                    : 'bg-neutral-950/40 border-neutral-800/80 hover:bg-neutral-800/50 hover:border-neutral-700'
                }`}
              >
                <SocialAvatar
                  avatarType={char.id}
                  size="md"
                  hasStoryRing={isSelected}
                  hasUnseenStory={isSelected}
                />
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-neutral-200 truncate">
                      {char.name.split(' ')[0]}
                    </span>
                    {char.hasRomance && (
                      <span className="text-[10px] text-rose-400 font-mono font-bold flex items-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 fill-rose-500/50" />
                        {charAssessment.romance}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-[10px] text-neutral-400 truncate">
                      {char.role}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {charAssessment.trust}%
                    </span>
                  </div>
                  {/* Miniature trust bar */}
                  <div className="w-full h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${charAssessment.trust}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right / Main Detailed Dossier View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950 flex flex-col space-y-4">
          {/* Header Card with Character Portrait, Tagline & Follower Badge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/90 relative overflow-hidden shadow-xl">
            {/* Ambient Background Accent Glow */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedChar.accentColor} opacity-10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16`}
            />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
              {/* Large Character Avatar / Interactive Portrait */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-950 border-2 border-neutral-700 shadow-xl relative flex items-center justify-center">
                  <div className="scale-[1.7] translate-y-3 w-full h-full flex items-center justify-center">
                    <NpcSvg
                      characterId={selectedChar.id}
                      expression="neutral"
                      lookDirection="center"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-neutral-300 shadow">
                  {selectedChar.followers}
                </div>
              </div>

              {/* Title & Core Details */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-neutral-100">
                    {selectedChar.name}
                  </h2>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrustBadgeColor(
                      assessment.trustTier
                    )}`}
                  >
                    Trust: {assessment.trustTier}
                  </span>
                  {selectedChar.hasRomance && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRomanceBadgeColor(
                        assessment.romanceTier
                      )}`}
                    >
                      <Flame className="w-2.5 h-2.5" />
                      Romance: {assessment.romanceTier}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 font-medium">
                  {selectedChar.role}
                </p>
                <p className="text-xs italic text-neutral-300 mt-1.5 font-serif">
                  “{selectedChar.tagline}”
                </p>

                <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{selectedChar.vibe}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Meters Grid: Trust & Romance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Trust Meter Card */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Trust Standing
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {assessment.trust}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${assessment.trust}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>0% Suspicious</span>
                <span>50% Neutral</span>
                <span>100% Ride-or-Die</span>
              </div>
            </div>

            {/* Romance Meter Card (or Loyalty Card for non-romance cast) */}
            {selectedChar.hasRomance ? (
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/40" />
                    Romance Chemistry
                  </span>
                  <span className="text-sm font-mono font-bold text-rose-400">
                    {assessment.romance} / 100
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${assessment.romance}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Stranger</span>
                  <span>Spark</span>
                  <span>Obsession</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    Squad Alignment
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {meters.loyalty}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${meters.loyalty}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Alienated</span>
                  <span>Inner Circle</span>
                  <span>Unbreakable</span>
                </div>
              </div>
            )}
          </div>

          {/* Current Opinion & Narrative Summary */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Current Opinion of Ada
            </h4>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
              {assessment.statusSummary}
            </p>
          </div>

          {/* How Recent Choices Influenced This NPC */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Recent Choices & Story Impact
            </h4>

            <div className="space-y-2">
              {assessment.recentInfluences.map((influence, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/70 text-xs text-neutral-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <p className="leading-relaxed flex-1">{influence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Guidance note */}
          <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-center gap-2 text-[11px] text-neutral-400">
            <Info className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>
              Your choices during dialogue, wardrobe selections, and group chat leaks alter how each character responds to you in future episodes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
