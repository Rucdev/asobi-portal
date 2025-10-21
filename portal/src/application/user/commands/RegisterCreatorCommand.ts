import type { ICommand } from "../../shared/ICommand";

/**
 * クリエイター登録コマンド
 */
export class RegisterCreatorCommand implements ICommand {
	constructor(public readonly name: string) {}
}
