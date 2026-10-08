/**
 * Dynamic Lagos Tea Visual Novel Background Music (BGM) Engine
 * Synthesizes authentic modern Lagos / Nigerian soundscapes using the Web Audio API.
 * 
 * Features:
 * - Afrobeats / Amapiano log drum synthesis
 * - Alté / Neo-Soul Rhodes & warm electric piano comping
 * - Shekere / Shaker polyrhythmic percussion
 * - Kalimba / Marimba melodic plucks
 * - Lagos Thriller sub-bass drones & heartbeat tension
 * - Smooth cross-fading between emotional moods
 * - Zero external assets or network requests
 */

import { getAudioContext } from './audio';
import type { MusicMood } from '../types/vn';

export interface MoodProfile {
  id: MusicMood;
  title: string;
  vibe: string;
  bpm: number;
  bars: number;
  energy: 'chill' | 'medium' | 'high' | 'tense' | 'dark';
  chords: number[][]; // Frequencies for chord progression
  bassNotes: (number | null)[]; // Root/bassline frequencies per step
  leadMelody?: (number | null)[]; // Kalimba/pluck melody notes
  hasLogDrum?: boolean;
  hasShaker?: boolean;
  hasKick?: boolean;
  hasRim?: boolean;
  hasHeartbeat?: boolean;
  hasSuspenseDrone?: boolean;
  filterCutoff: number; // Hz
  masterGainMultiplier: number;
}

// Standard musical frequencies (Hz) with full sharp and flat enharmonics
const N = {
  // Low Bass (Octave 1 & 2)
  C1: 32.70, Cs1: 34.65, Db1: 34.65, D1: 36.71, Ds1: 38.89, Eb1: 38.89, E1: 41.20, F1: 43.65, Fs1: 46.25, Gb1: 46.25, G1: 49.00, Gs1: 51.91, Ab1: 51.91, A1: 55.00, As1: 58.27, Bb1: 58.27, B1: 61.74,
  C2: 65.41, Cs2: 69.30, Db2: 69.30, D2: 73.42, Ds2: 77.78, Eb2: 77.78, E2: 82.41, F2: 87.31, Fs2: 92.50, Gb2: 92.50, G2: 98.00, Gs2: 103.83, Ab2: 103.83, A2: 110.00, As2: 116.54, Bb2: 116.54, B2: 123.47,
  // Mid Bass & Harmony (Octave 3)
  C3: 130.81, Cs3: 138.59, Db3: 138.59, D3: 146.83, Ds3: 155.56, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, Gb3: 185.00, G3: 196.00, Gs3: 207.65, Ab3: 207.65, A3: 220.00, As3: 233.08, Bb3: 233.08, B3: 246.94,
  // Midrange Chords (Octave 4)
  C4: 261.63, Cs4: 277.18, Db4: 277.18, D4: 293.66, Ds4: 311.13, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, Gb4: 369.99, G4: 392.00, Gs4: 415.30, Ab4: 415.30, A4: 440.00, As4: 466.16, Bb4: 466.16, B4: 493.88,
  // High Plucks & Melodies (Octave 5 & 6)
  C5: 523.25, Cs5: 554.37, Db5: 554.37, D5: 587.33, Ds5: 622.25, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, Gb5: 739.99, G5: 783.99, Gs5: 830.61, Ab5: 830.61, A5: 880.00, As5: 932.33, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, Cs6: 1108.73, Db6: 1108.73, Ds6: 1244.51, Eb6: 1244.51, E6: 1318.51,
};

export const MOOD_PROFILES: Record<MusicMood, MoodProfile> = {
  // 1. Normal campus / lifestyle: soft Lagos groove, mellow Afrobeats, light Alté/R&B textures
  campus_lifestyle: {
    id: 'campus_lifestyle',
    title: 'Lekki Afternoon Breeze',
    vibe: 'Mellow Afrobeats & Alté R&B',
    bpm: 100,
    bars: 4,
    energy: 'chill',
    chords: [
      [N.Fs3, N.A3, N.Cs4, N.E4],      // F#m7
      [N.D3, N.Fs3, N.A3, N.Cs4],      // Dmaj7
      [N.B2, N.D3, N.Fs3, N.A3],       // Bm7
      [N.Cs3, N.E3, N.Gs3, N.B3],      // C#m7
    ],
    bassNotes: [N.Fs2, N.Fs2, N.D2, N.D2, N.B1, N.B1, N.Cs2, N.E2],
    leadMelody: [N.Cs5, null, N.A4, N.Fs4, null, N.E4, N.Fs4, null, N.Cs5, N.B4, null, N.A4, N.Fs4, null, null, null],
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 1800,
    masterGainMultiplier: 0.22,
  },

  // 2. Romance / flirting: warm, intimate R&B/Alté instrumental
  romance_flirting: {
    id: 'romance_flirting',
    title: 'Lagoon Golden Hour',
    vibe: 'Intimate Alté Soul & Sweet Guitar Plucks',
    bpm: 92,
    bars: 4,
    energy: 'chill',
    chords: [
      [N.D3, N.Fs3, N.A3, N.Cs4, N.E4], // Dmaj9
      [N.Cs3, N.E3, N.Gs3, N.B3],       // C#m7
      [N.B2, N.D3, N.Fs3, N.A3, N.Cs4], // Bm9
      [N.A2, N.Cs3, N.E3, N.Gs3],       // Amaj7
    ],
    bassNotes: [N.D2, N.D2, N.Cs2, N.Cs2, N.B1, N.B1, N.A1, N.Cs2],
    leadMelody: [N.Fs5, null, N.E5, null, N.Cs5, null, N.A4, null, N.B4, null, N.Cs5, null, N.A4, null, null, null],
    hasShaker: true,
    hasKick: false,
    hasRim: true,
    filterCutoff: 1400,
    masterGainMultiplier: 0.20,
  },

  // 3. Party / gala: upbeat Afrobeats/Amapiano/lounge energy
  party_gala: {
    id: 'party_gala',
    title: 'Banana Island Soirée',
    vibe: 'Upbeat Amapiano Log Drum & High Clout',
    bpm: 114,
    bars: 4,
    energy: 'high',
    chords: [
      [N.Cs3, N.E3, N.Gs3, N.B3],       // C#m7
      [N.A2, N.Cs3, N.E3, N.Gs3],       // Amaj7
      [N.Fs3, N.A3, N.Cs4, N.E4],       // F#m7
      [N.Gs3, N.B3, N.Ds4, N.Fs4],      // G#m7
    ],
    bassNotes: [N.Cs2, N.Cs2, N.A1, N.A1, N.Fs1, N.Fs1, N.Gs1, N.B1],
    leadMelody: [N.Gs5, N.Gs5, null, N.Fs5, N.E5, null, N.Cs5, null, N.E5, null, N.Fs5, null, N.Gs5, null, null, null],
    hasLogDrum: true,
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 2600,
    masterGainMultiplier: 0.25,
  },

  // 4. Gossip / social-media drama: playful, mischievous, bouncy rhythm
  gossip_drama: {
    id: 'gossip_drama',
    title: 'Who Spilled The Tea?',
    vibe: 'Playful Kalimba & Mischievous Bouncy Bass',
    bpm: 108,
    bars: 4,
    energy: 'medium',
    chords: [
      [N.A3, N.C4, N.E4, N.G4],         // Am7
      [N.D3, N.Fs3, N.A3, N.C4],        // D7
      [N.G3, N.B3, N.D4, N.Fs4],        // Gmaj7
      [N.E3, N.G3, N.B3, N.D4],         // Em7
    ],
    bassNotes: [N.A1, N.C2, N.D2, N.Fs2, N.G1, N.B1, N.E1, N.G1],
    leadMelody: [N.E5, N.G5, N.E5, null, N.D5, null, N.C5, null, N.B4, null, N.D5, null, N.C5, N.A4, null, null],
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 2200,
    masterGainMultiplier: 0.22,
  },

  // 5. Suspicion / investigation: dark subtle pulse, low percussion, atmospheric tension
  suspicion_investigation: {
    id: 'suspicion_investigation',
    title: 'Tracing The Metadata',
    vibe: 'Dark Subtle Pulse & Atmospheric Investigation',
    bpm: 88,
    bars: 4,
    energy: 'tense',
    chords: [
      [N.D3, N.F3, N.A3, N.Cs4],        // Dm(maj7)
      [N.Bb2, N.D3, N.F3, N.A3],        // Bbmaj7
      [N.G2, N.Bb2, N.Cs3, N.E3],       // Gdim
      [N.A2, N.Cs3, N.E3, N.G3],        // A7
    ],
    bassNotes: [N.D2, N.D1, N.Bb1, N.Bb1, N.G1, N.G1, N.A1, N.A1],
    leadMelody: [N.D5, null, null, N.Cs5, null, null, N.Bb4, null, N.A4, null, null, null, null, null, null, null],
    hasSuspenseDrone: true,
    hasKick: false,
    hasRim: true,
    hasHeartbeat: false,
    filterCutoff: 900,
    masterGainMultiplier: 0.20,
  },

  // 6. Someone is lying / hiding something: uneasy bass, sparse and uncomfortable atmosphere
  deceit_hiding: {
    id: 'deceit_hiding',
    title: 'Fidgeting Behind Closed Doors',
    vibe: 'Uneasy Sparse Bass & Deceptive Dissonance',
    bpm: 80,
    bars: 4,
    energy: 'dark',
    chords: [
      [N.C3, N.Eb3, N.Gb3, N.B3],       // Cdim(maj7)
      [N.Ab2, N.C3, N.Eb3, N.G3],       // Abmaj7
      [N.F2, N.Ab2, N.B2, N.D3],        // Fdim
      [N.G2, N.B2, N.D3, N.F3],         // G7
    ],
    bassNotes: [N.C2, null, N.Ab1, null, N.F1, null, N.G1, null],
    leadMelody: [null, N.Eb5, null, N.D5, null, N.B4, null, null, null, null, null, null, null, null, null, null],
    hasSuspenseDrone: true,
    hasKick: false,
    hasRim: false,
    hasHeartbeat: true,
    filterCutoff: 650,
    masterGainMultiplier: 0.18,
  },

  // 7. Argument / confrontation: heavier, tense rhythm
  argument_confrontation: {
    id: 'argument_confrontation',
    title: 'The Accusation',
    vibe: 'Heavy Tense Afro-Trap Percussion & Harsh Chords',
    bpm: 110,
    bars: 4,
    energy: 'high',
    chords: [
      [N.E3, N.G3, N.Bb3, N.D4],        // Em7b5
      [N.A2, N.Cs3, N.E3, N.G3],        // A7
      [N.D3, N.F3, N.A3, N.C4],         // Dm7
      [N.Bb2, N.D3, N.F3, N.Ab3],       // Bb7
    ],
    bassNotes: [N.E2, N.E2, N.A1, N.A1, N.D2, N.D2, N.Bb1, N.Bb1],
    leadMelody: [N.Bb4, N.A4, null, N.G4, N.F4, null, N.E4, null, N.D4, null, null, null, null, null, null, null],
    hasKick: true,
    hasRim: true,
    hasShaker: true,
    hasSuspenseDrone: true,
    filterCutoff: 2100,
    masterGainMultiplier: 0.24,
  },

  // 8. Major reveal: brief dramatic sting/hit followed by suspense music
  major_reveal: {
    id: 'major_reveal',
    title: 'The Exposed Receipt',
    vibe: 'Cinematic Suspense Aftermath & Unmasked Truth',
    bpm: 84,
    bars: 4,
    energy: 'tense',
    chords: [
      [N.B2, N.D3, N.F3, N.Ab3],        // Bdim7
      [N.C3, N.Eb3, N.G3, N.Bb3],       // Cm7
      [N.Ab2, N.C3, N.Eb3, N.Fs3],      // Ab7#11
      [N.G2, N.B2, N.D3, N.F3],         // G7
    ],
    bassNotes: [N.B1, N.B1, N.C2, N.C2, N.Ab1, N.Ab1, N.G1, N.G1],
    leadMelody: [N.Fs5, null, N.F5, null, N.Eb5, null, N.D5, null, null, null, null, null, null, null, null, null],
    hasSuspenseDrone: true,
    hasKick: false,
    hasRim: true,
    hasHeartbeat: true,
    filterCutoff: 1000,
    masterGainMultiplier: 0.22,
  },

  // 9. Danger / threat: dark thriller ambience, low pulse/heartbeat-like rhythm
  danger_threat: {
    id: 'danger_threat',
    title: 'Footsteps In The Dark',
    vibe: 'Dark Thriller Ambience & Heartbeat Sub-Thump',
    bpm: 78,
    bars: 4,
    energy: 'dark',
    chords: [
      [N.C2, N.Eb2, N.Fs2, N.A2],       // Cdim7
      [N.Cs2, N.E2, N.G2, N.Bb2],       // C#dim7
      [N.C2, N.Eb2, N.Fs2, N.A2],       // Cdim7
      [N.B1, N.D2, N.F2, N.Ab2],        // Bdim7
    ],
    bassNotes: [N.C1, null, N.Cs1, null, N.C1, null, N.B1, null],
    leadMelody: [null, null, N.Fs5, null, null, null, N.G5, null, null, null, null, null, null, null, null, null],
    hasSuspenseDrone: true,
    hasHeartbeat: true,
    hasKick: false,
    hasRim: false,
    filterCutoff: 600,
    masterGainMultiplier: 0.20,
  },

  // 10. Heartbreak / emotional scene: melancholic piano/R&B atmosphere
  heartbreak_melancholy: {
    id: 'heartbreak_melancholy',
    title: 'Ajegunle Solitude',
    vibe: 'Soulful Melancholic Alté Piano & Soft Longing',
    bpm: 76,
    bars: 4,
    energy: 'chill',
    chords: [
      [N.A2, N.C3, N.E3, N.G3, N.B3],   // Am9
      [N.F2, N.A2, N.C3, N.E3, N.G3],   // Fmaj9
      [N.D2, N.F2, N.A2, N.C3, N.E3],   // Dm9
      [N.E2, N.Gs2, N.B2, N.D3],        // E7
    ],
    bassNotes: [N.A1, N.A1, N.F1, N.F1, N.D1, N.D1, N.E1, N.E1],
    leadMelody: [N.C5, null, N.B4, N.A4, null, N.G4, null, N.E4, null, N.F4, null, N.D4, null, null, null, null],
    hasKick: false,
    hasShaker: true,
    hasRim: false,
    filterCutoff: 1200,
    masterGainMultiplier: 0.19,
  },

  // 11. Victory / confidence / glow-up: confident Afrobeats/Amapiano energy
  victory_confidence: {
    id: 'victory_confidence',
    title: 'The Glow-Up',
    vibe: 'Triumphant Amapiano & Unapologetic Confidence',
    bpm: 114,
    bars: 4,
    energy: 'high',
    chords: [
      [N.E3, N.Gs3, N.B3, N.Ds4],       // Emaj7
      [N.Fs3, N.A3, N.Cs4, N.E4],       // F#m7
      [N.Gs3, N.B3, N.Ds4, N.Fs4],      // G#m7
      [N.A3, N.Cs4, N.E4, N.Gs4],       // Amaj7
    ],
    bassNotes: [N.E2, N.E2, N.Fs2, N.Fs2, N.Gs2, N.Gs2, N.A2, N.B2],
    leadMelody: [N.B4, N.Cs5, N.Ds5, N.E5, null, N.Ds5, N.Cs5, null, N.Gs5, null, N.Fs5, null, N.E5, null, null, null],
    hasLogDrum: true,
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 2800,
    masterGainMultiplier: 0.25,
  },

  // 12. Viral tea leak: chaotic, fast social-media energy
  viral_tea_leak: {
    id: 'viral_tea_leak',
    title: 'Viral Notification Storm',
    vibe: 'Chaotic Rapid Tempo, Glitch Alerts & Social Panic',
    bpm: 124,
    bars: 4,
    energy: 'high',
    chords: [
      [N.Cs3, N.E3, N.G3, N.Bb3],       // C#dim7
      [N.D3, N.F3, N.A3, N.C4],         // Dm7
      [N.Eb3, N.G3, N.Bb3, N.Db4],      // Eb7
      [N.E3, N.Gs3, N.B3, N.D4],        // E7
    ],
    bassNotes: [N.Cs2, N.Cs2, N.D2, N.D2, N.Eb2, N.Eb2, N.E2, N.E2],
    leadMelody: [N.E5, N.E5, N.Fs5, N.G5, N.G5, N.A5, N.Bb5, N.B5, null, N.C6, null, N.Cs6, null, null, null, null],
    hasLogDrum: true,
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    hasSuspenseDrone: true,
    filterCutoff: 3000,
    masterGainMultiplier: 0.25,
  },

  // 13. Mystery climax: cinematic Nigerian/Lagos-inspired suspense
  mystery_climax: {
    id: 'mystery_climax',
    title: 'Night Of The Unmasking',
    vibe: 'Cinematic Lagos Suspense & Driving Climax Pulse',
    bpm: 104,
    bars: 4,
    energy: 'tense',
    chords: [
      [N.D3, N.F3, N.A3, N.C4],         // Dm7
      [N.G2, N.Bb2, N.D3, N.F3],        // Gm7
      [N.Bb2, N.D3, N.F3, N.A3],        // Bbmaj7
      [N.A2, N.Cs3, N.E3, N.G3],        // A7
    ],
    bassNotes: [N.D2, N.D2, N.G1, N.G1, N.Bb1, N.Bb1, N.A1, N.Cs2],
    leadMelody: [N.D5, null, N.F5, null, N.E5, null, N.D5, null, N.Cs5, null, N.D5, null, N.A4, null, null, null],
    hasSuspenseDrone: true,
    hasLogDrum: true,
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 2200,
    masterGainMultiplier: 0.24,
  },

  // 14. Ending Romance (Chidi / Love ending):
  ending_romance: {
    id: 'ending_romance',
    title: 'Sunset Over The Lagoon',
    vibe: 'Romantic Alté Serenade • Honesty & True Connection',
    bpm: 90,
    bars: 4,
    energy: 'chill',
    chords: [
      [N.D3, N.Fs3, N.A3, N.Cs4, N.E4], // Dmaj9
      [N.B2, N.D3, N.Fs3, N.A3, N.Cs4], // Bm9
      [N.G2, N.B2, N.D3, N.Fs3],        // Gmaj7
      [N.A2, N.Cs3, N.E3, N.G3],        // A7
    ],
    bassNotes: [N.D2, N.D2, N.B1, N.B1, N.G1, N.G1, N.A1, N.A1],
    leadMelody: [N.Fs5, null, N.A5, null, N.Fs5, null, N.E5, null, N.D5, null, N.Cs5, null, N.D5, null, null, null],
    hasShaker: true,
    hasRim: true,
    hasKick: false,
    filterCutoff: 1900,
    masterGainMultiplier: 0.22,
  },

  // 15. Ending Triumph (Kelvin / Dayo / Independent victory):
  ending_triumph: {
    id: 'ending_triumph',
    title: 'The Untouchable Queen',
    vibe: 'Royal Lagos Afrobeats & Victorious Power',
    bpm: 112,
    bars: 4,
    energy: 'high',
    chords: [
      [N.A3, N.Cs4, N.E4, N.Gs4],       // Amaj7
      [N.B3, N.Ds4, N.Fs4, N.A4],       // B7
      [N.Cs3, N.E3, N.Gs3, N.B3],       // C#m7
      [N.Fs3, N.A3, N.Cs4, N.E4],       // F#m7
    ],
    bassNotes: [N.A1, N.A1, N.B1, N.B1, N.Cs2, N.Cs2, N.Fs1, N.Gs1],
    leadMelody: [N.E5, N.Gs5, N.A5, null, N.Gs5, N.Fs5, N.E5, null, N.Cs5, null, N.E5, null, N.Gs5, null, null, null],
    hasLogDrum: true,
    hasShaker: true,
    hasKick: true,
    hasRim: true,
    filterCutoff: 2700,
    masterGainMultiplier: 0.25,
  },

  // 16. Ending Bad (Cancelled / Fallen):
  ending_bad: {
    id: 'ending_bad',
    title: 'The Feed Moves On',
    vibe: 'Somber Minor Ambient & Echoing Silence',
    bpm: 68,
    bars: 4,
    energy: 'dark',
    chords: [
      [N.D2, N.F2, N.Ab2, N.C3],        // Ddim7
      [N.Bb1, N.D2, N.F2, N.A2],        // Bbmaj7
      [N.G1, N.Bb1, N.Db2, N.F2],       // Gdim
      [N.A1, N.C2, N.Eb2, N.G2],        // Adim7
    ],
    bassNotes: [N.D1, null, N.Bb1, null, N.G1, null, N.A1, null],
    leadMelody: [N.F4, null, N.Eb4, null, N.D4, null, N.C4, null, null, null, null, null, null, null, null, null],
    hasSuspenseDrone: true,
    hasHeartbeat: true,
    hasKick: false,
    hasRim: false,
    filterCutoff: 500,
    masterGainMultiplier: 0.17,
  },
};

type MusicStateListener = (state: {
  mood: MusicMood;
  title: string;
  vibe: string;
  isPlaying: boolean;
  volume: number;
}) => void;

class BackgroundMusicManager {
  private currentMood: MusicMood = 'campus_lifestyle';
  private targetMood: MusicMood = 'campus_lifestyle';
  private isEnabled: boolean = true;
  private volume: number = 0.55; // Default music balance
  private activeMasterGain: GainNode | null = null;
  private fadingGains: GainNode[] = [];
  private loopTimer: any = null;
  private stepIndex: number = 0;
  private isRunning: boolean = false;
  private listeners: Set<MusicStateListener> = new Set();
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Initial state
  }

  public subscribe(listener: MusicStateListener): () => void {
    this.listeners.add(listener);
    this.notifyListener(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => this.notifyListener(l));
  }

  private notifyListener(l: MusicStateListener) {
    const profile = MOOD_PROFILES[this.currentMood] || MOOD_PROFILES.campus_lifestyle;
    l({
      mood: this.currentMood,
      title: profile.title,
      vibe: profile.vibe,
      isPlaying: this.isRunning && this.isEnabled,
      volume: this.volume,
    });
  }

  public getCurrentMood(): MusicMood {
    return this.currentMood;
  }

  public getMoodProfile(mood?: MusicMood): MoodProfile {
    return MOOD_PROFILES[mood || this.currentMood] || MOOD_PROFILES.campus_lifestyle;
  }

  public setEnabled(enabled: boolean) {
    if (this.isEnabled === enabled) return;
    this.isEnabled = enabled;

    const ctx = getAudioContext();
    if (!ctx) {
      this.notify();
      return;
    }

    if (!enabled) {
      if (this.activeMasterGain) {
        try {
          this.activeMasterGain.gain.setValueAtTime(this.activeMasterGain.gain.value, ctx.currentTime);
          this.activeMasterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        } catch {}
      }
      this.stopLoop();
    } else {
      // Resume or start
      this.startLoop(this.currentMood, false);
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    const ctx = getAudioContext();
    if (ctx && this.activeMasterGain && this.isEnabled) {
      const profile = MOOD_PROFILES[this.currentMood];
      const targetGain = this.volume * (profile?.masterGainMultiplier || 0.22);
      try {
        this.activeMasterGain.gain.setValueAtTime(this.activeMasterGain.gain.value, ctx.currentTime);
        this.activeMasterGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.2);
      } catch {}
    }
    this.notify();
  }

  /**
   * Smoothly cross-fade to a new musical mood.
   */
  public setMood(mood: MusicMood, immediate: boolean = false) {
    if (mood === this.currentMood && this.isRunning) return;
    this.targetMood = mood;

    if (!this.isEnabled) {
      this.currentMood = mood;
      this.notify();
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) {
      this.currentMood = mood;
      this.notify();
      return;
    }

    if (immediate) {
      this.stopLoop();
      this.currentMood = mood;
      this.startLoop(mood, true);
    } else {
      // Graceful cross-fade
      this.crossFadeToMood(mood);
    }
  }

  /**
   * Dramatic sting hit followed by transition to suspense/mood
   */
  public playStingThenMood(stingType: 'reveal' | 'shock' = 'reveal', nextMood: MusicMood = 'suspicion_investigation') {
    const ctx = getAudioContext();
    if (!ctx || !this.isEnabled) {
      this.setMood(nextMood);
      return;
    }

    try {
      // Dramatic chord hit
      const chord = stingType === 'reveal'
        ? [N.Fs3, N.C4, N.Eb4, N.A4, N.Cs5] // Tritone diminished tension crash
        : [N.D3, N.Ab3, N.B3, N.F4];

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        g.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.6);
      });
    } catch {}

    // Brief dip in active music then cross-fade
    if (this.activeMasterGain) {
      try {
        this.activeMasterGain.gain.setValueAtTime(this.activeMasterGain.gain.value, ctx.currentTime);
        this.activeMasterGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.3);
      } catch {}
    }

    setTimeout(() => {
      this.setMood(nextMood, false);
    }, 600);
  }

  private crossFadeToMood(nextMood: MusicMood) {
    const ctx = getAudioContext();
    if (!ctx) {
      this.currentMood = nextMood;
      return;
    }

    // Fade out previous master gain
    if (this.activeMasterGain) {
      const oldGain = this.activeMasterGain;
      this.fadingGains.push(oldGain);
      try {
        oldGain.gain.setValueAtTime(oldGain.gain.value, ctx.currentTime);
        oldGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
      } catch {}

      setTimeout(() => {
        try {
          oldGain.disconnect();
        } catch {}
        this.fadingGains = this.fadingGains.filter((g) => g !== oldGain);
      }, 1600);
    }

    this.stopLoop();
    this.currentMood = nextMood;
    this.startLoop(nextMood, false);
    this.notify();
  }

  private startLoop(mood: MusicMood, immediate: boolean) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const profile = MOOD_PROFILES[mood] || MOOD_PROFILES.campus_lifestyle;
    const targetVolume = this.volume * profile.masterGainMultiplier;

    // Create fresh master gain for this mood stream
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(profile.filterCutoff, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    master.connect(filter);
    filter.connect(ctx.destination);

    if (immediate) {
      master.gain.setValueAtTime(targetVolume, ctx.currentTime);
    } else {
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 1.5);
    }

    this.activeMasterGain = master;
    this.isRunning = true;
    this.stepIndex = 0;

    // Start beat scheduler
    // 16 steps per bar (16th notes). e.g., 4 bars = 64 steps total
    const totalSteps = profile.bars * 16;
    const stepDuration = 60 / profile.bpm / 4; // seconds per 16th note

    let nextStepTime = ctx.currentTime + 0.05;

    const schedule = () => {
      if (!this.isRunning || !this.isEnabled) return;

      const currentTime = ctx.currentTime;
      // Schedule ahead by 150ms
      while (nextStepTime < currentTime + 0.15) {
        this.scheduleStep(ctx, master, profile, this.stepIndex, nextStepTime, stepDuration);
        this.stepIndex = (this.stepIndex + 1) % totalSteps;
        nextStepTime += stepDuration;
      }

      this.loopTimer = setTimeout(schedule, 45);
    };

    schedule();
  }

  private stopLoop() {
    this.isRunning = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  /**
   * Synthesize individual instrumental events for a 16th-note step.
   */
  private scheduleStep(
    ctx: AudioContext,
    masterGain: GainNode,
    profile: MoodProfile,
    step: number,
    time: number,
    stepDuration: number
  ) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;
    const isBeat = stepInBar % 4 === 0;

    // 1. CHORD COMPING (Alté Rhodes / Warm Electric Piano)
    // Play on syncopated Afro-rhythm: step 0 (beat 1), step 3, step 8 (beat 3), step 11
    if (stepInBar === 0 || stepInBar === 3 || stepInBar === 8 || stepInBar === 11) {
      const chordIndex = bar % profile.chords.length;
      const chord = profile.chords[chordIndex] || profile.chords[0];
      const duration = (stepInBar === 0 || stepInBar === 8) ? stepDuration * 3.5 : stepDuration * 2.5;

      chord.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const g = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          // Subtle detuned warm 2nd harmonic
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 1.002, time);

          const baseVolume = 0.045 / Math.sqrt(chord.length);
          g.gain.setValueAtTime(0.001, time);
          g.gain.linearRampToValueAtTime(baseVolume, time + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, time + duration);

          osc.connect(g);
          osc2.connect(g);
          g.connect(masterGain);

          osc.start(time);
          osc2.start(time);
          osc.stop(time + duration);
          osc2.stop(time + duration);
        } catch {}
      });
    }

    // 2. BASSLINE & LOG DRUM
    // Syncopated Amapiano / Afrobeats bass pattern (accents on steps 0, 3, 6, 8, 11, 14)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
      const bassIndex = (bar * 2 + (stepInBar >= 8 ? 1 : 0)) % profile.bassNotes.length;
      const bassFreq = profile.bassNotes[bassIndex];

      if (bassFreq) {
        if (profile.hasLogDrum) {
          // Amapiano Log Drum Synthesis: Pitch-envelope sub-drop + warm tube body
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            // Characteristic pitch-drop transient: starts high (160-220Hz), drops to fundamental
            osc.frequency.setValueAtTime(bassFreq * 2.2, time);
            osc.frequency.exponentialRampToValueAtTime(bassFreq, time + 0.05);

            gain.gain.setValueAtTime(0.16, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.8);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(time);
            osc.stop(time + stepDuration * 2.8);
          } catch {}
        } else {
          // Warm Alté / Afro-pop bass
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(bassFreq, time);

            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 2.2);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(time);
            osc.stop(time + stepDuration * 2.2);
          } catch {}
        }
      }
    }

    // 3. KALIMBA / MARIMBA LEAD MELODY
    if (profile.leadMelody && profile.leadMelody.length > 0) {
      const melodyNote = profile.leadMelody[step % profile.leadMelody.length];
      if (melodyNote) {
        try {
          const osc = ctx.createOscillator();
          const overtone = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(melodyNote, time);

          // Kalimba characteristic inharmonic metallic overtone (2.76x)
          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(melodyNote * 2.76, time);

          gain.gain.setValueAtTime(0.06, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + stepDuration * 3.5);

          osc.connect(gain);
          overtone.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          overtone.start(time);
          osc.stop(time + stepDuration * 3.5);
          overtone.stop(time + stepDuration * 3.5);
        } catch {}
      }
    }

    // 4. PERCUSSION: SHAKER / SHEKERE (Continuous 16th-note Afro-groove)
    if (profile.hasShaker) {
      // Lagos 3-3-2 syncopated shaker accent: steps 0, 3, 6, 8, 11, 14
      const isAccent = stepInBar === 0 || stepInBar === 3 || stepInBar === 6 || stepInBar === 8 || stepInBar === 11 || stepInBar === 14;
      this.playShakerHit(ctx, masterGain, time, isAccent ? 0.045 : 0.015);
    }

    // 5. PERCUSSION: KICK
    if (profile.hasKick && (stepInBar === 0 || stepInBar === 8 || (profile.energy === 'high' && isBeat))) {
      this.playKick(ctx, masterGain, time, 0.12);
    }

    // 6. PERCUSSION: RIM-SHOT / AFROBEATS CONGA
    if (profile.hasRim && (stepInBar === 4 || stepInBar === 12 || stepInBar === 7)) {
      this.playRimShot(ctx, masterGain, time, stepInBar === 12 ? 0.06 : 0.035);
    }

    // 7. HEARTBEAT PULSE (for danger, hiding, or deceit)
    if (profile.hasHeartbeat && (stepInBar === 0 || stepInBar === 3)) {
      this.playHeartbeatHit(ctx, masterGain, time, stepInBar === 0 ? 0.14 : 0.09);
    }

    // 8. SUSPENSE DRONE / SUB PULSE
    if (profile.hasSuspenseDrone && stepInBar === 0) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        // Low tension sub drone
        osc.frequency.setValueAtTime(55, time); // A1 sub-drone
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + stepDuration * 15.5);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, time);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(time);
        osc.stop(time + stepDuration * 16);
      } catch {}
    }
  }

  /**
   * Synthesize crisp white-noise shaker / shekere hit
   */
  private playShakerHit(ctx: AudioContext, destination: GainNode, time: number, vol: number) {
    try {
      if (!this.noiseBuffer) {
        this.noiseBuffer = this.createNoiseBuffer(ctx);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(5500, time);
      filter.Q.setValueAtTime(3.0, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      noise.start(time);
      noise.stop(time + 0.045);
    } catch {}
  }

  /**
   * Synthesize punchy round kick
   */
  private playKick(ctx: AudioContext, destination: GainNode, time: number, vol: number) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.09);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.18);
    } catch {}
  }

  /**
   * Synthesize crisp afrobeat rim-shot / wood click
   */
  private playRimShot(ctx: AudioContext, destination: GainNode, time: number, vol: number) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1450, time);
      osc.frequency.exponentialRampToValueAtTime(520, time + 0.035);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.05);
    } catch {}
  }

  /**
   * Synthesize deep thriller heartbeat thump
   */
  private playHeartbeatHit(ctx: AudioContext, destination: GainNode, time: number, vol: number) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(68, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.14);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.18);
    } catch {}
  }

  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 0.2; // 200ms of noise is plenty
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

export const bgmManager = new BackgroundMusicManager();
