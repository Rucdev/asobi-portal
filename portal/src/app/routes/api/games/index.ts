import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { PublishGameSchema, AddReviewSchema } from '../../../../presentation/validators/GameValidator';
import { PublishGameCommandHandler } from '../../../../application/game/commands/PublishGameCommandHandler';
import { PublishGameCommand } from '../../../../application/game/commands/PublishGameCommand';
import { ListGamesQueryHandler } from '../../../../application/game/queries/ListGamesQueryHandler';
import { ListGamesQuery } from '../../../../application/game/queries/ListGamesQuery';
import { AddReviewCommandHandler } from '../../../../application/game/commands/AddReviewCommandHandler';
import { AddReviewCommand } from '../../../../application/game/commands/AddReviewCommand';
import { DrizzleGameRepository } from '../../../../infrastructure/persistence/drizzle/repositories/DrizzleGameRepository';
import { DrizzleUserRepository } from '../../../../infrastructure/persistence/drizzle/repositories/DrizzleUserRepository';
import { db } from '../../../../infrastructure/persistence/database';

const app = new Hono();

// List games
app.get('/', async (c) => {
  try {
    const creatorIdStr = c.req.query('creatorId');
    const creatorId = creatorIdStr ? parseInt(creatorIdStr, 10) : undefined;
    const tag = c.req.query('tag');

    const repository = new DrizzleGameRepository(db);
    const handler = new ListGamesQueryHandler(repository);
    const query = new ListGamesQuery(creatorId, tag);
    const games = await handler.execute(query);

    return c.json(games);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// Publish a new game
app.post('/', zValidator('json', PublishGameSchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const gameRepository = new DrizzleGameRepository(db);
    const userRepository = new DrizzleUserRepository(db);
    const handler = new PublishGameCommandHandler(gameRepository, userRepository);
    const command = new PublishGameCommand(
      data.creatorId,
      data.title,
      data.url,
      data.tags
    );

    const gameId = await handler.execute(command);

    return c.json({ id: gameId }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
});

// Add a review to a game
app.post('/reviews', zValidator('json', AddReviewSchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const repository = new DrizzleGameRepository(db);
    const handler = new AddReviewCommandHandler(repository);
    const command = new AddReviewCommand(
      data.gameId,
      data.userId,
      data.content,
      data.rating
    );

    await handler.execute(command);

    return c.json({ message: 'Review added successfully' }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
});

export default app;
