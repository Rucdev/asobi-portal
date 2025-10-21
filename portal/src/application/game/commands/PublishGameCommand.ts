import { ICommand } from '../../shared/ICommand';

export class PublishGameCommand implements ICommand {
  constructor(
    public readonly creatorId: number,
    public readonly title: string,
    public readonly url: string,
    public readonly tags: string[]
  ) {}
}
