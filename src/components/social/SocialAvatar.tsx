import React from 'react';
import { CharacterId, HeroineCustomization } from '../../types/vn';
import { HeroineSvg } from '../svg/HeroineSvg';
import { NpcSvg, FEMALE_NPC_PRESETS } from '../svg/NpcSvg';
import { Coffee, User } from 'lucide-react';

interface SocialAvatarProps {
  avatarType: CharacterId | 'lagos_tea' | 'fan' | string;
  heroineCustomization?: HeroineCustomization;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStoryRing?: boolean;
  hasUnseenStory?: boolean;
  isLagosTea?: boolean;
  className?: string;
  onClick?: () => void;
  avatarColor?: string;
  initials?: string;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export const SocialAvatar: React.FC<SocialAvatarProps> = ({
  avatarType,
  heroineCustomization,
  size = 'md',
  hasStoryRing = false,
  hasUnseenStory = false,
  isLagosTea = false,
  avatarColor,
  initials,
  className = '',
  onClick,
}) => {
  const sizeClass = SIZE_CLASSES[size];

  // Ring style calculation
  const ringWrapper = hasStoryRing
    ? isLagosTea || avatarType === 'lagos_tea'
      ? hasUnseenStory
        ? 'p-[2px] rounded-full bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 animate-pulse'
        : 'p-[2px] rounded-full bg-neutral-700'
      : hasUnseenStory
      ? 'p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600'
      : 'p-[2px] rounded-full bg-neutral-700'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 ${ringWrapper} ${
        onClick ? 'cursor-pointer transition-transform active:scale-95' : ''
      } ${className}`}
    >
      <div
        className={`${sizeClass} rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center relative shadow-inner`}
      >
        {/* Lagos Tea Anonymous Teapot */}
        {(avatarType === 'lagos_tea' || isLagosTea) && (
          <div className="w-full h-full bg-gradient-to-tr from-rose-950 via-purple-900 to-amber-900 flex items-center justify-center text-amber-300">
            <Coffee className="w-1/2 h-1/2 drop-shadow-md text-amber-300 animate-pulse" />
          </div>
        )}

        {/* Heroine Ada */}
        {avatarType === 'heroine' && heroineCustomization && (
          <div className="w-full h-full flex items-center justify-center scale-[1.8] translate-y-1">
            <HeroineSvg
              customization={heroineCustomization}
              expression="neutral"
              isTalking={false}
              lookDirection="center"
              reduceMotion={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Female NPCs */}
        {avatarType in FEMALE_NPC_PRESETS && (
          <div className="w-full h-full flex items-center justify-center scale-[1.8] translate-y-1">
            <NpcSvg
              characterId={avatarType as CharacterId}
              expression="neutral"
              isTalking={false}
              lookDirection="center"
              reduceMotion={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Chidi */}
        {avatarType === 'chidi' && (
          <div className="w-full h-full flex items-center justify-center scale-[1.8] translate-y-1">
            <NpcSvg
              characterId="chidi"
              expression="neutral"
              isTalking={false}
              lookDirection="center"
              reduceMotion={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Kelvin */}
        {avatarType === 'kelvin' && (
          <div className="w-full h-full flex items-center justify-center scale-[1.8] translate-y-1">
            <NpcSvg
              characterId="kelvin"
              expression="neutral"
              isTalking={false}
              lookDirection="center"
              reduceMotion={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Dayo */}
        {avatarType === 'dayo' && (
          <div className="w-full h-full flex items-center justify-center scale-[1.8] translate-y-1">
            <NpcSvg
              characterId="dayo"
              expression="neutral"
              isTalking={false}
              lookDirection="center"
              reduceMotion={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Fan / Lightweight / Default */}
        {(avatarType === 'fan' || avatarType === 'narrator' || !(avatarType in FEMALE_NPC_PRESETS || ['chidi', 'kelvin', 'dayo', 'heroine', 'lagos_tea'].includes(avatarType))) && (
          <div
            className="w-full h-full flex items-center justify-center font-bold text-white text-[11px] select-none"
            style={{ backgroundColor: avatarColor || '#334155' }}
          >
            {initials ? initials.slice(0, 2).toUpperCase() : <User className="w-1/2 h-1/2 text-neutral-300" />}
          </div>
        )}
      </div>
    </div>
  );
};
