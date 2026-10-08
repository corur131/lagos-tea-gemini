import React, { useState } from 'react';
import { SocialPost, SocialComment } from '../../types/socialFeed';
import { HeroineCustomization } from '../../types/vn';
import { QuickReply } from '../../data/socialRules';
import { SocialAvatar } from './SocialAvatar';
import { NpcSvg } from '../svg/NpcSvg';
import { HeroineSvg } from '../svg/HeroineSvg';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  MapPin,
  CheckCircle2,
  Send,
  AlertTriangle,
  Camera,
  Trash2,
  Timer,
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface DeleteState {
  status: 'live' | 'captured' | 'missed';
  secondsLeft?: number;
}

export interface SocialPostCardProps {
  post: SocialPost;
  heroineCustomization: HeroineCustomization;
  soundEnabled: boolean;
  likedCommentIds?: Record<string, boolean>;
  quickReplies?: QuickReply[];
  warPick?: string;
  deleteState?: DeleteState;
  isScreenshotted?: boolean;
  isAdaVerified?: boolean;
  onLikePost: (post: SocialPost) => void;
  onSavePost?: (post: SocialPost) => void;
  onAddComment?: (post: SocialPost, text: string) => void;
  onQuickReply?: (post: SocialPost, reply: QuickReply) => void;
  onLikeComment?: (commentId: string) => void;
  onSharePost?: (post: SocialPost) => void;
  onScreenshot?: (post: SocialPost) => void;
  onWarPick?: (post: SocialPost, optionId: string) => void;
  onHashtagClick?: (tag: string) => void;
  onViewProfile?: (authorId: string) => void;
}

const PROFILE_AUTHORS = ['heroine', 'zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin', 'dayo', 'lagos_tea'];

export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  heroineCustomization,
  soundEnabled,
  likedCommentIds = {},
  quickReplies = [],
  warPick,
  deleteState,
  isScreenshotted = false,
  isAdaVerified = false,
  onLikePost,
  onSavePost,
  onAddComment,
  onQuickReply,
  onLikeComment,
  onSharePost,
  onScreenshot,
  onWarPick,
  onHashtagClick,
  onViewProfile,
}) => {
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const openProfile = (authorId: string) => {
    if (!onViewProfile || !PROFILE_AUTHORS.includes(authorId)) return;
    onViewProfile(authorId);
    if (soundEnabled) playSound.click();
  };

  // Deleted posts leave a stub behind, like the real thing
  if (deleteState && deleteState.status !== 'live') {
    return (
      <article className="rounded-3xl bg-neutral-900/60 border border-dashed border-neutral-700 p-4 flex items-center gap-3 text-neutral-400">
        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-neutral-300">{post.authorHandle} deleted this post.</p>
          <p>
            {deleteState.status === 'captured'
              ? 'But you got the screenshot first. It’s on your Clue Board 📸'
              : 'You didn’t screenshot it in time. 😬'}
          </p>
        </div>
      </article>
    );
  }

  const handleDoubleTap = () => {
    if (!post.isLikedByPlayer) onLikePost(post);
    setShowHeartBurst(true);
    if (soundEnabled) playSound.likePop();
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleScreenshot = () => {
    setShowFlash(true);
    if (soundEnabled) playSound.cameraShutter();
    setTimeout(() => setShowFlash(false), 250);
    onScreenshot?.(post);
  };

  const handleSubmitComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment?.(post, newCommentText.trim());
    setNewCommentText('');
    setShowAllComments(true);
    if (soundEnabled) playSound.phoneChime();
  };

  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);
  const war = post.commentWar;
  const pickedWarOption = war?.options.find((o) => o.id === warPick);

  const renderComment = (comment: SocialComment, highlight?: 'troll' | 'ada') => {
    const isLiked = !!likedCommentIds[comment.id] || comment.isLiked;
    const likes = comment.likes + (likedCommentIds[comment.id] ? 1 : 0);
    const isAda = comment.authorId === 'heroine';
    return (
      <div
        key={comment.id}
        className={`flex items-start justify-between text-xs text-neutral-300 gap-2 ${
          highlight === 'troll' ? 'p-2 rounded-xl bg-rose-950/40 border border-rose-500/30' : ''
        }`}
      >
        <div className="flex items-start gap-2 min-w-0">
          <div onClick={() => openProfile(comment.authorId)} className="cursor-pointer shrink-0">
            <SocialAvatar
              avatarType={comment.avatarType}
              heroineCustomization={heroineCustomization}
              size="xs"
              isLagosTea={comment.avatarType === 'lagos_tea'}
            />
          </div>
          <div className="min-w-0">
            <span
              onClick={() => openProfile(comment.authorId)}
              className="font-bold text-neutral-100 hover:text-pink-300 transition-colors cursor-pointer mr-1.5 font-mono"
            >
              {comment.authorHandle}
              {(comment.isVerified || (isAda && isAdaVerified)) && (
                <CheckCircle2 className="inline w-3 h-3 ml-0.5 text-pink-400" />
              )}
            </span>
            <span className="break-words">{comment.text}</span>
            <div className="text-[10px] text-neutral-500 mt-0.5">{comment.timestamp}</div>
          </div>
        </div>
        <button
          onClick={() => {
            onLikeComment?.(comment.id);
            if (soundEnabled) playSound.likePop();
          }}
          className={`flex items-center gap-1 shrink-0 mt-0.5 text-[11px] ${
            isLiked ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500' : ''}`} />
          <span>{likes}</span>
        </button>
      </div>
    );
  };

  return (
    <article className="relative rounded-3xl bg-neutral-900/90 border border-neutral-800/80 overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-neutral-700/80">
      {/* Deleting-soon banner */}
      {deleteState?.status === 'live' && (
        <div className="px-4 py-1.5 bg-rose-600/90 text-white text-[11px] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" /> This post looks like it’s about to be deleted…
          </span>
          <span className="font-mono">{deleteState.secondsLeft}s</span>
        </div>
      )}

      {/* 1. Header: Author Info & Options */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => openProfile(post.authorId)}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={`View ${post.authorName}'s profile`}
          >
            <SocialAvatar
              avatarType={post.avatarType}
              heroineCustomization={heroineCustomization}
              size="md"
              hasStoryRing={true}
              hasUnseenStory={false}
              isLagosTea={post.isTeaLeak}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div
              onClick={() => openProfile(post.authorId)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <span className="font-bold text-sm text-neutral-100 group-hover:text-pink-300 transition-colors leading-none truncate">
                {post.authorName}
              </span>
              {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 min-w-0">
              <span className="font-mono shrink-0">{post.authorHandle}</span>
              <span>•</span>
              <span className="shrink-0">{post.timestamp}</span>
              {post.locationTag && (
                <span className="hidden sm:flex items-center gap-0.5 text-neutral-300 truncate">
                  <MapPin className="w-2.5 h-2.5 text-pink-400" />
                  {post.locationTag}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Media Stage */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden select-none cursor-pointer flex items-center justify-center bg-neutral-950"
      >
        <div className={`absolute inset-0 bg-gradient-to-tr ${post.graphic.bgGradient} opacity-90`} />

        {post.isTeaLeak ? (
          <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between text-neutral-100">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                CONFIDENTIAL LEAK
              </span>
              <span className="font-mono text-xs text-rose-300 font-bold">#LAGOS_TEA_DOSSIER</span>
            </div>

            <div className="my-auto p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-rose-500/40 backdrop-blur-md shadow-2xl space-y-2">
              {post.graphic.leakSource && (
                <div className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                  {post.graphic.leakSource}
                </div>
              )}
              <h4 className="text-base sm:text-lg font-serif font-black text-rose-100 leading-tight">
                {post.graphic.headline}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {post.graphic.subheadline}
              </p>
              {(post.graphic.leakFooterLeft || post.graphic.leakFooterRight) && (
                <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between gap-2 text-[11px] font-mono text-rose-300">
                  <span>{post.graphic.leakFooterLeft}</span>
                  <span className="text-right">{post.graphic.leakFooterRight}</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                {post.graphic.tagLocation}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              {post.graphic.badgeLabel && (
                <span className="px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold tracking-wider shadow-md">
                  {post.graphic.badgeLabel}
                </span>
              )}
              {post.soundSnippet && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white/90 border border-white/10 min-w-0">
                  <Music2 className="w-3 h-3 text-pink-400 animate-spin shrink-0" />
                  <span className="truncate max-w-[130px]">
                    {post.soundSnippet.artist} • {post.soundSnippet.title}
                  </span>
                </div>
              )}
            </div>

            <div className="relative w-48 sm:w-56 h-48 sm:h-56 mx-auto flex items-end justify-center pointer-events-none drop-shadow-2xl">
              {post.graphic.characterId === 'heroine' && (
                <HeroineSvg
                  customization={heroineCustomization}
                  expression="happy"
                  isTalking={false}
                  lookDirection="center"
                  reduceMotion={true}
                  className="w-full h-full object-contain"
                />
              )}
              {post.graphic.characterId && post.graphic.characterId !== 'heroine' && (
                <NpcSvg
                  characterId={post.graphic.characterId}
                  expression="happy"
                  isTalking={false}
                  lookDirection="center"
                  reduceMotion={true}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-left">
              <h5 className="font-serif font-black text-sm sm:text-base leading-snug">{post.graphic.headline}</h5>
              <p className="text-xs text-white/70">{post.graphic.subheadline}</p>
            </div>
          </div>
        )}

        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-300">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}
        {showFlash && <div className="absolute inset-0 z-40 bg-white/80 pointer-events-none" />}
      </div>

      {/* 3. Action Bar */}
      <div className="p-3.5 sm:p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onLikePost(post);
                if (soundEnabled) playSound.likePop();
              }}
              className={`flex items-center gap-1.5 transition-transform active:scale-125 ${
                post.isLikedByPlayer ? 'text-rose-500' : 'text-neutral-300 hover:text-white'
              }`}
              title="Like"
            >
              <Heart className={`w-5 h-5 ${post.isLikedByPlayer ? 'fill-rose-500' : ''}`} />
              <span className="text-xs font-bold font-mono">{post.likesCount.toLocaleString()}</span>
            </button>

            <button
              onClick={() => setShowAllComments((prev) => !prev)}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
              title="Comments"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-bold font-mono">{post.commentsCount.toLocaleString()}</span>
            </button>

            <button
              onClick={() => {
                onSharePost?.(post);
                if (soundEnabled) playSound.click();
              }}
              className="text-neutral-300 hover:text-white transition-transform active:scale-110"
              title="Send to a friend"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleScreenshot}
              className={`flex items-center gap-1 transition-transform active:scale-110 ${
                isScreenshotted ? 'text-amber-400' : 'text-neutral-300 hover:text-white'
              }`}
              title={isScreenshotted ? 'Screenshotted' : 'Screenshot'}
            >
              <Camera className="w-5 h-5" />
              {isScreenshotted && <span className="text-[10px] font-bold">Saved</span>}
            </button>
          </div>

          <button
            onClick={() => {
              onSavePost?.(post);
              if (soundEnabled) playSound.click();
            }}
            className={`transition-colors ${
              post.isSavedByPlayer ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Save"
          >
            <Bookmark className={`w-5 h-5 ${post.isSavedByPlayer ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* 4. Caption & Hashtags */}
        <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed mb-3">
          <span className="font-bold text-neutral-100 mr-2">{post.authorHandle}</span>
          <span>{post.caption}</span>
          {post.hashtags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onHashtagClick && onHashtagClick(tag)}
                  className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Troll alert: comment war */}
        {war && (
          <div className="mb-3 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
              🧌 Troll in the comments
            </span>
            {renderComment({ ...war.troll, id: `${war.id}_troll`, likes: 214, timestamp: '2m ago' }, 'troll')}

            {!pickedWarOption ? (
              <div className="grid grid-cols-3 gap-1.5">
                {war.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onWarPick?.(post, option.id);
                      if (soundEnabled) playSound.phoneChime();
                    }}
                    className="px-2 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-pink-500/60 text-[11px] font-semibold text-neutral-200 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="pl-4 border-l border-neutral-800 space-y-2">
                {pickedWarOption.replyText ? (
                  renderComment({
                    id: `${war.id}_ada`,
                    authorId: 'heroine',
                    authorName: `${heroineCustomization.name} Obi`,
                    authorHandle: '@ada_obi',
                    avatarType: 'heroine',
                    text: pickedWarOption.replyText,
                    likes: 1200 + (pickedWarOption.followerDelta || 0),
                    timestamp: 'Just now',
                  })
                ) : (
                  <p className="text-[11px] text-neutral-500 italic">You scrolled past without replying.</p>
                )}
                {pickedWarOption.aftermath.map((c, i) =>
                  renderComment({ ...c, id: `${war.id}_after_${i}`, likes: 80 + i * 57, timestamp: 'Just now' })
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. Comments */}
        {post.comments.length > 0 && (
          <div className="pt-2 border-t border-neutral-800/80 space-y-2">
            {displayedComments.map((comment) => renderComment(comment))}
            {post.comments.length > 2 && (
              <button
                onClick={() => setShowAllComments((prev) => !prev)}
                className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 pt-1"
              >
                {showAllComments ? 'Hide extra comments' : `View all ${post.comments.length} comments`}
              </button>
            )}
          </div>
        )}

        {/* 7. Quick replies & comment box */}
        <div className="mt-3 pt-3 border-t border-neutral-800/60">
          {quickReplies.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
              {quickReplies.map((reply) => (
                <button
                  key={reply.tone}
                  onClick={() => {
                    onQuickReply?.(post, reply);
                    setShowAllComments(true);
                    if (soundEnabled) playSound.phoneChime();
                  }}
                  title={reply.text}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/60 text-[11px] text-neutral-300 hover:text-pink-300 transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
            <SocialAvatar avatarType="heroine" heroineCustomization={heroineCustomization} size="xs" />
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Comment as @ada_obi..."
              className="flex-1 min-w-0 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-pink-500/60"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="p-1.5 rounded-full bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:hover:bg-pink-600 text-white transition-all shrink-0"
              title="Post comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
};
