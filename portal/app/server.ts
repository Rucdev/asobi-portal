import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { authMiddleware } from '@/lib/middleware/auth'

const app = createApp({
  init: (app) => {
    // 認証ミドルウェアを適用
    app.use('*', authMiddleware)
  }
})

showRoutes(app)

export default app
