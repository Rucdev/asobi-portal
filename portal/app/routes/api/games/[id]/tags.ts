// app/routes/api/games/[id]/tags.ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { addTagsSchema } from '@/lib/schemas/game';
import { tagsService } from '@/lib/services/tags';

// タグ追加
export const POST = createRoute(zValidator('json', addTagsSchema), async (c) => {
  const gameId = c.req.param('id');
  if (!gameId) {
    return c.json({ error: 'Game ID is required' }, 400);
  }
  const { tags } = c.req.valid('json');
  const user = c.get('user');
  const userId = user?.id ?? 'anonymous';

  try {
    const result = await tagsService.addToGame(gameId, tags, userId);
    return c.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Game not found') {
        return c.json({ error: 'Game not found' }, 404);
      }
      if (error.message === 'Unauthorized') {
        return c.json({ error: 'Unauthorized' }, 403);
      }
    }
    throw error;
  }
});
