// lib/services/games.ts
import { db } from '../db';
import { games, gameThumbnails, gameTags } from '../db/schema/games';
import { eq, desc, like, and, inArray } from 'drizzle-orm';
import { generateId } from '../utils/uuid';

export const gamesService = {
  // ゲーム一覧取得
  async list(options: {
    page?: number;
    limit?: number;
    tag?: string;
    search?: string;
  } = {}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let query = db
      .select()
      .from(games)
      .orderBy(desc(games.createdAt))
      .limit(limit)
      .offset(offset);

    // タグでフィルタ
    if (options.tag) {
      const gamesWithTag = await db
        .select({ gameId: gameTags.gameId })
        .from(gameTags)
        .where(eq(gameTags.tagValue, options.tag));

      const gameIds = gamesWithTag.map(g => g.gameId);
      if (gameIds.length === 0) return { games: [], total: 0 };

      query = query.where(inArray(games.id, gameIds)) as any;
    }

    // タイトルで検索
    if (options.search) {
      query = query.where(like(games.title, `%${options.search}%`)) as any;
    }

    const result = await query;

    // サムネイルとタグも取得
    const gamesWithDetails = await Promise.all(
      result.map(async (game) => ({
        ...game,
        thumbnails: await db
          .select()
          .from(gameThumbnails)
          .where(eq(gameThumbnails.gameId, game.id))
          .orderBy(gameThumbnails.displayOrder),
        tags: await db
          .select()
          .from(gameTags)
          .where(eq(gameTags.gameId, game.id)),
      }))
    );

    return {
      games: gamesWithDetails,
      total: gamesWithDetails.length,
    };
  },

  // ゲーム詳細取得
  async findById(id: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, id))
      .get();

    if (!game) return null;

    const thumbnails = await db
      .select()
      .from(gameThumbnails)
      .where(eq(gameThumbnails.gameId, id))
      .orderBy(gameThumbnails.displayOrder);

    const tags = await db
      .select()
      .from(gameTags)
      .where(eq(gameTags.gameId, id));

    return {
      ...game,
      thumbnails,
      tags,
    };
  },

  // ゲーム作成
  async create(input: {
    title: string;
    description: string;
    url: string;
    creatorId: string;
    tags?: string[];
  }) {
    const gameId = generateId();
    const now = new Date();

    // ゲーム作成
    await db.insert(games).values({
      id: gameId,
      title: input.title,
      description: input.description,
      url: input.url,
      creatorId: input.creatorId,
      createdAt: now,
      updatedAt: now,
    });

    // タグ追加
    if (input.tags && input.tags.length > 0) {
      await db.insert(gameTags).values(
        input.tags.map(tag => ({
          id: generateId(),
          gameId,
          tagValue: tag,
          createdAt: now,
        }))
      );
    }

    return this.findById(gameId);
  },

  // ゲーム更新
  async update(
    id: string,
    input: {
      title?: string;
      description?: string;
      url?: string;
    },
    userId: string
  ) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, id))
      .get();

    if (!game) return null;
    if (game.creatorId !== userId) {
      throw new Error('Unauthorized');
    }

    await db
      .update(games)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(games.id, id));

    return this.findById(id);
  },

  // ゲーム削除
  async delete(id: string, userId: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, id))
      .get();

    if (!game) {
      throw new Error('Game not found');
    }
    if (game.creatorId !== userId) {
      throw new Error('Unauthorized');
    }

    await db.delete(games).where(eq(games.id, id));
  },
};
