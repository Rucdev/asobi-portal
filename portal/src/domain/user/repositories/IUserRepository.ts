import type { User } from "../entities/User";
import type { UserId } from "../value-objects/UserId";
import type { Email } from "../value-objects/Email";

/**
 * ユーザーリポジトリインターフェース
 * ドメイン層で定義し、インフラ層で実装する
 */
export interface IUserRepository {
	/**
	 * ユーザーを保存（新規作成または更新）
	 * @param user 保存するユーザー
	 * @returns 保存後のユーザー（IDが付与される）
	 */
	save(user: User): Promise<User>;

	/**
	 * ユーザーをパスワード付きで保存（新規登録用）
	 * @param user 保存するユーザー
	 * @param email メールアドレス
	 * @param passwordHash ハッシュ化されたパスワード
	 * @returns 保存後のユーザーID
	 */
	saveWithPassword(user: User, email: Email, passwordHash: string): Promise<number>;

	/**
	 * IDでユーザーを検索
	 * @param id ユーザーID
	 * @returns ユーザー（見つからない場合はnull）
	 */
	findById(id: UserId): Promise<User | null>;

	/**
	 * メールアドレスでユーザーを検索
	 * @param email メールアドレス
	 * @returns ユーザー（見つからない場合はnull）
	 */
	findByEmail(email: Email): Promise<User | null>;

	/**
	 * ユーザーのパスワードハッシュを取得
	 * @param userId ユーザーID
	 * @returns パスワードハッシュ（見つからない場合はnull）
	 */
	getPasswordHash(userId: UserId): Promise<string | null>;

	/**
	 * すべてのユーザーを取得
	 * @returns ユーザーのリスト
	 */
	findAll(): Promise<User[]>;

	/**
	 * ユーザーを削除
	 * @param id ユーザーID
	 */
	delete(id: UserId): Promise<void>;
}
