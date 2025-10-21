import { ValueObject } from '../../shared/ValueObject';

export class GameId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('GameId cannot be empty');
    }
  }

  public static create(value: string): GameId {
    return new GameId(value);
  }

  public static generate(): GameId {
    return new GameId(crypto.randomUUID());
  }

  /**
   * 既存の値からGameIdを復元（DB取得時）
   */
  public static reconstruct(value: string): GameId {
    return new GameId(value);
  }
}
