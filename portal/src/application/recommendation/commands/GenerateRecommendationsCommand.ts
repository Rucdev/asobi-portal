import { ICommand } from "../../shared/ICommand";

/**
 * GenerateRecommendationsCommand
 * 指定されたユーザーに対してレコメンデーションを生成する
 */
export class GenerateRecommendationsCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly limit: number = 10 // デフォルトで上位10件を生成
  ) {}
}
