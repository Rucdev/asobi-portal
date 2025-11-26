import Badge from "./Badge";

interface GameCardProps {
	id: string | number;
	title: string;
	genres: string;
	imageUrl: string;
	detailUrl?: string;
	onClick?: () => void;
}

export default function GameCard({
	id,
	title,
	genres,
	imageUrl,
	detailUrl,
	onClick,
}: GameCardProps) {
	const content = (
		<>
			<div class="relative">
				<img
					src={imageUrl}
					alt={title}
					class="w-full h-32 object-cover transition duration-300 group-hover:opacity-80"
				/>
			</div>
			<div class="p-3">
				<h3 class="text-base font-semibold truncate text-white">{title}</h3>
				<p class="text-xs text-gray-400 mb-2">{genres}</p>
				<div class="flex justify-end items-center mt-1">
					<span class="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
						詳細を見る
					</span>
				</div>
			</div>
		</>
	);

	const className =
		"group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 cursor-pointer block";

	if (detailUrl) {
		return (
			<a href={detailUrl} class={className}>
				{content}
			</a>
		);
	}

	return (
		<button type="button" class={className} onClick={onClick}>
			{content}
		</button>
	);
}
