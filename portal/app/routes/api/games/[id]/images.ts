// app/routes/api/games/[id]/images.ts
import { createRoute } from 'honox/factory';
import { IMAGE_TYPES } from '@/lib/db/schema/games';

// Sharp を使用する imagesService を遅延ロード
const getImagesService = async () => {
  const { imagesService } = await import('@/lib/services/images');
  return imagesService;
};

// 画像一覧取得（タイプ別フィルタ可能）- 閲覧は誰でも可能
export const GET = createRoute(async (c) => {
  const gameId = c.req.param('id');
  if (!gameId) {
    return c.json({ error: 'Game ID is required' }, 400);
  }

  const imageType = c.req.query('type');

  if (imageType && !Object.values(IMAGE_TYPES).includes(imageType as typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES])) {
    return c.json({ error: 'Invalid image type' }, 400);
  }

  const imagesService = await getImagesService();
  const images = imageType
    ? await imagesService.getByType(gameId, imageType as typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES])
    : await imagesService.getByGame(gameId);

  return c.json({ images });
});

// 画像アップロード（管理者のみ）
export const POST = createRoute(async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  if (user.userType !== 'admin') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }

  const gameId = c.req.param('id');
  if (!gameId) {
    return c.json({ error: 'Game ID is required' }, 400);
  }

  try {
    const body = await c.req.parseBody();
    const file = body.file as File;
    const imageType = body.imageType as string;
    const altText = (body.altText as string) || '';

    // バリデーション
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    if (!Object.values(IMAGE_TYPES).includes(imageType as typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES])) {
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
      imageType as typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES],
      altText,
      user.id
    );

    return c.json(thumbnail, 201);
  } catch (error) {
    console.error('Image upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return c.json({ error: message }, 500);
  }
});
