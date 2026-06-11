import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

class MockSupabaseClient {
  from(table: string) {
    const chain = {
      insert: (data: any) => {
        const row = { id: 'mock-id-' + Math.random().toString(36).substring(2, 6), created_at: new Date().toISOString(), ...data };
        return {
          select: () => ({
            single: () => Promise.resolve({ data: row, error: null })
          })
        };
      },
      update: (data: any) => {
        return {
          eq: (col: string, val: any) => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: val, ...data }, error: null })
            })
          })
        };
      },
      select: (fields?: string) => {
        let data: any[] = [];
        if (table === 'worlds') {
          data = [
            {
              id: 'stub-world-id',
              prompt: 'What if the internet was invented in 1890?',
              name: 'The Victorian Web (Offline Fallback)',
              summary: 'Charles Babbage completes the Analytical Engine under Royal charter, launching steam computing 60 years ahead of schedule.',
              era: 'Victorian Cyberpunk',
              tech_level: 'Mechanical steam computation, punch-card routers',
              gov_type: 'Corporatist Monarchy',
              status: 'ready',
              created_at: new Date().toISOString(),
            }
          ];
        } else if (table === 'personas') {
          data = [
            {
              id: 'stub-persona-id',
              name: 'Charles Babbage III',
              handle: 'steam_coder_99',
              avatar: '',
              bio: 'Chief mechanical compiler for the British Crown net.',
              role: 'SCIENTIST',
              influence_score: 87,
            }
          ];
        } else if (table === 'posts') {
          data = [
            {
              id: 'seed-post-1',
              world_id: 'stub-world-id',
              persona_id: 'stub-persona-id',
              content: 'Just upgraded the central steam-router. Speed is now up to 10 punch-cards per minute! Mechanical computation has never felt so fast. #SteamNet #Innovation',
              likes_count: 420,
              reposts_count: 17,
              created_at: new Date().toISOString(),
              persona: {
                id: 'stub-persona-id',
                name: 'Charles Babbage III',
                handle: 'steam_coder_99',
                avatar: '',
                role: 'SCIENTIST',
                influence_score: 87,
              }
            }
          ];
        } else if (table === 'news') {
          data = [
            {
              id: 'seed-news-1',
              world_id: 'stub-world-id',
              title: 'Steam Parliament Passes Net Expansion Act',
              content: 'The Imperial Steam Parliament voted 312-88 to fund expansion of the Mechanical Net to all major colonies, sparking a surge in stock value for BabbageCo.',
              category: 'POLITICS',
              publisher: 'The Chronos Daily',
              created_at: new Date().toISOString(),
            }
          ];
        } else if (table === 'ads') {
          data = [
            {
              id: 'seed-ad-1',
              world_id: 'stub-world-id',
              company_name: 'BabbageCo Steam Solutions',
              tagline: 'Compute at the speed of steam.',
              description: 'Our Mark VII Analytical Coprocessor handles 500 mechanical calculations per hour. Command gears to solve your ledgers. Order today from BabbageCo.',
              price: '3 Sovereigns',
              created_at: new Date().toISOString(),
            }
          ];
        } else if (table === 'comments') {
          data = [
            {
              id: 'seed-comment-1',
              post_id: 'seed-post-1',
              persona_id: 'stub-persona-id',
              content: 'Excellent progress, Charles. The Empire is pleased.',
              likes_count: 24,
              created_at: new Date().toISOString(),
              persona: {
                id: 'stub-persona-id',
                name: 'Ada Lovelace Jr.',
                handle: 'ada_coder',
                avatar: '',
                role: 'SCIENTIST',
                influence_score: 95,
              }
            }
          ];
        }

        const queryChain = {
          eq: (col: string, val: any) => {
            let filtered = [...data];
            if (col === 'world_id' || col === 'post_id') {
              // Keep fallback items
            } else if (col === 'id') {
              filtered = data.filter(x => x.id === val);
            }
            const innerChain = {
              order: () => innerChain,
              limit: () => Promise.resolve({ data: filtered, error: null }),
              single: () => Promise.resolve({ data: filtered[0] || null, error: filtered[0] ? null : { code: 'PGRST116', message: 'Not found' } }),
              then: (onfulfilled: any) => Promise.resolve({ data: filtered, error: null }).then(onfulfilled)
            };
            return innerChain;
          },
          order: () => queryChain,
          limit: () => Promise.resolve({ data, error: null }),
          single: () => Promise.resolve({ data: data[0] || null, error: null }),
          then: (onfulfilled: any) => Promise.resolve({ data, error: null }).then(onfulfilled)
        };
        return queryChain;
      }
    };
    return chain;
  }
}

let supabaseClient: any;

if (!supabaseUrl || !supabaseServiceKey) {
  if (isDev) {
    console.warn(
      '⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in development mode. Activating offline fallback mock client.'
    );
    supabaseClient = new MockSupabaseClient();
  } else {
    throw new Error(
      'CRITICAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in production mode. Sandbox fallback disabled.'
    );
  }
} else {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabase = supabaseClient;