import { createMiddleware } from 'hono/factory';
import { sessionMiddleware, CookieStore } from 'hono-sessions';

export type SessionData = {
  userId?: number;
  userName?: string;
  userType?: string;
};

/**
 * セッションストアの設定
 * 本番環境では Redis などの永続ストアを使用することを推奨
 */
const store = new CookieStore();

/**
 * セッションミドルウェア
 */
export const session = sessionMiddleware({
  store,
  sessionCookieName: 'asobiba_session',
  encryptionKey: process.env.SESSION_SECRET || 'dev-secret-key-please-change-in-production',
  expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
  },
});

/**
 * 認証チェックミドルウェア
 * ログインが必要なエンドポイントに適用する
 */
export const requireAuth = createMiddleware(async (c, next) => {
  const session = c.get('session');

  if (!session || !session.userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
});

/**
 * ロールチェックミドルウェアのファクトリ
 */
export const requireRole = (role: 'player' | 'creator') => {
  return createMiddleware(async (c, next) => {
    const session = c.get('session');

    if (!session || !session.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (session.userType !== role) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403);
    }

    await next();
  });
};
