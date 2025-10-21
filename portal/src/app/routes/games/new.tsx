import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { PublishGameSchema } from '../../../../presentation/validators/GameValidator';
import { z } from 'zod';

const FormSchema = z.object({
  creatorId: z.string().transform((val) => parseInt(val, 10)),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  tags: z.string().transform((val: string) => {
    if (val.trim().length === 0) return [];
    return val.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
  }),
});

export const POST = createRoute(
  zValidator('form', FormSchema),
  async (c) => {
    const data = c.req.valid('form');
    const baseUrl = c.req.url.split('/games')[0];

    try {
      const response = await fetch(`${baseUrl}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return c.render(
          <div>
            <h1>Error Publishing Game</h1>
            <p>{(error as any).error}</p>
            <a href="/games/new">Try Again</a>
          </div>
        );
      }

      return c.redirect('/games');
    } catch (error) {
      return c.render(
        <div>
          <h1>Error Publishing Game</h1>
          <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
          <a href="/games/new">Try Again</a>
        </div>
      );
    }
  }
);

export default createRoute((c) => {
  return c.render(
    <div>
      <h1>Publish New Game</h1>
      <form method="post">
        <div>
          <label htmlFor="creatorId">Creator ID:</label>
          <input type="number" id="creatorId" name="creatorId" required />
        </div>
        <div>
          <label htmlFor="title">Game Title:</label>
          <input type="text" id="title" name="title" required maxLength={200} />
        </div>
        <div>
          <label htmlFor="url">Game URL:</label>
          <input type="url" id="url" name="url" required />
        </div>
        <div>
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input type="text" id="tags" name="tags" placeholder="action, adventure, puzzle" />
        </div>
        <button type="submit">Publish Game</button>
      </form>
      <p>
        <a href="/games">Back to Games</a>
      </p>
    </div>
  );
});
