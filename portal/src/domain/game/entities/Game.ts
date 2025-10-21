import { Entity } from '../../shared/Entity';
import { UserId } from '../../user/value-objects/UserId';
import { GameId } from '../value-objects/GameId';
import { GameTitle } from '../value-objects/GameTitle';
import { GameUrl } from '../value-objects/GameUrl';
import { GameTags } from '../value-objects/GameTags';
import { ReviewContent } from '../value-objects/ReviewContent';
import { ReviewRating } from '../value-objects/ReviewRating';
import { Review } from './Review';

export class Game extends Entity<GameId> {
  private _title: GameTitle;
  private _url: GameUrl;
  private _tags: GameTags;
  private _creatorId: UserId;
  private _reviews: Review[];
  private constructor(
    id: GameId,
    title: GameTitle,
    url: GameUrl,
    tags: GameTags,
    creatorId: UserId,
    reviews: Review[],
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this._title = title;
    this._url = url;
    this._tags = tags;
    this._creatorId = creatorId;
    this._reviews = reviews;
  }

  public static create(
    gameId: GameId,
    title: GameTitle,
    url: GameUrl,
    tags: GameTags,
    creatorId: UserId
  ): Game {
    const now = new Date();
    return new Game(
      gameId,
      title,
      url,
      tags,
      creatorId,
      [],
      now,
      now
    );
  }

  public static reconstruct(
    gameId: GameId,
    title: GameTitle,
    url: GameUrl,
    tags: GameTags,
    creatorId: UserId,
    reviews: Review[],
    createdAt: Date,
    updatedAt: Date
  ): Game {
    return new Game(gameId, title, url, tags, creatorId, reviews, createdAt, updatedAt);
  }

  // Getters

  public get title(): GameTitle {
    return this._title;
  }

  public get url(): GameUrl {
    return this._url;
  }

  public get tags(): GameTags {
    return this._tags;
  }

  public get creatorId(): UserId {
    return this._creatorId;
  }

  public get reviews(): Review[] {
    return [...this._reviews];
  }


  // Business logic
  public isOwnedBy(userId: UserId): boolean {
    return this._creatorId.equals(userId);
  }

  public addReview(userId: UserId, content: ReviewContent, rating: ReviewRating): void {
    // Check if user is the creator (creators cannot review their own games)
    if (this.isOwnedBy(userId)) {
      throw new Error('Creators cannot review their own games');
    }

    // Check if user already reviewed this game
    const existingReview = this._reviews.find(review => review.userId.equals(userId));
    if (existingReview) {
      throw new Error('User has already reviewed this game');
    }

    const review = Review.create(userId, content, rating);
    this._reviews.push(review);
    this.touch();
  }

  public updateReview(userId: UserId, content: ReviewContent, rating: ReviewRating): void {
    const review = this._reviews.find(r => r.userId.equals(userId));

    if (!review) {
      throw new Error('Review not found');
    }

    review.update(content, rating);
    this.touch();
  }

  public getReviewByUser(userId: UserId): Review | undefined {
    return this._reviews.find(review => review.userId.equals(userId));
  }

  public getAverageRating(): number | null {
    if (this._reviews.length === 0) {
      return null;
    }

    const sum = this._reviews.reduce((acc, review) => acc + review.rating.value, 0);
    return sum / this._reviews.length;
  }

  public getReviewCount(): number {
    return this._reviews.length;
  }
}
