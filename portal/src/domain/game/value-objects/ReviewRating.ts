import { ValueObject } from '../../shared/ValueObject';

export class ReviewRating extends ValueObject<number> {
  private static readonly MIN_RATING = 1;
  private static readonly MAX_RATING = 5;

  private constructor(value: number) {
    super(value);
  }

  protected validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Rating must be an integer');
    }

    if (value < ReviewRating.MIN_RATING || value > ReviewRating.MAX_RATING) {
      throw new Error(`Rating must be between ${ReviewRating.MIN_RATING} and ${ReviewRating.MAX_RATING}`);
    }
  }

  public static create(value: number): ReviewRating {
    return new ReviewRating(value);
  }
}
