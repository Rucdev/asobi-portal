import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_PATH || './data/portal.db',
  },
} satisfies Config;
