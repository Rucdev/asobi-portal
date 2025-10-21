import { ICommandHandler } from '../../shared/ICommandHandler';
import { LoginCommand } from './LoginCommand';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { Email } from '../../../domain/user/value-objects/Email';
import { Password } from '../../../domain/user/value-objects/Password';
import { PasswordHashService } from '../../../infrastructure/security/PasswordHashService';
import { User } from '../../../domain/user/entities/User';

export interface LoginResult {
  userId: number;
  userName: string;
  userType: string;
}

export class LoginCommandHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: PasswordHashService
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    // Validate value objects
    const email = Email.create(command.email);
    const password = Password.create(command.password);

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Get password hash from repository
    const passwordHash = await this.userRepository.getPasswordHash(user.id!);
    if (!passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await this.passwordHashService.verify(password.value, passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    return {
      userId: user.id!.value,
      userName: user.name.value,
      userType: user.type.value,
    };
  }
}
