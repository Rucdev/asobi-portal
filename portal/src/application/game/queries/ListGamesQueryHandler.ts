import { IQueryHandler } from '../../shared/IQueryHandler';
import { ListGamesQuery } from './ListGamesQuery';
import { GameDto } from './dto/GameDto';
import { ReviewDto } from './dto/ReviewDto';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { Game } from '../../../domain/game/entities/Game';

export class ListGamesQueryHandler implements IQueryHandler<ListGamesQuery, GameDto[]> {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(query: ListGamesQuery): Promise<GameDto[]> {
    let games: Game[];

    if (query.creatorId) {
      const creatorId = UserId.reconstruct(query.creatorId);
      games = await this.gameRepository.findByCreatorId(creatorId);
    } else if (query.tag) {
      games = await this.gameRepository.findByTag(query.tag);
    } else {
      games = await this.gameRepository.findAll();
    }

    return games.map(game => this.toDto(game));
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
