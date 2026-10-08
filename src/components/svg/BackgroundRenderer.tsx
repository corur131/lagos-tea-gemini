import React from 'react';
import { LocationType, TimeModifier } from '../../types/vn';

interface BackgroundRendererProps {
  location: LocationType;
  timeModifier?: TimeModifier;
  className?: string;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  location,
  timeModifier = 'day',
  className = 'w-full h-full object-cover',
}) => {
  const isNight = timeModifier === 'night';
  const isBlackout = timeModifier === 'blackout_generator';

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 600 450"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dynamic Gradients */}
          <linearGradient id="ajegunle_sky_day" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>

          <linearGradient id="banana_pool_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="rooftop_sunset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4C0519" />
            <stop offset="35%" stopColor="#BE123C" />
            <stop offset="70%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          <linearGradient id="mall_skylight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>

          <linearGradient id="beach_water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>

          <linearGradient id="bridge_neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Render Location-Specific SVG Background */}
        {renderSceneLocation(location, isNight, isBlackout)}

        {/* Global Atmospheric Night Overlay */}
        {isNight && (
          <rect width="600" height="450" fill="#0B1021" opacity="0.38" />
        )}
        {isBlackout && (
          <g>
            <rect width="600" height="450" fill="#09090B" opacity="0.75" />
            <circle cx="500" cy="380" r="200" fill="#F59E0B" opacity="0.25" />
            <circle cx="140" cy="320" r="140" fill="#FEF08A" opacity="0.18" />
          </g>
        )}
      </svg>
    </div>
  );
};

function renderSceneLocation(
  location: LocationType,
  isNight: boolean,
  isBlackout: boolean
) {
  switch (location) {
    case 'ajegunle_apartment':
      return renderAjegunleApartment(isNight, isBlackout);
    case 'banana_island_mansion':
      return renderBananaIslandMansion(isNight);
    case 'rooftop_party':
      return renderRooftopParty(isNight);
    case 'mall':
      return renderMall(isNight);
    case 'university_campus':
      return renderUniversityCampus(isNight);
    case 'beach_house':
      return renderBeachHouse(isNight);
    case 'photoshoot_studio':
      return renderPhotoshootStudio(isNight);
    case 'night_street':
      return renderNightStreet(isNight);
    default:
      return renderAjegunleApartment(isNight, isBlackout);
  }
}

/* 1. AJEGUNLE APARTMENT (Ada's Modest Room) */
function renderAjegunleApartment(isNight: boolean, isBlackout: boolean) {
  const wallFill = isNight || isBlackout ? '#1F2937' : '#FDE68A';
  const floorFill = isNight || isBlackout ? '#111827' : '#92400E';

  return (
    <g id="bg_ajegunle_apartment">
      {/* Wall */}
      <rect width="600" height="340" fill={wallFill} />
      {/* Floor */}
      <polygon points="0,340 600,340 600,450 0,450" fill={floorFill} />
      {/* Floor linoleum lines */}
      <line x1="100" y1="340" x2="50" y2="450" stroke="#000000" strokeWidth="0.8" opacity="0.25" />
      <line x1="260" y1="340" x2="220" y2="450" stroke="#000000" strokeWidth="0.8" opacity="0.25" />
      <line x1="420" y1="340" x2="430" y2="450" stroke="#000000" strokeWidth="0.8" opacity="0.25" />

      {/* Window looking out onto Ajegunle rooftops & electric cables */}
      <rect x="360" y="45" width="180" height="180" fill={isNight ? '#0B132B' : 'url(#ajegunle_sky_day)'} stroke="#4B5563" strokeWidth="8" />
      {/* Iron burglar-proof bars */}
      {[390, 420, 450, 480, 510].map((x) => (
        <line key={`iron_bar_${x}`} x1={x} y1="45" x2={x} y2="225" stroke="#1F2937" strokeWidth="3" />
      ))}
      <line x1="360" y1="135" x2="540" y2="135" stroke="#1F2937" strokeWidth="4" />
      {/* Roof silhouetted outside */}
      <polygon points="370,180 440,140 510,180 540,225 360,225" fill={isNight ? '#030712' : '#B45309'} opacity="0.6" />
      {/* Tangled overhead power cables */}
      <path d="M 360 80 Q 450 110 540 85" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M 360 95 Q 460 135 540 100" stroke="#1E293B" strokeWidth="1.2" fill="none" />

      {/* Colorful Ankara Curtain tied to left */}
      <path d="M 345 40 Q 375 120 350 240 L 330 240 Q 320 120 340 40 Z" fill="#DC2626" />
      <path d="M 342 40 Q 365 120 348 240" stroke="#FBBF24" strokeWidth="4" strokeDasharray="6 4" fill="none" />

      {/* Desk with laptop and study books */}
      <rect x="50" y="270" width="220" height="15" fill="#78350F" />
      <rect x="65" y="285" width="12" height="100" fill="#451A03" />
      <rect x="240" y="285" width="12" height="100" fill="#451A03" />
      {/* Laptop opened */}
      <polygon points="120,270 180,270 190,265 130,265" fill="#9CA3AF" />
      <rect x="125" y="220" width="55" height="45" rx="2" fill={isNight ? '#38BDF8' : '#F3F4F6'} stroke="#4B5563" strokeWidth="2" />
      {/* Textbooks stacked */}
      <rect x="70" y="255" width="40" height="15" rx="1" fill="#2563EB" />
      <rect x="72" y="243" width="36" height="12" rx="1" fill="#059669" />

      {/* Standing Fan in corner */}
      <circle cx="300" cy="210" r="32" fill="none" stroke="#6B7280" strokeWidth="3" />
      <line x1="300" y1="242" x2="300" y2="350" stroke="#4B5563" strokeWidth="4" />
      <polygon points="280,350 320,350 300,340" fill="#374151" />
    </g>
  );
}

/* 2. BANANA ISLAND MANSION (Billionaire Island Living Room & Pool View) */
function renderBananaIslandMansion(isNight: boolean) {
  return (
    <g id="bg_banana_island_mansion">
      {/* Giant Floor-to-Ceiling Glass Lagoon/Pool Backdrop */}
      <rect width="600" height="280" fill={isNight ? '#0F172A' : '#7DD3FC'} />
      {/* Infinity Pool & Lagos Lagoon Water */}
      <rect x="0" y="160" width="600" height="120" fill="url(#banana_pool_grad)" opacity={isNight ? 0.9 : 0.8} />
      {/* Distant yachts & palms */}
      <path d="M 460 170 L 485 160 L 510 170 Z" fill={isNight ? '#1E293B' : '#FFFFFF'} />
      <path d="M 485 160 L 485 140" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M 80 180 Q 70 110 50 80 Q 90 90 110 110" stroke="#047857" strokeWidth="3" fill="none" />

      {/* Double-Height Glass Mullions */}
      {[120, 240, 360, 480].map((x) => (
        <line key={`mullion_${x}`} x1={x} y1="0" x2={x} y2="280" stroke={isNight ? '#1E293B' : '#E2E8F0'} strokeWidth="5" />
      ))}

      {/* Ultra-luxe Polished Ivory Marble Floor */}
      <polygon points="0,280 600,280 600,450 0,450" fill={isNight ? '#1E1B2E' : '#F8FAFC'} />
      {/* Marble veining */}
      <path d="M 50 330 Q 180 370 280 350 Q 420 390 560 360" stroke={isNight ? '#4C1D95' : '#E2E8F0'} strokeWidth="1.8" fill="none" opacity="0.6" />
      <path d="M 120 400 Q 300 420 480 390" stroke={isNight ? '#3B0764' : '#CBD5E1'} strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* Contemporary Curved Cream Velvet Sofa */}
      <path
        d="M 140 330 C 160 290, 440 290, 460 330 C 470 370, 440 390, 400 390 L 200 390 C 160 390, 130 370, 140 330 Z"
        fill={isNight ? '#33273D' : '#F1F5F9'}
        stroke={isNight ? '#581C87' : '#CBD5E1'}
        strokeWidth="2"
      />
      {/* Gold designer throw pillows */}
      <rect x="170" y="325" width="34" height="34" rx="6" fill="#F59E0B" transform="rotate(15, 187, 342)" />
      <rect x="395" y="325" width="34" height="34" rx="6" fill="#059669" transform="rotate(-15, 412, 342)" />

      {/* Crystal Golden Chandelier */}
      <line x1="300" y1="0" x2="300" y2="40" stroke="#F59E0B" strokeWidth="3" />
      <ellipse cx="300" cy="50" rx="60" ry="15" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
      <ellipse cx="300" cy="70" rx="40" ry="10" fill="none" stroke="#FBBF24" strokeWidth="2" />
      {[250, 275, 300, 325, 350].map((cx) => (
        <line key={`crystal_${cx}`} x1={cx} y1="50" x2={cx} y2="85" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="3 2" />
      ))}
    </g>
  );
}

/* 3. ROOFTOP PARTY (Lagos Skyline VIP Lounge & Sunset/Nightlife) */
function renderRooftopParty(isNight: boolean) {
  return (
    <g id="bg_rooftop_party">
      {/* Sunset or Night Sky */}
      <rect width="600" height="260" fill={isNight ? '#090514' : 'url(#rooftop_sunset)'} />

      {/* Lagos City Towers Silhouettes */}
      <polygon points="40,260 40,160 80,160 80,260" fill={isNight ? '#1E1B4B' : '#881337'} />
      <polygon points="90,260 90,110 145,110 145,260" fill={isNight ? '#1E1B4B' : '#701A75'} />
      <polygon points="160,260 160,140 220,140 220,260" fill={isNight ? '#311042' : '#831843'} />
      <polygon points="420,260 420,130 470,130 470,260" fill={isNight ? '#1E1B4B' : '#701A75'} />
      <polygon points="490,260 490,90 560,90 560,260" fill={isNight ? '#311042' : '#881337'} />
      {/* Skyscraper windows */}
      {[100, 115, 130].map((wx) =>
        [130, 150, 170, 190, 210].map((wy) => (
          <rect key={`win_${wx}_${wy}`} x={wx} y={wy} width="6" height="8" fill="#FDE047" opacity={isNight ? 0.8 : 0.4} />
        ))
      )}

      {/* Rooftop Wooden Decking */}
      <polygon points="0,260 600,260 600,450 0,450" fill={isNight ? '#1C1917' : '#78350F'} />
      {[280, 310, 340, 370, 400, 430].map((dy) => (
        <line key={`deck_${dy}`} x1="0" y1={dy} x2="600" y2={dy} stroke="#0C0A09" strokeWidth="1.2" opacity="0.4" />
      ))}

      {/* Glass Balustrade Edge */}
      <rect x="0" y="240" width="600" height="20" fill={isNight ? '#38BDF8' : '#E0F2FE'} opacity="0.4" stroke="#64748B" strokeWidth="1" />
      {[60, 150, 240, 330, 420, 510].map((bx) => (
        <line key={`bal_${bx}`} x1={bx} y1="240" x2={bx} y2="260" stroke="#94A3B8" strokeWidth="2" />
      ))}

      {/* String Fairy Lights overhead */}
      <path d="M 0 30 Q 150 90 300 40 Q 450 90 600 30" stroke="#FDE047" strokeWidth="1" fill="none" />
      {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550].map((lx, idx) => (
        <circle key={`light_${idx}`} cx={lx} cy={50 + Math.sin(idx * 0.5) * 15} r="4.5" fill="#FEF08A" />
      ))}

      {/* Glowing VIP Cocktail Bar on Left */}
      <rect x="20" y="290" width="140" height="70" rx="6" fill={isNight ? '#A21CAF' : '#F43F5E'} opacity="0.85" />
      <rect x="25" y="295" width="130" height="10" rx="3" fill="#FDF4FF" />
      {/* Cocktail bottles */}
      <rect x="40" y="275" width="8" height="20" rx="1" fill="#34D399" />
      <rect x="55" y="270" width="8" height="25" rx="1" fill="#F59E0B" />
      <rect x="70" y="278" width="8" height="17" rx="1" fill="#EC4899" />
    </g>
  );
}

/* 4. MALL (Lekki Palms Luxury Designer Atrium) */
function renderMall(isNight: boolean) {
  return (
    <g id="bg_mall">
      {/* Atrium Architecture & Glass Skylight Dome */}
      <rect width="600" height="240" fill={isNight ? '#1E1B2E' : '#F1F5F9'} />
      {/* Glass dome frame */}
      <path d="M 150 0 Q 300 120 450 0" stroke={isNight ? '#4C1D95' : '#38BDF8'} strokeWidth="6" fill="none" />
      <path d="M 220 0 Q 300 80 380 0" stroke={isNight ? '#6D28D9' : '#0284C7'} strokeWidth="4" fill="none" />
      <line x1="300" y1="0" x2="300" y2="100" stroke={isNight ? '#6D28D9' : '#0284C7'} strokeWidth="3" />

      {/* Upper Floor Balcony & Glass Railings */}
      <rect x="0" y="100" width="600" height="22" fill="#E2E8F0" />
      <rect x="0" y="80" width="600" height="20" fill="#38BDF8" opacity="0.3" stroke="#94A3B8" strokeWidth="1" />
      {/* Boutique storefront signs on upper floor */}
      <rect x="40" y="45" width="100" height="28" rx="3" fill="#0F172A" />
      <text x="55" y="64" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="sans-serif">GUCCI</text>
      <rect x="460" y="45" width="100" height="28" rx="3" fill="#831843" />
      <text x="475" y="64" fill="#FDF2F8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DEOLA SAGE</text>

      {/* Central Escalators Crisscrossing */}
      <polygon points="180,122 320,260 290,260 150,122" fill="#64748B" />
      <polygon points="420,122 280,260 310,260 450,122" fill="#475569" />
      <line x1="180" y1="122" x2="320" y2="260" stroke="#F59E0B" strokeWidth="3" />

      {/* Gleaming Polished Ground Floor Tiles */}
      <polygon points="0,260 600,260 600,450 0,450" fill={isNight ? '#0F172A' : '#FAFAFA'} />
      {/* Diamond floor tile reflections */}
      <line x1="200" y1="260" x2="100" y2="450" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="400" y1="260" x2="500" y2="450" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="0" y1="350" x2="600" y2="350" stroke="#E2E8F0" strokeWidth="1" />

      {/* Ground Boutique Display Window (Right) */}
      <rect x="420" y="220" width="160" height="120" rx="4" fill="#18181B" stroke="#F59E0B" strokeWidth="2" />
      <rect x="470" y="240" width="22" height="60" rx="4" fill="#BE185D" />
      <ellipse cx="481" cy="235" rx="7" ry="8" fill="#FBCFE8" />
    </g>
  );
}

/* 5. UNIVERSITY CAMPUS (Lekki Private University Pavilion & Palms) */
function renderUniversityCampus(isNight: boolean) {
  return (
    <g id="bg_university_campus">
      {/* Sky */}
      <rect width="600" height="240" fill={isNight ? '#020617' : '#BAE6FD'} />

      {/* Ultra-Modern White & Glass Administration Building */}
      <polygon points="80,240 80,100 380,80 380,240" fill={isNight ? '#1E293B' : '#F8FAFC'} stroke="#CBD5E1" strokeWidth="2" />
      {/* Glass grid facade */}
      {[100, 130, 160, 190, 220].map((wy) => (
        <line key={`admin_h_${wy}`} x1="90" y1={wy} x2="370" y2={wy - 3} stroke={isNight ? '#38BDF8' : '#0284C7'} strokeWidth="1.5" opacity="0.6" />
      ))}
      {[140, 200, 260, 320].map((wx) => (
        <line key={`admin_v_${wx}`} x1={wx} y1="95" x2={wx} y2="240" stroke={isNight ? '#38BDF8' : '#0284C7'} strokeWidth="1.5" opacity="0.6" />
      ))}
      {/* University Crest Billboard */}
      <rect x="180" y="45" width="100" height="30" rx="4" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
      <text x="195" y="65" fill="#FEF08A" fontSize="9" fontWeight="bold" fontFamily="sans-serif">LEKKI ATLANTIC</text>

      {/* Royal Palms lining the pathway */}
      {[440, 520].map((px) => (
        <g key={`palm_${px}`}>
          <path d={`M ${px} 240 Q ${px - 15} 140 ${px} 70`} stroke="#78350F" strokeWidth="7" fill="none" />
          <path d={`M ${px} 70 Q ${px - 60} 50 ${px - 80} 80`} stroke="#047857" strokeWidth="3" fill="none" />
          <path d={`M ${px} 70 Q ${px + 60} 50 ${px + 80} 80`} stroke="#047857" strokeWidth="3" fill="none" />
          <path d={`M ${px} 70 Q ${px - 30} 20 ${px - 50} 30`} stroke="#059669" strokeWidth="3" fill="none" />
          <path d={`M ${px} 70 Q ${px + 30} 20 ${px + 50} 30`} stroke="#059669" strokeWidth="3" fill="none" />
        </g>
      ))}

      {/* Manicured Emerald Lawn & Walkways */}
      <polygon points="0,240 600,240 600,450 0,450" fill={isNight ? '#064E3B' : '#10B981'} />
      {/* Interlocking Pavers Diagonal Walkway */}
      <polygon points="0,380 280,240 360,240 200,450 0,450" fill={isNight ? '#334155' : '#E2E8F0'} />
      {/* Modern Bollard Lights */}
      {[60, 140, 220].map((bx) => (
        <g key={`bollard_${bx}`}>
          <rect x={bx} y={320 + bx * 0.2} width="8" height="24" rx="2" fill="#64748B" />
          <circle cx={bx + 4} cy={322 + bx * 0.2} r="4" fill={isNight ? '#FEF08A' : '#F1F5F9'} />
        </g>
      ))}
    </g>
  );
}

/* 6. BEACH HOUSE (Private Ilashe Beach House & Turquoise Ocean) */
function renderBeachHouse(isNight: boolean) {
  return (
    <g id="bg_beach_house">
      {/* Sky */}
      <rect width="600" height="200" fill={isNight ? '#0B132B' : '#7DD3FC'} />

      {/* Turquoise Ocean Waves */}
      <rect x="0" y="140" width="600" height="100" fill="url(#beach_water)" />
      {/* Breaking surf foam lines */}
      <path d="M 0 200 Q 150 190 300 200 Q 450 210 600 200" stroke="#F0FDFA" strokeWidth="4" fill="none" opacity="0.8" />
      <path d="M 0 220 Q 200 210 400 225 Q 550 215 600 220" stroke="#F0FDFA" strokeWidth="5" fill="none" opacity="0.6" />

      {/* Golden Sand Beach */}
      <polygon points="0,220 600,220 600,290 0,290" fill={isNight ? '#451A03' : '#FDE68A'} />

      {/* Elevated Bleached Wood Beach Deck */}
      <polygon points="0,280 600,280 600,450 0,450" fill={isNight ? '#292524' : '#E7E5E4'} />
      {[300, 330, 360, 390, 420].map((wy) => (
        <line key={`wood_${wy}`} x1="0" y1={wy} x2="600" y2={wy} stroke="#A8A29E" strokeWidth="1.5" />
      ))}

      {/* Private White Cabana Pavilion on Deck */}
      <rect x="360" y="180" width="180" height="15" fill="#FAFAFA" />
      <line x1="375" y1="195" x2="375" y2="330" stroke="#FFFFFF" strokeWidth="6" />
      <line x1="525" y1="195" x2="525" y2="330" stroke="#FFFFFF" strokeWidth="6" />
      {/* Flowing white sheer curtains */}
      <path d="M 375 195 Q 395 250 380 320 L 370 320 Z" fill="#F8FAFC" opacity="0.75" />
      <path d="M 525 195 Q 505 250 520 320 L 530 320 Z" fill="#F8FAFC" opacity="0.75" />

      {/* Bright Yellow Sun Loungers */}
      <polygon points="120,330 180,310 210,340 130,350" fill="#EAB308" />
      <polygon points="220,330 280,310 310,340 230,350" fill="#EAB308" />
    </g>
  );
}

/* 7. PHOTOSHOOT STUDIO (Ring Lights, Backdrops, Softboxes) */
function renderPhotoshootStudio(isNight: boolean) {
  return (
    <g id="bg_photoshoot_studio">
      {/* Studio Walls & Seamless Curved Backdrop */}
      <rect width="600" height="450" fill={isNight ? '#09090B' : '#18181B'} />

      {/* Seamless Cyclorama Paper Roll (Hot Pink / Coral or Electric Cyan) */}
      <path
        d="M 120 0 L 480 0 L 480 320 C 480 360, 440 380, 400 380 L 200 380 C 160 380, 120 360, 120 320 Z"
        fill={isNight ? '#BE185D' : '#EC4899'}
      />
      {/* Sweep shadow */}
      <ellipse cx="300" cy="370" rx="130" ry="22" fill="#000000" opacity="0.3" />

      {/* Professional Ring Light on Tripod (Left) */}
      <circle cx="90" cy="190" r="38" fill="none" stroke="#FFFFFF" strokeWidth="9" />
      <circle cx="90" cy="190" r="38" fill="none" stroke="#FDE047" strokeWidth="2" opacity="0.8" />
      <line x1="90" y1="228" x2="90" y2="380" stroke="#71717A" strokeWidth="4" />
      <line x1="90" y1="360" x2="60" y2="420" stroke="#71717A" strokeWidth="3" />
      <line x1="90" y1="360" x2="120" y2="420" stroke="#71717A" strokeWidth="3" />

      {/* Large Softbox Light on Stand (Right) */}
      <polygon points="500,120 560,150 560,250 500,220" fill="#F8FAFC" stroke="#3F3F46" strokeWidth="3" />
      <line x1="530" y1="235" x2="530" y2="390" stroke="#71717A" strokeWidth="4" />
      <line x1="530" y1="370" x2="495" y2="430" stroke="#71717A" strokeWidth="3" />
      <line x1="530" y1="370" x2="565" y2="430" stroke="#71717A" strokeWidth="3" />

      {/* Neon Sign on Wall */}
      <text
        x="220"
        y="60"
        fill="#F472B6"
        fontSize="18"
        fontWeight="bold"
        fontFamily="sans-serif"
        letterSpacing="3"
        filter="drop-shadow(0 0 8px #EC4899)"
      >
        LAGOS TEA VIP
      </text>

      {/* Wardrobe Rolling Rack in background */}
      <line x1="20" y1="180" x2="80" y2="180" stroke="#D4D4D8" strokeWidth="3" />
      <line x1="20" y1="180" x2="20" y2="310" stroke="#71717A" strokeWidth="3" />
      <line x1="80" y1="180" x2="80" y2="310" stroke="#71717A" strokeWidth="3" />
      {/* Hanging dresses */}
      <polygon points="30,190 25,260 40,260 35,190" fill="#3B82F6" />
      <polygon points="45,190 40,270 55,270 50,190" fill="#EAB308" />
      <polygon points="60,190 55,265 70,265 65,190" fill="#10B981" />
    </g>
  );
}

/* 8. NIGHT STREET (Lekki-Ikoyi Link Bridge & Nightlife Lights) */
function renderNightStreet(isNight: boolean) {
  return (
    <g id="bg_night_street">
      {/* Deep Night Sky */}
      <rect width="600" height="260" fill={isNight ? '#05030A' : '#38BDF8'} />

      {/* Iconic Lekki-Ikoyi Link Bridge Pylon Tower */}
      <polygon points="280,260 295,40 305,40 320,260" fill={isNight ? '#1E1B4B' : '#E2E8F0'} stroke="#4C1D95" strokeWidth="2" />
      {/* Cable stays radiating down from pylon */}
      {[-80, -50, -20, 20, 50, 80].map((dx, idx) => (
        <g key={`cable_${idx}`}>
          <line x1="300" y1={70 + idx * 10} x2={200 + dx * 2} y2="260" stroke="#A855F7" strokeWidth="1.6" opacity="0.8" />
          <line x1="300" y1={70 + idx * 10} x2={400 + dx * 2} y2="260" stroke="#06B6D4" strokeWidth="1.6" opacity="0.8" />
        </g>
      ))}

      {/* Illuminated Billboards on Bridge approach */}
      <rect x="40" y="110" width="80" height="40" rx="3" fill="#BE185D" />
      <text x="48" y="132" fill="#FFFFFF" fontSize="9" fontWeight="bold">CHAMPAGNE</text>
      <rect x="480" y="110" width="85" height="40" rx="3" fill="#047857" />
      <text x="492" y="132" fill="#FEF08A" fontSize="9" fontWeight="bold">LAGOS FASHION</text>

      {/* Multi-lane Expressway Asphalt */}
      <polygon points="0,260 600,260 600,450 0,450" fill={isNight ? '#09090B' : '#334155'} />
      {/* Glowing Expressway Center Dash Line */}
      <line x1="300" y1="260" x2="300" y2="450" stroke="#FDE047" strokeWidth="3" strokeDasharray="25 18" />

      {/* Light streaks: White headlights & Red taillights zooming */}
      <path d="M 380 270 L 520 450" stroke="#EF4444" strokeWidth="6" opacity="0.9" />
      <path d="M 400 270 L 580 450" stroke="#DC2626" strokeWidth="4" opacity="0.7" />
      <path d="M 220 270 L 80 450" stroke="#FEF08A" strokeWidth="6" opacity="0.9" />
      <path d="M 200 270 L 20 450" stroke="#FFFFFF" strokeWidth="4" opacity="0.8" />

      {/* Yellow Danfo bus silhouette */}
      <rect x="60" y="270" width="70" height="35" rx="4" fill="#EAB308" stroke="#000000" strokeWidth="2" />
      <rect x="65" y="275" width="20" height="12" fill="#93C5FD" />
      <rect x="90" y="275" width="20" height="12" fill="#93C5FD" />
    </g>
  );
}
