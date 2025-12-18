// app/routes/api/auth/login.ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { setCookie } from 'hono/cookie';
import { loginSchema } from '@/lib/schemas/user';
import { usersService } from '@/lib/services/users';
import { sessionsService } from '@/lib/services/sessions';
import { SESSION_COOKIE_NAME } from '@/lib/middleware/auth';

// POST /api/auth/login - ログイン
export const POST = createRoute(zValidator('json', loginSchema), async (c) => {
  const { name, password } = c.req.valid('json');

  const user = await usersService.verifyPassword(name, password);

  if (!user) {
    return c.json({ error: 'ユーザー名またはパスワードが正しくありません' }, 401);
  }

  // セッション作成
  const session = await sessionsService.create(user.id);

  // セッションCookieを設定
  setCookie(c, SESSION_COOKIE_NAME, session.id, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    expires: session.expiresAt,
  });

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      userType: user.userType,
    },
  });
});
