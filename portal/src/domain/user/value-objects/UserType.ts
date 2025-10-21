import { ValueObject } from "../../shared/ValueObject";
import { ValidationError } from "../../shared/DomainError";

/**
 * ユーザータイプの種類
 */
export enum UserTypeEnum {
	PLAYER = "player",
	CREATOR = "creator",
}

/**
 * ユーザータイプ値オブジェクト
 * プレイヤーとクリエイターを区別する
 */
export class UserType extends ValueObject<UserTypeEnum> {
	protected validate(value: UserTypeEnum): void {
		if (!Object.values(UserTypeEnum).includes(value)) {
			throw new ValidationError(
				`UserType must be either ${UserTypeEnum.PLAYER} or ${UserTypeEnum.CREATOR}`,
			);
		}
	}

	/**
	 * プレイヤーかどうかを判定
	 */
	isPlayer(): boolean {
		return this._value === UserTypeEnum.PLAYER;
	}

	/**
	 * クリエイターかどうかを判定
	 */
	isCreator(): boolean {
		return this._value === UserTypeEnum.CREATOR;
	}

	/**
	 * ファクトリメソッド: プレイヤータイプを作成
	 */
	static createPlayer(): UserType {
		return new UserType(UserTypeEnum.PLAYER);
	}

	/**
	 * ファクトリメソッド: クリエイタータイプを作成
	 */
	static createCreator(): UserType {
		return new UserType(UserTypeEnum.CREATOR);
	}

	/**
	 * ファクトリメソッド: 文字列から復元
	 */
	static fromString(type: string): UserType {
		const enumValue = type as UserTypeEnum;
		return new UserType(enumValue);
	}
}
