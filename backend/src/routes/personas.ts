import { Router } from 'express';
import { getPersonaById } from '../controllers/personaController';

const router = Router();

// GET /api/personas/:id
router.get('/:id', getPersonaById);

export default router;