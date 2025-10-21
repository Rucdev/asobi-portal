import { IQueryHandler } from '../../shared/IQueryHandler';
import { GetGameQuery } from './GetGameQuery';
import { GameDto } from './dto/GameDto';
import { ReviewDto } from './dto/ReviewDto';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { GameId } from '../../../domain/game/value-objects/GameId';
import { Game } from '../../../domain/game/entities/Game';

export class GetGameQueryHandler implements IQueryHandler<GetGameQuery, GameDto | null> {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(query: GetGameQuery): Promise<GameDto | null> {
    const gameId = GameId.create(query.gameId);
    const game = await this.gameRepository.findById(gameId);

    if (!game) {
      return null;
    }

    return this.toDto(game);
  }

  private toDto(game: Game): GameDto {
    const reviews: ReviewDto[] = game.reviews.map(review => ({
      id: review.id,
      userId: review.userId.value,
      content: review.content.value,
      rating: review.rating.value,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return {
      id: game.gameId.value,
      title: game.title.value,
      url: game.url.value,
      tags: game.tags.getTags(),
      creatorId: game.creatorId.value,
      reviews,
      averageRating: game.getAverageRating(),
      reviewCount: game.getReviewCount(),
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }
}
