import { Game } from '../entities/Game';
import { GameId } from '../value-objects/GameId';
import { UserId } from '../../user/value-objects/UserId';

export interface IGameRepository {
  save(game: Game): Promise<void>;
  findById(gameId: GameId): Promise<Game | null>;
  findAll(): Promise<Game[]>;
  findByCreatorId(creatorId: UserId): Promise<Game[]>;
  findByTag(tag: string): Promise<Game[]>;
  delete(gameId: GameId): Promise<void>;
}
