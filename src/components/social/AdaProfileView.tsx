import React, { useState } from 'react';
import { HeroineCustomization, Meters, InventoryItem } from '../../types/vn';
import { SocialPost } from '../../types/socialFeed';
import { FOLLOWER_MILESTONES, formatCount, VERIFIED_FOLLOWERS } from '../../data/socialRules';
import { SocialAvatar } from './SocialAvatar';
import { HeroineSvg } from '../svg/HeroineSvg';
import { Shirt, Award, Grid, UserCheck, MapPin, CheckCircle2, Plus, Heart, Camera } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface AdaProfileViewProps {
  heroine: HeroineCustomization;
  followers?: number;
  followingCount?: number;
  adaPosts?: SocialPost[];
  taggedPosts?: SocialPost[];
  inventoryCount?: number;
  meters?: Meters;
  inventory?: InventoryItem[];
  soundEnabled: boolean;
  onOpenWardrobe: () => void;
  onOpenClues: () => void;
  onOpenPost?: (postId: string) => void;
  onCompose?: () => void;
  onSelectTagPhoto?: (title: string) => void;
}

export const AdaProfileView: React.FC<AdaProfileViewProps> = ({
  heroine,
  followers: followersProp,
  followingCount = 42,
  adaPosts = [],
  taggedPosts = [],
  inventoryCount: inventoryCountProp,
  meters,
  inventory,
  soundEnabled,
  onOpenWardrobe,
  onOpenClues,
  onOpenPost,
  onCompose,
  onSelectTagPhoto,
}) => {
  const followers =
    followersProp ??
    (meters ? Math.max(312, Math.round(312 + Math.max(0, meters.popularity - 35) ** 2 * 10)) : 1250);
  const inventoryCount = inventoryCountProp ?? inventory?.length ?? 0;
  const handleOpenPost = (id: string) => {
    if (onOpenPost) onOpenPost(id);
    else if (onSelectTagPhoto) onSelectTagPhoto(id);
  };
  const handleCompose = () => {
    if (onCompose) onCompose();
  };
  const [tab, setTab] = useState<'posts' | 'tagged'>('posts');
  const isVerified = followers >= VERIFIED_FOLLOWERS;
  const nextMilestone = FOLLOWER_MILESTONES.find((m) => followers < m);
  const prevMilestone = [...FOLLOWER_MILESTONES].reverse().find((m) => followers >= m) || 0;
  const progressPct = nextMilestone
    ? Math.round(((followers - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
    : 100;

  const grid = tab === 'posts' ? adaPosts : taggedPosts;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl">
        <div className="flex items-center gap-4">
          <SocialAvatar avatarType="heroine" heroineCustomization={heroine} size="xl" hasStoryRing={true} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-black text-lg text-neutral-100 truncate">{heroine.name} Obi</h3>
              {isVerified && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
            </div>
            <p className="text-xs text-neutral-400 font-mono">@ada_obi</p>
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
              <MapPin className="w-3 h-3 text-pink-400" />
              <span>Ajegunle • Lekki Atlantic Univ</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-neutral-800 text-center">
          <div>
            <div className="text-sm sm:text-base font-bold font-mono text-neutral-100">{adaPosts.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Posts</div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold font-mono text-neutral-100">{formatCount(followers)}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Followers</div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold font-mono text-neutral-100">{followingCount}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Following</div>
          </div>
        </div>

        {/* Road to the blue tick */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{isVerified ? 'Verified creator ✔' : 'Road to the blue tick'}</span>
            {nextMilestone && <span>Next: {formatCount(nextMilestone)}</span>}
          </div>
          <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-300 leading-relaxed">
          <p className="font-medium text-neutral-200">{heroine.department} Scholar</p>
          <p className="text-neutral-400 mt-0.5">
            Holding my ground in high society. Refusing to let anonymous blogs write my destiny. 💅📚
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
          <button
            onClick={() => {
              onOpenWardrobe();
              if (soundEnabled) playSound.click();
            }}
            className="py-2.5 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700/60"
          >
            <Shirt className="w-3.5 h-3.5 text-pink-400" />
            <span>Restyle Look</span>
          </button>
          <button
            onClick={() => {
              onOpenClues();
              if (soundEnabled) playSound.click();
            }}
            className="py-2.5 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700/60"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Evidence ({inventoryCount})</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="flex border-b border-neutral-800">
          {(['posts', 'tagged'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 ${
                tab === t ? 'border-white text-white' : 'border-transparent text-neutral-500'
              }`}
            >
              {t === 'posts' ? <Grid className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {t === 'posts' ? 'Posts' : `Tagged (${taggedPosts.length})`}
            </button>
          ))}
        </div>

        {grid.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Camera className="w-7 h-7 mx-auto text-neutral-600" />
            <p className="text-xs text-neutral-500">
              {tab === 'posts' ? 'No posts yet. Time for a debut?' : 'Nobody has tagged you yet.'}
            </p>
            {tab === 'posts' && (
              <button
                onClick={handleCompose}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> New post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {grid.map((post) => (
              <button
                key={post.id}
                onClick={() => handleOpenPost(post.id)}
                className="group relative aspect-square overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${post.graphic.bgGradient}`} />
                {post.graphic.characterId === 'heroine' && (
                  <div className="absolute inset-2 pointer-events-none opacity-90">
                    <HeroineSvg
                      customization={heroine}
                      expression="happy"
                      isTalking={false}
                      lookDirection="center"
                      reduceMotion={true}
                      className="w-full h-full"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-white text-xs font-bold transition-opacity">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  {formatCount(post.likesCount)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
