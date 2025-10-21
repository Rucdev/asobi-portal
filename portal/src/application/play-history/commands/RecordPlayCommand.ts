import { ICommand } from '../../shared/ICommand';

export class RecordPlayCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly gameId: string
  ) {}
}
