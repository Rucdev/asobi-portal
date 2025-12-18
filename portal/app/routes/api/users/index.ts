// app/routes/api/users/index.ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { createUserSchema, listUsersQuerySchema } from '@/lib/schemas/user';
import { usersService } from '@/lib/services/users';

// ユーザー一覧取得
export const GET = createRoute(zValidator('query', listUsersQuerySchema), async (c) => {
  const query = c.req.valid('query');

  try {
    const result = await usersService.list(query);
    return c.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// ユーザー作成
export const POST = createRoute(zValidator('json', createUserSchema), async (c) => {
  const body = c.req.valid('json');

  try {
    const user = await usersService.create(body);
    return c.json(user, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message === 'Name already exists') {
      return c.json({ error: 'この名前は既に使用されています' }, 409);
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
});
