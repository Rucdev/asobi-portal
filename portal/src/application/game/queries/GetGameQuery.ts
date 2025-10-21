import { IQuery } from '../../shared/IQuery';
import { GameDto } from './dto/GameDto';

export class GetGameQuery implements IQuery<GameDto | null> {
  constructor(public readonly gameId: string) {}
}
