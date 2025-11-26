// lib/db/seed.ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { users } from './schema/users';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// Bun標準のSQLiteを使用
const sqlite = new Database(process.env.DB_PATH || './data/portal.db');
const db = drizzle(sqlite, { schema });

// テストユーザーを作成
export async function seed() {
  const testUserId = 'test-user-id';

  // 既存のユーザーをチェック
  const existingUser = await db.select().from(users).where(eq(users.id, testUserId)).get();

  if (!existingUser) {
    await db.insert(users).values({
      id: testUserId,
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'test-hash', // TODO: 実際のハッシュ化を実装
      userType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Test user created');
  } else {
    console.log('Test user already exists');
  }
}

// スクリプトとして直接実行された場合
if (import.meta.main) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
