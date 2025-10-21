import { ICommand } from '../../shared/ICommand';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly userType: 'player' | 'creator'
  ) {}
}
