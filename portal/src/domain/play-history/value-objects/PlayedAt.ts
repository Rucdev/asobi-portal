import { ValueObject } from '../../shared/ValueObject';

export class PlayedAt extends ValueObject<Date> {
  private constructor(value: Date) {
    super(value);
  }

  protected validate(value: Date): void {
    if (!(value instanceof Date)) {
      throw new Error('PlayedAt must be a Date');
    }

    if (isNaN(value.getTime())) {
      throw new Error('PlayedAt must be a valid Date');
    }

    // Cannot be in the future
    if (value.getTime() > Date.now()) {
      throw new Error('PlayedAt cannot be in the future');
    }
  }

  public static create(value: Date): PlayedAt {
    return new PlayedAt(value);
  }

  public static now(): PlayedAt {
    return new PlayedAt(new Date());
  }
}
