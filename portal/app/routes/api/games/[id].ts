// app/routes/api/games/[id].ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateGameSchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

const app = new Hono();

// ゲーム詳細取得
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const game = await gamesService.findById(id);

  if (!game) {
    return c.json({ error: 'Game not found' }, 404);
  }

  return c.json(game);
});

// ゲーム更新
app.put('/:id', zValidator('json', updateGameSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  // TODO: セッションから取得
  const userId = 'test-user-id';

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
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  // TODO: セッションから取得
  const userId = 'test-user-id';

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

export default app;
