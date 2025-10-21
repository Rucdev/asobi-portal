import { db } from "../persistence/database";
import { DrizzleRecommendationRepository } from "../persistence/drizzle/repositories/DrizzleRecommendationRepository";
import { DrizzlePlayHistoryRepository } from "../persistence/drizzle/repositories/DrizzlePlayHistoryRepository";
import { DrizzleGameRepository } from "../persistence/drizzle/repositories/DrizzleGameRepository";
import { RecommendationCalculationService } from "../../domain/recommendation/services/RecommendationCalculationService";
import { GenerateRecommendationsCommandHandler } from "../../application/recommendation/commands/GenerateRecommendationsCommandHandler";
import { GenerateRecommendationsCommand } from "../../application/recommendation/commands/GenerateRecommendationsCommand";
import { DrizzleUserRepository } from "../persistence/drizzle/repositories/DrizzleUserRepository";

/**
 * recommendation-generator.ts
 * 全ユーザーのレコメンデーションを生成するバッチスクリプト
 */

async function main() {
  console.log("Starting recommendation generation...");

  // リポジトリとサービスの初期化
  const recommendationRepository = new DrizzleRecommendationRepository(db);
  const playHistoryRepository = new DrizzlePlayHistoryRepository(db);
  const gameRepository = new DrizzleGameRepository(db);
  const userRepository = new DrizzleUserRepository(db);
  const calculationService = new RecommendationCalculationService();

  const commandHandler = new GenerateRecommendationsCommandHandler(
    recommendationRepository,
    playHistoryRepository,
    gameRepository,
    calculationService
  );

  // 全ユーザーを取得
  const users = await userRepository.findAll();
  console.log(`Found ${users.length} users`);

  // 各ユーザーに対してレコメンデーションを生成
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const user of users) {
    const userId = user.id.value;

    try {
      console.log(`Generating recommendations for user ${userId}...`);

      const command = new GenerateRecommendationsCommand(userId, 10);
      await commandHandler.handle(command);

      // プレイ履歴がない場合は何も生成されない
      const playHistories = await playHistoryRepository.findByUserId(
        user.id
      );

      if (playHistories.length === 0) {
        console.log(`  -> Skipped (no play history)`);
        skipCount++;
      } else {
        console.log(`  -> Success`);
        successCount++;
      }
    } catch (error) {
      console.error(`  -> Error: ${error}`);
      errorCount++;
    }
  }

  console.log("\nRecommendation generation completed!");
  console.log(`  Success: ${successCount}`);
  console.log(`  Skipped: ${skipCount}`);
  console.log(`  Errors: ${errorCount}`);
}

// スクリプト実行
main()
  .then(() => {
    console.log("Batch job finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Batch job failed:", error);
    process.exit(1);
  });
