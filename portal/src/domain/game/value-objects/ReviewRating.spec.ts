import { describe, it, expect } from 'vitest';
import { ReviewRating } from './ReviewRating';

describe('ReviewRating', () => {
  describe('create', () => {
    it('should create a valid ReviewRating with rating 1', () => {
      const rating = ReviewRating.create(1);
      expect(rating.value).toBe(1);
    });

    it('should create a valid ReviewRating with rating 5', () => {
      const rating = ReviewRating.create(5);
      expect(rating.value).toBe(5);
    });

    it('should create a valid ReviewRating with rating 3', () => {
      const rating = ReviewRating.create(3);
      expect(rating.value).toBe(3);
    });

    it('should throw Error for rating 0', () => {
      expect(() => ReviewRating.create(0)).toThrow(Error);
      expect(() => ReviewRating.create(0)).toThrow('Rating must be between 1 and 5');
    });

    it('should throw Error for rating 6', () => {
      expect(() => ReviewRating.create(6)).toThrow(Error);
      expect(() => ReviewRating.create(6)).toThrow('Rating must be between 1 and 5');
    });

    it('should throw Error for negative rating', () => {
      expect(() => ReviewRating.create(-1)).toThrow(Error);
      expect(() => ReviewRating.create(-1)).toThrow('Rating must be between 1 and 5');
    });

    it('should throw Error for decimal rating', () => {
      expect(() => ReviewRating.create(3.5)).toThrow(Error);
      expect(() => ReviewRating.create(3.5)).toThrow('Rating must be an integer');
    });

    it('should throw Error for non-number value', () => {
      expect(() => ReviewRating.create('3' as any)).toThrow(Error);
      expect(() => ReviewRating.create(null as any)).toThrow(Error);
      expect(() => ReviewRating.create(undefined as any)).toThrow(Error);
    });
  });

  describe('equals', () => {
    it('should return true for ReviewRatings with the same value', () => {
      const rating1 = ReviewRating.create(4);
      const rating2 = ReviewRating.create(4);
      expect(rating1.equals(rating2)).toBe(true);
    });

    it('should return false for ReviewRatings with different values', () => {
      const rating1 = ReviewRating.create(4);
      const rating2 = ReviewRating.create(5);
      expect(rating1.equals(rating2)).toBe(false);
    });

    it('should return false when comparing with null or undefined', () => {
      const rating = ReviewRating.create(3);
      expect(rating.equals(null as any)).toBe(false);
      expect(rating.equals(undefined as any)).toBe(false);
    });
  });
});
