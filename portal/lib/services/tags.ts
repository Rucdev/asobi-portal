// lib/services/tags.ts
import { db } from '../db';
import { games, gameTags } from '../db/schema/games';
import { eq } from 'drizzle-orm';
import { generateId } from '../utils/uuid';

export const tagsService = {
  // 全タグ取得（ユニーク）
  async listAll() {
    const result = await db
      .select({ tagValue: gameTags.tagValue })
      .from(gameTags)
      .groupBy(gameTags.tagValue)
      .orderBy(gameTags.tagValue);

    return result.map(r => r.tagValue);
  },

  // ゲームにタグ追加
  async addToGame(gameId: string, tags: string[], userId: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .get();

    if (!game) throw new Error('Game not found');
    if (game.creatorId !== userId) throw new Error('Unauthorized');

    const now = new Date();

    // 既存のタグを取得
    const existing = await db
      .select()
      .from(gameTags)
      .where(eq(gameTags.gameId, gameId));

    const existingTagValues = existing.map(t => t.tagValue);

    // 新しいタグのみ追加
    const newTags = tags.filter(tag => !existingTagValues.includes(tag));

    if (newTags.length > 0) {
      await db.insert(gameTags).values(
        newTags.map(tag => ({
          id: generateId(),
          gameId,
          tagValue: tag,
          createdAt: now,
        }))
      );
    }

    return this.getByGame(gameId);
  },

  // ゲームのタグ取得
  async getByGame(gameId: string) {
    return db
      .select()
      .from(gameTags)
      .where(eq(gameTags.gameId, gameId));
  },

  // タグ削除
  async removeFromGame(gameId: string, tagId: string, userId: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .get();

    if (!game) throw new Error('Game not found');
    if (game.creatorId !== userId) throw new Error('Unauthorized');

    await db.delete(gameTags).where(eq(gameTags.id, tagId));
  },
};
