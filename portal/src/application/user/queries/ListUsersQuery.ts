import type { IQuery } from "../../shared/IQuery";
import type { UserDto } from "./dto/UserDto";

/**
 * ユーザー一覧取得クエリ
 */
export class ListUsersQuery implements IQuery<UserDto[]> {
	// フィルタリングオプションは必要に応じて追加
	constructor() {}
}
