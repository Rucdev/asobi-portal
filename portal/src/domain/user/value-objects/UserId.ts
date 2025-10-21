import { ValueObject } from "../../shared/ValueObject";
import { ValidationError } from "../../shared/DomainError";

/**
 * ユーザーID値オブジェクト
 */
export class UserId extends ValueObject<number> {
	protected validate(value: number): void {
		if (!Number.isInteger(value) || value <= 0) {
			throw new ValidationError("UserId must be a positive integer");
		}
	}

	/**
	 * ファクトリメソッド: 新規作成用（IDが未定の場合）
	 */
	static create(): UserId | null {
		// 新規作成時はIDがまだ割り当てられていない
		return null;
	}

	/**
	 * ファクトリメソッド: 既存IDから復元（DB取得時）
	 */
	static reconstruct(id: number): UserId {
		return new UserId(id);
	}
}
