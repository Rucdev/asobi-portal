/**
 * ユーザーDTO（Data Transfer Object）
 * アプリケーション層からプレゼンテーション層へのデータ転送用
 */
export interface UserDto {
	id: number;
	name: string;
	type: "player" | "creator";
}
