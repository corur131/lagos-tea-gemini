import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SocialComment, SocialPost } from '../../types/socialFeed';
import { HeroineCustomization } from '../../types/vn';
import { CommentChoice, allCommentChoices, buildAdaThread, getCommentChoices } from '../../data/commentChoices';
import { SocialAvatar } from './SocialAvatar';
import { playSound } from '../../utils/audio';

/* =========================================================================
   Comment choices on Gidigram posts.
   The feed provides story flags, Ada's saved picks and the pick handler
   through context, so every post card (feed, trending, profiles) gets the
   same behaviour without extra plumbing.
   ========================================================================= */

export interface CommentChoiceContextValue {
  flags: Record<string, boolean>;
  picks: Record<string, string>;
  onPick: (post: SocialPost, choice: CommentChoice) => void;
  soundEnabled: boolean;
}

export const CommentChoiceContext = createContext<CommentChoiceContextValue | null>(null);

/**
 * Ada's comment on this post plus its replies, revealed one at a time right
 * after she posts (all at once when the post is opened again later).
 */
export function useAdaThread(post: SocialPost, heroineName: string) {
  const ctx = useContext(CommentChoiceContext);
  const choices = useMemo(() => (ctx ? getCommentChoices(post, ctx.flags) : []), [ctx, post]);
  const pickedId = ctx?.picks[post.id];
  const picked = useMemo(() => (pickedId ? allCommentChoices(post).find((c) => c.id === pickedId) : undefined), [pickedId, post]);
  const thread = useMemo(() => (picked ? buildAdaThread(post.id, picked, heroineName) : []), [picked, post.id, heroineName]);

  // Reveal replies one by one only when the pick happens while this card is on screen
  const pickedOnMount = useRef(!!pickedId);
  const [shown, setShown] = useState(pickedId ? thread.length : 0);
  useEffect(() => {
    if (!picked) return;
    if (pickedOnMount.current) {
      setShown(thread.length);
      return;
    }
    setShown(1);
    let n = 1;
    const timer = setInterval(() => {
      n += 1;
      setShown(n);
      if (ctx?.soundEnabled && n <= thread.length) playSound.phoneChime();
      if (n >= thread.length) clearInterval(timer);
    }, 1100);
    return () => clearInterval(timer);
  }, [picked, thread.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible: SocialComment[] = thread.slice(0, shown);
  const typing = !!picked && shown < thread.length ? thread[shown] : undefined;
  return { ctx, choices, picked, visible, typing };
}

/** "Name is typing…" under Ada's comment while replies come in */
export const TypingRow: React.FC<{ comment: SocialComment }> = ({ comment }) => (
  <div className="pl-8 flex items-center gap-2 text-[11px] text-neutral-500 italic animate-pulse">
    <span className="font-semibold not-italic text-neutral-400">{comment.authorHandle}</span> is replying
    <span className="inline-flex gap-0.5">
      <span className="w-1 h-1 rounded-full bg-neutral-500" />
      <span className="w-1 h-1 rounded-full bg-neutral-500" />
      <span className="w-1 h-1 rounded-full bg-neutral-500" />
    </span>
  </div>
);

/** The five things Ada could say, shown until she picks one */
export const CommentChoicePanel: React.FC<{
  post: SocialPost;
  choices: CommentChoice[];
  heroineCustomization: HeroineCustomization;
  onPicked?: () => void;
}> = ({ post, choices, heroineCustomization, onPicked }) => {
  const ctx = useContext(CommentChoiceContext);
  const [open, setOpen] = useState(false);
  if (!ctx || choices.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (ctx.soundEnabled) playSound.click();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-pink-500/50 text-left transition-colors"
      >
        <SocialAvatar avatarType="heroine" heroineCustomization={heroineCustomization} size="xs" />
        <span className="flex-1 text-xs text-neutral-400">Comment as @ada_obi…</span>
        <MessageCircle className="w-3.5 h-3.5 text-pink-400" />
        {open ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
      </button>

      {open && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold px-1">
            Pick one. Everyone on Gidigram will see it.
          </p>
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => {
                ctx.onPick(post, choice);
                setOpen(false);
                onPicked?.();
                if (ctx.soundEnabled) playSound.phoneChime();
              }}
              className="w-full text-left px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-pink-500/60 transition-colors"
            >
              <span className="block text-[10px] font-bold uppercase tracking-wide text-pink-300">{choice.label}</span>
              <span className="block text-xs text-neutral-200 leading-snug mt-0.5">{choice.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
