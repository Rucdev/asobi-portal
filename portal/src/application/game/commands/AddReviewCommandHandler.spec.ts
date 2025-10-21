import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddReviewCommandHandler } from './AddReviewCommandHandler';
import { AddReviewCommand } from './AddReviewCommand';
import { IGameRepository } from '../../../domain/game/repositories/IGameRepository';
import { Game } from '../../../domain/game/entities/Game';
import { GameId } from '../../../domain/game/value-objects/GameId';
import { GameTitle } from '../../../domain/game/value-objects/GameTitle';
import { GameUrl } from '../../../domain/game/value-objects/GameUrl';
import { GameTags } from '../../../domain/game/value-objects/GameTags';
import { UserId } from '../../../domain/user/value-objects/UserId';

describe('AddReviewCommandHandler', () => {
  let handler: AddReviewCommandHandler;
  let mockGameRepository: IGameRepository;
  let game: Game;

  beforeEach(() => {
    mockGameRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByGameId: vi.fn(),
      findAll: vi.fn(),
      findByCreatorId: vi.fn(),
    };

    handler = new AddReviewCommandHandler(mockGameRepository);

    // Create a test game
    const gameId = GameId.generate();
    const title = GameTitle.create('Super Mario Bros');
    const url = GameUrl.create('https://example.com/game');
    const tags = GameTags.create(['action', 'platformer']);
    const creatorId = UserId.reconstruct(1);

    game = Game.create(gameId, title, url, tags, creatorId);
  });

  describe('execute', () => {
    it('should add a review to a game successfully', async () => {
      const command = new AddReviewCommand(
        game.id.value,
        2, // Different user than creator
        'This is a great game! I really enjoyed playing it.',
        5
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(game);
      vi.spyOn(mockGameRepository, 'save').mockResolvedValue();

      await handler.execute(command);

      expect(mockGameRepository.findById).toHaveBeenCalledWith(
        expect.objectContaining({ _value: game.id.value })
      );
      expect(mockGameRepository.save).toHaveBeenCalledWith(game);
      expect(game.reviews).toHaveLength(1);
      expect(game.reviews[0].content.value).toBe('This is a great game! I really enjoyed playing it.');
      expect(game.reviews[0].rating.value).toBe(5);
    });

    it('should throw error when game does not exist', async () => {
      const command = new AddReviewCommand(
        'non-existent-game-id',
        2,
        'This is a great game! I really enjoyed playing it.',
        5
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow('Game not found');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when creator tries to review their own game', async () => {
      const command = new AddReviewCommand(
        game.id.value,
        1, // Same as creator ID
        'This is my own game and it is awesome!',
        5
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(game);

      await expect(handler.execute(command)).rejects.toThrow('Creators cannot review their own games');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when user tries to add duplicate review', async () => {
      const userId = 2;
      const firstCommand = new AddReviewCommand(
        game.id.value,
        userId,
        'This is a great game! I really enjoyed playing it.',
        5
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(game);
      vi.spyOn(mockGameRepository, 'save').mockResolvedValue();

      // Add first review
      await handler.execute(firstCommand);

      // Try to add second review from same user
      const secondCommand = new AddReviewCommand(
        game.id.value,
        userId,
        'Let me add another review for this game.',
        4
      );

      await expect(handler.execute(secondCommand)).rejects.toThrow('User has already reviewed this game');
    });

    it('should validate review content length', async () => {
      const command = new AddReviewCommand(
        game.id.value,
        2,
        'Too short', // Less than minimum length
        5
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(game);

      await expect(handler.execute(command)).rejects.toThrow('Review content must be at least 10 characters');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });

    it('should validate review rating range', async () => {
      const command = new AddReviewCommand(
        game.id.value,
        2,
        'This is a great game! I really enjoyed playing it.',
        6 // Out of valid range
      );

      vi.spyOn(mockGameRepository, 'findById').mockResolvedValue(game);

      await expect(handler.execute(command)).rejects.toThrow('Rating must be between 1 and 5');
      expect(mockGameRepository.save).not.toHaveBeenCalled();
    });
  });
});
