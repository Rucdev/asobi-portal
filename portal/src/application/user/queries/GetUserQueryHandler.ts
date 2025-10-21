import type { IQueryHandler } from "../../shared/IQueryHandler";
import type { GetUserQuery } from "./GetUserQuery";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository";
import { UserId } from "../../../domain/user/value-objects/UserId";
import type { UserDto } from "./dto/UserDto";

/**
 * ユーザー取得クエリハンドラー
 */
export class GetUserQueryHandler
	implements IQueryHandler<GetUserQuery, UserDto | null>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(query: GetUserQuery): Promise<UserDto | null> {
		const userId = UserId.reconstruct(query.userId);
		const user = await this.userRepository.findById(userId);

		if (!user) {
			return null;
		}

		return {
			id: user.id?.value ?? 0,
			name: user.name.trimmedValue,
			type: user.type.value,
		};
	}
}
