// lib/services/sessions.ts
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema/sessions';
import { users } from '@/lib/db/schema/users';
import { eq, lt } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7日間

export const sessionsService = {
  // セッション作成
  async create(userId: string) {
    const sessionId = uuid();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

    await db.insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: now,
    });

    return {
      id: sessionId,
      expiresAt,
    };
  },

  // セッションからユーザー取得
  async getUserBySessionId(sessionId: string) {
    const result = await db
      .select({
        session: sessions,
        user: {
          id: users.id,
          name: users.name,
          userType: users.userType,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .get();

    if (!result) {
      return null;
    }

    // セッション有効期限チェック
    if (result.session.expiresAt < new Date()) {
      await this.delete(sessionId);
      return null;
    }

    return result.user;
  },

  // セッション削除
  async delete(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  },

  // ユーザーの全セッション削除
  async deleteAllForUser(userId: string) {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  },

  // 期限切れセッションをクリーンアップ
  async cleanupExpired() {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  },
};
