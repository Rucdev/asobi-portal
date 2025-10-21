import { Recommendation } from "../../../../domain/recommendation/entities/Recommendation";

/**
 * RecommendationDto
 * レコメンデーション情報を表現するDTO
 */
export class RecommendationDto {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly gameId: string,
    public readonly score: number,
    public readonly calculatedAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Recommendationエンティティから変換
   */
  static fromEntity(recommendation: Recommendation): RecommendationDto {
    return new RecommendationDto(
      recommendation.id.value,
      recommendation.getUserId().value,
      recommendation.getGameId().value,
      recommendation.getScore().value,
      recommendation.getCalculatedAt(),
      recommendation.getCreatedAt(),
      recommendation.getUpdatedAt()
    );
  }
}
