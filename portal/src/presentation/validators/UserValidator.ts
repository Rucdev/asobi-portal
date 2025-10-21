/**
 * ユーザー登録リクエストのバリデーション結果
 */
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

/**
 * ユーザーバリデーター
 * プレゼンテーション層でのリクエストバリデーション
 */
export class UserValidator {
	/**
	 * ユーザー登録リクエストのバリデーション
	 */
	static validateRegisterRequest(body: unknown): ValidationResult {
		const errors: string[] = [];

		if (!body || typeof body !== "object") {
			errors.push("Request body must be an object");
			return { isValid: false, errors };
		}

		const { name, type } = body as Record<string, unknown>;

		// 名前のバリデーション
		if (!name || typeof name !== "string") {
			errors.push("Name is required and must be a string");
		} else if (name.trim().length === 0) {
			errors.push("Name cannot be empty");
		} else if (name.trim().length > 100) {
			errors.push("Name must not exceed 100 characters");
		}

		// タイプのバリデーション（オプショナル、デフォルトはplayer）
		if (type !== undefined && type !== "player" && type !== "creator") {
			errors.push("Type must be either 'player' or 'creator'");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
