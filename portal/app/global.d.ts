import type {} from 'hono'

type User = {
  id: string;
  name: string;
  userType: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

declare module 'hono' {
  interface Env {
    Variables: {
      user?: User;
      sessionId?: string;
    }
    Bindings: {}
  }
}
