import { ICommand } from '../../shared/ICommand';

export class LoginCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
