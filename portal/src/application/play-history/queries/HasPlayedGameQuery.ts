import { IQuery } from '../../shared/IQuery';

export class HasPlayedGameQuery implements IQuery<boolean> {
  constructor(
    public readonly userId: number,
    public readonly gameId: string
  ) {}
}
