import { IQueryHandler } from '../../shared/IQueryHandler';
import { GetPlayHistoryQuery } from './GetPlayHistoryQuery';
import { PlayHistoryDto } from './dto/PlayHistoryDto';
import { IPlayHistoryRepository } from '../../../domain/play-history/repositories/IPlayHistoryRepository';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { PlayHistory } from '../../../domain/play-history/entities/PlayHistory';

export class GetPlayHistoryQueryHandler implements IQueryHandler<GetPlayHistoryQuery, PlayHistoryDto[]> {
  constructor(private readonly playHistoryRepository: IPlayHistoryRepository) {}

  async execute(query: GetPlayHistoryQuery): Promise<PlayHistoryDto[]> {
    const userId = UserId.reconstruct(query.userId);
    const playHistories = await this.playHistoryRepository.findByUserId(userId);

    return playHistories.map(ph => this.toDto(ph));
  }

  private toDto(playHistory: PlayHistory): PlayHistoryDto {
    return {
      id: playHistory.playHistoryId.value,
      userId: playHistory.userId.value,
      gameId: playHistory.gameId.value,
      playedAt: playHistory.playedAt.value,
    };
  }
}
