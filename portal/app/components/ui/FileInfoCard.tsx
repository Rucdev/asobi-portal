import type { Child } from "hono/jsx";

interface FileInfoCardProps {
	fileName: string;
	fileSize: string;
	onRemove?: () => void;
	className?: string;
	children?: Child;
}

/**
 * File information display card component
 * Shows file name, size, and optional remove button
 */
export const FileInfoCard = ({
	fileName,
	fileSize,
	onRemove,
	className,
	children,
}: FileInfoCardProps) => {
	return (
		<div
			class={`flex flex-col items-center gap-2 w-full max-w-[480px] ${className || ""}`}
		>
			<div class="flex items-center justify-between w-full p-3 rounded-lg bg-gray-100 dark:bg-[#1a1a3e] border border-gray-300 dark:border-[#323267]">
				<div class="flex flex-col gap-1 flex-1 min-w-0">
					<p class="text-text-dark dark:text-text-light text-sm font-medium truncate">
						{fileName}
					</p>
					<p class="text-gray-500 dark:text-gray-400 text-xs">{fileSize}</p>
				</div>
				{children}
			</div>
		</div>
	);
};
