// lib/middleware/auth.ts
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { sessionsService } from '@/lib/services/sessions';

export const SESSION_COOKIE_NAME = 'session_id';

// 認証不要のパス
const PUBLIC_PATHS = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

// 認証ミドルウェア
export const authMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;

  // 静的ファイルとfaviconは除外
  if (path.startsWith('/app/') || path === '/favicon.ico' || path.startsWith('/uploads/')) {
    return next();
  }

  // 公開パスはスキップ
  if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))) {
    return next();
  }

  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    // APIリクエストは401を返す
    if (path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    // それ以外はログインページにリダイレクト
    return c.redirect('/login');
  }

  const user = await sessionsService.getUserBySessionId(sessionId);

  if (!user) {
    // APIリクエストは401を返す
    if (path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    // それ以外はログインページにリダイレクト
    return c.redirect('/login');
  }

  // ユーザー情報をコンテキストに設定
  c.set('user', user);
  c.set('sessionId', sessionId);

  return next();
});

// 現在のユーザーを取得するヘルパー（認証チェック済みルートで使用）
export function getCurrentUser(c: any) {
  return c.get('user') as {
    id: string;
    name: string;
    userType: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
  } | undefined;
}
