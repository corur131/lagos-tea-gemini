import React, { useState, useMemo } from 'react';
import { GidiGramTrend, TrendCategory } from '../../data/trendData';
import { SocialPost } from '../../types/socialFeed';
import { HeroineCustomization, CharacterId } from '../../types/vn';
import { SocialPostCard } from './SocialPostCard';
import { CAST_PROFILES } from '../../data/socialRules';
import {
  TrendingUp,
  Flame,
  Hash,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface TrendingViewProps {
  trends: GidiGramTrend[];
  allPosts: SocialPost[];
  heroineCustomization: HeroineCustomization;
  soundEnabled: boolean;
  unfollowed: Record<string, boolean>;
  onToggleFollow: (authorId: string) => void;
  onLikePost: (post: SocialPost) => void;
  onAddComment: (post: SocialPost, text: string) => void;
  onSharePost: (post: SocialPost) => void;
  onViewProfile: (authorId: string) => void;
  onSelectHashtag: (hashtag: string) => void;
}

const CATEGORIES: Array<'All' | TrendCategory> = [
  'All',
  'Scandal',
  'High Society',
  'Entertainment',
  'Fashion',
  'Lifestyle',
  'Culture',
];

export const TrendingView: React.FC<TrendingViewProps> = ({
  trends,
  allPosts,
  heroineCustomization,
  soundEnabled,
  unfollowed,
  onToggleFollow,
  onLikePost,
  onAddComment,
  onSharePost,
  onViewProfile,
  onSelectHashtag,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | TrendCategory>('All');
  const [selectedTrend, setSelectedTrend] = useState<GidiGramTrend | null>(null);

  // Filter trends by category
  const filteredTrends = useMemo(() => {
    if (selectedCategory === 'All') return trends;
    return trends.filter((t) => t.category === selectedCategory);
  }, [trends, selectedCategory]);

  // When a trend is selected, find associated posts (by relatedPostIds or matching hashtag)
  const relatedPosts = useMemo(() => {
    if (!selectedTrend) return [];
    return allPosts.filter((post) => {
      // Direct post ID match
      if (selectedTrend.relatedPostIds?.includes(post.id)) return true;
      // Hashtag match
      if (post.hashtags?.some((h) => h.toLowerCase() === selectedTrend.hashtag.toLowerCase())) {
        return true;
      }
      return false;
    });
  }, [selectedTrend, allPosts]);

  const getIntensityBadge = (intensity?: GidiGramTrend['intensity']) => {
    switch (intensity) {
      case 'viral':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            VIRAL
          </span>
        );
      case 'spicy':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            HOT TEA
          </span>
        );
      case 'rising':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            RISING
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800/80 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-black text-sm sm:text-base text-neutral-100">
                GidiGram Radar • Trending in Lagos
              </h3>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Real-time buzz, leaks, and high-society conversations heating up Banana Island, Lekki, and Victoria Island.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Active Trends</span>
            <span className="text-base font-black text-pink-400 font-mono">{trends.length}</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-3 mt-3 border-t border-neutral-800/60">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (soundEnabled) playSound.click();
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'bg-neutral-900/90 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Detailed Modal or Drawer when a trend is clicked */}
      {selectedTrend && (
        <div className="rounded-3xl bg-neutral-900 border border-pink-500/30 p-4 sm:p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-pink-400">{selectedTrend.hashtag}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  {selectedTrend.category}
                </span>
                {getIntensityBadge(selectedTrend.intensity)}
              </div>
              <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                {selectedTrend.headline}
              </h4>
            </div>
            <button
              onClick={() => setSelectedTrend(null)}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Close detail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800">
            {selectedTrend.shortDescription}
          </p>

          {/* Related Cast Members */}
          {selectedTrend.relatedCharacters && selectedTrend.relatedCharacters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] text-neutral-400 font-mono">Involved:</span>
              {selectedTrend.relatedCharacters.map((charId) => {
                const profile = CAST_PROFILES[charId] || { name: charId, handle: `@${charId}` };
                return (
                  <button
                    key={charId}
                    onClick={() => {
                      if (charId !== 'heroine') {
                        onViewProfile(charId);
                      }
                    }}
                    className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-pink-300 text-[11px] font-mono transition-colors"
                  >
                    {profile.handle}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action to view full feed with this hashtag */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-mono">
              {selectedTrend.activityCount}
            </span>
            <button
              onClick={() => {
                onSelectHashtag(selectedTrend.hashtag);
                if (soundEnabled) playSound.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Filter Feed for {selectedTrend.hashtag}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Associated Feed Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                <span>Featured Posts for this topic ({relatedPosts.length})</span>
              </div>
              <div className="space-y-3">
                {relatedPosts.map((p) => (
                  <SocialPostCard
                    key={p.id}
                    post={p}
                    heroineCustomization={heroineCustomization}
                    soundEnabled={soundEnabled}
                    isFollowing={!unfollowed[p.authorId]}
                    onToggleFollow={onToggleFollow}
                    onLikePost={onLikePost}
                    onAddComment={onAddComment}
                    onHashtagClick={(tag) => onSelectHashtag(tag)}
                    onSharePost={onSharePost}
                    onViewProfile={onViewProfile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Trend Items List */}
      <div className="space-y-2.5">
        {filteredTrends.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-xs">No trending topics in this category yet.</p>
          </div>
        ) : (
          filteredTrends.map((trend, index) => {
            const isSelected = selectedTrend?.id === trend.id;
            return (
              <div
                key={trend.id}
                onClick={() => {
                  setSelectedTrend(isSelected ? null : trend);
                  if (soundEnabled) playSound.click();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-neutral-900 border-pink-500 shadow-lg shadow-pink-500/10'
                    : 'bg-neutral-950/80 hover:bg-neutral-900/90 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Rank Number */}
                    <span className="font-mono font-black text-sm text-neutral-500 group-hover:text-pink-400 transition-colors w-5 shrink-0 pt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Category & Status */}
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-neutral-400">
                        <span>{trend.category} • Trending</span>
                        <span>•</span>
                        <span className="text-neutral-400">{trend.activityCount}</span>
                      </div>

                      {/* Hashtag */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-pink-300 group-hover:text-pink-200 transition-colors truncate">
                          {trend.hashtag}
                        </span>
                      </div>

                      {/* Headline */}
                      <p className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors line-clamp-1">
                        {trend.headline}
                      </p>

                      {/* Short Description */}
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {trend.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Intensity / Action Pill */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
                    {getIntensityBadge(trend.intensity)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHashtag(trend.hashtag);
                        if (soundEnabled) playSound.click();
                      }}
                      className="text-[10px] font-mono text-neutral-400 hover:text-pink-300 underline pt-1"
                    >
                      View Posts
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
