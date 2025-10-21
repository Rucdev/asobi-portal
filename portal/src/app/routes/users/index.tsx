import { createRoute } from "honox/factory";
import { db } from "../../../../infrastructure/persistence/database";
import { DrizzleUserRepository } from "../../../../infrastructure/persistence/drizzle/repositories/DrizzleUserRepository";
import { ListUsersQuery } from "../../../../application/user/queries/ListUsersQuery";
import { ListUsersQueryHandler } from "../../../../application/user/queries/ListUsersQueryHandler";

// リポジトリのインスタンスを作成
const userRepository = new DrizzleUserRepository(db);

export default createRoute(async (c) => {
	const queryHandler = new ListUsersQueryHandler(userRepository);
	const query = new ListUsersQuery();
	const users = await queryHandler.execute(query);

	return c.render(
		<div class="max-w-4xl mx-auto py-8 px-4">
			<title>ユーザー一覧</title>
			<div class="flex justify-between items-center mb-6">
				<h1 class="text-3xl font-bold">ユーザー一覧</h1>
				<a
					href="/users/new"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					新規登録
				</a>
			</div>

			{users.length === 0 ? (
				<div class="bg-gray-100 border border-gray-300 rounded p-8 text-center">
					<p class="text-gray-600 mb-4">
						ユーザーが登録されていません
					</p>
					<a
						href="/users/new"
						class="text-blue-500 hover:text-blue-700 font-semibold"
					>
						最初のユーザーを登録する
					</a>
				</div>
			) : (
				<div class="bg-white shadow-md rounded overflow-hidden">
					<table class="min-w-full">
						<thead class="bg-gray-100">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ID
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									名前
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									タイプ
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{users.map((user) => (
								<tr key={user.id} class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{user.id}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{user.name}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<span
											class={
												user.type === "creator"
													? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
													: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
											}
										>
											{user.type === "creator"
												? "クリエイター"
												: "プレイヤー"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<div class="mt-6">
				<a
					href="/"
					class="text-blue-500 hover:text-blue-700 font-semibold"
				>
					← ホームへ戻る
				</a>
			</div>
		</div>,
	);
});
