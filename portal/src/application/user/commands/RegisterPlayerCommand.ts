import type { ICommand } from "../../shared/ICommand";

/**
 * プレイヤー登録コマンド
 */
export class RegisterPlayerCommand implements ICommand {
	constructor(public readonly name: string) {}
}
