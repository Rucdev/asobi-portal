import { ValueObject } from '../../shared/ValueObject';

export class ReviewContent extends ValueObject<string> {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 2000;

  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (value.length < ReviewContent.MIN_LENGTH) {
      throw new Error(`Review content must be at least ${ReviewContent.MIN_LENGTH} characters`);
    }

    if (value.length > ReviewContent.MAX_LENGTH) {
      throw new Error(`Review content must be ${ReviewContent.MAX_LENGTH} characters or less`);
    }
  }

  public static create(value: string): ReviewContent {
    const trimmed = value.trim();
    return new ReviewContent(trimmed);
  }
}
