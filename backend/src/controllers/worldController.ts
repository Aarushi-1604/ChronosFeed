import { Request, Response, NextFunction } from 'express';
import { worldService } from '../services/worldService';

// POST /api/worlds
export const createWorld = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = req.body;
    const world = await worldService.createWorldStub(String(prompt).trim());

    res.status(202).json({
      data: {
        worldId: world.id,
        status: world.status,
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
    const worlds = await worldService.getAllWorlds();
    res.status(200).json({ data: worlds });
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
    const worldId = String(req.params.id);
    const world = await worldService.getWorldById(worldId);

    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    res.status(200).json({ data: world });
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
    const worldId = String(req.params.id);
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);
    const cursor = req.query.cursor ? String(req.query.cursor) : undefined;

    const world = await worldService.getWorldById(worldId);
    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const result = await worldService.getFeed(worldId, limit, cursor);
    res.status(200).json({ data: result });
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
    const worldId = String(req.params.id);

    const world = await worldService.getWorldById(worldId);
    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const personas = await worldService.getPersonas(worldId);
    res.status(200).json({ data: personas });
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
    const worldId = String(req.params.id);
    const category = req.query.category ? String(req.query.category) : undefined;

    const world = await worldService.getWorldById(worldId);
    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const news = await worldService.getNews(worldId, category);
    res.status(200).json({ data: news });
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
    const worldId = String(req.params.id);

    const world = await worldService.getWorldById(worldId);
    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const ads = await worldService.getAds(worldId);
    res.status(200).json({ data: ads });
  } catch (err) {
    next(err);
  }
};