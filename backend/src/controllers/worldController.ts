import { Request, Response, NextFunction } from 'express';
import { worldService } from '../services/worldService';
import { generateWorld, generateOperatorPersona } from '../services/generationService';
import { worldTokenUsage } from '../services/geminiService';

// POST /api/worlds
export const createWorld = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = req.body;
    const world = await worldService.createWorldStub(String(prompt).trim());

    // Fire and forget — do not await, do not block the response
    generateWorld(world.id, prompt.trim()).catch((err: Error) => {
      console.error('[GENERATION] Pipeline failed for world:', world.id, err.message);
    });

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
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
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

// GET /api/worlds/:id/status
export const getWorldStatus = async (
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

    res.status(200).json({
      data: {
        worldId: world.id,
        status: world.status,
        name: world.name || null,
        era: world.era || null,
        tokensUsed: worldTokenUsage.get(world.id) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/worlds/:id/operator
export const getOperatorPersona = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const worldId = String(req.params.id);
    const operator = await worldService.getOperatorPersona(worldId);
    res.status(200).json({ data: operator });
  } catch (err) {
    next(err);
  }
};

// POST /api/worlds/:id/operator
export const createOperatorPersona = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const worldId = String(req.params.id);
    const { role } = req.body;

    const world = await worldService.getWorldById(worldId);
    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const existing = await worldService.getOperatorPersona(worldId);
    if (existing) {
      res.status(200).json({ data: existing });
      return;
    }

    const operatorData = await generateOperatorPersona(
      worldId,
      world.prompt,
      world.era,
      world.tech_level,
      world.gov_type,
      String(role).toUpperCase()
    );

    const newOperator = await worldService.createOperatorPersona(
      worldId,
      String(role).toUpperCase(),
      operatorData
    );

    res.status(201).json({ data: newOperator });
  } catch (err) {
    next(err);
  }
};