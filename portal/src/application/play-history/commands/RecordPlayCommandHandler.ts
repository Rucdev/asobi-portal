import { ICommandHandler } from '../../shared/ICommandHandler';
import { RecordPlayCommand } from './RecordPlayCommand';
import { IPlayHistoryRepository } from '../../../domain/play-history/repositories/IPlayHistoryRepository';
import { PlayHistory } from '../../../domain/play-history/entities/PlayHistory';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { GameId } from '../../../domain/game/value-objects/GameId';

export class RecordPlayCommandHandler implements ICommandHandler<RecordPlayCommand, string> {
  constructor(private readonly playHistoryRepository: IPlayHistoryRepository) {}

  async execute(command: RecordPlayCommand): Promise<string> {
    const userId = UserId.reconstruct(command.userId);
    const gameId = GameId.create(command.gameId);

    const playHistory = PlayHistory.create(userId, gameId);

    await this.playHistoryRepository.save(playHistory);

    return playHistory.playHistoryId.value;
  }
}
