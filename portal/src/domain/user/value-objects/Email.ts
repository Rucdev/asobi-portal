import { ValueObject } from '../../shared/ValueObject';
import { ValidationError } from '../../shared/DomainError';

/**
 * メールアドレス値オブジェクト
 */
export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  protected validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Email must be a non-empty string');
    }

    const trimmed = value.trim();
    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError('Invalid email format');
    }
  }

  /**
   * 正規化されたメールアドレスを取得（小文字化）
   */
  get normalizedValue(): string {
    return this._value.toLowerCase().trim();
  }

  /**
   * ファクトリメソッド
   */
  static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }
}
