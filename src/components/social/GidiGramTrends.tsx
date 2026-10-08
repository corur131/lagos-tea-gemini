import React, { useMemo, useState } from 'react';
import { ArrowLeft, Flame, Hash, TrendingUp, Users, X } from 'lucide-react';
import { GidiGramTrend, TrendIntensity } from '../../types/gidiGramTrends';
import { SocialPost } from '../../types/socialFeed';
import { getVisibleGidiGramTrends } from '../../data/gidiGramTrends';
import { formatCount } from '../../data/socialRules';

interface GidiGramTrendsProps {
  currentEpisode: number;
  currentSceneIndex: number;
  posts: SocialPost[];
  soundEnabled: boolean;
  onBackToFeed: () => void;
}

const CATEGORY_LABELS: Record<GidiGramTrend['category'], string> = {
  trending: 'Trending',
  lagos: 'Lagos',
  celebrity: 'Celebrity',
  influencer: 'Influencer',
  campus: 'Campus',
  relationship: 'Relationship',
  entertainment: 'Entertainment',
  drama: 'Drama',
};

const INTENSITY_META: Record<TrendIntensity, { label: string; className: string }> = {
  viral: {
    label: 'VIRAL',
    className: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
  },
  hot: {
    label: 'HOT',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  },
  rising: {
    label: 'RISING',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  },
};

export const GidiGramTrends: React.FC<GidiGramTrendsProps> = ({
  currentEpisode,
  currentSceneIndex,
  posts,
  soundEnabled,
  onBackToFeed,
}) => {
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(null);
  const [category, setCategory] = useState<GidiGramTrend['category'] | 'all'>('all');

  const trends = useMemo(
    () => getVisibleGidiGramTrends(currentEpisode, currentSceneIndex),
    [currentEpisode, currentSceneIndex]
  );

  const filteredTrends = useMemo(
    () => category === 'all' ? trends : trends.filter((trend) => trend.category === category),
    [category, trends]
  );

  const selectedTrend = trends.find((trend) => trend.id === selectedTrendId) || null;

  const relatedPosts = useMemo(() => {
    if (!selectedTrend) return [];
    return posts
      .filter((post) => post.hashtags.some((tag) => selectedTrend.relatedHashtags.includes(tag)))
      .slice(0, 3);
  }, [posts, selectedTrend]);

  const openTrend = (trend: GidiGramTrend) => {
    setSelectedTrendId(trend.id);
    if (soundEnabled) {
      // Navigation feedback is intentionally handled by the parent feed audio conventions.
    }
  };

  if (selectedTrend) {
    const intensity = INTENSITY_META[selectedTrend.intensity];

    return (
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 bg-neutral-950">
        <div className="sticky top-0 z-10 px-4 py-3 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => setSelectedTrendId(null)}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setSelectedTrendId(null)}
            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
            aria-label="Close trend"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/30 border border-neutral-800 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-rose-300" />
                  </span>
                  <span className={`px-2 py-1 rounded-full border text-[9px] font-black tracking-widest ${intensity.className}`}>
                    {intensity.label}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white break-words">{selectedTrend.hashtag}</h1>
                <p className="mt-2 text-sm font-semibold text-neutral-200 leading-relaxed">
                  {selectedTrend.headline}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>{formatCount(selectedTrend.activityCount)} posts</span>
              <span>•</span>
              <span>{CATEGORY_LABELS[selectedTrend.category]}</span>
            </div>

            <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
              {selectedTrend.description}
            </p>
          </div>

          {relatedPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Users className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-bold text-white">GidiGram posts in this conversation</h2>
              </div>

              <div className="space-y-2">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-neutral-100 truncate">
                          {post.authorName} <span className="font-normal text-neutral-500">{post.authorHandle}</span>
                        </p>
                        <p className="text-[9px] text-neutral-500 mt-0.5">{post.timestamp}</p>
                      </div>
                      <span className="text-[9px] text-neutral-500 shrink-0">
                        {formatCount(post.likesCount)} likes
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-neutral-300 leading-relaxed line-clamp-3">
                      {post.caption}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags
                        .filter((tag) => selectedTrend.relatedHashtags.includes(tag))
                        .slice(0, 3)
                        .map((tag) => (
                          <span key={tag} className="text-[9px] text-pink-300 bg-pink-500/10 rounded-full px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <button
            onClick={() => setSelectedTrendId(null)}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200"
          >
            Back to Trends
          </button>
        </div>
      </div>
    );
  }

  const categories = Array.from(
    new Set(trends.map((trend) => trend.category))
  ) as GidiGramTrend['category'][];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 bg-neutral-950">
      <div className="sticky top-0 z-10 px-4 py-3 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h1 className="font-serif font-black text-base text-white">GidiGram Trends</h1>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              What Lagos is talking about right now.
            </p>
          </div>
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest shrink-0">
            Episode {currentEpisode}
          </span>
        </div>

        <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setCategory('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 border ${category === 'all' ? 'bg-rose-500 text-white border-rose-500' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 border ${category === item ? 'bg-rose-500 text-white border-rose-500' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}
            >
              {CATEGORY_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2.5">
        {filteredTrends.map((trend, index) => {
          const intensity = INTENSITY_META[trend.intensity];
          return (
            <button
              key={trend.id}
              onClick={() => openTrend(trend)}
              className="w-full text-left rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-3.5 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs font-black text-neutral-500 shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500">
                      {CATEGORY_LABELS[trend.category]}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full border text-[8px] font-black tracking-widest ${intensity.className}`}>
                      {intensity.label}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-black text-white break-words">{trend.hashtag}</h2>
                  <p className="mt-1 text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                    {trend.headline}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[9px] text-neutral-500">
                    <span>{formatCount(trend.activityCount)} posts</span>
                    <span>•</span>
                    <span>{trend.description.slice(0, 72)}{trend.description.length > 72 ? '…' : ''}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-5 text-center">
        <p className="text-[9px] text-neutral-600">
          Trends are based on the current Lagos Tea story world, not live internet data.
        </p>
      </div>

      <button
        onClick={onBackToFeed}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};
