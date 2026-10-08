import React, { useState, useMemo } from 'react';
import { SocialPost, SocialAuthorId } from '../../types/socialFeed';
import { CharacterId, Meters, HeroineCustomization, InventoryItem } from '../../types/vn';
import { SocialAvatar } from './SocialAvatar';
import { NpcSvg } from '../svg/NpcSvg';
import { HeroineSvg } from '../svg/HeroineSvg';
import {
  ArrowLeft,
  CheckCircle2,
  MoreHorizontal,
  Grid,
  Clapperboard,
  UserCheck,
  UserPlus,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  MapPin,
  Sparkles,
  Award,
  Shirt,
  Info,
  Send,
  X,
  Volume2,
  Bookmark,
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { RELATIONSHIP_CHARACTERS } from '../../data/relationshipData';
import { calculateAdaFollowers, formatCount } from '../../data/socialRules';

interface CharacterProfileMeta {
  id: string;
  name: string;
  handle: string;
  category: string;
  bio: string;
  website: string;
  followers: string;
  following: string;
  mutualInfo: string;
  highlights: { id: string; label: string; emoji: string; bg: string }[];
}

const PROFILE_REGISTRY: Record<string, CharacterProfileMeta> = {
  zee: {
    id: 'zee',
    name: 'Zainab "Zee" Bello',
    handle: '@zeebello',
    category: 'Public Figure • Fashion Creative Director',
    bio: 'Perfection is not an accident; it is a brand strategy. 👑 Banana Island Royalty | Founder @ZeeBelloLuxe | Press: inquiries@zeebello.com ✨',
    website: 'zeebelloluxe.ng/exclusive',
    followers: '4.0M',
    following: '248',
    mutualInfo: 'Followed by @tamara_reid, @kelvin_wright, and 850 others',
    highlights: [
      { id: 'h1', label: 'Zee21', emoji: '👑', bg: 'from-amber-500 to-yellow-600' },
      { id: 'h2', label: 'FrontRow', emoji: '✨', bg: 'from-rose-500 to-pink-600' },
      { id: 'h3', label: 'BananaIsle', emoji: '🏝️', bg: 'from-emerald-500 to-teal-700' },
      { id: 'h4', label: 'Parties', emoji: '🍸', bg: 'from-purple-600 to-indigo-800' },
      { id: 'h5', label: 'Vault', emoji: '💎', bg: 'from-cyan-600 to-blue-800' },
    ],
  },
  tamara: {
    id: 'tamara',
    name: 'Tamara Okonkwo-Reid',
    handle: '@tamara_reid',
    category: 'Heiress • Celebrity Wardrobe Stylist',
    bio: 'Champagne for my real friends, real tea for everyone 🍾🥂 Styling the icons who shake Lagos. Ride-or-die for @ada_obi 💚👗',
    website: 'tamarareid.studio/archive',
    followers: '2.5M',
    following: '812',
    mutualInfo: 'Followed by @ada_obi, @zeebello, and 410 others',
    highlights: [
      { id: 'h1', label: 'GalaFits', emoji: '🍾', bg: 'from-pink-500 to-rose-600' },
      { id: 'h2', label: 'Couture', emoji: '👗', bg: 'from-emerald-500 to-teal-700' },
      { id: 'h3', label: 'Ilashe', emoji: '🏖️', bg: 'from-amber-500 to-yellow-600' },
      { id: 'h4', label: 'Bestie', emoji: '✨', bg: 'from-fuchsia-600 to-purple-800' },
    ],
  },
  chidi: {
    id: 'chidi',
    name: 'Chidi Nwosu',
    handle: '@chidi_captures',
    category: 'Visual Journalist & Documentary Archivist',
    bio: 'Capturing what ring lights try to hide 📷🎞️ 35mm film • Truth over hype • ATL to Lagos. Leica M6 in hand. Exposing shadows.',
    website: 'chidinwosu.photos/portfolio',
    followers: '18.4K',
    following: '142',
    mutualInfo: 'Followed by @ada_obi, @tamara_reid, and 34 others',
    highlights: [
      { id: 'h1', label: '35mm', emoji: '🎞️', bg: 'from-blue-600 to-cyan-700' },
      { id: 'h2', label: 'Archives', emoji: '🔍', bg: 'from-neutral-700 to-neutral-900' },
      { id: 'h3', label: 'Tarkwa', emoji: '🌊', bg: 'from-sky-500 to-blue-700' },
      { id: 'h4', label: 'Candids', emoji: '📸', bg: 'from-amber-600 to-rose-700' },
    ],
  },
  kelvin: {
    id: 'kelvin',
    name: 'Kelvin Adebayo-Wright',
    handle: '@kelvin_wright',
    category: 'Entrepreneur • Hospitality & Shipping Dynasty',
    bio: 'Lagos moves at the speed of wire transfers 🚢⚓ Founder @TheVaultLagos | Adebayo-Wright Holdings | Good taste isn\'t negotiable. 🥂',
    website: 'thevaultlagos.com/vip-tables',
    followers: '520K',
    following: '310',
    mutualInfo: 'Followed by @zeebello, @tamara_reid, and 192 others',
    highlights: [
      { id: 'h1', label: 'Yachts', emoji: '🛥️', bg: 'from-blue-600 to-indigo-800' },
      { id: 'h2', label: 'VaultVIP', emoji: '🥂', bg: 'from-amber-500 to-rose-600' },
      { id: 'h3', label: 'Speed', emoji: '🏎️', bg: 'from-red-600 to-neutral-900' },
      { id: 'h4', label: 'Bespoke', emoji: '👔', bg: 'from-emerald-700 to-neutral-900' },
    ],
  },
  dayo: {
    id: 'dayo',
    name: 'Dayo Martins',
    handle: '@dayomartins_sound',
    category: 'Music Producer & Record Label Architect',
    bio: 'Soundtracks for the city that never sleeps 🎹🎧 8x Platinum Producer. Crafting sonic hits from mainland to the island 🌍🎶',
    website: 'dayomartins.com/new-releases',
    followers: '1.2M',
    following: '215',
    mutualInfo: 'Followed by @kelvin_wright, @tamara_reid, and 88 others',
    highlights: [
      { id: 'h1', label: 'Studio', emoji: '🎧', bg: 'from-purple-600 to-indigo-900' },
      { id: 'h2', label: 'Platinum', emoji: '🔥', bg: 'from-amber-500 to-rose-600' },
      { id: 'h3', label: 'Beats', emoji: '🎹', bg: 'from-violet-500 to-purple-800' },
    ],
  },
  chi: {
    id: 'chi',
    name: 'Chioma "Chi" Eze',
    handle: '@chi_corporate_glam',
    category: 'Corporate Counsel & Media Strategist',
    bio: 'Contracts are written in ink, reputations in algorithms ⚖️📚 Corporate Law & Entertainment Rights • McGill / UNILAG. Never unprepared. 💼',
    website: 'ezelegalpartners.ng',
    followers: '600K',
    following: '490',
    mutualInfo: 'Followed by @zeebello, @bisola_vlogs, and 76 others',
    highlights: [
      { id: 'h1', label: 'Briefs', emoji: '⚖️', bg: 'from-indigo-600 to-blue-800' },
      { id: 'h2', label: 'LekkiHQ', emoji: '🏙️', bg: 'from-slate-600 to-neutral-900' },
      { id: 'h3', label: 'Grind', emoji: '☕', bg: 'from-amber-600 to-stone-800' },
    ],
  },
  bisola: {
    id: 'bisola',
    name: 'Bisola Adeyemi',
    handle: '@bisola_vlogs',
    category: 'Content Creator • Media Personality',
    bio: 'If it wasn\'t captured on 4K, did it even happen? 🎥✨ 360° Lagos lifestyle, red carpet tea & unboxings! Hit subscribe! 🔔💄',
    website: 'youtube.com/@bisolavlogs',
    followers: '400K',
    following: '1.1K',
    mutualInfo: 'Followed by @tamara_reid, @zeebello, and 512 others',
    highlights: [
      { id: 'h1', label: 'DailyVlog', emoji: '🎥', bg: 'from-pink-500 to-rose-600' },
      { id: 'h2', label: 'TeaTime', emoji: '☕', bg: 'from-amber-500 to-yellow-600' },
      { id: 'h3', label: 'GlamRoom', emoji: '💄', bg: 'from-fuchsia-600 to-purple-800' },
    ],
  },
  hauwa: {
    id: 'hauwa',
    name: 'Hauwa Musa',
    handle: '@hauwa_mindbody',
    category: 'Wellness Maven & Holistic Aesthetician',
    bio: 'Protect your peace; let your aura do the talking 🧘‍♀️🌿 Pilates • Organic skincare • Mindful living in chaos. Abuja ✈️ Lagos 🍵',
    website: 'hauwamusa.wellness/retreats',
    followers: '350K',
    following: '380',
    mutualInfo: 'Followed by @tamara_reid, @zeebello, and 89 others',
    highlights: [
      { id: 'h1', label: 'Pilates', emoji: '🧘‍♀️', bg: 'from-emerald-500 to-teal-700' },
      { id: 'h2', label: 'Matcha', emoji: '🍵', bg: 'from-lime-600 to-emerald-800' },
      { id: 'h3', label: 'Skincare', emoji: '🌿', bg: 'from-teal-600 to-cyan-800' },
    ],
  },
  lagos_tea: {
    id: 'lagos_tea',
    name: 'The Lagos Tea',
    handle: '@TheLagosTea',
    category: 'Anonymous Society Blog & Digital Dossier',
    bio: 'Unfiltered secrets of Banana Island, Victoria Island & beyond ☕🫖 We have the receipts you prayed were deleted. Encrypted hotline open. 🤫',
    website: 'lagostea.onion/submit-tip',
    followers: '850K',
    following: '0',
    mutualInfo: 'Followed by 4,120 high society figures',
    highlights: [
      { id: 'h1', label: 'Leaks', emoji: '🚨', bg: 'from-rose-600 to-red-900' },
      { id: 'h2', label: 'Receipts', emoji: '🫖', bg: 'from-amber-600 to-orange-900' },
      { id: 'h3', label: 'Vault', emoji: '🔥', bg: 'from-purple-800 to-neutral-950' },
    ],
  },
};

// Generates fallback archived posts for any character so the 3-column Instagram grid looks authentic and rich!
function getArchiveGridPostsForCharacter(
  charId: string,
  charMeta: CharacterProfileMeta
): SocialPost[] {
  const titles = [
    { title: 'Velvet Horizon at Sundown', likes: 41200, comments: 840, gradient: 'from-rose-700 via-purple-800 to-neutral-950', badge: 'SUNSET LUXE' },
    { title: 'Private Tasting in Victoria Island', likes: 32900, comments: 620, gradient: 'from-amber-600 via-rose-700 to-neutral-900', badge: 'VIP SALON' },
    { title: 'Behind the Scenes: Campaign Shoot', likes: 58400, comments: 1200, gradient: 'from-indigo-600 via-purple-700 to-black', badge: 'EXCLUSIVE' },
    { title: 'Lekki Coastal Drive in Monogram', likes: 27800, comments: 490, gradient: 'from-teal-600 via-emerald-800 to-neutral-950', badge: 'ON THE MOVE' },
    { title: 'The Guestlist Afterparty', likes: 64200, comments: 1530, gradient: 'from-fuchsia-600 via-pink-700 to-neutral-900', badge: 'MIDNIGHT' },
    { title: 'Signature Statement Look', likes: 49100, comments: 910, gradient: 'from-yellow-600 via-amber-700 to-stone-900', badge: 'RUNWAY' },
  ];

  return titles.map((t, idx) => ({
    id: `archive_${charId}_${idx}`,
    authorId: charId as SocialAuthorId,
    authorName: charMeta.name,
    authorHandle: charMeta.handle,
    isVerified: true,
    avatarType: (['heroine', 'zee', 'tamara', 'chi', 'bisola', 'hauwa', 'chidi', 'kelvin', 'dayo', 'lagos_tea'].includes(charId)
      ? charId
      : 'zee') as any,
    unlockEpisode: 1,
    timestamp: `${idx + 1}w ago`,
    locationTag: 'Lagos, Nigeria',
    caption: `${t.title}. When the energy is pure, the moments speak for themselves ✨ #LagosLiving #${charMeta.handle.replace('@', '')}`,
    hashtags: ['#LagosLiving', `#${charMeta.handle.replace('@', '')}`, '#LuxuryLifestyle'],
    graphic: {
      type: 'luxe_portrait',
      characterId: charId as CharacterId,
      bgGradient: t.gradient,
      badgeLabel: t.badge,
      headline: t.title.toUpperCase(),
      subheadline: `${charMeta.name} Archive`,
      accentColor: '#f43f5e',
      tagLocation: 'VICTORIA ISLAND, LAGOS',
    },
    likesCount: t.likes,
    commentsCount: t.comments,
    sharesCount: Math.round(t.likes * 0.08),
    isLikedByPlayer: false,
    isArchive: true,
    comments: [
      {
        id: `c_arch_${charId}_${idx}`,
        authorId: 'tamara' as const,
        authorName: 'Tamara Reid',
        authorHandle: '@tamara_reid',
        isVerified: true,
        avatarType: 'tamara' as const,
        text: 'Absolute perfection! Still obsessed with this fit! 🔥😍',
        likes: 120,
        timestamp: '3d ago',
      },
    ],
  }));
}

interface InstagramProfileViewProps {
  userId: CharacterId | 'lagos_tea' | 'heroine';
  allPosts: SocialPost[];
  heroine: HeroineCustomization;
  meters: Meters;
  inventory: InventoryItem[];
  soundEnabled: boolean;
  isFollowing: boolean;
  onBack: () => void;
  onToggleFollow: () => void;
  onMessage: () => void;
  renderPostCard: (post: SocialPost) => React.ReactNode;
  onOpenWardrobe?: () => void;
  onOpenClues?: () => void;
  onOpenBioModal?: (charId: CharacterId) => void;
}

export const InstagramProfileView: React.FC<InstagramProfileViewProps> = ({
  userId,
  allPosts,
  heroine,
  meters,
  inventory,
  soundEnabled,
  isFollowing,
  onBack,
  onToggleFollow,
  onMessage,
  renderPostCard,
  onOpenWardrobe,
  onOpenClues,
  onOpenBioModal,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [followToast, setFollowToast] = useState<string | null>(null);

  const isAda = userId === 'heroine';

  // Ada's dynamic meta - starting as an underdog scholar grinding to the top!
  const calculatedFollowers = calculateAdaFollowers(meters.popularity, meters.reputation, 9);
  const formattedAdaFollowers = formatCount(calculatedFollowers);

  const profileMeta: CharacterProfileMeta = useMemo(() => {
    if (isAda) {
      return {
        id: 'heroine',
        name: `${heroine.name} Obi`,
        handle: '@ada_obi',
        category:
          calculatedFollowers < 1000
            ? 'Underdog Student • Grinding from the Bottom'
            : calculatedFollowers < 5000
            ? `${heroine.department} Scholar • Rising Campus Voice`
            : calculatedFollowers < 25000
            ? 'High-Society Contender • Digital Prodigy'
            : 'Verified Lagos Star • Digital Royalty 👑',
        bio:
          calculatedFollowers < 1000
            ? 'Ajegunle to Lekki Atlantic. 19 | Scholarship student | Camera in hand, keeping my head down and working my way to the top 📚📸 #TheGrind'
            : 'Holding my ground in high society. Observant, ambitious, and proving talent beats trust funds 💅📚',
        website: 'ada-obi.me/portfolio',
        followers: formattedAdaFollowers,
        following: '18',
        mutualInfo: 'Followed by @tamara_reid, @chidi_captures, and 12 friends',
        highlights: [
          { id: 'h1', label: 'Looks', emoji: '👗', bg: 'from-pink-500 to-rose-600' },
          { id: 'h2', label: 'Scholar', emoji: '📚', bg: 'from-blue-600 to-indigo-800' },
          { id: 'h3', label: 'Evidence', emoji: '🕵️', bg: 'from-amber-500 to-yellow-600' },
          { id: 'h4', label: 'Gala', emoji: '✨', bg: 'from-emerald-500 to-teal-700' },
        ],
      };
    }
    return (
      PROFILE_REGISTRY[userId] || {
        id: userId,
        name: userId.charAt(0).toUpperCase() + userId.slice(1),
        handle: `@${userId}`,
        category: 'High Society Influencer',
        bio: 'Living in the heart of Lagos glamour. 🥂',
        website: 'gidigram.ng',
        followers: '250K',
        following: '300',
        mutualInfo: 'Followed by Lagos high society',
        highlights: [
          { id: 'h1', label: 'Highlights', emoji: '✨', bg: 'from-amber-500 to-rose-600' },
        ],
      }
    );
  }, [userId, isAda, heroine, formattedAdaFollowers]);

  // Filter posts authored by this user
  const userPosts = useMemo(() => {
    const directPosts = allPosts.filter((p) => p.authorId === userId);
    if (isAda) {
      // Create tagged/Ada moments
      return [
        ...directPosts,
        ...getArchiveGridPostsForCharacter('heroine', profileMeta),
      ];
    }
    const archivePosts = getArchiveGridPostsForCharacter(userId, profileMeta);
    return [...directPosts, ...archivePosts];
  }, [allPosts, userId, isAda, profileMeta]);

  const handleToggleFollow = () => {
    if (soundEnabled) playSound.click();
    onToggleFollow();
  };

  const handleMessageClick = () => {
    if (soundEnabled) playSound.click();
    onMessage();
  };

  const selectedPost = userPosts.find((p) => p.id === selectedPostId) || null;

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-neutral-100 overflow-y-auto animate-in fade-in duration-200 scrollbar-thin scrollbar-thumb-neutral-800">
      
      {/* 1. TOP INSTAGRAM NAVIGATION BAR */}
      <div className="sticky top-0 z-30 px-3.5 py-2.5 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (soundEnabled) playSound.click();
              onBack();
            }}
            className="p-1 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Back to Feed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base text-neutral-100 font-mono tracking-tight">
              {profileMeta.handle.replace('@', '')}
            </span>
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 fill-pink-500/20" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          {onOpenBioModal && userId !== 'lagos_tea' && userId !== 'heroine' && (
            <button
              onClick={() => onOpenBioModal(userId as CharacterId)}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all"
              title="Open VN Bio & Vibe Check"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">Bio</span>
            </button>
          )}

          <button
            onClick={() => {
              setFollowToast(`Profile options for ${profileMeta.handle}`);
              setTimeout(() => setFollowToast(null), 2000);
            }}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toast popup */}
      {followToast && (
        <div className="sticky top-12 z-40 mx-4 my-2 p-2.5 rounded-2xl bg-neutral-900/95 border border-pink-500/40 text-pink-200 text-xs text-center font-medium shadow-xl animate-in slide-in-from-top duration-200">
          {followToast}
        </div>
      )}

      {/* 2. PROFILE HEADER: AVATAR & 3 STAT COLUMNS (EXACT INSTAGRAM LAYOUT) */}
      <div className="px-4 pt-4 pb-2 space-y-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Large Profile Avatar */}
          <div className="relative shrink-0">
            <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
              <div className="p-0.5 rounded-full bg-neutral-950">
                <SocialAvatar
                  avatarType={
                    isAda
                      ? 'heroine'
                      : userId === 'lagos_tea'
                      ? 'lagos_tea'
                      : (userId as CharacterId)
                  }
                  heroineCustomization={heroine}
                  size="xl"
                  isLagosTea={userId === 'lagos_tea'}
                />
              </div>
            </div>
            {isAda && (
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-pink-500 border-2 border-neutral-950 flex items-center justify-center text-[10px] text-white">
                ★
              </span>
            )}
          </div>

          {/* Right: 3 Stats Columns */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div className="cursor-pointer">
              <div className="text-base sm:text-lg font-black font-mono text-neutral-100">
                {userPosts.length}
              </div>
              <div className="text-[11px] text-neutral-400 font-medium">Posts</div>
            </div>

            <div className="cursor-pointer">
              <div className="text-base sm:text-lg font-black font-mono text-neutral-100">
                {profileMeta.followers}
              </div>
              <div className="text-[11px] text-neutral-400 font-medium">Followers</div>
            </div>

            <div className="cursor-pointer">
              <div className="text-base sm:text-lg font-black font-mono text-neutral-100">
                {profileMeta.following}
              </div>
              <div className="text-[11px] text-neutral-400 font-medium">Following</div>
            </div>
          </div>
        </div>

        {/* 3. BIO DESCRIPTION BLOCK */}
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
            <span>{profileMeta.name}</span>
          </div>

          <div className="text-[11px] font-medium text-neutral-400">
            {profileMeta.category}
          </div>

          <p className="text-neutral-200 leading-relaxed whitespace-pre-line pt-0.5">
            {profileMeta.bio}
          </p>

          <a
            href="#link"
            onClick={(e) => {
              e.preventDefault();
              setFollowToast(`Link copied: ${profileMeta.website} 🔗`);
              setTimeout(() => setFollowToast(null), 2000);
            }}
            className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-medium pt-0.5"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{profileMeta.website}</span>
          </a>

          <div className="text-[11px] text-neutral-400 pt-1 flex items-center gap-1.5">
            <div className="flex -space-x-1 overflow-hidden">
              <div className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-neutral-900 bg-pink-500" />
              <div className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-neutral-900 bg-amber-500" />
            </div>
            <span className="truncate">{profileMeta.mutualInfo}</span>
          </div>
        </div>

        {/* 4. ACTION BUTTONS (FOLLOW, MESSAGE, VIBE CHECK, WARDROBE) */}
        <div className="flex items-center gap-2 pt-1">
          {isAda ? (
            <>
              {onOpenWardrobe && (
                <button
                  onClick={() => {
                    if (soundEnabled) playSound.click();
                    onOpenWardrobe();
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Restyle Look</span>
                </button>
              )}

              {onOpenClues && (
                <button
                  onClick={() => {
                    if (soundEnabled) playSound.click();
                    onOpenClues();
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700/60 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Receipts ({inventory.length})</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleToggleFollow}
                className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  isFollowing
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/70'
                    : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white hover:brightness-110'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-pink-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                onClick={handleMessageClick}
                className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700/70 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-neutral-300" />
                <span>Message</span>
              </button>

              {onOpenBioModal && userId !== 'lagos_tea' && (
                <button
                  onClick={() => onOpenBioModal(userId as CharacterId)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700/70 transition-colors"
                  title="Vibe Check & Character Bio"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* 5. STORY HIGHLIGHTS TRAY (CIRCULAR COVERS EXACTLY LIKE INSTAGRAM) */}
        <div className="pt-2 border-t border-neutral-800/80">
          <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-1">
            {profileMeta.highlights.map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  if (soundEnabled) playSound.click();
                  setFollowToast(`Viewing "${h.label}" highlight story! ✨`);
                  setTimeout(() => setFollowToast(null), 1800);
                }}
                className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
              >
                <div className="p-0.5 rounded-full border border-neutral-700 group-hover:border-pink-500 transition-colors">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-tr ${h.bg} flex items-center justify-center text-xl shadow-md`}
                  >
                    <span>{h.emoji}</span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-neutral-300 truncate max-w-[60px] text-center">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. PROFILE TABS (GRID, REELS, TAGGED) */}
      <div className="mt-2 border-t border-neutral-800 flex items-center justify-around text-neutral-400 bg-neutral-950 sticky top-[49px] z-20">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          title="Posts Grid"
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('reels');
            if (soundEnabled) playSound.click();
          }}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          title="Reels & Clips"
        >
          <Clapperboard className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('tagged');
            if (soundEnabled) playSound.click();
          }}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'tagged'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          title="Tagged Photos"
        >
          <UserCheck className="w-5 h-5" />
        </button>
      </div>

      {/* 7. THREE-COLUMN POSTS GRID (EXACT INSTAGRAM LAYOUT) */}
      <div className="flex-1 p-0.5 sm:p-1">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  if (soundEnabled) playSound.click();
                  setSelectedPostId(post.id);
                }}
                className="group relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer select-none"
              >
                {/* Visual Graphic Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${post.graphic.bgGradient} opacity-95 group-hover:scale-105 transition-transform duration-300`}
                />

                {/* In-thumbnail content */}
                <div className="relative z-10 w-full h-full p-2 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    {post.graphic.badgeLabel && (
                      <span className="px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs font-bold truncate max-w-[85%]">
                        {post.graphic.badgeLabel}
                      </span>
                    )}
                  </div>

                  {post.graphic.characterId && (
                    <div className="w-16 h-20 sm:w-20 sm:h-24 mx-auto self-center pointer-events-none opacity-85">
                      {post.graphic.characterId === 'heroine' ? (
                        <HeroineSvg
                          customization={heroine}
                          expression="happy"
                          lookDirection="center"
                        />
                      ) : (
                        <NpcSvg
                          characterId={post.graphic.characterId}
                          expression="happy"
                          lookDirection="center"
                        />
                      )}
                    </div>
                  )}

                  <div className="text-[10px] font-bold line-clamp-1 drop-shadow-md">
                    {post.graphic.headline || post.caption.slice(0, 30)}
                  </div>
                </div>

                {/* Hover/Tap Overlay with Likes and Comments count (Exact Instagram style) */}
                <div className="absolute inset-0 z-20 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 text-white font-bold text-xs transition-opacity duration-200">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>
                      {post.likesCount >= 1000
                        ? `${(post.likesCount / 1000).toFixed(1)}K`
                        : post.likesCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reels Tab view */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {userPosts.slice(0, 3).map((post, idx) => (
              <div
                key={`reel_${post.id}`}
                onClick={() => setSelectedPostId(post.id)}
                className="relative aspect-[9/16] bg-neutral-900 overflow-hidden cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${post.graphic.bgGradient} opacity-90`} />
                <div className="absolute bottom-2 left-2 text-white text-[11px] font-bold flex items-center gap-1 drop-shadow-md">
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>{(idx + 1) * 45}K</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tagged Photos Tab view */}
        {activeTab === 'tagged' && (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {userPosts.slice(1, 4).map((post) => (
              <div
                key={`tagged_${post.id}`}
                onClick={() => setSelectedPostId(post.id)}
                className="relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${post.graphic.bgGradient} opacity-90`} />
                <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white">
                  <UserCheck className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. MODAL FOR OPENING A SELECTED GRID POST */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80">
              <span className="text-xs font-mono font-bold text-neutral-300">
                Post by {selectedPost.authorHandle}
              </span>
              <button
                onClick={() => setSelectedPostId(null)}
                className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-neutral-800">
              {renderPostCard(selectedPost)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
