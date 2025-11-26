import { useState, useEffect } from "hono/jsx";

type ImageType = "icon" | "screenshot" | "banner";

interface ImageUploaderProps {
	gameId: string;
}

interface UploadedImage {
	id: string;
	imageType: string;
	iconUrl: string;
	detailUrl: string | null;
	altText: string;
	displayOrder: number;
}

export default function ImageUploader({ gameId }: ImageUploaderProps) {
	const [images, setImages] = useState<UploadedImage[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageType, setImageType] = useState<ImageType>("icon");
	const [altText, setAltText] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// 初回ロード時に画像一覧を取得
	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			const response = await fetch(`/api/games/${gameId}/images`);
			if (response.ok) {
				const data = (await response.json()) as { images?: UploadedImage[] };
				setImages(data.images || []);
			}
		} catch (err) {
			console.error("Failed to fetch images:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (e: Event) => {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) {
			setSelectedFile(null);
			setPreviewUrl("");
			return;
		}

		// ファイルサイズチェック（5MB）
		if (file.size > 5 * 1024 * 1024) {
			setError("ファイルサイズは5MB以下にしてください");
			setSelectedFile(null);
			setPreviewUrl("");
			return;
		}

		// ファイルタイプチェック
		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		if (!allowedTypes.includes(file.type)) {
			setError("JPEG、PNG、WebP、GIF形式の画像のみアップロード可能です");
			setSelectedFile(null);
			setPreviewUrl("");
			return;
		}

		setSelectedFile(file);
		setError("");

		// プレビュー表示
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewUrl(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleUpload = async (e: Event) => {
		e.preventDefault();

		if (!selectedFile) {
			setError("ファイルを選択してください");
			return;
		}

		setIsUploading(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("imageType", imageType);
			formData.append("altText", altText);

			const response = await fetch(`/api/games/${gameId}/images`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const data = (await response.json()) as { error?: string };
				throw new Error(data.error || "アップロードに失敗しました");
			}

			// 成功したらリセット
			setSelectedFile(null);
			setAltText("");
			setPreviewUrl("");
			await fetchImages();

			// ファイル入力をリセット
			const fileInput = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			if (fileInput) fileInput.value = "";
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "予期しないエラーが発生しました",
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handleDelete = async (imageId: string) => {
		if (!confirm("この画像を削除しますか？")) return;

		try {
			const response = await fetch(`/api/games/${gameId}/images/${imageId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("削除に失敗しました");
			}

			await fetchImages();
		} catch (err) {
			alert(err instanceof Error ? err.message : "削除に失敗しました");
		}
	};

	const getImageTypeLabel = (type: string) => {
		switch (type) {
			case "icon":
				return "アイコン";
			case "screenshot":
				return "スクリーンショット";
			case "banner":
				return "バナー";
			default:
				return type;
		}
	};

	return (
		<div class="space-y-6">
			{/* アップロードフォーム */}
			<div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
				<h3 class="text-lg font-semibold text-white mb-4">
					画像をアップロード
				</h3>

				<form onSubmit={handleUpload} class="space-y-4">
					{error && (
						<div class="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded">
							{error}
						</div>
					)}

					<div>
						<label class="block text-sm font-medium text-gray-300 mb-2">
							画像タイプ
						</label>
						<select
							value={imageType}
							onChange={(e) =>
								setImageType((e.target as HTMLSelectElement).value as ImageType)
							}
							class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
						>
							<option value="icon">アイコン (正方形推奨)</option>
							<option value="screenshot">スクリーンショット</option>
							<option value="banner">バナー (横長推奨)</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="image-file"
							class="block text-sm font-medium text-gray-300 mb-2"
						>
							画像ファイル
						</label>
						<input
							id="image-file"
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							onChange={handleFileChange}
							class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
						/>
						<p class="text-sm text-gray-500 mt-1">
							JPEG、PNG、WebP、GIF形式（最大5MB）
						</p>
					</div>

					{previewUrl && (
						<div>
							<img
								id="preview-image"
								src={previewUrl}
								alt="Preview"
								class="max-w-xs rounded border border-gray-600"
							/>
						</div>
					)}

					<div>
						<label
							htmlFor="alt-text-input"
							class="block text-sm font-medium text-gray-300 mb-2"
						>
							代替テキスト（アクセシビリティ用）
						</label>
						<input
							id="alt-text-input"
							type="text"
							value={altText}
							onInput={(e) => setAltText((e.target as HTMLInputElement).value)}
							placeholder="画像の説明"
							class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
						/>
					</div>

					<button
						type="submit"
						disabled={!selectedFile || isUploading}
						class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
					>
						{isUploading ? "アップロード中..." : "アップロード"}
					</button>
				</form>
			</div>

			{/* 画像一覧 */}
			<div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
				<h3 class="text-lg font-semibold text-white mb-4">
					アップロード済み画像
				</h3>

				{isLoading ? (
					<p class="text-gray-400">読み込み中...</p>
				) : images.length === 0 ? (
					<p class="text-gray-400">まだ画像がアップロードされていません</p>
				) : (
					<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{images.map((image) => (
							<div
								key={image.id}
								class="bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
							>
								<img
									src={image.iconUrl}
									alt={image.altText || "Game image"}
									class="w-full h-32 object-cover"
								/>
								<div class="p-3">
									<p class="text-xs text-blue-400 font-medium mb-1">
										{getImageTypeLabel(image.imageType)}
									</p>
									{image.altText && (
										<p class="text-xs text-gray-400 mb-2 line-clamp-2">
											{image.altText}
										</p>
									)}
									<button
										type="button"
										onClick={() => handleDelete(image.id)}
										class="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
									>
										削除
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
