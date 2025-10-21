import { Recommendation } from "../entities/Recommendation";
import { RecommendationId } from "../value-objects/RecommendationId";
import { UserId } from "../../user/value-objects/UserId";
import { GameId } from "../../game/value-objects/GameId";

/**
 * IRecommendationRepository
 * Recommendationの永続化を抽象化するリポジトリインターフェース
 */
export interface IRecommendationRepository {
  /**
   * Recommendationを保存する
   */
  save(recommendation: Recommendation): Promise<void>;

  /**
   * IDでRecommendationを取得する
   */
  findById(id: RecommendationId): Promise<Recommendation | null>;

  /**
   * ユーザーIDでRecommendationリストを取得する（スコア降順、上限あり）
   */
  findByUserId(userId: UserId, limit?: number): Promise<Recommendation[]>;

  /**
   * ユーザーとゲームの組み合わせでRecommendationを取得する
   */
  findByUserIdAndGameId(
    userId: UserId,
    gameId: GameId
  ): Promise<Recommendation | null>;

  /**
   * ユーザーの既存のRecommendationを全削除する（再計算時）
   */
  deleteByUserId(userId: UserId): Promise<void>;

  /**
   * 複数のRecommendationを一括保存する（バッチ処理用）
   */
  saveBatch(recommendations: Recommendation[]): Promise<void>;
}
