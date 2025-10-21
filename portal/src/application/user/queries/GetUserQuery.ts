import type { IQuery } from "../../shared/IQuery";
import type { UserDto } from "./dto/UserDto";

/**
 * ユーザー取得クエリ
 */
export class GetUserQuery implements IQuery<UserDto | null> {
	constructor(public readonly userId: number) {}
}
