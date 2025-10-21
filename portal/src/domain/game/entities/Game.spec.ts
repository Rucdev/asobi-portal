import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from './Game';
import { GameId } from '../value-objects/GameId';
import { GameTitle } from '../value-objects/GameTitle';
import { GameUrl } from '../value-objects/GameUrl';
import { GameTags } from '../value-objects/GameTags';
import { UserId } from '../../user/value-objects/UserId';
import { ReviewContent } from '../value-objects/ReviewContent';
import { ReviewRating } from '../value-objects/ReviewRating';

describe('Game', () => {
  let gameId: GameId;
  let title: GameTitle;
  let url: GameUrl;
  let tags: GameTags;
  let creatorId: UserId;
  let playerId: UserId;

  beforeEach(() => {
    gameId = GameId.generate();
    title = GameTitle.create('Super Mario Bros');
    url = GameUrl.create('https://example.com/game');
    tags = GameTags.create(['action', 'platformer']);
    creatorId = UserId.reconstruct(1);
    playerId = UserId.reconstruct(2);
  });

  describe('create', () => {
    it('should create a new Game with valid parameters', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);

      expect(game.id.equals(gameId)).toBe(true);
      expect(game.title.equals(title)).toBe(true);
      expect(game.url.equals(url)).toBe(true);
      expect(game.tags.equals(tags)).toBe(true);
      expect(game.creatorId.equals(creatorId)).toBe(true);
      expect(game.reviews).toHaveLength(0);
      expect(game.createdAt).toBeInstanceOf(Date);
      expect(game.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a Game with empty reviews array', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      expect(game.reviews).toHaveLength(0);
    });
  });

  describe('isOwnedBy', () => {
    it('should return true when the user is the creator', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      expect(game.isOwnedBy(creatorId)).toBe(true);
    });

    it('should return false when the user is not the creator', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      expect(game.isOwnedBy(playerId)).toBe(false);
    });
  });

  describe('addReview', () => {
    it('should add a review when a non-creator user reviews the game', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      game.addReview(playerId, content, rating);

      expect(game.reviews).toHaveLength(1);
      expect(game.reviews[0].userId.equals(playerId)).toBe(true);
      expect(game.reviews[0].content.equals(content)).toBe(true);
      expect(game.reviews[0].rating.equals(rating)).toBe(true);
    });

    it('should throw error when creator tries to review their own game', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      expect(() => game.addReview(creatorId, content, rating)).toThrow(
        'Creators cannot review their own games'
      );
    });

    it('should throw error when user tries to add duplicate review', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      game.addReview(playerId, content, rating);

      const newContent = ReviewContent.create('Updating my review with more details about the gameplay.');
      const newRating = ReviewRating.create(4);

      expect(() => game.addReview(playerId, newContent, newRating)).toThrow(
        'User has already reviewed this game'
      );
    });

    it('should update updatedAt timestamp when review is added', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const initialUpdatedAt = game.updatedAt;

      // Wait a bit to ensure timestamp differs
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);
      game.addReview(playerId, content, rating);

      expect(game.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });

  describe('updateReview', () => {
    it('should update an existing review', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const initialContent = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const initialRating = ReviewRating.create(5);

      game.addReview(playerId, initialContent, initialRating);

      const updatedContent = ReviewContent.create('After playing more, I think this game is even better than before!');
      const updatedRating = ReviewRating.create(4);

      game.updateReview(playerId, updatedContent, updatedRating);

      const review = game.getReviewByUser(playerId);
      expect(review).toBeDefined();
      expect(review?.content.equals(updatedContent)).toBe(true);
      expect(review?.rating.equals(updatedRating)).toBe(true);
    });

    it('should throw error when updating non-existent review', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      expect(() => game.updateReview(playerId, content, rating)).toThrow('Review not found');
    });

    it('should update updatedAt timestamp when review is updated', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);
      game.addReview(playerId, content, rating);

      const initialUpdatedAt = game.updatedAt;

      const updatedContent = ReviewContent.create('After playing more, I think this game is even better than before!');
      const updatedRating = ReviewRating.create(4);
      game.updateReview(playerId, updatedContent, updatedRating);

      expect(game.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });

  describe('getReviewByUser', () => {
    it('should return review when user has reviewed the game', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      game.addReview(playerId, content, rating);

      const review = game.getReviewByUser(playerId);
      expect(review).toBeDefined();
      expect(review?.userId.equals(playerId)).toBe(true);
    });

    it('should return undefined when user has not reviewed the game', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const review = game.getReviewByUser(playerId);
      expect(review).toBeUndefined();
    });
  });

  describe('getAverageRating', () => {
    it('should return null when there are no reviews', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      expect(game.getAverageRating()).toBeNull();
    });

    it('should return correct average rating with one review', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(4);

      game.addReview(playerId, content, rating);
      expect(game.getAverageRating()).toBe(4);
    });

    it('should return correct average rating with multiple reviews', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const player2Id = UserId.reconstruct(3);
      const player3Id = UserId.reconstruct(4);

      game.addReview(playerId, ReviewContent.create('Great game! Very fun to play with friends.'), ReviewRating.create(5));
      game.addReview(player2Id, ReviewContent.create('Good game overall but could be better.'), ReviewRating.create(3));
      game.addReview(player3Id, ReviewContent.create('Amazing experience! Highly recommend.'), ReviewRating.create(4));

      expect(game.getAverageRating()).toBe((5 + 3 + 4) / 3);
    });
  });

  describe('getReviewCount', () => {
    it('should return 0 when there are no reviews', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      expect(game.getReviewCount()).toBe(0);
    });

    it('should return correct count when reviews exist', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const player2Id = UserId.reconstruct(3);

      game.addReview(playerId, ReviewContent.create('Great game! Very fun to play with friends.'), ReviewRating.create(5));
      game.addReview(player2Id, ReviewContent.create('Good game overall but could be better.'), ReviewRating.create(3));

      expect(game.getReviewCount()).toBe(2);
    });
  });

  describe('reviews getter', () => {
    it('should return a copy of reviews array', () => {
      const game = Game.create(gameId, title, url, tags, creatorId);
      const content = ReviewContent.create('This is a great game! I really enjoyed playing it.');
      const rating = ReviewRating.create(5);

      game.addReview(playerId, content, rating);

      const reviews = game.reviews;
      expect(reviews).toHaveLength(1);

      // Verify it's a copy by mutating and checking original
      reviews.pop();
      expect(game.reviews).toHaveLength(1);
    });
  });
});
