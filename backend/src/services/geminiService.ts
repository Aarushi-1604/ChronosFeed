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

/**
 * Calls the Gemini API with the provided prompt and returns the parsed JSON response.
 * 
 * @param prompt The generation prompt
 * @returns The parsed JSON object
 */
export async function callGemini(prompt: string): Promise<unknown> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set');
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

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
