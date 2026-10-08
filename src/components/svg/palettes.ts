import {
  SkinToneId,
  SkinToneOption,
  EyeColorId,
  EyeColorOption,
  HairColorId,
  HairColorOption,
  LipColorId,
  EyeshadowColorId,
  BlushColorId,
} from '../../types/vn';

export const SKIN_TONES: Record<SkinToneId, SkinToneOption> = {
  caramel: {
    id: 'caramel',
    name: 'Caramel Glow',
    baseColor: '#C68B59',
    shadowColor: '#9E6438',
    highlightColor: '#E2B286',
    blushColor: '#CC6C63',
  },
  rich_honey: {
    id: 'rich_honey',
    name: 'Rich Honey',
    baseColor: '#B87A46',
    shadowColor: '#8C5326',
    highlightColor: '#D29965',
    blushColor: '#B65A54',
  },
  warm_amber: {
    id: 'warm_amber',
    name: 'Warm Amber',
    baseColor: '#A46435',
    shadowColor: '#78411B',
    highlightColor: '#BF804F',
    blushColor: '#A04B46',
  },
  deep_chestnut: {
    id: 'deep_chestnut',
    name: 'Deep Chestnut',
    baseColor: '#8E4F28',
    shadowColor: '#633112',
    highlightColor: '#A9683E',
    blushColor: '#8B3A3E',
  },
  bronze_mahogany: {
    id: 'bronze_mahogany',
    name: 'Bronze Mahogany',
    baseColor: '#79401F',
    shadowColor: '#522610',
    highlightColor: '#92512A',
    blushColor: '#782E37',
  },
  dark_cocoa: {
    id: 'dark_cocoa',
    name: 'Dark Cocoa',
    baseColor: '#633317',
    shadowColor: '#3F1C0A',
    highlightColor: '#7D4122',
    blushColor: '#63232C',
  },
  deep_espresso: {
    id: 'deep_espresso',
    name: 'Deep Espresso',
    baseColor: '#4F2612',
    shadowColor: '#2F1406',
    highlightColor: '#673319',
    blushColor: '#4F1B25',
  },
  radiant_ebony: {
    id: 'radiant_ebony',
    name: 'Radiant Ebony',
    baseColor: '#3B1B0C',
    shadowColor: '#210D04',
    highlightColor: '#532612',
    blushColor: '#3D1520',
  },
};

export const EYE_COLORS: Record<EyeColorId, EyeColorOption> = {
  dark_brown: {
    id: 'dark_brown',
    name: 'Dark Brown',
    irisColor: '#4A2A14',
    glowColor: '#744626',
  },
  black: {
    id: 'black',
    name: 'Obsidian Black',
    irisColor: '#1A181A',
    glowColor: '#3D393E',
  },
  hazel: {
    id: 'hazel',
    name: 'Golden Hazel',
    irisColor: '#755823',
    glowColor: '#A8843B',
  },
  amber: {
    id: 'amber',
    name: 'Sunlit Amber',
    irisColor: '#8C5216',
    glowColor: '#C4782A',
  },
  green: {
    id: 'green',
    name: 'Emerald Green',
    irisColor: '#1E5E3A',
    glowColor: '#38A169',
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Blue',
    irisColor: '#1D4ED8',
    glowColor: '#60A5FA',
  },
  grey: {
    id: 'grey',
    name: 'Smoky Grey',
    irisColor: '#475569',
    glowColor: '#94A3B8',
  },
  violet: {
    id: 'violet',
    name: 'Deep Violet',
    irisColor: '#581C87',
    glowColor: '#A855F7',
  },
};

export const HAIR_COLORS: Record<HairColorId, HairColorOption> = {
  jet_black: {
    id: 'jet_black',
    name: 'Jet Black',
    primary: '#121113',
    accent: '#2B282F',
  },
  dark_brown: {
    id: 'dark_brown',
    name: 'Espresso Brown',
    primary: '#301F15',
    accent: '#523725',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Rich Burgundy',
    primary: '#561629',
    accent: '#832742',
  },
  honey_blonde: {
    id: 'honey_blonde',
    name: 'Honey Blonde',
    primary: '#B5853B',
    accent: '#E5BA6C',
  },
  copper: {
    id: 'copper',
    name: 'Warm Copper',
    primary: '#9C4221',
    accent: '#D97736',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Ice',
    primary: '#D1D5DB',
    accent: '#F3F4F6',
  },
  rose_pink: {
    id: 'rose_pink',
    name: 'Rose Pink',
    primary: '#BE185D',
    accent: '#F472B6',
  },
  ombre_blonde: {
    id: 'ombre_blonde',
    name: 'Ombré Brown-Blonde',
    primary: '#241B15',
    accent: '#C69246',
  },
};

export const LIP_COLORS: Record<LipColorId, { name: string; base: string; highlight: string }> = {
  nude: {
    name: 'Warm Nude',
    base: '#B87258',
    highlight: '#E3A894',
  },
  soft_pink: {
    name: 'Soft Pink',
    base: '#C0667C',
    highlight: '#ECA0B2',
  },
  coral: {
    name: 'Sun Coral',
    base: '#C85344',
    highlight: '#F38A7D',
  },
  classic_red: {
    name: 'Classic Red',
    base: '#A91B2E',
    highlight: '#E84E62',
  },
  berry: {
    name: 'Ripe Berry',
    base: '#8B2144',
    highlight: '#C94B73',
  },
  plum: {
    name: 'Deep Plum',
    base: '#581335',
    highlight: '#8E285B',
  },
  chocolate_brown: {
    name: 'Chocolate Brown',
    base: '#5A3222',
    highlight: '#8A5540',
  },
  gold: {
    name: 'Shimmering Gold',
    base: '#B8860B',
    highlight: '#FDE047',
  },
};

export const EYESHADOW_COLORS: Record<EyeshadowColorId, { name: string; color: string; opacity: number }> = {
  none: {
    name: 'None',
    color: 'transparent',
    opacity: 0,
  },
  bronze: {
    name: 'Bronze Lids',
    color: '#8A4A28',
    opacity: 0.65,
  },
  gold: {
    name: 'Champagne Gold',
    color: '#D4AF37',
    opacity: 0.7,
  },
  rose: {
    name: 'Rose Gold',
    color: '#B04B68',
    opacity: 0.6,
  },
  smoky_black: {
    name: 'Smoky Black',
    color: '#181418',
    opacity: 0.75,
  },
  purple: {
    name: 'Royal Purple',
    color: '#581C87',
    opacity: 0.65,
  },
  teal: {
    name: 'Ocean Teal',
    color: '#0F766E',
    opacity: 0.65,
  },
};

export const BLUSH_COLORS: Record<BlushColorId, { name: string; color: string; opacity: number }> = {
  none: {
    name: 'None',
    color: 'transparent',
    opacity: 0,
  },
  soft_peach: {
    name: 'Soft Peach',
    color: '#F97316',
    opacity: 0.35,
  },
  rose: {
    name: 'Warm Rose',
    color: '#E11D48',
    opacity: 0.38,
  },
  bold_berry: {
    name: 'Bold Berry',
    color: '#9F1239',
    opacity: 0.5,
  },
};
