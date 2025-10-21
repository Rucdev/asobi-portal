import { Entity } from '../../shared/Entity';
import { UserId } from '../../user/value-objects/UserId';
import { GameId } from '../../game/value-objects/GameId';
import { PlayHistoryId } from '../value-objects/PlayHistoryId';
import { PlayedAt } from '../value-objects/PlayedAt';

export class PlayHistory extends Entity<PlayHistoryId> {
  private _userId: UserId;
  private _gameId: GameId;
  private _playedAt: PlayedAt;

  private constructor(
    id: PlayHistoryId,
    userId: UserId,
    gameId: GameId,
    playedAt: PlayedAt,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this._userId = userId;
    this._gameId = gameId;
    this._playedAt = playedAt;
  }

  public static create(userId: UserId, gameId: GameId): PlayHistory {
    const playHistoryId = PlayHistoryId.generate();
    const playedAt = PlayedAt.now();
    const now = new Date();

    return new PlayHistory(
      playHistoryId,
      userId,
      gameId,
      playedAt,
      now,
      now
    );
  }

  public static reconstruct(
    id: PlayHistoryId,
    userId: UserId,
    gameId: GameId,
    playedAt: PlayedAt,
    createdAt: Date,
    updatedAt: Date
  ): PlayHistory {
    return new PlayHistory(id, userId, gameId, playedAt, createdAt, updatedAt);
  }

  // Getters

  public get userId(): UserId {
    return this._userId;
  }

  public get gameId(): GameId {
    return this._gameId;
  }

  public get playedAt(): PlayedAt {
    return this._playedAt;
  }

  // Business logic
  public isPlayedBy(userId: UserId): boolean {
    return this._userId.equals(userId);
  }

  public isGamePlayed(gameId: GameId): boolean {
    return this._gameId.equals(gameId);
  }
}
