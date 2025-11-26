# ゲームポータルアプリケーション - CRUD設計書

## 目次
1. [概要](#概要)
2. [アーキテクチャ概要](#アーキテクチャ概要)
3. [データモデル](#データモデル)
4. [API設計](#api設計)
5. [ディレクトリ構成](#ディレクトリ構成)
6. [実装ガイドライン](#実装ガイドライン)

---

## 概要

### アプリケーションの目的
- 複数のゲームへのリンクと説明を提供するポータルサイト
- [GetHomepage](https://gethomepage.dev/)風のシンプルなUI
- ゲームタイトル、説明、リンク、複数のサムネイル画像の管理

### 設計方針
- **シンプル第一**: ビジネスロジックは最小限、データベース中心の設計
- **変更容易性**: 趣味プロジェクトなので要件変更に柔軟に対応
- **保守性**: レイヤーは最小限（3層: DB/API/UI）
- **高速開発**: Drizzle ORM + Hono + HonoXでサクサク実装

### 技術スタック
- **Runtime**: Bun
- **Web Framework**: Hono + HonoX (SSR)
- **ORM**: Drizzle ORM
- **Database**: SQLite (開発環境) / PostgreSQL or MySQL (本番環境推奨)
- **Frontend**: Tailwind CSS v4
- **Deployment**: Kubernetes (コンテナ)

---

## アーキテクチャ概要

### シンプル3層アーキテクチャ

```mermaid
graph TB
    subgraph "UI Layer (Presentation)"
        Pages[Pages<br/>app/routes/*.tsx]
        Components[Components<br/>app/components/]
        Islands[Islands<br/>app/islands/]
    end

    subgraph "API Layer (Business Logic)"
        APIRoutes[API Routes<br/>app/routes/api/**/*.ts]
        Services[Services<br/>lib/services/]
        Validation[Validation<br/>lib/schemas/]
    end

    subgraph "Data Layer (Persistence)"
        Drizzle[Drizzle ORM<br/>lib/db/]
        Schema[Schema Definitions<br/>lib/db/schema/]
        SQLite[(SQLite Database)]
    end

    Pages --> APIRoutes
    Islands --> APIRoutes
    APIRoutes --> Services
    Services --> Validation
    Services --> Drizzle
    Drizzle --> Schema
    Schema --> SQLite

    style Pages fill:#e1f5ff
    style APIRoutes fill:#fff4e1
    style Drizzle fill:#e1ffe1
```

### レイヤーの責務

| レイヤー | 責務 | 例 |
|---------|------|-----|
| **UI Layer** | ページ表示、ユーザー操作 | ゲーム一覧、詳細ページ |
| **API Layer** | HTTPハンドリング、バリデーション | CRUD API、検索API |
| **Data Layer** | データベースアクセス | Drizzleクエリ、スキーマ定義 |

**依存関係**: UI → API → Data（一方向のみ）

---

## データモデル

### ER図

```mermaid
erDiagram
    users ||--o{ games : creates
    games ||--o{ game_thumbnails : has
    games ||--o{ game_tags : has

    users {
        text id PK
        text name
        text email UK
        text password_hash
        text user_type
        datetime created_at
        datetime updated_at
    }

    games {
        text id PK
        text title
        text description
        text url
        text creator_id FK
        datetime created_at
        datetime updated_at
    }

    game_thumbnails {
        text id PK
        text game_id FK
        text image_type
        text icon_url
        text detail_url
        text alt_text
        integer display_order
        datetime created_at
        datetime updated_at
    }

    game_tags {
        text id PK
        text game_id FK
        text tag_value
        datetime created_at
    }
```

### テーブル設計

#### games テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| title | TEXT | NOT NULL | ゲームタイトル |
| description | TEXT | NOT NULL, DEFAULT '' | ゲーム説明 |
| url | TEXT | NOT NULL | ゲームへのリンク |
| creator_id | TEXT | NOT NULL, FK → users.id | 作成者ID |
| created_at | INTEGER | NOT NULL, DEFAULT unixepoch() | 作成日時 |
| updated_at | INTEGER | NOT NULL, DEFAULT unixepoch() | 更新日時 |

**インデックス**:
- `idx_games_creator_id` ON (creator_id)
- `idx_games_title` ON (title)

#### game_thumbnails テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| game_id | TEXT | NOT NULL, FK → games.id ON DELETE CASCADE | ゲームID |
| image_type | TEXT | NOT NULL | 画像タイプ（icon, screenshot, banner） |
| icon_url | TEXT | NOT NULL | アイコン画像のURL（一覧用、小サイズ） |
| detail_url | TEXT | NULL | 詳細画像のURL（詳細画面用、大サイズ） |
| alt_text | TEXT | NOT NULL, DEFAULT '' | 画像の代替テキスト |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | 表示順序 |
| created_at | INTEGER | NOT NULL, DEFAULT unixepoch() | 作成日時 |
| updated_at | INTEGER | NOT NULL, DEFAULT unixepoch() | 更新日時 |

**画像タイプ**:
- `icon`: アイコン（一覧画面用、正方形推奨）
- `screenshot`: スクリーンショット（詳細画面用）
- `banner`: バナー画像（ヘッダー用、横長）

**インデックス**:
- `idx_game_thumbnails_game_id` ON (game_id)
- `idx_game_thumbnails_order` ON (game_id, display_order)
- `idx_game_thumbnails_type` ON (game_id, image_type)

#### game_tags テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| game_id | TEXT | NOT NULL, FK → games.id ON DELETE CASCADE | ゲームID |
| tag_value | TEXT | NOT NULL | タグ名 |
| created_at | INTEGER | NOT NULL, DEFAULT unixepoch() | 作成日時 |

**インデックス**:
- `idx_game_tags_game_id` ON (game_id)
- `idx_game_tags_tag_value` ON (tag_value)
- **UNIQUE INDEX**: `uniq_game_tag` ON (game_id, tag_value)

### Drizzleスキーマ定義

```typescript
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
```

### 画像ストレージ設計

#### ディレクトリ構造

```
portal/
├── public/                              # 静的ファイル配信用
│   └── uploads/                        # 画像アップロード先
│       └── games/
│           └── {game_id}/
│               ├── icons/              # アイコン画像（一覧用）
│               │   ├── {uuid}_thumb.webp    # 128x128
│               │   └── {uuid}_thumb@2x.webp # 256x256 (Retina)
│               ├── screenshots/        # スクリーンショット（詳細用）
│               │   ├── {uuid}_full.webp     # オリジナルサイズ
│               │   └── {uuid}_preview.webp  # 800x600 (プレビュー)
│               └── banners/            # バナー画像
│                   ├── {uuid}_banner.webp   # 1200x400
│                   └── {uuid}_banner@2x.webp # 2400x800
```

#### URL形式

```
/uploads/games/{game_id}/icons/{uuid}_thumb.webp
/uploads/games/{game_id}/screenshots/{uuid}_full.webp
/uploads/games/{game_id}/banners/{uuid}_banner.webp
```

#### 画像処理仕様

| 画像タイプ | iconUrl（一覧用） | detailUrl（詳細用） | 推奨サイズ |
|-----------|------------------|-------------------|----------|
| **icon** | 128x128 (WebP) | 256x256 (WebP, optional) | 正方形 |
| **screenshot** | 400x300 (WebP) | 1920x1080 (WebP) | 16:9 or 4:3 |
| **banner** | 600x200 (WebP) | 1200x400 (WebP) | 3:1 (横長) |

**処理フロー**:
1. クライアントからアップロード（FormData）
2. サーバーでバリデーション（MIMEタイプ、サイズ）
3. Sharp等で自動リサイズ・WebP変換
4. publicディレクトリに保存
5. DBにURLパスを保存

---

## API設計

### RESTful API エンドポイント

#### ゲームCRUD

| メソッド | エンドポイント | 説明 | リクエストボディ | レスポンス |
|---------|---------------|------|-----------------|-----------|
| GET | `/api/games` | ゲーム一覧取得 | - | `{ games: Game[] }` |
| GET | `/api/games?tag=rpg` | タグでフィルタ | - | `{ games: Game[] }` |
| GET | `/api/games?page=1&limit=20` | ページネーション | - | `{ games: Game[], total: number }` |
| GET | `/api/games/:id` | ゲーム詳細取得 | - | `Game` |
| POST | `/api/games` | ゲーム作成 | `CreateGameInput` | `Game` |
| PUT | `/api/games/:id` | ゲーム更新 | `UpdateGameInput` | `Game` |
| DELETE | `/api/games/:id` | ゲーム削除 | - | `{ success: true }` |

#### 画像・サムネイルCRUD

| メソッド | エンドポイント | 説明 | リクエストボディ | レスポンス |
|---------|---------------|------|-----------------|-----------|
| POST | `/api/games/:id/images` | 画像アップロード | `FormData(file, imageType, altText)` | `GameThumbnail` |
| PUT | `/api/games/:id/images/:imageId` | 画像更新 | `FormData(file?, altText?)` | `GameThumbnail` |
| PUT | `/api/games/:id/images/order` | 表示順序変更 | `{ imageIds: string[] }` | `{ success: true }` |
| DELETE | `/api/games/:id/images/:imageId` | 画像削除 | - | `{ success: true }` |
| GET | `/api/games/:id/images?type=icon` | 画像一覧（タイプ別） | - | `GameThumbnail[]` |

**FormDataパラメータ**:
- `file`: 画像ファイル（JPEG, PNG, WebP, GIF）
- `imageType`: `icon` | `screenshot` | `banner`
- `altText`: 画像の代替テキスト（アクセシビリティ用）

#### タグCRUD

| メソッド | エンドポイント | 説明 | リクエストボディ | レスポンス |
|---------|---------------|------|-----------------|-----------|
| GET | `/api/tags` | 全タグ取得 | - | `{ tags: string[] }` |
| POST | `/api/games/:id/tags` | タグ追加 | `{ tags: string[] }` | `GameTag[]` |
| DELETE | `/api/games/:id/tags/:tagId` | タグ削除 | - | `{ success: true }` |

### リクエスト/レスポンス型

```typescript
// lib/schemas/game.ts
import { z } from 'zod';

// ゲーム作成
export const createGameSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  url: z.string().url(),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;

// ゲーム更新
export const updateGameSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  url: z.string().url().optional(),
});

export type UpdateGameInput = z.infer<typeof updateGameSchema>;

// タグ追加
export const addTagsSchema = z.object({
  tags: z.array(z.string().min(1).max(50)).min(1).max(20),
});

// サムネイル順序変更
export const reorderThumbnailsSchema = z.object({
  thumbnailIds: z.array(z.string().uuid()).min(1).max(10),
});

// クエリパラメータ
export const listGamesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  tag: z.string().optional(),
  search: z.string().optional(),
});
```

### API実装例

```typescript
// app/routes/api/games/index.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createGameSchema, listGamesQuerySchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

const app = new Hono();

// ゲーム一覧取得
app.get('/', zValidator('query', listGamesQuerySchema), async (c) => {
  const { page, limit, tag, search } = c.req.valid('query');

  const result = await gamesService.list({ page, limit, tag, search });

  return c.json(result);
});

// ゲーム作成
app.post('/', zValidator('json', createGameSchema), async (c) => {
  const body = c.req.valid('json');
  const userId = c.get('userId'); // セッションから取得

  const game = await gamesService.create({
    ...body,
    creatorId: userId,
  });

  return c.json(game, 201);
});

export default app;
```

```typescript
// app/routes/api/games/[id].ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateGameSchema } from '@/lib/schemas/game';
import { gamesService } from '@/lib/services/games';

const app = new Hono();

// ゲーム詳細取得
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const game = await gamesService.findById(id);

  if (!game) {
    return c.json({ error: 'Game not found' }, 404);
  }

  return c.json(game);
});

// ゲーム更新
app.put('/:id', zValidator('json', updateGameSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const game = await gamesService.update(id, body, userId);

  if (!game) {
    return c.json({ error: 'Game not found' }, 404);
  }

  return c.json(game);
});

// ゲーム削除
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');

  await gamesService.delete(id, userId);

  return c.json({ success: true });
});

export default app;
```

---

## ディレクトリ構成

### シンプルな構成

```
portal/
├── app/                                    # Presentation Layer
│   ├── routes/
│   │   ├── api/                           # API Routes
│   │   │   ├── games/
│   │   │   │   ├── index.ts              # GET /api/games, POST /api/games
│   │   │   │   ├── [id].ts               # GET/PUT/DELETE /api/games/:id
│   │   │   │   └── [id]/
│   │   │   │       ├── thumbnails.ts     # サムネイル管理
│   │   │   │       └── tags.ts           # タグ管理
│   │   │   └── tags/
│   │   │       └── index.ts              # GET /api/tags
│   │   ├── games/                         # Pages
│   │   │   ├── index.tsx                 # ゲーム一覧
│   │   │   ├── [id].tsx                  # ゲーム詳細
│   │   │   ├── new.tsx                   # ゲーム作成
│   │   │   └── [id]/
│   │   │       └── edit.tsx              # ゲーム編集
│   │   └── index.tsx                     # トップページ
│   ├── components/
│   │   ├── games/
│   │   │   ├── GameCard.tsx
│   │   │   ├── GameGrid.tsx
│   │   │   ├── GameDetail.tsx
│   │   │   └── ThumbnailGallery.tsx
│   │   └── ui/                           # 既存UIコンポーネント
│   ├── islands/
│   │   ├── GameForm.tsx
│   │   └── ThumbnailUploader.tsx
│   └── server.ts
│
├── lib/                                    # Shared Libraries
│   ├── db/                                # Database Layer
│   │   ├── schema/
│   │   │   ├── games.ts                  # ゲーム関連スキーマ
│   │   │   ├── users.ts                  # ユーザースキーマ
│   │   │   └── index.ts
│   │   ├── index.ts                      # DB接続
│   │   └── migrate.ts                    # マイグレーション実行
│   │
│   ├── services/                          # Business Logic Services
│   │   ├── games.ts                      # ゲームサービス
│   │   ├── thumbnails.ts                 # サムネイルサービス
│   │   └── tags.ts                       # タグサービス
│   │
│   ├── schemas/                           # Zod Validation Schemas
│   │   ├── game.ts
│   │   └── common.ts
│   │
│   └── utils/                             # Utility Functions
│       ├── uuid.ts
│       ├── dates.ts
│       └── files.ts
│
├── migrations/                            # Drizzle Migrations
│   └── 0001_create_games.sql
│
├── tests/
│   ├── services/
│   │   └── games.test.ts
│   └── api/
│       └── games.test.ts
│
├── drizzle.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**ポイント**:
- `app/`: UIとAPIルートのみ
- `lib/`: ロジックとデータアクセス
- `migrations/`: DBマイグレーション
- `public/uploads/`: アップロードされた画像の保存先

### 必要な依存関係

```json
{
  "dependencies": {
    "sharp": "^0.33.0",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.8"
  }
}
```

**インストールコマンド**:
```bash
cd portal
bun add sharp uuid
bun add -d @types/uuid
```

---

## 実装ガイドライン

### 1. サービス層の実装

サービス層でビジネスロジックとデータアクセスをまとめます。

```typescript
// lib/services/games.ts
import { db } from '@/lib/db';
import { games, gameThumbnails, gameTags } from '@/lib/db/schema/games';
import { eq, desc, like, and, inArray } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

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

      query = query.where(inArray(games.id, gameIds));
    }

    // タイトルで検索
    if (options.search) {
      query = query.where(like(games.title, `%${options.search}%`));
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
    const gameId = uuid();
    const now = new Date();

    await db.transaction(async (tx) => {
      // ゲーム作成
      await tx.insert(games).values({
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
        await tx.insert(gameTags).values(
          input.tags.map(tag => ({
            id: uuid(),
            gameId,
            tagValue: tag,
            createdAt: now,
          }))
        );
      }
    });

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
```

### 2. 画像アップロードサービス

```typescript
// lib/services/images.ts
import { db } from '@/lib/db';
import { games, gameThumbnails, IMAGE_TYPES, type ImageType } from '@/lib/db/schema/games';
import { eq, and } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
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
};

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

    const imageId = uuid();
    const gameDir = path.join(UPLOAD_DIR, gameId);
    const typeDir = path.join(gameDir, `${imageType}s`);

    // ディレクトリ作成
    await fs.mkdir(typeDir, { recursive: true });

    // ファイルをBufferに変換
    const buffer = file instanceof Buffer
      ? file
      : Buffer.from(await file.arrayBuffer());

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
    const gameDir = path.join(UPLOAD_DIR, gameId);
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
```

### 3. タグ管理サービス

```typescript
// lib/services/tags.ts
import { db } from '@/lib/db';
import { games, gameTags } from '@/lib/db/schema/games';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

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
          id: uuid(),
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
```

### 4. ページ実装例

```typescript
// app/routes/games/index.tsx
import { createRoute } from 'honox/factory';
import { gamesService } from '@/lib/services/games';
import GameGrid from '@/app/components/games/GameGrid';

export default createRoute(async (c) => {
  const page = Number(c.req.query('page') || 1);
  const tag = c.req.query('tag');
  const search = c.req.query('search');

  const { games } = await gamesService.list({ page, limit: 20, tag, search });

  return c.render(
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">ゲーム一覧</h1>

      <GameGrid games={games} />

      <div class="mt-8">
        {/* ページネーション */}
        <a href={`/games?page=${page + 1}`} class="btn">次のページ</a>
      </div>
    </div>
  );
});
```

### 5. データベース初期化

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DB_PATH || 'portal.db');
export const db = drizzle(sqlite, { schema });

export type DB = typeof db;
```

### 6. マイグレーション

```bash
# マイグレーション生成
bun run drizzle-kit generate:sqlite

# マイグレーション適用
bun run drizzle-kit push:sqlite

# Drizzle Studio起動
bun run drizzle-kit studio
```

### 7. .gitignore設定

アップロードされた画像はGit管理対象外にします。

```.gitignore
# アップロードファイル（本番環境のみ）
public/uploads/**/*

# ただし、ディレクトリ構造は保持
!public/uploads/.gitkeep
!public/uploads/games/.gitkeep
```

ディレクトリ構造を保持するため、空の`.gitkeep`ファイルを配置します。

```bash
mkdir -p public/uploads/games
touch public/uploads/.gitkeep
touch public/uploads/games/.gitkeep
```

### 8. Kubernetes用の注意事項

Kubernetes環境では、アップロードされた画像を永続化するために **PersistentVolume** を使用します。

#### Volume設定の更新

```yaml
# k8s/deployment.yaml (volumeMounts追加)
volumeMounts:
- name: data
  mountPath: /app/data
- name: uploads  # 追加
  mountPath: /app/public/uploads

volumes:
- name: data
  persistentVolumeClaim:
    claimName: portal-pvc
- name: uploads  # 追加
  persistentVolumeClaim:
    claimName: portal-uploads-pvc
```

#### 画像用PVC

```yaml
# k8s/uploads-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: portal-uploads-pvc
  namespace: games
spec:
  accessModes:
  - ReadWriteMany  # 複数Podから同時アクセス可能
  resources:
    requests:
      storage: 50Gi  # 画像用に十分な容量を確保
  storageClassName: standard
```

**重要**: `ReadWriteMany` をサポートするStorageClass（NFS, Ceph, EFSなど）が必要です。

---

## まとめ

### CRUD設計の利点

1. **シンプル**: レイヤーは3層のみ（UI/API/Data）
2. **高速開発**: ボイラープレートが少ない
3. **変更容易**: ビジネスロジックが分散していない
4. **理解しやすい**: データモデル中心の設計
5. **保守性**: サービス層で処理を集約

### 実装優先順位

#### Phase 1: 基盤構築
1. ✅ Drizzleスキーマ定義
2. ✅ マイグレーション実行
3. ✅ データベース接続

#### Phase 2: サービス層
1. ✅ ゲームCRUDサービス
2. ✅ サムネイル管理サービス
3. ✅ タグ管理サービス

#### Phase 3: API実装
1. ゲームCRUD API
2. サムネイルアップロード API
3. タグ管理 API

#### Phase 4: UI実装
1. ゲーム一覧ページ
2. ゲーム詳細ページ
3. ゲーム作成/編集フォーム

### DDDとの比較

| 項目 | DDD | CRUD |
|------|-----|------|
| レイヤー数 | 4層 | 3層 |
| 複雑さ | 高 | 低 |
| 変更容易性 | 低（ドメインモデル変更が大変） | 高（スキーマ変更のみ） |
| 適用場面 | 複雑なビジネスルール | シンプルなデータ管理 |
| 学習コスト | 高 | 低 |
| 開発速度 | 遅 | 速 |

**結論**: 趣味プロジェクトで要件が変わりやすい場合は、CRUDアーキテクチャが最適です。

---

## Kubernetesデプロイメント

### デプロイメント構成図

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Ingress"
            Ingress[Ingress Controller<br/>nginx/traefik]
        end

        subgraph "Application Pods"
            App1[Portal App Pod 1<br/>Bun + Hono]
            App2[Portal App Pod 2<br/>Bun + Hono]
            App3[Portal App Pod 3<br/>Bun + Hono]
        end

        subgraph "Database"
            DB[(PostgreSQL/MySQL<br/>StatefulSet)]
        end

        subgraph "Storage"
            PV[Persistent Volume<br/>画像データ]
        end

        Ingress --> App1
        Ingress --> App2
        Ingress --> App3
        App1 --> DB
        App2 --> DB
        App3 --> DB
        App1 -.-> PV
        App2 -.-> PV
        App3 -.-> PV
    end

    Internet((Internet)) --> Ingress

    style App1 fill:#e1f5ff
    style App2 fill:#e1f5ff
    style App3 fill:#e1f5ff
    style DB fill:#e1ffe1
    style PV fill:#fff4e1
```

### コンテナイメージ構成

#### Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# 依存関係のインストール
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# ビルド
FROM base AS builder
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

# HonoXアプリのビルド
RUN bun run build

# 本番イメージ
FROM base AS runner
WORKDIR /app

# 本番用の依存関係のみコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# データベースディレクトリ作成（本番ではPostgreSQL使用推奨）
RUN mkdir -p /app/data

# 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
USER hono

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "dist/server.js"]
```

#### .dockerignore

```
node_modules
dist
.git
.env
*.log
.DS_Store
coverage
.vscode
```

### Kubernetes マニフェスト

#### Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portal-app
  namespace: games
  labels:
    app: portal-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portal-app
  template:
    metadata:
      labels:
        app: portal-app
    spec:
      containers:
      - name: portal-app
        image: your-registry/portal-app:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: portal-secrets
              key: database-url
        - name: SESSION_SECRET
          valueFrom:
            secretKeyRef:
              name: portal-secrets
              key: session-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: data
          mountPath: /app/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: portal-pvc
```

#### Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: portal-service
  namespace: games
  labels:
    app: portal-app
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: portal-app
```

#### Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portal-ingress
  namespace: games
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - portal.yourdomain.com
    secretName: portal-tls
  rules:
  - host: portal.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: portal-service
            port:
              number: 80
```

#### PersistentVolumeClaim

```yaml
# k8s/pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: portal-pvc
  namespace: games
spec:
  accessModes:
  - ReadWriteMany  # 複数Podから同時アクセス
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard  # クラスタのStorageClassに合わせて変更
```

#### Secret

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: portal-secrets
  namespace: games
type: Opaque
stringData:
  database-url: "postgresql://user:password@postgres-service:5432/portal_db"
  session-secret: "your-random-secret-key-here"
```

#### ConfigMap

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: portal-config
  namespace: games
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  MAX_THUMBNAILS: "10"
  MAX_UPLOAD_SIZE: "5242880"  # 5MB
```

### PostgreSQLデプロイメント（オプション）

```yaml
# k8s/postgres-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: games
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_DB
          value: portal_db
        - name: POSTGRES_USER
          value: portal_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: password
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: games
spec:
  clusterIP: None
  ports:
  - port: 5432
    targetPort: 5432
  selector:
    app: postgres
```

### デプロイメントコマンド

```bash
# Namespaceを作成
kubectl create namespace games

# Secretを作成（本番環境では安全な方法で管理）
kubectl apply -f k8s/secret.yaml

# ConfigMapを適用
kubectl apply -f k8s/configmap.yaml

# PVCを作成
kubectl apply -f k8s/pvc.yaml

# PostgreSQLをデプロイ（オプション）
kubectl apply -f k8s/postgres-statefulset.yaml

# アプリケーションをデプロイ
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# デプロイメント状態を確認
kubectl get pods -n games
kubectl get svc -n games
kubectl get ingress -n games

# ログを確認
kubectl logs -f deployment/portal-app -n games

# Podに入る（デバッグ用）
kubectl exec -it deployment/portal-app -n games -- /bin/sh
```

### CI/CD パイプライン例（GitHub Actions）

```yaml
# .github/workflows/deploy.yaml
name: Build and Deploy to Kubernetes

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=sha,prefix={{branch}}-
          type=ref,event=branch
          type=semver,pattern={{version}}

    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: ./portal
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Set up kubectl
      uses: azure/setup-kubectl@v3

    - name: Configure kubeconfig
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config

    - name: Update deployment image
      run: |
        kubectl set image deployment/portal-app \
          portal-app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:main-${{ github.sha }} \
          -n games

    - name: Wait for rollout
      run: |
        kubectl rollout status deployment/portal-app -n games --timeout=5m

    - name: Verify deployment
      run: |
        kubectl get pods -n games
        kubectl get svc -n games
```

### 環境変数設定（本番環境）

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://portal_user:password@postgres-service:5432/portal_db

# Session
SESSION_SECRET=your-super-secret-key-change-this-in-production

# Upload limits
MAX_UPLOAD_SIZE=5242880  # 5MB
MAX_THUMBNAILS=10

# Logging
LOG_LEVEL=info
```

### スケーリング

```bash
# 手動スケーリング
kubectl scale deployment/portal-app --replicas=5 -n games

# 水平オートスケーリング (HPA)
kubectl autoscale deployment/portal-app \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n games
```

### モニタリングとログ

```yaml
# k8s/servicemonitor.yaml (Prometheus使用時)
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: portal-app
  namespace: games
spec:
  selector:
    matchLabels:
      app: portal-app
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### バックアップ戦略

```bash
# データベースバックアップ（cronジョブ）
# k8s/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: games
spec:
  schedule: "0 2 * * *"  # 毎日午前2時
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h postgres-service -U portal_user portal_db | \
              gzip > /backup/portal_db_$(date +%Y%m%d_%H%M%S).sql.gz
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secrets
                  key: password
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          restartPolicy: OnFailure
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
```

---

**作成日**: 2025-11-24
**バージョン**: 1.1.0
**ステータス**: Ready for Implementation
