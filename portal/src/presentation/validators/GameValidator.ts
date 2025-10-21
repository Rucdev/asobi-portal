import { z } from 'zod';

export const PublishGameSchema = z.object({
  creatorId: z.number().int().positive(),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  tags: z.array(z.string().max(50)).max(10),
});

export const AddReviewSchema = z.object({
  gameId: z.string().uuid(),
  userId: z.number().int().positive(),
  content: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
});

export const UpdateReviewSchema = z.object({
  gameId: z.string().uuid(),
  userId: z.number().int().positive(),
  content: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
});
