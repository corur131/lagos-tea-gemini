import React, { useEffect } from 'react';
import { DmThread } from '../../types/socialFeed';
import { HeroineCustomization } from '../../types/vn';
import { CAST_PROFILES } from '../../data/socialRules';
import { ThreadAvatar } from './DmInbox';

export interface DmToastItem {
  /** Unique id for this pop-up (the DM beat id, or a summary id) */
  id: string;
  thread: DmThread;
  sender: string;
  preview: string;
  /** Extra unread messages folded into this pop-up */
  moreCount?: number;
}

const SENDER_NAMES: Record<string, string> = {
  mum: 'Mummy 💛',
};

/** Who sent the first incoming message of a beat, and what it says (shortened). */
export function describeBeat(
  thread: DmThread,
  messages: Array<{ from: string; text: string }>,
  heroineName: string
): { sender: string; preview: string } | null {
  const incoming = messages.find((m) => m.from !== 'ada' && m.from !== 'heroine' && m.from !== 'system');
  const first = incoming || messages[0];
  if (!first) return null;

  const castName = (CAST_PROFILES as Record<string, { name: string }>)[first.from]?.name;
  const personName = SENDER_NAMES[first.from] || castName || thread.title;
  const sender = thread.isGroup && incoming ? `${personName} · ${thread.title}` : thread.title || personName;

  const text = first.text.replace(/\{name\}/g, heroineName).replace(/\s+/g, ' ').trim();
  const preview = text.length > 80 ? `${text.slice(0, 77).trimEnd()}…` : text;
  return { sender, preview };
}

interface DmToastProps {
  toast: DmToastItem;
  heroine: HeroineCustomization;
  onOpen: (threadId: string) => void;
  onDismiss: () => void;
  durationMs?: number;
}

/** Phone-style banner that slides in when a new DM arrives. Tap to open the chat. */
export const DmToast: React.FC<DmToastProps> = ({ toast, heroine, onOpen, onDismiss, durationMs = 4500 }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [toast.id, durationMs, onDismiss]);

  return (
    <div className="fixed top-14 sm:top-16 inset-x-0 z-[45] flex justify-center px-3 pointer-events-none">
      <button
        key={toast.id}
        onClick={() => onOpen(toast.thread.id)}
        className="pointer-events-auto w-full max-w-md flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-neutral-900/95 border border-pink-500/40 shadow-2xl shadow-pink-500/10 backdrop-blur-md text-left animate-in slide-in-from-top fade-in duration-300"
        aria-label={`New message from ${toast.sender}. Tap to open.`}
      >
        <ThreadAvatar thread={toast.thread} heroine={heroine} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold text-neutral-50 truncate">{toast.sender}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 shrink-0">GidiGram · now</span>
          </div>
          <p className="text-xs text-neutral-300 truncate">{toast.preview}</p>
          {toast.moreCount ? (
            <p className="text-[10px] text-pink-300/90 mt-0.5">
              +{toast.moreCount} more new message{toast.moreCount > 1 ? 's' : ''}
            </p>
          ) : null}
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              onDismiss();
            }
          }}
          className="text-neutral-500 hover:text-neutral-200 text-lg leading-none px-1 shrink-0"
          aria-label="Dismiss"
        >
          ×
        </span>
      </button>
    </div>
  );
};
