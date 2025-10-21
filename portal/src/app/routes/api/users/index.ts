import { createRoute } from "honox/factory";
import { db } from "../../../../infrastructure/persistence/database";
import { DrizzleUserRepository } from "../../../../infrastructure/persistence/drizzle/repositories/DrizzleUserRepository";
import { ListUsersQuery } from "../../../../application/user/queries/ListUsersQuery";
import { ListUsersQueryHandler } from "../../../../application/user/queries/ListUsersQueryHandler";
import { RegisterPlayerCommand } from "../../../../application/user/commands/RegisterPlayerCommand";
import { RegisterPlayerCommandHandler } from "../../../../application/user/commands/RegisterPlayerCommandHandler";
import { RegisterCreatorCommand } from "../../../../application/user/commands/RegisterCreatorCommand";
import { RegisterCreatorCommandHandler } from "../../../../application/user/commands/RegisterCreatorCommandHandler";
import { UserValidator } from "../../../../presentation/validators/UserValidator";
import { ValidationError } from "../../domain/shared/DomainError";

// リポジトリのインスタンスを作成
const userRepository = new DrizzleUserRepository(db);

// GET /api/users - ユーザー一覧取得
export const GET = createRoute(async (c) => {
	try {
		const queryHandler = new ListUsersQueryHandler(userRepository);
		const query = new ListUsersQuery();
		const users = await queryHandler.execute(query);

		return c.json(users);
	} catch (error) {
		console.error("Failed to list users:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// POST /api/users - ユーザー登録
export const POST = createRoute(async (c) => {
	try {
		const body = await c.req.json();

		// バリデーション
		const validationResult = UserValidator.validateRegisterRequest(body);
		if (!validationResult.isValid) {
			return c.json({ errors: validationResult.errors }, 400);
		}

		const { name, type = "player" } = body;

		// タイプに応じたコマンドハンドラーを選択
		let user;
		if (type === "creator") {
			const commandHandler = new RegisterCreatorCommandHandler(userRepository);
			const command = new RegisterCreatorCommand(name);
			user = await commandHandler.execute(command);
		} else {
			const commandHandler = new RegisterPlayerCommandHandler(userRepository);
			const command = new RegisterPlayerCommand(name);
			user = await commandHandler.execute(command);
		}

		return c.json(user, 201);
	} catch (error) {
		if (error instanceof ValidationError) {
			return c.json({ error: error.message }, 400);
		}

		console.error("Failed to register user:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});
