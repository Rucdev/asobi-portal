// app/routes/api/games/index.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createGameSchema, listGamesQuerySchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

const app = new Hono();

// ゲーム一覧取得
app.get('/', zValidator('query', listGamesQuerySchema), async (c) => {
  const { page, limit, tag, search } = c.req.valid('query');

  const result = await gamesService.list({ page, limit, tag, search });

  return c.json(result);
});

// ゲーム作成
app.post('/', zValidator('json', createGameSchema), async (c) => {
  const body = c.req.valid('json');
  // TODO: セッションから取得
  const userId = 'test-user-id';

  const game = await gamesService.create({
    ...body,
    creatorId: userId,
  });

  return c.json(game, 201);
});

export default app;
