import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SocialPost,
  SocialStory,
  FeedFilterTab,
  SocialState,
  AdaPost,
  AdaPostTone,
} from '../../types/socialFeed';
import { HeroineCustomization, Meters, InventoryItem, CharacterId } from '../../types/vn';
import { INITIAL_POSTS, INITIAL_STORIES } from '../../data/socialFeedData';
import { SocialPostCard } from './SocialPostCard';
import { SocialAvatar } from './SocialAvatar';
import { StoryViewerModal } from './StoryViewerModal';
import { InstagramProfileView } from './InstagramProfileView';
import { AdaProfileView } from './AdaProfileView';
import { AdaPostComposer } from './AdaPostComposer';
import { TrendingView } from './TrendingView';
import { GIDIGRAM_TRENDS, GidiGramTrend } from '../../data/trendData';
import {
  PhotoOption,
  TONE_INFO,
  computeReach,
  buildFallbackComments,
  adaPostToSocialPost,
  getUpdatedAdaPostForScene,
} from '../../data/adaPosts';
import {
  CAST_PROFILES,
  getFollowToggleEffect,
  formatCount,
  resolvePost,
  computeFollowers,
  DEFAULT_SOCIAL_STATE,
  isUnlocked,
} from '../../data/socialRules';
import {
  X,
  Sparkles,
  Flame,
  Coffee,
  Users,
  User,
  RefreshCw,
  Wifi,
  Battery,
  Plus,
  Check,
  UserCheck,
  UserPlus,
  TrendingUp,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface SocialFeedOverlayProps {
  currentEpisode: number;
  currentSceneIndex: number;
  heroineCustomization: HeroineCustomization;
  meters: Meters;
  inventory: InventoryItem[];
  flags?: Record<string, boolean>;
  soundEnabled: boolean;
  initialProfileUserId?: CharacterId | 'lagos_tea' | 'heroine' | null;
  social?: SocialState;
  onUpdateSocial?: (updater: (prev: SocialState) => SocialState) => void;
  onUpdateMeters?: (changes: Partial<Meters>) => void;
  onUpdateFlags?: (flag: string) => void;
  onClose: () => void;
  onOpenWardrobe: () => void;
  onOpenClues: () => void;
  onOpenBioModal?: (charId: CharacterId) => void;
}

const CAST_DIRECTORY: Array<{
  id: CharacterId | 'lagos_tea';
  name: string;
  handle: string;
  category: string;
  followers: string;
  badge: string;
  cloutNote: string;
  popImpact: number;
}> = [
  {
    id: 'zee',
    name: 'Zainab "Zee" Bello',
    handle: '@zeebello',
    category: 'Fashion Creative Director • Queen Bee',
    followers: '4.0M',
    badge: '👑 ROYALTY',
    cloutNote: '+5% Popularity & High-Society Algorithmic Slay',
    popImpact: 5,
  },
  {
    id: 'tamara',
    name: 'Tamara Okonkwo-Reid',
    handle: '@tamara_reid',
    category: 'Island Heiress • Style Siren',
    followers: '2.5M',
    badge: '🌴 HEIRESS',
    cloutNote: '+4% Popularity & Island Squad Backing',
    popImpact: 4,
  },
  {
    id: 'kelvin',
    name: 'Kelvin Adebayo-Wright',
    handle: '@kelvin_wright',
    category: 'Billionaire Heir • Polo Club Star',
    followers: '1.8M',
    badge: '💎 BILLIONAIRE',
    cloutNote: '+4% Popularity & VIP Engagement',
    popImpact: 4,
  },
  {
    id: 'dayo',
    name: 'Dayo Martins',
    handle: '@dayomartins_sound',
    category: 'Grammy-Nominated Hitmaker Producer',
    followers: '950K',
    badge: '🎧 HITMAKER',
    cloutNote: '+3% Popularity & Creative Buzz',
    popImpact: 3,
  },
  {
    id: 'chi',
    name: 'Chioma Eze',
    handle: '@chi_corporate_glam',
    category: 'Corporate Glam & High-Court Counsel',
    followers: '600K',
    badge: '⚖️ LEGAL GLAM',
    cloutNote: '+3% Popularity & Brand Credibility',
    popImpact: 3,
  },
  {
    id: 'lagos_tea',
    name: 'The Lagos Tea 🫖',
    handle: '@TheLagosTea',
    category: 'Anonymous Gossip Dossier & Receipts',
    followers: '500K',
    badge: '🫖 LEAKS',
    cloutNote: '+3% Popularity & Dangerous Drama Access',
    popImpact: 3,
  },
  {
    id: 'bisola',
    name: 'Bisola Adeyemi',
    handle: '@bisola_vlogs',
    category: 'Viral Daily Vlogger & Behind-the-Scenes',
    followers: '400K',
    badge: '🎥 VLOGGER',
    cloutNote: '+3% Popularity & Trending Gist',
    popImpact: 3,
  },
  {
    id: 'hauwa',
    name: 'Hauwa Musa',
    handle: '@hauwa_mindbody',
    category: 'Holistic Zen Wellness & Soul Coach',
    followers: '350K',
    badge: '🌿 WELLNESS',
    cloutNote: '+2% Popularity & Serene Aura',
    popImpact: 2,
  },
  {
    id: 'chidi',
    name: 'Chidi Nwosu',
    handle: '@chidi_captures',
    category: 'Editorial & Campus Documentary Photographer',
    followers: '120K',
    badge: '📸 LENS',
    cloutNote: '+2% Popularity & Candid Romance Boost',
    popImpact: 2,
  },
];

export const SocialFeedOverlay: React.FC<SocialFeedOverlayProps> = ({
  currentEpisode,
  currentSceneIndex,
  heroineCustomization,
  meters,
  inventory,
  flags = {},
  soundEnabled,
  initialProfileUserId = null,
  social,
  onUpdateSocial,
  onUpdateMeters,
  onUpdateFlags,
  onClose,
  onOpenWardrobe,
  onOpenClues,
  onOpenBioModal,
}) => {
  const [activeTab, setActiveTab] = useState<FeedFilterTab>('for_you');
  const [viewingProfileUserId, setViewingProfileUserId] = useState<
    CharacterId | 'lagos_tea' | 'heroine' | null
  >(initialProfileUserId);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [selectedCastMember, setSelectedCastMember] = useState<CharacterId | 'all'>('all');

  // Track follow status of NPCs: true = unfollowed, false/undefined = followed
  const [unfollowed, setUnfollowed] = useState<Record<string, boolean>>(() => {
    return social?.unfollowed || {};
  });

  // Sync unfollowed state if parent social updates
  useEffect(() => {
    if (social?.unfollowed) {
      setUnfollowed(social.unfollowed);
    }
  }, [social?.unfollowed]);

  // Helper to construct all posts with narrative memory resolution
  const resolveAllPosts = useCallback(() => {
    const activeSocial = social || DEFAULT_SOCIAL_STATE;
    const existingAdaPosts = (activeSocial.adaPosts || []).map((adaP) => {
      const updatedPost = getUpdatedAdaPostForScene(
        adaP,
        currentEpisode,
        currentSceneIndex,
        meters.popularity,
        activeSocial.unfollowed,
        flags
      );
      return adaPostToSocialPost(
        updatedPost,
        heroineCustomization.name,
        meters.popularity >= 60
      );
    });
    const resolvedInitialPosts = INITIAL_POSTS.map((p) =>
      resolvePost(p, flags, activeSocial)
    );
    return [...existingAdaPosts, ...resolvedInitialPosts];
  }, [social, currentEpisode, currentSceneIndex, meters.popularity, flags, heroineCustomization.name]);

  // Merge static posts with player's dynamic Ada posts
  const [posts, setPosts] = useState<SocialPost[]>(() => resolveAllPosts());

  // Synchronize posts when flags, episode, scene, or social updates
  useEffect(() => {
    setPosts(resolveAllPosts());
  }, [resolveAllPosts]);

  const [stories, setStories] = useState<SocialStory[]>(INITIAL_STORIES);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [adaStoryCaption, setAdaStoryCaption] = useState('');
  const [showPostComposerModal, setShowPostComposerModal] = useState(false);
  const [isPostingAda, setIsPostingAda] = useState(false);

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Follow / Unfollow Toggle Handler
  const handleToggleFollow = useCallback(
    (authorId: string) => {
      const npcId = authorId as CharacterId | 'lagos_tea';
      const wasFollowing = !unfollowed[npcId];
      const nowFollowing = !wasFollowing;

      // Calculate the impact on Popularity & other meters
      const effect = getFollowToggleEffect(npcId, nowFollowing);

      setUnfollowed((prev) => {
        const next = { ...prev, [npcId]: !nowFollowing };
        return next;
      });

      if (onUpdateSocial) {
        onUpdateSocial((prev) => ({
          ...prev,
          unfollowed: { ...prev.unfollowed, [npcId]: !nowFollowing },
        }));
      }

      if (onUpdateMeters && effect.meterChanges) {
        onUpdateMeters(effect.meterChanges);
      }

      if (onUpdateFlags && effect.flagToSet) {
        onUpdateFlags(effect.flagToSet);
      }

      if (soundEnabled) {
        nowFollowing ? playSound.likePop() : playSound.click();
      }

      const charProfile = CAST_PROFILES[npcId] || { name: npcId, handle: `@${npcId}` };
      const popChange = effect.meterChanges?.popularity;
      if (nowFollowing) {
        const popSign = popChange && popChange > 0 ? `+${popChange}%` : '';
        showToast(`✨ Followed ${charProfile.handle}! Popularity ${popSign} (Influencer Network Boosted) 🔥`);
      } else {
        showToast(`Unfollowed ${charProfile.handle}. Popularity ${popChange}% (Clout Reduced) 📉`);
      }
    },
    [unfollowed, onUpdateSocial, onUpdateMeters, onUpdateFlags, soundEnabled]
  );

  // Filter posts based on story progression and user filters
  const visiblePosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Progression check: has this post unlocked in the story?
      if (!isUnlocked(post, currentEpisode, currentSceneIndex, flags)) {
        return false;
      }

      // 2. Tab Filter
      if (activeTab === 'tea_leaks') {
        if (!post.isTeaLeak && post.authorId !== 'lagos_tea') return false;
      }

      if (activeTab === 'cast') {
        if (selectedCastMember !== 'all' && post.authorId !== selectedCastMember) {
          return false;
        }
      }

      // 3. Hashtag Filter
      if (activeHashtag && !post.hashtags.includes(activeHashtag)) {
        return false;
      }

      return true;
    });
  }, [posts, currentEpisode, currentSceneIndex, flags, activeTab, selectedCastMember, activeHashtag]);

  // Visible stories based on progression
  const visibleStories = useMemo(() => {
    return stories.filter((story) =>
      isUnlocked(story, currentEpisode, currentSceneIndex, flags)
    );
  }, [stories, currentEpisode, currentSceneIndex, flags]);

  // Visible trends based on story progression and flags
  const visibleTrends = useMemo(() => {
    return GIDIGRAM_TRENDS.filter((trend) =>
      isUnlocked(trend, currentEpisode, currentSceneIndex, flags)
    );
  }, [currentEpisode, currentSceneIndex, flags]);

  // Handle story viewed
  const handleStoryViewed = useCallback((storyId: string) => {
    setStories((prev) => {
      const target = prev.find((s) => s.id === storyId);
      if (!target || !target.hasUnseen) {
        return prev;
      }
      return prev.map((s) => (s.id === storyId ? { ...s, hasUnseen: false } : s));
    });
  }, []);

  // Handle player liking a post
  const handleLikePost = (post: SocialPost) => {
    const postId = post.id;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const wasLiked = p.isLikedByPlayer;
          return {
            ...p,
            isLikedByPlayer: !wasLiked,
            likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Handle player commenting on a post
  const handleAddComment = (post: SocialPost, text: string) => {
    const postId = post.id;
    const newComment = {
      id: `comment_ada_${Date.now()}`,
      authorId: 'heroine' as const,
      authorName: `${heroineCustomization.name} Obi`,
      authorHandle: '@ada_obi',
      isVerified: false,
      avatarType: 'heroine' as const,
      text,
      likes: 1,
      isLiked: true,
      timestamp: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
    showToast('Your comment was posted to the feed! ✨');
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (soundEnabled) playSound.click();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('GidiGram Feed updated! 🔄');
    }, 600);
  };

  // Handle sharing
  const handleSharePost = (post: SocialPost) => {
    showToast(`Shared ${post.authorHandle}'s post to your DMs! 📲`);
  };

  // Handle posting Ada's story
  const handlePostAdaStory = () => {
    if (!adaStoryCaption.trim()) return;

    const newAdaSlide = {
      id: `ada_slide_${Date.now()}`,
      timestamp: 'Just now',
      bgGradient: 'from-pink-600 via-purple-700 to-neutral-950',
      caption: adaStoryCaption.trim(),
      stickerText: '✨ ADA OBI EXCLUSIVE',
    };

    const existingAdaStoryIdx = stories.findIndex((s) => s.authorId === 'heroine');

    if (existingAdaStoryIdx !== -1) {
      setStories((prev) => {
        const next = [...prev];
        next[existingAdaStoryIdx] = {
          ...next[existingAdaStoryIdx],
          slides: [newAdaSlide, ...next[existingAdaStoryIdx].slides],
          hasUnseen: true,
        };
        return next;
      });
    } else {
      const newStory: SocialStory = {
        id: 'story_ada',
        authorId: 'heroine',
        authorName: `${heroineCustomization.name} Obi`,
        authorHandle: '@ada_obi',
        avatarType: 'heroine',
        hasUnseen: true,
        unlockEpisode: 1,
        slides: [newAdaSlide],
      };
      setStories((prev) => [newStory, ...prev]);
    }

    setAdaStoryCaption('');
    setShowAddStoryModal(false);
    if (soundEnabled) playSound.phoneChime();
    showToast('Your story is live on GidiGram! 📸');
  };

  // Handle posting a full Ada feed post (influenced by Popularity & followed NPCs)
  const handlePostAda = (photo: PhotoOption, tone: AdaPostTone, caption: string) => {
    setIsPostingAda(true);
    setTimeout(() => {
      const newPostId = `ada_post_${Date.now()}`;
      // Reach and likes are dynamically amplified by Popularity AND followed NPCs
      const reach = computeReach(tone, meters.popularity, unfollowed);
      // Comments are tailored based on who is followed vs unfollowed and player's story choices
      const comments = buildFallbackComments(tone, meters, flags, newPostId, unfollowed);

      const newAdaPost: AdaPost = {
        id: newPostId,
        episode: currentEpisode,
        sceneIndex: currentSceneIndex,
        photoKind: photo.kind,
        photoLabel: photo.label,
        bgGradient: photo.bgGradient,
        tone,
        caption,
        likesCount: reach.likesCount,
        followerGain: reach.followerGain,
        comments,
      };

      const convertedSocialPost = adaPostToSocialPost(
        newAdaPost,
        heroineCustomization.name,
        meters.popularity >= 60
      );

      setPosts((prev) => [convertedSocialPost, ...prev]);

      if (onUpdateSocial) {
        onUpdateSocial((prev) => ({
          ...prev,
          adaPosts: [newAdaPost, ...(prev.adaPosts || [])],
          followerBonus: (prev.followerBonus || 0) + reach.followerGain,
        }));
      }

      const toneEffect = TONE_INFO[tone].effect;
      if (onUpdateMeters && toneEffect.meterChanges) {
        onUpdateMeters(toneEffect.meterChanges);
      }

      setIsPostingAda(false);
      setShowPostComposerModal(false);
      if (soundEnabled) playSound.phoneChime();
      showToast(`Post published! ~${formatCount(reach.likesCount)} likes & ${comments.length} comments rolling in! 📸✨`);
    }, 450);
  };

  // Check how many high-society NPCs the player is following
  const followedNpcCount = useMemo(() => {
    return CAST_DIRECTORY.filter((c) => !unfollowed[c.id]).length;
  }, [unfollowed]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Social Phone Frame Container */}
      <div className="relative z-10 w-full max-w-lg h-[94vh] max-h-[860px] bg-neutral-950 border border-neutral-800 rounded-[32px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* 1. Phone Status Bar (Notch & Indicators) */}
        <div className="pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-mono text-neutral-400 select-none bg-neutral-950/80 backdrop-blur-md z-30">
          <span>11:42 PM</span>
          <div className="w-24 h-4 bg-neutral-900 rounded-full border border-neutral-800/80 mx-auto" />
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-[10px]">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* 2. Top App Bar: Brand Logo & Controls */}
        {!viewingProfileUserId && (
          <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md z-30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif italic font-black bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent leading-none">
                  GidiGram
                </h2>
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  <span>Lagos Social Pulse</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">Pop: {meters.popularity}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* New Post Button */}
              <button
                onClick={() => {
                  setShowPostComposerModal(true);
                  if (soundEnabled) playSound.click();
                }}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-sm hover:from-pink-500 hover:to-amber-400 transition-all active:scale-95"
                title="Create a new post"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Post</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all border border-neutral-800"
                title="Refresh Feed"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-pink-400' : ''}`}
                />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  onClose();
                  if (soundEnabled) playSound.click();
                }}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-rose-400 transition-all border border-neutral-800"
                title="Close Feed"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Navigation Tabs: For You, Tea Leaks, Cast, Profile */}
        {!viewingProfileUserId && (
          <div className="px-3 py-2 flex items-center gap-1.5 border-b border-neutral-800/60 bg-neutral-950/60 overflow-x-auto scrollbar-none z-20">
            <button
              onClick={() => {
                setActiveTab('for_you');
                setActiveHashtag(null);
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'for_you'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>For You</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('trending');
                setActiveHashtag(null);
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'trending'
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
              <span>Trending ({visibleTrends.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tea_leaks');
                setActiveHashtag(null);
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'tea_leaks'
                  ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-rose-400" />
              <span>Tea Leaks</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('cast');
                setActiveHashtag(null);
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'cast'
                  ? 'bg-gradient-to-r from-amber-600 to-pink-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Influencer Cast ({followedNpcCount}/{CAST_DIRECTORY.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-pink-300" />
              <span>Ada ({meters.popularity}%)</span>
            </button>
          </div>
        )}

        {/* 4. Active Filter Badges */}
        {!viewingProfileUserId && (activeHashtag || (activeTab === 'cast' && selectedCastMember !== 'all')) && (
          <div className="px-4 py-1.5 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Filtering by:
              </span>
              <span className="font-bold text-pink-400">
                {activeHashtag || selectedCastMember}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveHashtag(null);
                setSelectedCastMember('all');
              }}
              className="text-[11px] text-neutral-400 hover:text-white underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* 5. Sub-filter pills for Cast Tab */}
        {!viewingProfileUserId && activeTab === 'cast' && (
          <div className="px-3 py-2 border-b border-neutral-800/50 bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Cast' },
              { id: 'zee', label: 'Zee' },
              { id: 'tamara', label: 'Tamara' },
              { id: 'kelvin', label: 'Kelvin' },
              { id: 'dayo', label: 'Dayo' },
              { id: 'chi', label: 'Chi' },
              { id: 'bisola', label: 'Bisola' },
              { id: 'hauwa', label: 'Hauwa' },
              { id: 'chidi', label: 'Chidi' },
              { id: 'lagos_tea', label: 'Lagos Tea' },
            ].map((cast) => (
              <button
                key={cast.id}
                onClick={() => setSelectedCastMember(cast.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all shrink-0 ${
                  selectedCastMember === cast.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cast.label}
              </button>
            ))}
          </div>
        )}

        {/* 6. Content Section: Profile View OR Feed Stream */}
        {viewingProfileUserId ? (
          <InstagramProfileView
            userId={viewingProfileUserId}
            allPosts={posts}
            heroine={heroineCustomization}
            meters={meters}
            inventory={inventory}
            soundEnabled={soundEnabled}
            isFollowing={!unfollowed[viewingProfileUserId]}
            onBack={() => setViewingProfileUserId(null)}
            onToggleFollow={() => handleToggleFollow(viewingProfileUserId)}
            onMessage={() => {
              showToast(`DMs with @${viewingProfileUserId} active in phone inbox 📲`);
            }}
            renderPostCard={(post) => (
              <SocialPostCard
                key={post.id}
                post={post}
                heroineCustomization={heroineCustomization}
                soundEnabled={soundEnabled}
                isFollowing={!unfollowed[post.authorId]}
                onToggleFollow={handleToggleFollow}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onHashtagClick={(tag) => setActiveHashtag(tag)}
                onSharePost={handleSharePost}
                onViewProfile={(authorId) => setViewingProfileUserId(authorId as any)}
              />
            )}
            onOpenWardrobe={onOpenWardrobe}
            onOpenClues={onOpenClues}
            onOpenBioModal={onOpenBioModal}
          />
        ) : (
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
            
            {/* Stories Tray Carousel (Shown on feed tabs) */}
            {activeTab !== 'profile' && (
              <div className="pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
                  {/* Ada's Story / Add Story Button */}
                  <div
                    onClick={() => setShowAddStoryModal(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
                  >
                    <div className="relative">
                      <SocialAvatar
                        avatarType="heroine"
                        heroineCustomization={heroineCustomization}
                        size="lg"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center border-2 border-neutral-950 shadow-md">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-neutral-300">
                      Your Story
                    </span>
                  </div>

                  {/* Influencer Story Rings */}
                  {visibleStories.map((story, idx) => (
                    <div
                      key={story.id}
                      onClick={() => {
                        setActiveStoryIdx(idx);
                        if (soundEnabled) playSound.cameraShutter();
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      <SocialAvatar
                        avatarType={story.avatarType}
                        heroineCustomization={heroineCustomization}
                        size="lg"
                        hasStoryRing={true}
                        hasUnseenStory={story.hasUnseen}
                        isLagosTea={story.authorId === 'lagos_tea'}
                      />
                      <span className="text-[10px] font-medium text-neutral-300 truncate max-w-[64px] text-center">
                        {story.authorName.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CAST DIRECTORY & NETWORK SQUAD CAROUSEL (In Influencer Cast Tab) */}
            {activeTab === 'cast' && (
              <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/90 p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="font-serif font-black text-sm text-neutral-100">
                      Lagos High-Society Network
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-pink-400 uppercase">
                    {followedNpcCount} / {CAST_DIRECTORY.length} Followed
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Following influencers connects you to their algorithm reach, giving your posts more likes & viral comments in future scenes. Unfollowing decreases your Popularity!
                </p>

                <div className="space-y-2 pt-1">
                  {CAST_DIRECTORY.map((member) => {
                    const isFollowing = !unfollowed[member.id];
                    return (
                      <div
                        key={member.id}
                        className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                      >
                        <div
                          onClick={() => setViewingProfileUserId(member.id)}
                          className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
                        >
                          <SocialAvatar
                            avatarType={member.id === 'lagos_tea' ? 'lagos_tea' : (member.id as CharacterId)}
                            heroineCustomization={heroineCustomization}
                            size="md"
                            isLagosTea={member.id === 'lagos_tea'}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-neutral-100 group-hover:text-pink-300 transition-colors truncate">
                                {member.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 shrink-0">
                                {member.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono truncate">
                              {member.handle} • {member.followers}
                            </div>
                            <div className="text-[10px] text-pink-400/90 truncate mt-0.5">
                              {member.cloutNote}
                            </div>
                          </div>
                        </div>

                        {/* Follow / Following Toggle Button */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFollow(member.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                              isFollowing
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                                : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white shadow-md shadow-pink-500/20'
                            }`}
                            title={isFollowing ? `Unfollow ${member.handle}` : `Follow ${member.handle}`}
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-pink-400" />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5 text-amber-200" />
                                <span>+ Follow</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile View Tab */}
            {activeTab === 'profile' && (
              <AdaProfileView
                heroine={heroineCustomization}
                followers={computeFollowers(
                  meters,
                  currentEpisode,
                  currentSceneIndex,
                  social || DEFAULT_SOCIAL_STATE,
                  followedNpcCount
                )}
                followingCount={18 + followedNpcCount}
                adaPosts={visiblePosts.filter((p) => p.authorId === 'heroine')}
                taggedPosts={visiblePosts.filter((p) => p.authorId !== 'heroine')}
                inventoryCount={inventory.length}
                soundEnabled={soundEnabled}
                onOpenWardrobe={onOpenWardrobe}
                onOpenClues={onOpenClues}
                onOpenPost={(postId) => {
                  showToast(`Viewing post #${postId}`);
                }}
                onCompose={() => {
                  setShowPostComposerModal(true);
                }}
              />
            )}

            {/* Trending View Tab */}
            {activeTab === 'trending' && (
              <TrendingView
                trends={visibleTrends}
                allPosts={posts}
                heroineCustomization={heroineCustomization}
                soundEnabled={soundEnabled}
                unfollowed={unfollowed}
                currentEpisode={currentEpisode}
                currentSceneIndex={currentSceneIndex}
                flags={flags}
                onToggleFollow={handleToggleFollow}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onSharePost={handleSharePost}
                onViewProfile={(authorId) => setViewingProfileUserId(authorId as any)}
                onSelectHashtag={(tag) => {
                  setActiveHashtag(tag);
                  setActiveTab('for_you');
                  showToast(`Filtered feed for ${tag} 🔎`);
                }}
              />
            )}

            {/* Feed Posts (For You, Tea Leaks, Cast) */}
            {activeTab !== 'profile' && activeTab !== 'trending' && (
              <>
                {visiblePosts.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 space-y-2">
                    <Coffee className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-xs">No posts found for this filter.</p>
                    <button
                      onClick={() => {
                        setActiveTab('for_you');
                        setActiveHashtag(null);
                        setSelectedCastMember('all');
                      }}
                      className="text-xs text-pink-400 underline font-semibold"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  visiblePosts.map((post) => (
                    <SocialPostCard
                      key={post.id}
                      post={post}
                      heroineCustomization={heroineCustomization}
                      soundEnabled={soundEnabled}
                      isFollowing={!unfollowed[post.authorId]}
                      onToggleFollow={handleToggleFollow}
                      onLikePost={handleLikePost}
                      onAddComment={handleAddComment}
                      onHashtagClick={(tag) => setActiveHashtag(tag)}
                      onSharePost={handleSharePost}
                      onViewProfile={(authorId) => setViewingProfileUserId(authorId as any)}
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* 7. Bottom Home Indicator Bar */}
        <div className="py-2 flex justify-center bg-neutral-950 border-t border-neutral-900">
          <div className="w-32 h-1 bg-neutral-700 rounded-full" />
        </div>
      </div>

      {/* 8. Full-screen Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <StoryViewerModal
          stories={visibleStories}
          initialStoryIndex={activeStoryIdx}
          heroineCustomization={heroineCustomization}
          soundEnabled={soundEnabled}
          pollVotes={{}}
          onClose={() => setActiveStoryIdx(null)}
          onStoryViewed={handleStoryViewed}
          onVote={(_story, _slide, _choice) => {
            showToast('Vote submitted! 🗳️');
          }}
          onReact={(_story, emoji) => {
            showToast(`Reacted with ${emoji}`);
          }}
        />
      )}

      {/* 9. Add Ada's Story Modal */}
      {showAddStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h4 className="font-serif font-bold text-sm text-neutral-100">
                  Post to Ada's Story
                </h4>
              </div>
              <button
                onClick={() => setShowAddStoryModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={adaStoryCaption}
              onChange={(e) => setAdaStoryCaption(e.target.value)}
              placeholder="What's happening in Lagos right now? (e.g. 'Banana Island traffic was worth it 💅✨')"
              rows={3}
              className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-pink-500"
            />

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() =>
                  setAdaStoryCaption('Ready for the night. No gree for anybody 💅👑')
                }
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-left"
              >
                "No gree for anybody 💅"
              </button>
              <button
                type="button"
                onClick={() =>
                  setAdaStoryCaption('Keeping my eyes open. Lagos high society is something else 👀🥂')
                }
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-left"
              >
                "Eyes open 👀🥂"
              </button>
            </div>

            <button
              onClick={handlePostAdaStory}
              disabled={!adaStoryCaption.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-xs shadow-lg transition-transform active:scale-98"
            >
              Share to 24h Story
            </button>
          </div>
        </div>
      )}

      {/* 10. Ada Post Composer Modal */}
      {showPostComposerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" />
                <h4 className="font-serif font-bold text-sm text-neutral-100">
                  Compose Ada's Feed Post
                </h4>
              </div>
              <button
                onClick={() => setShowPostComposerModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AdaPostComposer
                heroine={heroineCustomization}
                meters={meters}
                location="banana_island_mansion"
                episode={currentEpisode}
                alreadyPostedThisEpisode={false}
                isPosting={isPostingAda}
                soundEnabled={soundEnabled}
                unfollowed={unfollowed}
                onPost={handlePostAda}
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. Transient Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 px-4 py-2 rounded-full bg-neutral-900/95 border border-pink-500/50 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-3.5 h-3.5 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
