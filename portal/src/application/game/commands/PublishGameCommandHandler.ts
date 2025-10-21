import { ICommandHandler } from '../../shared/ICommandHandler';
import { PublishGameCommand } from './PublishGameCommand';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { GameTitle } from '../../../domain/game/value-objects/GameTitle';
import { GameUrl } from '../../../domain/game/value-objects/GameUrl';
import { GameTags } from '../../../domain/game/value-objects/GameTags';
import { GamePublishService } from '../../../domain/game/services/GamePublishService';

export class PublishGameCommandHandler implements ICommandHandler<PublishGameCommand, string> {
  constructor(
    private readonly gameRepository: IGameRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: PublishGameCommand): Promise<string> {
    // Verify creator exists and is a creator
    const creatorId = UserId.reconstruct(command.creatorId);
    const creator = await this.userRepository.findById(creatorId);

    if (!creator) {
      throw new Error('Creator not found');
    }

    if (!creator.isCreator()) {
      throw new Error('Only creators can publish games');
    }

    // Create value objects
    const title = GameTitle.create(command.title);
    const url = GameUrl.create(command.url);
    const tags = GameTags.create(command.tags);

    // Publish game using domain service
    const service = new GamePublishService(this.gameRepository);
    const game = await service.publishGame(creatorId, title, url, tags);

    return game.id.value;
  }
}
