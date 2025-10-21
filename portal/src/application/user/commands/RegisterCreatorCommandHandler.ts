import type { ICommandHandler } from "../../shared/ICommandHandler";
import type { RegisterCreatorCommand } from "./RegisterCreatorCommand";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository";
import { Creator } from "../../../domain/user/entities/Creator";
import { UserName } from "../../../domain/user/value-objects/UserName";
import type { UserDto } from "../queries/dto/UserDto";

/**
 * クリエイター登録コマンドハンドラー
 */
export class RegisterCreatorCommandHandler
	implements ICommandHandler<RegisterCreatorCommand, UserDto>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(command: RegisterCreatorCommand): Promise<UserDto> {
		// 値オブジェクトを作成
		const name = UserName.create(command.name);

		// クリエイターエンティティを作成
		const creator = Creator.create(name);

		// リポジトリに保存
		const savedCreator = await this.userRepository.save(creator);

		// DTOに変換して返す
		return {
			id: savedCreator.id?.value ?? 0,
			name: savedCreator.name.trimmedValue,
			type: "creator",
		};
	}
}
