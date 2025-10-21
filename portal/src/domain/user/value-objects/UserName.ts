import { ValueObject } from "../../shared/ValueObject";
import { ValidationError } from "../../shared/DomainError";

/**
 * ユーザー名値オブジェクト
 */
export class UserName extends ValueObject<string> {
	private static readonly MIN_LENGTH = 1;
	private static readonly MAX_LENGTH = 100;

	protected validate(value: string): void {
		if (!value || typeof value !== "string") {
			throw new ValidationError("UserName must be a non-empty string");
		}

		const trimmed = value.trim();
		if (trimmed.length < UserName.MIN_LENGTH) {
			throw new ValidationError(
				`UserName must be at least ${UserName.MIN_LENGTH} character(s)`,
			);
		}

		if (trimmed.length > UserName.MAX_LENGTH) {
			throw new ValidationError(
				`UserName must not exceed ${UserName.MAX_LENGTH} characters`,
			);
		}
	}

	/**
	 * トリミングされた名前を取得
	 */
	get trimmedValue(): string {
		return this._value.trim();
	}

	/**
	 * ファクトリメソッド
	 */
	static create(name: string): UserName {
		return new UserName(name);
	}
}
