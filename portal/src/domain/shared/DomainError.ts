/**
 * ドメインエラーの基底クラス
 * ドメイン層で発生するビジネスルール違反などのエラーを表現
 */
export abstract class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		// スタックトレースを正しく保持するための設定
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

/**
 * バリデーションエラー
 * 値オブジェクトやエンティティのバリデーション失敗時に使用
 */
export class ValidationError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

/**
 * ビジネスルール違反エラー
 * ドメインのビジネスルール違反時に使用
 */
export class BusinessRuleViolationError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

/**
 * エンティティが見つからないエラー
 */
export class EntityNotFoundError extends DomainError {
	constructor(entityName: string, id: string | number) {
		super(`${entityName} with id ${id} not found`);
	}
}
