import React from 'react';
import { BookOpen, X } from 'lucide-react';

interface HistoryLogProps {
  logs: Array<{ speaker: string; text: string }>;
  onClose: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-5 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-serif font-bold text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Dialogue History
            </h3>
            <p className="text-xs text-neutral-400">
              Review past conversations and squad statements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 divide-y divide-neutral-800/50">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No conversations recorded yet.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="pt-3 first:pt-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {log.speaker}
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                  {log.text}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
