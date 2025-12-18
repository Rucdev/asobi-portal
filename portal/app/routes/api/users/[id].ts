// app/routes/api/users/[id].ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { updateUserSchema } from '@/lib/schemas/user';
import { usersService } from '@/lib/services/users';

// ユーザー詳細取得
export const GET = createRoute(async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  try {
    const user = await usersService.findById(id);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// ユーザー更新
export const PUT = createRoute(zValidator('json', updateUserSchema), async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'User ID is required' }, 400);
  }
  const body = c.req.valid('json');

  try {
    const user = await usersService.update(id, body);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error && error.message === 'Name already exists') {
      return c.json({ error: 'この名前は既に使用されています' }, 409);
    }
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// ユーザー削除
export const DELETE = createRoute(async (c) => {
  const id = c.req.param('id');
  if (!id) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  try {
    await usersService.delete(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});
