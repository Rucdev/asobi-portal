// app/routes/api/games/[id]/tags.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { addTagsSchema } from '@/lib/schemas/game';
import { tagsService } from '@/lib/services/tags';

const app = new Hono();

// タグ追加
app.post('/:id/tags', zValidator('json', addTagsSchema), async (c) => {
  const gameId = c.req.param('id');
  const { tags } = c.req.valid('json');
  // TODO: セッションから取得
  const userId = 'test-user-id';

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

// タグ削除
app.delete('/:id/tags/:tagId', async (c) => {
  const gameId = c.req.param('id');
  const tagId = c.req.param('tagId');
  // TODO: セッションから取得
  const userId = 'test-user-id';

  try {
    await tagsService.removeFromGame(gameId, tagId, userId);
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
