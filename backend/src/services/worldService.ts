import { supabase } from '../lib/supabase';
import {
  World,
  WorldWithEvents,
  PostWithPersona,
  Persona,
  News,
  Ad,
  NewsCategory,
} from '../types/database';

export const worldService = {
  async createWorldStub(prompt: string): Promise<World> {
    const { data, error } = await supabase
      .from('worlds')
      .insert({
        prompt,
        name: '',
        summary: '',
        era: '',
        tech_level: '',
        gov_type: '',
        status: 'generating',
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create world: ${error.message}`);
    return data as World;
  },

  async updateWorld(
    worldId: string,
    fields: Partial<Omit<World, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<World> {
    const { data, error } = await supabase
      .from('worlds')
      .update(fields)
      .eq('id', worldId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update world: ${error.message}`);
    return data as World;
  },

  async getAllWorlds(): Promise<World[]> {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch worlds: ${error.message}`);
    return (data as World[]) ?? [];
  },

  async getWorldById(worldId: string): Promise<WorldWithEvents | null> {
    const { data: world, error: worldError } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', worldId)
      .single();

    if (worldError) {
      if (worldError.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch world: ${worldError.message}`);
    }

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('world_id', worldId)
      .order('year', { ascending: true });

    if (eventsError)
      throw new Error(`Failed to fetch events: ${eventsError.message}`);

    return { ...(world as World), events: events ?? [] };
  },

  async getFeed(
    worldId: string,
    limit: number,
    cursor?: string
  ): Promise<{
    posts: PostWithPersona[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    let query = supabase
      .from('posts')
      .select(
        `
        id,
        world_id,
        persona_id,
        content,
        media_url,
        media_type,
        likes_count,
        reposts_count,
        created_at,
        persona:personas (
          id,
          name,
          handle,
          avatar,
          role,
          influence_score
        )
      `
      )
      .eq('world_id', worldId)
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch feed: ${error.message}`);

    const rows = (data ?? []) as unknown as PostWithPersona[];
    const hasMore = rows.length > limit;
    const posts = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && posts.length > 0 ? posts[posts.length - 1].created_at : null;

    return { posts, nextCursor, hasMore };
  },

  async getPersonas(worldId: string): Promise<Persona[]> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('world_id', worldId)
      .order('influence_score', { ascending: false });

    if (error) throw new Error(`Failed to fetch personas: ${error.message}`);
    return (data as Persona[]) ?? [];
  },

  async getNews(worldId: string, category?: string): Promise<News[]> {
    let query = supabase
      .from('news')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category as NewsCategory);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch news: ${error.message}`);
    return (data as News[]) ?? [];
  },

  async getAds(worldId: string): Promise<Ad[]> {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch ads: ${error.message}`);
    return (data as Ad[]) ?? [];
  },
};