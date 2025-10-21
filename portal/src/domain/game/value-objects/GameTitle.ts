import { ValueObject } from '../../shared/ValueObject';

export class GameTitle extends ValueObject<string> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 200;

  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (value.length < GameTitle.MIN_LENGTH) {
      throw new Error('Game title cannot be empty');
    }

    if (value.length > GameTitle.MAX_LENGTH) {
      throw new Error(`Game title must be ${GameTitle.MAX_LENGTH} characters or less`);
    }
  }

  public static create(value: string): GameTitle {
    const trimmed = value.trim();
    return new GameTitle(trimmed);
  }
}
