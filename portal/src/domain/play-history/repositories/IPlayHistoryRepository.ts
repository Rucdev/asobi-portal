import { PlayHistory } from '../entities/PlayHistory';
import { PlayHistoryId } from '../value-objects/PlayHistoryId';
import { UserId } from '../../user/value-objects/UserId';
import { GameId } from '../../game/value-objects/GameId';

export interface IPlayHistoryRepository {
  save(playHistory: PlayHistory): Promise<void>;
  findById(playHistoryId: PlayHistoryId): Promise<PlayHistory | null>;
  findByUserId(userId: UserId): Promise<PlayHistory[]>;
  findByUserIdAndGameId(userId: UserId, gameId: GameId): Promise<PlayHistory | null>;
  hasPlayedGame(userId: UserId, gameId: GameId): Promise<boolean>;
}
