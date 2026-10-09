import React, { useState } from 'react';
import {
  Department,
  SkinToneId,
  EyeColorId,
  HairstyleId,
  HairColorId,
  LipColorId,
  LipFinishId,
  EyeshadowColorId,
  LashesId,
  BlushColorId,
  BrowsId,
  OutfitId,
  EarringsId,
  NecklaceId,
  HeroineCustomization,
} from '../../types/vn';
import { HeroineSvg } from '../svg/HeroineSvg';
import {
  SKIN_TONES,
  EYE_COLORS,
  HAIR_COLORS,
  LIP_COLORS,
  EYESHADOW_COLORS,
  BLUSH_COLORS,
} from '../svg/palettes';
import {
  Sparkles,
  User,
  Palette,
  Scissors,
  Shirt,
  X,
  Check,
  Eye,
  Heart,
} from 'lucide-react';

interface HeroineCustomizerProps {
  customization: HeroineCustomization;
  onSave: (updated: HeroineCustomization) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const HeroineCustomizer: React.FC<HeroineCustomizerProps> = ({
  customization,
  onSave,
  onClose,
  isInitialSetup = false,
}) => {
  const [draft, setDraft] = useState<HeroineCustomization>({ ...customization });
  const [activeTab, setActiveTab] = useState<
    'identity' | 'complexion' | 'hair' | 'makeup' | 'wardrobe'
  >('identity');

  const departments: Department[] = [
    'Media & Digital Communications',
    'Fashion & Luxury Branding',
    'Law & International Governance',
    'Business Administration & Finance',
    'Computer Science & AI',
    'Interior & Architectural Design',
    'Film & Performing Arts',
  ];

  // Natural/African Hairstyles (5)
  const naturalHairstyles: { id: HairstyleId; label: string }[] = [
    { id: 'knotless_braids', label: 'Knotless Braids (Long)' },
    { id: 'box_braids', label: 'Box Braids' },
    { id: 'cornrows', label: 'Sleek Cornrows' },
    { id: 'natural_afro', label: 'Natural Afro Crown' },
    { id: 'bantu_knots', label: 'Bantu Knots' },
  ];

  // Wigs (10)
  const wigHairstyles: { id: HairstyleId; label: string }[] = [
    { id: 'long_straight_wig', label: 'Long Straight Wig' },
    { id: 'body_wave_wig', label: 'Body Wave Wig' },
    { id: 'bob_wig', label: 'Classic Bob Wig' },
    { id: 'curly_wig', label: 'Curly Wig' },
    { id: 'deep_wave_wig', label: 'Deep Wave Wig' },
    { id: 'bangs_wig', label: 'Bone Straight + Bangs' },
    { id: 'side_part_wig', label: 'Deep Side Part' },
    { id: 'water_wave_wig', label: 'Water Wave Wig' },
    { id: 'genie_ponytail', label: 'Genie Ponytail' },
    { id: 'pixie_wig', label: 'Pixie Cut Wig' },
  ];

  const lashesList: { id: LashesId; label: string; desc: string }[] = [
    { id: 'natural', label: 'Natural', desc: 'Light, delicate definition' },
    { id: 'classic', label: 'Classic Wing', desc: 'Soft feline taper' },
    { id: 'volume', label: 'Full Volume', desc: 'Dense 3D flutter' },
    { id: 'dramatic', label: 'Dramatic Baddie', desc: 'High-impact winged glamour' },
  ];

  const browsList: { id: BrowsId; label: string }[] = [
    { id: 'soft', label: 'Soft Natural' },
    { id: 'arched', label: 'Sculpted Arch' },
    { id: 'bold', label: 'Bold Editorial' },
  ];

  const outfitsList: { id: OutfitId; label: string; desc: string }[] = [
    { id: 'casual', label: 'Ajegunle Casual', desc: 'Plain modest tee & oversized fit' },
    { id: 'corporate', label: 'Tailored Blazer', desc: 'Lekki private uni tailored blazer' },
    { id: 'ankara', label: 'Ankara Sweetheart', desc: 'Vibrant wax print sweetheart dress' },
    { id: 'party_dress', label: 'Banana Island VIP', desc: 'Emerald couture evening dress' },
    { id: 'hoodie', label: 'Late Night Hoodie', desc: 'Street hoodie & cozy fit' },
    { id: 'native_lace', label: 'Rich Aunty Cord Lace', desc: 'Opulent regal cord lace' },
    { id: 'bubu_kaftan', label: 'Owambe Bubu', desc: 'Flowing damask bubu, gold embroidery' },
    { id: 'adire_shirt', label: 'Adire Camp Shirt', desc: 'Hand-dyed indigo adire, open collar' },
    { id: 'aso_oke', label: 'Aso-Oke Off-Shoulder', desc: 'Hand-woven wine and gold stripes' },
    { id: 'denim_jacket', label: 'Denim & Tank', desc: 'Washed denim jacket over a white tank' },
    { id: 'corset_top', label: 'Satin Corset', desc: 'Wine satin sweetheart corset' },
    { id: 'athleisure', label: 'Track Half-Zip', desc: 'Sporty half-zip with stripes' },
    { id: 'crop_top', label: 'Rib Crop Top', desc: 'Lilac rib crop tee & high-waist jeans' },
    { id: 'baby_tee', label: 'Baby Tee', desc: 'Butterfly ringer tee & low-rise cargos' },
    { id: 'tube_top', label: 'Gold Tube Top', desc: 'Ruched satin tube & jeans' },
    { id: 'jersey_top', label: 'Naija Jersey', desc: 'Oversized green football jersey' },
    { id: 'halter_top', label: 'Crochet Halter', desc: 'Granny-square halter & mini skirt' },
    { id: 'cardigan_set', label: 'Knit Cardigan Set', desc: 'Cropped cable cardigan & mini' },
  ];

  const earringsList: { id: EarringsId; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'studs', label: 'Diamond Studs' },
    { id: 'hoops', label: 'Gold Hoops' },
    { id: 'drops', label: 'Pearl Drops' },
  ];

  const necklaceList: { id: NecklaceId; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'thin_chain', label: 'Thin Gold Chain' },
    { id: 'pendant', label: 'Ruby Pendant' },
  ];

  const handleConfirm = () => {
    // Name is fixed by the story; department only chosen at the start
    onSave({
      ...draft,
      name: customization.name,
      department: isInitialSetup ? draft.department : customization.department,
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col overflow-y-auto animate-in fade-in duration-200">
      
      {/* 1. TOP LIVE PREVIEW (max 40% of screen height) */}
      <div className="w-full shrink-0 h-[34vh] max-h-[38vh] min-h-[220px] bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 flex flex-col items-center justify-between p-2.5 border-b border-neutral-800 relative shadow-inner">
        
        {/* Top Mini Bar */}
        <div className="w-full max-w-lg flex items-center justify-between text-xs px-2 z-10">
          <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Preview
          </span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px]">
              {draft.department}
            </span>
            {onClose && !isInitialSetup && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live SVG Character Image (scaled properly to fit max 40% height) */}
        <div className="h-full flex-1 flex items-center justify-center w-full max-w-[280px] drop-shadow-2xl overflow-hidden py-1">
          <HeroineSvg customization={draft} expression="neutral" className="w-full h-full object-contain" />
        </div>

        {/* Character Sub-caption */}
        <div className="z-10 pb-1">
          <span className="text-xs font-serif font-bold text-neutral-100">
            {draft.name || 'Heroine'}
          </span>
          <span className="text-[10px] text-neutral-400 ml-2 font-mono">
            LAU • Year 1
          </span>
        </div>
      </div>

      {/* 2. TABS CONTAINER (2 rows or compact badges that fit on any mobile screen) */}
      <div className="w-full sticky top-0 z-30 bg-neutral-900/95 border-b border-neutral-800 backdrop-blur-md px-2 py-1.5 shadow-md">
        <div className="max-w-lg mx-auto grid grid-cols-5 gap-1 text-center">
          {[
            { id: 'identity', label: 'Identity', icon: User },
            { id: 'complexion', label: 'Complexion', icon: Palette },
            { id: 'hair', label: 'Hairstyle', icon: Scissors },
            { id: 'makeup', label: 'Glam', icon: Eye },
            { id: 'wardrobe', label: 'Outfits', icon: Shirt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SCROLLABLE OPTIONS CONTENT (Clean vertical scrolling with generous bottom padding) */}
      <div className="w-full flex-1 max-w-lg mx-auto p-4 space-y-6 pb-32">
        
        {/* ===================================================================
            TAB: IDENTITY
            =================================================================== */}
        {activeTab === 'identity' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                Heroine’s Name
              </label>
              <div className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-200">
                {draft.name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                Department
              </label>
              {!isInitialSetup ? (
                <div className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-neutral-200">
                  {draft.department}
                  <span className="block text-[10px] text-neutral-500 mt-0.5">Your department is set for the semester.</span>
                </div>
              ) : (
              <div className="grid grid-cols-2 gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDraft({ ...draft, department: dept })}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      draft.department === dept
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm'
                        : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: COMPLEXION & EYES
            =================================================================== */}
        {activeTab === 'complexion' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Skin Tone (8 Warm Melanin Tones)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(SKIN_TONES).map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, skinTone: tone.id })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.skinTone === tone.id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full shrink-0 shadow-inner border border-white/20"
                      style={{ backgroundColor: tone.baseColor }}
                    />
                    <span className="text-[11px] font-medium leading-tight text-neutral-200">
                      {tone.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Eye Color (8 Expressive Shades)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(EYE_COLORS).map((eColor) => (
                  <button
                    key={eColor.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, eyeColor: eColor.id })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.eyeColor === eColor.id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-neutral-700"
                      style={{ backgroundColor: eColor.irisColor }}
                    />
                    <span className="text-[11px] font-medium text-neutral-200">
                      {eColor.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: HAIR (Natural/African & Wigs + 8 Hair Colors)
            =================================================================== */}
        {activeTab === 'hair' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Natural & African Hairstyles */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Natural & African Styles
              </label>
              <div className="grid grid-cols-2 gap-2">
                {naturalHairstyles.map((hair) => (
                  <button
                    key={hair.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, hairstyle: hair.id })}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      draft.hairstyle === hair.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {hair.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wigs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Lace & Salon Wigs
              </label>
              <div className="grid grid-cols-2 gap-2">
                {wigHairstyles.map((wig) => (
                  <button
                    key={wig.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, hairstyle: wig.id })}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      draft.hairstyle === wig.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {wig.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color (8 Colors) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Hair Color & Ombré (Applies to all styles)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(HAIR_COLORS).map((hColor) => (
                  <button
                    key={hColor.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, hairColor: hColor.id })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.hairColor === hColor.id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-neutral-700"
                      style={{ backgroundColor: hColor.primary }}
                    />
                    <span className="text-[11px] font-medium text-neutral-200 truncate">
                      {hColor.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: GLAM & EYES (Lip, Finish, Eyeshadow, Lashes, Blush, Highlighter, Brows)
            =================================================================== */}
        {activeTab === 'makeup' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Lip Color & Finish Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Lip Color & Finish
                </label>
                {/* Matte / Gloss Toggle */}
                <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, lipFinish: 'matte' })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      draft.lipFinish === 'matte'
                        ? 'bg-neutral-800 text-amber-400 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Matte
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, lipFinish: 'gloss' })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      draft.lipFinish === 'gloss'
                        ? 'bg-amber-500 text-neutral-950 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Gloss ✨
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(LIP_COLORS).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDraft({ ...draft, lipColor: id as LipColorId })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.lipColor === id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-neutral-700"
                      style={{ backgroundColor: item.base }}
                    />
                    <span className="text-[11px] font-medium text-neutral-200">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Eyeshadow */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Eyeshadow Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(EYESHADOW_COLORS).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDraft({ ...draft, eyeshadow: id as EyeshadowColorId })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.eyeshadow === id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-neutral-700"
                      style={{ backgroundColor: item.color === 'transparent' ? '#333' : item.color }}
                    />
                    <span className="text-[11px] font-medium text-neutral-200 truncate">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lashes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Eyelashes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {lashesList.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, lashes: l.id })}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      draft.lashes === l.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-semibold">{l.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Blush & Highlighter Row */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Cheek Blush
                </label>
                {/* Highlighter Toggle */}
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, highlighter: !draft.highlighter })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    draft.highlighter
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  Highlighter: {draft.highlighter ? 'ON ✨' : 'OFF'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(BLUSH_COLORS).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDraft({ ...draft, blush: id as BlushColorId })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      draft.blush === id
                        ? 'border-amber-500 ring-1 ring-amber-500 bg-neutral-900'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-neutral-700"
                      style={{ backgroundColor: item.color === 'transparent' ? '#333' : item.color }}
                    />
                    <span className="text-[11px] font-medium text-neutral-200">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brows */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Eyebrow Shape
              </label>
              <div className="grid grid-cols-3 gap-2">
                {browsList.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, brows: b.id })}
                    className={`p-2.5 text-xs text-center rounded-xl border transition-all ${
                      draft.brows === b.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB: WARDROBE (6 Outfits, Earrings, Necklace)
            =================================================================== */}
        {activeTab === 'wardrobe' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Outfits (6) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Campus Outfits
              </label>
              <div className="grid grid-cols-2 gap-2">
                {outfitsList.map((outfit) => (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, outfit: outfit.id })}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      draft.outfit === outfit.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-semibold">{outfit.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{outfit.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Earrings */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Earrings
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {earringsList.map((earring) => (
                  <button
                    key={earring.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, earrings: earring.id })}
                    className={`p-2.5 text-xs text-center rounded-xl border transition-all ${
                      draft.earrings === earring.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {earring.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Necklace */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Necklace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {necklaceList.map((neck) => (
                  <button
                    key={neck.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, necklace: neck.id })}
                    className={`p-2.5 text-xs text-center rounded-xl border transition-all ${
                      draft.necklace === neck.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {neck.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. ALWAYS-VISIBLE FIXED "START STORY" / "SAVE WARDROBE" BOTTOM BAR (Critical Layout Fix) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-md shadow-2xl flex items-center justify-center">
        <div className="w-full max-w-lg flex items-center gap-3">
          {onClose && !isInitialSetup && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {isInitialSetup ? 'Start Story (Episode 1)' : 'Save Look & Continue'}
          </button>
        </div>
      </div>

    </div>
  );
};
