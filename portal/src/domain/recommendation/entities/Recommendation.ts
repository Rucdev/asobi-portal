import { Entity } from "../../shared/Entity";
import { RecommendationId } from "../value-objects/RecommendationId";
import { RecommendationScore } from "../value-objects/RecommendationScore";
import { UserId } from "../../user/value-objects/UserId";
import { GameId } from "../../game/value-objects/GameId";

/**
 * Recommendation entity (aggregate root)
 * ユーザーに対するゲームのレコメンデーション
 */
export class Recommendation extends Entity<RecommendationId> {
  private constructor(
    id: RecommendationId,
    private readonly userId: UserId,
    private readonly gameId: GameId,
    private score: RecommendationScore,
    private readonly calculatedAt: Date,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  /**
   * 新しいRecommendationを作成する
   */
  static create(
    userId: UserId,
    gameId: GameId,
    score: RecommendationScore
  ): Recommendation {
    const now = new Date();
    return new Recommendation(
      RecommendationId.generate(),
      userId,
      gameId,
      score,
      now, // calculatedAt
      now, // createdAt
      now // updatedAt
    );
  }

  /**
   * 既存のRecommendationを再構成する（リポジトリから取得時）
   */
  static reconstruct(
    id: string,
    userId: number,
    gameId: string,
    score: number,
    calculatedAt: Date,
    createdAt: Date,
    updatedAt: Date
  ): Recommendation {
    return new Recommendation(
      RecommendationId.reconstruct(id),
      UserId.reconstruct(userId),
      GameId.reconstruct(gameId),
      RecommendationScore.create(score),
      calculatedAt,
      createdAt,
      updatedAt
    );
  }

  /**
   * スコアを更新する（再計算時）
   */
  updateScore(newScore: RecommendationScore): void {
    this.score = newScore;
    this.touch();
  }

  // Getters
  getUserId(): UserId {
    return this.userId;
  }

  getGameId(): GameId {
    return this.gameId;
  }

  getScore(): RecommendationScore {
    return this.score;
  }

  getCalculatedAt(): Date {
    return this.calculatedAt;
  }
}
