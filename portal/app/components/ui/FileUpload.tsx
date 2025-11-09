import type { Child } from 'hono/jsx';

interface FileUploadProps {
  name: string;
  label?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  accept?: string;
  required?: boolean;
  className?: string;
  children?: Child;
}

export const FileUpload = ({
  name,
  label,
  title = 'ファイルをアップロード',
  description,
  buttonLabel = 'ファイルを選択',
  accept,
  required,
  className,
  children,
}: FileUploadProps) => {
  return (
    <div class={`flex flex-col ${className || ''}`}>
      {label && (
        <p class="text-text-dark dark:text-text-light text-base font-medium leading-normal pb-2">
          {label}{required && '*'}
        </p>
      )}
      <div class="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-[#323267] px-6 py-14">
        <div class="flex max-w-[480px] flex-col items-center gap-2 text-center">
          <p class="text-text-dark dark:text-text-light text-lg font-bold leading-tight tracking-[-0.015em]">
            {title}
          </p>
          {description && (
            <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
              {description}
            </p>
          )}
        </div>
        <label class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#232348] text-text-dark dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
          <span class="truncate">{buttonLabel}</span>
          <input
            type="file"
            name={name}
            accept={accept}
            required={required}
            class="hidden"
          />
        </label>
        {children}
      </div>
    </div>
  );
};
