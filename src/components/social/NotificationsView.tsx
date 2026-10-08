import React, { useEffect, useState } from 'react';
import { NotificationTarget, SocialNotification } from '../../types/socialFeed';
import { HeroineCustomization } from '../../types/vn';
import { SocialAvatar } from './SocialAvatar';
import { Bell } from 'lucide-react';

interface NotificationsViewProps {
  notifications: SocialNotification[];
  seen: Record<string, boolean>;
  heroine: HeroineCustomization;
  onMarkAllSeen: (ids: string[]) => void;
  onOpenTarget: (target: NotificationTarget) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  seen,
  heroine,
  onMarkAllSeen,
  onOpenTarget,
}) => {
  // Remember what was new when the tab opened, so "New" doesn't empty out instantly
  const [newIds] = useState(() => new Set(notifications.filter((n) => !seen[n.id]).map((n) => n.id)));

  useEffect(() => {
    const unseen = notifications.filter((n) => !seen[n.id]).map((n) => n.id);
    if (unseen.length) onMarkAllSeen(unseen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications.length]);

  const fresh = notifications.filter((n) => newIds.has(n.id));
  const earlier = notifications.filter((n) => !newIds.has(n.id));

  const renderItem = (n: SocialNotification) => (
    <button
      key={n.id}
      onClick={() => n.target && onOpenTarget(n.target)}
      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-900/80 transition-colors text-left"
    >
      {n.avatarEmoji ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/30 to-pink-500/30 border border-neutral-700 flex items-center justify-center text-lg shrink-0">
          {n.avatarEmoji}
        </div>
      ) : (
        <SocialAvatar
          avatarType={n.avatarType}
          heroineCustomization={heroine}
          size="md"
          isLagosTea={n.avatarType === 'lagos_tea'}
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-200 leading-snug line-clamp-2">{n.text}</p>
        <span className="text-[10px] text-neutral-500">Episode {n.episode}</span>
      </div>
      {newIds.has(n.id) && <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />}
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-3 border-b border-neutral-800/80">
        <h3 className="font-bold text-sm text-neutral-100">Notifications</h3>
      </div>
      {notifications.length === 0 && (
        <div className="p-10 text-center text-neutral-500 space-y-2">
          <Bell className="w-8 h-8 mx-auto text-neutral-700" />
          <p className="text-xs">Nothing yet. Lagos is quiet… for now.</p>
        </div>
      )}
      {fresh.length > 0 && (
        <>
          <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-neutral-300">New</div>
          {fresh.map(renderItem)}
        </>
      )}
      {earlier.length > 0 && (
        <>
          <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-neutral-300">Earlier</div>
          {earlier.map(renderItem)}
        </>
      )}
    </div>
  );
};
