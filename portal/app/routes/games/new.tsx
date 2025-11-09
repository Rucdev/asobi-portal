import { createRoute } from 'honox/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Container, PageHeader, Input, TextArea, FileUpload, FormActions, ErrorMessage } from '../../components/ui';
import FileUploadHandler from '../../islands/FileUploadHandler';

const FormSchema = z.object({
  creatorId: z.string().transform((val) => parseInt(val, 10)),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  url: z.string().url(),
  tags: z.string().transform((val: string) => {
    if (val.trim().length === 0) return [];
    return val.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
  }),
});

export const POST = createRoute(
  zValidator('form', FormSchema),
  async (c) => {
    const data = c.req.valid('form');
    const baseUrl = c.req.url.split('/games')[0];

    try {
      const response = await fetch(`${baseUrl}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return c.render(
          <ErrorMessage
            message={(error as any).error}
            actionLabel="もう一度試す"
            actionHref="/games/new"
          />
        );
      }

      return c.redirect('/games');
    } catch (error) {
      return c.render(
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Unknown error'}
          actionLabel="もう一度試す"
          actionHref="/games/new"
        />
      );
    }
  }
);

export default createRoute((c) => {
  return c.render(
    <Container size="lg">
      <PageHeader
        title="ゲームを追加"
        description="ポータルにゲームを追加するには、以下の詳細を入力してください。"
      />

      <form method="post" class="flex flex-col gap-6">
              {/* Creator ID - 実際のアプリケーションではセッションから取得すべき */}
              <input type="hidden" name="creatorId" value="1" />

              <Input
                type="text"
                name="title"
                label="ゲームタイトル*"
                required
                maxLength={200}
                placeholder="例：スーパー・スペース・アドベンチャー"
              />

              <TextArea
                name="description"
                label="ゲームの説明*"
                required
                placeholder="例：宇宙を舞台にしたスリリングな横スクロールシューティングゲーム。"
              />

              <Input
                type="url"
                name="url"
                label="ゲームURL*"
                required
                placeholder="例：https://example.com/super-space-adventure"
              />

              <FileUploadHandler
                name="thumbnail"
                label="サムネイル画像"
                title="サムネイル画像をアップロード"
                description="推奨サイズ：800x600px。フォーマット：JPG、PNG"
                accept="image/*"
              />

              <Input
                type="text"
                name="tags"
                label="タグ"
                placeholder="例：シューティング, SF, アクション"
                helperText="カンマ区切りで入力してください"
              />

              <FormActions
                cancelLabel="キャンセル"
                cancelHref="/games"
                submitLabel="ゲームを公開"
              />
            </form>
    </Container>
  );
});
