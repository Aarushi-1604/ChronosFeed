import { World, WorldFeedResponse, Persona, News, Ad, Comment } from '../types';
import { 
  getMockWorld, 
  getMockPersonas, 
  getMockPersona, 
  getMockFeed, 
  getMockNews, 
  getMockAds, 
  getMockComments 
} from './mock-worlds';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.error) {
        errorMsg = errorJson.error;
      }
    } catch {
      // ignore JSON parse error on non-json error responses
    }
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result.data as T;
}

export const api = {
  // Worlds
  createWorld: (prompt: string) =>
    fetchJson<{ worldId: string; status: 'generating' | 'ready' }>('/api/worlds', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  getWorlds: async () => {
    try {
      return await fetchJson<World[]>('/api/worlds');
    } catch (err) {
      console.warn('API getWorlds failed, using offline mock list:', err);
      const { MOCK_WORLDS } = require('./mock-worlds');
      return MOCK_WORLDS;
    }
  },

  getWorld: async (id: string) => {
    const mock = getMockWorld(id);
    if (mock) return mock;
    return fetchJson<World>(`/api/worlds/${id}`);
  },

  getWorldStatus: async (id: string) => {
    const mock = getMockWorld(id);
    if (mock) {
      return {
        worldId: id,
        status: 'ready' as const,
        name: mock.name,
        era: mock.era,
        tokensUsed: 0,
      };
    }
    return fetchJson<{
      worldId: string;
      status: 'generating' | 'ready' | 'error' | 'failed';
      name: string | null;
      era: string | null;
      tokensUsed?: number;
    }>(`/api/worlds/${id}/status`);
  },

  // Feed
  getWorldFeed: async (id: string, limit = 10, cursor?: string) => {
    const mockFeed = getMockFeed(id);
    if (mockFeed && mockFeed.posts.length > 0) return mockFeed;
    let url = `/api/worlds/${id}/feed?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }
    return fetchJson<WorldFeedResponse>(url);
  },

  // Personas
  getWorldPersonas: async (id: string) => {
    const mock = getMockPersonas(id);
    if (mock && mock.length > 0) return mock;
    return fetchJson<Persona[]>(`/api/worlds/${id}/personas`);
  },

  getPersona: async (id: string) => {
    const mock = getMockPersona(id);
    if (mock) return mock;
    return fetchJson<Persona & { posts: any[] }>(`/api/personas/${id}`);
  },

  // News
  getWorldNews: async (id: string, category?: string) => {
    const mock = getMockNews(id);
    if (mock && mock.length > 0) {
      if (category) {
        return mock.filter(n => n.category === category);
      }
      return mock;
    }
    let url = `/api/worlds/${id}/news`;
    if (category) {
      url += `?category=${category}`;
    }
    return fetchJson<News[]>(url);
  },

  // Ads
  getWorldAds: async (id: string) => {
    const mock = getMockAds(id);
    if (mock && mock.length > 0) return mock;
    return fetchJson<Ad[]>(`/api/worlds/${id}/ads`);
  },

  // Comments
  getPostComments: async (postId: string) => {
    const originalId = postId.includes('-ext-') ? postId.split('-ext-')[0] : postId;
    const mock = getMockComments(originalId);
    if (mock && mock.length > 0) return mock;
    return fetchJson<Comment[]>(`/api/posts/${originalId}/comments`);
  },
};
