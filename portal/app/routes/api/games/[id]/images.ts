// app/routes/api/games/[id]/images.ts
import { Hono } from 'hono';
import { IMAGE_TYPES } from '@/lib/db/schema/games';

// Sharp を使用する imagesService を遅延ロード
const getImagesService = async () => {
  const { imagesService } = await import('@/lib/services/images');
  return imagesService;
};

const app = new Hono();

// 画像一覧取得（タイプ別フィルタ可能）
app.get('/', async (c) => {
  const gameId = c.req.param('id');
  const imageType = c.req.query('type') as any;

  if (imageType && !Object.values(IMAGE_TYPES).includes(imageType)) {
    return c.json({ error: 'Invalid image type' }, 400);
  }

  const imagesService = await getImagesService();
  const images = imageType
    ? await imagesService.getByType(gameId, imageType)
    : await imagesService.getByGame(gameId);

  return c.json({ images });
});

// 画像アップロード
app.post('/', async (c) => {
  const gameId = c.req.param('id');
  // TODO: セッションから取得
  const userId = 'test-user-id';

  try {
    const body = await c.req.parseBody();
    const file = body.file as File;
    const imageType = body.imageType as string;
    const altText = (body.altText as string) || '';

    // バリデーション
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    if (!Object.values(IMAGE_TYPES).includes(imageType as any)) {
      return c.json({ error: 'Invalid image type' }, 400);
    }

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 5MB' }, 400);
    }

    // MIMEタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' }, 400);
    }

    const imagesService = await getImagesService();
    const thumbnail = await imagesService.upload(
      gameId,
      file,
      imageType as any,
      altText,
      userId
    );

    return c.json(thumbnail, 201);
  } catch (error) {
    console.error('Image upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return c.json({ error: message }, 500);
  }
});

// 画像削除
app.delete('/:imageId', async (c) => {
  const gameId = c.req.param('id');
  const imageId = c.req.param('imageId');
  // TODO: セッションから取得
  const userId = 'test-user-id';

  try {
    const imagesService = await getImagesService();
    await imagesService.remove(gameId, imageId, userId);
    return c.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete image';
    return c.json({ error: message }, 500);
  }
});

// 画像順序変更
app.put('/order', async (c) => {
  const gameId = c.req.param('id');
  // TODO: セッションから取得
  const userId = 'test-user-id';

  try {
    const body = await c.req.json();
    const { imageIds } = body;

    if (!Array.isArray(imageIds)) {
      return c.json({ error: 'imageIds must be an array' }, 400);
    }

    const imagesService = await getImagesService();
    await imagesService.reorder(gameId, imageIds, userId);
    return c.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reorder images';
    return c.json({ error: message }, 500);
  }
});

export default app;
