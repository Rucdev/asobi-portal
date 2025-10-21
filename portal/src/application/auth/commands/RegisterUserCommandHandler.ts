import { ICommandHandler } from '../../shared/ICommandHandler';
import { RegisterUserCommand } from './RegisterUserCommand';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UserName } from '../../../domain/user/value-objects/UserName';
import { Email } from '../../../domain/user/value-objects/Email';
import { Password } from '../../../domain/user/value-objects/Password';
import { Player } from '../../../domain/user/entities/Player';
import { Creator } from '../../../domain/user/entities/Creator';
import { PasswordHashService } from '../../../infrastructure/security/PasswordHashService';

export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand, number> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: PasswordHashService
  ) {}

  async execute(command: RegisterUserCommand): Promise<number> {
    // Validate value objects
    const email = Email.create(command.email);
    const password = Password.create(command.password);
    const name = UserName.create(command.name);

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const passwordHash = await this.passwordHashService.hash(password.value);

    // Create user based on type
    let user;
    if (command.userType === 'creator') {
      user = Creator.create(name);
    } else {
      user = Player.create(name);
    }

    // Save user with password hash
    const userId = await this.userRepository.saveWithPassword(user, email, passwordHash);

    return userId;
  }
}
