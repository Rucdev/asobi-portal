interface CategoryItem {
	href: string;
	label: string;
}

interface SidebarProps {
	categories?: CategoryItem[];
	tags?: string[];
	onTagClick?: (tag: string) => void;
}

const defaultCategories: CategoryItem[] = [
	{ href: "/games/new", label: "新作 & おすすめ" },
	{ href: "/games/special", label: "スペシャルオファー" },
	{ href: "/games/popular", label: "人気ランキング" },
	{ href: "/games/genre", label: "ジャンル別" },
	{ href: "/games/f2p", label: "無料プレイ (F2P)" },
];

const defaultTags = [
	"RPG",
	"アクション",
	"インディー",
	"ストラテジー",
	"シミュレーション",
];

export default function Sidebar({
	categories = defaultCategories,
	tags = defaultTags,
	onTagClick,
}: SidebarProps) {
	return (
		<div class="space-y-6">
			{/* カテゴリナビゲーション */}
			<div class="bg-gray-800 p-4 rounded-xl shadow-lg">
				<h2 class="text-lg font-bold mb-3 text-blue-400">カテゴリ</h2>
				<ul class="space-y-1 text-sm">
					{categories.map((category) => (
						<li>
							<a
								href={category.href}
								class="block p-2 rounded-lg hover:bg-gray-700 transition duration-150"
							>
								{category.label}
							</a>
						</li>
					))}
				</ul>
			</div>

			{/* タグフィルター */}
			<div class="bg-gray-800 p-4 rounded-xl shadow-lg">
				<h2 class="text-lg font-bold mb-3 text-blue-400">人気タグ</h2>
				<div class="flex flex-wrap gap-2 text-sm">
					{tags.map((tag) => (
						<button
							type="button"
							class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full cursor-pointer transition focus:outline-none"
							onClick={() => onTagClick?.(tag)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onTagClick?.(tag);
								}
							}}
						>
							{tag}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
