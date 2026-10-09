import React, { useState, useEffect } from 'react';
import {
  HeroineCustomization,
  Expression,
} from '../../types/vn';
import {
  SKIN_TONES,
  EYE_COLORS,
  HAIR_COLORS,
  LIP_COLORS,
  EYESHADOW_COLORS,
  BLUSH_COLORS,
} from './palettes';
import type { FaceProfile, HeadShape } from './npcLooks';

interface HeroineSvgProps {
  customization: HeroineCustomization;
  expression?: Expression;
  isTalking?: boolean;
  isBlushing?: boolean;
  lookDirection?: 'left' | 'right' | 'center' | 'away';
  reduceMotion?: boolean;
  className?: string;
  /** Face shape/features for NPCs drawn with this body (Ada uses the default) */
  face?: FaceProfile;
}

const HEAD_PATHS: Record<HeadShape, string> = {
  oval: 'M 106 120 C 106 75, 126 58, 160 58 C 194 58, 214 75, 214 120 C 214 165, 208 194, 186 218 C 174 231, 166 235, 160 235 C 154 235, 146 231, 134 218 C 112 194, 106 165, 106 120 Z',
  round: 'M 104 125 C 104 74, 126 58, 160 58 C 194 58, 216 74, 216 125 C 216 172, 206 200, 188 218 C 176 229, 168 232, 160 232 C 152 232, 144 229, 132 218 C 114 200, 104 172, 104 125 Z',
  heart: 'M 104 118 C 104 72, 126 56, 160 56 C 194 56, 216 72, 216 118 C 216 160, 206 186, 182 214 C 172 228, 165 237, 160 237 C 155 237, 148 228, 138 214 C 114 186, 104 160, 104 118 Z',
  long: 'M 108 116 C 108 70, 128 54, 160 54 C 192 54, 212 70, 212 116 C 212 168, 207 200, 188 224 C 176 237, 167 241, 160 241 C 153 241, 144 237, 132 224 C 113 200, 108 168, 108 116 Z',
  square: 'M 106 120 C 106 74, 126 58, 160 58 C 194 58, 214 74, 214 120 C 214 170, 212 198, 196 216 C 184 228, 172 232, 160 232 C 148 232, 136 228, 124 216 C 108 198, 106 170, 106 120 Z',
};

/** Scale around a point, as an SVG transform */
const scaleAround = (cx: number, cy: number, sx: number, sy = sx) =>
  sx === 1 && sy === 1 ? undefined : `translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`;

export const HeroineSvg: React.FC<HeroineSvgProps> = ({
  customization,
  expression = 'neutral',
  isTalking = false,
  isBlushing = false,
  lookDirection = 'center',
  reduceMotion = false,
  className = 'w-full h-full object-contain',
  face,
}) => {
  const headShape: HeadShape = face?.headShape ?? 'oval';
  const faceW = face?.faceWidth ?? 1;
  const marks = face?.marks ?? [];
  // Palettes
  const skin = SKIN_TONES[customization.skinTone] || SKIN_TONES.rich_honey;
  const eye = EYE_COLORS[customization.eyeColor] || EYE_COLORS.dark_brown;
  const hair = HAIR_COLORS[customization.hairColor] || HAIR_COLORS.jet_black;
  const lip = LIP_COLORS[customization.lipColor] || LIP_COLORS.nude;
  const shadow = EYESHADOW_COLORS[customization.eyeshadow] || EYESHADOW_COLORS.none;
  const blush = BLUSH_COLORS[customization.blush] || BLUSH_COLORS.soft_peach;
  const isGloss = customization.lipFinish === 'gloss';
  const hasHighlighter = customization.highlighter;

  // 1. BLINKING ANIMATION (every 3 to 5s, closes for 150ms)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let blinkTimeout: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const interval = 3000 + Math.random() * 2000; // 3 to 5 seconds
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        closeTimeout = setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, interval);
    };

    scheduleNextBlink();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(closeTimeout);
    };
  }, [reduceMotion]);

  // 2. TALKING MOUTH LIP-SYNC (cycles 0: closed, 1: half-open, 2: open when isTalking)
  const [mouthFrame, setMouthFrame] = useState(0);

  useEffect(() => {
    if (!isTalking || reduceMotion) {
      setMouthFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setMouthFrame((prev) => (prev + 1) % 4);
    }, 120);

    return () => clearInterval(interval);
  }, [isTalking, reduceMotion]);

  const uniqueId = `heroine_${customization.skinTone}_${customization.hairColor}_${customization.lipColor}`;

  // Eye gaze offset calculation
  let gazeDx = 0;
  if (lookDirection === 'left') gazeDx = -2.4;
  else if (lookDirection === 'right') gazeDx = 2.4;
  else if (lookDirection === 'away') gazeDx = 3.2;

  // Eyebrows geometry based on style & expression
  const renderEyebrows = () => {
    let strokeW = 2.5;
    if (customization.brows === 'soft') strokeW = 2.0;
    if (customization.brows === 'bold') strokeW = 3.4;

    switch (expression) {
      case 'angry':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 102 147 Q 120 144 140 155" />
            <path d="M 180 155 Q 200 144 218 147" />
          </g>
        );
      case 'shocked':
      case 'scared':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 104 133 Q 122 125 140 135" />
            <path d="M 180 135 Q 198 125 216 133" />
          </g>
        );
      case 'sad':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 104 150 Q 122 144 140 137" />
            <path d="M 180 137 Q 198 144 216 150" />
          </g>
        );
      case 'flirty':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            {/* One brow lifted higher */}
            <path d="M 104 136 Q 122 128 140 138" />
            <path d="M 180 143 Q 198 139 216 144" />
          </g>
        );
      case 'jealous':
      case 'suspicious':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 104 145 Q 122 140 140 148" />
            <path d="M 180 138 Q 198 132 216 142" />
          </g>
        );
      case 'happy':
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 104 138 Q 122 131 140 141" />
            <path d="M 180 141 Q 198 131 216 138" />
          </g>
        );
      case 'neutral':
      default:
        return (
          <g stroke="#161214" strokeWidth={strokeW} strokeLinecap="round" fill="none" className="transition-all duration-300">
            <path d="M 104 141 Q 122 134 140 144" />
            <path d="M 180 144 Q 198 134 216 141" />
          </g>
        );
    }
  };

  // Lashes on eyelids
  const renderLashes = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    switch (customization.lashes) {
      case 'natural':
        return isLeft ? (
          <g stroke="#141113" strokeWidth="1.4" strokeLinecap="round">
            <line x1="138" y1="158" x2="144" y2="155" />
            <line x1="140" y1="160" x2="146" y2="157" />
          </g>
        ) : (
          <g stroke="#141113" strokeWidth="1.4" strokeLinecap="round">
            <line x1="182" y1="158" x2="176" y2="155" />
            <line x1="180" y1="160" x2="174" y2="157" />
          </g>
        );

      case 'classic':
        return isLeft ? (
          <g stroke="#100D0F" strokeWidth="1.8" strokeLinecap="round">
            <path d="M 130 152 Q 136 148 141 151" fill="none" />
            <path d="M 137 154 Q 143 150 148 155" fill="none" />
          </g>
        ) : (
          <g stroke="#100D0F" strokeWidth="1.8" strokeLinecap="round">
            <path d="M 190 152 Q 184 148 179 151" fill="none" />
            <path d="M 183 154 Q 177 150 172 155" fill="none" />
          </g>
        );

      case 'volume':
        return isLeft ? (
          <g stroke="#09080A" strokeWidth="2.0" strokeLinecap="round">
            <line x1="112" y1="155" x2="110" y2="150" />
            <line x1="120" y1="152" x2="120" y2="146" />
            <line x1="128" y1="151" x2="130" y2="145" />
            <line x1="136" y1="153" x2="142" y2="148" />
            <line x1="142" y1="157" x2="149" y2="153" />
          </g>
        ) : (
          <g stroke="#09080A" strokeWidth="2.0" strokeLinecap="round">
            <line x1="208" y1="155" x2="210" y2="150" />
            <line x1="200" y1="152" x2="200" y2="146" />
            <line x1="192" y1="151" x2="190" y2="145" />
            <line x1="184" y1="153" x2="178" y2="148" />
            <line x1="178" y1="157" x2="171" y2="153" />
          </g>
        );

      case 'dramatic':
        return isLeft ? (
          <g stroke="#050405" strokeWidth="2.4" strokeLinecap="round">
            <path d="M 110 155 Q 107 146 104 143" fill="none" />
            <path d="M 118 152 Q 117 143 116 140" fill="none" />
            <path d="M 126 150 Q 128 141 129 139" fill="none" />
            <path d="M 134 151 Q 140 142 144 141" fill="none" />
            <path d="M 140 156 Q 148 147 154 150" fill="none" />
          </g>
        ) : (
          <g stroke="#050405" strokeWidth="2.4" strokeLinecap="round">
            <path d="M 210 155 Q 213 146 216 143" fill="none" />
            <path d="M 202 152 Q 203 143 204 140" fill="none" />
            <path d="M 194 150 Q 192 141 191 139" fill="none" />
            <path d="M 186 151 Q 180 142 176 141" fill="none" />
            <path d="M 180 156 Q 172 147 166 150" fill="none" />
          </g>
        );
      default:
        return null;
    }
  };

  // Eyes rendering: Even, centered inside white, natural almond shape
  const renderEyes = () => {
    // Blinking mode: eyelid shuts down over the eye
    if (isBlinking) {
      return (
        <g id="eyes_blinking" className="transition-all duration-150">
          <path d="M 104 162 Q 123 167 142 162" stroke="#161214" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M 178 162 Q 197 167 216 162" stroke="#161214" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    const isShockedOrScared = expression === 'shocked' || expression === 'scared';
    const isNarrowed = expression === 'angry' || expression === 'jealous' || expression === 'suspicious';
    const isHappy = expression === 'happy';

    const irisRadius = isShockedOrScared ? 7.6 : isNarrowed ? 6.2 : 7.0;

    return (
      <g id="eyes" className="transition-all duration-300">
        {/* Left Eye */}
        <g id="left_eye">
          {shadow.opacity > 0 && (
            <ellipse cx="123" cy="154" rx="20" ry="8" fill={shadow.color} opacity={shadow.opacity} />
          )}

          {/* Sclera - perfectly balanced & centered */}
          <path
            d={
              isHappy
                ? 'M 104 162 Q 123 152 142 162 Q 123 169 104 162 Z'
                : isNarrowed
                ? 'M 104 162 Q 123 155 142 162 Q 123 167 104 162 Z'
                : 'M 104 162 Q 123 151 142 162 Q 123 171 104 162 Z'
            }
            fill="#F8F6F2"
          />

          {/* Eyelid crease */}
          <path d="M 108 153 Q 123 148 138 153" stroke={skin.shadowColor} strokeWidth="1.2" fill="none" opacity="0.45" />

          {/* Iris centered */}
          <circle cx={123 + gazeDx} cy="162" r={irisRadius} fill={eye.irisColor} />
          <circle cx={123 + gazeDx} cy="162" r={irisRadius * 0.65} fill={eye.glowColor} opacity="0.75" />
          <circle cx={123 + gazeDx} cy="162" r={irisRadius * 0.42} fill="#09080A" />

          {/* Dual Specular Catchlights */}
          <circle cx={121.5 + gazeDx} cy="159.5" r="1.6" fill="#FFFFFF" />
          <circle cx={125.0 + gazeDx} cy="163.8" r="0.8" fill="#FFFFFF" opacity="0.85" />

          {/* Upper Lash Line */}
          <path
            d="M 103 162 Q 123 150 143 161"
            stroke="#161214"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {renderLashes('left')}
        </g>

        {/* Right Eye */}
        <g id="right_eye">
          {shadow.opacity > 0 && (
            <ellipse cx="197" cy="154" rx="20" ry="8" fill={shadow.color} opacity={shadow.opacity} />
          )}

          <path
            d={
              isHappy
                ? 'M 178 162 Q 197 152 216 162 Q 197 169 178 162 Z'
                : isNarrowed
                ? 'M 178 162 Q 197 155 216 162 Q 197 167 178 162 Z'
                : 'M 178 162 Q 197 151 216 162 Q 197 171 178 162 Z'
            }
            fill="#F8F6F2"
          />

          <path d="M 182 153 Q 197 148 212 153" stroke={skin.shadowColor} strokeWidth="1.2" fill="none" opacity="0.45" />

          <circle cx={197 + gazeDx} cy="162" r={irisRadius} fill={eye.irisColor} />
          <circle cx={197 + gazeDx} cy="162" r={irisRadius * 0.65} fill={eye.glowColor} opacity="0.75" />
          <circle cx={197 + gazeDx} cy="162" r={irisRadius * 0.42} fill="#09080A" />

          <circle cx={195.5 + gazeDx} cy="159.5" r="1.6" fill="#FFFFFF" />
          <circle cx={199.0 + gazeDx} cy="163.8" r="0.8" fill="#FFFFFF" opacity="0.85" />

          <path
            d="M 177 161 Q 197 150 217 162"
            stroke="#161214"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {renderLashes('right')}
        </g>

        {/* Sad Tear Drop */}
        {expression === 'sad' && (
          <ellipse cx="134" cy="178" rx="2.2" ry="4.5" fill="#BAE6FD" opacity="0.85" />
        )}

        {/* Inner eye corner highlight */}
        {hasHighlighter && (
          <g>
            <circle cx="104" cy="162" r="1.3" fill="#FFFBEB" opacity="0.9" />
            <circle cx="216" cy="162" r="1.3" fill="#FFFBEB" opacity="0.9" />
          </g>
        )}
      </g>
    );
  };

  // Mouth: Animated Talking Lip-Sync (3 frames when isTalking) + Expression states
  const renderLips = () => {
    // Lip-sync frames when talking
    if (isTalking && mouthFrame > 0) {
      if (mouthFrame === 2) {
        // Frame 2: Open mouth speaking
        return (
          <g id="mouth_talking_open" className="transition-all duration-100">
            <ellipse cx="160" cy="216" rx="9" ry="8" fill="#450A12" />
            <path d="M 152 211 Q 160 213 168 211 Q 160 215 152 211 Z" fill="#F8FAFC" />
            <path d="M 148 210 Q 160 207 172 210 Q 160 223 148 210 Z" fill={lip.base} opacity="0.9" />
            <path d="M 150 218 Q 160 226 170 218 Q 160 222 150 218 Z" fill={lip.base} />
          </g>
        );
      } else {
        // Frame 1 & 3: Half-open mouth
        return (
          <g id="mouth_talking_half" className="transition-all duration-100">
            <ellipse cx="160" cy="215" rx="7" ry="4.5" fill="#450A12" />
            <path d="M 147 212 Q 160 209 173 212 Q 160 218 147 212 Z" fill={lip.base} />
            <path d="M 149 216 Q 160 223 171 216 Q 160 220 149 216 Z" fill={lip.base} />
            {isGloss && (
              <ellipse cx="160" cy="220" rx="4" ry="1.4" fill={lip.highlight} opacity="0.8" />
            )}
          </g>
        );
      }
    }

    // Static expression mouths when not talking
    switch (expression) {
      case 'happy':
        return (
          <g id="mouth_happy" className="transition-all duration-300">
            <path d="M 144 213 Q 152 210 160 212 Q 168 210 176 213 Q 160 226 144 213 Z" fill={lip.base} />
            <path d="M 148 214 Q 160 217 172 214 Q 160 219 148 214 Z" fill="#F8FAFC" />
            <path d="M 146 216 Q 160 228 174 216 Q 160 221 146 216 Z" fill={lip.base} />
            {isGloss && <ellipse cx="160" cy="222" rx="5" ry="1.8" fill={lip.highlight} opacity="0.85" />}
          </g>
        );

      case 'flirty':
        return (
          <g id="mouth_flirty" className="transition-all duration-300">
            {/* Playful half-smile smirk */}
            <path d="M 146 214 Q 155 212 163 212 Q 172 210 178 210 Q 162 218 146 214 Z" fill={lip.base} />
            <path d="M 148 215 Q 163 224 176 212 Q 163 218 148 215 Z" fill={lip.base} />
            {isGloss && <ellipse cx="163" cy="219" rx="4.5" ry="1.6" fill={lip.highlight} opacity="0.9" />}
          </g>
        );

      case 'shocked':
      case 'scared':
        return (
          <g id="mouth_shocked" className="transition-all duration-300">
            <ellipse cx="160" cy="216" rx="7.5" ry="9" fill="#3D1016" />
            <path d="M 152 212 Q 160 209 168 212 Q 168 218 160 218 Q 152 218 152 212 Z" fill={lip.base} />
            <ellipse cx="160" cy="222" rx="5.5" ry="2.8" fill={lip.base} />
            {isGloss && <ellipse cx="160" cy="223" rx="3" ry="1" fill={lip.highlight} opacity="0.85" />}
          </g>
        );

      case 'angry':
      case 'jealous':
        return (
          <g id="mouth_angry" className="transition-all duration-300">
            <path d="M 145 215 Q 153 213 160 214 Q 167 213 175 215 Q 160 220 145 215 Z" fill={lip.base} />
            <path d="M 147 216 Q 160 222 173 216 Q 160 219 147 216 Z" fill={lip.base} />
            <line x1="145" y1="215" x2="175" y2="215" stroke="#4A141A" strokeWidth="1.2" />
          </g>
        );

      case 'sad':
        return (
          <g id="mouth_sad" className="transition-all duration-300">
            <path d="M 145 217 Q 152 214 160 215 Q 168 214 175 217 Q 160 222 145 217 Z" fill={lip.base} />
            <path d="M 147 218 Q 160 226 173 218 Q 160 220 147 218 Z" fill={lip.base} />
          </g>
        );

      case 'suspicious':
        return (
          <g id="mouth_suspicious" className="transition-all duration-300">
            {/* Subtle skeptical pursed lip */}
            <path d="M 146 216 Q 154 213 161 214 Q 170 215 176 213 Q 161 220 146 216 Z" fill={lip.base} />
            <path d="M 148 217 Q 161 223 174 216 Q 161 219 148 217 Z" fill={lip.base} />
          </g>
        );

      case 'neutral':
      default:
        return (
          <g id="mouth_neutral" className="transition-all duration-300">
            <path
              d="M 144 213 C 149 210, 154 209, 160 211 C 166 209, 171 210, 176 213 C 171 217, 165 218, 160 217 C 155 218, 149 217, 144 213 Z"
              fill={lip.base}
            />
            <path d="M 144 213 Q 160 216 176 213" stroke="#4A151D" strokeWidth="1.1" fill="none" opacity="0.8" />
            <path
              d="M 146 215 C 149 225, 171 225, 174 215 C 169 220, 151 220, 146 215 Z"
              fill={lip.base}
            />
            <path d="M 153 226 Q 160 228 167 226" stroke={skin.shadowColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

            {isGloss && (
              <g>
                <ellipse cx="158" cy="219.5" rx="4.5" ry="1.6" fill={lip.highlight} opacity="0.9" />
                <ellipse cx="164" cy="219.5" rx="3" ry="1.2" fill={lip.highlight} opacity="0.75" />
                <circle cx="160" cy="211.5" r="1" fill="#FFFFFF" opacity="0.9" />
              </g>
            )}
          </g>
        );
    }
  };

  // Laid baby hairs along the forehead hairline
  const renderBabyHairs = () => (
    <g id="baby_hairs" opacity="0.9">
      <path d="M 116 126 C 119 133, 125 133, 129 127" stroke={hair.primary} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M 136 118 C 141 123, 147 123, 150 118" stroke={hair.primary} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 170 118 C 173 123, 179 123, 184 118" stroke={hair.primary} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 191 127 C 195 133, 201 133, 204 126" stroke={hair.primary} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  );

  // Crown shine highlight across the top of skull
  const renderCrownHighlight = (ry = 12) => (
    <g id="crown_highlight">
      <ellipse cx="160" cy="46" rx="44" ry={ry} fill={hair.accent} opacity="0.42" />
      <ellipse cx="160" cy="42" rx="26" ry={ry * 0.55} fill="#FFFFFF" opacity="0.25" />
    </g>
  );

  // Hairstyles: complete skull coverage (at least 6% above skull, past temples), natural hairline & baby hairs
  const renderHairstyle = () => {
    switch (customization.hairstyle) {
      case 'knotless_braids':
        return (
          <g id="hair_knotless_braids">
            {/* Front cap fully covers top of skull up to y=22 and past temples (x=86 to 234) */}
            <path
              d="M 86 128 C 86 24, 120 22, 160 22 C 200 22, 234 24, 234 128 C 234 146, 226 165, 218 178 C 210 156, 202 136, 192 116 C 170 108, 150 108, 128 116 C 118 136, 110 156, 102 178 C 94 165, 86 146, 86 128 Z"
              fill={hair.primary}
            />
            {renderCrownHighlight(12)}
            {renderBabyHairs()}
            {/* Individual Knotless Braid Strands framing face outside eye boundaries */}
            {[
              { d: "M 86 150 C 80 205, 74 270, 72 390", w: 5.5 },
              { d: "M 94 145 C 88 210, 84 280, 82 390", w: 6 },
              { d: "M 102 140 C 98 205, 94 280, 92 390", w: 6 },
              { d: "M 234 150 C 240 205, 246 270, 248 390", w: 5.5 },
              { d: "M 226 145 C 232 210, 236 280, 238 390", w: 6 },
              { d: "M 218 140 C 222 205, 226 280, 228 390", w: 6 },
            ].map((braid, i) => (
              <g key={`b_${i}`}>
                <path d={braid.d} stroke={hair.primary} strokeWidth={braid.w} strokeLinecap="round" fill="none" />
                <path d={braid.d} stroke={hair.accent} strokeWidth={braid.w * 0.4} strokeDasharray="3 3" fill="none" opacity="0.8" />
              </g>
            ))}
            <rect x="79" y="235" width="6" height="5" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
            <rect x="235" y="245" width="6" height="5" rx="1" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
          </g>
        );

      case 'box_braids':
        return (
          <g id="hair_box_braids">
            {/* Front cap fully covers skull up to y=22 and past temples */}
            <path
              d="M 86 128 C 86 24, 120 22, 160 22 C 200 22, 234 24, 234 128 C 234 150, 228 178, 220 196 C 212 176, 204 142, 194 116 C 172 108, 148 108, 126 116 C 116 142, 108 176, 100 196 C 92 178, 86 150, 86 128 Z"
              fill={hair.primary}
            />
            {renderCrownHighlight(12)}
            {renderBabyHairs()}
            {/* Box braid scalp division lines */}
            <line x1="160" y1="28" x2="160" y2="114" stroke={hair.accent} strokeWidth="1.2" opacity="0.45" />
            <line x1="120" y1="68" x2="200" y2="68" stroke={hair.accent} strokeWidth="1" opacity="0.35" />
            {[
              { d: "M 92 165 C 80 225, 72 295, 68 390", w: 7 },
              { d: "M 104 155 C 94 225, 88 300, 84 390", w: 7.5 },
              { d: "M 228 165 C 240 225, 248 295, 252 390", w: 7 },
              { d: "M 216 155 C 226 225, 232 300, 236 390", w: 7.5 },
            ].map((braid, i) => (
              <g key={`box_${i}`}>
                <path d={braid.d} stroke={hair.primary} strokeWidth={braid.w} strokeLinecap="round" fill="none" />
                <path d={braid.d} stroke={hair.accent} strokeWidth={braid.w * 0.4} strokeDasharray="4 3" fill="none" opacity="0.8" />
              </g>
            ))}
            <circle cx="76" cy="260" r="3.5" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="244" cy="260" r="3.5" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          </g>
        );

      case 'cornrows':
        return (
          <g id="hair_cornrows">
            {/* Front cap fully covers skull up to y=22 and past temples */}
            <path
              d="M 86 128 C 86 24, 120 22, 160 22 C 200 22, 234 24, 234 128 C 234 148, 224 170, 214 182 C 206 156, 198 138, 188 116 C 168 110, 152 110, 132 116 C 122 138, 114 156, 106 182 C 96 170, 86 148, 86 128 Z"
              fill={hair.primary}
            />
            {renderCrownHighlight(11)}
            {renderBabyHairs()}
            {/* Sleek Row Tracks going up over crown */}
            {[
              "M 160 116 C 160 85, 160 55, 160 26",
              "M 144 118 C 142 90, 138 60, 134 30",
              "M 130 122 C 126 95, 118 68, 110 40",
              "M 176 118 C 178 90, 182 60, 186 30",
              "M 190 122 C 194 95, 202 68, 210 40",
            ].map((track, i) => (
              <path key={`cr_${i}`} d={track} stroke={hair.accent} strokeWidth="3" strokeDasharray="3 2" fill="none" />
            ))}
            <path d="M 96 160 C 88 215, 82 280, 78 360" stroke={hair.primary} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 224 160 C 232 215, 238 280, 242 360" stroke={hair.primary} strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'natural_afro':
        return (
          <g id="hair_natural_afro">
            {/* Voluminous Afro Crown extends well above skull up to y=6 and wide across temples */}
            <path
              d="M 76 158 C 42 130, 32 70, 64 24 C 96 -14, 224 -14, 256 24 C 288 70, 278 130, 244 158 C 242 182, 222 200, 206 188 C 194 152, 186 132, 172 116 C 148 116, 132 132, 118 188 C 102 200, 78 182, 76 158 Z"
              fill={hair.primary}
            />
            {renderBabyHairs()}
            {/* Luminous Curls & Depth */}
            <circle cx="86" cy="74" r="34" fill={hair.accent} opacity="0.4" />
            <circle cx="160" cy="22" r="42" fill={hair.accent} opacity="0.45" />
            <circle cx="234" cy="74" r="34" fill={hair.accent} opacity="0.4" />
            <ellipse cx="160" cy="18" rx="52" ry="16" fill="#FFFFFF" opacity="0.22" />
          </g>
        );

      case 'bantu_knots':
        return (
          <g id="hair_bantu_knots">
            {/* Base skull cap covers skull up to y=22 and past temples */}
            <path
              d="M 86 128 C 86 24, 120 22, 160 22 C 200 22, 234 24, 234 128 C 234 150, 224 170, 216 180 C 204 156, 196 138, 188 116 C 168 110, 152 110, 132 116 C 124 138, 116 156, 104 180 C 96 170, 86 150, 86 128 Z"
              fill={hair.primary}
            />
            {renderCrownHighlight(12)}
            {renderBabyHairs()}
            {/* Sculpted Knots */}
            {[
              { x: 160, y: 28, r: 16 },
              { x: 120, y: 44, r: 15 },
              { x: 200, y: 44, r: 15 },
              { x: 92, y: 84, r: 14 },
              { x: 228, y: 84, r: 14 },
              { x: 132, y: 88, r: 15 },
              { x: 188, y: 88, r: 15 },
            ].map((k, idx) => (
              <g key={`knot_${idx}`}>
                <circle cx={k.x} cy={k.y} r={k.r} fill={hair.primary} stroke={hair.accent} strokeWidth="1.8" />
                <circle cx={k.x} cy={k.y} r={k.r * 0.6} fill={hair.accent} opacity="0.6" />
              </g>
            ))}
          </g>
        );

      case 'long_straight_wig':
        return (
          <g id="hair_long_straight">
            {/* Lace Front Skull Cap: covers crown cleanly and frames upper forehead */}
            <path
              d="M 84 126 C 84 22, 120 20, 160 20 C 200 20, 236 22, 236 126 C 224 126, 192 112, 160 106 C 128 112, 96 126, 84 126 Z"
              fill={hair.primary}
            />
            {/* Center Part Line */}
            <line x1="160" y1="22" x2="160" y2="106" stroke={hair.accent} strokeWidth="1.2" opacity="0.6" />
            {renderCrownHighlight(13)}
            {renderBabyHairs()}

            {/* Left Sleek Front Tress: frames side of face and falls over shoulder, leaves face open */}
            <path
              d="M 84 126 C 80 180, 74 270, 70 420 L 104 420 C 102 270, 100 180, 96 126 Z"
              fill={hair.primary}
            />
            <path d="M 88 160 C 86 230, 84 310, 82 400" stroke={hair.accent} strokeWidth="2.5" fill="none" opacity="0.6" />
            <path d="M 96 180 C 94 250, 92 330, 90 410" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.25" />

            {/* Right Sleek Front Tress: frames right side of face and falls over shoulder */}
            <path
              d="M 224 126 C 220 180, 218 270, 216 420 L 250 420 C 246 270, 240 180, 236 126 Z"
              fill={hair.primary}
            />
            <path d="M 232 160 C 234 230, 236 310, 238 400" stroke={hair.accent} strokeWidth="2.5" fill="none" opacity="0.6" />
            <path d="M 224 180 C 226 250, 228 330, 230 410" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.25" />
          </g>
        );

      case 'body_wave_wig':
        return (
          <g id="hair_body_wave">
            {/* Lace Front Cap with natural curved hairline */}
            <path
              d="M 82 126 C 80 20, 118 18, 160 18 C 202 18, 238 20, 238 126 C 224 126, 192 110, 160 106 C 128 110, 96 126, 82 126 Z"
              fill={hair.primary}
            />
            {/* Center Part */}
            <line x1="160" y1="20" x2="160" y2="106" stroke={hair.accent} strokeWidth="1.2" opacity="0.55" />
            {renderCrownHighlight(14)}
            {renderBabyHairs()}

            {/* Left Voluminous Body Wave Falls */}
            <path
              d="M 82 126 C 72 170, 84 220, 68 270 C 56 320, 74 370, 64 420 L 106 420 C 104 365, 96 315, 102 265 C 102 210, 96 160, 96 126 Z"
              fill={hair.primary}
            />
            <path d="M 76 175 Q 86 215 74 255 Q 64 295 80 345 Q 70 385 76 415" stroke={hair.accent} strokeWidth="4.5" fill="none" opacity="0.75" />
            <path d="M 82 220 Q 94 255 86 295" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.3" />

            {/* Right Voluminous Body Wave Falls */}
            <path
              d="M 224 126 C 224 160, 218 210, 218 265 C 224 315, 216 365, 214 420 L 256 420 C 246 370, 264 320, 252 270 C 236 220, 248 170, 238 126 Z"
              fill={hair.primary}
            />
            <path d="M 244 175 Q 234 215 246 255 Q 256 295 240 345 Q 250 385 244 415" stroke={hair.accent} strokeWidth="4.5" fill="none" opacity="0.75" />
            <path d="M 238 220 Q 226 255 234 295" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.3" />
          </g>
        );

      case 'bob_wig':
        return (
          <g id="hair_bob_wig">
            {/* Sleek Blunt Bob Cap */}
            <path
              d="M 82 126 C 82 22, 120 20, 160 20 C 200 20, 238 22, 238 126 C 224 126, 192 112, 160 108 C 128 112, 96 126, 82 126 Z"
              fill={hair.primary}
            />
            {/* Center Part */}
            <line x1="160" y1="22" x2="160" y2="108" stroke={hair.accent} strokeWidth="1.2" opacity="0.6" />
            {renderCrownHighlight(12)}
            {renderBabyHairs()}

            {/* Left Sleek Bob Wing: frames jawline cleanly, leaves face fully open */}
            <path
              d="M 82 126 C 76 160, 72 205, 78 250 C 86 254, 98 254, 104 246 C 102 205, 98 160, 96 126 Z"
              fill={hair.primary}
            />
            <path d="M 76 195 Q 92 200 102 195" stroke={hair.accent} strokeWidth="3" fill="none" opacity="0.65" />

            {/* Right Sleek Bob Wing: frames jawline cleanly, leaves face fully open */}
            <path
              d="M 224 126 C 222 160, 218 205, 216 246 C 222 254, 234 254, 242 250 C 248 205, 244 160, 238 126 Z"
              fill={hair.primary}
            />
            <path d="M 218 195 Q 228 200 244 195" stroke={hair.accent} strokeWidth="3" fill="none" opacity="0.65" />
          </g>
        );

      case 'curly_wig':
        return (
          <g id="hair_curly_wig">
            {/* Curly Wig Cap with natural hairline */}
            <path
              d="M 80 126 C 68 65, 92 16, 160 16 C 228 16, 252 65, 240 126 C 224 126, 194 112, 160 108 C 126 112, 96 126, 80 126 Z"
              fill={hair.primary}
            />
            {renderCrownHighlight(14)}
            {renderBabyHairs()}

            {/* Left Bouncy Curly Clusters */}
            <g id="curls_left">
              <path
                d="M 80 126 C 68 170, 60 240, 64 420 L 106 420 C 104 350, 96 240, 96 126 Z"
                fill={hair.primary}
              />
              {[
                { cx: 78, cy: 165, r: 12 },
                { cx: 72, cy: 210, r: 13 },
                { cx: 76, cy: 255, r: 12.5 },
                { cx: 70, cy: 300, r: 13 },
                { cx: 76, cy: 350, r: 13.5 },
                { cx: 72, cy: 395, r: 13 },
              ].map((c, i) => (
                <circle key={`lc_${i}`} cx={c.cx} cy={c.cy} r={c.r} stroke={hair.accent} strokeWidth="3" fill="none" opacity="0.75" />
              ))}
            </g>

            {/* Right Bouncy Curly Clusters */}
            <g id="curls_right">
              <path
                d="M 224 126 C 224 240, 216 350, 214 420 L 256 420 C 260 240, 252 170, 240 126 Z"
                fill={hair.primary}
              />
              {[
                { cx: 242, cy: 165, r: 12 },
                { cx: 248, cy: 210, r: 13 },
                { cx: 244, cy: 255, r: 12.5 },
                { cx: 250, cy: 300, r: 13 },
                { cx: 244, cy: 350, r: 13.5 },
                { cx: 248, cy: 395, r: 13 },
              ].map((c, i) => (
                <circle key={`rc_${i}`} cx={c.cx} cy={c.cy} r={c.r} stroke={hair.accent} strokeWidth="3" fill="none" opacity="0.75" />
              ))}
            </g>
          </g>
        );

      case 'deep_wave_wig':
        return (
          <g id="hair_deep_wave">
            {/* Deep Wave Cap with natural hairline */}
            <path
              d="M 82 126 C 82 22, 120 20, 160 20 C 200 20, 238 22, 238 126 C 224 126, 192 112, 160 108 C 128 112, 96 126, 82 126 Z"
              fill={hair.primary}
            />
            {/* Center Part */}
            <line x1="160" y1="22" x2="160" y2="108" stroke={hair.accent} strokeWidth="1.2" opacity="0.55" />
            {renderCrownHighlight(13)}
            {renderBabyHairs()}

            {/* Left Deep Wave Ripples */}
            <g id="deep_wave_left">
              <path
                d="M 82 126 C 76 170, 70 260, 68 420 L 104 420 C 102 260, 98 170, 96 126 Z"
                fill={hair.primary}
              />
              {[155, 190, 225, 260, 295, 330, 365, 400].map((y) => (
                <path key={`dw_l_${y}`} d={`M 76 ${y} Q 88 ${y + 8} 76 ${y + 16}`} stroke={hair.accent} strokeWidth="4" fill="none" opacity="0.8" />
              ))}
            </g>

            {/* Right Deep Wave Ripples */}
            <g id="deep_wave_right">
              <path
                d="M 224 126 C 222 170, 218 260, 216 420 L 252 420 C 250 260, 244 170, 238 126 Z"
                fill={hair.primary}
              />
              {[155, 190, 225, 260, 295, 330, 365, 400].map((y) => (
                <path key={`dw_r_${y}`} d={`M 244 ${y} Q 232 ${y + 8} 244 ${y + 16}`} stroke={hair.accent} strokeWidth="4" fill="none" opacity="0.8" />
              ))}
            </g>
          </g>
        );

      default:
        return null;
    }
  };

  // Outfits: grounded waist-up, filling the bottom frame
  const renderOutfit = () => {
    switch (customization.outfit) {
      case 'casual':
        return (
          <g id="outfit_casual">
            <path d="M 116 265 Q 160 295 204 265 L 232 315 L 254 420 L 66 420 L 88 315 Z" fill="#1E3A5F" />
            <path d="M 120 305 Q 160 328 200 305" stroke="#0F1E33" strokeWidth="2.5" fill="none" opacity="0.4" />
            <text x="160" y="338" fill="#F8FAFC" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="3">
              LAU
            </text>
          </g>
        );

      case 'corporate':
        return (
          <g id="outfit_corporate">
            <path d="M 132 258 L 188 258 L 176 335 L 144 335 Z" fill="#F8FAFC" />
            <path d="M 102 262 L 132 340 L 88 420 L 56 420 L 74 300 Z" fill="#1E293B" />
            <path d="M 218 262 L 188 340 L 232 420 L 264 420 L 246 300 Z" fill="#1E293B" />
            <path d="M 102 262 L 144 340 L 136 340 L 96 275 Z" fill="#0F172A" />
            <path d="M 218 262 L 176 340 L 184 340 L 224 275 Z" fill="#0F172A" />
          </g>
        );

      case 'ankara':
        return (
          <g id="outfit_ankara">
            <path d="M 118 262 C 136 278, 148 278, 160 270 C 172 278, 184 278, 202 262 L 238 310 L 256 420 L 64 420 L 82 310 Z" fill="#D97706" />
            <circle cx="120" cy="345" r="16" fill="#DC2626" />
            <circle cx="200" cy="345" r="16" fill="#DC2626" />
            <circle cx="160" cy="385" r="18" fill="#1E40AF" />
            <path d="M 90 330 Q 160 365 230 330" stroke="#FDE047" strokeWidth="3" fill="none" opacity="0.8" />
          </g>
        );

      case 'party_dress':
        return (
          <g id="outfit_party">
            <line x1="126" y1="255" x2="126" y2="276" stroke="#D1D5DB" strokeWidth="1.8" />
            <line x1="194" y1="255" x2="194" y2="276" stroke="#D1D5DB" strokeWidth="1.8" />
            <path d="M 120 276 Q 160 295 200 276 L 226 330 L 246 420 L 74 420 L 94 330 Z" fill="#064E3B" />
            <path d="M 128 310 Q 160 326 192 310" stroke="#34D399" strokeWidth="3" fill="none" opacity="0.65" />
          </g>
        );

      case 'hoodie':
        return (
          <g id="outfit_hoodie">
            <path d="M 108 258 Q 160 290 212 258 L 240 320 L 258 420 L 62 420 L 80 320 Z" fill="#B45309" />
            <path d="M 120 254 C 138 288, 182 288, 200 254 Z" fill="#92400E" />
            <line x1="148" y1="280" x2="148" y2="318" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="172" y1="280" x2="172" y2="312" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'native_lace':
        return (
          <g id="outfit_native_lace">
            <path d="M 114 262 Q 160 286 206 262 L 236 320 L 256 420 L 64 420 L 84 320 Z" fill="#7E22CE" />
            {[118, 132, 146, 160, 174, 188, 202].map((x) => (
              <circle key={`l_${x}`} cx={x} cy="274" r="4.5" fill="none" stroke="#FDE047" strokeWidth="1.4" />
            ))}
          </g>
        );

      default:
        return null;
    }
  };

  const renderEarrings = () => {
    switch (customization.earrings) {
      case 'studs':
        return (
          <g id="earrings_studs">
            <circle cx="102" cy="180" r="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="218" cy="180" r="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
        );
      case 'hoops':
        return (
          <g id="earrings_hoops">
            <ellipse cx="100" cy="188" rx="5" ry="10" fill="none" stroke="#F59E0B" strokeWidth="2.4" />
            <ellipse cx="220" cy="188" rx="5" ry="10" fill="none" stroke="#F59E0B" strokeWidth="2.4" />
          </g>
        );
      case 'drops':
        return (
          <g id="earrings_drops">
            <circle cx="101" cy="180" r="1.6" fill="#D1D5DB" />
            <line x1="101" y1="181" x2="101" y2="188" stroke="#D1D5DB" strokeWidth="1.2" />
            <ellipse cx="101" cy="193" rx="4" ry="6" fill="#FDFEFE" stroke="#E2E8F0" strokeWidth="0.9" />

            <circle cx="219" cy="180" r="1.6" fill="#D1D5DB" />
            <line x1="219" y1="181" x2="219" y2="188" stroke="#D1D5DB" strokeWidth="1.2" />
            <ellipse cx="219" cy="193" rx="4" ry="6" fill="#FDFEFE" stroke="#E2E8F0" strokeWidth="0.9" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  const renderNecklace = () => {
    switch (customization.necklace) {
      case 'thin_chain':
        return <path d="M 134 252 Q 160 274 186 252" stroke="#F59E0B" strokeWidth="1.6" fill="none" />;
      case 'pendant':
        return (
          <g>
            <path d="M 132 252 Q 160 278 188 252" stroke="#F59E0B" strokeWidth="1.6" fill="none" />
            <circle cx="160" cy="272" r="3.5" fill="#E11D48" stroke="#F59E0B" strokeWidth="1.2" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 320 420"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${customization.name} visual novel character portrait`}
    >
      <defs>
        <linearGradient id={`${uniqueId}_skin`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skin.highlightColor} />
          <stop offset="60%" stopColor={skin.baseColor} />
          <stop offset="100%" stopColor={skin.shadowColor} />
        </linearGradient>

        <linearGradient id={`${uniqueId}_neck`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skin.shadowColor} />
          <stop offset="100%" stopColor={skin.baseColor} />
        </linearGradient>

        <radialGradient id={`${uniqueId}_blush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isBlushing ? '#E11D48' : blush.color} stopOpacity={isBlushing ? 0.65 : blush.opacity} />
          <stop offset="100%" stopColor={isBlushing ? '#E11D48' : blush.color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Back layer hair behind head and neck */}
      {(() => {
        switch (customization.hairstyle) {
          case 'natural_afro':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 72 160 C 38 130, 26 70, 60 20 C 94 -16, 226 -16, 260 20 C 294 70, 282 130, 248 160 C 246 220, 220 280, 210 320 L 110 320 C 100 280, 74 220, 72 160 Z"
                  fill={hair.primary}
                />
              </g>
            );
          case 'bob_wig':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 80 120 C 80 26, 240 26, 240 120 C 252 170, 252 230, 246 265 L 74 265 C 68 230, 68 170, 80 120 Z"
                  fill={hair.primary}
                />
              </g>
            );
          case 'cornrows':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 88 90 C 88 24, 232 24, 232 90 C 242 160, 246 270, 248 380 L 72 380 C 74 270, 78 160, 88 90 Z"
                  fill={hair.primary}
                />
              </g>
            );
          case 'bantu_knots':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 88 90 C 88 24, 232 24, 232 90 C 238 140, 236 180, 230 205 L 90 205 C 84 180, 82 140, 88 90 Z"
                  fill={hair.primary}
                />
              </g>
            );
          case 'body_wave_wig':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 80 80 C 80 18, 240 18, 240 80 C 265 150, 275 280, 278 420 L 42 420 C 45 280, 55 150, 80 80 Z"
                  fill={hair.primary}
                />
              </g>
            );
          case 'curly_wig':
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 76 80 C 50 40, 80 14, 160 14 C 240 14, 270 40, 244 80 C 270 160, 278 280, 280 420 L 40 420 C 42 280, 50 160, 76 80 Z"
                  fill={hair.primary}
                />
              </g>
            );
          default:
            return (
              <g id="back_hair" opacity="0.95">
                <path
                  d="M 84 90 C 84 20, 236 20, 236 90 C 254 180, 266 300, 270 420 L 50 420 C 54 300, 66 180, 84 90 Z"
                  fill={hair.primary}
                />
              </g>
            );
        }
      })()}

      {/* Grounded shoulders & bust: fills lower screen down to 420 */}
      <path
        d="M 84 320 C 98 280, 122 250, 140 244 L 140 216 L 180 216 L 180 244 C 198 250, 222 280, 236 320 L 254 420 L 66 420 Z"
        fill={`url(#${uniqueId}_skin)`}
      />

      {/* Collarbones */}
      <path d="M 126 256 Q 148 264 156 260" stroke={skin.shadowColor} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 164 260 Q 172 264 194 256" stroke={skin.shadowColor} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Outfit */}
      {renderOutfit()}

      {/* Necklace */}
      {renderNecklace()}

      {/* Shortened slim neck (40% shorter, connects at 210 to 238) */}
      <path
        d="M 142 195 L 142 240 C 150 246, 170 246, 178 240 L 178 195 Z"
        fill={`url(#${uniqueId}_neck)`}
      />
      <path d="M 140 196 Q 160 212 180 196" stroke={skin.shadowColor} strokeWidth="2.8" fill="none" opacity="0.45" />

      <g transform={scaleAround(160, 150, faceW, 1)}>
      {/* Ears */}
      <ellipse cx="102" cy="168" rx="7.5" ry="12.5" fill={skin.baseColor} />
      <ellipse cx="218" cy="168" rx="7.5" ry="12.5" fill={skin.baseColor} />

      {/* Head: shape varies per character (Ada: soft oval) */}
      <path d={HEAD_PATHS[headShape]} fill={`url(#${uniqueId}_skin)`} />

      {/* Soft Cheek Blush (smooth fade-in when blushing) */}
      {(blush.opacity > 0 || isBlushing) && (
        <g className="transition-opacity duration-300">
          <ellipse cx="118" cy="178" rx="17" ry="10.5" fill={`url(#${uniqueId}_blush)`} />
          <ellipse cx="202" cy="178" rx="17" ry="10.5" fill={`url(#${uniqueId}_blush)`} />
        </g>
      )}

      {/* Glowing Highlighter */}
      {hasHighlighter && (
        <g>
          <ellipse cx="115" cy="166" rx="9" ry="3.5" fill={skin.highlightColor} opacity="0.7" />
          <ellipse cx="205" cy="166" rx="9" ry="3.5" fill={skin.highlightColor} opacity="0.7" />
          <ellipse cx="160" cy="164" rx="2.2" ry="9" fill={skin.highlightColor} opacity="0.55" />
          <circle cx="160" cy="192" r="2.4" fill="#FFFFFF" opacity="0.8" />
        </g>
      )}
      </g>

      {/* Small refined nose with soft highlight */}
      <g id="nose" transform={scaleAround(160, 192, face?.noseWidth ?? 1, 1)}>
        <path d="M 158 155 Q 156 178 152 191" stroke={skin.shadowColor} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M 148 196 Q 160 200 172 196" stroke={skin.shadowColor} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75" />
        <circle cx="152" cy="195" r="1.5" fill={skin.shadowColor} opacity="0.55" />
        <circle cx="168" cy="195" r="1.5" fill={skin.shadowColor} opacity="0.55" />
        <circle cx="160" cy="192" r="2.2" fill={skin.highlightColor} opacity="0.7" />
      </g>

      {/* Eyes & Eyebrows */}
      <g transform={scaleAround(160, 158, face?.eyeScale ?? 1)}>{renderEyes()}</g>
      <g transform={face?.browLift ? `translate(0 ${-face.browLift})` : undefined}>
        <g transform={scaleAround(160, 150, face?.eyeScale ?? 1, 1)}>{renderEyebrows()}</g>
      </g>

      {/* Plump Glossy Lips (animated on speech) */}
      <g transform={scaleAround(160, 215, face?.lipScale ?? 1)}>{renderLips()}</g>

      {/* Signature face details */}
      {marks.includes('mole') && <circle cx="183" cy="202" r="2.2" fill="#1A0F0A" opacity="0.85" />}
      {marks.includes('dimples') && (
        <g stroke={skin.shadowColor} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55">
          <path d="M 135 214 Q 133 219 136 223" />
          <path d="M 185 214 Q 187 219 184 223" />
        </g>
      )}
      {marks.includes('freckles') && (
        <g fill={skin.shadowColor} opacity="0.7">
          {[
            [128, 180], [134, 186], [140, 181], [124, 188], [146, 186], [131, 193],
            [192, 180], [186, 186], [180, 181], [196, 188], [174, 186], [189, 193],
            [154, 176], [166, 176], [160, 182],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.1} />
          ))}
        </g>
      )}
      {face?.glasses && (
        <g transform={scaleAround(160, 158, face?.eyeScale ?? 1)} fill="#FFFFFF" fillOpacity="0.08" stroke="#141014" strokeWidth="2.4">
          {face.glasses === 'cat' ? (
            <>
              <path d="M 100 152 Q 104 145 124 146 Q 142 147 146 152 Q 146 168 124 171 Q 102 168 100 152 Z" />
              <path d="M 220 152 Q 216 145 196 146 Q 178 147 174 152 Q 174 168 196 171 Q 218 168 220 152 Z" />
            </>
          ) : (
            <>
              <circle cx="123" cy="158" r="17" />
              <circle cx="197" cy="158" r="17" />
            </>
          )}
          <path d="M 146 154 Q 160 149 174 154" fill="none" />
          <path d="M 100 152 L 92 150" fill="none" />
          <path d="M 220 152 L 228 150" fill="none" />
        </g>
      )}

      {/* Earrings */}
      {renderEarrings()}

      {/* Front Hairstyle (Natural seamless hairline, no bands) */}
      {renderHairstyle()}

      {/* Silk headwrap (turban) over the hair */}
      {face?.headwrap && (
        <g>
          <path
            d="M 90 116 C 80 64, 108 22, 160 20 C 212 22, 240 64, 230 116 C 216 98, 196 90, 160 90 C 124 90, 104 98, 90 116 Z"
            fill={face.headwrap}
          />
          <path d="M 104 92 C 124 70, 196 70, 216 92" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="5" fill="none" />
          <path d="M 98 74 C 126 46, 194 46, 222 74" stroke="#000000" strokeOpacity="0.18" strokeWidth="4" fill="none" />
          <path d="M 140 24 C 150 44, 170 44, 180 24 C 176 50, 144 50, 140 24 Z" fill={face.headwrap} stroke="#000000" strokeOpacity="0.2" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
