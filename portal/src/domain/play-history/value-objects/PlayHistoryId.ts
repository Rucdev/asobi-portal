import { ValueObject } from '../../shared/ValueObject';

export class PlayHistoryId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('PlayHistoryId cannot be empty');
    }
  }

  public static create(value: string): PlayHistoryId {
    return new PlayHistoryId(value);
  }

  public static generate(): PlayHistoryId {
    return new PlayHistoryId(crypto.randomUUID());
  }

  /**
   * 既存の値からPlayHistoryIdを復元（DB取得時）
   */
  public static reconstruct(value: string): PlayHistoryId {
    return new PlayHistoryId(value);
  }
}
