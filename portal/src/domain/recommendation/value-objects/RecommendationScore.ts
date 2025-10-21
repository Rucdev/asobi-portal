import { ValueObject } from "../../shared/ValueObject";
import { ValidationError } from "../../shared/DomainError";

/**
 * RecommendationScore value object
 * レコメンデーションのスコア（0.0 ~ 1.0）
 */
export class RecommendationScore extends ValueObject<number> {
  private static readonly MIN_SCORE = 0.0;
  private static readonly MAX_SCORE = 1.0;

  private constructor(value: number) {
    super(value);
  }

  /**
   * RecommendationScoreを作成する
   */
  static create(value: number): RecommendationScore {
    if (value < this.MIN_SCORE || value > this.MAX_SCORE) {
      throw new ValidationError(
        `RecommendationScore must be between ${this.MIN_SCORE} and ${this.MAX_SCORE}, got: ${value}`
      );
    }

    // 小数点以下4桁に丸める
    const roundedValue = Math.round(value * 10000) / 10000;
    return new RecommendationScore(roundedValue);
  }

  /**
   * より高いスコアかどうかを判定する
   */
  isHigherThan(other: RecommendationScore): boolean {
    return this.value > other.value;
  }

  /**
   * 2つのスコアを比較する（ソート用）
   */
  static compare(a: RecommendationScore, b: RecommendationScore): number {
    return b.value - a.value; // 降順（高スコアが先）
  }
}
