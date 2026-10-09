import React, { useMemo, useState } from 'react';
import { HeroineCustomization, LocationType, Meters } from '../../types/vn';
import { AdaPost, AdaPostTone } from '../../types/socialFeed';
import { getPhotoOptions, PhotoOption } from '../../data/adaPhotos';
import {
  VIBES,
  VIBE_ORDER,
  POSTS_PER_EPISODE,
  CaptionOption,
  getCaptionOptions,
  getAudienceMood,
  estimatePost,
} from '../../data/postEngine';
import { describeEffect, formatCount } from '../../data/socialRules';
import { HeroineSvg } from '../svg/HeroineSvg';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface AdaPostComposerProps {
  heroine: HeroineCustomization;
  meters: Meters;
  location: LocationType;
  episode: number;
  /** Social progress: current scene index, +1 once its choice is made */
  sceneIndex?: number;
  flags?: Record<string, boolean>;
  /** Ada's earlier posts, newest first */
  pastPosts?: AdaPost[];
  isPosting: boolean;
  soundEnabled: boolean;
  unfollowed?: Record<string, boolean>;
  onPost: (photo: PhotoOption, tone: AdaPostTone, caption: CaptionOption) => void;
}

const isEverydayPhoto = (kind: string) => kind === 'mirror_selfie' || kind.startsWith('here_');

export const AdaPostComposer: React.FC<AdaPostComposerProps> = ({
  heroine,
  meters,
  location,
  episode,
  sceneIndex = 0,
  flags = {},
  pastPosts = [],
  isPosting,
  soundEnabled,
  unfollowed = {},
  onPost,
}) => {
  const progress = { episode, sceneIndex, flags };
  const postsThisEpisode = pastPosts.filter((p) => p.episode === episode).length;
  const postsLeft = Math.max(0, POSTS_PER_EPISODE - postsThisEpisode);

  // Story photos can only be posted once; everyday shots can be reused (with a freshness penalty)
  const photos = useMemo(() => {
    const posted = new Set(pastPosts.map((p) => p.photoKind));
    return getPhotoOptions(heroine, location, progress).filter((p) => isEverydayPhoto(p.kind) || !posted.has(p.kind));
  }, [heroine, location, episode, sceneIndex, flags, pastPosts]);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [tone, setTone] = useState<AdaPostTone | null>(null);
  const [captionId, setCaptionId] = useState<string | null>(null);

  const mood = getAudienceMood(progress);
  const captions = tone ? getCaptionOptions(tone, progress) : [];
  const caption = captions.find((c) => c.id === captionId) || null;
  const photo = photos[photoIdx] || photos[0];

  const outcome =
    tone && caption && photo
      ? estimatePost({ tone, photo, caption, meters, progress, pastPosts, unfollowed })
      : null;

  if (postsLeft === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <Lock className="w-5 h-5 text-neutral-400" />
        </div>
        <h3 className="font-bold text-sm text-neutral-100">That’s {POSTS_PER_EPISODE} posts this episode</h3>
        <p className="text-xs text-neutral-400 max-w-xs">
          Your next posts unlock in Episode {episode + 1}. The algorithm hates spam, babe 💅
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-neutral-100">New post</h3>
          <p className="text-[11px] text-neutral-500">Photo, vibe and caption all decide how it lands.</p>
        </div>
        <span className="shrink-0 px-2 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-pink-300">
          {postsLeft}/{POSTS_PER_EPISODE} left this episode
        </span>
      </div>

      {/* Audience mood right now */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/60 to-amber-950/40 border border-pink-500/20">
        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">🌡️ The timeline right now</div>
        <div className="text-xs font-bold text-neutral-100 mt-0.5">{mood.label}</div>
        <div className="text-[11px] text-neutral-400 leading-snug">{mood.hint}</div>
      </div>

      {/* 1. Photo */}
      <section className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">1. Pick a photo</span>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.kind}
              onClick={() => {
                setPhotoIdx(i);
                if (soundEnabled) playSound.cameraShutter();
              }}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                photoIdx === i ? 'border-pink-500 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr ${p.bgGradient}`} />
              <div className="absolute inset-x-0 bottom-6 top-2 pointer-events-none flex items-center justify-center">
                {p.emoji ? (
                  <span className="text-4xl sm:text-5xl drop-shadow-lg" aria-hidden>{p.emoji}</span>
                ) : (
                  <HeroineSvg
                    customization={p.outfit ? { ...heroine, outfit: p.outfit } : heroine}
                    expression={p.expression || 'flirty'}
                    isTalking={false}
                    lookDirection="center"
                    reduceMotion={true}
                    className="w-full h-full"
                  />
                )}
              </div>
              <span className="absolute inset-x-1 bottom-1 text-[9px] leading-tight text-white font-semibold drop-shadow line-clamp-2">
                {p.label}
              </span>
            </button>
          ))}
        </div>
        {photo && (
          <p className="text-[10px] text-neutral-500">
            This photo reads as: <span className="text-neutral-300">{photo.tags.join(' · ')}</span>
          </p>
        )}
      </section>

      {/* 2. Vibe */}
      <section className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">2. Pick a vibe</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VIBE_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTone(t);
                setCaptionId(null);
                if (soundEnabled) playSound.click();
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all ${
                tone === t ? 'bg-pink-600/20 border-pink-500' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              <div className="text-xs font-bold text-neutral-100">{VIBES[t].label}</div>
              <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{VIBES[t].description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Caption */}
      {tone && (
        <section className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">3. Pick a caption</span>
          {captions.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCaptionId(c.id);
                if (soundEnabled) playSound.click();
              }}
              className={`w-full p-2.5 rounded-2xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                captionId === c.id
                  ? 'bg-pink-600/20 border-pink-500 text-neutral-50'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              <span>{c.text}</span>
              {!c.evergreen && (
                <span className="shrink-0 text-[9px] font-mono uppercase text-amber-300/90 mt-0.5">topical</span>
              )}
            </button>
          ))}
        </section>
      )}

      {/* How it will land */}
      {outcome && (
        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <span>Expected reach:</span>
            <span className="font-bold text-emerald-400">
              +{formatCount(outcome.followersRange[0])}–{formatCount(outcome.followersRange[1])} followers
            </span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>Estimated likes:</span>
            <span className="font-bold text-pink-300">
              {formatCount(outcome.likesRange[0])}–{formatCount(outcome.likesRange[1])} likes
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-neutral-800">
            {outcome.factors.map((f) => (
              <span
                key={f.label}
                className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${
                  f.mult >= 1.05
                    ? 'border-emerald-500/40 text-emerald-300'
                    : f.mult <= 0.95
                    ? 'border-rose-500/40 text-rose-300'
                    : 'border-neutral-700 text-neutral-400'
                }`}
                title={f.note}
              >
                {f.label} ×{f.mult.toFixed(2)}
                {f.note ? ` · ${f.note}` : ''}
              </span>
            ))}
          </div>
          {outcome.viralPotential && (
            <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-rose-600/30 to-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-[11px]">
              🔥 Viral potential: everything lines up. This could blow up by thousands.
            </div>
          )}
          <div className="text-neutral-400 pt-0.5">{describeEffect({ meterChanges: outcome.meterChanges })}</div>
        </div>
      )}

      <button
        disabled={!tone || !caption || !photo || isPosting}
        onClick={() => tone && caption && photo && onPost(photo, tone, caption)}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2"
      >
        {isPosting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Posting…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Share to GidiGram
          </>
        )}
      </button>
    </div>
  );
};
