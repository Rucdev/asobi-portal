# Portal - ゲームポータルアプリケーション

複数のゲームへのリンクと説明を提供するポータルサイト。

## 技術スタック

- **Runtime**: Bun
- **Web Framework**: Hono + HonoX (SSR)
- **ORM**: Drizzle ORM
- **Database**: SQLite (開発環境)
- **Frontend**: Tailwind CSS v4
- **Validation**: Zod
- **Image Processing**: Sharp

## セットアップ

### 必要な環境

- Bun 1.0+

### インストール

```bash
# 依存関係のインストール
bun install

# 環境変数の設定
cp .env.example .env

# データベースのマイグレーション
bun run db:generate
bun run db:push
```

### 開発サーバーの起動

```bash
bun run dev
```

開発サーバーが起動したら、http://localhost:5173 にアクセスしてください。

## データベース管理

### マイグレーション生成

```bash
bun run db:generate
```

### マイグレーション適用

```bash
bun run db:push
```

### Drizzle Studio起動

```bash
bun run db:studio
```

## API エンドポイント

### ゲームCRUD

- `GET /api/games` - ゲーム一覧取得
- `GET /api/games/:id` - ゲーム詳細取得
- `POST /api/games` - ゲーム作成
- `PUT /api/games/:id` - ゲーム更新
- `DELETE /api/games/:id` - ゲーム削除

### タグ管理

- `GET /api/tags` - 全タグ取得
- `POST /api/games/:id/tags` - タグ追加
- `DELETE /api/games/:id/tags/:tagId` - タグ削除

## プロジェクト構造

```
portal/
├── app/                    # Presentation Layer
│   ├── routes/
│   │   ├── api/           # API Routes
│   │   └── games/         # Pages
│   ├── components/        # UI Components
│   └── islands/           # Interactive Components
├── lib/                   # Shared Libraries
│   ├── db/               # Database Layer
│   │   └── schema/       # Drizzle Schemas
│   ├── services/         # Business Logic Services
│   ├── schemas/          # Zod Validation Schemas
│   └── utils/            # Utility Functions
├── migrations/           # Drizzle Migrations
└── public/
    └── uploads/          # Uploaded Images
```

## TODO

- [ ] ユーザー認証の実装
- [ ] 画像アップロードAPIの実装
- [ ] フロントエンドページの実装
- [ ] テストの追加
- [ ] Kubernetes デプロイメント設定

## ライセンス

Private Project
