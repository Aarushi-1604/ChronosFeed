import { Router } from 'express';
import {
  createWorld,
  getWorlds,
  getWorldById,
  getWorldFeed,
  getWorldPersonas,
  getWorldNews,
  getWorldAds,
} from '../controllers/worldController';
import { requireFields } from '../middleware/validateBody';

const router = Router();

// POST /api/worlds
router.post('/', requireFields(['prompt']), createWorld);

// GET /api/worlds
router.get('/', getWorlds);

// GET /api/worlds/:id
router.get('/:id', getWorldById);

// GET /api/worlds/:id/feed
router.get('/:id/feed', getWorldFeed);

// GET /api/worlds/:id/personas
router.get('/:id/personas', getWorldPersonas);

// GET /api/worlds/:id/news
router.get('/:id/news', getWorldNews);

// GET /api/worlds/:id/ads
router.get('/:id/ads', getWorldAds);

export default router;