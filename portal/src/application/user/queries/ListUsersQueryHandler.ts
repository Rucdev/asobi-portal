import type { IQueryHandler } from "../../shared/IQueryHandler";
import type { ListUsersQuery } from "./ListUsersQuery";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository";
import type { UserDto } from "./dto/UserDto";

/**
 * ユーザー一覧取得クエリハンドラー
 */
export class ListUsersQueryHandler
	implements IQueryHandler<ListUsersQuery, UserDto[]>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(query: ListUsersQuery): Promise<UserDto[]> {
		const users = await this.userRepository.findAll();

		return users.map((user) => ({
			id: user.id?.value ?? 0,
			name: user.name.trimmedValue,
			type: user.type.value,
		}));
	}
}
