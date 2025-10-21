import * as bcrypt from 'bcrypt';
/**
 * パスワードハッシュ化サービス
 * パスワードのハッシュ化と検証を行う
 */
export class PasswordHashService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * パスワードをハッシュ化する
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordHashService.SALT_ROUNDS);
  }

  /**
   * パスワードを検証する
   */
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
