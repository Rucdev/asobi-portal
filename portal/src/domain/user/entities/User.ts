import { Entity } from "../../shared/Entity";
import type { UserId } from "../value-objects/UserId";
import { UserName } from "../value-objects/UserName";
import { UserType, UserTypeEnum } from "../value-objects/UserType";

/**
 * User集約ルート
 * プレイヤーとクリエイターの基底となるエンティティ
 */
export class User extends Entity<UserId | null> {
	private _name: UserName;
	private _type: UserType;

	protected constructor(
		id: UserId | null,
		name: UserName,
		type: UserType,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this._name = name;
		this._type = type;
	}

	/**
	 * ユーザー名を取得
	 */
	get name(): UserName {
		return this._name;
	}

	/**
	 * ユーザータイプを取得
	 */
	get type(): UserType {
		return this._type;
	}

	/**
	 * ユーザー名を変更
	 */
	changeName(name: UserName): void {
		this._name = name;
		this.touch();
	}

	/**
	 * プレイヤーかどうかを判定
	 */
	isPlayer(): boolean {
		return this._type.isPlayer();
	}

	/**
	 * クリエイターかどうかを判定
	 */
	isCreator(): boolean {
		return this._type.isCreator();
	}

	/**
	 * ファクトリメソッド: 新規プレイヤーを作成
	 */
	static createPlayer(name: UserName): User {
		const now = new Date();
		return new User(null, name, UserType.createPlayer(), now, now);
	}

	/**
	 * ファクトリメソッド: 新規クリエイターを作成
	 */
	static createCreator(name: UserName): User {
		const now = new Date();
		return new User(null, name, UserType.createCreator(), now, now);
	}

	/**
	 * ファクトリメソッド: 既存ユーザーを復元
	 */
	static reconstruct(
		id: UserId,
		name: UserName,
		type: UserType,
		createdAt: Date,
		updatedAt: Date
	): User {
		return new User(id, name, type, createdAt, updatedAt);
	}
}
