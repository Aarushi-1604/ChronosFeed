import { supabase } from '../lib/supabase';
import { PersonaWithPosts } from '../types/database';

export const personaService = {
  async getPersonaById(personaId: string): Promise<PersonaWithPosts | null> {
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .single();

    if (personaError) {
      if (personaError.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch persona: ${personaError.message}`);
    }

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(
        'id, content, media_url, media_type, likes_count, reposts_count, created_at'
      )
      .eq('persona_id', personaId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (postsError)
      throw new Error(`Failed to fetch persona posts: ${postsError.message}`);

    return { ...persona, posts: posts ?? [] } as PersonaWithPosts;
  },
};