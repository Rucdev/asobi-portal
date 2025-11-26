// app/routes/api/users/[id].ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateUserSchema } from '@/lib/schemas/user';
import { usersService } from '@/lib/services/users';

const app = new Hono();

// ユーザー詳細取得
app.get('/:id', async (c) => {
  const id = c.req.param('id');

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
app.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');

  try {
    const user = await usersService.update(id, body);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error && error.message === 'Email already exists') {
      return c.json({ error: 'Email already exists' }, 409);
    }
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// ユーザー削除
app.delete('/:id', async (c) => {
  const id = c.req.param('id');

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

export default app;
