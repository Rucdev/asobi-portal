import { createRoute } from "honox/factory";
import { Container, PageHeader, EmptyState, Table, TableRow, TableCell, Badge, Link } from "../../components/ui";


export default createRoute(async (c) => {
	// ダミーデータ
	const users = [
		{ id: 1, name: "山田太郎", type: "player" },
		{ id: 2, name: "佐藤花子", type: "creator" },
		{ id: 3, name: "鈴木一郎", type: "player" },
	];

	return c.render(
		<Container size="md">
			<title>ユーザー一覧</title>
			<PageHeader title="ユーザー一覧" actionLabel="新規登録" actionHref="/users/new" />

			{users.length === 0 ? (
				<EmptyState
					icon="person_off"
					title="ユーザーが登録されていません"
				>
					<Link href="/users/new" variant="primary">
						最初のユーザーを登録する
					</Link>
				</EmptyState>
			) : (
				<Table
					columns={[
						{ key: 'id', label: 'ID' },
						{ key: 'name', label: '名前' },
						{ key: 'type', label: 'タイプ' },
					]}
				>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>
								<Badge variant={user.type === "creator" ? "secondary" : "success"}>
									{user.type === "creator" ? "クリエイター" : "プレイヤー"}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</Table>
			)}

			<div class="mt-6">
				<Link href="/" variant="primary">
					← ホームへ戻る
				</Link>
			</div>
		</Container>,
	);
});
