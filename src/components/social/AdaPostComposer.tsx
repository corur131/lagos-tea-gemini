import React, { useState } from 'react';
import { HeroineCustomization, LocationType, Meters } from '../../types/vn';
import { AdaPostTone } from '../../types/socialFeed';
import {
  getPhotoOptions,
  TONE_INFO,
  ALL_TONES,
  computeReach,
  getPostEffect,
  PhotoOption,
  CaptionOption,
} from '../../data/adaPosts';
import { describeEffect, formatCount } from '../../data/socialRules';
import { HeroineSvg } from '../svg/HeroineSvg';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface AdaPostComposerProps {
  heroine: HeroineCustomization;
  meters: Meters;
  location: LocationType;
  episode: number;
  sceneIndex: number;
  flags: Record<string, boolean>;
  alreadyPostedThisEpisode: boolean;
  isPosting: boolean;
  soundEnabled: boolean;
  unfollowed?: Record<string, boolean>;
  onPost: (photo: PhotoOption, tone: AdaPostTone, caption: CaptionOption) => void;
}

export const AdaPostComposer: React.FC<AdaPostComposerProps> = ({
  heroine,
  meters,
  location,
  episode,
  sceneIndex,
  flags,
  alreadyPostedThisEpisode,
  isPosting,
  soundEnabled,
  unfollowed = {},
  onPost,
}) => {
  const photos = getPhotoOptions(heroine, location, episode, sceneIndex, flags);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [tone, setTone] = useState<AdaPostTone | null>(null);
  const [caption, setCaption] = useState<CaptionOption | null>(null);

  if (alreadyPostedThisEpisode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <Lock className="w-5 h-5 text-neutral-400" />
        </div>
        <h3 className="font-bold text-sm text-neutral-100">You already posted this episode</h3>
        <p className="text-xs text-neutral-400 max-w-xs">
          Your next post unlocks in Episode {episode + 1}. The algorithm hates spam, babe 💅
        </p>
      </div>
    );
  }

  const photo = photos[photoIdx];
  const reach = tone ? computeReach(tone, meters.popularity, unfollowed, photo, caption || undefined, episode) : null;
  const effect = tone ? getPostEffect(tone, photo, caption || undefined, { episode, sceneIndex, flags, meters }) : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      <div>
        <h3 className="font-bold text-sm text-neutral-100">New post</h3>
        <p className="text-[11px] text-neutral-500">One post per episode. Choose wisely, everyone is watching.</p>
      </div>

      {/* 1. Photo */}
      <section className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">1. Pick a photo</span>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setPhotoIdx(i);
                if (soundEnabled) playSound.cameraShutter();
              }}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                photoIdx === i ? 'border-pink-500 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr ${p.bgGradient}`} />
              <div className="absolute inset-x-0 bottom-6 top-2 pointer-events-none">
                <HeroineSvg
                  customization={heroine}
                  expression={p.kind === 'throwback' ? 'happy' : 'flirty'}
                  isTalking={false}
                  lookDirection="center"
                  reduceMotion={true}
                  className="w-full h-full"
                />
              </div>
              <span className="absolute inset-x-1 bottom-1 text-[9px] leading-tight text-white font-semibold drop-shadow line-clamp-2">
                {p.label}
              </span>
              <span className="absolute top-1 left-1 right-1 text-[8px] leading-tight text-amber-200 font-mono drop-shadow">
                {p.hint}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Tone */}
      <section className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">2. Pick a vibe</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_TONES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTone(t);
                setCaption(null);
                if (soundEnabled) playSound.click();
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all ${
                tone === t ? 'bg-pink-600/20 border-pink-500' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              <div className="text-xs font-bold text-neutral-100">{TONE_INFO[t].label}</div>
              <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{TONE_INFO[t].description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Caption */}
      {tone && (
        <section className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">3. Pick a caption</span>
          {TONE_INFO[tone].captions.map((c) => (
            <button
              key={c.text}
              onClick={() => {
                setCaption(c);
                if (soundEnabled) playSound.click();
              }}
              className={`w-full p-2.5 rounded-2xl border text-left text-xs transition-all ${
                caption?.text === c.text ? 'bg-pink-600/20 border-pink-500 text-neutral-50' : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {c.text}
            </button>
          ))}
        </section>
      )}

      {tone && reach && (
        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
          <div className="flex items-center justify-between">
            <span>Expected reach{reach.contentMultiplier !== 1 ? ` (content ${reach.contentMultiplier.toFixed(2)}x)` : ''}:</span>
            <span className="font-bold text-emerald-400">+{formatCount(reach.followerGain)} followers</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>Estimated likes:</span>
            <span className="font-bold text-pink-300">~{formatCount(reach.likesCount)} likes</span>
          </div>
          <div className="text-[10px] text-amber-300/90 font-mono pt-0.5 border-t border-neutral-800">
            {reach.followedCount > 0
              ? `🔥 High-society circle boost: ${(reach.networkMultiplier).toFixed(2)}x (${reach.followedCount}/9 influencers followed)`
              : '⚠️ No influencers followed — organic reach only (likes halved)'}
          </div>
          {reach.isViral && (
            <div className="text-[10px] text-pink-300 font-mono">🚀 This photo and caption could go VIRAL</div>
          )}
          <div className="text-neutral-400 pt-0.5">{describeEffect(effect || undefined)}</div>
        </div>
      )}

      <button
        disabled={!tone || !caption || isPosting}
        onClick={() => tone && caption && onPost(photo, tone, caption)}
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
