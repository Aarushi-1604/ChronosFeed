import { Router } from 'express';
import { getPostComments } from '../controllers/postController';

const router = Router();

// GET /api/posts/:id/comments
router.get('/:id/comments', getPostComments);

export default router;
