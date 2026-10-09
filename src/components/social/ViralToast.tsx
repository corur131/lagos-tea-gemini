import React, { useEffect, useState } from 'react';
import { ViralMoment } from '../../data/viralMoments';

interface ViralToastProps {
  moment: ViralMoment;
  onOpen: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

/** Big celebratory banner when a story moment blows Ada up online. Followers count up live. */
export const ViralToast: React.FC<ViralToastProps> = ({ moment, onOpen, onDismiss, durationMs = 6000 }) => {
  const [shown, setShown] = useState(0);

  // Count the follower gain up over ~1.4s
  useEffect(() => {
    setShown(0);
    const start = Date.now();
    const total = moment.followers;
    const tick = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / 1400);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(total * eased));
      if (t >= 1) clearInterval(tick);
    }, 30);
    return () => clearInterval(tick);
  }, [moment.id, moment.followers]);

  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [moment.id, durationMs, onDismiss]);

  return (
    <div className="fixed inset-x-0 top-[22%] z-[46] flex justify-center px-4 pointer-events-none">
      <button
        key={moment.id}
        onClick={onOpen}
        className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-400/50 bg-neutral-950/95 shadow-2xl shadow-rose-500/30 text-center px-5 py-4 animate-in zoom-in-95 fade-in duration-300"
        aria-label={`${moment.title}: plus ${moment.followers} followers. Tap to see your profile.`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/25 via-transparent to-amber-500/25 pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 font-bold">🔥 Going viral</div>
          <div className="mt-1 text-lg font-black text-neutral-50">
            {moment.emoji} {moment.title}
          </div>
          <div className="mt-2 text-4xl font-black tabular-nums bg-gradient-to-r from-amber-300 via-pink-400 to-rose-500 bg-clip-text text-transparent">
            +{shown.toLocaleString('en-NG')}
          </div>
          <div className="text-[11px] font-bold text-pink-200 -mt-0.5">new followers</div>
          <p className="mt-2 text-xs text-neutral-300 leading-snug">{moment.headline}</p>
          <p className="mt-2 text-[10px] text-neutral-500">Tap to see your profile</p>
        </div>
      </button>
    </div>
  );
};
