import { useState } from "hono/jsx";

export default function GameFormHandler() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [url, setUrl] = useState("");
	const [tags, setTags] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		setSuccess(false);

		try {
			const tagArray = tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			const response = await fetch("/api/games", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					url,
					tags: tagArray,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "ゲームの作成に失敗しました");
			}

			const result = await response.json();
			setSuccess(true);

			// 成功したら詳細ページへリダイレクト
			setTimeout(() => {
				window.location.href = `/games/${result.id}`;
			}, 1000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "予期しないエラーが発生しました",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} class="space-y-6">
			{error && (
				<div class="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{success && (
				<div class="bg-green-900/20 border border-green-500 text-green-200 px-4 py-3 rounded">
					ゲームを作成しました！詳細ページへ移動します...
				</div>
			)}

			<div>
				<label
					htmlFor="title"
					class="block text-sm font-medium text-gray-300 mb-2"
				>
					タイトル <span class="text-red-400">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					required
					maxLength={200}
					value={title}
					onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
					class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
					placeholder="ゲームのタイトルを入力"
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					class="block text-sm font-medium text-gray-300 mb-2"
				>
					説明
				</label>
				<textarea
					id="description"
					name="description"
					rows={5}
					maxLength={5000}
					value={description}
					onInput={(e) =>
						setDescription((e.target as HTMLTextAreaElement).value)
					}
					class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
					placeholder="ゲームの説明を入力"
				/>
				<p class="text-sm text-gray-500 mt-1">
					{description.length} / 5000 文字
				</p>
			</div>

			<div>
				<label
					htmlFor="url"
					class="block text-sm font-medium text-gray-300 mb-2"
				>
					URL <span class="text-red-400">*</span>
				</label>
				<input
					type="url"
					id="url"
					name="url"
					required
					value={url}
					onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
					class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
					placeholder="https://example.com/game"
				/>
			</div>

			<div>
				<label
					htmlFor="tags"
					class="block text-sm font-medium text-gray-300 mb-2"
				>
					タグ (カンマ区切り)
				</label>
				<input
					type="text"
					id="tags"
					name="tags"
					value={tags}
					onInput={(e) => setTags((e.target as HTMLInputElement).value)}
					class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
					placeholder="アクション, RPG, マルチプレイヤー"
				/>
				<p class="text-sm text-gray-500 mt-1">
					タグをカンマで区切って入力してください（最大20個）
				</p>
			</div>

			<div class="flex gap-4">
				<button
					type="submit"
					disabled={isSubmitting}
					class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
				>
					{isSubmitting ? "作成中..." : "ゲームを作成"}
				</button>
				<a
					href="/games"
					class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-center"
				>
					キャンセル
				</a>
			</div>
		</form>
	);
}
