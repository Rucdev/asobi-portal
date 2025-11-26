// app/routes/api/users/index.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserSchema, listUsersQuerySchema } from '@/lib/schemas/user';
import { usersService } from '@/lib/services/users';

const app = new Hono();

// ユーザー一覧取得
app.get('/', zValidator('query', listUsersQuerySchema), async (c) => {
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
app.post('/', zValidator('json', createUserSchema), async (c) => {
  const body = c.req.valid('json');

  try {
    const user = await usersService.create(body);
    return c.json(user, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message === 'Email already exists') {
      return c.json({ error: 'Email already exists' }, 409);
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

export default app;
