import type { ICommand } from "./ICommand";

/**
 * CommandHandlerインターフェース
 * Commandを受け取り、ビジネスロジックを実行する
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
	/**
	 * Commandを実行
	 * @param command 実行するCommand
	 * @returns 実行結果
	 */
	execute(command: TCommand): Promise<TResult>;
}
