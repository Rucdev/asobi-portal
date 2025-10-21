import { ICommandHandler } from "../../shared/ICommandHandler";
import { GenerateRecommendationsCommand } from "./GenerateRecommendationsCommand";
import { IRecommendationRepository } from "../../../domain/recommendation/repositories/IRecommendationRepository";
import { IPlayHistoryRepository } from "../../../domain/play-history/repositories/IPlayHistoryRepository";
import { IGameRepository } from "../../../domain/game/repositories/IGameRepository";
import { RecommendationCalculationService } from "../../../domain/recommendation/services/RecommendationCalculationService";
import { Recommendation } from "../../../domain/recommendation/entities/Recommendation";
import { UserId } from "../../../domain/user/value-objects/UserId";
import { GameId } from "../../../domain/game/value-objects/GameId";
import { GameTags } from "../../../domain/game/value-objects/GameTags";
import { RecommendationScore } from "../../../domain/recommendation/value-objects/RecommendationScore";

/**
 * GenerateRecommendationsCommandHandler
 * 指定されたユーザーに対してレコメンデーションを生成する
 */
export class GenerateRecommendationsCommandHandler
  implements ICommandHandler<GenerateRecommendationsCommand, void>
{
  constructor(
    private readonly recommendationRepository: IRecommendationRepository,
    private readonly playHistoryRepository: IPlayHistoryRepository,
    private readonly gameRepository: IGameRepository,
    private readonly calculationService: RecommendationCalculationService
  ) {}

  async handle(command: GenerateRecommendationsCommand): Promise<void> {
    const userId = UserId.reconstruct(command.userId);

    // 1. ユーザーのプレイ履歴を取得
    const playHistories = await this.playHistoryRepository.findByUserId(
      userId
    );

    if (playHistories.length === 0) {
      // プレイ履歴がない場合は何もしない
      return;
    }

    // 2. プレイしたゲームを取得してタグを収集
    const playedGameIds = playHistories.map((ph) => ph.getGameId());
    const playedGames = await Promise.all(
      playedGameIds.map((gameId) => this.gameRepository.findById(gameId))
    );

    const playedGameTags: GameTags[] = playedGames
      .filter((game): game is NonNullable<typeof game> => game !== null)
      .map((game) => game.getTags());

    // 3. 全てのゲームを取得
    const allGames = await this.gameRepository.findAll();

    // 4. プレイ済みゲームを除外した候補ゲームを抽出
    const playedGameIdSet = new Set(
      playedGameIds.map((id) => id.value)
    );
    const candidateGames = allGames.filter(
      (game) => !playedGameIdSet.has(game.id.value)
    );

    // 5. 各候補ゲームのスコアを計算
    const scoredGames: Array<{
      gameId: GameId;
      score: RecommendationScore;
    }> = candidateGames.map((game) => {
      const score = this.calculationService.calculateScore(
        playedGameTags,
        game.getTags()
      );
      return { gameId: game.id, score };
    });

    // 6. スコアでソートして上位N件を取得
    scoredGames.sort((a, b) =>
      RecommendationScore.compare(a.score, b.score)
    );
    const topRecommendations = scoredGames.slice(0, command.limit);

    // 7. 既存のレコメンデーションを削除
    await this.recommendationRepository.deleteByUserId(userId);

    // 8. 新しいレコメンデーションを一括保存
    const recommendations = topRecommendations.map(({ gameId, score }) =>
      Recommendation.create(userId, gameId, score)
    );

    if (recommendations.length > 0) {
      await this.recommendationRepository.saveBatch(recommendations);
    }
  }
}
