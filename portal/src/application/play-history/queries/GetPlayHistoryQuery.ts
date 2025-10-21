import { IQuery } from '../../shared/IQuery';
import { PlayHistoryDto } from './dto/PlayHistoryDto';

export class GetPlayHistoryQuery implements IQuery<PlayHistoryDto[]> {
  constructor(public readonly userId: number) {}
}
