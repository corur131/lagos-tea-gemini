import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  GameState,
  HeroineCustomization,
  CharacterId,
  Expression,
  LocationType,
  TimeModifier,
  SceneData,
  DialogueLine,
  InventoryItem,
  EndingType,
  CulpritId,
  CulpritMotive,
  MysterySecret,
} from './types/vn';
import { HeroineSvg } from './components/svg/HeroineSvg';
import { NpcSvg, FEMALE_NPC_PRESETS } from './components/svg/NpcSvg';
import { BackgroundRenderer } from './components/svg/BackgroundRenderer';
import { HeroineCustomizer } from './components/vn/HeroineCustomizer';
import { ClueBoard } from './components/vn/ClueBoard';
import { HistoryLog } from './components/vn/HistoryLog';
import { EndingScreen } from './components/vn/EndingScreen';
import { MusicPlayerModal } from './components/vn/MusicPlayerModal';
import { SocialFeedOverlay } from './components/social/SocialFeedOverlay';
import { CANONICAL_STORY, EPISODE_METAS } from './data/storyScript';
import { DEFAULT_SOCIAL_STATE, normalizeSocial, applyMeterChanges } from './data/socialRules';
import { DM_THREADS } from './data/dmData';
import { countUnreadDms } from './components/social/DmInbox';
import { playSound, bgmManager } from './utils/audio';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Music,
  Shirt,
  ShieldAlert,
  Flame,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  RefreshCw,
  Award,
  Heart,
  Camera,
  Coffee,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

const STORAGE_KEY = 'lagos_tea_vn_save_v1';

const DEFAULT_HEROINE: HeroineCustomization = {
  name: 'Ada',
  department: 'Media & Digital Communications',
  skinTone: 'deep_chestnut',
  eyeColor: 'dark_brown',
  hairstyle: 'box_braids',
  hairColor: 'jet_black',
  lipColor: 'nude',
  lipFinish: 'matte',
  eyeshadow: 'none',
  lashes: 'natural',
  blush: 'none',
  highlighter: false,
  brows: 'soft',
  outfit: 'casual',
  earrings: 'none',
  necklace: 'none',
};

const CULPRIT_CANDIDATES: CulpritId[] = ['zee', 'tamara', 'chi', 'bisola', 'hauwa'];
const MOTIVE_CANDIDATES: CulpritMotive[] = [
  'blackmail_debt',
  'stolen_credit_revenge',
  'algorithm_obsession',
  'romantic_jealousy',
  'undercover_expose',
];

function generateNewSecret(): MysterySecret {
  const culprit = CULPRIT_CANDIDATES[Math.floor(Math.random() * CULPRIT_CANDIDATES.length)];
  const motive = MOTIVE_CANDIDATES[Math.floor(Math.random() * MOTIVE_CANDIDATES.length)];
  return { culprit, motive };
}

const INITIAL_INVENTORY: InventoryItem[] = [];

const LAST_EPISODE = Math.max(...EPISODE_METAS.map((m) => m.episode));
const GENERATED_EPISODE_LENGTH = 7;

function findCanonicalScene(episode: number, sceneIndex: number, sceneId?: string): SceneData | undefined {
  if (sceneId) {
    const byId = CANONICAL_STORY.find((s) => s.id === sceneId);
    if (byId) return byId;
  }
  return CANONICAL_STORY.find((s) => s.episode === episode && s.sceneIndex === sceneIndex);
}

// Hand-written episodes use their own primary length (7 scenes); Gemini-only episodes use a fixed length
function getSceneCount(episode: number): number {
  const scenesForEp = CANONICAL_STORY.filter((s) => s.episode === episode);
  if (scenesForEp.length === 0) return GENERATED_EPISODE_LENGTH;
  const uniqueIndices = new Set(scenesForEp.map((s) => s.sceneIndex));
  return uniqueIndices.size || GENERATED_EPISODE_LENGTH;
}

export default function App() {
  // Load saved state or default
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If player is at the very beginning of the story (Episode 1 Scene 0), calibrate popularity for the authentic underdog grind
        const calibratedMeters = {
          ...parsed.meters,
          ...(parsed.currentEpisode === 1 && parsed.currentSceneIndex === 0 && parsed.meters?.popularity > 20
            ? { popularity: 12, reputation: 25 }
            : {}),
        };
        return {
          ...parsed,
          currentSceneId: parsed.currentSceneId,
          heroine: {
            ...DEFAULT_HEROINE,
            ...parsed.heroine,
          },
          meters: calibratedMeters,
          mysterySecret: parsed.mysterySecret || generateNewSecret(),
          social: parsed.social ? normalizeSocial(parsed.social) : DEFAULT_SOCIAL_STATE,
          isTyping: false,
          isWardrobeOpen: false,
          isCluesOpen: false,
          isLogOpen: false,
          isSocialFeedOpen: false,
        };
      }
    } catch {
      // Fallback
    }

    return {
      currentEpisode: 1,
      currentSceneIndex: 0,
      currentSceneId: 'ep1_sc0',
      currentLineIndex: 0,
      heroine: DEFAULT_HEROINE,
      meters: {
        popularity: 12,
        loyalty: 50,
        suspicion: 10,
        jealousy: 5,
        reputation: 25,
        romanceChidi: 15,
        romanceKelvin: 10,
        romanceDayo: 0,
      },
      flags: {},
      inventory: INITIAL_INVENTORY,
      historyLog: [],
      mysterySecret: generateNewSecret(),
      isTyping: false,
      isWardrobeOpen: false,
      isCluesOpen: false,
      isLogOpen: false,
      isSocialFeedOpen: false,
      soundEnabled: true,
      ending: null,
      social: DEFAULT_SOCIAL_STATE,
    };
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY);
  });

  // Track the player's last choice to ensure next scene directly opens with that exact choice & reaction
  const [lastChoice, setLastChoice] = useState<{
    text: string;
    consequenceText?: string;
    sceneKey: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('lagos_tea_last_choice');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic Gemini-generated scenes cache
  const [dynamicScenes, setDynamicScenes] = useState<Record<string, SceneData>>(() => {
    try {
      const saved = localStorage.getItem('lagos_tea_dynamic_scenes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // "Previously on..." recap modal state (for Episode 2 onward at scene 0)
  const [showRecapModal, setShowRecapModal] = useState<boolean>(() => {
    return gameState.currentEpisode >= 2 && gameState.currentSceneIndex === 0;
  });

  // Target tab when opening GidiGram (e.g. 'for_you' vs 'dms')
  const [socialFeedInitialTab, setSocialFeedInitialTab] = useState<'for_you' | 'dms' | 'trending' | 'tea_leaks' | 'cast' | 'profile'>('for_you');

  // Total unread DMs count
  const unreadDmCount = useMemo(() => {
    return countUnreadDms(DM_THREADS, {
      episode: gameState.currentEpisode,
      sceneIndex: gameState.currentSceneIndex,
      flags: gameState.flags,
      social: gameState.social,
    });
  }, [gameState.currentEpisode, gameState.currentSceneIndex, gameState.flags, gameState.social]);

  // Dynamic Background Music state & modal
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [musicState, setMusicState] = useState(() => ({
    mood: bgmManager.getCurrentMood(),
    title: bgmManager.getMoodProfile().title,
    vibe: bgmManager.getMoodProfile().vibe,
    isPlaying: false,
    volume: 0.55,
  }));

  // Subscribe to background music manager changes
  useEffect(() => {
    return bgmManager.subscribe((state) => {
      setMusicState(state);
    });
  }, []);

  // Sync audio enabled state with BGM
  useEffect(() => {
    bgmManager.setEnabled(gameState.soundEnabled);
  }, [gameState.soundEnabled]);

  // Helper for speaker display name
  const getSpeakerDisplayName = useCallback(
    (speakerId: CharacterId | string) => {
      if (speakerId === 'heroine') return gameState.heroine.name;
      if (speakerId === 'zee') return 'Zainab “Zee” Bello';
      if (speakerId === 'tamara') return 'Tamara Okonkwo-Reid';
      if (speakerId === 'chi') return 'Chioma “Chi” Eze';
      if (speakerId === 'bisola') return 'Bisola Adeyemi';
      if (speakerId === 'hauwa') return 'Hauwa Musa';
      if (speakerId === 'chidi') return 'Chidi Nwosu';
      if (speakerId === 'kelvin') return 'Kelvin Adebayo-Wright';
      if (speakerId === 'dayo') return 'Dayo Martins';
      if (speakerId === 'narrator') return '';
      return speakerId;
    },
    [gameState.heroine.name]
  );

  // Current Scene: hand-written scenes always win; Gemini scenes only fill episodes/scenes with no hand-written version
  const rawBaseScene: SceneData =
    findCanonicalScene(gameState.currentEpisode, gameState.currentSceneIndex, gameState.currentSceneId) ||
    (gameState.currentSceneId ? dynamicScenes[gameState.currentSceneId] : undefined) ||
    dynamicScenes[`${gameState.currentEpisode}_${gameState.currentSceneIndex}`] ||
    CANONICAL_STORY[0];

  // Open scenes with the previous choice's consequence and any earned follow-through.
  const currentScene: SceneData = useMemo(() => {
    const sceneKey = gameState.currentSceneId || `${gameState.currentEpisode}_${gameState.currentSceneIndex}`;
    const openingLines: DialogueLine[] = [];

    if (lastChoice && lastChoice.sceneKey === sceneKey && lastChoice.consequenceText) {
      openingLines.push({
        speaker: 'narrator',
        text: lastChoice.consequenceText,
      });
    }

    // If Ada asked Chidi to check his camera archives, pay that choice off when they meet
    // in the studio. Other routes still get the shared investigation scene without this line.
    if (rawBaseScene.id === 'ep2_sc2' && gameState.flags.chidi_archive_alliance) {
      openingLines.push({
        speaker: 'chidi',
        speakerDisplayName: 'Chidi Nwosu',
        expression: 'serious',
        text: '“I went through the party archive like you asked. I still can’t identify the person who sent the photo, but the original wide shot confirms it came from the second-floor mezzanine. We have a narrower list of suspects now.”',
      });
    }

    if (openingLines.length === 0) return rawBaseScene;

    return {
      ...rawBaseScene,
      lines: [...openingLines, ...rawBaseScene.lines],
    };
  }, [rawBaseScene, lastChoice, gameState.currentEpisode, gameState.currentSceneIndex, gameState.currentSceneId, gameState.flags]);

  const currentLine = currentScene.lines[gameState.currentLineIndex] || currentScene.lines[0];
  const isLastLineOfScene = gameState.currentLineIndex >= currentScene.lines.length - 1;

  // Dynamic Background Music adaptation based on scene, dialog, twists, or endings
  useEffect(() => {
    if (gameState.ending) {
      if (gameState.ending === 'chidi') {
        bgmManager.setMood('ending_romance');
      } else if (gameState.ending === 'bad') {
        bgmManager.setMood('ending_bad');
      } else {
        bgmManager.setMood('ending_triumph');
      }
      return;
    }

    // Mid-scene dialog line mood pivot
    if (currentLine?.musicMood) {
      bgmManager.setMood(currentLine.musicMood);
      return;
    }

    // Scene baseline mood
    if (currentScene?.musicMood) {
      bgmManager.setMood(currentScene.musicMood);
      return;
    }

    // Default fallback
    bgmManager.setMood('campus_lifestyle');
  }, [
    gameState.currentEpisode,
    gameState.currentSceneIndex,
    gameState.currentLineIndex,
    currentScene?.musicMood,
    currentLine?.musicMood,
    gameState.ending,
  ]);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gemini Live Generation state & error handling
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [activeTwistModal, setActiveTwistModal] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Auto-save on state change
  useEffect(() => {
    try {
      const stateToSave = {
        currentEpisode: gameState.currentEpisode,
        currentSceneIndex: gameState.currentSceneIndex,
        currentSceneId: gameState.currentSceneId,
        currentLineIndex: gameState.currentLineIndex,
        heroine: gameState.heroine,
        meters: gameState.meters,
        flags: gameState.flags,
        inventory: gameState.inventory,
        historyLog: gameState.historyLog.slice(-40),
        mysterySecret: gameState.mysterySecret,
        soundEnabled: gameState.soundEnabled,
        ending: gameState.ending,
        reachedEndOfContent: gameState.reachedEndOfContent,
        social: gameState.social,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Storage full or unavailable
    }
  }, [gameState]);

  // Typewriter effect logic
  useEffect(() => {
    if (!currentLine) return;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    const fullText = currentLine.text;
    let charIndex = 0;
    setDisplayedText('');
    setIsTypingComplete(false);

    // Play line SFX if present
    if (gameState.soundEnabled && currentLine.sfx) {
      if (currentLine.sfx === 'suspense' || currentLine.sfx === 'suspenseSting') {
        playSound.suspenseSting();
      } else if (currentLine.sfx === 'heartbeat') {
        playSound.heartbeat();
      } else if (currentLine.sfx === 'shock') {
        playSound.shock();
      } else if (currentLine.sfx === 'chime') {
        playSound.phoneChime();
      }
    }

    typingTimerRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (gameState.soundEnabled && charIndex % 3 === 0) {
        playSound.typewriter();
      }

      if (charIndex >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTypingComplete(true);
      }
    }, 20);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [
    gameState.currentEpisode,
    gameState.currentSceneIndex,
    gameState.currentLineIndex,
    currentLine?.text,
    currentLine?.sfx,
    gameState.soundEnabled,
  ]);

  // Advance dialogue to next line or complete typing on tap
  const handleAdvanceDialogue = () => {
    if (!isTypingComplete) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(currentLine.text);
      setIsTypingComplete(true);
      return;
    }

    if (!isLastLineOfScene) {
      if (gameState.soundEnabled) playSound.click();
      const speakerName = getSpeakerDisplayName(currentLine.speaker);
      setGameState((prev) => ({
        ...prev,
        currentLineIndex: prev.currentLineIndex + 1,
        historyLog: [...prev.historyLog, { speaker: speakerName || 'Narrator', text: currentLine.text }],
      }));
    }
  };

  // Handle Player Choice Selection
  const handleSelectChoice = async (choiceId: string) => {
    if (gameState.soundEnabled) playSound.click();
    const choice = currentScene.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply meter modifications
    const updatedMeters = {
      popularity: Math.min(100, Math.max(0, gameState.meters.popularity + (choice.meterChanges?.popularity || 0))),
      loyalty: Math.min(100, Math.max(0, gameState.meters.loyalty + (choice.meterChanges?.loyalty || 0))),
      suspicion: Math.min(100, Math.max(0, gameState.meters.suspicion + (choice.meterChanges?.suspicion || 0))),
      jealousy: Math.min(100, Math.max(0, gameState.meters.jealousy + (choice.meterChanges?.jealousy || 0))),
      reputation: Math.min(100, Math.max(0, gameState.meters.reputation + (choice.meterChanges?.reputation || 0))),
      romanceChidi: Math.min(100, Math.max(0, gameState.meters.romanceChidi + (choice.meterChanges?.romanceChidi || 0))),
      romanceKelvin: Math.min(100, Math.max(0, gameState.meters.romanceKelvin + (choice.meterChanges?.romanceKelvin || 0))),
      romanceDayo: Math.min(100, Math.max(0, gameState.meters.romanceDayo + (choice.meterChanges?.romanceDayo || 0))),
    };

    // Update flags
    const updatedFlags = { ...gameState.flags };
    if (choice.flagToSet) {
      updatedFlags[choice.flagToSet] = true;
    }

    // Add inventory receipts/clues based on episode milestones
    const updatedInventory = [...gameState.inventory];
    if (gameState.currentEpisode === 1 && currentScene.sceneIndex === 6 && !updatedInventory.some((i) => i.id === 'tea_post_1')) {
      updatedInventory.push({
        id: 'tea_post_1',
        name: '@TheLagosTea Post #1: Ajegunle Cinderella',
        description: 'Screenshot of the viral post exposing Ada’s borrowed dress, unpaid tuition fees, and home address.',
        episodeAcquired: 1,
        tag: 'Photo',
      });
    } else if (gameState.currentEpisode === 2 && currentScene.sceneIndex === 2 && !updatedInventory.some((i) => i.id === 'camera_raw_exif')) {
      updatedInventory.push({
        id: 'camera_raw_exif',
        name: 'Chidi’s 4K Camera EXIF Report',
        description: 'Proves the leaked image was taken from the second-floor mezzanine during Zee’s dress change.',
        episodeAcquired: 2,
        tag: 'Document',
      });
    } else if (gameState.currentEpisode === 3 && currentScene.sceneIndex === 5 && !updatedInventory.some((i) => i.id === 'burner_phone_pic')) {
      updatedInventory.push({
        id: 'burner_phone_pic',
        name: 'The Active Burner Phone',
        description: 'Evidence of the black smartphone logged into @TheLagosTea found charging inside the locked archive room.',
        episodeAcquired: 3,
        tag: 'Chat',
      });
    }

    // Apply choice-specific music mood if defined
    if (choice.musicMood) {
      bgmManager.setMood(choice.musicMood);
    }

    // Check if this scene has an episode twist
    if (currentScene.twistMoment) {
      setActiveTwistModal({
        title: currentScene.twistMoment.title,
        description: currentScene.twistMoment.description,
      });
      if (gameState.soundEnabled) {
        playSound.suspenseSting();
        bgmManager.playStingThenMood('reveal', 'mystery_climax');
      }
    }

    // Determine target destination: explicit nextSceneId / nextSceneIndex vs sequential progression
    let nextEpisode = gameState.currentEpisode;
    let nextSceneIndex = gameState.currentSceneIndex + 1;
    let nextSceneId: string | undefined = undefined;

    // Check if current scene is an episode finale
    const isEpisodeFinale =
      currentScene.id === 'ep1_sc6' ||
      currentScene.id === 'ep2_sc6' ||
      currentScene.id === 'ep3_sc6';

    if (isEpisodeFinale) {
      if (nextEpisode >= LAST_EPISODE) {
        // No more episodes written yet: stop here instead of looping back to Episode 1
        setGameState((prev) => ({
          ...prev,
          meters: updatedMeters,
          flags: updatedFlags,
          inventory: updatedInventory,
          historyLog: [...prev.historyLog, { speaker: gameState.heroine.name, text: choice.text }],
          reachedEndOfContent: true,
        }));
        return;
      }
      nextEpisode += 1;
      nextSceneIndex = 0;
      nextSceneId = `ep${nextEpisode}_sc0`;
      setShowRecapModal(true);
    } else if (choice.nextSceneId) {
      // 1. Explicit scene destination by ID
      const targetScene = CANONICAL_STORY.find((s) => s.id === choice.nextSceneId);
      if (targetScene) {
        nextEpisode = targetScene.episode;
        nextSceneIndex = targetScene.sceneIndex;
        nextSceneId = targetScene.id;
      } else {
        nextSceneId = choice.nextSceneId;
      }
    } else if (choice.nextSceneIndex !== undefined) {
      // 2. Explicit scene destination by index
      nextSceneIndex = choice.nextSceneIndex;
      nextEpisode = choice.nextEpisode ?? gameState.currentEpisode;
      const targetScene = CANONICAL_STORY.find(
        (s) => s.episode === nextEpisode && s.sceneIndex === nextSceneIndex
      );
      nextSceneId = targetScene?.id;
    } else {
      // 3. Sequential progression: advance to next sequential scene in episode
      nextEpisode = gameState.currentEpisode;
      nextSceneIndex = gameState.currentSceneIndex + 1;
      const targetScene = CANONICAL_STORY.find(
        (s) => s.episode === nextEpisode && s.sceneIndex === nextSceneIndex
      );
      if (targetScene) {
        nextSceneId = targetScene.id;
      } else if (nextSceneIndex >= getSceneCount(nextEpisode)) {
        if (nextEpisode >= LAST_EPISODE) {
          setGameState((prev) => ({
            ...prev,
            meters: updatedMeters,
            flags: updatedFlags,
            inventory: updatedInventory,
            historyLog: [...prev.historyLog, { speaker: gameState.heroine.name, text: choice.text }],
            reachedEndOfContent: true,
          }));
          return;
        }
        nextEpisode += 1;
        nextSceneIndex = 0;
        nextSceneId = `ep${nextEpisode}_sc0`;
        setShowRecapModal(true);
      }
    }

    // Save exact choice for next scene's opening line and character reaction
    const nextSceneKey = nextSceneId || `${nextEpisode}_${nextSceneIndex}`;
    const newLastChoice = {
      text: choice.text,
      consequenceText: choice.consequenceText,
      sceneKey: nextSceneKey,
    };
    setLastChoice(newLastChoice);
    try {
      localStorage.setItem('lagos_tea_last_choice', JSON.stringify(newLastChoice));
    } catch {}

    setGameState((prev) => ({
      ...prev,
      currentEpisode: nextEpisode,
      currentSceneIndex: nextSceneIndex,
      currentSceneId: nextSceneId,
      currentLineIndex: 0,
      meters: updatedMeters,
      flags: updatedFlags,
      inventory: updatedInventory,
      historyLog: [
        ...prev.historyLog,
        { speaker: gameState.heroine.name, text: choice.text },
      ],
    }));

    // Only ask Gemini for scenes that have no hand-written version
    if (!findCanonicalScene(nextEpisode, nextSceneIndex, nextSceneId)) {
      triggerGeminiGeneration(nextEpisode, nextSceneIndex, choice.text, updatedMeters, updatedFlags);
    }
  };

  // Dedicated Gemini Generation caller with Retry support
  const triggerGeminiGeneration = async (
    targetEpisode: number,
    targetSceneIndex: number,
    chosenText: string,
    targetMeters: typeof gameState.meters,
    targetFlags: typeof gameState.flags
  ) => {
    setIsGeminiLoading(true);
    setGeminiError(null);

    const nextSceneKey = `${targetEpisode}_${targetSceneIndex}`;
    const last5ScenesText = gameState.historyLog.slice(-25).map((l) => `${l.speaker}: ${l.text}`);
    const plannedPlotBeat =
      EPISODE_METAS.find((m) => m.episode === targetEpisode)?.twistTitle ||
      'Investigating who runs @TheLagosTea';

    try {
      const response = await fetch('/api/scene/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episode: targetEpisode,
          sceneIndex: targetSceneIndex,
          episodeTitle: EPISODE_METAS.find((m) => m.episode === targetEpisode)?.title || '',
          heroine: gameState.heroine,
          meters: targetMeters,
          lastChoiceText: chosenText,
          lastScenesHistory: last5ScenesText,
          flags: targetFlags,
          plannedPlotBeat,
          secretPayload: {
            target: gameState.mysterySecret.culprit,
            intent: gameState.mysterySecret.motive,
          },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      const generated = await response.json();
      if (generated && generated.lines && generated.lines.length >= 5) {
        const newSceneData: SceneData = {
          id: `gemini_${nextSceneKey}_${Date.now()}`,
          episode: targetEpisode,
          sceneIndex: targetSceneIndex,
          location: generated.location || currentScene.location,
          timeModifier: generated.timeModifier || currentScene.timeModifier,
          charactersOnStage: generated.charactersOnStage || currentScene.charactersOnStage,
          lines: generated.lines,
          choices:
            generated.choices && generated.choices.length > 0
              ? generated.choices
              : currentScene.choices,
        };

        setDynamicScenes((prev) => {
          const next = { ...prev, [nextSceneKey]: newSceneData };
          try {
            localStorage.setItem('lagos_tea_dynamic_scenes', JSON.stringify(next));
          } catch {}
          return next;
        });
        setGeminiError(null);
      } else {
        throw new Error('Generated scene did not satisfy 5-7 line criteria.');
      }
    } catch (err: any) {
      setGeminiError(err.message || 'Failed to generate scene with Gemini.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleRetryGemini = () => {
    triggerGeminiGeneration(
      gameState.currentEpisode,
      gameState.currentSceneIndex,
      lastChoice?.text || 'Investigated the scene carefully',
      gameState.meters,
      gameState.flags
    );
  };

  // Restart Story
  const handleRestart = (resetCustomization = false) => {
    const newSecret = generateNewSecret();
    const freshState: GameState = {
      currentEpisode: 1,
      currentSceneIndex: 0,
      currentSceneId: 'ep1_sc0',
      currentLineIndex: 0,
      heroine: resetCustomization ? DEFAULT_HEROINE : gameState.heroine,
      meters: {
        popularity: 12,
        loyalty: 50,
        suspicion: 10,
        jealousy: 5,
        reputation: 25,
        romanceChidi: 15,
        romanceKelvin: 10,
        romanceDayo: 0,
      },
      flags: {},
      inventory: INITIAL_INVENTORY,
      historyLog: [],
      mysterySecret: newSecret,
      isTyping: false,
      isWardrobeOpen: false,
      isCluesOpen: false,
      isLogOpen: false,
      isSocialFeedOpen: false,
      soundEnabled: true,
      ending: null,
      social: DEFAULT_SOCIAL_STATE,
    };
    setGameState(freshState);
    setLastChoice(null);
    setDynamicScenes({});
    bgmManager.setMood('heartbreak_melancholy');
    localStorage.removeItem('lagos_tea_last_choice');
    localStorage.removeItem('lagos_tea_dynamic_scenes');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
  };

  const currentEpisodeMeta = EPISODE_METAS.find((m) => m.episode === gameState.currentEpisode) || EPISODE_METAS[0];
  const totalScenesInEpisode = getSceneCount(gameState.currentEpisode);

  // Active speaking character logic
  const isNarrator = currentLine.speaker === 'narrator' || !currentLine.speaker;
  const isHeroineSpeaking = currentLine.speaker === 'heroine';
  const speakerId = currentLine.speaker as CharacterId;

  // Characters on stage to display
  const stageNpcs = currentScene.charactersOnStage?.filter((c) => c !== 'heroine') || [];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans flex flex-col justify-between select-none">
      
      {/* 1. BACKGROUND LAYER (SVG Scene with Day/Night Lighting) */}
      <div className="absolute inset-0 z-0">
        <BackgroundRenderer
          location={currentScene.location}
          timeModifier={currentScene.timeModifier}
        />
      </div>

      {/* 2. TOP HUD: Sleek Influencer Gloss Navigation */}
      <header className="relative z-20 w-full px-3 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent backdrop-blur-xs flex items-center justify-between border-b border-white/5">
        
        {/* Left: Branding & Episode Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 text-amber-300 shadow-sm">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-serif font-black text-xs sm:text-sm tracking-wide text-amber-200">
              LAGOS TEA
            </span>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
            <span className="text-pink-400 font-bold">
              Episode {gameState.currentEpisode}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300">
              Scene {gameState.currentSceneIndex + 1} of {totalScenesInEpisode}
            </span>
          </div>
        </div>

        {/* Center: Dynamic Meters Preview */}
        <div className="hidden md:flex items-center gap-3 bg-black/40 px-3 py-1 rounded-full border border-white/10 text-xs">
          <div className="flex items-center gap-1 text-amber-300 font-medium" title="Popularity">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{gameState.meters.popularity}%</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-300 font-medium" title="Loyalty">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{gameState.meters.loyalty}%</span>
          </div>
          <div className="flex items-center gap-1 text-rose-300 font-medium" title="Suspicion">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{gameState.meters.suspicion}%</span>
          </div>
          <div className="flex items-center gap-1 text-purple-300 font-medium" title="Reputation">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>{gameState.meters.reputation}%</span>
          </div>
          {gameState.meters.romanceChidi > 20 && (
            <div className="flex items-center gap-1 text-blue-300 font-medium" title="Chidi Romance">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>{gameState.meters.romanceChidi}</span>
            </div>
          )}
          {gameState.meters.romanceKelvin > 20 && (
            <div className="flex items-center gap-1 text-pink-300 font-medium" title="Kelvin Romance">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>{gameState.meters.romanceKelvin}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Social Feed (GidiGram) */}
          <button
            onClick={() => {
              setSocialFeedInitialTab('for_you');
              setGameState((prev) => ({ ...prev, isSocialFeedOpen: true }));
              if (gameState.soundEnabled) playSound.click();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-gradient-to-r from-pink-950/80 to-purple-950/80 hover:from-pink-900/90 hover:to-purple-900/90 text-neutral-100 border border-pink-500/40 text-xs flex items-center gap-1.5 transition-all relative shadow-sm hover:shadow-pink-500/20"
            title="GidiGram Influencer Feed"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline font-bold text-pink-200">Feed</span>
            {/* Live notification badge for viral leaks / updates */}
            {(gameState.currentSceneIndex >= 6 || gameState.currentEpisode > 1) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            )}
          </button>

          {/* Direct Messages Quick Button */}
          <button
            onClick={() => {
              setSocialFeedInitialTab('dms');
              setGameState((prev) => ({ ...prev, isSocialFeedOpen: true }));
              if (gameState.soundEnabled) playSound.click();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 text-xs flex items-center gap-1 transition-all relative"
            title="Direct Messages"
          >
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">DMs</span>
            {unreadDmCount > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center absolute -top-1 -right-1 animate-pulse">
                {unreadDmCount}
              </span>
            )}
          </button>

          {/* Wardrobe */}
          <button
            onClick={() => setGameState((prev) => ({ ...prev, isWardrobeOpen: true }))}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 text-xs flex items-center gap-1 transition-all"
            title="Wardrobe Customizer"
          >
            <Shirt className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Look</span>
          </button>

          {/* Clue Board */}
          <button
            onClick={() => setGameState((prev) => ({ ...prev, isCluesOpen: true }))}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 text-xs flex items-center gap-1 transition-all relative"
            title="Clue Board & Dossier"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Clues</span>
            {gameState.inventory.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            )}
          </button>

          {/* Dialogue Log */}
          <button
            onClick={() => setGameState((prev) => ({ ...prev, isLogOpen: true }))}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 text-xs flex items-center gap-1 transition-all"
            title="Dialogue History"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* Dynamic Music BGM Button */}
          <button
            onClick={() => setIsMusicModalOpen(true)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 text-xs flex items-center gap-1.5 transition-all group"
            title={`Soundtrack: ${musicState.title} (${musicState.vibe}) - Click for audio controls`}
          >
            <Music className={`w-3.5 h-3.5 ${gameState.soundEnabled && musicState.isPlaying ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'}`} />
            <span className="hidden md:inline font-medium text-[11px] max-w-[105px] truncate text-amber-200/90">
              {musicState.title}
            </span>
            <div className="flex items-end gap-0.5 h-2.5">
              <span className={`w-0.5 rounded-full ${gameState.soundEnabled && musicState.isPlaying ? 'bg-amber-400 h-2.5 animate-pulse' : 'bg-neutral-600 h-1'}`} />
              <span className={`w-0.5 rounded-full ${gameState.soundEnabled && musicState.isPlaying ? 'bg-amber-400 h-1.5 animate-pulse' : 'bg-neutral-600 h-1'}`} />
              <span className={`w-0.5 rounded-full ${gameState.soundEnabled && musicState.isPlaying ? 'bg-amber-400 h-2 animate-pulse' : 'bg-neutral-600 h-1'}`} />
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !gameState.soundEnabled;
              setGameState((prev) => ({ ...prev, soundEnabled: next }));
              if (next) playSound.click();
            }}
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 text-xs transition-all"
            title={gameState.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {gameState.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>

          {/* Restart */}
          <button
            onClick={() => handleRestart(false)}
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-700/60 text-xs transition-all"
            title="Restart Episode 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. CENTER STAGE: SVG Character Visual Novel Avatars */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-5xl mx-auto flex items-end justify-between px-4 sm:px-12 pointer-events-none pb-2 sm:pb-4">
        
        {/* Left Character: Heroine Ada */}
        <div
          className={`relative w-44 sm:w-64 md:w-80 h-full max-h-[52vh] sm:max-h-[60vh] transition-all duration-300 origin-bottom ${
            isHeroineSpeaking
              ? 'scale-105 brightness-105 z-20 drop-shadow-2xl'
              : 'scale-95 brightness-90 opacity-95 z-10'
          }`}
        >
          <HeroineSvg
            customization={gameState.heroine}
            expression={isHeroineSpeaking ? currentLine.expression || 'neutral' : 'neutral'}
            isTalking={isHeroineSpeaking && !isTypingComplete}
            lookDirection={stageNpcs.length > 0 ? 'right' : 'center'}
          />
        </div>

        {/* Right Character: NPC (Zee, Tamara, Chi, Bisola, Hauwa, Chidi, Kelvin) */}
        {stageNpcs.length > 0 && (
          <div
            className={`relative w-44 sm:w-64 md:w-80 h-full max-h-[52vh] sm:max-h-[60vh] transition-all duration-300 origin-bottom ${
              !isHeroineSpeaking && !isNarrator
                ? 'scale-105 brightness-105 z-20 drop-shadow-2xl'
                : 'scale-95 brightness-90 opacity-95 z-10'
            }`}
          >
            <NpcSvg
              characterId={stageNpcs[0]}
              expression={
                currentLine.speaker === stageNpcs[0]
                  ? currentLine.expression || 'neutral'
                  : 'neutral'
              }
              isTalking={currentLine.speaker === stageNpcs[0] && !isTypingComplete}
              lookDirection="left"
            />
          </div>
        )}
      </main>

      {/* 4. BOTTOM DIALOGUE & CHOICE BOX */}
      <footer className="relative z-30 w-full shrink-0 p-2.5 sm:p-5 max-w-4xl mx-auto">
        
        {/* Gemini Scene Retry Banner if error occurred */}
        {geminiError && (
          <div className="mb-2.5 p-3 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Live generation was delayed: {geminiError}</span>
            </div>
            <button
              onClick={handleRetryGemini}
              disabled={isGeminiLoading}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
              Retry Scene
            </button>
          </div>
        )}

        <div className="relative rounded-3xl bg-neutral-950/90 border border-neutral-800/80 shadow-2xl backdrop-blur-md p-4 sm:p-6 overflow-hidden">
          
          {/* Subtle Top Gloss Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-pink-500 to-emerald-500" />

          {/* Dialogue Speaker Pill */}
          {!isNarrator && (
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500/20 to-amber-500/20 border border-pink-500/30 text-pink-300">
                  {getSpeakerDisplayName(currentLine.speaker)}
                </span>
                {currentLine.expression && (
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest">
                    [{currentLine.expression}]
                  </span>
                )}
              </div>

              {/* Progress counter */}
              <span className="text-[11px] font-mono text-neutral-500">
                {gameState.currentLineIndex + 1} / {currentScene.lines.length}
              </span>
            </div>
          )}

          {isNarrator && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                • NARRATION •
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {gameState.currentLineIndex + 1} / {currentScene.lines.length}
              </span>
            </div>
          )}

          {/* Dialogue Text Container */}
          <div
            onClick={handleAdvanceDialogue}
            className="cursor-pointer min-h-[64px] sm:min-h-[76px] flex flex-col justify-between"
          >
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isNarrator
                  ? 'text-neutral-300 italic font-serif'
                  : 'text-neutral-100 font-sans'
              }`}
            >
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
              )}
            </p>

            {/* Advance Prompt Hint */}
            {!isLastLineOfScene && isTypingComplete && (
              <div className="self-end mt-2 flex items-center gap-1 text-[11px] text-amber-400/80 font-medium animate-pulse">
                <span>Tap to continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Choice Selection Grid (Appears on last line of the scene) */}
          {isLastLineOfScene && isTypingComplete && (
            <div className="mt-4 pt-3.5 border-t border-neutral-800/80 space-y-2.5 animate-in fade-in duration-200">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400/90 block font-bold">
                CHOOSE YOUR MOVE:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[45vh] overflow-y-auto overscroll-contain">

                {currentScene.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className="group text-left p-3 rounded-2xl bg-gradient-to-r from-neutral-900/90 to-neutral-900/60 hover:from-neutral-800 hover:to-neutral-800/90 border border-neutral-800 hover:border-pink-500/50 transition-all flex flex-col justify-between shadow-md hover:shadow-pink-500/10"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-neutral-100 group-hover:text-pink-300 transition-colors leading-snug">
                      {choice.text}
                    </span>
                    {choice.consequenceText && (
                      <span className="mt-1.5 text-[11px] text-neutral-400 group-hover:text-neutral-300 leading-tight">
                        {choice.consequenceText}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* 5. "PREVIOUSLY ON..." RECAP MODAL (Episode 2 onward) */}
      {showRecapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 text-neutral-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coffee className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
              PREVIOUSLY ON LAGOS TEA
            </span>
            <h3 className="text-xl font-serif font-black text-neutral-100 mb-3">
              {currentEpisodeMeta.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-left p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 mb-5">
              {currentEpisodeMeta.recap}
            </p>

            <button
              onClick={() => {
                setShowRecapModal(false);
                if (gameState.soundEnabled) playSound.click();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-98"
            >
              Start Episode {gameState.currentEpisode}
            </button>
          </div>
        </div>
      )}

      {/* 6. TWIST MOMENT MODAL */}
      {activeTwistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-neutral-950 border border-pink-500/40 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">
              MAJOR VIRAL TWIST
            </span>
            <h3 className="text-lg font-serif font-bold text-neutral-100 mt-1 mb-2">
              {activeTwistModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
              {activeTwistModal.description}
            </p>
            <button
              onClick={() => setActiveTwistModal(null)}
              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors"
            >
              Continue Story
            </button>
          </div>
        </div>
      )}

      {/* 7. FIRST LAUNCH WELCOME & CUSTOMIZER */}
      {isFirstLaunch && (
        <HeroineCustomizer
          customization={gameState.heroine}
          isInitialSetup={true}
          onSave={(updated) => {
            setGameState((prev) => ({
              ...prev,
              heroine: updated,
            }));
            setIsFirstLaunch(false);
            if (gameState.soundEnabled) playSound.phoneChime();
          }}
        />
      )}

      {/* 8. WARDROBE CUSTOMIZER DRAWER */}
      {gameState.isWardrobeOpen && (
        <HeroineCustomizer
          customization={gameState.heroine}
          onSave={(updated) => {
            setGameState((prev) => ({
              ...prev,
              heroine: updated,
              isWardrobeOpen: false,
            }));
            if (gameState.soundEnabled) playSound.click();
          }}
          onClose={() => setGameState((prev) => ({ ...prev, isWardrobeOpen: false }))}
        />
      )}

      {/* 9. CLUE BOARD DOSSIER */}
      {gameState.isCluesOpen && (
        <ClueBoard
          inventory={gameState.inventory}
          meters={gameState.meters}
          flags={gameState.flags}
          heroine={gameState.heroine}
          soundEnabled={gameState.soundEnabled}
          onClose={() => setGameState((prev) => ({ ...prev, isCluesOpen: false }))}
        />
      )}

      {/* 10. DIALOGUE LOG MODAL */}
      {gameState.isLogOpen && (
        <HistoryLog
          logs={gameState.historyLog}
          onClose={() => setGameState((prev) => ({ ...prev, isLogOpen: false }))}
        />
      )}

      {/* 11. SOCIAL FEED (GIDIGRAM) OVERLAY */}
      {gameState.isSocialFeedOpen && (
        <SocialFeedOverlay
          currentEpisode={gameState.currentEpisode}
          currentSceneIndex={gameState.currentSceneIndex}
          heroineCustomization={gameState.heroine}
          meters={gameState.meters}
          inventory={gameState.inventory}
          flags={gameState.flags}
          soundEnabled={gameState.soundEnabled}
          social={gameState.social}
          initialTab={socialFeedInitialTab}
          onUpdateSocial={(updater) =>
            setGameState((prev) => ({
              ...prev,
              social: updater(prev.social),
            }))
          }
          onUpdateMeters={(changes) =>
            setGameState((prev) => ({
              ...prev,
              meters: applyMeterChanges(prev.meters, changes),
            }))
          }
          onUpdateFlags={(flag) =>
            setGameState((prev) => ({
              ...prev,
              flags: { ...prev.flags, [flag]: true },
            }))
          }
          onAddClue={(clue) =>
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.some((i) => i.id === clue.id)
                ? prev.inventory
                : [...prev.inventory, clue],
            }))
          }
          onClose={() => setGameState((prev) => ({ ...prev, isSocialFeedOpen: false }))}
          onOpenWardrobe={() =>
            setGameState((prev) => ({
              ...prev,
              isSocialFeedOpen: false,
              isWardrobeOpen: true,
            }))
          }
          onOpenClues={() =>
            setGameState((prev) => ({
              ...prev,
              isSocialFeedOpen: false,
              isCluesOpen: true,
            }))
          }
        />
      )}

      {/* 12. TO BE CONTINUED (end of the episodes written so far) */}
      {gameState.reachedEndOfContent && !activeTwistModal && !gameState.ending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 text-neutral-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coffee className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
              END OF EPISODE {gameState.currentEpisode}
            </span>
            <h3 className="text-xl font-serif font-black text-neutral-100 mb-3">To be continued…</h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 mb-5">
              The tea is still brewing. Episode {gameState.currentEpisode + 1} is coming soon, and your choices so far
              have been saved.
            </p>

            <button
              onClick={() => handleRestart(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-98"
            >
              Replay from Episode 1
            </button>
          </div>
        </div>
      )}

      {/* 13. ENDING SCREEN (Maintained but not triggered yet) */}
      {gameState.ending && (
        <EndingScreen
          ending={gameState.ending}
          heroine={gameState.heroine}
          meters={gameState.meters}
          onRestart={handleRestart}
        />
      )}

      {/* 14. DYNAMIC MUSIC PLAYER MODAL */}
      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        soundEnabled={gameState.soundEnabled}
        onToggleSound={() => {
          const next = !gameState.soundEnabled;
          setGameState((prev) => ({ ...prev, soundEnabled: next }));
          if (next) playSound.click();
        }}
        currentSceneMood={currentScene?.musicMood}
      />
    </div>
  );
}
