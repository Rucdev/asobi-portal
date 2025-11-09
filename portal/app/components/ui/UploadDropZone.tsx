import type { Child } from "hono/jsx";

interface UploadDropZoneProps {
	title?: string;
	description?: string;
	className?: string;
	children?: Child;
	onDragEnter?: (e: DragEvent) => void;
	onDragLeave?: (e: DragEvent) => void;
	onDragOver?: (e: DragEvent) => void;
	onDrop?: (e: DragEvent) => void;
	isDragging?: boolean;
}

/**
 * Upload drop zone container component
 * Provides consistent styling for file upload areas with drag-and-drop support
 */
export const UploadDropZone = ({
	title,
	description,
	className,
	children,
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	isDragging,
}: UploadDropZoneProps) => {
	const baseClasses =
		"flex flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-14 transition-all";
	const borderClasses = isDragging
		? "border-primary bg-primary/5"
		: "border-gray-300 dark:border-[#323267]";
	const combinedClasses = `${baseClasses} ${borderClasses} ${className || ""}`;

	return (
		<div
			class={combinedClasses}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			{(title || description) && (
				<div class="flex max-w-[480px] flex-col items-center gap-2 text-center">
					{title && (
						<p class="text-text-dark dark:text-text-light text-lg font-bold leading-tight tracking-[-0.015em]">
							{title}
						</p>
					)}
					{description && (
						<p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
							{description}
						</p>
					)}
				</div>
			)}
			{children}
		</div>
	);
};
