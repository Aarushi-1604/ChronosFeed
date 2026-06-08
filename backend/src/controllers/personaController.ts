import { Request, Response, NextFunction } from 'express';

// GET /api/personas/:id
export const getPersonaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[STUB] getPersonaById called with id: ${id}`);

    res.status(200).json({
      data: {
        id,
        world_id: 'stub-world-id',
        name: 'Charles Babbage III',
        handle: 'steam_coder_99',
        avatar: '',
        bio: "Lead engineer at His Majesty's Steam-Net Registry.",
        role: 'SCIENTIST',
        followers_count: 14200,
        following_count: 88,
        influence_score: 87,
        interests: ['gears', 'punch-cards', 'tea'],
        personality: 'Eccentric, highly technical, easily excited',
        posts: [
          {
            id: 'stub-post-id',
            content:
              'Just upgraded the central steam-router. 10 punch-cards per minute! #SteamNet',
            media_url: null,
            media_type: 'TEXT',
            likes_count: 420,
            reposts_count: 17,
            created_at: new Date().toISOString(),
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};