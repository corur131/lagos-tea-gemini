import React, { useState, useMemo, useCallback } from 'react';
import {
  SocialPost,
  SocialStory,
  FeedFilterTab,
  SocialAuthorId,
} from '../../types/socialFeed';
import { HeroineCustomization, Meters, InventoryItem, CharacterId } from '../../types/vn';
import { INITIAL_POSTS, INITIAL_STORIES } from '../../data/socialFeedData';
import { SocialPostCard } from './SocialPostCard';
import { SocialAvatar } from './SocialAvatar';
import { StoryViewerModal } from './StoryViewerModal';
import { InstagramProfileView } from './InstagramProfileView';
import { AdaProfileView } from './AdaProfileView';
import {
  X,
  Sparkles,
  Flame,
  Coffee,
  Users,
  User,
  RefreshCw,
  Search,
  Wifi,
  Battery,
  Plus,
  SlidersHorizontal,
  Check,
  ExternalLink,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface SocialFeedOverlayProps {
  currentEpisode: number;
  currentSceneIndex: number;
  heroineCustomization: HeroineCustomization;
  meters: Meters;
  inventory: InventoryItem[];
  soundEnabled: boolean;
  initialProfileUserId?: CharacterId | 'lagos_tea' | 'heroine' | null;
  onClose: () => void;
  onOpenWardrobe: () => void;
  onOpenClues: () => void;
  onOpenBioModal?: (charId: CharacterId) => void;
}

export const SocialFeedOverlay: React.FC<SocialFeedOverlayProps> = ({
  currentEpisode,
  currentSceneIndex,
  heroineCustomization,
  meters,
  inventory,
  soundEnabled,
  initialProfileUserId = null,
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
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<SocialStory[]>(INITIAL_STORIES);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [adaStoryCaption, setAdaStoryCaption] = useState('');

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter posts based on story progression and user filters
  const visiblePosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Progression check: has this post unlocked in the story?
      const isEpisodePast = post.unlockEpisode < currentEpisode;
      const isCurrentEpisodeUnlocked =
        post.unlockEpisode === currentEpisode &&
        (!post.unlockSceneIndex || currentSceneIndex >= post.unlockSceneIndex);

      if (!isEpisodePast && !isCurrentEpisodeUnlocked) {
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
  }, [posts, currentEpisode, currentSceneIndex, activeTab, selectedCastMember, activeHashtag]);

  // Visible stories based on progression
  const visibleStories = useMemo(() => {
    return stories.filter((story) => {
      const isPast = story.unlockEpisode < currentEpisode;
      const isCurrent =
        story.unlockEpisode === currentEpisode &&
        (!story.unlockSceneIndex || currentSceneIndex >= story.unlockSceneIndex);
      return isPast || isCurrent;
    });
  }, [stories, currentEpisode, currentSceneIndex]);

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
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === post.id) {
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
        if (p.id === post.id) {
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
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  Lagos Social Pulse
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
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
                setActiveTab('tea_leaks');
                setActiveHashtag(null);
                if (soundEnabled) playSound.click();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'tea_leaks'
                  ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-300" />
              <span>@TheLagosTea</span>
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
              <span>Influencer Cast</span>
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

        {/* 4. Active Filter Badges (e.g. Hashtag / Cast Member) */}
        {(activeHashtag || (activeTab === 'cast' && selectedCastMember !== 'all')) && (
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
        {activeTab === 'cast' && (
          <div className="px-3 py-2 border-b border-neutral-800/50 bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Cast' },
              { id: 'zee', label: 'Zee' },
              { id: 'tamara', label: 'Tamara' },
              { id: 'bisola', label: 'Bisola' },
              { id: 'chi', label: 'Chi' },
              { id: 'hauwa', label: 'Hauwa' },
              { id: 'chidi', label: 'Chidi' },
              { id: 'kelvin', label: 'Kelvin' },
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

        {/* 6. Scrollable Content Stream */}
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

          {/* Profile View Tab */}
          {activeTab === 'profile' && (
            <AdaProfileView
              heroine={heroineCustomization}
              meters={meters}
              inventory={inventory}
              soundEnabled={soundEnabled}
              onOpenWardrobe={onOpenWardrobe}
              onOpenClues={onOpenClues}
              onSelectTagPhoto={(title: string) => {
                showToast(`Viewing tagged photo: "${title}"`);
              }}
            />
          )}

          {/* Feed Posts */}
          {activeTab !== 'profile' && (
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
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                    onHashtagClick={(tag) => setActiveHashtag(tag)}
                    onSharePost={handleSharePost}
                  />
                ))
              )}
            </>
          )}
        </div>

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
          onClose={() => setActiveStoryIdx(null)}
          onStoryViewed={handleStoryViewed}
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

      {/* 10. Transient Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 px-4 py-2 rounded-full bg-neutral-900/95 border border-pink-500/50 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-3.5 h-3.5 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
