import { z } from 'zod';

export const RecordPlaySchema = z.object({
  userId: z.number().int().positive(),
  gameId: z.string().uuid(),
});
