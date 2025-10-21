import { ValueObject } from '../../shared/ValueObject';
import { ValidationError } from '../../shared/DomainError';

/**
 * パスワード値オブジェクト
 * セキュリティのため、平文パスワードのみを扱う（ハッシュ化は infrastructure 層で行う）
 */
export class Password extends ValueObject<string> {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  protected validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Password must be a non-empty string');
    }

    if (value.length < Password.MIN_LENGTH) {
      throw new ValidationError(`Password must be at least ${Password.MIN_LENGTH} characters`);
    }

    if (value.length > Password.MAX_LENGTH) {
      throw new ValidationError(`Password must not exceed ${Password.MAX_LENGTH} characters`);
    }

    // パスワードの強度チェック（少なくとも1つの数字と1つの文字を含む）
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasNumber || !hasLetter) {
      throw new ValidationError('Password must contain at least one letter and one number');
    }
  }

  /**
   * ファクトリメソッド
   */
  static create(password: string): Password {
    return new Password(password);
  }
}
