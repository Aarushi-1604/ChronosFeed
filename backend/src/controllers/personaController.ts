import { Request, Response, NextFunction } from 'express';
import { personaService } from '../services/personaService';

// GET /api/personas/:id
export const getPersonaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const persona = await personaService.getPersonaById(String(req.params.id));
    if (!persona) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    res.status(200).json({ data: persona });
  } catch (err) {
    next(err);
  }
};