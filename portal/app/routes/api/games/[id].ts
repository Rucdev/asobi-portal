// app/routes/api/games/[id].ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { updateGameSchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

// ゲーム詳細取得
export const GET = createRoute(async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'Game ID is required' }, 400);
  }
  const game = await gamesService.findById(id);

  if (!game) {
    return c.json({ error: 'Game not found' }, 404);
  }

  return c.json(game);
});

// ゲーム更新
export const PUT = createRoute(zValidator('json', updateGameSchema), async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'Game ID is required' }, 400);
  }
  const body = c.req.valid('json');
  const user = c.get('user');
  const userId = user?.id ?? 'anonymous';

  try {
    const game = await gamesService.update(id, body, userId);

    if (!game) {
      return c.json({ error: 'Game not found' }, 404);
    }

    return c.json(game);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    throw error;
  }
});

// ゲーム削除
export const DELETE = createRoute(async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'Game ID is required' }, 400);
  }
  const user = c.get('user');
  const userId = user?.id ?? 'anonymous';

  try {
    await gamesService.delete(id, userId);
    return c.json({ success: true });
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
