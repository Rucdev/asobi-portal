import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PublishGameCommandHandler } from './PublishGameCommandHandler';
import { PublishGameCommand } from './PublishGameCommand';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { Game } from '../../../domain/game/entities/Game';
import { Creator } from '../../../domain/user/entities/Creator';
import { Player } from '../../../domain/user/entities/Player';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { UserName } from '../../../domain/user/value-objects/UserName';

describe('PublishGameCommandHandler', () => {
  let handler: PublishGameCommandHandler;
  let mockGameRepository: IGameRepository;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    // Create mock repositories
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByGameId: vi.fn(),
      findAll: vi.fn(),
      findByCreatorId: vi.fn(),
    };

    mockUserRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByName: vi.fn(),
    };

    handler = new PublishGameCommandHandler(mockGameRepository, mockUserRepository);
  });

  describe('execute', () => {
    it('should publish a game successfully when creator exists', async () => {
      const creatorId = UserId.reconstruct(1);
      const creatorName = UserName.create('John Creator');
      const creator = Creator.reconstruct(creatorId, creatorName, new Date(), new Date());

      const command = new PublishGameCommand(
        1,
        'Super Mario Bros',
        'https://example.com/game',
        ['action', 'platformer']
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(creator);
      vi.spyOn(mockGameRepository, 'save').mockResolvedValue();

      const gameId = await handler.execute(command);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(creatorId);
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);
      expect(gameId).toBeDefined();
      expect(typeof gameId).toBe('string');

      // Verify the game was saved with correct properties
      const savedGame = (mockGameRepository.save as any).mock.calls[0][0] as Game;
      expect(savedGame.title.value).toBe('Super Mario Bros');
      expect(savedGame.url.value).toBe('https://example.com/game');
      expect(savedGame.tags.getTags()).toEqual(['action', 'platformer']);
      expect(savedGame.creatorId.equals(creatorId)).toBe(true);
    });

    it('should throw error when creator does not exist', async () => {
      const command = new PublishGameCommand(
        999,
        'Super Mario Bros',
        'https://example.com/game',
        ['action', 'platformer']
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow('Creator not found');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when user is not a creator', async () => {
      const playerId = UserId.reconstruct(1);
      const playerName = UserName.create('John Player');
      const player = Player.reconstruct(playerId, playerName, new Date(), new Date());

      const command = new PublishGameCommand(
        1,
        'Super Mario Bros',
        'https://example.com/game',
        ['action', 'platformer']
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(player);

      await expect(handler.execute(command)).rejects.toThrow('Only creators can publish games');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should validate game title during execution', async () => {
      const creatorId = UserId.reconstruct(1);
      const creatorName = UserName.create('John Creator');
      const creator = Creator.reconstruct(creatorId, creatorName, new Date(), new Date());

      const command = new PublishGameCommand(
        1,
        '', // Empty title
        'https://example.com/game',
        ['action']
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(creator);

      await expect(handler.execute(command)).rejects.toThrow();
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should validate game URL during execution', async () => {
      const creatorId = UserId.reconstruct(1);
      const creatorName = UserName.create('John Creator');
      const creator = Creator.reconstruct(creatorId, creatorName, new Date(), new Date());

      const command = new PublishGameCommand(
        1,
        'Super Mario Bros',
        'not-a-valid-url', // Invalid URL
        ['action']
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(creator);

      await expect(handler.execute(command)).rejects.toThrow('Invalid URL format');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should validate game tags during execution', async () => {
      const creatorId = UserId.reconstruct(1);
      const creatorName = UserName.create('John Creator');
      const creator = Creator.reconstruct(creatorId, creatorName, new Date(), new Date());

      const command = new PublishGameCommand(
        1,
        'Super Mario Bros',
        'https://example.com/game',
        ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10', 'tag11'] // More than max allowed tags
      );

      vi.spyOn(mockUserRepository, 'findById').mockResolvedValue(creator);

      await expect(handler.execute(command)).rejects.toThrow('Cannot have more than 10 tags');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });
  });
});
