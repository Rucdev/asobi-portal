// app/routes/api/auth/logout.ts
import { createRoute } from 'honox/factory';
import { deleteCookie, getCookie } from 'hono/cookie';
import { SESSION_COOKIE_NAME } from '@/lib/middleware/auth';
import { sessionsService } from '@/lib/services/sessions';

// POST /api/auth/logout - ログアウト
export const POST = createRoute(async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (sessionId) {
    // セッションを削除
    await sessionsService.delete(sessionId);
  }

  // Cookieを削除
  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: '/',
  });

  return c.json({ success: true });
});
