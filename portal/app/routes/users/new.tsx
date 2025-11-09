import { createRoute } from "honox/factory";
import UserFormHandler from "../../islands/UserFormHandler";
import { Container, PageHeader, FormCard, Input, Select, Button, Link } from "../../components/ui";

export default createRoute((c) => {
	return c.render(
		<Container size="sm">
			<title>ユーザー登録</title>
			<PageHeader title="ユーザー登録" />
			<FormCard>
				<form id="user-form">
					<Input
						id="name"
						name="name"
						label="名前"
						type="text"
						placeholder="名前を入力"
						required
						className="mb-4"
					/>
					<Select
						id="type"
						name="type"
						label="ユーザータイプ"
						options={[
							{ value: "player", label: "プレイヤー" },
							{ value: "creator", label: "クリエイター" },
						]}
						className="mb-6"
					/>
					<div class="flex items-center justify-between">
						<Button type="submit">
							登録
						</Button>
						<Link href="/users" variant="primary" size="sm">
							ユーザー一覧へ
						</Link>
					</div>
				</form>
			</FormCard>
			<div id="message" class="hidden mt-4 p-4 rounded"></div>
			<UserFormHandler />
		</Container>,
	);
});
