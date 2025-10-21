import { User } from "./User";
import type { UserId } from "../value-objects/UserId";
import { UserName } from "../value-objects/UserName";
import { UserType } from "../value-objects/UserType";

/**
 * Creatorエンティティ
 * ゲームをパブリッシュできるユーザー
 */
export class Creator extends User {
	private constructor(
		id: UserId | null,
		name: UserName,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, name, UserType.createCreator(), createdAt, updatedAt);
	}

	/**
	 * ゲームをパブリッシュできるかを判定
	 * Creatorは常にゲームをパブリッシュできる
	 */
	canPublishGame(): boolean {
		return true;
	}

	/**
	 * ファクトリメソッド: 新規クリエイターを作成
	 */
	static create(name: UserName): Creator {
		const now = new Date();
		return new Creator(null, name, now, now);
	}

	/**
	 * ファクトリメソッド: 既存クリエイターを復元
	 */
	static reconstruct(
		userId: UserId,
		name: UserName,
		createdAt: Date,
		updatedAt: Date
	): Creator {
		return new Creator(userId, name, createdAt, updatedAt);
	}
}
