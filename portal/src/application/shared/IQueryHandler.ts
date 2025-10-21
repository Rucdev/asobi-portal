import type { IQuery } from "./IQuery";

/**
 * QueryHandlerインターフェース
 * Queryを受け取り、データを取得して返す
 */
export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
	/**
	 * Queryを実行
	 * @param query 実行するQuery
	 * @returns クエリ結果
	 */
	execute(query: TQuery): Promise<TResult>;
}
