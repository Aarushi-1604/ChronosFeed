import { Request, Response, NextFunction } from 'express';

// Stub persona used inside post responses
const STUB_PERSONA = {
  id: 'stub-persona-id',
  name: 'Charles Babbage III',
  handle: 'steam_coder_99',
  avatar: '',
  role: 'SCIENTIST',
  influence_score: 87,
};

// Stub world used in world responses
const STUB_WORLD = {
  id: 'stub-world-id',
  prompt: 'What if the internet was invented in 1890?',
  name: 'The Victorian Web',
  summary:
    'In 1890, Charles Babbage completed the Analytical Engine, leading to a primitive steam-powered global network.',
  era: 'Victorian Cyberpunk',
  tech_level: 'Mechanical steam computation, punch-card data transfer',
  gov_type: 'Corporatist Monarchy',
  status: 'ready',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  events: [
    {
      id: 'stub-event-1',
      world_id: 'stub-world-id',
      year: '1890',
      title: 'The Analytical Engine Completed',
      description:
        'Babbage finalizes the Analytical Engine with funding from the Crown.',
      impact:
        'Triggered a computing revolution 60 years ahead of real history.',
    },
    {
      id: 'stub-event-2',
      world_id: 'stub-world-id',
      year: '1895',
      title: 'The Mechanical Net Goes Live',
      description:
        'The first inter-city punch-card telegraph network connects London and Edinburgh.',
      impact: 'Enabled real-time financial and political communication.',
    },
  ],
};

const STUB_POST = {
  id: 'stub-post-id',
  world_id: 'stub-world-id',
  persona_id: 'stub-persona-id',
  content:
    'Just upgraded the central steam-router. Speed is now up to 10 punch-cards per minute! #SteamNet #Innovation',
  media_url: null,
  media_type: 'TEXT',
  likes_count: 420,
  reposts_count: 17,
  created_at: new Date().toISOString(),
  persona: STUB_PERSONA,
};

const STUB_NEWS = {
  id: 'stub-news-id',
  world_id: 'stub-world-id',
  title: 'Steam Parliament Passes Net Expansion Act',
  content:
    'The Imperial Steam Parliament voted 312-88 to fund expansion of the Mechanical Net to all major colonies.',
  category: 'POLITICS',
  publisher: 'The Chronos Daily',
  created_at: new Date().toISOString(),
};

const STUB_AD = {
  id: 'stub-ad-id',
  world_id: 'stub-world-id',
  company_name: 'BabbageCo Steam Solutions',
  tagline: 'Compute at the speed of steam.',
  description:
    'Our Mark VII Analytical Coprocessor handles 500 calculations per hour. Order yours today.',
  image_url: null,
  price: '3 Sovereigns',
  created_at: new Date().toISOString(),
};

// POST /api/worlds
export const createWorld = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = req.body;
    console.log(`[STUB] createWorld called with prompt: "${prompt}"`);

    res.status(202).json({
      data: {
        worldId: 'stub-world-id',
        status: 'generating',
      },
      message: 'World generation started',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds
export const getWorlds = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('[STUB] getWorlds called');
    res.status(200).json({ data: [STUB_WORLD] });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id
export const getWorldById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[STUB] getWorldById called with id: ${id}`);

    res.status(200).json({ data: STUB_WORLD });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id/feed
export const getWorldFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);
    console.log(`[STUB] getWorldFeed called — worldId: ${id}, limit: ${limit}`);

    res.status(200).json({
      data: {
        posts: Array(limit).fill(STUB_POST),
        nextCursor: new Date(Date.now() - 3600000).toISOString(),
        hasMore: true,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id/personas
export const getWorldPersonas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[STUB] getWorldPersonas called — worldId: ${id}`);

    res.status(200).json({
      data: [
        {
          ...STUB_PERSONA,
          world_id: 'stub-world-id',
          bio: 'Lead engineer at His Majesty\'s Steam-Net Registry.',
          followers_count: 14200,
          following_count: 88,
          interests: ['gears', 'punch-cards', 'tea'],
          personality: 'Eccentric, highly technical, easily excited',
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id/news
export const getWorldNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    console.log(
      `[STUB] getWorldNews called — worldId: ${id}, category: ${category || 'all'}`
    );

    res.status(200).json({ data: [STUB_NEWS] });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id/ads
export const getWorldAds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[STUB] getWorldAds called — worldId: ${id}`);

    res.status(200).json({ data: [STUB_AD] });
  } catch (err) {
    next(err);
  }
};