// lib/schemas/game.ts
import { z } from 'zod';

// ゲーム作成
export const createGameSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  url: z.string().url(),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;

// ゲーム更新
export const updateGameSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  url: z.string().url().optional(),
});

export type UpdateGameInput = z.infer<typeof updateGameSchema>;

// タグ追加
export const addTagsSchema = z.object({
  tags: z.array(z.string().min(1).max(50)).min(1).max(20),
});

// サムネイル順序変更
export const reorderThumbnailsSchema = z.object({
  thumbnailIds: z.array(z.string().uuid()).min(1).max(10),
});

// クエリパラメータ
export const listGamesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  tag: z.string().optional(),
  search: z.string().optional(),
});
