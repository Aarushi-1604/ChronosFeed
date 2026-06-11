import { Request, Response, NextFunction } from 'express';
import { worldService } from '../services/worldService';

// GET /api/posts/:id/comments
export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = String(req.params.id);
    const comments = await worldService.getCommentsByPostId(postId);
    res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
};
