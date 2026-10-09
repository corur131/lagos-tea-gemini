import React, { useState, useEffect } from 'react';
import { CharacterId, Expression, HeroineCustomization, LocationType } from '../../types/vn';
import { getNpcLook, NPC_BASE_LOOKS } from './npcLooks';
import { HeroineSvg } from './HeroineSvg';

/** Episode 1 base looks (kept for older imports); faces & story outfits live in npcLooks.ts */
export const FEMALE_NPC_PRESETS: Record<'zee' | 'tamara' | 'chi' | 'bisola' | 'hauwa', HeroineCustomization> = NPC_BASE_LOOKS;

interface NpcSvgProps {
  characterId: CharacterId;
  expression?: Expression;
  isTalking?: boolean;
  isBlushing?: boolean;
  lookDirection?: 'left' | 'right' | 'center' | 'away';
  reduceMotion?: boolean;
  className?: string;
  /** Story moment, so outfits/hair change with place and episode */
  episode?: number;
  location?: LocationType;
}

export const NpcSvg: React.FC<NpcSvgProps> = ({
  characterId,
  expression = 'neutral',
  isTalking = false,
  isBlushing = false,
  lookDirection = 'center',
  reduceMotion = false,
  className = 'w-full h-full object-contain',
  episode,
  location,
}) => {
  // Blinking hook for NPC (random 3.2s to 5.2s interval)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let blinkTimer: NodeJS.Timeout;
    let closeTimer: NodeJS.Timeout;

    const scheduleBlink = () => {
      const wait = 3200 + Math.random() * 2000;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        closeTimer = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, wait);
    };

    scheduleBlink();
    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(closeTimer);
    };
  }, [reduceMotion]);

  // Talking mouth animation hook
  const [mouthFrame, setMouthFrame] = useState(0);

  useEffect(() => {
    if (!isTalking || reduceMotion) {
      setMouthFrame(0);
      return;
    }
    const timer = setInterval(() => {
      setMouthFrame((prev) => (prev + 1) % 4);
    }, 125);
    return () => clearInterval(timer);
  }, [isTalking, reduceMotion]);

  // Gaze calculation
  let gazeDx = 0;
  if (lookDirection === 'left') gazeDx = -2.4;
  else if (lookDirection === 'right') gazeDx = 2.4;
  else if (lookDirection === 'away') gazeDx = 3.0;

  // Female NPCs rendered via parametric HeroineSvg with fixed presets
  if (characterId in FEMALE_NPC_PRESETS) {
    const { look, face } = getNpcLook(characterId as keyof typeof FEMALE_NPC_PRESETS, { episode, location });
    return (
      <HeroineSvg
        customization={look}
        face={face}
        expression={expression}
        isTalking={isTalking}
        isBlushing={isBlushing}
        lookDirection={lookDirection}
        reduceMotion={reduceMotion}
        className={className}
      />
    );
  }

  if (characterId === 'chidi') {
    return (
      <ChidiSvg
        expression={expression}
        isBlinking={isBlinking}
        mouthFrame={mouthFrame}
        isBlushing={isBlushing}
        gazeDx={gazeDx}
        className={className}
      />
    );
  }

  if (characterId === 'kelvin') {
    return (
      <KelvinSvg
        expression={expression}
        isBlinking={isBlinking}
        mouthFrame={mouthFrame}
        isBlushing={isBlushing}
        gazeDx={gazeDx}
        className={className}
      />
    );
  }

  if (characterId === 'dayo') {
    return (
      <DayoSvg
        expression={expression}
        isBlinking={isBlinking}
        mouthFrame={mouthFrame}
        isBlushing={isBlushing}
        gazeDx={gazeDx}
        className={className}
      />
    );
  }

  return null;
};

/* =========================================================================
   CHIDI NWOSU
   Down-to-earth campus photographer: observant, warm, camera strap across chest,
   fitted dark shirt, clean hairline fade with full crown coverage.
   ========================================================================= */
interface MalePartProps {
  expression: Expression;
  isBlinking: boolean;
  mouthFrame: number;
  isBlushing?: boolean;
  gazeDx: number;
  className: string;
}

const ChidiSvg: React.FC<MalePartProps> = ({
  expression,
  isBlinking,
  mouthFrame,
  isBlushing,
  gazeDx,
  className,
}) => {
  const skin = {
    base: '#6B3919',
    shadow: '#542A12',
    highlight: '#8A4A22',
  };

  const renderEyebrows = () => {
    switch (expression) {
      case 'angry':
        return (
          <g stroke="#141215" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M 120 128 L 146 136" />
            <path d="M 200 128 L 174 136" />
          </g>
        );
      case 'shocked':
        return (
          <g stroke="#141215" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 122 Q 133 114 148 122" />
            <path d="M 202 122 Q 187 114 172 122" />
          </g>
        );
      case 'flirty':
      case 'happy':
        return (
          <g stroke="#141215" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 126 Q 133 121 148 127" />
            <path d="M 202 124 Q 187 121 172 127" />
          </g>
        );
      case 'suspicious':
        return (
          <g stroke="#141215" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 127 Q 133 125 148 128" />
            <path d="M 202 123 Q 187 118 172 125" />
          </g>
        );
      default:
        return (
          <g stroke="#141215" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 127 Q 133 123 148 127" />
            <path d="M 202 127 Q 187 123 172 127" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (mouthFrame === 1) {
      return (
        <path
          d="M 148 206 Q 160 211 172 206 Q 160 216 148 206 Z"
          fill="#35160E"
          stroke="#421C11"
          strokeWidth="1.2"
        />
      );
    }
    if (mouthFrame === 2 || mouthFrame === 3) {
      return (
        <path
          d="M 146 205 Q 160 213 174 205 Q 160 220 146 205 Z"
          fill="#2C120B"
          stroke="#421C11"
          strokeWidth="1.2"
        />
      );
    }
    if (expression === 'happy' || expression === 'flirty') {
      return (
        <path
          d="M 148 206 Q 160 214 172 206"
          stroke="#421C11"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (expression === 'angry') {
      return (
        <path
          d="M 148 208 Q 160 205 172 208"
          stroke="#421C11"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    return (
      <path
        d="M 148 207 Q 160 209 172 207"
        stroke="#421C11"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  return (
    <svg
      viewBox="0 0 320 420"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chidi_skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="40%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </linearGradient>
        <radialGradient id="chidi_crown_shine" cx="50%" cy="28%" r="48%">
          <stop offset="0%" stopColor="#4A3B44" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#251E22" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#141215" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Back hair layer behind head */}
      <path
        d="M 90 90 C 90 20, 230 20, 230 90 C 236 140, 236 195, 234 220 L 86 220 C 84 195, 84 140, 90 90 Z"
        fill="#141215"
      />

      {/* Grounded body touching y=420 */}
      <path
        d="M 68 320 C 85 275, 118 245, 140 238 L 140 215 L 180 215 L 180 238 C 202 245, 235 275, 252 320 L 268 420 L 52 420 Z"
        fill="url(#chidi_skin)"
      />

      {/* Fitted photographer dark shirt */}
      <path
        d="M 60 330 C 80 288, 120 255, 140 252 L 140 270 C 150 285, 170 285, 180 270 L 180 252 C 200 255, 240 288, 260 330 L 272 420 L 48 420 Z"
        fill="#18181B"
      />
      {/* V-neck stitch */}
      <path d="M 142 254 L 160 278 L 178 254" stroke="#27272A" strokeWidth="2" fill="none" />

      {/* Camera Strap across shoulder */}
      <path
        d="M 85 285 L 245 420"
        stroke="#E11D48"
        strokeWidth="10"
        strokeLinecap="square"
        opacity="0.9"
      />
      <path
        d="M 85 285 L 245 420"
        stroke="#111827"
        strokeWidth="6"
        strokeLinecap="square"
      />
      {/* Camera brand accent on strap */}
      <rect x="135" y="325" width="22" height="7" rx="1.5" fill="#F43F5E" transform="rotate(40, 146, 328)" />

      {/* Neck shadow */}
      <path d="M 140 215 L 180 215 L 174 235 L 146 235 Z" fill={skin.shadow} opacity="0.6" />

      {/* Head shape */}
      <path
        d="M 98 126 C 98 52, 222 52, 222 126 C 222 182, 198 226, 160 226 C 122 226, 98 182, 98 126 Z"
        fill="url(#chidi_skin)"
      />

      {/* Ears */}
      <path d="M 98 140 C 88 140, 88 165, 98 165 Z" fill={skin.base} />
      <path d="M 222 140 C 232 140, 232 165, 222 165 Z" fill={skin.base} />

      {/* Hair fade: fully covers top of skull up to y=20, past temples, with crown highlight & edge-up */}
      <path
        d="M 88 126 C 88 20, 120 18, 160 18 C 200 18, 232 20, 232 126 C 236 138, 230 150, 220 148 C 214 128, 206 116, 194 114 C 160 114, 150 114, 126 114 C 114 116, 106 128, 100 148 C 90 150, 84 138, 88 126 Z"
        fill="#141215"
      />
      {/* Crown shine highlight */}
      <ellipse cx="160" cy="50" rx="46" ry="24" fill="url(#chidi_crown_shine)" />
      {/* Hairline edge-up */}
      <path
        d="M 104 135 L 122 120 L 198 120 L 216 135"
        stroke="#0F0D10"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Beard & Mustache fade */}
      <path
        d="M 130 176 C 138 180, 152 180, 160 180 C 168 180, 182 180, 190 176 C 182 184, 168 186, 160 186 C 152 186, 138 184, 130 176 Z"
        fill="#141215"
        opacity="0.8"
      />
      <path
        d="M 116 168 C 116 210, 138 226, 160 226 C 182 226, 204 210, 204 168 C 196 195, 182 216, 160 216 C 138 216, 124 195, 116 168 Z"
        fill="#141215"
        opacity="0.85"
      />

      {/* Eyebrows */}
      {renderEyebrows()}

      {/* Eyes */}
      {isBlinking ? (
        <g stroke="#1A181B" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 122 146 Q 134 150 146 146" />
          <path d="M 174 146 Q 186 150 198 146" />
        </g>
      ) : (
        <g>
          {/* Sclera */}
          <path d="M 120 145 Q 134 138 148 145 Q 134 152 120 145 Z" fill="#F4F4F5" />
          <path d="M 172 145 Q 186 138 200 145 Q 186 152 172 145 Z" fill="#F4F4F5" />
          {/* Irises */}
          <circle cx={134 + gazeDx} cy="145" r="4.8" fill="#3D2012" />
          <circle cx={186 + gazeDx} cy="145" r="4.8" fill="#3D2012" />
          {/* Pupils */}
          <circle cx={134 + gazeDx} cy="145" r="2.4" fill="#09090B" />
          <circle cx={186 + gazeDx} cy="145" r="2.4" fill="#09090B" />
          {/* Catchlight */}
          <circle cx={132 + gazeDx} cy="143" r="1.2" fill="#FFFFFF" />
          <circle cx={184 + gazeDx} cy="143" r="1.2" fill="#FFFFFF" />
        </g>
      )}

      {/* Nose */}
      <path
        d="M 158 142 L 156 174 Q 152 178 148 178 M 164 178 Q 168 178 164 174 L 162 142"
        stroke={skin.shadow}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="160" cy="178" rx="6" ry="2.4" fill={skin.shadow} opacity="0.65" />

      {/* Mouth */}
      {renderMouth()}

      {/* Blushing */}
      {isBlushing && (
        <g opacity="0.35">
          <ellipse cx="128" cy="162" rx="14" ry="7" fill="#E11D48" />
          <ellipse cx="192" cy="162" rx="14" ry="7" fill="#E11D48" />
        </g>
      )}
    </svg>
  );
};

/* =========================================================================
   KELVIN ADEBAYO-WRIGHT
   Zee's older brother: rich, charming, risky. Designer jewelry, tailored linen shirt,
   stylish twists/fade with full crown coverage, magnetic confident smirk.
   ========================================================================= */
const KelvinSvg: React.FC<MalePartProps> = ({
  expression,
  isBlinking,
  mouthFrame,
  isBlushing,
  gazeDx,
  className,
}) => {
  const skin = {
    base: '#784320',
    shadow: '#5E3114',
    highlight: '#99582D',
  };

  const renderEyebrows = () => {
    switch (expression) {
      case 'flirty':
      case 'happy':
        return (
          <g stroke="#161214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 123 Q 134 116 148 124" />
            <path d="M 202 125 Q 186 122 172 127" />
          </g>
        );
      case 'angry':
        return (
          <g stroke="#161214" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M 118 126 L 146 134" />
            <path d="M 202 126 L 174 134" />
          </g>
        );
      case 'shocked':
        return (
          <g stroke="#161214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 119 Q 134 111 148 119" />
            <path d="M 202 119 Q 186 111 172 119" />
          </g>
        );
      case 'suspicious':
        return (
          <g stroke="#161214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 126 Q 134 125 148 126" />
            <path d="M 202 122 Q 186 117 172 124" />
          </g>
        );
      default:
        return (
          <g stroke="#161214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 118 125 Q 134 120 148 125" />
            <path d="M 202 125 Q 186 120 172 125" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (mouthFrame === 1) {
      return (
        <path
          d="M 148 205 Q 162 210 174 204 Q 160 216 148 205 Z"
          fill="#3B1710"
          stroke="#471F17"
          strokeWidth="1.2"
        />
      );
    }
    if (mouthFrame === 2 || mouthFrame === 3) {
      return (
        <path
          d="M 146 204 Q 162 212 176 203 Q 160 220 146 204 Z"
          fill="#30130C"
          stroke="#471F17"
          strokeWidth="1.2"
        />
      );
    }
    if (expression === 'flirty' || expression === 'happy') {
      return (
        <path
          d="M 148 206 Q 162 211 174 203"
          stroke="#471F17"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (expression === 'angry') {
      return (
        <path
          d="M 148 207 Q 160 204 172 207"
          stroke="#471F17"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    return (
      <path
        d="M 148 206 Q 162 208 174 205"
        stroke="#471F17"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  return (
    <svg
      viewBox="0 0 320 420"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="kelvin_skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="40%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </linearGradient>
        <radialGradient id="kelvin_crown_shine" cx="50%" cy="26%" r="48%">
          <stop offset="0%" stopColor="#443740" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#221C20" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#161214" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Back hair layer behind head */}
      <path
        d="M 90 90 C 90 18, 230 18, 230 90 C 236 140, 236 195, 234 220 L 86 220 C 84 195, 84 140, 90 90 Z"
        fill="#161214"
      />

      <path
        d="M 70 320 C 88 275, 120 245, 140 238 L 140 215 L 180 215 L 180 238 C 200 245, 232 275, 250 320 L 265 420 L 55 420 Z"
        fill="url(#kelvin_skin)"
      />

      {/* Tailored crisp open-collar silk/linen cream shirt */}
      <path
        d="M 64 330 C 84 285, 122 255, 140 252 L 140 290 L 160 305 L 180 290 L 180 252 C 198 255, 236 285, 256 330 L 270 420 L 50 420 Z"
        fill="#F5F5F4"
      />
      {/* Open collar lapels */}
      <polygon points="140,252 120,295 145,288" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="1" />
      <polygon points="180,252 200,295 175,288" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="1" />

      {/* Gold Cuban chain necklace */}
      <path
        d="M 135 258 Q 160 286 185 258"
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="160" cy="275" r="3" fill="#FBBF24" />

      {/* Neck shadow */}
      <path d="M 140 215 L 180 215 L 174 235 L 146 235 Z" fill={skin.shadow} opacity="0.6" />

      {/* Head shape */}
      <path
        d="M 98 124 C 98 52, 222 52, 222 124 C 222 180, 196 225, 160 225 C 124 225, 98 180, 98 124 Z"
        fill="url(#kelvin_skin)"
      />

      {/* Ears */}
      <path d="M 98 138 C 88 138, 88 163, 98 163 Z" fill={skin.base} />
      <path d="M 222 138 C 232 138, 232 163, 222 163 Z" fill={skin.base} />
      {/* Kelvin's diamond ear stud */}
      <circle cx="228" cy="152" r="2.2" fill="#FFFFFF" stroke="#D4D4D8" strokeWidth="0.8" />

      {/* Kelvin's stylish twists/fade covering top of skull up to y=18 */}
      <g id="kelvin_twists">
        <path
          d="M 88 124 C 88 20, 120 18, 160 18 C 200 18, 232 20, 232 124 C 234 136, 226 148, 218 144 C 210 125, 200 112, 188 109 C 160 107, 150 107, 132 109 C 120 112, 110 125, 102 144 C 94 148, 86 136, 88 124 Z"
          fill="#161214"
        />
        <ellipse cx="160" cy="46" rx="44" ry="22" fill="url(#kelvin_crown_shine)" />

        {/* Individual twist textures */}
        {[
          { x: 120, y: 70 },
          { x: 135, y: 55 },
          { x: 152, y: 48 },
          { x: 168, y: 48 },
          { x: 185, y: 55 },
          { x: 200, y: 70 },
          { x: 126, y: 92 },
          { x: 142, y: 80 },
          { x: 160, y: 72 },
          { x: 178, y: 80 },
          { x: 194, y: 92 },
          { x: 150, y: 98 },
          { x: 170, y: 98 },
        ].map((pt, i) => (
          <ellipse
            key={`twist_${i}`}
            cx={pt.x}
            cy={pt.y}
            rx="6.5"
            ry="4.5"
            fill="#231E21"
            stroke="#161214"
            strokeWidth="1.2"
          />
        ))}
      </g>

      {/* Clean sculpt beard line */}
      <path
        d="M 124 180 C 134 185, 148 185, 160 185 C 172 185, 186 185, 196 180 C 188 188, 172 190, 160 190 C 148 190, 132 188, 124 180 Z"
        fill="#161214"
        opacity="0.85"
      />
      <path
        d="M 112 165 C 112 210, 136 226, 160 226 C 184 226, 208 210, 208 165 C 200 196, 184 218, 160 218 C 136 218, 120 196, 112 165 Z"
        fill="#161214"
        opacity="0.9"
      />

      {/* Eyebrows */}
      {renderEyebrows()}

      {/* Eyes */}
      {isBlinking ? (
        <g stroke="#1A181B" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 122 144 Q 134 148 146 144" />
          <path d="M 174 144 Q 186 148 198 144" />
        </g>
      ) : (
        <g>
          {/* Sclera */}
          <path d="M 120 143 Q 134 136 148 143 Q 134 150 120 143 Z" fill="#F4F4F5" />
          <path d="M 172 143 Q 186 136 200 143 Q 186 150 172 143 Z" fill="#F4F4F5" />
          {/* Irises */}
          <circle cx={134 + gazeDx} cy="143" r="4.8" fill="#452313" />
          <circle cx={186 + gazeDx} cy="143" r="4.8" fill="#452313" />
          {/* Pupils */}
          <circle cx={134 + gazeDx} cy="143" r="2.4" fill="#09090B" />
          <circle cx={186 + gazeDx} cy="143" r="2.4" fill="#09090B" />
          {/* Catchlight */}
          <circle cx={132 + gazeDx} cy="141" r="1.2" fill="#FFFFFF" />
          <circle cx={184 + gazeDx} cy="141" r="1.2" fill="#FFFFFF" />
        </g>
      )}

      {/* Nose */}
      <path
        d="M 158 140 L 156 172 Q 152 176 148 176 M 164 176 Q 168 176 164 172 L 162 140"
        stroke={skin.shadow}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="160" cy="176" rx="6" ry="2.4" fill={skin.shadow} opacity="0.65" />

      {/* Mouth */}
      {renderMouth()}

      {/* Blushing */}
      {isBlushing && (
        <g opacity="0.35">
          <ellipse cx="128" cy="160" rx="14" ry="7" fill="#E11D48" />
          <ellipse cx="192" cy="160" rx="14" ry="7" fill="#E11D48" />
        </g>
      )}
    </svg>
  );
};

/* =========================================================================
   DAYO MARTINS
   Mysterious, handsome hitmaker/producer: warm bronze skin, studio headphones
   resting around neck, tinted amber wire glasses, tailored deep plum jacket.
   ========================================================================= */
const DayoSvg: React.FC<MalePartProps> = ({
  expression,
  isBlinking,
  mouthFrame,
  isBlushing,
  gazeDx,
  className,
}) => {
  const skin = {
    base: '#78350F',
    shadow: '#592208',
    highlight: '#92400E',
  };

  const renderEyebrows = () => {
    switch (expression) {
      case 'suspicious':
        return (
          <g stroke="#181214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 120 128 Q 134 130 148 134" />
            <path d="M 172 136 Q 186 130 200 126" />
          </g>
        );
      case 'happy':
      case 'flirty':
        return (
          <g stroke="#181214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 120 129 Q 134 125 148 131" />
            <path d="M 172 131 Q 186 125 200 129" />
          </g>
        );
      default:
        return (
          <g stroke="#181214" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 120 131 Q 134 127 148 131" />
            <path d="M 172 131 Q 186 127 200 131" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (mouthFrame > 0) {
      return (
        <path
          d={`M 144 196 Q 160 ${196 + mouthFrame * 3} 176 196 Q 160 ${202 + mouthFrame * 2} 144 196 Z`}
          fill="#451A03"
          stroke="#2D1102"
          strokeWidth="1.2"
        />
      );
    }
    if (expression === 'flirty' || expression === 'happy') {
      return (
        <path
          d="M 145 195 Q 160 203 175 195"
          stroke="#451A03"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    return (
      <path
        d="M 146 196 Q 160 198 174 196"
        stroke="#451A03"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  return (
    <svg
      viewBox="0 0 320 420"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="dayo_skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="60%" stopColor={skin.base} />
          <stop offset="100%" stopColor={skin.shadow} />
        </linearGradient>
      </defs>

      {/* Shoulders / Deep Plum Velvet Producer Jacket */}
      <path
        d="M 50 420 L 62 335 C 80 285, 118 252, 160 252 C 202 252, 240 285, 258 335 L 270 420 Z"
        fill="#2A0845"
      />
      {/* Matte Black Turtleneck Inner */}
      <path
        d="M 134 250 L 134 285 C 134 296, 186 296, 186 285 L 186 250 Z"
        fill="#111827"
      />
      {/* Studio Monitor Headphones around neck */}
      <path
        d="M 108 268 C 112 305, 208 305, 212 268"
        stroke="#4B5563"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left headphone ear cup */}
      <rect x="96" y="246" width="22" height="34" rx="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5" />
      {/* Right headphone ear cup */}
      <rect x="202" y="246" width="22" height="34" rx="10" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5" />

      {/* Neck */}
      <path d="M 142 208 L 178 208 L 174 252 L 146 252 Z" fill="url(#dayo_skin)" />

      {/* Head shape */}
      <path
        d="M 102 124 C 102 54, 218 54, 218 124 C 218 180, 194 225, 160 225 C 126 225, 102 180, 102 124 Z"
        fill="url(#dayo_skin)"
      />

      {/* Ears */}
      <path d="M 102 138 C 92 138, 92 163, 102 163 Z" fill={skin.base} />
      <path d="M 218 138 C 228 138, 228 163, 218 163 Z" fill={skin.base} />

      {/* Dayo Hair: Clean geometric low fade & short textured curls */}
      <path
        d="M 94 124 C 94 26, 122 22, 160 22 C 198 22, 226 26, 226 124 C 228 136, 220 146, 214 142 C 206 122, 198 108, 186 106 C 160 104, 150 104, 134 106 C 122 108, 114 122, 106 142 C 100 146, 92 136, 94 124 Z"
        fill="#111113"
      />

      {/* Goatee & sharp jaw shadow */}
      <path
        d="M 148 186 Q 160 188 172 186 Q 166 216 160 224 Q 154 216 148 186 Z"
        fill="#181214"
        opacity="0.9"
      />

      {/* Eyebrows */}
      {renderEyebrows()}

      {/* Eyes */}
      {isBlinking ? (
        <g stroke="#181214" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 124 144 Q 136 148 148 144" />
          <path d="M 172 144 Q 184 148 196 144" />
        </g>
      ) : (
        <g>
          <path d="M 122 143 Q 136 136 150 143 Q 136 150 122 143 Z" fill="#F4F4F5" />
          <path d="M 170 143 Q 184 136 198 143 Q 184 150 170 143 Z" fill="#F4F4F5" />
          <circle cx={136 + gazeDx} cy="143" r="4.6" fill="#2E180B" />
          <circle cx={184 + gazeDx} cy="143" r="4.6" fill="#2E180B" />
          <circle cx={136 + gazeDx} cy="143" r="2.2" fill="#0A0A0A" />
          <circle cx={184 + gazeDx} cy="143" r="2.2" fill="#0A0A0A" />
          <circle cx={134 + gazeDx} cy="141" r="1.1" fill="#FFFFFF" />
          <circle cx={182 + gazeDx} cy="141" r="1.1" fill="#FFFFFF" />
        </g>
      )}

      {/* Designer Gold Tinted Wire Aviators */}
      <g stroke="#D97706" strokeWidth="1.2" fill="none">
        {/* Left lens */}
        <rect x="116" y="132" width="34" height="23" rx="5" fill="#F59E0B" fillOpacity="0.18" />
        {/* Right lens */}
        <rect x="170" y="132" width="34" height="23" rx="5" fill="#F59E0B" fillOpacity="0.18" />
        {/* Bridge */}
        <line x1="150" y1="138" x2="170" y2="138" strokeWidth="1.6" />
        {/* Brow bar */}
        <line x1="120" y1="133" x2="200" y2="133" strokeWidth="1.1" opacity="0.8" />
      </g>

      {/* Nose */}
      <path
        d="M 158 140 L 156 172 Q 152 176 148 176 M 164 176 Q 168 176 164 172 L 162 140"
        stroke={skin.shadow}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth */}
      {renderMouth()}

      {/* Blushing */}
      {isBlushing && (
        <g opacity="0.3">
          <ellipse cx="130" cy="160" rx="14" ry="7" fill="#E11D48" />
          <ellipse cx="190" cy="160" rx="14" ry="7" fill="#E11D48" />
        </g>
      )}
    </svg>
  );
};
