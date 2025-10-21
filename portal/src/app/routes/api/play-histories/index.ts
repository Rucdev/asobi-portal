import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { RecordPlaySchema } from '../../../../presentation/validators/PlayHistoryValidator';
import { RecordPlayCommandHandler } from '../../../../application/play-history/commands/RecordPlayCommandHandler';
import { RecordPlayCommand } from '../../../../application/play-history/commands/RecordPlayCommand';
import { GetPlayHistoryQueryHandler } from '../../../../application/play-history/queries/GetPlayHistoryQueryHandler';
import { GetPlayHistoryQuery } from '../../../../application/play-history/queries/GetPlayHistoryQuery';
import { HasPlayedGameQueryHandler } from '../../../../application/play-history/queries/HasPlayedGameQueryHandler';
import { HasPlayedGameQuery } from '../../../../application/play-history/queries/HasPlayedGameQuery';
import { DrizzlePlayHistoryRepository } from '../../../../infrastructure/persistence/drizzle/repositories/DrizzlePlayHistoryRepository';
import { db } from '../../../../infrastructure/persistence/database';

const app = new Hono();

// Get play history for a user
app.get('/', async (c) => {
  try {
    const userIdStr = c.req.query('userId');
    if (!userIdStr) {
      return c.json({ error: 'userId is required' }, 400);
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      return c.json({ error: 'userId must be a number' }, 400);
    }

    const repository = new DrizzlePlayHistoryRepository(db);
    const handler = new GetPlayHistoryQueryHandler(repository);
    const query = new GetPlayHistoryQuery(userId);
    const playHistories = await handler.execute(query);

    return c.json(playHistories);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// Check if a user has played a game
app.get('/check', async (c) => {
  try {
    const userIdStr = c.req.query('userId');
    const gameId = c.req.query('gameId');

    if (!userIdStr || !gameId) {
      return c.json({ error: 'userId and gameId are required' }, 400);
    }

    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
      return c.json({ error: 'userId must be a number' }, 400);
    }

    const repository = new DrizzlePlayHistoryRepository(db);
    const handler = new HasPlayedGameQueryHandler(repository);
    const query = new HasPlayedGameQuery(userId, gameId);
    const hasPlayed = await handler.execute(query);

    return c.json({ hasPlayed });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// Record a play
app.post('/', zValidator('json', RecordPlaySchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const repository = new DrizzlePlayHistoryRepository(db);
    const handler = new RecordPlayCommandHandler(repository);
    const command = new RecordPlayCommand(data.userId, data.gameId);

    const playHistoryId = await handler.execute(command);

    return c.json({ id: playHistoryId }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
});

export default app;
