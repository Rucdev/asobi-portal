import { IQuery } from "../../shared/IQuery";
import { RecommendationDto } from "./dto/RecommendationDto";

/**
 * GetRecommendationsQuery
 * 指定されたユーザーのレコメンデーションを取得する
 */
export class GetRecommendationsQuery implements IQuery<RecommendationDto[]> {
  constructor(
    public readonly userId: number,
    public readonly limit?: number
  ) {}
}
