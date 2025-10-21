import { UserId } from '../../user/value-objects/UserId';
import { GameId } from '../../game/value-objects/GameId';
import { IPlayHistoryRepository } from '../repositories/IPlayHistoryRepository';

export class PlayHistoryDomainService {
  constructor(private readonly playHistoryRepository: IPlayHistoryRepository) {}

  /**
   * Check if a user is eligible to review a game
   * User must have played the game at least once
   */
  public async canReviewGame(userId: UserId, gameId: GameId): Promise<boolean> {
    return await this.playHistoryRepository.hasPlayedGame(userId, gameId);
  }
}
