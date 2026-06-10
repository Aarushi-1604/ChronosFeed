import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';
import { callGemini } from '../services/geminiService';
import { World, Event, Persona, Post } from '../types/database';

/**
 * Reads the world genesis template, replaces the user prompt placeholder,
 * and returns the completed prompt. Falls back to an inline prompt on error.
 */
export function buildWorldGenesisPrompt(userPrompt: string): string {
  try {
    const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'world_genesis.txt');
    const template = fs.readFileSync(filePath, 'utf8');
    return template.split('{{USER_PROMPT}}').join(userPrompt);
  } catch (error) {
    return (
      "Generate a JSON object for an alternate history world based on: " +
      userPrompt +
      ". Return ONLY valid JSON with keys: name, summary, era, tech_level, gov_type, events." +
      " events is an array of 5 objects each with: year, title, description, impact."
    );
  }
}

/**
 * Reads the persona template, replaces the world context placeholder,
 * and returns the completed prompt. Falls back to an inline prompt on error.
 */
export function buildPersonaPrompt(worldContext: string): string {
  try {
    const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'persona.txt');
    const template = fs.readFileSync(filePath, 'utf8');
    return template.split('{{WORLD_CONTEXT}}').join(worldContext);
  } catch (error) {
    return (
      "Generate a JSON array of 5 unique social media personas for this alternate history world: " +
      worldContext +
      ". Return ONLY a valid JSON array. Each object must have: name, handle, bio, role" +
      " (one of INFLUENCER/SCIENTIST/POLITICIAN/BRAND), followers_count, following_count," +
      " influence_score (1-100), interests (string array), personality."
    );
  }
}

/**
 * Reads the post template, replaces placeholders for world context and persona handles,
 * and returns the completed prompt. Falls back to an inline prompt on error.
 */
export function buildPostPrompt(worldContext: string, personaHandles: string[]): string {
  try {
    const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'post.txt');
    const template = fs.readFileSync(filePath, 'utf8');
    let completed = template.split('{{WORLD_CONTEXT}}').join(worldContext);
    completed = completed.split('{{PERSONA_HANDLES}}').join(personaHandles.join(', '));
    return completed;
  } catch (error) {
    return (
      "Generate a JSON array of 10 social media posts for this alternate history world: " +
      worldContext +
      ". The available persona handles are: " +
      personaHandles.join(', ') +
      ". Return ONLY a valid JSON array. Each object must have: handle (must match one of the" +
      " provided handles exactly), content (the post text), media_type (TEXT or MEME)," +
      " likes_count (number), reposts_count (number)."
    );
  }
}

/**
 * Orchestrates the complete AI generation pipeline for a World.
 */
export async function generateWorld(worldId: string, userPrompt: string): Promise<void> {
  try {
    // ==========================================
    // Step 1 — Generate world data
    // ==========================================
    const worldGenesisPrompt = buildWorldGenesisPrompt(userPrompt);
    const worldResultRaw = await callGemini(worldGenesisPrompt);

    const worldResult = worldResultRaw as {
      name: string;
      summary: string;
      era: string;
      tech_level: string;
      gov_type: string;
      events: Array<{
        year: string;
        title: string;
        description: string;
        impact: string;
      }>;
    };

    if (!worldResult || typeof worldResult !== 'object') {
      throw new Error('Invalid response from Gemini for world genesis: expected an object.');
    }

    // Update the worlds table row with world details
    const { error: updateWorldError } = await supabase
      .from('worlds')
      .update({
        name: worldResult.name,
        summary: worldResult.summary,
        era: worldResult.era,
        tech_level: worldResult.tech_level,
        gov_type: worldResult.gov_type,
      })
      .eq('id', worldId);

    if (updateWorldError) {
      throw new Error(`Failed to update world record: ${updateWorldError.message}`);
    }

    // Insert events if present
    if (Array.isArray(worldResult.events) && worldResult.events.length > 0) {
      const eventsToInsert = worldResult.events.map(event => ({
        world_id: worldId,
        year: event.year,
        title: event.title,
        description: event.description,
        impact: event.impact,
      }));

      const { error: insertEventsError } = await supabase
        .from('events')
        .insert(eventsToInsert);

      if (insertEventsError) {
        throw new Error(`Failed to insert events: ${insertEventsError.message}`);
      }
    }

    // ==========================================
    // Step 2 — Generate personas
    // ==========================================
    const worldContext = "World: " + worldResult.name + ". Era: " + worldResult.era + ". Prompt: " + userPrompt;
    const personaPrompt = buildPersonaPrompt(worldContext);
    const personaResultRaw = await callGemini(personaPrompt);

    if (!Array.isArray(personaResultRaw)) {
      throw new Error('Invalid response from Gemini for personas: expected an array.');
    }

    const personaResult = personaResultRaw as Array<{
      name: string;
      handle: string;
      bio: string;
      role: any;
      followers_count: number;
      following_count: number;
      influence_score: number;
      interests: string[];
      personality: string;
    }>;

    const personasToInsert = personaResult.map(p => ({
      world_id: worldId,
      name: p.name,
      handle: p.handle,
      avatar: "",
      bio: p.bio,
      role: p.role,
      followers_count: p.followers_count,
      following_count: p.following_count,
      influence_score: p.influence_score,
      interests: p.interests || [],
      personality: p.personality,
    }));

    const { data: insertedPersonas, error: insertPersonasError } = await supabase
      .from('personas')
      .insert(personasToInsert)
      .select();

    if (insertPersonasError) {
      throw new Error(`Failed to insert personas: ${insertPersonasError.message}`);
    }

    if (!insertedPersonas || insertedPersonas.length === 0) {
      throw new Error('Failed to retrieve inserted personas.');
    }

    const personasList = insertedPersonas as Persona[];

    // ==========================================
    // Step 3 — Generate posts
    // ==========================================
    try {
      const personaHandles = personasList.map(p => p.handle);
      const postPrompt = buildPostPrompt(worldContext, personaHandles);
      const postResultRaw = await callGemini(postPrompt);

      if (!Array.isArray(postResultRaw)) {
        throw new Error('Invalid response from Gemini for posts: expected an array.');
      }

      const postResult = postResultRaw as Array<{
        handle: string;
        content: string;
        media_type: any;
        likes_count: number;
        reposts_count: number;
      }>;

      // Build a Map from handle -> persona_id
      const handleToIdMap = new Map<string, string>();
      personasList.forEach(p => {
        handleToIdMap.set(p.handle, p.id);
      });

      const postsToInsert = postResult
        .map(post => {
          const personaId = handleToIdMap.get(post.handle);
          if (!personaId) {
            console.warn(`Handle '${post.handle}' not found in persona map. Skipping post.`);
            return null;
          }
          return {
            world_id: worldId,
            persona_id: personaId,
            content: post.content,
            media_url: null,
            media_type: post.media_type,
            likes_count: post.likes_count,
            reposts_count: post.reposts_count,
          };
        })
        .filter((post): post is Exclude<typeof post, null> => post !== null);

      if (postsToInsert.length > 0) {
        const { error: insertPostsError } = await supabase
          .from('posts')
          .insert(postsToInsert);

        if (insertPostsError) {
          throw new Error(`Failed to insert posts: ${insertPostsError.message}`);
        }
      }
    } catch (postError: any) {
      console.error("Step 3 (Post Generation) failed:", postError.message);
    }

    // ==========================================
    // Step 4 — Mark world as ready
    // ==========================================
    const { error: markReadyError } = await supabase
      .from('worlds')
      .update({ status: 'ready' })
      .eq('id', worldId);

    if (markReadyError) {
      throw new Error(`Failed to mark world as ready: ${markReadyError.message}`);
    }

    console.log("World generation complete for worldId: " + worldId);

  } catch (error: any) {
    console.error("Fatal error during world generation:", error.message);
    try {
      await supabase
        .from('worlds')
        .update({ status: 'failed' })
        .eq('id', worldId);
    } catch (dbError: any) {
      console.error("Failed to update world status to failed:", dbError.message);
    }
  }
}
