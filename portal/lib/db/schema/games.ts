// lib/db/schema/games.ts
import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  url: text('url').notNull(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
}, (table) => ({
  creatorIdIdx: index('idx_games_creator_id').on(table.creatorId),
  titleIdx: index('idx_games_title').on(table.title),
}));

export const gameThumbnails = sqliteTable('game_thumbnails', {
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  imageType: text('image_type').notNull(), // 'icon' | 'screenshot' | 'banner'
  iconUrl: text('icon_url').notNull(), // 一覧用の小さい画像（必須）
  detailUrl: text('detail_url'), // 詳細画面用の大きい画像（オプション）
  altText: text('alt_text').notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
}, (table) => ({
  gameIdIdx: index('idx_game_thumbnails_game_id').on(table.gameId),
  orderIdx: index('idx_game_thumbnails_order').on(table.gameId, table.displayOrder),
  typeIdx: index('idx_game_thumbnails_type').on(table.gameId, table.imageType),
}));

export const gameTags = sqliteTable('game_tags', {
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  tagValue: text('tag_value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => ({
  gameIdIdx: index('idx_game_tags_game_id').on(table.gameId),
  tagValueIdx: index('idx_game_tags_tag_value').on(table.tagValue),
  uniqueGameTag: uniqueIndex('uniq_game_tag').on(table.gameId, table.tagValue),
}));

// 型エクスポート
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameThumbnail = typeof gameThumbnails.$inferSelect;
export type NewGameThumbnail = typeof gameThumbnails.$inferInsert;
export type GameTag = typeof gameTags.$inferSelect;
export type NewGameTag = typeof gameTags.$inferInsert;

// 画像タイプの定数
export const IMAGE_TYPES = {
  ICON: 'icon',
  SCREENSHOT: 'screenshot',
  BANNER: 'banner',
} as const;

export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES];
