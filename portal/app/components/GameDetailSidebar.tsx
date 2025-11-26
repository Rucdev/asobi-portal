import Button from "./Button";

interface GameDetailSidebarProps {
	status?: string;
	statusLabel?: string;
	rating?: {
		percentage: number;
		text: string;
	};
	genre?: string;
	languages?: string;
	tags?: string[];
	onAddToLibrary?: () => void;
}

export default function GameDetailSidebar({
	status = "今すぐプレイ",
	statusLabel = "ストアで利用可能",
	rating = { percentage: 95, text: "非常に好評" },
	genre = "RPG, アドベンチャー",
	languages = "日本語, 英語, 中国語",
	tags = ["ファンタジー", "オープンワールド"],
	onAddToLibrary,
}: GameDetailSidebarProps) {
	return (
		<div class="bg-gray-800 p-6 rounded-xl shadow-lg">
			<p class="text-xl font-bold text-white mb-4">入手方法</p>

			<div class="flex items-center justify-between mb-4">
				<span class="text-base font-semibold text-gray-300">{statusLabel}</span>
				<span class="text-lg font-bold text-blue-400">{status}</span>
			</div>

			<button
				type="button"
				onClick={onAddToLibrary}
				class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition duration-200 shadow-xl mb-3"
			>
				ライブラリに追加
			</button>

			<div class="mt-6 border-t border-gray-700 pt-6 space-y-3 text-sm">
				<h3 class="text-lg font-semibold text-white">コミュニティ評価</h3>
				<p class="flex justify-between items-center">
					<span>すべてのレビュー:</span>
					<span class="text-green-400 font-semibold flex items-center">
						<svg
							class="w-4 h-4 mr-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>スター</title>
							<path d="M10 15l-5.878 3.09 1.123-6.545L.487 7.56l6.572-.955L10 1.5l2.94 6.105 6.572.955-4.758 4.636 1.123 6.545L10 15z" />
						</svg>
						{rating.text} ({rating.percentage}%)
					</span>
				</p>
				<p class="flex justify-between">
					<span>ジャンル:</span> <span class="text-gray-300">{genre}</span>
				</p>
				<p class="flex justify-between">
					<span>対応言語:</span> <span class="text-gray-300">{languages}</span>
				</p>
				<p class="flex justify-between">
					<span>タグ:</span>
					<span class="flex flex-wrap justify-end gap-1">
						{tags.map((tag) => (
							<span class="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
								{tag}
							</span>
						))}
					</span>
				</p>
			</div>
		</div>
	);
}
