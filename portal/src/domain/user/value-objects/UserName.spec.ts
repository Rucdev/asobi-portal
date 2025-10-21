import { describe, it, expect } from 'vitest';
import { UserName } from './UserName';
import { ValidationError } from '../../shared/DomainError';

describe('UserName', () => {
  describe('create', () => {
    it('should create a valid UserName', () => {
      const userName = UserName.create('John Doe');
      expect(userName.value).toBe('John Doe');
      expect(userName.trimmedValue).toBe('John Doe');
    });

    it('should trim whitespace when accessing trimmedValue', () => {
      const userName = UserName.create('  John Doe  ');
      expect(userName.value).toBe('  John Doe  ');
      expect(userName.trimmedValue).toBe('John Doe');
    });

    it('should accept single character name', () => {
      const userName = UserName.create('A');
      expect(userName.trimmedValue).toBe('A');
    });

    it('should accept name with max length', () => {
      const maxName = 'a'.repeat(100);
      const userName = UserName.create(maxName);
      expect(userName.trimmedValue).toBe(maxName);
    });

    it('should throw ValidationError for empty string', () => {
      expect(() => UserName.create('')).toThrow(ValidationError);
      expect(() => UserName.create('')).toThrow('UserName must be a non-empty string');
    });

    it('should throw ValidationError for whitespace only string', () => {
      expect(() => UserName.create('   ')).toThrow(ValidationError);
      expect(() => UserName.create('   ')).toThrow('UserName must be at least 1 character(s)');
    });

    it('should throw ValidationError for string exceeding max length', () => {
      const tooLongName = 'a'.repeat(101);
      expect(() => UserName.create(tooLongName)).toThrow(ValidationError);
      expect(() => UserName.create(tooLongName)).toThrow('UserName must not exceed 100 characters');
    });

    it('should throw ValidationError for non-string value', () => {
      expect(() => UserName.create(null as any)).toThrow(ValidationError);
      expect(() => UserName.create(undefined as any)).toThrow(ValidationError);
      expect(() => UserName.create(123 as any)).toThrow(ValidationError);
    });
  });

  describe('equals', () => {
    it('should return true for UserNames with the same value', () => {
      const userName1 = UserName.create('John Doe');
      const userName2 = UserName.create('John Doe');
      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for UserNames with different values', () => {
      const userName1 = UserName.create('John Doe');
      const userName2 = UserName.create('Jane Doe');
      expect(userName1.equals(userName2)).toBe(false);
    });

    it('should return false when comparing with null or undefined', () => {
      const userName = UserName.create('John Doe');
      expect(userName.equals(null as any)).toBe(false);
      expect(userName.equals(undefined as any)).toBe(false);
    });

    it('should be case sensitive', () => {
      const userName1 = UserName.create('john doe');
      const userName2 = UserName.create('John Doe');
      expect(userName1.equals(userName2)).toBe(false);
    });
  });
});
