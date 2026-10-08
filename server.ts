import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for dynamic scene text generation
app.post('/api/scene/generate', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Using offline story engine.',
      });
    }

    const {
      episode,
      sceneIndex,
      episodeTitle,
      context,
      heroine,
      meters,
      lastChoiceText,
      lastScenesHistory,
      flags,
      plannedPlotBeat,
      secretPayload,
    } = req.body;

    const culpritCode = secretPayload?.target || 'unknown';
    const motiveCode = secretPayload?.intent || 'unknown';

    const prompt = `You are the lead narrative director for "Lagos Tea", a glossy, fun, dramatic Lagos influencer romance-mystery visual novel.
Tone: glossy, funny, fast banter, luxe settings, viral drama, light authentic Nigerian English and light Pidgin (e.g., "abeg", "oya", "dey", "na so", "wetin", "no be small thing", "sha", "jare", "chale"). Serious moments are real but never grim.

CAST:
- Heroine: ${heroine?.name || 'Adaeze "Ada" Obi'}, 19, scholarship student from Ajegunle, observant, proud, sharp wit. Department: ${heroine?.department || 'Media & Digital Communications'}.
- Zee (Zainab "Zee" Bello): 4M followers, politician's daughter, queen bee, charming when useful and cold when not.
- Tamara (Tamara Okonkwo-Reid): 2.5M followers, oil money, playful, reckless, Ada's childhood neighbor and the kindest to her.
- Chi (Chioma "Chi" Eze): 600K followers, ambitious climber, sharp lawyer-influencer.
- Bisola (Bisola Adeyemi): 400K followers, funny gossipy vlogger terrified of losing relevance.
- Hauwa (Hauwa Musa): 350K followers, calm wellness influencer who notices everything.
- Chidi (Chidi Nwosu): down-to-earth campus photographer, honest, grounded, observant.
- Kelvin (Kelvin Adebayo-Wright): Zee's older brother, wealthy heir, magnetic, charming, risky.
- Dayo (Dayo Martins): mysterious hitmaker producer.

HIDDEN MYSTERY GROUND TRUTH (CONFIDENTIAL - DO NOT EXPOSE TO PLAYER):
- The leaker running @TheLagosTea is: ${culpritCode}
- Her true underlying motive is: ${motiveCode}
CRITICAL RULES FOR GEMINI:
(a) NEVER reveal or directly hint at the culprit before the final reveal episode. Keep all characters acting in-character.
(b) Plant subtle, fair circumstantial clues that point toward the real culprit.
(c) ALSO plant at least two red herrings pointing toward other friends in the circle to keep the suspense balanced.
(d) If this is the final reveal episode, write the reveal consistently with this chosen culprit and motive.

CRITICAL PACING & STORY RULES:
1. The first lines must directly follow the chosen option: "${lastChoiceText || 'Looked around the room'}". The heroine must say or do exactly this choice as line 1.
2. The other characters present must react specifically to that exact choice in line 2 with the right expression and in-character voice. Never skip it or reword it into something else.
3. Do not advance the main plot beat until at least 5 scenes of the episode have been played. Slow down: build atmosphere, tension and emotion, let characters talk, and show reactions and body language.
4. SCENE LENGTH: Generate exactly 5 to 7 lines per scene. Mix narration, dialogue exchanges between at least two characters, and the heroine's inner thoughts.
5. TWISTS: Major plot twists happen ONLY in the last 1 to 2 scenes of an episode (scenes 5 or 6 of 7). Earlier scenes build suspense, romance, jealousy, and clues.
6. CHOICES: Provide 2 to 3 clearly branching choices. Each choice must clearly name the consequence it risks, leading to a distinct situation and changes in relationship meters.

Current Episode: Episode ${episode || 1}: ${episodeTitle || 'The Invitation'}
Current Scene: Scene ${(sceneIndex || 0) + 1} of 7
Planned Episode Plot Beat: ${plannedPlotBeat || context || 'Navigating high-society drama'}
Player's Exact Recent Choice: "${lastChoiceText || 'Observed the crowd'}"

Recent Story History (Last 5 Scenes):
${Array.isArray(lastScenesHistory) ? lastScenesHistory.slice(-5).join('\n---\n') : 'Beginning of episode.'}

Current State & Flags:
- Active Flags: ${JSON.stringify(flags || {})}
- Meters: Popularity: ${meters?.popularity || 50}%, Loyalty: ${meters?.loyalty || 50}%, Suspicion: ${meters?.suspicion || 20}%, Jealousy: ${meters?.jealousy || 10}%, Reputation: ${meters?.reputation || 50}%, Romance Chidi: ${meters?.romanceChidi || 30}%, Romance Kelvin: ${meters?.romanceKelvin || 30}%

Return ONLY a valid JSON object matching this schema:
{
  "location": "ajegunle_apartment" | "banana_island_mansion" | "rooftop_party" | "mall" | "university_campus" | "beach_house" | "photoshoot_studio" | "night_street",
  "timeModifier": "day" | "night",
  "charactersOnStage": ["heroine", "zee" | "tamara" | "chi" | "bisola" | "hauwa" | "chidi" | "kelvin"],
  "lines": [
    {
      "speaker": "heroine" | "zee" | "tamara" | "chi" | "bisola" | "hauwa" | "chidi" | "kelvin" | "narrator",
      "speakerDisplayName": string,
      "expression": "neutral" | "happy" | "angry" | "shocked" | "sad" | "flirty" | "suspicious" | "jealous",
      "text": string,
      "sfx": "tap" | "chime" | "suspense" | "suspenseSting" | "shock" | "heartbeat"
    }
  ],
  "choices": [
    {
      "id": string,
      "text": string,
      "consequenceText": string,
      "meterChanges": {
        "popularity"?: number,
        "loyalty"?: number,
        "suspicion"?: number,
        "jealousy"?: number,
        "reputation"?: number,
        "romanceChidi"?: number,
        "romanceKelvin"?: number
      },
      "flagToSet"?: string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to generate scene with Gemini',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Lagos Tea Visual Novel server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
