export type WorldStatus = 'generating' | 'ready' | 'failed';

export type PersonaRole = 'INFLUENCER' | 'SCIENTIST' | 'POLITICIAN' | 'BRAND';

export type MediaType = 'IMAGE' | 'TEXT' | 'MEME';

export type NewsCategory =
  | 'POLITICS'
  | 'SCIENCE'
  | 'BUSINESS'
  | 'CULTURE'
  | 'TECHNOLOGY';

export interface World {
  id: string;
  prompt: string;
  name: string;
  summary: string;
  era: string;
  tech_level: string;
  gov_type: string;
  status: WorldStatus;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  world_id: string;
  year: string;
  title: string;
  description: string;
  impact: string;
}

export interface Persona {
  id: string;
  world_id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  role: PersonaRole;
  followers_count: number;
  following_count: number;
  influence_score: number;
  interests: string[];
  personality: string;
}

export interface PersonaSummary {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: PersonaRole;
  influence_score: number;
}

export interface Post {
  id: string;
  world_id: string;
  persona_id: string;
  content: string;
  media_url: string | null;
  media_type: MediaType | null;
  likes_count: number;
  reposts_count: number;
  created_at: string;
}

export interface PostWithPersona extends Post {
  persona: PersonaSummary;
}

export interface Comment {
  id: string;
  post_id: string;
  persona_id: string;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface News {
  id: string;
  world_id: string;
  title: string;
  content: string;
  category: NewsCategory;
  publisher: string;
  created_at: string;
}

export interface Ad {
  id: string;
  world_id: string;
  company_name: string;
  tagline: string;
  description: string;
  image_url: string | null;
  price: string | null;
  created_at: string;
}

export interface WorldWithEvents extends World {
  events: Event[];
}

export interface PostSummary {
  id: string;
  content: string;
  media_url: string | null;
  media_type: MediaType | null;
  likes_count: number;
  reposts_count: number;
  created_at: string;
}

export interface PersonaWithPosts extends Persona {
  posts: PostSummary[];
}