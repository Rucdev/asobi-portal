// lib/schemas/user.ts
import { z } from 'zod';

// ユーザー作成
export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
  userType: z.enum(['admin', 'user']).default('user'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ユーザー更新
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
  userType: z.enum(['admin', 'user']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ユーザーログイン
export const loginSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

// クエリパラメータ
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  userType: z.enum(['admin', 'user']).optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
