import { createRoute } from "honox/factory";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GameFormHandler from "@/app/islands/GameFormHandler";

export default createRoute((c) => {
	const user = c.get("user");

	return c.render(
		<div class="min-h-screen bg-gray-900 text-gray-100">
			<title>新しいゲームを追加 - ゲームポータル</title>
			<Header user={user} />

			<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* ヘッダー */}
				<div class="mb-8">
					<div class="flex items-center gap-4 mb-2">
						<a
							href="/games"
							class="text-blue-400 hover:text-blue-300 transition-colors"
						>
							← ゲーム一覧に戻る
						</a>
					</div>
					<h1 class="text-3xl font-bold text-white">新しいゲームを追加</h1>
					<p class="text-gray-400 mt-2">
						ゲームの情報を入力して追加してください
					</p>
				</div>

				{/* フォームカード */}
				<div class="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 border border-gray-700">
					<GameFormHandler />
				</div>

				{/* ヘルプテキスト */}
				<div class="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
					<h3 class="font-semibold text-blue-300 mb-2">ヒント:</h3>
					<ul class="text-sm text-blue-200 space-y-1 list-disc list-inside">
						<li>タイトルは最大200文字まで入力できます</li>
						<li>説明は最大5000文字まで入力できます</li>
						<li>URLは有効なURL形式で入力してください（例: https://example.com）</li>
						<li>タグは最大20個まで追加でき、カンマで区切って入力します</li>
						<li>
							画像のアップロードは、ゲーム作成後の詳細ページから行えます
						</li>
					</ul>
				</div>
			</main>

			<Footer copyrightText="GAMEPORTAL デモ" year={2025} />
		</div>,
	);
});
