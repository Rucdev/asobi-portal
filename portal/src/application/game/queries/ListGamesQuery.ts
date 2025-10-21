import { IQuery } from '../../shared/IQuery';
import { GameDto } from './dto/GameDto';

export class ListGamesQuery implements IQuery<GameDto[]> {
  constructor(
    public readonly creatorId?: number,
    public readonly tag?: string
  ) {}
}
