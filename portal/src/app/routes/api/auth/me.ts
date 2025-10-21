import { Hono } from 'hono';
import { session, requireAuth } from '../../../../presentation/middleware/session';

const app = new Hono();

// Apply middleware
app.use('*', session);
app.use('*', requireAuth);

app.get('/', async (c) => {
  try {
    const sessionData = c.get('session');

    return c.json({
      userId: sessionData.userId,
      userName: sessionData.userName,
      userType: sessionData.userType,
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
