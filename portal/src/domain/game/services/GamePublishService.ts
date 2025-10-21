import { Game } from '../entities/Game';
import { GameId } from '../value-objects/GameId';
import { GameTitle } from '../value-objects/GameTitle';
import { GameUrl } from '../value-objects/GameUrl';
import { GameTags } from '../value-objects/GameTags';
import { UserId } from '../../user/value-objects/UserId';
import { IGameRepository } from '../repositories/IGameRepository';

export class GamePublishService {
  constructor(private readonly gameRepository: IGameRepository) {}

  public async publishGame(
    creatorId: UserId,
    title: GameTitle,
    url: GameUrl,
    tags: GameTags
  ): Promise<Game> {
    const gameId = GameId.generate();
    const game = Game.create(gameId, title, url, tags, creatorId);

    await this.gameRepository.save(game);

    return game;
  }
}
