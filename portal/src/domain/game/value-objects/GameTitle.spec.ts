import { describe, it, expect } from 'vitest';
import { GameTitle } from './GameTitle';

describe('GameTitle', () => {
  describe('create', () => {
    it('should create a valid GameTitle', () => {
      const gameTitle = GameTitle.create('Super Mario Bros');
      expect(gameTitle.value).toBe('Super Mario Bros');
    });

    it('should trim whitespace from the title', () => {
      const gameTitle = GameTitle.create('  Super Mario Bros  ');
      expect(gameTitle.value).toBe('Super Mario Bros');
    });

    it('should accept single character title', () => {
      const gameTitle = GameTitle.create('A');
      expect(gameTitle.value).toBe('A');
    });

    it('should accept title with max length', () => {
      const maxTitle = 'a'.repeat(200);
      const gameTitle = GameTitle.create(maxTitle);
      expect(gameTitle.value).toBe(maxTitle);
    });

    it('should throw Error for empty string', () => {
      expect(() => GameTitle.create('')).toThrow(Error);
      expect(() => GameTitle.create('')).toThrow('Game title cannot be empty');
    });

    it('should throw Error for whitespace only string', () => {
      expect(() => GameTitle.create('   ')).toThrow(Error);
      expect(() => GameTitle.create('   ')).toThrow('Game title cannot be empty');
    });

    it('should throw Error for title exceeding max length', () => {
      const tooLongTitle = 'a'.repeat(201);
      expect(() => GameTitle.create(tooLongTitle)).toThrow(Error);
      expect(() => GameTitle.create(tooLongTitle)).toThrow('Game title must be 200 characters or less');
    });
  });

  describe('equals', () => {
    it('should return true for GameTitles with the same value', () => {
      const title1 = GameTitle.create('Super Mario Bros');
      const title2 = GameTitle.create('Super Mario Bros');
      expect(title1.equals(title2)).toBe(true);
    });

    it('should return false for GameTitles with different values', () => {
      const title1 = GameTitle.create('Super Mario Bros');
      const title2 = GameTitle.create('The Legend of Zelda');
      expect(title1.equals(title2)).toBe(false);
    });

    it('should return false when comparing with null or undefined', () => {
      const title = GameTitle.create('Super Mario Bros');
      expect(title.equals(null as any)).toBe(false);
      expect(title.equals(undefined as any)).toBe(false);
    });

    it('should be case sensitive', () => {
      const title1 = GameTitle.create('super mario bros');
      const title2 = GameTitle.create('Super Mario Bros');
      expect(title1.equals(title2)).toBe(false);
    });
  });
});
