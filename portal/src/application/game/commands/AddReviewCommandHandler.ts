import { ICommandHandler } from '../../shared/ICommandHandler';
import { AddReviewCommand } from './AddReviewCommand';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { GameId } from '../../../domain/game/value-objects/GameId';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { ReviewContent } from '../../../domain/game/value-objects/ReviewContent';
import { ReviewRating } from '../../../domain/game/value-objects/ReviewRating';

export class AddReviewCommandHandler implements ICommandHandler<AddReviewCommand, void> {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(command: AddReviewCommand): Promise<void> {
    const gameId = GameId.create(command.gameId);
    const game = await this.gameRepository.findById(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    const userId = UserId.reconstruct(command.userId);
    const content = ReviewContent.create(command.content);
    const rating = ReviewRating.create(command.rating);

    game.addReview(userId, content, rating);

    await this.gameRepository.save(game);
  }
}
