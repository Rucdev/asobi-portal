import { Entity } from '../../shared/Entity';
import { UserId } from '../../user/value-objects/UserId';
import { ReviewId } from '../value-objects/ReviewId';
import { ReviewContent } from '../value-objects/ReviewContent';
import { ReviewRating } from '../value-objects/ReviewRating';

export class Review extends Entity<ReviewId> {
  private _userId: UserId;
  private _content: ReviewContent;
  private _rating: ReviewRating;

  private constructor(
    id: ReviewId,
    userId: UserId,
    content: ReviewContent,
    rating: ReviewRating,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this._userId = userId;
    this._content = content;
    this._rating = rating;
  }

  public static create(
    userId: UserId,
    content: ReviewContent,
    rating: ReviewRating
  ): Review {
    const now = new Date();
    return new Review(
      ReviewId.generate(),
      userId,
      content,
      rating,
      now,
      now
    );
  }

  public static reconstruct(
    id: ReviewId,
    userId: UserId,
    content: ReviewContent,
    rating: ReviewRating,
    createdAt: Date,
    updatedAt: Date
  ): Review {
    return new Review(id, userId, content, rating, createdAt, updatedAt);
  }

  // Getters
  public get userId(): UserId {
    return this._userId;
  }

  public get content(): ReviewContent {
    return this._content;
  }

  public get rating(): ReviewRating {
    return this._rating;
  }

  // Business logic
  public update(content: ReviewContent, rating: ReviewRating): void {
    this._content = content;
    this._rating = rating;
    this.touch();
  }

  public isOwnedBy(userId: UserId): boolean {
    return this._userId.equals(userId);
  }
}
