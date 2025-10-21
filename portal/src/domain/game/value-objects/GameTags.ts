import { ValueObject } from '../../shared/ValueObject';

export class GameTags extends ValueObject<string[]> {
  private static readonly MAX_TAGS = 10;
  private static readonly MAX_TAG_LENGTH = 50;

  private constructor(value: string[]) {
    super(value);
  }

  protected validate(tags: string[]): void {
    if (tags.length > GameTags.MAX_TAGS) {
      throw new Error(`Cannot have more than ${GameTags.MAX_TAGS} tags`);
    }

    // Validate tag length
    for (const tag of tags) {
      if (tag.length > GameTags.MAX_TAG_LENGTH) {
        throw new Error(`Tag "${tag}" exceeds maximum length of ${GameTags.MAX_TAG_LENGTH} characters`);
      }
    }
  }

  public static create(tags: string[]): GameTags {
    const normalizedTags = tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);

    // Check for duplicates
    const uniqueTags = [...new Set(normalizedTags)];
    if (uniqueTags.length !== normalizedTags.length) {
      throw new Error('Duplicate tags are not allowed');
    }

    return new GameTags(normalizedTags);
  }

  public static createEmpty(): GameTags {
    return new GameTags([]);
  }

  public getTags(): string[] {
    return [...this.value];
  }

  public hasTag(tag: string): boolean {
    return this.value.includes(tag.trim().toLowerCase());
  }

  public count(): number {
    return this.value.length;
  }
}
