import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../shared/ValueObject";
import { ValidationError } from "../../shared/DomainError";

/**
 * RecommendationId value object
 * レコメンデーションを一意に識別するID
 */
export class RecommendationId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  /**
   * 新しいRecommendationIdを生成する
   */
  static generate(): RecommendationId {
    return new RecommendationId(uuidv4());
  }

  /**
   * 既存のUUID文字列からRecommendationIdを再構成する
   */
  static reconstruct(value: string): RecommendationId {
    if (!this.isValidUuid(value)) {
      throw new ValidationError(`Invalid RecommendationId format: ${value}`);
    }
    return new RecommendationId(value);
  }

  /**
   * UUID形式の検証
   */
  private static isValidUuid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
