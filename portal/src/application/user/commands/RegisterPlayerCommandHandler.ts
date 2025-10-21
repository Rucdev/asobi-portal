import type { ICommandHandler } from "../../shared/ICommandHandler";
import type { RegisterPlayerCommand } from "./RegisterPlayerCommand";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository";
import { Player } from "../../../domain/user/entities/Player";
import { UserName } from "../../../domain/user/value-objects/UserName";
import type { UserDto } from "../queries/dto/UserDto";

/**
 * プレイヤー登録コマンドハンドラー
 */
export class RegisterPlayerCommandHandler
	implements ICommandHandler<RegisterPlayerCommand, UserDto>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(command: RegisterPlayerCommand): Promise<UserDto> {
		// 値オブジェクトを作成
		const name = UserName.create(command.name);

		// プレイヤーエンティティを作成
		const player = Player.create(name);

		// リポジトリに保存
		const savedPlayer = await this.userRepository.save(player);

		// DTOに変換して返す
		return {
			id: savedPlayer.id?.value ?? 0,
			name: savedPlayer.name.trimmedValue,
			type: "player",
		};
	}
}
