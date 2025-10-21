import { ICommand } from '../../shared/ICommand';

export class UpdateReviewCommand implements ICommand {
  constructor(
    public readonly gameId: string,
    public readonly userId: number,
    public readonly content: string,
    public readonly rating: number
  ) {}
}
