interface SearchInputProps {
	placeholder?: string;
	value?: string;
	onInput?: (value: string) => void;
	class?: string;
}

export default function SearchInput({
	placeholder = "ストア内を検索",
	value,
	onInput,
	class: className = "",
}: SearchInputProps) {
	return (
		<div class={`relative ${className}`}>
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onInput={(e: Event) =>
					onInput?.((e.currentTarget as HTMLInputElement).value)
				}
				class="bg-gray-700 text-gray-200 text-sm py-1.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 transition duration-300"
			/>
			<svg
				class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				title="検索"
				alt="検索"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
	);
}
