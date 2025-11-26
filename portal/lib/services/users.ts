// lib/services/users.ts
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq, desc, like, and, or } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

export const usersService = {
  // ユーザー一覧取得
  async list(options: {
    page?: number;
    limit?: number;
    search?: string;
    userType?: 'admin' | 'user';
  } = {}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        userType: users.userType,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    // ユーザータイプでフィルタ
    if (options.userType) {
      conditions.push(eq(users.userType, options.userType));
    }

    // 名前またはメールで検索
    if (options.search) {
      conditions.push(
        or(
          like(users.name, `%${options.search}%`),
          like(users.email, `%${options.search}%`)
        )!
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;

    // 総数を取得
    let countQuery = db
      .select({ count: users.id })
      .from(users);

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)!);
    }

    const countResult = await countQuery;
    const total = countResult.length;

    return {
      users: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ユーザー詳細取得（パスワードハッシュを除く）
  async findById(id: string) {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        userType: users.userType,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .get();

    return user || null;
  },

  // メールでユーザー検索（認証用、パスワードハッシュ含む）
  async findByEmail(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    return user || null;
  },

  // ユーザー作成
  async create(input: {
    name: string;
    email: string;
    password: string;
    userType?: 'admin' | 'user';
  }) {
    // メール重複チェック
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const userId = uuid();
    const now = new Date();

    // パスワードハッシュ化（bcryptjsを使用）
    const passwordHash = await bcrypt.hash(input.password, 10);

    await db.insert(users).values({
      id: userId,
      name: input.name,
      email: input.email,
      passwordHash,
      userType: input.userType ?? 'user',
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(userId);
  },

  // ユーザー更新
  async update(
    id: string,
    input: {
      name?: string;
      email?: string;
      password?: string;
      userType?: 'admin' | 'user';
    }
  ) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!user) {
      return null;
    }

    // メール変更時の重複チェック
    if (input.email && input.email !== user.email) {
      const existing = await this.findByEmail(input.email);
      if (existing) {
        throw new Error('Email already exists');
      }
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.userType !== undefined) updateData.userType = input.userType;

    // パスワード更新時はハッシュ化
    if (input.password) {
      updateData.passwordHash = await bcrypt.hash(input.password, 10);
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id));

    return this.findById(id);
  },

  // ユーザー削除
  async delete(id: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!user) {
      throw new Error('User not found');
    }

    await db.delete(users).where(eq(users.id, id));
  },

  // パスワード検証
  async verifyPassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // パスワードハッシュを除いて返す
    return this.findById(user.id);
  },
};
