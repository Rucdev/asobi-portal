import { User } from "./User";
import type { UserId } from "../value-objects/UserId";
import { UserName } from "../value-objects/UserName";
import { UserType } from "../value-objects/UserType";

/**
 * Playerエンティティ
 * ゲームをプレイするユーザー
 */
export class Player extends User {
	private constructor(
		id: UserId | null,
		name: UserName,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, name, UserType.createPlayer(), createdAt, updatedAt);
	}

	/**
	 * ファクトリメソッド: 新規プレイヤーを作成
	 */
	static create(name: UserName): Player {
		const now = new Date();
		return new Player(null, name, now, now);
	}

	/**
	 * ファクトリメソッド: 既存プレイヤーを復元
	 */
	static reconstruct(
		userId: UserId,
		name: UserName,
		createdAt: Date,
		updatedAt: Date
	): Player {
		return new Player(userId, name, createdAt, updatedAt);
	}
}
