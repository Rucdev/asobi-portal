import { createRoute } from "honox/factory";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GameCard from "@/app/components/GameCard";
import { gamesService } from "@/lib/services/games";

export default createRoute(async (c) => {
	// クエリパラメータから検索条件を取得
	const page = Number(c.req.query("page")) || 1;
	const tag = c.req.query("tag");
	const search = c.req.query("search");

	// データベースからゲーム一覧を取得
	const { games } = await gamesService.list({ page, limit: 20, tag, search });

	return c.render(
		<div class="min-h-screen bg-gray-900 text-gray-100">
			<title>ゲームポータル - ゲーム一覧</title>
			<Header />
			<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div class="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
					<h2 class="text-2xl font-bold text-white">ゲーム一覧</h2>
					<a
						href="/games/new"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
					>
						+ 新しいゲームを追加
					</a>
				</div>

				{games.length === 0 ? (
					<div class="text-center py-12">
						<p class="text-gray-400 text-lg mb-4">
							まだゲームが登録されていません
						</p>
						<a
							href="/games/new"
							class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
						>
							最初のゲームを追加する
						</a>
					</div>
				) : (
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
						{games.map((game) => {
							// 最初のアイコン画像を取得
							const iconThumbnail = game.thumbnails?.find(
								(t) => t.imageType === "icon",
							);
							const imageUrl =
								iconThumbnail?.iconUrl ||
								"https://placehold.co/400x200/2d3748/cbd5e0?text=No+Image";

							// タグを文字列に変換
							const genres = game.tags?.map((t) => t.tagValue).join(", ") || "";

							return (
								<GameCard
									key={game.id}
									id={game.id}
									title={game.title}
									genres={genres}
									imageUrl={imageUrl}
									detailUrl={`/games/${game.id}`}
								/>
							);
						})}
					</div>
				)}
			</main>
			<Footer copyrightText="GAMEPORTAL デモ" year={2025} />
		</div>,
	);
});
