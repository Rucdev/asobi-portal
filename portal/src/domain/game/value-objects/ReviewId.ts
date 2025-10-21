import { ValueObject } from '../../shared/ValueObject';

export class ReviewId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('ReviewId cannot be empty');
    }
  }

  public static generate(): ReviewId {
    return new ReviewId(crypto.randomUUID());
  }

  /**
   * 既存の値からReviewIdを復元（DB取得時）
   */
  public static reconstruct(value: string): ReviewId {
    return new ReviewId(value);
  }
}
