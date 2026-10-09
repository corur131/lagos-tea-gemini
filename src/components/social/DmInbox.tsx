import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DmBeat, DmReplyOption, DmThread, SocialState } from '../../types/socialFeed';
import { CharacterId, HeroineCustomization } from '../../types/vn';
import { CAST_PROFILES, isUnlocked } from '../../data/socialRules';
import { SocialAvatar } from './SocialAvatar';
import { ArrowLeft, Send } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface Progress {
  episode: number;
  sceneIndex: number;
  flags: Record<string, boolean>;
  social: SocialState;
}

// Unlocked beats, stopping at the first one still waiting for the player's reply
export function getVisibleBeats(thread: DmThread, p: Progress): DmBeat[] {
  const out: DmBeat[] = [];
  for (const beat of thread.beats) {
    if (!isUnlocked(beat, p.episode, p.sceneIndex, p.flags)) continue;
    out.push(beat);
    if (beat.replies && !p.social.dmReplies[beat.id]) break;
  }
  return out;
}

/**
 * The chat's current name/icon. Renames apply as soon as the story reaches them, even if an
 * earlier message in the chat is still waiting for the player's reply.
 */
export function resolveThreadIdentity(thread: DmThread, p: Progress): DmThread {
  let { title, avatarEmoji, handle } = thread;
  for (const beat of thread.beats) {
    if (!isUnlocked(beat, p.episode, p.sceneIndex, p.flags)) continue;
    if (beat.renameTo) title = beat.renameTo;
    if (beat.newAvatarEmoji) avatarEmoji = beat.newAvatarEmoji;
    if (beat.newHandle) handle = beat.newHandle;
  }
  if (title === thread.title && avatarEmoji === thread.avatarEmoji && handle === thread.handle) return thread;
  return { ...thread, title, avatarEmoji, handle };
}

export function countUnreadDms(threads: DmThread[], p: Progress): number {
  return threads.reduce(
    (sum, t) => sum + getVisibleBeats(t, p).filter((b) => !p.social.seenDmBeats[b.id]).length,
    0
  );
}

interface FlatMessage {
  key: string;
  beatId: string;
  from: string;
  text: string;
  kind: 'msg' | 'seen' | 'system';
}

function flatten(beats: DmBeat[], dmReplies: Record<string, string>, name: string): FlatMessage[] {
  const fill = (t: string) => t.replace(/\{name\}/g, name);
  const out: FlatMessage[] = [];
  beats.forEach((beat) => {
    beat.messages.forEach((m, i) =>
      out.push({
        key: `${beat.id}_m${i}`,
        beatId: beat.id,
        from: m.from,
        text: fill(m.text),
        kind: m.from === 'system' ? 'system' : 'msg',
      })
    );
    const pick = beat.replies?.find((r) => r.id === dmReplies[beat.id]);
    if (!pick) return;
    out.push(
      pick.text
        ? { key: `${beat.id}_ada`, beatId: beat.id, from: 'ada', text: fill(pick.text), kind: 'msg' }
        : { key: `${beat.id}_seen`, beatId: beat.id, from: 'ada', text: 'Seen', kind: 'seen' }
    );
    pick.responses.forEach((m, i) =>
      out.push({ key: `${beat.id}_r${i}`, beatId: beat.id, from: m.from, text: fill(m.text), kind: 'msg' })
    );
  });
  return out;
}

export const ThreadAvatar: React.FC<{ thread: DmThread; heroine: HeroineCustomization; size?: 'sm' | 'md' | 'lg' }> = ({
  thread,
  heroine,
  size = 'md',
}) => {
  if (thread.avatarEmoji) {
    const dims = size === 'lg' ? 'w-14 h-14 text-2xl' : size === 'md' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-base';
    return (
      <div className={`${dims} rounded-full bg-gradient-to-tr from-amber-500/30 to-pink-500/30 border border-neutral-700 flex items-center justify-center shrink-0`}>
        {thread.avatarEmoji}
      </div>
    );
  }
  return (
    <SocialAvatar
      avatarType={thread.avatarType || 'fan'}
      heroineCustomization={heroine}
      size={size}
      isLagosTea={thread.avatarType === 'lagos_tea'}
    />
  );
};

interface DmInboxProps extends Progress {
  threads: DmThread[];
  heroine: HeroineCustomization;
  soundEnabled: boolean;
  openThreadId: string | null;
  onOpenThread: (threadId: string | null) => void;
  onReply: (thread: DmThread, beat: DmBeat, option: DmReplyOption) => void;
  onMarkSeen: (beatIds: string[]) => void;
  onViewProfile: (profileId: CharacterId | 'lagos_tea') => void;
}

export const DmInbox: React.FC<DmInboxProps> = (props) => {
  const { threads, heroine, openThreadId, onOpenThread, soundEnabled } = props;

  const inbox = useMemo(() => {
    return threads
      .map((rawThread) => {
        const thread = resolveThreadIdentity(rawThread, props);
        const beats = getVisibleBeats(thread, props);
        const flat = flatten(beats, props.social.dmReplies, heroine.name);
        const last = beats[beats.length - 1];
        return {
          thread,
          beats,
          lastMessage: flat[flat.length - 1],
          unread: beats.filter((b) => !props.social.seenDmBeats[b.id]).length,
          awaitingReply: !!last?.replies && !props.social.dmReplies[last.id],
          sortKey: last ? last.unlockEpisode * 100 + (last.unlockSceneIndex ?? 0) : -1,
        };
      })
      .filter((t) => t.beats.length > 0)
      .sort((a, b) => b.sortKey - a.sortKey || b.unread - a.unread);
  }, [threads, props.episode, props.sceneIndex, props.flags, props.social, heroine.name]);

  const openThread = threads.find((t) => t.id === openThreadId);
  if (openThread) {
    return <ThreadView key={openThread.id} thread={openThread} {...props} />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3 border-b border-neutral-800/80">
        <h3 className="font-bold text-sm text-neutral-100">Messages</h3>
        <p className="text-[11px] text-neutral-500">Your replies change how people see you.</p>
      </div>
      {inbox.length === 0 && (
        <p className="p-8 text-center text-xs text-neutral-500">No messages yet. Keep playing. 📱</p>
      )}
      {inbox.map(({ thread, lastMessage, unread, awaitingReply }) => (
        <button
          key={thread.id}
          onClick={() => {
            onOpenThread(thread.id);
            if (soundEnabled) playSound.click();
          }}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-900/80 transition-colors text-left border-b border-neutral-900"
        >
          <ThreadAvatar thread={thread} heroine={heroine} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm truncate ${unread ? 'font-bold text-neutral-50' : 'font-medium text-neutral-200'}`}>
                {thread.title}
              </span>
              {awaitingReply && (
                <span className="text-[10px] font-bold text-pink-400 shrink-0">Reply needed</span>
              )}
            </div>
            <p className={`text-xs truncate ${unread ? 'text-neutral-200' : 'text-neutral-500'}`}>
              {lastMessage?.from === 'ada' ? 'You: ' : ''}
              {lastMessage?.text}
            </p>
          </div>
          {unread > 0 && <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />}
        </button>
      ))}
    </div>
  );
};

const ThreadView: React.FC<DmInboxProps & { thread: DmThread }> = ({
  thread,
  heroine,
  soundEnabled,
  onOpenThread,
  onReply,
  onMarkSeen,
  onViewProfile,
  ...progress
}) => {
  const beats = getVisibleBeats(thread, progress);
  const flat = flatten(beats, progress.social.dmReplies, heroine.name);
  const shown = resolveThreadIdentity(thread, progress);

  // Messages the player already read appear instantly; new ones arrive one by one
  const [revealed, setRevealed] = useState(() => {
    const unseen = beats.findIndex((b) => !progress.social.seenDmBeats[b.id]);
    if (unseen === -1) return flat.length;
    return flat.findIndex((m) => m.beatId === beats[unseen].id);
  });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const beatIdsKey = beats.map((b) => b.id).join('|');
  useEffect(() => {
    const unseen = beats.filter((b) => !progress.social.seenDmBeats[b.id]).map((b) => b.id);
    if (unseen.length) onMarkSeen(unseen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatIdsKey]);

  useEffect(() => {
    if (revealed >= flat.length) {
      setIsTyping(false);
      return;
    }
    const next = flat[revealed];
    const fromAda = next.from === 'ada';
    setIsTyping(!fromAda && next.kind !== 'system');
    const timer = setTimeout(
      () => {
        setRevealed((r) => r + 1);
        if (!fromAda && soundEnabled) playSound.phoneChime();
      },
      fromAda ? 150 : 650 + Math.min(900, next.text.length * 12)
    );
    return () => clearTimeout(timer);
  }, [revealed, flat.length, soundEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [revealed, isTyping]);

  const lastBeat = beats[beats.length - 1];
  const pending = lastBeat?.replies && !progress.social.dmReplies[lastBeat.id] ? lastBeat : null;
  const showReplies = pending && revealed >= flat.length;
  const fill = (t: string) => t.replace(/\{name\}/g, heroine.name);

  const typingFrom = flat[revealed]?.from;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-3 py-2.5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950/95">
        <button
          onClick={() => onOpenThread(null)}
          className="p-1 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900"
          title="Back to messages"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => thread.profileId && onViewProfile(thread.profileId)}
          className="flex items-center gap-2.5 min-w-0 text-left"
        >
          <ThreadAvatar thread={shown} heroine={heroine} size="sm" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-neutral-100 truncate">{shown.title}</div>
            <div className="text-[10px] text-neutral-500 truncate">{shown.handle}</div>
          </div>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {flat.slice(0, revealed).map((m, i) => {
          if (m.kind === 'system') {
            return (
              <p key={m.key} className="text-center text-[10px] text-neutral-500 py-1">
                {m.text}
              </p>
            );
          }
          if (m.kind === 'seen') {
            return (
              <p key={m.key} className="text-right text-[10px] text-neutral-500 pr-1">
                Seen
              </p>
            );
          }
          if (m.from === 'ada') {
            return (
              <div key={m.key} className="flex justify-end">
                <div className="max-w-[78%] px-3 py-2 rounded-2xl rounded-br-md bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm">
                  {m.text}
                </div>
              </div>
            );
          }
          const prev = flat[i - 1];
          const showSender = thread.isGroup && (!prev || prev.from !== m.from);
          const senderProfile = CAST_PROFILES[m.from as CharacterId];
          return (
            <div key={m.key} className="flex items-end gap-2">
              {thread.isGroup && senderProfile ? (
                <div className={showSender ? '' : 'invisible'}>
                  <SocialAvatar avatarType={senderProfile.avatarType} heroineCustomization={heroine} size="xs" />
                </div>
              ) : null}
              <div className="max-w-[78%]">
                {showSender && senderProfile && (
                  <div className="text-[10px] text-neutral-400 mb-0.5 ml-1">{senderProfile.name.split(' ')[0]}</div>
                )}
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-neutral-800 text-neutral-100 text-sm">
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2">
            {thread.isGroup && CAST_PROFILES[typingFrom as CharacterId] && (
              <SocialAvatar
                avatarType={CAST_PROFILES[typingFrom as CharacterId].avatarType}
                heroineCustomization={heroine}
                size="xs"
              />
            )}
            <div className="px-3 py-2.5 rounded-2xl rounded-bl-md bg-neutral-800 flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-neutral-800 bg-neutral-950">
        {showReplies && pending ? (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold">Your reply</span>
            {pending.replies!.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onReply(thread, pending, option);
                  if (soundEnabled) playSound.click();
                }}
                className="w-full text-left px-3 py-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-pink-500/60 text-sm text-neutral-100 transition-colors flex items-center justify-between gap-2"
              >
                <span>{option.label || fill(option.text || '')}</span>
                <Send className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-500">
            {pending ? 'Reading…' : 'Nothing new. Keep playing to unlock more messages.'}
          </div>
        )}
      </div>
    </div>
  );
};
