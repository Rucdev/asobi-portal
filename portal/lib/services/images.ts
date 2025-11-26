// lib/services/images.ts
import { db } from '../db';
import { games, gameThumbnails, type ImageType } from '../db/schema/games';
import { eq, and } from 'drizzle-orm';
import { generateId } from '../utils/uuid';
import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = './public/uploads/games';

// 画像サイズ設定
const IMAGE_SIZES = {
  icon: {
    thumb: { width: 128, height: 128 },
    detail: { width: 256, height: 256 },
  },
  screenshot: {
    thumb: { width: 400, height: 300 },
    detail: { width: 1920, height: 1080 },
  },
  banner: {
    thumb: { width: 600, height: 200 },
    detail: { width: 1200, height: 400 },
  },
} as const;

export const imagesService = {
  // 画像アップロード
  async upload(
    gameId: string,
    file: File | Buffer,
    imageType: ImageType,
    altText: string,
    userId: string
  ) {
    // 権限チェック
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .get();

    if (!game) throw new Error('Game not found');
    if (game.creatorId !== userId) throw new Error('Unauthorized');

    // 現在の画像数を確認
    const existing = await db
      .select()
      .from(gameThumbnails)
      .where(eq(gameThumbnails.gameId, gameId));

    if (existing.length >= 20) {
      throw new Error('Maximum 20 images allowed');
    }

    const imageId = generateId();
    const gameDir = path.join(UPLOAD_DIR, gameId);
    const typeDir = path.join(gameDir, `${imageType}s`);

    // ディレクトリ作成
    await fs.mkdir(typeDir, { recursive: true });

    // ファイルをBufferに変換
    const buffer = file instanceof Buffer
      ? file
      : Buffer.from(await file.arrayBuffer());

    // Sharp を動的にインポート
    const sharp = (await import('sharp')).default;

    // 画像処理（Sharp）
    const sizes = IMAGE_SIZES[imageType];

    // アイコン画像（一覧用）生成
    const thumbFilename = `${imageId}_thumb.webp`;
    await sharp(buffer)
      .resize(sizes.thumb.width, sizes.thumb.height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(typeDir, thumbFilename));

    const iconUrl = `/uploads/games/${gameId}/${imageType}s/${thumbFilename}`;

    // 詳細画像（オプション）生成
    let detailUrl: string | null = null;
    if (sizes.detail) {
      const detailFilename = `${imageId}_detail.webp`;
      await sharp(buffer)
        .resize(sizes.detail.width, sizes.detail.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 90 })
        .toFile(path.join(typeDir, detailFilename));

      detailUrl = `/uploads/games/${gameId}/${imageType}s/${detailFilename}`;
    }

    // DBに保存
    const thumbnail = {
      id: imageId,
      gameId,
      imageType,
      iconUrl,
      detailUrl,
      altText,
      displayOrder: existing.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(gameThumbnails).values(thumbnail);

    return thumbnail;
  },

  // 画像削除
  async remove(gameId: string, imageId: string, userId: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .get();

    if (!game) throw new Error('Game not found');
    if (game.creatorId !== userId) throw new Error('Unauthorized');

    // 画像情報取得
    const image = await db
      .select()
      .from(gameThumbnails)
      .where(
        and(
          eq(gameThumbnails.id, imageId),
          eq(gameThumbnails.gameId, gameId)
        )
      )
      .get();

    if (!image) throw new Error('Image not found');

    // ファイル削除
    const iconPath = path.join('.', 'public', image.iconUrl);
    const detailPath = image.detailUrl
      ? path.join('.', 'public', image.detailUrl)
      : null;

    try {
      await fs.unlink(iconPath);
      if (detailPath) {
        await fs.unlink(detailPath);
      }
    } catch (error) {
      console.error('Failed to delete image files:', error);
    }

    // DB から削除
    await db
      .delete(gameThumbnails)
      .where(eq(gameThumbnails.id, imageId));

    // 残りの画像の順序を再調整
    const remaining = await db
      .select()
      .from(gameThumbnails)
      .where(eq(gameThumbnails.gameId, gameId))
      .orderBy(gameThumbnails.displayOrder);

    await Promise.all(
      remaining.map((img, index) =>
        db
          .update(gameThumbnails)
          .set({ displayOrder: index, updatedAt: new Date() })
          .where(eq(gameThumbnails.id, img.id))
      )
    );
  },

  // ゲームの全画像取得
  async getByGame(gameId: string) {
    return db
      .select()
      .from(gameThumbnails)
      .where(eq(gameThumbnails.gameId, gameId))
      .orderBy(gameThumbnails.displayOrder);
  },

  // タイプ別画像取得
  async getByType(gameId: string, imageType: ImageType) {
    return db
      .select()
      .from(gameThumbnails)
      .where(
        and(
          eq(gameThumbnails.gameId, gameId),
          eq(gameThumbnails.imageType, imageType)
        )
      )
      .orderBy(gameThumbnails.displayOrder);
  },

  // 順序変更
  async reorder(gameId: string, thumbnailIds: string[], userId: string) {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .get();

    if (!game) throw new Error('Game not found');
    if (game.creatorId !== userId) throw new Error('Unauthorized');

    await db.transaction(async (tx) => {
      await Promise.all(
        thumbnailIds.map((id, index) =>
          tx
            .update(gameThumbnails)
            .set({ displayOrder: index })
            .where(
              and(
                eq(gameThumbnails.id, id),
                eq(gameThumbnails.gameId, gameId)
              )
            )
        )
      );
    });
  },
};
