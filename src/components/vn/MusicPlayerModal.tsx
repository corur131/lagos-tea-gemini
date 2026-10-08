import React, { useState, useEffect } from 'react';
import { bgmManager, MOOD_PROFILES } from '../../utils/audio';
import type { MusicMood } from '../../types/vn';
import {
  Volume2,
  VolumeX,
  Music,
  Sliders,
  X,
  Sparkles,
  Radio,
  Play,
  RotateCcw,
} from 'lucide-react';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentSceneMood?: MusicMood;
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  currentSceneMood,
}) => {
  const [musicState, setMusicState] = useState(() => ({
    mood: bgmManager.getCurrentMood(),
    title: bgmManager.getMoodProfile().title,
    vibe: bgmManager.getMoodProfile().vibe,
    isPlaying: false,
    volume: 0.55,
  }));
  const [isAutoMode, setIsAutoMode] = useState(true);

  useEffect(() => {
    const unsubscribe = bgmManager.subscribe((state) => {
      setMusicState(state);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const currentProfile = MOOD_PROFILES[musicState.mood] || MOOD_PROFILES.campus_lifestyle;

  const handleSelectMood = (mood: MusicMood) => {
    setIsAutoMode(false);
    bgmManager.setMood(mood);
    if (!soundEnabled) {
      onToggleSound();
    }
  };

  const handleResetToAuto = () => {
    setIsAutoMode(true);
    if (currentSceneMood) {
      bgmManager.setMood(currentSceneMood);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    bgmManager.setVolume(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-neutral-950 shadow-md">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 font-serif">
                Soundtrack of Lagos
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-sans">
                  Dynamic BGM
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Synthesized live via Web Audio • Reacts to scenes & choices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Playing Card */}
        <div className="p-5 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/60 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Now Playing
              </span>
              {isAutoMode ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Story Synced
                </span>
              ) : (
                <button
                  onClick={handleResetToAuto}
                  className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all"
                  title="Return soundtrack control to current scene"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Reset to Scene
                </button>
              )}
            </div>

            {/* Equalizer animation */}
            <div className="flex items-end gap-1 h-4">
              {[0.4, 0.9, 0.6, 0.75].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full ${
                    soundEnabled && musicState.isPlaying
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-neutral-700'
                  }`}
                  style={{
                    height: soundEnabled && musicState.isPlaying ? `${h * 100}%` : '25%',
                    animationDuration: `${0.4 + i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-base font-serif font-black text-neutral-100 flex items-center gap-2">
                <span>{currentProfile.title}</span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                {currentProfile.vibe}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-neutral-400">
                <span>{currentProfile.bpm} BPM</span>
                <span>•</span>
                <span className="capitalize">{currentProfile.energy} Energy</span>
                {currentProfile.hasLogDrum && (
                  <>
                    <span>•</span>
                    <span className="text-pink-400">Amapiano Log Drum</span>
                  </>
                )}
              </div>
            </div>

            {/* Master Toggle */}
            <button
              onClick={onToggleSound}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all sm:self-center shrink-0 ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mt-4 flex items-center gap-3">
            <Volume2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicState.volume}
              onChange={handleVolumeChange}
              disabled={!soundEnabled}
              className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
            />
            <span className="text-[11px] font-mono text-neutral-400 min-w-[32px] text-right">
              {Math.round(musicState.volume * 100)}%
            </span>
          </div>
        </div>

        {/* Scene Playlist & Mood Selector */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              Lagos Drama Soundscapes
            </span>
            <span className="text-[10px] text-neutral-500">
              Select any mood to preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(MOOD_PROFILES) as MusicMood[]).map((moodKey) => {
              const item = MOOD_PROFILES[moodKey];
              const isSelected = musicState.mood === moodKey;

              return (
                <button
                  key={moodKey}
                  onClick={() => handleSelectMood(moodKey)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                      {item.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mb-2">
                    {item.vibe}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{item.bpm} BPM</span>
                    <span className="capitalize text-neutral-400">{item.energy}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/40 text-center">
          <p className="text-[11px] text-neutral-400">
            Music automatically transitions between scenes, romantic moments, and viral tea leaks.
          </p>
        </div>
      </div>
    </div>
  );
};
