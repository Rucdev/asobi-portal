import { useState, useRef } from "hono/jsx";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { UploadDropZone } from "../components/ui/UploadDropZone";
import { FileInfoCard } from "../components/ui/FileInfoCard";

interface FileUploadHandlerProps {
	name: string;
	label?: string;
	title?: string;
	description?: string;
	buttonLabel?: string;
	accept?: string;
	required?: boolean;
	className?: string;
}

/**
 * Interactive file upload component with file name display and drag-and-drop support
 * Shows selected file information and allows file clearing
 */

const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return bytes + " B";
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
	return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function FileUploadHandler({
	name,
	label,
	title = "ファイルをアップロード",
	description,
	buttonLabel = "ファイルを選択",
	accept,
	required,
	className,
}: FileUploadHandlerProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File): boolean => {
		if (!accept) return true;

		const acceptedTypes = accept.split(",").map(t => t.trim());
		const fileType = file.type;
		const fileExtension = "." + file.name.split(".").pop();

		return acceptedTypes.some(type => {
			if (type.startsWith(".")) {
				return fileExtension.toLowerCase() === type.toLowerCase();
			}
			if (type.endsWith("/*")) {
				const baseType = type.split("/")[0];
				return fileType.startsWith(baseType + "/");
			}
			return fileType === type;
		});
	};

	const handleFileSelect = (file: File) => {
		if (validateFile(file)) {
			setSelectedFile(file);
			console.log(file);
		} else {
			alert(`ファイル形式が無効です。許可される形式: ${accept}`);
		}
	};

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();

		const target = e.currentTarget as HTMLElement;
		const relatedTarget = e.relatedTarget as HTMLElement;

		if (!target.contains(relatedTarget)) {
			setIsDragging(false);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		// ドロップ効果を明示的に設定してユーザーフィードバックを改善
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'copy';
		}
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
		console.log(files)
			handleFileSelect(files[0]);
		}
	};

	return (
		<div class={className}>
			{label && <Label text={label} required={required} className="pb-2" />}
			<UploadDropZone
				title={title}
				description={description}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				isDragging={isDragging}
			>
				{!selectedFile && (
					<>
						<label class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#232348] text-text-dark dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-[#2a2a5a] transition-colors">
							<span class="truncate">{buttonLabel}</span>
							<input
								type="file"
								name={name}
								accept={accept}
								required={required}
								hidden
								ref={fileInputRef}
								onChange={handleFileChange}
							/>
						</label>
						<p class="text-gray-500 dark:text-gray-400 text-sm">
							またはファイルをドラッグ&ドロップ
						</p>
					</>
				)}

				{selectedFile && (
					<FileInfoCard
						fileName={selectedFile.name}
						fileSize={formatFileSize(selectedFile.size)}
					>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleRemoveFile}
							className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
						>
							削除
						</Button>
					</FileInfoCard>
				)}
			</UploadDropZone>
		</div>
	);
}
