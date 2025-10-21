/**
 * エンティティの基底クラス
 * エンティティは一意の識別子（ID）を持ち、ライフサイクル全体を通じて追跡される
 */
export abstract class Entity<T> {
	protected readonly _id: T;
	protected readonly createdAt: Date;
	protected updatedAt: Date;

	constructor(id: T, createdAt: Date, updatedAt: Date) {
		this._id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	/**
	 * エンティティのIDを取得
	 */
	get id(): T {
		return this._id;
	}

	/**
	 * エンティティの作成日時を取得
	 */
	getCreatedAt(): Date {
		return this.createdAt;
	}

	/**
	 * エンティティの更新日時を取得
	 */
	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	/**
	 * エンティティを更新（updatedAtを現在時刻に設定）
	 */
	protected touch(): void {
		this.updatedAt = new Date();
	}

	/**
	 * エンティティの同一性を比較
	 * IDが同じであれば同じエンティティとみなす
	 */
	equals(entity?: Entity<T>): boolean {
		if (entity === null || entity === undefined) {
			return false;
		}

		if (this === entity) {
			return true;
		}

		if (!(entity instanceof Entity)) {
			return false;
		}

		return this._id === entity._id;
	}
}
