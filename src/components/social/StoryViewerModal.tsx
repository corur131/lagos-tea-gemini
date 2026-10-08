import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SocialStory, StorySlide } from '../../types/socialFeed';
import { HeroineCustomization } from '../../types/vn';
import { SocialAvatar } from './SocialAvatar';
import { X, ChevronLeft, ChevronRight, Heart, Flame, Coffee, Skull, Send, Volume2 } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface StoryViewerModalProps {
  stories: SocialStory[];
  initialStoryIndex: number;
  heroineCustomization: HeroineCustomization;
  soundEnabled: boolean;
  pollVotes?: Record<string, 'A' | 'B'>;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
  onVote?: (story: SocialStory, slide: StorySlide, choice: 'A' | 'B') => void;
  onReact?: (story: SocialStory, emoji: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryIndex,
  heroineCustomization,
  soundEnabled,
  pollVotes = {},
  onClose,
  onStoryViewed,
  onVote,
  onReact,
}) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentStoryIdx] || stories[0];
  const currentSlide = currentStory.slides[currentSlideIdx] || currentStory.slides[0];

  // Track viewed story IDs so each story triggers onStoryViewed AT MOST ONCE
  const viewedIdsRef = useRef<Set<string>>(new Set());
  const onStoryViewedRef = useRef(onStoryViewed);

  useEffect(() => {
    onStoryViewedRef.current = onStoryViewed;
  }, [onStoryViewed]);

  const currentStoryId = currentStory?.id;

  // Notify parent that story was viewed (guaranteed once per story ID)
  useEffect(() => {
    if (currentStoryId && !viewedIdsRef.current.has(currentStoryId)) {
      viewedIdsRef.current.add(currentStoryId);
      onStoryViewedRef.current?.(currentStoryId);
    }
  }, [currentStoryId]);

  // Story slide auto-advance timer (5 seconds per slide)
  const DURATION_MS = 5000;
  const INTERVAL_MS = 50;

  const handleNext = useCallback(() => {
    if (currentSlideIdx < currentStory.slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
    } else if (currentStoryIdx < stories.length - 1) {
      setCurrentStoryIdx((prev) => prev + 1);
      setCurrentSlideIdx(0);
    } else {
      onClose();
    }
    if (soundEnabled) playSound.click();
  }, [currentSlideIdx, currentStory.slides.length, currentStoryIdx, stories.length, onClose, soundEnabled]);

  const handlePrev = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
    } else if (currentStoryIdx > 0) {
      setCurrentStoryIdx((prev) => prev - 1);
      const prevStory = stories[currentStoryIdx - 1];
      setCurrentSlideIdx(prevStory.slides.length - 1);
    }
    if (soundEnabled) playSound.click();
  }, [currentSlideIdx, currentStoryIdx, stories, soundEnabled]);

  useEffect(() => {
    setProgress(0);
  }, [currentStoryIdx, currentSlideIdx]);

  useEffect(() => {
    if (isPaused) return;

    let elapsedMs = 0;
    const timer = setInterval(() => {
      elapsedMs += INTERVAL_MS;
      const pct = (elapsedMs / DURATION_MS) * 100;
      if (pct >= 100) {
        clearInterval(timer);
        handleNext();
      } else {
        setProgress(pct);
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, currentStoryIdx, currentSlideIdx, handleNext]);

  const handleSendReaction = (emoji: string) => {
    if (soundEnabled) playSound.likePop();
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: 20 + Math.random() * 60,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1500);
    onReact?.(currentStory, emoji);
  };

  const handleVotePoll = (choice: 'A' | 'B') => {
    if (soundEnabled) playSound.click();
    onVote?.(currentStory, currentSlide, choice);
  };

  const userVote = pollVotes[currentSlide.id];

  // Poll percentage calculation
  const votesA = (currentSlide.pollVotesA || 100) + (userVote === 'A' ? 1 : 0);
  const votesB = (currentSlide.pollVotesB || 50) + (userVote === 'B' ? 1 : 0);
  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background Dim Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Story Container - Phone Ratio */}
      <div
        className="relative z-10 w-full max-w-sm h-[92vh] max-h-[780px] bg-neutral-950 rounded-[36px] overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Visual */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentSlide.bgGradient} opacity-90 transition-all duration-500`}
        />

        {/* Ambient Gloss & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

        {/* Top Header: Progress Segments & Author Info */}
        <div className="relative z-20 pt-4 px-4 pb-2">
          {/* Progress Bars */}
          <div className="flex gap-1.5 mb-3">
            {currentStory.slides.map((slide, idx) => {
              let fillWidth = '0%';
              if (idx < currentSlideIdx) fillWidth = '100%';
              else if (idx === currentSlideIdx) fillWidth = `${progress}%`;

              return (
                <div
                  key={slide.id}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <SocialAvatar
                avatarType={currentStory.avatarType}
                heroineCustomization={heroineCustomization}
                size="sm"
                isLagosTea={currentStory.authorId === 'lagos_tea'}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-wide">{currentStory.authorName}</span>
                  <span className="text-[10px] text-white/70">{currentSlide.timestamp}</span>
                </div>
                <span className="text-[10px] text-white/60">{currentStory.authorHandle}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Content & Stickers */}
        <div className="relative z-20 flex-1 px-5 flex flex-col justify-center items-center text-center">
          {/* Sticker badge if present */}
          {currentSlide.stickerText && (
            <div className="mb-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg animate-bounce duration-1000">
              {currentSlide.stickerText}
            </div>
          )}

          {/* Caption text */}
          <p className="text-lg sm:text-xl font-medium text-white drop-shadow-md leading-relaxed max-w-xs font-sans">
            {currentSlide.caption}
          </p>

          {/* Interactive Poll Sticker */}
          {currentSlide.pollQuestion && (
            <div className="mt-6 w-full max-w-xs bg-neutral-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-left">
              <div className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                {currentSlide.pollQuestion}
              </div>

              {!userVote ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVotePoll('A')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all text-center"
                  >
                    {currentSlide.pollOptionA}
                  </button>
                  <button
                    onClick={() => handleVotePoll('B')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all text-center"
                  >
                    {currentSlide.pollOptionB}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative overflow-hidden rounded-xl bg-white/10 p-2 text-xs flex justify-between text-white font-bold">
                    <div
                      className="absolute inset-y-0 left-0 bg-pink-500/40 rounded-xl transition-all duration-500"
                      style={{ width: `${pctA}%` }}
                    />
                    <span className="relative z-10">{currentSlide.pollOptionA}</span>
                    <span className="relative z-10">{pctA}%</span>
                  </div>
                  <div className="relative overflow-hidden rounded-xl bg-white/10 p-2 text-xs flex justify-between text-white font-bold">
                    <div
                      className="absolute inset-y-0 left-0 bg-amber-500/40 rounded-xl transition-all duration-500"
                      style={{ width: `${pctB}%` }}
                    />
                    <span className="relative z-10">{currentSlide.pollOptionB}</span>
                    <span className="relative z-10">{pctB}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tap Left/Right Areas for Navigation */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-16 left-0 w-1/3 z-15 cursor-pointer"
          title="Previous"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-16 right-0 w-1/3 z-15 cursor-pointer"
          title="Next"
        />

        {/* Floating Heart/Reaction Emojis */}
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-20 z-40 text-3xl pointer-events-none animate-in fade-in slide-in-from-bottom duration-1000 ease-out"
            style={{
              left: `${item.x}%`,
              transform: 'translateY(-100px)',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Bottom Reaction Quick-Bar */}
        <div className="relative z-30 p-4 pb-5 flex items-center gap-2 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs">
            <span className="text-white/60">Send reaction to {currentStory.authorName.split(' ')[0]}...</span>
            <div className="flex items-center gap-1.5 text-base">
              <button
                onClick={() => handleSendReaction('❤️')}
                className="hover:scale-125 transition-transform"
              >
                ❤️
              </button>
              <button
                onClick={() => handleSendReaction('🔥')}
                className="hover:scale-125 transition-transform"
              >
                🔥
              </button>
              <button
                onClick={() => handleSendReaction('🫖')}
                className="hover:scale-125 transition-transform"
              >
                🫖
              </button>
              <button
                onClick={() => handleSendReaction('💀')}
                className="hover:scale-125 transition-transform"
              >
                💀
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSendReaction('👏')}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white text-sm transition-transform active:scale-95"
          >
            👏
          </button>
        </div>
      </div>
    </div>
  );
};
