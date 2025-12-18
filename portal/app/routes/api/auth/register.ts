// app/routes/api/auth/register.ts
import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { setCookie } from 'hono/cookie';
import { z } from 'zod';
import { SESSION_COOKIE_NAME } from '@/lib/middleware/auth';
import { sessionsService } from '@/lib/services/sessions';
import { usersService } from '@/lib/services/users';

// 登録用スキーマ（userTypeは指定不可、必ず'user'になる）
const registerSchema = z.object({
  name: z.string().min(1, '名前を入力してください').max(100),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// POST /api/auth/register - アカウント登録
export const POST = createRoute(zValidator('json', registerSchema), async (c) => {
  const { name, password } = c.req.valid('json');

  try {
    // 一般ユーザーとして登録（userTypeは必ず'user'）
    const user = await usersService.create({
      name,
      password,
      userType: 'user',
    });

    if (!user) {
      return c.json({ error: 'ユーザーの作成に失敗しました' }, 500);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'Name already exists') {
      return c.json({ error: 'このユーザー名は既に使用されています' }, 400);
    }
    throw error;
  }
});
