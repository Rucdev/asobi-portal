// app/routes/api/tags/index.ts
import { Hono } from 'hono';
import { tagsService } from '@/lib/services/tags';

const app = new Hono();

// 全タグ取得
app.get('/', async (c) => {
  const tags = await tagsService.listAll();
  return c.json({ tags });
});

export default app;
