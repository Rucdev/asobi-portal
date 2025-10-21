import { Hono } from 'hono';
import { session, requireAuth } from '../../../../presentation/middleware/session';

const app = new Hono();

// Apply middleware
app.use('*', session);
app.use('*', requireAuth);

app.post('/', async (c) => {
  try {
    const sessionData = c.get('session');

    // Clear session data
    sessionData.userId = undefined;
    sessionData.userName = undefined;
    sessionData.userType = undefined;

    return c.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
