import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { RegisterUserCommand } from '../../../../application/auth/commands/RegisterUserCommand';
import { RegisterUserCommandHandler } from '../../../../application/auth/commands/RegisterUserCommandHandler';
import { PasswordHashService } from '../../../../infrastructure/security/PasswordHashService';
import { session } from '../../../../presentation/middleware/session';

const app = new Hono();

// Apply session middleware
app.use('*', session);

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  userType: z.enum(['player', 'creator']),
});

app.post('/', zValidator('json', registerSchema), async (c) => {
  try {
    const { email, password, name, userType } = c.req.valid('json');

    // TODO: Inject dependencies properly using DI container
    // For now, we'll create instances directly
    const passwordHashService = new PasswordHashService();

    // Note: This requires implementing the repository
    // const userRepository = new DrizzleUserRepository(db);
    // const handler = new RegisterUserCommandHandler(userRepository, passwordHashService);

    const command = new RegisterUserCommand(email, password, name, userType);

    // TODO: Execute command when repository is implemented
    // const userId = await handler.execute(command);

    // For now, return a placeholder response
    return c.json({
      success: true,
      message: 'User registration endpoint - repository implementation pending',
      data: { email, name, userType },
    }, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
