import { GameTags } from "../../game/value-objects/GameTags";
import { RecommendationScore } from "../value-objects/RecommendationScore";

/**
 * RecommendationCalculationService
 * レコメンデーションスコアの計算ロジックを提供するドメインサービス
 */
export class RecommendationCalculationService {
  /**
   * タグの一致度に基づいてスコアを計算する
   *
   * @param userPlayedGameTags ユーザーがプレイしたゲームのタグリスト
   * @param candidateGameTags 候補ゲームのタグ
   * @returns RecommendationScore (0.0 ~ 1.0)
   */
  calculateScore(
    userPlayedGameTags: GameTags[],
    candidateGameTags: GameTags
  ): RecommendationScore {
    // ユーザーがプレイしたゲームのタグを全て集約
    const allPlayedTags = userPlayedGameTags.flatMap((tags) => tags.getTags());

    if (allPlayedTags.length === 0) {
      // プレイ履歴がない場合は0スコア
      return RecommendationScore.create(0);
    }

    // 候補ゲームのタグ
    const candidateTags = candidateGameTags.getTags();

    if (candidateTags.length === 0) {
      // 候補ゲームにタグがない場合は0スコア
      return RecommendationScore.create(0);
    }

    // タグの出現頻度をカウント（よりプレイしているタグを重視）
    const tagFrequency = new Map<string, number>();
    allPlayedTags.forEach((tag) => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    });

    // 候補ゲームのタグとのマッチング計算
    let matchScore = 0;
    let maxPossibleScore = 0;

    candidateTags.forEach((candidateTag) => {
      const frequency = tagFrequency.get(candidateTag) || 0;
      matchScore += frequency;
    });

    // 最大スコアは、全ての候補タグが最も頻繁に出現したタグと一致した場合
    const maxFrequency = Math.max(...Array.from(tagFrequency.values()));
    maxPossibleScore = candidateTags.length * maxFrequency;

    // 正規化（0.0 ~ 1.0）
    const normalizedScore =
      maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0;

    return RecommendationScore.create(normalizedScore);
  }

  /**
   * Jaccard係数を用いた類似度計算（代替アルゴリズム）
   *
   * @param userPlayedGameTags ユーザーがプレイしたゲームのタグリスト
   * @param candidateGameTags 候補ゲームのタグ
   * @returns RecommendationScore (0.0 ~ 1.0)
   */
  calculateJaccardSimilarity(
    userPlayedGameTags: GameTags[],
    candidateGameTags: GameTags
  ): RecommendationScore {
    // ユーザーがプレイしたゲームのタグを全て集約（重複排除）
    const userTagsSet = new Set(
      userPlayedGameTags.flatMap((tags) => tags.getTags())
    );

    const candidateTagsSet = new Set(candidateGameTags.getTags());

    if (userTagsSet.size === 0 || candidateTagsSet.size === 0) {
      return RecommendationScore.create(0);
    }

    // 積集合のサイズを計算
    const intersection = new Set(
      [...userTagsSet].filter((tag) => candidateTagsSet.has(tag))
    );

    // 和集合のサイズを計算
    const union = new Set([...userTagsSet, ...candidateTagsSet]);

    // Jaccard係数 = |A ∩ B| / |A ∪ B|
    const jaccardScore = intersection.size / union.size;

    return RecommendationScore.create(jaccardScore);
  }
}
