// app/routes/api/auth/me.ts
import { createRoute } from 'honox/factory';

// GET /api/auth/me - 現在のユーザー情報取得
export const GET = createRoute(async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      userType: user.userType,
    },
  });
});
