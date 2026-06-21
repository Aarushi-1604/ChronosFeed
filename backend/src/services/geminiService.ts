import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Cleans the input text by removing markdown JSON wrapper code blocks,
 * trimming whitespace, and extracting the content between the first '{' and the last '}'.
 * 
 * @param text The raw response text
 * @returns The cleaned JSON string
 */
export function cleanJSON(text: string): string {
  let cleaned = text;

  // Remove ```json from start if present (case insensitive)
  if (cleaned.toLowerCase().startsWith('```json')) {
    cleaned = cleaned.substring(7);
  }

  // Remove ``` from end if present
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  // Trim whitespace
  cleaned = cleaned.trim();

  // Find the first occurrence of '{' or '['
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx !== -1) {
    cleaned = cleaned.substring(startIdx);
  }

  // Find the last occurrence of '}' or ']'
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  let endIdx = -1;
  if (lastBrace !== -1 && lastBracket !== -1) {
    endIdx = Math.max(lastBrace, lastBracket);
  } else if (lastBrace !== -1) {
    endIdx = lastBrace;
  } else if (lastBracket !== -1) {
    endIdx = lastBracket;
  }

  if (endIdx !== -1) {
    cleaned = cleaned.substring(0, endIdx + 1);
  }

  return cleaned;
}

export const worldTokenUsage = new Map<string, number>();

export function recordTokens(worldId: string, tokens: number) {
  const current = worldTokenUsage.get(worldId) || 0;
  worldTokenUsage.set(worldId, current + tokens);
}

/**
 * Calls the Gemini API with the provided prompt and returns the parsed JSON response.
 * 
 * @param prompt The generation prompt
 * @param worldId Optional world ID to record token usage
 * @returns The parsed JSON object
 */
export async function callGemini(prompt: string, worldId?: string): Promise<unknown> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

    if (!apiKey) {
      if (isDev) {
        console.warn(
          '⚠️ GEMINI_API_KEY is missing in development mode. Activating offline fallback mock response.'
        );
        if (worldId) {
          recordTokens(worldId, 380); // Record mock tokens for development offline mode
        }
        return getMockGeminiResponse(prompt);
      } else {
        throw new Error('GEMINI_API_KEY not set in environment.');
      }
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Record token usage
    const tokens = result.response.usageMetadata?.totalTokenCount || Math.ceil(text.length / 4);
    if (worldId) {
      recordTokens(worldId, tokens);
    }

    const cleanedText = cleanJSON(text);

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error('Gemini returned invalid JSON: ' + cleanedText.substring(0, 200));
    }
  } catch (error: any) {
    throw new Error('Gemini API call failed: ' + error.message);
  }
}

/**
 * Returns mock structured data matching prompt target context for offline dev fallback.
 */
function getMockGeminiResponse(prompt: string): any {
  const combined = prompt.toLowerCase();
  
  if (combined.includes('comment')) {
    return [
      { handle: 'steam_coder_99', content: 'Incredible mechanical calculation efficiency!', likes_count: 12 },
      { handle: 'ada_coder', content: 'The analytical engine loops look solid.', likes_count: 45 },
      { handle: 'royal_observer', content: 'A direct decree from the Crown!', likes_count: 8 }
    ];
  } else if (combined.includes('persona')) {
    return [
      { name: 'Charles Babbage III', handle: 'steam_coder_99', bio: 'Compiler of systems.', role: 'SCIENTIST', influence_score: 87, interests: ['calculus', 'steam'], personality: 'analytical' },
      { name: 'Ada Lovelace Jr.', handle: 'ada_coder', bio: 'Pioneer of loops.', role: 'SCIENTIST', influence_score: 95, interests: ['loops', 'math'], personality: 'visionary' },
      { name: 'Lord Byron II', handle: 'romantic_poet', bio: 'Techno-romantic verse compiler.', role: 'INFLUENCER', influence_score: 82, interests: ['poetry', 'steam-cards'], personality: 'expressive' },
      { name: 'Chancellor Gearing', handle: 'state_iron', bio: 'Gears administrator under the crown.', role: 'POLITICIAN', influence_score: 89, interests: ['governance', 'iron'], personality: 'authoritarian' }
    ];
  } else if (combined.includes('event')) {
    return [
      { year: '1890', title: 'Prototype Engine', description: 'Babbage completes the steam prototype.', impact: 'Steam computing goes online.' },
      { year: '1895', title: 'Mechanical Net Act', description: 'Tubes and mechanical lines laid across the empire.', impact: 'Information networks take structural control.' },
      { year: '1902', title: 'Steam Space Rocket Launch', description: 'Pressurized copper capsule reaches orbit.', impact: 'Era of space steamships begins.' }
    ];
  } else if (combined.includes('news')) {
    return [
      { title: 'Expansion Act Passed', content: 'Parliament votes to expand the Tube net.', category: 'POLITICS', publisher: 'Telegraph' }
    ];
  } else if (combined.includes('ad')) {
    return [
      { company_name: 'BabbageCo', tagline: 'Compute at steam speed.', description: 'Mark VII coprocessor.', price: '3 Sovereigns' }
    ];
  } else if (combined.includes('post')) {
    return [
      { content: 'Just upgraded the steam router loops.', likes_count: 120, reposts_count: 24 }
    ];
  } else {
    // Return world details object
    return {
      name: 'The Steam Age',
      summary: 'History of steam computing.',
      era: 'Victorian Cyberpunk',
      tech_level: 'Steam mechanical routers',
      gov_type: 'Corporatist Monarchy'
    };
  }
}
