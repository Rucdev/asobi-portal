import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { UpdateReviewSchema } from '../../../../presentation/validators/GameValidator';
import { GetGameQueryHandler } from '../../../../application/game/queries/GetGameQueryHandler';
import { GetGameQuery } from '../../../../application/game/queries/GetGameQuery';
import { UpdateReviewCommandHandler } from '../../../../application/game/commands/UpdateReviewCommandHandler';
import { UpdateReviewCommand } from '../../../../application/game/commands/UpdateReviewCommand';
import { DrizzleGameRepository } from '../../../../infrastructure/persistence/drizzle/repositories/DrizzleGameRepository';
import { db } from '../../../../infrastructure/persistence/database';

const app = new Hono();

// Get a single game
app.get('/', async (c) => {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Game ID is required' }, 400);
    }

    const repository = new DrizzleGameRepository(db);
    const handler = new GetGameQueryHandler(repository);
    const query = new GetGameQuery(id);
    const game = await handler.execute(query);

    if (!game) {
      return c.json({ error: 'Game not found' }, 404);
    }

    return c.json(game);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// Update a review
app.put('/reviews', zValidator('json', UpdateReviewSchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const repository = new DrizzleGameRepository(db);
    const handler = new UpdateReviewCommandHandler(repository);
    const command = new UpdateReviewCommand(
      data.gameId,
      data.userId,
      data.content,
      data.rating
    );

    await handler.execute(command);

    return c.json({ message: 'Review updated successfully' });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
});

export default app;
