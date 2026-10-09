import React, { useEffect } from 'react';

export interface RelationshipPingItem {
  name: string;
  kind: 'trust' | 'romance';
  delta: number;
}

interface RelationshipPingProps {
  pingId: number;
  items: RelationshipPingItem[];
  onDone: () => void;
  durationMs?: number;
}

/** Small chips under the top bar after a choice: who liked it, who didn't. */
export const RelationshipPing: React.FC<RelationshipPingProps> = ({ pingId, items, onDone, durationMs = 3800 }) => {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [pingId, durationMs, onDone]);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-32 sm:top-36 left-0 right-0 z-[44] flex justify-center px-3 pointer-events-none">
      <div key={pingId} className="flex flex-wrap justify-center gap-1.5 max-w-md animate-in slide-in-from-top fade-in duration-300">
        {items.map((it) => {
          const up = it.delta > 0;
          const icon = it.kind === 'romance' ? (up ? '❤️‍🔥' : '💔') : up ? '💚' : '🖤';
          return (
            <span
              key={`${it.name}_${it.kind}`}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md border ${
                up
                  ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/85 border-rose-500/40 text-rose-200'
              }`}
            >
              {icon} {it.name} {it.kind === 'romance' ? 'romance ' : ''}
              {up ? '+' : '−'}
              {Math.abs(it.delta)}
            </span>
          );
        })}
      </div>
    </div>
  );
};
