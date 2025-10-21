import { ValueObject } from '../../shared/ValueObject';

export class GameUrl extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value) {
      throw new Error('Game URL cannot be empty');
    }

    // Basic URL validation
    try {
      new URL(value);
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  public static create(value: string): GameUrl {
    const trimmed = value.trim();
    return new GameUrl(trimmed);
  }
}
