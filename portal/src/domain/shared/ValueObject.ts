/**
 * 値オブジェクトの基底クラス
 * 値オブジェクトは不変であり、属性によって同一性が決定される
 */
export abstract class ValueObject<T> {
	protected readonly _value: T;

	constructor(value: T) {
		this.validate(value);
		this._value = value;
	}

	/**
	 * 値オブジェクトの値を取得
	 */
	get value(): T {
		return this._value;
	}

	/**
	 * 値オブジェクトのバリデーション
	 * サブクラスでオーバーライドして実装する
	 */
	protected abstract validate(value: T): void;

	/**
	 * 値オブジェクトの同一性を比較
	 * 保持している値が同じであれば同じ値オブジェクトとみなす
	 */
	equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (!(vo instanceof ValueObject)) {
			return false;
		}

		return this._value === vo._value;
	}
}
