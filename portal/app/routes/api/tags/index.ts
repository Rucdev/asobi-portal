// app/routes/api/tags/index.ts
import { createRoute } from 'honox/factory';
import { tagsService } from '@/lib/services/tags';

// 全タグ取得
export const GET = createRoute(async (c) => {
  const tags = await tagsService.listAll();
  return c.json({ tags });
});
