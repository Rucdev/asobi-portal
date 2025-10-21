import { IQueryHandler } from "../../shared/IQueryHandler";
import { GetRecommendationsQuery } from "./GetRecommendationsQuery";
import { RecommendationDto } from "./dto/RecommendationDto";
import { IRecommendationRepository } from "../../../domain/recommendation/repositories/IRecommendationRepository";
import { UserId } from "../../../domain/user/value-objects/UserId";

/**
 * GetRecommendationsQueryHandler
 * 指定されたユーザーのレコメンデーションを取得する
 */
export class GetRecommendationsQueryHandler
  implements IQueryHandler<GetRecommendationsQuery, RecommendationDto[]>
{
  constructor(
    private readonly recommendationRepository: IRecommendationRepository
  ) {}

  async handle(query: GetRecommendationsQuery): Promise<RecommendationDto[]> {
    const userId = UserId.reconstruct(query.userId);

    const recommendations = await this.recommendationRepository.findByUserId(
      userId,
      query.limit
    );

    return recommendations.map((recommendation) =>
      RecommendationDto.fromEntity(recommendation)
    );
  }
}
