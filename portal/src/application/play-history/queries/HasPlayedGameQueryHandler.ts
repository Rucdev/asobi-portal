import { IQueryHandler } from '../../shared/IQueryHandler';
import { HasPlayedGameQuery } from './HasPlayedGameQuery';
import { IPlayHistoryRepository } from '../../../domain/play-history/repositories/IPlayHistoryRepository';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { GameId } from '../../../domain/game/value-objects/GameId';

export class HasPlayedGameQueryHandler implements IQueryHandler<HasPlayedGameQuery, boolean> {
  constructor(private readonly playHistoryRepository: IPlayHistoryRepository) {}

  async execute(query: HasPlayedGameQuery): Promise<boolean> {
    const userId = UserId.reconstruct(query.userId);
    const gameId = GameId.create(query.gameId);

    return await this.playHistoryRepository.hasPlayedGame(userId, gameId);
  }
}
