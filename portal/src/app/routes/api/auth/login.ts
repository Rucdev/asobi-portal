import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { LoginCommand } from '../../../../application/auth/commands/LoginCommand';
import { LoginCommandHandler } from '../../../../application/auth/commands/LoginCommandHandler';
import { PasswordHashService } from '../../../../infrastructure/security/PasswordHashService';
import { session, SessionData } from '../../../../presentation/middleware/session';

const app = new Hono();

// Apply session middleware
app.use('*', session);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

app.post('/', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');

    // TODO: Inject dependencies properly using DI container
    const passwordHashService = new PasswordHashService();

    // Note: This requires implementing the repository
    // const userRepository = new DrizzleUserRepository(db);
    // const handler = new LoginCommandHandler(userRepository, passwordHashService);

    const command = new LoginCommand(email, password);

    // TODO: Execute command when repository is implemented
    // const loginResult = await handler.execute(command);

    // Set session data
    const sessionData = c.get('session') as SessionData;
    // sessionData.userId = loginResult.userId;
    // sessionData.userName = loginResult.userName;
    // sessionData.userType = loginResult.userType;

    return c.json({
      success: true,
      message: 'Login endpoint - repository implementation pending',
      data: { email },
    });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 401);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
