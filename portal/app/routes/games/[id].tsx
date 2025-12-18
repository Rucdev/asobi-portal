import { createRoute } from "honox/factory";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BackButton from "@/app/components/BackButton";
import AdminOnly from "@/app/components/AdminOnly";
import ImageUploader from "@/app/islands/ImageUploader";
import { gamesService } from "@/lib/services/games";

export default createRoute(async (c) => {
	const id = c.req.param("id");
	const game = await gamesService.findById(id);
	const user = c.get("user");

	if (!game) {
		return c.notFound();
	}

	// バナー画像を取得
	const bannerImage = game.thumbnails?.find((t) => t.imageType === "banner");
	const bannerUrl =
		bannerImage?.detailUrl ||
		bannerImage?.iconUrl ||
		"https://placehold.co/1600x600/2d3748/cbd5e0?text=No+Banner";

	// スクリーンショット画像を取得
	const screenshots = game.thumbnails?.filter(
		(t) => t.imageType === "screenshot",
	);

	// タグを取得
	const tags = game.tags?.map((t) => t.tagValue) || [];

	// 日付をフォーマット
	const formatDate = (date: Date | null) => {
		if (!date) return "";
		return new Intl.DateTimeFormat("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	return c.render(
		<div class="min-h-screen bg-gray-900 text-gray-100">
			<title>{game.title} - ゲームポータル</title>

			<Header user={user} />

			<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<BackButton href="/games" label="ゲーム一覧に戻る" />

				<div class="max-w-4xl mx-auto space-y-8">
					{/* タイトルと基本情報 */}
					<div>
						<h1 class="text-4xl font-extrabold text-white mb-2">
							{game.title}
						</h1>
						<div class="text-gray-400 text-sm">
							作成日: {formatDate(game.createdAt)} | 更新日:{" "}
							{formatDate(game.updatedAt)}
						</div>
					</div>

					{/* バナー画像 */}
					<div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden aspect-video">
						<img
							src={bannerUrl}
							alt={game.title}
							class="w-full h-full object-cover"
						/>
					</div>

					{/* スクリーンショット */}
					{screenshots && screenshots.length > 0 && (
						<div class="space-y-4">
							<h2 class="text-2xl font-bold border-b border-gray-700 pb-2 text-white">
								スクリーンショット
							</h2>
							<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
								{screenshots.map((screenshot) => (
									<a
										key={screenshot.id}
										href={screenshot.detailUrl || screenshot.iconUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="block rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
									>
										<img
											src={screenshot.iconUrl}
											alt={screenshot.altText || "Screenshot"}
											class="w-full h-32 object-cover"
										/>
									</a>
								))}
							</div>
						</div>
					)}

					{/* ゲームの説明 */}
					<div class="space-y-4">
						<h2 class="text-2xl font-bold border-b border-gray-700 pb-2 text-white">
							ゲームについて
						</h2>
						<p class="text-gray-300 leading-relaxed whitespace-pre-wrap">
							{game.description || "説明はまだ追加されていません。"}
						</p>
					</div>

					{/* タグ */}
					{tags.length > 0 && (
						<div class="space-y-4">
							<h2 class="text-2xl font-bold border-b border-gray-700 pb-2 text-white">
								タグ
							</h2>
							<div class="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<span
										key={tag}
										class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* ゲームへのリンク */}
					<div class="pt-6 text-center">
						<a
							href={game.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
						>
							ゲームをプレイ →
						</a>
					</div>

					{/* 画像管理セクション（管理者のみ） */}
					<AdminOnly user={user}>
						<div class="mt-12 pt-8 border-t border-gray-700">
							<h2 class="text-2xl font-bold text-white mb-6">画像管理</h2>
							<ImageUploader gameId={game.id} />
						</div>
					</AdminOnly>
				</div>
			</main>

			<Footer copyrightText="GAMEPORTAL デモ" year={2025} />
		</div>,
	);
});
