import React, { useState } from 'react';
import { InventoryItem, Meters, HeroineCustomization } from '../../types/vn';
import { RelationshipProfile } from './RelationshipProfile';
import {
  Camera,
  MessageSquare,
  Music,
  ShieldAlert,
  FileText,
  Key,
  X,
  Heart,
  FileSpreadsheet,
} from 'lucide-react';

interface ClueBoardProps {
  inventory: InventoryItem[];
  meters: Meters;
  flags: Record<string, boolean>;
  heroine: HeroineCustomization;
  soundEnabled?: boolean;
  onClose: () => void;
  initialTab?: 'clues' | 'relationships';
}

export const ClueBoard: React.FC<ClueBoardProps> = ({
  inventory,
  meters,
  flags,
  heroine,
  soundEnabled = true,
  onClose,
  initialTab = 'clues',
}) => {
  const [activeTab, setActiveTab] = useState<'clues' | 'relationships'>(initialTab);

  const getIcon = (tag: InventoryItem['tag']) => {
    switch (tag) {
      case 'Photo':
        return <Camera className="w-4 h-4 text-pink-400" />;
      case 'Chat':
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'Audio':
        return <Music className="w-4 h-4 text-emerald-400" />;
      case 'Document':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'Key':
        return <Key className="w-4 h-4 text-yellow-400" />;
      case 'Personal':
      default:
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col h-[90vh] sm:h-[85vh] overflow-hidden">
        {/* Main Header with Navigation Tabs */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-100">
                Investigation Dossier
              </h3>
            </div>

            {/* Tab Switcher Pills */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('clues')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'clues'
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm border border-neutral-700/80'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-pink-400" />
                <span>Clues & Receipts</span>
                {inventory.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-mono">
                    {inventory.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('relationships')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'relationships'
                    ? 'bg-neutral-800 text-rose-300 shadow-sm border border-rose-500/40'
                    : 'text-neutral-400 hover:text-rose-300'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/40" />
                <span>Relationship Profiles</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            title="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'relationships' ? (
          <div className="flex-1 overflow-hidden">
            <RelationshipProfile
              meters={meters}
              flags={flags}
              heroine={heroine}
              onBackToClues={() => setActiveTab('clues')}
              onClose={onClose}
              soundEnabled={soundEnabled}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-950">
            {/* Clues Tab Header & Shortcut Banner */}
            <div className="px-5 py-3 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                  @TheLagosTea Evidence Locker
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Screenshots, burner chats, CCTV angles, and recovered files
                </p>
              </div>

              <button
                onClick={() => setActiveTab('relationships')}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
                <span>View Character Standings</span>
              </button>
            </div>

            {/* Inventory List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {inventory.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-500">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-semibold text-neutral-300">
                    No Receipts Discovered Yet
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Keep your eyes sharp across Banana Island parties, group chats, and DMs. Evidence will be cataloged here as you uncover secrets.
                  </p>
                  <button
                    onClick={() => setActiveTab('relationships')}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Check Romance & Trust Levels Instead
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3 hover:border-neutral-700 hover:bg-neutral-900/90 transition-all shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0">
                        {getIcon(item.tag)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-semibold text-neutral-200 truncate">
                            {item.name}
                          </h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60 shrink-0">
                            Ep. {item.episodeAcquired}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
              <span>Investigation Progress: Season 1</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
