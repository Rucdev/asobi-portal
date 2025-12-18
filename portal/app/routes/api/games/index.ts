// app/routes/api/games/index.ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { createGameSchema, listGamesQuerySchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

// ゲーム一覧取得
export const GET = createRoute(zValidator('query', listGamesQuerySchema), async (c) => {
  const { page, limit, tag, search } = c.req.valid('query');

  const result = await gamesService.list({ page, limit, tag, search });

  return c.json(result);
});

// ゲーム作成
export const POST = createRoute(zValidator('json', createGameSchema), async (c) => {
  const body = c.req.valid('json');
  const user = c.get('user');
  const userId = user?.id ?? 'unknown';

  const game = await gamesService.create({
    ...body,
    creatorId: userId,
  });

  return c.json(game, 201);
});
